import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Message, Room } from '@/types';

export const useChatWebSocket = (
  roomIds: string[], 
  onMessageReceived: (msg: Message) => void,
  onTyping?: (username: string, isTyping: boolean) => void,
  onMessageDeleted?: (msgId: string) => void,
  onRoomAdded?: (room: Room) => void
) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuthStore();
  const [retryCount, setRetryCount] = useState(0);

  const sendJsonMessage = (data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  useEffect(() => {
    // Only connect if we have a token and at least one room (backend requirement)
    if (!token || roomIds.length === 0) {
      setIsConnected(false);
      return;
    }

    // Close existing connection if room list changes (to resubscribe)
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Connect directly to CloudFront (wss) as per backend requirements (Secure WS)
    const wssBase = 'wss://d1176qoi9kdya5.cloudfront.net';
    const qs = new URLSearchParams();
    // Backend expects 'access_token' query parameter for CloudFront WS
    qs.append('access_token', token);
    roomIds.forEach(id => qs.append('room_id', id));

    const url = `${wssBase}/ws?${qs.toString()}`;
    
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      return;
    }
    
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        // Handle "receive_message" event from your docs
        if (payload.event === 'receive_message' && payload.data) {
          const incomingMsg: Message = {
             ...payload.data,
             // Backend sends 'sender_id', Frontend uses 'user_id'. Map it.
             user_id: payload.data.sender_id || payload.data.user_id, 
             // Backend might send 'sender_username', Frontend uses 'username'. Map it.
             username: payload.data.username || payload.data.sender_username || 'Unknown',
             type: 'text'
          };
          onMessageReceived(incomingMsg);
        } else if (payload.event === 'typing_start' && onTyping) {
            const username = payload.data?.username || payload.username;
            if (username) onTyping(username, true);
        } else if (payload.event === 'typing_stop' && onTyping) {
            const username = payload.data?.username || payload.username;
            if (username) onTyping(username, false);
        } else if (payload.event === 'message.deleted' && onMessageDeleted && payload.data?.id) {
            onMessageDeleted(payload.data.id);
        } else if ((payload.event === 'room_added' || payload.event === 'added_to_room') && onRoomAdded && payload.data) {
            // Handle real-time room addition
            onRoomAdded(payload.data);
        }
      } catch (err) {
        console.error("WS JSON Parse Error", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WS Error", error);
      // Don't set isConnected(false) here, wait for onclose
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      
      // Auto-reconnect if it wasn't a clean close
      if (event.code !== 1000) {
        setTimeout(() => {
          setRetryCount(c => c + 1);
        }, 3000);
      }
    };

    // Cleanup on unmount or room change
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, "Component unmounting or room changing");
      }
    };
  }, [JSON.stringify(roomIds), token, onMessageReceived, onTyping, onMessageDeleted, onRoomAdded, retryCount]); 

  return { isConnected, sendJsonMessage };
};