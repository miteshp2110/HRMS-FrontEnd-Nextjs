"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare, 
  CalendarDays, 
  AlertCircle as AlertCircleIcon, 
  Download,
  Loader2,
  FileText,
  TrendingUp,
  Calendar
} from "lucide-react"
import { 
  getLeaveRecordById, 
  getEmployeeLeaveBalance, 
  getEmployeeLeaveRecords, 
  approvePrimaryLeave, 
  approveSecondaryLeave, 
  downloadLeaveApplication, 
  type LeaveRecord, 
  type LeaveBalance, 
  getHolidays, 
  getWorkWeek 
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface LeaveDetailPageProps {
  leaveId: number
}

interface ApiWorkWeekDay {
  id?: number
  day_of_week: string
  is_working_day: number | boolean
  created_at?: string
  updated_at?: string
  updated_by?: string | null
}

// Skeleton Components
function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function LeaveDetailPage({ leaveId }: LeaveDetailPageProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [leave, setLeave] = React.useState<LeaveRecord | null>(null)
  const [history, setHistory] = React.useState<{ balances: LeaveBalance[], records: LeaveRecord[] }>({ balances: [], records: [] })
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false)
  const [rejectionReason, setRejectionReason] = React.useState("")
  const [isApproving, setIsApproving] = React.useState(false)
  const [isRejecting, setIsRejecting] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [holidays, setHolidays] = React.useState<Date[]>([])
  const [workWeek, setWorkWeek] = React.useState<ApiWorkWeekDay[]>([])

  const fetchLeaveDetails = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const leaveData = await getLeaveRecordById(leaveId)
      setLeave(leaveData)

      const year = new Date(leaveData.from_date).getFullYear()

      const [balances, records, holidaysData, workWeekData] = await Promise.all([
        getEmployeeLeaveBalance(leaveData.employee_id),
        getEmployeeLeaveRecords(leaveData.employee_id, String(year)),
        getHolidays(new Date().getFullYear()),
        getWorkWeek()
      ])
      setHistory({ balances, records })

      setHolidays(holidaysData.map(h => new Date(h.holiday_date)))
      const normalizedWorkWeek = workWeekData.map(day => ({
        ...day,
        is_working_day: typeof day.is_working_day === 'boolean' ? (day.is_working_day ? 1 : 0) : day.is_working_day
      }))
      setWorkWeek(normalizedWorkWeek)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Failed to load leave details: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [leaveId, toast])

  React.useEffect(() => {
    fetchLeaveDetails()
  }, [fetchLeaveDetails])

  const handleStatusUpdate = async (status: boolean, reason?: string) => {
    if (!leave) return

    if (!status && !reason?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a rejection reason.",
        variant: "destructive"
      })
      return
    }

    const isPrimaryApproval = leave.primary_user === user?.id && !leave.primary_status
    const apiCall = isPrimaryApproval ? approvePrimaryLeave : approveSecondaryLeave

    status ? setIsApproving(true) : setIsRejecting(true)
    try {
      await apiCall(leave.id, status, reason)
      toast({ 
        title: "Success", 
        description: `Leave request has been ${status ? 'approved' : 'rejected'} successfully.` 
      })
      setIsRejectDialogOpen(false)
      router.push("/management/leaves")
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update leave status.", 
        variant: "destructive" 
      })
    } finally {
      setIsApproving(false)
      setIsRejecting(false)
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

  const handleDownload = async () => {
    if(!leave) return
    setIsDownloading(true)
    try {
      await downloadLeaveApplication(leave.id)
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
      setIsDownloading(false)
    }
  }

  const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
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
    }
  }

  if (isLoading) return <PageSkeleton />
  
  if (!leave) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Leave application not found.</AlertDescription>
      </Alert>
    )
  }

  const year = new Date(leave.from_date).getFullYear()
  const totalLeavesTaken = history.records
    .filter(rec => getStatusFromRecord(rec) === 'approved')
    .reduce((sum, rec) => sum + calculateLeaveDays(rec.from_date, rec.to_date), 0)
  
  const leavesPerMonth = history.records
    .filter(rec => getStatusFromRecord(rec) === 'approved')
    .length / (new Date().getMonth() + 1)
    
  const isPending = getStatusFromRecord(leave) === 'pending'

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/management/leaves">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Approvals
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Details Card */}
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Leave Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Leave ID</div>
                  <div className="font-mono font-semibold">{leave.full_leave_id}</div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Employee</div>
                  <Link 
                    href={`/directory/${leave.employee_id}`} 
                    className="font-semibold text-primary hover:underline"
                  >
                    {leave.employee_name}
                  </Link>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Leave Type</div>
                  <Badge variant="outline" className="font-semibold">
                    {leave.leave_type_name}
                  </Badge>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Duration</div>
                  <div className="font-semibold">
                    {calculateLeaveDays(leave.from_date, leave.to_date)} days
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Leave Period
                </div>
                <div className="text-sm bg-muted p-3 rounded-md">
                  <strong>{new Date(leave.from_date).toLocaleDateString('en-AE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</strong>
                  {" to "}
                  <strong>{new Date(leave.to_date).toLocaleDateString('en-AE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  Reason for Leave
                </div>
                <p className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap">
                  {leave.leave_description || "No reason provided."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Approval Status Card */}
          <Card className="border-indigo-200 dark:border-indigo-900">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
              <div className="flex items-center justify-between">
                <CardTitle className="text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Approval Status
                </CardTitle>
                {getStatusBadge(getStatusFromRecord(leave))}
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Primary Approver</div>
                <div className="font-semibold">
                  {leave.primary_approver_name}
                </div>
                <Badge className="mt-2" variant={leave.primary_status === null ? "secondary" : leave.primary_status ? "default" : "destructive"}>
                  {leave.primary_status === null ? "Pending" : leave.primary_status ? "Accepted" : "Rejected"}
                </Badge>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Secondary Approver</div>
                <div className="font-semibold">
                  {leave.secondary_approver_name}
                </div>
                <Badge className="mt-2" variant={leave.secondry_status === null ? "secondary" : leave.secondry_status ? "default" : "destructive"}>
                  {leave.secondry_status === null ? "Pending" : leave.secondry_status ? "Accepted" : "Rejected"}
                </Badge>
              </div>

              {getStatusFromRecord(leave) === 'rejected' && leave.rejection_reason && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Rejection Reason</AlertTitle>
                  <AlertDescription>{leave.rejection_reason}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Past Records Card */}
          <Card>
            <CardHeader>
              <CardTitle>Past Leave Records ({year})</CardTitle>
              <CardDescription>
                Previous leave applications for this employee in {year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.records.filter(rec => rec.id !== leave.id).length > 0 ? (
                <div className="overflow-x-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.records.filter(rec => rec.id !== leave.id).map(rec => (
                        <TableRow key={rec.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <Badge variant="outline">{rec.leave_type_name}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(rec.from_date).toLocaleDateString('en-AE')} - {new Date(rec.to_date).toLocaleDateString('en-AE')}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">
                              {calculateLeaveDays(rec.from_date, rec.to_date)} days
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(getStatusFromRecord(rec))}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No past leave records found for this year.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card className="border-indigo-200 dark:border-indigo-900">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
              <CardTitle className="text-indigo-900 dark:text-indigo-100">Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Application
                  </>
                )}
              </Button>
              
              {isPending && (
                <>
                  <Separator />
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={() => handleStatusUpdate(true)}
                    disabled={isApproving || isRejecting}
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Leave
                      </>
                    )}
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="destructive" 
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={isApproving || isRejecting}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Leave
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Leave Balances Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-5 w-5" />
                Current Leave Balances
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {history.balances.map(b => (
                <div key={b.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">{b.leave_type_name}</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {b.balance} days
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Leaves Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLeavesTaken}</div>
                <p className="text-xs text-muted-foreground mt-1">days in {year}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leavesPerMonth.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-1">per month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Reject Leave Request
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request. This will be visible to the employee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="rejection-reason">Rejection Reason *</Label>
            <Textarea 
              id="rejection-reason"
              value={rejectionReason} 
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="Please explain why this leave request is being rejected..."
              rows={4}
              disabled={isRejecting}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRejectDialogOpen(false)
                setRejectionReason("")
              }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleStatusUpdate(false, rejectionReason)}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
