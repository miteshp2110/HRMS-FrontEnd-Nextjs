
// "use client"

// import * as React from "react";
// import { useRouter } from "next/navigation";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { createShiftRotation, getShifts, getAllUserProfiles, getDetailedUserProfile, type Shift, type UserProfile } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Plus, Trash2, ArrowRight, Users, Calendar, RefreshCw, AlertCircle, CheckCircle2, Search, X } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface RotationEntry {
//     employee_id: number;
//     employee_name: string;
//     from_shift_id: number;
//     from_shift_name: string;
//     to_shift_id: number;
// }

// export default function CreateShiftRotationPage() {
//     const router = useRouter();
//     const { toast } = useToast();
//     const [rotationName, setRotationName] = React.useState('');
//     const [effectiveFrom, setEffectiveFrom] = React.useState('');
//     const [rotations, setRotations] = React.useState<RotationEntry[]>([]);
    
//     const [allShifts, setAllShifts] = React.useState<Shift[]>([]);
//     const [isLoadingShifts, setIsLoadingShifts] = React.useState(true);
    
//     const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);
//     const [isLoadingUsers, setIsLoadingUsers] = React.useState(true);
//     const [frontendSearchTerm, setFrontendSearchTerm] = React.useState('');
    
//     const [selectedUserIds, setSelectedUserIds] = React.useState<Set<number>>(new Set());
//     const [isAddingEmployees, setIsAddingEmployees] = React.useState(false);
//     const [isSubmitting, setIsSubmitting] = React.useState(false);
    
//     // Fetch shifts
//     React.useEffect(() => {
//         getShifts()
//             .then(setAllShifts)
//             .catch(() => {
//                 toast({ 
//                     title: "Error", 
//                     description: "Could not load shifts.",
//                     variant: "destructive"
//                 });
//             })
//             .finally(() => setIsLoadingShifts(false));
//     }, [toast]);
    
//     // Fetch all users with limit 1000 - only active users
//     React.useEffect(() => {
//         getAllUserProfiles(1, 1000)
//             .then(response => {
//                 // Filter only active users
                
//                 const activeUsers = response.data.filter(user => user.is_active == true);
//                 setAllUsers(activeUsers);
                
//             })
//             .catch(() => {
//                 toast({ 
//                     title: "Error", 
//                     description: "Could not load employees.",
//                     variant: "destructive"
//                 });
//             })
//             .finally(() => setIsLoadingUsers(false));
//     }, [toast]);

//     // Filter users based on frontend search and exclude already added employees
//     const filteredUsers = React.useMemo(() => {
//         const addedEmployeeIds = new Set(rotations.map(r => r.employee_id));
        
//         return allUsers.filter(user => {
//             // Exclude already added employees
//             if (addedEmployeeIds.has(user.id)) return false;
            
//             // Frontend search filter
//             if (frontendSearchTerm) {
//                 const searchLower = frontendSearchTerm.toLowerCase();
//                 const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
//                 const email = user.email?.toLowerCase() || '';
//                 const employeeId = user.full_employee_id?.toLowerCase() || '';
                
//                 return fullName.includes(searchLower) || 
//                        email.includes(searchLower) || 
//                        employeeId.includes(searchLower);
//             }
            
//             return true;
//         });
//     }, [allUsers, frontendSearchTerm, rotations]);

//     const handleCheckboxChange = React.useCallback((userId: number, checked: boolean) => {
//         setSelectedUserIds(prev => {
//             const newSet = new Set(prev);
//             if (checked) {
//                 newSet.add(userId);
//             } else {
//                 newSet.delete(userId);
//             }
//             return newSet;
//         });
//     }, []);

//     const handleSelectAll = React.useCallback((checked: boolean) => {
//         if (checked) {
//             setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
//         } else {
//             setSelectedUserIds(new Set());
//         }
//     }, [filteredUsers]);

//     const addSelectedEmployeesToRotation = async () => {
//         if (selectedUserIds.size === 0) {
//             toast({ 
//                 title: "No Selection", 
//                 description: "Please select at least one employee to add.",
//                 variant: "default"
//             });
//             return;
//         }
        
//         setIsAddingEmployees(true);
//         const selectedUsers = allUsers.filter(u => selectedUserIds.has(u.id));
//         const successfulAdditions: string[] = [];
//         const failedAdditions: string[] = [];
        
//         try {
//             for (const user of selectedUsers) {
//                 try {
//                     const userDetails = await getDetailedUserProfile(user.id);
                    
//                     setRotations(prev => [...prev, {
//                         employee_id: user.id,
//                         employee_name: `${user.first_name} ${user.last_name}`,
//                         from_shift_id: userDetails.shift_id || 0,
//                         from_shift_name: userDetails.shift_name || 'N/A',
//                         to_shift_id: 0,
//                     }]);
                    
//                     successfulAdditions.push(`${user.first_name} ${user.last_name}`);
//                 } catch (error) {
//                     failedAdditions.push(`${user.first_name} ${user.last_name}`);
//                 }
//             }
            
//             if (successfulAdditions.length > 0) {
//                 toast({ 
//                     title: "Employees Added", 
//                     description: `${successfulAdditions.length} employee(s) added successfully.`,
//                     variant: "default"
//                 });
//             }
            
//             if (failedAdditions.length > 0) {
//                 toast({ 
//                     title: "Partial Failure", 
//                     description: `Could not fetch shift details for ${failedAdditions.length} employee(s).`,
//                     variant: "destructive"
//                 });
//             }
            
//             // Clear selections
//             setSelectedUserIds(new Set());
//             setFrontendSearchTerm('');
            
//         } finally {
//             setIsAddingEmployees(false);
//         }
//     };
    
//     const handleToShiftChange = React.useCallback((employeeId: number, toShiftId: string) => {
//         setRotations(prev => prev.map(r => 
//             r.employee_id === employeeId ? { ...r, to_shift_id: Number(toShiftId) } : r
//         ));
//     }, []);

//     const removeEmployee = React.useCallback((employeeId: number) => {
//         const employee = rotations.find(r => r.employee_id === employeeId);
//         setRotations(prev => prev.filter(r => r.employee_id !== employeeId));
        
//         if (employee) {
//             toast({ 
//                 title: "Employee Removed", 
//                 description: `${employee.employee_name} has been removed from the rotation.`,
//                 variant: "default"
//             });
//         }
//     }, [rotations, toast]);

//     const isFormValid = React.useMemo(() => {
//         if (!rotationName.trim() || !effectiveFrom) return false;
//         if (rotations.length === 0) return false;
//         return rotations.every(r => r.to_shift_id > 0);
//     }, [rotationName, effectiveFrom, rotations]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (!isFormValid) {
//             toast({ 
//                 title: "Validation Error", 
//                 description: "Please fill all required fields and ensure all employees have a target shift selected.",
//                 variant: "destructive"
//             });
//             return;
//         }
        
//         setIsSubmitting(true);
//         try {
//             await createShiftRotation({
//                 rotation_name: rotationName,
//                 effective_from: effectiveFrom,
//                 rotations: rotations.map(({ employee_id, from_shift_id, to_shift_id }) => ({ 
//                     employee_id, 
//                     from_shift_id, 
//                     to_shift_id 
//                 }))
//             });
            
//             toast({ 
//                 title: "Success", 
//                 description: "Shift rotation draft created successfully.",
//                 variant: "default"
//             });
            
//             router.push('/management/shift-rotation');
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: error?.message || "Creation failed. Please try again.",
//                 variant: "destructive"
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const getInitials = (firstName: string, lastName: string) => {
//         return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
//     };

//     return (
//         <MainLayout>
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Header Section */}
//                 <div className="flex items-start gap-4">
//                     <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20 mt-1">
//                         <Plus className="h-6 w-6 text-primary" />
//                     </div>
//                     <div className="space-y-1">
//                         <h1 className="text-3xl font-bold tracking-tight">
//                             Create Shift Rotation
//                         </h1>
//                         <p className="text-muted-foreground">
//                             Define rotation details and assign employees to new shift schedules
//                         </p>
//                     </div>
//                 </div>

//                 {/* Basic Information Card */}
//                 <Card className="overflow-hidden">
//                     <CardHeader className="border-b bg-muted/50">
//                         <div className="flex items-center gap-2">
//                             <Calendar className="h-5 w-5 text-primary" />
//                             <CardTitle className="text-lg">Rotation Information</CardTitle>
//                         </div>
//                         <CardDescription>
//                             Set the name and effective date for this shift rotation
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent className="p-6">
//                         <div className="grid gap-6 md:grid-cols-2">
//                             <div className="space-y-2">
//                                 <Label htmlFor="rotation-name" className="text-sm font-medium">
//                                     Rotation Name <span className="text-destructive">*</span>
//                                 </Label>
//                                 <Input 
//                                     id="rotation-name"
//                                     placeholder="e.g., Q4 Night Shift Rotation"
//                                     value={rotationName} 
//                                     onChange={e => setRotationName(e.target.value)} 
//                                     required
//                                     className="transition-all"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="effective-date" className="text-sm font-medium">
//                                     Effective From <span className="text-destructive">*</span>
//                                 </Label>
//                                 <Input 
//                                     id="effective-date"
//                                     type="date" 
//                                     value={effectiveFrom} 
//                                     onChange={e => setEffectiveFrom(e.target.value)} 
//                                     required
//                                     className="transition-all"
//                                 />
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Employee Selection - Side by Side Layout */}
//                 <div className="grid gap-6 lg:grid-cols-2">
//                     {/* Available Employees Card */}
//                     <Card className="overflow-hidden">
//                         <CardHeader className="border-b bg-muted/50">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <div className="flex items-center gap-2">
//                                         <Search className="h-5 w-5 text-primary" />
//                                         <CardTitle className="text-lg">Available Employees</CardTitle>
//                                     </div>
//                                     <CardDescription className="mt-1">
//                                         Select employees to add to rotation
//                                     </CardDescription>
//                                 </div>
//                                 {selectedUserIds.size > 0 && (
//                                     <Badge variant="secondary" className="font-medium">
//                                         {selectedUserIds.size} Selected
//                                     </Badge>
//                                 )}
//                             </div>
//                         </CardHeader>
//                         <CardContent className="p-6 space-y-4">
//                             {/* Frontend Search */}
//                             <div className="space-y-2">
//                                 <Label className="text-sm font-medium">Search</Label>
//                                 <div className="relative">
//                                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                                     <Input 
//                                         placeholder="Name, email, or employee ID..." 
//                                         value={frontendSearchTerm}
//                                         onChange={e => setFrontendSearchTerm(e.target.value)}
//                                         className="pl-10 pr-10"
//                                     />
//                                     {frontendSearchTerm && (
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="icon"
//                                             className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
//                                             onClick={() => setFrontendSearchTerm('')}
//                                         >
//                                             <X className="h-4 w-4" />
//                                         </Button>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Employee List */}
//                             <div className="space-y-2">
//                                 <div className="flex items-center justify-between">
//                                     <Label className="text-sm font-medium">
//                                         {filteredUsers.length} Employee{filteredUsers.length !== 1 ? 's' : ''}
//                                     </Label>
//                                     {filteredUsers.length > 0 && (
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={() => handleSelectAll(selectedUserIds.size !== filteredUsers.length)}
//                                             className="h-8 text-xs"
//                                         >
//                                             {selectedUserIds.size === filteredUsers.length ? 'Deselect All' : 'Select All'}
//                                         </Button>
//                                     )}
//                                 </div>
                                
//                                 <Card className="border-2">
//                                     <ScrollArea className="h-[500px]">
//                                         {isLoadingUsers ? (
//                                             <div className="p-4 space-y-3">
//                                                 {Array.from({ length: 8 }).map((_, i) => (
//                                                     <div key={i} className="flex items-center gap-3">
//                                                         <Skeleton className="h-5 w-5 rounded" />
//                                                         <Skeleton className="h-10 w-10 rounded-full" />
//                                                         <div className="flex-1 space-y-2">
//                                                             <Skeleton className="h-4 w-32" />
//                                                             <Skeleton className="h-3 w-24" />
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         ) : filteredUsers.length === 0 ? (
//                                             <div className="p-12">
//                                                 <div className="flex flex-col items-center justify-center space-y-3">
//                                                     <div className="p-4 rounded-full bg-muted">
//                                                         <Users className="h-8 w-8 text-muted-foreground" />
//                                                     </div>
//                                                     <div className="space-y-1 text-center">
//                                                         <p className="text-sm font-medium">
//                                                             {frontendSearchTerm ? 'No matching employees' : 'All employees added'}
//                                                         </p>
//                                                         <p className="text-xs text-muted-foreground">
//                                                             {frontendSearchTerm 
//                                                                 ? 'Try a different search term' 
//                                                                 : 'All active employees have been added'}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <div className="p-2">
//                                                 {filteredUsers.map((user) => (
//                                                     <div
//                                                         key={user.id}
//                                                         className={cn(
//                                                             "flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer",
//                                                             selectedUserIds.has(user.id) && "bg-primary/5 hover:bg-primary/10"
//                                                         )}
//                                                         onClick={() => handleCheckboxChange(user.id, !selectedUserIds.has(user.id))}
//                                                     >
//                                                         <Checkbox
//                                                             checked={selectedUserIds.has(user.id)}
//                                                             onCheckedChange={(checked) => handleCheckboxChange(user.id, checked as boolean)}
//                                                             onClick={(e) => e.stopPropagation()}
//                                                             className="mt-1"
//                                                         />
//                                                         <Avatar className="h-10 w-10 flex-shrink-0">
//                                                             <AvatarImage src={user.profile_url} alt={`${user.first_name} ${user.last_name}`} />
//                                                             <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
//                                                         </Avatar>
//                                                         <div className="flex-1 min-w-0 space-y-1">
//                                                             <div className="flex items-center gap-2">
//                                                                 <p className="font-medium text-sm truncate">
//                                                                     {user.first_name} {user.last_name}
//                                                                 </p>
//                                                                 <Badge variant="outline" className="text-xs font-mono">
//                                                                     {user.full_employee_id}
//                                                                 </Badge>
//                                                             </div>
//                                                             {user.job_title && (
//                                                                 <p className="text-xs text-muted-foreground truncate">
//                                                                     {user.job_title}
//                                                                 </p>
//                                                             )}
//                                                             <p className="text-xs text-muted-foreground truncate">
//                                                                 {user.role_name}
//                                                             </p>
//                                                             {user.email && (
//                                                                 <p className="text-xs text-muted-foreground truncate">
//                                                                     {user.email}
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                         {selectedUserIds.has(user.id) && (
//                                                             <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
//                                                         )}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </ScrollArea>
//                                 </Card>
//                             </div>

//                             {/* Add Selected Button */}
//                             <Button
//                                 type="button"
//                                 onClick={addSelectedEmployeesToRotation}
//                                 disabled={selectedUserIds.size === 0 || isAddingEmployees}
//                                 className="w-full"
//                             >
//                                 {isAddingEmployees ? (
//                                     <>
//                                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                         Adding Employees...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add {selectedUserIds.size > 0 ? `${selectedUserIds.size} ` : ''}Selected Employee{selectedUserIds.size !== 1 ? 's' : ''}
//                                     </>
//                                 )}
//                             </Button>
//                         </CardContent>
//                     </Card>

//                     {/* Selected Employees Card */}
//                     <Card className="overflow-hidden">
//                         <CardHeader className="border-b bg-muted/50">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <div className="flex items-center gap-2">
//                                         <Users className="h-5 w-5 text-primary" />
//                                         <CardTitle className="text-lg">Selected Employees</CardTitle>
//                                     </div>
//                                     <CardDescription className="mt-1">
//                                         Employees added to this rotation
//                                     </CardDescription>
//                                 </div>
//                                 <Badge variant="secondary" className="font-medium">
//                                     {rotations.length} {rotations.length === 1 ? 'Employee' : 'Employees'}
//                                 </Badge>
//                             </div>
//                         </CardHeader>
//                         <CardContent className="p-0">
//                             <Card className="border-0 rounded-none">
//                                 <ScrollArea className="h-[630px]">
//                                     {rotations.length === 0 ? (
//                                         <div className="p-12">
//                                             <div className="flex flex-col items-center justify-center space-y-3">
//                                                 <div className="p-4 rounded-full bg-muted">
//                                                     <Users className="h-8 w-8 text-muted-foreground" />
//                                                 </div>
//                                                 <div className="space-y-1 text-center">
//                                                     <p className="text-sm font-medium">No employees selected</p>
//                                                     <p className="text-xs text-muted-foreground">
//                                                         Select employees from the list to add them here
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="p-4 space-y-3">
//                                             {rotations.map((r) => {
//                                                 const user = allUsers.find(u => u.id === r.employee_id);
//                                                 return (
//                                                     <Card key={r.employee_id} className="p-4">
//                                                         <div className="space-y-3">
//                                                             <div className="flex items-start justify-between gap-3">
//                                                                 <div className="flex items-start gap-3 flex-1 min-w-0">
//                                                                     <Avatar className="h-10 w-10 flex-shrink-0">
//                                                                         <AvatarImage src={user?.profile_url} alt={r.employee_name} />
//                                                                         <AvatarFallback>
//                                                                             {r.employee_name.split(' ').map(n => n[0]).join('').toUpperCase()}
//                                                                         </AvatarFallback>
//                                                                     </Avatar>
//                                                                     <div className="flex-1 min-w-0">
//                                                                         <div className="flex items-center gap-2 flex-wrap">
//                                                                             <p className="font-medium text-sm">{r.employee_name}</p>
//                                                                             {user?.full_employee_id && (
//                                                                                 <Badge variant="outline" className="text-xs font-mono">
//                                                                                     {user.full_employee_id}
//                                                                                 </Badge>
//                                                                             )}
//                                                                         </div>
//                                                                         {user?.job_title && (
//                                                                             <p className="text-xs text-muted-foreground mt-1">
//                                                                                 {user.job_title}
//                                                                             </p>
//                                                                         )}
//                                                                     </div>
//                                                                 </div>
//                                                                 <Button 
//                                                                     type="button"
//                                                                     variant="ghost" 
//                                                                     size="icon"
//                                                                     onClick={() => removeEmployee(r.employee_id)}
//                                                                     className="hover:bg-destructive/10 hover:text-destructive transition-colors flex-shrink-0"
//                                                                 >
//                                                                     <Trash2 className="h-4 w-4" />
//                                                                 </Button>
//                                                             </div>
                                                            
//                                                             <div className="grid gap-3 pt-2 border-t">
//                                                                 <div className="space-y-1">
//                                                                     <Label className="text-xs text-muted-foreground">Current Shift</Label>
//                                                                     <Badge 
//                                                                         variant="secondary"
//                                                                         className="font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
//                                                                     >
//                                                                         {r.from_shift_name}
//                                                                     </Badge>
//                                                                 </div>
                                                                
//                                                                 <div className="flex items-center justify-center">
//                                                                     <ArrowRight className="h-4 w-4 text-muted-foreground" />
//                                                                 </div>
                                                                
//                                                                 <div className="space-y-1">
//                                                                     <Label className="text-xs text-muted-foreground">
//                                                                         New Shift <span className="text-destructive">*</span>
//                                                                     </Label>
//                                                                     <Select 
//                                                                         value={r.to_shift_id > 0 ? String(r.to_shift_id) : ""}
//                                                                         onValueChange={(value) => handleToShiftChange(r.employee_id, value)}
//                                                                     >
//                                                                         <SelectTrigger className={cn(
//                                                                             "transition-all",
//                                                                             r.to_shift_id === 0 && "border-amber-500 dark:border-amber-600"
//                                                                         )}>
//                                                                             <SelectValue placeholder="Select new shift" />
//                                                                         </SelectTrigger>
//                                                                         <SelectContent>
//                                                                             {allShifts
//                                                                                 .filter(s => s.id !== r.from_shift_id)
//                                                                                 .map(s => (
//                                                                                     <SelectItem key={s.id} value={String(s.id)}>
//                                                                                         {s.name}
//                                                                                     </SelectItem>
//                                                                                 ))
//                                                                             }
//                                                                         </SelectContent>
//                                                                     </Select>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </Card>
//                                                 );
//                                             })}
//                                         </div>
//                                     )}
//                                 </ScrollArea>
//                             </Card>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Validation Alert */}
//                 {rotations.length > 0 && rotations.some(r => r.to_shift_id === 0) && (
//                     <Alert className="border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10">
//                         <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
//                         <AlertDescription className="text-amber-800 dark:text-amber-400">
//                             Please select a new shift for all employees before submitting
//                         </AlertDescription>
//                     </Alert>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex items-center justify-between pt-6 border-t">
//                     <Button 
//                         type="button" 
//                         variant="outline" 
//                         onClick={() => router.back()}
//                         disabled={isSubmitting}
//                         className="transition-all"
//                     >
//                         Cancel
//                     </Button>
//                     <Button 
//                         type="submit"
//                         disabled={isSubmitting || !isFormValid}
//                         className="min-w-[140px] transition-all shadow-sm"
//                     >
//                         {isSubmitting ? (
//                             <>
//                                 <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                 Creating...
//                             </>
//                         ) : (
//                             <>
//                                 <CheckCircle2 className="h-4 w-4 mr-2" />
//                                 Create Draft
//                             </>
//                         )}
//                     </Button>
//                 </div>
//             </form>
//         </MainLayout>
//     );
// }

"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createShiftRotation, getShifts, getAllUserProfiles, getDetailedUserProfile, type Shift, type UserProfile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowRight, Users, Calendar, RefreshCw, AlertCircle, CheckCircle2, Search, X, Clock, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RotationEntry {
    employee_id: number;
    employee_name: string;
    from_shift_id: number;
    from_shift_name: string;
    to_shift_id: number;
}

export default function CreateShiftRotationPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [rotationName, setRotationName] = React.useState('');
    const [effectiveFrom, setEffectiveFrom] = React.useState('');
    const [rotations, setRotations] = React.useState<RotationEntry[]>([]);
    
    const [allShifts, setAllShifts] = React.useState<Shift[]>([]);
    const [isLoadingShifts, setIsLoadingShifts] = React.useState(true);
    
    const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = React.useState(true);
    const [frontendSearchTerm, setFrontendSearchTerm] = React.useState('');
    const [filterByShiftId, setFilterByShiftId] = React.useState<string>('all');
    
    const [selectedUserIds, setSelectedUserIds] = React.useState<Set<number>>(new Set());
    const [isAddingEmployees, setIsAddingEmployees] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    // Get timezone from localStorage
    const timezone = typeof window !== 'undefined' 
        ? localStorage.getItem('selectedTimezone') ?? 'UTC' 
        : 'UTC';
    
    // Fetch shifts
    React.useEffect(() => {
        getShifts()
            .then(setAllShifts)
            .catch(() => {
                toast({ 
                    title: "Error", 
                    description: "Could not load shifts.",
                    variant: "destructive"
                });
            })
            .finally(() => setIsLoadingShifts(false));
    }, [toast]);
    
    // Fetch all users with limit 1000 - only active users
    React.useEffect(() => {
        getAllUserProfiles(1, 1000)
            .then(response => {
                // Filter only active users
                const activeUsers = response.data.filter(user => user.is_active == true);
                setAllUsers(activeUsers);
            })
            .catch(() => {
                toast({ 
                    title: "Error", 
                    description: "Could not load employees.",
                    variant: "destructive"
                });
            })
            .finally(() => setIsLoadingUsers(false));
    }, [toast]);

    // Convert time to selected timezone
    const convertTimeToTimezone = (time: string): string => {
        if (!time) return '';
        
        try {
            // Parse time in HH:mm:ss format
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            // Format in user's timezone
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: timezone,
                hour12: true
            });
        } catch (error) {
            return time;
        }
    };

    // Get shift details with formatted times
    const getShiftDetails = (shiftId: number) => {
        const shift = allShifts.find(s => s.id === shiftId);
        if (!shift) return null;
        
        return {
            ...shift,
            formatted_from_time: convertTimeToTimezone(shift.from_time),
            formatted_to_time: convertTimeToTimezone(shift.to_time)
        };
    };

    // Filter users based on frontend search, shift filter, and exclude already added employees
    const filteredUsers = React.useMemo(() => {
        const addedEmployeeIds = new Set(rotations.map(r => r.employee_id));
        
        return allUsers.filter(user => {
            // Exclude already added employees
            if (addedEmployeeIds.has(user.id)) return false;
            
            // Shift filter
            if (filterByShiftId !== 'all' && user.shift_id !== parseInt(filterByShiftId)) {
                return false;
            }
            
            // Frontend search filter
            if (frontendSearchTerm) {
                const searchLower = frontendSearchTerm.toLowerCase();
                const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
                const email = user.email?.toLowerCase() || '';
                const employeeId = user.full_employee_id?.toLowerCase() || '';
                
                return fullName.includes(searchLower) || 
                       email.includes(searchLower) || 
                       employeeId.includes(searchLower);
            }
            
            return true;
        });
    }, [allUsers, frontendSearchTerm, filterByShiftId, rotations]);

    // Simple select all logic
    const handleSelectAll = () => {
        const allFilteredIds = filteredUsers.map(u => u.id);
        const allSelected = allFilteredIds.every(id => selectedUserIds.has(id));
        
        if (allSelected) {
            // Deselect all filtered users
            setSelectedUserIds(prev => {
                const newSet = new Set(prev);
                allFilteredIds.forEach(id => newSet.delete(id));
                return newSet;
            });
        } else {
            // Select all filtered users
            setSelectedUserIds(prev => {
                const newSet = new Set(prev);
                allFilteredIds.forEach(id => newSet.add(id));
                return newSet;
            });
        }
    };

    const toggleUserSelection = (userId: number) => {
        setSelectedUserIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const addSelectedEmployeesToRotation = async () => {
        if (selectedUserIds.size === 0) {
            toast({ 
                title: "No Selection", 
                description: "Please select at least one employee to add.",
                variant: "default"
            });
            return;
        }
        
        setIsAddingEmployees(true);
        const selectedUsers = allUsers.filter(u => selectedUserIds.has(u.id));
        const successfulAdditions: string[] = [];
        const failedAdditions: string[] = [];
        
        try {
            for (const user of selectedUsers) {
                try {
                    const userDetails = await getDetailedUserProfile(user.id);
                    
                    setRotations(prev => [...prev, {
                        employee_id: user.id,
                        employee_name: `${user.first_name} ${user.last_name}`,
                        from_shift_id: userDetails.shift_id || user.shift_id || 0,
                        from_shift_name: userDetails.shift_name || 'N/A',
                        to_shift_id: 0,
                    }]);
                    
                    successfulAdditions.push(`${user.first_name} ${user.last_name}`);
                } catch (error) {
                    failedAdditions.push(`${user.first_name} ${user.last_name}`);
                }
            }
            
            if (successfulAdditions.length > 0) {
                toast({ 
                    title: "Employees Added", 
                    description: `${successfulAdditions.length} employee(s) added successfully.`,
                    variant: "default"
                });
            }
            
            if (failedAdditions.length > 0) {
                toast({ 
                    title: "Partial Failure", 
                    description: `Could not fetch shift details for ${failedAdditions.length} employee(s).`,
                    variant: "destructive"
                });
            }
            
            // Clear selections
            setSelectedUserIds(new Set());
            setFrontendSearchTerm('');
            
        } finally {
            setIsAddingEmployees(false);
        }
    };
    
    const handleToShiftChange = (employeeId: number, toShiftId: string) => {
        setRotations(prev => prev.map(r => 
            r.employee_id === employeeId ? { ...r, to_shift_id: Number(toShiftId) } : r
        ));
    };

    const removeEmployee = (employeeId: number) => {
        const employee = rotations.find(r => r.employee_id === employeeId);
        setRotations(prev => prev.filter(r => r.employee_id !== employeeId));
        
        if (employee) {
            toast({ 
                title: "Employee Removed", 
                description: `${employee.employee_name} has been removed from the rotation.`,
                variant: "default"
            });
        }
    };

    const isFormValid = React.useMemo(() => {
        if (!rotationName.trim() || !effectiveFrom) return false;
        if (rotations.length === 0) return false;
        return rotations.every(r => r.to_shift_id > 0);
    }, [rotationName, effectiveFrom, rotations]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isFormValid) {
            toast({ 
                title: "Validation Error", 
                description: "Please fill all required fields and ensure all employees have a target shift selected.",
                variant: "destructive"
            });
            return;
        }
        
        setIsSubmitting(true);
        try {
            await createShiftRotation({
                rotation_name: rotationName,
                effective_from: effectiveFrom,
                rotations: rotations.map(({ employee_id, from_shift_id, to_shift_id }) => ({ 
                    employee_id, 
                    from_shift_id, 
                    to_shift_id 
                }))
            });
            
            toast({ 
                title: "Success", 
                description: "Shift rotation draft created successfully.",
                variant: "default"
            });
            
            router.push('/management/shift-rotation');
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Creation failed. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    // Check if all filtered users are selected
    const allFilteredSelected = filteredUsers.length > 0 && 
        filteredUsers.every(u => selectedUserIds.has(u.id));

    return (
        <MainLayout>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Section */}
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20 mt-1">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Shift Rotation
                        </h1>
                        <p className="text-muted-foreground">
                            Define rotation details and assign employees to new shift schedules
                        </p>
                    </div>
                </div>

                {/* Basic Information Card */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/50">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Rotation Information</CardTitle>
                        </div>
                        <CardDescription>
                            Set the name and effective date for this shift rotation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="rotation-name" className="text-sm font-medium">
                                    Rotation Name <span className="text-destructive">*</span>
                                </Label>
                                <Input 
                                    id="rotation-name"
                                    placeholder="e.g., Q4 Night Shift Rotation"
                                    value={rotationName} 
                                    onChange={e => setRotationName(e.target.value)} 
                                    required
                                    className="transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="effective-date" className="text-sm font-medium">
                                    Effective From <span className="text-destructive">*</span>
                                </Label>
                                <Input 
                                    id="effective-date"
                                    type="date" 
                                    value={effectiveFrom} 
                                    onChange={e => setEffectiveFrom(e.target.value)} 
                                    required
                                    className="transition-all"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Employee Selection - Side by Side Layout */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Available Employees Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Search className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Available Employees</CardTitle>
                                    </div>
                                    <CardDescription className="mt-1">
                                        Select employees to add to rotation
                                    </CardDescription>
                                </div>
                                {selectedUserIds.size > 0 && (
                                    <Badge variant="secondary" className="font-medium">
                                        {selectedUserIds.size} Selected
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {/* Filters */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Frontend Search */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Search</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            placeholder="Name, email, ID..." 
                                            value={frontendSearchTerm}
                                            onChange={e => setFrontendSearchTerm(e.target.value)}
                                            className="pl-10 pr-10"
                                        />
                                        {frontendSearchTerm && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                                onClick={() => setFrontendSearchTerm('')}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Shift Filter */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Filter by Shift</Label>
                                    <Select value={filterByShiftId} onValueChange={setFilterByShiftId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Shifts" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Shifts</SelectItem>
                                            {allShifts.map(shift => (
                                                <SelectItem key={shift.id} value={String(shift.id)}>
                                                    {shift.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Employee List */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        {filteredUsers.length} Employee{filteredUsers.length !== 1 ? 's' : ''}
                                    </Label>
                                    {filteredUsers.length > 0 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleSelectAll}
                                            className="h-8 text-xs"
                                        >
                                            {allFilteredSelected ? 'Deselect All' : 'Select All'}
                                        </Button>
                                    )}
                                </div>
                                
                                <Card className="border-2">
                                    <ScrollArea className="h-[500px]">
                                        {isLoadingUsers ? (
                                            <div className="p-4 space-y-3">
                                                {Array.from({ length: 8 }).map((_, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <Skeleton className="h-5 w-5 rounded" />
                                                        <Skeleton className="h-10 w-10 rounded-full" />
                                                        <div className="flex-1 space-y-2">
                                                            <Skeleton className="h-4 w-32" />
                                                            <Skeleton className="h-3 w-24" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : filteredUsers.length === 0 ? (
                                            <div className="p-12">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="p-4 rounded-full bg-muted">
                                                        <Users className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                    <div className="space-y-1 text-center">
                                                        <p className="text-sm font-medium">
                                                            {frontendSearchTerm || filterByShiftId !== 'all' 
                                                                ? 'No matching employees' 
                                                                : 'All employees added'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {frontendSearchTerm || filterByShiftId !== 'all'
                                                                ? 'Try adjusting your filters' 
                                                                : 'All active employees have been added'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-2">
                                                {filteredUsers.map((user) => {
                                                    const isSelected = selectedUserIds.has(user.id);
                                                    const userShift = getShiftDetails(user.shift_id);
                                                    
                                                    return (
                                                        <div
                                                            key={user.id}
                                                            className={cn(
                                                                "flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50",
                                                                isSelected && "bg-primary/5 hover:bg-primary/10"
                                                            )}
                                                        >
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={() => toggleUserSelection(user.id)}
                                                                className="mt-1"
                                                            />
                                                            <Avatar className="h-10 w-10 flex-shrink-0">
                                                                <AvatarImage src={user.profile_url} alt={`${user.first_name} ${user.last_name}`} />
                                                                <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0 space-y-1">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <p className="font-medium text-sm truncate">
                                                                        {user.first_name} {user.last_name}
                                                                    </p>
                                                                    <Badge variant="outline" className="text-xs font-mono">
                                                                        {user.full_employee_id}
                                                                    </Badge>
                                                                </div>
                                                                {user.job_title && (
                                                                    <p className="text-xs text-muted-foreground truncate">
                                                                        {user.job_title}
                                                                    </p>
                                                                )}
                                                                <p className="text-xs text-muted-foreground truncate">
                                                                    {user.role_name}
                                                                </p>
                                                                {userShift && (
                                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>
                                                                            {userShift.formatted_from_time} - {userShift.formatted_to_time}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {isSelected && (
                                                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </Card>
                            </div>

                            {/* Add Selected Button */}
                            <Button
                                type="button"
                                onClick={addSelectedEmployeesToRotation}
                                disabled={selectedUserIds.size === 0 || isAddingEmployees}
                                className="w-full"
                            >
                                {isAddingEmployees ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Adding Employees...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add {selectedUserIds.size > 0 ? `${selectedUserIds.size} ` : ''}Selected Employee{selectedUserIds.size !== 1 ? 's' : ''}
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Selected Employees Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Selected Employees</CardTitle>
                                    </div>
                                    <CardDescription className="mt-1">
                                        Employees added to this rotation
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="font-medium">
                                    {rotations.length} {rotations.length === 1 ? 'Employee' : 'Employees'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Card className="border-0 rounded-none">
                                <ScrollArea className="h-[674px]">
                                    {rotations.length === 0 ? (
                                        <div className="p-12">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="p-4 rounded-full bg-muted">
                                                    <Users className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-1 text-center">
                                                    <p className="text-sm font-medium">No employees selected</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Select employees from the list to add them here
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 space-y-3">
                                            {rotations.map((r) => {
                                                const user = allUsers.find(u => u.id === r.employee_id);
                                                const currentShift = getShiftDetails(r.from_shift_id);
                                                const selectedShift = r.to_shift_id > 0 ? getShiftDetails(r.to_shift_id) : null;
                                                
                                                return (
                                                    <Card key={r.employee_id} className="p-4">
                                                        <div className="space-y-3">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                                    <Avatar className="h-10 w-10 flex-shrink-0">
                                                                        <AvatarImage src={user?.profile_url} alt={r.employee_name} />
                                                                        <AvatarFallback>
                                                                            {r.employee_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <p className="font-medium text-sm">{r.employee_name}</p>
                                                                            {user?.full_employee_id && (
                                                                                <Badge variant="outline" className="text-xs font-mono">
                                                                                    {user.full_employee_id}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        {user?.job_title && (
                                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                                {user.job_title}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <Button 
                                                                    type="button"
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    onClick={() => removeEmployee(r.employee_id)}
                                                                    className="hover:bg-destructive/10 hover:text-destructive transition-colors flex-shrink-0"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            
                                                            <div className="grid gap-3 pt-2 border-t">
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs text-muted-foreground">Current Shift</Label>
                                                                    <div className="space-y-1">
                                                                        <Badge 
                                                                            variant="secondary"
                                                                            className="font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                                        >
                                                                            {r.from_shift_name}
                                                                        </Badge>
                                                                        {currentShift && (
                                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                                <Clock className="h-3 w-3" />
                                                                                <span>
                                                                                    {currentShift.formatted_from_time} - {currentShift.formatted_to_time}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="flex items-center justify-center">
                                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                                
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs text-muted-foreground">
                                                                        New Shift <span className="text-destructive">*</span>
                                                                    </Label>
                                                                    <Select 
                                                                        value={r.to_shift_id > 0 ? String(r.to_shift_id) : ""}
                                                                        onValueChange={(value) => handleToShiftChange(r.employee_id, value)}
                                                                    >
                                                                        <SelectTrigger className={cn(
                                                                            "transition-all",
                                                                            r.to_shift_id === 0 && "border-amber-500 dark:border-amber-600"
                                                                        )}>
                                                                            <SelectValue placeholder="Select new shift" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {allShifts
                                                                                .filter(s => s.id !== r.from_shift_id)
                                                                                .map(s => {
                                                                                    const shiftDetails = getShiftDetails(s.id);
                                                                                    return (
                                                                                        <SelectItem key={s.id} value={String(s.id)}>
                                                                                            <div className="flex flex-col">
                                                                                                <span>{s.name}</span>
                                                                                                {shiftDetails && (
                                                                                                    <span className="text-xs text-muted-foreground">
                                                                                                        {shiftDetails.formatted_from_time} - {shiftDetails.formatted_to_time}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </SelectItem>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {selectedShift && (
                                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            <span>
                                                                                {selectedShift.formatted_from_time} - {selectedShift.formatted_to_time}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </ScrollArea>
                            </Card>
                        </CardContent>
                    </Card>
                </div>

                {/* Validation Alert */}
                {rotations.length > 0 && rotations.some(r => r.to_shift_id === 0) && (
                    <Alert className="border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <AlertDescription className="text-amber-800 dark:text-amber-400">
                            Please select a new shift for all employees before submitting
                        </AlertDescription>
                    </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                        className="transition-all"
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit"
                        disabled={isSubmitting || !isFormValid}
                        className="min-w-[140px] transition-all shadow-sm"
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Create Draft
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}
