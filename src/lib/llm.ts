import { prisma } from '@/lib/prisma';

// Server-only LLM helper. Reads the OpenAI-compatible configuration saved in the
// SystemSetting table and calls the provider's /chat/completions endpoint.

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getAIConfig(): Promise<any | null> {
  try {
    const rows: any[] = await prisma.$queryRaw`SELECT * FROM SystemSetting WHERE id = 'default'`;
    return rows && rows.length ? rows[0] : null;
  } catch (e) {
    console.error('Failed to read AI config from DB:', e);
    return null;
  }
}

export async function callLLM(
  messages: ChatMessage[],
  opts?: { json?: boolean }
): Promise<string | null> {
  const cfg = await getAIConfig();
  const apiKey = cfg?.apiKey || '';
  if (!apiKey) return null;

  const baseUrl = String(cfg?.customBaseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const model = String(cfg?.customModelName || 'gpt-4o-mini');

  const body: any = {
    model,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  };
  if (opts?.json) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`LLM HTTP ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? null;
}
