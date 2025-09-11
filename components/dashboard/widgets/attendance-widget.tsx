
// "use client"

// import * as React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Calendar } from "@/components/ui/calendar"
// import type { AttendanceRecord } from "@/lib/api"
// import { cn } from "@/lib/utils"
// import { Separator } from "@/components/ui/separator"
// import { Clock, TrendingDown, Timer } from "lucide-react"

// interface AttendanceWidgetProps {
//   attendanceData: Pick<AttendanceRecord, 'attendance_date' | 'attendance_status' | 'pay_type' | 'hours_worked' | 'overtime_approved_by' | 'overtime_status'>[]
// }

// export function AttendanceWidget({ attendanceData }: AttendanceWidgetProps) {
//   const [date, setDate] = React.useState<Date>(new Date())

//   const recordsMap = React.useMemo(() => {
//     return new Map(attendanceData.map(r => [r.attendance_date.split('T')[0], r]));
//   }, [attendanceData]);

//   const metrics = React.useMemo(() => {
//     const monthRecords = attendanceData.filter(r => new Date(r.attendance_date).getMonth() === date.getMonth());
//     const totalHours = monthRecords.reduce((sum, r) => sum + Number(r.hours_worked || 0), 0);
//     const lossOfPayDays = monthRecords.reduce((sum, r) => {
//         if (r.pay_type === 'unpaid') return sum + 1;
//         if (r.pay_type === 'half_day') return sum + 0.5;
//         return sum;
//     }, 0);
//     const standardShiftDuration = 8;
//     const overtimeHours = monthRecords
//       .filter(r => r.pay_type === 'overtime' && r.overtime_approved_by !== null)
//       .reduce((sum, r) => {
//           const worked = Number(r.hours_worked || 0);
//           return worked > standardShiftDuration ? sum + (worked - standardShiftDuration) : sum;
//       }, 0);
      
//     return { totalHours, lossOfPayDays, overtimeHours };
//   }, [attendanceData, date]);


//   const modifiers = {
//     present: (d: Date) => recordsMap.get(d.toISOString().split('T')[0])?.attendance_status === 'present',
//     late: (d: Date) => recordsMap.get(d.toISOString().split('T')[0])?.attendance_status === 'late',
//     absent: (d: Date) => recordsMap.get(d.toISOString().split('T')[0])?.attendance_status === 'absent',
//     leave: (d: Date) => recordsMap.get(d.toISOString().split('T')[0])?.attendance_status === 'leave',
//   };

//   const modifiersClassNames = {
//     present: "bg-green-500 text-white rounded-md",
//     late: "bg-yellow-500 text-white rounded-md",
//     absent: "bg-red-500 text-white rounded-md",
//     leave: "bg-blue-500 text-white rounded-md",
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>My Monthly Attendance</CardTitle>
//         <CardDescription>Your attendance record for {date.toLocaleString('default', { month: 'long' })}.</CardDescription>
//       </CardHeader>
//       <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="flex justify-center">
//             <Calendar
//             required
//             mode="single"
//             selected={date}
//             onSelect={setDate}
//             month={date}
//             onMonthChange={setDate}
//             modifiers={modifiers}
//             modifiersClassNames={modifiersClassNames}
//             className="p-0"
//             />
//         </div>
//         <div className="space-y-4">
//             <h3 className="font-semibold text-center md:text-left">Monthly Summary</h3>
//             <Separator />
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4"/><span>Total Hours Worked</span></div>
//                 <span className="font-bold">{metrics.totalHours.toFixed(2)} hrs</span>
//             </div>
//              <Separator />
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingDown className="h-4 w-4"/><span>Loss of Pay Days</span></div>
//                 <span className="font-bold">{metrics.lossOfPayDays}</span>
//             </div>
//              <Separator />
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground"><Timer className="h-4 w-4"/><span>Approved Overtime</span></div>
//                 <span className="font-bold">{metrics.overtimeHours.toFixed(2)} hrs</span>
//             </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import type { AttendanceRecord } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Clock, TrendingDown, Timer } from "lucide-react"

interface AttendanceWidgetProps {
  attendanceData: Pick<AttendanceRecord, 'attendance_date' | 'attendance_status' | 'pay_type' | 'hours_worked' | 'overtime_approved_by' | 'overtime_status'>[]
}

export function AttendanceWidget({ attendanceData }: AttendanceWidgetProps) {
  const [date, setDate] = React.useState<Date>(new Date())

  const recordsMap = React.useMemo(() => {
    return new Map(attendanceData.map(r => [r.attendance_date.split('T')[0], r]));
  }, [attendanceData]);

  const metrics = React.useMemo(() => {
    const monthRecords = attendanceData.filter(r => new Date(r.attendance_date).getMonth() === date.getMonth());
    const totalHours = monthRecords.reduce((sum, r) => sum + Number(r.hours_worked || 0), 0);
    const lossOfPayDays = monthRecords.reduce((sum, r) => {
        if (r.pay_type === 'unpaid') return sum + 1;
        if (r.pay_type === 'half_day') return sum + 0.5;
        return sum;
    }, 0);
    const standardShiftDuration = 8;
    const overtimeHours = monthRecords
      .filter(r => r.pay_type === 'overtime' && r.overtime_approved_by !== null)
      .reduce((sum, r) => {
          const worked = Number(r.hours_worked || 0);
          return worked > standardShiftDuration ? sum + (worked - standardShiftDuration) : sum;
      }, 0);
      
    return { totalHours, lossOfPayDays, overtimeHours };
  }, [attendanceData, date]);


  const modifiers = {
    present: (d: Date) => recordsMap.get(d.toISOString().split('T')[0])?.attendance_status === 'present',
    late: (d: Date) => recordsMap.get(d.toISOString().split('T')[0])?.attendance_status === 'late',
    absent: (d: Date) => recordsMap.get(d.toISOString().split('T')[0])?.attendance_status === 'absent',
    leave: (d: Date) => recordsMap.get(d.toISOString().split('T')[0])?.attendance_status === 'leave',
  };

  const modifiersClassNames = {
    present: "bg-green-500 text-white rounded-md",
    late: "bg-yellow-500 text-white rounded-md",
    absent: "bg-red-500 text-white rounded-md",
    leave: "bg-blue-500 text-white rounded-md",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Monthly Attendance</CardTitle>
        <CardDescription>Your attendance record for {date.toLocaleString('default', { month: 'long' })}.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
            <Calendar
            required
            mode="single"
            selected={date}
            onSelect={setDate}
            month={date}
            onMonthChange={setDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="p-0"
            />
        </div>
        <div className="space-y-4">
            <h3 className="font-semibold text-center md:text-left">Monthly Summary</h3>
            <Separator />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4"/><span>Total Hours Worked</span></div>
                <span className="font-bold">{metrics.totalHours.toFixed(2)} hrs</span>
            </div>
             <Separator />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><TrendingDown className="h-4 w-4"/><span>Loss of Pay Days</span></div>
                <span className="font-bold">{metrics.lossOfPayDays}</span>
            </div>
             <Separator />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Timer className="h-4 w-4"/><span>Approved Overtime</span></div>
                <span className="font-bold">{metrics.overtimeHours.toFixed(2)} hrs</span>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}