"use client"

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, DollarSign, Users, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
    getPayrollCycleDetails, 
    updatePayrollCycleStatus, 
    deletePayrollCycle,
    type PayrollCycle 
} from "@/lib/api";

// Import tab components
import { AuditTab } from "@/components/payroll/runs/AuditTab";
import { RunsTab } from "@/components/payroll/runs/RunsTab";
import { ReviewTab } from "@/components/payroll/runs/ReviewTab";
import { OverviewTab } from "@/components/payroll/runs/OverviewTab";

const statusColors = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Auditing': 'bg-yellow-100 text-yellow-800',
    'Review': 'bg-blue-100 text-blue-800',
    'Finalized': 'bg-green-100 text-green-800',
    'Paid': 'bg-purple-100 text-purple-800'
};

export default function PayrollCycleDetailPage() {
    const { cycleId } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [cycle, setCycle] = React.useState<PayrollCycle | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("overview");

    const fetchCycleDetails = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getPayrollCycleDetails(Number(cycleId));
            setCycle(data);
            
            // Auto-select appropriate tab based on status
            if (data.status === 'Draft') {
                setActiveTab("audit");
            } else if (data.status === 'Auditing') {
                setActiveTab("runs");
            } else if (data.status === 'Review') {
                setActiveTab("review");
            }
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: `Failed to load cycle details: ${error.message}`, 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    }, [cycleId, toast]);

    const markAsPaid = async()=>{
        await updatePayrollCycleStatus(cycle?.id!,'Paid')
        await fetchCycleDetails()
    }

    React.useEffect(() => {
        fetchCycleDetails();
    }, [fetchCycleDetails]);

    const handleDeleteCycle = async () => {
        if (!cycle || cycle.status !== 'Draft') return;
        
        if (!confirm('Are you sure you want to delete this payroll cycle? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deletePayrollCycle(cycle.id);
            toast({ title: "Success", description: "Payroll cycle deleted successfully." });
            router.push('/payroll');
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: `Failed to delete cycle: ${error.message}`, 
                variant: "destructive" 
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!cycle) return;

        try {
            await updatePayrollCycleStatus(cycle.id, newStatus as any);
            toast({ title: "Success", description: `Cycle status updated to ${newStatus}` });
            await fetchCycleDetails();
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: `Failed to update status: ${error.message}`, 
                variant: "destructive" 
            });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="ml-2">Loading cycle details...</span>
                </div>
            </div>
        );
    }

    if (!cycle) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Cycle Not Found</h3>
                            <p className="text-gray-500">The requested payroll cycle could not be found.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Calculate summary statistics
    const reviewedPayslips = cycle.payslips.filter(p => p.status === 'Reviewed').length;
    const totalPayslips = cycle.payslips.length;
    const completedRuns = cycle.runs.filter(r => r.status === 'Calculated').length;
    const totalRuns = cycle.runs.length;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push('/payroll/runs')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Payroll
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{cycle.cycle_name}</h1>
                        <p className="text-gray-600">
                            {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge className={statusColors[cycle.status]}>
                        {cycle.status}
                    </Badge>
                    {cycle.status === 'Draft' && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteCycle}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Cycle'}
                        </Button>
                    )}
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchCycleDetails}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    {
                        cycle.status === 'Finalized' ?
                        <Button 
                        variant="default" 
                        size="sm" 
                        onClick={markAsPaid}
                    >
                        
                        Mark as Paid
                    </Button>:
                    <></>
                    }
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <Badge className={statusColors[cycle.status]}>
                            {cycle.status}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-gray-500">
                            Initiated by {cycle.initiated_by_name}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Groups/Runs</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedRuns}/{totalRuns}</div>
                        <p className="text-xs text-muted-foreground">
                            Completed runs
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payslips</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPayslips}</div>
                        <p className="text-xs text-muted-foreground">
                            {reviewedPayslips} reviewed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Period</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {Math.ceil((new Date(cycle.end_date).getTime() - new Date(cycle.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pay period duration
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="audit">
                        Audit
                        {cycle.status === 'Draft' && <Badge variant="secondary" className="ml-2">Start Here</Badge>}
                    </TabsTrigger>
                    <TabsTrigger 
                        value="runs" 
                        disabled={cycle.status === 'Draft'}
                    >
                        Execution
                        {cycle.status === 'Auditing' && <Badge variant="secondary" className="ml-2">Next</Badge>}
                    </TabsTrigger>
                    <TabsTrigger 
                        value="review" 
                        disabled={!['Review', 'Finalized', 'Paid'].includes(cycle.status)}
                    >
                        Review
                        {cycle.status === 'Review' && <Badge variant="secondary" className="ml-2">Active</Badge>}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <OverviewTab 
                        cycle={cycle} 
                        onStatusChange={handleStatusChange}
                        onRefresh={fetchCycleDetails}
                    />
                </TabsContent>

                <TabsContent value="audit">
                    <AuditTab 
                        cycleId={cycle.id} 
                        cycleStatus={cycle.status} 
                        onAuditRun={fetchCycleDetails}
                    />
                </TabsContent>

                <TabsContent value="runs">
                    <RunsTab 
                        cycleId={cycle.id} 
                        cycleStatus={cycle.status} 
                        groupRuns={cycle.runs} 
                        onExecute={fetchCycleDetails}
                    />
                </TabsContent>

                <TabsContent value="review">
                    <ReviewTab 
                        cycleId={cycle.id} 
                        cycleStatus={cycle.status} 
                        onStatusChange={fetchCycleDetails}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}