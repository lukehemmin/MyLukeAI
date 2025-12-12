'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateSystemSetting } from '@/lib/actions/admin-features'
import { Loader2 } from "lucide-react"

interface AdminSettingsClientProps {
  initialSettings: Record<string, string>
}

export default function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (key: string, checked: boolean) => {
    const value = String(checked)
    setSettings(prev => ({ ...prev, [key]: value }))
    
    try {
      await updateSystemSetting(key, value)
    } catch (error) {
      console.error(error)
      // Revert on error
      setSettings(prev => ({ ...prev, [key]: String(!checked) }))
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const updates = Array.from(formData.entries())

    try {
      await Promise.all(
        updates.map(([key, value]) => updateSystemSetting(key, value as string))
      )
      alert('설정이 저장되었습니다.')
    } catch (error) {
      console.error(error)
      alert('설정 저장 실패')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>시스템 운영</CardTitle>
          <CardDescription>
            전체 시스템의 운영 모드를 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>회원가입 허용</Label>
              <div className="text-sm text-muted-foreground">
                신규 사용자의 회원가입을 허용합니다.
              </div>
            </div>
            <Switch 
              checked={settings['allow_signup'] === 'true'}
              onCheckedChange={(c) => handleToggle('allow_signup', c)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>점검 모드</Label>
              <div className="text-sm text-muted-foreground">
                일반 사용자의 접근을 차단하고 점검 페이지를 표시합니다.
              </div>
            </div>
            <Switch 
              checked={settings['maintenance_mode'] === 'true'}
              onCheckedChange={(c) => handleToggle('maintenance_mode', c)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>기본 설정</CardTitle>
          <CardDescription>
            시스템의 기본값을 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="system_name">시스템 이름</Label>
              <Input 
                id="system_name" 
                name="system_name" 
                defaultValue={settings['system_name'] || 'MyLukeAI'} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact_email">관리자 이메일</Label>
              <Input 
                id="contact_email" 
                name="contact_email" 
                defaultValue={settings['contact_email'] || ''} 
                placeholder="admin@example.com"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              저장하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
