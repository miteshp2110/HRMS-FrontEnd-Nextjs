// "use client"

// import * as React from "react"
// import { useAuth } from "@/lib/auth-context"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { CalendarDays, Briefcase, Plus, AlertCircle } from "lucide-react"
// import { getHolidays, createHoliday, deleteHoliday, getWorkWeek, updateWorkWeek, type Holiday } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { cn } from "@/lib/utils"

// type WorkWeek = { day_of_week: string; is_working_day: boolean }[];

// export function CompanyCalendarPage() {
//   const { hasPermission } = useAuth()
//   const { toast } = useToast()
  
//   const [year, setYear] = React.useState(new Date().getFullYear())
//   const [holidays, setHolidays] = React.useState<Holiday[]>([])
//   const [workWeek, setWorkWeek] = React.useState<WorkWeek>([])
//   const [isLoading, setIsLoading] = React.useState(true)
//   const [isDialogOpen, setIsDialogOpen] = React.useState(false)

//   const canManageCalendar = hasPermission("calender.manage")

//   const fetchData = React.useCallback(async (currentYear: number) => {
//     if (!canManageCalendar) {
//         setIsLoading(false);
//         return;
//     }
//     setIsLoading(true)
//     try {
//       const [holidaysData, workWeekData] = await Promise.all([
//         getHolidays(currentYear),
//         getWorkWeek()
//       ])
//       setHolidays(holidaysData)
//       setWorkWeek(workWeekData.sort((a, b) => { // Sort days consistently
//           const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
//           return days.indexOf(a.day_of_week) - days.indexOf(b.day_of_week);
//       }));
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to load calendar data: ${error.message}`, variant: "destructive" })
//     } finally {
//       setIsLoading(false)
//     }
//   }, [canManageCalendar, toast])

//   React.useEffect(() => {
//     fetchData(year)
//   }, [year, fetchData])

//   const handleCreateHoliday = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const name = formData.get("name") as string;
//     const holiday_date = formData.get("holiday_date") as string;
    
//     try {
//         await createHoliday({ name, holiday_date });
//         toast({ title: "Success", description: "Holiday created successfully." });
//         setIsDialogOpen(false);
//         fetchData(year);
//     } catch (error: any) {
//         toast({ title: "Error", description: `Failed to create holiday: ${error.message}`, variant: "destructive" });
//     }
//   }

//   const handleDeleteHoliday = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this holiday?")) return;
//     try {
//         await deleteHoliday(id);
//         toast({ title: "Success", description: "Holiday deleted successfully." });
//         fetchData(year);
//     } catch (error: any) {
//         toast({ title: "Error", description: `Failed to delete holiday: ${error.message}`, variant: "destructive" });
//     }
//   }
  
//   const handleWorkWeekChange = (day: string, checked: boolean) => {
//     setWorkWeek(current => 
//         current.map(d => d.day_of_week === day ? { ...d, is_working_day: checked } : d)
//     );
//   }

//   const handleSaveWorkWeek = async () => {
//     try {
//         await updateWorkWeek(workWeek);
//         toast({ title: "Success", description: "Work week settings updated." });
//         fetchData(year); // Refetch to update stats
//     } catch(error: any) {
//         toast({ title: "Error", description: `Failed to save settings: ${error.message}`, variant: "destructive" });
//     }
//   }


//   const { totalWorkingDays, totalHolidays } = React.useMemo(() => {
//     if (!workWeek.length) return { totalWorkingDays: 0, totalHolidays: 0 };

//     let workingDays = 0;
//     const holidaySet = new Set(holidays.map(h => h.holiday_date.split('T')[0]));
//     const nonWorkingWeekDays = new Set(workWeek.filter(d => !d.is_working_day).map(d => d.day_of_week));

//     const dayNameToIndex: { [key: string]: number } = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

//     for (let month = 0; month < 12; month++) {
//         const daysInMonth = new Date(year, month + 1, 0).getDate();
//         for (let day = 1; day <= daysInMonth; day++) {
//             const currentDate = new Date(year, month, day);
//             const dateString = currentDate.toISOString().split('T')[0];
//             const dayOfWeekIndex = currentDate.getDay();
            
//             const dayOfWeekName = Object.keys(dayNameToIndex).find(key => dayNameToIndex[key] === dayOfWeekIndex);

//             if (!holidaySet.has(dateString) && !nonWorkingWeekDays.has(dayOfWeekName!)) {
//                 workingDays++;
//             }
//         }
//     }
//     return { totalWorkingDays: workingDays, totalHolidays: holidays.length };
//   }, [year, holidays, workWeek]);


//   if (!canManageCalendar) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Access Denied</AlertTitle>
//         <AlertDescription>You don't have permission to manage the company calendar.</AlertDescription>
//       </Alert>
//     )
//   }

//   const holidayMap = new Map(holidays.map(h => [h.holiday_date.split('T')[0], h.name]));
//   const nonWorkingDayIndices = workWeek.filter(d => !d.is_working_day).map(d => ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(d.day_of_week));


//   return (
//     <Tabs defaultValue="calendar">
//         <div className="flex justify-between items-center">
//             <TabsList>
//                 <TabsTrigger value="calendar">Calendar View</TabsTrigger>
//                 <TabsTrigger value="settings">Work Week Settings</TabsTrigger>
//             </TabsList>
//             <div className="flex items-center gap-2">
//                 <Input
//                     type="number"
//                     value={year}
//                     onChange={(e) => setYear(Number(e.target.value))}
//                     className="w-28"
//                 />
//             </div>
//         </div>

//         <TabsContent value="calendar" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Card><CardHeader><CardTitle>{year} Overview</CardTitle></CardHeader><CardContent><p>A summary of the year.</p></CardContent></Card>
//                 <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Working Days</CardTitle><Briefcase className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalWorkingDays}</div></CardContent></Card>
//                 <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Holidays</CardTitle><CalendarDays className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalHolidays}</div></CardContent></Card>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {Array.from({ length: 12 }).map((_, monthIndex) => {
//                     const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'long' });
//                     const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
//                     const firstDay = new Date(year, monthIndex, 1).getDay();
//                     const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//                     const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

//                     return (
//                         <Card key={monthIndex} className="flex flex-col">
//                             <CardHeader><CardTitle className="text-center">{monthName}</CardTitle></CardHeader>
//                             <CardContent className="grid grid-cols-7 gap-2 text-center text-sm">
//                                 {["S", "M", "T", "W", "T", "F", "S"].map(d => <div key={d} className="font-semibold text-muted-foreground">{d}</div>)}
//                                 {emptyDays.map(d => <div key={`empty-${d}`}></div>)}
//                                 {monthDays.map(day => {
//                                     const date = new Date(year, monthIndex, day);
//                                     const dateString = date.toISOString().split('T')[0];
//                                     const isHoliday = holidayMap.has(dateString);
//                                     const isWeekend = nonWorkingDayIndices.includes(date.getDay());
//                                     const dayClasses = cn(
//                                         "flex items-center justify-center h-8 w-8 rounded-full",
//                                         isHoliday && "bg-purple-500 text-white",
//                                         !isHoliday && isWeekend && "bg-muted text-muted-foreground",
//                                     );
//                                     return (
//                                         <TooltipProvider key={day}>
//                                             <Tooltip>
//                                                 <TooltipTrigger asChild>
//                                                     <div className={dayClasses}>{day}</div>
//                                                 </TooltipTrigger>
//                                                 {isHoliday && <TooltipContent><p>{holidayMap.get(dateString)}</p></TooltipContent>}
//                                             </Tooltip>
//                                         </TooltipProvider>
//                                     )
//                                 })}
//                             </CardContent>
//                         </Card>
//                     )
//                 })}
//             </div>

//         </TabsContent>
//         <TabsContent value="settings" className="space-y-6">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Work Week Settings</CardTitle>
//                     <CardDescription>Define which days of the week are considered working days.</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     {workWeek.map(day => (
//                         <div key={day.day_of_week} className="flex items-center justify-between p-4 border rounded-lg">
//                             <Label htmlFor={day.day_of_week} className="capitalize text-base font-medium">{day.day_of_week}</Label>
//                             <Switch 
//                                 id={day.day_of_week}
//                                 checked={day.is_working_day}
//                                 onCheckedChange={(checked) => handleWorkWeekChange(day.day_of_week, checked)}
//                             />
//                         </div>
//                     ))}
//                 </CardContent>
//                 <CardFooter>
//                     <Button onClick={handleSaveWorkWeek}>Save Work Week</Button>
//                 </CardFooter>
//             </Card>
//         </TabsContent>
//     </Tabs>
//   )
// }



"use client"

import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarDays, Briefcase, Plus, AlertCircle, Trash2 } from "lucide-react"
import { getHolidays, createHoliday, deleteHoliday, getWorkWeek, updateWorkWeek, type Holiday } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table"

type WorkWeek = { day_of_week: string; is_working_day: boolean }[];

export function CompanyCalendarPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [holidays, setHolidays] = React.useState<Holiday[]>([])
  const [workWeek, setWorkWeek] = React.useState<WorkWeek>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const canManageCalendar = hasPermission("calender.manage")

  const fetchData = React.useCallback(async (currentYear: number) => {
    if (!canManageCalendar) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true)
    try {
      const [holidaysData, workWeekData] = await Promise.all([
        getHolidays(currentYear),
        getWorkWeek()
      ])
      setHolidays(holidaysData)
      setWorkWeek(workWeekData.sort((a, b) => {
          const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
          return days.indexOf(a.day_of_week) - days.indexOf(b.day_of_week);
      }));
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to load calendar data: ${error.message}`, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [canManageCalendar, toast])

  React.useEffect(() => {
    fetchData(year)
  }, [year, fetchData])

  const handleCreateHoliday = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const holiday_date = formData.get("holiday_date") as string;
    
    try {
        await createHoliday({ name, holiday_date });
        toast({ title: "Success", description: "Holiday created successfully." });
        setIsCreateDialogOpen(false);
        fetchData(year);
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to create holiday: ${error.message}`, variant: "destructive" });
    }
  }

  const handleDeleteHoliday = async (id: number) => {
    if (!confirm("Are you sure you want to delete this holiday?")) return;
    try {
        await deleteHoliday(id);
        toast({ title: "Success", description: "Holiday deleted successfully." });
        fetchData(year);
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to delete holiday: ${error.message}`, variant: "destructive" });
    }
  }
  
  const handleWorkWeekChange = (day: string, checked: boolean) => {
    setWorkWeek(current => 
        current.map(d => d.day_of_week === day ? { ...d, is_working_day: checked } : d)
    );
  }

  const handleSaveWorkWeek = async () => {
    try {
        await updateWorkWeek(workWeek);
        toast({ title: "Success", description: "Work week settings updated." });
        fetchData(year);
    } catch(error: any) {
        toast({ title: "Error", description: `Failed to save settings: ${error.message}`, variant: "destructive" });
    }
  }

  const { totalWorkingDays, totalHolidays } = React.useMemo(() => {
    if (!workWeek.length) return { totalWorkingDays: 0, totalHolidays: 0 };
    let workingDays = 0;
    const holidaySet = new Set(holidays.map(h => h.holiday_date.split('T')[0]));
    const nonWorkingWeekDays = new Set(workWeek.filter(d => !d.is_working_day).map(d => d.day_of_week));
    const dayNameToIndex: { [key: string]: number } = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const dateString = currentDate.toISOString().split('T')[0];
            const dayOfWeekIndex = currentDate.getDay();
            const dayOfWeekName = Object.keys(dayNameToIndex).find(key => dayNameToIndex[key] === dayOfWeekIndex);
            if (!holidaySet.has(dateString) && !nonWorkingWeekDays.has(dayOfWeekName!)) {
                workingDays++;
            }
        }
    }
    return { totalWorkingDays: workingDays, totalHolidays: holidays.length };
  }, [year, holidays, workWeek]);

  if (!canManageCalendar) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You don't have permission to manage the company calendar.</AlertDescription>
      </Alert>
    )
  }

  const holidayMap = new Map(holidays.map(h => [h.holiday_date.split('T')[0], h.name]));
  const nonWorkingDayIndices = workWeek.filter(d => !d.is_working_day).map(d => ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(d.day_of_week));

  return (
    <Tabs defaultValue="calendar">
        <div className="flex justify-between items-center mb-6">
            <TabsList>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">Holiday List</TabsTrigger>
                <TabsTrigger value="settings">Work Week Settings</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Label htmlFor="year-input">Year</Label>
                    <Input
                        id="year-input"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-28"
                    />
                </div>
                 <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" />Add Holiday</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Holiday</DialogTitle>
                            <DialogDescription>Add a new company holiday for the year {year}.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateHoliday} className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="name">Holiday Name</Label>
                                <Input id="name" name="name" required />
                            </div>
                            <div>
                                <Label htmlFor="holiday_date">Date</Label>
                                <Input id="holiday_date" name="holiday_date" type="date" required />
                            </div>
                             <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Create Holiday</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <TabsContent value="calendar" className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card><CardHeader><CardTitle className="text-sm font-medium">Total Working Days</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalWorkingDays}</div><p className="text-xs text-muted-foreground">for {year}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Total Holidays</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalHolidays}</div><p className="text-xs text-muted-foreground">for {year}</p></CardContent></Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, monthIndex) => {
                    const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'long' });
                    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
                    const firstDay = new Date(year, monthIndex, 1).getDay();
                    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
                    return (
                        <Card key={monthIndex} className="flex flex-col">
                            <CardHeader><CardTitle className="text-center">{monthName}</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-7 gap-1 text-center text-sm">
                                {["S", "M", "T", "W", "T", "F", "S"].map(d => <div key={d} className="font-semibold text-muted-foreground h-8 w-8 flex items-center justify-center">{d}</div>)}
                                {emptyDays.map(d => <div key={`empty-${d}`}></div>)}
                                {monthDays.map(day => {
                                    const date = new Date(year, monthIndex, day);
                                    const dateString = date.toISOString().split('T')[0];
                                    const isHoliday = holidayMap.has(dateString);
                                    const isWeekend = nonWorkingDayIndices.includes(date.getDay());
                                    const dayClasses = cn(
                                        "flex items-center justify-center h-8 w-8 rounded-full",
                                        isHoliday && "bg-purple-500 text-white",
                                        !isHoliday && isWeekend && "bg-muted text-muted-foreground",
                                    );
                                    return (
                                        <TooltipProvider key={day} delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className={dayClasses}>{day}</div>
                                                </TooltipTrigger>
                                                {isHoliday && <TooltipContent><p>{holidayMap.get(dateString)}</p></TooltipContent>}
                                            </Tooltip>
                                        </TooltipProvider>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Work Week Settings</CardTitle>
                    <CardDescription>Define which days of the week are considered working days for the whole company.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {workWeek.map(day => (
                        <div key={day.day_of_week} className="flex items-center justify-between p-4 border rounded-lg">
                            <Label htmlFor={day.day_of_week} className="capitalize text-base font-medium">{day.day_of_week}</Label>
                            <Switch 
                                id={day.day_of_week}
                                checked={day.is_working_day}
                                onCheckedChange={(checked) => handleWorkWeekChange(day.day_of_week, checked)}
                            />
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveWorkWeek}>Save Work Week</Button>
                </CardFooter>
            </Card>
        </TabsContent>

        {/* --- Start of Fix: Holiday List Tab --- */}
        <TabsContent value="list" className="space-y-6">
            <Card>
                 <CardHeader>
                    <CardTitle>Holiday List</CardTitle>
                    <CardDescription>A list of all holidays configured for {year}.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (<p>Loading holidays...</p>) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {holidays.length > 0 ? holidays.map(holiday => (
                                <TableRow key={holiday.id}>
                                    <TableCell>{new Date(holiday.holiday_date).toLocaleDateString(undefined, { timeZone: 'UTC' })}</TableCell>
                                    <TableCell className="font-medium">{holiday.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteHoliday(holiday.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                        No holidays added for {year}.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        {/* --- End of Fix --- */}
    </Tabs>
  )
}