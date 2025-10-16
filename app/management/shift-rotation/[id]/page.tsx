

// "use client"

// import * as React from "react";
// import { useParams, useRouter } from "next/navigation";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Checkbox } from "@/components/ui/checkbox";
// import { getShiftRotationDetails, submitShiftRotationForApproval, processShiftRotationApproval, updateShiftRotation, deleteShiftRotation, getAllUserProfiles, getShifts, getDetailedUserProfile, type ShiftRotationDetails, type ShiftRotationDetailItem, type UserProfile, type Shift } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { ArrowRight, Check, Send, Trash2, X, RefreshCw, Calendar, Users, Clock, Edit, AlertCircle, Plus, Search } from "lucide-react";
// import { cn } from "@/lib/utils";

// export default function ShiftRotationDetailPage() {
//     const params = useParams();
//     const router = useRouter();
//     const rotationId = Number(params.id);
//     const { toast } = useToast();
    
//     const [rotation, setRotation] = React.useState<ShiftRotationDetails | null>(null);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isSubmitting, setIsSubmitting] = React.useState(false);
//     const [isApproving, setIsApproving] = React.useState(false);
//     const [isRejecting, setIsRejecting] = React.useState(false);
//     const [isDeleting, setIsDeleting] = React.useState(false);
//     const [isDeletingEmployee, setIsDeletingEmployee] = React.useState(false);
//     const [employeeToDelete, setEmployeeToDelete] = React.useState<number | null>(null);
    
//     // Rejection reason dialog state
//     const [showRejectDialog, setShowRejectDialog] = React.useState(false);
//     const [rejectionReason, setRejectionReason] = React.useState('');
    
//     // Add employee dialog state
//     const [showAddEmployeeDialog, setShowAddEmployeeDialog] = React.useState(false);
//     const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);
//     const [allShifts, setAllShifts] = React.useState<Shift[]>([]);
//     const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
//     const [isLoadingShifts, setIsLoadingShifts] = React.useState(false);
//     const [searchTerm, setSearchTerm] = React.useState('');
//     const [filterByShiftId, setFilterByShiftId] = React.useState<string>('all');
//     const [selectedUserIds, setSelectedUserIds] = React.useState<Set<number>>(new Set());
//     const [newEmployeeShifts, setNewEmployeeShifts] = React.useState<Map<number, number>>(new Map());
//     const [isAddingEmployees, setIsAddingEmployees] = React.useState(false);
    
//     // Get timezone from localStorage
//     const timezone = typeof window !== 'undefined' 
//         ? localStorage.getItem('selectedTimezone') ?? 'UTC' 
//         : 'UTC';

//     const fetchData = React.useCallback(async () => {
//         if (!rotationId || isNaN(rotationId)) {
//             toast({ 
//                 title: "Error", 
//                 description: "Invalid rotation ID.", 
//                 variant: "destructive" 
//             });
//             router.push('/management/shift-rotation');
//             return;
//         }
        
//         setIsLoading(true);
//         try {
//             const data = await getShiftRotationDetails(rotationId);
//             setRotation(data);
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: error?.message || "Could not load rotation details.", 
//                 variant: "destructive" 
//             });
//             router.push('/management/shift-rotation');
//         } finally {
//             setIsLoading(false);
//         }
//     }, [rotationId, toast, router]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     // Load users and shifts when add dialog opens
//     const handleOpenAddDialog = async () => {
//         setShowAddEmployeeDialog(true);
        
//         if (allUsers.length === 0) {
//             setIsLoadingUsers(true);
//             try {
//                 const response = await getAllUserProfiles(1, 1000);
//                 const activeUsers = response.data.filter(user => user.is_active == true);
//                 setAllUsers(activeUsers);
//             } catch (error) {
//                 toast({ 
//                     title: "Error", 
//                     description: "Could not load employees.", 
//                     variant: "destructive" 
//                 });
//             } finally {
//                 setIsLoadingUsers(false);
//             }
//         }
        
//         if (allShifts.length === 0) {
//             setIsLoadingShifts(true);
//             try {
//                 const shifts = await getShifts();
//                 setAllShifts(shifts);
//             } catch (error) {
//                 toast({ 
//                     title: "Error", 
//                     description: "Could not load shifts.", 
//                     variant: "destructive" 
//                 });
//             } finally {
//                 setIsLoadingShifts(false);
//             }
//         }
//     };
    
//     const handleSubmitForApproval = async () => {
//         setIsSubmitting(true);
//         try {
//             await submitShiftRotationForApproval(rotationId);
//             toast({ 
//                 title: "Success", 
//                 description: "Rotation submitted for approval successfully." 
//             });
//             fetchData();
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: error?.message || "Submission failed.", 
//                 variant: "destructive" 
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleApproval = async (status: 'Approved' | 'Draft', reason?: string) => {
//         if (status === 'Approved') {
//             setIsApproving(true);
//         } else {
//             setIsRejecting(true);
//         }
        
//         try {
//             await processShiftRotationApproval(rotationId, status, reason);
//             toast({ 
//                 title: "Success", 
//                 description: status === 'Approved' 
//                     ? "Rotation has been approved successfully." 
//                     : "Rotation sent back for rework." 
//             });
            
//             // Close dialog and reset reason
//             setShowRejectDialog(false);
//             setRejectionReason('');
            
//             fetchData();
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: error?.message || "Action failed.", 
//                 variant: "destructive" 
//             });
//         } finally {
//             setIsApproving(false);
//             setIsRejecting(false);
//         }
//     };

//     const handleRejectClick = () => {
//         setShowRejectDialog(true);
//     };

//     const handleRejectConfirm = () => {
//         if (!rejectionReason.trim()) {
//             toast({ 
//                 title: "Validation Error", 
//                 description: "Please provide a reason for rejection.", 
//                 variant: "destructive" 
//             });
//             return;
//         }
//         handleApproval('Draft', rejectionReason);
//     };
    
//     const handleDelete = async () => {
//         setIsDeleting(true);
//         try {
//             await deleteShiftRotation(rotationId);
//             toast({ 
//                 title: "Success", 
//                 description: "Rotation draft deleted successfully." 
//             });
//             router.push('/management/shift-rotation');
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: error?.message || "Deletion failed.", 
//                 variant: "destructive" 
//             });
//             setIsDeleting(false);
//         }
//     };

//     const handleDeleteEmployee = async (employeeId: number) => {
//         if (!rotation || !rotation.details) return;
        
//         setIsDeletingEmployee(true);
//         setEmployeeToDelete(employeeId);
        
//         try {
//             // Filter out the employee to delete
//             const updatedRotations = rotation.details
//                 .filter(d => d.employee_id !== employeeId)
//                 .map(d => ({
//                     employee_id: d.employee_id,
//                     from_shift_id: d.from_shift_id,
//                     to_shift_id: d.to_shift_id
//                 }));
            
//             // Extract date only from effective_from
//             const effectiveDate = new Date(rotation.effective_from).toISOString().split('T')[0];
            
//             // Update the rotation with the new employee list
//             await updateShiftRotation(rotationId, {
//                 rotation_name: rotation.rotation_name,
//                 effective_from: effectiveDate,
//                 rotations: updatedRotations
//             });
            
//             toast({ 
//                 title: "Success", 
//                 description: "Employee removed from rotation successfully." 
//             });
            
//             fetchData();
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: error?.message || "Failed to remove employee.", 
//                 variant: "destructive" 
//             });
//         } finally {
//             setIsDeletingEmployee(false);
//             setEmployeeToDelete(null);
//         }
//     };

//     // Filter users
//     const filteredUsers = React.useMemo(() => {
//         if (!rotation || !rotation.details) return allUsers;
        
//         const addedEmployeeIds = new Set(rotation.details.map(r => r.employee_id));
        
//         return allUsers.filter(user => {
//             if (addedEmployeeIds.has(user.id)) return false;
            
//             if (filterByShiftId !== 'all' && user.shift_id !== parseInt(filterByShiftId)) {
//                 return false;
//             }
            
//             if (searchTerm) {
//                 const searchLower = searchTerm.toLowerCase();
//                 const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
//                 const email = user.email?.toLowerCase() || '';
//                 const employeeId = user.full_employee_id?.toLowerCase() || '';
                
//                 return fullName.includes(searchLower) || 
//                        email.includes(searchLower) || 
//                        employeeId.includes(searchLower);
//             }
            
//             return true;
//         });
//     }, [allUsers, searchTerm, filterByShiftId, rotation]);

//     const toggleUserSelection = (userId: number) => {
//         setSelectedUserIds(prev => {
//             const newSet = new Set(prev);
//             if (newSet.has(userId)) {
//                 newSet.delete(userId);
//                 setNewEmployeeShifts(prev => {
//                     const newMap = new Map(prev);
//                     newMap.delete(userId);
//                     return newMap;
//                 });
//             } else {
//                 newSet.add(userId);
//             }
//             return newSet;
//         });
//     };

//     const handleShiftSelect = (userId: number, shiftId: number) => {
//         setNewEmployeeShifts(prev => {
//             const newMap = new Map(prev);
//             newMap.set(userId, shiftId);
//             return newMap;
//         });
//     };

//     const handleAddEmployees = async () => {
//         if (selectedUserIds.size === 0) {
//             toast({ 
//                 title: "No Selection", 
//                 description: "Please select at least one employee.", 
//                 variant: "default" 
//             });
//             return;
//         }
        
//         // Check if all selected employees have target shifts
//         const missingShifts = Array.from(selectedUserIds).filter(id => !newEmployeeShifts.has(id));
//         if (missingShifts.length > 0) {
//             toast({ 
//                 title: "Validation Error", 
//                 description: "Please select target shift for all selected employees.", 
//                 variant: "destructive" 
//             });
//             return;
//         }
        
//         setIsAddingEmployees(true);
        
//         try {
//             if (!rotation || !rotation.details) return;
            
//             // Get current rotations
//             const currentRotations = rotation.details.map(d => ({
//                 employee_id: d.employee_id,
//                 from_shift_id: d.from_shift_id,
//                 to_shift_id: d.to_shift_id
//             }));
            
//             // Add new employees
//             const newRotations = await Promise.all(
//                 Array.from(selectedUserIds).map(async (userId) => {
//                     const user = allUsers.find(u => u.id === userId);
//                     if (!user) return null;
                    
//                     try {
//                         const userDetails = await getDetailedUserProfile(userId);
//                         return {
//                             employee_id: userId,
//                             from_shift_id: userDetails.shift_id || user.shift_id || 0,
//                             to_shift_id: newEmployeeShifts.get(userId) || 0
//                         };
//                     } catch (error) {
//                         return null;
//                     }
//                 })
//             );
            
//             const validNewRotations = newRotations.filter(r => r !== null);
//             const allRotations = [...currentRotations, ...validNewRotations];
            
//             // Extract date only from effective_from
//             const effectiveDate = new Date(rotation.effective_from).toISOString().split('T')[0];
            
//             // Update rotation
//             await updateShiftRotation(rotationId, {
//                 rotation_name: rotation.rotation_name,
//                 effective_from: effectiveDate,
//                 rotations: allRotations
//             });
            
//             toast({ 
//                 title: "Success", 
//                 description: `${validNewRotations.length} employee(s) added successfully.` 
//             });
            
//             // Reset and close
//             setSelectedUserIds(new Set());
//             setNewEmployeeShifts(new Map());
//             setSearchTerm('');
//             setFilterByShiftId('all');
//             setShowAddEmployeeDialog(false);
            
//             fetchData();
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: error?.message || "Failed to add employees.", 
//                 variant: "destructive" 
//             });
//         } finally {
//             setIsAddingEmployees(false);
//         }
//     };

//     const getStatusBadge = (status: string) => {
//         const statusMap: Record<string, { bg: string; text: string }> = {
//             'Draft': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
//             'Pending Approval': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
//             'Approved': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
//             'Executed': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
//         };
        
//         const config = statusMap[status] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };
        
//         return (
//             <Badge 
//                 variant="secondary"
//                 className={cn("font-medium text-sm px-3 py-1", config.bg, config.text)}
//             >
//                 {status}
//             </Badge>
//         );
//     };

//     const formatDateTime = (dateString: string) => {
//         try {
//             const date = new Date(dateString);
//             return date.toLocaleString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 timeZone: timezone
//             });
//         } catch (error) {
//             return dateString;
//         }
//     };

//     const getInitials = (name: string) => {
//         if (!name) return 'NA';
//         return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
//     };

//     const parseAuditDetails = (details: string) => {
//         if (!details) return null;
        
//         try {
//             const parsed = JSON.parse(details);
//             return parsed;
//         } catch (error) {
//             return details;
//         }
//     };

//     const renderAuditDetails = (action: string, details: string) => {
//         if (action !== 'REJECT_FOR_REWORK' && action !== 'Rejected' && action !== 'Send for Rework') {
//             return null;
//         }
        
//         if (!details) return null;
        
//         const parsed = parseAuditDetails(details);
        
//         if (typeof parsed === 'string') {
//             return (
//                 <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/20">
//                     <p className="text-xs font-medium text-destructive mb-1">Rejection Reason:</p>
//                     <p className="text-sm text-muted-foreground">{parsed}</p>
//                 </div>
//             );
//         }
        
//         if (typeof parsed === 'object' && parsed !== null) {
//             if (parsed.reason) {
//                 return (
//                     <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/20">
//                         <p className="text-xs font-medium text-destructive mb-1">Rejection Reason:</p>
//                         <p className="text-sm text-muted-foreground">{parsed.reason}</p>
//                     </div>
//                 );
//             }
            
//             return (
//                 <div className="space-y-1 text-xs mt-2">
//                     {Object.entries(parsed).map(([key, value]) => (
//                         <div key={key} className="flex gap-2">
//                             <span className="font-medium text-muted-foreground capitalize">
//                                 {key.replace(/_/g, ' ')}:
//                             </span>
//                             <span className="text-foreground">
//                                 {typeof value === 'object' ? JSON.stringify(value) : String(value)}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//             );
//         }
        
//         return null;
//     };

//     const allFilteredSelected = filteredUsers.length > 0 && 
//         filteredUsers.every(u => selectedUserIds.has(u.id));

//     const handleSelectAll = () => {
//         const allFilteredIds = filteredUsers.map(u => u.id);
        
//         if (allFilteredSelected) {
//             setSelectedUserIds(prev => {
//                 const newSet = new Set(prev);
//                 allFilteredIds.forEach(id => newSet.delete(id));
//                 return newSet;
//             });
//         } else {
//             setSelectedUserIds(prev => {
//                 const newSet = new Set(prev);
//                 allFilteredIds.forEach(id => newSet.add(id));
//                 return newSet;
//             });
//         }
//     };

//     if (isLoading) {
//         return (
//             <MainLayout>
//                 <div className="space-y-6">
//                     <div className="flex justify-between items-start">
//                         <div className="space-y-3">
//                             <Skeleton className="h-10 w-96" />
//                             <Skeleton className="h-5 w-64" />
//                             <Skeleton className="h-6 w-32" />
//                         </div>
//                         <div className="flex gap-2">
//                             <Skeleton className="h-10 w-24" />
//                             <Skeleton className="h-10 w-24" />
//                         </div>
//                     </div>
//                     <div className="grid gap-6 lg:grid-cols-2">
//                         <Skeleton className="h-96" />
//                         <Skeleton className="h-96" />
//                     </div>
//                 </div>
//             </MainLayout>
//         );
//     }

//     if (!rotation) {
//         return (
//             <MainLayout>
//                 <div className="flex items-center justify-center h-[50vh]">
//                     <div className="text-center space-y-3">
//                         <div className="p-4 rounded-full bg-muted inline-block">
//                             <AlertCircle className="h-8 w-8 text-muted-foreground" />
//                         </div>
//                         <div>
//                             <p className="text-lg font-semibold">Rotation not found</p>
//                             <p className="text-sm text-muted-foreground">
//                                 The requested shift rotation could not be loaded.
//                             </p>
//                         </div>
//                         <Button onClick={() => router.push('/management/shift-rotation')}>
//                             Back to Rotations
//                         </Button>
//                     </div>
//                 </div>
//             </MainLayout>
//         );
//     }

//     const employeeCount = rotation.details?.length || 0;
//     const auditLogs = rotation.audit || [];

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 {/* Rejection Reason Dialog */}
//                 <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
//                     <DialogContent>
//                         <DialogHeader>
//                             <DialogTitle>Reject Shift Rotation</DialogTitle>
//                             <DialogDescription>
//                                 Please provide a reason for sending this rotation back for rework. 
//                                 This will help the creator understand what needs to be changed.
//                             </DialogDescription>
//                         </DialogHeader>
//                         <div className="space-y-2 py-4">
//                             <Label htmlFor="rejection-reason">Rejection Reason <span className="text-destructive">*</span></Label>
//                             <Textarea
//                                 id="rejection-reason"
//                                 placeholder="Enter the reason for rejection..."
//                                 value={rejectionReason}
//                                 onChange={(e) => setRejectionReason(e.target.value)}
//                                 rows={4}
//                                 className="resize-none"
//                             />
//                         </div>
//                         <DialogFooter>
//                             <Button 
//                                 variant="outline" 
//                                 onClick={() => {
//                                     setShowRejectDialog(false);
//                                     setRejectionReason('');
//                                 }}
//                                 disabled={isRejecting}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button 
//                                 variant="destructive"
//                                 onClick={handleRejectConfirm}
//                                 disabled={isRejecting || !rejectionReason.trim()}
//                             >
//                                 {isRejecting ? (
//                                     <>
//                                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                         Processing...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <X className="h-4 w-4 mr-2" />
//                                         Send for Rework
//                                     </>
//                                 )}
//                             </Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>

//                 {/* Add Employee Dialog */}
//                 <Dialog open={showAddEmployeeDialog} onOpenChange={setShowAddEmployeeDialog}>
//                     <DialogContent className="max-w-4xl max-h-[90vh]">
//                         <DialogHeader>
//                             <DialogTitle>Add Employees to Rotation</DialogTitle>
//                             <DialogDescription>
//                                 Select employees and assign their target shifts
//                             </DialogDescription>
//                         </DialogHeader>
                        
//                         <div className="space-y-4">
//                             {/* Filters */}
//                             <div className="grid gap-4 md:grid-cols-2">
//                                 <div className="space-y-2">
//                                     <Label>Search</Label>
//                                     <div className="relative">
//                                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                                         <Input 
//                                             placeholder="Name, email, ID..." 
//                                             value={searchTerm}
//                                             onChange={e => setSearchTerm(e.target.value)}
//                                             className="pl-10"
//                                         />
//                                     </div>
//                                 </div>
                                
//                                 <div className="space-y-2">
//                                     <Label>Filter by Shift</Label>
//                                     <Select value={filterByShiftId} onValueChange={setFilterByShiftId}>
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="All Shifts" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="all">All Shifts</SelectItem>
//                                             {allShifts.map(shift => (
//                                                 <SelectItem key={shift.id} value={String(shift.id)}>
//                                                     {shift.name}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                             </div>
                            
//                             {/* Employee List */}
//                             <div className="space-y-2">
//                                 <div className="flex items-center justify-between">
//                                     <Label>Available Employees ({filteredUsers.length})</Label>
//                                     {filteredUsers.length > 0 && (
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={handleSelectAll}
//                                             className="h-8 text-xs"
//                                         >
//                                             {allFilteredSelected ? 'Deselect All' : 'Select All'}
//                                         </Button>
//                                     )}
//                                 </div>
                                
//                                 <ScrollArea className="h-[400px] border rounded-lg">
//                                     {isLoadingUsers ? (
//                                         <div className="p-4 space-y-3">
//                                             {Array.from({ length: 5 }).map((_, i) => (
//                                                 <Skeleton key={i} className="h-20 w-full" />
//                                             ))}
//                                         </div>
//                                     ) : filteredUsers.length === 0 ? (
//                                         <div className="p-12 text-center">
//                                             <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
//                                             <p className="text-sm text-muted-foreground">No employees available</p>
//                                         </div>
//                                     ) : (
//                                         <div className="p-2 space-y-2">
//                                             {filteredUsers.map(user => {
//                                                 const isSelected = selectedUserIds.has(user.id);
//                                                 const targetShift = newEmployeeShifts.get(user.id);
                                                
//                                                 return (
//                                                     <Card key={user.id} className={cn(
//                                                         "p-3 transition-colors",
//                                                         isSelected && "bg-primary/5 border-primary/20"
//                                                     )}>
//                                                         <div className="space-y-3">
//                                                             <div className="flex items-start gap-3">
//                                                                 <Checkbox
//                                                                     checked={isSelected}
//                                                                     onCheckedChange={() => toggleUserSelection(user.id)}
//                                                                     className="mt-1"
//                                                                 />
//                                                                 <Avatar className="h-10 w-10">
//                                                                     <AvatarImage src={user.profile_url} />
//                                                                     <AvatarFallback>{getInitials(`${user.first_name} ${user.last_name}`)}</AvatarFallback>
//                                                                 </Avatar>
//                                                                 <div className="flex-1 min-w-0">
//                                                                     <div className="flex items-center gap-2">
//                                                                         <p className="font-medium text-sm">
//                                                                             {user.first_name} {user.last_name}
//                                                                         </p>
//                                                                         <Badge variant="outline" className="text-xs">
//                                                                             {user.full_employee_id}
//                                                                         </Badge>
//                                                                     </div>
//                                                                     <p className="text-xs text-muted-foreground">{user.job_title}</p>
//                                                                 </div>
//                                                             </div>
                                                            
//                                                             {isSelected && (
//                                                                 <div className="pl-14 space-y-2">
//                                                                     <Label className="text-xs">Target Shift <span className="text-destructive">*</span></Label>
//                                                                     <Select
//                                                                         value={targetShift ? String(targetShift) : ""}
//                                                                         onValueChange={(value) => handleShiftSelect(user.id, Number(value))}
//                                                                     >
//                                                                         <SelectTrigger className={cn(
//                                                                             !targetShift && "border-amber-500"
//                                                                         )}>
//                                                                             <SelectValue placeholder="Select target shift" />
//                                                                         </SelectTrigger>
//                                                                         <SelectContent>
//                                                                             {allShifts
//                                                                                 .filter(s => s.id !== user.shift_id)
//                                                                                 .map(shift => (
//                                                                                     <SelectItem key={shift.id} value={String(shift.id)}>
//                                                                                         {shift.name}
//                                                                                     </SelectItem>
//                                                                                 ))
//                                                                             }
//                                                                         </SelectContent>
//                                                                     </Select>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </Card>
//                                                 );
//                                             })}
//                                         </div>
//                                     )}
//                                 </ScrollArea>
//                             </div>
//                         </div>
                        
//                         <DialogFooter>
//                             <Button 
//                                 variant="outline" 
//                                 onClick={() => {
//                                     setShowAddEmployeeDialog(false);
//                                     setSelectedUserIds(new Set());
//                                     setNewEmployeeShifts(new Map());
//                                     setSearchTerm('');
//                                     setFilterByShiftId('all');
//                                 }}
//                                 disabled={isAddingEmployees}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button 
//                                 onClick={handleAddEmployees}
//                                 disabled={isAddingEmployees || selectedUserIds.size === 0}
//                             >
//                                 {isAddingEmployees ? (
//                                     <>
//                                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                         Adding...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Plus className="h-4 w-4 mr-2" />
//                                         Add {selectedUserIds.size > 0 ? `${selectedUserIds.size} ` : ''}Employee{selectedUserIds.size !== 1 ? 's' : ''}
//                                     </>
//                                 )}
//                             </Button>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>

//                 {/* Header Section */}
//                 <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//                     <div className="space-y-3">
//                         <div className="flex items-center gap-3">
//                             <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20">
//                                 <RefreshCw className="h-6 w-6 text-primary" />
//                             </div>
//                             <div>
//                                 <h1 className="text-3xl font-bold tracking-tight">
//                                     {rotation.rotation_name}
//                                 </h1>
//                                 <div className="flex items-center gap-2 text-muted-foreground mt-1">
//                                     <Calendar className="h-4 w-4" />
//                                     <span>Effective from {new Date(rotation.effective_from).toLocaleDateString('en-US', {
//                                         year: 'numeric',
//                                         month: 'long',
//                                         day: 'numeric'
//                                     })}</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             {getStatusBadge(rotation.status)}
//                             <Badge variant="outline" className="flex items-center gap-1">
//                                 <Users className="h-3 w-3" />
//                                 {employeeCount} Employee{employeeCount !== 1 ? 's' : ''}
//                             </Badge>
//                         </div>
//                     </div>
                    
//                     {/* Action Buttons */}
//                     <div className="flex gap-2 flex-wrap">
//                         {/* Always show Delete and Edit buttons */}
//                         <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                                 <Button 
//                                     variant="destructive" 
//                                     disabled={isDeleting}
//                                     className="transition-all"
//                                 >
//                                     {isDeleting ? (
//                                         <>
//                                             <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                             Deleting...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Trash2 className="h-4 w-4 mr-2"/>
//                                             Delete
//                                         </>
//                                     )}
//                                 </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                                 <AlertDialogHeader>
//                                     <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                                     <AlertDialogDescription>
//                                         This action cannot be undone. This will permanently delete the shift rotation
//                                         for <span className="font-semibold">{rotation.rotation_name}</span> affecting {employeeCount} employee{employeeCount !== 1 ? 's' : ''}.
//                                     </AlertDialogDescription>
//                                 </AlertDialogHeader>
//                                 <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
//                                         Delete
//                                     </AlertDialogAction>
//                                 </AlertDialogFooter>
//                             </AlertDialogContent>
//                         </AlertDialog>
                        
//                         <Button 
//                             variant="outline" 
//                             onClick={handleOpenAddDialog}
//                             className="transition-all"
//                         >
//                             <Plus className="h-4 w-4 mr-2"/>
//                             Add Employees
//                         </Button>
                        
//                         {rotation.status === 'Draft' && (
//                             <Button 
//                                 onClick={handleSubmitForApproval}
//                                 disabled={isSubmitting || employeeCount === 0}
//                                 className="transition-all shadow-sm"
//                             >
//                                 {isSubmitting ? (
//                                     <>
//                                         <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                         Submitting...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Send className="h-4 w-4 mr-2"/>
//                                         Submit for Approval
//                                     </>
//                                 )}
//                             </Button>
//                         )}
                        
//                         {rotation.status === 'Pending Approval' && (
//                             <>
//                                 <Button 
//                                     variant="outline" 
//                                     disabled={isRejecting}
//                                     className="transition-all border-destructive text-destructive hover:bg-destructive/10"
//                                     onClick={handleRejectClick}
//                                 >
//                                     <X className="h-4 w-4 mr-2"/>
//                                     Send for Rework
//                                 </Button>
                                
//                                 <AlertDialog>
//                                     <AlertDialogTrigger asChild>
//                                         <Button 
//                                             disabled={isApproving}
//                                             className="transition-all shadow-sm"
//                                         >
//                                             {isApproving ? (
//                                                 <>
//                                                     <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                                                     Approving...
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <Check className="h-4 w-4 mr-2"/>
//                                                     Approve
//                                                 </>
//                                             )}
//                                         </Button>
//                                     </AlertDialogTrigger>
//                                     <AlertDialogContent>
//                                         <AlertDialogHeader>
//                                             <AlertDialogTitle>Approve Shift Rotation?</AlertDialogTitle>
//                                             <AlertDialogDescription>
//                                                 This will approve the shift rotation for <span className="font-semibold">{rotation.rotation_name}</span>. 
//                                                 The changes will be applied to {employeeCount} employee{employeeCount !== 1 ? 's' : ''} 
//                                                 starting from {new Date(rotation.effective_from).toLocaleDateString()}.
//                                             </AlertDialogDescription>
//                                         </AlertDialogHeader>
//                                         <AlertDialogFooter>
//                                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                             <AlertDialogAction onClick={() => handleApproval('Approved')}>
//                                                 Approve Rotation
//                                             </AlertDialogAction>
//                                         </AlertDialogFooter>
//                                     </AlertDialogContent>
//                                 </AlertDialog>
//                             </>
//                         )}
                        
//                         {rotation.status === 'Approved' && (
//                             <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
//                                 <AlertCircle className="h-4 w-4" />
//                                 <span className="text-sm font-medium">Rotation approved</span>
//                             </div>
//                         )}
                        
//                         {rotation.status === 'Executed' && (
//                             <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
//                                 <Check className="h-4 w-4" />
//                                 <span className="text-sm font-medium">Rotation executed</span>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Content Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {/* Employee Shift Changes Card */}
//                     <Card className="overflow-hidden">
//                         <CardHeader className="border-b bg-muted/50">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <Users className="h-5 w-5 text-primary" />
//                                     <CardTitle className="text-lg">Employee Shift Changes</CardTitle>
//                                 </div>
//                             </div>
//                             <CardDescription>
//                                 List of employees and their shift transitions
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent className="p-0">
//                             <ScrollArea className="h-[500px]">
//                                 {!rotation.details || rotation.details.length === 0 ? (
//                                     <div className="p-12">
//                                         <div className="flex flex-col items-center justify-center space-y-3">
//                                             <div className="p-4 rounded-full bg-muted">
//                                                 <Users className="h-8 w-8 text-muted-foreground" />
//                                             </div>
//                                             <div className="space-y-1 text-center">
//                                                 <p className="text-sm font-medium">No employees assigned</p>
//                                                 <p className="text-xs text-muted-foreground">
//                                                     Add employees to this rotation
//                                                 </p>
//                                             </div>
//                                             <Button onClick={handleOpenAddDialog} size="sm">
//                                                 <Plus className="h-4 w-4 mr-2" />
//                                                 Add Employees
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <Table>
//                                         <TableHeader className="sticky top-0 bg-background z-10">
//                                             <TableRow>
//                                                 <TableHead>Employee</TableHead>
//                                                 <TableHead>From Shift</TableHead>
//                                                 <TableHead>To Shift</TableHead>
//                                                 <TableHead className="text-right">Action</TableHead>
//                                             </TableRow>
//                                         </TableHeader>
//                                         <TableBody>
//                                             {rotation.details.map((d, index) => (
//                                                 <TableRow key={d.id || d.employee_id} className={cn(
//                                                     "transition-colors",
//                                                     index % 2 === 0 && "bg-muted/20"
//                                                 )}>
//                                                     <TableCell>
//                                                         <div className="flex items-center gap-2">
//                                                             <Avatar className="h-8 w-8">
//                                                                 <AvatarFallback className="text-xs">
//                                                                     {getInitials(d.employee_name)}
//                                                                 </AvatarFallback>
//                                                             </Avatar>
//                                                             <span className="font-medium text-sm">{d.employee_name}</span>
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Badge 
//                                                             variant="secondary"
//                                                             className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
//                                                         >
//                                                             {d.from_shift_name}
//                                                         </Badge>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <div className="flex items-center gap-2">
//                                                             <ArrowRight className="h-3 w-3 text-muted-foreground" />
//                                                             <Badge 
//                                                                 variant="secondary"
//                                                                 className="bg-primary/10 text-primary"
//                                                             >
//                                                                 {d.to_shift_name}
//                                                             </Badge>
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell className="text-right">
//                                                         <AlertDialog>
//                                                             <AlertDialogTrigger asChild>
//                                                                 <Button 
//                                                                     variant="ghost" 
//                                                                     size="icon"
//                                                                     disabled={isDeletingEmployee && employeeToDelete === d.employee_id}
//                                                                     className="hover:bg-destructive/10 hover:text-destructive"
//                                                                 >
//                                                                     {isDeletingEmployee && employeeToDelete === d.employee_id ? (
//                                                                         <RefreshCw className="h-4 w-4 animate-spin" />
//                                                                     ) : (
//                                                                         <Trash2 className="h-4 w-4" />
//                                                                     )}
//                                                                 </Button>
//                                                             </AlertDialogTrigger>
//                                                             <AlertDialogContent>
//                                                                 <AlertDialogHeader>
//                                                                     <AlertDialogTitle>Remove Employee?</AlertDialogTitle>
//                                                                     <AlertDialogDescription>
//                                                                         Are you sure you want to remove <span className="font-semibold">{d.employee_name}</span> from this rotation? 
//                                                                         This action cannot be undone.
//                                                                     </AlertDialogDescription>
//                                                                 </AlertDialogHeader>
//                                                                 <AlertDialogFooter>
//                                                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                                                     <AlertDialogAction 
//                                                                         onClick={() => handleDeleteEmployee(d.employee_id)}
//                                                                         className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                                                                     >
//                                                                         Remove
//                                                                     </AlertDialogAction>
//                                                                 </AlertDialogFooter>
//                                                             </AlertDialogContent>
//                                                         </AlertDialog>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 )}
//                             </ScrollArea>
//                         </CardContent>
//                     </Card>
                    
//                     {/* Audit History Card - Same as before */}
//                     <Card className="overflow-hidden">
//                         <CardHeader className="border-b bg-muted/50">
//                             <div className="flex items-center gap-2">
//                                 <Clock className="h-5 w-5 text-primary" />
//                                 <CardTitle className="text-lg">Audit History</CardTitle>
//                             </div>
//                             <CardDescription>
//                                 Timeline of all actions performed on this rotation
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent className="p-0">
//                             <ScrollArea className="h-[500px]">
//                                 {auditLogs.length === 0 ? (
//                                     <div className="p-12">
//                                         <div className="flex flex-col items-center justify-center space-y-3">
//                                             <div className="p-4 rounded-full bg-muted">
//                                                 <Clock className="h-8 w-8 text-muted-foreground" />
//                                             </div>
//                                             <div className="space-y-1 text-center">
//                                                 <p className="text-sm font-medium">No audit logs</p>
//                                                 <p className="text-xs text-muted-foreground">
//                                                     Audit history will appear here
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <div className="p-4">
//                                         <div className="space-y-4">
//                                             {auditLogs.map((log, index) => (
//                                                 <div 
//                                                     key={log.id}
//                                                     className="relative flex gap-4 pb-4"
//                                                 >
//                                                     {index !== auditLogs.length - 1 && (
//                                                         <div className="absolute left-4 top-10 bottom-0 w-px bg-border" />
//                                                     )}
                                                    
//                                                     <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-background">
//                                                         <AvatarFallback className="text-xs">
//                                                             {getInitials(log.changed_by_name)}
//                                                         </AvatarFallback>
//                                                     </Avatar>
                                                    
//                                                     <div className="flex-1 space-y-1">
//                                                         <div className="flex items-center justify-between gap-2">
//                                                             <p className="text-sm font-medium">{log.changed_by_name}</p>
//                                                             <span className="text-xs text-muted-foreground">
//                                                                 {formatDateTime(log.changed_at)}
//                                                             </span>
//                                                         </div>
//                                                         <div className="rounded-lg bg-muted/50 p-3">
//                                                             <p className="text-sm">
//                                                                 <span className="font-medium">{log.action}</span>
//                                                             </p>
//                                                             {log.details && renderAuditDetails(log.action, log.details)}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </ScrollArea>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </MainLayout>
//     );
// }



"use client"

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { getShiftRotationDetails, submitShiftRotationForApproval, processShiftRotationApproval, updateShiftRotation, deleteShiftRotation, getAllUserProfiles, getShifts, getDetailedUserProfile, type ShiftRotationDetails, type ShiftRotationDetailItem, type UserProfile, type Shift } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Check, Send, Trash2, X, RefreshCw, Calendar, Users, Clock, Edit, AlertCircle, Plus, Search, Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShiftRotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const rotationId = Number(params.id);
    const { toast } = useToast();
    
    const [rotation, setRotation] = React.useState<ShiftRotationDetails | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isApproving, setIsApproving] = React.useState(false);
    const [isRejecting, setIsRejecting] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isDeletingEmployee, setIsDeletingEmployee] = React.useState(false);
    const [employeeToDelete, setEmployeeToDelete] = React.useState<number | null>(null);
    
    // Edit mode states
    const [isEditingBasicInfo, setIsEditingBasicInfo] = React.useState(false);
    const [editedRotationName, setEditedRotationName] = React.useState('');
    const [editedEffectiveFrom, setEditedEffectiveFrom] = React.useState('');
    const [isSavingBasicInfo, setIsSavingBasicInfo] = React.useState(false);
    
    // Employee shift edit states
    const [editingEmployeeId, setEditingEmployeeId] = React.useState<number | null>(null);
    const [editedShiftId, setEditedShiftId] = React.useState<number | null>(null);
    const [isSavingEmployeeShift, setIsSavingEmployeeShift] = React.useState(false);
    
    // Rejection reason dialog state
    const [showRejectDialog, setShowRejectDialog] = React.useState(false);
    const [rejectionReason, setRejectionReason] = React.useState('');
    
    // Add employee dialog state
    const [showAddEmployeeDialog, setShowAddEmployeeDialog] = React.useState(false);
    const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);
    const [allShifts, setAllShifts] = React.useState<Shift[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
    const [isLoadingShifts, setIsLoadingShifts] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterByShiftId, setFilterByShiftId] = React.useState<string>('all');
    const [selectedUserIds, setSelectedUserIds] = React.useState<Set<number>>(new Set());
    const [newEmployeeShifts, setNewEmployeeShifts] = React.useState<Map<number, number>>(new Map());
    const [isAddingEmployees, setIsAddingEmployees] = React.useState(false);
    
    // Get timezone from localStorage
    const timezone = typeof window !== 'undefined' 
        ? localStorage.getItem('selectedTimezone') ?? 'UTC' 
        : 'UTC';

    const fetchData = React.useCallback(async () => {
        if (!rotationId || isNaN(rotationId)) {
            toast({ 
                title: "Error", 
                description: "Invalid rotation ID.", 
                variant: "destructive" 
            });
            router.push('/management/shift-rotation');
            return;
        }
        
        setIsLoading(true);
        try {
            const data = await getShiftRotationDetails(rotationId);
            setRotation(data);
            setEditedRotationName(data.rotation_name);
            setEditedEffectiveFrom(new Date(data.effective_from).toISOString().split('T')[0]);
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Could not load rotation details.", 
                variant: "destructive" 
            });
            router.push('/management/shift-rotation');
        } finally {
            setIsLoading(false);
        }
    }, [rotationId, toast, router]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Load shifts for edit mode
    React.useEffect(() => {
        if (allShifts.length === 0) {
            getShifts().then(setAllShifts).catch(() => {});
        }
    }, [allShifts.length]);

    // Load users and shifts when add dialog opens
    const handleOpenAddDialog = async () => {
        setShowAddEmployeeDialog(true);
        
        if (allUsers.length === 0) {
            setIsLoadingUsers(true);
            try {
                const response = await getAllUserProfiles(1, 1000);
                const activeUsers = response.data.filter(user => user.is_active == true);
                setAllUsers(activeUsers);
            } catch (error) {
                toast({ 
                    title: "Error", 
                    description: "Could not load employees.", 
                    variant: "destructive" 
                });
            } finally {
                setIsLoadingUsers(false);
            }
        }
        
        if (allShifts.length === 0) {
            setIsLoadingShifts(true);
            try {
                const shifts = await getShifts();
                setAllShifts(shifts);
            } catch (error) {
                toast({ 
                    title: "Error", 
                    description: "Could not load shifts.", 
                    variant: "destructive" 
                });
            } finally {
                setIsLoadingShifts(false);
            }
        }
    };

    const handleEditBasicInfo = () => {
        setIsEditingBasicInfo(true);
    };

    const handleCancelBasicInfoEdit = () => {
        if (rotation) {
            setEditedRotationName(rotation.rotation_name);
            setEditedEffectiveFrom(new Date(rotation.effective_from).toISOString().split('T')[0]);
        }
        setIsEditingBasicInfo(false);
    };

    const handleSaveBasicInfo = async () => {
        if (!rotation || !editedRotationName.trim()) {
            toast({ 
                title: "Validation Error", 
                description: "Rotation name is required.", 
                variant: "destructive" 
            });
            return;
        }

        setIsSavingBasicInfo(true);
        
        try {
            const currentRotations = rotation.details.map(d => ({
                employee_id: d.employee_id,
                from_shift_id: d.from_shift_id,
                to_shift_id: d.to_shift_id
            }));
            
            await updateShiftRotation(rotationId, {
                rotation_name: editedRotationName,
                effective_from: editedEffectiveFrom,
                rotations: currentRotations
            });
            
            toast({ 
                title: "Success", 
                description: "Rotation details updated successfully." 
            });
            
            setIsEditingBasicInfo(false);
            fetchData();
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Failed to update rotation details.", 
                variant: "destructive" 
            });
        } finally {
            setIsSavingBasicInfo(false);
        }
    };

    const handleEditEmployeeShift = (employeeId: number, currentShiftId: number) => {
        setEditingEmployeeId(employeeId);
        setEditedShiftId(currentShiftId);
    };

    const handleCancelEmployeeShiftEdit = () => {
        setEditingEmployeeId(null);
        setEditedShiftId(null);
    };

    const handleSaveEmployeeShift = async (employeeId: number) => {
        if (!rotation || !editedShiftId) return;

        setIsSavingEmployeeShift(true);

        try {
            const updatedRotations = rotation.details.map(d => {
                if (d.employee_id === employeeId) {
                    return {
                        employee_id: d.employee_id,
                        from_shift_id: d.from_shift_id,
                        to_shift_id: editedShiftId
                    };
                }
                return {
                    employee_id: d.employee_id,
                    from_shift_id: d.from_shift_id,
                    to_shift_id: d.to_shift_id
                };
            });

            const effectiveDate = new Date(rotation.effective_from).toISOString().split('T')[0];

            await updateShiftRotation(rotationId, {
                rotation_name: rotation.rotation_name,
                effective_from: effectiveDate,
                rotations: updatedRotations
            });

            toast({ 
                title: "Success", 
                description: "Employee shift updated successfully." 
            });

            setEditingEmployeeId(null);
            setEditedShiftId(null);
            fetchData();
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Failed to update employee shift.", 
                variant: "destructive" 
            });
        } finally {
            setIsSavingEmployeeShift(false);
        }
    };
    
    const handleSubmitForApproval = async () => {
        setIsSubmitting(true);
        try {
            await submitShiftRotationForApproval(rotationId);
            toast({ 
                title: "Success", 
                description: "Rotation submitted for approval successfully." 
            });
            fetchData();
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Submission failed.", 
                variant: "destructive" 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApproval = async (status: 'Approved' | 'Draft', reason?: string) => {
        if (status === 'Approved') {
            setIsApproving(true);
        } else {
            setIsRejecting(true);
        }
        
        try {
            await processShiftRotationApproval(rotationId, status, reason);
            toast({ 
                title: "Success", 
                description: status === 'Approved' 
                    ? "Rotation has been approved successfully." 
                    : "Rotation sent back for rework." 
            });
            
            setShowRejectDialog(false);
            setRejectionReason('');
            
            fetchData();
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Action failed.", 
                variant: "destructive" 
            });
        } finally {
            setIsApproving(false);
            setIsRejecting(false);
        }
    };

    const handleRejectClick = () => {
        setShowRejectDialog(true);
    };

    const handleRejectConfirm = () => {
        if (!rejectionReason.trim()) {
            toast({ 
                title: "Validation Error", 
                description: "Please provide a reason for rejection.", 
                variant: "destructive" 
            });
            return;
        }
        handleApproval('Draft', rejectionReason);
    };
    
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteShiftRotation(rotationId);
            toast({ 
                title: "Success", 
                description: "Rotation deleted successfully." 
            });
            router.push('/management/shift-rotation');
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Deletion failed.", 
                variant: "destructive" 
            });
            setIsDeleting(false);
        }
    };

    const handleDeleteEmployee = async (employeeId: number) => {
        if (!rotation || !rotation.details) return;
        
        setIsDeletingEmployee(true);
        setEmployeeToDelete(employeeId);
        
        try {
            const updatedRotations = rotation.details
                .filter(d => d.employee_id !== employeeId)
                .map(d => ({
                    employee_id: d.employee_id,
                    from_shift_id: d.from_shift_id,
                    to_shift_id: d.to_shift_id
                }));
            
            const effectiveDate = new Date(rotation.effective_from).toISOString().split('T')[0];
            
            await updateShiftRotation(rotationId, {
                rotation_name: rotation.rotation_name,
                effective_from: effectiveDate,
                rotations: updatedRotations
            });
            
            toast({ 
                title: "Success", 
                description: "Employee removed from rotation successfully." 
            });
            
            fetchData();
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Failed to remove employee.", 
                variant: "destructive" 
            });
        } finally {
            setIsDeletingEmployee(false);
            setEmployeeToDelete(null);
        }
    };

    // Filter users
    const filteredUsers = React.useMemo(() => {
        if (!rotation || !rotation.details) return allUsers;
        
        const addedEmployeeIds = new Set(rotation.details.map(r => r.employee_id));
        
        return allUsers.filter(user => {
            if (addedEmployeeIds.has(user.id)) return false;
            
            if (filterByShiftId !== 'all' && user.shift_id !== parseInt(filterByShiftId)) {
                return false;
            }
            
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
                const email = user.email?.toLowerCase() || '';
                const employeeId = user.full_employee_id?.toLowerCase() || '';
                
                return fullName.includes(searchLower) || 
                       email.includes(searchLower) || 
                       employeeId.includes(searchLower);
            }
            
            return true;
        });
    }, [allUsers, searchTerm, filterByShiftId, rotation]);

    const toggleUserSelection = (userId: number) => {
        setSelectedUserIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
                setNewEmployeeShifts(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(userId);
                    return newMap;
                });
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    };

    const handleShiftSelect = (userId: number, shiftId: number) => {
        setNewEmployeeShifts(prev => {
            const newMap = new Map(prev);
            newMap.set(userId, shiftId);
            return newMap;
        });
    };

    const handleAddEmployees = async () => {
        if (selectedUserIds.size === 0) {
            toast({ 
                title: "No Selection", 
                description: "Please select at least one employee.", 
                variant: "default" 
            });
            return;
        }
        
        const missingShifts = Array.from(selectedUserIds).filter(id => !newEmployeeShifts.has(id));
        if (missingShifts.length > 0) {
            toast({ 
                title: "Validation Error", 
                description: "Please select target shift for all selected employees.", 
                variant: "destructive" 
            });
            return;
        }
        
        setIsAddingEmployees(true);
        
        try {
            if (!rotation || !rotation.details) return;
            
            const currentRotations = rotation.details.map(d => ({
                employee_id: d.employee_id,
                from_shift_id: d.from_shift_id,
                to_shift_id: d.to_shift_id
            }));
            
            const newRotations = await Promise.all(
                Array.from(selectedUserIds).map(async (userId) => {
                    const user = allUsers.find(u => u.id === userId);
                    if (!user) return null;
                    
                    try {
                        const userDetails = await getDetailedUserProfile(userId);
                        return {
                            employee_id: userId,
                            from_shift_id: userDetails.shift_id || user.shift_id || 0,
                            to_shift_id: newEmployeeShifts.get(userId) || 0
                        };
                    } catch (error) {
                        return null;
                    }
                })
            );
            
            const validNewRotations = newRotations.filter(r => r !== null);
            const allRotations = [...currentRotations, ...validNewRotations];
            
            const effectiveDate = new Date(rotation.effective_from).toISOString().split('T')[0];
            
            await updateShiftRotation(rotationId, {
                rotation_name: rotation.rotation_name,
                effective_from: effectiveDate,
                rotations: allRotations
            });
            
            toast({ 
                title: "Success", 
                description: `${validNewRotations.length} employee(s) added successfully.` 
            });
            
            setSelectedUserIds(new Set());
            setNewEmployeeShifts(new Map());
            setSearchTerm('');
            setFilterByShiftId('all');
            setShowAddEmployeeDialog(false);
            
            fetchData();
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Failed to add employees.", 
                variant: "destructive" 
            });
        } finally {
            setIsAddingEmployees(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { bg: string; text: string }> = {
            'Draft': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
            'Pending Approval': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
            'Approved': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
            'Executed': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
        };
        
        const config = statusMap[status] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };
        
        return (
            <Badge 
                variant="secondary"
                className={cn("font-medium text-sm px-3 py-1", config.bg, config.text)}
            >
                {status}
            </Badge>
        );
    };

    const formatDateTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: timezone
            });
        } catch (error) {
            return dateString;
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'NA';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const parseAuditDetails = (details: string) => {
        if (!details) return null;
        
        try {
            const parsed = JSON.parse(details);
            return parsed;
        } catch (error) {
            return details;
        }
    };

    const renderAuditDetails = (action: string, details: string) => {
        if (action !== 'REJECT_FOR_REWORK' && action !== 'Rejected' && action !== 'Send for Rework') {
            return null;
        }
        
        if (!details) return null;
        
        const parsed = parseAuditDetails(details);
        
        if (typeof parsed === 'string') {
            return (
                <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/20">
                    <p className="text-xs font-medium text-destructive mb-1">Rejection Reason:</p>
                    <p className="text-sm text-muted-foreground">{parsed}</p>
                </div>
            );
        }
        
        if (typeof parsed === 'object' && parsed !== null) {
            if (parsed.reason) {
                return (
                    <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/20">
                        <p className="text-xs font-medium text-destructive mb-1">Rejection Reason:</p>
                        <p className="text-sm text-muted-foreground">{parsed.reason}</p>
                    </div>
                );
            }
            
            return (
                <div className="space-y-1 text-xs mt-2">
                    {Object.entries(parsed).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                            <span className="font-medium text-muted-foreground capitalize">
                                {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-foreground">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        
        return null;
    };

    const allFilteredSelected = filteredUsers.length > 0 && 
        filteredUsers.every(u => selectedUserIds.has(u.id));

    const handleSelectAll = () => {
        const allFilteredIds = filteredUsers.map(u => u.id);
        
        if (allFilteredSelected) {
            setSelectedUserIds(prev => {
                const newSet = new Set(prev);
                allFilteredIds.forEach(id => newSet.delete(id));
                return newSet;
            });
        } else {
            setSelectedUserIds(prev => {
                const newSet = new Set(prev);
                allFilteredIds.forEach(id => newSet.add(id));
                return newSet;
            });
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-96" />
                            <Skeleton className="h-5 w-64" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Skeleton className="h-96" />
                        <Skeleton className="h-96" />
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!rotation) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="text-center space-y-3">
                        <div className="p-4 rounded-full bg-muted inline-block">
                            <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Rotation not found</p>
                            <p className="text-sm text-muted-foreground">
                                The requested shift rotation could not be loaded.
                            </p>
                        </div>
                        <Button onClick={() => router.push('/management/shift-rotation')}>
                            Back to Rotations
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const employeeCount = rotation.details?.length || 0;
    const auditLogs = rotation.audit || [];

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Rejection Reason Dialog */}
                <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Shift Rotation</DialogTitle>
                            <DialogDescription>
                                Please provide a reason for sending this rotation back for rework. 
                                This will help the creator understand what needs to be changed.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-4">
                            <Label htmlFor="rejection-reason">Rejection Reason <span className="text-destructive">*</span></Label>
                            <Textarea
                                id="rejection-reason"
                                placeholder="Enter the reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setShowRejectDialog(false);
                                    setRejectionReason('');
                                }}
                                disabled={isRejecting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive"
                                onClick={handleRejectConfirm}
                                disabled={isRejecting || !rejectionReason.trim()}
                            >
                                {isRejecting ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <X className="h-4 w-4 mr-2" />
                                        Send for Rework
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Employee Dialog */}
                <Dialog open={showAddEmployeeDialog} onOpenChange={setShowAddEmployeeDialog}>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Add Employees to Rotation</DialogTitle>
                            <DialogDescription>
                                Select employees and assign their target shifts
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Search</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            placeholder="Name, email, ID..." 
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Filter by Shift</Label>
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
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Available Employees ({filteredUsers.length})</Label>
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
                                
                                <ScrollArea className="h-[400px] border rounded-lg">
                                    {isLoadingUsers ? (
                                        <div className="p-4 space-y-3">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Skeleton key={i} className="h-20 w-full" />
                                            ))}
                                        </div>
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">No employees available</p>
                                        </div>
                                    ) : (
                                        <div className="p-2 space-y-2">
                                            {filteredUsers.map(user => {
                                                const isSelected = selectedUserIds.has(user.id);
                                                const targetShift = newEmployeeShifts.get(user.id);
                                                
                                                return (
                                                    <Card key={user.id} className={cn(
                                                        "p-3 transition-colors",
                                                        isSelected && "bg-primary/5 border-primary/20"
                                                    )}>
                                                        <div className="space-y-3">
                                                            <div className="flex items-start gap-3">
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={() => toggleUserSelection(user.id)}
                                                                    className="mt-1"
                                                                />
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarImage src={user.profile_url} />
                                                                    <AvatarFallback>{getInitials(`${user.first_name} ${user.last_name}`)}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-medium text-sm">
                                                                            {user.first_name} {user.last_name}
                                                                        </p>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {user.full_employee_id}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">{user.job_title}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            {isSelected && (
                                                                <div className="pl-14 space-y-2">
                                                                    <Label className="text-xs">Target Shift <span className="text-destructive">*</span></Label>
                                                                    <Select
                                                                        value={targetShift ? String(targetShift) : ""}
                                                                        onValueChange={(value) => handleShiftSelect(user.id, Number(value))}
                                                                    >
                                                                        <SelectTrigger className={cn(
                                                                            !targetShift && "border-amber-500"
                                                                        )}>
                                                                            <SelectValue placeholder="Select target shift" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {allShifts
                                                                                .filter(s => s.id !== user.shift_id)
                                                                                .map(shift => (
                                                                                    <SelectItem key={shift.id} value={String(shift.id)}>
                                                                                        {shift.name}
                                                                                    </SelectItem>
                                                                                ))
                                                                            }
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        </div>
                        
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setShowAddEmployeeDialog(false);
                                    setSelectedUserIds(new Set());
                                    setNewEmployeeShifts(new Map());
                                    setSearchTerm('');
                                    setFilterByShiftId('all');
                                }}
                                disabled={isAddingEmployees}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleAddEmployees}
                                disabled={isAddingEmployees || selectedUserIds.size === 0}
                            >
                                {isAddingEmployees ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add {selectedUserIds.size > 0 ? `${selectedUserIds.size} ` : ''}Employee{selectedUserIds.size !== 1 ? 's' : ''}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-start gap-3">
                            <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20 mt-1">
                                <RefreshCw className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                {isEditingBasicInfo ? (
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label className="text-sm">Rotation Name</Label>
                                            <Input 
                                                value={editedRotationName}
                                                onChange={(e) => setEditedRotationName(e.target.value)}
                                                placeholder="Enter rotation name"
                                                className="text-2xl font-bold h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm">Effective From</Label>
                                            <Input 
                                                type="date"
                                                value={editedEffectiveFrom}
                                                onChange={(e) => setEditedEffectiveFrom(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm"
                                                onClick={handleSaveBasicInfo}
                                                disabled={isSavingBasicInfo}
                                            >
                                                {isSavingBasicInfo ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Save
                                                    </>
                                                )}
                                            </Button>
                                            <Button 
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCancelBasicInfoEdit}
                                                disabled={isSavingBasicInfo}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-3xl font-bold tracking-tight">
                                                {rotation.rotation_name}
                                            </h1>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleEditBasicInfo}
                                                className="h-8 w-8"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Effective from {new Date(rotation.effective_from).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {!isEditingBasicInfo && (
                            <div className="flex items-center gap-3">
                                {getStatusBadge(rotation.status)}
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {employeeCount} Employee{employeeCount !== 1 ? 's' : ''}
                                </Badge>
                            </div>
                        )}
                    </div>
                    
                    {/* Action Buttons */}
                    {!isEditingBasicInfo && (
                        <div className="flex gap-2 flex-wrap">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant="destructive" 
                                        disabled={isDeleting}
                                        className="transition-all"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="h-4 w-4 mr-2"/>
                                                Delete
                                            </>
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the shift rotation
                                            for <span className="font-semibold">{rotation.rotation_name}</span> affecting {employeeCount} employee{employeeCount !== 1 ? 's' : ''}.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            
                            <Button 
                                variant="outline" 
                                onClick={handleOpenAddDialog}
                                className="transition-all"
                            >
                                <Plus className="h-4 w-4 mr-2"/>
                                Add Employees
                            </Button>
                            
                            {rotation.status === 'Draft' && (
                                <Button 
                                    onClick={handleSubmitForApproval}
                                    disabled={isSubmitting || employeeCount === 0}
                                    className="transition-all shadow-sm"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2"/>
                                            Submit for Approval
                                        </>
                                    )}
                                </Button>
                            )}
                            
                            {rotation.status === 'Pending Approval' && (
                                <>
                                    <Button 
                                        variant="outline" 
                                        disabled={isRejecting}
                                        className="transition-all border-destructive text-destructive hover:bg-destructive/10"
                                        onClick={handleRejectClick}
                                    >
                                        <X className="h-4 w-4 mr-2"/>
                                        Send for Rework
                                    </Button>
                                    
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button 
                                                disabled={isApproving}
                                                className="transition-all shadow-sm"
                                            >
                                                {isApproving ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                        Approving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="h-4 w-4 mr-2"/>
                                                        Approve
                                                    </>
                                                )}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Approve Shift Rotation?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will approve the shift rotation for <span className="font-semibold">{rotation.rotation_name}</span>. 
                                                    The changes will be applied to {employeeCount} employee{employeeCount !== 1 ? 's' : ''} 
                                                    starting from {new Date(rotation.effective_from).toLocaleDateString()}.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleApproval('Approved')}>
                                                    Approve Rotation
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                            
                            {rotation.status === 'Approved' && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">Rotation approved</span>
                                </div>
                            )}
                            
                            {rotation.status === 'Executed' && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                                    <Check className="h-4 w-4" />
                                    <span className="text-sm font-medium">Rotation executed</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Employee Shift Changes Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">Employee Shift Changes</CardTitle>
                                </div>
                            </div>
                            <CardDescription>
                                List of employees and their shift transitions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[500px]">
                                {!rotation.details || rotation.details.length === 0 ? (
                                    <div className="p-12">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="p-4 rounded-full bg-muted">
                                                <Users className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-1 text-center">
                                                <p className="text-sm font-medium">No employees assigned</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Add employees to this rotation
                                                </p>
                                            </div>
                                            <Button onClick={handleOpenAddDialog} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Employees
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-background z-10">
                                            <TableRow>
                                                <TableHead>Employee</TableHead>
                                                <TableHead>From Shift</TableHead>
                                                <TableHead>To Shift</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rotation.details.map((d, index) => {
                                                const isEditing = editingEmployeeId === d.employee_id;
                                                
                                                return (
                                                    <TableRow key={d.id || d.employee_id} className={cn(
                                                        "transition-colors",
                                                        index % 2 === 0 && "bg-muted/20"
                                                    )}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback className="text-xs">
                                                                        {getInitials(d.employee_name)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-medium text-sm">{d.employee_name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge 
                                                                variant="secondary"
                                                                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                            >
                                                                {d.from_shift_name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {isEditing ? (
                                                                <Select
                                                                    value={editedShiftId ? String(editedShiftId) : String(d.to_shift_id)}
                                                                    onValueChange={(value) => setEditedShiftId(Number(value))}
                                                                >
                                                                    <SelectTrigger className="w-[180px]">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {allShifts
                                                                            .filter(s => s.id !== d.from_shift_id)
                                                                            .map(shift => (
                                                                                <SelectItem key={shift.id} value={String(shift.id)}>
                                                                                    {shift.name}
                                                                                </SelectItem>
                                                                            ))
                                                                        }
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                                    <Badge 
                                                                        variant="secondary"
                                                                        className="bg-primary/10 text-primary"
                                                                    >
                                                                        {d.to_shift_name}
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1">
                                                                {isEditing ? (
                                                                    <>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleSaveEmployeeShift(d.employee_id)}
                                                                            disabled={isSavingEmployeeShift}
                                                                            className="h-8 w-8 hover:bg-primary/10"
                                                                        >
                                                                            {isSavingEmployeeShift ? (
                                                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                                            ) : (
                                                                                <Check className="h-4 w-4 text-primary" />
                                                                            )}
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={handleCancelEmployeeShiftEdit}
                                                                            disabled={isSavingEmployeeShift}
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleEditEmployeeShift(d.employee_id, d.to_shift_id)}
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Button>
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button 
                                                                                    variant="ghost" 
                                                                                    size="icon"
                                                                                    disabled={isDeletingEmployee && employeeToDelete === d.employee_id}
                                                                                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                                                                >
                                                                                    {isDeletingEmployee && employeeToDelete === d.employee_id ? (
                                                                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                                                                    ) : (
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                    )}
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>Remove Employee?</AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                        Are you sure you want to remove <span className="font-semibold">{d.employee_name}</span> from this rotation? 
                                                                                        This action cannot be undone.
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                    <AlertDialogAction 
                                                                                        onClick={() => handleDeleteEmployee(d.employee_id)}
                                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                                    >
                                                                                        Remove
                                                                                    </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                    
                    {/* Audit History Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Audit History</CardTitle>
                            </div>
                            <CardDescription>
                                Timeline of all actions performed on this rotation
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[500px]">
                                {auditLogs.length === 0 ? (
                                    <div className="p-12">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="p-4 rounded-full bg-muted">
                                                <Clock className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div className="space-y-1 text-center">
                                                <p className="text-sm font-medium">No audit logs</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Audit history will appear here
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4">
                                        <div className="space-y-4">
                                            {auditLogs.map((log, index) => (
                                                <div 
                                                    key={log.id}
                                                    className="relative flex gap-4 pb-4"
                                                >
                                                    {index !== auditLogs.length - 1 && (
                                                        <div className="absolute left-4 top-10 bottom-0 w-px bg-border" />
                                                    )}
                                                    
                                                    <Avatar className="h-8 w-8 flex-shrink-0 ring-2 ring-background">
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(log.changed_by_name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-sm font-medium">{log.changed_by_name}</p>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDateTime(log.changed_at)}
                                                            </span>
                                                        </div>
                                                        <div className="rounded-lg bg-muted/50 p-3">
                                                            <p className="text-sm">
                                                                <span className="font-medium">{log.action}</span>
                                                            </p>
                                                            {log.details && renderAuditDetails(log.action, log.details)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
