import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ANAI – On‑Device GPT',
  description: 'A language model running in your browser. Built by Ankita Banerjee.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
