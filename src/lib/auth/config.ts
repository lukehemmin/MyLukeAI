import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [
        // Providers are configured in the main auth file for Node.js environment
        // For middleware, we only need the configuration that doesn't depend on Node.js modules
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname === '/'
            const isOnVerify2FA = nextUrl.pathname.startsWith('/verify-2fa')

            // Middleware logic moved here or kept in middleware.ts?
            // Keeping generic authorized logic here is good practice, 
            // but we implemented custom logic in middleware.ts.
            // We will just return true here and let middleware.ts handle the redirects
            // to avoid conflict/duplication, or we can move logic here.
            // For now, let's keep it simple and return true, relying on middleware.ts

            return true
        },
        async session({ session, user, token }) {
            // Note: In middleware (Edge), we might not have access to database session details
            // if using 'database' strategy without the adapter being present in this config.
            // However, the `token` might be available if using JWT.
            // If we are using database sessions, `auth` object in middleware might be limited.

            return session
        },
    },
} satisfies NextAuthConfig
