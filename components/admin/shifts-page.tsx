// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { Plus, Edit, Trash2, Clock, AlertCircle, Globe } from "lucide-react"
// import { getShifts, createShift, updateShift, deleteShift, type Shift } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// // A subset of IANA timezones for the dropdown
// const timezones = [
//     "UTC",
//     "America/New_York", // EST/EDT
//     "America/Chicago",  // CST/CDT
//     "America/Denver",   // MST/MDT
//     "America/Los_Angeles", // PST/PDT
//     "Europe/London",    // GMT/BST
//     "Europe/Berlin",    // CET/CEST
//     "Asia/Dubai",       // GST
//     "Asia/Kolkata",     // IST
//     "Asia/Singapore",   // SGT
//     "Australia/Sydney"  // AEST/AEDT
// ];

// export function ShiftsPage() {
//   const { hasPermission } = useAuth()
//   const { toast } = useToast()
//   const [shifts, setShifts] = useState<Shift[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [createDialogOpen, setCreateDialogOpen] = useState(false)
//   const [editDialogOpen, setEditDialogOpen] = useState(false)
//   const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
//   const [selectedTimezone, setSelectedTimezone] = useState<string| null>(localStorage.getItem("selectedTimezone") || "UTC");

//   const canManageShifts = hasPermission("shift.manage")

//   // Load and save timezone from localStorage
//   useEffect(() => {
//     const savedTimezone = localStorage.getItem("selectedTimezone");
//     if (savedTimezone && timezones.includes(savedTimezone)) {
//       setSelectedTimezone(savedTimezone);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("selectedTimezone", selectedTimezone!);
//   }, [selectedTimezone]);


//   const fetchShifts = async () => {
//     if (!canManageShifts) {
//       setIsLoading(false)
//       return
//     }
//     try {
//       setIsLoading(true)
//       const shiftsData = await getShifts()
//       setShifts(shiftsData)
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to fetch shifts: ${error.message}`, variant: "destructive" })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchShifts()
//   }, [canManageShifts])

//   const handleCreateShift = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     const data = {
//         name: formData.get("name") as string,
//         from_time_local: formData.get("from_time_local") as string,
//         to_time_local: formData.get("to_time_local") as string,
//         timezone: selectedTimezone??'UTC',
//         half_day_threshold: Number(formData.get("half_day_threshold")),
//         punch_in_margin: Number(formData.get("punch_in_margin")),
//         punch_out_margin: Number(formData.get("punch_out_margin")),
//         overtime_threshold: Number(formData.get("overtime_threshold")),
//     }

//     try {
//       await createShift(data)
//       toast({ title: "Success", description: "Shift created successfully." })
//       setCreateDialogOpen(false)
//       fetchShifts()
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to create shift.", variant: "destructive" })
//     }
//   }

//   const handleEditShift = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (!selectedShift) return

//     const formData = new FormData(e.currentTarget)
//     const data = {
//       from_time_local: formData.get("from_time_local") as string,
//         to_time_local: formData.get("to_time_local") as string,
//         timezone: selectedTimezone??'UTC',
//         name: formData.get("name") as string,
//         half_day_threshold: Number(formData.get("half_day_threshold")),
//         punch_in_margin: Number(formData.get("punch_in_margin")),
//         punch_out_margin: Number(formData.get("punch_out_margin")),
//         overtime_threshold: Number(formData.get("overtime_threshold")),
//     };

//     try {
//       await updateShift(selectedShift.id, data)
//       toast({ title: "Success", description: "Shift updated successfully." })
//       setEditDialogOpen(false)
//       setSelectedShift(null)
//       fetchShifts()
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to update shift.", variant: "destructive" })
//     }
//   }

//   const handleDeleteShift = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this shift? This cannot be undone.")) return

//     try {
//       await deleteShift(id)
//       toast({ title: "Success", description: "Shift deleted successfully." })
//       fetchShifts()
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to delete shift.", variant: "destructive" })
//     }
//   }

//   const formatTimeInTimezone = (utcTime: string, timeZone: string): string => {
//     const [hours, minutes, seconds] = utcTime.split(':').map(Number);
//     const date = new Date();
//     date.setUTCHours(hours, minutes, seconds, 0);

//     return new Intl.DateTimeFormat('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//       timeZone: timeZone,
//     }).format(date);
//   };

//   function formatUtcTimeToZone(timeString :string | undefined, timeZone:string) {
//   // Combine with a dummy UTC date (so it’s a valid ISO string)
//   if(timeString!==undefined){
//     const utcDate = new Date(`1970-01-01T${timeString}Z`);
    
//   return new Intl.DateTimeFormat("en-GB", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//     timeZone,
//   }).format(utcDate);
//   }
// }

//   const calculateDuration = (fromTime: string, toTime: string): string => {
//       const from = new Date(`1970-01-01T${fromTime}Z`);
//       let to = new Date(`1970-01-01T${toTime}Z`);

//       if (to < from) {
//           // Add a day if it's an overnight shift
//           to.setDate(to.getDate() + 1);
//       }

//       const diff = to.getTime() - from.getTime();
//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
//       return `${hours}h ${minutes}m`;
//   };

//   if (!canManageShifts) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Access Denied</AlertTitle>
//         <AlertDescription>
//           You don't have permission to manage shifts.
//         </AlertDescription>
//       </Alert>
//     )
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
       

//       <Card>
//         <CardHeader>
//             <div className="flex justify-between items-center">
//                 <div>
//                     <CardTitle>Shift Schedules</CardTitle>
//                     <CardDescription>Manage available work shifts in the organization.</CardDescription>
//                 </div>
//                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
//                     <DialogTrigger asChild>
//                     <Button>
//                         <Plus className="h-4 w-4 mr-2" />
//                         Create Shift
//                     </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                         <DialogHeader>
//                             <DialogTitle>Create New Shift</DialogTitle>
//                             <DialogDescription>Define a new work shift with timing and grace periods.</DialogDescription>
//                         </DialogHeader>
//                         <form onSubmit={handleCreateShift} className="space-y-4 py-4">
//                             <div><Label htmlFor="name">Shift Name *</Label><Input id="name" name="name" required /></div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div><Label htmlFor="from_time_local">From Time *</Label><Input id="from_time_local" name="from_time_local" type="time" required /></div>
//                                 <div><Label htmlFor="to_time_local">To Time *</Label><Input id="to_time_local" name="to_time_local" type="time" required /></div>
//                             </div>
                            
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div><Label htmlFor="half_day_threshold">Half Day (Hrs) *</Label><Input  id="half_day_threshold" name="half_day_threshold" type="number" defaultValue="0" required /></div>
//                                 <div><Label htmlFor="overtime_threshold">Overtime Threshold (Mins) *</Label><Input id="overtime_threshold" name="overtime_threshold" type="number" defaultValue="0" required /></div>
//                                 <div><Label htmlFor="punch_in_margin">Grace In (Mins) *</Label><Input id="punch_in_margin" name="punch_in_margin" type="number" defaultValue="0" required /></div>
//                                 <div><Label htmlFor="punch_out_margin">Grace Out (Mins) *</Label><Input id="punch_out_margin" name="punch_out_margin" type="number" defaultValue="0" required /></div>
//                             </div>
//                             <div className="text-sm text-muted-foreground space-y-1">
//             <p><strong>Half Day (Hrs):</strong> Minimum hours required to count as a half-day.</p>
//             <p><strong>Overtime Threshold (Mins):</strong> Minutes beyond shift end to count as overtime.</p>
//             <p><strong>Grace In (Mins):</strong> Allowable minutes late at shift start without penalty.</p>
//             <p><strong>Grace Out (Mins):</strong> Allowable minutes early at shift end without penalty.</p>
//           </div>
//                             <DialogFooter>
                            
//                             <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
//                             <Button type="submit">Create Shift</Button>
//                             </DialogFooter>
//                         </form>
//                     </DialogContent>
//                 </Dialog>
//             </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="text-center">Shift Name</TableHead>
//                 <TableHead className="text-center">Timings ({selectedTimezone})</TableHead>
//                 <TableHead className="text-center">Duration</TableHead>
//                 <TableHead className="text-center">Half-Day</TableHead>
//                 <TableHead className="text-center">Margin</TableHead>
//                 <TableHead className="text-center">Overtime Threshold</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {shifts.map((shift) => (
//                 <TableRow key={shift.id}>
//                   <TableCell className="font-medium text-center">{shift.name}</TableCell>
//                   <TableCell className="text-center">{formatTimeInTimezone(shift.from_time, selectedTimezone!)} - {formatTimeInTimezone(shift.to_time, selectedTimezone!)}</TableCell>
//                   <TableCell className="text-center">{calculateDuration(shift.from_time, shift.to_time)}</TableCell>
//                   <TableCell className="text-center">{shift.half_day_threshold}h</TableCell>
                  
//                   <TableCell className="text-center">{shift.punch_in_margin.toString().split('.')[0]}m/{shift.punch_out_margin.toString().split('.')[0]}m</TableCell>
//                   <TableCell className="text-center">{shift.overtime_threshold}h</TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button
//                         variant="ghost" size="sm"
//                         onClick={() => { setSelectedShift(shift); setEditDialogOpen(true); }}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm" onClick={() => handleDeleteShift(shift.id)}>
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
                  
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Shift: {selectedShift?.name}</DialogTitle>
//             <DialogDescription>Update the shift details. Timings cannot be edited after creation.</DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleEditShift} className="space-y-4 py-4">
//                <div><Label htmlFor="name">Shift Name</Label><Input id="name" name="name" defaultValue={selectedShift?.name} required /></div>
//                <div><Label>From Time</Label><Input type="time" id="from_time_local" name="from_time_local" defaultValue={formatUtcTimeToZone(selectedShift?.from_time,selectedTimezone!)}  /></div>
//                <div><Label>To Time </Label><Input type="time" id="to_time_local" name="to_time_local" defaultValue={formatUtcTimeToZone(selectedShift?.to_time,selectedTimezone!)}  /></div>
//                 <div className="grid grid-cols-2 gap-4">
//                     <div><Label htmlFor="half_day_threshold">Half Day (Hrs)</Label><Input id="half_day_threshold" name="half_day_threshold" type="number" defaultValue={selectedShift?.half_day_threshold} required /></div>
//                     <div><Label htmlFor="overtime_threshold">Overtime Threshold (Mins)</Label><Input id="overtime_threshold" name="overtime_threshold" type="number" defaultValue={selectedShift?.overtime_threshold} required /></div>
//                     <div><Label htmlFor="punch_in_margin">Grace In (Mins)</Label><Input id="punch_in_margin" name="punch_in_margin" type="number" defaultValue={selectedShift?.punch_in_margin} required /></div>
//                     <div><Label htmlFor="punch_out_margin">Grace Out (Mins)</Label><Input id="punch_out_margin" name="punch_out_margin" type="number" defaultValue={selectedShift?.punch_out_margin} required /></div>
//                 </div>
//                 <div className="text-sm text-muted-foreground space-y-1">
//             <p><strong>Half Day (Hrs):</strong> Minimum hours required to count as a half-day.</p>
//             <p><strong>Overtime Threshold (Mins):</strong> Minutes beyond shift end to count as overtime.</p>
//             <p><strong>Grace In (Mins):</strong> Allowable minutes late at shift start without penalty.</p>
//             <p><strong>Grace Out (Mins):</strong> Allowable minutes early at shift end without penalty.</p>
//           </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//               <Button type="submit">Update Shift</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Edit, Trash2, Clock, AlertCircle, Globe } from "lucide-react";
import { getShifts, createShift, updateShift, deleteShift, type Shift } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
  "Australia/Sydney"
];

export function ShiftsPage() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(
    localStorage.getItem("selectedTimezone") || "UTC"
  );
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const canManageShifts = hasPermission("shift.manage");

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
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const shiftsData = await getShifts();
      setShifts(shiftsData);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to fetch shifts: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [canManageShifts]);

  const handleCreateShift = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingCreate(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      from_time_local: formData.get("from_time_local") as string,
      to_time_local: formData.get("to_time_local") as string,
      timezone: selectedTimezone ?? "UTC",
      half_day_threshold: Number(formData.get("half_day_threshold")),
      punch_in_margin: Number(formData.get("punch_in_margin")),
      punch_out_margin: Number(formData.get("punch_out_margin")),
      overtime_threshold: Number(formData.get("overtime_threshold")),
    };

    try {
      await createShift(data);
      toast({ title: "Success", description: "Shift created successfully." });
      setCreateDialogOpen(false);
      fetchShifts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create shift.", variant: "destructive" });
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleEditShift = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShift) return;
    setIsSubmittingEdit(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      from_time_local: formData.get("from_time_local") as string,
      to_time_local: formData.get("to_time_local") as string,
      timezone: selectedTimezone ?? "UTC",
      name: formData.get("name") as string,
      half_day_threshold: Number(formData.get("half_day_threshold")),
      punch_in_margin: Number(formData.get("punch_in_margin")),
      punch_out_margin: Number(formData.get("punch_out_margin")),
      overtime_threshold: Number(formData.get("overtime_threshold")),
    };

    try {
      await updateShift(selectedShift.id, data);
      toast({ title: "Success", description: "Shift updated successfully." });
      setEditDialogOpen(false);
      setSelectedShift(null);
      fetchShifts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update shift.", variant: "destructive" });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteShift = async (id: number) => {
    if (!confirm("Are you sure you want to delete this shift? This cannot be undone.")) return;
    try {
      await deleteShift(id);
      toast({ title: "Success", description: "Shift deleted successfully." });
      fetchShifts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete shift.", variant: "destructive" });
    }
  };

  const formatTimeInTimezone = (utcTime: string, timeZone: string): string => {
    const [hours, minutes, seconds] = utcTime.split(":").map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, seconds, 0);
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone,
    }).format(date);
  };

  function formatUtcTimeToZone(timeString: string | undefined, timeZone: string) {
    if (timeString !== undefined) {
      const utcDate = new Date(`1970-01-01T${timeString}Z`);
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone,
      }).format(utcDate);
    }
  }

  const calculateDuration = (fromTime: string, toTime: string): string => {
    const from = new Date(`1970-01-01T${fromTime}Z`);
    let to = new Date(`1970-01-01T${toTime}Z`);
    if (to < from) {
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
        <AlertDescription>You don't have permission to manage shifts.</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                  <div>
                    <Label htmlFor="name">Shift Name *</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from_time_local">From Time *</Label>
                      <Input id="from_time_local" name="from_time_local" type="time" required />
                    </div>
                    <div>
                      <Label htmlFor="to_time_local">To Time *</Label>
                      <Input id="to_time_local" name="to_time_local" type="time" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="half_day_threshold">Half Day (Hrs) *</Label>
                      <Input id="half_day_threshold" name="half_day_threshold" type="number" defaultValue="0" required />
                    </div>
                    <div>
                      <Label htmlFor="overtime_threshold">Overtime Threshold (Mins) *</Label>
                      <Input id="overtime_threshold" name="overtime_threshold" type="number" defaultValue="0" required />
                    </div>
                    <div>
                      <Label htmlFor="punch_in_margin">Grace In (Mins) *</Label>
                      <Input id="punch_in_margin" name="punch_in_margin" type="number" defaultValue="0" required />
                    </div>
                    <div>
                      <Label htmlFor="punch_out_margin">Grace Out (Mins) *</Label>
                      <Input id="punch_out_margin" name="punch_out_margin" type="number" defaultValue="0" required />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Half Day (Hrs):</strong> Minimum hours required to count as a half-day.</p>
                    <p><strong>Overtime Threshold (Mins):</strong> Minutes beyond shift end to count as overtime.</p>
                    <p><strong>Grace In (Mins):</strong> Allowable minutes late at shift start without penalty.</p>
                    <p><strong>Grace Out (Mins):</strong> Allowable minutes early at shift end without penalty.</p>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmittingCreate}>
                      {isSubmittingCreate ? <Clock className="h-4 w-4 animate-spin mr-2" /> : null}
                      Create Shift
                    </Button>
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
                <TableHead className="text-center">Shift Name</TableHead>
                <TableHead className="text-center">Timings ({selectedTimezone})</TableHead>
                <TableHead className="text-center">Duration</TableHead>
                <TableHead className="text-center">Half-Day</TableHead>
                <TableHead className="text-center">Margin</TableHead>
                <TableHead className="text-center">Overtime Threshold</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium text-center">{shift.name}</TableCell>
                  <TableCell className="text-center">
                    {formatTimeInTimezone(shift.from_time, selectedTimezone!)} - {formatTimeInTimezone(shift.to_time, selectedTimezone!)}
                  </TableCell>
                  <TableCell className="text-center">{calculateDuration(shift.from_time, shift.to_time)}</TableCell>
                  <TableCell className="text-center">{shift.half_day_threshold}h</TableCell>
                  <TableCell className="text-center">
                    {shift.punch_in_margin.toString().split(".")[0]}m/{shift.punch_out_margin.toString().split(".")[0]}m
                  </TableCell>
                  <TableCell className="text-center">{shift.overtime_threshold}h</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedShift(shift);
                          setEditDialogOpen(true);
                        }}
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
            <div>
              <Label htmlFor="name">Shift Name</Label>
              <Input id="name" name="name" defaultValue={selectedShift?.name} required />
            </div>
            <div>
              <Label>From Time</Label>
              <Input
                type="time"
                id="from_time_local"
                name="from_time_local"
                defaultValue={formatUtcTimeToZone(selectedShift?.from_time, selectedTimezone!)}
              />
            </div>
            <div>
              <Label>To Time</Label>
              <Input
                type="time"
                id="to_time_local"
                name="to_time_local"
                defaultValue={formatUtcTimeToZone(selectedShift?.to_time, selectedTimezone!)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="half_day_threshold">Half Day (Hrs)</Label>
                <Input
                  id="half_day_threshold"
                  name="half_day_threshold"
                  type="number"
                  defaultValue={selectedShift?.half_day_threshold}
                  required
                />
              </div>
              <div>
                <Label htmlFor="overtime_threshold">Overtime Threshold (Mins)</Label>
                <Input
                  id="overtime_threshold"
                  name="overtime_threshold"
                  type="number"
                  defaultValue={selectedShift?.overtime_threshold}
                  required
                />
              </div>
              <div>
                <Label htmlFor="punch_in_margin">Grace In (Mins)</Label>
                <Input
                  id="punch_in_margin"
                  name="punch_in_margin"
                  type="number"
                  defaultValue={selectedShift?.punch_in_margin}
                  required
                />
              </div>
              <div>
                <Label htmlFor="punch_out_margin">Grace Out (Mins)</Label>
                <Input
                  id="punch_out_margin"
                  name="punch_out_margin"
                  type="number"
                  defaultValue={selectedShift?.punch_out_margin}
                  required
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Half Day (Hrs):</strong> Minimum hours required to count as a half-day.</p>
              <p><strong>Overtime Threshold (Mins):</strong> Minutes beyond shift end to count as overtime.</p>
              <p><strong>Grace In (Mins):</strong> Allowable minutes late at shift start without penalty.</p>
              <p><strong>Grace Out (Mins):</strong> Allowable minutes early at shift end without penalty.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingEdit}>
                {isSubmittingEdit ? <Clock className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Shift
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
