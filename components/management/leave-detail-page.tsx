
"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle, XCircle, Clock, User, MessageSquare, CalendarDays, AlertCircle as AlertCircleIcon, Info, TrendingUp, BarChart2, Download } from "lucide-react"
import { getLeaveRecordById, getEmployeeLeaveBalance, getEmployeeLeaveRecords, approvePrimaryLeave, approveSecondaryLeave, downloadLeaveApplication, type LeaveRecord, type LeaveBalance, getHolidays, getWorkWeek } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface LeaveDetailPageProps {
  leaveId: number;
}
interface ApiWorkWeekDay {
  id?: number;
  day_of_week: string;
  is_working_day: number | boolean; // Support both number and boolean
  created_at?: string;
  updated_at?: string;
  updated_by?: string | null;
}

export function LeaveDetailPage({ leaveId }: LeaveDetailPageProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [leave, setLeave] = React.useState<LeaveRecord | null>(null);
  const [history, setHistory] = React.useState<{ balances: LeaveBalance[], records: LeaveRecord[] }>({ balances: [], records: [] });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [holidays, setHolidays] = React.useState<Date[]>([])
  const [workWeek, setWorkWeek] = React.useState<ApiWorkWeekDay[]>([])

  const fetchLeaveDetails = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const leaveData = await getLeaveRecordById(leaveId);
      setLeave(leaveData);

      const year = new Date(leaveData.from_date).getFullYear();

      const [balances, records, holidaysData, workWeekData] = await Promise.all([
        getEmployeeLeaveBalance(leaveData.employee_id),
        getEmployeeLeaveRecords(leaveData.employee_id, String(year)),
        getHolidays(new Date().getFullYear()),
        getWorkWeek()
      ]);
      setHistory({ balances, records });

      setHolidays(holidaysData.map(h => new Date(h.holiday_date)))
      // Normalize the workWeek data to handle both boolean and number types
      const normalizedWorkWeek = workWeekData.map(day => ({
        ...day,
        is_working_day: typeof day.is_working_day === 'boolean' ? (day.is_working_day ? 1 : 0) : day.is_working_day
      }));
      setWorkWeek(normalizedWorkWeek)

    } catch (error: any) {
      toast({ title: "Error", description: `Failed to load leave details: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [leaveId, toast]);

  React.useEffect(() => {
    fetchLeaveDetails();
  }, [fetchLeaveDetails]);

  const handleStatusUpdate = async (status: boolean, reason?: string) => {
    if (!leave) return;
    const isPrimaryApproval = leave.primary_user === user?.id && !leave.primary_status;

    const apiCall = isPrimaryApproval ? approvePrimaryLeave : approveSecondaryLeave;

    try {
      await apiCall(leave.id, status, reason);
      toast({ title: "Success", description: "Leave request has been updated." });
      setIsRejectDialogOpen(false);
      router.push("/management/leaves");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update leave status.", variant: "destructive" });
    }
  };
  const calculateLeaveDays = React.useCallback((startDate: Date | string, endDate: Date | string) => {
        let count = 0;
        const currentDate = new Date(startDate);
        const lastDate = new Date(endDate);
        
        // Reset time to avoid timezone issues
        currentDate.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);
        
        while(currentDate <= lastDate) {
            const dayOfWeek = currentDate.getDay();
            const isHoliday = holidays.some(h => {
              const holidayDate = new Date(h);
              holidayDate.setHours(0, 0, 0, 0);
              return holidayDate.getTime() === currentDate.getTime();
            });
            
            // Don't exclude approved leave dates from calculation for display purposes
            // We only exclude them during form submission validation
            
            // Handle both boolean and number types for is_working_day
            const workDayConfig = workWeek.find(d => 
              ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
              .indexOf(d.day_of_week) === dayOfWeek
            );
            const isWorkingDay = workDayConfig ? 
              (typeof workDayConfig.is_working_day === 'boolean' ? workDayConfig.is_working_day : workDayConfig.is_working_day === 1) : 
              false;
            
            if(!isHoliday && isWorkingDay) {
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
      },[holidays,workWeek])
  const handleDownload = async () => {
    if(!leave) return;
    try {
      await downloadLeaveApplication(leave.id);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to download PDF: ${error.message}`, variant: "destructive" });
    }
  }

  

  const getStatusFromRecord = (record: LeaveRecord): "approved" | "rejected" | "pending" => {
    if (record.rejection_reason != null) return "rejected";
    if (record.primary_status && record.secondry_status) return "approved";
    return "pending";
  }
  
  const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
    switch (status) {
      case "approved": return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected": return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case "pending": return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  }

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!leave) return <Alert variant="destructive"><AlertCircleIcon className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>Leave application not found.</AlertDescription></Alert>;

  const year = new Date(leave.from_date).getFullYear();
  const totalLeavesTaken = history.records
    .filter(rec => getStatusFromRecord(rec) === 'approved')
    .reduce((sum, rec) => sum + calculateLeaveDays(rec.from_date, rec.to_date), 0);
  
  const leavesPerMonth = history.records
    .filter(rec => getStatusFromRecord(rec) === 'approved')
    .length / (new Date().getMonth() + 1);
    
  const isPending = getStatusFromRecord(leave) === 'pending';


  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild><Link href="/management/leaves"><ArrowLeft className="h-4 w-4 mr-2"/>Back to Approvals</Link></Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Leave Application Details</CardTitle>
            </CardHeader>
             <CardContent className="space-y-4 text-sm">
                 <p><strong>Leave Id:</strong> {leave.full_leave_id}</p>
                 <p><strong>Employee:</strong> <Link href={`/directory/${leave.employee_id}`} className="text-primary hover:underline">{leave.employee_name}</Link></p>
                 <p><strong>Leave Type:</strong> {leave.leave_type_name}</p>
                 <p><strong>Dates:</strong> {new Date(leave.from_date).toLocaleDateString()} to {new Date(leave.to_date).toLocaleDateString()} ({calculateLeaveDays(leave.from_date, leave.to_date)} days)</p>
                 <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Reason</h4>
                    <p className="text-muted-foreground p-3 bg-muted rounded-md">{leave.leave_description || "No reason provided."}</p>
                 </div>
             </CardContent>
          </Card>
           <Card>
            <CardHeader><CardTitle>Approval Status</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <p><strong>Primary Approver:</strong> {leave.primary_approver_name} ({leave.primary_status ? "Approved" : "Pending"})</p>
                <p><strong>Secondary Approver:</strong> {leave.secondary_approver_name} ({leave.secondry_status ? "Approved" : "Pending"})</p>
            </CardContent>
          </Card>
          <Card>
              <CardHeader><CardTitle>Past Leave Records ({year})</CardTitle></CardHeader>
              <CardContent className="max-h-80 overflow-y-auto">
                {history.records.filter(rec => rec.id !== leave.id).length > 0 ? (
                  <Table>
                      <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Dates</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                      <TableBody>
                          {history.records.filter(rec => rec.id !== leave.id).map(rec => (
                            <TableRow key={rec.id}>
                                <TableCell className="font-medium">{rec.leave_type_name}</TableCell>
                                <TableCell>{new Date(rec.from_date).toLocaleDateString()} - {new Date(rec.to_date).toLocaleDateString()}</TableCell>
                                <TableCell>{calculateLeaveDays(rec.from_date, rec.to_date)}</TableCell>
                                <TableCell>{getStatusBadge(getStatusFromRecord(rec))}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                ) : (
                    <p className="text-center text-muted-foreground py-4">No past leave records found for this year.</p>
                )}
              </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Button className="w-full" onClick={handleDownload}><Download className="h-4 w-4 mr-2"/>Download Application</Button>
                    {isPending && (
                        <>
                            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(true)}>Approve</Button>
                            <Button className="w-full" variant="destructive" onClick={() => setIsRejectDialogOpen(true)}>Reject</Button>
                        </>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5"/>Current Leave Balances</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {history.balances.map(b => (
                      <div key={b.id} className="flex justify-between items-center text-sm">
                          <span>{b.leave_type_name}</span>
                          <span className="font-bold">{b.balance} days</span>
                      </div>
                    ))}
                </CardContent>
            </Card>
             <div className="grid grid-cols-2 gap-4">
              <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Leaves Taken ({year})</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold">{totalLeavesTaken} Days</div></CardContent>
              </Card>
              <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Leave Frequency</CardTitle></CardHeader>
                  <CardContent><div className="text-2xl font-bold">{leavesPerMonth.toFixed(2)} / month</div></CardContent>
              </Card>
          </div>
        </div>
      </div>
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>Reject Leave Request</DialogTitle><DialogDescription>Please provide a reason for rejection.</DialogDescription></DialogHeader>
            <Textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleStatusUpdate(false, rejectionReason)}>Confirm Rejection</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}