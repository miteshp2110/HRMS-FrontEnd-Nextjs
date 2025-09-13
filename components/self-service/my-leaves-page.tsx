
"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Plus, Calendar, CheckCircle, XCircle, Clock, Eye, User, AlertCircle } from "lucide-react"
import { type LeaveBalance, type LeaveRecord, getLeaveBalances, getMyLeaveRecords, requestLeave, getLeaveTypes, type LeaveType , deleteLeaveRequest} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MyLeavesPage() {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [leaveApplications, setLeaveApplications] = useState<LeaveRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<LeaveRecord | null>(null)
  const [formData, setFormData] = useState({
    leave_type: "", // This will store the leave type ID
    from_date: "",
    to_date: "",
    reason: "",
  })
  const { toast } = useToast()

  const loadLeaveData = async () => {
    try {
      setLoading(true)
      const [balances, applications] = await Promise.all([
          getLeaveBalances(),
          getMyLeaveRecords(),
      ]);
      setLeaveBalances(balances)
      setLeaveApplications(applications as LeaveRecord[] | [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leave data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaveData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.leave_type || !formData.from_date || !formData.to_date) {
        toast({ title: "Error", description: "Please fill out all date and type fields.", variant: "destructive" });
        return;
    }
    

    const fromDate = new Date(formData.from_date);
    const toDate = new Date(formData.to_date);

    if (toDate < fromDate) {
        toast({ title: "Error", description: "'To Date' cannot be before 'From Date'.", variant: "destructive" });
        return;
    }

    const timeDiff = toDate.getTime() - fromDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1

    const selectedLeaveTypeId = parseInt(formData.leave_type);
    const selectedLeaveBalance = leaveBalances.find(b => b.id === selectedLeaveTypeId);

    if (!selectedLeaveBalance || daysDiff > selectedLeaveBalance.balance) {
        toast({
            title: "Insufficient Balance",
            description: `You only have ${selectedLeaveBalance?.balance || 0} days of ${selectedLeaveBalance?.leave_type_name || ''} available for a ${daysDiff}-day request.`,
            variant: "destructive"
        });
        return;
    }

    try {
      await requestLeave({
          leave_type: selectedLeaveTypeId,
          from_date: formData.from_date,
          to_date: formData.to_date,
          leave_description: formData.reason,
      })

      toast({ title: "Success", description: "Leave application submitted successfully" })
      setDialogOpen(false)
      setFormData({ leave_type: "", from_date: "", to_date: "", reason: "" })
      loadLeaveData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit leave application",
        variant: "destructive",
      })
    }
  }

  const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
    if (record.rejection_reason != null) return "rejected";
    if (record.primary_status == true && record.secondry_status == true) return "approved";
    return "pending";
  }

  const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }
  }

  const calculateLeaveDays = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  const handleLeaveRowClick = (leave: LeaveRecord) => {
    setSelectedLeave(leave)
    setDetailDialogOpen(true)
  }
  const handleDeleteRequest=async(leaveId:number)=>{
      setDetailDialogOpen(false)
      await deleteLeaveRequest(selectedLeave?.id!)
      await loadLeaveData()
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
    
    // Pending status
    return {
      primaryStatus: leave.primary_status === true ? "Approved" : leave.primary_status === false ? "Rejected" : "Pending",
      secondaryStatus: leave.secondry_status === true ? "Approved" : leave.secondry_status === false ? "Rejected" : "Pending",
      primaryClass: leave.primary_status === true ? "text-green-600" : leave.primary_status === false ? "text-red-600" : "text-yellow-600",
      secondaryClass: leave.secondry_status === true ? "text-green-600" : leave.secondry_status === false ? "text-red-600" : "text-yellow-600"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
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
            <Button >
              <Plus className="h-4 w-4 mr-2" />
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>Submit a new leave application</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="leave_type">Leave Type</Label>
                  <Select
                    value={formData.leave_type}
                    onValueChange={(value) => setFormData({ ...formData, leave_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveBalances.map((balance) => (
                        <SelectItem key={balance.id} value={balance.id.toString()}>
                          {balance.leave_type_name} ({balance.balance} days available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="from_date">From Date</Label>
                    <Input
                      id="from_date"
                      type="date"
                      value={formData.from_date}
                      onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="to_date">To Date</Label>
                    <Input
                      id="to_date"
                      type="date"
                      value={formData.to_date}
                      onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Please provide a reason for your leave"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Application</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalances.map((balance) => (
          <Card key={balance.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{balance.leave_type_name}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balance.balance}</div>
              <p className="text-xs text-muted-foreground">days available</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {
        leaveApplications.length===0?
        <Card>
        <CardHeader>
          <CardTitle>No Leave Application Found</CardTitle>
          <CardDescription>No leaves applications in your profile</CardDescription>
        </CardHeader>
        </Card>
        :
        <Card>
        <CardHeader>
          <CardTitle>Leave Applications</CardTitle>
          <CardDescription>Your leave application history and status. Click on a row to view details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveApplications.map((application) => (
                <TableRow key={application.id} className="cursor-pointer hover:bg-muted" onClick={() => handleLeaveRowClick(application)}>
                  <TableCell className="font-medium">{application.leave_type_name}</TableCell>
                  <TableCell>{new Date(application.from_date).toLocaleDateString()} - {new Date(application.to_date).toLocaleDateString()}</TableCell>
                  <TableCell>{calculateLeaveDays(application.from_date, application.to_date)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{application.leave_description}</TableCell>
                  <TableCell>{getStatusBadge(getStatusFromRecord(application))}</TableCell>
                  <TableCell>{new Date(application.applied_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleLeaveRowClick(application); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      }

      {/* Leave Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-120 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
            <DialogDescription>
              Application ID: {selectedLeave?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="py-4 space-y-6">
              {/* Basic Information */}
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
                    <p className="font-medium">{new Date(selectedLeave.from_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">To Date</Label>
                    <p className="font-medium">{new Date(selectedLeave.to_date).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Applied Date</Label>
                    <p className="font-medium">{new Date(selectedLeave.applied_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Reason */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Reason for Leave</h4>
                <p className="text-sm bg-muted p-3 rounded-md">{selectedLeave.leave_description}</p>
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

              {/* Rejection Reason (if applicable) */}
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
            {detailDialogOpen && getStatusFromRecord(selectedLeave!)==="pending"?<Button variant="destructive" onClick={() => {handleDeleteRequest(selectedLeave?.id!)}}>
              Delete
            </Button>:<></>}
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}