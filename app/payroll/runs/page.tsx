// "use client"

// import * as React from "react";
// import Link from "next/link";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Plus, ArrowRight, Rocket } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { createPayrollCycle, getPayrollCycles, getPayrollGroups, type PayrollCycle, type PayrollGroup } from "@/lib/api";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export default function PayrollRunsPage() {
//     const { toast } = useToast();
//     const [runs, setRuns] = React.useState<PayrollCycle[]>([]);
//     const [payrollGroups, setPayrollGroups] = React.useState<PayrollGroup[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    
//     // Updated formData state to include group_ids
//     const [formData, setFormData] = React.useState<{
//         cycle_name: string;
//         start_date: string;
//         end_date: string;
//         group_ids: number[];
//     }>({ cycle_name: '', start_date: '', end_date: '', group_ids: [] });

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const [runsData, groupsData] = await Promise.all([
//                 getPayrollCycles(),
//                 getPayrollGroups()
//             ]);
//             setRuns(runsData);
//             setPayrollGroups(groupsData);
//         } catch (error: any) {
//             toast({ title: "Error", description: `Could not load payroll data: ${error.message}`, variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);
    
//     const handleGroupToggle = (groupId: number) => {
//         setFormData(prev => ({
//             ...prev,
//             group_ids: prev.group_ids.includes(groupId)
//                 ? prev.group_ids.filter(id => id !== groupId)
//                 : [...prev.group_ids, groupId]
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (formData.group_ids.length === 0) {
//             toast({ title: "Validation Error", description: "You must select at least one payroll group.", variant: "destructive"});
//             return;
//         }
//         try {
//             await createPayrollCycle(formData);
//             toast({ title: "Success", description: "Payroll cycle created successfully." });
//             fetchData();
//             setIsCreateDialogOpen(false);
//             setFormData({ cycle_name: '', start_date: '', end_date: '', group_ids: [] }); // Reset form
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to create cycle: ${error.message}`, variant: "destructive" });
//         }
//     }

//     return (
//         <MainLayout>
//              <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <Rocket className="h-8 w-8" />
//                         <div>
//                             <h1 className="text-3xl font-bold">Payroll Runs</h1>
//                             <p className="text-muted-foreground">Manage and execute monthly payroll cycles.</p>
//                         </div>
//                     </div>
//                     <Button onClick={() => setIsCreateDialogOpen(true)}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         Create New Cycle
//                     </Button>
//                 </div>
//                 <Card>
//                     <CardHeader><CardTitle>All Payroll Cycles</CardTitle></CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader><TableRow><TableHead>Cycle Name</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
//                             <TableBody>
//                                 {runs.length === 0?
//                                 <TableCell colSpan={4} className="text-center h-24">No Cycles Found</TableCell>
//                               :
//                               runs.map(run => (
//                                     <TableRow key={run.id}>
//                                         <TableCell>{run.cycle_name}</TableCell>
//                                         <TableCell>{new Date(run.start_date).toLocaleDateString()} - {new Date(run.end_date).toLocaleDateString()}</TableCell>
//                                         <TableCell>{run.status}</TableCell>
//                                         <TableCell className="text-right">
//                                             <Button asChild variant="outline" size="sm">
//                                                 <Link href={`/payroll/runs/${run.id}`}>Manage Cycle <ArrowRight className="h-4 w-4 ml-2" /></Link>
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//              </div>
//              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//                  <DialogContent className="sm:max-w-lg">
//                     <DialogHeader><DialogTitle>Create New Payroll Cycle</DialogTitle></DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4 py-4">
//                         <div className="grid gap-2"><Label>Cycle Name</Label><Input value={formData.cycle_name} onChange={e => setFormData({...formData, cycle_name: e.target.value})} placeholder="e.g., October 2025 Payroll" required /></div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2"><Label>Start Date</Label><Input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required /></div>
//                             <div className="grid gap-2"><Label>End Date</Label><Input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required /></div>
//                         </div>
//                         <div className="grid gap-2">
//                             <Label>Include Payroll Groups</Label>
//                             <ScrollArea className="h-32 rounded-md border p-4">
//                                 <div className="space-y-2">
//                                     {payrollGroups.map(group => (
//                                         <div key={group.id} className="flex items-center space-x-2">
//                                             <Checkbox
//                                                 id={`group-${group.id}`}
//                                                 checked={formData.group_ids.includes(group.id)}
//                                                 onCheckedChange={() => handleGroupToggle(group.id)}
//                                             />
//                                             <label htmlFor={`group-${group.id}`} className="text-sm font-medium leading-none">
//                                                 {group.group_name}
//                                             </label>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </ScrollArea>
//                         </div>
//                         <DialogFooter><Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button><Button type="submit">Create</Button></DialogFooter>
//                     </form>
//                  </DialogContent>
//              </Dialog>
//         </MainLayout>
//     );
// }



"use client"

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowRight, Rocket, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createPayrollCycle, getPayrollCycles, getPayrollGroups, type PayrollCycle, type PayrollGroup } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function PayrollRunsPage() {
    const { toast } = useToast();
    const [runs, setRuns] = React.useState<PayrollCycle[]>([]);
    const [payrollGroups, setPayrollGroups] = React.useState<PayrollGroup[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    
    const [formData, setFormData] = React.useState<{
        cycle_name: string;
        start_date: string;
        end_date: string;
        group_ids: number[];
    }>({ cycle_name: '', start_date: '', end_date: '', group_ids: [] });

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const [runsData, groupsData] = await Promise.all([
                getPayrollCycles(),
                getPayrollGroups()
            ]);
            setRuns(runsData);
            setPayrollGroups(groupsData);
        } catch (error: any) {
            toast({ title: "Error", description: `Could not load payroll data: ${error.message}`, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleGroupToggle = (groupId: number) => {
        setFormData(prev => ({
            ...prev,
            group_ids: prev.group_ids.includes(groupId)
                ? prev.group_ids.filter(id => id !== groupId)
                : [...prev.group_ids, groupId]
        }));
    };

    const resetForm = () => {
        setFormData({ cycle_name: '', start_date: '', end_date: '', group_ids: [] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.group_ids.length === 0) {
            toast({ title: "Validation Error", description: "You must select at least one payroll group.", variant: "destructive"});
            return;
        }
        setIsSubmitting(true);
        try {
            await createPayrollCycle(formData);
            toast({ title: "Success", description: "Payroll cycle created successfully." });
            fetchData();
            setIsCreateDialogOpen(false);
            resetForm();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to create cycle: ${error.message}`, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Rocket className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">
                                {isLoading ? <Skeleton className="h-8 w-40" /> : "Payroll Runs"}
                            </h1>
                            <p className="text-muted-foreground">
                                {isLoading ? <Skeleton className="h-4 w-64 mt-1" /> : "Manage and execute monthly payroll cycles."}
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => setIsCreateDialogOpen(true)}
                        disabled={isLoading || isSubmitting}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Cycle
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Payroll Cycles</CardTitle>
                        <CardDescription>
                            {isLoading ? <Skeleton className="h-4 w-48" /> : "View and manage your payroll cycles"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cycle Name</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : runs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            No payroll cycles found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    runs.map(run => (
                                        <TableRow key={run.id}>
                                            <TableCell className="font-medium">{run.cycle_name}</TableCell>
                                            <TableCell>
                                                {new Date(run.start_date).toLocaleDateString()} - {new Date(run.end_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    run.status === 'Paid' ? 'bg-green-200 text-green-800' :
                                                    run.status === 'Finalized' ? 'bg-orange-400 text-black' :
                                                    run.status === 'Review' ? 'bg-yellow-400 text-black' :
                                                    run.status === 'Auditing' ? 'bg-red-400 text-white' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {run.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="outline" size="sm" disabled={isSubmitting}>
                                                    <Link href={`/payroll/runs/${run.id}`}>
                                                        Manage Cycle <ArrowRight className="h-4 w-4 ml-2" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
             </div>

             <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                 <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create New Payroll Cycle</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cycleName">Cycle Name</Label>
                            {isLoading ? (
                                <Skeleton className="h-10 w-full" />
                            ) : (
                                <Input
                                    id="cycleName"
                                    value={formData.cycle_name}
                                    onChange={e => setFormData({...formData, cycle_name: e.target.value})}
                                    placeholder="e.g., October 2025 Payroll"
                                    required
                                    disabled={isSubmitting}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                {isLoading ? (
                                    <Skeleton className="h-10 w-full" />
                                ) : (
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={e => setFormData({...formData, start_date: e.target.value})}
                                        required
                                        disabled={isSubmitting}
                                    />
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="endDate">End Date</Label>
                                {isLoading ? (
                                    <Skeleton className="h-10 w-full" />
                                ) : (
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.end_date}
                                        onChange={e => setFormData({...formData, end_date: e.target.value})}
                                        required
                                        disabled={isSubmitting}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Include Payroll Groups</Label>
                            {isLoading ? (
                                <ScrollArea className="h-32 rounded-md border p-4">
                                    <div className="space-y-2">
                                        {Array.from({ length: 3 }).map((_, idx) => (
                                            <Skeleton key={idx} className="h-5 w-full" />
                                        ))}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <ScrollArea className="h-32 rounded-md border p-4">
                                    <div className="space-y-2">
                                        {payrollGroups.map(group => (
                                            <div key={group.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`group-${group.id}`}
                                                    checked={formData.group_ids.includes(group.id)}
                                                    onCheckedChange={() => handleGroupToggle(group.id)}
                                                    disabled={isSubmitting}
                                                />
                                                <label 
                                                    htmlFor={`group-${group.id}`} 
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {group.group_name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>

                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                    setIsCreateDialogOpen(false);
                                    resetForm();
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                 </DialogContent>
             </Dialog>
        </MainLayout>
    );
}
