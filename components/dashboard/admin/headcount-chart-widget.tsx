"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface HeadcountChartWidgetProps {
  data: { month: string; headcount: number }[]
}

export function HeadcountChartWidget({ data }: HeadcountChartWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Headcount Trends</CardTitle>
        <CardDescription>Employee headcount over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                <Tooltip cursor={{ fill: 'transparent' }}/>
                <Bar dataKey="headcount" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}