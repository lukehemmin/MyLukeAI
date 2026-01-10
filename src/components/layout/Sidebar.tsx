'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, MessageSquare, Menu, Settings, LogOut, User as UserIcon, PanelLeftClose, Shield, Trash2, Pin, Archive, PinOff, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import { ThemeToggle } from '@/components/theme-toggle'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { SettingsModal } from '@/components/settings/SettingsModal'
import { ChatItemMenu } from '@/components/chat/ChatItemMenu'
import { getArchivedConversations, reorderConversations, togglePinConversation, toggleArchiveConversation, deleteConversation, shareConversation, renameConversation } from '@/lib/actions/conversation'
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal'
import { TrashModal } from '@/components/modals/TrashModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModelConfig } from '@/types/chat'

interface Conversation {
  id: string
  title: string
  updatedAt: Date
  isPinned: boolean
  isArchived: boolean
  isShared: boolean
  orderIndex?: number
}

interface SidebarProps {
  conversations: Conversation[]
  currentConversationId?: string
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
  models?: ModelConfig[]
  userDefaultModelId?: string | null
}

// Sortable Item Component
function SortableChatItem({ conversation, currentConversationId, onSelect, onUpdate }: {
  conversation: Conversation,
  currentConversationId?: string,
  onSelect: (id: string) => void,
  onUpdate: () => void // Callback to refresh local state if needed (mainly for context menu actions)
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: conversation.id, data: { ...conversation } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto'
  }

  const { toast } = useToast()

  // Local state for dialogs
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(conversation.title)

  const handlePin = async () => {
    try {
      await togglePinConversation(conversation.id)
    } catch { toast({ variant: 'destructive', description: '작업 실패' }) }
  }

  const handleArchive = async () => {
    try {
      await toggleArchiveConversation(conversation.id)
    } catch { toast({ variant: 'destructive', description: '작업 실패' }) }
  }

  const handleDelete = async () => {
    // Check for "Don't ask again" preference
    const confirmedUntil = localStorage.getItem('deleteActionConfirmedUntil')
    if (confirmedUntil && new Date(confirmedUntil) > new Date()) {
      await performDelete()
      return
    }

    setIsDeleteDialogOpen(true)
  }

  const performDelete = async () => {
    try {
      await deleteConversation(conversation.id)
    } catch { toast({ variant: 'destructive', description: '삭제 실패' }) }
  }

  const handleRename = async () => {
    try {
      await renameConversation(conversation.id, newTitle)
      setIsRenameDialogOpen(false)
    } catch { toast({ variant: 'destructive', description: '이름 변경 실패' }) }
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            onClick={() => onSelect(conversation.id)}
            className={`
              w-full text-left px-3 py-2.5 rounded-lg group transition-all duration-200
              flex items-center gap-2 cursor-pointer relative
              ${currentConversationId === conversation.id
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}
          `}
            {...listeners} // Apply listeners here for drag interaction
          >
            {conversation.isPinned ? (
              <Pin className="h-4 w-4 shrink-0 rotate-45 text-orange-400" />
            ) : (
              <MessageSquare className="h-4 w-4 shrink-0" />
            )}

            <div className="flex-1 min-w-0 pr-6">
              <div className="text-sm truncate leading-none mb-1">{conversation.title}</div>
              <div className="text-[10px] opacity-70 truncate">
                {new Date(conversation.updatedAt).toLocaleDateString('ko-KR')}
              </div>
            </div>

            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={(e) => e.stopPropagation()}>
              <ChatItemMenu
                conversationId={conversation.id}
                title={conversation.title}
                isPinned={conversation.isPinned}
                isArchived={conversation.isArchived}
                isShared={conversation.isShared}
              />
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={handlePin}>
            {conversation.isPinned ? <PinOff className="mr-2 h-4 w-4" /> : <Pin className="mr-2 h-4 w-4" />}
            {conversation.isPinned ? '고정 해제' : '상단 고정'}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setIsRenameDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            이름 변경
          </ContextMenuItem>
          <ContextMenuItem onClick={handleArchive}>
            <Archive className="mr-2 h-4 w-4" />
            {conversation.isArchived ? '보관 해제' : '보관하기'}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>채팅방 이름 변경</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor={`rename-${conversation.id}`} className="text-right">이름</Label>
            <Input id={`rename-${conversation.id}`} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsRenameDialogOpen(false)}>취소</Button>
            <Button onClick={handleRename}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={performDelete}
      />
    </>
  )
}

export function Sidebar({
  conversations: initialConversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  user,
  models,
  userDefaultModelId
}: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const isMobile = useIsMobile()
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isArchivedOpen, setIsArchivedOpen] = useState(false)
  const [isTrashOpen, setIsTrashOpen] = useState(false)
  const [archivedConversations, setArchivedConversations] = useState<Conversation[]>([])

  // Need to manage order locally for DnD
  const [pinnedConversations, setPinnedConversations] = useState<Conversation[]>([])
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([])
  const [activeDragId, setActiveDragId] = useState<string | null>(null)

  // @ts-ignore
  const currentUser = session?.user || user

  useEffect(() => {
    // Separate pinned and recent
    const pinned = initialConversations.filter(c => c.isPinned).sort((a, b) => ((a.orderIndex || 0) - (b.orderIndex || 0)) || (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
    // Recent items: Sort by orderIndex first (if manually moved), then fallback to updatedAt
    const recent = initialConversations.filter(c => !c.isPinned).sort((a, b) => ((a.orderIndex || 0) - (b.orderIndex || 0)) || (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))

    setPinnedConversations(pinned)
    setRecentConversations(recent)
  }, [initialConversations])

  useEffect(() => {
    if (searchParams.get('openSettings')) {
      setIsSettingsOpen(true)
    }
  }, [searchParams])

  // Sidebar Resizing Logic
  const [sidebarWidth, setSidebarWidth] = useState(260)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarWidthRef = useRef(sidebarWidth)

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebar-width')
    if (savedWidth) {
      const width = parseInt(savedWidth, 10)
      setSidebarWidth(width)
      sidebarWidthRef.current = width
    }
  }, [])

  useEffect(() => {
    sidebarWidthRef.current = sidebarWidth
  }, [sidebarWidth])

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const stopResizing = useCallback(() => {
    setIsResizing(false)
    localStorage.setItem('sidebar-width', sidebarWidthRef.current.toString())
  }, [])

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX
      if (newWidth >= 200 && newWidth <= 480) {
        setSidebarWidth(newWidth)
      }
    }
  }, [isResizing])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    } else {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  useEffect(() => {
    if (isArchivedOpen) {
      getArchivedConversations().then(setArchivedConversations)
    }
  }, [isArchivedOpen])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      // Find which list the active item belongs to
      const isPinned = pinnedConversations.some(c => c.id === active.id)

      if (isPinned) {
        const oldIndex = pinnedConversations.findIndex((item) => item.id === active.id)
        const newIndex = pinnedConversations.findIndex((item) => item.id === over?.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(pinnedConversations, oldIndex, newIndex)
          setPinnedConversations(newItems)

          // 서버 액션 호출은 setState 이후에 수행
          const updates = newItems.map((item, index) => ({
            id: item.id,
            orderIndex: index
          }))
          reorderConversations(updates).catch(err => console.error("Failed to reorder pinned", err))
        }
      } else {
        const oldIndex = recentConversations.findIndex((item) => item.id === active.id)
        const newIndex = recentConversations.findIndex((item) => item.id === over?.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(recentConversations, oldIndex, newIndex)
          setRecentConversations(newItems)

          // 서버 액션 호출은 setState 이후에 수행
          const updates = newItems.map((item, index) => ({
            id: item.id,
            orderIndex: index
          }))
          reorderConversations(updates).catch(err => console.error("Failed to reorder recent", err))
        }
      }
    }
    setActiveDragId(null)
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bg-[hsl(var(--sidebar-background))] border-r 
          transform flex flex-col group
          ${isResizing ? 'transition-none' : 'transition-all duration-300 ease-in-out'}
          lg:relative
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:border-none lg:overflow-hidden'}
        `}
        style={{ width: sidebarOpen && !isMobile ? `${sidebarWidth}px` : undefined }}
      >
        {/* Resize Handle */}
        <div
          className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors z-50 opacity-0 group-hover:opacity-100 hidden lg:block"
          onMouseDown={startResizing}
        />
        {/* Header / New Chat */}
        <div className="p-3 border-b border-border/50 flex items-center gap-2">
          <Button
            onClick={onNewConversation}
            className="flex-1 justify-start h-10 px-3 bg-background border hover:bg-accent text-foreground shadow-sm"
            variant="ghost"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">새 채팅</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-10 w-10 text-muted-foreground hover:text-foreground hidden lg:flex"
            title="사이드바 닫기"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Pinned Section */}
            {pinnedConversations.length > 0 && (
              <div className="mb-4">
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  <span>Pinned</span>
                </div>
                <SortableContext items={pinnedConversations.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {pinnedConversations.map(conversation => (
                    <SortableChatItem
                      key={conversation.id}
                      conversation={conversation}
                      currentConversationId={currentConversationId}
                      onSelect={onSelectConversation}
                      onUpdate={() => { }}
                    />
                  ))}
                </SortableContext>
              </div>
            )}

            {/* Recent Section */}
            <div className="mb-2">
              {pinnedConversations.length > 0 && <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">Recent</div>}
              {recentConversations.length === 0 && pinnedConversations.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-8">
                  대화 내역이 없습니다.
                </div>
              ) : (
                <SortableContext items={recentConversations.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {recentConversations.map(conversation => (
                    <SortableChatItem
                      key={conversation.id}
                      conversation={conversation}
                      currentConversationId={currentConversationId}
                      onSelect={onSelectConversation}
                      onUpdate={() => { }}
                    />
                  ))}
                </SortableContext>
              )}
            </div>

            {/* Drag Overlay for smooth visual */}
            <DragOverlay>
              {activeDragId ? (
                <div className="w-full bg-accent/90 p-3 rounded-lg shadow-lg opacity-90 border">
                  <div className="font-medium text-sm">이동 중...</div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* User / Settings Footer */}
        <div className="p-3 border-t border-border/50 bg-[hsl(var(--sidebar-background))]">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-muted-foreground">MyLukeAI</span>
            <ThemeToggle />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors group">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden relative">
                  {currentUser?.image ? (
                    <Image
                      src={currentUser.image}
                      alt={currentUser.name || 'User'}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{currentUser?.name || '사용자'}</div>
                  <div className="text-xs text-muted-foreground truncate">{currentUser?.email || 'user@example.com'}</div>
                </div>
                <Settings className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px]">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {currentUser?.role === 'admin' && (
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>관리자 대시보드</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setIsTrashOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>휴지통</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsArchivedOpen(true)}>
                <Archive className="mr-2 h-4 w-4" />
                <span>보관된 채팅 ({archivedConversations.length > 0 ? archivedConversations.length : ''})</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>설정</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={async () => {
                try {
                  await import('@/lib/actions/two-factor').then(mod => mod.clear2FACookie())
                } catch (e) {
                  console.error('Failed to clear 2FA cookie', e)
                } finally {
                  signOut()
                }
              }}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu button */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        models={models}
        userDefaultModelId={userDefaultModelId}
      />

      {/* Archived Chats Dialog */}
      <Dialog open={isArchivedOpen} onOpenChange={setIsArchivedOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>보관된 채팅</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-2">
            {archivedConversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                보관된 채팅이 없습니다.
              </div>
            ) : (
              archivedConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="w-full text-left px-4 py-3 rounded-lg border hover:bg-accent flex items-center gap-3 cursor-pointer group"
                  onClick={() => {
                    setIsArchivedOpen(false)
                    onSelectConversation(conversation.id)
                  }}
                >
                  <Archive className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{conversation.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(conversation.updatedAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChatItemMenu
                      conversationId={conversation.id}
                      title={conversation.title}
                      isPinned={conversation.isPinned}
                      isArchived={conversation.isArchived}
                      isShared={conversation.isShared}
                      onDelete={() => {
                        setArchivedConversations(prev => prev.filter(c => c.id !== conversation.id))
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <TrashModal
        open={isTrashOpen}
        onOpenChange={setIsTrashOpen}
      />
    </>
  )
}
