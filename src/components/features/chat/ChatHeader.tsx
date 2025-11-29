import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Hash, Search, Menu, UserPlus, Loader2, Trash2 } from 'lucide-react';
import { Room, User, Message } from '@/types';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeRoom: Room | null;
  dmMap: Map<string, string>;
  isConnected: boolean;
  isAddMemberOpen: boolean;
  setIsAddMemberOpen: (open: boolean) => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  handleAddMember: () => void;
  isInviting: boolean;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  msgQuery: string;
  setMsgQuery: (query: string) => void;
  isSearchingMsg: boolean;
  searchResults: Message[];
  handleJumpToMessage: (id: string) => void;
  user: User | null;
  isDeleteRoomOpen: boolean;
  setIsDeleteRoomOpen: (open: boolean) => void;
  handleDeleteRoom: () => void;
  typingUsers: Set<string>;
  isLocalTyping?: boolean;
}

export function ChatHeader({
  setIsSidebarOpen, activeRoom, dmMap, isConnected,
  isAddMemberOpen, setIsAddMemberOpen, inviteEmail, setInviteEmail, handleAddMember, isInviting,
  isSearchOpen, setIsSearchOpen, msgQuery, setMsgQuery, isSearchingMsg, searchResults, handleJumpToMessage,
  user, typingUsers, isDeleteRoomOpen, setIsDeleteRoomOpen, handleDeleteRoom
}: ChatHeaderProps) {
  const typingArr = Array.from(typingUsers || []).filter(u => u !== user?.username);
  const typingText = typingArr.length === 1 ? `${typingArr[0]} is typing...` : typingArr.length > 1 ? `${typingArr.slice(0,3).join(', ')} are typing...` : '';
  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-400"><Menu className="w-6 h-6" /></button>
        {activeRoom ? (
          <div>
            <div className="flex items-center gap-2 font-bold text-white">
              {activeRoom.is_group ? (
                <>
                  <Hash className="w-5 h-5 text-slate-500" />
                  {activeRoom.name}
                </>
              ) : (
                <>
                  <Avatar className="h-6 w-6 border border-slate-700">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dmMap.get(activeRoom.id) || 'User'}`} />
                    <AvatarFallback>{(dmMap.get(activeRoom.id) || 'U').slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {dmMap.get(activeRoom.id) || 'Loading...'}
                </>
              )}
            </div>
            <div className="text-xs text-slate-500 flex flex-col gap-1">
              <div className="flex items-center gap-2 h-4">
                <span className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500" : "bg-red-500")}></span>
                {isConnected ? "Live connection" : "Disconnected"}
              </div>
              {typingText && (
                <div className="text-xs text-slate-400">{typingText}</div>
              )}
            </div>
          </div>
        ) : <div className="text-slate-500 font-medium">Select a channel</div>}
      </div>
      
      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {activeRoom && (
          <>
            {/* Delete Room Button (Only for Creator) */}
            {String(activeRoom.created_by) === String(user?.id) && (
              <Dialog open={isDeleteRoomOpen} onOpenChange={setIsDeleteRoomOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-slate-800" title="Delete Room">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Delete Room</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 text-slate-300">
                    Are you sure you want to delete <strong>{activeRoom.is_group ? `#${activeRoom.name}` : (dmMap.get(activeRoom.id) || 'this conversation')}</strong>? This action cannot be undone and will remove all messages and members.
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsDeleteRoomOpen(false)} className="text-slate-400 hover:text-white">Cancel</Button>
                    <Button onClick={handleDeleteRoom} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild><Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800" title="Add Member"><UserPlus className="w-5 h-5" /></Button></DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 text-white">
                <DialogHeader><DialogTitle>Add people to #{activeRoom.name}</DialogTitle></DialogHeader>
                <div className="py-4"><Label className="text-slate-400">User Email</Label><Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="mt-2 bg-slate-950 border-slate-800 text-white focus-visible:ring-indigo-500" /></div>
                <DialogFooter><Button onClick={handleAddMember} disabled={isInviting || !inviteEmail.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">{isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add Member</Button></DialogFooter>
              </DialogContent>
            </Dialog>

            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverAnchor asChild>
                <div className="hidden md:flex items-center bg-slate-900 rounded-full px-3 py-1.5 border border-slate-800 focus-within:ring-1 focus-within:ring-indigo-500 cursor-text w-64">
                  <Search className="w-4 h-4 text-slate-500 mr-2" />
                  <input 
                    placeholder="Search messages..." 
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-300" 
                    value={msgQuery} 
                    onChange={(e) => { setMsgQuery(e.target.value); setIsSearchOpen(true); }} 
                    onFocus={() => setIsSearchOpen(true)} 
                  />
                </div>
              </PopoverAnchor>
              <PopoverContent 
                className="w-80 p-0 bg-slate-900 border-slate-800 text-slate-200" 
                align="end"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <ScrollArea className="h-[300px] p-2">
                  {isSearchingMsg ? (
                    <div className="flex items-center justify-center h-20 text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((msg) => (
                       <div 
                         key={msg.id} 
                         onClick={() => handleJumpToMessage(msg.id)}
                         className="p-2 hover:bg-slate-800 border-b border-slate-800/50 cursor-pointer"
                       >
                         <span className="text-indigo-400 font-bold text-xs">{msg.username}</span>
                         <p className="text-sm text-slate-300">{msg.content}</p>
                       </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">No messages found.</div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </header>
  );
}