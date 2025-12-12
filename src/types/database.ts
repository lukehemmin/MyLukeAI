// types/database.ts

export interface MessageHistory {
  content: string;
  createdAt: string;  // ISO 8601
}

export interface MessageContext {
  sources?: {
    id: string;
    title: string;
    url?: string;
    relevanceScore: number;
  }[];
  embeddings?: number[];
  metadata?: Record<string, unknown>;
}