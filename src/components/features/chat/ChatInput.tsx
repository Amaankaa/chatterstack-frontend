import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Room } from '@/types';

interface ChatInputProps {
  handleSendMessage: (e: React.FormEvent) => void;
  inputText: string;
  setInputText: (text: string) => void;
  activeRoom: Room | null;
  dmMap: Map<string, string>;
  onTyping?: (isTyping: boolean) => void;
}

export function ChatInput({ handleSendMessage, inputText, setInputText, activeRoom, dmMap, onTyping }: ChatInputProps) {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (onTyping) {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        onTyping(true);
      }
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        onTyping(false);
      }, 2000);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    handleSendMessage(e);
    if (onTyping && isTypingRef.current) {
       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
       isTypingRef.current = false;
       onTyping(false);
    }
  };

  if (!activeRoom) return null;

  return (
    <div className="p-4 bg-slate-950/90 backdrop-blur border-t border-slate-800">
      <form onSubmit={onFormSubmit} className="relative flex items-center max-w-5xl mx-auto">
        <Input 
          value={inputText} 
          onChange={handleChange} 
          placeholder={activeRoom.is_group ? `Message #${activeRoom.name}` : `Message ${dmMap.get(activeRoom.id) || 'User'}`} 
          className="pr-12 bg-slate-900 border-slate-800 text-slate-200 py-6 focus-visible:ring-indigo-500" 
        />
        <Button type="submit" size="icon" disabled={!inputText.trim()} className={cn("absolute right-2 h-8 w-8 transition-all", inputText.trim() ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-transparent text-slate-600 hover:bg-slate-800")}><Send className="w-4 h-4" /></Button>
      </form>
    </div>
  );
}