

// "use client"

// import * as React from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useToast } from "@/hooks/use-toast"
// import {
//   getAuditFlags,
//   resolveAuditFlag,
//   runPrePayrollAudit,
//   verifyAudit,
//   updatePayrollCycleStatus,
//   type AuditFlag,
// } from "@/lib/api"
// import {
//   AlertTriangle,
//   Check,
//   Loader2,
//   Shield,
//   Users,
//   Clock,
//   Calculator,
//   FileX,
//   AlertCircle,
//   CheckCircle2,
//   Play,
// } from "lucide-react"

// interface Props {
//   cycleId: number
//   cycleStatus: string
//   onAuditRun: () => void
// }

// const flagTypeIcons = {
//   MISSING_ATTENDANCE: Users,
//   UNAPPROVED_OVERTIME: Clock,
//   MISSING_SALARY_STRUCTURE: Calculator,
//   INCOMPLETE_SALARY_STRUCTURE: FileX,
//   INVALID_FORMULA: AlertCircle,
// } as const

// const flagTypeColors = {
//   MISSING_ATTENDANCE: "bg-red-100 text-red-800",
//   UNAPPROVED_OVERTIME: "bg-orange-100 text-orange-800",
//   MISSING_SALARY_STRUCTURE: "bg-purple-100 text-purple-800",
//   INCOMPLETE_SALARY_STRUCTURE: "bg-yellow-100 text-yellow-800",
//   INVALID_FORMULA: "bg-pink-100 text-pink-800",
// } as const

// export function AuditTab({ cycleId, cycleStatus, onAuditRun }: Props) {
//   const { toast } = useToast()
//   const [flags, setFlags] = React.useState<AuditFlag[]>([])
//   const [isFlags, setIsFlags] = React.useState<boolean>(true)
  
//   const [isLoading, setIsLoading] = React.useState(false)
//   const [isRunningAudit, setIsRunningAudit] = React.useState(false)
//   const [isVerifying, setIsVerifying] = React.useState(false)
//   const [resolvingFlagId, setResolvingFlagId] = React.useState<number | null>(null)

//   // fetch summary separately
//   const [auditSummary, setAuditSummary] = React.useState<{
//     total_issues_found: number
//     missing_attendance: number
//     unapproved_overtime: number
//     missing_salary_structure: number
//     incomplete_structures: number
//     invalid_formulas: number
//   } | null>(null)


//   const checkAudits = async()=>{
//     try{
//             setIsLoading(true)
//               const conflicts = await getAuditFlags(cycleId)
//               if(conflicts.length===0){
//                   setIsFlags(false)
//               }
//               else{
//                   setIsFlags(true)
                  
//               }
//           }
//           catch(err){
//               toast({ 
//                   title: "Error", 
//                   description: `Failed to load`, 
//                   variant: "destructive" 
//               });
//           }
//           finally{
//             setIsLoading(false)
//           }
//       }

//   // fetch flags
//   const fetchAuditFlags = React.useCallback(async () => {
//     try {
//       setIsLoading(true)
//       const data = await getAuditFlags(cycleId)
//       setFlags(data || [])
//     } catch (e: any) {
//       toast({ title: "Error", description: `Failed to load flags: ${e.message}`, variant: "destructive" })
//     } finally {
//       setIsLoading(false)
//     }
//   }, [cycleId, toast])

//   React.useEffect(() => {
//     // always start on Audit tab

//     if (cycleStatus !== "Draft") fetchAuditFlags()
//   }, [cycleStatus, fetchAuditFlags])
// React.useEffect(()=>{
//   checkAudits()
// },[])

//   // Step 1: start audit -> always moves to Auditing
//   const handleRunAudit = async () => {
//     setIsRunningAudit(true)
//     try {
//       const result = await runPrePayrollAudit(cycleId)
//       const summary = result.audit_summary || { total_issues_found: 0 }
//       setAuditSummary(summary)
//     //   await updatePayrollCycleStatus(cycleId, "Auditing")
//       toast({ title: "Audit Started", description: `${summary.total_issues_found} issues found.` })
//       fetchAuditFlags()
//       onAuditRun()
//     } catch (e: any) {
//       toast({ title: "Error", description: `Audit failed: ${e.message}`, variant: "destructive" })
//     } finally {
//       setIsRunningAudit(false)
//     }
//   }

//   // Step 2: recheck -> if clear, move to Review
//   const handleVerifyAudit = async () => {
//     setIsVerifying(true)
//     try {
//       const result = await verifyAudit(cycleId)
//       const isClear = result.is_clear
//       if (isClear) {
//         setAuditSummary({ total_issues_found: 0, missing_attendance: 0, unapproved_overtime: 0, missing_salary_structure: 0, incomplete_structures: 0, invalid_formulas: 0 })
//         // await updatePayrollCycleStatus(cycleId, "Review")
//         toast({ title: "Audit Cleared", description: "No outstanding issues." })
//         onAuditRun()
//       } else {
//         toast({ title: "Recheck Complete", description: result.message, variant: "destructive" })
//         if (result.new_flags_found > 0) fetchAuditFlags()
//       }
//     } catch (e: any) {
//       toast({ title: "Error", description: `Recheck failed: ${e.message}`, variant: "destructive" })
//     } finally {
//       setIsVerifying(false)
//     }
//   }

//   // resolve individual
//   const handleResolveFlag = async (flagId: number) => {
//     setResolvingFlagId(flagId)
//     try {
//       await resolveAuditFlag(flagId)
//       toast({ title: "Resolved", description: "Flag resolved." })
//       fetchAuditFlags()
//     } catch (e: any) {
//       toast({ title: "Error", description: `Resolve failed: ${e.message}`, variant: "destructive" })
//     } finally {
//       setResolvingFlagId(null)
//     }
//   }

//   const totalFlags = flags.length
//   const openFlags = flags.filter(f => f.status === "Open").length
//   const issuesTotal = auditSummary?.total_issues_found ?? totalFlags
//   const issuesOpen = openFlags

//   const flagsByType = React.useMemo(() => {
//     return flags.reduce((acc, f) => {
//       acc[f.flag_type] = acc[f.flag_type] || []
//       acc[f.flag_type].push(f)
//       return acc
//     }, {} as Record<string, AuditFlag[]>)
//   }, [flags])

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader className="flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <Shield className="w-6 h-6 text-blue-600" />
//             <div>
//               <CardTitle>Payroll Audit</CardTitle>
//               <CardDescription>Validate data before execution</CardDescription>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             {cycleStatus === "Draft" && (
//               <Button onClick={handleRunAudit} disabled={isRunningAudit}>
//                 {isRunningAudit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Start Audit
//               </Button>
//             )}
//             {cycleStatus === "Auditing" && (
//               <Button onClick={handleVerifyAudit} disabled={isVerifying || issuesTotal !== 0}>
//                 {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Recheck Audit
//               </Button>
//             )}
//           </div>
//         </CardHeader>

//         {issuesTotal > 0 && (
//           <CardContent>
//             <div className="flex justify-between text-sm mb-2">
//               <span>Issues</span>
//               <span>
//                 {issuesTotal - issuesOpen}/{issuesTotal} resolved
//               </span>
//             </div>
//             <Progress value={((issuesTotal - issuesOpen) / issuesTotal) * 100} className="h-2" />
//           </CardContent>
//         )}
//       </Card>

//       {cycleStatus !== "Draft" && issuesTotal === 0 && cycleStatus !== "Review" && (
//         <Card>
//           <CardContent className="text-center p-8">
//             <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
//             <p className="text-green-700 font-semibold">Audit Cleared</p>
//             <p>No issues remain. Proceed to execution.</p>
//           </CardContent>
//         </Card>
//       )}

//       {Object.entries(flagsByType).map(([type, list]) => {
//         const Icon = flagTypeIcons[type as keyof typeof flagTypeIcons] || AlertTriangle
//         const color = flagTypeColors[type as keyof typeof flagTypeColors] || "bg-gray-100 text-gray-800"
//         return (
//           <Card key={type}>
//             <CardHeader className="flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <Icon className="w-5 h-5 text-gray-600" />
//                 <div>
//                   <CardTitle>{type.replace(/_/g, " ")}</CardTitle>
//                   <CardDescription>{list.length} issues</CardDescription>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Employee</TableHead>
//                     <TableHead>Description</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {list.map(flag => (
//                     <TableRow key={flag.id}>
//                       <TableCell className="font-medium">{flag.employee_name}</TableCell>
//                       <TableCell>{flag.description}</TableCell>
//                       <TableCell>
//                         <Badge variant={flag.status === "Open" ? "destructive" : "default"}>{flag.status}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         {flag.status === "Open" && (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleResolveFlag(flag.id)}
//                             disabled={resolvingFlagId === flag.id}
//                           >
//                             {resolvingFlagId === flag.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
//                           </Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }


"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  getAuditFlags,
  resolveAuditFlag,
  runPrePayrollAudit,
  verifyAudit,
  type AuditFlag,
} from "@/lib/api"
import {
  AlertTriangle,
  Check,
  Loader2,
  Shield,
  Users,
  Clock,
  Calculator,
  FileX,
  AlertCircle,
  CheckCircle2,
  Play,
} from "lucide-react"

interface Props {
  cycleId: number
  cycleStatus: string
  onAuditRun: () => void
}

const flagTypeIcons = {
  MISSING_ATTENDANCE: Users,
  UNAPPROVED_OVERTIME: Clock,
  MISSING_SALARY_STRUCTURE: Calculator,
  INCOMPLETE_SALARY_STRUCTURE: FileX,
  INVALID_FORMULA: AlertCircle,
} as const

const flagTypeColors = {
  MISSING_ATTENDANCE: "bg-red-100 text-red-800",
  UNAPPROVED_OVERTIME: "bg-orange-100 text-orange-800",
  MISSING_SALARY_STRUCTURE: "bg-purple-100 text-purple-800",
  INCOMPLETE_SALARY_STRUCTURE: "bg-yellow-100 text-yellow-800",
  INVALID_FORMULA: "bg-pink-100 text-pink-800",
} as const

export function AuditTab({ cycleId, cycleStatus, onAuditRun }: Props) {
  const { toast } = useToast()
  const [flags, setFlags] = React.useState<AuditFlag[]>([])
  const [isFlags, setIsFlags] = React.useState<boolean>(true)
  
  // Initial loading state set to true
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRunningAudit, setIsRunningAudit] = React.useState(false)
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [resolvingFlagId, setResolvingFlagId] = React.useState<number | null>(null)

  // fetch summary separately
  const [auditSummary, setAuditSummary] = React.useState<{
    total_issues_found: number
    missing_attendance: number
    unapproved_overtime: number
    missing_salary_structure: number
    incomplete_structures: number
    invalid_formulas: number
  } | null>(null)


  const checkAudits = async()=>{
    try{
            // No need to set isLoading to true here as it's handled by initial state
            const conflicts = await getAuditFlags(cycleId)
            if(conflicts.length===0){
                setIsFlags(false)
            }
            else{
                setIsFlags(true)
                
            }
          }
          catch(err){
              toast({ 
                  title: "Error", 
                  description: `Failed to load`, 
                  variant: "destructive" 
              });
          }
          finally{
            // Set loading to false after check is complete
            setIsLoading(false)
          }
      }

  // fetch flags
  const fetchAuditFlags = React.useCallback(async () => {
    try {
      // No need to set isLoading here if it's already true initially
      // setIsLoading(true) 
      const data = await getAuditFlags(cycleId)
      setFlags(data || [])
    } catch (e: any) {
      toast({ title: "Error", description: `Failed to load flags: ${e.message}`, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [cycleId, toast])

  React.useEffect(() => {
    if (cycleStatus !== "Draft") {
        fetchAuditFlags()
    } else {
        // If it's a draft, we might not fetch, so we need to turn off loading.
        checkAudits();
    }
  }, [cycleStatus, fetchAuditFlags])

  // Step 1: start audit -> always moves to Auditing
  const handleRunAudit = async () => {
    setIsRunningAudit(true)
    try {
      const result = await runPrePayrollAudit(cycleId)
      const conflicts = await getAuditFlags(cycleId)

      const summary = (result.audit_summary || { total_issues_found: 0 })
      setAuditSummary(summary)
      // toast({ title: "Audit Started", description: `${summary.total_issues_found} issues found.` })
      fetchAuditFlags()
      onAuditRun()
    } catch (e: any) {
      toast({ title: "Error", description: `Audit failed: ${e.message}`, variant: "destructive" })
    } finally {
      setIsRunningAudit(false)
    }
  }

  // Step 2: recheck -> if clear, move to Review
  const handleVerifyAudit = async () => {
    setIsVerifying(true)
    try {
      const result = await verifyAudit(cycleId)
      const isClear = result.is_clear
      if (isClear) {
        setAuditSummary({ total_issues_found: 0, missing_attendance: 0, unapproved_overtime: 0, missing_salary_structure: 0, incomplete_structures: 0, invalid_formulas: 0 })
        toast({ title: "Audit Cleared", description: "No outstanding issues." })
        onAuditRun()
      } else {
        toast({ title: "Recheck Complete", description: result.message, variant: "destructive" })
        if (result.new_flags_found > 0) fetchAuditFlags()
      }
    } catch (e: any) {
      toast({ title: "Error", description: `Recheck failed: ${e.message}`, variant: "destructive" })
    } finally {
      setIsVerifying(false)
    }
  }

  // resolve individual
  const handleResolveFlag = async (flagId: number) => {
    setResolvingFlagId(flagId)
    try {
      await resolveAuditFlag(flagId)
      toast({ title: "Resolved", description: "Flag resolved." })
      fetchAuditFlags()
    } catch (e: any) {
      toast({ title: "Error", description: `Resolve failed: ${e.message}`, variant: "destructive" })
    } finally {
      setResolvingFlagId(null)
    }
  }

  const totalFlags = flags.length
  const openFlags = flags.filter(f => f.status === "Open").length
  const issuesTotal = auditSummary?.total_issues_found ?? totalFlags
  const issuesOpen = openFlags

  const flagsByType = React.useMemo(() => {
    return flags.reduce((acc, f) => {
      acc[f.flag_type] = acc[f.flag_type] || []
      acc[f.flag_type].push(f)
      return acc
    }, {} as Record<string, AuditFlag[]>)
  }, [flags])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>Payroll Audit</CardTitle>
              <CardDescription>Validate data before execution</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {cycleStatus === "Draft" && (
              <Button onClick={handleRunAudit} disabled={isRunningAudit}>
                {isRunningAudit ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />} Start Audit
              </Button>
            )}
            {cycleStatus === "Auditing" && (
              <Button onClick={handleVerifyAudit} disabled={isVerifying || issuesTotal !== 0}>
                {isVerifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />} Recheck Audit
              </Button>
            )}
          </div>
        </CardHeader>

        {issuesTotal > 0 && (
          <CardContent>
            <div className="flex justify-between text-sm mb-2">
              <span>Issues</span>
              <span>
                {issuesTotal - issuesOpen}/{issuesTotal} resolved
              </span>
            </div>
            <Progress value={((issuesTotal - issuesOpen) / issuesTotal) * 100} className="h-2" />
          </CardContent>
        )}
      </Card>

      {/* Loading State UI */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-lg">Loading Audit Data...</p>
        </div>
      ) : (
        <>
            {cycleStatus !== "Draft" && issuesTotal === 0 && cycleStatus !== "Review" && (
                <Card>
                <CardContent className="text-center p-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-green-700">Audit Cleared</p>
                    <p className="text-muted-foreground">No issues remain. You can proceed to the next step.</p>
                </CardContent>
                </Card>
            )}

            {Object.entries(flagsByType).map(([type, list]) => {
                const Icon = flagTypeIcons[type as keyof typeof flagTypeIcons] || AlertTriangle
                const color = flagTypeColors[type as keyof typeof flagTypeColors] || "bg-gray-100 text-gray-800"
                return (
                <Card key={type}>
                    <CardHeader className="flex flex-row justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div>
                        <CardTitle>{type.replace(/_/g, " ")}</CardTitle>
                        <CardDescription>{list.length} issues found</CardDescription>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {list.map(flag => (
                            <TableRow key={flag.id}>
                            <TableCell className="font-medium">{flag.employee_name}</TableCell>
                            <TableCell>{flag.description}</TableCell>
                            <TableCell>
                                <Badge variant={flag.status === "Open" ? "destructive" : "default"}>{flag.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {flag.status === "Open" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleResolveFlag(flag.id)}
                                    disabled={resolvingFlagId === flag.id}
                                >
                                    {resolvingFlagId === flag.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </Button>
                                )}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
                )
            })}
        </>
      )}
    </div>
  )
}