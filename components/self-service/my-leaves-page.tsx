
// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Plus, Calendar, CheckCircle, XCircle, Clock, Eye, User, AlertCircle } from "lucide-react"
// import { type LeaveBalance, type LeaveRecord, getLeaveBalances, getMyLeaveRecords, requestLeave, getLeaveTypes, type LeaveType , deleteLeaveRequest} from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// export function MyLeavesPage() {
//   const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
//   const [leaveApplications, setLeaveApplications] = useState<LeaveRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false)
//   const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null)
//   const [formData, setFormData] = useState({
//     leave_type: "", // This will store the leave type ID
//     from_date: "",
//     to_date: "",
//     reason: "",
//   })
//   const { toast } = useToast()

//   const loadLeaveData = async () => {
//     try {
//       setLoading(true)
//       const [balances, applications] = await Promise.all([
//           getLeaveBalances(),
//           getMyLeaveRecords(),
//       ]);
//       setLeaveBalances(balances)
//       setLeaveApplications(applications as LeaveRecord[] | [])
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load leave data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadLeaveData()
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!formData.leave_type || !formData.from_date || !formData.to_date) {
//         toast({ title: "Error", description: "Please fill out all date and type fields.", variant: "destructive" });
//         return;
//     }
    

//     const fromDate = new Date(formData.from_date);
//     const toDate = new Date(formData.to_date);

//     if (toDate < fromDate) {
//         toast({ title: "Error", description: "'To Date' cannot be before 'From Date'.", variant: "destructive" });
//         return;
//     }

//     const timeDiff = toDate.getTime() - fromDate.getTime()
//     const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

//     const selectedLeaveTypeId = parseInt(formData.leave_type);
//     const selectedLeaveBalance = leaveBalances.find(b => b.id === selectedLeaveTypeId);

//     if (!selectedLeaveBalance || daysDiff > selectedLeaveBalance.balance) {
//         toast({
//             title: "Insufficient Balance",
//             description: `You only have ${selectedLeaveBalance?.balance || 0} days of ${selectedLeaveBalance?.leave_type_name || ''} available for a ${daysDiff}-day request.`,
//             variant: "destructive"
//         });
//         return;
//     }

//     try {
//       await requestLeave({
//           leave_type: selectedLeaveTypeId,
//           from_date: formData.from_date,
//           to_date: formData.to_date,
//           leave_description: formData.reason,
//       })

//       toast({ title: "Success", description: "Leave application submitted successfully" })
//       setDialogOpen(false)
//       setFormData({ leave_type: "", from_date: "", to_date: "", reason: "" })
//       loadLeaveData();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to submit leave application",
//         variant: "destructive",
//       })
//     }
//   }

//   const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
//     if (record.rejection_reason != null) return "rejected";
//     if (record.primary_status == true && record.secondry_status == true) return "approved";
//     return "pending";
//   }

//   const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
//     switch (status) {
//       case "approved":
//         return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
//       case "rejected":
//         return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
//       case "pending":
//         return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
//     }
//   }

//   const calculateLeaveDays = (startDate: Date, endDate: Date) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//   }

//   const handleLeaveRowClick = (leave: LeaveRecord) => {
//     setSelectedLeave(leave)
//     setDetailDialogOpen(true)
//   }
//   const handleDeleteRequest=async(leaveId:number)=>{
//       setDetailDialogOpen(false)
//       await deleteLeaveRequest(selectedLeave?.id!)
//       await loadLeaveData()
//     }

//   const getApprovalStatus = (leave: LeaveRecord) => {
//     const status = getStatusFromRecord(leave)
    
//     if (status === "rejected") {
//       return {
//         primaryStatus: "Rejected",
//         secondaryStatus: "N/A",
//         primaryClass: "text-red-600",
//         secondaryClass: "text-gray-500"
//       }
//     }
    
//     if (status === "approved") {
//       return {
//         primaryStatus: "Approved",
//         secondaryStatus: "Approved", 
//         primaryClass: "text-green-600",
//         secondaryClass: "text-green-600"
//       }
//     }
    
//     // Pending status
//     return {
//       primaryStatus: leave.primary_status === true ? "Approved" : leave.primary_status === false ? "Rejected" : "Pending",
//       secondaryStatus: leave.secondry_status === true ? "Approved" : leave.secondry_status === false ? "Rejected" : "Pending",
//       primaryClass: leave.primary_status === true ? "text-green-600" : leave.primary_status === false ? "text-red-600" : "text-yellow-600",
//       secondaryClass: leave.secondry_status === true ? "text-green-600" : leave.secondry_status === false ? "text-red-600" : "text-yellow-600"
//     }
//   }

//   if (loading) {
//     return <div className="flex items-center justify-center h-64">Loading...</div>
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">My Leaves</h1>
//           <p className="text-muted-foreground">Manage your leave applications and view balances</p>
//         </div>
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Button >
//               <Plus className="h-4 w-4 mr-2" />
//               Apply for Leave
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Apply for Leave</DialogTitle>
//               <DialogDescription>Submit a new leave application</DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleSubmit}>
//               <div className="grid gap-4 py-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="leave_type">Leave Type</Label>
//                   <Select
//                     value={formData.leave_type}
//                     onValueChange={(value) => setFormData({ ...formData, leave_type: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select leave type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {leaveBalances.map((balance) => (
//                         <SelectItem key={balance.id} value={balance.id.toString()}>
//                           {balance.leave_type_name} ({balance.balance} days available)
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="from_date">From Date</Label>
//                     <Input
//                       id="from_date"
//                       type="date"
//                       value={formData.from_date}
//                       onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
//                       required
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="to_date">To Date</Label>
//                     <Input
//                       id="to_date"
//                       type="date"
//                       value={formData.to_date}
//                       onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="reason">Reason</Label>
//                   <Textarea
//                     id="reason"
//                     value={formData.reason}
//                     onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                     placeholder="Please provide a reason for your leave"
//                     required
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">Submit Application</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {leaveBalances.map((balance) => (
//           <Card key={balance.id}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">{balance.leave_type_name}</CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{balance.balance}</div>
//               <p className="text-xs text-muted-foreground">days available</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {
//         leaveApplications.length===0?
//         <Card>
//         <CardHeader>
//           <CardTitle>No Leave Application Found</CardTitle>
//           <CardDescription>No leaves applications in your profile</CardDescription>
//         </CardHeader>
//         </Card>
//         :
//         <Card>
//         <CardHeader>
//           <CardTitle>Leave Applications</CardTitle>
//           <CardDescription>Your leave application history and status. Click on a row to view details.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Leave Type</TableHead>
//                 <TableHead>Dates</TableHead>
//                 <TableHead>Days</TableHead>
//                 <TableHead>Reason</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Applied Date</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {leaveApplications.map((application) => (
//                 <TableRow key={application.id} className="cursor-pointer hover:bg-muted" onClick={() => handleLeaveRowClick(application)}>
//                   <TableCell className="font-medium">{application.leave_type_name}</TableCell>
//                   <TableCell>{new Date(application.from_date).toLocaleDateString()} - {new Date(application.to_date).toLocaleDateString()}</TableCell>
//                   <TableCell>{calculateLeaveDays(application.from_date, application.to_date)}</TableCell>
//                   <TableCell className="max-w-[200px] truncate">{application.leave_description}</TableCell>
//                   <TableCell>{getStatusBadge(getStatusFromRecord(application))}</TableCell>
//                   <TableCell>{new Date(application.applied_date).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleLeaveRowClick(application); }}>
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//       }

//       {/* Leave Detail Dialog */}
//       <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
//         <DialogContent className="sm:max-w-lg max-h-120 overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Leave Application Details</DialogTitle>
//             <DialogDescription>
//               Application ID: {selectedLeave?.id}
//             </DialogDescription>
//           </DialogHeader>
//           {selectedLeave && (
//             <div className="py-4 space-y-6">
//               {/* Basic Information */}
//               <div className="space-y-3">
//                 <h4 className="font-semibold text-sm">Leave Information</h4>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <Label className="text-muted-foreground">Leave Type</Label>
//                     <p className="font-medium">{selectedLeave.leave_type_name}</p>
//                   </div>
//                   <div>
//                     <Label className="text-muted-foreground">Duration</Label>
//                     <p className="font-medium">{calculateLeaveDays(selectedLeave.from_date, selectedLeave.to_date)} days</p>
//                   </div>
//                   <div>
//                     <Label className="text-muted-foreground">From Date</Label>
//                     <p className="font-medium">{new Date(selectedLeave.from_date).toLocaleDateString()}</p>
//                   </div>
//                   <div>
//                     <Label className="text-muted-foreground">To Date</Label>
//                     <p className="font-medium">{new Date(selectedLeave.to_date).toLocaleDateString()}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <Label className="text-muted-foreground">Applied Date</Label>
//                     <p className="font-medium">{new Date(selectedLeave.applied_date).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               {/* Reason */}
//               <div className="space-y-2">
//                 <h4 className="font-semibold text-sm">Reason for Leave</h4>
//                 <p className="text-sm bg-muted p-3 rounded-md">{selectedLeave.leave_description}</p>
//               </div>

//               <Separator />

//               {/* Approval Status */}
//               <div className="space-y-3">
//                 <h4 className="font-semibold text-sm flex items-center gap-2">
//                   <User className="h-4 w-4" />
//                   Approval Status
//                 </h4>
//                 <div className="space-y-3">
//                   {(() => {
//                     const approvalStatus = getApprovalStatus(selectedLeave)
//                     return (
//                       <>
//                         <div className="flex items-center justify-between p-3 bg-muted rounded-md">
//                           <div>
//                             <p className="text-sm font-medium">Primary Approver</p>
//                             <p className="text-xs text-muted-foreground">
//                               {selectedLeave.primary_approver_name || "Not assigned"}
//                             </p>
//                           </div>
//                           <Badge className={`${approvalStatus.primaryClass}`} variant="outline">
//                             {approvalStatus.primaryStatus}
//                           </Badge>
//                         </div>
                        
//                         <div className="flex items-center justify-between p-3 bg-muted rounded-md">
//                           <div>
//                             <p className="text-sm font-medium">Secondary Approver</p>
//                             <p className="text-xs text-muted-foreground">
//                               {selectedLeave.secondary_approver_name || "Not assigned"}
//                             </p>
//                           </div>
//                           <Badge className={`${approvalStatus.secondaryClass}`} variant="outline">
//                             {approvalStatus.secondaryStatus}
//                           </Badge>
//                         </div>
//                       </>
//                     )
//                   })()}
//                 </div>
//               </div>

//               {/* Rejection Reason (if applicable) */}
//               {selectedLeave.rejection_reason && (
//                 <>
//                   <Separator />
//                   <div className="space-y-2">
//                     <h4 className="font-semibold text-sm text-red-600 flex items-center gap-2">
//                       <AlertCircle className="h-4 w-4" />
//                       Rejection Reason
//                     </h4>
//                     <p className="text-sm bg-red-50 border border-red-200 p-3 rounded-md text-red-800">
//                       {selectedLeave.rejection_reason}
//                     </p>
//                   </div>
//                 </>
//               )}

//               {/* Overall Status */}
//               <Separator />
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Overall Status:</span>
//                 {getStatusBadge(getStatusFromRecord(selectedLeave))}
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             {detailDialogOpen && getStatusFromRecord(selectedLeave!)==="pending"?<Button variant="destructive" onClick={() => {handleDeleteRequest(selectedLeave?.id!)}}>
//               Delete
//             </Button>:<></>}
//             <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

"use client"

import * as React from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Eye, User, AlertCircle, Filter, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type LeaveBalance, type LeaveRecord, getLeaveBalances, getMyLeaveRecords, requestLeave, getHolidays, getWorkWeek, type Holiday, deleteLeaveRequest} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Updated interface to match API response - making optional properties that might not always be present
interface ApiWorkWeekDay {
  id?: number;
  day_of_week: string;
  is_working_day: number | boolean; // Support both number and boolean
  created_at?: string;
  updated_at?: string;
  updated_by?: string | null;
}

export function MyLeavesPage() {
  const [leaveBalances, setLeaveBalances] = React.useState<LeaveBalance[]>([])
  const [leaveApplications, setLeaveApplications] = React.useState<LeaveRecord[]>([])
  const [holidays, setHolidays] = React.useState<Date[]>([])
  const [workWeek, setWorkWeek] = React.useState<ApiWorkWeekDay[]>([])
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false)
  const [selectedLeave, setSelectedLeave] = React.useState<LeaveRecord | null>(null)
  
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [filterRange, setFilterRange] = React.useState({
      from: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd"),
      to: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), "yyyy-MM-dd")
  });

  const [formData, setFormData] = React.useState({
    leave_type: "",
    reason: "",
  })
  const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
    if (record.rejection_reason != null) return "rejected";
    if (record.primary_status && record.secondry_status) return "approved";
    return "pending";
  }
  const { toast } = useToast()

  const loadLeaveData = React.useCallback(async (from?: string, to?: string) => {
    try {
      setLoading(true)
      const [balances, applications, holidaysData, workWeekData] = await Promise.all([
          getLeaveBalances(),
          getMyLeaveRecords(from, to),
          getHolidays(new Date().getFullYear()),
          getWorkWeek()
      ]);
      setLeaveBalances(balances)
      setLeaveApplications(applications as LeaveRecord[] || [])
      setHolidays(holidaysData.map(h => new Date(h.holiday_date)))
      // Normalize the workWeek data to handle both boolean and number types
      const normalizedWorkWeek = workWeekData.map(day => ({
        ...day,
        is_working_day: typeof day.is_working_day === 'boolean' ? (day.is_working_day ? 1 : 0) : day.is_working_day
      }));
      setWorkWeek(normalizedWorkWeek)
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load leave data: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    loadLeaveData(filterRange.from, filterRange.to)
  }, [filterRange, loadLeaveData])

  const disabledDays = React.useMemo(() => {
    // Handle both boolean and number types for is_working_day
    const nonWorkingWeekDays = workWeek
        .filter(d => {
          const isWorking = typeof d.is_working_day === 'boolean' ? d.is_working_day : d.is_working_day === 1;
          return !isWorking;
        })
        .map(d => ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(d.day_of_week));

    const approvedLeaveDates = leaveApplications
      .filter(app => getStatusFromRecord(app) === 'approved')
      .flatMap(app => {
        const dates = [];
        let currentDate = new Date(app.from_date);
        const endDate = new Date(app.to_date);
        while(currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
      });

    // Create a comprehensive disabled function
    const disabledFunction = (date: Date) => {
      // Check if it's a non-working weekday
      const dayOfWeek = date.getDay();
      if (nonWorkingWeekDays.includes(dayOfWeek)) {
        return true;
      }

      // Check if it's a holiday
      const isHoliday = holidays.some(h => {
        const holidayDate = new Date(h);
        return holidayDate.toDateString() === date.toDateString();
      });
      if (isHoliday) {
        return true;
      }

      // Check if it's an approved leave date
      const isApprovedLeaveDate = approvedLeaveDates.some(approvedDate => 
        approvedDate.toDateString() === date.toDateString()
      );
      if (isApprovedLeaveDate) {
        return true;
      }

      return false;
    };

    return disabledFunction;
  }, [holidays, workWeek, leaveApplications]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    
    
    // More explicit validation
    const hasLeaveType = formData.leave_type && formData.leave_type.trim() !== '';
    const hasDateFrom = dateRange?.from !== undefined && dateRange?.from !== null;
    const hasDateTo = dateRange?.to !== undefined && dateRange?.to !== null;
    
    
    
    if (!hasLeaveType || !hasDateFrom || !hasDateTo) {
        const missingFields = [];
        if (!hasLeaveType) missingFields.push('Leave Type');
        if (!hasDateFrom || !hasDateTo) missingFields.push('Date Range');
        
        toast({ 
          title: "Validation Error", 
          description: `Please select: ${missingFields.join(', ')}`, 
          variant: "destructive" 
        });
        return;
    }

    if (!formData.reason || formData.reason.trim() === '') {
        toast({ 
          title: "Validation Error", 
          description: "Please provide a reason for your leave.", 
          variant: "destructive" 
        });
        return;
    }

    const fromDate = new Date(dateRange.from!);
    const toDate = new Date(dateRange.to!);

   

    // Validate date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (fromDate < today) {
        toast({ 
          title: "Invalid Date", 
          description: "Cannot apply for leave in the past.", 
          variant: "destructive" 
        });
        return;
    }

    let dayCount = 0;
    let currentDate = new Date(fromDate);

    while(currentDate <= toDate) {
        const dayOfWeek = currentDate.getDay();
        const isHoliday = holidays.some(h => {
          const holidayDate = new Date(h);
          return holidayDate.toDateString() === currentDate.toDateString();
        });
        
        // Check if it's an approved leave date
        const isApprovedLeaveDate = leaveApplications
          .filter(app => getStatusFromRecord(app) === 'approved')
          .some(app => {
            const fromDate = new Date(app.from_date);
            const toDate = new Date(app.to_date);
            return currentDate >= fromDate && currentDate <= toDate;
          });
        
        // Handle both boolean and number types for is_working_day
        const workDayConfig = workWeek.find(d => 
          ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
          .indexOf(d.day_of_week) === dayOfWeek
        );
        const isWorkingDay = workDayConfig ? 
          (typeof workDayConfig.is_working_day === 'boolean' ? workDayConfig.is_working_day : workDayConfig.is_working_day === 1) : 
          false;
        
        if(!isHoliday && !isApprovedLeaveDate && isWorkingDay) {
            dayCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    

    if (dayCount === 0) {
        toast({
            title: "Invalid Date Range",
            description: "The selected date range contains no working days.",
            variant: "destructive"
        });
        return;
    }
    
    const selectedLeaveTypeId = parseInt(formData.leave_type);
    const selectedLeaveBalance = leaveBalances.find(b => b.id === selectedLeaveTypeId);

    

    if (!selectedLeaveBalance || dayCount > selectedLeaveBalance.balance) {
        toast({
            title: "Insufficient Balance",
            description: `You only have ${selectedLeaveBalance?.balance || 0} days of ${selectedLeaveBalance?.leave_type_name || ''} available. You're requesting ${dayCount} days.`,
            variant: "destructive"
        });
        return;
    }

    try {
      setSubmitting(true)
      
      const leaveRequest = {
          leave_type: selectedLeaveTypeId,
          from_date: format(fromDate, "yyyy-MM-dd"),
          to_date: format(toDate, "yyyy-MM-dd"),
          leave_description: formData.reason.trim(),
      };
      
      
      
      await requestLeave(leaveRequest)

      toast({ 
        title: "Success", 
        description: "Leave application submitted successfully" 
      })
      
      // Reset form and close dialog
      
      setDialogOpen(false)
      setFormData({ leave_type: "", reason: "" })
      setDateRange(undefined);
      
      // Reload data
      loadLeaveData(filterRange.from, filterRange.to);
    } catch (error: any) {
      
      toast({
        title: "Error",
        description: error.message || "Failed to submit leave application",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  

  const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }
  }

  const calculateLeaveDays = React.useCallback((startDate: Date | string, endDate: Date | string) => {
    let count = 0;
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    // Reset time to avoid timezone issues
    currentDate.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    while(currentDate <= lastDate) {
        const dayOfWeek = currentDate.getDay();
        const isHoliday = holidays.some(h => {
          const holidayDate = new Date(h);
          holidayDate.setHours(0, 0, 0, 0);
          return holidayDate.getTime() === currentDate.getTime();
        });
        
        // Don't exclude approved leave dates from calculation for display purposes
        // We only exclude them during form submission validation
        
        // Handle both boolean and number types for is_working_day
        const workDayConfig = workWeek.find(d => 
          ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
          .indexOf(d.day_of_week) === dayOfWeek
        );
        const isWorkingDay = workDayConfig ? 
          (typeof workDayConfig.is_working_day === 'boolean' ? workDayConfig.is_working_day : workDayConfig.is_working_day === 1) : 
          false;
        
        if(!isHoliday && isWorkingDay) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  }, [holidays, workWeek]);
  
  const handleLeaveRowClick = (leave: LeaveRecord) => {
    setSelectedLeave(leave)
    setDetailDialogOpen(true)
  }
  
  const handleDeleteRequest = async (leaveId: number) => {
    try {
      setDetailDialogOpen(false)
      await deleteLeaveRequest(leaveId)
      toast({
        title: "Success",
        description: "Leave request deleted successfully"
      })
      await loadLeaveData(filterRange.from, filterRange.to)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete leave request",
        variant: "destructive"
      })
    }
  }

  const getApprovalStatus = (leave: LeaveRecord) => {
    const status = getStatusFromRecord(leave)
    
    if (status === "rejected") {
      return {
        primaryStatus: "Rejected",
        secondaryStatus: "N/A",
        primaryClass: "text-red-600",
        secondaryClass: "text-gray-500"
      }
    }
    
    if (status === "approved") {
      return {
        primaryStatus: "Approved",
        secondaryStatus: "Approved", 
        primaryClass: "text-green-600",
        secondaryClass: "text-green-600"
      }
    }
    
    return {
      primaryStatus: leave.primary_status ? "Approved" : "Pending",
      secondaryStatus: leave.secondry_status ? "Approved" : "Pending",
      primaryClass: leave.primary_status ? "text-green-600" : "text-yellow-600",
      secondaryClass: leave.secondry_status ? "text-green-600" : "text-yellow-600"
    }
  }

  // Calculate expected working days for date range preview
  const expectedWorkingDays = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return calculateLeaveDays(dateRange.from, dateRange.to);
  }, [dateRange, calculateLeaveDays]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Leaves</h1>
          <p className="text-muted-foreground">Manage your leave applications and view balances</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>Submit a new leave application</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="leave_type">Leave Type *</Label>
                      <Select 
                        value={formData.leave_type} 
                        onValueChange={(value) => {
                          
                          const newFormData = { ...formData, leave_type: value };
                          
                          setFormData(newFormData);
                        }}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          {leaveBalances.length > 0 ? leaveBalances.map((balance) => (
                            <SelectItem 
                              key={balance.id} 
                              value={balance.id.toString()}
                              disabled={balance.balance === 0}
                            >
                              {balance.leave_type_name} ({balance.balance} days available)
                            </SelectItem>
                          )) : (
                            <SelectItem value="no-balance" disabled>No leave types available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {formData.leave_type && (
                        <p className="text-xs text-green-600">Selected: {leaveBalances.find(b => b.id.toString() === formData.leave_type)?.leave_type_name}</p>
                      )}
                    </div>
                    
                    <div className="grid gap-2">
                        <Label>Date Range *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button 
                                  id="date" 
                                  variant={"outline"} 
                                  className={cn(
                                    "w-full justify-start text-left font-normal", 
                                    !dateRange && "text-muted-foreground"
                                  )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                      dateRange.to ? (
                                        <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>
                                      ) : (
                                        format(dateRange.from, "LLL dd, y")
                                      )
                                    ) : (
                                      <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar 
                                  initialFocus 
                                  mode="range" 
                                  defaultMonth={dateRange?.from || new Date()} 
                                  selected={dateRange} 
                                  onSelect={(range) => {
                                    
                                    
                                    // Ensure we're setting the range properly
                                    if (range) {
                                      
                                      setDateRange(range);
                                    } else {
                                      
                                      setDateRange(undefined);
                                    }
                                    
                                    // Log the state after setting (this might not show immediately due to async state)
                                    setTimeout(() => {
                                      
                                    }, 100);
                                  }}
                                  numberOfMonths={2} 
                                  disabled={disabledDays}
                                  fromDate={new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                        {dateRange?.from && dateRange?.to && (
                          <p className="text-xs text-green-600">
                            Selected: {format(dateRange.from, "dd/MM/yyyy")} to {format(dateRange.to, "dd/MM/yyyy")}
                          </p>
                        )}
                        {expectedWorkingDays > 0 && (
                          <p className="text-xs text-blue-600">
                            Working days: {expectedWorkingDays}
                          </p>
                        )}
                    </div>
                    
                     <div className="grid gap-2">
                      <Label htmlFor="reason">Reason *</Label>
                      <Textarea 
                        id="reason" 
                        value={formData.reason} 
                        onChange={(e) => {
                          
                          setFormData({ ...formData, reason: e.target.value });
                        }}
                        placeholder="Reason for your leave" 
                        rows={3}
                        required
                      />
                      {formData.reason && (
                        <p className="text-xs text-green-600">Reason provided ({formData.reason.length} characters)</p>
                      )}
                    </div>
                </div>
                <div className="flex justify-center items-center bg-muted rounded-md p-4">
                   <Calendar 
                     mode="range" 
                     selected={dateRange} 
                     onSelect={(range) => {
                       
                       setDateRange(range);
                     }}
                     disabled={disabledDays} 
                     className="p-0"
                     fromDate={new Date()}
                   />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    
                    setDialogOpen(false)
                    setFormData({ leave_type: "", reason: "" })
                    setDateRange(undefined)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalances.map((balance) => (
          <Card key={balance.id} className={balance.balance === 0 ? "opacity-60" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{balance.leave_type_name}</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balance.balance}</div>
              <p className="text-xs text-muted-foreground">
                {balance.balance === 1 ? "day available" : "days available"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Applications</CardTitle>
          <CardDescription>Your leave application history and status.</CardDescription>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex gap-2">
              <Input 
                type="date" 
                value={filterRange.from} 
                onChange={e => setFilterRange({...filterRange, from: e.target.value})} 
                className="w-auto"
              />
              <Input 
                type="date" 
                value={filterRange.to} 
                onChange={e => setFilterRange({...filterRange, to: e.target.value})} 
                className="w-auto"
              />
            </div>
            <Button 
              onClick={() => loadLeaveData(filterRange.from, filterRange.to)}
              variant="outline"
            >
              <Filter className="h-4 w-4 mr-2"/>
              Apply Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {leaveApplications.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No leave applications found for the selected period.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>

                    <TableHead>Id</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveApplications.map((app) => (
                    <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{app.full_leave_id}</TableCell>
                      <TableCell className="font-medium">{app.leave_type_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(app.from_date), "dd-MM-yyyy")} to {format(new Date(app.to_date), "dd-MM-yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>{calculateLeaveDays(new Date(app.from_date), new Date(app.to_date))}</TableCell>
                      <TableCell>{getStatusBadge(getStatusFromRecord(app))}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleLeaveRowClick(app); 
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leave Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
            <DialogDescription>
              Application ID: {selectedLeave?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="py-4 space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Leave Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Leave Type</Label>
                    <p className="font-medium">{selectedLeave.leave_type_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Duration</Label>
                    <p className="font-medium">{calculateLeaveDays(selectedLeave.from_date, selectedLeave.to_date)} days</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">From Date</Label>
                    <p className="font-medium">{format(new Date(selectedLeave.from_date), "dd MMM yyyy")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">To Date</Label>
                    <p className="font-medium">{format(new Date(selectedLeave.to_date), "dd MMM yyyy")}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Applied Date</Label>
                    <p className="font-medium">{format(new Date(selectedLeave.applied_date), "dd MMM yyyy")}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Reason for Leave</h4>
                <p className="text-sm bg-muted p-3 rounded-md">{selectedLeave.leave_description}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Approval Status
                </h4>
                <div className="space-y-3">
                  {(() => {
                    const approvalStatus = getApprovalStatus(selectedLeave)
                    return (
                      <>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <p className="text-sm font-medium">Primary Approver</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedLeave.primary_approver_name || "Not assigned"}
                            </p>
                          </div>
                          <Badge className={`${approvalStatus.primaryClass}`} variant="outline">
                            {approvalStatus.primaryStatus}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <p className="text-sm font-medium">Secondary Approver</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedLeave.secondary_approver_name || "Not assigned"}
                            </p>
                          </div>
                          <Badge className={`${approvalStatus.secondaryClass}`} variant="outline">
                            {approvalStatus.secondaryStatus}
                          </Badge>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              {selectedLeave.rejection_reason && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Rejection Reason
                    </h4>
                    <p className="text-sm bg-red-50 border border-red-200 p-3 rounded-md text-red-800">
                      {selectedLeave.rejection_reason}
                    </p>
                  </div>
                </>
              )}

              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Status:</span>
                {getStatusBadge(getStatusFromRecord(selectedLeave))}
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedLeave && getStatusFromRecord(selectedLeave) === "pending" && (
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteRequest(selectedLeave.id)}
                className="mr-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Request
              </Button>
            )}
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}