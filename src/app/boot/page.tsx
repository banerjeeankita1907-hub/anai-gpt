'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BOOT_LINES = [
  "Initializing ANAI Neural Core v5.0...",
  "Loading transformer model (77M parameters)...",
  "Compiling ONNX runtime for WebAssembly...",
  "Fetching model weights from CDN...",
  "Warming up inference engine...",
  "Persona matrix calibrated.",
  "ANAI is ready. © Ankita Banerjee"
];

export default function BootPage() {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        setTimeout(() => router.push('/chat'), 800);
      }
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <pre className="text-green-400 text-sm md:text-base font-mono space-y-1">
        {lines.map((l, i) => (
          <div key={i} className="boot-line">{l}</div>
        ))}
        {!done && <span className="animate-pulse">▊</span>}
      </pre>
    </div>
  );
}
