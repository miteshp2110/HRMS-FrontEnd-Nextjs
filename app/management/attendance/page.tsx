"use client";
import { DateTime, Zone } from "luxon";
import type React from "react";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { MainLayout } from "@/components/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  ClipboardList,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Timer,
  LogOut,
  Plus,
  CalendarDays,
  BarChart,
  TrendingDown,
  User,
  Eye,
  CheckCircle2,
  X,
  AlertTriangle,
  Info,
  Loader2,
  HistoryIcon,
  Upload,
} from "lucide-react";
import Link from "next/link";
import {
  getAllAttendance,
  getShifts,
  searchUsers,
  getOvertimeApprovals,
  processOvertimeRequest,
  getAttendanceRecordById,
  getAttendanceSummary,
  punchIn,
  punchOut,
  type AttendanceRecord,
  type OvertimeRecord,
  type AttendanceSummary,
  type Shift,
  type UserProfile,
  getHolidays,
  updateAttendanceRecord,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BulkAttendanceDialog } from "@/components/management/bulk-attendance-dialog";
import { AttendanceAuditDialog } from "@/components/management/attendance-audit-dialog";
import { isObject } from "framer-motion";
import { BulkUploadAttendanceDialog } from "@/components/management/bulk-attendace-upload";

function formatUtcTimeToZone(timeString: string | undefined, timeZone: string) {
  if (timeString !== undefined) {
    const utcDate = new Date(timeString);
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(utcDate);
  }
}

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
];

/**
 * Lightweight skeleton components (no external import) for fast-loading placeholders
 */
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

const TableSkeleton = ({ rows = 6 }: { rows?: number }) => (
  <div className="space-y-2">
    <div className="grid grid-cols-7 gap-3 px-2">
      <Skeleton className="h-4 col-span-2" />
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-7 gap-3 items-center px-2">
          <Skeleton className="h-4 col-span-2" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-8 rounded-md" />
        </div>
      ))}
    </div>
  </div>
);

// =========================== Employee Summary Dialog ===========================
const EmployeeSummaryDialog = ({
  open,
  onOpenChange,
  employee,
  filters,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: UserProfile | null;
  filters: any;
}) => {
  const { toast } = useToast();
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && employee && filters.filterMode === "month") {
      setLoading(true);
      getAttendanceSummary(
        employee.id,
        Number.parseInt(filters.year),
        Number.parseInt(filters.month)
      )
        .then(setSummary)
        .catch((error) => {
          toast({
            title: "Error",
            description: `Failed to load summary: ${error.message}`,
            variant: "destructive",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [open, employee, filters, toast]);

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {employee.first_name} {employee.last_name} - Monthly Summary
          </DialogTitle>
          <DialogDescription>
            Summary for {filters.year}-{filters.month.padStart(2, "0")}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-6">
            <TableSkeleton rows={4} />
          </div>
        ) : summary ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-3">
                <div className="text-2xl font-bold text-green-600">
                  {summary.present_days}
                </div>
                <p className="text-sm text-muted-foreground">Present Days</p>
              </Card>
              <Card className="p-3">
                <div className="text-2xl font-bold text-red-600">
                  {summary.absent_days}
                </div>
                <p className="text-sm text-muted-foreground">Absent Days</p>
              </Card>
              <Card className="p-3">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.leave_days}
                </div>
                <p className="text-sm text-muted-foreground">Leave Days</p>
              </Card>
              <Card className="p-3">
                <div className="text-2xl font-bold text-orange-600">
                  {summary.half_days}
                </div>
                <p className="text-sm text-muted-foreground">Half Days</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Working Hours
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Hours:</span>
                    <span className="font-medium">
                      {summary.total_hours_worked} hrs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Short Hours:</span>
                    <span className="font-medium text-red-600">
                      {summary.total_short_hours} hrs
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Overtime Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Requested:</span>
                    <span className="font-medium text-blue-600">
                      {summary.overtime.requested} hrs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved:</span>
                    <span className="font-medium text-green-600">
                      {summary.overtime.approved} hrs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rejected:</span>
                    <span className="font-medium text-red-600">
                      {summary.overtime.rejected} hrs
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Attendance Issues
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span>Late Days:</span>
                  <span className="font-medium text-yellow-600">
                    {summary.late_days}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Early Departures:</span>
                  <span className="font-medium text-orange-600">
                    {summary.early_departures}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>No summary data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// =========================== Overtime Process Dialog ===========================
const OvertimeProcessDialog = ({
  open,
  onOpenChange,
  overtime,
  onProcessSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overtime: OvertimeRecord | null;
  onProcessSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [action, setAction] = useState<"approved" | "rejected">("approved");
  const [approvedHours, setApprovedHours] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [attendanceRecord, setAttendanceRecord] =
    useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // button loader

  useEffect(() => {
    if (open && overtime) {
      setApprovedHours(overtime.overtime_hours);
      setRejectionReason("");
      setAction("approved");

      if (overtime.attendance_record_id) {
        setLoading(true);
        getAttendanceRecordById(overtime.attendance_record_id)
          .then(setAttendanceRecord)
          .catch(() => setAttendanceRecord(null))
          .finally(() => setLoading(false));
      } else {
        setAttendanceRecord(null);
      }
    }
  }, [open, overtime]);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overtime) return;

    try {
      setSubmitting(true);
      const data: any = { status: action };
      if (action === "approved") {
        data.approved_hours = Number.parseFloat(approvedHours);
      } else {
        data.rejection_reason = rejectionReason;
      }

      await processOvertimeRequest(overtime.id, data);
      toast({
        title: "Success",
        description: `Overtime request has been ${action}.`,
      });
      onOpenChange(false);
      onProcessSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to process request: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!overtime) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-x-scroll">
        <DialogHeader>
          <DialogTitle>Process Overtime Request</DialogTitle>
          <DialogDescription>
            Review and process overtime request for {overtime.employee_name}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-4">
            <TableSkeleton rows={3} />
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Overtime Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Request Date:</span>
                  <p>{new Date(overtime.request_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="capitalize">{overtime.overtime_type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Start Time:</span>
                  <p>
                    {formatUtcTimeToZone(
                      overtime.overtime_start,
                      localStorage.getItem("selectedTimezone") ?? "UTC"
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">End Time:</span>
                  <p>
                    {formatUtcTimeToZone(
                      overtime.overtime_end,
                      localStorage.getItem("selectedTimezone") ?? "UTC"
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Requested Hours:
                  </span>
                  <p className="font-medium">{overtime.overtime_hours} hrs</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Record Type:</span>
                  <p>
                    {overtime.attendance_record_id
                      ? "Shift Extension"
                      : "Additional Work"}
                  </p>
                </div>
              </div>
            </Card>

            {attendanceRecord && (
              <Card className="p-4">
                <h4 className="font-semibold mb-3">
                  Related Attendance Record
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p>
                      {new Date(
                        attendanceRecord.attendance_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      className={
                        attendanceRecord.attendance_status === "Present"
                          ? "bg-green-100 text-green-800"
                          : attendanceRecord.attendance_status === "Half-Day"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {attendanceRecord.attendance_status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hours Worked:</span>
                    <p>{attendanceRecord.hours_worked} hrs</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Flags:</span>
                    <div className="flex gap-1">
                      {attendanceRecord.is_late === 1 && (
                        <Badge variant="secondary" className="text-xs">
                          Late
                        </Badge>
                      )}
                      {attendanceRecord.is_early_departure === 1 && (
                        <Badge variant="secondary" className="text-xs">
                          Early
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <form onSubmit={handleProcess} className="space-y-4">
              <div className="space-y-3">
                <Label>Action</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                      action === "approved"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-background border-muted"
                    }`}
                    onClick={() => setAction("approved")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                      action === "rejected"
                        ? "bg-red-50 border-red-200 text-red-800"
                        : "bg-background border-muted"
                    }`}
                    onClick={() => setAction("rejected")}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>

              {action === "approved" ? (
                <div className="space-y-2">
                  <Label htmlFor="approved-hours">Approved Hours</Label>
                  <Input
                    id="approved-hours"
                    type="number"
                    step="0.25"
                    value={approvedHours}
                    onChange={(e) => setApprovedHours(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="rejection-reason">Rejection Reason</Label>
                  <Textarea
                    id="rejection-reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    required
                  />
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={
                    action === "approved"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {action === "approved" ? "Approving..." : "Rejecting..."}
                    </>
                  ) : action === "approved" ? (
                    "Approve Request"
                  ) : (
                    "Reject Request"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ============================= Punch In Dialog =============================
const PunchInDialog = ({
  open,
  onOpenChange,
  onPunchInSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPunchInSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [debouncedEmployeeSearch, setDebouncedEmployeeSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEmployeePopoverOpen, setIsEmployeePopoverOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Kolkata");
  const [punchInTime, setPunchInTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 8);
  });
  const [punchInDate, setPunchInDate] = useState<string>();
  const [submitting, setSubmitting] = useState(false); // button loader

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedEmployeeSearch(employeeSearch),
      500
    );
    return () => clearTimeout(handler);
  }, [employeeSearch]);

  useEffect(() => {
    if (debouncedEmployeeSearch) {
      setIsSearching(true);
      searchUsers(debouncedEmployeeSearch)
        .then(setSearchedUsers)
        .finally(() => setIsSearching(false));
    } else {
      setSearchedUsers([]);
    }
  }, [debouncedEmployeeSearch]);

  const handlePunchIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select an employee.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const timeLocal = `${punchInDate} ${punchInTime}`;
      await punchIn(
        timeLocal,
        localStorage.getItem("selectedTimezone") ?? "UTC",
        selectedUser.id
      );

      toast({
        title: "Success",
        description: `${selectedUser.first_name} ${selectedUser.last_name} has been punched in successfully.`,
      });
      onOpenChange(false);
      onPunchInSuccess();

      setSelectedUser(null);
      setEmployeeSearch("");
      setPunchInTime(new Date().toTimeString().slice(0, 8));
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to punch in: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Punch In Employee</DialogTitle>
          <DialogDescription>
            Record punch-in time for an employee.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePunchIn} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Popover
              open={isEmployeePopoverOpen}
              onOpenChange={setIsEmployeePopoverOpen}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {selectedUser
                    ? `${selectedUser.first_name} ${selectedUser.last_name}`
                    : "Select employee..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                  <CommandInput
                    placeholder="Search employee..."
                    onValueChange={setEmployeeSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isSearching ? "Searching..." : "No employee found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {searchedUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.first_name} ${user.last_name}`}
                          onSelect={() => {
                            setSelectedUser(user);
                            setIsEmployeePopoverOpen(false);
                          }}
                        >
                          {user.first_name} {user.last_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={punchInDate}
              onChange={(e) => setPunchInDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Punch In Time</Label>
            <Input
              type="time"
              step="1"
              value={punchInTime}
              onChange={(e) => setPunchInTime(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} aria-busy={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Punching In...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Punch In
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ============================ Punch Out Dialog ============================
const PunchOutDialog = ({
  open,
  onOpenChange,
  record,
  onPunchOutSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AttendanceRecord | null;
  onPunchOutSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Kolkata");
  const [punchOutDate, setPunchOutDate] = useState<string>(
    record ? new Date(record?.attendance_date!).toISOString().split("T")[0] : ""
  );
  const [punchOutTime, setPunchOutTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 8);
  });
  const [submitting, setSubmitting] = useState(false); // button loader

  const handlePunchOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;

    try {
      setSubmitting(true);
      const timeLocal = `${punchOutDate} ${punchOutTime}`;
      await punchOut(
        timeLocal,
        localStorage.getItem("selectedTimezone") ?? "UTC",
        record.employee_id
      );

      toast({
        title: "Success",
        description: `${record.first_name} ${record.last_name} has been punched out successfully.`,
      });
      onOpenChange(false);
      onPunchOutSuccess();

      setPunchOutTime(new Date().toTimeString().slice(0, 8));
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to punch out: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Punch Out Employee</DialogTitle>
          <DialogDescription>
            Record punch-out time for {record?.first_name} {record?.last_name}{" "}
            on{" "}
            {record
              ? new Date(record.attendance_date).toLocaleDateString()
              : ""}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePunchOut} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={punchOutDate}
              onChange={(e) => setPunchOutDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Punch Out Time</Label>
            <Input
              type="time"
              step="1"
              value={punchOutTime}
              onChange={(e) => setPunchOutTime(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} aria-busy={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Punching Out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Punch Out
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ============================ Edit Attendance Dialog ============================
// const EditAttendanceDialog = ({
//   open,
//   onOpenChange,
//   record,
//   onSuccess,
// }: {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   record: AttendanceRecord | null
//   onSuccess: () => void
// }) => {
//   const { toast } = useToast()
//   const [formData, setFormData] = useState({
//     punch_in: "",
//     punch_out: "",
//     attendance_status: "Present",
//     notes: "",
//   })
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (record) {

//       const formatForInput = (isoString: string | null) => {
//         if (!isoString) return ""
//         try {

//           return DateTime.fromISO(isoString).toFormat("yyyy-MM-dd'T'HH:mm")
//         } catch (error) {
//           console.error("Error formatting date for input:", error)
//           return ""
//         }
//       }

//       setFormData({
//         punch_in: formatForInput(record.punch_in),
//         punch_out: formatForInput(record.punch_out),
//         attendance_status: record.attendance_status,
//         notes: "",
//       })
//     }
//   }, [record])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//   const { id, value } = e.target;

//   setFormData((prev) => {
//     // if this is a time input and the previous value contains a date (e.g. "2025-12-01T09:30")
//     if ((id === "punch_in" || id === "punch_out") && prev[id]?.includes("T")) {
//       const datePart = prev[id].split("T")[0]; // "2025-12-01"
//       return { ...prev, [id]: `${datePart}T${value}` }; // preserve full datetime
//     }

//     // otherwise, just update normally
//     return { ...prev, [id]: value };
//   });
// };

//   const handleStatusChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, attendance_status: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!record) return
//     setLoading(true)

//     try {

//       await updateAttendanceRecord(record.id, {
//         punch_in: formData.punch_in,
//         punch_out: formData.punch_out,
//         attendance_status: formData.attendance_status,
//         update_reason: formData.notes,
//         timezone: localStorage.getItem("selectedTimezone") ?? "UTC",
//       })

//       toast({
//         title: "Success",
//         description: "Attendance record updated successfully.",
//       })
//       onSuccess()
//       onOpenChange(false)
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: `Failed to update record: ${error.message}`,
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (!record) return null

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit Attendance Record</DialogTitle>
//           <DialogDescription>
//             Modify details for {record.first_name} {record.last_name} on{" "}
//             {new Date(record.attendance_date).toLocaleDateString()}.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="attendance_status">Attendance Status</Label>
//             <Select value={formData.attendance_status} onValueChange={handleStatusChange}>
//               <SelectTrigger id="attendance_status">
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Present">Present</SelectItem>
//                 <SelectItem value="Absent">Absent</SelectItem>
//                 <SelectItem value="Leave">Leave</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="punch_in">Punch In</Label>
//               <Input
//                 disabled={formData.attendance_status !== "Present"}
//                 id="punch_in"
//                 type="time"
//                 defaultValue={
//                   formatUtcTimeToZone(record.punch_in!, localStorage.getItem("selectedTimezone") ?? "Utc") ?? ""
//                 }
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="punch_out">Punch Out</Label>
//               <Input
//                 disabled={formData.attendance_status !== "Present"}
//                 id="punch_out"
//                 type="time"
//                 defaultValue={
//                   formatUtcTimeToZone(record.punch_out!, localStorage.getItem("selectedTimezone") ?? "Utc") ?? ""
//                 }
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="notes">Reason for Change (Notes)</Label>
//             <Textarea
//               id="notes"
//               placeholder="e.g., Correcting manual entry error."
//               value={formData.notes}
//               onChange={handleChange}
//             />
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading} aria-busy={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

const EditAttendanceDialog = ({
  open,
  onOpenChange,
  record,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AttendanceRecord | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    punch_in: "",
    punch_out: "",
    attendance_status: "Present",
    notes: "",
  });
  const [originalData, setOriginalData] = useState({
    punch_in: "",
    punch_out: "",
    attendance_status: "Present",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      const formatForInput = (isoString: string | null) => {
        if (!isoString) return "";
        try {
          return DateTime.fromISO(isoString, { zone: "utc" }) // interpret stored value as UTC
            .setZone(localStorage.getItem('selectedTimezone')??'UTC') // convert to target timezone
            .toFormat("yyyy-MM-dd'T'HH:mm");
        } catch (error) {
          console.error("Error formatting date for input:", error);
          return "";
        }
      };

      const initialData = {
        punch_in: formatForInput(record.punch_in),
        punch_out: formatForInput(record.punch_out),
        attendance_status: record.attendance_status,
      };

      // Store both form data and original data for comparison
      setFormData({
        ...initialData,
        notes: "",
      });
      setOriginalData(initialData);
    }
  }, [record]);

  const handleTimeChange = (
    field: "punch_in" | "punch_out",
    timeValue: string
  ) => {
    setFormData((prev) => {
      // Get the date part from the existing datetime value
      const datePart =
        prev[field]?.split("T")[0] ||
        record?.attendance_date?.split("T")[0] ||
        "";
      // Combine with new time
      const newValue = datePart ? `${datePart}T${timeValue}` : timeValue;
      return { ...prev, [field]: newValue };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, attendance_status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;

    // Validate notes (required)
    if (!formData.notes.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for the change.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Build update payload with only changed fields
      const updatePayload: {
        timezone: string;
        attendance_status: string;
        punch_in?: string;
        punch_out?: string;
        update_reason: string;
      } = {
        // Always include timezone, attendance_status, and update_reason
        timezone: localStorage.getItem("selectedTimezone") ?? "UTC",
        attendance_status: formData.attendance_status,
        update_reason: formData.notes, // Required field
      };

      // Only include punch_in if it was changed
      if (formData.punch_in && formData.punch_in !== originalData.punch_in) {
        updatePayload.punch_in = formData.punch_in;
      }

      // Only include punch_out if it was changed
      if (formData.punch_out && formData.punch_out !== originalData.punch_out) {
        updatePayload.punch_out = formData.punch_out;
      }

      // console.log("Update payload:", updatePayload); // Debug log

      await updateAttendanceRecord(record.id, updatePayload);

      toast({
        title: "Success",
        description: "Attendance record updated successfully.",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update record: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  // Extract time from datetime for display
  const getTimeValue = (datetime: string) => {
    if (!datetime) return "";
    const timePart = datetime.split("T")[1];
    return timePart ? timePart.substring(0, 5) : ""; // Get HH:mm
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Attendance Record</DialogTitle>
          <DialogDescription>
            Modify details for {record.first_name} {record.last_name} on{" "}
            {new Date(record.attendance_date).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="attendance_status">Attendance Status</Label>
            <Select
              value={formData.attendance_status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="attendance_status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Leave">Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="punch_in">Punch In</Label>
              <Input
                disabled={formData.attendance_status !== "Present"}
                id="punch_in"
                type="time"
                value={getTimeValue(formData.punch_in)}
                onChange={(e) => handleTimeChange("punch_in", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="punch_out">Punch Out</Label>
              <Input
                disabled={formData.attendance_status !== "Present"}
                id="punch_out"
                type="time"
                value={getTimeValue(formData.punch_out)}
                onChange={(e) => handleTimeChange("punch_out", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Reason for Change (Notes) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="e.g., Correcting manual entry error."
              value={formData.notes}
              onChange={handleChange}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


// ============================= Page =============================
export default function AttendanceRecordsPage() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  const [isPunchInDialogOpen, setIsPunchInDialogOpen] = useState(false);
  const [isPunchOutDialogOpen, setIsPunchOutDialogOpen] = useState(false);
  const [isOvertimeDialogOpen, setIsOvertimeDialogOpen] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(
    null
  );
  const [selectedOvertime, setSelectedOvertime] =
    useState<OvertimeRecord | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [debouncedEmployeeSearch, setDebouncedEmployeeSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(
    null
  );
  const [holidays, setHolidays] = useState<Map<any, any>>();
  const [isBulkAttendanceOpen, setIsBulkAttendanceOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const [apiFilters, setApiFilters] = useState({
    date: new Date().toISOString().split("T")[0],
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
    filterMode: "date" as "date" | "month",
    employee_id: undefined as number | undefined,
    shift_id: undefined as number | undefined,
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [overtimeLoading, setOvertimeLoading] = useState(false); // overtime skeleton control

  const canManageAttendance = hasPermission("attendance.manage");

  const holidaysMap = () => {
    const holidayMap = new Map();
    getHolidays(
      apiFilters.filterMode === "date"
        ? new Date(apiFilters.date).getFullYear()
        : Number.parseInt(apiFilters.year)
    ).then((data) => {
      data.forEach((holiday) => {
        holidayMap.set(
          new Date(holiday.holiday_date).toISOString().split("T")[0],
          holiday.name
        );
      });
    });
    setHolidays(holidayMap);
  };

  const onUploadSuccess = ()=>{
    setUploadDialogOpen(false)
    fetchRecords()
  }

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedEmployeeSearch(employeeSearch),
      500
    );
    return () => clearTimeout(handler);
  }, [employeeSearch]);

  useEffect(() => {
    if (debouncedEmployeeSearch) {
      setIsSearching(true);
      searchUsers(debouncedEmployeeSearch)
        .then(setSearchedUsers)
        .finally(() => setIsSearching(false));
    } else {
      setSearchedUsers([]);
    }
  }, [debouncedEmployeeSearch]);

  useEffect(() => {
    const savedTimezone =
      localStorage.getItem("selectedTimezone") ||
      localStorage.getItem("attendanceTimezone") ||
      "UTC"; // read both keys
    if (savedTimezone && timezones.includes(savedTimezone)) {
      setSelectedTimezone(savedTimezone);
    } else {
      setSelectedTimezone("UTC");
    }

    if (canManageAttendance) {
      getShifts()
        .then((shiftsData) => {
          setShifts(shiftsData);
          if (shiftsData.length > 0 && !apiFilters.shift_id) {
            setApiFilters((f) => ({ ...f, shift_id: shiftsData[0].id }));
          }
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: `Failed to load shifts: ${error.message}`,
            variant: "destructive",
          });
        });
    }
  }, [canManageAttendance, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedTimezone) {
      localStorage.setItem("attendanceTimezone", selectedTimezone);
      localStorage.setItem("selectedTimezone", selectedTimezone);
    }
  }, [selectedTimezone]);

  const fetchRecords = useCallback(
    async (isLoadMore = false) => {
      if (!canManageAttendance) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const currentPage = isLoadMore ? page + 1 : 1;
      const params: any = { page: currentPage, limit: 250, ...apiFilters };
      if (apiFilters.filterMode === "date") {
        delete params.month;
        delete params.year;
      } else {
        delete params.date;
      }

      try {
        const data = await getAllAttendance(params);
        setHasMore(data.length === 250);
        setAllRecords((prev) => (isLoadMore ? [...prev, ...data] : data));
        if (isLoadMore) setPage(currentPage);
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Could not fetch attendance records: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [canManageAttendance, apiFilters, page, toast]
  );

  const fetchOvertimeRecords = useCallback(async () => {
    if (!canManageAttendance) return;

    try {
      setOvertimeLoading(true);
      let data;
      if (apiFilters.employee_id != undefined) {
        data = await getOvertimeApprovals(apiFilters.employee_id);
      } else {
        data = await getOvertimeApprovals();
      }
      setOvertimeRecords(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Could not fetch overtime records: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setOvertimeLoading(false);
    }
  }, [canManageAttendance, toast, apiFilters]);

  useEffect(() => {
    setAllRecords([]);
    setPage(1);
    fetchRecords();
    fetchOvertimeRecords();
    holidaysMap();
  }, [apiFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const pendingOvertimeRecords = useMemo(
    () => overtimeRecords.filter((r) => r.status === "pending_approval"),
    [overtimeRecords]
  );

  const noPunchOutRecords = useMemo(
    () =>
      allRecords.filter(
        (r) =>
          !r.punch_out &&
          (r.attendance_status === "Present" ||
            r.attendance_status === "Half-Day")
      ),
    [allRecords]
  );

  const metrics = useMemo(
    () =>
      allRecords.reduce(
        (acc, record) => {
          acc[record.attendance_status] =
            (acc[record.attendance_status] || 0) + 1;
          if (record.is_late === 1) acc.late_count++;
          if (record.is_early_departure === 1) acc.early_departure_count++;
          if (
            record.overtime_hours &&
            Number.parseFloat(record.overtime_hours) > 0
          ) {
            acc.overtime_requests++;
            if (record.overtime_status === "pending_approval")
              acc.pending_overtime++;
          }
          return acc;
        },
        {
          Present: 0,
          Absent: 0,
          Leave: 0,
          "Half-Day": 0,
          late_count: 0,
          early_departure_count: 0,
          overtime_requests: 0,
          pending_overtime: 0,
        } as Record<string, number>
      ),
    [allRecords]
  );

  const handlePunchOutClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsPunchOutDialogOpen(true);
  };

  const handleOvertimeClick = (overtime: OvertimeRecord) => {
    setSelectedOvertime(overtime);
    setIsOvertimeDialogOpen(true);
  };

  const handleEditClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleViewSummary = (employee: UserProfile) => {
    setSelectedEmployee(employee);
    setIsSummaryDialogOpen(true);
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    return new Date(timeString).toLocaleTimeString("en-US", {
      timeZone: selectedTimezone!,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (
    status: string,
    isLate = false,
    isEarlyDeparture = false,
    isHoliday = false,
    holiday_name = ""
  ) => {
    let className = "";
    let icon = CheckCircle;

    switch (status) {
      case "Present":
        className = "bg-green-100 text-green-800";
        icon = CheckCircle;
        break;
      case "Half-Day":
        className = "bg-orange-100 text-orange-800";
        icon = BarChart;
        break;
      case "Absent":
        className = "bg-red-100 text-red-800";
        icon = XCircle;
        break;
      case "Leave":
        className = "bg-blue-100 text-blue-800";
        icon = CalendarDays;
        break;
      default:
        className = "bg-gray-100 text-gray-800";
        icon = Clock;
    }

    const Icon = icon;
    return (
      <div className="flex items-center gap-1 flex-wrap">
        <Badge className={className}>
          <Icon className="h-3 w-3 mr-1" />
          {status}
        </Badge>
        {isLate && (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Late
          </Badge>
        )}
        {isEarlyDeparture && (
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-800 text-xs"
          >
            <TrendingDown className="h-3 w-3 mr-1" />
            Early
          </Badge>
        )}
        {isHoliday && (
          <div className="flex items-center gap-1">
            <Badge
              variant="secondary"
              className="bg-purple-300 text-black text-xs"
            >
              <Icon className="h-3 w-3 mr-1" />
              Holiday
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-foreground/70 hover:text-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="text-sm">
                  {holiday_name || "No holiday name provided"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    );
  };

  const getOvertimeBadge = (
    overtime_hours: string | null,
    overtime_status: string | null,
    overtime_processed_by = "",
    rejection_reason = ""
  ) => {
    if (!overtime_hours || Number.parseFloat(overtime_hours) <= 0) return null;

    let className = "";
    let label = "";

    switch (overtime_status) {
      case "pending_approval":
        className = "bg-yellow-100 text-yellow-800 border-yellow-200";
        label = "Pending";
        break;
      case "approved":
        className = "bg-green-100 text-green-800 border-green-200";
        label = "Approved";
        break;
      case "rejected":
        className = "bg-red-100 text-red-800 border-red-200";
        label = "Rejected";
        break;
      default:
        className = "bg-blue-100 text-blue-800 border-blue-200";
        label = "Overtime";
    }

    return (
      <div className="flex items-center gap-1">
        <Badge
          className={`${className} border cursor-pointer hover:opacity-80`}
        >
          <Timer className="h-3 w-3 mr-1" />
          {Number.parseFloat(overtime_hours).toFixed(2)}h {label}
        </Badge>
        {label !== "Pending" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-foreground/70 hover:text-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="text-sm whitespace-pre-line">
                {label === "Approved"
                  ? `Approved By : ${overtime_processed_by}`
                  : `${rejection_reason}\nBy:- ${overtime_processed_by}`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  const renderAttendanceTable = (recordsToRender: AttendanceRecord[]) => {
    if (loading && recordsToRender.length === 0) {
      return <TableSkeleton rows={8} />;
    }

    if (recordsToRender.length === 0 && !loading) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <ClipboardList className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Records Found</h3>
          <p>There are no attendance records matching the current criteria.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Timings ({selectedTimezone})</TableHead>
              <TableHead>Hours Worked</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Overtime</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recordsToRender.map((record) => {
              const isNoPunchOut = !record.punch_out;
              const overtimeBadge = getOvertimeBadge(
                record.overtime_hours,
                record.overtime_status,
                record.overtime_processed_by,
                record.rejection_reason
              );

              return (
                <TableRow
                  key={record.id}
                  className="hover:bg-accent/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/directory/${record.employee_id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {record.first_name} {record.last_name}
                      </Link>
                      {apiFilters.filterMode === "month" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            handleViewSummary({
                              id: record.employee_id,
                              first_name: record.first_name,
                              last_name: record.last_name,
                            } as UserProfile)
                          }
                          aria-label="View monthly summary"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(record.attendance_date)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>
                        {formatTime(record.punch_in)} /{" "}
                        {formatTime(record.punch_out)}
                      </div>
                      {isNoPunchOut && (
                        <Badge variant="secondary" className="text-xs">
                          No Punch Out
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {Number.parseFloat(record.hours_worked || "0").toFixed(
                          2
                        )}{" "}
                        hrs
                      </div>
                      {record.short_hours &&
                        Number.parseFloat(record.short_hours) > 0 && (
                          <div className="text-xs text-red-600">
                            Short:{" "}
                            {Number.parseFloat(record.short_hours).toFixed(2)}h
                          </div>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(
                      record.attendance_status,
                      record.is_late === 1,
                      record.is_early_departure === 1,
                      new Date(record.attendance_date).getDay() === 0 ||
                        holidays?.get(
                          new Date(record.attendance_date)
                            .toISOString()
                            .split("T")[0]
                        ),
                      new Date(record.attendance_date).getDay() === 0
                        ? "Sunday"
                        : holidays?.get(
                            new Date(record.attendance_date)
                              .toISOString()
                              .split("T")[0]
                          )
                    )}
                  </TableCell>
                  <TableCell>{overtimeBadge || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {isNoPunchOut &&
                      record.attendance_status !== "Absent" &&
                      record.attendance_status !== "Leave" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-400 text-orange-600 hover:bg-orange-50 bg-transparent"
                          onClick={() => handlePunchOutClick(record)}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Punch Out
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(record)}
                            aria-label="Edit attendance"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <AttendanceAuditDialog recordId={record.id} />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderOvertimeTable = (overtimeRecords: OvertimeRecord[]) => {
    if (overtimeLoading) {
      return <TableSkeleton rows={6} />;
    }

    if (overtimeRecords.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Timer className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Overtime Requests</h3>
          <p>There are no pending overtime requests.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">Employee</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overtimeRecords.map((overtime) => (
              <TableRow
                key={overtime.id}
                className="hover:bg-accent/50 transition-colors"
              >
                <TableCell>
                  <div className="font-medium flex gap-2.5 hover:underline">
                    <Link href={`/directory/${overtime.employee_id}`}>
                      {overtime.employee_name}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:cursor-pointer"
                      onClick={() =>
                        handleViewSummary({
                          id: overtime.employee_id,
                          first_name: overtime.employee_name,
                        } as UserProfile)
                      }
                      aria-label="View monthly summary"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(overtime.request_date).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {overtime.overtime_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {formatUtcTimeToZone(
                        overtime.overtime_start,
                        selectedTimezone ?? "UTC"
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      to{" "}
                      {formatUtcTimeToZone(
                        overtime.overtime_end,
                        selectedTimezone ?? "UTC"
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {overtime.overtime_hours} hrs
                  </div>
                  {overtime.approved_hours &&
                    Number.parseFloat(overtime.approved_hours) > 0 && (
                      <div className="text-xs text-green-600">
                        Approved: {overtime.approved_hours}h
                      </div>
                    )}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      overtime.status === "pending_approval"
                        ? "bg-yellow-100 text-yellow-800"
                        : overtime.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {overtime.status
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {overtime.status === "pending_approval" && (
                    <Button
                      size="sm"
                      onClick={() => handleOvertimeClick(overtime)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Process
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold text-pretty">
                Attendance Records
              </h1>
              <p className="text-sm text-muted-foreground">
                Track presence, hours, and overtime with quick actions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              onClick={() => setUploadDialogOpen(true)}
            >
              <Upload/>
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsBulkAttendanceOpen(true)}
            >
              Bulk Attendance
            </Button>
            <Button onClick={() => setIsPunchInDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Punch In
            </Button>
          </div>
        </div>

        {!canManageAttendance ? (
          <Alert variant="destructive" role="alert">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to manage attendance records.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Present</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.Present || 0}
                  </div>
                  {metrics.late_count > 0 && (
                    <p className="text-xs text-yellow-600 mt-1">
                      {metrics.late_count} late arrivals
                    </p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Absent</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.Absent || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    On Leave
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.Leave || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Half Day
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics["Half-Day"] || 0}
                  </div>
                  {metrics.early_departure_count > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      {metrics.early_departure_count} early departures
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HistoryIcon className="h-5 w-5" />
                  Filters
                </CardTitle>
                <CardDescription>
                  Apply filters to fetch records from the server.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <Label htmlFor="filter-mode" className="text-sm">
                      Date
                    </Label>
                    <Switch
                      id="filter-mode"
                      checked={apiFilters.filterMode === "month"}
                      onCheckedChange={(c) =>
                        setApiFilters((f) => ({
                          ...f,
                          filterMode: c ? "month" : "date",
                        }))
                      }
                      aria-label="Toggle to filter by month"
                    />
                    <Label htmlFor="filter-mode" className="text-sm">
                      Month
                    </Label>
                  </div>
                  {apiFilters.filterMode === "date" ? (
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={apiFilters.date}
                        onChange={(e) =>
                          setApiFilters((f) => ({ ...f, date: e.target.value }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label>Month</Label>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          placeholder="MM"
                          value={apiFilters.month}
                          onChange={(e) =>
                            setApiFilters((f) => ({
                              ...f,
                              month: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Year</Label>
                        <Input
                          type="number"
                          placeholder="YYYY"
                          value={apiFilters.year}
                          onChange={(e) =>
                            setApiFilters((f) => ({
                              ...f,
                              year: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label>Employee</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {selectedEmployee
                            ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                            : "All employees"}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search by name or id..."
                            value={employeeSearch}
                            onValueChange={setEmployeeSearch}
                          />
                          <CommandList className="max-h-64">
                            <CommandEmpty>
                              {isSearching ? "Searching..." : "No users found."}
                            </CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  setSelectedEmployee(null);
                                  setApiFilters((f) => ({
                                    ...f,
                                    employee_id: undefined,
                                  }));
                                }}
                              >
                                All Employees
                              </CommandItem>
                              {searchedUsers.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={`${user.first_name} ${user.last_name} ${user.id}`}
                                  onSelect={() => {
                                    setSelectedEmployee(user);
                                    setApiFilters((f) => ({
                                      ...f,
                                      employee_id: user.id,
                                    }));
                                  }}
                                >
                                  {user.first_name} {user.last_name} (#{user.id}
                                  )
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Shift</Label>
                    <Select
                      value={String(apiFilters.shift_id || "all")}
                      onValueChange={(val) =>
                        setApiFilters((f) => ({
                          ...f,
                          shift_id: val === "all" ? undefined : Number(val),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Shifts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Shifts</SelectItem>
                        {shifts.map((shift) => (
                          <SelectItem
                            key={shift.id}
                            value={shift.id.toString()}
                          >
                            {shift.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="attendance">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="attendance">
                  Attendance ({allRecords.length})
                </TabsTrigger>
                <TabsTrigger value="overtime">
                  Overtime
                  <Badge className="ml-2">
                    {pendingOvertimeRecords.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="punchout">
                  Pending Punch Out
                  <Badge className="ml-2">{noPunchOutRecords.length}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="attendance">
                <Card>
                  <CardContent className="pt-6">
                    {renderAttendanceTable(allRecords)}
                  </CardContent>
                  {hasMore && (
                    <CardFooter>
                      <Button
                        onClick={() => fetchRecords(true)}
                        disabled={loading}
                        className="w-full"
                        aria-busy={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="overtime">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      Overtime Requests
                    </CardTitle>
                    <CardDescription>
                      Review and process overtime requests from employees.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderOvertimeTable(pendingOvertimeRecords)}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="punchout">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LogOut className="h-5 w-5" />
                      Pending Punch Out
                    </CardTitle>
                    <CardDescription>
                      These employees haven't punched out yet. Click "Punch Out"
                      to record their exit time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderAttendanceTable(noPunchOutRecords)}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <EditAttendanceDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              record={selectedRecord}
              onSuccess={() => {
                fetchRecords();
              }}
            />
            <BulkAttendanceDialog
              open={isBulkAttendanceOpen}
              onOpenChange={setIsBulkAttendanceOpen}
              shifts={shifts}
              onSuccess={fetchRecords}
            />
            <PunchInDialog
              open={isPunchInDialogOpen}
              onOpenChange={setIsPunchInDialogOpen}
              onPunchInSuccess={fetchRecords}
            />
            <PunchOutDialog
              open={isPunchOutDialogOpen}
              onOpenChange={setIsPunchOutDialogOpen}
              record={selectedRecord}
              onPunchOutSuccess={fetchRecords}
            />
            <OvertimeProcessDialog
              open={isOvertimeDialogOpen}
              onOpenChange={setIsOvertimeDialogOpen}
              overtime={selectedOvertime}
              onProcessSuccess={() => {
                fetchRecords();
                fetchOvertimeRecords();
              }}
            />
            <EmployeeSummaryDialog
              open={isSummaryDialogOpen}
              onOpenChange={setIsSummaryDialogOpen}
              employee={selectedEmployee}
              filters={apiFilters}
            />
            <BulkUploadAttendanceDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        timezone={localStorage.getItem("selectedTimezone")??"UTC"}
        onSuccess={()=>{setUploadDialogOpen(false)
          fetchRecords()
        }}
      />
          </>
        )}
      </div>
    </MainLayout>
  );
}
