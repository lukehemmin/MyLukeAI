import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

type AuthenticatedHandler = (
  req: Request,
  userId: string,
  context?: { params: Promise<Record<string, string>> }
) => Promise<Response>

/**
 * API Route를 인증으로 보호하는 HOF (Higher-Order Function)
 * 
 * 사용 예시:
 * export const POST = withAuth(async (req, userId) => { ... });
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: Request, context?: { params: Promise<Record<string, string>> }) => {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return handler(req, session.user.id, context)
  }
}

/**
 * Server Action용 인증 검증 함수
 * 
 * 사용 예시:
 * const userId = await requireAuth();
 */
export async function requireAuth(): Promise<string> {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  return session.user.id
}