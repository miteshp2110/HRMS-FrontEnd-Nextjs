


"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMyAttendance, getHolidays, type AttendanceRecord, type Holiday } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { CheckCircle, Clock, XCircle, CalendarOff, Star, Building, Timer, TrendingDown, Hourglass, BarChart, CalendarDays, LogOut, UserX, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "recharts"
import { Button } from "@/components/ui/button"

export function MyAttendancePage() {
  const { toast } = useToast()
  const [allRecords, setAllRecords] = React.useState<AttendanceRecord[]>([])
  const [holidays, setHolidays] = React.useState<Map<string, string>>(new Map())
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const recordsMap = React.useMemo(() => {
    return new Map(allRecords.map(r => [r.attendance_date.split('T')[0], r]));
  }, [allRecords]);

  const fetchAttendanceData = React.useCallback(async (year: number) => {
    setIsLoading(true);
    try {
      const [attendance, holidayData] = await Promise.all([
        getMyAttendance(),
        getHolidays(year)
      ]);
      setAllRecords(attendance);
      const holidayMap = new Map(holidayData.map(h => [h.holiday_date.split('T')[0], h.name]));
      setHolidays(holidayMap);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to load attendance data: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchAttendanceData(currentDate.getFullYear());
  }, [currentDate.getFullYear(), fetchAttendanceData]);

  // Filter records for current month only
  const currentMonthRecords = React.useMemo(() => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    return allRecords.filter(record => {
      const recordDate = new Date(record.attendance_date);
      return recordDate.getFullYear() === currentYear && recordDate.getMonth() === currentMonth;
    });
  }, [allRecords, currentDate]);

  const metrics = React.useMemo(() => {
    const totalHours = currentMonthRecords.reduce((sum, r) => sum + Number(r.hours_worked || 0), 0);
    const lossOfPayDays = currentMonthRecords.reduce((sum, r) => {
      if (r.pay_type === 'unpaid') return sum + 1;
      if (r.pay_type === 'half_day') return sum + 0.5;
      return sum;
    }, 0);
   
    const standardShiftDuration = 8;
    const totalOvertimeHours = currentMonthRecords
      .filter(r => r.pay_type === 'overtime' && r.overtime_approved_by !== null)
      .reduce((sum, r) => sum + (Number(r.hours_worked || 0) - standardShiftDuration), 0);

    const pendingOvertimeHours = currentMonthRecords
      .filter(r => r.pay_type === 'overtime' && r.overtime_status === null)
      .reduce((sum, r) => sum + (Number(r.hours_worked || 0) - standardShiftDuration), 0);

    return { totalHours, lossOfPayDays, totalOvertimeHours, pendingOvertimeHours };
  }, [currentMonthRecords]);

  const modifiers = {
    present: (date: Date) => recordsMap.get(date.toISOString().split('T')[0])?.attendance_status === 'present',
    late: (date: Date) => recordsMap.get(date.toISOString().split('T')[0])?.attendance_status === 'late',
    absent: (date: Date) => recordsMap.get(date.toISOString().split('T')[0])?.attendance_status === 'absent',
    leave: (date: Date) => recordsMap.get(date.toISOString().split('T')[0])?.attendance_status === 'leave',
    holiday: (date: Date) => holidays.has(date.toISOString().split('T')[0]),
    approvedOvertime: (date: Date) => {
      const record = recordsMap.get(date.toISOString().split('T')[0]);
      return record?.pay_type === 'overtime' && record?.overtime_approved_by !== null;
    },
    pendingOvertime: (date: Date) => {
      const record = recordsMap.get(date.toISOString().split('T')[0]);
      return record?.pay_type === 'overtime' && record?.overtime_status === null;
    }
  };

  const modifiersClassNames = {
    present: "bg-green-500 text-white hover:bg-green-600 focus:bg-green-600",
    late: "bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-600",
    absent: "bg-red-500 text-white hover:bg-red-600 focus:bg-red-600",
    leave: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
    holiday: "bg-purple-500 text-white hover:bg-purple-600 focus:bg-purple-600",
    approvedOvertime: "relative before:absolute before:inset-0 before:border-4 before:border-emerald-500 before:rounded-full before:pointer-events-none",
    pendingOvertime: "relative before:absolute before:inset-0 before:border-4 before:border-orange-500 before:rounded-full before:pointer-events-none",
  };



  const selectedRecord = recordsMap.get(currentDate.toISOString().split('T')[0]);
  const holidayName = holidays.get(currentDate.toISOString().split('T')[0]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      present: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Present" },
      full_day: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Full Day" },
      absent: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Absent" },
      late: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Late" },
      leave: { icon: CalendarDays, color: "bg-blue-100 text-blue-800", label: "On Leave" },
      no_punch_out: { icon: LogOut, color: "bg-red-200 text-red-900", label: "No Punch Out" },
      overtime: { icon: Timer, color: "bg-indigo-100 text-indigo-800", label: "Overtime" },
      half_day: { icon: BarChart, color: "bg-orange-100 text-orange-800", label: "Half Day" },
      unpaid: { icon: UserX, color: "bg-gray-200 text-gray-800", label: "Unpaid" },
      pending: { icon: Hourglass, color: "bg-orange-100 text-orange-800", label: "Pending" },
    };
    const map = statusMap[status as keyof typeof statusMap];
    const Icon = map?.icon || Clock;
    return <Badge className={cn("capitalize", map?.color || "bg-gray-100 text-gray-800")}><Icon className="h-3 w-3 mr-1" />{map?.label}</Badge>;
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground">
          Your personal attendance dashboard for {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Month/Year Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateYear('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg">{currentDate.getFullYear()}</span>
              <Button variant="outline" size="sm" onClick={() => navigateYear('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg">
                {currentDate.toLocaleDateString('en-US', { month: 'long' })}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalHours.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loss of Pay Days</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.lossOfPayDays}</div>
            <p className="text-xs text-muted-foreground">unpaid/half-days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Overtime</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOvertimeHours.toFixed(2)} Hours</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Overtime</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingOvertimeHours.toFixed(2)} Hours</div>
            <p className="text-xs text-muted-foreground">awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Calendar</CardTitle>
          <CardDescription>Select a date to view its status. Use navigation controls to change month/year.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(day) => day && setCurrentDate(day)}
              month={currentDate}
              onMonthChange={setCurrentDate}
              className="rounded-md border p-4 w-full"
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 text-sm mt-4 p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Holiday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-4 border-emerald-500 rounded-full bg-white"></div>
                <span>Approved OT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-4 border-orange-500 rounded-full bg-white"></div>
                <span>Pending OT</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold mb-2">
              Details for {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <Card className="p-4 bg-muted/50 space-y-4">
              {holidayName ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Star className="h-5 w-5"/>
                    <span className="font-bold text-lg">{holidayName}</span>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">Public Holiday</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">Non-working day</span>
                    </div>
                  </div>
                </div>
              ) : selectedRecord ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Punch In Time:</span>
                    <span className="font-medium">
                      {selectedRecord.punch_in ? new Date(selectedRecord.punch_in).toLocaleTimeString() : "Not recorded"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Punch Out Time:</span>
                    <span className="font-medium">
                      {selectedRecord.punch_out ? new Date(selectedRecord.punch_out).toLocaleTimeString() : "Not recorded"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Hours:</span>
                    <span className="font-medium">{Number(selectedRecord.hours_worked || 0).toFixed(2)} hours</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Attendance:</span>
                    <div>{getStatusBadge(selectedRecord.attendance_status)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pay Category:</span>
                    <div>{getStatusBadge(selectedRecord.pay_type)}</div>
                  </div>
                  
                  {selectedRecord.pay_type === 'overtime' && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Overtime Status:</span>
                      <div>
                        {selectedRecord.overtime_approved_by !== null 
                          ? getStatusBadge('approved')
                          : selectedRecord.overtime_status === 'rejected' 
                            ? getStatusBadge('rejected')
                            : getStatusBadge('pending')
                        }
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.overtime_approved_by && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Approved By:</span>
                      <span className="font-medium text-green-700">{selectedRecord.overtime_approved_by}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Building className="h-5 w-5 mr-2"/>
                    <span>Regular Working Day</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>No attendance record found</div>
                    <div>This might be a weekend or future date</div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



// "use client"

// import * as React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { getMyAttendance, getHolidays, type AttendanceRecord, type Holiday } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { Calendar } from "@/components/ui/calendar"
// import { CheckCircle, Clock, XCircle, Star, Building, Timer, TrendingDown, Hourglass, BarChart, CalendarDays, LogOut, UserX, ChevronLeft, ChevronRight } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"

// export function MyAttendancePage() {
//   const { toast } = useToast()
//   const [allRecords, setAllRecords] = React.useState<AttendanceRecord[]>([])
//   const [holidays, setHolidays] = React.useState<Map<string, string>>(new Map())
//   const [isLoading, setIsLoading] = React.useState(true)
//   const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
//   const [displayMonth, setDisplayMonth] = React.useState<Date>(new Date())

//   const recordsMap = React.useMemo(() => {
//     return new Map(allRecords.map(r => [r.attendance_date.split('T')[0], r]));
//   }, [allRecords]);

//   const fetchAttendanceData = React.useCallback(async (year: number) => {
//     setIsLoading(true);
//     try {
//       const [attendance, holidayData] = await Promise.all([
//         getMyAttendance(), 
//         getHolidays(year)
//       ]);
//       setAllRecords(attendance);
//       const holidayMap = new Map(holidayData.map(h => [h.holiday_date.split('T')[0], h.name]));
//       setHolidays(holidayMap);
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to load attendance data: ${error.message}`, variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast]);

//   React.useEffect(() => {
//     fetchAttendanceData(displayMonth.getFullYear());
//   }, [displayMonth.getFullYear(), fetchAttendanceData]);

//   const metrics = React.useMemo(() => {
//       const monthRecords = allRecords.filter(r => new Date(r.attendance_date).getMonth() === displayMonth.getMonth() && new Date(r.attendance_date).getFullYear() === displayMonth.getFullYear());
//       const totalHours = monthRecords.reduce((sum, r) => sum + Number(r.hours_worked || 0), 0);
//       const lossOfPayDays = monthRecords.reduce((sum, r) => {
//           if (r.pay_type === 'unpaid') return sum + 1;
//           if (r.pay_type === 'half_day') return sum + 0.5;
//           return sum;
//       }, 0);
      
//       const standardShiftDuration = 8;
//       const totalOvertimeHours = monthRecords
//         .filter(r => r.pay_type === 'overtime' && r.overtime_approved_by !== null)
//         .reduce((sum, r) => {
//             const worked = Number(r.hours_worked || 0);
//             return worked > standardShiftDuration ? sum + (worked - standardShiftDuration) : sum;
//         }, 0);

//       const pendingOvertimeHours = monthRecords
//         .filter(r => r.pay_type === 'overtime' && r.overtime_status === null)
//         .reduce((sum, r) => {
//             const worked = Number(r.hours_worked || 0);
//             return worked > standardShiftDuration ? sum + (worked - standardShiftDuration) : sum;
//         }, 0);

//       return { totalHours, lossOfPayDays, totalOvertimeHours, pendingOvertimeHours };
//   }, [allRecords, displayMonth]);


//   const modifiers = {
//     present: (date: Date) => recordsMap.get(date.toISOString().split('T')[0])?.attendance_status === 'present',
//     late: (date: Date) => recordsMap.get(date.toISOString().split('T')[0])?.attendance_status === 'late',
//     absent: (date: Date) => recordsMap.get(date.toISOString().split('T')[0])?.attendance_status === 'absent',
//     leave: (date: Date) => recordsMap.get(date.toISOString().split('T')[0])?.attendance_status === 'leave',
//     holiday: (date: Date) => holidays.has(date.toISOString().split('T')[0]),
//     approved_overtime: (date: Date) => {
//         const record = recordsMap.get(date.toISOString().split('T')[0]);
//         return record?.pay_type === 'overtime' && record?.overtime_approved_by !== null;
//     },
//     pending_overtime: (date: Date) => {
//         const record = recordsMap.get(date.toISOString().split('T')[0]);
//         return record?.pay_type === 'overtime' && record?.overtime_status === null;
//     }
//   };

//   const modifiersClassNames = {
//     present: "bg-green-500 text-white hover:bg-green-600 focus:bg-green-600 rounded-md",
//     late: "bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-600 rounded-md",
//     absent: "bg-red-500 text-white hover:bg-red-600 focus:bg-red-600 rounded-md",
//     leave: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 rounded-md",
//     holiday: "bg-purple-500 text-white hover:bg-purple-600 focus:bg-purple-600 rounded-md",
//     approved_overtime: "ring-2 ring-teal-400 ring-offset-background",
//     pending_overtime: "ring-2 ring-dashed ring-orange-400 ring-offset-background",
//   };
  
//   const selectedRecord = recordsMap.get(selectedDate.toISOString().split('T')[0]);
//   const holidayName = holidays.get(selectedDate.toISOString().split('T')[0]);
  
//   type StatusKey = "present"| "absent"| "late"| "leave"| "no_punch_out"| "overtime"| "half_day"| "unpaid"| "full_day"| "pending" | "approved" | "rejected";
//   const getStatusBadge = (status: string) => {
//     const statusMap: Record<StatusKey, { icon: React.ComponentType<any>; color: string; label: string }> = {
//         present: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Present" },
//         full_day: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Full Day" },
//         absent: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Absent" },
//         late: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Late" },
//         leave: { icon: CalendarDays, color: "bg-blue-100 text-blue-800", label: "On Leave" },
//         no_punch_out: { icon: LogOut, color: "bg-red-200 text-red-900", label: "No Punch Out" },
//         overtime: { icon: Timer, color: "bg-indigo-100 text-indigo-800", label: "Overtime" },
//         half_day: { icon: BarChart, color: "bg-orange-100 text-orange-800", label: "Half Day"},
//         unpaid: { icon: UserX, color: "bg-gray-200 text-gray-800", label: "Unpaid"},
//         pending: { icon: Hourglass, color: "bg-yellow-100 text-yellow-800", label: "Pending"},
//         approved: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Approved"},
//         rejected: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Rejected"},
//     };
//     const map = statusMap[status as StatusKey];
//     if (!map) return null;
//     const Icon = map.icon || Clock;
//     return <Badge className={cn("capitalize", map.color)}><Icon className="h-3 w-3 mr-1" />{map.label}</Badge>;
//   }

//   const getOvertimeStatus = (record: AttendanceRecord) => {
//       if (record.pay_type !== 'overtime') return null;
//       if (record.overtime_approved_by) return 'approved';
//       if (record.overtime_status === null) return 'pending';
//       return 'rejected';
//   }

//   const navigateMonth = (direction: 'prev' | 'next') => {
//     setDisplayMonth(current => {
//         const newDate = new Date(current);
//         newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
//         return newDate;
//     });
//   }

//   return (
//     <div className="space-y-6">
//        <div>
//         <h1 className="text-3xl font-bold">My Attendance</h1>
//         <p className="text-muted-foreground">Your personal attendance dashboard</p>
//       </div>
//        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Hours Worked</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{metrics.totalHours.toFixed(2)}</div><p className="text-xs text-muted-foreground">in {displayMonth.toLocaleString('default', { month: 'long' })}</p></CardContent></Card>
//             <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Loss of Pay Days</CardTitle><TrendingDown className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{metrics.lossOfPayDays}</div><p className="text-xs text-muted-foreground">in {displayMonth.toLocaleString('default', { month: 'long' })}</p></CardContent></Card>
//             <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Approved Overtime</CardTitle><Timer className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{metrics.totalOvertimeHours.toFixed(2)} Hrs</div><p className="text-xs text-muted-foreground">in {displayMonth.toLocaleString('default', { month: 'long' })}</p></CardContent></Card>
//             <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Overtime</CardTitle><Hourglass className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{metrics.pendingOvertimeHours.toFixed(2)} Hrs</div><p className="text-xs text-muted-foreground">this month</p></CardContent></Card>
//        </div>
//        <Card>
//         <CardHeader>
//             <CardTitle>Attendance Calendar</CardTitle>
//             <CardDescription>Select a date to view its status. Use navigation controls to change month/year.</CardDescription>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs mb-4 p-2 border rounded-lg">
//                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span>Present</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div><span>Late</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span>Absent</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span>Leave</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-purple-500 rounded-full"></div><span>Holiday</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 ring-2 ring-teal-400 rounded-full"></div><span>Approved OT</span></div>
//                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 ring-2 ring-orange-400 ring-dashed rounded-full"></div><span>Pending OT</span></div>
//                  </div>
                 
//                 <Calendar
//                     mode="single"
//                     selected={selectedDate}
//                     onSelect={(day) => day && setSelectedDate(day)}
//                     month={displayMonth}
//                     onMonthChange={setDisplayMonth}
//                     className="rounded-md border p-2 ml-[35%]" 
//                      classNames={{
//     day: "h-10 w-10 flex items-center justify-center font-bold", // each day box
//   }}
//                     modifiers={modifiers}
//                     modifiersClassNames={modifiersClassNames}
//                 />
//             </div>
//             <div className="flex-1">
//                 <h3 className="font-semibold mb-2">
//                   Details for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//                 </h3>
//                 <Card className="p-4 bg-muted/50 space-y-4 min-h-[300px]">
//                     {holidayName ? (
//                         <div className="flex items-center gap-2 text-purple-600"><Star className="h-5 w-5"/> <span className="font-bold text-lg">{holidayName} (Holiday)</span></div>
//                     ) : selectedRecord ? (
//                        <div className="space-y-3 text-sm">
//                            <div><Label className="text-muted-foreground">Punch In</Label><p className="font-medium">{selectedRecord.punch_in ? new Date(selectedRecord.punch_in).toLocaleTimeString() : "N/A"}</p></div>
//                            <div><Label className="text-muted-foreground">Punch Out</Label><p className="font-medium">{selectedRecord.punch_out ? new Date(selectedRecord.punch_out).toLocaleTimeString() : "N/A"}</p></div>
//                            <div><Label className="text-muted-foreground">Hours Worked</Label><p className="font-medium">{Number(selectedRecord.hours_worked || 0).toFixed(2)} hrs</p></div>
//                            <div className="flex justify-between items-center"><Label>Attendance Status</Label>{getStatusBadge(selectedRecord.attendance_status)}</div>
//                            <div className="flex justify-between items-center"><Label>Pay Type</Label>{getStatusBadge(selectedRecord.pay_type)}</div>
//                            {getOvertimeStatus(selectedRecord) && <div className="flex justify-between items-center"><Label>Overtime Status</Label>{getStatusBadge(getOvertimeStatus(selectedRecord)!)}</div>}
//                        </div>
//                     ) : (
//                         <div className="flex items-center justify-center h-full text-muted-foreground"><Building className="h-5 w-5 mr-2"/> <span>Working Day / No Record</span></div>
//                     )}
//                 </Card>
//             </div>
//         </CardContent>
//        </Card>
//     </div>
//   )
// }