// "use client"

// import * as React from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { AlertCircle, Calendar, DollarSign, Users, ArrowLeft, RefreshCw } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { 
//     getPayrollCycleDetails, 
//     updatePayrollCycleStatus, 
//     deletePayrollCycle,
//     type PayrollCycle, 
//     getAuditFlags
// } from "@/lib/api";

// // Import tab components
// import { AuditTab } from "@/components/payroll/runs/AuditTab";
// import { RunsTab } from "@/components/payroll/runs/RunsTab";
// import { ReviewTab } from "@/components/payroll/runs/ReviewTab";
// import { OverviewTab } from "@/components/payroll/runs/OverviewTab";

// const statusColors = {
//     'Draft': 'bg-gray-100 text-gray-800',
//     'Auditing': 'bg-yellow-100 text-yellow-800',
//     'Review': 'bg-blue-100 text-blue-800',
//     'Finalized': 'bg-green-100 text-green-800',
//     'Paid': 'bg-purple-100 text-purple-800'
// };

// export default function PayrollCycleDetailPage() {
//     const { cycleId } = useParams();
//     const router = useRouter();
//     const { toast } = useToast();
    
//     const [cycle, setCycle] = React.useState<PayrollCycle | null>(null);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isDeleting, setIsDeleting] = React.useState(false);
//     const [activeTab, setActiveTab] = React.useState("overview");

//     const fetchCycleDetails = React.useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const data = await getPayrollCycleDetails(Number(cycleId));
//             const conflicts = await getAuditFlags(Number(cycleId))
//             setCycle(data);
//             console.log(conflicts)
//             // Auto-select appropriate tab based on status
//             if(conflicts.length !== 0){
//                 setActiveTab('audit')
//             }
//             else if (data.status === 'Draft') {
//                 setActiveTab("audit");
//             } else if (data.status === 'Auditing') {
//                 setActiveTab("runs");
//             } else if (data.status === 'Review') {
//                 setActiveTab("review");
//             } 

//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: `Failed to load cycle details: ${error.message}`, 
//                 variant: "destructive" 
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [cycleId, toast]);

//     const markAsPaid = async()=>{
//         await updatePayrollCycleStatus(cycle?.id!,'Paid')
//         await fetchCycleDetails()
//     }

//     React.useEffect(() => {
//         fetchCycleDetails();
//     }, [fetchCycleDetails]);

//     const handleDeleteCycle = async () => {
//         if (!cycle || cycle.status !== 'Draft') return;
        
//         if (!confirm('Are you sure you want to delete this payroll cycle? This action cannot be undone.')) {
//             return;
//         }

//         setIsDeleting(true);
//         try {
//             await deletePayrollCycle(cycle.id);
//             toast({ title: "Success", description: "Payroll cycle deleted successfully." });
//             router.push('/payroll');
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: `Failed to delete cycle: ${error.message}`, 
//                 variant: "destructive" 
//             });
//         } finally {
//             setIsDeleting(false);
//         }
//     };

//     const handleStatusChange = async (newStatus: string) => {
//         if (!cycle) return;

//         try {
//             await updatePayrollCycleStatus(cycle.id, newStatus as any);
//             toast({ title: "Success", description: `Cycle status updated to ${newStatus}` });
//             await fetchCycleDetails();
//         } catch (error: any) {
//             toast({ 
//                 title: "Error", 
//                 description: `Failed to update status: ${error.message}`, 
//                 variant: "destructive" 
//             });
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="container mx-auto p-6">
//                 <div className="flex items-center justify-center h-64">
//                     <RefreshCw className="w-8 h-8 animate-spin" />
//                     <span className="ml-2">Loading cycle details...</span>
//                 </div>
//             </div>
//         );
//     }

//     if (!cycle) {
//         return (
//             <div className="container mx-auto p-6">
//                 <Card>
//                     <CardContent className="flex items-center justify-center h-64">
//                         <div className="text-center">
//                             <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                             <h3 className="text-lg font-semibold text-gray-600 mb-2">Cycle Not Found</h3>
//                             <p className="text-gray-500">The requested payroll cycle could not be found.</p>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }

//     // Calculate summary statistics
//     const reviewedPayslips = cycle.payslips.filter(p => p.status === 'Reviewed').length;
//     const totalPayslips = cycle.payslips.length;
//     const completedRuns = cycle.runs.filter(r => r.status === 'Calculated').length;
//     const totalRuns = cycle.runs.length;

//     return (
//         <div className="container mx-auto p-6 space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                     <Button 
//                         variant="ghost" 
//                         size="sm" 
//                         onClick={() => router.push('/payroll/runs')}
//                     >
//                         <ArrowLeft className="w-4 h-4 mr-2" />
//                         Back to Payroll
//                     </Button>
//                     <div>
//                         <h1 className="text-3xl font-bold">{cycle.cycle_name}</h1>
//                         <p className="text-gray-600">
//                             {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                     <Badge className={statusColors[cycle.status]}>
//                         {cycle.status}
//                     </Badge>
//                     {cycle.status === 'Draft' && (
//                         <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={handleDeleteCycle}
//                             disabled={isDeleting}
//                         >
//                             {isDeleting ? 'Deleting...' : 'Delete Cycle'}
//                         </Button>
//                     )}
//                     <Button 
//                         variant="outline" 
//                         size="sm" 
//                         onClick={fetchCycleDetails}
//                     >
//                         <RefreshCw className="w-4 h-4 mr-2" />
//                         Refresh
//                     </Button>
//                     {
//                         cycle.status === 'Finalized' ?
//                         <Button 
//                         variant="default" 
//                         size="sm" 
//                         onClick={markAsPaid}
//                     >
                        
//                         Mark as Paid
//                     </Button>:
//                     <></>
//                     }
//                 </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Status</CardTitle>
//                         <Badge className={statusColors[cycle.status]}>
//                             {cycle.status}
//                         </Badge>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-xs text-gray-500">
//                             Initiated by {cycle.initiated_by_name}
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Groups/Runs</CardTitle>
//                         <Users className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">{completedRuns}/{totalRuns}</div>
//                         <p className="text-xs text-muted-foreground">
//                             Completed runs
//                         </p>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Payslips</CardTitle>
//                         <DollarSign className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">{totalPayslips}</div>
//                         <p className="text-xs text-muted-foreground">
//                             {reviewedPayslips} reviewed
//                         </p>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">Period</CardTitle>
//                         <Calendar className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-sm font-medium">
//                             {Math.ceil((new Date(cycle.end_date).getTime() - new Date(cycle.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                             Pay period duration
//                         </p>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Main Tabs */}
//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//                 <TabsList className="grid w-full grid-cols-4">
//                     <TabsTrigger value="overview">Overview</TabsTrigger>
//                     <TabsTrigger value="audit">
//                         Audit
//                         {cycle.status === 'Draft' && <Badge variant="secondary" className="ml-2">Start Here</Badge>}
//                     </TabsTrigger>
//                     <TabsTrigger 
//                         value="runs" 
//                         disabled={cycle.status === 'Draft'}
//                     >
//                         Execution
//                         {cycle.status === 'Auditing' && <Badge variant="secondary" className="ml-2">Next</Badge>}
//                     </TabsTrigger>
//                     <TabsTrigger 
//                         value="review" 
//                         disabled={!['Review', 'Finalized', 'Paid'].includes(cycle.status)}
//                     >
//                         Review
//                         {cycle.status === 'Review' && <Badge variant="secondary" className="ml-2">Active</Badge>}
//                     </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="overview">
//                     <OverviewTab 
//                         cycle={cycle} 
//                         onStatusChange={handleStatusChange}
//                         onRefresh={fetchCycleDetails}
//                     />
//                 </TabsContent>

//                 <TabsContent value="audit">
//                     <AuditTab 
//                         cycleId={cycle.id} 
//                         cycleStatus={cycle.status} 
//                         onAuditRun={fetchCycleDetails}
//                     />
//                 </TabsContent>

//                 <TabsContent value="runs">
//                     <RunsTab 
//                         cycleId={cycle.id} 
//                         cycleStatus={cycle.status} 
//                         groupRuns={cycle.runs} 
//                         onExecute={fetchCycleDetails}
//                     />
//                 </TabsContent>

//                 <TabsContent value="review">
//                     <ReviewTab 
//                         cycleId={cycle.id} 
//                         cycleStatus={cycle.status} 
//                         onStatusChange={fetchCycleDetails}
//                     />
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }


"use client"

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Calendar, DollarSign, Users, ArrowLeft, RefreshCw, Loader2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
    getPayrollCycleDetails, 
    updatePayrollCycleStatus, 
    deletePayrollCycle,
    type PayrollCycle, 
    getAuditFlags
} from "@/lib/api";

// Import tab components
import { AuditTab } from "@/components/payroll/runs/AuditTab";
import { RunsTab } from "@/components/payroll/runs/RunsTab";
import { ReviewTab } from "@/components/payroll/runs/ReviewTab";
import { OverviewTab } from "@/components/payroll/runs/OverviewTab";

// Currency formatter for AED
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('EN-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

const statusColors = {
    'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200 border-gray-200 dark:border-gray-700',
    'Auditing': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    'Review': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'Finalized': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    'Paid': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800'
};

// Loading Skeleton Components
const StatCardSkeleton = () => (
    <Card className="border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 dark:bg-card/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20 bg-muted/50 dark:bg-muted/30" />
            <Skeleton className="h-4 w-4 rounded-full bg-muted/50 dark:bg-muted/30" />
        </CardHeader>
        <CardContent className="space-y-2">
            <Skeleton className="h-8 w-16 bg-muted/50 dark:bg-muted/30" />
            <Skeleton className="h-3 w-32 bg-muted/50 dark:bg-muted/30" />
        </CardContent>
    </Card>
);

const HeaderSkeleton = () => (
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <Skeleton className="h-9 w-32 bg-muted/50 dark:bg-muted/30" />
            <div className="space-y-2">
                <Skeleton className="h-8 w-64 bg-muted/50 dark:bg-muted/30" />
                <Skeleton className="h-4 w-48 bg-muted/50 dark:bg-muted/30" />
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-20 rounded-full bg-muted/50 dark:bg-muted/30" />
            <Skeleton className="h-9 w-24 bg-muted/50 dark:bg-muted/30" />
        </div>
    </div>
);

export default function PayrollCycleDetailPage() {
    const { cycleId } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [cycle, setCycle] = React.useState<PayrollCycle | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isMarkingPaid, setIsMarkingPaid] = React.useState(false);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("overview");

    const fetchCycleDetails = React.useCallback(async (showRefreshLoader = false) => {
        try {
            if (showRefreshLoader) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }
            
            const data = await getPayrollCycleDetails(Number(cycleId));
            const conflicts = await getAuditFlags(Number(cycleId));
            setCycle(data);
            console.log(conflicts);
            
            // Auto-select appropriate tab based on status
            if (conflicts.length !== 0) {
                setActiveTab('audit');
            } else if (data.status === 'Draft') {
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
            setIsRefreshing(false);
        }
    }, [cycleId, toast]);

    const markAsPaid = async () => {
        if (!cycle) return;
        
        setIsMarkingPaid(true);
        try {
            await updatePayrollCycleStatus(cycle.id, 'Paid');
            toast({ 
                title: "Success", 
                description: "Payroll cycle marked as paid successfully" 
            });
            await fetchCycleDetails();
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: `Failed to mark as paid: ${error.message}`, 
                variant: "destructive" 
            });
        } finally {
            setIsMarkingPaid(false);
        }
    };

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
            toast({ 
                title: "Success", 
                description: "Payroll cycle deleted successfully." 
            });
            router.push('/payroll/runs');
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
            toast({ 
                title: "Success", 
                description: `Cycle status updated to ${newStatus}` 
            });
            await fetchCycleDetails();
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: `Failed to update status: ${error.message}`, 
                variant: "destructive" 
            });
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <HeaderSkeleton />
                
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>

                {/* Tabs Skeleton */}
                <Card className="border-border/40 dark:border-border/20 bg-card/50 dark:bg-card/30">
                    <CardHeader>
                        <div className="flex space-x-2">
                            <Skeleton className="h-10 w-24 bg-muted/50 dark:bg-muted/30" />
                            <Skeleton className="h-10 w-24 bg-muted/50 dark:bg-muted/30" />
                            <Skeleton className="h-10 w-24 bg-muted/50 dark:bg-muted/30" />
                            <Skeleton className="h-10 w-24 bg-muted/50 dark:bg-muted/30" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-32 w-full bg-muted/50 dark:bg-muted/30" />
                        <Skeleton className="h-32 w-full bg-muted/50 dark:bg-muted/30" />
                        <Skeleton className="h-32 w-full bg-muted/50 dark:bg-muted/30" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Not Found State
    if (!cycle) {
        return (
            <div className="container mx-auto p-6">
                <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                    <CardContent className="flex items-center justify-center h-64">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-muted dark:bg-muted/30 p-6">
                                    <AlertCircle className="w-12 h-12 text-muted-foreground dark:text-muted-foreground/70" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-foreground dark:text-foreground/90">Cycle Not Found</h3>
                                <p className="text-muted-foreground dark:text-muted-foreground/80 max-w-sm mx-auto">
                                    The requested payroll cycle could not be found or may have been deleted.
                                </p>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => router.push('/payroll/runs')}
                                className="mt-4 dark:border-border/40 dark:hover:bg-accent/50"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Payroll
                            </Button>
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
    const reviewProgress = totalPayslips > 0 ? Math.round((reviewedPayslips / totalPayslips) * 100) : 0;
    const runProgress = totalRuns > 0 ? Math.round((completedRuns / totalRuns) * 100) : 0;

    // Calculate total amount (if available in cycle data)
    const totalAmount = cycle.payslips.reduce((sum, payslip) => sum + (Number(payslip.net_pay) || 0), 0);

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Enhanced Header with Glass Effect */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push('/payroll/runs')}
                        className="hover:bg-accent/50 dark:hover:bg-accent/30"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text dark:from-foreground dark:to-foreground/60">
                            {cycle.cycle_name}
                        </h1>
                        <p className="text-muted-foreground dark:text-muted-foreground/80 flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(cycle.start_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                            })} - {new Date(cycle.end_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={`${statusColors[cycle.status]} px-3 py-1 font-medium border`}>
                        {cycle.status}
                    </Badge>
                    {cycle.status === 'Draft' && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteCycle}
                            disabled={isDeleting}
                            className="gap-2 dark:bg-destructive/90 dark:hover:bg-destructive"
                        >
                            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isDeleting ? 'Deleting...' : 'Delete Cycle'}
                        </Button>
                    )}
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchCycleDetails(true)}
                        disabled={isRefreshing}
                        className="gap-2 dark:border-border/40 dark:hover:bg-accent/30"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    {cycle.status === 'Finalized' && (
                        <Button 
                            variant="default" 
                            size="sm" 
                            onClick={markAsPaid}
                            disabled={isMarkingPaid}
                            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 dark:from-primary dark:to-primary/90"
                        >
                            {isMarkingPaid && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isMarkingPaid ? 'Processing...' : 'Mark as Paid'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Enhanced Stats Cards with Glass Morphism & Dark Mode */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-card to-card/50 dark:from-card/40 dark:to-card/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80">
                            Status
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-primary dark:text-primary/90" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Badge className={`${statusColors[cycle.status]} mb-2 border`}>
                            {cycle.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70 mt-2">
                            Initiated by {cycle.initiated_by_name}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-card to-card/50 dark:from-card/40 dark:to-card/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-blue-500/5 transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80">
                            Execution Progress
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold dark:text-foreground/90">{completedRuns}/{totalRuns}</div>
                            <Badge variant="secondary" className="text-xs dark:bg-secondary/50 dark:text-secondary-foreground/90">
                                {runProgress}%
                            </Badge>
                        </div>
                        <div className="mt-2 h-2 w-full bg-secondary dark:bg-secondary/30 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 transition-all duration-500"
                                style={{ width: `${runProgress}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70 mt-2">
                            Completed runs
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-card to-card/50 dark:from-card/40 dark:to-card/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-green-500/5 transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80">
                            Payslips
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-green-500 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold dark:text-foreground/90">{totalPayslips}</div>
                            <Badge variant="secondary" className="text-xs dark:bg-secondary/50 dark:text-secondary-foreground/90">
                                {reviewProgress}%
                            </Badge>
                        </div>
                        <div className="mt-2 h-2 w-full bg-secondary dark:bg-secondary/30 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 transition-all duration-500"
                                style={{ width: `${reviewProgress}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70 mt-2">
                            {reviewedPayslips} reviewed
                        </p>
                        {totalAmount > 0 && (
                            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-2">
                                Total: {formatCurrency(totalAmount)}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-card to-card/50 dark:from-card/40 dark:to-card/20 backdrop-blur-sm hover:shadow-lg dark:hover:shadow-purple-500/5 transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/80">
                            Pay Period
                        </CardTitle>
                        <div className="h-8 w-8 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold dark:text-foreground/90">
                            {Math.ceil((new Date(cycle.end_date).getTime() - new Date(cycle.start_date).getTime()) / (1000 * 60 * 60 * 24))+1}
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70 mt-2">
                            Days in period
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Enhanced Tabs with Dark Mode */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 bg-muted/50 dark:bg-muted/20 p-1 border border-border/40 dark:border-border/20">
                    <TabsTrigger 
                        value="overview"
                        className="data-[state=active]:bg-background dark:data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all dark:text-muted-foreground dark:data-[state=active]:text-foreground"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger 
                        value="audit"
                        className="data-[state=active]:bg-background dark:data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all dark:text-muted-foreground dark:data-[state=active]:text-foreground"
                    >
                        <span className="flex items-center gap-2">
                            Audit
                            {cycle.status === 'Draft' && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0 dark:bg-secondary/50">
                                    Start
                                </Badge>
                            )}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="runs" 
                        disabled={cycle.status === 'Draft'}
                        className="data-[state=active]:bg-background dark:data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all disabled:opacity-50 dark:text-muted-foreground dark:data-[state=active]:text-foreground"
                    >
                        <span className="flex items-center gap-2">
                            Execution
                            {cycle.status === 'Auditing' && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0 dark:bg-secondary/50">
                                    Next
                                </Badge>
                            )}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger 
                        value="review" 
                        disabled={!['Review', 'Finalized', 'Paid'].includes(cycle.status)}
                        className="data-[state=active]:bg-background dark:data-[state=active]:bg-background/80 data-[state=active]:shadow-sm transition-all disabled:opacity-50 dark:text-muted-foreground dark:data-[state=active]:text-foreground"
                    >
                        <span className="flex items-center gap-2">
                            Review
                            {cycle.status === 'Review' && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0 dark:bg-secondary/50">
                                    Active
                                </Badge>
                            )}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <div className="border-border/40 dark:border-border/20 rounded-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm border">
                    <TabsContent value="overview" className="m-0">
                        <OverviewTab 
                            cycle={cycle} 
                            onStatusChange={handleStatusChange}
                            onRefresh={() => fetchCycleDetails(true)}
                        />
                    </TabsContent>

                    <TabsContent value="audit" className="m-0">
                        <AuditTab 
                            cycleId={cycle.id} 
                            cycleStatus={cycle.status} 
                            onAuditRun={fetchCycleDetails}
                        />
                    </TabsContent>

                    <TabsContent value="runs" className="m-0">
                        <RunsTab 
                            cycleId={cycle.id} 
                            cycleStatus={cycle.status} 
                            groupRuns={cycle.runs} 
                            onExecute={fetchCycleDetails}
                        />
                    </TabsContent>

                    <TabsContent value="review" className="m-0">
                        <ReviewTab 
                            cycleId={cycle.id} 
                            cycleStatus={cycle.status} 
                            onStatusChange={fetchCycleDetails}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

// Export the currency formatter for use in child components
export { formatCurrency };
