import { Message } from '@/types/chat'
import { ThinkingBubble } from './ThinkingBubble'

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
  if (!message.content && !message.reasoning) return null

  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-prose rounded-lg px-3 py-2 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <div className="whitespace-pre-wrap break-words text-sm">
          {message.reasoning && <ThinkingBubble content={message.reasoning} />}
          {message.content}
        </div>
      </div>
    </div>
  )
}
