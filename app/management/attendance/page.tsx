"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { getAttendanceRecords } from "@/lib/api"

interface AttendanceRecord {
  id: number
  employee_id: number
  employee_name: string
  date: string
  check_in: string
  check_out: string
  status: "present" | "absent" | "late" | "half_day"
  hours_worked: number
}

export default function AttendanceRecordsPage() {
  const { hasPermission } = useAuth()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (hasPermission("attendance.manage")) {
      fetchRecords()
    }
  }, [hasPermission])

  const fetchRecords = async () => {
    try {
      const data = await getAttendanceRecords()
      setRecords(data)
    } catch (error) {
      console.error("Error fetching attendance records:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Present
          </Badge>
        )
      case "absent":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        )
      case "late":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Late
          </Badge>
        )
      case "half_day":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Half Day</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!hasPermission("attendance.manage")) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p>You don't have permission to manage attendance records.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <ClipboardList className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Attendance Records</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Attendance</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee name..."
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
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="half_day">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Link href={`/directory/${record.employee_id}`} className="text-blue-500 hover:underline">
                        {record.employee_name}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.check_in || "-"}</TableCell>
                    <TableCell>{record.check_out || "-"}</TableCell>
                    <TableCell>{record.hours_worked || 0} hrs</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
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
