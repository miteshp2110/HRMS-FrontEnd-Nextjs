"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LeaveBalance {
  id: number
  leave_type_name: string
  balance: number
}

interface LeaveBalanceChartProps {
  data: LeaveBalance[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function LeaveBalanceChart({ data }: LeaveBalanceChartProps) {
  const chartData = data.map((item) => ({
    name: item.leave_type_name,
    value: item.balance,
  }))

  const totalLeaves = data.reduce((sum, item) => sum + item.balance, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Leave Balance</CardTitle>
        <CardDescription>Available leave days by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold">{totalLeaves}</p>
          <p className="text-sm text-muted-foreground">Total available days</p>
        </div>
      </CardContent>
    </Card>
  )
}
