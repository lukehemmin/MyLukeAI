/* eslint-disable no-console */
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { initLogger } = await import('@/lib/logger')
        initLogger()

        console.log('[Instrumentation] Registering shutdown handlers...');

        const { prisma } = await import('@/lib/prisma');

        const shutdown = async () => {
            console.log('[Instrumentation] Gracefully shutting down...');
            try {
                await prisma.$disconnect();
                console.log('[Instrumentation] Prisma disconnected.');
                process.exit(0);
            } catch (error) {
                console.error('[Instrumentation] Error during shutdown:', error);
                process.exit(1);
            }
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
}
