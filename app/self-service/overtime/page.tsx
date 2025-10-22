
"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react"
import {
  getMyOvertimeRecords,
  requestOvertime,
  type OvertimeRecord,
  type RequestOvertimePayload,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>
      <Skeleton className="h-10 w-48" />
    </div>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time Period</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function OvertimePageSkeleton() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <TableSkeleton />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

export default function MyOvertimePage() {
  const { toast } = useToast()
  const [records, setRecords] = React.useState<OvertimeRecord[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [monthFilter, setMonthFilter] = React.useState<string>("all")
  const [expandedReasons, setExpandedReasons] = React.useState<Set<number>>(new Set())

  const [formData, setFormData] = React.useState({
    attendance_date: "",
    overtime_start: "",
    overtime_end: "",
    overtime_type: "regular" as "regular" | "holiday",
    reason: "",
  })

  // Get timezone from localStorage
  const timezone = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedTimezone') || Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    return 'UTC'
  }, [])

  const fetchRecords = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getMyOvertimeRecords()
      setRecords(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load overtime records.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  // Check if overtime already exists for the selected date
  const hasOvertimeForDate = React.useMemo(() => {
    if (!formData.attendance_date) return false
    return records.some(
      (record) =>
        record.request_date.split('T')[0] === formData.attendance_date
    )
  }, [formData.attendance_date, records])

  // Calculate hours
  const calculateHours = React.useMemo(() => {
    if (!formData.overtime_start || !formData.overtime_end) return 0
    
    const start = new Date(`2000-01-01T${formData.overtime_start}`)
    const end = new Date(`2000-01-01T${formData.overtime_end}`)
    
    if (end <= start) return 0
    
    const diffMs = end.getTime() - start.getTime()
    const hours = diffMs / (1000 * 60 * 60)
    return Math.round(hours * 100) / 100
  }, [formData.overtime_start, formData.overtime_end])

  // Filter records
  const filteredRecords = React.useMemo(() => {
    let filtered = [...records]
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.status === statusFilter)
    }
    
    // Month filter
    if (monthFilter !== "all") {
      filtered = filtered.filter(r => {
        const recordDate = new Date(r.request_date)
        const monthYear = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`
        return monthYear === monthFilter
      })
    }
    
    return filtered
  }, [records, statusFilter, monthFilter])

  // Get unique months from records
  const availableMonths = React.useMemo(() => {
    const months = new Set<string>()
    records.forEach(r => {
      const date = new Date(r.request_date)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      months.add(monthYear)
    })
    return Array.from(months).sort().reverse()
  }, [records])

  // Calculate stats
  const stats = React.useMemo(() => {
    return {
      total: records.length,
      pending: records.filter(r => r.status === "pending_approval").length,
      approved: records.filter(r => r.status === "approved").length,
      rejected: records.filter(r => r.status === "rejected").length,
      totalApprovedHours: records
        .filter(r => r.status === "approved")
        .reduce((sum, r) => sum + Number(r.approved_hours || 0), 0)
    }
  }, [records])

  const toggleReason = (id: number) => {
    const newExpanded = new Set(expandedReasons)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedReasons(newExpanded)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.attendance_date) {
      toast({
        title: "Validation Error",
        description: "Please select a date.",
        variant: "destructive",
      })
      return
    }

    if (!formData.overtime_start || !formData.overtime_end) {
      toast({
        title: "Validation Error",
        description: "Please provide start and end times.",
        variant: "destructive",
      })
      return
    }

    if (calculateHours <= 0) {
      toast({
        title: "Validation Error",
        description: "End time must be after start time.",
        variant: "destructive",
      })
      return
    }

    if (!formData.reason.trim()) {
      toast({
        title: "Validation Error",
        description: "Reason is required.",
        variant: "destructive",
      })
      return
    }

    if (hasOvertimeForDate) {
      toast({
        title: "Validation Error",
        description: "An overtime request already exists for this date.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload: RequestOvertimePayload = {
        attendance_date: formData.attendance_date,
        overtime_start: formData.overtime_start,
        overtime_end: formData.overtime_end,
        overtime_type: formData.overtime_type,
        reason: formData.reason,
        timezone: timezone,
      }

      await requestOvertime(payload)
      
      toast({
        title: "Success",
        description: "Overtime request submitted successfully.",
      })
      
      setIsDialogOpen(false)
      setFormData({
        attendance_date: "",
        overtime_start: "",
        overtime_end: "",
        overtime_type: "regular",
        reason: "",
      })
      fetchRecords()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit overtime request.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any; label: string }> = {
      pending_approval: {
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        icon: Clock,
        label: "Pending",
      },
      approved: {
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        icon: XCircle,
        label: "Rejected",
      },
    }

    const { className, icon: Icon, label } = statusMap[status] || statusMap.pending_approval
    
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const isHoliday = type === "holiday"
    return (
      <Badge variant={isHoliday ? "default" : "secondary"}>
        {isHoliday ? "Holiday" : "Regular"}
      </Badge>
    )
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    try {
      // Parse the UTC time string and convert to local time
      const utcDate = new Date(timeString)
      const hours = utcDate.getHours()
      const minutes = utcDate.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const displayHour = hours % 12 || 12
      return `${displayHour}:${String(minutes).padStart(2, '0')} ${ampm}`
    } catch {
      return timeString
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const formatMonthYear = (monthString: string) => {
    const [year, month] = monthString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  if (isLoading) {
    return <OvertimePageSkeleton />
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Overtime</h1>
              <p className="text-muted-foreground">
                Request and track your overtime hours
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Request Overtime
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Request Overtime</DialogTitle>
                <DialogDescription>
                  Submit a new overtime request for approval
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  {/* Date */}
                  <div className="grid gap-2">
                    <Label htmlFor="attendance_date">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="attendance_date"
                      type="date"
                      value={formData.attendance_date}
                      onChange={(e) =>
                        setFormData({ ...formData, attendance_date: e.target.value })
                      }
                      disabled={isSubmitting}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {hasOvertimeForDate && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          An overtime request already exists for this date.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Overtime Type */}
                  <div className="grid gap-2">
                    <Label htmlFor="overtime_type">
                      Overtime Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.overtime_type}
                      onValueChange={(value: "regular" | "holiday") =>
                        setFormData({ ...formData, overtime_type: value })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="overtime_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular Day</SelectItem>
                        <SelectItem value="holiday">Holiday/Weekend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Period */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="overtime_start">
                        Start Time <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="overtime_start"
                        type="time"
                        value={formData.overtime_start}
                        onChange={(e) =>
                          setFormData({ ...formData, overtime_start: e.target.value })
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="overtime_end">
                        End Time <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="overtime_end"
                        type="time"
                        value={formData.overtime_end}
                        onChange={(e) =>
                          setFormData({ ...formData, overtime_end: e.target.value })
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Hours Preview */}
                  {calculateHours > 0 && (
                    <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        <span className="text-blue-900 dark:text-blue-200">
                          Total Hours: <strong>{calculateHours.toFixed(2)} hours</strong>
                        </span>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Reason */}
                  <div className="grid gap-2">
                    <Label htmlFor="reason">
                      Reason <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      placeholder="Explain why overtime is needed..."
                      rows={3}
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide a clear reason for your overtime request
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      setFormData({
                        attendance_date: "",
                        overtime_start: "",
                        overtime_end: "",
                        overtime_type: "regular",
                        reason: "",
                      })
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || hasOvertimeForDate}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Approved</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Rejected</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Approved Hours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalApprovedHours.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Overtime Records Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Overtime History</CardTitle>
                <CardDescription className="mt-1">
                  View all your overtime requests and their status
                </CardDescription>
              </div>
              
              {records.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {filteredRecords.length} of {records.length} {records.length === 1 ? "Request" : "Requests"}
                  </Badge>
                  
                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending_approval">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Month Filter */}
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {availableMonths.map(month => (
                        <SelectItem key={month} value={month}>
                          {formatMonthYear(month)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-muted rounded-full">
                    <Clock className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {records.length === 0 ? "No Overtime Records" : "No Matching Records"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {records.length === 0 
                    ? "You haven't submitted any overtime requests yet."
                    : "Try adjusting your filters to see more results."}
                </p>
                {records.length === 0 && (
                  <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Request Your First Overtime
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Period</TableHead>
                      <TableHead>Requested Hours</TableHead>
                      <TableHead>Approved Hours</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => {
                      const isExpanded = expandedReasons.has(record.id)
                      const hasReason = record.reason && record.reason.trim()
                      const hasRejectionReason = record.rejection_reason && record.rejection_reason.trim()
                      const hasAnyReason = hasReason || hasRejectionReason
                      
                      return (
                        <TableRow key={record.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(record.request_date)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-mono text-sm">
                              {formatTime(record.overtime_start)} - {formatTime(record.overtime_end)}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono font-medium">
                            {Number(record.overtime_hours).toFixed(2)} hrs
                          </TableCell>
                          <TableCell className="font-mono font-medium">
                            {record.approved_hours 
                              ? `${Number(record.approved_hours).toFixed(2)} hrs`
                              : "-"}
                          </TableCell>
                          <TableCell>{getTypeBadge(record.overtime_type)}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>
                            {hasAnyReason ? (
                              <div className="space-y-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleReason(record.id)}
                                  className="h-8 px-2 text-xs"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="h-3 w-3 mr-1" />
                                      Hide Details
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3 mr-1" />
                                      View Details
                                    </>
                                  )}
                                </Button>
                                
                                {isExpanded && (
                                  <div className="space-y-2 max-w-md">
                                    {hasReason && (
                                      <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        <AlertDescription>
                                          <div className="space-y-1">
                                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                                              Request Reason:
                                            </p>
                                            <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                                              {record.reason}
                                            </p>
                                          </div>
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                    
                                    {hasRejectionReason && (
                                      <Alert variant="destructive">
                                        <XCircle className="h-4 w-4" />
                                        <AlertDescription>
                                          <div className="space-y-1">
                                            <p className="text-xs font-semibold">
                                              Rejection Reason:
                                            </p>
                                            <p className="text-sm whitespace-pre-wrap">
                                              {record.rejection_reason}
                                            </p>
                                            {record.processed_by_name && (
                                              <p className="text-xs text-muted-foreground mt-2">
                                                Processed by: {record.processed_by_name}
                                              </p>
                                            )}
                                          </div>
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}