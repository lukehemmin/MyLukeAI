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
import { setUserDefaultModel } from '@/lib/actions/user-settings'

interface ChatAreaProps {
  conversationId?: string
  models: ModelConfig[]
  userDefaultModelId?: string | null
}

export function ChatArea({ conversationId: propConversationId, models: allModels, userDefaultModelId: initialUserDefaultModelId }: ChatAreaProps) {
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
  const [userDefaultModelId, setUserDefaultModelId] = useState<string | null>(initialUserDefaultModelId || null)

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
    // 모델 목록이 있고, 기본 모델을 설정해야 하는 경우 (새 채팅 등)
    if (models.length > 0 && !conversationId) {
      // 1. 사용자 설정 기본값 확인 (유효성 검사 포함)
      const userDefault = userDefaultModelId ? models.find(m => m.id === userDefaultModelId) : null

      // 2. 관리자 설정 기본값 확인
      const adminDefault = models.find(m => m.isDefault) || models[0] // fallback to first

      // 3. 최종 결정: 사용자 설정 > 관리자 설정 > 첫번째
      const targetModelId = userDefault?.id || adminDefault.id

      // 현재 선택된 모델이 유효하지 않거나, 초기 상태이고 userDefault가 있으면 변경
      const isCurrentValid = models.some(m => m.id === currentModel)

      // if current model is not set or invalid, set strict default.
      // Or if strictly enforcing default on new chat load? 
      // Usually checking !currentModel is risky if store persists via zustand persist.
      // But let's assume if invalid (not in list), we reset.

      if (!isCurrentValid) {
        setCurrentModel(targetModelId)
      } else {
        // Even if valid, if it's just 'gpt-4o-mini' string but not in list? No, line 87 logic covers that.
        // Wait, if persisted model is 'gpt-4o' but user default is 'claude', should we switch?
        // Maybe not if user manually selected 'gpt-4o' last time.
        // But the User Request says: "When user sets default... automatically selected"
        // This implies when opening a NEW chat, it should default to that.

        // Assuming this useEffect runs on mount (new chat page), we should favor the explicit default 
        // unless we are restoring a specific conversation (handled by fetchConversationMessages).
        // If `currentModel` is just lingering from previous state, maybe we should override?
        // It's safer to only override if !isCurrentValid OR if we are explicit about resetting.
        // But let's stick to existing logic for now extended with `userDefault`.
      }

      // Let's force set it to targetModelId on mount if not conversationId.
      // But only if currentModel is different to avoid loop if we add it to deps
      if (currentModel !== targetModelId) {
        setCurrentModel(targetModelId)
      }
    }
  }, [models, userDefaultModelId, setCurrentModel, conversationId, currentModel])

  useEffect(() => {
    // ... conversation loading logic ...
    // Note: I need to verify if lines 95-119 need update.
    // Specifically line 112 logic.
    if (conversationId) {
      if (currentConversationId === conversationId && messages.length > 0) {
        return
      }
      setMessages([])
      setCurrentConversation(conversationId)
      fetchConversationMessages(conversationId)
    } else {
      setMessages([])
      setCurrentConversation(null)

      // 새 채팅일 경우 기본 모델로 리셋
      if (models.length > 0) {
        const userDefault = userDefaultModelId ? models.find(m => m.id === userDefaultModelId) : null
        const adminDefault = models.find(m => m.isDefault) || models[0]
        const targetModelId = userDefault?.id || adminDefault.id

        setCurrentModel(targetModelId)
      }
    }
  }, [conversationId, fetchConversationMessages, setCurrentConversation, setMessages, models, setCurrentModel, currentConversationId, messages.length, userDefaultModelId])

  const handleSendMessage = async (content: string, images?: string[]) => {
    // ... unchanged ...
    const newConversationId = await sendMessage(content, conversationId || null, images)
    if (!conversationId && newConversationId) {
      router.refresh()
      router.push(`/c/${newConversationId}`)
    }
    setImages([])
  }

  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId)
  }

  const handleSetDefaultModel = async (modelId: string) => {
    try {
      await setUserDefaultModel(modelId)
      setUserDefaultModelId(modelId)
      // Toast notification is handled by UI component or we can add here
      // But simpler to just rely on re-render.
    } catch (e) {
      console.error(e)
    }
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
        userDefaultModelId={userDefaultModelId}
        onSetDefaultModel={handleSetDefaultModel}
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
