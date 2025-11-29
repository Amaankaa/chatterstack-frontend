import { useState, useRef, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Hash, MoreVertical, Pencil, Trash2, X, Check } from 'lucide-react';
import { Room, User, Message } from '@/types';
import { format, isSameDay } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageListProps {
  activeRoom: Room | null;
  dmMap: Map<string, string>;
  messages: Message[];
  user: User | null;
  highlightedMsgId: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onEditMessage: (id: string, content: string) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  typingUsers?: Set<string>;
  isLocalTyping?: boolean;
}

export function MessageList({ activeRoom, dmMap, messages, user, highlightedMsgId, messagesEndRef, onEditMessage, onDeleteMessage, onLoadMore, hasMore, isLoadingMore, typingUsers }: MessageListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  
  const viewportRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const prevMessagesLengthRef = useRef<number>(0);

  // Handle Scroll to load more
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop < 50 && hasMore && !isLoadingMore && onLoadMore) {
      // Save scroll height before loading
      prevScrollHeightRef.current = target.scrollHeight;
      prevMessagesLengthRef.current = messages.length;
      onLoadMore();
    }
  };

  // Restore scroll position after loading more
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    // If messages length increased (prepended), adjust scroll
    if (messages.length > prevMessagesLengthRef.current && prevScrollHeightRef.current > 0) {
        const newScrollHeight = viewport.scrollHeight;
        const diff = newScrollHeight - prevScrollHeightRef.current;
        viewport.scrollTop = diff; // Jump to where we were
        prevScrollHeightRef.current = 0; // Reset
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const startEditing = (msg: Message) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = async (id: string) => {
    if (editContent.trim()) {
      await onEditMessage(id, editContent);
      setEditingId(null);
    }
  };

  if (!activeRoom) return null;

  return (
    <ScrollArea 
        className="flex-1 p-4" 
        onScroll={handleScroll} 
        viewportRef={viewportRef}
    >
      <div className="space-y-6 pb-4">
        {/* Show loading spinner at top if loading more */}
        {isLoadingMore && (
             <div className="flex justify-center py-2">
                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
             </div>
        )}

        {/* Welcome Message */}
        {!hasMore && (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 opacity-50">
          {activeRoom.is_group ? (
            <>
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-2"><Hash className="w-8 h-8 text-indigo-500" /></div>
              <h3 className="text-lg font-medium text-slate-300">Welcome to #{activeRoom.name}</h3>
            </>
          ) : (
            <>
              <Avatar className="w-16 h-16 border-2 border-slate-800 mb-2">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dmMap.get(activeRoom.id) || 'User'}`} />
              </Avatar>
              <h3 className="text-lg font-medium text-slate-300">Chat with {dmMap.get(activeRoom.id) || 'User'}</h3>
            </>
          )}
        </div>
        )}

        {/* MESSAGES LIST */}
        {messages.map((msg, index) => {
          const msgUserId = msg.user_id || (msg as any).sender_id;
          const isMe = String(msgUserId) === String(user?.id);
          const isEditing = editingId === msg.id;
          
          // Date Separator Logic
          const showDateSeparator = index === 0 || !isSameDay(new Date(messages[index - 1].created_at), new Date(msg.created_at));

          return (
            <div key={msg.id}>
              {showDateSeparator && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-slate-800 text-slate-400 text-xs px-3 py-1 rounded-full">
                    {format(new Date(msg.created_at), 'MMMM d, yyyy')}
                  </div>
                </div>
              )}
              
              <div 
                id={`msg-${msg.id}`}
                className={cn(
                  "flex gap-3 max-w-3xl group transition-colors duration-500 p-2 rounded-lg relative", 
                  isMe ? "ml-auto flex-row-reverse" : "",
                  highlightedMsgId === msg.id ? "bg-indigo-500/20" : ""
                )}
              >
                <Avatar className="h-8 w-8 mt-1"><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.username}`} /><AvatarFallback>{msg.username?.slice(0,2)}</AvatarFallback></Avatar>
                
                <div className={cn("flex flex-col max-w-full", isMe ? "items-end" : "items-start")}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-300">{msg.username}</span>
                    <span className="text-xs text-slate-600">{format(new Date(msg.created_at), 'h:mm a')}</span>
                    {msg.updated_at && msg.updated_at !== msg.created_at && <span className="text-[10px] text-slate-600 italic">(edited)</span>}
                  </div>
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                        <Input 
                            value={editContent} 
                            onChange={(e) => setEditContent(e.target.value)}
                            className="h-8 bg-slate-900 border-slate-700 text-slate-200 min-w-[200px]"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(msg.id);
                                if (e.key === 'Escape') cancelEditing();
                            }}
                        />
                        <Button size="icon" variant="ghost" onClick={() => saveEdit(msg.id)} className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-slate-800"><Check className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={cancelEditing} className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-slate-800"><X className="w-4 h-4" /></Button>
                    </div>
                  ) : (
                    <div className={cn("px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm group relative", 
                      isMe ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700")}>
                      {msg.content}
                      
                      {/* Actions Dropdown (Only for Me) */}
                      {isMe && (
                        <div className="absolute top-0 -left-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white"><MoreVertical className="w-3 h-3" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                                    <DropdownMenuItem onClick={() => startEditing(msg)} className="hover:bg-slate-800 cursor-pointer"><Pencil className="w-3 h-3 mr-2" /> Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onDeleteMessage(msg.id)} className="hover:bg-slate-800 text-red-500 cursor-pointer"><Trash2 className="w-3 h-3 mr-2" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/* Typing indicator (bottom of message list, above input) */}
        {typingUsers && typingUsers.size > 0 && (
          (() => {
            const others = Array.from(typingUsers).filter(u => String(u) !== String(user?.username));
            if (others.length === 0) return null;
            const verb = others.length > 1 ? 'are' : 'is';
            return (
              <div className="flex justify-start mt-2">
                <div className="inline-flex items-center bg-slate-800 px-3 py-2 rounded-2xl text-sm text-slate-200 shadow-sm">
                  <div className="flex items-center space-x-1 mr-2">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                  <div className="text-xs text-slate-300">{others.join(', ')} {verb} typing...</div>
                </div>
              </div>
            );
          })()
        )}

        {/* INVISIBLE ELEMENT TO SCROLL TO */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}