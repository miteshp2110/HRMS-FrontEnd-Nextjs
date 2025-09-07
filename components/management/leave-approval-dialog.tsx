"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, CheckCircle, XCircle, Clock, User, MessageSquare, BarChart2, TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getEmployeeLeaveBalance, getEmployeeLeaveRecords, type LeaveRecord, type LeaveBalance } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface LeaveApprovalDialogProps {
  leaveRecord: LeaveRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdate: (leaveId: number, status: boolean) => void
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function LeaveApprovalDialog({ leaveRecord, open, onOpenChange, onStatusUpdate }: LeaveApprovalDialogProps) {
  const { toast } = useToast();
  const [employeeHistory, setEmployeeHistory] = React.useState<{ balances: LeaveBalance[], records: LeaveRecord[] }>({ balances: [], records: [] });
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(false);
  const year = new Date().getFullYear();

  React.useEffect(() => {
    if (open && leaveRecord) {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
          const [balances, records] = await Promise.all([
            getEmployeeLeaveBalance(leaveRecord.employee_id),
            getEmployeeLeaveRecords(leaveRecord.employee_id, String(year))
          ]);
          setEmployeeHistory({ balances, records });
        } catch (error: any) {
          toast({ title: "Error", description: `Failed to fetch employee history: ${error.message}`, variant: "destructive" });
        } finally {
          setIsLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [open, leaveRecord, toast, year]);
  
  if (!leaveRecord) return null;

  const calculateLeaveDays = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
    if (record.rejection_reason!== null) return "rejected";
    if (record.primary_status == true && record.secondry_status == true) return "approved";
    return "pending";
  }

  const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
    switch (status) {
      case "approved": return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected": return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "pending": return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }
  }

  const chartData = employeeHistory.balances.map(b => ({ name: b.leave_type_name, value: b.balance }));
  
  const totalLeavesTaken = employeeHistory.records
    .filter(rec => getStatusFromRecord(rec) === 'approved')
    .reduce((sum, rec) => sum + calculateLeaveDays(rec.from_date, rec.to_date), 0);

  const leavesPerMonth = employeeHistory.records
    .filter(rec => getStatusFromRecord(rec) === 'approved')
    .length / (new Date().getMonth() + 1);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Leave Request Details</DialogTitle>
          <DialogDescription>
            Review the leave request and the employee's history to make an informed decision.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-6">
            <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Request Details</TabsTrigger>
                    <TabsTrigger value="history">Employee History & Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback>{leaveRecord.employee_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-xl">
                                        <a
                                            href={`/directory/${leaveRecord.employee_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline cursor-pointer"
                                        >
                                            {leaveRecord.employee_name}
                                        </a>
                                    </CardTitle>
                                    <p className="text-muted-foreground">{leaveRecord.leave_type_name}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 text-sm">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/> <strong>From:</strong> {new Date(leaveRecord.from_date).toLocaleDateString()}</div>
                               <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/> <strong>To:</strong> {new Date(leaveRecord.to_date).toLocaleDateString()}</div>
                               <div className="flex items-center gap-2"><Clock className="h-4 w-4"/> <strong>Total Days:</strong> {calculateLeaveDays(leaveRecord.from_date, leaveRecord.to_date)}</div>
                           </div>
                           <div className="space-y-2">
                               <h4 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Employee's Reason</h4>
                               <p className="text-muted-foreground p-4 bg-muted rounded-md">{leaveRecord.leave_description || "No reason provided."}</p>
                           </div>
                           <div className="space-y-2">
                               <h4 className="font-semibold flex items-center gap-2"><User className="h-4 w-4"/> Approval Status</h4>
                               <div className="flex items-center gap-4">
                                   <span>Primary: {leaveRecord.primary_approver_name || 'N/A'} ({getStatusBadge(leaveRecord.primary_status === null ? 'pending' : leaveRecord.primary_status ? 'approved' : 'rejected')})</span>
                               </div>
                           </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history" className="mt-4 space-y-6">
                    {isLoadingHistory ? <div className="text-center py-12">Loading history...</div> : (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Leaves Taken ({year})</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{totalLeavesTaken} Days</div></CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Leave Frequency</CardTitle><BarChart2 className="h-4 w-4 text-muted-foreground" /></CardHeader>
                                <CardContent><div className="text-2xl font-bold">{leavesPerMonth.toFixed(2)} / month</div></CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5"/>Current Leave Balances</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                {employeeHistory.balances.map(b => (
                                    <div key={b.id} className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm font-medium text-muted-foreground">{b.leave_type_name}</p>
                                        <p className="text-3xl font-bold">{b.balance}</p>
                                        <p className="text-xs">days left</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Past Leave Records ({year})</CardTitle></CardHeader>
                            <CardContent className="max-h-[250px] overflow-y-auto">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Dates</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {employeeHistory.records.map(rec => {
                                            if(rec.id != leaveRecord.id){
                                                return (
                                            <TableRow key={rec.id}>
                                                <TableCell>{rec.leave_type_name}</TableCell>
                                                <TableCell>{new Date(rec.from_date).toLocaleDateString()} - {new Date(rec.to_date).toLocaleDateString()}</TableCell>
                                                <TableCell>{calculateLeaveDays(rec.from_date, rec.to_date)}</TableCell>
                                                <TableCell>{getStatusBadge(getStatusFromRecord(rec))}</TableCell>
                                            </TableRow>
                                        )
                                            }
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {getStatusFromRecord(leaveRecord) == 'pending' && (
            <div className="flex gap-2">
                <Button variant="destructive" onClick={() => onStatusUpdate(leaveRecord.id, false)}>
                <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => onStatusUpdate(leaveRecord.id, true)}>
                <CheckCircle className="h-4 w-4 mr-2" /> Approve
                </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}