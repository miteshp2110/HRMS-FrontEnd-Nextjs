"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSkillMatrix, type SkillMatrixData } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Award, AlertCircle } from "lucide-react"
import { SkilledEmployeesDialog } from "./skilled-employees-dialog"

export function SkillMatrixVisualization() {
  const { toast } = useToast()
  const [skillData, setSkillData] = React.useState<SkillMatrixData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedSkill, setSelectedSkill] = React.useState<SkillMatrixData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    getSkillMatrix()
      .then(data => {
        // Sort data to have a nice visual distribution
        setSkillData(data.sort((a, b) => b.employee_count - a.employee_count));
      })
      .catch(err => {
        toast({ title: "Error", description: "Could not load skill matrix data.", variant: "destructive" })
      })
      .finally(() => setIsLoading(false))
  }, [toast])

  const handleBubbleClick = (skill: SkillMatrixData) => {
    setSelectedSkill(skill);
    setIsDialogOpen(true);
  }

  const maxCount = Math.max(...skillData.map(s => s.employee_count), 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Interactive Skill Matrix</CardTitle>
          <CardDescription>
            A visual representation of your organization's skills. Bubble size corresponds to the number of employees. Click a bubble to see who has that skill.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skillData.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Skills Found</AlertTitle>
              <AlertDescription>
                There are no skills with assigned employees to display in the matrix.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 min-h-[400px]">
              {skillData.map((skill, index) => {
                const size = 60 + (skill.employee_count / maxCount) * 120; // min 60px, max 180px
                const colorIndex = index % 5;
                const colors = [
                    "bg-blue-500 hover:bg-blue-600", 
                    "bg-emerald-500 hover:bg-emerald-600",
                    "bg-amber-500 hover:bg-amber-600",
                    "bg-indigo-500 hover:bg-indigo-600",
                    "bg-pink-500 hover:bg-pink-600"
                ];

                return (
                    <button 
                        key={skill.id}
                        onClick={() => handleBubbleClick(skill)}
                        style={{ width: `${size}px`, height: `${size}px` }}
                        className={`flex flex-col items-center justify-center rounded-full text-white font-bold text-center shadow-lg transition-transform transform hover:scale-105 ${colors[colorIndex]}`}
                    >
                        <span className="text-xs md:text-sm truncate max-w-[80%]">{skill.skill_name}</span>
                        <span className="text-xl md:text-2xl font-black">{skill.employee_count}</span>
                    </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <SkilledEmployeesDialog
        skill={selectedSkill}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}