'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import { updatePreferences, deleteAllConversations } from '@/lib/actions/user'
import { generateTwoFactorSecret, enableTwoFactor, disableTwoFactor, getTwoFactorStatus } from '@/lib/actions/two-factor'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ShieldCheck, ShieldAlert, Copy, Check } from 'lucide-react'
import Image from 'next/image'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: string
}

export function SettingsModal({ open, onOpenChange, defaultTab = "general" }: SettingsModalProps) {
  const { theme, setTheme } = useTheme()
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [setupStep, setSetupStep] = useState<'init' | 'qr' | 'verify'>('init')
  const [secret, setSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading2FA, setIsLoading2FA] = useState(false)
  const [error2FA, setError2FA] = useState('')
  const [copied, setCopied] = useState(false)
  const twoFactorSectionRef = useRef<HTMLDivElement>(null)

  // @ts-ignore
  const defaultModel = session?.user?.preferences?.defaultModel || 'gpt-4o-mini'

  useEffect(() => {
    if (open) {
      // 2FA 상태 확인
      checkTwoFactorStatus()
      
      // URL 파라미터에 따른 탭 설정
      if (searchParams.get('settings') === 'account') {
        setActiveTab('account')
        // 2FA 포커스
        if (searchParams.get('focus') === '2fa') {
          setTimeout(() => {
            twoFactorSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
          }, 500)
        }
      }
    }
  }, [open, searchParams])

  const checkTwoFactorStatus = async () => {
    try {
      const status = await getTwoFactorStatus()
      setTwoFactorEnabled(status.enabled)
    } catch (error) {
      console.error('Failed to check 2FA status:', error)
    }
  }

  const handleModelChange = async (value: string) => {
    try {
      await updatePreferences({ defaultModel: value })
      router.refresh()
    } catch (error) {
      console.error('Failed to update preferences:', error)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('정말로 모든 대화 내역을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteAllConversations()
      router.push('/')
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete conversations:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // 2FA Handlers
  const start2FASetup = async () => {
    setIsLoading2FA(true)
    setError2FA('')
    try {
      const data = await generateTwoFactorSecret()
      setSecret(data.secret)
      setQrCodeUrl(data.qrCodeUrl)
      setSetupStep('qr')
    } catch (error) {
      setError2FA('2FA 설정 시작 실패')
    } finally {
      setIsLoading2FA(false)
    }
  }

  const verifyAndEnable2FA = async () => {
    if (!verificationCode) return

    setIsLoading2FA(true)
    setError2FA('')
    try {
      await enableTwoFactor(verificationCode, secret)
      setTwoFactorEnabled(true)
      setSetupStep('init')
      setVerificationCode('')
      // 세션 업데이트 필요할 수 있음
      await updateSession()
    } catch (error: any) {
      setError2FA(error.message || '인증 실패')
    } finally {
      setIsLoading2FA(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!confirm('2단계 인증을 해제하시겠습니까? 계정 보안이 취약해질 수 있습니다.')) return

    setIsLoading2FA(true)
    try {
      await disableTwoFactor()
      setTwoFactorEnabled(false)
      await updateSession()
    } catch (error) {
      console.error('Failed to disable 2FA:', error)
    } finally {
      setIsLoading2FA(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
          <DialogDescription>
            계정 및 애플리케이션 설정을 관리하세요.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">일반</TabsTrigger>
            <TabsTrigger value="account">계정</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>화면 설정</CardTitle>
                <CardDescription>
                  애플리케이션의 테마를 변경합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme">테마</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-[180px]" id="theme">
                      <SelectValue placeholder="테마 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">라이트 모드</SelectItem>
                      <SelectItem value="dark">다크 모드</SelectItem>
                      <SelectItem value="system">시스템 설정</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI 모델 설정</CardTitle>
                <CardDescription>
                  기본으로 사용할 AI 모델을 선택합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="model">기본 모델</Label>
                  <Select value={defaultModel} onValueChange={handleModelChange}>
                    <SelectTrigger className="w-[180px]" id="model">
                      <SelectValue placeholder="모델 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>내 정보</CardTitle>
                <CardDescription>
                  현재 로그인된 계정 정보입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <Label className="text-muted-foreground">이름</Label>
                    <span className="font-medium">{session?.user?.name || '정보 없음'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <Label className="text-muted-foreground">이메일</Label>
                    <span className="font-medium">{session?.user?.email || '정보 없음'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-muted-foreground">권한</Label>
                    <span className="font-medium uppercase">{session?.user?.role || 'USER'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card ref={twoFactorSectionRef} className={twoFactorEnabled ? "border-green-500/50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className={twoFactorEnabled ? "text-green-500" : "text-muted-foreground"} />
                  2단계 인증 (2FA)
                </CardTitle>
                <CardDescription>
                  계정 보안을 강화하기 위해 2단계 인증을 설정합니다. 관리자 계정은 필수입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {twoFactorEnabled ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">2단계 인증이 활성화되어 있습니다.</span>
                    </div>
                    <Button variant="outline" onClick={handleDisable2FA} disabled={isLoading2FA}>
                      {isLoading2FA && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      비활성화
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {setupStep === 'init' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Google Authenticator 등의 OTP 앱을 사용하여 인증할 수 있습니다.
                        </span>
                        <Button onClick={start2FASetup} disabled={isLoading2FA}>
                          {isLoading2FA && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          설정 시작
                        </Button>
                      </div>
                    )}

                    {setupStep === 'qr' && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                        <div className="text-center space-y-2">
                          <Label>1. QR 코드를 스캔하세요</Label>
                          <div className="flex justify-center bg-white p-2 w-fit mx-auto rounded">
                            {qrCodeUrl && (
                              <Image src={qrCodeUrl} alt="2FA QR Code" width={160} height={160} />
                            )}
                          </div>
                        </div>

                        <div className="text-center space-y-2">
                          <Label>또는 코드를 직접 입력하세요</Label>
                          <div className="flex items-center justify-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded">{secret}</code>
                            <Button size="icon" variant="ghost" onClick={copyToClipboard} className="h-8 w-8">
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>2. 인증 코드를 입력하세요</Label>
                          <div className="flex gap-2">
                            <Input
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              placeholder="000000"
                              maxLength={6}
                              className="text-center tracking-widest text-lg"
                            />
                            <Button onClick={verifyAndEnable2FA} disabled={isLoading2FA || verificationCode.length !== 6}>
                              {isLoading2FA && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              확인
                            </Button>
                          </div>
                          {error2FA && <p className="text-sm text-destructive">{error2FA}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">데이터 관리</CardTitle>
                <CardDescription>
                  대화 내역을 관리합니다. 이 작업은 되돌릴 수 없습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAll} 
                  disabled={isDeleting}
                  className="w-full sm:w-auto"
                >
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  모든 대화 내역 삭제
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
