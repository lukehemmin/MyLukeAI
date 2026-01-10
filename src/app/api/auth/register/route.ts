import { prisma } from '@/lib/prisma/client'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const { email, username, password } = await req.json()

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create User (default role: user)
        const user = await prisma.user.create({
            data: {
                email,
                name: username,
                password: hashedPassword,
                // role is default 'user'
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
