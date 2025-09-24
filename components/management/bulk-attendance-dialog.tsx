
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { bulkCreateAttendance, getUserWithUnmarkedAttendance, type Shift, type UserByShift } from "@/lib/api";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";

interface BulkAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shifts: Shift[];
  onSuccess: () => void;
}

export function BulkAttendanceDialog({ open, onOpenChange, shifts, onSuccess }: BulkAttendanceDialogProps) {
  const { toast } = useToast();
  const [selectedShiftId, setSelectedShiftId] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [employees, setEmployees] = useState<UserByShift[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const [punchoutOnly, setPunchoutOnly] = useState(false);

  const [attendanceData, setAttendanceData] = useState({
    reason: "",
    punch_in_local: "",
    punch_out_local: "",
    timezone: localStorage.getItem("selectedTimezone") || "UTC",
    is_late: false,
    is_early_departure: false,
    status: "Present",
  });

  useEffect(() => {
    if (selectedShiftId && attendanceDate) {
      setIsLoading(true);
      getUserWithUnmarkedAttendance(parseInt(selectedShiftId), attendanceDate, punchoutOnly)
        .then(employees => {
          setEmployees(employees);
          setSelectedEmployees([]); // Reset selection when list changes
        })
        .catch(err => {
          toast({ title: "Error", description: "Could not fetch employees for the selected shift and date.", variant: "destructive" });
          setEmployees([]); // Clear employees on error
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedShiftId, attendanceDate, punchoutOnly, toast]);

  const handlePunchoutOnlyChange = (checked: boolean) => {
    setPunchoutOnly(checked);
    if (checked) {
      setAttendanceData(prev => ({
        ...prev,
        punch_in_local: "",
        is_late: false,
        status: "Present", // Reset status to default
      }));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(employees.map(e => e.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, id]);
    } else {
      setSelectedEmployees(prev => prev.filter(empId => empId !== id));
    }
  };

  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      toast({ title: "Error", description: "Please select at least one employee.", variant: "destructive" });
      return;
    }

    const payload = {
      ...attendanceData,
      attendance_date: attendanceDate,
      records: selectedEmployees.map(id => ({ employee_id: id })),
      punch_in_local: punchoutOnly ? undefined : attendanceData.punch_in_local ? `${attendanceDate} ${attendanceData.punch_in_local}:00` : undefined,
      punch_out_local: attendanceData.punch_out_local ? `${attendanceDate} ${attendanceData.punch_out_local}:00` : undefined,
    };

    try {
      await bulkCreateAttendance(payload);
      toast({ title: "Success", description: "Bulk attendance has been recorded." });
      onSuccess();
      // ✅ Reset fields after success
      setSelectedShiftId("");
      setAttendanceDate(format(new Date(), 'yyyy-MM-dd'));
      setEmployees([]);
      setSelectedEmployees([]);
      setPunchoutOnly(false);
      setAttendanceData({
        reason: "",
        punch_in_local: "",
        punch_out_local: "",
        timezone: localStorage.getItem("selectedTimezone") || "UTC",
        is_late: false,
        is_early_departure: false,
        status: "Present",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to record bulk attendance: ${error.message}`, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✅ wider & responsive */}
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Attendance Management</DialogTitle>
          <DialogDescription>
            Record attendance for multiple users in a single shift.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 items-end">
          <div>
            <Label>Shift</Label>
            <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Attendance Date</Label>
            <Input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} max={today} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="punchout-only" checked={punchoutOnly} onCheckedChange={(checked) => handlePunchoutOnlyChange(checked as boolean)} />
            <Label htmlFor="punchout-only" className="font-medium">Punch-out Only</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Attendance Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label>Reason</Label><Input value={attendanceData.reason} onChange={e => setAttendanceData({ ...attendanceData, reason: e.target.value })} placeholder="e.g., Morning Shift Punch In" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Punch In</Label><Input type="time" value={attendanceData.punch_in_local} onChange={e => setAttendanceData({ ...attendanceData, punch_in_local: e.target.value })} disabled={punchoutOnly} /></div>
                  <div><Label>Punch Out</Label><Input type="time" value={attendanceData.punch_out_local} onChange={e => setAttendanceData({ ...attendanceData, punch_out_local: e.target.value })} /></div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={attendanceData.status} onValueChange={value => setAttendanceData({ ...attendanceData, status: value })} disabled={punchoutOnly}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                      <SelectItem value="Leave">Leave</SelectItem>
                      <SelectItem value="Half-Day">Half-Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Switch checked={attendanceData.is_late} onCheckedChange={c => setAttendanceData({ ...attendanceData, is_late: c })} disabled={punchoutOnly} /><Label>Mark as Late</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={attendanceData.is_early_departure} onCheckedChange={c => setAttendanceData({ ...attendanceData, is_early_departure: c })} /><Label>Mark as Early Departure</Label></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Select Employees ({selectedEmployees.length}/{employees.length})</CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox onCheckedChange={(checked) => handleSelectAll(checked as boolean)} /><Label>Select All</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {isLoading ? <p>Loading...</p> :
                    <Table>
                      <TableBody>
                        {employees.map(emp => (
                          <TableRow key={emp.id}>
                            <TableCell>
                              <Checkbox checked={selectedEmployees.includes(emp.id)} onCheckedChange={c => handleSelectEmployee(emp.id, !!c)} />
                            </TableCell>
                            <TableCell>{emp.first_name} {emp.last_name} ({emp.full_employee_id})</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  }
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Attendance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
