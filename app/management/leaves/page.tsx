
// interface ApiWorkWeekDay {
//   id?: number;
//   day_of_week: string;
//   is_working_day: number | boolean; // Support both number and boolean
//   created_at?: string;
//   updated_at?: string;
//   updated_by?: string | null;
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useAuth } from "@/lib/auth-context";
// import { MainLayout } from "@/components/main-layout";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   UserPlus,
//   AlertCircle,
//   CheckCircle,
//   History,
//   Filter,
//   Info,
//   XCircle,
//   Clock,
//   Download,
// } from "lucide-react";
// import {
//   getPrimaryLeaveApprovals,
//   getSecondaryLeaveApprovals,
//   getApprovalHistory,
//   downloadLeaveApplication,
//   type LeaveRecord,
//   LeaveRecordHistory,
//   getHolidays,
//   getWorkWeek,
// } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import React from "react";

// function formatDate(date: string, tz: string = "UTC") {
//   return new Date(date)
//     .toLocaleDateString("en-GB", { timeZone: tz })
//     .replace(/\//g, "-");
// }

// export default function LeaveManagementPage() {
//   const { hasPermission, user } = useAuth();
//   const { toast } = useToast();
//   const router = useRouter();

//   const [primaryRequests, setPrimaryRequests] = useState<LeaveRecord[]>([]);
//   const [secondaryRequests, setSecondaryRequests] = useState<LeaveRecord[]>([]);
//   const [historyRequests, setHistoryRequests] = useState<LeaveRecordHistory[]>(
//     []
//   );
//   const [loading, setLoading] = useState(true);
//   const [holidays, setHolidays] = React.useState<Date[]>([])
//   const [workWeek, setWorkWeek] = React.useState<ApiWorkWeekDay[]>([])

//   const [dateRange, setDateRange] = useState(() => {
//     const today = new Date();
//     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//     return {
//         from: firstDayOfMonth.toISOString().split("T")[0],
//         to: lastDayOfMonth.toISOString().split("T")[0],
//     };
//   });

//   const canManageLeaves = hasPermission("leaves.manage");

  

//   const fetchPendingLeaves = useCallback(async () => {
//     if (!canManageLeaves) {
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     try {

      

//       const [primaryData, secondaryData,holidaysData, workWeekData] = await Promise.all([
//         getPrimaryLeaveApprovals(),
//         getSecondaryLeaveApprovals(),
//         getHolidays(new Date().getFullYear()),
//         getWorkWeek()
//       ]);

//       setHolidays(holidaysData.map(h => new Date(h.holiday_date)))
//       // Normalize the workWeek data to handle both boolean and number types
//       const normalizedWorkWeek = workWeekData.map(day => ({
//         ...day,
//         is_working_day: typeof day.is_working_day === 'boolean' ? (day.is_working_day ? 1 : 0) : day.is_working_day
//       }));
//       setWorkWeek(normalizedWorkWeek)
//       setPrimaryRequests(
//         primaryData.filter(
//           (r) => !r.primary_status && r.primary_user === user?.id
//         )
//       );
//       setSecondaryRequests(
//         secondaryData.filter(
//           (r) => r.primary_status && !r.secondry_status
//         )
//       );
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Could not fetch pending leave requests.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [canManageLeaves, user, toast]);

//   const fetchHistoryLeaves = useCallback(async () => {
//     if (!canManageLeaves) return;
//     setLoading(true);
//     try {
//       const historyData = await getApprovalHistory(
//         dateRange.from,
//         dateRange.to
//       );
//       setHistoryRequests(historyData as LeaveRecordHistory[] | []);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Could not fetch approval history.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [canManageLeaves, dateRange, toast]);

//   useEffect(() => {
//     fetchPendingLeaves();
//     fetchHistoryLeaves();
//   }, [fetchPendingLeaves, fetchHistoryLeaves]);

//   const handleDownload = async (e: React.MouseEvent, leaveId: number) => {
//     e.stopPropagation();
//     try {
//       await downloadLeaveApplication(leaveId);
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to download PDF: ${error.message}`, variant: "destructive" });
//     }
//   }

//   const calculateLeaveDays = React.useCallback((startDate: Date | string, endDate: Date | string) => {
//       let count = 0;
//       const currentDate = new Date(startDate);
//       const lastDate = new Date(endDate);
      
//       // Reset time to avoid timezone issues
//       currentDate.setHours(0, 0, 0, 0);
//       lastDate.setHours(0, 0, 0, 0);
      
//       while(currentDate <= lastDate) {
//           const dayOfWeek = currentDate.getDay();
//           const isHoliday = holidays.some(h => {
//             const holidayDate = new Date(h);
//             holidayDate.setHours(0, 0, 0, 0);
//             return holidayDate.getTime() === currentDate.getTime();
//           });
          
//           // Don't exclude approved leave dates from calculation for display purposes
//           // We only exclude them during form submission validation
          
//           // Handle both boolean and number types for is_working_day
//           const workDayConfig = workWeek.find(d => 
//             ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
//             .indexOf(d.day_of_week) === dayOfWeek
//           );
//           const isWorkingDay = workDayConfig ? 
//             (typeof workDayConfig.is_working_day === 'boolean' ? workDayConfig.is_working_day : workDayConfig.is_working_day === 1) : 
//             false;
          
//           if(!isHoliday && isWorkingDay) {
//               count++;
//           }
//           currentDate.setDate(currentDate.getDate() + 1);
//       }
//       return count;
//     },[holidays,workWeek])

  

//   const getStatusFromRecord = (
//     leave: LeaveRecord
//   ): "approved" | "rejected" | "pending" => {
//     if (leave.rejection_reason != null) return "rejected";
//     if (leave.primary_status && leave.secondry_status)
//       return "approved";
//     return "pending";
//   };

//   const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
//     switch (status) {
//       case "approved":
//         return (
//           <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Approved
//           </Badge>
//         );
//       case "rejected":
//         return (
//           <Badge variant="destructive">
//             <XCircle className="h-3 w-3 mr-1" />
//             Rejected
//           </Badge>
//         );
//       case "pending":
//         return (
//           <Badge variant="secondary">
//             <Clock className="h-3 w-3 mr-1" />
//             Pending
//           </Badge>
//         );
//     }
//   };

//   const renderRequestsTable = (
//     requests: LeaveRecord[],
//     type: "primary" | "secondary"
//   ) => {
//     if (loading)
//       return <div className="text-center py-8">Loading requests...</div>;
//     if (requests.length === 0) {
//       return (
//         <div className="text-center py-12 text-muted-foreground">
//           <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500" />
//           <p className="font-semibold">All Caught Up!</p>
//           <p className="text-sm">
//             There are no pending {type} leave approvals.
//           </p>
//         </div>
//       );
//     }
//     return (
//       <TooltipProvider>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Id</TableHead>
//               <TableHead>Employee</TableHead>
//               <TableHead>Leave Type</TableHead>
//               <TableHead>Dates (DD-MM-YYYY)</TableHead>
//               <TableHead>Days</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {requests.map((leave) => (
//               <TableRow
//                 key={leave.id}
//                 onClick={() => router.push(`/management/leaves/${leave.id}`)}
//                 className="cursor-pointer hover:bg-muted/50 group relative"
//               >
//                 <TableCell>{leave.full_leave_id}</TableCell>
//                 <TableCell className="font-medium">
//                   <div className="flex items-center gap-2">
//                     {leave.employee_name}
//                     {leave.rejection_reason && (
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <div
//                             data-info-icon
//                             className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                           >
//                             <Info className="h-4 w-4 text-red-500 cursor-help" />
//                           </div>
//                         </TooltipTrigger>
//                         <TooltipContent side="top" className="max-w-xs">
//                           <div className="text-sm">
//                             <p className="font-semibold text-red-600 mb-1">
//                               Rejection Reason:
//                             </p>
//                             <p>{leave.rejection_reason}</p>
//                           </div>
//                         </TooltipContent>
//                       </Tooltip>
//                     )}
//                   </div>
//                 </TableCell>
//                 <TableCell>{leave.leave_type_name}</TableCell>
//                 <TableCell>
//                   {(() => {
//                     const from = new Date(leave.from_date);
//                     const to = new Date(leave.to_date);

//                     const format = (d: Date) =>
//                       `${String(d.getDate()).padStart(2, "0")}-${String(
//                         d.getMonth() + 1
//                       ).padStart(2, "0")}-${d.getFullYear()}`;

//                     return `${format(from)} - ${format(to)}`;
//                   })()}
//                 </TableCell>

//                 <TableCell>
//                   {calculateLeaveDays(leave.from_date, leave.to_date)}
//                 </TableCell>
//                 <TableCell className="text-right">
//                     <Button variant="ghost" size="icon" onClick={(e) => handleDownload(e, leave.id)}>
//                         <Download className="h-4 w-4" />
//                     </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TooltipProvider>
//     );
//   };

//   const renderHistoryTable = (requests: LeaveRecordHistory[]) => {
//     if (loading)
//       return <div className="text-center py-8">Loading history...</div>;
//     if (requests.length === 0) {
//       return (
//         <div className="text-center py-12 text-muted-foreground">
//           <History className="h-10 w-10 mx-auto mb-4" />
//           <p>You have not actioned any leave requests in this period.</p>
//         </div>
//       );
//     }
//     return (
//       <TooltipProvider>
//         <Table>
//           <TableHeader>
//             <TableRow>

//               <TableHead>Id</TableHead>
//               <TableHead>Employee</TableHead>
//               <TableHead>Leave Type</TableHead>
//               <TableHead>Dates (DD-MM-YYYY)</TableHead>
//               <TableHead>Your Action</TableHead>
//               <TableHead>Final Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {requests.map((leave) => (
//               <TableRow key={leave.id} className="group relative">
//                 <TableCell>{leave.full_leave_id}</TableCell>
//                 <TableCell className="font-medium">
//                   <div className="flex items-center gap-2">
//                     {leave.employee_name}
//                     {leave.rejection_reason && (
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <div
//                             data-info-icon
//                             className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                           >
//                             <Info className="h-4 w-4 text-red-500 cursor-help" />
//                           </div>
//                         </TooltipTrigger>
//                         <TooltipContent side="top" className="max-w-xs">
//                           <div className="text-sm">
//                             <p className="font-semibold text-red-600 mb-1">
//                               Rejection Reason:
//                             </p>
//                             <p>{leave.rejection_reason}</p>
//                           </div>
//                         </TooltipContent>
//                       </Tooltip>
//                     )}
//                   </div>
//                 </TableCell>
//                 <TableCell>{leave.leave_type_name}</TableCell>
//                 <TableCell>
//                   {new Date(leave.from_date)
//                     .toLocaleDateString("en-GB")
//                     .replace(/\//g, "-")}{" "}
//                   -{" "}
//                   {new Date(leave.to_date)
//                     .toLocaleDateString("en-GB")
//                     .replace(/\//g, "-")}
//                 </TableCell>

//                 <TableCell>
//                   <Badge variant="outline" className="capitalize">
//                     {leave.your_approval_level === "primary"
//                       ? leave.primary_status == true
//                         ? "Accepted"
//                         : "Rejected"
//                       : leave.secondry_status == true
//                       ? "Accepted"
//                       : "Rejected"}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   {getStatusBadge(
//                     getStatusFromRecord({
//                       id: leave.id,
//                       leave_type_name: leave.leave_type_name,
//                       leave_description: leave.leave_description,
//                       applied_date: new Date(leave.applied_date),
//                       from_date: new Date(leave.from_date),
//                       to_date: new Date(leave.to_date),
//                       rejection_reason: leave.rejection_reason,
//                       primary_status: leave.primary_status,
//                       secondry_status: leave.secondry_status,
//                       primary_approver_name: leave.primary_approver_name,
//                       secondary_approver_name: leave.secondary_approver_name,
//                       employee_id: leave.employee_id,
//                       employee_name: leave.employee_name,
//                       primary_user: 0,
//                       full_leave_id:leave.full_leave_id
//                     })
//                   )}
//                 </TableCell>
//                 <TableCell className="text-right">
//                     <Button variant="ghost" size="icon" onClick={(e) => handleDownload(e, leave.id)}>
//                         <Download className="h-4 w-4" />
//                     </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TooltipProvider>
//     );
//   };

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex items-center gap-4">
//           <UserPlus className="h-8 w-8" />
//           <h1 className="text-3xl font-bold">Leave Management</h1>
//         </div>

//         {!canManageLeaves ? (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Access Denied</AlertTitle>
//             <AlertDescription>
//               You don't have permission to manage leave requests.
//             </AlertDescription>
//           </Alert>
//         ) : (
//           <Tabs defaultValue="primary">
//             <TabsList className="grid w-full grid-cols-3">
//               <TabsTrigger value="primary">
//                 Primary Approvals{" "}
//                 <Badge className="ml-2">{primaryRequests.length}</Badge>
//               </TabsTrigger>
//               <TabsTrigger value="secondary">
//                 Secondary Approvals{" "}
//                 <Badge className="ml-2">{secondaryRequests.length}</Badge>
//               </TabsTrigger>
//               <TabsTrigger value="history">Approval History</TabsTrigger>
//             </TabsList>
//             <TabsContent value="primary">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Awaiting Your Approval</CardTitle>
//                   <CardDescription>
//                     These requests need your decision to proceed.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {renderRequestsTable(primaryRequests, "primary")}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             <TabsContent value="secondary">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Awaiting Final Approval</CardTitle>
//                   <CardDescription>
//                     These requests have been approved by the primary manager and
//                     require your final decision.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {renderRequestsTable(secondaryRequests, "secondary")}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             <TabsContent value="history">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Your Approval History</CardTitle>
//                   <CardDescription>
//                     A log of all leave requests you have previously actioned.
//                   </CardDescription>
//                   <div className="flex gap-4 pt-4">
//                     <div className="grid gap-2 w-full">
//                       <Label htmlFor="from-date">From Date</Label>
//                       <Input
//                         id="from-date"
//                         type="date"
//                         value={dateRange.from}
//                         onChange={(e) =>
//                           setDateRange((dr) => ({
//                             ...dr,
//                             from: e.target.value,
//                           }))
//                         }
//                       />
//                     </div>
//                     <div className="grid gap-2 w-full">
//                       <Label htmlFor="to-date">To Date</Label>
//                       <Input
//                         id="to-date"
//                         type="date"
//                         value={dateRange.to}
//                         onChange={(e) =>
//                           setDateRange((dr) => ({ ...dr, to: e.target.value }))
//                         }
//                       />
//                     </div>
//                     <div className="flex items-end">
//                       <Button onClick={fetchHistoryLeaves}>
//                         <Filter className="h-4 w-4 mr-2" />
//                         Filter
//                       </Button>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>{renderHistoryTable(historyRequests)}</CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         )}
//       </div>
//     </MainLayout>
//   );
// }

"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  UserPlus,
  AlertCircle,
  CheckCircle,
  History,
  Filter,
  Info,
  XCircle,
  Clock,
  Download,
  Loader2,
  Calendar,
  FileText
} from "lucide-react"
import {
  getPrimaryLeaveApprovals,
  getSecondaryLeaveApprovals,
  getApprovalHistory,
  downloadLeaveApplication,
  type LeaveRecord,
  LeaveRecordHistory,
  getHolidays,
  getWorkWeek,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import React from "react"

interface ApiWorkWeekDay {
  id?: number
  day_of_week: string
  is_working_day: number | boolean
  created_at?: string
  updated_at?: string
  updated_by?: string | null
}

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-9 w-64" />
    </div>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Leave Type</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Days</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function LeaveManagementPage() {
  const { hasPermission, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [primaryRequests, setPrimaryRequests] = useState<LeaveRecord[]>([])
  const [secondaryRequests, setSecondaryRequests] = useState<LeaveRecord[]>([])
  const [historyRequests, setHistoryRequests] = useState<LeaveRecordHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilteringHistory, setIsFilteringHistory] = useState(false)
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set())
  const [holidays, setHolidays] = React.useState<Date[]>([])
  const [workWeek, setWorkWeek] = React.useState<ApiWorkWeekDay[]>([])

  const [dateRange, setDateRange] = useState(() => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return {
      from: firstDayOfMonth.toISOString().split("T")[0],
      to: lastDayOfMonth.toISOString().split("T")[0],
    }
  })

  const canManageLeaves = hasPermission("leaves.manage")

  const fetchPendingLeaves = useCallback(async () => {
    if (!canManageLeaves) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [primaryData, secondaryData, holidaysData, workWeekData] = await Promise.all([
        getPrimaryLeaveApprovals(),
        getSecondaryLeaveApprovals(),
        getHolidays(new Date().getFullYear()),
        getWorkWeek()
      ])

      setHolidays(holidaysData.map(h => new Date(h.holiday_date)))
      const normalizedWorkWeek = workWeekData.map(day => ({
        ...day,
        is_working_day: typeof day.is_working_day === 'boolean' ? (day.is_working_day ? 1 : 0) : day.is_working_day
      }))
      setWorkWeek(normalizedWorkWeek)
      setPrimaryRequests(
        primaryData.filter(
          (r) => !r.primary_status && r.primary_user === user?.id
        )
      )
      setSecondaryRequests(
        secondaryData.filter(
          (r) => r.primary_status && !r.secondry_status
        )
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch pending leave requests.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [canManageLeaves, user, toast])

  const fetchHistoryLeaves = useCallback(async () => {
    if (!canManageLeaves) return
    setIsFilteringHistory(true)
    try {
      const historyData = await getApprovalHistory(
        dateRange.from,
        dateRange.to
      )
      setHistoryRequests(historyData as LeaveRecordHistory[] | [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch approval history.",
        variant: "destructive",
      })
    } finally {
      setIsFilteringHistory(false)
    }
  }, [canManageLeaves, dateRange, toast])

  useEffect(() => {
    fetchPendingLeaves()
    fetchHistoryLeaves()
  }, [fetchPendingLeaves, fetchHistoryLeaves])

  const handleDownload = async (e: React.MouseEvent, leaveId: number) => {
    e.stopPropagation()
    setDownloadingIds(prev => new Set(prev).add(leaveId))
    try {
      await downloadLeaveApplication(leaveId)
      toast({ 
        title: "Success", 
        description: "Leave application downloaded successfully." 
      })
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Failed to download PDF: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(leaveId)
        return newSet
      })
    }
  }

  const calculateLeaveDays = React.useCallback((startDate: Date | string, endDate: Date | string) => {
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
        false
      
      if(!isHoliday && isWorkingDay) {
        count++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return count
  },[holidays,workWeek])

  const getStatusFromRecord = (
    leave: LeaveRecord
  ): "approved" | "rejected" | "pending" => {
    if (leave.rejection_reason != null) return "rejected"
    if (leave.primary_status && leave.secondry_status) return "approved"
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
    }
  }

  const renderRequestsTable = (
    requests: LeaveRecord[],
    type: "primary" | "secondary"
  ) => {
    if (loading) return <TableSkeleton />
    
    if (requests.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 dark:bg-green-950 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground">
            There are no pending {type} leave approvals.
          </p>
        </div>
      )
    }

    return (
      <TooltipProvider>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Dates (DD-MM-YYYY)</TableHead>
                <TableHead>Days</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((leave) => (
                <TableRow
                  key={leave.id}
                  onClick={() => router.push(`/management/leaves/${leave.id}`)}
                  className="cursor-pointer hover:bg-muted/50 group relative"
                >
                  <TableCell className="font-mono font-medium">{leave.full_leave_id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {leave.employee_name}
                      {leave.rejection_reason && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              data-info-icon
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Info className="h-4 w-4 text-red-500 cursor-help" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="text-sm">
                              <p className="font-semibold text-red-600 mb-1">
                                Rejection Reason:
                              </p>
                              <p>{leave.rejection_reason}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{leave.leave_type_name}</Badge>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const from = new Date(leave.from_date)
                      const to = new Date(leave.to_date)
                      const format = (d: Date) =>
                        `${String(d.getDate()).padStart(2, "0")}-${String(
                          d.getMonth() + 1
                        ).padStart(2, "0")}-${d.getFullYear()}`
                      return `${format(from)} - ${format(to)}`
                    })()}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">
                      {calculateLeaveDays(leave.from_date, leave.to_date)} days
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => handleDownload(e, leave.id)}
                      disabled={downloadingIds.has(leave.id)}
                    >
                      {downloadingIds.has(leave.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>
    )
  }

  const renderHistoryTable = (requests: LeaveRecordHistory[]) => {
    if (isFilteringHistory) return <TableSkeleton />
    
    if (requests.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-muted rounded-full">
              <History className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No History Found</h3>
          <p className="text-muted-foreground">
            You have not actioned any leave requests in this period.
          </p>
        </div>
      )
    }

    return (
      <TooltipProvider>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Dates (DD-MM-YYYY)</TableHead>
                <TableHead>Your Action</TableHead>
                <TableHead>Final Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((leave) => (
                <TableRow key={leave.id} className="group relative hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">{leave.full_leave_id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {leave.employee_name}
                      {leave.rejection_reason && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              data-info-icon
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Info className="h-4 w-4 text-red-500 cursor-help" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="text-sm">
                              <p className="font-semibold text-red-600 mb-1">
                                Rejection Reason:
                              </p>
                              <p>{leave.rejection_reason}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{leave.leave_type_name}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(leave.from_date)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}{" "}
                    -{" "}
                    {new Date(leave.to_date)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {leave.your_approval_level === "primary"
                        ? leave.primary_status == true
                          ? "Accepted"
                          : "Rejected"
                        : leave.secondry_status == true
                        ? "Accepted"
                        : "Rejected"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      getStatusFromRecord({
                        id: leave.id,
                        leave_type_name: leave.leave_type_name,
                        leave_description: leave.leave_description,
                        applied_date: new Date(leave.applied_date),
                        from_date: new Date(leave.from_date),
                        to_date: new Date(leave.to_date),
                        rejection_reason: leave.rejection_reason,
                        primary_status: leave.primary_status,
                        secondry_status: leave.secondry_status,
                        primary_approver_name: leave.primary_approver_name,
                        secondary_approver_name: leave.secondary_approver_name,
                        employee_id: leave.employee_id,
                        employee_name: leave.employee_name,
                        primary_user: 0,
                        full_leave_id: leave.full_leave_id
                      })
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => handleDownload(e, leave.id)}
                      disabled={downloadingIds.has(leave.id)}
                    >
                      {downloadingIds.has(leave.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>
    )
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <TableSkeleton />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">
              Review and manage employee leave requests
            </p>
          </div>
        </div>

        {!canManageLeaves ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to manage leave requests.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="primary">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="primary" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Primary Approvals
                {primaryRequests.length > 0 && (
                  <Badge className="ml-2 bg-yellow-500">{primaryRequests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="secondary" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Secondary Approvals
                {secondaryRequests.length > 0 && (
                  <Badge className="ml-2 bg-blue-500">{secondaryRequests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="primary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Awaiting Your Approval</CardTitle>
                  <CardDescription>
                    These requests need your decision to proceed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderRequestsTable(primaryRequests, "primary")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="secondary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Awaiting Final Approval</CardTitle>
                  <CardDescription>
                    These requests have been approved by the primary manager and require your final decision
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderRequestsTable(secondaryRequests, "secondary")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Approval History</CardTitle>
                  <CardDescription>
                    A log of all leave requests you have previously actioned
                  </CardDescription>
                  <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <div className="grid gap-2 flex-1">
                      <Label htmlFor="from-date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        From Date
                      </Label>
                      <Input
                        id="from-date"
                        type="date"
                        value={dateRange.from}
                        onChange={(e) =>
                          setDateRange((dr) => ({
                            ...dr,
                            from: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="grid gap-2 flex-1">
                      <Label htmlFor="to-date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        To Date
                      </Label>
                      <Input
                        id="to-date"
                        type="date"
                        value={dateRange.to}
                        onChange={(e) =>
                          setDateRange((dr) => ({ ...dr, to: e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={fetchHistoryLeaves}
                        disabled={isFilteringHistory}
                        className="w-full md:w-auto"
                      >
                        {isFilteringHistory ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Filtering...
                          </>
                        ) : (
                          <>
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>{renderHistoryTable(historyRequests)}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  )
}
