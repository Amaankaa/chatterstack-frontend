import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Message } from '@/types';

export const useChatWebSocket = (
  activeRoomId: string | null, 
  onMessageReceived: (msg: Message) => void,
  onTyping?: (username: string, isTyping: boolean) => void,
  onMessageDeleted?: (msgId: string) => void
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
    // Only connect if we have a token and a room
    if (!token || !activeRoomId) {
      setIsConnected(false);
      return;
    }

    // Close existing connection if switching rooms
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Connect directly to ALB (ws) as per backend requirements (HTTP-only ALB)
    const wssBase = 'ws://chatterstack-alb-730649082.us-east-1.elb.amazonaws.com';
    const qs = new URLSearchParams({
      room_id: activeRoomId,
      access_token: token,
    });
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
  }, [activeRoomId, token, onMessageReceived, onTyping, onMessageDeleted, retryCount]); // Added onTyping to deps if stable, but usually functions aren't stable unless useCallback. 
  // We will assume onTyping is stable or ignore the warning for now to avoid infinite loops if user forgets useCallback.

  return { isConnected, sendJsonMessage };
};