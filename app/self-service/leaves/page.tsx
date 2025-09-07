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
import { Plus, Calendar, CheckCircle, XCircle, Clock } from "lucide-react"
import { type LeaveBalance, getLeaveBalances, getMyLeaveRecords, requestLeave, type LeaveType } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface LeaveApplication {
  id: number
  leave_type_name: string
  from_date: string
  to_date: string
  leave_days: number
  leave_description: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export default function MyLeavesPage() {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    leave_type: "",
    from_date: "",
    to_date: "",
    reason: "",
  })
  const { toast } = useToast()

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [balances, applications] = await Promise.all([
        getLeaveBalances(),
        getMyLeaveRecords(),
        // getLeaveTypes()
      ])
      setLeaveBalances(balances)
      setLeaveApplications(applications as any)
      // setLeaveTypes(types)
    } catch (error) {
      toast({ title: "Error", description: "Failed to load leave data", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        await requestLeave({
            leave_type: Number(formData.leave_type),
            from_date: formData.from_date,
            to_date: formData.to_date,
            leave_description: formData.reason,
        });

      toast({ title: "Success", description: "Leave application submitted successfully" })
      setDialogOpen(false)
      setFormData({ leave_type: "", from_date: "", to_date: "", reason: "" })
      fetchAllData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to submit leave application", variant: "destructive" })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
            <Button>
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

      {/* Leave Balances */}
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

      {/* Leave Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Applications</CardTitle>
          <CardDescription>Your leave application history and status</CardDescription>
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
                <TableHead>Applied On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.leave_type_name}</TableCell>
                  <TableCell>{new Date(application.from_date).toLocaleDateString()} - {new Date(application.to_date).toLocaleDateString()}</TableCell>
                  <TableCell>{application.leave_days}</TableCell>
                  <TableCell className="max-w-xs truncate">{application.leave_description}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}