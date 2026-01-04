'use client'

import { useChatStore } from '@/stores/chatStore'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { ChatHeader } from './ChatHeader'
import { EmptyState } from './EmptyState'
import { ErrorMessage } from './ErrorMessage'
import { LoadingSkeleton } from './LoadingSkeleton'
import { TypingIndicator } from './TypingIndicator'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ModelConfig } from '@/types/chat'

interface ChatAreaProps {
  conversationId?: string
  models: ModelConfig[]
}

export function ChatArea({ conversationId: propConversationId, models: allModels }: ChatAreaProps) {
  // 텍스트/비전 모델만 채팅창에 표시
  const models = useMemo(() =>
    allModels.filter(m => !m.type || m.type === 'TEXT' || m.type === 'TEXT_VISION'),
    [allModels]
  )

  // URL 파라미터를 직접 읽어서 soft navigation에서도 올바르게 동작하도록 함
  const params = useParams()
  const conversationId = (params?.id as string) || propConversationId

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
  const router = useRouter()
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
    // 모델 목록이 있고, 기본 모델을 설정해야 하는 경우
    if (models.length > 0) {
      const defaultModel = models.find(m => m.isDefault) || models[0]
      // 현재 선택된 모델이 유효하지 않거나 (목록에 없음), 
      // 초기 상태('gpt-4o-mini')이고 목록에 없는 경우 기본값으로 설정
      const isCurrentValid = models.some(m => m.id === currentModel)

      if (!isCurrentValid && defaultModel) {
        setCurrentModel(defaultModel.id)
      }
    }
  }, [models, currentModel, setCurrentModel])

  useEffect(() => {
    if (conversationId) {
      // 먼저 메시지를 초기화하고, 현재 대화를 설정한 후, 메시지를 가져옵니다
      setMessages([])  // 이전 대화 메시지 클리어
      setCurrentConversation(conversationId)
      fetchConversationMessages(conversationId)
    } else {
      setMessages([])
      setCurrentConversation(null)

      // 새 채팅일 경우 기본 모델로 리셋 (선택적)
      if (models.length > 0) {
        const defaultModel = models.find(m => m.isDefault) || models[0]
        if (defaultModel) {
          setCurrentModel(defaultModel.id)
        }
      }
    }
  }, [conversationId, fetchConversationMessages, setCurrentConversation, setMessages, models, setCurrentModel])



  const handleSendMessage = async (content: string) => {
    let targetConversationId = conversationId

    if (!targetConversationId) {
      try {
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: content.slice(0, 30), // Use first 30 chars as title
            model: currentModel,
          }),
        })

        if (response.ok) {
          const newConversation = await response.json()
          targetConversationId = newConversation.id

          // Set the conversation ID in store before sending message
          setCurrentConversation(targetConversationId ?? null)
        } else {
          console.error('Failed to create conversation')
          // Optional: Show error to user
          return
        }
      } catch (error) {
        console.error('Error creating conversation:', error)
        return
      }
    }

    if (targetConversationId) {
      await sendMessage(content, targetConversationId)

      // If this was a new conversation, navigate to the new conversation page
      // This ensures the server component receives the correct conversationId prop
      if (!conversationId) {
        // 먼저 사이드바 업데이트를 위해 서버 컴포넌트 갱신
        router.refresh()
        // 짧은 지연 후 새 대화 페이지로 이동 (refresh 완료를 위해)
        setTimeout(() => {
          router.push(`/c/${targetConversationId}`)
        }, 100)
      }
    }
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
          {isStreaming && messages.length > 0 &&
            (!messages[messages.length - 1].content && !messages[messages.length - 1].reasoning) &&
            messages[messages.length - 1].role === 'assistant' && (
              <TypingIndicator />
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
        <ChatInput onSend={handleSendMessage} onStop={handleStopStreaming} isStreaming={isStreaming} />
      </div>
    </div>
  )
}
