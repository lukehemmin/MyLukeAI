'use client'

import { Message, MessageContentPart } from '@/types/chat'
import Image from 'next/image'
import { ThinkingBubble } from './ThinkingBubble'
import { useState, useMemo, useRef, useEffect } from 'react'
import { ImageViewer } from '@/components/ui/ImageViewer'
import { MessageActions } from './MessageActions'
import { BranchNavigator } from './BranchNavigator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatBubbleProps {
  message: Message
  onEditSubmit?: (messageId: string, newContent: string) => void
  onBranchNavigate?: (messageId: string, direction: 'prev' | 'next') => void
  siblingInfo?: { currentIndex: number; totalSiblings: number }  // 형제 정보 (트리 기반)
  isEditing?: boolean
  onEditStart?: (messageId: string) => void
  onEditCancel?: () => void
}

export function ChatBubble({
  message,
  onEditSubmit,
  onBranchNavigate,
  siblingInfo,
  isEditing = false,
  onEditStart,
  onEditCancel
}: ChatBubbleProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isUser = message.role === 'user'

  // 현재 표시할 콘텐츠 (트리 구조에서는 항상 현재 메시지의 content)
  const displayContent = message.content

  // 텍스트 콘텐츠 추출 (useMemo로 메모이제이션하여 의존성 문제 해결)
  const textContent = useMemo((): string => {
    if (typeof displayContent === 'string') {
      return displayContent
    }
    return displayContent
      .filter((part): part is MessageContentPart & { type: 'text' } => part.type === 'text')
      .map(part => part.text || '')
      .join('')
  }, [displayContent])

  // 편집 모드 진입 시 텍스트 로드 및 포커스
  useEffect(() => {
    if (isEditing) {
      setEditText(textContent)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.style.height = 'auto'
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
      }, 0)
    }
  }, [isEditing, textContent])

  // early return은 모든 hooks 후에
  if (!message.content && !message.reasoning) return null

  const renderContent = () => {
    if (typeof displayContent === 'string') {
      return displayContent
    }
    return displayContent.map((part, index) => {
      if (part.type === 'text') {
        return <span key={index}>{part.text}</span>
      }
      if (part.type === 'image_url') {
        return (
          <Image
            key={index}
            src={part.image_url?.url || ''}
            alt="User uploaded content"
            width={500}
            height={300}
            className="rounded-md max-w-full h-auto mt-2 mb-2 max-h-[300px] object-contain cursor-zoom-in"
            style={{ width: 'auto' }}
            unoptimized
            onClick={() => setPreviewImage(part.image_url?.url || null)}
          />
        )
      }
      return null
    })
  }

  const handleEditClick = () => {
    if (onEditStart) {
      onEditStart(message.id)
    }
  }

  const handleEditSubmit = () => {
    if (onEditSubmit && editText.trim()) {
      onEditSubmit(message.id, editText.trim())
    }
  }

  const handleEditCancel = () => {
    setEditText('')
    if (onEditCancel) {
      onEditCancel()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleEditCancel()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value)
    // 높이 자동 조절
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const handleBranchNavigate = (direction: 'prev' | 'next') => {
    if (onBranchNavigate) {
      onBranchNavigate(message.id, direction)
    }
  }

  // 인라인 편집 모드 UI
  if (isEditing && isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-prose w-full">
          <div className="bg-muted rounded-lg border border-border">
            <Textarea
              ref={textareaRef}
              value={editText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none border-0 focus-visible:ring-0 bg-transparent text-sm"
              placeholder="메시지 수정..."
            />
            <div className="flex justify-end gap-2 p-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditCancel}
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleEditSubmit}
                disabled={!editText.trim()}
              >
                보내기
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className="flex flex-col items-end gap-1">
        <div className={`max-w-prose rounded-lg px-3 py-2 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          <div className="whitespace-pre-wrap break-words text-sm">
            {message.reasoning && <ThinkingBubble content={message.reasoning} />}
            {renderContent()}
          </div>
        </div>

        {/* 사용자 메시지에만 액션 버튼 및 브랜치 네비게이터 표시 */}
        {isUser && (
          <div className="flex items-center gap-2 px-1">
            <MessageActions
              content={textContent}
              onEdit={handleEditClick}
              isEditable={!!onEditSubmit}
            />
            {siblingInfo && siblingInfo.totalSiblings > 1 && (
              <BranchNavigator
                currentIndex={siblingInfo.currentIndex}
                totalSiblings={siblingInfo.totalSiblings}
                onNavigate={handleBranchNavigate}
              />
            )}
          </div>
        )}
      </div>
      <ImageViewer
        src={previewImage || ''}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  )
}
