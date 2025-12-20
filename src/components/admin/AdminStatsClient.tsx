'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"

interface AdminStatsClientProps {
  data: {
    modelStats: { name: string; value: number }[]
    dailyStats: any[]
    userStats: any[]
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AdminStatsClient({ data }: AdminStatsClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const handleUserClick = (email: string) => {
    if (!email) return
    router.push(`/admin/logs?search=${encodeURIComponent(email)}`)
  }

  const filteredUsers = data.userStats.filter((user) =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  // Clean up model names for chart (remove potential artifacts like '}')
  const cleanModelStats = data.modelStats.map(stat => ({
    ...stat,
    name: stat.name.replace('}', '').trim()
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>총 토큰 사용량 (모델별)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {cleanModelStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cleanModelStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cleanModelStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                데이터가 없습니다
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>일별 토큰 사용 추이 (최근 7일)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data.dailyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="promptTokens" name="입력 토큰" fill="#8884d8" stackId="a" />
                  <Bar dataKey="completionTokens" name="출력 토큰" fill="#82ca9d" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                데이터가 없습니다
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
              <div>
                <CardTitle>사용자별 상세 통계 (Top 50)</CardTitle>
                <CardDescription>
                  토큰 사용량이 많은 순서대로 표시됩니다. 클릭하여 사용자 대화 로그를 확인할 수 있습니다.
                </CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="이름 또는 이메일 검색"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">순위</TableHead>
                    <TableHead>사용자</TableHead>
                    <TableHead className="text-right">총 토큰</TableHead>
                    <TableHead className="text-right text-muted-foreground hidden md:table-cell">입력 (Prompt)</TableHead>
                    <TableHead className="text-right text-muted-foreground hidden md:table-cell">출력 (Completion)</TableHead>
                    <TableHead className="text-right">최근 활동</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow
                        key={user.userId}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleUserClick(user.email)}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {user.totalTokens.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                          {user.promptTokens.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                          {user.completionTokens.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
