

// "use client"

// import * as React from "react"
// import { useAuth } from "@/lib/auth-context"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Plus, Trash2, ChevronsUpDown, AlertCircle, Badge, Search } from "lucide-react"
// import { getSalaryStructure, searchUsers, getPayrollComponents, assignSalaryComponent, removeSalaryComponent, type UserProfile, type SalaryComponent, type PayrollComponent } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// export function SalaryStructureManagementPage() {
//   const { hasPermission } = useAuth()
//   const { toast } = useToast()

//   const [selectedEmployee, setSelectedEmployee] = React.useState<UserProfile | null>(null)
//   const [structure, setStructure] = React.useState<SalaryComponent[]>([])
//   const [allComponents, setAllComponents] = React.useState<PayrollComponent[]>([])
//   const [isLoading, setIsLoading] = React.useState(false)
  
//   const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
//   const [newComponentData, setNewComponentData] = React.useState({ component_id: '', value_type: 'fixed' as 'fixed' | 'percentage', value: '', based_on_component_id: '' });

//   const [employeeSearch, setEmployeeSearch] = React.useState("")
//   const [debouncedSearch, setDebouncedSearch] = React.useState("")
//   const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([])
//   const [isSearching, setIsSearching] = React.useState(false)
//   const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

//   const canManagePayroll = hasPermission("payroll.manage")

//   React.useEffect(() => {
//     if (canManagePayroll) {
//       getPayrollComponents().then(setAllComponents);
//     }
//   }, [canManagePayroll]);

//   React.useEffect(() => {
//     const handler = setTimeout(() => setDebouncedSearch(employeeSearch), 500);
//     return () => clearTimeout(handler);
//   }, [employeeSearch]);

//   React.useEffect(() => {
//     if (debouncedSearch) {
//       setIsSearching(true);
//       searchUsers(debouncedSearch).then(setSearchedUsers).finally(() => setIsSearching(false));
//     } else {
//       setSearchedUsers([]);
//     }
//   }, [debouncedSearch]);

//   const handleEmployeeSelect = async (user: UserProfile) => {
//     setSelectedEmployee(user);
//     setIsPopoverOpen(false);
//     setIsLoading(true);
//     try {
//         const structureData = await getSalaryStructure(user.id);
//         setStructure(structureData);
//     } catch (error: any) {
//         toast({ title: "Error", description: `Could not fetch salary structure: ${error.message}`, variant: "destructive"});
//         setStructure([]);
//     } finally {
//         setIsLoading(false);
//     }
//   }

//   const handleAddComponent = async () => {
//     if (!selectedEmployee || !newComponentData.component_id || !newComponentData.value) {
//         toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive"});
//         return;
//     }
//     if (newComponentData.value_type === 'percentage' && !newComponentData.based_on_component_id) {
//         toast({ title: "Error", description: "Please select a component to base the percentage on.", variant: "destructive"});
//         return;
//     }
//     try {
//         await assignSalaryComponent(selectedEmployee.id, {
//             component_id: Number(newComponentData.component_id),
//             value_type: newComponentData.value_type,
//             value: Number(newComponentData.value),
//             based_on_component_id: newComponentData.value_type === 'percentage' ? Number(newComponentData.based_on_component_id) : undefined
//         });
//         toast({ title: "Success", description: "Component added successfully." });
//         setIsAddDialogOpen(false);
//         setNewComponentData({ component_id: '', value_type: 'fixed', value: '', based_on_component_id: '' });
//         handleEmployeeSelect(selectedEmployee);
//     } catch (error: any) {
//         toast({ title: "Error", description: `Failed to add component: ${error.message}`, variant: "destructive"});
//     }
//   }

//   const handleDeleteComponent = async (componentId: number) => {
//       if (!selectedEmployee || !confirm("Are you sure you want to remove this component?")) return;
//       try {
//           await removeSalaryComponent(selectedEmployee.id, componentId);
//           toast({ title: "Success", description: "Component removed successfully."});
//           handleEmployeeSelect(selectedEmployee);
//       } catch (error: any) {
//           toast({ title: "Error", description: `Failed to remove component: ${error.message}`, variant: "destructive"});
//       }
//   }

//   const { totalEarnings, totalDeductions, netSalary } = React.useMemo(() => {
//     const earnings = structure.filter(c => c.component_type === 'earning').reduce((sum, c) => sum + c.calculated_amount, 0);
//     const deductions = structure.filter(c => c.component_type === 'deduction').reduce((sum, c) => sum + c.calculated_amount, 0);
//     return { totalEarnings: earnings, totalDeductions: deductions, netSalary: earnings - deductions };
//   }, [structure]);

//   if (!canManagePayroll) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Access Denied</AlertTitle>
//         <AlertDescription>You do not have permission to manage salary structures.</AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Salary Structures</h1>
//           <p className="text-muted-foreground">Assign and manage salary components for employees.</p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Select Employee</CardTitle>
//           <CardDescription>Search for an employee to view or manage their salary structure.</CardDescription>
//         </CardHeader>
//         <CardContent>
//              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
//                 <PopoverTrigger asChild>
//                                         <button
//                   type="button"
//                   role="button"
//                   className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
//                 >
//                   {selectedEmployee
//                     ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
//                     : "Select employee..."}
//                   <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[300px] p-0">
//                     <Command>
//                         <CommandInput placeholder="Search by name or ID..." onValueChange={setEmployeeSearch} />
//                         <CommandList>
//                             <CommandEmpty>{isSearching ? "Searching..." : "No employee found."}</CommandEmpty>
//                             <CommandGroup>
//                                 {searchedUsers.map((user) => (
//                                     <CommandItem key={user.id} value={`${user.first_name} ${user.last_name}`} onSelect={() => handleEmployeeSelect(user)}>
//                                         {user.first_name} {user.last_name}
//                                     </CommandItem>
//                                 ))}
//                             </CommandGroup>
//                         </CommandList>
//                     </Command>
//                 </PopoverContent>
//             </Popover>
//         </CardContent>
//       </Card>

//       {selectedEmployee && (
//         <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Card><CardHeader><CardTitle className="text-sm font-medium">Total Earnings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">${totalEarnings.toLocaleString()}</p></CardContent></Card>
//                 <Card><CardHeader><CardTitle className="text-sm font-medium">Total Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">${totalDeductions.toLocaleString()}</p></CardContent></Card>
//                 <Card><CardHeader><CardTitle className="text-sm font-medium">Net Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">${netSalary.toLocaleString()}</p></CardContent></Card>
//             </div>
//             <Card>
//                 <CardHeader className="flex flex-row justify-between items-center">
//                     <div>
//                         <CardTitle>Salary Components for {selectedEmployee.first_name}</CardTitle>
//                         <CardDescription>Detailed breakdown of all assigned components.</CardDescription>
//                     </div>
//                     <Button onClick={() => setIsAddDialogOpen(true)}><Plus className="h-4 w-4 mr-2"/>Add Component</Button>
//                 </CardHeader>
//                 <CardContent>
//                     {isLoading ? <p>Loading...</p> : (
//                         <Table>
//                             <TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
//                             <TableBody>
//                                 {structure.map((comp) => (
//                                     <TableRow key={comp.id}>
//                                         <TableCell className="font-medium">{comp.component_name}</TableCell>
//                                         <TableCell><Badge className={comp.component_type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{comp.component_type}</Badge></TableCell>
//                                         <TableCell>{comp.value_type === 'fixed' ? `$${comp.value}` : `${comp.value}% of ${comp.based_on_component_name}`}</TableCell>
//                                         <TableCell className="text-right font-semibold">${comp.calculated_amount.toLocaleString()}</TableCell>
//                                         <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleDeleteComponent(comp.component_id)} disabled={comp.component_name === 'Basic'}><Trash2 className="h-4 w-4"/></Button></TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     )}
//                 </CardContent>
//             </Card>

//             <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader><DialogTitle>Add Salary Component</DialogTitle><DialogDescription>Add a new earning or deduction for {selectedEmployee.first_name}.</DialogDescription></DialogHeader>
//                     <div className="py-4 space-y-4">
//                         <Select onValueChange={v => setNewComponentData(d => ({...d, component_id: v}))}><SelectTrigger><SelectValue placeholder="Select Component"/></SelectTrigger><SelectContent>{allComponents.filter(c => !structure.some(s => s.component_id === c.id)).map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.type})</SelectItem>)}</SelectContent></Select>
//                         <Select onValueChange={(v: 'fixed' | 'percentage') => setNewComponentData(d => ({...d, value_type: v, based_on_component_id: ''}))} value={newComponentData.value_type}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="fixed">Fixed Amount</SelectItem><SelectItem value="percentage">Percentage</SelectItem></SelectContent></Select>
//                         {newComponentData.value_type === 'percentage' && <Select onValueChange={v => setNewComponentData(d => ({...d, based_on_component_id: v}))} value={newComponentData.based_on_component_id}><SelectTrigger><SelectValue placeholder="Based on which component?"/></SelectTrigger><SelectContent>{structure.filter(c=>c.component_type==='earning').map(c => <SelectItem key={c.component_id} value={String(c.component_id)}>{c.component_name}</SelectItem>)}</SelectContent></Select>}
//                         <div><Label>Value</Label><Input type="number" placeholder={newComponentData.value_type === 'fixed' ? 'e.g., 500' : 'e.g., 10'} onChange={e => setNewComponentData(d => ({...d, value: e.target.value}))}/></div>
//                     </div>
//                     <DialogFooter><Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button><Button onClick={handleAddComponent}>Add Component</Button></DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </>
//       )}
//     </div>
//   )
// }

"use client"

import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Trash2, ChevronsUpDown, AlertCircle, Badge, Search, Edit } from "lucide-react"
import { getSalaryStructure, searchUsers, getPayrollComponents, assignSalaryComponent, removeSalaryComponent, updateSalaryComponent, type UserProfile, type SalaryComponent, type PayrollComponent } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function SalaryStructureManagementPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()

  const [selectedEmployee, setSelectedEmployee] = React.useState<UserProfile | null>(null)
  const [structure, setStructure] = React.useState<SalaryComponent[]>([])
  const [allComponents, setAllComponents] = React.useState<PayrollComponent[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [newComponentData, setNewComponentData] = React.useState({ component_id: '', value_type: 'fixed' as 'fixed' | 'percentage', value: '', based_on_component_id: '' });

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingComponent, setEditingComponent] = React.useState<SalaryComponent | null>(null)
  const [editComponentData, setEditComponentData] = React.useState({ value_type: 'fixed' as 'fixed' | 'percentage', value: '', based_on_component_id: '' });

  const [employeeSearch, setEmployeeSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const canManagePayroll = hasPermission("payroll.manage")

  React.useEffect(() => {
    if (canManagePayroll) {
      getPayrollComponents().then(setAllComponents);
    }
  }, [canManagePayroll]);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(employeeSearch), 500);
    return () => clearTimeout(handler);
  }, [employeeSearch]);

  React.useEffect(() => {
    if (debouncedSearch) {
      setIsSearching(true);
      searchUsers(debouncedSearch).then(setSearchedUsers).finally(() => setIsSearching(false));
    } else {
      setSearchedUsers([]);
    }
  }, [debouncedSearch]);

  const handleEmployeeSelect = async (user: UserProfile) => {
    setSelectedEmployee(user);
    setIsPopoverOpen(false);
    setIsLoading(true);
    try {
        const structureData = await getSalaryStructure(user.id);
        setStructure(structureData);
    } catch (error: any) {
        toast({ title: "Error", description: `Could not fetch salary structure: ${error.message}`, variant: "destructive"});
        setStructure([]);
    } finally {
        setIsLoading(false);
    }
  }

  const handleAddComponent = async () => {
    if (!selectedEmployee || !newComponentData.component_id || !newComponentData.value) {
        toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive"});
        return;
    }
    if (newComponentData.value_type === 'percentage' && !newComponentData.based_on_component_id) {
        toast({ title: "Error", description: "Please select a component to base the percentage on.", variant: "destructive"});
        return;
    }
    try {
        await assignSalaryComponent(selectedEmployee.id, {
            component_id: Number(newComponentData.component_id),
            value_type: newComponentData.value_type,
            value: Number(newComponentData.value),
            based_on_component_id: newComponentData.value_type === 'percentage' ? Number(newComponentData.based_on_component_id) : undefined
        });
        toast({ title: "Success", description: "Component added successfully." });
        setIsAddDialogOpen(false);
        setNewComponentData({ component_id: '', value_type: 'fixed', value: '', based_on_component_id: '' });
        handleEmployeeSelect(selectedEmployee);
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to add component: ${error.message}`, variant: "destructive"});
    }
  }

  const handleEditComponent = (component: SalaryComponent) => {
    setEditingComponent(component);
    setEditComponentData({
      value_type: component.value_type,
      value: component.value.toString(),
      based_on_component_id: component.based_on_component_id ? component.based_on_component_id.toString() : ''
    });
    setIsEditDialogOpen(true);
  }

  const handleUpdateComponent = async () => {
    if (!selectedEmployee || !editingComponent || !editComponentData.value) {
        toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive"});
        return;
    }
    if (editComponentData.value_type === 'percentage' && !editComponentData.based_on_component_id) {
        toast({ title: "Error", description: "Please select a component to base the percentage on.", variant: "destructive"});
        return;
    }
    try {
        const payload: any = {
        value_type: editComponentData.value_type,
        value: String(editComponentData.value),
        }

        if (editComponentData.value_type === "percentage") {
        payload.based_on_component_id = Number(editComponentData.based_on_component_id)
        } else {
        // do nothing, key won’t exist in payload
        }

        await updateSalaryComponent(
        selectedEmployee.id,
        editingComponent.component_id,
        payload
        )
        toast({ title: "Success", description: "Component updated successfully." });
        setIsEditDialogOpen(false);
        setEditingComponent(null);
        setEditComponentData({ value_type: 'fixed', value: '', based_on_component_id: '' });
        handleEmployeeSelect(selectedEmployee);
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to update component: ${error.message}`, variant: "destructive"});
    }
  }

  const handleDeleteComponent = async (componentId: number) => {
      if (!selectedEmployee || !confirm("Are you sure you want to remove this component?")) return;
      try {
          await removeSalaryComponent(selectedEmployee.id, componentId);
          toast({ title: "Success", description: "Component removed successfully."});
          handleEmployeeSelect(selectedEmployee);
      } catch (error: any) {
          toast({ title: "Error", description: `Failed to remove component: ${error.message}`, variant: "destructive"});
      }
  }

  const { totalEarnings, totalDeductions, netSalary } = React.useMemo(() => {
    const earnings = structure.filter(c => c.component_type === 'earning').reduce((sum, c) => sum + c.calculated_amount, 0);
    const deductions = structure.filter(c => c.component_type === 'deduction').reduce((sum, c) => sum + c.calculated_amount, 0);
    return { totalEarnings: earnings, totalDeductions: deductions, netSalary: earnings - deductions };
  }, [structure]);

  if (!canManagePayroll) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You do not have permission to manage salary structures.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Salary Structures</h1>
          <p className="text-muted-foreground">Assign and manage salary components for employees.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Employee</CardTitle>
          <CardDescription>Search for an employee to view or manage their salary structure.</CardDescription>
        </CardHeader>
        <CardContent>
             <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                                        <button
                  type="button"
                  role="button"
                  className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {selectedEmployee
                    ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                    : "Select employee..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Search by name or ID..." onValueChange={setEmployeeSearch} />
                        <CommandList>
                            <CommandEmpty>{isSearching ? "Searching..." : "No employee found."}</CommandEmpty>
                            <CommandGroup>
                                {searchedUsers.map((user) => (
                                    <CommandItem key={user.id} value={`${user.first_name} ${user.last_name}`} onSelect={() => handleEmployeeSelect(user)}>
                                        {user.first_name} {user.last_name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </CardContent>
      </Card>

      {selectedEmployee && (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardHeader><CardTitle className="text-sm font-medium">Total Earnings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">${totalEarnings.toLocaleString()}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Total Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">${totalDeductions.toLocaleString()}</p></CardContent></Card>
                <Card><CardHeader><CardTitle className="text-sm font-medium">Net Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">${netSalary.toLocaleString()}</p></CardContent></Card>
            </div>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Salary Components for {selectedEmployee.first_name}</CardTitle>
                        <CardDescription>Detailed breakdown of all assigned components.</CardDescription>
                    </div>
                    <Button onClick={() => setIsAddDialogOpen(true)}><Plus className="h-4 w-4 mr-2"/>Add Component</Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? <p>Loading...</p> : (
                        <Table>
                            <TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {structure.map((comp) => (
                                    <TableRow key={comp.id}>
                                        <TableCell className="font-medium">{comp.component_name}</TableCell>
                                        <TableCell><Badge className={comp.component_type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{comp.component_type}</Badge></TableCell>
                                        <TableCell>{comp.value_type === 'fixed' ? `$${comp.value}` : `${comp.value}% of ${comp.based_on_component_name}`}</TableCell>
                                        <TableCell className="text-right font-semibold">${comp.calculated_amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => handleEditComponent(comp)} disabled={comp.component_name === 'Basic'}>
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteComponent(comp.component_id)} disabled={comp.component_name === 'Basic'}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add Salary Component</DialogTitle><DialogDescription>Add a new earning or deduction for {selectedEmployee.first_name}.</DialogDescription></DialogHeader>
                    <div className="py-4 space-y-4">
                        <Select onValueChange={v => setNewComponentData(d => ({...d, component_id: v}))}><SelectTrigger><SelectValue placeholder="Select Component"/></SelectTrigger><SelectContent>{allComponents.filter(c => !structure.some(s => s.component_id === c.id)).map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.type})</SelectItem>)}</SelectContent></Select>
                        <Select onValueChange={(v: 'fixed' | 'percentage') => setNewComponentData(d => ({...d, value_type: v, based_on_component_id: ''}))} value={newComponentData.value_type}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="fixed">Fixed Amount</SelectItem><SelectItem value="percentage">Percentage</SelectItem></SelectContent></Select>
                        {newComponentData.value_type === 'percentage' && <Select onValueChange={v => setNewComponentData(d => ({...d, based_on_component_id: v}))} value={newComponentData.based_on_component_id}><SelectTrigger><SelectValue placeholder="Based on which component?"/></SelectTrigger><SelectContent>{structure.filter(c=>c.component_type==='earning').map(c => <SelectItem key={c.component_id} value={String(c.component_id)}>{c.component_name}</SelectItem>)}</SelectContent></Select>}
                        <div><Label>Value</Label><Input type="number" placeholder={newComponentData.value_type === 'fixed' ? 'e.g., 500' : 'e.g., 10'} onChange={e => setNewComponentData(d => ({...d, value: e.target.value}))}/></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button><Button onClick={handleAddComponent}>Add Component</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Salary Component</DialogTitle>
                        <DialogDescription>Edit the component details for {editingComponent?.component_name}.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <Label>Component</Label>
                            <Input value={editingComponent?.component_name || ''} disabled className="bg-muted"/>
                        </div>
                        <Select onValueChange={(v: 'fixed' | 'percentage') => setEditComponentData(d => ({...d, value_type: v, based_on_component_id: ''}))} value={editComponentData.value_type}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                            </SelectContent>
                        </Select>
                        {editComponentData.value_type === 'percentage' && (
                            <Select onValueChange={v => setEditComponentData(d => ({...d, based_on_component_id: v}))} value={editComponentData.based_on_component_id}>
                                <SelectTrigger><SelectValue placeholder="Based on which component?"/></SelectTrigger>
                                <SelectContent>
                                    {structure.filter(c=>c.component_type==='earning' && c.component_id !== editingComponent?.component_id).map(c => (
                                        <SelectItem key={c.component_id} value={String(c.component_id)}>
                                            {c.component_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        <div>
                            <Label>Value</Label>
                            <Input 
                                type="number" 
                                value={editComponentData.value} 
                                placeholder={editComponentData.value_type === 'fixed' ? 'e.g., 500' : 'e.g., 10'} 
                                onChange={e => setEditComponentData(d => ({...d, value: e.target.value}))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateComponent}>Update Component</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
      )}
    </div>
  )
}