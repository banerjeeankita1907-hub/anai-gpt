'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
  const [input, setInput] = useState('');
  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) { onSend(input.trim()); setInput(''); }
  };
  return (
    <form onSubmit={handle} className="glass p-3 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Message ANAI..."
        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500"
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !input.trim()} className="text-cyan-400 hover:text-cyan-300 disabled:opacity-30">
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
