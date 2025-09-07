"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, TrendingUp } from "lucide-react"
import { type AttendanceRecord, getMyAttendance } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MyAttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()

  useEffect(() => {
    loadAttendanceData()
  }, [])

  const loadAttendanceData = async () => {
    try {
      setLoading(true)
      const data = await getMyAttendance()
      setAttendanceData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500 hover:bg-green-600">Present</Badge>
      case "late":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Late</Badge>
      case "absent":
        return <Badge className="bg-red-500 hover:bg-red-600">Absent</Badge>
      case "leave":
        return <Badge className="bg-blue-500 hover:bg-blue-600">On Leave</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateStats = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const currentMonthData = attendanceData.filter((record) => {
      const recordDate = new Date(record.attendance_date)
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
    })

    const presentDays = currentMonthData.filter((r) => r.attendance_status === "present").length
    const lateDays = currentMonthData.filter((r) => r.attendance_status === "late").length
    const absentDays = currentMonthData.filter((r) => r.attendance_status === "absent").length
    const totalHours = currentMonthData.reduce((sum, r) => sum + r.hours_worked, 0)

    return { presentDays, lateDays, absentDays, totalHours, totalDays: currentMonthData.length }
  }

  const stats = calculateStats()

  const getAttendanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return attendanceData.find((record) => record.attendance_date === dateStr)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground">Track your attendance records and patterns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.presentDays}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Days</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lateDays}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absentDays}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>Click on a date to view attendance details</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    present: (date) => {
                      const record = getAttendanceForDate(date)
                      return record?.attendance_status === "present"
                    },
                    late: (date) => {
                      const record = getAttendanceForDate(date)
                      return record?.attendance_status === "late"
                    },
                    absent: (date) => {
                      const record = getAttendanceForDate(date)
                      return record?.attendance_status === "absent"
                    },
                  }}
                  modifiersStyles={{
                    present: { backgroundColor: "#22c55e", color: "white" },
                    late: { backgroundColor: "#eab308", color: "white" },
                    absent: { backgroundColor: "#ef4444", color: "white" },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Date Details</CardTitle>
                <CardDescription>
                  {selectedDate ? selectedDate.toLocaleDateString() : "Select a date to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate &&
                  (() => {
                    const record = getAttendanceForDate(selectedDate)
                    if (!record) {
                      return <p className="text-muted-foreground">No attendance record for this date</p>
                    }
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Status:</span>
                          {getStatusBadge(record.attendance_status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Punch In:</span>
                          <span>{record.punch_in ? new Date(record.punch_in).toLocaleTimeString() : "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Punch Out:</span>
                          <span>{record.punch_out ? new Date(record.punch_out).toLocaleTimeString() : "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Hours Worked:</span>
                          <span>{record.hours_worked.toFixed(1)} hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Pay Type:</span>
                          <Badge variant="outline">{record.pay_type.replace("_", " ")}</Badge>
                        </div>
                      </div>
                    )
                  })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Records</CardTitle>
              <CardDescription>Your attendance history for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Punch In</TableHead>
                    <TableHead>Punch Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Pay Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData
                    .slice(0, 20)
                    .sort((a, b) => new Date(b.attendance_date).getTime() - new Date(a.attendance_date).getTime())
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.attendance_date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(record.attendance_status)}</TableCell>
                        <TableCell>
                          {record.punch_in ? new Date(record.punch_in).toLocaleTimeString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          {record.punch_out ? new Date(record.punch_out).toLocaleTimeString() : "N/A"}
                        </TableCell>
                        <TableCell>{record.hours_worked.toFixed(1)}h</TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.pay_type.replace("_", " ")}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
