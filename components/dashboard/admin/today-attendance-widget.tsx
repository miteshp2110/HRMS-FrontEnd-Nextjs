"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"

interface TodayAttendance {
  present: number
  absent: number
  leave: number
  late: number
}

interface TodayAttendanceWidgetProps {
  data: TodayAttendance
}

const chartConfig = {
  present: { label: "Present", color: "#22c55e" },
  absent: { label: "Absent", color: "#ef4444" },
  leave: { label: "On Leave", color: "#3b82f6" },
  late: { label: "Late", color: "#f97316" },
}

export function TodayAttendanceWidget({ data }: TodayAttendanceWidgetProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    status: key,
    value: value,
    fill: chartConfig[key as keyof typeof chartConfig].color,
  }));
  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
        <CardDescription>Live snapshot of company attendance.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" nameKey="status" innerRadius={60} outerRadius={90}>
              {chartData.map((entry) => ( <Cell key={`cell-${entry.status}`} fill={entry.fill} /> ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}