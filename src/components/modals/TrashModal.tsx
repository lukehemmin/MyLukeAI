'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, RotateCcw, X } from 'lucide-react'
import { getTrashConversations, restoreConversation, permanentDeleteConversation } from '@/lib/actions/conversation'
import { toast } from '@/components/ui/use-toast'

interface TrashModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface Conversation {
    id: string
    title: string
    deletedAt: Date | string | null
    updatedAt: Date | string
}

export function TrashModal({ open, onOpenChange }: TrashModalProps) {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const loadTrash = async () => {
        setIsLoading(true)
        try {
            const data = await getTrashConversations()
            setConversations(data)
        } catch (error) {
            console.error('Failed to load trash:', error)
            toast({ variant: 'destructive', description: '휴지통을 불러오는데 실패했습니다.' })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (open) {
            loadTrash()
        }
    }, [open])

    const handleRestore = async (id: string) => {
        try {
            await restoreConversation(id)
            setConversations(prev => prev.filter(c => c.id !== id))
            toast({ description: '채팅이 복원되었습니다.' })
        } catch (error) {
            toast({ variant: 'destructive', description: '복원 실패' })
        }
    }

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('정말 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return

        try {
            await permanentDeleteConversation(id)
            setConversations(prev => prev.filter(c => c.id !== id))
            toast({ description: '채팅이 영구 삭제되었습니다.' })
        } catch (error) {
            toast({ variant: 'destructive', description: '영구 삭제 실패' })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>휴지통</DialogTitle>
                    <DialogDescription>
                        삭제된 채팅은 여기에서 복원하거나 영구적으로 삭제할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-2 min-h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            로딩 중...
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                            <Trash2 className="h-8 w-8 opacity-50" />
                            <p>휴지통이 비어있습니다.</p>
                        </div>
                    ) : (
                        conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <div className="font-medium truncate">{conversation.title}</div>
                                    <div className="text-xs text-muted-foreground flex gap-2">
                                        <span>삭제됨: {new Date(conversation.deletedAt!).toLocaleDateString('ko-KR')}</span>
                                        <span>•</span>
                                        <span>마지막 활동: {new Date(conversation.updatedAt).toLocaleDateString('ko-KR')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRestore(conversation.id)}
                                        title="복원"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-1" />
                                        복원
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive" // destructive variant for permanent delete
                                        onClick={() => handlePermanentDelete(conversation.id)}
                                        title="영구 삭제"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
