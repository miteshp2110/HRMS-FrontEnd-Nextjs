"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HeadcountTrendsChartProps {
  data: Array<{ month: string; headcount: number }>
}

export function HeadcountTrendsChart({ data }: HeadcountTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Headcount Trends</CardTitle>
        <CardDescription>Employee count over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="headcount" stroke="#8884d8" strokeWidth={2} dot={{ fill: "#8884d8" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
