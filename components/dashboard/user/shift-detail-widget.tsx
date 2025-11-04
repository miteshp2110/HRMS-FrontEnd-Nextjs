// "use client"

// import { useState, useEffect } from "react"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
// import {
//   Clock,
//   Calendar,
//   Timer,
//   LogIn,
//   LogOut,
//   Coffee,
//   TrendingUp,
//   Zap,
//   AlertCircle,
// } from "lucide-react"
// import { getMyShift, type Shift } from "@/lib/api"
// import { format, parse, differenceInMinutes } from "date-fns"
// import { toZonedTime, formatInTimeZone } from "date-fns-tz"

// export function ShiftDetailsWidget() {
//   const [shift, setShift] = useState<Shift | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [timezone, setTimezone] = useState<string>("UTC")

//   useEffect(() => {
//     // Get timezone from localStorage
//     const savedTimezone = localStorage.getItem("selectedTimezone") || "UTC"
//     setTimezone(savedTimezone)

//     // Fetch shift data
//     const fetchShift = async () => {
//       try {
//         setLoading(true)
//         const data = await getMyShift()
//         setShift(data)
//       } catch (err: any) {
//         setError(err.message || "Failed to load shift details")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchShift()
//   }, [])

//   const convertUTCToLocal = (utcTime: string) => {
//     if (!utcTime) return "N/A"
//     try {
//       // Parse UTC time (format: HH:mm:ss or HH:mm)
//       const today = new Date()
//       const [hours, minutes] = utcTime.split(":")
//       const utcDate = new Date(
//         Date.UTC(
//           today.getUTCFullYear(),
//           today.getUTCMonth(),
//           today.getUTCDate(),
//           parseInt(hours),
//           parseInt(minutes)
//         )
//       )
      
//       // Convert to user's timezone
//       return formatInTimeZone(utcDate, timezone, "hh:mm a")
//     } catch (err) {
//       console.error("Time conversion error:", err)
//       return utcTime
//     }
//   }

//   const calculateShiftDuration = () => {
//     if (!shift) return "N/A"
//     try {
//       const [fromHours, fromMinutes] = shift.from_time.split(":").map(Number)
//       const [toHours, toMinutes] = shift.to_time.split(":").map(Number)

//       let totalMinutes = (toHours * 60 + toMinutes) - (fromHours * 60 + fromMinutes)
      
//       // Handle shifts that cross midnight
//       if (totalMinutes < 0) {
//         totalMinutes += 24 * 60
//       }

//       const hours = Math.floor(totalMinutes / 60)
//       const minutes = totalMinutes % 60

//       return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
//     } catch (err) {
//       return "N/A"
//     }
//   }

//   const formatMinutesToTime = (minutes: number) => {
//     const hours = Math.floor(minutes / 60)
//     const mins = minutes % 60
//     return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
//   }

//   if (loading) {
//     return (
//       <Card className="border-0 shadow-lg">
//         <CardHeader className="pb-4">
//           <Skeleton className="h-8 w-48" />
//           <Skeleton className="h-4 w-64 mt-2" />
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-4 gap-4">
//             {[1, 2, 3, 4].map((i) => (
//               <Skeleton key={i} className="h-32 rounded-xl" />
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   if (error || !shift) {
//     return (
//       <Card className="border-0 shadow-lg">
//         <CardContent className="p-6">
//           <div className="flex items-center gap-3 text-destructive">
//             <AlertCircle className="w-5 h-5" />
//             <p className="text-sm font-medium">
//               {error || "No shift data available"}
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   const shiftDuration = calculateShiftDuration()

//   return (
//     <Card className="border-0 shadow-lg overflow-hidden">
//       <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
//               <Clock className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <CardTitle className="text-xl">My Shift Schedule</CardTitle>
//               <CardDescription className="text-xs mt-0.5">
//                 Your current shift timings and policies
//               </CardDescription>
//             </div>
//           </div>

//           <Badge
//             variant="outline"
//             className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-semibold px-4 py-1.5"
//           >
//             <Zap className="w-3 h-3 mr-1" />
//             {shift.name}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="p-6">
//         <div className="grid grid-cols-4 gap-4">
//           {/* Shift Start Time */}
//           <div className="group">
//             <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 hover:border-green-500/40 hover:shadow-md transition-all">
//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center justify-between">
//                   <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
//                     <LogIn className="w-5 h-5 text-green-600 dark:text-green-400" />
//                   </div>
//                   <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
//                     Start
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">
//                     {convertUTCToLocal(shift.from_time)}
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-1 font-medium">
//                     Punch In Time
//                   </p>
//                 </div>
//                 {shift.punch_in_margin > 0 && (
//                   <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/50 px-2 py-1.5 rounded-md">
//                     <Timer className="w-3 h-3" />
//                     <span>±{shift.punch_in_margin} min grace</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Shift End Time */}
//           <div className="group">
//             <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20 hover:border-red-500/40 hover:shadow-md transition-all">
//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center justify-between">
//                   <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
//                     <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
//                   </div>
//                   <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
//                     End
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">
//                     {convertUTCToLocal(shift.to_time)}
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-1 font-medium">
//                     Punch Out Time
//                   </p>
//                 </div>
//                 {shift.punch_out_margin > 0 && (
//                   <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/50 px-2 py-1.5 rounded-md">
//                     <Timer className="w-3 h-3" />
//                     <span>±{shift.punch_out_margin} min grace</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Total Duration */}
//           <div className="group">
//             <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 hover:border-blue-500/40 hover:shadow-md transition-all">
//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center justify-between">
//                   <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
//                     <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
//                     Total
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
//                     {shiftDuration}
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-1 font-medium">
//                     Shift Duration
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/50 px-2 py-1.5 rounded-md">
//                   <Coffee className="w-3 h-3" />
//                   <span>Half-day: {formatMinutesToTime(shift.half_day_threshold)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Overtime Threshold */}
//           <div className="group">
//             <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-md transition-all">
//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center justify-between">
//                   <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
//                     <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//                   </div>
//                   <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
//                     OT
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
//                     {formatMinutesToTime(shift.overtime_threshold)}
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-1 font-medium">
//                     Overtime After
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/50 px-2 py-1.5 rounded-md">
//                   <Zap className="w-3 h-3" />
//                   <span>Extra hours counted</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Info Banner */}
//         <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 dark:border-blue-500/30">
//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
//               <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//             </div>
//             <div className="flex-1">
//               <p className="text-sm font-medium text-foreground mb-1">
//                 Shift Policy Information
//               </p>
//               <p className="text-xs text-muted-foreground leading-relaxed">
//                 Grace periods allow flexibility for punch in/out times. Hours worked beyond{" "}
//                 <span className="font-semibold text-foreground">
//                   {formatMinutesToTime(shift.overtime_threshold)}
//                 </span>{" "}
//                 will be counted as overtime and require approval.
//                 {shift.half_day_threshold > 0 && (
//                   <span>
//                     {" "}Working less than{" "}
//                     <span className="font-semibold text-foreground">
//                       {formatMinutesToTime(shift.half_day_threshold)}
//                     </span>{" "}
//                     will be marked as half-day.
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Timezone Info */}
//         <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
//           <Clock className="w-3 h-3" />
//           <span>All times shown in: <span className="font-semibold text-foreground">{timezone}</span></span>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Clock,
  LogIn,
  LogOut,
  Timer,
  TrendingUp,
  Zap,
  Info,
} from "lucide-react"
import { getMyShift, type Shift } from "@/lib/api"
import { formatInTimeZone } from "date-fns-tz"

export function ShiftDetailsWidget() {
  const [shift, setShift] = useState<Shift | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timezone, setTimezone] = useState<string>("UTC")

  useEffect(() => {
    const savedTimezone = localStorage.getItem("selectedTimezone") || "UTC"
    setTimezone(savedTimezone)

    const fetchShift = async () => {
      try {
        setLoading(true)
        const data = await getMyShift()
        setShift(data)
      } catch (err: any) {
        setError(err.message || "Failed to load shift details")
      } finally {
        setLoading(false)
      }
    }

    fetchShift()
  }, [])

  const convertUTCToLocal = (utcTime: string) => {
    if (!utcTime) return "N/A"
    try {
      const today = new Date()
      const [hours, minutes] = utcTime.split(":")
      const utcDate = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
          parseInt(hours),
          parseInt(minutes)
        )
      )
      return formatInTimeZone(utcDate, timezone, "hh:mm a")
    } catch (err) {
      return utcTime
    }
  }

  const calculateShiftDuration = () => {
    if (!shift) return "N/A"
    try {
      const [fromHours, fromMinutes] = shift.from_time.split(":").map(Number)
      const [toHours, toMinutes] = shift.to_time.split(":").map(Number)

      let totalMinutes = (toHours * 60 + toMinutes) - (fromHours * 60 + fromMinutes)
      
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60
      }

      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60

      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    } catch (err) {
      return "N/A"
    }
  }

  // half_day_threshold is in hours, others are in minutes
  const formatThreshold = (value: number, isHours: boolean = false) => {
    if (isHours) {
      // Convert hours to readable format
      const mins = value * 60
      const hours = Math.floor(mins / 60)
      const minutes = mins % 60
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    } else {
      // Already in minutes
      const hours = Math.floor(value / 60)
      const minutes = value % 60
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !shift) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <p className="text-sm text-destructive">{error || "No shift data"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">My Shift Schedule</CardTitle>
              <CardDescription className="text-xs">
                {timezone} • {calculateShiftDuration()}
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="outline"
            className="bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-semibold px-3 py-0.5 text-xs"
          >
            {shift.name}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-4 gap-3">
          {/* Shift Start */}
          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <LogIn className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                IN
              </span>
            </div>
            <p className="text-xl font-bold text-green-600 dark:text-green-400 tabular-nums mb-1">
              {convertUTCToLocal(shift.from_time)}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Timer className="w-3 h-3" />
              <span>±{shift.punch_in_margin}m</span>
            </div>
          </div>

          {/* Shift End */}
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 hover:border-red-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-[10px] font-medium text-red-600 dark:text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                OUT
              </span>
            </div>
            <p className="text-xl font-bold text-red-600 dark:text-red-400 tabular-nums mb-1">
              {convertUTCToLocal(shift.to_time)}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Timer className="w-3 h-3" />
              <span>±{shift.punch_out_margin}m</span>
            </div>
          </div>

          {/* Half Day */}
          <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                HALF
              </span>
            </div>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400 tabular-nums mb-1">
              {formatThreshold(shift.half_day_threshold, true)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Half-day limit
            </p>
          </div>

          {/* Overtime */}
          <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                OT
              </span>
            </div>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400 tabular-nums mb-1">
              {formatThreshold(shift.overtime_threshold, false)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              After this time
            </p>
          </div>
        </div>

        {/* Compact Info */}
        <div className="mt-3 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/20 dark:border-blue-500/30">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Grace periods allow ±{shift.punch_in_margin} min for check-in and ±{shift.punch_out_margin} min for check-out. 
              Work beyond {formatThreshold(shift.overtime_threshold, false)} counts as overtime.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
