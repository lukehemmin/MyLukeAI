'use client'

import { ModelSelector } from './ModelSelector'
import { TokenCounter } from './TokenCounter'
import { StopCircle, PanelLeftOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import { Menu } from 'lucide-react'
import { ModelConfig } from '@/types/chat'

interface ChatHeaderProps {
  currentModel: string
  onModelChange: (modelId: string) => void
  totalTokens?: number
  isStreaming?: boolean
  onStopStreaming?: () => void
  models: ModelConfig[]
}

export function ChatHeader({
  currentModel,
  onModelChange,
  totalTokens,
  isStreaming,
  onStopStreaming,
  models
}: ChatHeaderProps) {
  const currentModelConfig = models.find(m => m.id === currentModel)
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <div className="flex items-center justify-between p-2 lg:p-4 bg-background/95 backdrop-blur z-10 sticky top-0">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={`text-muted-foreground ${sidebarOpen ? 'lg:hidden' : ''}`}
          title={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
        >
          {sidebarOpen ? <Menu className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
        <div className="lg:hidden font-semibold text-sm">MyLukeAI</div>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2 max-w-xs w-full justify-center">
          <ModelSelector
            value={currentModel}
            onChange={onModelChange}
            models={models}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 min-w-[40px] justify-end">


        {typeof totalTokens === 'number' && (
          <div className="hidden sm:block">
            <TokenCounter usedTokens={totalTokens} maxTokens={128000} />
          </div>
        )}
      </div>
    </div>
  )
}
