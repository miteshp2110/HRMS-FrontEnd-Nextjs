
// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { MainLayout } from "@/components/main-layout"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { UserPlus, AlertCircle, CheckCircle, History, Filter } from "lucide-react"
// import { getPrimaryLeaveApprovals, getSecondaryLeaveApprovals, getApprovalHistory, approvePrimaryLeave, approveSecondaryLeave, type LeaveRecord, LeaveRecordHistory } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { LeaveApprovalDialog } from "@/components/management/leave-approval-dialog"


// export default function LeaveManagementPage() {
//   const { hasPermission, user } = useAuth()
//   const { toast } = useToast()
  
//   const [primaryRequests, setPrimaryRequests] = useState<LeaveRecord[]>([])
//   const [secondaryRequests, setSecondaryRequests] = useState<LeaveRecord[]>([])
//   const [historyRequests, setHistoryRequests] = useState<LeaveRecordHistory[]>([])
//   const [loading, setLoading] = useState(true)
  
//   const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)

//   const [dateRange, setDateRange] = useState({
//     from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
//     to: new Date().toISOString().split('T')[0]
//   });

//   const canManageLeaves = hasPermission("leaves.manage")

//   const fetchPendingLeaves = useCallback(async () => {
//     if (!canManageLeaves) { setLoading(false); return; }
//     setLoading(true);
//     try {
//       const [primaryData, secondaryData] = await Promise.all([
//         getPrimaryLeaveApprovals(),
//         getSecondaryLeaveApprovals()
//       ]);
//       setPrimaryRequests(primaryData.filter(r => r.primary_status == false && r.primary_user === user?.id));
//       setSecondaryRequests(secondaryData.filter(r => r.primary_status == true && r.secondry_status == false));
//     } catch (error) {
//       toast({ title: "Error", description: "Could not fetch pending leave requests.", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   }, [canManageLeaves, user, toast]);

//   const fetchHistoryLeaves = useCallback(async () => {
//     if (!canManageLeaves) return;
//     setLoading(true);
//     try {
//         const historyData = await getApprovalHistory(dateRange.from, dateRange.to);
//         setHistoryRequests(historyData as LeaveRecordHistory[]|[]);
//     } catch(error) {
//         toast({ title: "Error", description: "Could not fetch approval history.", variant: "destructive" });
//     } finally {
//         setLoading(false);
//     }
//   }, [canManageLeaves, dateRange, toast]);

//   useEffect(() => {
//     fetchPendingLeaves();
//     fetchHistoryLeaves();
//   }, [fetchPendingLeaves, fetchHistoryLeaves]);

//   const handleStatusUpdate = async (leaveId: number, status: boolean, reason?: string) => {
//       const isSecondary = secondaryRequests.some(r => r.id === leaveId);
//       const apiCall = isSecondary ? approveSecondaryLeave : approvePrimaryLeave;
//     try {
//       await apiCall(leaveId, status, reason)
//       toast({ title: "Success", description: `Leave request has been updated.` });
//       setIsDialogOpen(false);
//       setSelectedLeave(null);
//       fetchPendingLeaves(); // Refresh pending lists
//       fetchHistoryLeaves(); // Also refresh history
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to update leave status.", variant: "destructive" });
//     }
//   }

//   const handleRowClick = (leave: LeaveRecord) => {
//     if(getStatusFromRecord(leave) === 'pending') {
//         setSelectedLeave(leave);
//         setIsDialogOpen(true);
//     }
//   }
  
//   const calculateLeaveDays = (startDate: Date, endDate: Date) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//   }
  
//   const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
//     if (record.rejection_reason !== null || record.primary_status === false || record.secondry_status === false) return "rejected";
//     if (record.primary_status === true && record.secondry_status === true) return "approved";
//     return "pending";
//   }

//   const getStatusBadge = (status: "approved" | "rejected" | "pending") => { /* ... same as before ... */ }

//   const renderRequestsTable = (requests: LeaveRecord[], type: 'primary' | 'secondary') => {
//       if (loading) return <div className="text-center py-8">Loading requests...</div>;
//       if (requests.length === 0) {
//           return (
//               <div className="text-center py-12 text-muted-foreground">
//                   <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500"/>
//                   <p className="font-semibold">All Caught Up!</p>
//                   <p className="text-sm">There are no pending {type} leave approvals.</p>
//               </div>
//           );
//       }
//       return (
//         <Table>
//           <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Leave Type</TableHead><TableHead>Dates</TableHead><TableHead>Days</TableHead></TableRow></TableHeader>
//           <TableBody>
//             {requests.map((leave) => (
//               <TableRow key={leave.id} onClick={() => handleRowClick(leave)} className="cursor-pointer hover:bg-muted/50">
//                 <TableCell className="font-medium">{leave.employee_name}</TableCell>
//                 <TableCell>{leave.leave_type_name}</TableCell>
//                 <TableCell>{new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}</TableCell>
//                 <TableCell>{calculateLeaveDays(leave.from_date, leave.to_date)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )
//   }
  
//   const renderHistoryTable = (requests: LeaveRecordHistory[]) => {
//       if (loading) return <div className="text-center py-8">Loading history...</div>;
//       if (requests.length === 0) {
//           return (
//               <div className="text-center py-12 text-muted-foreground">
//                   <History className="h-10 w-10 mx-auto mb-4"/>
//                   <p>You have not actioned any leave requests in this period.</p>
//               </div>
//           );
//       }
//       return (
//         <>
//         <Table>
//           <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Leave Type</TableHead><TableHead>Dates</TableHead><TableHead>Your Action</TableHead><TableHead>Final Status</TableHead></TableRow></TableHeader>
//           <TableBody>
//             {requests.map((leave) => (
//               <TableRow key={leave.id}>
//                 <TableCell className="font-medium">{leave.employee_name}</TableCell>
//                 <TableCell>{leave.leave_type_name}</TableCell>
//                 <TableCell>{new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}</TableCell>
//                 <TableCell><Badge variant="outline" className="capitalize">My Action</Badge></TableCell>
//                 <TableCell>Hi</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         </>
//       )
//   }

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex items-center gap-4">
//           <UserPlus className="h-8 w-8" />
//           <h1 className="text-3xl font-bold">Leave Management</h1>
//         </div>

//         {!canManageLeaves ? (
//             <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>Access Denied</AlertTitle>
//                 <AlertDescription>You don't have permission to manage leave requests.</AlertDescription>
//             </Alert>
//         ) : (
//             <Tabs defaultValue="primary">
//                 <TabsList className="grid w-full grid-cols-3">
//                     <TabsTrigger value="primary">Primary Approvals <Badge className="ml-2">{primaryRequests.length}</Badge></TabsTrigger>
//                     <TabsTrigger value="secondary">Secondary Approvals <Badge className="ml-2">{secondaryRequests.length}</Badge></TabsTrigger>
//                     <TabsTrigger value="history">Approval History</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="primary">
//                     <Card><CardHeader><CardTitle>Awaiting Your Approval</CardTitle><CardDescription>These requests need your decision to proceed.</CardDescription></CardHeader><CardContent>{renderRequestsTable(primaryRequests, 'primary')}</CardContent></Card>
//                 </TabsContent>
//                 <TabsContent value="secondary">
//                      <Card><CardHeader><CardTitle>Awaiting Final Approval</CardTitle><CardDescription>These requests have been approved by the primary manager and require your final decision.</CardDescription></CardHeader><CardContent>{renderRequestsTable(secondaryRequests, 'secondary')}</CardContent></Card>
//                 </TabsContent>
//                  <TabsContent value="history">
//                      <Card>
//                         <CardHeader>
//                             <CardTitle>Your Approval History</CardTitle>
//                             <CardDescription>A log of all leave requests you have previously actioned.</CardDescription>
//                             <div className="flex gap-4 pt-4">
//                                 <div className="grid gap-2 w-full"><Label htmlFor="from-date">From Date</Label><Input id="from-date" type="date" value={dateRange.from} onChange={(e) => setDateRange(dr => ({...dr, from: e.target.value}))}/></div>
//                                 <div className="grid gap-2 w-full"><Label htmlFor="to-date">To Date</Label><Input id="to-date" type="date" value={dateRange.to} onChange={(e) => setDateRange(dr => ({...dr, to: e.target.value}))}/></div>
//                                 <div className="flex items-end"><Button onClick={fetchHistoryLeaves}><Filter className="h-4 w-4 mr-2" />Filter</Button></div>
//                             </div>
//                         </CardHeader>
//                         <CardContent>{renderHistoryTable(historyRequests)}</CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         )}
//       </div>
      
//       <LeaveApprovalDialog 
//         leaveRecord={selectedLeave}
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         onStatusUpdate={handleStatusUpdate}
//       />
//     </MainLayout>
//   )
// }



"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserPlus, AlertCircle, CheckCircle, History, Filter, Info, XCircle, Clock } from "lucide-react"
import { getPrimaryLeaveApprovals, getSecondaryLeaveApprovals, getApprovalHistory, approvePrimaryLeave, approveSecondaryLeave, type LeaveRecord, LeaveRecordHistory } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { LeaveApprovalDialog } from "@/components/management/leave-approval-dialog"


export default function LeaveManagementPage() {
  const { hasPermission, user } = useAuth()
  const { toast } = useToast()
  
  const [primaryRequests, setPrimaryRequests] = useState<LeaveRecord[]>([])
  const [secondaryRequests, setSecondaryRequests] = useState<LeaveRecord[]>([])
  const [historyRequests, setHistoryRequests] = useState<LeaveRecordHistory[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const canManageLeaves = hasPermission("leaves.manage")

  const fetchPendingLeaves = useCallback(async () => {
    if (!canManageLeaves) { setLoading(false); return; }
    setLoading(true);
    try {
      const [primaryData, secondaryData] = await Promise.all([
        getPrimaryLeaveApprovals(),
        getSecondaryLeaveApprovals()
      ]);
      setPrimaryRequests(primaryData.filter(r => r.primary_status == false && r.primary_user === user?.id));
      setSecondaryRequests(secondaryData.filter(r => r.primary_status == true && r.secondry_status == false));
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch pending leave requests.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [canManageLeaves, user, toast]);

  const fetchHistoryLeaves = useCallback(async () => {
    if (!canManageLeaves) return;
    setLoading(true);
    try {
        const historyData = await getApprovalHistory(dateRange.from, dateRange.to);
        setHistoryRequests(historyData as LeaveRecordHistory[]|[]);
    } catch(error) {
        toast({ title: "Error", description: "Could not fetch approval history.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  }, [canManageLeaves, dateRange, toast]);

  useEffect(() => {
    fetchPendingLeaves();
    fetchHistoryLeaves();
  }, [fetchPendingLeaves, fetchHistoryLeaves]);

  const handleStatusUpdate = async (leaveId: number, status: boolean, reason?: string) => {
      const isSecondary = secondaryRequests.some(r => r.id === leaveId);
      const apiCall = isSecondary ? approveSecondaryLeave : approvePrimaryLeave;
    try {
      await apiCall(leaveId, status, reason)
      toast({ title: "Success", description: `Leave request has been updated.` });
      setIsDialogOpen(false);
      setSelectedLeave(null);
      fetchPendingLeaves(); // Refresh pending lists
      fetchHistoryLeaves(); // Also refresh history
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update leave status.", variant: "destructive" });
    }
  }

  const handleRowClick = (leave: LeaveRecord, e: React.MouseEvent) => {
    // Don't trigger row click if clicking on the info icon
    if ((e.target as HTMLElement).closest('[data-info-icon]')) {
      return;
    }
    
    if(getStatusFromRecord(leave) === 'pending') {
        setSelectedLeave(leave);
        setIsDialogOpen(true);
    }
  }
  
  const calculateLeaveDays = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  
  const getStatusFromRecord = (leave:LeaveRecord): "approved" | "rejected" | "pending" => {
    if (leave.rejection_reason != null ) return "rejected";
    if (leave.primary_status == true && leave.secondry_status == true) return "approved";
    return "pending";
  }

    const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }
  }

  const renderRequestsTable = (requests: LeaveRecord[], type: 'primary' | 'secondary') => {
      if (loading) return <div className="text-center py-8">Loading requests...</div>;
      if (requests.length === 0) {
          return (
              <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500"/>
                  <p className="font-semibold">All Caught Up!</p>
                  <p className="text-sm">There are no pending {type} leave approvals.</p>
              </div>
          );
      }
      return (
        <TooltipProvider>
          <Table>
            <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Leave Type</TableHead><TableHead>Dates</TableHead><TableHead>Days</TableHead></TableRow></TableHeader>
            <TableBody>
              {requests.map((leave) => (
                <TableRow 
                  key={leave.id} 
                  onClick={(e) => handleRowClick(leave, e)} 
                  className="cursor-pointer hover:bg-muted/50 group relative"
                >
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
                              <p className="font-semibold text-red-600 mb-1">Rejection Reason:</p>
                              <p>{leave.rejection_reason}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{leave.leave_type_name}</TableCell>
                  <TableCell>{new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}</TableCell>
                  <TableCell>{calculateLeaveDays(leave.from_date, leave.to_date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      )
  }
  
  const renderHistoryTable = (requests: LeaveRecordHistory[]) => {
      if (loading) return <div className="text-center py-8">Loading history...</div>;
      if (requests.length === 0) {
          return (
              <div className="text-center py-12 text-muted-foreground">
                  <History className="h-10 w-10 mx-auto mb-4"/>
                  <p>You have not actioned any leave requests in this period.</p>
              </div>
          );
      }
      return (
        <TooltipProvider>
          <Table>
            <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Leave Type</TableHead><TableHead>Dates</TableHead><TableHead>Your Action</TableHead><TableHead>Final Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {requests.map((leave) => (
                <TableRow key={leave.id} className="group relative">
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
                              <p className="font-semibold text-red-600 mb-1">Rejection Reason:</p>
                              <p>{leave.rejection_reason}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{leave.leave_type_name}</TableCell>
                  <TableCell>{new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{(leave.your_approval_level==="primary"?(leave.primary_status==true?"Accepted":"Rejected"):(leave.secondry_status==true?"Accepted":"Rejected"))}</Badge></TableCell>
                  <TableCell>{getStatusBadge(getStatusFromRecord({id:leave.id,
                      leave_type_name:leave.leave_type_name,      
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
                      employee_name:leave.employee_name,
                      primary_user : 0
  
                  }))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <UserPlus className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Leave Management</h1>
        </div>

        {!canManageLeaves ? (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You don't have permission to manage leave requests.</AlertDescription>
            </Alert>
        ) : (
            <Tabs defaultValue="primary">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="primary">Primary Approvals <Badge className="ml-2">{primaryRequests.length}</Badge></TabsTrigger>
                    <TabsTrigger value="secondary">Secondary Approvals <Badge className="ml-2">{secondaryRequests.length}</Badge></TabsTrigger>
                    <TabsTrigger value="history">Approval History</TabsTrigger>
                </TabsList>
                <TabsContent value="primary">
                    <Card><CardHeader><CardTitle>Awaiting Your Approval</CardTitle><CardDescription>These requests need your decision to proceed.</CardDescription></CardHeader><CardContent>{renderRequestsTable(primaryRequests, 'primary')}</CardContent></Card>
                </TabsContent>
                <TabsContent value="secondary">
                     <Card><CardHeader><CardTitle>Awaiting Final Approval</CardTitle><CardDescription>These requests have been approved by the primary manager and require your final decision.</CardDescription></CardHeader><CardContent>{renderRequestsTable(secondaryRequests, 'secondary')}</CardContent></Card>
                </TabsContent>
                 <TabsContent value="history">
                     <Card>
                        <CardHeader>
                            <CardTitle>Your Approval History</CardTitle>
                            <CardDescription>A log of all leave requests you have previously actioned.</CardDescription>
                            <div className="flex gap-4 pt-4">
                                <div className="grid gap-2 w-full"><Label htmlFor="from-date">From Date</Label><Input id="from-date" type="date" value={dateRange.from} onChange={(e) => setDateRange(dr => ({...dr, from: e.target.value}))}/></div>
                                <div className="grid gap-2 w-full"><Label htmlFor="to-date">To Date</Label><Input id="to-date" type="date" value={dateRange.to} onChange={(e) => setDateRange(dr => ({...dr, to: e.target.value}))}/></div>
                                <div className="flex items-end"><Button onClick={fetchHistoryLeaves}><Filter className="h-4 w-4 mr-2" />Filter</Button></div>
                            </div>
                        </CardHeader>
                        <CardContent>{renderHistoryTable(historyRequests)}</CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        )}
      </div>
      
      <LeaveApprovalDialog 
        leaveRecord={selectedLeave}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onStatusUpdate={handleStatusUpdate}
      />
    </MainLayout>
  )
}