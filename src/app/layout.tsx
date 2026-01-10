import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyLukeAI',
  description: 'AI 채팅 플랫폼',
}

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // 미들웨어에서 전달한 현재 경로 헤더 확인
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'

  // 2FA 강제 리다이렉트 로직 (Edge Middleware에서 수행 불가하여 여기서 수행)
  if (session?.user?.twoFactorEnabled) {
    const isVerified = (session as any).twoFactorVerified
    const isVerifyPage = pathname.startsWith('/verify-2fa')

    if (!isVerified && !isVerifyPage) {
      redirect('/verify-2fa')
    }
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider session={session}>
          <ThemeProvider defaultTheme="system">
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
