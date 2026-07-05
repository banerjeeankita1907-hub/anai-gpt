'use client';
import { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { getMemory, setUserName, addMessage, extractName } from '@/lib/memory';
import { Sparkles, Brain } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Preload the model only in the browser (dynamic import)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { loadModel } = await import('@/lib/ai-model');
      await loadModel();
      if (!cancelled) setModelReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    addMessage(text);

    // Check for name setting
    const name = extractName(text);
    if (name) {
      setUserName(name);
      const reply = `Nice to meet you, ${name}! I'll remember that.`;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      addMessage(reply);
      setIsProcessing(false);
      return;
    }

    // Dynamically import AI functions only when needed
    const { quickResponse, generateResponse } = await import('@/lib/ai-model');

    const quick = quickResponse(text);
    if (quick) {
      setMessages(prev => [...prev, { role: 'assistant', content: quick }]);
      addMessage(quick);
      setIsProcessing(false);
      return;
    }

    if (!modelReady) {
      const fallback = "I'm still loading my neural network. Please wait...";
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      addMessage(fallback);
      setIsProcessing(false);
      return;
    }

    try {
      const response = await generateResponse(text, getMemory().userName);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      addMessage(response);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-5xl mx-auto">
      <header className="text-center mb-6 pt-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            ANAI
          </h1>
          <Brain className="w-8 h-8 text-purple-400" />
        </div>
        <p className="text-slate-400 text-sm">On‑Device Language Model – © Ankita Banerjee</p>
        {!modelReady && (
          <p className="text-yellow-400 text-xs mt-2">Loading model… this may take a few seconds.</p>
        )}
      </header>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-20">
            <p className="text-xl">Hello, I'm ANAI. I'm a real AI running in your browser.</p>
            <p className="text-xs mt-2">I use a 77M‑parameter transformer model. Ask me anything.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {isProcessing && (
          <div className="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isProcessing || !modelReady} />
      <footer className="text-center text-xs text-slate-600 mt-4">
        © {new Date().getFullYear()} Ankita Banerjee. All rights reserved.
      </footer>
    </div>
  );
}
