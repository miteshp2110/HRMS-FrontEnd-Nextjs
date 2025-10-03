
// "use client"

// import * as React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Users as UsersIcon, Search } from "lucide-react"
// import type { DetailedUserProfile, Role, Job, UserProfile, Shift } from "@/lib/api"
// import { getRoles, getJobs, getShifts, searchUsers, getDirectReports, searchUsersByPermissions, deactivateUser, updateUser } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import Link from "next/link"

// interface JobEmploymentTabProps {
//   profile: DetailedUserProfile
//   isEditing: boolean
//   onSave: (updatedData: Partial<DetailedUserProfile>) => Promise<void>
//   onCancel: () => void
// }

// export function JobEmploymentTab({ profile, isEditing, onSave, onCancel }: JobEmploymentTabProps) {
//   const { toast } = useToast();
//   const [formData, setFormData] = React.useState({ ...profile, job_role: 0, system_role: 0, shift_id: 0 });
//   const [roles, setRoles] = React.useState<Role[]>([])
//   const [jobs, setJobs] = React.useState<Job[]>([])
//   const [shifts, setShifts] = React.useState<Shift[]>([])
//   const [managers, setManagers] = React.useState<UserProfile[]>([])
//   const [directReports, setDirectReports] = React.useState<UserProfile[]>([])
//   const [isLoadingReports, setIsLoadingReports] = React.useState(true);
//   const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = React.useState(false);
//   const [inactiveReason, setInactiveReason] = React.useState("");
//   const [managerSearch, setManagerSearch] = React.useState("");
//   const [isManagerPopoverOpen, setIsManagerPopoverOpen] = React.useState(false);


//   React.useEffect(() => {
//     const initializeData = async () => {
//         setIsLoadingReports(true);
//         getDirectReports(profile.id).then(setDirectReports).finally(() => setIsLoadingReports(false));

//         if (isEditing) {
//             const [rolesData, jobsData, shiftsData, managersData] = await Promise.all([
//                 getRoles(),
//                 getJobs(),
//                 getShifts(),
//                 searchUsersByPermissions(["leaves.approve","attendance.view"])
//             ]);
//             setRoles(rolesData);
//             setJobs(jobsData);
//             setShifts(shiftsData);
//             setManagers(managersData);

//             const currentJob = jobsData.find(j => j.title === profile.job_title);
//             const currentRole = rolesData.find(r => r.name === profile.role_name);
//             const currentShift = shiftsData.find(s => s.name === profile.shift_name);
            
//             setFormData({
//                 ...profile,
//                 job_role: currentJob ? currentJob.id : 0,
//                 system_role: currentRole ? currentRole.id : 0,
//                 shift_id: currentShift ? currentShift.id : 0,
//             });
//         } else {
//             setFormData(profile as any);
//         }
//     };
//     initializeData();
//   }, [profile, isEditing]);
  
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSelectChange = (name: "job_role" | "system_role" | "reports_to" | "shift_id", value: string) => {
//     setFormData({ ...formData, [name]: parseInt(value) || null });
//   };

//   const handleDeactivate = async () => {
//     if(directReports.length > 0) {
//         toast({ title: "Error", description: "There are employees reporting to this user. Please make changes before deactivating.", variant: "destructive" });
//         return;
//     }
//     if(!inactiveReason.trim()) {
//         toast({ title: "Reason Required", description: "Please provide a reason for deactivation.", variant: "destructive" });
//         return;
//     }
//     try {
//         await deactivateUser(profile.id, inactiveReason);
//         toast({ title: "Success", description: `${profile.first_name} has been deactivated.` });
//         setIsDeactivateDialogOpen(false);
//         onSave({inactive_reason:"@@##@@"}); // Trigger a profile refresh
//     } catch(error: any) {
//         toast({ title: "Error", description: `Failed to deactivate: ${error.message}`, variant: "destructive" });
//     }
//   }
  
//   const handleActivate = async () => {
//       try {
//           await updateUser(profile.id, { is_active: true });
//           toast({ title: "Success", description: `${profile.first_name} has been activated.` });
//           onSave({inactive_reason:"@@##@@"}); // Trigger a profile refresh
//       } catch (error: any) {
//            toast({ title: "Error", description: `Failed to activate: ${error.message}`, variant: "destructive" });
//       }
//   }

//   const handleSave = async () => {
//     const payload: Partial<DetailedUserProfile> & { shift_id?: number } = {};
//     const changedData = {
//         job_role: formData.job_role,
//         system_role: formData.system_role,
//         reports_to: formData.reports_to,
//         shift_id: formData.shift_id,
//         is_probation: !!formData.is_probation, 
//     };
    
//     const originalJob = jobs.find(j => j.title === profile.job_title);
//     if (originalJob?.id !== changedData.job_role) {
//       (payload as any).job_role = changedData.job_role;
//     }

//     const originalRole = roles.find(r => r.name === profile.role_name);
//     if(originalRole?.id !== changedData.system_role) {
//         (payload as any).system_role = changedData.system_role;
//     }
    
//     if(profile.reports_to !== changedData.reports_to) {
//         (payload as any).reports_to = changedData.reports_to;
//     }
    
//     const originalShift = shifts.find(s => s.name === profile.shift_name);
//     if(originalShift?.id !== changedData.shift_id) {
//         payload.shift_id = changedData.shift_id;
//     }

//     if(!!profile.is_probation !== changedData.is_probation) {
//         (payload as any).is_probation = changedData.is_probation;
//     }

//     if (Object.keys(payload).length > 0) {
//       await onSave(payload);
//     } else {
//       onCancel();
//     }
//   }
  
//   const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()

//   const calculateTenure = (joiningDate: string) => {
//     const start = new Date(joiningDate)
//     const now = new Date()
//     let years = now.getFullYear() - start.getFullYear()
//     let months = now.getMonth() - start.getMonth()
//     if (months < 0) {
//       years--;
//       months += 12;
//     }
//     return `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""}`
//   }
  
//   const getInitials = (firstName: string, lastName: string) => `${firstName[0]}${lastName[0]}`.toUpperCase()

//   const getProbationStatus = () => {
//       const joiningDate = new Date(profile.joining_date);
//       const probationEndDate = new Date(joiningDate.setMonth(joiningDate.getMonth() + 6));
//       const today = new Date();
//       if(today > probationEndDate) {
//           return "Probation Period Over";
//       }
//       const diffTime = Math.abs(probationEndDate.getTime() - today.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//       return `On Probation (${diffDays} days left)`;
//   }


//   return (
//     <div className="space-y-6">
//         <Card>
//         <CardHeader>
//             <CardTitle>Employment Details</CardTitle>
//             <CardDescription>Job role and employment information.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-1">
//                 <Label htmlFor="job_role">Job Title</Label>
//                 {isEditing ? (
//                     <Select name="job_role" value={String(formData.job_role || '')} onValueChange={(value) => handleSelectChange("job_role", value)}>
//                         <SelectTrigger><SelectValue placeholder="Select Job Title" /></SelectTrigger>
//                         <SelectContent>{jobs.map(j => <SelectItem key={j.id} value={String(j.id)}>{j.title}</SelectItem>)}</SelectContent>
//                     </Select>
//                 ) : (
//                     <p className="text-sm pt-2">{profile.job_title || "Not assigned"}</p>
//                 )}
//                 </div>
//                 <div className="space-y-1">
//                 <Label htmlFor="system_role">System Role</Label>
//                 {isEditing ? (
//                     <Select name="system_role" value={String(formData.system_role || '')} onValueChange={(value) => handleSelectChange("system_role", value)}>
//                         <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
//                         <SelectContent>{roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}</SelectContent>
//                     </Select>
//                 ) : (
//                     <div className="pt-2"><Badge variant="outline">{profile.role_name}</Badge></div>
//                 )}
//                 </div>
//                 <div className="space-y-1">
//                 <Label htmlFor="joining_date">Joining Date</Label>
//                 <p className="text-sm pt-2">{formatDate(profile.joining_date)}</p>
//                 </div>
//                 <div className="space-y-1">
//                 <Label>Tenure</Label>
//                 <p className="text-sm pt-2">{calculateTenure(profile.joining_date)}</p>
//                 </div>
//                 <div className="space-y-1">
//                 <Label htmlFor="reports_to">Reports To</Label>
//                 {isEditing ? (
//                      <Popover open={isManagerPopoverOpen} onOpenChange={setIsManagerPopoverOpen}>
//                         <PopoverTrigger asChild>
//                             <Button variant="outline" className="w-full justify-start">
//                                 {managers.find(m => m.id === formData.reports_to)?.first_name || "Select Manager"}
//                             </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-[300px] p-0">
//                             <Command>
//                                 <CommandInput placeholder="Search managers..." onValueChange={setManagerSearch} />
//                                 <CommandList>
//                                     <CommandEmpty>No managers found.</CommandEmpty>
//                                     <CommandGroup>
//                                         {managers.filter(m => m.first_name.toLowerCase().includes(managerSearch.toLowerCase())).map(m => (
//                                             <CommandItem key={m.id} onSelect={() => { handleSelectChange("reports_to", String(m.id)); setIsManagerPopoverOpen(false); }}>
//                                                 {m.first_name} {m.last_name}
//                                             </CommandItem>
//                                         ))}
//                                     </CommandGroup>
//                                 </CommandList>
//                             </Command>
//                         </PopoverContent>
//                     </Popover>
//                 ) : (
//                     <p className="text-sm pt-2">{profile.reports_to_name || "No manager assigned"}</p>
//                 )}
//                 </div>
//                 <div className="space-y-1">
//                 <Label htmlFor="shift_name">Shift</Label>
//                 {isEditing ? (
//                     <Select name="shift_id" value={String(formData.shift_id || '')} onValueChange={(value) => handleSelectChange("shift_id", value)}>
//                         <SelectTrigger><SelectValue placeholder="Select Shift" /></SelectTrigger>
//                         <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
//                     </Select>
//                 ) : (
//                     <p className="text-sm pt-2">{profile.shift_name || "Not assigned"}</p>
//                 )}
//                 </div>
//                 <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
//                     <div>
//                         <Label htmlFor="is_active">Employment Status</Label>
//                          <p className="text-xs text-muted-foreground">{profile.is_active ? "Currently active" : "Currently inactive"}</p>
//                     </div>
//                     {profile.is_active ?
//                     <TooltipProvider>
//                         <Tooltip>
//                             <TooltipTrigger asChild>
//                                 <div className="inline-block">
//                                     <Button type="button" variant="destructive" size="sm" onClick={() => setIsDeactivateDialogOpen(true)} disabled={directReports.length > 0}>Inactivate User</Button>
//                                 </div>
//                             </TooltipTrigger>
//                             {directReports.length > 0 && <TooltipContent><p>This user has direct reports and cannot be deactivated.</p></TooltipContent>}
//                         </Tooltip>
//                     </TooltipProvider> :
//                     <Button type="button" variant="default" size="sm" onClick={handleActivate}>Activate User</Button>
//                     }
//                 </div>
//                 <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
//                     <Label htmlFor="is_probation">Probation Status</Label>
//                     {isEditing ? (
//                         <Select name="is_probation" value={String(!!formData.is_probation)} onValueChange={(value) => setFormData({...formData, is_probation: value === 'true'})}>
//                             <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
//                             <SelectContent><SelectItem value="true">On Probation</SelectItem><SelectItem value="false">Probation Period Over</SelectItem></SelectContent>
//                         </Select>
//                     ) : (
//                         <Badge variant={profile.is_probation ? "secondary" : "default"} className={profile.is_probation ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}>
//                             {getProbationStatus()}
//                         </Badge>
//                     )}
//                 </div>
//             </div>
//              {!profile.is_active && (
//                 <div className="mt-4 p-4 bg-muted rounded-lg">
//                     <h4 className="font-semibold">Inactivation Details</h4>
//                     <p className="text-sm text-muted-foreground">
//                         <strong>Reason:</strong> {profile.inactive_reason || "Not provided"}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                         <strong>Date:</strong> {profile.inactive_date ? formatDate(profile.inactive_date) : "Not available"}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                         <strong>Inactivated By: </strong> <Link href={`/directory/${profile.inactivated_by}`}>{profile.inactivated_by_name}</Link>
//                     </p>
//                 </div>
//             )}
//             {isEditing && (
//                 <div className="flex justify-end gap-4 mt-6">
//                 <Button variant="outline" onClick={onCancel}>Cancel</Button>
//                 <Button onClick={handleSave}>Save Changes</Button>
//                 </div>
//             )}
//         </CardContent>
//         </Card>

//         {!isEditing && (
//              <Card>
//                 <CardHeader>
//                     <CardTitle>Direct Reports</CardTitle>
//                     <CardDescription>Employees who report to {profile.first_name}.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {isLoadingReports ? <p>Loading reports...</p> :
//                     directReports.length === 0 ? <p className="text-muted-foreground text-sm">This user does not manage any employees.</p> :
//                     (
//                         <div className="space-y-4">
//                            {directReports.map(report => (
//                                <div key={report.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted/50">
//                                    <Avatar>
//                                        <AvatarImage className="object-cover" src={report.profile_url} />
//                                        <AvatarFallback>{getInitials(report.first_name, report.last_name)}</AvatarFallback>
//                                    </Avatar>
//                                    <div className="flex-1">
//                                        <p className="text-sm font-medium leading-none">{report.first_name} {report.last_name}</p>
//                                        <p className="text-sm text-muted-foreground">{report.job_title || report.email}</p>
//                                    </div>
//                                    <Button variant="outline" size="sm" asChild>
//                                         <a href={`/directory/${report.id}`}>View Profile</a>
//                                    </Button>
//                                </div>
//                            ))}
//                         </div>
//                     )
//                     }
//                 </CardContent>
//             </Card>
//         )}
//         <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Inactivate User</DialogTitle>
//                     <DialogDescription>
//                         Deactivating a user will block their login, and they will be exempt from payroll and other facilities. Are you sure?
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="py-4">
//                     <Label htmlFor="inactive_reason">Reason for Inactivation</Label>
//                     <Input id="inactive_reason" value={inactiveReason} onChange={e => setInactiveReason(e.target.value)} />
//                 </div>
//                 <DialogFooter>
//                     <Button variant="ghost" onClick={() => setIsDeactivateDialogOpen(false)}>Cancel</Button>
//                     <Button variant="destructive" onClick={handleDeactivate}>Confirm Deactivation</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     </div>
//   )
// }

"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users as UsersIcon, Search } from "lucide-react"
import type { DetailedUserProfile, Role, Job, UserProfile, Shift } from "@/lib/api"
import { getRoles, getJobs, getShifts, searchUsers, getDirectReports, searchUsersByPermissions, deactivateUser, updateUser } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

interface JobEmploymentTabProps {
  profile: DetailedUserProfile
  isEditing: boolean
  isSelfProfile?: boolean
  onSave: (updatedData: Partial<DetailedUserProfile>) => Promise<void>
  onCancel: () => void
}

export function JobEmploymentTab({ profile, isEditing, isSelfProfile = false, onSave, onCancel }: JobEmploymentTabProps) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({ ...profile, job_role: 0, system_role: 0, shift_id: 0 });
  const [roles, setRoles] = React.useState<Role[]>([])
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [shifts, setShifts] = React.useState<Shift[]>([])
  const [managers, setManagers] = React.useState<UserProfile[]>([])
  const [directReports, setDirectReports] = React.useState<UserProfile[]>([])
  const [isLoadingReports, setIsLoadingReports] = React.useState(true);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = React.useState(false);
  const [inactiveReason, setInactiveReason] = React.useState("");
  const [managerSearch, setManagerSearch] = React.useState("");
  const [isManagerPopoverOpen, setIsManagerPopoverOpen] = React.useState(false);


  React.useEffect(() => {
    const initializeData = async () => {
        setIsLoadingReports(true);
        getDirectReports(profile.id).then(setDirectReports).finally(() => setIsLoadingReports(false));

        if (isEditing) {
            const [rolesData, jobsData, shiftsData, managersData] = await Promise.all([
                getRoles(),
                getJobs(),
                getShifts(),
                searchUsersByPermissions(["leaves.approve","attendance.view"])
            ]);
            setRoles(rolesData);
            setJobs(jobsData);
            setShifts(shiftsData);
            setManagers(managersData);

            const currentJob = jobsData.find(j => j.title === profile.job_title);
            const currentRole = rolesData.find(r => r.name === profile.role_name);
            const currentShift = shiftsData.find(s => s.name === profile.shift_name);
            
            setFormData({
                ...profile,
                job_role: currentJob ? currentJob.id : 0,
                system_role: currentRole ? currentRole.id : 0,
                shift_id: currentShift ? currentShift.id : 0,
            });
        } else {
            setFormData(profile as any);
        }
    };
    initializeData();
  }, [profile, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: "job_role" | "system_role" | "reports_to" | "shift_id", value: string) => {
    setFormData({ ...formData, [name]: parseInt(value) || null });
  };

  const handleDeactivate = async () => {
    if(directReports.length > 0) {
        toast({ title: "Error", description: "There are employees reporting to this user. Please make changes before deactivating.", variant: "destructive" });
        return;
    }
    if(!inactiveReason.trim()) {
        toast({ title: "Reason Required", description: "Please provide a reason for deactivation.", variant: "destructive" });
        return;
    }
    try {
        await deactivateUser(profile.id, inactiveReason);
        toast({ title: "Success", description: `${profile.first_name} has been deactivated.` });
        setIsDeactivateDialogOpen(false);
        await onSave({inactive_reason:"@@##@@"}); // Trigger a profile refresh
    } catch(error: any) {
        toast({ title: "Error", description: `Failed to deactivate: ${error.message}`, variant: "destructive" });
    }
  }
  
  const handleActivate = async () => {
      try {
          await updateUser(profile.id, { is_active: true });
          toast({ title: "Success", description: `${profile.first_name} has been activated.` });
          await onSave({inactive_reason:"@@##@@"}); // Trigger a profile refresh
      } catch (error: any) {
           toast({ title: "Error", description: `Failed to activate: ${error.message}`, variant: "destructive" });
      }
  }

  const handleSave = async () => {
    const payload: Partial<DetailedUserProfile> & { shift_id?: number } = {};
    const changedData = {
        job_role: formData.job_role,
        system_role: formData.system_role,
        reports_to: formData.reports_to,
        shift_id: formData.shift_id,
        is_probation: !!formData.is_probation, 
    };
    
    const originalJob = jobs.find(j => j.title === profile.job_title);
    if (originalJob?.id !== changedData.job_role) {
      (payload as any).job_role = changedData.job_role;
    }

    const originalRole = roles.find(r => r.name === profile.role_name);
    if(originalRole?.id !== changedData.system_role) {
        (payload as any).system_role = changedData.system_role;
    }
    
    if(profile.reports_to !== changedData.reports_to) {
        (payload as any).reports_to = changedData.reports_to;
    }
    
    const originalShift = shifts.find(s => s.name === profile.shift_name);
    if(originalShift?.id !== changedData.shift_id) {
        payload.shift_id = changedData.shift_id;
    }

    if(!!profile.is_probation !== changedData.is_probation) {
        (payload as any).is_probation = changedData.is_probation;
    }

    if (Object.keys(payload).length > 0) {
      await onSave(payload);
    } else {
      onCancel();
    }
  }
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()

  const calculateTenure = (joiningDate: string) => {
    const start = new Date(joiningDate)
    const now = new Date()
    let years = now.getFullYear() - start.getFullYear()
    let months = now.getMonth() - start.getMonth()
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${months !== 1 ? "s" : ""}`
  }
  
  const getInitials = (firstName: string, lastName: string) => `${firstName[0]}${lastName[0]}`.toUpperCase()

  const getProbationStatus = () => {
      const joiningDate = new Date(profile.joining_date);
      const probationEndDate = new Date(joiningDate.setMonth(joiningDate.getMonth() + 6));
      const today = new Date();
      if(today > probationEndDate) {
          return "Probation Period Over";
      }
      const diffTime = Math.abs(probationEndDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return `On Probation (${diffDays} days left)`;
  }


  return (
    <div className="space-y-6">
        <Card>
        <CardHeader>
            <CardTitle>Employment Details</CardTitle>
            <CardDescription>Job role and employment information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                <Label htmlFor="job_role">Job Title</Label>
                {isEditing ? (
                    <Select name="job_role" value={String(formData.job_role || '')} onValueChange={(value) => handleSelectChange("job_role", value)}>
                        <SelectTrigger><SelectValue placeholder="Select Job Title" /></SelectTrigger>
                        <SelectContent>{jobs.map(j => <SelectItem key={j.id} value={String(j.id)}>{j.title}</SelectItem>)}</SelectContent>
                    </Select>
                ) : (
                    <p className="text-sm pt-2">{profile.job_title || "Not assigned"}</p>
                )}
                </div>
                <div className="space-y-1">
                <Label htmlFor="system_role">System Role</Label>
                {isEditing ? (
                    <Select name="system_role" value={String(formData.system_role || '')} onValueChange={(value) => handleSelectChange("system_role", value)}>
                        <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                        <SelectContent>{roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}</SelectContent>
                    </Select>
                ) : (
                    <div className="pt-2"><Badge variant="outline">{profile.role_name}</Badge></div>
                )}
                </div>
                <div className="space-y-1">
                <Label htmlFor="joining_date">Joining Date</Label>
                <p className="text-sm pt-2">{formatDate(profile.joining_date)}</p>
                </div>
                <div className="space-y-1">
                <Label>Tenure</Label>
                <p className="text-sm pt-2">{calculateTenure(profile.joining_date)}</p>
                </div>
                <div className="space-y-1">
                <Label htmlFor="reports_to">Reports To</Label>
                {isEditing ? (
                     <Popover open={isManagerPopoverOpen} onOpenChange={setIsManagerPopoverOpen}>
                        <PopoverTrigger asChild>
                            <button  className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                {managers.find(m => m.id === formData.reports_to)?.first_name || "Select Manager"}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                <CommandInput placeholder="Search managers..." onValueChange={setManagerSearch} />
                                <CommandList>
                                    <CommandEmpty>No managers found.</CommandEmpty>
                                    <CommandGroup>
                                        {managers.filter(m => m.first_name.toLowerCase().includes(managerSearch.toLowerCase())).map(m => (
                                            <CommandItem key={m.id} onSelect={() => { handleSelectChange("reports_to", String(m.id)); setIsManagerPopoverOpen(false); }}>
                                                {m.first_name} {m.last_name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <p className="text-sm pt-2">{profile.reports_to_name || "No manager assigned"}</p>
                )}
                </div>
                <div className="space-y-1">
                <Label htmlFor="shift_name">Shift</Label>
                {isEditing ? (
                    <Select name="shift_id" value={String(formData.shift_id || '')} onValueChange={(value) => handleSelectChange("shift_id", value)}>
                        <SelectTrigger><SelectValue placeholder="Select Shift" /></SelectTrigger>
                        <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                ) : (
                    <p className="text-sm pt-2">{profile.shift_name || "Not assigned"}</p>
                )}
                </div>
                <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div>
                        <Label htmlFor="is_active">Employment Status</Label>
                         <p className="text-xs text-muted-foreground">{profile.is_active ? "Currently active" : "Currently inactive"}</p>
                    </div>
                    {!isSelfProfile && (
                         profile.is_active ?
                         <TooltipProvider>
                             <Tooltip>
                                 <TooltipTrigger asChild>
                                     <div className="inline-block">
                                         <Button type="button" variant="destructive" size="sm" onClick={() => setIsDeactivateDialogOpen(true)} disabled={directReports.length > 0}>Inactivate User</Button>
                                     </div>
                                 </TooltipTrigger>
                                 {directReports.length > 0 && <TooltipContent><p>This user has direct reports and cannot be deactivated.</p></TooltipContent>}
                             </Tooltip>
                         </TooltipProvider> :
                         <Button type="button" variant="default" size="sm" onClick={handleActivate}>Activate User</Button>
                    )}
                </div>
                <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <Label htmlFor="is_probation">Probation Status</Label>
                    {isEditing ? (
                        <Select name="is_probation" value={String(!!formData.is_probation)} onValueChange={(value) => setFormData({...formData, is_probation: value === 'true'})}>
                            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="true">On Probation</SelectItem><SelectItem value="false">Probation Period Over</SelectItem></SelectContent>
                        </Select>
                    ) : (
                        <Badge variant={profile.is_probation ? "secondary" : "default"} className={profile.is_probation ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}>
                            {getProbationStatus()}
                        </Badge>
                    )}
                </div>
            </div>
             {!profile.is_active && !isEditing && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold">Inactivation Details</h4>
                    <p className="text-sm text-muted-foreground">
                        <strong>Reason:</strong> {profile.inactive_reason || "Not provided"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <strong>Date:</strong> {profile.inactive_date ? formatDate(profile.inactive_date) : "Not available"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <strong>Inactivated By: </strong> <Link href={`/directory/${profile.inactivated_by}`}>{profile.inactivated_by_name}</Link>
                    </p>
                </div>
            )}
            {isEditing && (
                <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
                </div>
            )}
        </CardContent>
        </Card>

        {!isEditing && (
             <Card>
                <CardHeader>
                    <CardTitle>Direct Reports</CardTitle>
                    <CardDescription>Employees who report to {profile.first_name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingReports ? <p>Loading reports...</p> :
                    directReports.length === 0 ? <p className="text-muted-foreground text-sm">This user does not manage any employees.</p> :
                    (
                        <div className="space-y-4">
                           {directReports.map(report => (
                               <div key={report.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted/50">
                                   <Avatar>
                                       <AvatarImage className="object-cover" src={report.profile_url} />
                                       <AvatarFallback>{getInitials(report.first_name, report.last_name)}</AvatarFallback>
                                   </Avatar>
                                   <div className="flex-1">
                                       <p className="text-sm font-medium leading-none">{report.first_name} {report.last_name}</p>
                                       <p className="text-sm text-muted-foreground">{report.job_title || report.email}</p>
                                   </div>
                                   <Button variant="outline" size="sm" asChild>
                                        <a href={`/directory/${report.id}`}>View Profile</a>
                                   </Button>
                               </div>
                           ))}
                        </div>
                    )
                    }
                </CardContent>
            </Card>
        )}
        <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Inactivate User</DialogTitle>
                    <DialogDescription>
                        Deactivating a user will block their login, and they will be exempt from payroll and other facilities. Are you sure?
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="inactive_reason">Reason for Inactivation</Label>
                    <Input id="inactive_reason" value={inactiveReason} onChange={e => setInactiveReason(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsDeactivateDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeactivate}>Confirm Deactivation</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}