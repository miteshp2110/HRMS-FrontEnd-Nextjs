"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { getEmployeesBySkill, type SkillMatrixData, type SkilledEmployee } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Award, User, CheckCircle, ExternalLink, Users } from "lucide-react"

interface SkilledEmployeesDialogProps {
  skill: SkillMatrixData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Skeleton Component
function EmployeeListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 rounded-lg border">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  )
}

export function SkilledEmployeesDialog({ skill, open, onOpenChange }: SkilledEmployeesDialogProps) {
  const { toast } = useToast()
  const [employees, setEmployees] = React.useState<SkilledEmployee[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (open && skill) {
      const fetchEmployees = async () => {
        setIsLoading(true)
        try {
          const data = await getEmployeesBySkill(skill.skill_name)
          setEmployees(data)
        } catch (error: any) {
          toast({ 
            title: "Error", 
            description: `Failed to fetch employees: ${error.message}`, 
            variant: "destructive" 
          })
        } finally {
          setIsLoading(false)
        }
      }
      fetchEmployees()
    }
  }, [open, skill, toast])

  const getInitials = (name: string) => {
    const names = name.split(' ')
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() 
      : name.substring(0, 2).toUpperCase()
  }

  // Generate color based on name
  const getColorClass = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-emerald-500',
      'bg-amber-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-purple-500',
      'bg-cyan-500',
      'bg-orange-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-x-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Award className="h-6 w-6 text-primary" />
            Employees with "{skill?.skill_name}"
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Users className="h-4 w-4" />
            {isLoading ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              <span>
                A total of <strong>{employees.length}</strong> employee(s) have this skill verified
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <EmployeeListSkeleton />
          ) : employees.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-muted rounded-full">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Employees Found</h3>
              <p className="text-muted-foreground">
                No employees found with this skill.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {employees.map((employee, index) => (
                <div 
                  key={employee.employee_id} 
                  className="flex items-center space-x-4 p-4 rounded-lg border hover:border-primary transition-all hover:shadow-md"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={`${getColorClass(employee.employee_name)} text-white font-semibold`}>
                      {getInitials(employee.employee_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold leading-none truncate">
                        {employee.employee_name}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-xs">
                        Approved by: {employee.approved_by_name || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Link href={`/directory/${employee.employee_id}`} className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      View Profile
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {!isLoading && employees.length > 0 && (
              <span>Showing all {employees.length} employee(s)</span>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
