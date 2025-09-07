"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Filter, PartyPopper } from "lucide-react"
import type { AttendanceRecord, Holiday } from "@/lib/api"
import { getEmployeeAttendance, getHolidays } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AttendanceHeatmapProps {
  employeeId: number
}

export function AttendanceHeatmap({ employeeId }: AttendanceHeatmapProps) {
  const { toast } = useToast();
  const [attendanceData, setAttendanceData] = React.useState<AttendanceRecord[]>([]);
  const [holidays, setHolidays] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // Month is 1-indexed for the API
  });

  const fetchAttendanceAndHolidays = React.useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    try {
      // Fetch both attendance and holidays for the selected year
      const [attendance, holidayData] = await Promise.all([
        getEmployeeAttendance(employeeId, year, month),
        getHolidays(year)
      ]);
      
      setAttendanceData(attendance);
      // Create a Set of holiday dates for quick lookups
      const holidaySet = new Set(holidayData.map(h => {
        const date = new Date(h.holiday_date);

        // Extract local parts
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
        const day = String(date.getDate()).padStart(2, "0");
        const formatted = `${year}-${month}-${day}`;
        return formatted
      }));
      setHolidays(holidaySet);
      console.log(holidaySet)

    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load attendance data: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, toast]);

  React.useEffect(() => {
    fetchAttendanceAndHolidays(selectedDate.year, selectedDate.month);
  }, [fetchAttendanceAndHolidays, selectedDate.year, selectedDate.month]);

  // Create a map of dates to attendance status
  const attendanceMap = new Map()
  attendanceData.forEach((record) => {
    const date = new Date(record.attendance_date);

    // Extract local parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(date.getDate()).padStart(2, "0");

    const formatted = `${year}-${month}-${day}`;
    attendanceMap.set(formatted, record.attendance_status)
  })

  const daysInMonth = new Date(selectedDate.year, selectedDate.month, 0).getDate()
  const firstDay = new Date(selectedDate.year, selectedDate.month - 1, 1).getDay()
  const monthName = new Date(selectedDate.year, selectedDate.month - 1).toLocaleString("default", { month: "long" })

  const calendarDays = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    const status = attendanceMap.get(dateString)
    const dayOfWeek = new Date(selectedDate.year, selectedDate.month - 1, day).getDay()
    const isWeekend = dayOfWeek === 0; // Assuming only Sunday is a weekend
    const isHoliday = holidays.has(dateString);

    let finalStatus = "no-data";
    if (isHoliday) {
        finalStatus = "holiday";
    } else if (isWeekend) {
        finalStatus = "weekend";
    } else if (status) {
        finalStatus = status;
    }

    calendarDays.push({
      day,
      date: dateString,
      status: finalStatus,
      isToday: dateString === new Date().toISOString().split("T")[0],
    })
  }

  const getStatusColor = (status: string) => {

    switch (status) {
      case "present": return "bg-green-500 text-white"
      case "late": return "bg-orange-500 text-white"
      case "absent": return "bg-red-500 text-white"
      case "leave": return "bg-blue-500 text-white"
      case "holiday": return "bg-purple-500 text-white"
      case "weekend": return "bg-gray-200 dark:bg-gray-700"
      default: return "bg-gray-100 dark:bg-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "present": return "Present"
      case "late": return "Late"
      case "absent": return "Absent"
      case "leave": return "On Leave"
      case "holiday": return "Holiday"
      case "weekend": return "Weekend"
      default: return "No Data"
    }
  }

  const summary = attendanceData.reduce(
    (acc, record) => {
      acc[record.attendance_status] = (acc[record.attendance_status] || 0) + 1;
      return acc
    },
    { present: 0, late: 0, absent: 0, leave: 0 } as Record<string, number>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Heatmap</CardTitle>
        <CardDescription>Visual representation of attendance patterns.</CardDescription>
        <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="grid gap-2 w-full">
                <Label htmlFor="year-select">Year</Label>
                <Input id="year-select" type="number" value={selectedDate.year} onChange={(e) => setSelectedDate(d => ({...d, year: Number(e.target.value)}))} />
            </div>
            <div className="grid gap-2 w-full">
                <Label htmlFor="month-select">Month</Label>
                <Input id="month-select" type="number" min="1" max="12" value={selectedDate.month} onChange={(e) => setSelectedDate(d => ({...d, month: Number(e.target.value)}))} />
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span>Present ({summary.present || 0})</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div><span>Late ({summary.late || 0})</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span>Absent ({summary.absent || 0})</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span>Leave ({summary.leave || 0})</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span>Holiday</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div><span>Weekend</span></div>
        </div>
        
        {isLoading ? (
             <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
        ) : (
            <div className="space-y-2">
  <h4 className="text-lg font-semibold text-center">
    {monthName} {selectedDate.year}
  </h4>
  <div className="grid grid-cols-7 gap-2 max-w-lg mx-auto">
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
      <div
        key={day}
        className="text-xs font-bold text-center text-muted-foreground"
      >
        {day}
      </div>
    ))}
    {calendarDays.map((day, dayIndex) => (
      <div
        key={dayIndex}
        className={`w-15 h-15 text-xs flex items-center justify-center rounded-md
          ${day ? getStatusColor(day.status) : ""}
          ${day?.isToday ? "ring-2 ring-primary ring-offset-2" : ""}
          ${day ? "cursor-pointer hover:opacity-80" : "bg-transparent"}
        `}
        title={day ? `${day.date}: ${getStatusLabel(day.status)}` : ""}
      >
        {day?.day}
      </div>
    ))}
  </div>
</div>

        )}
      </CardContent>
    </Card>
  )
}