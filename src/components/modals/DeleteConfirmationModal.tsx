'use client'

import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface DeleteConfirmationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

export function DeleteConfirmationModal({
    open,
    onOpenChange,
    onConfirm,
}: DeleteConfirmationModalProps) {
    const [dontAskAgain, setDontAskAgain] = useState(false)

    const handleConfirm = () => {
        if (dontAskAgain) {
            const expirationDate = new Date()
            expirationDate.setHours(expirationDate.getHours() + 1)
            localStorage.setItem('deleteActionConfirmedUntil', expirationDate.toISOString())
        }
        onConfirm()
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>채팅을 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                        이 채팅은 휴지통으로 이동하며, 영구 삭제되기 전까지 복원할 수 있습니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex items-center space-x-2 py-4">
                    <Checkbox
                        id="dont-ask"
                        checked={dontAskAgain}
                        onCheckedChange={(checked) => setDontAskAgain(checked === true)}
                    />
                    <Label htmlFor="dont-ask" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        1시간 동안 다시 묻지 않기
                    </Label>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onOpenChange(false)}>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        삭제
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
