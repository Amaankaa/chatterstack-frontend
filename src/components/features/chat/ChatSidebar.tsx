import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { LogOut, Plus, Hash, MessageSquare, Search, X, Settings, Loader2 } from 'lucide-react';
import { Room, User } from '@/types';

interface ChatSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  roomQuery: string;
  setRoomQuery: (query: string) => void;
  filteredRooms: Room[];
  activeRoom: Room | null;
  setActiveRoom: (room: Room) => void;
  isCreateRoomOpen: boolean;
  setIsCreateRoomOpen: (open: boolean) => void;
  newRoomName: string;
  setNewRoomName: (name: string) => void;
  handleCreateRoom: () => void;
  isCreateDMOpen: boolean;
  setIsCreateDMOpen: (open: boolean) => void;
  dmEmail: string;
  setDmEmail: (email: string) => void;
  handleCreateDM: () => void;
  isInviting: boolean;
  dmMap: Map<string, string>;
  user: User | null;
  handleLogout: () => void;
}

export function ChatSidebar({
  isSidebarOpen, setIsSidebarOpen, roomQuery, setRoomQuery, filteredRooms, activeRoom, setActiveRoom,
  isCreateRoomOpen, setIsCreateRoomOpen, newRoomName, setNewRoomName, handleCreateRoom,
  isCreateDMOpen, setIsCreateDMOpen, dmEmail, setDmEmail, handleCreateDM, isInviting, dmMap, user, handleLogout
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={cn("fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 md:relative md:translate-x-0 flex flex-col", isSidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="bg-indigo-600 p-1 rounded-md"><MessageSquare className="w-4 h-4 text-white" /></div>
            ChatterStack
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-slate-400"><X className="w-6 h-6" /></button>
        </div>

        <div className="p-4 pb-0">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Filter channels..." className="pl-8 bg-slate-950 border-slate-800 h-9 text-slate-300 focus-visible:ring-indigo-500" value={roomQuery} onChange={(e) => setRoomQuery(e.target.value)} />
          </div>
        </div>

        <ScrollArea className="flex-1 py-4">
          <div className="px-4 space-y-6">
            {/* Channels Section */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Channels</h3>
                <Dialog open={isCreateRoomOpen} onOpenChange={setIsCreateRoomOpen}>
                  <DialogTrigger asChild>
                    <button className="text-slate-500 hover:text-slate-300"><Plus className="w-4 h-4" /></button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>Create a new channel</DialogTitle></DialogHeader>
                    <div className="py-4">
                      <Label className="text-slate-400">Channel Name</Label>
                      <Input 
                        value={newRoomName} 
                        onChange={(e) => setNewRoomName(e.target.value)} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newRoomName.trim()) {
                            handleCreateRoom();
                          }
                        }}
                        className="mt-2 bg-slate-950 border-slate-800 text-white focus-visible:ring-indigo-500" 
                      />
                    </div>
                    <DialogFooter><Button onClick={handleCreateRoom} className="bg-indigo-600 hover:bg-indigo-700 text-white">Create</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-1">
                {filteredRooms.filter(r => r.is_group).map((room) => (
                  <button key={room.id} onClick={() => { setActiveRoom(room); setIsSidebarOpen(false); }} className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all", activeRoom?.id === room.id ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100")}>
                    <Hash className="w-4 h-4 opacity-50" /><span className="truncate">{room.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Messages Section */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Messages</h3>
                <Dialog open={isCreateDMOpen} onOpenChange={setIsCreateDMOpen}>
                  <DialogTrigger asChild>
                    <button className="text-slate-500 hover:text-slate-300"><Plus className="w-4 h-4" /></button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
                    <div className="py-4">
                      <Label className="text-slate-400">To: (Email)</Label>
                      <Input 
                        value={dmEmail} 
                        onChange={(e) => setDmEmail(e.target.value)} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && dmEmail.trim() && !isInviting) {
                            handleCreateDM();
                          }
                        }}
                        placeholder="user@example.com" 
                        className="mt-2 bg-slate-950 border-slate-800 text-white focus-visible:ring-indigo-500" 
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateDM} disabled={isInviting || !dmEmail.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Go
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-1">
                {filteredRooms.filter(r => !r.is_group).map((room) => (
                  <button key={room.id} onClick={() => { setActiveRoom(room); setIsSidebarOpen(false); }} className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all", activeRoom?.id === room.id ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100")}>
                    <div className="relative">
                      <Avatar className="h-4 w-4"><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dmMap.get(room.id) || 'User'}`} /></Avatar>
                      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full border border-slate-900"></span>
                    </div>
                    <span className="truncate">{dmMap.get(room.id) || 'Loading...'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-slate-700"><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} /><AvatarFallback className="bg-slate-700 text-slate-300">{user?.username?.slice(0,2)}</AvatarFallback></Avatar>
              <div className="flex flex-col"><span className="text-sm font-medium text-slate-200">{user?.username}</span><span className="text-xs text-slate-500">Online</span></div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800"><Settings className="w-5 h-5" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200">
                <DropdownMenuLabel>My Account</DropdownMenuLabel><DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 focus:text-white" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
}