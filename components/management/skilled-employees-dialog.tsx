"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getEmployeesBySkill, type SkillMatrixData, type SkilledEmployee } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface SkilledEmployeesDialogProps {
  skill: SkillMatrixData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SkilledEmployeesDialog({ skill, open, onOpenChange }: SkilledEmployeesDialogProps) {
  const { toast } = useToast();
  const [employees, setEmployees] = React.useState<SkilledEmployee[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && skill) {
      const fetchEmployees = async () => {
        setIsLoading(true);
        try {
          const data = await getEmployeesBySkill(skill.skill_name);
          setEmployees(data);
        } catch (error: any) {
          toast({ title: "Error", description: `Failed to fetch employees: ${error.message}`, variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchEmployees();
    }
  }, [open, skill, toast]);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Employees with Skill: "{skill?.skill_name}"</DialogTitle>
          <DialogDescription>
            A total of {employees.length} employee(s) have this skill verified.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto space-y-4">
            {isLoading ? <p className="text-center">Loading employees...</p> : 
             employees.length === 0 ? <p className="text-center text-muted-foreground py-8">No employees found with this skill.</p> :
             employees.map(employee => (
                 <div key={employee.employee_id} className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted">
                     <Avatar>
                         <AvatarFallback>{getInitials(employee.employee_name)}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                         <p className="text-sm font-medium leading-none">{employee.employee_name}</p>
                         <p className="text-sm text-muted-foreground">Approved by: {employee.approved_by_name || 'N/A'}</p>
                     </div>
                     <Button variant="outline" size="sm" asChild>
                         <Link href={`/directory/${employee.employee_id}`}>View Profile</Link>
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