import { SYSTEM_PROMPT } from '../features/chatgpt/chatgpt.prompt';
import type { ChatGPTMessage } from '../features/chatgpt/chatgpt.types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Gọi OpenAI ChatGPT API
 */
export async function callChatGPT(userMessage: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Chưa cấu hình VITE_OPENAI_API_KEY trong file .env');
  }

  const messages: ChatGPTMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.error?.message || `OpenAI API Error: ${response.status}`
    );
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}
