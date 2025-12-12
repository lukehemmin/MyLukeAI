'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { verify2FALogin } from '@/lib/actions/two-factor'
import { Loader2, ShieldCheck } from 'lucide-react'

function Verify2FAForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) return

    setIsLoading(true)
    setError('')

    try {
      await verify2FALogin(code)
      // 성공 시, 강제 리로드를 통해 미들웨어와 세션을 갱신합니다.
      // router.push() 대신 window.location.href를 사용하면 확실하게 서버 상태를 다시 받아옵니다.
      window.location.href = callbackUrl
    } catch (err: any) {
      setError(err.message || '인증에 실패했습니다.')
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">2단계 인증</CardTitle>
        <CardDescription className="text-center">
          OTP 앱의 6자리 인증 코드를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-center">
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em] w-48 h-12 font-mono"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || code.length !== 6}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            인증하기
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function Verify2FAPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <Verify2FAForm />
      </Suspense>
    </div>
  )
}
