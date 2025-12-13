'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, MessageSquare, Menu, X, Settings, LogOut, User as UserIcon, PanelLeftClose, Shield, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import { ThemeToggle } from '@/components/theme-toggle'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { SettingsModal } from '@/components/settings/SettingsModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Conversation {
  id: string
  title: string
  updatedAt: Date
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
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  user
}: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // @ts-ignore
  const currentUser = session?.user || user

  useEffect(() => {
    // URL 파라미터 감지하여 설정 모달 열기
    if (searchParams.get('openSettings')) {
      setIsSettingsOpen(true)
    }
  }, [searchParams])

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // 부모 클릭 방지
    if (!confirm('이 대화를 삭제하시겠습니까?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        // 현재 보고 있던 대화라면 메인으로 이동
        if (currentConversationId === id) {
          router.push('/')
        }

        // 데이터 갱신 (목록 업데이트)
        // 네비게이션과 충돌을 방지하기 위해 약간의 지연 후 실행
        setTimeout(() => {
          router.refresh()
        }, 100)
      }
    } catch (error) {
      console.error('Failed to delete conversation', error)
      alert('대화 삭제 중 오류가 발생했습니다.')
    } finally {
      setDeletingId(null)
    }
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
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[260px] bg-[hsl(var(--sidebar-background))] border-r 
        transform transition-all duration-300 ease-in-out flex flex-col
        lg:relative
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:border-none lg:overflow-hidden'}
      `}>
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
          {conversations.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-8">
              대화 내역이 없습니다.
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`
                    w-full text-left px-3 py-2.5 rounded-lg group transition-all duration-200
                    flex items-center gap-2 cursor-pointer
                    ${currentConversationId === conversation.id
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'}
                    `}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate leading-none mb-1">{conversation.title}</div>
                  <div className="text-[10px] opacity-70 truncate">
                    {new Date(conversation.updatedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  disabled={deletingId === conversation.id}
                  className={`
                    opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md
                    hover:bg-destructive/10 hover:text-destructive
                    ${deletingId === conversation.id ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  title="삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
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
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>설정</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={async () => {
                try {
                  // 2FA 쿠키 삭제 (Server Action)
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

      {/* Mobile menu button - handled in ChatHeader for better UX or kept here for mobile-only access when closed */}
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

      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  )
}
