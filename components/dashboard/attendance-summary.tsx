import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react"

interface AttendanceRecord {
  attendance_status: "present" | "absent" | "leave" | "late"
  hours_worked: number
}

interface AttendanceSummaryProps {
  data: AttendanceRecord[]
}

export function AttendanceSummary({ data }: AttendanceSummaryProps) {
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" })

  const summary = (data || []).reduce(
    (acc, record) => {
      if (record.attendance_status in acc) {
        acc[record.attendance_status]++;
      }
      acc.totalHours += record.hours_worked || 0;
      return acc;
    },
    { present: 0, late: 0, absent: 0, leave: 0, totalHours: 0 }
  );
  

  const totalWorkingDays = summary.present + summary.late + summary.absent;
  const attendanceRate = totalWorkingDays > 0 ? ((summary.present + summary.late) / totalWorkingDays) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          My Attendance Summary
        </CardTitle>
        <CardDescription>{currentMonth}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">Present Days</p>
              <p className="text-2xl font-bold text-green-600">{summary.present}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Late Days</p>
              <p className="text-2xl font-bold text-orange-600">{summary.late}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-sm font-medium">Absent Days</p>
              <p className="text-2xl font-bold text-red-600">{summary.absent}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Leave Days</p>
              <p className="text-2xl font-bold text-blue-600">{summary.leave}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Attendance Rate</span>
            <Badge variant={attendanceRate >= 90 ? "default" : attendanceRate >= 80 ? "secondary" : "destructive"}>
              {attendanceRate.toFixed(1)}%
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Hours</span>
            <span className="text-sm font-bold">{summary.totalHours}h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}