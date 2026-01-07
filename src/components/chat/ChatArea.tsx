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
    updateTokenUsage,
    currentConversationId
  } = useChatStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Drag and drop state
  const [images, setImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const fetchConversationMessages = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (response.ok) {
        const conversation = await response.json()
        if (conversation.messages) {
          setMessages(conversation.messages)
        }
        // Restore the model used in this conversation
        if (conversation.model) {
          // Verify the model exists in the available models list before setting
          const isValidModel = models.some(m => m.id === conversation.model)
          if (isValidModel) {
            setCurrentModel(conversation.model)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversation messages:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setMessages, setCurrentModel, models])

  useEffect(() => {
    // 모델 목록이 있고, 기본 모델을 설정해야 하는 경우
    // 단, 대화방에 들어와 있는 경우(conversationId 존재)에는 
    // fetchConversationMessages에서 모델을 설정하므로 여기서는 간섭하지 않음
    if (models.length > 0 && !conversationId) {
      const defaultModel = models.find(m => m.isDefault) || models[0]
      // 현재 선택된 모델이 유효하지 않거나 (목록에 없음), 
      // 초기 상태('gpt-4o-mini')이고 목록에 없는 경우 기본값으로 설정
      const isCurrentValid = models.some(m => m.id === currentModel)

      if (!isCurrentValid && defaultModel) {
        setCurrentModel(defaultModel.id)
      }
    }
  }, [models, currentModel, setCurrentModel, conversationId])

  useEffect(() => {
    if (conversationId) {
      // 이미 현재 대화 ID가 설정되어 있고 메시지가 있다면 (즉, 방금 생성된 대화라면)
      // 메시지를 다시 불러오지 않고 유지합니다.
      if (currentConversationId === conversationId && messages.length > 0) {
        return
      }

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
  }, [conversationId, fetchConversationMessages, setCurrentConversation, setMessages, models, setCurrentModel, currentConversationId, messages.length])



  const handleSendMessage = async (content: string, images?: string[]) => {
    // 1. Send message (which handles optimistic updates and conversation creation)
    const newConversationId = await sendMessage(content, conversationId || null, images)

    // 2. Navigate if this was a new conversation
    if (!conversationId && newConversationId) {
      // Refresh sidebar to show new chat title
      router.refresh()

      // Seamlessly update URL
      // Note: Because we optimistically updated state, the useEffect in ChatArea
      // will see matching IDs and skip re-fetching/clearing.
      router.push(`/c/${newConversationId}`)
    }

    // Clear images after sending (optimistic update already captured them)
    setImages([])
  }

  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId)
  }

  const handleStopStreaming = () => {
    if (isStreaming) {
      stopStreaming()
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prev => [...prev, reader.result as string])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  return (
    <div
      className="flex flex-col h-full relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary m-4 rounded-xl">
          <div className="text-xl font-medium text-primary flex flex-col items-center gap-2">
            <p>여기에 이미지를 놓으세요</p>
          </div>
        </div>
      )}
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
        <ChatInput
          onSend={handleSendMessage}
          onStop={handleStopStreaming}
          isStreaming={isStreaming}
          images={images}
          onImagesChange={setImages}
        />
      </div>
    </div>
  )
}
