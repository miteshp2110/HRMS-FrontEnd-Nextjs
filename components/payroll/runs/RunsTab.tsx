// "use client"

// import * as React from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useToast } from "@/hooks/use-toast";
// import { executePayrollGroupRun, getAuditFlags, runPrePayrollAudit, updatePayrollCycleStatus, verifyAudit, type PayrollCycle } from "@/lib/api";
// import { 
//     Play, 
//     Loader2, 
//     CheckCircle2, 
//     Clock, 
//     Users, 
//     Calculator,
//     AlertTriangle,
//     Zap
// } from "lucide-react";

// interface Props {
//     cycleId: number;
//     cycleStatus: string;
//     groupRuns: PayrollCycle['runs'];
//     onExecute: () => void;
// }

// export function RunsTab({ cycleId, cycleStatus, groupRuns, onExecute }: Props) {
//     const { toast } = useToast();
//     const [executingId, setExecutingId] = React.useState<number | null>(null);
//     const [isFlags,setIsFlags] = React.useState<boolean >(true);

//     React.useEffect(()=>{
//         checkAudits()
//     },[])

//     const checkAudits = async()=>{
//         try{
            
//             const conflicts = await getAuditFlags(cycleId)
            
//             if(conflicts.length===0){
//                 setIsFlags(false)
//             }
//             else{
//                 setIsFlags(true)
//                 toast({ 
//                 title: "Error", 
//                 description: `Still there are flags , check audit`, 
//                 variant: "destructive" 
//             });
//             }
//         }
//         catch(err){
//             toast({ 
//                 title: "Error", 
//                 description: `Failed to load`, 
//                 variant: "destructive" 
//             });
//         }
//     }

//     const handleExecute = async (groupId: number, groupName: string) => {
//         setExecutingId(groupId);
//         try {
            
//             await verifyAudit(cycleId)
//             const sureCheck = await getAuditFlags(cycleId)
//             if(sureCheck.length !== 0){
//                 setIsFlags(true)
//                 toast({ 
//                 title: "Error", 
//                 description: `Clear All Flags First`, 
//                 variant: "destructive" 
//             });
//             }
//             else{
//                 const result = await executePayrollGroupRun(cycleId, groupId);
            
//             if (result.summary) {
//                 toast({ 
//                     title: "Execution Complete", 
//                     description: `${groupName}: Processed ${result.summary.processed}/${result.summary.total_employees} employees${result.summary.errors > 0 ? ` (${result.summary.errors} errors)` : ''}` 
//                 });
//             } else {

//                 toast({ 
//                     title: "Success", 
//                     description: result.message || `${groupName} executed successfully` 
//                 });
//                 await updatePayrollCycleStatus(cycleId, "Review")
//             }
            
//             onExecute();
//             }
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: `Failed to execute ${groupName}: ${error.message}`, 
//                 variant: "destructive" 
//             });
//         } finally {
//             setExecutingId(null);
//         }
//     };

//     const completedRuns = groupRuns.filter(run => run.status === 'Calculated').length;
//     const totalRuns = groupRuns.length;
//     const progressPercentage = totalRuns > 0 ? (completedRuns / totalRuns) * 100 : 0;
//     const canExecute = cycleStatus === 'Auditing';

//     return (
//         <div className="space-y-6">
//             {/* Execution Header */}
//             <Card>
//                 <CardHeader>
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                             <div className="p-2 bg-orange-100 rounded-lg">
//                                 <Zap className="w-6 h-6 text-orange-600" />
//                             </div>
//                             <div>
//                                 <CardTitle>Payroll Execution</CardTitle>
//                                 <CardDescription>
//                                     Execute payroll calculations by component groups
//                                 </CardDescription>
//                             </div>
//                         </div>
                        
//                         <Badge variant={completedRuns === totalRuns ? 'default' : 'secondary'}>
//                             {completedRuns}/{totalRuns} groups completed
//                         </Badge>
//                     </div>
//                 </CardHeader>
                
//                 <CardContent>
//                     <div className="space-y-4">
//                         {/* Progress Bar */}
//                         <div>
//                             <div className="flex justify-between text-sm mb-2">
//                                 <span>Execution Progress</span>
//                                 <span>{completedRuns}/{totalRuns} groups processed</span>
//                             </div>
//                             <Progress value={progressPercentage} className="h-2" />
//                         </div>

//                         {/* Status Alert */}
//                         {!canExecute ? (
//                             <Alert>
//                                 <AlertTriangle className="h-4 w-4" />
//                                 <AlertDescription>
//                                     Complete the audit process first before executing payroll runs.
//                                 </AlertDescription>
//                             </Alert>
//                         ) : completedRuns === totalRuns ? (
//                             <Alert className="border-green-200 bg-green-50">
//                                 <CheckCircle2 className="h-4 w-4 text-green-600" />
//                                 <AlertDescription className="text-green-800">
//                                     All payroll groups have been executed successfully! Ready for review.
//                                 </AlertDescription>
//                             </Alert>
//                         ) : (
//                             <Alert className="border-blue-200 bg-blue-50">
//                                 <Play className="h-4 w-4 text-blue-600" />
//                                 <AlertDescription className="text-blue-800">
//                                     Ready to execute payroll calculations. Process each group individually.
//                                 </AlertDescription>
//                             </Alert>
//                         )}
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Group Runs Table */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Component Groups</CardTitle>
//                     <CardDescription>
//                         Execute payroll calculations for each component group
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {groupRuns.length === 0 ? (
//                         <div className="text-center py-12">
//                             <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                             <h3 className="text-lg font-semibold text-gray-600 mb-2">No Groups Found</h3>
//                             <p className="text-gray-500">
//                                 No payroll groups are associated with this cycle.
//                             </p>
//                         </div>
//                     ) : (
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Group Name</TableHead>
//                                     <TableHead>Status</TableHead>
//                                     <TableHead>Description</TableHead>
//                                     <TableHead className="w-32">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {groupRuns.map((run) => (
//                                     <TableRow key={run.id}>
//                                         <TableCell>
//                                             <div className="flex items-center space-x-2">
//                                                 <div className={`w-3 h-3 rounded-full ${
//                                                     run.status === 'Calculated' ? 'bg-green-500' : 
//                                                     executingId === run.group_id ? 'bg-yellow-500 animate-pulse' : 
//                                                     'bg-gray-300'
//                                                 }`}></div>
//                                                 <span className="font-medium">{run.group_name}</span>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Badge variant={run.status === 'Calculated' ? 'default' : 'secondary'}>
//                                                 {executingId === run.group_id ? 'Processing...' : run.status}
//                                             </Badge>
//                                         </TableCell>
//                                         <TableCell className="text-sm text-gray-600">
//                                             {run.status === 'Calculated' ? (
//                                                 'Payroll calculations completed'
//                                             ) : executingId === run.group_id ? (
//                                                 'Processing payroll calculations...'
//                                             ) : (
//                                                 'Ready to execute payroll calculations'
//                                             )}
//                                         </TableCell>
//                                         <TableCell>
//                                             {run.status === 'Pending' && canExecute && (
//                                                 <Button
//                                                     size="sm"
//                                                     onClick={() => handleExecute(run.group_id, run.group_name)}
//                                                     disabled={executingId !== null || isFlags}
//                                                     className="bg-orange-600 hover:bg-orange-700"
//                                                 >
//                                                     {executingId === run.group_id ? (
//                                                         <Loader2 className="w-3 h-3 animate-spin" />
//                                                     ) : (
//                                                         <Play className="w-3 h-3" />
//                                                     )}
//                                                 </Button>
//                                             )}
//                                             {run.status === 'Calculated' && (
//                                                 <div className="flex items-center text-green-600">
//                                                     <CheckCircle2 className="w-4 h-4" />
//                                                 </div>
//                                             )}
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* Execution Tips */}
//             <Card className="bg-blue-50 border-blue-200">
//                 <CardHeader>
//                     <CardTitle className="text-sm flex items-center text-blue-700">
//                         <Calculator className="w-4 h-4 mr-2" />
//                         Execution Tips
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="pt-0">
//                     <ul className="text-sm text-blue-600 space-y-1">
//                         <li>• Each group contains related payroll components (earnings, deductions)</li>
//                         <li>• Groups can be executed independently and in any order</li>
//                         <li>• Re-executing a group will overwrite previous calculations for those components</li>
//                         <li>• All groups must be completed before moving to review phase</li>
//                     </ul>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
    executePayrollGroupRun, 
    getAuditFlags, 
    runPrePayrollAudit, 
    updatePayrollCycleStatus, 
    verifyAudit, 
    type PayrollCycle 
} from "@/lib/api";
import { 
    Play, 
    Loader2, 
    CheckCircle2, 
    Clock, 
    Users, 
    Calculator,
    AlertTriangle,
    Zap,
    Activity,
    TrendingUp,
    Shield,
    Sparkles
} from "lucide-react";

interface Props {
    cycleId: number;
    cycleStatus: string;
    groupRuns: PayrollCycle['runs'];
    onExecute: () => void;
}

// Loading Skeletons
const GroupRunsTableSkeleton = () => (
    <Table>
        <TableHeader>
            <TableRow className="hover:bg-transparent dark:border-border/20">
                <TableHead className="dark:text-muted-foreground/80">Group Name</TableHead>
                <TableHead className="dark:text-muted-foreground/80">Status</TableHead>
                <TableHead className="dark:text-muted-foreground/80">Description</TableHead>
                <TableHead className="w-32 dark:text-muted-foreground/80">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {[...Array(5)].map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent dark:border-border/20">
                    <TableCell>
                        <div className="flex items-center space-x-2">
                            <Skeleton className="w-3 h-3 rounded-full bg-muted/50 dark:bg-muted/30" />
                            <Skeleton className="h-5 w-40 bg-muted/50 dark:bg-muted/30" />
                        </div>
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full bg-muted/50 dark:bg-muted/30" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-64 bg-muted/50 dark:bg-muted/30" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-8 w-8 rounded bg-muted/50 dark:bg-muted/30" />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

const HeaderSkeleton = () => (
    <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-12 rounded-lg bg-muted/50 dark:bg-muted/30" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40 bg-muted/50 dark:bg-muted/30" />
                        <Skeleton className="h-4 w-64 bg-muted/50 dark:bg-muted/30" />
                    </div>
                </div>
                <Skeleton className="h-6 w-32 rounded-full bg-muted/50 dark:bg-muted/30" />
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-32 bg-muted/50 dark:bg-muted/30" />
                    <Skeleton className="h-4 w-24 bg-muted/50 dark:bg-muted/30" />
                </div>
                <Skeleton className="h-2 w-full bg-muted/50 dark:bg-muted/30" />
            </div>
            <Skeleton className="h-16 w-full rounded-lg bg-muted/50 dark:bg-muted/30" />
        </CardContent>
    </Card>
);

export function RunsTab({ cycleId, cycleStatus, groupRuns, onExecute }: Props) {
    const { toast } = useToast();
    const [executingId, setExecutingId] = React.useState<number | null>(null);
    const [isFlags, setIsFlags] = React.useState<boolean>(true);
    const [isCheckingAudits, setIsCheckingAudits] = React.useState(true);
    const [isInitialLoad, setIsInitialLoad] = React.useState(true);

    React.useEffect(() => {
        checkAudits();
    }, []);

    const checkAudits = async () => {
        setIsCheckingAudits(true);
        try {
            const conflicts = await getAuditFlags(cycleId);
            
            if (conflicts.length === 0) {
                setIsFlags(false);
            } else {
                setIsFlags(true);
                if (!isInitialLoad) {
                    toast({ 
                        title: "Audit Required", 
                        description: `${conflicts.length} audit flag(s) need to be resolved first`, 
                        variant: "destructive" 
                    });
                }
            }
        } catch (err) {
            toast({ 
                title: "Error", 
                description: `Failed to check audit status`, 
                variant: "destructive" 
            });
        } finally {
            setIsCheckingAudits(false);
            setIsInitialLoad(false);
        }
    };

    const handleExecute = async (groupId: number, groupName: string) => {
        setExecutingId(groupId);
        try {
            await verifyAudit(cycleId);
            const sureCheck = await getAuditFlags(cycleId);
            
            if (sureCheck.length !== 0) {
                setIsFlags(true);
                toast({ 
                    title: "Cannot Execute", 
                    description: `Please resolve all ${sureCheck.length} audit flag(s) first`, 
                    variant: "destructive" 
                });
            } else {
                const result = await executePayrollGroupRun(cycleId, groupId);
            
                if (result.summary) {
                    toast({ 
                        title: "Execution Complete", 
                        description: `${groupName}: Processed ${result.summary.processed}/${result.summary.total_employees} employees${result.summary.errors > 0 ? ` (${result.summary.errors} errors)` : ''}`,
                        duration: 5000
                    });
                } else {
                    toast({ 
                        title: "Success", 
                        description: result.message || `${groupName} executed successfully`,
                        duration: 5000
                    });
                    await updatePayrollCycleStatus(cycleId, "Review");
                }
                
                onExecute();
                await checkAudits();
            }
        } catch (error: any) {
            toast({ 
                title: "Execution Failed", 
                description: `${groupName}: ${error.message}`, 
                variant: "destructive" 
            });
        } finally {
            setExecutingId(null);
        }
    };

    const completedRuns = groupRuns.filter(run => run.status === 'Calculated').length;
    const totalRuns = groupRuns.length;
    const progressPercentage = totalRuns > 0 ? (completedRuns / totalRuns) * 100 : 0;
    const canExecute = cycleStatus === 'Auditing';

    // Loading state
    if (isInitialLoad && isCheckingAudits) {
        return (
            <div className="space-y-6 p-6">
                <HeaderSkeleton />
                <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                    <CardHeader>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48 bg-muted/50 dark:bg-muted/30" />
                            <Skeleton className="h-4 w-96 bg-muted/50 dark:bg-muted/30" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <GroupRunsTableSkeleton />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Execution Header */}
            <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-card to-card/50 dark:from-card/40 dark:to-card/20 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 rounded-lg transition-all hover:scale-110 duration-300 shadow-md">
                                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <CardTitle className="flex items-center gap-2 dark:text-foreground/90">
                                    Payroll Execution
                                    {isCheckingAudits && (
                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                    )}
                                </CardTitle>
                                <CardDescription className="dark:text-muted-foreground/80">
                                    Execute payroll calculations by component groups
                                </CardDescription>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {isFlags && (
                                <Badge 
                                    variant="destructive" 
                                    className="gap-1 animate-pulse dark:bg-destructive/90"
                                >
                                    <Shield className="w-3 h-3" />
                                    Audit Required
                                </Badge>
                            )}
                            <Badge 
                                variant={completedRuns === totalRuns ? 'default' : 'secondary'}
                                className={`gap-1 border ${
                                    completedRuns === totalRuns 
                                        ? 'border-green-200 dark:border-green-800/40 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                        : 'dark:bg-secondary/50 dark:text-secondary-foreground/90'
                                }`}
                            >
                                <Activity className="w-3 h-3" />
                                {completedRuns}/{totalRuns} groups completed
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent>
                    <div className="space-y-4">
                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2 dark:text-foreground/80">
                                <span className="font-medium">Execution Progress</span>
                                <span className="font-semibold">{completedRuns}/{totalRuns} groups processed</span>
                            </div>
                            <div className="relative">
                                <Progress 
                                    value={progressPercentage} 
                                    className="h-3 transition-all duration-500"
                                />
                                <div 
                                    className="absolute top-0 left-0 h-3 bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 rounded-full transition-all duration-500 opacity-80"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            {progressPercentage > 0 && (
                                <div className="flex justify-end mt-1">
                                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                                        {Math.round(progressPercentage)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Status Alert */}
                        {!canExecute ? (
                            <Alert className="border-yellow-200 dark:border-yellow-800/40 bg-yellow-50 dark:bg-yellow-900/20 animate-in fade-in duration-500">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                                    Complete the audit process first before executing payroll runs.
                                </AlertDescription>
                            </Alert>
                        ) : isFlags ? (
                            <Alert className="border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 animate-in fade-in duration-500">
                                <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
                                    <strong>Audit flags detected.</strong> Please resolve all audit issues before executing payroll calculations.
                                </AlertDescription>
                            </Alert>
                        ) : completedRuns === totalRuns ? (
                            <Alert className="border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/20 animate-in fade-in duration-500">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    <strong>All payroll groups executed successfully!</strong> Ready to proceed to review phase.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert className="border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/20 animate-in fade-in duration-500">
                                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <AlertDescription className="text-blue-800 dark:text-blue-200">
                                    Ready to execute payroll calculations. Process each group individually by clicking the execute button.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-br from-muted/50 to-muted/30 dark:from-muted/20 dark:to-muted/10 rounded-lg border border-border/40 dark:border-border/20">
                            <div className="text-center space-y-1 p-3 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                                    <Users className="w-4 h-4" />
                                    Total Groups
                                </div>
                                <div className="text-2xl font-bold dark:text-foreground/90">{totalRuns}</div>
                            </div>
                            <div className="text-center space-y-1 p-3 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Completed
                                </div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedRuns}</div>
                            </div>
                            <div className="text-center space-y-1 p-3 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                                    <Clock className="w-4 h-4" />
                                    Pending
                                </div>
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalRuns - completedRuns}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Group Runs Table */}
            <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                <CardHeader>
                    <CardTitle className="flex items-center dark:text-foreground/90">
                        <Users className="w-5 h-5 mr-2" />
                        Component Groups
                    </CardTitle>
                    <CardDescription className="dark:text-muted-foreground/80">
                        Execute payroll calculations for each component group
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {groupRuns.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-muted dark:bg-muted/30 p-6">
                                    <Users className="w-16 h-16 text-muted-foreground dark:text-muted-foreground/70" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold dark:text-foreground/90">No Groups Found</h3>
                            <p className="text-muted-foreground dark:text-muted-foreground/80">
                                No payroll groups are associated with this cycle.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent dark:border-border/20">
                                    <TableHead className="dark:text-muted-foreground/80">Group Name</TableHead>
                                    <TableHead className="dark:text-muted-foreground/80">Status</TableHead>
                                    <TableHead className="dark:text-muted-foreground/80">Description</TableHead>
                                    <TableHead className="w-32 dark:text-muted-foreground/80">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groupRuns.map((run) => {
                                    const isExecuting = executingId === run.group_id;
                                    const isCompleted = run.status === 'Calculated';
                                    
                                    return (
                                        <TableRow 
                                            key={run.id}
                                            className="hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors duration-200 dark:border-border/20"
                                        >
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                                                        isCompleted ? 'bg-green-500 dark:bg-green-400 shadow-green-500/50 shadow-lg' : 
                                                        isExecuting ? 'bg-orange-500 dark:bg-orange-400 animate-pulse shadow-orange-500/50 shadow-lg' : 
                                                        'bg-gray-300 dark:bg-gray-600'
                                                    }`}>
                                                        {isExecuting && (
                                                            <span className="absolute inset-0 rounded-full bg-orange-500 dark:bg-orange-400 animate-ping opacity-75"></span>
                                                        )}
                                                    </div>
                                                    <span className="font-medium dark:text-foreground/90">{run.group_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={isCompleted ? 'default' : 'secondary'}
                                                    className={`gap-1 transition-all duration-300 ${
                                                        isCompleted 
                                                            ? 'border border-green-200 dark:border-green-800/40 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                            : isExecuting
                                                            ? 'border border-orange-200 dark:border-orange-800/40 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                            : 'dark:bg-secondary/50 dark:text-secondary-foreground/90'
                                                    }`}
                                                >
                                                    {isExecuting ? (
                                                        <>
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : isCompleted ? (
                                                        <>
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            {run.status}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-3 h-3" />
                                                            {run.status}
                                                        </>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground dark:text-muted-foreground/70">
                                                {isCompleted ? (
                                                    <span className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                        Payroll calculations completed
                                                    </span>
                                                ) : isExecuting ? (
                                                    <span className="flex items-center gap-2">
                                                        <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400 animate-pulse" />
                                                        Processing payroll calculations...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <Play className="w-4 h-4 text-muted-foreground dark:text-muted-foreground/70" />
                                                        Ready to execute payroll calculations
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {run.status === 'Pending' && canExecute && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleExecute(run.group_id, run.group_name)}
                                                        disabled={executingId !== null || isFlags}
                                                        className="gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 dark:from-orange-500 dark:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isExecuting ? (
                                                            <>
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                                <span className="hidden sm:inline">Executing...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Play className="w-3 h-3" />
                                                                <span className="hidden sm:inline">Execute</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                                {isCompleted && (
                                                    <div className="flex items-center justify-center">
                                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg transition-all hover:scale-110 duration-300">
                                                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Execution Tips */}
            <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-blue-700 dark:text-blue-300">
                        <Calculator className="w-4 h-4 mr-2" />
                        Execution Guidelines
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                        <li className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Each group contains related payroll components (earnings, deductions)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Groups can be executed independently and in any order</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>Re-executing a group will overwrite previous calculations for those components</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>All groups must be completed before moving to review phase</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
