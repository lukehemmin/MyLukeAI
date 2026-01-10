'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BranchNavigatorProps {
    currentIndex: number   // 현재 형제 중 인덱스 (0-based)
    totalSiblings: number  // 형제 메시지 수
    onNavigate: (direction: 'prev' | 'next') => void
}

export function BranchNavigator({ currentIndex, totalSiblings, onNavigate }: BranchNavigatorProps) {
    if (totalSiblings <= 1) return null

    // 표시: 1-based (1/2, 2/2 등)
    const displayNumber = currentIndex + 1

    const canGoBack = currentIndex > 0
    const canGoForward = currentIndex < totalSiblings - 1

    return (
        <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => onNavigate('prev')}
                disabled={!canGoBack}
                title="이전 버전"
            >
                <ChevronLeft className="h-3 w-3" />
            </Button>
            <span className="min-w-[3ch] text-center">
                {displayNumber}/{totalSiblings}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => onNavigate('next')}
                disabled={!canGoForward}
                title="다음 버전"
            >
                <ChevronRight className="h-3 w-3" />
            </Button>
        </div>
    )
}
