

"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
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
  RefreshCw,
  TrendingDown,
  Sparkles,
  Zap
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
  MISSING_ATTENDANCE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/40",
  UNAPPROVED_OVERTIME: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800/40",
  MISSING_SALARY_STRUCTURE: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/40",
  INCOMPLETE_SALARY_STRUCTURE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/40",
  INVALID_FORMULA: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800/40",
} as const

// Loading Skeletons
const AuditHeaderSkeleton = () => (
  <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
    <CardHeader>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-lg bg-muted/50 dark:bg-muted/30" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 bg-muted/50 dark:bg-muted/30" />
            <Skeleton className="h-4 w-48 bg-muted/50 dark:bg-muted/30" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 bg-muted/50 dark:bg-muted/30" />
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16 bg-muted/50 dark:bg-muted/30" />
        <Skeleton className="h-4 w-24 bg-muted/50 dark:bg-muted/30" />
      </div>
      <Skeleton className="h-2 w-full bg-muted/50 dark:bg-muted/30" />
    </CardContent>
  </Card>
)

const FlagCardSkeleton = () => (
  <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg bg-muted/50 dark:bg-muted/30" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 bg-muted/50 dark:bg-muted/30" />
          <Skeleton className="h-4 w-32 bg-muted/50 dark:bg-muted/30" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent dark:border-border/20">
            <TableHead className="dark:text-muted-foreground/80">Employee</TableHead>
            <TableHead className="dark:text-muted-foreground/80">Description</TableHead>
            <TableHead className="dark:text-muted-foreground/80">Status</TableHead>
            <TableHead className="text-right dark:text-muted-foreground/80">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent dark:border-border/20">
              <TableCell><Skeleton className="h-5 w-32 bg-muted/50 dark:bg-muted/30" /></TableCell>
              <TableCell><Skeleton className="h-5 w-64 bg-muted/50 dark:bg-muted/30" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16 rounded-full bg-muted/50 dark:bg-muted/30" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded ml-auto bg-muted/50 dark:bg-muted/30" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

export function AuditTab({ cycleId, cycleStatus, onAuditRun }: Props) {
  const { toast } = useToast()
  const [flags, setFlags] = React.useState<AuditFlag[]>([])
  const [isFlags, setIsFlags] = React.useState<boolean>(true)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRunningAudit, setIsRunningAudit] = React.useState(false)
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [resolvingFlagId, setResolvingFlagId] = React.useState<number | null>(null)

  const [auditSummary, setAuditSummary] = React.useState<{
    total_issues_found: number
    missing_attendance: number
    unapproved_overtime: number
    missing_salary_structure: number
    incomplete_structures: number
    invalid_formulas: number
  } | null>(null)

  const checkAudits = async () => {
    try {
      const conflicts = await getAuditFlags(cycleId)
      if (conflicts.length === 0) {
        setIsFlags(false)
      } else {
        setIsFlags(true)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to check audit status`,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAuditFlags = React.useCallback(async () => {
    try {
      const data = await getAuditFlags(cycleId)
      setFlags(data || [])
    } catch (e: any) {
      toast({ 
        title: "Error", 
        description: `Failed to load flags: ${e.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [cycleId, toast])

  React.useEffect(() => {
    if (cycleStatus !== "Draft") {
      fetchAuditFlags()
    } else {
      checkAudits()
    }
  }, [cycleStatus, fetchAuditFlags])

  const handleRunAudit = async () => {
    setIsRunningAudit(true)
    try {
      const result = await runPrePayrollAudit(cycleId)
      const conflicts = await getAuditFlags(cycleId)

      const summary = (result.audit_summary || { total_issues_found: 0 })
      setAuditSummary(summary)
      
      toast({ 
        title: "Audit Complete", 
        description: `Found ${summary.total_issues_found} issue(s) that need attention`,
        duration: 5000
      })
      
      fetchAuditFlags()
      onAuditRun()
    } catch (e: any) {
      toast({ 
        title: "Audit Failed", 
        description: `${e.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsRunningAudit(false)
    }
  }

  const handleVerifyAudit = async () => {
    setIsVerifying(true)
    try {
      const result = await verifyAudit(cycleId)
      const isClear = result.is_clear
      
      if (isClear) {
        setAuditSummary({ 
          total_issues_found: 0, 
          missing_attendance: 0, 
          unapproved_overtime: 0, 
          missing_salary_structure: 0, 
          incomplete_structures: 0, 
          invalid_formulas: 0 
        })
        toast({ 
          title: "Audit Cleared", 
          description: "No outstanding issues found. Ready to proceed!",
          duration: 5000
        })
        onAuditRun()
      } else {
        toast({ 
          title: "Issues Remaining", 
          description: result.message, 
          variant: "destructive",
          duration: 5000
        })
        if (result.new_flags_found > 0) fetchAuditFlags()
      }
    } catch (e: any) {
      toast({ 
        title: "Verification Failed", 
        description: `${e.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResolveFlag = async (flagId: number) => {
    setResolvingFlagId(flagId)
    try {
      await resolveAuditFlag(flagId)
      toast({ 
        title: "Flag Resolved", 
        description: "Issue has been marked as resolved",
        duration: 3000
      })
      fetchAuditFlags()
    } catch (e: any) {
      toast({ 
        title: "Resolution Failed", 
        description: `${e.message}`, 
        variant: "destructive" 
      })
    } finally {
      setResolvingFlagId(null)
    }
  }

  const totalFlags = flags.length
  const openFlags = flags.filter(f => f.status === "Open").length
  const issuesTotal = auditSummary?.total_issues_found ?? totalFlags
  const issuesOpen = openFlags
  const progressPercentage = issuesTotal > 0 ? ((issuesTotal - issuesOpen) / issuesTotal) * 100 : 0

  const flagsByType = React.useMemo(() => {
    return flags.reduce((acc, f) => {
      acc[f.flag_type] = acc[f.flag_type] || []
      acc[f.flag_type].push(f)
      return acc
    }, {} as Record<string, AuditFlag[]>)
  }, [flags])

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <AuditHeaderSkeleton />
        <FlagCardSkeleton />
        <FlagCardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Audit Header */}
      <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-card to-card/50 dark:from-card/40 dark:to-card/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg transition-all hover:scale-110 duration-300 shadow-md">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 dark:text-foreground/90">
                  Payroll Audit
                  {(isRunningAudit || isVerifying) && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </CardTitle>
                <CardDescription className="dark:text-muted-foreground/80">
                  Validate data integrity before payroll execution
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {cycleStatus === "Draft" && (
                <Button 
                  onClick={handleRunAudit} 
                  disabled={isRunningAudit}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 transition-all duration-300"
                >
                  {isRunningAudit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Running Audit...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start Audit
                    </>
                  )}
                </Button>
              )}
              {cycleStatus === "Auditing" && (
                <Button 
                  onClick={handleVerifyAudit} 
                  disabled={isVerifying || issuesTotal !== 0}
                  className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 transition-all duration-300 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Recheck Audit
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {issuesTotal > 0 && (
          <CardContent>
            <div className="space-y-4">
              {/* Progress Section */}
              <div>
                <div className="flex justify-between text-sm mb-2 dark:text-foreground/80">
                  <span className="font-medium">Resolution Progress</span>
                  <span className="font-semibold">
                    {issuesTotal - issuesOpen}/{issuesTotal} issues resolved
                  </span>
                </div>
                <div className="relative">
                  <Progress value={progressPercentage} className="h-3 transition-all duration-500" />
                  <div 
                    className="absolute top-0 left-0 h-3 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full transition-all duration-500 opacity-80"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {progressPercentage > 0 && (
                  <div className="flex justify-end mt-1">
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-br from-muted/50 to-muted/30 dark:from-muted/20 dark:to-muted/10 rounded-lg border border-border/40 dark:border-border/20">
                <div className="text-center space-y-1 p-3 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                    <AlertTriangle className="w-4 h-4" />
                    Total Issues
                  </div>
                  <div className="text-2xl font-bold dark:text-foreground/90">{issuesTotal}</div>
                </div>
                <div className="text-center space-y-1 p-3 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                    <TrendingDown className="w-4 h-4" />
                    Open
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{issuesOpen}</div>
                </div>
                <div className="text-center space-y-1 p-3 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                    <CheckCircle2 className="w-4 h-4" />
                    Resolved
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{issuesTotal - issuesOpen}</div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Success State */}
      {cycleStatus !== "Draft" && issuesTotal === 0 && cycleStatus !== "Review" && (
        <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 backdrop-blur-sm animate-in fade-in duration-500">
          <CardContent className="text-center p-12 space-y-4">
            <div className="flex justify-center">
              <div className="p-6 bg-green-100 dark:bg-green-900/30 rounded-full shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                Audit Cleared Successfully!
              </h3>
              <p className="text-green-600 dark:text-green-400 max-w-md mx-auto">
                No issues remain. All data validation checks passed. You can proceed to the execution phase.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flag Cards by Type */}
      {Object.entries(flagsByType).map(([type, list]) => {
        const Icon = flagTypeIcons[type as keyof typeof flagTypeIcons] || AlertTriangle
        const colorClass = flagTypeColors[type as keyof typeof flagTypeColors] || "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200"
        const openCount = list.filter(f => f.status === "Open").length
        const resolvedCount = list.length - openCount

        return (
          <Card 
            key={type}
            className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5"
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${colorClass} transition-all hover:scale-110 duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="dark:text-foreground/90">
                      {type.replace(/_/g, " ")}
                    </CardTitle>
                    <CardDescription className="dark:text-muted-foreground/80 flex items-center gap-2">
                      <span>{list.length} issues found</span>
                      {resolvedCount > 0 && (
                        <Badge variant="secondary" className="text-xs dark:bg-secondary/50">
                          {resolvedCount} resolved
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant={openCount === 0 ? "default" : "secondary"}
                  className={`gap-1 ${
                    openCount === 0 
                      ? 'border border-green-200 dark:border-green-800/40 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'dark:bg-secondary/50 dark:text-secondary-foreground/90'
                  }`}
                >
                  {openCount === 0 ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      All Resolved
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3" />
                      {openCount} Open
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent dark:border-border/20">
                    <TableHead className="dark:text-muted-foreground/80">Employee</TableHead>
                    <TableHead className="dark:text-muted-foreground/80">Description</TableHead>
                    <TableHead className="dark:text-muted-foreground/80">Status</TableHead>
                    <TableHead className="text-right dark:text-muted-foreground/80">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map(flag => {
                    const isResolving = resolvingFlagId === flag.id
                    const isResolved = flag.status !== "Open"

                    return (
                      <TableRow 
                        key={flag.id}
                        className="hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors duration-200 dark:border-border/20"
                      >
                        <TableCell className="font-medium dark:text-foreground/90">
                          {flag.employee_name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground dark:text-muted-foreground/70">
                          {flag.description}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={isResolved ? "default" : "destructive"}
                            className={`gap-1 transition-all duration-300 ${
                              isResolved 
                                ? 'border border-green-200 dark:border-green-800/40 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'dark:bg-destructive/90'
                            }`}
                          >
                            {isResolved ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                Resolved
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3" />
                                Open
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {!isResolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveFlag(flag.id)}
                              disabled={isResolving}
                              className="gap-2 dark:border-border/40 dark:hover:bg-accent/30 transition-all duration-300"
                            >
                              {isResolving ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span className="hidden sm:inline">Resolving...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span className="hidden sm:inline">Resolve</span>
                                </>
                              )}
                            </Button>
                          )}
                          {isResolved && (
                            <div className="flex justify-end">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg transition-all hover:scale-110 duration-300">
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}

      {/* Audit Guidelines */}
      {cycleStatus === "Draft" && (
        <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center text-blue-700 dark:text-blue-300">
              <Zap className="w-4 h-4 mr-2" />
              Audit Process Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>The audit validates employee data, attendance, and salary structures before payroll execution</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>All flagged issues must be resolved before proceeding to the execution phase</span>
              </li>
              <li className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Use the "Recheck Audit" button to verify all issues have been resolved</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Once cleared, the system will automatically transition to the execution phase</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
