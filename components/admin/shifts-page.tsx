"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Plus, Edit, Trash2, Clock, AlertCircle, Globe } from "lucide-react"
import { getShifts, createShift, updateShift, deleteShift, type Shift } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// A subset of IANA timezones for the dropdown
const timezones = [
    "UTC",
    "America/New_York", // EST/EDT
    "America/Chicago",  // CST/CDT
    "America/Denver",   // MST/MDT
    "America/Los_Angeles", // PST/PDT
    "Europe/London",    // GMT/BST
    "Europe/Berlin",    // CET/CEST
    "Asia/Dubai",       // GST
    "Asia/Kolkata",     // IST
    "Asia/Singapore",   // SGT
    "Australia/Sydney"  // AEST/AEDT
];

export function ShiftsPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [selectedTimezone, setSelectedTimezone] = useState<string| null>(null);

  const canManageShifts = hasPermission("shift.manage")

  // Load and save timezone from localStorage
  useEffect(() => {
    const savedTimezone = localStorage.getItem("selectedTimezone");
    if (savedTimezone && timezones.includes(savedTimezone)) {
      setSelectedTimezone(savedTimezone);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedTimezone", selectedTimezone!);
  }, [selectedTimezone]);


  const fetchShifts = async () => {
    if (!canManageShifts) {
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true)
      const shiftsData = await getShifts()
      setShifts(shiftsData)
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to fetch shifts: ${error.message}`, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShifts()
  }, [canManageShifts])

  const handleCreateShift = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
        name: formData.get("name") as string,
        from_time_local: formData.get("from_time_local") as string,
        to_time_local: formData.get("to_time_local") as string,
        timezone: formData.get("timezone") as string,
        half_day_threshold: Number(formData.get("half_day_threshold")),
        punch_in_margin: Number(formData.get("punch_in_margin")),
        punch_out_margin: Number(formData.get("punch_out_margin")),
    }

    try {
      await createShift(data)
      toast({ title: "Success", description: "Shift created successfully." })
      setCreateDialogOpen(false)
      fetchShifts()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create shift.", variant: "destructive" })
    }
  }

  const handleEditShift = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedShift) return

    const formData = new FormData(e.currentTarget)
    const data = {
        name: formData.get("name") as string,
        half_day_threshold: Number(formData.get("half_day_threshold")),
        punch_in_margin: Number(formData.get("punch_in_margin")),
        punch_out_margin: Number(formData.get("punch_out_margin")),
    };

    try {
      await updateShift(selectedShift.id, data)
      toast({ title: "Success", description: "Shift updated successfully." })
      setEditDialogOpen(false)
      setSelectedShift(null)
      fetchShifts()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update shift.", variant: "destructive" })
    }
  }

  const handleDeleteShift = async (id: number) => {
    if (!confirm("Are you sure you want to delete this shift? This cannot be undone.")) return

    try {
      await deleteShift(id)
      toast({ title: "Success", description: "Shift deleted successfully." })
      fetchShifts()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete shift.", variant: "destructive" })
    }
  }

  const formatTimeInTimezone = (utcTime: string, timeZone: string): string => {
    const [hours, minutes, seconds] = utcTime.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, seconds, 0);

    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone,
    }).format(date);
  };

  const calculateDuration = (fromTime: string, toTime: string): string => {
      const from = new Date(`1970-01-01T${fromTime}Z`);
      let to = new Date(`1970-01-01T${toTime}Z`);

      if (to < from) {
          // Add a day if it's an overnight shift
          to.setDate(to.getDate() + 1);
      }

      const diff = to.getTime() - from.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
  };

  if (!canManageShifts) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to manage shifts.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <p className="text-muted-foreground text-sm">All shift timings are stored in UTC and displayed in your selected timezone.</p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Globe className="h-4 w-4 text-muted-foreground"/>
                <Select value={selectedTimezone!} onValueChange={setSelectedTimezone}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent>
                        {timezones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
       </div>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Shift Schedules</CardTitle>
                    <CardDescription>Manage available work shifts in the organization.</CardDescription>
                </div>
                 <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Shift
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Shift</DialogTitle>
                            <DialogDescription>Define a new work shift with timing and grace periods.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateShift} className="space-y-4 py-4">
                            <div><Label htmlFor="name">Shift Name</Label><Input id="name" name="name" required /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label htmlFor="from_time_local">From Time</Label><Input id="from_time_local" name="from_time_local" type="time" required /></div>
                                <div><Label htmlFor="to_time_local">To Time</Label><Input id="to_time_local" name="to_time_local" type="time" required /></div>
                            </div>
                            <div>
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select name="timezone" defaultValue="Asia/Kolkata" required>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{timezones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div><Label htmlFor="half_day_threshold">Half Day (Hrs)</Label><Input id="half_day_threshold" name="half_day_threshold" type="number" defaultValue="4" required /></div>
                                <div><Label htmlFor="punch_in_margin">Grace In (Mins)</Label><Input id="punch_in_margin" name="punch_in_margin" type="number" defaultValue="15" required /></div>
                                <div><Label htmlFor="punch_out_margin">Grace Out (Mins)</Label><Input id="punch_out_margin" name="punch_out_margin" type="number" defaultValue="15" required /></div>
                            </div>
                            <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Create Shift</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shift Name</TableHead>
                <TableHead>Timings ({selectedTimezone})</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Half-Day</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium">{shift.name}</TableCell>
                  <TableCell>{formatTimeInTimezone(shift.from_time, selectedTimezone!)} - {formatTimeInTimezone(shift.to_time, selectedTimezone!)}</TableCell>
                  <TableCell>{calculateDuration(shift.from_time, shift.to_time)}</TableCell>
                  <TableCell>{shift.half_day_threshold}h</TableCell>
                  <TableCell>{shift.punch_in_margin.toString().split('.')[0]}m/{shift.punch_out_margin.toString().split('.')[0]}m</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setSelectedShift(shift); setEditDialogOpen(true); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteShift(shift.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shift: {selectedShift?.name}</DialogTitle>
            <DialogDescription>Update the shift details. Timings cannot be edited after creation.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditShift} className="space-y-4 py-4">
               <div><Label htmlFor="name">Shift Name</Label><Input id="name" name="name" defaultValue={selectedShift?.name} required /></div>
               <div><Label>From Time (UTC)</Label><Input value={selectedShift?.from_time} disabled /></div>
               <div><Label>To Time (UTC)</Label><Input value={selectedShift?.to_time} disabled /></div>
                <div className="grid grid-cols-3 gap-4">
                    <div><Label htmlFor="half_day_threshold">Half Day (Hrs)</Label><Input id="half_day_threshold" name="half_day_threshold" type="number" defaultValue={selectedShift?.half_day_threshold} required /></div>
                    <div><Label htmlFor="punch_in_margin">Grace In (Mins)</Label><Input id="punch_in_margin" name="punch_in_margin" type="number" defaultValue={selectedShift?.punch_in_margin} required /></div>
                    <div><Label htmlFor="punch_out_margin">Grace Out (Mins)</Label><Input id="punch_out_margin" name="punch_out_margin" type="number" defaultValue={selectedShift?.punch_out_margin} required /></div>
                </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update Shift</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}