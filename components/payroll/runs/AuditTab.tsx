// "use client"

// import * as React from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useToast } from "@/hooks/use-toast";
// import { 
//     getAuditFlags, 
//     resolveAuditFlag, 
//     runPrePayrollAudit, 
//     verifyAudit, 
//     updatePayrollCycleStatus,
//     type AuditFlag 
// } from "@/lib/api";
// import { 
//     AlertTriangle, 
//     Check, 
//     Loader2, 
//     Shield, 
//     Users, 
//     Clock, 
//     Calculator,
//     FileX,
//     AlertCircle,
//     CheckCircle2,
//     Play
// } from "lucide-react";

// interface Props {
//     cycleId: number;
//     cycleStatus: string;
//     onAuditRun: () => void;
// }

// const flagTypeIcons = {
//     'MISSING_ATTENDANCE': Users,
//     'UNAPPROVED_OVERTIME': Clock,
//     'MISSING_SALARY_STRUCTURE': Calculator,
//     'INCOMPLETE_SALARY_STRUCTURE': FileX,
//     'INVALID_FORMULA': AlertCircle
// };

// const flagTypeColors = {
//     'MISSING_ATTENDANCE': 'bg-red-100 text-red-800',
//     'UNAPPROVED_OVERTIME': 'bg-orange-100 text-orange-800',
//     'MISSING_SALARY_STRUCTURE': 'bg-purple-100 text-purple-800',
//     'INCOMPLETE_SALARY_STRUCTURE': 'bg-yellow-100 text-yellow-800',
//     'INVALID_FORMULA': 'bg-pink-100 text-pink-800'
// };

// export function AuditTab({ cycleId, cycleStatus, onAuditRun }: Props) {
//     const { toast } = useToast();
//     const [flags, setFlags] = React.useState<AuditFlag[]>([]);
//     const [isLoading, setIsLoading] = React.useState(false);
//     const [isRunningAudit, setIsRunningAudit] = React.useState(false);
//     const [isVerifying, setIsVerifying] = React.useState(false);
//     const [resolvingFlagId, setResolvingFlagId] = React.useState<number | null>(null);
//     const [auditSummary, setAuditSummary] = React.useState<any>(null);

//     const fetchAuditFlags = React.useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const data = await getAuditFlags(cycleId);
//             setFlags(data);
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: `Failed to load audit flags: ${error.message}`, 
//                 variant: "destructive" 
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [cycleId, toast]);

//     React.useEffect(() => {
//         if (cycleStatus !== 'Draft') {
//             fetchAuditFlags();
//         }
//     }, [cycleStatus, fetchAuditFlags]);

//     const handleRunAudit = async () => {
//         setIsRunningAudit(true);
//         try {
//             const result = await runPrePayrollAudit(cycleId);
//             setAuditSummary(result.audit_summary);
            
//             if (result.audit_summary.total_issues_found === 0) {
//                 toast({ 
//                     title: "Audit Complete", 
//                     description: "No issues found! Ready to proceed to execution." 
//                 });
//                 // Auto-transition to Auditing status
//                 await updatePayrollCycleStatus(cycleId, 'Auditing');
//                 onAuditRun();
//             } else {
//                 toast({ 
//                     title: "Audit Complete", 
//                     description: `Found ${result.audit_summary.total_issues_found} issues that need attention.`,
//                     variant: "destructive"
//                 });
//                 await fetchAuditFlags();
//             }
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: `Failed to run audit: ${error.message}`, 
//                 variant: "destructive" 
//             });
//         } finally {
//             setIsRunningAudit(false);
//         }
//     };

//     const handleVerifyAudit = async () => {
//         setIsVerifying(true);
//         try {
//             const result = await verifyAudit(cycleId);
            
//             if (result.is_clear) {
//                 toast({ 
//                     title: "Verification Complete", 
//                     description: "All issues resolved! Ready to proceed to execution." 
//                 });
//                 // Auto-transition to Auditing status
//                 await updatePayrollCycleStatus(cycleId, 'Auditing');
//                 onAuditRun();
//             } else {
//                 toast({ 
//                     title: "Verification Failed", 
//                     description: result.message,
//                     variant: "destructive"
//                 });
//                 if (result.new_flags_found > 0) {
//                     await fetchAuditFlags();
//                 }
//             }
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: `Failed to verify audit: ${error.message}`, 
//                 variant: "destructive" 
//             });
//         } finally {
//             setIsVerifying(false);
//         }
//     };

//     const handleResolveFlag = async (flagId: number) => {
//         setResolvingFlagId(flagId);
//         try {
//             await resolveAuditFlag(flagId);
//             toast({ title: "Success", description: "Audit flag resolved." });
//             await fetchAuditFlags();
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: `Failed to resolve flag: ${error.message}`, 
//                 variant: "destructive" 
//             });
//         } finally {
//             setResolvingFlagId(null);
//         }
//     };

//     // Group flags by type for better display
//     const flagsByType = React.useMemo(() => {
//         return flags.reduce((acc, flag) => {
//             if (!acc[flag.flag_type]) {
//                 acc[flag.flag_type] = [];
//             }
//             acc[flag.flag_type].push(flag);
//             return acc;
//         }, {} as Record<string, AuditFlag[]>);
//     }, [flags]);

//     const openFlagsCount = flags.filter(f => f.status === 'Open').length;
//     const totalFlags = flags.length;
//     const progressPercentage = totalFlags > 0 ? ((totalFlags - openFlagsCount) / totalFlags) * 100 : 100;

//     return (
//         <div className="space-y-6">
//             {/* Audit Header */}
//             <Card>
//                 <CardHeader>
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                             <div className="p-2 bg-blue-100 rounded-lg">
//                                 <Shield className="w-6 h-6 text-blue-600" />
//                             </div>
//                             <div>
//                                 <CardTitle>Payroll Audit</CardTitle>
//                                 <CardDescription>
//                                     Validate data integrity before processing payroll
//                                 </CardDescription>
//                             </div>
//                         </div>
                        
//                         <div className="flex items-center space-x-2">
//                             {cycleStatus === 'Draft' && (
//                                 <Button 
//                                     onClick={handleRunAudit} 
//                                     disabled={isRunningAudit}
//                                     className="bg-blue-600 hover:bg-blue-700"
//                                 >
//                                     {isRunningAudit ? (
//                                         <>
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                             Running Audit...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Play className="w-4 h-4 mr-2" />
//                                             Start Audit
//                                         </>
//                                     )}
//                                 </Button>
//                             )}
                            
//                             {cycleStatus === 'Draft' && totalFlags > 0 && (
//                                 <Button 
//                                     onClick={handleVerifyAudit} 
//                                     disabled={isVerifying}
//                                     variant="outline"
//                                 >
//                                     {isVerifying ? (
//                                         <>
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                             Verifying...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <CheckCircle2 className="w-4 h-4 mr-2" />
//                                             Re-verify
//                                         </>
//                                     )}
//                                 </Button>
//                             )}
//                         </div>
//                     </div>
//                 </CardHeader>
                
//                 {totalFlags > 0 && (
//                     <CardContent>
//                         <div className="space-y-4">
//                             {/* Progress Bar */}
//                             <div>
//                                 <div className="flex justify-between text-sm mb-2">
//                                     <span>Audit Progress</span>
//                                     <span>{totalFlags - openFlagsCount}/{totalFlags} issues resolved</span>
//                                 </div>
//                                 <Progress value={progressPercentage} className="h-2" />
//                             </div>

//                             {/* Status Alert */}
//                             {openFlagsCount > 0 ? (
//                                 <Alert>
//                                     <AlertTriangle className="h-4 w-4" />
//                                     <AlertDescription>
//                                         <strong>{openFlagsCount} audit issues</strong> need to be resolved before proceeding to payroll execution.
//                                     </AlertDescription>
//                                 </Alert>
//                             ) : (
//                                 <Alert className="border-green-200 bg-green-50">
//                                     <CheckCircle2 className="h-4 w-4 text-green-600" />
//                                     <AlertDescription className="text-green-800">
//                                         All audit issues have been resolved! Ready to proceed to execution.
//                                     </AlertDescription>
//                                 </Alert>
//                             )}
//                         </div>
//                     </CardContent>
//                 )}
//             </Card>

//             {/* Audit Summary */}
//             {auditSummary && (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="text-lg">Audit Summary</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//                             <div className="text-center p-3 bg-red-50 rounded-lg">
//                                 <div className="text-2xl font-bold text-red-600">{auditSummary.missing_attendance}</div>
//                                 <div className="text-xs text-red-600">Missing Attendance</div>
//                             </div>
//                             <div className="text-center p-3 bg-orange-50 rounded-lg">
//                                 <div className="text-2xl font-bold text-orange-600">{auditSummary.unapproved_overtime}</div>
//                                 <div className="text-xs text-orange-600">Unapproved Overtime</div>
//                             </div>
//                             <div className="text-center p-3 bg-purple-50 rounded-lg">
//                                 <div className="text-2xl font-bold text-purple-600">{auditSummary.missing_salary_structure}</div>
//                                 <div className="text-xs text-purple-600">Missing Structure</div>
//                             </div>
//                             <div className="text-center p-3 bg-yellow-50 rounded-lg">
//                                 <div className="text-2xl font-bold text-yellow-600">{auditSummary.incomplete_structures}</div>
//                                 <div className="text-xs text-yellow-600">Incomplete Structure</div>
//                             </div>
//                             <div className="text-center p-3 bg-pink-50 rounded-lg">
//                                 <div className="text-2xl font-bold text-pink-600">{auditSummary.invalid_formulas}</div>
//                                 <div className="text-xs text-pink-600">Invalid Formulas</div>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Audit Flags by Type */}
//             {Object.keys(flagsByType).length > 0 && (
//                 <div className="space-y-4">
//                     {Object.entries(flagsByType).map(([flagType, typeFlags]) => {
//                         const IconComponent = flagTypeIcons[flagType as keyof typeof flagTypeIcons] || AlertTriangle;
//                         const openFlags = typeFlags.filter(f => f.status === 'Open');
                        
//                         return (
//                             <Card key={flagType}>
//                                 <CardHeader>
//                                     <div className="flex items-center justify-between">
//                                         <div className="flex items-center space-x-3">
//                                             <IconComponent className="w-5 h-5 text-gray-600" />
//                                             <div>
//                                                 <CardTitle className="text-base">
//                                                     {flagType.replace(/_/g, ' ')} 
//                                                     <Badge className={`ml-2 ${flagTypeColors[flagType as keyof typeof flagTypeColors] || 'bg-gray-100 text-gray-800'}`}>
//                                                         {openFlags.length} open
//                                                     </Badge>
//                                                 </CardTitle>
//                                                 <CardDescription>
//                                                     {typeFlags.length} total issues, {openFlags.length} unresolved
//                                                 </CardDescription>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <Table>
//                                         <TableHeader>
//                                             <TableRow>
//                                                 <TableHead>Employee</TableHead>
//                                                 <TableHead>Description</TableHead>
//                                                 <TableHead>Status</TableHead>
//                                                 <TableHead className="w-24">Action</TableHead>
//                                             </TableRow>
//                                         </TableHeader>
//                                         <TableBody>
//                                             {typeFlags.map((flag) => (
//                                                 <TableRow key={flag.id}>
//                                                     <TableCell className="font-medium">
//                                                         {flag.employee_name}
//                                                         {flag.joining_date && (
//                                                             <div className="text-xs text-gray-500">
//                                                                 Joined: {new Date(flag.joining_date).toLocaleDateString()}
//                                                             </div>
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <div className="text-sm">{flag.description}</div>
//                                                         {flag.shift_name && (
//                                                             <div className="text-xs text-gray-500">
//                                                                 Shift: {flag.shift_name}
//                                                             </div>
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Badge variant={flag.status === 'Open' ? 'destructive' : 'default'}>
//                                                             {flag.status}
//                                                         </Badge>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         {flag.status === 'Open' && (
//                                                             <Button
//                                                                 size="sm"
//                                                                 variant="outline"
//                                                                 onClick={() => handleResolveFlag(flag.id)}
//                                                                 disabled={resolvingFlagId === flag.id}
//                                                             >
//                                                                 {resolvingFlagId === flag.id ? (
//                                                                     <Loader2 className="w-3 h-3 animate-spin" />
//                                                                 ) : (
//                                                                     <Check className="w-3 h-3" />
//                                                                 )}
//                                                             </Button>
//                                                         )}
//                                                     </TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </CardContent>
//                             </Card>
//                         );
//                     })}
//                 </div>
//             )}

//             {/* No Issues State */}
//             {!isLoading && flags.length === 0 && cycleStatus !== 'Draft' && (
//                 <Card>
//                     <CardContent className="flex items-center justify-center h-64">
//                         <div className="text-center">
//                             <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                             <h3 className="text-lg font-semibold text-green-700 mb-2">Audit Complete</h3>
//                             <p className="text-green-600">No issues found. Payroll is ready for execution.</p>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Initial State */}
//             {cycleStatus === 'Draft' && flags.length === 0 && !auditSummary && (
//                 <Card>
//                     <CardContent className="flex items-center justify-center h-64">
//                         <div className="text-center">
//                             <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
//                             <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Audit</h3>
//                             <p className="text-gray-500 mb-4">
//                                 Run the payroll audit to validate data integrity before processing.
//                             </p>
//                             <Button 
//                                 onClick={handleRunAudit} 
//                                 disabled={isRunningAudit}
//                                 className="bg-blue-600 hover:bg-blue-700"
//                             >
//                                 {isRunningAudit ? (
//                                     <>
//                                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                         Running Audit...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Play className="w-4 h-4 mr-2" />
//                                         Start Audit
//                                     </>
//                                 )}
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     );
// }


"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  getAuditFlags,
  resolveAuditFlag,
  runPrePayrollAudit,
  verifyAudit,
  updatePayrollCycleStatus,
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
  const [isLoading, setIsLoading] = React.useState(false)
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

  // fetch flags
  const fetchAuditFlags = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getAuditFlags(cycleId)
      setFlags(data || [])
    } catch (e: any) {
      toast({ title: "Error", description: `Failed to load flags: ${e.message}`, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [cycleId, toast])

  React.useEffect(() => {
    // always start on Audit tab
    if (cycleStatus !== "Draft") fetchAuditFlags()
  }, [cycleStatus, fetchAuditFlags])

  // Step 1: start audit -> always moves to Auditing
  const handleRunAudit = async () => {
    setIsRunningAudit(true)
    try {
      const result = await runPrePayrollAudit(cycleId)
      const summary = result.audit_summary || { total_issues_found: 0 }
      setAuditSummary(summary)
    //   await updatePayrollCycleStatus(cycleId, "Auditing")
      toast({ title: "Audit Started", description: `${summary.total_issues_found} issues found.` })
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
        // await updatePayrollCycleStatus(cycleId, "Review")
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
        <CardHeader className="flex justify-between items-center">
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
                {isRunningAudit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Start Audit
              </Button>
            )}
            {cycleStatus === "Auditing" && (
              <Button onClick={handleVerifyAudit} disabled={isVerifying || issuesTotal !== 0}>
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Recheck Audit
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

      {cycleStatus !== "Draft" && issuesTotal === 0 && cycleStatus !== "Review" && (
        <Card>
          <CardContent className="text-center p-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-green-700 font-semibold">Audit Cleared</p>
            <p>No issues remain. Proceed to execution.</p>
          </CardContent>
        </Card>
      )}

      {Object.entries(flagsByType).map(([type, list]) => {
        const Icon = flagTypeIcons[type as keyof typeof flagTypeIcons] || AlertTriangle
        const color = flagTypeColors[type as keyof typeof flagTypeColors] || "bg-gray-100 text-gray-800"
        return (
          <Card key={type}>
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <div>
                  <CardTitle>{type.replace(/_/g, " ")}</CardTitle>
                  <CardDescription>{list.length} issues</CardDescription>
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
                    <TableHead>Action</TableHead>
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
                      <TableCell>
                        {flag.status === "Open" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveFlag(flag.id)}
                            disabled={resolvingFlagId === flag.id}
                          >
                            {resolvingFlagId === flag.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
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
    </div>
  )
}
