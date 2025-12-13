'use client'

import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'

export function AdminHeader() {
    return (
        <div className="absolute top-6 right-6 z-50">
            <Link
                href="/"
                className="block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-full transition-all"
                title="채팅으로 돌아가기"
            >
                <XMarkIcon className="w-6 h-6" />
            </Link>
        </div>
    )
}
