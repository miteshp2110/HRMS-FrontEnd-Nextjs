"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { executePayrollGroupRun, getAuditFlags, runPrePayrollAudit, updatePayrollCycleStatus, verifyAudit, type PayrollCycle } from "@/lib/api";
import { 
    Play, 
    Loader2, 
    CheckCircle2, 
    Clock, 
    Users, 
    Calculator,
    AlertTriangle,
    Zap
} from "lucide-react";

interface Props {
    cycleId: number;
    cycleStatus: string;
    groupRuns: PayrollCycle['runs'];
    onExecute: () => void;
}

export function RunsTab({ cycleId, cycleStatus, groupRuns, onExecute }: Props) {
    const { toast } = useToast();
    const [executingId, setExecutingId] = React.useState<number | null>(null);
    const [isFlags,setIsFlags] = React.useState<boolean >(true);

    React.useEffect(()=>{
        checkAudits()
    },[])

    const checkAudits = async()=>{
        try{
            
            const conflicts = await getAuditFlags(cycleId)
            
            if(conflicts.length===0){
                setIsFlags(false)
            }
            else{
                setIsFlags(true)
                toast({ 
                title: "Error", 
                description: `Still there are flags , check audit`, 
                variant: "destructive" 
            });
            }
        }
        catch(err){
            toast({ 
                title: "Error", 
                description: `Failed to load`, 
                variant: "destructive" 
            });
        }
    }

    const handleExecute = async (groupId: number, groupName: string) => {
        setExecutingId(groupId);
        try {
            
            await verifyAudit(cycleId)
            const sureCheck = await getAuditFlags(cycleId)
            if(sureCheck.length !== 0){
                setIsFlags(true)
                toast({ 
                title: "Error", 
                description: `Clear All Flags First`, 
                variant: "destructive" 
            });
            }
            else{
                const result = await executePayrollGroupRun(cycleId, groupId);
            
            if (result.summary) {
                toast({ 
                    title: "Execution Complete", 
                    description: `${groupName}: Processed ${result.summary.processed}/${result.summary.total_employees} employees${result.summary.errors > 0 ? ` (${result.summary.errors} errors)` : ''}` 
                });
            } else {

                toast({ 
                    title: "Success", 
                    description: result.message || `${groupName} executed successfully` 
                });
                await updatePayrollCycleStatus(cycleId, "Review")
            }
            
            onExecute();
            }
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: `Failed to execute ${groupName}: ${error.message}`, 
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

    return (
        <div className="space-y-6">
            {/* Execution Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Zap className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <CardTitle>Payroll Execution</CardTitle>
                                <CardDescription>
                                    Execute payroll calculations by component groups
                                </CardDescription>
                            </div>
                        </div>
                        
                        <Badge variant={completedRuns === totalRuns ? 'default' : 'secondary'}>
                            {completedRuns}/{totalRuns} groups completed
                        </Badge>
                    </div>
                </CardHeader>
                
                <CardContent>
                    <div className="space-y-4">
                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Execution Progress</span>
                                <span>{completedRuns}/{totalRuns} groups processed</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>

                        {/* Status Alert */}
                        {!canExecute ? (
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Complete the audit process first before executing payroll runs.
                                </AlertDescription>
                            </Alert>
                        ) : completedRuns === totalRuns ? (
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    All payroll groups have been executed successfully! Ready for review.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert className="border-blue-200 bg-blue-50">
                                <Play className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800">
                                    Ready to execute payroll calculations. Process each group individually.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Group Runs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Component Groups</CardTitle>
                    <CardDescription>
                        Execute payroll calculations for each component group
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {groupRuns.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Groups Found</h3>
                            <p className="text-gray-500">
                                No payroll groups are associated with this cycle.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Group Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-32">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groupRuns.map((run) => (
                                    <TableRow key={run.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    run.status === 'Calculated' ? 'bg-green-500' : 
                                                    executingId === run.group_id ? 'bg-yellow-500 animate-pulse' : 
                                                    'bg-gray-300'
                                                }`}></div>
                                                <span className="font-medium">{run.group_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={run.status === 'Calculated' ? 'default' : 'secondary'}>
                                                {executingId === run.group_id ? 'Processing...' : run.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {run.status === 'Calculated' ? (
                                                'Payroll calculations completed'
                                            ) : executingId === run.group_id ? (
                                                'Processing payroll calculations...'
                                            ) : (
                                                'Ready to execute payroll calculations'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {run.status === 'Pending' && canExecute && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleExecute(run.group_id, run.group_name)}
                                                    disabled={executingId !== null || isFlags}
                                                    className="bg-orange-600 hover:bg-orange-700"
                                                >
                                                    {executingId === run.group_id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Play className="w-3 h-3" />
                                                    )}
                                                </Button>
                                            )}
                                            {run.status === 'Calculated' && (
                                                <div className="flex items-center text-green-600">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Execution Tips */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-blue-700">
                        <Calculator className="w-4 h-4 mr-2" />
                        Execution Tips
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <ul className="text-sm text-blue-600 space-y-1">
                        <li>• Each group contains related payroll components (earnings, deductions)</li>
                        <li>• Groups can be executed independently and in any order</li>
                        <li>• Re-executing a group will overwrite previous calculations for those components</li>
                        <li>• All groups must be completed before moving to review phase</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}