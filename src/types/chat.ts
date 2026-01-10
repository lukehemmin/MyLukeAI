// types/chat.ts

export interface MessageHistory {
  id: string;
  content: string | MessageContentPart[];
  createdAt: Date;
}

export interface MessageContext {
  files?: string[];
  images?: string[];
  urls?: string[];
}

export interface MessageContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string | MessageContentPart[];
  reasoning?: string;
  tokens?: number;

  // v2.0: 트리 구조를 위한 부모 메시지 참조
  parentMessageId?: string | null;

  // deprecated: 기존 히스토리 기반 브랜치 (v2.0에서 트리 구조로 대체됨)
  history?: MessageHistory[];
  currentHistoryIndex?: number;

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
  type?: 'TEXT' | 'TEXT_VISION' | 'IMAGE' | 'AUDIO';
}