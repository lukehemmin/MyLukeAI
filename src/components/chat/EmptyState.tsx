'use client'

import { Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EXAMPLE_PROMPTS } from '@/lib/constants/prompts'

interface EmptyStateProps {
  onPromptClick: (prompt: string) => void
}

export function EmptyState({ onPromptClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <div className="bg-background p-4 rounded-full shadow-sm inline-block mb-2 border">
            <Bot className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">MyLukeAI</h1>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          도움이 필요하신가요? 아래 예시를 선택하거나 직접 입력해주세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
        {EXAMPLE_PROMPTS.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-4 px-4 justify-start text-left bg-card hover:bg-accent/50 border-muted hover:border-primary/20 transition-all shadow-sm"
            onClick={() => onPromptClick(prompt.text)}
          >
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{prompt.text}</span>
                {/* Optional: Add a description or category if available in prompt object */}
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}