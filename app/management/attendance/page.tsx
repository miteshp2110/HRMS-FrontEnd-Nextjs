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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ClipboardList, Search, Filter, CheckCircle, XCircle, Clock, AlertCircle, Edit, Timer } from "lucide-react"
import Link from "next/link"
import { getAllAttendance, updateAttendancePayType, approveOvertime, type AttendanceRecord } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function AttendanceRecordsPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({
      from: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Default to start of current month
      to: new Date().toISOString().split('T')[0] // Default to today
  });

  const canManageAttendance = hasPermission("attendance.manage")

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchRecords = useCallback(async () => {
    if (!canManageAttendance) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
        // Note: The API needs to support these filters. This is a frontend implementation.
        // For now, we fetch all and filter client-side.
      const data = await getAllAttendance({ 
          date_from: dateRange.from, 
          date_to: dateRange.to 
      });
      
      // Client-side filtering as a fallback
      const filteredData = data.filter(record => {
          const employeeName = record.employee_name || '';
          const matchesSearch = employeeName.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
          const matchesStatus = statusFilter === 'all' || record.attendance_status === statusFilter;
          return matchesSearch && matchesStatus;
      });

      setRecords(filteredData);
    } catch (error: any) {
      toast({ title: "Error", description: `Could not fetch attendance records: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false)
    }
  }, [canManageAttendance, dateRange, debouncedSearchTerm, statusFilter, toast])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const handleUpdatePayType = async (recordId: number, payType: "full_day" | "half_day" | "unpaid") => {
      // Placeholder for your API call
      alert(`Updating record ${recordId} to pay type: ${payType}`);
  }

  const handleApproveOvertime = async (recordId: number) => {
      // Placeholder for your API call
      alert(`Approving overtime for record ${recordId}`);
  }


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Present</Badge>
      case "absent":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Late</Badge>
      case "leave":
        return <Badge className="bg-blue-100 text-blue-800">On Leave</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <MainLayout>
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <ClipboardList className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Attendance Records</h1>
            </div>

            {!canManageAttendance ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>You don't have permission to manage attendance records.</AlertDescription>
                </Alert>
            ) : (
                <Card>
                    <CardHeader>
                    <CardTitle>Employee Attendance</CardTitle>
                    <CardDescription>View and manage daily attendance records for all employees.</CardDescription>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                        <Input
                            placeholder="Search by employee name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="md:col-span-1"
                        />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="late">Late</SelectItem>
                                <SelectItem value="leave">On Leave</SelectItem>
                            </SelectContent>
                        </Select>
                        <div>
                            <Label htmlFor="from-date" className="text-xs">From</Label>
                            <Input id="from-date" type="date" value={dateRange.from} onChange={e => setDateRange(dr => ({...dr, from: e.target.value}))}/>
                        </div>
                        <div>
                            <Label htmlFor="to-date" className="text-xs">To</Label>
                            <Input id="to-date" type="date" value={dateRange.to} onChange={e => setDateRange(dr => ({...dr, to: e.target.value}))}/>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading records...</div>
                    ) : (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Hours Worked</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>
                                <Link href={`/directory/${record.employee_id}`} className="font-medium text-primary hover:underline">
                                    {record.employee_name}
                                </Link>
                                </TableCell>
                                <TableCell>{new Date(record.attendance_date).toLocaleDateString()}</TableCell>
                                <TableCell>{record.punch_in ? new Date(record.punch_in).toLocaleTimeString() : "-"}</TableCell>
                                <TableCell>{record.punch_out ? new Date(record.punch_out).toLocaleTimeString() : "-"}</TableCell>
                                <TableCell>{record.hours_worked?.toFixed(2) || 0} hrs</TableCell>
                                <TableCell>{getStatusBadge(record.attendance_status)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleUpdatePayType(record.id, 'half_day')}>
                                        <Edit className="h-4 w-4 mr-2"/> Pay Type
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleApproveOvertime(record.id)}>
                                        <Timer className="h-4 w-4 mr-2"/> Overtime
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    )}
                    </CardContent>
                </Card>
            )}
        </div>
    </MainLayout>
  )
}