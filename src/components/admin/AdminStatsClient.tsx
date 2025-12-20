'use client'

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

interface AdminStatsClientProps {
  data: {
    modelStats: { name: string; value: number }[]
    dailyStats: any[]
    userStats: any[]
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AdminStatsClient({ data }: AdminStatsClientProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>총 토큰 사용량 (모델별)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data.modelStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.modelStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.modelStats.map((entry, index) => (
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
            <CardTitle>사용자별 상세 통계 (Top 50)</CardTitle>
            <CardDescription>
              토큰 사용량이 많은 순서대로 표시됩니다.
            </CardDescription>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.userStats.length > 0 ? (
                    data.userStats.map((user, index) => (
                      <TableRow key={user.userId}>
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        데이터가 없습니다.
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
