import { Message } from '@/types/chat'
import Image from 'next/image'
import { ThinkingBubble } from './ThinkingBubble'
import { useState } from 'react'
import { ImageViewer } from '@/components/ui/ImageViewer'

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  if (!message.content && !message.reasoning) return null

  const isUser = message.role === 'user'
  const isThinking = message.role === 'assistant' && !message.content

  const renderContent = () => {
    if (typeof message.content === 'string') {
      return message.content
    }
    return message.content.map((part, index) => {
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

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-prose rounded-lg px-3 py-2 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <div className="whitespace-pre-wrap break-words text-sm">
          {message.reasoning && <ThinkingBubble content={message.reasoning} />}
          {renderContent()}
        </div>
      </div>
      <ImageViewer
        src={previewImage || ''}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  )
}
