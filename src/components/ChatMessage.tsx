'use client';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ role, content }: { role: string; content: string }) {
  return (
    <div className={`flex gap-4 mb-4 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className="w-9 h-9 rounded-full bg-cyan-900/30 flex items-center justify-center">
        {role === 'user' ? <User className="w-5 h-5 text-purple-400" /> : <Bot className="w-5 h-5 text-cyan-400" />}
      </div>
      <div className={`glass p-4 max-w-[80%]`}>
        <div className="prose prose-invert prose-sm max-w-none text-slate-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
