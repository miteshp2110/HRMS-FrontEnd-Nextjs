"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CompanyAttendanceChartProps {
  data: {
    presentToday: number
    absentToday: number
    onLeaveToday: number
  }
}

export function CompanyAttendanceChart({ data }: CompanyAttendanceChartProps) {
  const chartData = [
    {
      name: "Today's Status",
      Present: 10,
      Absent: 15,
      "On Leave": 5,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Attendance Today</CardTitle>
        <CardDescription>Current day attendance breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" fill="#22c55e" />
              <Bar dataKey="Absent" fill="#ef4444" />
              <Bar dataKey="On Leave" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
