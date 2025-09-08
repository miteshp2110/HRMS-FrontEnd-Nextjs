
"use client"
import {DateTime} from 'luxon'
import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ClipboardList, Search, CheckCircle, XCircle, Clock, AlertCircle, Edit, Timer, UserX, LogOut, Plus, CalendarDays, BarChart, Globe, ChevronsUpDown, Filter, ChartNoAxesColumn } from "lucide-react"
import Link from "next/link"
import { getAllAttendance, updateAttendancePayType, getShifts, searchUsers, approveOvertime, type AttendanceRecord, type Shift, type UserProfile, punchIn, punchOut } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const timezones = [
    "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "Europe/London", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney"
];

/**
 * Convert local date, time, and timezone into UTC ISO string
 * 
 * @param {string} date - e.g. "2025-09-03"
 * @param {string} time - e.g. "10:37:00"
 * @param {string} timezone - e.g. "Asia/Kolkata"
 * @returns {string} UTC datetime in ISO format
 */
function convertToUTC(date:string, time:string, timezone:string) {
  const localDateTime = DateTime.fromISO(`${date}T${time}`, { zone: timezone });
  return localDateTime.toUTC().toISO(); // e.g. "2025-09-03T05:07:00.000Z"
}
// Punch In Dialog Component
const PunchInDialog = ({ open, onOpenChange, onPunchInSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onPunchInSuccess: () => void }) => {
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
        return now.toTimeString().slice(0, 8); // HH:MM:SS format
    });
    const [punchInDate,setpunchInDate] = useState<string>()
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedEmployeeSearch(employeeSearch), 500);
        return () => clearTimeout(handler);
    }, [employeeSearch]);

    useEffect(() => {
        if (debouncedEmployeeSearch) {
            setIsSearching(true);
            searchUsers(debouncedEmployeeSearch).then(setSearchedUsers).finally(() => setIsSearching(false));
        } else {
            setSearchedUsers([]);
        }
    }, [debouncedEmployeeSearch]);

    const handlePunchIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            toast({ title: "Error", description: "Please select an employee.", variant: "destructive" });
            return;
        }

        try {
            const today = new Date().toISOString().split('T')[0];
            const timeLocal = `${punchInDate} ${punchInTime}`;
            // console.log(punchInTime)
            // console.log(punchInDate)
            // const dateTime = convertToUTC(punchInDate!,punchInTime,selectedTimezone)
            
            const requestBody = {
                time_local: timeLocal,
                timezone: selectedTimezone,
                employee_id: selectedUser.id
            };
            
            // console.log(dateTime)
            await punchIn(timeLocal,selectedTimezone,selectedUser.id)
            // Replace with your actual punch-in API call
            // await punchInEmployee(requestBody);
            console.log('Punch In Request:', requestBody);
            
            toast({ title: "Success", description: `${selectedUser.first_name} ${selectedUser.last_name} has been punched in successfully.` });
            onOpenChange(false);
            onPunchInSuccess();
            
            // Reset form
            setSelectedUser(null);
            setEmployeeSearch("");
            setPunchInTime(new Date().toTimeString().slice(0, 8));
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to punch in: ${error.message}`, variant: "destructive" });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Punch In Employee</DialogTitle>
                    <DialogDescription>Record punch-in time for an employee.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePunchIn} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Employee</Label>
                        <Popover open={isEmployeePopoverOpen} onOpenChange={setIsEmployeePopoverOpen}>
                            <PopoverTrigger asChild>
                                <button  aria-expanded={isEmployeePopoverOpen} className="w-full justify-between">
                                    {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : "Select employee..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search employee..." onValueChange={setEmployeeSearch} />
                                    <CommandList>
                                        <CommandEmpty>{isSearching ? "Searching..." : "No employee found."}</CommandEmpty>
                                        <CommandGroup>
                                            {searchedUsers.map((user) => (
                                                <CommandItem key={user.id} value={`${user.first_name} ${user.last_name}`} onSelect={() => {
                                                        setSelectedUser(user);
                                                        setIsEmployeePopoverOpen(false);
                                                    }}>
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
                        <Label>Timezone</Label>
                        <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {timezones.map(tz => (
                                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                    <div className="space-y-2">
                        <Label>Punch In Date</Label>
                        <Input 
                            type="date" 
                            step="1" 
                            value={punchInDate} 
                            onChange={(e) => setpunchInDate(e.target.value)}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Punch In</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// Punch Out Dialog Component
const PunchOutDialog = ({ open, onOpenChange, record, onPunchOutSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, record: AttendanceRecord | null, onPunchOutSuccess: () => void }) => {
    const { toast } = useToast();
    const [selectedTimezone, setSelectedTimezone] = useState("Asia/Kolkata");
    const [punchOutDate,setPunchOutDate] = useState<string>()
    const [punchOutTime, setPunchOutTime] = useState(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 8); // HH:MM:SS format
    });

    const handlePunchOut = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!record) return;

        try {
            const today = new Date(record.attendance_date).toISOString().split('T')[0];
            const timeLocal = `${punchOutDate} ${punchOutTime}`;
            
            const requestBody = {
                time_local: timeLocal,
                timezone: selectedTimezone,
                employee_id: record.employee_id
            };

            await punchOut(timeLocal,selectedTimezone,record.employee_id)
            // Replace with your actual punch-out API call
            // await punchOutEmployee(requestBody);
            // console.log('Punch Out Request:', requestBody);
            
            toast({ title: "Success", description: `${record.first_name} ${record.last_name} has been punched out successfully.` });
            onOpenChange(false);
            onPunchOutSuccess();
            
            // Reset form
            setPunchOutTime(new Date().toTimeString().slice(0, 8));
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to punch out: ${error.message}`, variant: "destructive" });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Punch Out Employee</DialogTitle>
                    <DialogDescription>
                        Record punch-out time for {record?.first_name} {record?.last_name} on {record ? new Date(record.attendance_date).toLocaleDateString() : ''}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePunchOut} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {timezones.map(tz => (
                                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Punch Out</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function AttendanceRecordsPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPunchInDialogOpen, setIsPunchInDialogOpen] = useState(false);
  const [isPunchOutDialogOpen, setIsPunchOutDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [newPayType, setNewPayType] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  
  const [employeeSearch, setEmployeeSearch] = useState("")
  const [debouncedEmployeeSearch, setDebouncedEmployeeSearch] = useState("")
  const [searchedUsers, setSearchedUsers] = useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<UserProfile | null>(null)

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

  const canManageAttendance = hasPermission("attendance.manage")

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedEmployeeSearch(employeeSearch), 500);
    return () => clearTimeout(handler);
  }, [employeeSearch]);

  useEffect(() => {
    if (debouncedEmployeeSearch) {
      setIsSearching(true);
      searchUsers(debouncedEmployeeSearch)
        .then(e=>{setSearchedUsers(e)})
        .finally(() => setIsSearching(false));
    } else {
      setSearchedUsers([]);
    }
  }, [debouncedEmployeeSearch]);

  useEffect(() => {
    const savedTimezone = localStorage.getItem("attendanceTimezone");
    if (savedTimezone && timezones.includes(savedTimezone)) {
      setSelectedTimezone(savedTimezone);
    }

    if (canManageAttendance) {
      getShifts().then(shiftsData => {
        setShifts(shiftsData);
        if (shiftsData.length > 0 && !apiFilters.shift_id) {
           setApiFilters(f => ({ ...f, shift_id: shiftsData[0].id }));
        }
      }).catch(error => {
          toast({ title: "Error", description: `Failed to load shifts: ${error.message}`, variant: "destructive"});
      });
    }
  }, [canManageAttendance, toast]);

  useEffect(() => {
    localStorage.setItem("attendanceTimezone", selectedTimezone);
  }, [selectedTimezone]);

  const fetchRecords = useCallback(async (isLoadMore = false) => {
    if (!canManageAttendance) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const currentPage = isLoadMore ? page + 1 : 1;
    const params: any = { page: currentPage, limit: 20, ...apiFilters };
    if (apiFilters.filterMode === 'date') {
        delete params.month;
        delete params.year;
    } else {
        delete params.date;
    }

    try {
      const data = await getAllAttendance(params);
      setHasMore(data.length === 20);
      setAllRecords(prev => (isLoadMore ? [...prev, ...data] : data));
      if (isLoadMore) setPage(currentPage);
    } catch (error: any) {
      toast({ title: "Error", description: `Could not fetch attendance records: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false)
    }
  }, [canManageAttendance, apiFilters, page, toast])

  useEffect(() => {
    setAllRecords([]); 
    setPage(1);
    fetchRecords();
  }, [apiFilters]);

  const overtimeRequests = useMemo(() => allRecords.filter(r => r.pay_type === "overtime" && r.overtime_status === null), [allRecords]);
  const actionRequiredRecords = useMemo(() => allRecords.filter(r => r.pay_type === "no_punch_out"), [allRecords]);
  const noPunchOutRecords = useMemo(() => allRecords.filter(r => !r.punch_out), [allRecords]);
  const metrics = useMemo(() => allRecords.reduce((acc, record) => {
    acc[record.attendance_status] = (acc[record.attendance_status] || 0) + 1;
    return acc;
  }, { present: 0, late: 0, absent: 0, leave: 0 } as Record<string, number>), [allRecords]);

  const handleEditClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setNewPayType(record.pay_type);
    setIsEditDialogOpen(true);
  }

  const handlePunchOutClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsPunchOutDialogOpen(true);
  }

  const handleSaveChanges = async () => {
    if (!selectedRecord || !newPayType) return;
    try {
      await updateAttendancePayType(selectedRecord.id, newPayType as any);
      toast({ title: "Success", description: "Pay type updated successfully." });
      setIsEditDialogOpen(false);
      fetchRecords();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to update pay type: ${error.message}`, variant: "destructive" });
    }
  }

  const handleApproveOvertime = async (recordId: number) => {
    try {
      await approveOvertime(recordId, 1);
      toast({ title: "Success", description: "Overtime has been approved." });
      fetchRecords();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to approve overtime: ${error.message}`, variant: "destructive" });
    }
  }

  type StatusKey = "present" | "absent" | "late" | "leave" | "no_punch_out" | "overtime" | "half_day" | "unpaid" | "full_day";
  const statusMap: Record<StatusKey, { icon: React.ComponentType<any>; color: string; label: string }> = {
    present: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Present" },
    full_day: { icon: CheckCircle, color: "bg-green-100 text-green-800", label: "Full Day" },
    absent: { icon: XCircle, color: "bg-red-100 text-red-800", label: "Absent" },
    late: { icon: Clock, color: "bg-yellow-100 text-yellow-800", label: "Late" },
    leave: { icon: CalendarDays, color: "bg-blue-100 text-blue-800", label: "On Leave" },
    no_punch_out: { icon: LogOut, color: "bg-red-200 text-red-900", label: "No Punch Out" },
    overtime: { icon: Timer, color: "bg-indigo-100 text-indigo-800", label: "Overtime" },
    half_day: { icon: BarChart, color: "bg-orange-100 text-orange-800", label: "Half Day" },
    unpaid: { icon: UserX, color: "bg-gray-200 text-gray-800", label: "Unpaid" },
  }

  const getStatusBadge = (status: string) => {
    const map = statusMap[status as StatusKey];
    const Icon = map?.icon || Clock;
    return <Badge className={map?.color || "bg-gray-100 text-gray-800"}><Icon className="h-3 w-3 mr-1" />{map?.label || status}</Badge>;
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    return new Date(timeString).toLocaleTimeString("en-US", {
      timeZone: selectedTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const renderTable = (recordsToRender: AttendanceRecord[], type: "all" | "overtime" | "action" | "punchout" = "all") => {
    if (recordsToRender.length === 0 && !loading) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <ClipboardList className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Records Found</h3>
          <p>There are no attendance records matching the current criteria.</p>
        </div>
      )
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Timings ({selectedTimezone})</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pay Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recordsToRender.map(record => {
            const isNoPunchOut = !record.punch_out;
            return (
              <TableRow 
                key={record.id} 
                
              >
                <TableCell>
                  <Link href={`/directory/${record.employee_id}`} className="font-medium text-primary hover:underline">
                    {record.first_name} {record.last_name}
                  </Link>
                </TableCell>
                <TableCell>{new Date(record.attendance_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {formatTime(record.punch_in)} / {formatTime(record.punch_out)}
                  {isNoPunchOut && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      No Punch Out
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{parseFloat(record.hours_worked || "0").toFixed(2)} hrs</TableCell>
                <TableCell>{getStatusBadge(record.attendance_status)}</TableCell>
                <TableCell>{getStatusBadge(record.pay_type)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {type === "overtime" ? (
                      <Button size="sm" onClick={() => handleApproveOvertime(record.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" /> Approve
                      </Button>
                    ) : type === "punchout" || isNoPunchOut ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-orange-400 text-orange-600 hover:bg-orange-50"
                        onClick={() => handlePunchOutClick(record)}
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Punch Out
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(record)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ClipboardList className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Attendance Records</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
              <SelectTrigger className="w-[180px]">
                <Globe className="h-4 w-4 mr-2"/>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(tz => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setIsPunchInDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />Punch In
            </Button>
          </div>
        </div>

        {!canManageAttendance ? ( 
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>You don't have permission to manage attendance records.</AlertDescription>
          </Alert> 
        ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.present}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.absent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                <CalendarDays className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.leave}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.late}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Global Filters</CardTitle>
              <CardDescription>Apply filters to fetch new records from the server.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div className="flex items-center gap-2 p-2 border rounded-md justify-center">
                        <Label htmlFor="filter-mode" className="text-sm">Date</Label>
                        <Switch id="filter-mode" checked={apiFilters.filterMode === 'month'} onCheckedChange={(c) => setApiFilters(f => ({...f, filterMode: c ? 'month' : 'date'}))}/>
                        <Label htmlFor="filter-mode" className="text-sm">Month</Label>
                    </div>
                    {apiFilters.filterMode === 'date' ? (
                        <div>
                          <Label>Date</Label>
                          <Input type="date" value={apiFilters.date} onChange={e => setApiFilters(f => ({...f, date: e.target.value}))}/>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Label>Month</Label>
                            <Input type="number" placeholder="MM" value={apiFilters.month} onChange={e => setApiFilters(f => ({...f, month: e.target.value}))}/>
                          </div>
                          <div className="flex-1">
                            <Label>Year</Label>
                            <Input type="number" placeholder="YYYY" value={apiFilters.year} onChange={e => setApiFilters(f => ({...f, year: e.target.value}))}/>
                          </div>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <Label>Employee</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                              {selectedEmployee
                                ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                                : "Select employee"}
                              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[300px] p-0 rounded-xl shadow-lg border"
                            align="start"
                            sideOffset={6}
                          >
                            <Command className="rounded-xl">
                              <CommandInput
                                placeholder="Search by name or id..."
                                value={employeeSearch}
                                onValueChange={setEmployeeSearch}
                                className="px-3 py-2 text-sm border-b focus:ring-0 focus:outline-none"
                              />
                              <CommandList className="max-h-64 overflow-y-auto">
                                { (!isSearching && debouncedEmployeeSearch && searchedUsers.length === 0) ?
                                  <CommandEmpty>No users found.</CommandEmpty>
                                :
                                <CommandGroup heading="Employees">
                                  <CommandItem
                                    onSelect={() => {
                                      setSelectedEmployee(null);
                                      setApiFilters((f) => ({ ...f, employee_id: undefined }));
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
                                        setApiFilters((f) => ({ ...f, employee_id: user.id }));
                                      }}
                                    >
                                      {user.first_name} {user.last_name} (#{user.id})
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              }
                              </CommandList>
                            </Command>
                          </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                        <Label>Shift</Label>
                        <Select value={String(apiFilters.shift_id || 'all')} onValueChange={val => setApiFilters(f => ({ ...f, shift_id: val === 'all' ? undefined : Number(val) }))}>
                            <SelectTrigger><SelectValue placeholder="All Shifts" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Shifts</SelectItem>
                              {shifts.map(shift => (
                                <SelectItem key={shift.id} value={shift.id.toString()}>{shift.name}</SelectItem>
                              ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Records ({allRecords.length})</TabsTrigger>
                <TabsTrigger value="punchout">
                  Pending Punch Out 
                  <Badge className="ml-2">{noPunchOutRecords.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="overtime">
                  Overtime Requests 
                  <Badge className="ml-2">{overtimeRequests.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="actions">
                  Action Required 
                  <Badge className="ml-2">{actionRequiredRecords.length}</Badge>
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
                <Card>
                     <CardContent className="pt-6">{renderTable(allRecords, "all")}</CardContent>
                     {hasMore && (
                       <CardFooter>
                         <Button onClick={() => fetchRecords(true)} disabled={loading} className="w-full">
                           {loading ? 'Loading...' : 'Load More'}
                         </Button>
                       </CardFooter>
                     )}
                </Card>
            </TabsContent>
            
            <TabsContent value="punchout">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Punch Out</CardTitle>
                  <CardDescription>
                    These employees haven't punched out yet. Click "Punch Out" to record their exit time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTable(noPunchOutRecords, 'punchout')}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="overtime">
              <Card>
                <CardHeader>
                  <CardTitle>Overtime Requests</CardTitle>
                  <CardDescription>Approve these records for overtime pay.</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTable(overtimeRequests, 'overtime')}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="actions">
              <Card>
                <CardHeader>
                  <CardTitle>Action Required</CardTitle>
                  <CardDescription>
                    These records have a 'No Punch Out' status. Please edit them to set the correct pay type.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderTable(actionRequiredRecords, 'action')}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Punch In Dialog */}
          <PunchInDialog 
            open={isPunchInDialogOpen} 
            onOpenChange={setIsPunchInDialogOpen} 
            onPunchInSuccess={fetchRecords} 
          />

          {/* Punch Out Dialog */}
          <PunchOutDialog 
            open={isPunchOutDialogOpen} 
            onOpenChange={setIsPunchOutDialogOpen} 
            record={selectedRecord}
            onPunchOutSuccess={fetchRecords} 
          />

          {/* Edit Pay Type Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Pay Type</DialogTitle>
                    <DialogDescription>
                      Update the pay status for {selectedRecord?.first_name} {selectedRecord?.last_name} for {selectedRecord ? new Date(selectedRecord.attendance_date).toLocaleDateString() : ''}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="pay-type-select">Pay Type</Label>
                    <Select value={newPayType} onValueChange={setNewPayType}>
                      <SelectTrigger id="pay-type-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_day">Full Day</SelectItem>
                        <SelectItem value="half_day">Half Day</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="leave">Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        </>
        )}
      </div>
    </MainLayout>
  )
}