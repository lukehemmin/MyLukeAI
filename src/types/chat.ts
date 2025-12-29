// types/chat.ts

export interface MessageHistory {
  id: string;
  content: string;
  createdAt: Date;
}

export interface MessageContext {
  files?: string[];
  images?: string[];
  urls?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  tokens?: number;
  history?: MessageHistory[];
  context?: MessageContext;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  model: string;
  systemPrompt?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatError {
  type: 'network' | 'rateLimit' | 'apiError' | 'contextLength';
  message: string;
  retryAfter?: number;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  maxTokens: number;
  badge?: string;
  description?: string;
  enabled: boolean;
  isDefault?: boolean;
}