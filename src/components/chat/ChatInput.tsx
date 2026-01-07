'use client'

import { useState, KeyboardEvent, useRef, useEffect, ChangeEvent, DragEvent } from 'react'
import Image from 'next/image'
import { Send, Square, Paperclip, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ImageViewer } from '@/components/ui/ImageViewer'

interface ChatInputProps {
  onSend: (message: string, images?: string[]) => void
  isStreaming: boolean
  onStop: () => void
  disabled?: boolean
  placeholder?: string
  images: string[]
  onImagesChange: (images: string[]) => void
}

export function ChatInput({
  onSend,
  isStreaming,
  onStop,
  disabled,
  placeholder = "무엇이든 물어보세요...",
  images,
  onImagesChange
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed && images.length === 0) return

    onSend(trimmed, images)
    setInput('')
    onImagesChange([])
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImagesChange([...images, reader.result as string])
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input so the same file can be selected again if needed
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [input])

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onImagesChange([...images, reader.result as string])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-4">
      {images.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pt-2 pr-2">
          {images.map((img, index) => (
            <div key={index} className="relative shrink-0 group">
              <Image
                src={img}
                alt={`Selected ${index + 1}`}
                width={80}
                height={80}
                className="h-20 w-20 object-cover rounded-lg border bg-secondary cursor-zoom-in transition-opacity group-hover:opacity-90"
                unoptimized
                onClick={() => setPreviewImage(img)}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/90 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div
        className={`relative flex items-end gap-2 p-2 bg-secondary/50 border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all ${isDragging ? 'ring-2 ring-primary border-primary bg-secondary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />

        <Button
          variant="ghost"
          size="icon"
          className="mb-0.5 rounded-full text-muted-foreground hover:text-foreground shrink-0 h-8 w-8 ml-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isStreaming}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isStreaming}
          className="min-h-[24px] max-h-[200px] resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent py-2.5 px-0 text-base"
          rows={1}
        />

        <Button
          onClick={isStreaming ? onStop : handleSend}
          disabled={disabled || (!isStreaming && !input.trim() && images.length === 0)}
          size="icon"
          className={`mb-0.5 rounded-full shrink-0 h-8 w-8 mr-1 transition-all ${input.trim() || images.length > 0 || isStreaming ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'
            }`}
        >
          {isStreaming ? (
            <Square className="h-3 w-3 fill-current" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="text-[10px] text-center text-muted-foreground mt-2">
        MyLukeAI는 실수를 할 수 있습니다. 중요한 정보는 확인하세요.
      </div>

      <ImageViewer
        src={previewImage || ''}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  )
}