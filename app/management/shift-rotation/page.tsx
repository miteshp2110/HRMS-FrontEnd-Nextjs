
// "use client"

// import * as React from "react"
// import { MainLayout } from "@/components/main-layout"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"
// import {
  
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
// } from "@/components/ui/sheet"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { toast } from "@/hooks/use-toast"
// import { Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"

// // Mock shifts and employees data
// const mockShifts = [
//   { id: 1, name: "Morning Shift (6 AM - 2 PM)" },
//   { id: 2, name: "Afternoon Shift (2 PM - 10 PM)" },
//   { id: 3, name: "Night Shift (10 PM - 6 AM)" },
// ]

// const mockEmployees = [
//   { id: 101, name: "Alice Johnson" },
//   { id: 102, name: "Bob Smith" },
//   { id: 103, name: "Charlie Davis" },
//   { id: 104, name: "Diana Prince" },
//   { id: 105, name: "Ethan Hunt" },
//   { id: 106, name: "Fiona Gallagher" },
// ]

// export default function ShiftRotationPage() {
//   const [selectedShiftId, setSelectedShiftId] = React.useState<number | null>(null)
//   const [selectedEmployeeIds, setSelectedEmployeeIds] = React.useState<Set<number>>(new Set())
//   const [isSending, setIsSending] = React.useState(false)
//   const [sheetOpen, setSheetOpen] = React.useState(false)
//   const [searchTerm, setSearchTerm] = React.useState("")

//   // Filter employees based on search term
//   const filteredEmployees = React.useMemo(() => {
//     const lowerSearch = searchTerm.toLowerCase()
//     return mockEmployees.filter((e) => e.name.toLowerCase().includes(lowerSearch))
//   }, [searchTerm])

//   const toggleEmployeeSelection = (id: number) => {
//     setSelectedEmployeeIds((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(id)) {
//         newSet.delete(id)
//       } else {
//         newSet.add(id)
//       }
//       return newSet
//     })
//   }

//   const handleSendShift = async () => {
//     if (!selectedShiftId) {
//       toast({
//         title: "Select a shift",
//         description: "Please select a shift to send employees to.",
//         variant: "destructive",
//       })
//       return
//     }
//     if (selectedEmployeeIds.size === 0) {
//       toast({
//         title: "Select employees",
//         description: "Please select at least one employee to send.",
//         variant: "destructive",
//       })
//       return
//     }
//     setIsSending(true)

//     // Simulate API call delay
//     try {
//       await new Promise((res) => setTimeout(res, 1500))
//       // Here you would send selectedEmployeeIds and selectedShiftId to your backend API.
//       toast({
//         title: "Shift Assigned",
//         description: `Sent ${selectedEmployeeIds.size} employee(s) to shift: ${
//           mockShifts.find((s) => s.id === selectedShiftId)?.name || ""
//         }`,
//         variant: "default",
//       })
//       // Reset selections after sending
//       setSelectedEmployeeIds(new Set())
//       setSelectedShiftId(null)
//       setSheetOpen(false)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to assign shift. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSending(false)
//     }
//   }

//   return (
//     <MainLayout>
//       <div className="space-y-6 max-w-4xl mx-auto">
//         <div className="flex items-center gap-4">
//           <h1 className="text-3xl font-bold">Shift Rotation</h1>
//           <p className="text-muted-foreground">
//             Manage and schedule employee shift rotations.
//           </p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Current Shift Assignments</CardTitle>
//             <CardDescription>
//               Select employees and assign them to a different shift.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="text-left p-3 border-b">Select</th>
//                     <th className="text-left p-3 border-b">Employee Name</th>
//                     <th className="text-left p-3 border-b">Current Shift</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {mockEmployees.map((emp) => {
//                     // For demo, assign random current shift
//                     const currentShift = mockShifts[emp.id % mockShifts.length]?.name || "N/A"
//                     return (
//                       <tr
//                         key={emp.id}
//                         className="hover:bg-muted cursor-pointer"
//                         onClick={() => toggleEmployeeSelection(emp.id)}
//                       >
//                         <td className="p-3 border-b">
//                           <Checkbox
//                             checked={selectedEmployeeIds.has(emp.id)}
//                             onCheckedChange={() => toggleEmployeeSelection(emp.id)}
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                         </td>
//                         <td className="p-3 border-b">{emp.name}</td>
//                         <td className="p-3 border-b">{currentShift}</td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-6 flex items-center gap-4">
//               <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
//                 <SheetTrigger asChild>
//                   <Button disabled={selectedEmployeeIds.size === 0}>Assign To Shift</Button>
//                 </SheetTrigger>
//                 <SheetContent  className="p-6">
//                   <SheetHeader>
//                     <SheetTitle>Assign Selected Employees to Shift</SheetTitle>
//                     <SheetDescription>
//                       Choose a shift and confirm the assignment.
//                     </SheetDescription>
//                   </SheetHeader>

//                   <div className="mt-4 space-y-4">
//                     <Select
//                       onValueChange={(value) => setSelectedShiftId(Number(value))}
//                       value={selectedShiftId?.toString() || ""}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select shift" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup>
//                           {mockShifts.map((shift) => (
//                             <SelectItem key={shift.id} value={shift.id.toString()}>
//                               {shift.name}
//                             </SelectItem>
//                           ))}
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>

//                     <div>
//                       <Label>Selected Employees ({selectedEmployeeIds.size})</Label>
//                       <div className="max-h-40 overflow-y-auto border rounded-md p-2 mt-1">
//                         {[...selectedEmployeeIds].map((id) => {
//                           const emp = mockEmployees.find((e) => e.id === id)
//                           return (
//                             <div key={id} className="text-sm py-0.5">
//                               {emp?.name}
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     <Button
//                       className="w-full mt-4"
//                       disabled={isSending}
//                       onClick={handleSendShift}
//                     >
//                       {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                       Confirm Assignment
//                     </Button>
//                   </div>
//                 </SheetContent>
//               </Sheet>

//               <Input
//                 placeholder="Search employees..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="max-w-xs"
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </MainLayout>
//   )
// }


"use client"

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, ArrowRight } from "lucide-react";
import { getAllShiftRotations, type ShiftRotation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ShiftRotationDashboardPage() {
    const { toast } = useToast();
    const [rotations, setRotations] = React.useState<ShiftRotation[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllShiftRotations();
            setRotations(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load shift rotations.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'Draft': 'bg-gray-100 text-gray-800',
            'Pending Approval': 'bg-yellow-100 text-yellow-800',
            'Approved': 'bg-blue-100 text-blue-800',
            'Executed': 'bg-green-100 text-green-800',
        };
        return <Badge className={statusMap[status] || ""}>{status}</Badge>;
    }

    return (
        <MainLayout>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <RefreshCw className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">Shift Rotations</h1>
                            <p className="text-muted-foreground">Manage and schedule employee shift changes.</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/management/shift-rotation/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Rotation
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader><CardTitle>All Rotations</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rotation Name</TableHead>
                                    <TableHead>Effective Date</TableHead>
                                    <TableHead>Employees</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24">Loading rotations...</TableCell></TableRow>
                                ) : 
                                  rotations.length === 0?
                                  <TableRow><TableCell colSpan={5} className="text-center h-24">No Record Found</TableCell></TableRow>
                                  :
                                  rotations.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.rotation_name}</TableCell>
                                        <TableCell>{new Date(item.effective_from).toLocaleDateString()}</TableCell>
                                        <TableCell>{item.employee_count}</TableCell>
                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/management/shift-rotation/${item.id}`}>
                                                    View Details <ArrowRight className="h-4 w-4 ml-2" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
             </div>
        </MainLayout>
    );
}
