'use client'

import { useChatStore } from '@/stores/chatStore'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { ChatHeader } from './ChatHeader'
import { EmptyState } from './EmptyState'
import { ErrorMessage } from './ErrorMessage'
import { LoadingSkeleton } from './LoadingSkeleton'
import { useEffect, useState, useCallback } from 'react'
import { ModelConfig } from '@/types/chat'

interface ChatAreaProps {
  conversationId?: string
  models: ModelConfig[]
}

export function ChatArea({ conversationId, models }: ChatAreaProps) {
  const { 
    messages, 
    isStreaming, 
    error, 
    sendMessage, 
    setMessages, 
    setCurrentConversation, 
    clearError, 
    regenerateLastResponse,
    stopStreaming,
    currentModel,
    setCurrentModel,
    tokenUsage,
    updateTokenUsage
  } = useChatStore()
  const [isLoading, setIsLoading] = useState(false)

  const fetchConversationMessages = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (response.ok) {
        const conversation = await response.json()
        if (conversation.messages) {
          setMessages(conversation.messages)
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversation messages:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setMessages])

  useEffect(() => {
    if (conversationId) {
      setCurrentConversation(conversationId)
      fetchConversationMessages(conversationId)
    } else {
      setMessages([])
      setCurrentConversation(null)
    }
  }, [conversationId, fetchConversationMessages, setCurrentConversation, setMessages])

  

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return
    await sendMessage(content, conversationId)
  }

  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId)
  }

  const handleStopStreaming = () => {
    if (isStreaming) {
      stopStreaming()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        currentModel={currentModel}
        onModelChange={handleModelChange}
        totalTokens={tokenUsage.totalTokens}
        isStreaming={isStreaming}
        onStopStreaming={handleStopStreaming}
        models={models}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : messages.length === 0 ? (
            <EmptyState onPromptClick={handleSendMessage} />
          ) : (
            messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))
          )}
          {isStreaming && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground px-4">
              <div className="animate-pulse">AI가 응답하는 중...</div>
            </div>
          )}
          {error && (
            <ErrorMessage 
              error={error} 
              onRetry={error.type === 'network' ? regenerateLastResponse : undefined}
              onClear={clearError}
            />
          )}
          <div className="h-4" /> {/* Spacer */}
        </div>
      </div>
      <div className="bg-background p-0 pb-4">
        <ChatInput onSend={handleSendMessage} onStop={handleStopStreaming} isStreaming={isStreaming} disabled={isStreaming} />
      </div>
    </div>
  )
}
