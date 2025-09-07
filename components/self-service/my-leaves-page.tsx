"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, CheckCircle, XCircle, Clock } from "lucide-react"
import { type LeaveBalance, type LeaveRecord, getLeaveBalances, getMyLeaveRecords } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MyLeavesPage() {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [allLeaveApplications, setAllLeaveApplications] = useState<LeaveRecord[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Set initial date range to the current month
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const loadLeaveData = async () => {
      setLoading(true)
      try {
        const [balances, applications] = await Promise.all([
            getLeaveBalances(),
            getMyLeaveRecords(),
        ]);
        setLeaveBalances(balances)
        setAllLeaveApplications(applications as LeaveRecord[] | [])
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
    loadLeaveData()
  }, [toast])

  const filteredLeaveApplications = useMemo(() => {
    if (!startDate || !endDate) {
      return allLeaveApplications;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return allLeaveApplications.filter(app => {
        const appDate = new Date(app.from_date);
        return appDate >= start && appDate <= end;
    });
  }, [allLeaveApplications, startDate, endDate]);


  const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
    if (record.primary_status == false || record.secondry_status == false) return "rejected";
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Apply for Leave
        </Button>
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

      <Card>
        <CardHeader>
          <CardTitle>Leave Application History</CardTitle>
          <CardDescription>Your leave application history and status.</CardDescription>
           <div className="flex flex-col md:flex-row gap-4 pt-4">
                <div className="grid gap-2 w-full">
                    <Label htmlFor="start-date">From Date</Label>
                    <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="grid gap-2 w-full">
                    <Label htmlFor="end-date">To Date</Label>
                    <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
            </div>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaveApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.leave_type_name}</TableCell>
                  <TableCell>{new Date(application.from_date).toLocaleDateString()} - {new Date(application.to_date).toLocaleDateString()}</TableCell>
                  <TableCell>{calculateLeaveDays(application.from_date, application.to_date)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{application.leave_description}</TableCell>
                  <TableCell>{getStatusBadge(getStatusFromRecord(application))}</TableCell>
                  <TableCell>{new Date(application.applied_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}