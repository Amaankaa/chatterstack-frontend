import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { getRooms, createRoom, addRoomMember, createDirectRoom, deleteRoom, getRoomMembers } from '@/api/rooms';
import { searchMessages, getRoomMessages, sendMessage, editMessage, deleteMessage } from '@/api/messages';
import { getUserByEmail, getUserById } from '@/api/auth';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';
import { Room, Message } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';

// Feature Components
import { ChatSidebar } from '@/components/features/chat/ChatSidebar';
import { ChatHeader } from '@/components/features/chat/ChatHeader';
import { MessageList } from '@/components/features/chat/MessageList';
import { ChatInput } from '@/components/features/chat/ChatInput';

export default function Chat() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scroll
  
  // --- State ---
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modal States
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  
  // DM States
  const [isCreateDMOpen, setIsCreateDMOpen] = useState(false);
  const [dmEmail, setDmEmail] = useState("");
  const [dmMap, setDmMap] = useState<Map<string, string>>(new Map()); // RoomID -> Peer Username
  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState(false);

  // Search State
  const [roomQuery, setRoomQuery] = useState("");
  const [msgQuery, setMsgQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchingMsg, setIsSearchingMsg] = useState(false);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isLocalTyping, setIsLocalTyping] = useState(false);
  // Unread counts per room
  const [unreadByRoom, setUnreadByRoom] = useState<Map<string, number>>(new Map());

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const shouldScrollToBottomRef = useRef(true);

  // Cache for usernames to avoid repeated API calls
  const userCache = useRef<Map<string, string>>(new Map());
  const activeRoomRef = useRef<Room | null>(null);

  // --- 1. Initial Load & Persistence ---
  useEffect(() => {
    const init = async () => {
      try {
        // Fetch ALL rooms (no query) to allow client-side filtering
        const roomList = await getRooms(); 
        setRooms(roomList);

        // Resolve DM Names
        const dmRooms = roomList.filter(r => !r.is_group);
        const newDmMap = new Map<string, string>(dmMap); // Preserve existing
        
        if (dmRooms.length > 0 && user?.id) {
           const promises = dmRooms.map(async (room) => {
              // Check cache or existing map first
              if (newDmMap.has(room.id)) return;

              try {
                let peerId: string | undefined;

                // STRATEGY 1: Parse from Room Name (dm:ID1:ID2)
                // This is faster and more reliable than fetching members if the naming convention holds
                const nameParts = room.name.split(':');
                if (nameParts.length === 3 && nameParts[0] === 'dm') {
                    const id1 = nameParts[1];
                    const id2 = nameParts[2];
                    if (String(id1) === String(user.id)) peerId = id2;
                    else if (String(id2) === String(user.id)) peerId = id1;
                }

                // STRATEGY 2: Fetch members (Fallback)
                if (!peerId) {
                    const members = await getRoomMembers(room.id);
                    const peerMember = members.find((m: any) => String(m.user_id) !== String(user.id));
                    if (peerMember) peerId = peerMember.user_id;
                }
                
                if (!peerId) {
                   newDmMap.set(room.id, "Unknown (No Peer)");
                   return;
                }

                // 3. Check cache for username
                if (userCache.current.has(peerId)) {
                  newDmMap.set(room.id, userCache.current.get(peerId)!);
                  return;
                }

                // 4. Fetch User Details
                const u = await getUserById(peerId);
                if (u?.username) {
                  userCache.current.set(peerId, u.username);
                  newDmMap.set(room.id, u.username);
                } else {
                   newDmMap.set(room.id, "Unknown User");
                }
              } catch (e) {
                console.error("Failed to resolve DM peer for room", room.id, e);
                newDmMap.set(room.id, "Unknown User");
              }
           });
           await Promise.all(promises);
           setDmMap(newDmMap);
        }

        // PERSISTENCE FIX: Check if we have a saved room ID from before refresh
        const savedRoomId = localStorage.getItem('lastActiveRoomId');
        if (savedRoomId && roomList.length > 0) {
          const savedRoom = roomList.find(r => r.id === savedRoomId);
          if (savedRoom) setActiveRoom(savedRoom);
        }
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      }
    };
    if (user?.id) init();
  }, [user?.id]); // Removed roomQuery to prevent re-fetching on type

  // Derived state for filtered rooms
  const filteredRooms = rooms.filter(room => {
    if (!roomQuery.trim()) return true;
    const query = roomQuery.toLowerCase();
    if (room.is_group) {
      // Safety check: room.name might be undefined/null from backend
      return (room.name || "").toLowerCase().includes(query);
    } else {
      const name = dmMap.get(room.id);
      return name ? name.toLowerCase().includes(query) : false;
    }
  });

  // Helper to normalize messages and fetch missing usernames
  const processMessages = async (rawMessages: Message[]) => {
    // 1. Normalize messages
    const normalized = rawMessages.map((msg: any) => ({
      ...msg,
      user_id: msg.user_id || msg.sender_id, 
      username: msg.username || msg.sender_username || 'Unknown',
    }));

    // 2. Identify missing usernames
    const unknownUserIds = new Set<string>();
    normalized.forEach(msg => {
      if (msg.username === 'Unknown' && msg.user_id) {
        unknownUserIds.add(msg.user_id);
      }
    });

    // 3. Fetch missing users in parallel
    if (unknownUserIds.size > 0) {
      const fetchPromises = Array.from(unknownUserIds).map(async (uid) => {
        // Check cache first
        if (userCache.current.has(uid)) return { uid, username: userCache.current.get(uid) };
        
        try {
          const userDetails = await getUserById(uid);
          if (userDetails?.username) {
            userCache.current.set(uid, userDetails.username);
            return { uid, username: userDetails.username };
          }
        } catch (e) {
          console.error(`Failed to fetch user ${uid}`, e);
        }
        return null;
      });

      const resolvedUsers = await Promise.all(fetchPromises);
      
      // 4. Update messages with resolved usernames
      resolvedUsers.forEach(u => {
        if (u) {
          normalized.forEach(msg => {
            if (msg.user_id === u.uid) msg.username = u.username!;
          });
        }
      });
    }
    return normalized;
  };

  // --- 2. Save Active Room on Change ---
  useEffect(() => {
    activeRoomRef.current = activeRoom;
    
    if (activeRoom) {
      localStorage.setItem('lastActiveRoomId', activeRoom.id);
      // Reset unread count for the active room when opened
      setUnreadByRoom(prev => {
        const next = new Map(prev);
        next.set(activeRoom.id, 0);
        return next;
      });
      
      // Load history when room changes
      const loadHistory = async () => {
        try {
          setCurrentPage(1);
          setHasMore(true);

          const history = await getRoomMessages(activeRoom.id, { page: 1, limit: 50 });
          const processed = await processMessages(history);
          
          if (history.length < 50) setHasMore(false);

          // Ensure chronological order (Oldest -> Newest)
          shouldScrollToBottomRef.current = true;
          setMessages(processed.reverse()); 
        } catch (error) {
          console.error("Failed to load history", error);
        }
      };
      loadHistory();
    }
  }, [activeRoom]);

  // --- 3. Auto-scroll to bottom ---
  useEffect(() => {
    if (shouldScrollToBottomRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // --- 4. WebSocket Integration ---
  // FIX: Use useCallback to prevent infinite reconnection loop
  const handleIncomingMessage = useCallback(async (incomingMsg: Message) => {
    const currentActiveRoom = activeRoomRef.current;

    // If message belongs to a different room, increment unread count and exit
    if (!currentActiveRoom || incomingMsg.room_id !== currentActiveRoom.id) {
      setUnreadByRoom(prev => {
        const next = new Map(prev);
        const current = next.get(incomingMsg.room_id) || 0;
        next.set(incomingMsg.room_id, current + 1);
        return next;
      });
      return;
    }

    let finalMsg = { ...incomingMsg };

    // If username is missing or Unknown, try to resolve it
    if ((!finalMsg.username || finalMsg.username === 'Unknown') && finalMsg.user_id) {
      try {
        // Check cache first
        if (userCache.current.has(finalMsg.user_id)) {
          finalMsg.username = userCache.current.get(finalMsg.user_id)!;
        } else {
          // Fetch from API
          const userDetails = await getUserById(finalMsg.user_id);
          if (userDetails && userDetails.username) {
            finalMsg.username = userDetails.username;
            userCache.current.set(finalMsg.user_id, userDetails.username);
          }
        }
      } catch (err) {
        console.error("Failed to resolve username for msg", finalMsg.id, err);
      }
    }

    // Prevent duplicates
    setMessages((prev) => {
      if (prev.find(m => m.id === finalMsg.id)) return prev;
      shouldScrollToBottomRef.current = true;
      return [...prev, finalMsg]; // Append to bottom
    });
  }, []);

  const handleTyping = useCallback((username: string, isTyping: boolean) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (isTyping) newSet.add(username);
      else newSet.delete(username);
      return newSet;
    });
  }, []);

  const handleMessageDeleted = useCallback((msgId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== msgId));
  }, []);

  const handleRoomAdded = useCallback((newRoom: Room) => {
    setRooms(prev => {
        if (prev.find(r => r.id === newRoom.id)) return prev;
        return [newRoom, ...prev];
    });
    toast({ title: "New Channel", description: `You were added to #${newRoom.name || 'a new room'}` });
  }, [toast]);

  // Pass all room IDs to subscribe to all of them
  const roomIds = rooms.map(r => r.id);
  const { isConnected, sendJsonMessage } = useChatWebSocket(
    roomIds, 
    handleIncomingMessage, 
    handleTyping, 
    handleMessageDeleted,
    handleRoomAdded
  );

  const handleUserTyping = (isTyping: boolean) => {
    if (!activeRoom) return;
    setIsLocalTyping(isTyping);

    const payload = { 
        event: isTyping ? 'typing_start' : 'typing_stop', 
        data: { room_id: activeRoom.id } 
    };

    sendJsonMessage(payload);
  };

  // --- Handlers ---

  const handleLogout = () => {
    localStorage.removeItem('lastActiveRoomId'); // Clear session state
    logout();
    navigate('/login');
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || !user?.id) return;
    try {
      const room = await createRoom(newRoomName, user.id);
      setRooms((prev) => [room, ...prev]);
      setActiveRoom(room);
      setIsCreateRoomOpen(false);
      setNewRoomName("");
      toast({ title: "Room Created", description: `#${room.name} is ready.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create room." });
    }
  };

  const handleAddMember = async () => {
    if (!inviteEmail.trim() || !activeRoom) return;
    setIsInviting(true);
    try {
      const userToAdd = await getUserByEmail(inviteEmail);
      if (!userToAdd || !userToAdd.id) throw new Error("User not found");
      await addRoomMember(activeRoom.id, userToAdd.id);
      toast({ title: "Success", description: `${userToAdd.username} added.` });
      setIsAddMemberOpen(false);
      setInviteEmail("");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add member." });
    } finally {
      setIsInviting(false);
    }
  };

  const handleCreateDM = async () => {
    if (!dmEmail.trim()) return;
    setIsInviting(true);
    try {
      const peer = await getUserByEmail(dmEmail);
      if (!peer || !peer.id) throw new Error("User not found");
      
      const room = await createDirectRoom(peer.id);
      
      // Update local state
      setRooms(prev => {
        if (prev.find(r => r.id === room.id)) return prev;
        return [room, ...prev];
      });
      
      // Update DM Map
      setDmMap(prev => new Map(prev).set(room.id, peer.username));
      
      setActiveRoom(room);
      setIsCreateDMOpen(false);
      setDmEmail("");
      toast({ title: "Direct Message", description: `Chat started with ${peer.username}` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to start DM." });
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!activeRoom) return;
    try {
      await deleteRoom(activeRoom.id);
      setRooms(prev => prev.filter(r => r.id !== activeRoom.id));
      setActiveRoom(null);
      setIsDeleteRoomOpen(false);
      toast({ title: "Room Deleted", description: "The room has been permanently removed." });
    } catch (error) {
      console.error("Failed to delete room", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete room." });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeRoom) return;

    const content = inputText;
    setInputText(""); // Clear UI immediately

    // Optimistic UI Update (Instant feedback)
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      content: content,
      room_id: activeRoom.id,
      user_id: user?.id || '',
      username: user?.username || '',
      created_at: new Date().toISOString(),
      type: 'text'
    };
    
    // Add temp message to bottom
    shouldScrollToBottomRef.current = true;
    setMessages(prev => [...prev, tempMsg]);

    try {
      const sentMsg = await sendMessage(activeRoom.id, content);
      // Replace temp message with real message from backend
      // We also ensure the username is set correctly (if backend returns it, otherwise keep local)
      const finalMsg = {
        ...sentMsg,
        user_id: sentMsg.user_id || (sentMsg as any).sender_id,
        username: sentMsg.username || user?.username || 'Unknown'
      };
      
      setMessages(prev => {
        // Check if the real message arrived via WS while we were waiting
        const exists = prev.find(m => m.id === sentMsg.id);
        if (exists) {
            // It arrived via WS. We just need to remove the temporary optimistic message.
            return prev.filter(m => m.id !== tempMsg.id);
        }
        // It hasn't arrived yet (or we beat the WS). Replace temp with real.
        return prev.map(m => m.id === tempMsg.id ? finalMsg : m);
      });
    } catch (error) {
      console.error("Failed to send", error);
      toast({ variant: "destructive", title: "Error", description: "Message failed to send." });
      // Optionally remove the temp message on failure
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
  };

  const handleJumpToMessage = async (messageId: string) => {
    setIsSearchOpen(false);
    
    // Check if message is already loaded
    const existingMsg = messages.find(m => m.id === messageId);
    
    if (existingMsg) {
      // Allow time for popover to close
      setTimeout(() => {
        const element = document.getElementById(`msg-${messageId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedMsgId(messageId);
          setTimeout(() => setHighlightedMsgId(null), 2000);
        }
      }, 100);
    } else {
      // Fetch context around the message
      if (!activeRoom) return;
      
      try {
        toast({ description: "Jumping to message history..." });
        
        const contextMessages = await getRoomMessages(activeRoom.id, { around_message_id: messageId, limit: 50 });
        const processed = await processMessages(contextMessages);
        
        // Replace current messages with the context window
        setMessages(processed);
        
        // After state update, scroll to message
        setTimeout(() => {
          const element = document.getElementById(`msg-${messageId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedMsgId(messageId);
            setTimeout(() => setHighlightedMsgId(null), 2000);
          } else {
            toast({ variant: "destructive", description: "Could not locate message in history." });
          }
        }, 100);
        
      } catch (error) {
        console.error("Failed to jump to message", error);
        toast({ variant: "destructive", description: "Failed to load message context." });
      }
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!activeRoom) return;
    try {
      const updated = await editMessage(activeRoom.id, messageId, newContent);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: newContent, updated_at: updated.updated_at } : m));
      toast({ description: "Message updated" });
    } catch (error) {
      console.error("Failed to edit message", error);
      toast({ variant: "destructive", description: "Failed to update message" });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeRoom) return;
    try {
      await deleteMessage(activeRoom.id, messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      toast({ description: "Message deleted" });
    } catch (error) {
      console.error("Failed to delete message", error);
      toast({ variant: "destructive", description: "Failed to delete message" });
    }
  };

  // Search Messages Logic
  useEffect(() => {
    if (!msgQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setIsSearchingMsg(true);
      try {
        const results = await searchMessages(msgQuery, activeRoom?.id);
        
        // Normalize and fetch usernames for search results
        const normalizedResults = (results || []).map((msg: any) => ({
            ...msg,
            user_id: msg.user_id || msg.sender_id,
            username: msg.username || msg.sender_username || 'Unknown',
        }));

        // Identify missing usernames
        const unknownUserIds = new Set<string>();
        normalizedResults.forEach((msg: any) => {
            if (msg.username === 'Unknown' && msg.user_id) {
                unknownUserIds.add(msg.user_id);
            }
        });

        // Fetch missing users
        if (unknownUserIds.size > 0) {
             const fetchPromises = Array.from(unknownUserIds).map(async (uid) => {
              if (userCache.current.has(uid)) return { uid, username: userCache.current.get(uid) };
              try {
                const userDetails = await getUserById(uid);
                if (userDetails?.username) {
                  userCache.current.set(uid, userDetails.username);
                  return { uid, username: userDetails.username };
                }
              } catch (e) {
                console.error(`Failed to fetch user ${uid}`, e);
              }
              return null;
            });

            const resolvedUsers = await Promise.all(fetchPromises);
            resolvedUsers.forEach(u => {
              if (u) {
                normalizedResults.forEach((msg: any) => {
                  if (msg.user_id === u.uid) msg.username = u.username!;
                });
              }
            });
        }

        setSearchResults(normalizedResults);
      } catch (error) {
        console.error("Search failed", error);
      } finally { 
        setIsSearchingMsg(false);
      }
    }, 1000); // Increased debounce to 1000ms
    return () => clearTimeout(timer);
  }, [msgQuery, activeRoom]);

  const handleLoadMore = async () => {
    if (!activeRoom || !hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    shouldScrollToBottomRef.current = false; // Don't scroll to bottom when loading older messages
    const nextPage = currentPage + 1;
    
    try {
      const history = await getRoomMessages(activeRoom.id, { page: nextPage, limit: 50 });
      
      if (history.length < 50) setHasMore(false);
      
      const processed = await processMessages(history);
      const olderMessages = processed.reverse();
      
      setMessages(prev => [...olderMessages, ...prev]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Failed to load more messages", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      <ChatSidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        roomQuery={roomQuery}
        setRoomQuery={setRoomQuery}
        filteredRooms={filteredRooms}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        isCreateRoomOpen={isCreateRoomOpen}
        setIsCreateRoomOpen={setIsCreateRoomOpen}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        handleCreateRoom={handleCreateRoom}
        isCreateDMOpen={isCreateDMOpen}
        setIsCreateDMOpen={setIsCreateDMOpen}
        dmEmail={dmEmail}
        setDmEmail={setDmEmail}
        handleCreateDM={handleCreateDM}
        isInviting={isInviting}
        dmMap={dmMap}
        unreadByRoom={unreadByRoom}
        user={user}
        handleLogout={handleLogout}
      />

      {/* --- Main Chat Area --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        <ChatHeader 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeRoom={activeRoom}
          dmMap={dmMap}
          isConnected={isConnected}
          isAddMemberOpen={isAddMemberOpen}
          setIsAddMemberOpen={setIsAddMemberOpen}
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          handleAddMember={handleAddMember}
          isInviting={isInviting}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          msgQuery={msgQuery}
          setMsgQuery={setMsgQuery}
          isSearchingMsg={isSearchingMsg}
          searchResults={searchResults}
          handleJumpToMessage={handleJumpToMessage}
          user={user}
          isDeleteRoomOpen={isDeleteRoomOpen}
          setIsDeleteRoomOpen={setIsDeleteRoomOpen}
          handleDeleteRoom={handleDeleteRoom}
          typingUsers={typingUsers}
          isLocalTyping={isLocalTyping}
        />

        {/* Chat Content */}
        {activeRoom ? (
          <>
            <MessageList 
              activeRoom={activeRoom}
              dmMap={dmMap}
              messages={messages}
              user={user}
              highlightedMsgId={highlightedMsgId}
              messagesEndRef={messagesEndRef}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
              typingUsers={typingUsers}
              isLocalTyping={isLocalTyping}
            />

            <ChatInput 
              handleSendMessage={handleSendMessage}
              inputText={inputText}
              setInputText={setInputText}
              activeRoom={activeRoom}
              dmMap={dmMap}
              onTyping={handleUserTyping}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950/50">
             <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 animate-pulse"><MessageSquare className="w-10 h-10 text-slate-700" /></div>
             <h2 className="text-2xl font-bold text-slate-200 mb-2">No Channel Selected</h2>
             <p className="text-slate-500 max-w-md">Select a channel to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
}