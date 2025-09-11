"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users as UsersIcon } from "lucide-react"
import type { DetailedUserProfile, Role, Job, UserProfile } from "@/lib/api"
import { getRoles, getJobs, searchUsers, getDirectReports, searchUsersByPermissions } from "@/lib/api"

interface JobEmploymentTabProps {
  profile: DetailedUserProfile
  isEditing: boolean
  onSave: (updatedData: Partial<DetailedUserProfile>) => Promise<void>
  onCancel: () => void
}

export function JobEmploymentTab({ profile, isEditing, onSave, onCancel }: JobEmploymentTabProps) {
  const [formData, setFormData] = React.useState({ ...profile, job_role: 0, system_role: 0 });
  const [roles, setRoles] = React.useState<Role[]>([])
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [managers, setManagers] = React.useState<UserProfile[]>([])
  const [directReports, setDirectReports] = React.useState<UserProfile[]>([])
  const [isLoadingReports, setIsLoadingReports] = React.useState(true);

  // This effect fetches data needed for viewing and editing
  React.useEffect(() => {
    const initializeData = async () => {
        // Always fetch direct reports
        setIsLoadingReports(true);
        getDirectReports(profile.id).then(setDirectReports).finally(() => setIsLoadingReports(false));

        if (isEditing) {
            // Fetch dropdown data only when entering edit mode
            const [rolesData, jobsData, managersData] = await Promise.all([
                getRoles(),
                getJobs(),
                // searchUsers("") // Fetch all users to act as potential managers
                searchUsersByPermissions(["leaves.approve","attendance.view"])
            ]);
            setRoles(rolesData);
            setJobs(jobsData);
            setManagers(managersData);

            const currentJob = jobsData.find(j => j.title === profile.job_title);
            const currentRole = rolesData.find(r => r.name === profile.role_name);
            
            setFormData({
                ...profile,
                job_role: currentJob ? currentJob.id : 0,
                system_role: currentRole ? currentRole.id : 0,
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

  const handleSelectChange = (name: "job_role" | "system_role" | "reports_to", value: string) => {
    setFormData({ ...formData, [name]: parseInt(value) || null });
  };

  const handleSwitchChange = (name: "is_active" | "is_probation", checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  }

  const handleSave = async () => {
    const payload: Partial<DetailedUserProfile> = {};

    // Map form state back to the expected API fields
    const changedData = {
        job_role: formData.job_role,
        system_role: formData.system_role,
        reports_to: formData.reports_to,
        is_active: formData.is_active,
        is_probation: !!formData.is_probation, // Ensure boolean
    };
    
    // Compare against the original profile to find what changed
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

    if(profile.is_active !== changedData.is_active) {
        (payload as any).is_active = changedData.is_active;
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
                    <Select name="reports_to" value={String(formData.reports_to || '')} onValueChange={(value) => handleSelectChange("reports_to", value)}>
                        <SelectTrigger><SelectValue placeholder="Select Manager" /></SelectTrigger>
                        <SelectContent>{managers.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.first_name} {m.last_name}</SelectItem>)}</SelectContent>
                    </Select>
                ) : (
                    <p className="text-sm pt-2">{profile.reports_to_name || "No manager assigned"}</p>
                )}
                </div>
                <div className="space-y-1">
                <Label htmlFor="shift_name">Shift</Label>
                <p className="text-sm pt-2">{profile.shift_name || "Not assigned"}</p>
                </div>
                <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <Label htmlFor="is_active">Employment Status</Label>
                    {isEditing ? (
                        <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => handleSwitchChange("is_active", checked)} />
                    ) : (
                        <Badge variant={profile.is_active ? "default" : "secondary"} className={profile.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {profile.is_active ? "Active" : "Inactive"}
                        </Badge>
                    )}
                </div>
                <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <Label htmlFor="is_probation">Probation Status</Label>
                    {isEditing ? (
                        <Switch id="is_probation" checked={!!formData.is_probation} onCheckedChange={(checked) => handleSwitchChange("is_probation", checked)} />
                    ) : (
                        <Badge variant={profile.is_probation ? "secondary" : "default"} className={profile.is_probation ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}>
                            {profile.is_probation ? "On Probation" : "Confirmed"}
                        </Badge>
                    )}
                </div>
            </div>
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
                                       <AvatarImage src={report.profile_url} />
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
    </div>
  )
}