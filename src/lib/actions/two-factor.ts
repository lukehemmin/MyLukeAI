'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'
import { authenticator } from 'otplib'
import qrcode from 'qrcode'
import { cookies } from 'next/headers'

// 2FA 설정 생성
export async function generateTwoFactorSecret() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.')
  }

  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(
    session.user.email || 'user',
    'MyLukeAI',
    secret
  )
  const qrCodeUrl = await qrcode.toDataURL(otpauth)

  return { secret, qrCodeUrl }
}

// 2FA 활성화
export async function enableTwoFactor(token: string, secret: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.')
  }

  const isValid = authenticator.verify({ token, secret })
  if (!isValid) {
    throw new Error('잘못된 인증 코드입니다.')
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: true,
      twoFactorSecret: secret,
    },
  })

  // 현재 세션도 인증된 것으로 표시
  const result = await verify2FALogin(token)
  if (!result.success) {
    throw new Error(result.error)
  }

  return { success: true }
}

// 2FA 비활성화
export async function disableTwoFactor() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.')
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  })

  return { success: true }
}

// 2FA 상태 조회
export async function getTwoFactorStatus() {
  const session = await auth()
  if (!session?.user?.id) {
    return { enabled: false }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true },
  })

  return { enabled: !!user?.twoFactorEnabled }
}

// 로그인 시 2FA 검증 및 세션 업데이트
export async function verify2FALogin(token: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: '로그인이 필요합니다.' }
  }

  // 사용자 정보 및 시크릿 가져오기
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true, twoFactorSecret: true }
  })

  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    return { success: false, error: '2단계 인증이 활성화되지 않았습니다.' }
  }

  const isValid = authenticator.verify({ token, secret: user.twoFactorSecret })
  if (!isValid) {
    return { success: false, error: '잘못된 인증 코드입니다.' }
  }

  // 세션 찾기 및 업데이트
  // authjs.session-token 쿠키를 사용하여 세션 토큰을 찾습니다.
  // 개발 환경에서는 'authjs.session-token', 프로덕션에서는 '__Secure-authjs.session-token' 일 수 있음
  // NextAuth v5 기본 이름 확인 필요. 보통 'authjs.session-token' 또는 'next-auth.session-token'

  const cookieStore = cookies()
  const sessionToken =
    (await cookieStore).get('authjs.session-token')?.value ||
    (await cookieStore).get('__Secure-authjs.session-token')?.value ||
    (await cookieStore).get('next-auth.session-token')?.value ||
    (await cookieStore).get('__Secure-next-auth.session-token')?.value

  if (!sessionToken) {
    return { success: false, error: '세션을 찾을 수 없습니다.' }
  }

  await prisma.session.update({
    where: { sessionToken },
    data: { twoFactorVerified: true }
  })

  // Middleware에서 2FA 상태를 확인하기 위한 쿠키 설정
  // Edge Runtime에서는 DB 세션을 직접 조회하기 어렵고, NextAuth Auth Object도 제한적이므로
  // 별도의 쿠키를 통해 2FA 완료 여부를 마킹합니다.
  const cookieStoreVal = await cookies()
  cookieStoreVal.set('mylukeai.2fa-verified', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // 세션 만료와 비슷하게 설정 (예: 30일)
    maxAge: 60 * 60 * 24 * 30
  })

  return { success: true }
}

export async function clear2FACookie() {
  const cookieStore = await cookies()
  cookieStore.delete('mylukeai.2fa-verified')
}
