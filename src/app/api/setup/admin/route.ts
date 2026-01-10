import { verifySetupToken } from '@/lib/setup'
import { prisma } from '@/lib/prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const { token, email, name, password } = await req.json()

        // Double check token
        const isValid = await verifySetupToken(token)
        if (!isValid) {
            return NextResponse.json({ success: false, error: 'Invalid setup token' }, { status: 401 })
        }

        // Check if admin already exists (race condition check)
        const adminCount = await prisma.user.count({ where: { role: 'admin' } })
        if (adminCount > 0) {
            return NextResponse.json({ success: false, error: 'Setup already completed' }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create Admin User
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'admin',
                emailVerified: new Date(),
            },
        })

        // Delete setup token so it can't be used again
        await prisma.systemSetting.delete({
            where: { key: 'setup_token' },
        })

        return NextResponse.json({ success: true, user })
    } catch (error) {
        console.error('Admin creation error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
