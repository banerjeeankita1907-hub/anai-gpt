export interface Memory {
  userName?: string;
  history: string[];
}

let memory: Memory = { history: [] };
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('anai_memory');
  if (saved) memory = JSON.parse(saved);
}

function save() {
  localStorage.setItem('anai_memory', JSON.stringify(memory));
}

export function getMemory(): Memory {
  return memory;
}

export function setUserName(name: string) {
  memory.userName = name;
  save();
}

export function addMessage(text: string) {
  memory.history.push(text);
  if (memory.history.length > 30) memory.history.shift();
  save();
}

// Extract name from message
export function extractName(input: string): string | null {
  const match = input.match(/my name is (\w+)/i) || input.match(/call me (\w+)/i);
  return match ? match[1] : null;
}
