import { ChatError } from '@/types/chat'
import { Button } from '@/components/ui/button'

interface ErrorMessageProps {
  error: ChatError
  onRetry?: () => void
  onClear?: () => void
}

export function ErrorMessage({ error, onRetry, onClear }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3 text-sm">
      <span className="text-destructive">{error.message}</span>
      <div className="flex gap-2">
        {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>다시 시도</Button>}
        {onClear && <Button variant="outline" size="sm" onClick={onClear}>닫기</Button>}
      </div>
    </div>
  )
}
