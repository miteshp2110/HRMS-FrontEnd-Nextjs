"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  bulkCreateAttendance,
  getUserWithUnmarkedAttendance,
  type Shift,
  type UserByShift,
} from "@/lib/api";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";
import { convertUTCToTimeZone } from "@/lib/formatter";

interface BulkAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shifts: Shift[];
  onSuccess: () => void;
}

export function BulkAttendanceDialog({
  open,
  onOpenChange,
  shifts,
  onSuccess,
}: BulkAttendanceDialogProps) {
  const { toast } = useToast();
  const [selectedShiftId, setSelectedShiftId] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [employees, setEmployees] = useState<UserByShift[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [shiftDetails, setShiftDetails] = useState<Shift | undefined>(); // CHANGED: Initial state can be undefined
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");
  const [punchoutOnly, setPunchoutOnly] = useState(false);
  const tz = localStorage.getItem("selectedTimezone") ?? "UTC";

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
      getUserWithUnmarkedAttendance(
        parseInt(selectedShiftId),
        attendanceDate,
        punchoutOnly
      )
        .then((emps) => {
          setEmployees(emps);
          setSelectedEmployees([]);
        })
        .catch(() => {
          toast({
            title: "Error",
            description:
              "Could not fetch employees for the selected shift and date.",
            variant: "destructive",
          });
          setEmployees([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setEmployees([]);
      setSelectedEmployees([]);
    }
  }, [selectedShiftId, attendanceDate, punchoutOnly, toast]);

  const handlePunchoutOnlyChange = (checked: boolean) => {
    setPunchoutOnly(checked);
    if (checked) {
      setAttendanceData((prev) => ({
        ...prev,
        punch_in_local: "",
        is_late: false,
        status: "Present",
      }));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedEmployees(checked ? employees.map((e) => e.id) : []);
  };

  const handleSelectEmployee = (id: number, checked: boolean) => {
    setSelectedEmployees((prev) =>
      checked ? [...prev, id] : prev.filter((emp) => emp !== id)
    );
  };

  const handleSubmit = async () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one employee.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...attendanceData,
      attendance_date: attendanceDate,
      records: selectedEmployees.map((id) => ({ employee_id: id })),
      punch_in_local: punchoutOnly
        ? undefined
        : attendanceData.punch_in_local
        ? `${attendanceDate} ${attendanceData.punch_in_local}:00`
        : undefined,
      punch_out_local: attendanceData.punch_out_local
        ? `${attendanceDate} ${attendanceData.punch_out_local}:00`
        : undefined,
    };

    setIsSubmitting(true);
    try {
      await bulkCreateAttendance(payload);
      toast({
        title: "Success",
        description: "Bulk attendance has been recorded.",
      });
      onSuccess();
      setSelectedShiftId("");
      setAttendanceDate(format(new Date(), "yyyy-MM-dd"));
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
      toast({
        title: "Error",
        description: `Failed to record bulk attendance: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // CHANGED: Simplified logic to get shift details from the existing 'shifts' prop
  useEffect(() => {
    if (selectedShiftId) {
      const currentShift = shifts.find((s) => String(s.id) === selectedShiftId);
      setShiftDetails(currentShift);
    } else {
      setShiftDetails(undefined);
    }
  }, [selectedShiftId, shifts]);

  // ADDED: This effect synchronizes the attendanceData state with shiftDetails
  useEffect(() => {
    if (shiftDetails) {
      const timezone = localStorage.getItem("selectedTimezone") ?? "UTC";
      const punchInTime = convertUTCToTimeZone(
        shiftDetails.from_time,
        timezone
      );
      const punchOutTime = convertUTCToTimeZone(shiftDetails.to_time, timezone);

      setAttendanceData((prev) => ({
        ...prev,
        punch_in_local: punchInTime,
        punch_out_local: punchOutTime,
      }));
    } else {
      // Optionally clear times when no shift is selected
      setAttendanceData((prev) => ({
        ...prev,
        punch_in_local: "",
        punch_out_local: "",
      }));
    }
  }, [shiftDetails]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Attendance Management</DialogTitle>
          <DialogDescription>
            Record attendance for multiple users in a single shift.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
              <Label>Timezone</Label>
              <div className="flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
                <span className="truncate">{tz}</span>
                <button
                  type="button"
                  className="text-xs text-foreground/70 hover:text-foreground"
                  onClick={() => {
                    // Display-only: keep as is. If needed, implement a picker here.
                  }}
                >
                  Current
                </button>
              </div>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 items-end">
          
          <div>
            <Label>Shift</Label>
            <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a shift" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Attendance Date</Label>
            <Input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              max={today}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="punchout-only"
              checked={punchoutOnly}
              onCheckedChange={(c) => handlePunchoutOnlyChange(c as boolean)}
            />
            <Label htmlFor="punchout-only" className="font-medium">
              Punch-out Only
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Attendance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Reason</Label>
                  <Input
                    value={attendanceData.reason}
                    onChange={(e) =>
                      setAttendanceData({
                        ...attendanceData,
                        reason: e.target.value,
                      })
                    }
                    placeholder="e.g., Morning Shift Punch In"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Punch In </Label>
                    <Input
                      type="time"
                      // CHANGED: Value is now bound to attendanceData state
                      value={attendanceData.punch_in_local}
                      onChange={(e) =>
                        setAttendanceData({
                          ...attendanceData,
                          punch_in_local: e.target.value,
                        })
                      }
                      disabled={punchoutOnly}
                    />
                  </div>
                  <div>
                    <Label>Punch Out</Label>
                    <Input
                      type="time"
                      // CHANGED: Value is now bound to attendanceData state
                      value={attendanceData.punch_out_local}
                      onChange={(e) =>
                        setAttendanceData({
                          ...attendanceData,
                          punch_out_local: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={attendanceData.status}
                    onValueChange={(v) =>
                      setAttendanceData({ ...attendanceData, status: v })
                    }
                    disabled={punchoutOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                      <SelectItem value="Leave">Leave</SelectItem>
                      <SelectItem value="Half-Day">Half-Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={attendanceData.is_late}
                      onCheckedChange={(c) =>
                        setAttendanceData({ ...attendanceData, is_late: c })
                      }
                      disabled={punchoutOnly}
                    />
                    <Label>Mark as Late</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={attendanceData.is_early_departure}
                      onCheckedChange={(c) =>
                        setAttendanceData({
                          ...attendanceData,
                          is_early_departure: c,
                        })
                      }
                    />
                    <Label>Mark as Early Departure</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Select Employees ({selectedEmployees.length}/
                    {employees.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        employees.length > 0 &&
                        selectedEmployees.length === employees.length
                      }
                      onCheckedChange={(c) => handleSelectAll(c as boolean)}
                    />
                    <Label>Select All</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="py-2">
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))
                  ) : (
                    <Table>
                      <TableBody>
                        {employees.map((emp) => (
                          <TableRow key={emp.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedEmployees.includes(emp.id)}
                                onCheckedChange={(c) =>
                                  handleSelectEmployee(emp.id, !!c)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {emp.first_name} {emp.last_name} (
                              {emp.full_employee_id})
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
            Save Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
