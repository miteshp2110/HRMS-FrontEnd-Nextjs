"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getEmployeesInJob, type Job, type EmployeeInJob } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface JobEmployeesDialogProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobEmployeesDialog({ job, open, onOpenChange }: JobEmployeesDialogProps) {
  const { toast } = useToast();
  const [employees, setEmployees] = React.useState<EmployeeInJob[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && job) {
      const fetchEmployees = async () => {
        setIsLoading(true);
        try {
          const data = await getEmployeesInJob(job.id);
          setEmployees(data);
        } catch (error: any) {
          toast({ title: "Error", description: `Failed to fetch employees for job: ${error.message}`, variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchEmployees();
    }
  }, [open, job, toast]);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Employees with the "{job?.title}" Job Title</DialogTitle>
          <DialogDescription>
            A total of {employees.length} employee(s) have this job title.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto space-y-4">
            {isLoading ? <p className="text-center">Loading employees...</p> : 
             employees.length === 0 ? <p className="text-center text-muted-foreground py-8">No employees are currently assigned to this job title.</p> :
             employees.map(employee => (
                 <div key={employee.id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted">
                     <Avatar>
                         <AvatarImage className="object-cover" src={employee.profile_url || undefined} />
                         <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                         <p className="text-sm font-medium leading-none">{employee.name}</p>
                         <p className="text-sm text-muted-foreground">{employee.role_name || "No role assigned"}</p>
                     </div>
                     <Button variant="outline" size="sm" asChild>
                         <Link href={`/directory/${employee.id}`}>View Profile</Link>
                     </Button>
                 </div>
             ))
            }
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
