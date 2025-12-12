import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { redirect } from 'next/navigation'

/**
 * API Route를 관리자 인증으로 보호하는 HOF (Higher-Order Function)
 * 
 * 사용 예시:
 * export const POST = withAdmin(async (req, userId) => { ... });
 */
export function withAdmin(handler: (req: Request, userId: string, context?: { params: Promise<Record<string, string>> }) => Promise<Response>) {
  return async (req: Request, context?: { params: Promise<Record<string, string>> }) => {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // 관리자 권한 및 2FA 확인
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, twoFactorEnabled: true }
    })
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // 2FA 필수 체크
    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: 'Forbidden: Two-Factor Authentication required for Admin access' },
        { status: 403 }
      )
    }
    
    // 2FA 검증 여부 체크 (세션 레벨)
    if (!session.twoFactorVerified) {
       return NextResponse.json(
        { error: 'Forbidden: Two-Factor Authentication Verification required' },
        { status: 403 }
      )
    }
    
    return handler(req, session.user.id, context)
  }
}

/**
 * Server Action/Component용 관리자 인증 검증 함수
 * 
 * 사용 예시:
 * const userId = await requireAdmin();
 */
export async function requireAdmin(): Promise<string> {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  // 관리자 권한 및 2FA 확인
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, twoFactorEnabled: true }
  })
  
  if (!user || user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  // 2FA 필수 체크 - Server Component에서 redirect 사용
  if (!user.twoFactorEnabled) {
    redirect('/?openSettings=account&focus=2fa&reason=admin_required')
  }

  // 2FA 검증 여부 체크 (세션 레벨)
  if (!session.twoFactorVerified) {
    redirect('/verify-2fa')
  }
  
  return session.user.id
}

/**
 * 사용자가 관리자인지 확인하는 함수
 * 
 * 사용 예시:
 * const isAdmin = await checkIsAdmin(userId);
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })
    
    return user?.role === 'admin'
  } catch (error) {
    console.error('관리자 권한 확인 실패:', error)
    return false
  }
}

/**
 * 관리자 감사 로그를 기록하는 함수
 */
export async function logAdminAction(
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, any>
) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        details: details ? JSON.stringify(details) : null,
        ipAddress: null, // IP 주소는 미들웨어에서 추출 필요
        userAgent: null, // User-Agent는 미들웨어에서 추출 필요
      }
    })
  } catch (error) {
    console.error('감사 로그 기록 실패:', error)
  }
}
