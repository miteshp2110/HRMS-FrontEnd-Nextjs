// "use client"

// import { useState, useEffect } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { MainLayout } from "@/components/main-layout"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
// import { UserPlus, Search, Filter, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
// import Link from "next/link"
// import { getLeaveRequests, approvePrimaryLeave, type LeaveRecord } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// export default function LeaveManagementPage() {
//   const { hasPermission } = useAuth()
//   const { toast } = useToast()
//   const [leaves, setLeaves] = useState<LeaveRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("pending")

//   const canManageLeaves = hasPermission("leaves.manage")

//   const fetchLeaves = async () => {
//     if (!canManageLeaves) {
//         setLoading(false);
//         return;
//     }
//     try {
//       setLoading(true);
//       const data = await getLeaveRequests()
//       setLeaves(data as LeaveRecord[] | [])
//     } catch (error) {
//       toast({ title: "Error", description: "Could not fetch leave requests.", variant: "destructive" });
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchLeaves()
//   }, [canManageLeaves])

//   const handleStatusUpdate = async (leaveId: number, status: boolean) => {
//     try {
//       await approvePrimaryLeave(leaveId, status)
//       toast({ title: "Success", description: `Leave request has been ${status ? 'approved' : 'rejected'}.` });
//       fetchLeaves() // Refresh the list
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to update leave status.", variant: "destructive" });
//     }
//   }

//   const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
//     if (record.primary_status === false || record.secondry_status === false) return "rejected";
//     if (record.primary_status === true && record.secondry_status === true) return "approved";
//     return "pending";
//   }

//   const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
//     switch (status) {
//       case "approved":
//         return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
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

//   const filteredLeaves = leaves.filter((leave) => {
//     const employeeName = leave.primary_approver_name || ''; // Use a fallback
//     const matchesSearch =
//       employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       leave.leave_type_name.toLowerCase().includes(searchTerm.toLowerCase())
    
//     const status = getStatusFromRecord(leave);
//     const matchesStatus = statusFilter === "all" || status === statusFilter
    
//     return matchesSearch && matchesStatus
//   })

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
//                 <AlertDescription>
//                 You don't have permission to manage leave requests.
//                 </AlertDescription>
//             </Alert>
//         ) : (
//           <Card>
//             <CardHeader>
//               <CardTitle>Leave Requests</CardTitle>
//               <CardDescription>Review and approve or reject employee leave requests.</CardDescription>
//               <div className="flex gap-4 pt-4">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search by employee name or leave type..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-48">
//                     <Filter className="h-4 w-4 mr-2" />
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="rejected">Rejected</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {loading ? (
//                 <div className="text-center py-8">Loading leave requests...</div>
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Employee</TableHead>
//                       <TableHead>Leave Type</TableHead>
//                       <TableHead>Dates</TableHead>
//                       <TableHead>Days</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredLeaves.map((leave) => (
//                       <TableRow key={leave.id}>
//                         <TableCell>
//                           <Link href={`/directory/${leave.id}`} className="font-medium text-primary hover:underline">
//                             {leave.primary_approver_name || `Employee ID: ${leave.id}`}
//                           </Link>
//                         </TableCell>
//                         <TableCell>{leave.leave_type_name}</TableCell>
//                         <TableCell>{new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}</TableCell>
//                         <TableCell>{calculateLeaveDays(leave.from_date, leave.to_date)}</TableCell>
//                         <TableCell>{getStatusBadge(getStatusFromRecord(leave))}</TableCell>
//                         <TableCell className="text-right">
//                           {getStatusFromRecord(leave) === "pending" && (
//                             <div className="flex gap-2 justify-end">
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
//                                 onClick={() => handleStatusUpdate(leave.id, true)}
//                               >
//                                 <CheckCircle className="h-4 w-4 mr-2" /> Approve
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
//                                 onClick={() => handleStatusUpdate(leave.id, false)}
//                               >
//                                 <XCircle className="h-4 w-4 mr-2" /> Reject
//                               </Button>
//                             </div>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </MainLayout>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { UserPlus, AlertCircle, CheckCircle, Clock, Badge } from "lucide-react"
import { getPrimaryLeaveApprovals, getSecondaryLeaveApprovals, approvePrimaryLeave, approveSecondaryLeave, type LeaveRecord } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { LeaveApprovalDialog } from "@/components/management/leave-approval-dialog"

export default function LeaveManagementPage() {
  const { hasPermission, user } = useAuth()
  const { toast } = useToast()
  
  const [primaryRequests, setPrimaryRequests] = useState<LeaveRecord[]>([])
  const [secondaryRequests, setSecondaryRequests] = useState<LeaveRecord[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const canManageLeaves = hasPermission("leaves.manage")

  const fetchLeaves = async () => {
    if (!canManageLeaves) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [primaryData, secondaryData] = await Promise.all([
        getPrimaryLeaveApprovals(),
        getSecondaryLeaveApprovals()
      ]);
      // Filter for only pending requests at each level
      setPrimaryRequests(primaryData.filter(r => r.primary_status == false && r.primary_user == user?.id));
      setSecondaryRequests(secondaryData.filter(r => r.primary_status == true && r.secondry_status == false));
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch leave requests.", variant: "destructive" });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaves()
  }, [canManageLeaves, user])

  const handleStatusUpdate = async (leaveId: number, status: boolean) => {
      const isSecondary = secondaryRequests.some(r => r.id === leaveId);
      const apiCall = isSecondary ? approveSecondaryLeave : approvePrimaryLeave;
    try {
      await apiCall(leaveId, status)
      toast({ title: "Success", description: `Leave request has been updated.` });
      setIsDialogOpen(false);
      setSelectedLeave(null);
      fetchLeaves(); // Refresh the list
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update leave status.", variant: "destructive" });
    }
  }

  const handleRowClick = (leave: LeaveRecord) => {
    setSelectedLeave(leave);
    setIsDialogOpen(true);
  }
  
  const calculateLeaveDays = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  const renderRequestsTable = (requests: LeaveRecord[]) => {
      if (loading) return <div className="text-center py-8">Loading requests...</div>;
      if (requests.length === 0) {
          return (
              <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500"/>
                  <p>No pending leave requests here. All caught up!</p>
              </div>
          );
      }
      return (
        <Table>
          <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Leave Type</TableHead><TableHead>Dates</TableHead><TableHead>Days</TableHead></TableRow></TableHeader>
          <TableBody>
            {requests.map((leave) => (
              <TableRow key={leave.id} onClick={() => handleRowClick(leave)} className="cursor-pointer">
                <TableCell className="font-medium">{leave.employee_name}</TableCell>
                <TableCell>{leave.leave_type_name}</TableCell>
                <TableCell>{new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}</TableCell>
                <TableCell>{calculateLeaveDays(leave.from_date, leave.to_date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
                <TabsList>
                    <TabsTrigger value="primary">Primary Approvals <Badge className="ml-2">{primaryRequests.length}</Badge></TabsTrigger>
                    <TabsTrigger value="secondary">Secondary Approvals <Badge className="ml-2">{secondaryRequests.length}</Badge></TabsTrigger>
                </TabsList>
                <TabsContent value="primary">
                    <Card>
                        <CardHeader><CardTitle>Awaiting Your Approval</CardTitle><CardDescription>These requests need your decision to proceed.</CardDescription></CardHeader>
                        <CardContent>{renderRequestsTable(primaryRequests)}</CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="secondary">
                     <Card>
                        <CardHeader><CardTitle>Awaiting Final Approval</CardTitle><CardDescription>These requests have been approved by the primary manager and require your final decision.</CardDescription></CardHeader>
                        <CardContent>{renderRequestsTable(secondaryRequests)}</CardContent>
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