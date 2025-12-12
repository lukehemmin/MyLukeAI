import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Github, AlertCircle } from 'lucide-react'

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams
  const error = searchParams.error
  let errorMessage = ''

  if (error === 'InvalidCheck') {
    errorMessage = '이미 로그인 중이거나 유효하지 않은 요청입니다. 다시 시도해주세요.'
  } else if (error) {
    errorMessage = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">MyLukeAI</h1>
          <p className="text-muted-foreground mt-2">로그인하여 시작하세요</p>
        </div>

        {errorMessage && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form
          action={async () => {
            'use server'
            await signIn('github', { redirectTo: '/' })
          }}
        >
          <Button type="submit" className="w-full" size="lg">
            <Github className="mr-2 h-5 w-5" />
            GitHub로 로그인
          </Button>
        </form>
      </div>
    </div>
  )
}