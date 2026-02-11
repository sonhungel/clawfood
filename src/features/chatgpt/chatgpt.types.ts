import type { Restaurant, ChatGPTResponse } from '../../types';

export interface ChatGPTState {
  loading: boolean;
  error: string | null;
  response: ChatGPTResponse | null;
}

export interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type { Restaurant, ChatGPTResponse };
