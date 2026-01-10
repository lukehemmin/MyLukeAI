'use client'

import { useChatStore } from '@/stores/chatStore'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { ChatHeader } from './ChatHeader'
import { EmptyState } from './EmptyState'
import { ErrorMessage } from './ErrorMessage'
import { LoadingSkeleton } from './LoadingSkeleton'
import { TypingIndicator } from './TypingIndicator'
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
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
    currentConversationId,
    editMessage,
    selectBranch,
    getSiblings,
    buildMessageChain,
    setEditingMessage,
    editingMessageId,
    editingContent
  } = useChatStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userDefaultModelId, setUserDefaultModelId] = useState<string | null>(initialUserDefaultModelId || null)

  // Drag and drop state
  const [images, setImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  /**
   * [자동 스크롤 - v1.5]
   * 
   * 새 메시지가 추가되거나 스트리밍 중일 때 자동으로 맨 아래로 스크롤합니다.
   * - 사용자가 수동으로 스크롤할 필요 없이 최신 응답을 항상 볼 수 있음
   * - messages 배열이 변경되거나 isStreaming 상태가 변경될 때마다 실행
   */
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isStreaming])

  const fetchConversationMessages = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (response.ok) {
        const conversation = await response.json()
        if (conversation.messages) {
          setMessages(conversation.messages)

          /**
           * [스트리밍 복구 - Polling 메커니즘 - v1.5]
           * 
           * 페이지 로드 시 DB에서 isStreaming: true인 메시지가 발견되면,
           * 이는 아직 AI가 응답을 생성 중이라는 의미입니다.
           * 
           * 이 경우 2초마다 DB를 재조회하여 최신 응답을 가져옵니다.
           * - 백엔드에서 스트리밍이 완료되면 isStreaming: false로 업데이트됨
           * - 프론트엔드는 이를 감지하고 polling을 중지
           * 
           * 안전장치:
           * - 60초 후 자동으로 polling 중지 (무한 루프 방지)
           * - 에러 발생 시 즉시 polling 중지
           */
          const streamingMessage = conversation.messages.find(
            (m: any) => m.role === 'assistant' && m.isStreaming === true
          )
          if (streamingMessage) {
            const pollInterval = setInterval(async () => {
              try {
                const pollResponse = await fetch(`/api/conversations/${id}`)
                if (pollResponse.ok) {
                  const updated = await pollResponse.json()
                  if (updated.messages) {
                    setMessages(updated.messages)
                    const stillStreaming = updated.messages.some(
                      (m: any) => m.role === 'assistant' && m.isStreaming === true
                    )
                    if (!stillStreaming) {
                      clearInterval(pollInterval)
                    }
                  }
                }
              } catch (e) {
                console.error('Polling failed:', e)
                clearInterval(pollInterval)
              }
            }, 2000)

            setTimeout(() => clearInterval(pollInterval), 60000)
          }
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
    /**
     * [대화 로딩 로직 - 스트리밍 관련 중요 사항]
     * 
     * 이 useEffect는 conversationId 변경 시 대화 내용을 DB에서 불러오는 역할을 합니다.
     * 
     * ⚠️ 주의: 스트리밍 중에는 메시지를 초기화하거나 DB에서 다시 불러오면 안 됩니다!
     * 
     * 문제 시나리오:
     * 1. 새 채팅 시작 → sendMessage 호출 (chatStore)
     * 2. 대화 생성 후 router.push(`/c/${id}`)로 페이지 이동
     * 3. 페이지 이동으로 ChatArea 리마운트 → 이 useEffect 실행
     * 4. 이 시점에 스트리밍 응답이 아직 진행 중!
     * 5. setMessages([])를 호출하면 스트리밍 중인 assistant 메시지가 사라짐
     * 6. fetchConversationMessages()는 DB에서 조회하지만, assistant 응답은 아직 저장 안 됨
     * 7. 결과: 사용자 메시지만 보이고 AI 응답이 표시되지 않음 (새로고침해야 보임)
     * 
     * 해결: isStreaming이 true이고 같은 대화라면 메시지 초기화/재조회를 건너뜁니다.
     * 
     * 🚫 이 조건문들을 수정하면 스트리밍 응답이 보이지 않는 버그가 재발할 수 있습니다!
     */
    if (conversationId) {
      // 이미 같은 대화이고 메시지가 있으면 스킵 (불필요한 재조회 방지)
      if (currentConversationId === conversationId && messages.length > 0) {
        return
      }

      /**
       * [스트리밍 중 보호 로직]
       * 스트리밍 진행 중이고, store의 대화 ID가 현재 URL의 대화 ID와 같다면
       * 이미 스트리밍 응답이 해당 대화에 쓰이고 있으므로 초기화하지 않습니다.
       */
      if (isStreaming && currentConversationId === conversationId) {
        return
      }

      // 스트리밍 중이지만 store에 이미 해당 대화의 메시지가 있는 경우
      // (새 채팅 생성 → router.push 시나리오)
      if (isStreaming && messages.length > 0) {
        // store의 currentConversationId를 현재 URL로 업데이트만 하고 메시지는 유지
        setCurrentConversation(conversationId)
        return
      }

      setMessages([])
      setCurrentConversation(conversationId)
      fetchConversationMessages(conversationId)
    } else {
      // 새 채팅 페이지 (conversationId 없음)
      // 스트리밍 중이면 메시지를 초기화하지 않음 (진행 중인 응답 보존)
      if (!isStreaming) {
        setMessages([])
      }
      setCurrentConversation(null)

      // 새 채팅일 경우 기본 모델로 리셋
      if (models.length > 0) {
        const userDefault = userDefaultModelId ? models.find(m => m.id === userDefaultModelId) : null
        const adminDefault = models.find(m => m.isDefault) || models[0]
        const targetModelId = userDefault?.id || adminDefault.id

        setCurrentModel(targetModelId)
      }
    }
  }, [conversationId, fetchConversationMessages, setCurrentConversation, setMessages, models, setCurrentModel, currentConversationId, messages.length, userDefaultModelId, isStreaming])

  const handleSendMessage = async (content: string, images?: string[]) => {
    /**
     * [메시지 전송 핸들러]
     * 
     * ⚠️ 중요: 여기서 router.refresh()를 호출하면 안 됩니다!
     * 
     * router.refresh()는 서버 컴포넌트를 다시 렌더링하여 최신 데이터를 가져오지만,
     * 이 과정에서 클라이언트 상태(Zustand store)가 리셋되어 스트리밍 중인 메시지가 사라집니다.
     * 
     * 시나리오:
     * 1. sendMessage() → 스트리밍 시작, isStreaming = true
     * 2. router.refresh() 호출 → 페이지 리렌더, store 리셋
     * 3. router.push() → 새 페이지로 이동
     * 4. 스트리밍 응답이 store에 쌓이지만 UI는 리셋된 상태
     * 
     * 사이드바 갱신은 페이지 이동 후 자동으로 처리되므로 refresh가 불필요합니다.
     * (Next.js의 soft navigation은 필요한 서버 컴포넌트만 다시 fetch함)
     * 
     * 🚫 router.refresh()를 다시 추가하면 스트리밍 응답이 보이지 않는 버그 재발!
     */
    const newConversationId = await sendMessage(content, conversationId || null, images)
    if (!conversationId && newConversationId) {
      // router.refresh() 호출 제거 - 스트리밍 응답 유지를 위해 필수
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

  // 인라인 수정 시작 핸들러
  const handleEditStart = (messageId: string) => {
    setEditingMessage(messageId)
  }

  // 인라인 수정 확정 핸들러
  const handleEditSubmit = async (messageId: string, newContent: string) => {
    await editMessage(messageId, newContent)
  }

  // 수정 취소 핸들러
  const handleEditCancel = () => {
    setEditingMessage(null)
  }

  // 브랜치 네비게이션 핸들러 (트리 기반)
  const handleBranchNavigate = (messageId: string, direction: 'prev' | 'next') => {
    const { siblings, currentIndex } = getSiblings(messageId)
    if (siblings.length <= 1) return

    let newIndex = currentIndex
    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1
    } else if (direction === 'next' && currentIndex < siblings.length - 1) {
      newIndex = currentIndex + 1
    }

    const newSibling = siblings[newIndex]
    if (newSibling && newSibling.id !== messageId) {
      const message = messages.find(m => m.id === messageId)
      selectBranch(message?.parentMessageId ?? null, newSibling.id)
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
            buildMessageChain().map((message) => {
              const { siblings, currentIndex } = getSiblings(message.id)
              return (
                <ChatBubble
                  key={message.id}
                  message={message}
                  onEditSubmit={handleEditSubmit}
                  onBranchNavigate={handleBranchNavigate}
                  siblingInfo={{ currentIndex, totalSiblings: siblings.length }}
                  isEditing={editingMessageId === message.id}
                  onEditStart={handleEditStart}
                  onEditCancel={handleEditCancel}
                />
              )
            })
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
          <div ref={messagesEndRef} /> {/* 스크롤 앵커 */}
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
