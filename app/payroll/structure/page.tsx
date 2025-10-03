

// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Plus, Trash2, Users } from "lucide-react";
// import { 
//     getAllUserProfiles, // Changed from searchUsers
//     getEmployeeSalaryStructure, 
//     getPayrollComponentDefs, 
//     assignSalaryComponent, 
//     removeSalaryComponent,
//     type UserProfile, 
//     type EmployeeSalaryStructure,
//     type PayrollComponentDef,
//     type FormulaComponent
// } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { FormulaBuilder } from "@/components/payroll/formula-builder";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// export default function SalaryStructurePage() {
//     const { toast } = useToast();
//     const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]); // State to hold all users
//     const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(null);
//     const [structure, setStructure] = React.useState<EmployeeSalaryStructure[]>([]);
//     const [allComponents, setAllComponents] = React.useState<PayrollComponentDef[]>([]);
//     const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    
//     // Form state
//     const [componentId, setComponentId] = React.useState('');
//     const [calculationType, setCalculationType] = React.useState<'Fixed' | 'Percentage' | 'Formula'>('Fixed');
//     const [value, setValue] = React.useState('');
//     const [basedOn, setBasedOn] = React.useState('');
//     const [formula, setFormula] = React.useState<FormulaComponent[]>([]);

//     React.useEffect(() => {
//         // Fetch all components and all users on component mount
//         getPayrollComponentDefs().then(setAllComponents);
//         getAllUserProfiles().then(response => setAllUsers(response.data));
//     }, []);

//     const handleSelectUser = async (user: UserProfile) => {
//         setSelectedUser(user);
//         try {
//             const data = await getEmployeeSalaryStructure(user.id);
//             setStructure(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not fetch salary structure.", variant: "destructive"});
//         }
//     };
    
//     const handleRemove = async (componentId: number) => {
//         if (!selectedUser || !window.confirm("Remove this component from the structure?")) return;
//         try {
//             await removeSalaryComponent(selectedUser.id, componentId);
//             toast({ title: "Success", description: "Component removed." });
//             handleSelectUser(selectedUser); // Refresh
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to remove: ${error.message}`, variant: "destructive" });
//         }
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedUser) return;

//         let payload: any = {
//             component_id: Number(componentId),
//             calculation_type: calculationType,
//         };

//         if (calculationType === 'Fixed') payload.value = Number(value);
//         if (calculationType === 'Percentage') {
//             payload.value = Number(value);
//             payload.based_on_component_id = Number(basedOn);
//         }
//         if (calculationType === 'Formula') payload.custom_formula = formula;

//         try {
//             await assignSalaryComponent(selectedUser.id, payload);
//             toast({ title: "Success", description: "Salary structure updated." });
//             handleSelectUser(selectedUser);
//             setIsDialogOpen(false);
//         } catch (error: any) {
//              toast({ title: "Error", description: `Failed to save: ${error.message}`, variant: "destructive" });
//         }
//     };

//     const resetForm = () => {
//         setComponentId('');
//         setCalculationType('Fixed');
//         setValue('');
//         setBasedOn('');
//         setFormula([]);
//     }

//     const availableComponents = allComponents.filter(
//       (c) => !structure.some((s) => s.component_id === c.id)
//     );

//     return (
//         <MainLayout>
//              <div className="space-y-6">
//                  <div className="flex items-center gap-4">
//                     <Users className="h-8 w-8" />
//                     <div>
//                         <h1 className="text-3xl font-bold">Salary Structures</h1>
//                         <p className="text-muted-foreground">Assign and manage salary components for each employee.</p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <Card className="md:col-span-1">
//                         <CardHeader><CardTitle>Select Employee</CardTitle></CardHeader>
//                         <CardContent>
//                             <Command>
//                                 {/* The CommandInput can now be used to filter the client-side list */}
//                                 <CommandInput placeholder="Filter employees..." />
//                                 <ScrollArea className="h-96">
//                                     <CommandList>
//                                         <CommandEmpty>No results found.</CommandEmpty>
//                                         {allUsers.map(user => (
//                                             <CommandItem key={user.id} onSelect={() => handleSelectUser(user)} className="flex justify-between">
//                                                 <span>{user.first_name} {user.last_name}</span>
//                                                 <span className="text-xs text-muted-foreground">{user.full_employee_id}</span>
//                                             </CommandItem>
//                                         ))}
//                                     </CommandList>
//                                 </ScrollArea>
//                             </Command>
//                         </CardContent>
//                     </Card>

//                     <Card className="md:col-span-2">
//                         <CardHeader>
//                              <div className="flex justify-between items-center">
//                                 <div>
//                                     <CardTitle>Salary Structure for {selectedUser?.first_name || '...'}</CardTitle>
//                                     <CardDescription>Earnings and deductions for the selected employee.</CardDescription>
//                                 </div>
//                                 <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} disabled={!selectedUser}><Plus className="h-4 w-4 mr-2"/>Add Component</Button>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                              <Table>
//                                 <TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Type</TableHead><TableHead>Calculation</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
//                                 <TableBody>
//                                     {structure.map(s => (
//                                         <TableRow key={s.id}>
//                                             <TableCell>{s.component_name}</TableCell>
//                                             <TableCell>{s.component_type}</TableCell>
//                                             <TableCell>{s.calculation_type}</TableCell>
//                                             <TableCell className="text-right">
//                                                 <Button variant="ghost" size="icon" onClick={() => handleRemove(s.component_id)}><Trash2 className="h-4 w-4"/></Button>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                              </Table>
//                         </CardContent>
//                     </Card>
//                 </div>
//              </div>
//              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                  <DialogContent className="sm:max-w-2xl">
//                     <DialogHeader><DialogTitle>Add Salary Component</DialogTitle></DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4 py-4">
//                          <div className="grid gap-2">
//                             <Label>Component</Label>
//                             <Select onValueChange={setComponentId} required>
//                                 <SelectTrigger><SelectValue placeholder="Select component..."/></SelectTrigger>
//                                 <SelectContent>{availableComponents.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
//                             </Select>
//                         </div>
//                         <div className="grid gap-2">
//                             <Label>Calculation Type</Label>
//                             <Select value={calculationType} onValueChange={(v: any) => setCalculationType(v)} required>
//                                 <SelectTrigger><SelectValue/></SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="Fixed">Fixed Amount</SelectItem>
//                                     <SelectItem value="Percentage">Percentage</SelectItem>
//                                     <SelectItem value="Formula">Formula</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         {calculationType === 'Fixed' && <div className="grid gap-2"><Label>Amount</Label><Input type="number" value={value} onChange={e => setValue(e.target.value)} required/></div>}
                        
//                         {calculationType === 'Percentage' && (
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="grid gap-2"><Label>Percentage (%)</Label><Input type="number" value={value} onChange={e => setValue(e.target.value)} required/></div>
//                                 <div className="grid gap-2">
//                                     <Label>Based On</Label>
//                                     <Select onValueChange={setBasedOn} required>
//                                         <SelectTrigger><SelectValue placeholder="Select component..."/></SelectTrigger>
//                                         <SelectContent>{structure.filter(s => s.component_type === 'earning').map(c => <SelectItem key={c.component_id} value={String(c.component_id)}>{c.component_name}</SelectItem>)}</SelectContent>
//                                     </Select>
//                                 </div>
//                             </div>
//                         )}
                        
//                         {calculationType === 'Formula' && <FormulaBuilder formula={formula} setFormula={setFormula} components={allComponents} />}

//                         <DialogFooter>
//                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                             <Button type="submit">Add to Structure</Button>
//                         </DialogFooter>
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
import { getAllUserProfiles, type UserProfile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Users, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SalaryStructureListPage() {
    const { toast } = useToast();
    const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        getAllUserProfiles(1, 1000) // Fetch all users
            .then(response => setAllUsers(response.data))
            .catch(err => toast({ title: "Error", description: "Could not load employees.", variant: "destructive" }))
            .finally(() => setIsLoading(false));
    }, [toast]);

    return (
        <MainLayout>
             <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <Users className="h-8 w-8" />
                    <div>
                        <h1 className="text-3xl font-bold">Salary Structures</h1>
                        <p className="text-muted-foreground">Select an employee to view or manage their salary structure.</p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>All Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[60vh]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee Name</TableHead>
                                        <TableHead>Employee ID</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={3} className="text-center h-24">Loading employees...</TableCell></TableRow>
                                    ) : allUsers.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                                            <TableCell>{user.full_employee_id}</TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild>
                                                    <Link href={`/payroll/structure/${user.id}`}>
                                                        Manage Structure <ArrowRight className="h-4 w-4 ml-2" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
             </div>
        </MainLayout>
    );
}