import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // 1. 세션 토큰 확인 (로그인 여부)
    // NextAuth v5 기본 쿠키 이름들
    const sessionToken = req.cookies.get('authjs.session-token')?.value ||
        req.cookies.get('__Secure-authjs.session-token')?.value ||
        req.cookies.get('next-auth.session-token')?.value ||
        req.cookies.get('__Secure-next-auth.session-token')?.value

    const isLoggedIn = !!sessionToken

    const isOnDashboard = pathname.startsWith('/dashboard') || pathname === '/'
    const isOnVerify2FA = pathname.startsWith('/verify-2fa')
    const isOnLogin = pathname.startsWith('/login')

    // 2. 비로그인 접근 제어
    if (!isLoggedIn) {
        if (isOnDashboard || isOnVerify2FA) {
            return NextResponse.redirect(new URL('/login', req.nextUrl))
        }
        return NextResponse.next()
    }

    // 3. 2FA 상태 확인 (쿠키 기반)
    // DB의 twoFactorEnabled 여부는 미들웨어에서 알 수 없음 (Edge Runtime DB 접근 불가)
    // 따라서 로그인 된 사용자는 일단 통과시키되,
    // 클라이언트나 페이지 레벨에서 2FA가 필요한데 안된 경우를 처리해야 할 수도 있음.
    // 하지만 여기서는 'mylukeai.2fa-verified' 쿠키가 없으면 2FA 페이지로 보내는 로직을 넣을 수 있음.

    // 다만, '2FA를 사용하지 않는 유저'도 2FA 쿠키가 없을 것이므로,
    // "모든 유저를 2FA 페이지로 보내는 문제"가 발생할 수 있음.

    // 해결책:
    // 2FA가 필요한 유저인지 미들웨어에서 알법은 없음.
    // 따라서 미들웨어에서는 "이미 2FA 완료된 유저가 2FA 페이지에 못 가게" 막거나,
    // "2FA 페이지에서 인증 유효 쿠키를 굽도록" 하는 역할에 집중.

    // 이슈: 사용자가 2FA 설정 유저인지 모르면 강제 리다이렉트를 못함.
    // 타협: 미들웨어는 "보안(비로그인 차단)"에 집중하고, 2FA 강제 리다이렉트는 
    // Client Component(Layout)이나 Server Component에서 처리하는 것이 안전함.
    // 하지만, 이전 구현(auth 객체 사용)에서는 세션 정보를 알 수 있었음.

    // 수정된 전략:
    // 미들웨어는 로그인 여부만 체크하여 /login 리다이렉트 수행.
    // 2FA 리다이렉트는 App Layout이나 각 페이지의 Server Component에서 수행.
    // (/verify-2fa 페이지 진입 시 이미 인증되었으면 메인으로 보내는 건 쿠키로 가능)

    const is2FAVerified = req.cookies.get('mylukeai.2fa-verified')?.value === 'true'

    if (isOnVerify2FA && is2FAVerified) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    if (isOnLogin) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    const response = NextResponse.next()
    response.headers.set('x-pathname', pathname)
    return response
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
