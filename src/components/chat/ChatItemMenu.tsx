'use client'

import { useState } from 'react'
import { MoreHorizontal, Pin, PinOff, Archive, Trash2, Share, Edit2, ArchiveRestore } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
    shareConversation,
    renameConversation,
    togglePinConversation,
    toggleArchiveConversation,
    deleteConversation
} from '@/lib/actions/conversation'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ChatItemMenuProps {
    conversationId: string
    title: string
    isPinned: boolean
    isArchived: boolean
    isShared: boolean
    onDelete?: () => void
}

export function ChatItemMenu({
    conversationId,
    title,
    isPinned,
    isArchived,
    isShared,
    onDelete
}: ChatItemMenuProps) {
    const { toast } = useToast()
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
    const [newTitle, setNewTitle] = useState(title)
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
    const [shareUrl, setShareUrl] = useState('')

    const handlePin = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await togglePinConversation(conversationId)
            toast({
                description: isPinned ? '고정이 해제되었습니다.' : '상단에 고정되었습니다.',
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                description: '작업 실패'
            })
        }
    }

    const handleArchive = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await toggleArchiveConversation(conversationId)
            toast({
                description: isArchived ? '보관이 해제되었습니다.' : '보관함으로 이동되었습니다.',
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                description: '작업 실패'
            })
        }
    }

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            const result = await shareConversation(conversationId)
            if (result.success) {
                setShareUrl(`${window.location.origin}/share/${conversationId}`)
                setIsShareDialogOpen(true)
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                description: '공유 링크 생성 실패'
            })
        }
    }

    const handleRename = async () => {
        try {
            await renameConversation(conversationId, newTitle)
            setIsRenameDialogOpen(false)
            toast({
                description: '이름이 변경되었습니다.'
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                description: '이름 변경 실패'
            })
        }
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('정말 삭제하시겠습니까?')) return

        try {
            if (onDelete) {
                onDelete()
            }
            await deleteConversation(conversationId)
            toast({
                description: '대화가 삭제되었습니다.'
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                description: '삭제 실패'
            })
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">메뉴</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={handleShare}>
                        <Share className="mr-2 h-4 w-4" />
                        <span>공유하기</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsRenameDialogOpen(true); }}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        <span>이름 변경</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePin}>
                        {isPinned ? <PinOff className="mr-2 h-4 w-4" /> : <Pin className="mr-2 h-4 w-4" />}
                        <span>{isPinned ? '고정 해제' : '상단 고정'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleArchive}>
                        {isArchived ? <ArchiveRestore className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
                        <span>{isArchived ? '보관 해제' : '보관하기'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>삭제</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>채팅방 이름 변경</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="name" className="text-right">
                            이름
                        </Label>
                        <Input
                            id="name"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsRenameDialogOpen(false)}>취소</Button>
                        <Button onClick={handleRename}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>채팅방 공유</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                            아래 링크를 복사하여 다른 사람과 이 대화를 공유할 수 있습니다.
                        </p>
                        <div className="flex gap-2">
                            <Input value={shareUrl} readOnly />
                            <Button onClick={() => {
                                navigator.clipboard.writeText(shareUrl)
                                toast({
                                    description: '링크가 복사되었습니다.'
                                })
                            }}>
                                복사
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
