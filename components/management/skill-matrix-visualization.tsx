// "use client"

// import * as React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"
// import { getSkillMatrix, type SkillMatrixData } from "@/lib/api"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Award, AlertCircle } from "lucide-react"
// import { SkilledEmployeesDialog } from "./skilled-employees-dialog"

// export function SkillMatrixVisualization() {
//   const { toast } = useToast()
//   const [skillData, setSkillData] = React.useState<SkillMatrixData[]>([])
//   const [isLoading, setIsLoading] = React.useState(true)
//   const [selectedSkill, setSelectedSkill] = React.useState<SkillMatrixData | null>(null)
//   const [isDialogOpen, setIsDialogOpen] = React.useState(false)

//   React.useEffect(() => {
//     getSkillMatrix()
//       .then(data => {
//         // Sort data to have a nice visual distribution
//         setSkillData(data.sort((a, b) => b.employee_count - a.employee_count));
//       })
//       .catch(err => {
//         toast({ title: "Error", description: "Could not load skill matrix data.", variant: "destructive" })
//       })
//       .finally(() => setIsLoading(false))
//   }, [toast])

//   const handleBubbleClick = (skill: SkillMatrixData) => {
//     setSelectedSkill(skill);
//     setIsDialogOpen(true);
//   }

//   const maxCount = Math.max(...skillData.map(s => s.employee_count), 1);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Interactive Skill Matrix</CardTitle>
//           <CardDescription>
//             A visual representation of your organization's skills. Bubble size corresponds to the number of employees. Click a bubble to see who has that skill.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {skillData.length === 0 ? (
//             <Alert>
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>No Skills Found</AlertTitle>
//               <AlertDescription>
//                 There are no skills with assigned employees to display in the matrix.
//               </AlertDescription>
//             </Alert>
//           ) : (
//             <div className="flex flex-wrap items-center justify-center gap-4 p-4 min-h-[400px]">
//               {skillData.map((skill, index) => {
//                 const size = 60 + (skill.employee_count / maxCount) * 120; // min 60px, max 180px
//                 const colorIndex = index % 5;
//                 const colors = [
//                     "bg-blue-500 hover:bg-blue-600", 
//                     "bg-emerald-500 hover:bg-emerald-600",
//                     "bg-amber-500 hover:bg-amber-600",
//                     "bg-indigo-500 hover:bg-indigo-600",
//                     "bg-pink-500 hover:bg-pink-600"
//                 ];

//                 return (
//                     <button 
//                         key={skill.id}
//                         onClick={() => handleBubbleClick(skill)}
//                         style={{ width: `${size}px`, height: `${size}px` }}
//                         className={`flex flex-col items-center justify-center rounded-full text-white font-bold text-center shadow-lg transition-transform transform hover:scale-105 ${colors[colorIndex]}`}
//                     >
//                         <span className="text-xs md:text-sm truncate max-w-[80%]">{skill.skill_name}</span>
//                         <span className="text-xl md:text-2xl font-black">{skill.employee_count}</span>
//                     </button>
//                 )
//               })}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//       <SkilledEmployeesDialog
//         skill={selectedSkill}
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//       />
//     </>
//   )
// }

"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { getSkillMatrix, type SkillMatrixData } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Award, AlertCircle, Users, TrendingUp } from "lucide-react"
import { SkilledEmployeesDialog } from "./skilled-employees-dialog"

// Skeleton Component
function MatrixSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 min-h-[400px]">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                className="rounded-full"
                style={{
                  width: `${80 + Math.random() * 100}px`,
                  height: `${80 + Math.random() * 100}px`
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

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
        setSkillData(data.sort((a, b) => b.employee_count - a.employee_count))
      })
      .catch(err => {
        toast({ 
          title: "Error", 
          description: "Could not load skill matrix data.", 
          variant: "destructive" 
        })
      })
      .finally(() => setIsLoading(false))
  }, [toast])

  const handleBubbleClick = (skill: SkillMatrixData) => {
    setSelectedSkill(skill)
    setIsDialogOpen(true)
  }

  const maxCount = Math.max(...skillData.map(s => s.employee_count), 1)
  const totalSkills = skillData.length
  const totalEmployeesWithSkills = new Set(skillData.flatMap(s => 
    Array(s.employee_count).fill(s.id)
  )).size
  const avgSkillsPerEmployee = skillData.reduce((sum, s) => sum + s.employee_count, 0) / totalSkills || 0

  // Function to calculate font size based on text length and bubble size
  const getFontSize = (textLength: number, bubbleSize: number) => {
    if (textLength <= 10) return Math.min(bubbleSize * 0.12, 14)
    if (textLength <= 15) return Math.min(bubbleSize * 0.10, 12)
    if (textLength <= 20) return Math.min(bubbleSize * 0.08, 10)
    if (textLength <= 25) return Math.min(bubbleSize * 0.07, 9)
    return Math.min(bubbleSize * 0.06, 8)
  }

  if (isLoading) {
    return <MatrixSkeleton />
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Total Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSkills}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique skills in organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Most Common Skill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {skillData[0]?.skill_name || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {skillData[0]?.employee_count || 0} employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Average per Skill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgSkillsPerEmployee.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Employees per skill
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Matrix Visualization */}
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
          <CardTitle className="text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Interactive Skill Matrix
          </CardTitle>
          <CardDescription className="text-indigo-700 dark:text-indigo-300">
            A visual representation of your organization's skills. Bubble size corresponds to the number of employees. Click a bubble to see who has that skill.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {skillData.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-muted rounded-full">
                  <Award className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Skills Found</h3>
              <p className="text-muted-foreground">
                There are no skills with assigned employees to display in the matrix.
              </p>
            </div>
          ) : (
            <>
              {/* Legend */}
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"></div>
                    <span className="text-muted-foreground">Fewer employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">More employees</span>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-pink-500"></div>
                  </div>
                </div>
              </div>

              {/* Bubble Chart */}
              <div className="flex flex-wrap items-center justify-center gap-6 p-6 min-h-[400px] bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 rounded-lg">
                {skillData.map((skill, index) => {
                  const size = 120 + (skill.employee_count / maxCount) * 160 // min 120px, max 280px
                  const fontSize = getFontSize(skill.skill_name.length, size)
                  const colorIndex = index % 6
                  const colors = [
                    {
                      bg: "bg-gradient-to-br from-blue-400 to-blue-600",
                      hover: "hover:from-blue-500 hover:to-blue-700",
                      shadow: "shadow-blue-500/50"
                    },
                    {
                      bg: "bg-gradient-to-br from-emerald-400 to-emerald-600",
                      hover: "hover:from-emerald-500 hover:to-emerald-700",
                      shadow: "shadow-emerald-500/50"
                    },
                    {
                      bg: "bg-gradient-to-br from-amber-400 to-amber-600",
                      hover: "hover:from-amber-500 hover:to-amber-700",
                      shadow: "shadow-amber-500/50"
                    },
                    {
                      bg: "bg-gradient-to-br from-indigo-400 to-indigo-600",
                      hover: "hover:from-indigo-500 hover:to-indigo-700",
                      shadow: "shadow-indigo-500/50"
                    },
                    {
                      bg: "bg-gradient-to-br from-pink-400 to-pink-600",
                      hover: "hover:from-pink-500 hover:to-pink-700",
                      shadow: "shadow-pink-500/50"
                    },
                    {
                      bg: "bg-gradient-to-br from-purple-400 to-purple-600",
                      hover: "hover:from-purple-500 hover:to-purple-700",
                      shadow: "shadow-purple-500/50"
                    }
                  ]

                  const color = colors[colorIndex]

                  return (
                    <button
                      key={skill.id}
                      onClick={() => handleBubbleClick(skill)}
                      style={{ 
                        width: `${size}px`, 
                        height: `${size}px`,
                        minWidth: '120px',
                        minHeight: '120px'
                      }}
                      className={`flex flex-col items-center justify-center rounded-full text-white font-bold text-center shadow-xl transition-all duration-300 transform hover:scale-105 ${color.bg} ${color.hover} ${color.shadow} hover:shadow-2xl`}
                      title={`${skill.skill_name} - ${skill.employee_count} employees`}
                    >
                      <div className="flex flex-col items-center justify-center px-4">
                        <span 
                          className="font-semibold mb-2 whitespace-nowrap overflow-hidden text-ellipsis" 
                          style={{ 
                            fontSize: `${fontSize}px`,
                            maxWidth: `${size * 0.85}px`,
                            lineHeight: '1.2'
                          }}
                        >
                          {skill.skill_name}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="h-4 w-4" />
                          <span className="text-2xl font-black">
                            {skill.employee_count}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Footer Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                <p className="text-sm text-blue-900 dark:text-blue-100 text-center">
                  💡 <strong>Tip:</strong> Click on any skill bubble to view the list of employees who possess that skill
                </p>
              </div>
            </>
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
