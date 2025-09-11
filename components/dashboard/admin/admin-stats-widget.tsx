"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, XCircle, Clock, CalendarOff } from "lucide-react"

interface AdminStatsWidgetProps {
  headcount: number;
  todayAttendance: {
    present: number;
    absent: number;
    leave: number;
    late: number;
  };
}

export function AdminStatsWidget({ headcount, todayAttendance }: AdminStatsWidgetProps) {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Today's Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div className="p-4 bg-muted rounded-lg">
          <Users className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
          <p className="text-2xl font-bold">{headcount}</p>
          <p className="text-xs text-muted-foreground">Total Employees</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <CheckCircle className="h-6 w-6 mx-auto text-green-500 mb-2" />
          <p className="text-2xl font-bold">{todayAttendance.present}</p>
          <p className="text-xs text-muted-foreground">Present</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <XCircle className="h-6 w-6 mx-auto text-red-500 mb-2" />
          <p className="text-2xl font-bold">{todayAttendance.absent}</p>
          <p className="text-xs text-muted-foreground">Absent</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <Clock className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
          <p className="text-2xl font-bold">{todayAttendance.late}</p>
          <p className="text-xs text-muted-foreground">Late</p>
        </div>
        <div className="p-4 bg-muted rounded-lg">
          <CalendarOff className="h-6 w-6 mx-auto text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{todayAttendance.leave}</p>
          <p className="text-xs text-muted-foreground">On Leave</p>
        </div>
      </CardContent>
    </Card>
  )
}