"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, CheckCircle } from "lucide-react"
import { getUserSkills, type UserSkill } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface EmployeeSkillsDialogProps {
  employeeId: number | null
  employeeName: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeeSkillsDialog({ employeeId, employeeName, open, onOpenChange }: EmployeeSkillsDialogProps) {
  const { toast } = useToast();
  const [skills, setSkills] = React.useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && employeeId) {
      const fetchSkills = async () => {
        setIsLoading(true);
        try {
          const data = await getUserSkills(employeeId);
          setSkills(data);
        } catch (error: any) {
          toast({
            title: "Error",
            description: `Failed to fetch skills for ${employeeName}: ${error.message}`,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchSkills();
    }
  }, [open, employeeId, employeeName, toast]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary"/>
            Verified Skills for {employeeName}
          </DialogTitle>
          <DialogDescription>
            This is a list of all skills this employee has already been approved for.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 max-h-80 overflow-y-auto">
            {isLoading ? <p>Loading skills...</p> : 
             skills.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">This employee has no verified skills yet.</div>
             ) : (
                <div className="space-y-3">
                    {skills.map(skill => (
                        <div key={skill.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <span className="font-medium text-sm">{skill.skill_name}</span>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500"/>
                                Verified
                            </Badge>
                        </div>
                    ))}
                </div>
             )
            }
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}