"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { getLeaveRequests, approvePrimaryLeave, type LeaveRequest } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LeaveManagementPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const canManageLeaves = hasPermission("leaves.manage")

  const fetchLeaves = async () => {
    if (!canManageLeaves) {
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      const data = await getLeaveRequests()
      setLeaves(data)
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch leave requests.", variant: "destructive" });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaves()
  }, [canManageLeaves])

  const handleStatusUpdate = async (leaveId: number, status: boolean) => {
    try {
      await approvePrimaryLeave(leaveId, status)
      toast({ title: "Success", description: `Leave request has been ${status ? 'approved' : 'rejected'}.` });
      fetchLeaves() // Refresh the list
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update leave status.", variant: "destructive" });
    }
  }

  const getStatusBadge = (status: string) => {
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

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leave_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || leave.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!canManageLeaves) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                <UserPlus className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Leave Management</h1>
                </div>
            </div>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                You don't have permission to manage leaves.
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UserPlus className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Leave Management</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
          <CardDescription>Review and approve or reject employee leave requests.</CardDescription>
          <div className="flex gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee name or leave type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading leave requests...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>
                      <Link href={`/directory/${leave.employee_id}`} className="font-medium text-primary hover:underline">
                        {leave.employee_name}
                      </Link>
                    </TableCell>
                    <TableCell>{leave.leave_type}</TableCell>
                    <TableCell>{new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>{leave.days}</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell>
                      {leave.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleStatusUpdate(leave.id, true)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleStatusUpdate(leave.id, false)}
                          >
                            <XCircle className="h-4 w-4 mr-2" /> Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}