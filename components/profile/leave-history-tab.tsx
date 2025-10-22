
// "use client"

// import * as React from "react"
// import { useState } from "react"
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
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Clock,
//   UserPlus,
//   Filter,
//   Eye,
//   Edit,
//   Loader2,
//   TrendingUp,
// } from "lucide-react"
// import type { LeaveBalance, LeaveRecord } from "@/lib/api"
// import { getHolidays, getWorkWeek, updateLeaveBalance } from "@/lib/api"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { LeaveLedgerDialog } from "@/components/management/leave-ledger-dialog"
// import { useParams } from "next/navigation"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// interface ApiWorkWeekDay {
//   id?: number
//   day_of_week: string
//   is_working_day: number | boolean
//   created_at?: string
//   updated_at?: string
//   updated_by?: string | null
// }

// interface LeaveHistoryTabProps {
//   leaveBalances: LeaveBalance[]
//   leaveRecords: LeaveRecord[]
//   isLoading: boolean
//   onDateChange: (startDate: string, endDate: string) => void
//   onBalanceUpdated?: () => void
// }

// // Skeleton Components
// function BalanceCardsSkeleton() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {[...Array(4)].map((_, i) => (
//         <Card key={i}>
//           <CardHeader className="pb-2">
//             <Skeleton className="h-4 w-24" />
//           </CardHeader>
//           <CardContent>
//             <Skeleton className="h-8 w-16" />
//             <Skeleton className="h-3 w-20 mt-2" />
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

// function TableSkeleton() {
//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Leave ID</TableHead>
//           <TableHead>Leave Type</TableHead>
//           <TableHead>Dates</TableHead>
//           <TableHead>Working Days</TableHead>
//           <TableHead>Status</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {[...Array(5)].map((_, i) => (
//           <TableRow key={i}>
//             <TableCell><Skeleton className="h-4 w-20" /></TableCell>
//             <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//             <TableCell><Skeleton className="h-12 w-32" /></TableCell>
//             <TableCell><Skeleton className="h-4 w-12" /></TableCell>
//             <TableCell><Skeleton className="h-6 w-20" /></TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   )
// }

// export function LeaveHistoryTab({
//   leaveBalances,
//   leaveRecords,
//   isLoading,
//   onDateChange,
//   onBalanceUpdated,
// }: LeaveHistoryTabProps) {
//   const params = useParams()
//   const employeeId = Number(params.id)
//   const [startDate, setStartDate] = React.useState("")
//   const [endDate, setEndDate] = React.useState("")
//   const [isLedgerOpen, setIsLedgerOpen] = useState(false)
//   const [isUpdateBalanceOpen, setIsUpdateBalanceOpen] = useState(false)
//   const [selectedLeaveBalance, setSelectedLeaveBalance] = useState<LeaveBalance | null>(null)
//   const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState<string>("")
//   const [newBalance, setNewBalance] = useState<string>("")
//   const [isUpdating, setIsUpdating] = useState(false)
//   const [holidays, setHolidays] = React.useState<Date[]>([])
//   const [workWeek, setWorkWeek] = React.useState<ApiWorkWeekDay[]>([])
//   const [dataLoading, setDataLoading] = React.useState(true)
//   const { toast } = useToast()

//   React.useEffect(() => {
//     const today = new Date()
//     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
//     setStartDate(firstDayOfMonth.toISOString().split("T")[0])
//     setEndDate(today.toISOString().split("T")[0])
//   }, [])

//   React.useEffect(() => {
//     const loadStaticData = async () => {
//       try {
//         setDataLoading(true)
//         const [holidaysData, workWeekData] = await Promise.all([
//           getHolidays(new Date().getFullYear()),
//           getWorkWeek()
//         ])
        
//         setHolidays(holidaysData.map(h => new Date(h.holiday_date)))
//         const normalizedWorkWeek = workWeekData.map(day => ({
//           ...day,
//           is_working_day: typeof day.is_working_day === 'boolean' ? (day.is_working_day ? 1 : 0) : day.is_working_day
//         }))
//         setWorkWeek(normalizedWorkWeek)
//       } catch (error: any) {
//         toast({
//           title: "Error",
//           description: `Failed to load holiday and work week data: ${error.message}`,
//           variant: "destructive",
//         })
//       } finally {
//         setDataLoading(false)
//       }
//     }

//     loadStaticData()
//   }, [toast])

//   const handleFilter = () => {
//     onDateChange(startDate, endDate)
//   }

//   const handleBalanceClick = (balance: LeaveBalance) => {
//     setSelectedLeaveBalance(balance)
//     setIsLedgerOpen(true)
//   }

//   const handleUpdateBalanceClick = () => {
//     setSelectedLeaveTypeId("")
//     setNewBalance("")
//     setIsUpdateBalanceOpen(true)
//   }

//   const handleUpdateBalance = async () => {
//     if (!selectedLeaveTypeId || !newBalance) {
//       toast({
//         title: "Validation Error",
//         description: "Please select a leave type and enter a new balance.",
//         variant: "destructive",
//       })
//       return
//     }

//     const numericBalance = parseFloat(newBalance)
//     if (isNaN(numericBalance) || numericBalance < 0) {
//       toast({
//         title: "Validation Error",
//         description: "Please enter a valid positive number for the balance.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsUpdating(true)
//     try {
//       await updateLeaveBalance(numericBalance, employeeId, parseInt(selectedLeaveTypeId))
//       toast({
//         title: "Success",
//         description: "Leave balance has been updated successfully.",
//       })
//       setIsUpdateBalanceOpen(false)
//       setSelectedLeaveTypeId("")
//       setNewBalance("")
//       if (onBalanceUpdated) {
//         onBalanceUpdated()
//       }
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: `Failed to update leave balance: ${error.message}`,
//         variant: "destructive",
//       })
//     } finally {
//       setIsUpdating(false)
//     }
//   }

//   const getStatusFromRecord = (
//     record: LeaveRecord
//   ): "approved" | "rejected" | "pending" => {
//     if (record.rejection_reason != null) return "rejected"
//     if (record.primary_status && record.secondry_status) return "approved"
//     return "pending"
//   }

//   const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
//     switch (status) {
//       case "approved":
//         return (
//           <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Approved
//           </Badge>
//         )
//       case "rejected":
//         return (
//           <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
//             <XCircle className="h-3 w-3 mr-1" />
//             Rejected
//           </Badge>
//         )
//       case "pending":
//         return (
//           <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
//             <Clock className="h-3 w-3 mr-1" />
//             Pending
//           </Badge>
//         )
//       default:
//         return <Badge variant="secondary">{status}</Badge>
//     }
//   }

//   const calculateLeaveDays = React.useCallback((startDate: Date | string, endDate: Date | string) => {
//     if (dataLoading || workWeek.length === 0) {
//       const start = new Date(startDate)
//       const end = new Date(endDate)
//       if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
//       const diffTime = Math.abs(end.getTime() - start.getTime())
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
//       return diffDays
//     }

//     let count = 0
//     const currentDate = new Date(startDate)
//     const lastDate = new Date(endDate)
    
//     currentDate.setHours(0, 0, 0, 0)
//     lastDate.setHours(0, 0, 0, 0)
    
//     while(currentDate <= lastDate) {
//       const dayOfWeek = currentDate.getDay()
      
//       const isHoliday = holidays.some(h => {
//         const holidayDate = new Date(h)
//         holidayDate.setHours(0, 0, 0, 0)
//         return holidayDate.getTime() === currentDate.getTime()
//       })
      
//       const workDayConfig = workWeek.find(d => 
//         ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
//         .indexOf(d.day_of_week) === dayOfWeek
//       )
//       const isWorkingDay = workDayConfig ? 
//         (typeof workDayConfig.is_working_day === 'boolean' ? workDayConfig.is_working_day : workDayConfig.is_working_day === 1) : 
//         true
      
//       if(!isHoliday && isWorkingDay) {
//         count++
//       }
//       currentDate.setDate(currentDate.getDate() + 1)
//     }
//     return count
//   }, [holidays, workWeek, dataLoading])

//   const selectedLeaveForUpdate = leaveBalances.find(b => String(b.id) === selectedLeaveTypeId)

//   return (
//     <>
//       <div className="space-y-6">
//         <Card className="border-indigo-200 dark:border-indigo-900">
//           <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
//             <div className="flex justify-between items-center">
//               <div>
//                 <CardTitle className="text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   Leave Balances
//                 </CardTitle>
//                 <CardDescription className="text-indigo-700 dark:text-indigo-300">
//                   Current available leave balances by type. Click any balance to view its ledger
//                 </CardDescription>
//               </div>
//               <Button
//                 onClick={handleUpdateBalanceClick}
//                 className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
//               >
//                 <Edit className="h-4 w-4 mr-2" />
//                 Update Balance
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="pt-6">
//             {isLoading ? (
//               <BalanceCardsSkeleton />
//             ) : leaveBalances.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 text-center">
//                 <div className="p-4 bg-muted rounded-full mb-4">
//                   <Calendar className="h-12 w-12 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">No Leave Balances</h3>
//                 <p className="text-muted-foreground">No leave balances found for this employee.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {leaveBalances.map((balance) => (
//                   <Card 
//                     key={balance.id} 
//                     className={`cursor-pointer hover:border-primary transition-all hover:shadow-md ${Number(balance.balance) === 0 ? "opacity-60" : ""}`}
//                     onClick={() => handleBalanceClick(balance)}
//                   >
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                       <CardTitle className="text-sm font-medium">
//                         {balance.leave_type_name}
//                       </CardTitle>
//                       <Calendar className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-3xl font-bold text-primary">{balance.balance}</div>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {Number(balance.balance) === 1 ? "day available" : "days available"}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Leave Application History</CardTitle>
//             <CardDescription>
//               View and filter leave requests submitted by this employee. Working days calculation excludes holidays and non-working days
//             </CardDescription>
//             <div className="flex flex-col md:flex-row gap-4 pt-4">
//               <div className="grid gap-2 flex-1">
//                 <Label htmlFor="start-date" className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4" />
//                   Start Date
//                 </Label>
//                 <Input
//                   id="start-date"
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </div>
//               <div className="grid gap-2 flex-1">
//                 <Label htmlFor="end-date" className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4" />
//                   End Date
//                 </Label>
//                 <Input
//                   id="end-date"
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                 />
//               </div>
//               <div className="flex items-end">
//                 <Button 
//                   onClick={handleFilter} 
//                   className="w-full md:w-auto"
//                   variant="outline"
//                 >
//                   <Filter className="h-4 w-4 mr-2" />
//                   Apply Filter
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <TableSkeleton />
//             ) : leaveRecords.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 text-center">
//                 <div className="p-4 bg-muted rounded-full mb-4">
//                   <UserPlus className="h-12 w-12 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">No Leave Records Found</h3>
//                 <p className="text-muted-foreground">
//                   No leave requests found for the selected date range.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Leave ID</TableHead>
//                       <TableHead>Leave Type</TableHead>
//                       <TableHead>Dates</TableHead>
//                       <TableHead>Working Days</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Applied On</TableHead>
//                       <TableHead>Primary Approver</TableHead>
//                       <TableHead>Secondary Approver</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {leaveRecords.map((record) => (
//                       <TableRow key={record.id} className="hover:bg-muted/50">
//                         <TableCell className="font-mono font-medium">
//                           <Link 
//                             href={`/management/leaves/${record.id}`}
//                             className="text-primary hover:underline"
//                           >
//                             {record.full_leave_id || record.id}
//                           </Link>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline">{record.leave_type_name}</Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className="text-sm">
//                             <div>{new Date(record.from_date).toLocaleDateString('en-AE')}</div>
//                             <div className="text-muted-foreground text-xs">to</div>
//                             <div>{new Date(record.to_date).toLocaleDateString('en-AE')}</div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge className="bg-blue-100 text-blue-800">
//                             {calculateLeaveDays(record.from_date, record.to_date)} days
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           {getStatusBadge(getStatusFromRecord(record))}
//                         </TableCell>
//                         <TableCell className="text-sm">
//                           {new Date(record.applied_date).toLocaleDateString('en-AE')}
//                         </TableCell>
//                         <TableCell className="text-sm">
//                           {record.primary_approver_name || "Not assigned"}
//                         </TableCell>
//                         <TableCell className="text-sm">
//                           {record.secondary_approver_name || "Not assigned"}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Update Balance Dialog */}
//       <Dialog open={isUpdateBalanceOpen} onOpenChange={setIsUpdateBalanceOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-2xl">
//               <Edit className="h-6 w-6" />
//               Update Leave Balance
//             </DialogTitle>
//             <DialogDescription>
//               Select a leave type and set the new balance for this employee
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-6 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="leave-type" className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4" />
//                 Leave Type *
//               </Label>
//               <Select 
//                 value={selectedLeaveTypeId} 
//                 onValueChange={setSelectedLeaveTypeId}
//                 disabled={isUpdating}
//               >
//                 <SelectTrigger id="leave-type">
//                   <SelectValue placeholder="Select a leave type..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {leaveBalances.map(balance => (
//                     <SelectItem key={balance.id} value={String(balance.id)}>
//                       {balance.leave_type_name} (Current: {balance.balance} days)
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {selectedLeaveForUpdate && (
//               <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
//                       Current Balance
//                     </div>
//                     <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
//                       {selectedLeaveForUpdate.balance} days
//                     </div>
//                   </div>
//                   <TrendingUp className="h-8 w-8 text-blue-600" />
//                 </div>
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="new-balance" className="flex items-center gap-2">
//                 <Edit className="h-4 w-4" />
//                 New Balance (days) *
//               </Label>
//               <Input
//                 id="new-balance"
//                 type="number"
//                 step="0.5"
//                 min="0"
//                 value={newBalance}
//                 onChange={(e) => setNewBalance(e.target.value)}
//                 placeholder="Enter new balance..."
//                 disabled={isUpdating || !selectedLeaveTypeId}
//               />
//               <p className="text-xs text-muted-foreground">
//                 This will override the current balance with the new value
//               </p>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 setIsUpdateBalanceOpen(false)
//                 setSelectedLeaveTypeId("")
//                 setNewBalance("")
//               }}
//               disabled={isUpdating}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleUpdateBalance}
//               disabled={isUpdating || !selectedLeaveTypeId || !newBalance}
//               className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
//             >
//               {isUpdating ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="h-4 w-4 mr-2" />
//                   Update Balance
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <LeaveLedgerDialog 
//         employeeId={employeeId} 
//         leaveBalance={selectedLeaveBalance}
//         open={isLedgerOpen} 
//         onOpenChange={setIsLedgerOpen}
//       />
//     </>
//   )
// }


"use client"

import * as React from "react"
import { useState } from "react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  Filter,
  Eye,
  Edit,
  Loader2,
  TrendingUp,
} from "lucide-react"
import type { LeaveBalance, LeaveRecord } from "@/lib/api"
import { getHolidays, getWorkWeek, updateLeaveBalance } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LeaveLedgerDialog } from "@/components/management/leave-ledger-dialog"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ApiWorkWeekDay {
  id?: number
  day_of_week: string
  is_working_day: number | boolean
  created_at?: string
  updated_at?: string
  updated_by?: string | null
}

interface LeaveHistoryTabProps {
  leaveBalances: LeaveBalance[]
  leaveRecords: LeaveRecord[]
  isLoading: boolean
  onDateChange: (startDate: string, endDate: string) => void
  onBalanceUpdated?: () => void
}

// Skeleton Components
function BalanceCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Leave ID</TableHead>
          <TableHead>Leave Type</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Working Days</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-12 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function LeaveHistoryTab({
  leaveBalances: initialLeaveBalances,
  leaveRecords,
  isLoading,
  onDateChange,
  onBalanceUpdated,
}: LeaveHistoryTabProps) {
  const params = useParams()
  const employeeId = Number(params.id)
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [isLedgerOpen, setIsLedgerOpen] = useState(false)
  const [isUpdateBalanceOpen, setIsUpdateBalanceOpen] = useState(false)
  const [selectedLeaveBalance, setSelectedLeaveBalance] = useState<LeaveBalance | null>(null)
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState<string>("")
  const [newBalance, setNewBalance] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [holidays, setHolidays] = React.useState<Date[]>([])
  const [workWeek, setWorkWeek] = React.useState<ApiWorkWeekDay[]>([])
  const [dataLoading, setDataLoading] = React.useState(true)
  const { toast } = useToast()

  // Local state for leave balances to allow optimistic updates
  const [leaveBalances, setLeaveBalances] = React.useState<LeaveBalance[]>(initialLeaveBalances)

  // Update local state when prop changes
  React.useEffect(() => {
    setLeaveBalances(initialLeaveBalances)
  }, [initialLeaveBalances])

  React.useEffect(() => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    setStartDate(firstDayOfMonth.toISOString().split("T")[0])
    setEndDate(today.toISOString().split("T")[0])
  }, [])

  React.useEffect(() => {
    const loadStaticData = async () => {
      try {
        setDataLoading(true)
        const [holidaysData, workWeekData] = await Promise.all([
          getHolidays(new Date().getFullYear()),
          getWorkWeek()
        ])
        
        setHolidays(holidaysData.map(h => new Date(h.holiday_date)))
        const normalizedWorkWeek = workWeekData.map(day => ({
          ...day,
          is_working_day: typeof day.is_working_day === 'boolean' ? (day.is_working_day ? 1 : 0) : day.is_working_day
        }))
        setWorkWeek(normalizedWorkWeek)
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load holiday and work week data: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setDataLoading(false)
      }
    }

    loadStaticData()
  }, [toast])

  const handleFilter = () => {
    onDateChange(startDate, endDate)
  }

  const handleBalanceClick = (balance: LeaveBalance) => {
    setSelectedLeaveBalance(balance)
    setIsLedgerOpen(true)
  }

  const handleUpdateBalanceClick = () => {
    setSelectedLeaveTypeId("")
    setNewBalance("")
    setIsUpdateBalanceOpen(true)
  }

  const handleUpdateBalance = async () => {
    if (!selectedLeaveTypeId || !newBalance) {
      toast({
        title: "Validation Error",
        description: "Please select a leave type and enter a new balance.",
        variant: "destructive",
      })
      return
    }

    const numericBalance = parseFloat(newBalance)
    if (isNaN(numericBalance) || numericBalance < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid positive number for the balance.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    // Store the old balance for rollback on error
    const oldBalances = [...leaveBalances]

    // Optimistic update - update the UI immediately
    setLeaveBalances(prevBalances => 
      prevBalances.map(balance => 
        String(balance.id) === selectedLeaveTypeId
          ? { ...balance, balance: String(numericBalance) }
          : balance
      )
    )

    try {
      await updateLeaveBalance(numericBalance, employeeId, parseInt(selectedLeaveTypeId))
      
      toast({
        title: "Success",
        description: "Leave balance has been updated successfully.",
      })
      
      setIsUpdateBalanceOpen(false)
      setSelectedLeaveTypeId("")
      setNewBalance("")
      
      // Call the callback if provided (for any additional refresh logic)
      if (onBalanceUpdated) {
        onBalanceUpdated()
      }
    } catch (error: any) {
      // Rollback the optimistic update on error
      setLeaveBalances(oldBalances)
      
      toast({
        title: "Error",
        description: `Failed to update leave balance: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusFromRecord = (
    record: LeaveRecord
  ): "approved" | "rejected" | "pending" => {
    if (record.rejection_reason != null) return "rejected"
    if (record.primary_status && record.secondry_status) return "approved"
    return "pending"
  }

  const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateLeaveDays = React.useCallback((startDate: Date | string, endDate: Date | string) => {
    if (dataLoading || workWeek.length === 0) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }

    let count = 0
    const currentDate = new Date(startDate)
    const lastDate = new Date(endDate)
    
    currentDate.setHours(0, 0, 0, 0)
    lastDate.setHours(0, 0, 0, 0)
    
    while(currentDate <= lastDate) {
      const dayOfWeek = currentDate.getDay()
      
      const isHoliday = holidays.some(h => {
        const holidayDate = new Date(h)
        holidayDate.setHours(0, 0, 0, 0)
        return holidayDate.getTime() === currentDate.getTime()
      })
      
      const workDayConfig = workWeek.find(d => 
        ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        .indexOf(d.day_of_week) === dayOfWeek
      )
      const isWorkingDay = workDayConfig ? 
        (typeof workDayConfig.is_working_day === 'boolean' ? workDayConfig.is_working_day : workDayConfig.is_working_day === 1) : 
        true
      
      if(!isHoliday && isWorkingDay) {
        count++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return count
  }, [holidays, workWeek, dataLoading])

  const selectedLeaveForUpdate = leaveBalances.find(b => String(b.id) === selectedLeaveTypeId)

  return (
    <>
      <div className="space-y-6">
        <Card className="border-indigo-200 dark:border-indigo-900">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Leave Balances
                </CardTitle>
                <CardDescription className="text-indigo-700 dark:text-indigo-300">
                  Current available leave balances by type. Click any balance to view its ledger
                </CardDescription>
              </div>
              <Button
                onClick={handleUpdateBalanceClick}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Balance
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <BalanceCardsSkeleton />
            ) : leaveBalances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Leave Balances</h3>
                <p className="text-muted-foreground">No leave balances found for this employee.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {leaveBalances.map((balance) => (
                  <Card 
                    key={balance.id} 
                    className={`cursor-pointer hover:border-primary transition-all hover:shadow-md ${Number(balance.balance) === 0 ? "opacity-60" : ""}`}
                    onClick={() => handleBalanceClick(balance)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {balance.leave_type_name}
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary">{balance.balance}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Number(balance.balance) === 1 ? "day available" : "days available"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Application History</CardTitle>
            <CardDescription>
              View and filter leave requests submitted by this employee. Working days calculation excludes holidays and non-working days
            </CardDescription>
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <div className="grid gap-2 flex-1">
                <Label htmlFor="start-date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2 flex-1">
                <Label htmlFor="end-date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleFilter} 
                  className="w-full md:w-auto"
                  variant="outline"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton />
            ) : leaveRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <UserPlus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Leave Records Found</h3>
                <p className="text-muted-foreground">
                  No leave requests found for the selected date range.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave ID</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Working Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied On</TableHead>
                      <TableHead>Primary Approver</TableHead>
                      <TableHead>Secondary Approver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-medium">
                          <Link 
                            href={`/management/leaves/${record.id}`}
                            className="text-primary hover:underline"
                          >
                            {record.full_leave_id || record.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.leave_type_name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(record.from_date).toLocaleDateString('en-AE')}</div>
                            <div className="text-muted-foreground text-xs">to</div>
                            <div>{new Date(record.to_date).toLocaleDateString('en-AE')}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            {calculateLeaveDays(record.from_date, record.to_date)} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(getStatusFromRecord(record))}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(record.applied_date).toLocaleDateString('en-AE')}
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.primary_approver_name || "Not assigned"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.secondary_approver_name || "Not assigned"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Balance Dialog */}
      <Dialog open={isUpdateBalanceOpen} onOpenChange={setIsUpdateBalanceOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Edit className="h-6 w-6" />
              Update Leave Balance
            </DialogTitle>
            <DialogDescription>
              Select a leave type and set the new balance for this employee
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="leave-type" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Leave Type *
              </Label>
              <Select 
                value={selectedLeaveTypeId} 
                onValueChange={setSelectedLeaveTypeId}
                disabled={isUpdating}
              >
                <SelectTrigger id="leave-type">
                  <SelectValue placeholder="Select a leave type..." />
                </SelectTrigger>
                <SelectContent>
                  {leaveBalances.map(balance => (
                    <SelectItem key={balance.id} value={String(balance.id)}>
                      {balance.leave_type_name} (Current: {balance.balance} days)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLeaveForUpdate && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      Current Balance
                    </div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {selectedLeaveForUpdate.balance} days
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-balance" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                New Balance (days) *
              </Label>
              <Input
                id="new-balance"
                type="number"
                step="0.5"
                min="0"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="Enter new balance..."
                disabled={isUpdating || !selectedLeaveTypeId}
              />
              <p className="text-xs text-muted-foreground">
                This will override the current balance with the new value
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsUpdateBalanceOpen(false)
                setSelectedLeaveTypeId("")
                setNewBalance("")
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBalance}
              disabled={isUpdating || !selectedLeaveTypeId || !newBalance}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update Balance
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LeaveLedgerDialog 
        employeeId={employeeId} 
        leaveBalance={selectedLeaveBalance}
        open={isLedgerOpen} 
        onOpenChange={setIsLedgerOpen}
      />
    </>
  )
}
