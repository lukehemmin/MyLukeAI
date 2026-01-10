import { verifySetupToken } from '@/lib/setup'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { token } = await req.json()
        if (!token) {
            return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
        }

        const isValid = await verifySetupToken(token)
        if (!isValid) {
            return NextResponse.json({ success: false, error: 'Invalid setup token' }, { status: 401 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Setup verification error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
