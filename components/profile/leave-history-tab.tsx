// import * as React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Calendar, CheckCircle, XCircle, Clock, UserPlus, Filter, AlertCircle, User } from "lucide-react"
// import type { LeaveBalance, LeaveRecord } from "@/lib/api"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
// import { Separator } from "@radix-ui/react-select"
// import { DialogHeader, DialogFooter } from "../ui/dialog"
// import { useState } from "react"

// interface LeaveHistoryTabProps {
//   leaveBalances: LeaveBalance[]
//   leaveRecords: LeaveRecord[]
//   isLoading: boolean
//   onDateChange: (startDate: string, endDate: string) => void
// }

// export function LeaveHistoryTab({ leaveBalances, leaveRecords, isLoading, onDateChange }: LeaveHistoryTabProps) {
//   console.log(leaveBalances)
//   const [startDate, setStartDate] = React.useState('');
//   const [endDate, setEndDate] = React.useState('');
//    const [detailDialogOpen, setDetailDialogOpen] = React.useState(false)
//    const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null)

//   React.useEffect(() => {
//     const today = new Date();
//     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const formattedFirstDay = firstDayOfMonth.toISOString().split('T')[0];
//     const formattedToday = today.toISOString().split('T')[0];
//     setStartDate(formattedFirstDay);
//     setEndDate(formattedToday);
//   }, []);

//   const handleFilter = () => {
//     onDateChange(startDate, endDate);
//   }

  

//   const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
//     // A rejection from either approver means rejected
//     if (record.primary_status == false || record.secondry_status == false) {
//       return "rejected";
//     }
//     // Both must approve for it to be approved
//     if (record.primary_status == true && record.secondry_status == true) {
//       return "approved";
//     }
//     // Otherwise, it's still pending
//     return "pending";
//   }

//   const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
//     switch (status) {
//       case "approved":
//         return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
//       case "rejected":
//         return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
//       case "pending":
//         return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
//       default:
//         return <Badge variant="secondary">{status}</Badge>
//     }
//   }
//   const getApprovalStatus = (leave: LeaveRecord) => {
//       const status = getStatusFromRecord(leave)
      
//       if (status === "rejected") {
//         return {
//           primaryStatus: "Rejected",
//           secondaryStatus: "N/A",
//           primaryClass: "text-red-600",
//           secondaryClass: "text-gray-500"
//         }
//       }

//   const calculateLeaveDays = (startDate: Date, endDate: Date) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including the start day
//     return diffDays;
//   }
  

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Leave Balances</CardTitle>
//           <CardDescription>Current available leave balances by type.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (<div className="text-center py-4">Loading balances...</div>) :
//            leaveBalances.length === 0 ? (
//              <p className="text-muted-foreground text-center py-4">No leave balances found.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {leaveBalances.map((balance) => (
                  
//                 <Card key={balance.id}>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">{balance.leave_type_name}</CardTitle>
//                     <Calendar className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                     <div className="text-2xl font-bold">{balance.balance}</div>
//                     <p className="text-xs text-muted-foreground">days available</p>
//                     </CardContent>
//                 </Card>
//                 ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Leave Application History</CardTitle>
//           <CardDescription>View and filter leave requests submitted by this employee.</CardDescription>
//             <div className="flex flex-col md:flex-row gap-4 pt-4">
//                 <div className="grid gap-2 w-full">
//                     <Label htmlFor="start-date">Start Date</Label>
//                     <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//                 </div>
//                 <div className="grid gap-2 w-full">
//                     <Label htmlFor="end-date">End Date</Label>
//                     <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//                 </div>
//                 <div className="flex items-end">
//                     <Button onClick={handleFilter} className="w-full md:w-auto">
//                         <Filter className="h-4 w-4 mr-2" />
//                         Filter
//                     </Button>
//                 </div>
//             </div>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (<div className="text-center py-12">Loading records...</div>) :
//            leaveRecords.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 text-center">
//                 <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">No Leave Records Found</h3>
//                 <p className="text-muted-foreground">No leave requests found for the selected date range.</p>
//           </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Leave Type</TableHead>
//                   <TableHead>Dates</TableHead>
//                   <TableHead>Days</TableHead>
//                   <TableHead>Final Status</TableHead>
//                   <TableHead>Applied On</TableHead>
//                   <TableHead>Primary Approver</TableHead>
//                   <TableHead>Secondary Approver</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {leaveRecords.map((record) => (
//                   <TableRow key={record.id}>
//                     <TableCell className="font-medium">{record.leave_type_name}</TableCell>
//                     <TableCell>{new Date(record.from_date).toLocaleDateString()} - {new Date(record.to_date).toLocaleDateString()}</TableCell>
//                     <TableCell>{calculateLeaveDays(record.from_date, record.to_date)}</TableCell>
//                     <TableCell>{getStatusBadge(getStatusFromRecord(record))}</TableCell>
//                     <TableCell>{new Date(record.applied_date).toLocaleDateString()}</TableCell>
//                     <TableCell>{record.primary_approver_name || 'N/A'}</TableCell>
//                     <TableCell>{record.secondary_approver_name || 'N/A'}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
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
//             <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>


  
//   )
// }}


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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  Filter,
  AlertCircle,
  User,
  Eye,
} from "lucide-react"
import type { LeaveBalance, LeaveRecord } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface LeaveHistoryTabProps {
  leaveBalances: LeaveBalance[]
  leaveRecords: LeaveRecord[]
  isLoading: boolean
  onDateChange: (startDate: string, endDate: string) => void
}

export function LeaveHistoryTab({
  leaveBalances,
  leaveRecords,
  isLoading,
  onDateChange,
}: LeaveHistoryTabProps) {
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false)
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null)

  React.useEffect(() => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    setStartDate(firstDayOfMonth.toISOString().split("T")[0])
    setEndDate(today.toISOString().split("T")[0])
  }, [])

  const handleFilter = () => {
    onDateChange(startDate, endDate)
  }

  const handleLeaveRowClick = (leave: LeaveRecord) => {
    setSelectedLeave(leave)
    setDetailDialogOpen(true)
  }

  const getStatusFromRecord = (
    record: LeaveRecord
  ): "approved" | "rejected" | "pending" => {
    if (record.primary_status == false || record.secondry_status == false) {
      return "rejected"
    }
    if (record.primary_status == true && record.secondry_status == true) {
      return "approved"
    }
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

  const getApprovalStatus = (leave: LeaveRecord) => {
    const status = getStatusFromRecord(leave)

    if (status === "rejected") {
      return {
        primaryStatus: "Rejected",
        secondaryStatus: "N/A",
        primaryClass: "text-red-600",
        secondaryClass: "text-gray-500",
      }
    }
    if (status === "approved") {
      return {
        primaryStatus: "Approved",
        secondaryStatus: "Approved",
        primaryClass: "text-green-600",
        secondaryClass: "text-green-600",
      }
    }
    return {
      primaryStatus: leave.primary_status ? "Approved" : "Pending",
      secondaryStatus: leave.secondry_status ? "Approved" : "Pending",
      primaryClass: leave.primary_status ? "text-green-600" : "text-yellow-600",
      secondaryClass: leave.secondry_status
        ? "text-green-600"
        : "text-yellow-600",
    }
  }

  const calculateLeaveDays = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <div className="space-y-6">
      {/* Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Balances</CardTitle>
          <CardDescription>
            Current available leave balances by type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading balances...</div>
          ) : leaveBalances.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No leave balances found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {leaveBalances.map((balance) => (
                <Card key={balance.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {balance.leave_type_name}
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{balance.balance}</div>
                    <p className="text-xs text-muted-foreground">
                      days available
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Records */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Application History</CardTitle>
          <CardDescription>
            View and filter leave requests submitted by this employee.
          </CardDescription>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="grid gap-2 w-full">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleFilter} className="w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">Loading records...</div>
          ) : leaveRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Leave Records Found
              </h3>
              <p className="text-muted-foreground">
                No leave requests found for the selected date range.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Final Status</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Primary Approver</TableHead>
                  <TableHead>Secondary Approver</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    onClick={() => handleLeaveRowClick(record)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {record.leave_type_name}
                    </TableCell>
                    <TableCell>
                      {new Date(record.from_date).toLocaleDateString()} -{" "}
                      {new Date(record.to_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {calculateLeaveDays(record.from_date, record.to_date)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(getStatusFromRecord(record))}
                    </TableCell>
                    <TableCell>
                      {new Date(record.applied_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{record.primary_approver_name || "N/A"}</TableCell>
                    <TableCell>
                      {record.secondary_approver_name || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLeaveRowClick(record)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Leave Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[30rem] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
            <DialogDescription>
              Application ID: {selectedLeave?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedLeave && (
            <div className="py-4 space-y-6">
              {/* Leave Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Leave Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Leave Type</Label>
                    <p className="font-medium">
                      {selectedLeave.leave_type_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Duration</Label>
                    <p className="font-medium">
                      {calculateLeaveDays(
                        selectedLeave.from_date,
                        selectedLeave.to_date
                      )}{" "}
                      days
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">From Date</Label>
                    <p className="font-medium">
                      {new Date(selectedLeave.from_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">To Date</Label>
                    <p className="font-medium">
                      {new Date(selectedLeave.to_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Applied Date</Label>
                    <p className="font-medium">
                      {new Date(selectedLeave.applied_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Reason */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Reason for Leave</h4>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {selectedLeave.leave_description}
                </p>
              </div>

              <Separator />

              {/* Approval Status */}
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
                            <p className="text-sm font-medium">
                              Primary Approver
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedLeave.primary_approver_name ||
                                "Not assigned"}
                            </p>
                          </div>
                          <Badge
                            className={approvalStatus.primaryClass}
                            variant="outline"
                          >
                            {approvalStatus.primaryStatus}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <p className="text-sm font-medium">
                              Secondary Approver
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedLeave.secondary_approver_name ||
                                "Not assigned"}
                            </p>
                          </div>
                          <Badge
                            className={approvalStatus.secondaryClass}
                            variant="outline"
                          >
                            {approvalStatus.secondaryStatus}
                          </Badge>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Rejection Reason */}
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

              {/* Overall Status */}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Status:</span>
                {getStatusBadge(getStatusFromRecord(selectedLeave))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
