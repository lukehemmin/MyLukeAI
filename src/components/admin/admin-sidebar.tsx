'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  KeyIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CogIcon,
  HomeIcon,
  ServerStackIcon
} from '@heroicons/react/24/outline'

const sidebarItems = [
  {
    name: '대시보드',
    href: '/admin',
    icon: HomeIcon
  },
  {
    name: 'API 키 관리',
    href: '/admin/keys',
    icon: KeyIcon
  },
  {
    name: '사용 통계',
    href: '/admin/stats',
    icon: ChartBarIcon
  },
  {
    name: '감사 로그',
    href: '/admin/audit-logs',
    icon: ShieldCheckIcon
  },
  {
    name: '모델 관리',
    href: '/admin/models',
    icon: ServerStackIcon
  },
  {
    name: '시스템 상태',
    href: '/admin/system',
    icon: ServerStackIcon
  },
  {
    name: '설정',
    href: '/admin/settings',
    icon: CogIcon
  }
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">관리자</h1>
        <p className="text-sm text-gray-600 mt-1">MyLukeAI 관리</p>
      </div>
      
      <nav className="mt-6">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}