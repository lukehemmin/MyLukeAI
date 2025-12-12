'use client'

import { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { Send, Square, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ChatInputProps {
  onSend: (message: string) => void
  isStreaming: boolean
  onStop: () => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ 
  onSend, 
  isStreaming, 
  onStop, 
  disabled, 
  placeholder = "무엇이든 물어보세요..."
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    
    onSend(trimmed)
    setInput('')
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
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

  return (
    <div className="max-w-3xl mx-auto w-full p-4">
      <div className="relative flex items-end gap-2 p-2 bg-secondary/50 border rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
        
        <Button variant="ghost" size="icon" className="mb-0.5 rounded-full text-muted-foreground hover:text-foreground shrink-0 h-8 w-8 ml-1" disabled>
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
          disabled={disabled || (!isStreaming && !input.trim())}
          size="icon"
          className={`mb-0.5 rounded-full shrink-0 h-8 w-8 mr-1 transition-all ${
             input.trim() || isStreaming ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted'
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
    </div>
  )
}