import { pipeline } from '@xenova/transformers';

// No explicit type; let TypeScript infer the pipeline type
let generator: any = null;
let loading = false;
let loadPromise: Promise<void> | null = null;

export async function loadModel(): Promise<void> {
  if (generator) return;
  if (loading && loadPromise) return loadPromise;
  loading = true;
  loadPromise = (async () => {
    generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M');
    loading = false;
  })();
  return loadPromise;
}

export async function generateResponse(userMessage: string, userName?: string): Promise<string> {
  if (!generator) {
    await loadModel();
  }

  const prompt = `You are ANAI, a highly intelligent AI assistant created by Ankita Banerjee. You are helpful, friendly, and concise. Answer the following question or respond to the statement naturally.\n\nUser${userName ? ` (${userName})` : ''}: ${userMessage}\nANAI:`;

  try {
    const result = await generator(prompt, {
      max_new_tokens: 150,
      temperature: 0.7,
      top_p: 0.9,
      do_sample: true,
      repetition_penalty: 1.1,
    });

    let text = result[0].generated_text;
    if (text.startsWith(prompt)) {
      text = text.slice(prompt.length).trim();
    }
    text = text.replace(/^ANAI:\s*/, '').trim();
    return text || "I'm not sure how to respond to that, but I'm learning!";
  } catch (error) {
    console.error('Generation error:', error);
    return "Sorry, I had a temporary glitch. Could you try again?";
  }
}

// Quick rule‑based fallbacks
const quickResponses: Record<string, string> = {
  'hello': "Hello! I'm ANAI, running fully on-device with a real transformer model. How can I help?",
  'hi': "Hey there! What can I do for you?",
  'who are you': "I'm ANAI (Ankita AI), a self‑contained language model built by Ankita Banerjee.",
  'who created you': "Ankita Banerjee created me using Next.js, Transformers.js, and a lot of brilliance.",
};

export function quickResponse(input: string): string | null {
  const clean = input.toLowerCase().trim().replace(/[^\w\s]/g, '');
  for (const [key, val] of Object.entries(quickResponses)) {
    if (clean.includes(key)) return val;
  }
  return null;
}
