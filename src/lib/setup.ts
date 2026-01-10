import { prisma } from '@/lib/prisma/client'
import { randomBytes } from 'crypto'
/* eslint-disable no-console */


/**
 * Checks if the system has been set up (i.e., has at least one admin user).
 * Returns true if setup is complete.
 */
export async function checkSetupStatus(): Promise<boolean> {
    const adminCount = await prisma.user.count({
        where: { role: 'admin' },
    })
    return adminCount > 0
}

/**
 * Ensures a setup token exists if the system is not setup.
 * Prints the token to the console.
 */
export async function ensureSetupToken() {
    const isSetup = await checkSetupStatus()
    if (isSetup) return

    // Check if token already exists
    let token = await prisma.systemSetting.findUnique({
        where: { key: 'setup_token' },
    })

    if (!token) {
        const newToken = randomBytes(32).toString('hex')
        token = await prisma.systemSetting.create({
            data: {
                key: 'setup_token',
                value: newToken,
                description: 'Temporary setup token for initial admin creation',
            },
        })
        console.log('\n\n==================================================')
        console.log('SETUP REQUIRED')
        console.log('No admin account found.')
        console.log(`Use this token to create the first admin account:`)
        console.log(`\n${newToken}\n`)
        console.log('==================================================\n\n')
    } else {
        // Print existing token on restart
        console.log('\n\n==================================================')
        console.log('SETUP REQUIRED')
        console.log('No admin account found.')
        console.log(`Use this token to create the first admin account:`)
        console.log(`\n${token.value}\n`)
        console.log('==================================================\n\n')
    }
}

/**
 * Verifies if the provided token matches the stored setup token.
 */
export async function verifySetupToken(inputToken: string): Promise<boolean> {
    const storedToken = await prisma.systemSetting.findUnique({
        where: { key: 'setup_token' },
    })

    if (!storedToken) return false
    return storedToken.value === inputToken
}
