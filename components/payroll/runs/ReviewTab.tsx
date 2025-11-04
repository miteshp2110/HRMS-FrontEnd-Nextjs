
"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
    getPayslipsForCycle, 
    getPayslipForReview, 
    updatePayslipStatus, 
    addManualAdjustment,
    bulkAddComponent,
    updatePayrollCycleStatus,
    type PayslipSummary,
    type PayslipDetails, 
    deletePayrollComponent,
    deleteComponentFromPayslip,
    getPayrollComponents
} from "@/lib/api";
import { 
    Eye, 
    Plus, 
    FileCheck, 
    Loader2, 
    Users, 
    DollarSign,
    CheckCircle2,
    AlertTriangle,
    Calculator,
    Edit,
    FileText,
    Briefcase,
    Clock,
    Percent,
    Hash,
    Landmark,
    Receipt,
    Gavel,
    Trash2,
    TrendingUp,
    TrendingDown,
    Sparkles,
    CalendarDays,
    ListChecks,
    FileSpreadsheet,
    UserCheck,
    Code,
    ArrowRight,
    Calendar,
    Download,
    Info,
    XCircle
} from "lucide-react";
import { ManualAdjustmentDialog } from "./ManualAdjustmentDialog";
import { generateDetailedPayslipPDF } from "@/lib/payslipPdfGenerator";

// Currency formatter for AED
const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numAmount);
};

// Date formatter
const formatDate = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleDateString('en-AE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
};

// DateTime formatter
const formatDateTime = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleString('en-AE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone:localStorage.getItem('selectedTimezone')??'UTC'
        });
    } catch {
        return dateString;
    }
};

const formatTimeToTimezone = (timeString: string): string => {
    try {
        const timeZone = localStorage.getItem('selectedTimezone') ?? 'UTC';

        // Combine today's date with given time as UTC
        const today = new Date().toISOString().split('T')[0]; // e.g. "2025-10-28"
        const utcDateTime = new Date(`${today}T${timeString}Z`); // 👈 interpret time as UTC

        // Convert and format for target timezone
        return utcDateTime.toLocaleString('en-AE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone,
        });
    } catch {
        return timeString;
    }
};

// Type for payslip component details
type PayslipComponentDetail = PayslipDetails['details'][0];

interface Props {
    cycleId: number;
    cycleStatus: string;
    onStatusChange: () => void;
    onExecute: () => void;
}

// Loading Skeletons
const TableRowSkeleton = () => (
    <TableRow className="hover:bg-transparent">
        <TableCell><Skeleton className="h-5 w-32 bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24 ml-auto bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24 ml-auto bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell><Skeleton className="h-5 w-28 ml-auto bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell><Skeleton className="h-6 w-16 rounded-full bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell>
            <div className="flex gap-2">
                <Skeleton className="h-8 w-16 bg-muted/50 dark:bg-muted/30" />
                <Skeleton className="h-8 w-32 bg-muted/50 dark:bg-muted/30" />
            </div>
        </TableCell>
    </TableRow>
);

const DetailsTableRowSkeleton = () => (
    <TableRow className="hover:bg-transparent">
        <TableCell><Skeleton className="h-4 w-28 bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell><Skeleton className="h-6 w-16 rounded-full bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20 ml-auto bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24 bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8 rounded mx-auto bg-muted/50 dark:bg-muted/30" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8 rounded mx-auto bg-muted/50 dark:bg-muted/30" /></TableCell>
    </TableRow>
);
function toIdNameMap(rows:any) {
  return rows.reduce((map:any, row:any) => {
    map[row.id] = row.name;
    return map;
  }, {});
}

export function ReviewTab({ cycleId, cycleStatus, onStatusChange ,onExecute}: Props) {
    const { toast } = useToast();
    const [payslips, setPayslips] = React.useState<PayslipSummary[]>([]);
    const [selectedPayslip, setSelectedPayslip] = React.useState<PayslipDetails | null>(null);
    const [showDetails, setShowDetails] = React.useState(false);
    const [showAdjustment, setShowAdjustment] = React.useState(false);
    const [showBulkAdd, setShowBulkAdd] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);
    const [processingId, setProcessingId] = React.useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const [isBulkAdding, setIsBulkAdding] = React.useState(false);
    const [deletingComponentId, setDeletingComponentId] = React.useState<number | null>(null);
    const [componentMap,setComponentMap] = React.useState<{}>({})
    
    // State for the calculation breakdown dialog
    const [showBreakdown, setShowBreakdown] = React.useState(false);
    const [selectedDetailForBreakdown, setSelectedDetailForBreakdown] = React.useState<PayslipComponentDetail | null>(null);

    // Bulk add form
    const [bulkForm, setBulkForm] = React.useState({
        component_name: '',
        component_type: 'earning' as 'earning' | 'deduction',
        amount: '',
        reason: ''
    });

    const fetchPayslips = React.useCallback(async () => {
        if (!['Review', 'Finalized', 'Paid'].includes(cycleStatus)) return;
        
        setIsLoading(true);
        try {
            const data = await getPayslipsForCycle(cycleId);
            setPayslips(data);
            const cmap = await getPayrollComponents()
            setComponentMap(toIdNameMap(cmap))
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load payslips.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [cycleId, cycleStatus, toast]);

    React.useEffect(() => {
        fetchPayslips();
    }, [fetchPayslips]);

    const handleViewDetails = async (payslipId: number) => {
        setIsLoadingDetails(true);
        try {
            const details = await getPayslipForReview(payslipId);
            setSelectedPayslip(details);
            setShowDetails(true);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load payslip details.", variant: "destructive" });
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleStatusUpdate = async (payslipId: number, newStatus: 'Reviewed') => {
        setProcessingId(payslipId);
        try {
            await updatePayslipStatus(payslipId, newStatus);
            toast({ title: "Success", description: `Payslip marked as ${newStatus}.` });
            await fetchPayslips();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to update status: ${error.message}`, variant: "destructive" });
        } finally {
            setProcessingId(null);
        }
    };

    const handleBulkAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsBulkAdding(true);
        
        try {
            await bulkAddComponent(cycleId, {
                component_name: bulkForm.component_name,
                component_type: bulkForm.component_type,
                amount: parseFloat(bulkForm.amount),
                reason: bulkForm.reason
            });

            if(cycleStatus === 'Finalized'){
                await updatePayrollCycleStatus(cycleId,'Review')
            }

            toast({ title: "Success", description: "Bulk component added to all payslips." });
            setShowBulkAdd(false);
            setBulkForm({ component_name: '', component_type: 'earning', amount: '', reason: '' });
            await onExecute()
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to add bulk component: ${error.message}`, variant: "destructive" });
        } finally {
            setIsBulkAdding(false);
        }
    };

    const handleTransitionToReview = async () => {
        setIsTransitioning(true);
        try {
            await updatePayrollCycleStatus(cycleId, 'Review');
            toast({ title: "Success", description: "Moved to review phase. Payslips generated!" });
            onStatusChange();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to transition: ${error.message}`, variant: "destructive" });
        } finally {
            setIsTransitioning(false);
        }
    };

    const handleFinalizeCycle = async () => {
        const unreviewed = payslips.filter(p => p.status === 'Draft').length;
        if (unreviewed > 0) {
            toast({ 
                title: "Cannot Finalize", 
                description: `${unreviewed} payslips are still in Draft status.`,
                variant: "destructive" 
            });
            return;
        }

        if (!confirm('Are you sure you want to finalize this payroll cycle? This action cannot be undone.')) {
            return;
        }

        setIsTransitioning(true);
        try {
            await updatePayrollCycleStatus(cycleId, 'Finalized');
            toast({ title: "Success", description: "Payroll cycle finalized successfully!" });
            onStatusChange();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to finalize: ${error.message}`, variant: "destructive" });
        } finally {
            setIsTransitioning(false);
        }
    };

    const handleDeleteComponent = async (payslipId: number, componentId: number) => {
        if (!confirm('Are you sure you want to delete this component?')) return;
        
        setDeletingComponentId(componentId);
        try {
            await deleteComponentFromPayslip(payslipId, componentId);
            toast({ title: "Success", description: "Component deleted successfully" });
            await handleViewDetails(payslipId);
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to delete component: ${error.message}`, variant: "destructive" });
        } finally {
            setDeletingComponentId(null);
        }
    };

    const handleDownload = () => {
            try{
    
                generateDetailedPayslipPDF(selectedPayslip!,componentMap)
                toast({
                title: "Download Started",
                description: "Generating your payslip PDF..."
                });
            }
            catch(err){
                toast({
                variant:"destructive",
                title: "Download Failed",
                description: "Failed to generate payslip PDF..."
            });
            }
            // Implement PDF download logic here
        };
    



    // Calculate statistics
    const reviewedCount = payslips.filter(p => p.status === 'Reviewed').length;
    const draftCount = payslips.filter(p => p.status === 'Draft').length;
    const totalPayslips = payslips.length;
    const progressPercentage = totalPayslips > 0 ? (reviewedCount / totalPayslips) * 100 : 0;
    
    const totalGrossEarnings = payslips.reduce((sum, p) => sum + parseFloat(p.gross_earnings), 0);
    const totalDeductions = payslips.reduce((sum, p) => sum + parseFloat(p.total_deductions), 0);
    const totalNetPay = payslips.reduce((sum, p) => sum + parseFloat(p.net_pay), 0);

    const canFinalize = totalPayslips > 0 && reviewedCount === totalPayslips && cycleStatus === 'Review';
    const canTransition = cycleStatus === 'Auditing';

    return (
        <div className="space-y-6 p-6">
            {/* Review Header */}
            <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-card to-card/50 dark:from-card/40 dark:to-card/20 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg transition-all hover:scale-110 duration-300">
                                <FileCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <CardTitle className="dark:text-foreground/90">Payslip Review & Finalization</CardTitle>
                                <CardDescription className="dark:text-muted-foreground/80">
                                    Review individual payslips, make adjustments, and finalize the cycle
                                </CardDescription>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {canTransition && (
                                <Button 
                                    onClick={handleTransitionToReview}
                                    disabled={isTransitioning}
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 transition-all duration-300"
                                >
                                    {isTransitioning ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Generate Payslips
                                        </>
                                    )}
                                </Button>
                            )}
                            
                            {cycleStatus !== 'Paid' && (
                                <>
                                    <Button 
                                        onClick={() => setShowBulkAdd(true)} 
                                        variant="outline"
                                        className="gap-2 dark:border-border/40 dark:hover:bg-accent/30 transition-all duration-300"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Bulk Add
                                    </Button>
                                    <Button 
                                        onClick={handleFinalizeCycle}
                                        disabled={!canFinalize || isTransitioning}
                                        className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {isTransitioning ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <FileCheck className="w-4 h-4" />
                                        )}
                                        Finalize Cycle ({reviewedCount}/{totalPayslips})
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                
                {totalPayslips > 0 && (
                    <CardContent>
                        <div className="space-y-4">
                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-2 dark:text-foreground/80">
                                    <span className="font-medium">Review Progress</span>
                                    <span className="font-semibold">{reviewedCount}/{totalPayslips} payslips reviewed</span>
                                </div>
                                <Progress value={progressPercentage} className="h-3 transition-all duration-500" />
                            </div>

                            {/* Status Alert */}
                            {draftCount > 0 ? (
                                <Alert className="border-yellow-200 dark:border-yellow-800/40 bg-yellow-50 dark:bg-yellow-900/20 animate-in fade-in duration-500">
                                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                                    <AlertDescription className="dark:text-yellow-200">
                                        <strong>{draftCount} payslips</strong> are still in Draft status and need review before finalization.
                                    </AlertDescription>
                                </Alert>
                            ) : reviewedCount === totalPayslips ? (
                                <Alert className="border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/20 animate-in fade-in duration-500">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <AlertDescription className="text-green-800 dark:text-green-200">
                                        All payslips have been reviewed! Ready for finalization.
                                    </AlertDescription>
                                </Alert>
                            ) : null}

                            {/* Financial Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-muted/50 to-muted/30 dark:from-muted/20 dark:to-muted/10 rounded-lg border border-border/40 dark:border-border/20">
                                <div className="text-center space-y-1 p-3 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                                        <TrendingUp className="w-4 h-4" />
                                        Total Gross Earnings
                                    </div>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(totalGrossEarnings)}
                                    </div>
                                </div>
                                <div className="text-center space-y-1 p-3 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                                        <TrendingDown className="w-4 h-4" />
                                        Total Deductions
                                    </div>
                                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {formatCurrency(totalDeductions)}
                                    </div>
                                </div>
                                <div className="text-center space-y-1 p-3 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                                        <DollarSign className="w-4 h-4" />
                                        Total Net Pay
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {formatCurrency(totalNetPay)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Payslips Table */}
            {cycleStatus !== 'Review' && cycleStatus !== 'Finalized' && cycleStatus !== 'Paid' ? (
                <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                    <CardContent className="flex items-center justify-center h-64">
                        <div className="text-center space-y-4">
                            {canTransition ? (
                                <>
                                    <div className="flex justify-center">
                                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-6 animate-pulse">
                                            <Users className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold dark:text-foreground/90">Ready to Generate Payslips</h3>
                                    <p className="text-muted-foreground dark:text-muted-foreground/80 max-w-md">
                                        All payroll runs have been completed. Generate payslips to start the review process.
                                    </p>
                                    <Button 
                                        onClick={handleTransitionToReview}
                                        disabled={isTransitioning}
                                        className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 mt-4"
                                    >
                                        {isTransitioning ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Generating Payslips...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-4 h-4" />
                                                Generate Payslips
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-center">
                                        <div className="rounded-full bg-muted dark:bg-muted/30 p-6">
                                            <AlertTriangle className="w-16 h-16 text-muted-foreground dark:text-muted-foreground/70" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground dark:text-foreground/90">Complete Previous Steps</h3>
                                    <p className="text-muted-foreground dark:text-muted-foreground/80">
                                        Complete audit and execution phases before reviewing payslips.
                                    </p>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center dark:text-foreground/90">
                            <Users className="w-5 h-5 mr-2" />
                            Payslips ({totalPayslips})
                        </CardTitle>
                        <CardDescription className="dark:text-muted-foreground/80">
                            Review individual payslips and mark them as reviewed
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent dark:border-border/20">
                                        <TableHead className="dark:text-muted-foreground/80">Employee</TableHead>
                                        <TableHead className="text-right dark:text-muted-foreground/80">Gross Earnings</TableHead>
                                        <TableHead className="text-right dark:text-muted-foreground/80">Deductions</TableHead>
                                        <TableHead className="text-right dark:text-muted-foreground/80">Net Pay</TableHead>
                                        <TableHead className="dark:text-muted-foreground/80">Status</TableHead>
                                        <TableHead className="w-48 dark:text-muted-foreground/80">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...Array(5)].map((_, index) => (
                                        <TableRowSkeleton key={index} />
                                    ))}
                                </TableBody>
                            </Table>
                        ) : payslips.length === 0 ? (
                            <div className="text-center py-12 space-y-4">
                                <div className="flex justify-center">
                                    <div className="rounded-full bg-muted dark:bg-muted/30 p-6">
                                        <FileText className="w-16 h-16 text-muted-foreground dark:text-muted-foreground/70" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold dark:text-foreground/90">No Payslips Found</h3>
                                <p className="text-muted-foreground dark:text-muted-foreground/80">
                                    No payslips have been generated for this cycle yet.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent dark:border-border/20">
                                        <TableHead className="dark:text-muted-foreground/80">Employee</TableHead>
                                        <TableHead className="text-right dark:text-muted-foreground/80">Gross Earnings</TableHead>
                                        <TableHead className="text-right dark:text-muted-foreground/80">Deductions</TableHead>
                                        <TableHead className="text-right dark:text-muted-foreground/80">Net Pay</TableHead>
                                        <TableHead className="dark:text-muted-foreground/80">Status</TableHead>
                                        <TableHead className="w-48 dark:text-muted-foreground/80">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payslips.map((payslip) => (
                                        <TableRow 
                                            key={payslip.id} 
                                            className="hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors duration-200 dark:border-border/20"
                                        >
                                            <TableCell className="font-medium dark:text-foreground/90">{payslip.employee_name}</TableCell>
                                            <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(payslip.gross_earnings)}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-red-600 dark:text-red-400">
                                                {formatCurrency(payslip.total_deductions)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">
                                                {formatCurrency(payslip.net_pay)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={payslip.status === 'Reviewed' ? 'default' : 'secondary'}
                                                    className="dark:bg-secondary/50 dark:text-secondary-foreground/90"
                                                >
                                                    {payslip.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewDetails(payslip.id)}
                                                        className="gap-1 dark:border-border/40 dark:hover:bg-accent/30 transition-all duration-200"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        View
                                                    </Button>
                                                    {payslip.status === 'Draft' && cycleStatus === 'Review' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleStatusUpdate(payslip.id, 'Reviewed')}
                                                            disabled={processingId === payslip.id}
                                                            className="gap-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 transition-all duration-200"
                                                        >
                                                            {processingId === payslip.id ? (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                    Mark Reviewed
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Payslip Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="!max-w-6xl w-[90vw] max-h-[85vh] overflow-y-auto dark:bg-card/95 dark:border-border/20">
                    <DialogHeader>
                        <DialogTitle className="dark:text-foreground/90">
                            Payslip Details - {selectedPayslip?.employee_name}
                        </DialogTitle>
                        <DialogDescription className="dark:text-muted-foreground/80">
                            {selectedPayslip?.cycle_name} 
                        </DialogDescription>
                    </DialogHeader>
                    
                    {isLoadingDetails ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 p-4 border dark:border-border/20 rounded">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24 bg-muted/50 dark:bg-muted/30" />
                                    <Skeleton className="h-6 w-32 bg-muted/50 dark:bg-muted/30" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24 bg-muted/50 dark:bg-muted/30" />
                                    <Skeleton className="h-6 w-32 bg-muted/50 dark:bg-muted/30" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20 bg-muted/50 dark:bg-muted/30" />
                                    <Skeleton className="h-7 w-36 bg-muted/50 dark:bg-muted/30" />
                                </div>
                            </div>
                            <div>
                                <Skeleton className="h-6 w-40 mb-4 bg-muted/50 dark:bg-muted/30" />
                                <Table>
                                    <TableHeader>
                                        <TableRow className="dark:border-border/20">
                                            <TableHead className="dark:text-muted-foreground/80">Component</TableHead>
                                            <TableHead className="dark:text-muted-foreground/80">Type</TableHead>
                                            <TableHead className="text-right dark:text-muted-foreground/80">Amount</TableHead>
                                            <TableHead className="dark:text-muted-foreground/80">Source</TableHead>
                                            <TableHead className="text-center dark:text-muted-foreground/80">Breakdown</TableHead>
                                            <TableHead className="text-center dark:text-muted-foreground/80">Delete</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[...Array(5)].map((_, index) => (
                                            <DetailsTableRowSkeleton key={index} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ) : selectedPayslip && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 p-4 border dark:border-border/20 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 dark:from-muted/10 dark:to-muted/5">
                                <div>
                                    <Label className="text-sm font-medium dark:text-muted-foreground/80">Gross Earnings</Label>
                                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                        {formatCurrency(selectedPayslip.gross_earnings)}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium dark:text-muted-foreground/80">Total Deductions</Label>
                                    <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                                        {formatCurrency(selectedPayslip.total_deductions)}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium dark:text-muted-foreground/80">Net Pay</Label>
                                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        {formatCurrency(selectedPayslip.net_pay)}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-3 dark:text-foreground/90">Component Details</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="dark:border-border/20">
                                            <TableHead className="dark:text-muted-foreground/80">Component</TableHead>
                                            <TableHead className="dark:text-muted-foreground/80">Type</TableHead>
                                            <TableHead className="text-right dark:text-muted-foreground/80">Amount</TableHead>
                                            <TableHead className="dark:text-muted-foreground/80">Source</TableHead>
                                            <TableHead className="text-center dark:text-muted-foreground/80">Breakdown</TableHead>
                                            <TableHead className="text-center dark:text-muted-foreground/80">Delete</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedPayslip.details.map((detail) => (
                                            <TableRow 
                                                key={detail.id}
                                                className="hover:bg-accent/50 dark:hover:bg-accent/20 transition-colors duration-200 dark:border-border/20"
                                            >
                                                <TableCell className="font-medium dark:text-foreground/90">{detail.component_name}</TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={detail.component_type === 'earning' ? 'default' : 'destructive'}
                                                        className="dark:bg-opacity-80"
                                                    >
                                                        {detail.component_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold dark:text-foreground/90">
                                                    {formatCurrency(detail.amount)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground dark:text-muted-foreground/70">
                                                    {detail.group_name}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {detail.calculation_breakdown && (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setSelectedDetailForBreakdown(detail);
                                                                setShowBreakdown(true);
                                                            }}
                                                            className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                                                        >
                                                            <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        disabled={cycleStatus === 'Paid' || deletingComponentId === detail.id}
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteComponent(selectedPayslip.id, detail.id)}
                                                        className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                                                    >
                                                        {deletingComponentId === detail.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin text-red-600 dark:text-red-400" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button 
                            onClick={() => handleDownload()}
                            className="dark:bg-green-300"
                        >
                            <Download />
                        </Button>
                        {selectedPayslip?.status !== 'Finalized' && cycleStatus != 'Paid' && (
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setShowAdjustment(true);
                                    setShowDetails(false);
                                }}
                                className="gap-2 dark:border-border/40 dark:hover:bg-accent/30"
                            >
                                <Edit className="w-4 h-4" />
                                Add Adjustment
                            </Button>
                        )}
                        <Button 
                            onClick={() => setShowDetails(false)}
                            className="dark:bg-primary/90"
                        >
                            Close
                        </Button>
                        
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Manual Adjustment Dialog */}
            {selectedPayslip && (
                <ManualAdjustmentDialog
                    onExecute={onExecute}
                    open={showAdjustment}
                    onOpenChange={(open) => {
                        setShowAdjustment(open);
                        if (!open) {
                            setShowDetails(true);
                        }
                    }}
                    onSuccess={async () => {
                        await fetchPayslips();
                        if (selectedPayslip) {
                            const updatedDetails = await getPayslipForReview(selectedPayslip.id);
                            setSelectedPayslip(updatedDetails);
                        }
                    }}
                    payslipId={selectedPayslip.id}
                />
            )}
            
            {/* Calculation Breakdown Dialog */}
            {selectedDetailForBreakdown && (
                <CalculationBreakdownDialog
                    componentMap={componentMap}
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    detail={selectedDetailForBreakdown}
                />
            )}

            {/* Bulk Add Dialog */}
            <Dialog open={showBulkAdd} onOpenChange={setShowBulkAdd}>
                <DialogContent className="dark:bg-card/95 dark:border-border/20">
                    <DialogHeader>
                        <DialogTitle className="flex items-center dark:text-foreground/90">
                            <Calculator className="w-5 h-5 mr-2" />
                            Bulk Add Component
                        </DialogTitle>
                        <DialogDescription className="dark:text-muted-foreground/80">
                            Add the same component to all payslips in this cycle.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleBulkAdd} className="space-y-4">
                        <div>
                            <Label htmlFor="bulk_component_name" className="dark:text-foreground/90">Component Name</Label>
                            <Input
                                id="bulk_component_name"
                                value={bulkForm.component_name}
                                onChange={(e) => setBulkForm(prev => ({ ...prev, component_name: e.target.value }))}
                                placeholder="e.g., Festival Bonus"
                                required
                                className="dark:bg-background/50 dark:border-border/40"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="bulk_component_type" className="dark:text-foreground/90">Type</Label>
                            <Select
                                value={bulkForm.component_type}
                                onValueChange={(value: 'earning' | 'deduction') => 
                                    setBulkForm(prev => ({ ...prev, component_type: value }))
                                }
                            >
                                <SelectTrigger className="dark:bg-background/50 dark:border-border/40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-card dark:border-border/20">
                                    <SelectItem value="earning">Earning</SelectItem>
                                    <SelectItem value="deduction">Deduction</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <Label htmlFor="bulk_amount" className="dark:text-foreground/90">Amount (AED)</Label>
                            <Input
                                id="bulk_amount"
                                type="number"
                                step="0.01"
                                value={bulkForm.amount}
                                onChange={(e) => setBulkForm(prev => ({ ...prev, amount: e.target.value }))}
                                placeholder="0.00"
                                required
                                className="dark:bg-background/50 dark:border-border/40"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="bulk_reason" className="dark:text-foreground/90">Reason</Label>
                            <Textarea
                                id="bulk_reason"
                                value={bulkForm.reason}
                                onChange={(e) => setBulkForm(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Reason for this bulk addition..."
                                className="dark:bg-background/50 dark:border-border/40"
                            />
                        </div>
                        
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowBulkAdd(false)}
                                className="dark:border-border/40 dark:hover:bg-accent/30"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isBulkAdding}
                                className="gap-2 dark:bg-primary/90"
                            >
                                {isBulkAdding && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isBulkAdding ? 'Adding...' : 'Add to All Payslips'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Helper component for info rows in breakdown dialogs
const InfoRow = ({ label, value, isCode = false, icon }: { label: string; value?: React.ReactNode; isCode?: boolean; icon?: React.ReactNode }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex justify-between items-start py-2.5 border-b dark:border-border/20 last:border-b-0 group hover:bg-muted/20 dark:hover:bg-muted/10 px-2 -mx-2 rounded transition-colors">
            <div className="flex items-center gap-2">
                {icon && <span className="text-muted-foreground dark:text-muted-foreground/70">{icon}</span>}
                <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 font-medium">{label}</p>
            </div>
            {isCode ? (
                <code className="text-sm font-mono text-foreground dark:text-foreground/90 bg-muted dark:bg-muted/30 px-3 py-1 rounded-md text-right max-w-md break-all">
                    {value}
                </code>
            ) : (
                <p className="text-sm font-medium text-foreground dark:text-foreground/90 text-right max-w-md">{value}</p>
            )}
        </div>
    );
};


// Calculation Breakdown Dialog
interface BreakdownDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    detail: PayslipComponentDetail;
    componentMap:any
}

const CalculationBreakdownDialog = ({ open, onOpenChange, detail,componentMap }: BreakdownDialogProps) => {
    const breakdown = detail.calculation_breakdown;

    

    const renderContent = async() => {
        if (!breakdown) {
            return (
                <div className="text-center py-12 space-y-3">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-muted dark:bg-muted/30 p-4">
                            <AlertTriangle className="w-12 h-12 text-muted-foreground dark:text-muted-foreground/70" />
                        </div>
                    </div>
                    <p className="text-muted-foreground dark:text-muted-foreground/70">
                        No calculation breakdown available for this component.
                    </p>
                </div>
            );
        }

        // Manual Adjustment
        if (breakdown.source === "Manual Adjustment" || breakdown.component_type === "manual" || breakdown.source === "Bulk Manual Adjustment") {
            return <ManualAdjustmentBreakdown breakdown={breakdown} />;
        }

        // Hours-based Prorated (Base Salary)
        if (breakdown.calculation_method === "Hours-based Prorated Calculation") {
            return <BaseSalaryBreakdown breakdown={breakdown} />;
        }

        // Percentage Based
        if (breakdown.calculation_type === "Percentage Based") {
            return <PercentageBreakdown breakdown={breakdown} />;
        }

        // Fixed Amount Prorated
        if (breakdown.calculation_type === "Fixed Amount Prorated") {
            return <FixedProratedBreakdown breakdown={breakdown} />;
        }
        if (breakdown.prorated_for_attendance === true) {
            return <PercentageProratedBreakdown breakdown={breakdown}/>
        }

        // Custom Formula
        if (breakdown.calculation_type === "Custom Formula") {
            
             
            return <FormulaBreakdown breakdown={breakdown} componentMap={componentMap} />;
        }

        // Overtime
        if (breakdown.source === "Employee Salary Structure" && breakdown.overtime_details) {
            return <OvertimeBreakdown breakdown={breakdown} />;
        }

        // HR Case
        if (breakdown.source === "HR Case Management System") {
            return <HrCaseBreakdown breakdown={breakdown} />;
        }

        // Expense Reimbursement
        if (breakdown.source === "Expense Management System") {
            return <ExpenseReimbursementBreakdown breakdown={breakdown} />;
        }

        // Loan EMI
        if (breakdown.source === "Loan Management System") {
            return <LoanBreakdown breakdown={breakdown} />;
        }

        // Error/Unknown
        if (breakdown.error) {
            return <ErrorBreakdown breakdown={breakdown} />;
        }

        // Fallback - raw JSON
        return (
            <div className="space-y-3">
                <Alert className="border-yellow-200 dark:border-yellow-800/40 bg-yellow-50 dark:bg-yellow-900/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                    <AlertDescription className="dark:text-yellow-200 text-sm">
                        Unknown breakdown format. Displaying raw data below.
                    </AlertDescription>
                </Alert>
                <pre className="text-xs bg-muted dark:bg-muted/30 p-4 rounded-md overflow-x-auto dark:text-foreground/80 border dark:border-border/20">
                    {JSON.stringify(breakdown, null, 2)}
                </pre>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto dark:bg-card/95 dark:border-border/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 dark:text-foreground/90">
                        <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Calculation Breakdown: {detail.component_name}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 dark:text-muted-foreground/80">
                        <FileSpreadsheet className="w-4 h-4" />
                        Source: {breakdown?.source || "N/A"}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {renderContent()}
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="dark:bg-primary/90">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// ==================== BREAKDOWN COMPONENTS ====================

// Manual Adjustment Breakdown
const ManualAdjustmentBreakdown = ({ breakdown }: { breakdown: any }) => (
    <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-purple-50/50 to-card dark:from-purple-900/10 dark:to-card/50">
        <CardHeader className="flex-row items-center space-x-3 pb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Edit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
                <h4 className="font-semibold dark:text-foreground/90">Manual Adjustment</h4>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                    Manually added by administrator
                </p>
            </div>
        </CardHeader>
        <CardContent className="space-y-1">
            <InfoRow 
                label="Reason" 
                value={breakdown.reason || "No reason provided"} 
                icon={<FileText className="w-4 h-4" />}
            />
            <InfoRow 
                label="Adjusted By" 
                value={`User ID: ${breakdown.adjusted_by??breakdown.added_by}`} 
                icon={<UserCheck className="w-4 h-4" />}
            />
            <InfoRow 
                label="Timestamp" 
                value={breakdown.timestamp ? formatDateTime(breakdown.timestamp) : "N/A"} 
                icon={<Clock className="w-4 h-4" />}
            />
            <InfoRow 
                label="Component Type" 
                value={breakdown.component_type || "manual"} 
            />
        </CardContent>
    </Card>
);

// Base Salary (Hours-based Prorated) Breakdown
// const BaseSalaryBreakdown = ({ breakdown }: { breakdown: any }) => (
//     <div className="space-y-4">
//         <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
//             <CardHeader className="flex-row items-center space-x-3 pb-3">
//                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                     <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <div>
//                     <h4 className="font-semibold dark:text-foreground/90">Base Salary Structure</h4>
//                     <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
//                         Monthly salary configuration
//                     </p>
//                 </div>
//             </CardHeader>
//             <CardContent className="space-y-1">
//                 <InfoRow 
//                     label="Monthly Amount" 
//                     value={formatCurrency(breakdown.base_salary_structure?.monthly_amount || 0)} 
//                     icon={<DollarSign className="w-4 h-4" />}
//                 />
//                 <InfoRow 
//                     label="Calculation Type" 
//                     value={breakdown.base_salary_structure?.calculation_type || "N/A"} 
//                 />
//                 <InfoRow 
//                     label="Component ID" 
//                     value={breakdown.base_salary_structure?.component_id} 
//                 />
//             </CardContent>
//         </Card>

//         <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
//             <CardHeader className="flex-row items-center space-x-3 pb-3">
//                 <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
//                     <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
//                 </div>
//                 <div>
//                     <h4 className="font-semibold dark:text-foreground/90">Period Details</h4>
//                     <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
//                         Payroll cycle information
//                     </p>
//                 </div>
//             </CardHeader>
//             <CardContent className="space-y-1">
//                 <InfoRow 
//                     label="Start Date" 
//                     value={formatDate(breakdown.period_details?.start_date)} 
//                     icon={<Clock className="w-4 h-4" />}
//                 />
//                 <InfoRow 
//                     label="End Date" 
//                     value={formatDate(breakdown.period_details?.end_date)} 
//                     icon={<Clock className="w-4 h-4" />}
//                 />
//                 <InfoRow 
//                     label="Total Days in Period" 
//                     value={breakdown.period_details?.total_days_in_period} 
//                     icon={<Hash className="w-4 h-4" />}
//                 />
//             </CardContent>
//         </Card>

//         <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
//             <CardHeader className="flex-row items-center space-x-3 pb-3">
//                 <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
//                     <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
//                 </div>
//                 <div>
//                     <h4 className="font-semibold dark:text-foreground/90">Rate Calculations</h4>
//                     <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
//                         Daily and hourly rate breakdown
//                     </p>
//                 </div>
//             </CardHeader>
//             <CardContent className="space-y-1">
//                 <InfoRow 
//                     label="Daily Rate" 
//                     value={formatCurrency(breakdown.rate_calculations?.daily_rate || 0)} 
//                     icon={<DollarSign className="w-4 h-4" />}
//                 />
//                 <InfoRow 
//                     label="Daily Rate Formula" 
//                     value={breakdown.rate_calculations?.daily_rate_formula} 
//                     isCode 
//                 />
//                 <InfoRow 
//                     label="Hourly Rate" 
//                     value={formatCurrency(breakdown.rate_calculations?.hourly_rate || 0)} 
//                     icon={<DollarSign className="w-4 h-4" />}
//                 />
//                 <InfoRow 
//                     label="Hourly Rate Formula" 
//                     value={breakdown.rate_calculations?.hourly_rate_formula} 
//                     isCode 
//                 />
//             </CardContent>
//         </Card>

//         {breakdown.shift_details && (
//             <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
//                 <CardHeader className="flex-row items-center space-x-3 pb-3">
//                     <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
//                         <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
//                     </div>
//                     <div>
//                         <h4 className="font-semibold dark:text-foreground/90">Shift Details</h4>
//                         <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
//                             Employee work schedule
//                         </p>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="space-y-1">
//                     <InfoRow 
//                         label="Shift Name" 
//                         value={breakdown.shift_details.shift_name} 
//                     />
//                     <InfoRow 
//                         label="Scheduled Hours" 
//                         value={`${breakdown.shift_details.scheduled_hours} hours/day`} 
//                         icon={<Clock className="w-4 h-4" />}
//                     />
//                     <InfoRow 
//                         label="From Time" 
//                         value={formatTimeToTimezone(breakdown.shift_details.from_time)} 
//                     />
//                     <InfoRow 
//                         label="To Time" 
//                         value={formatTimeToTimezone(breakdown.shift_details.to_time)} 
//                     />
//                 </CardContent>
//             </Card>
//         )}

//         {breakdown.attendance_analysis && (
//             <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
//                 <CardHeader className="flex-row items-center space-x-3 pb-3">
//                     <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                         <ListChecks className="w-5 h-5 text-green-600 dark:text-green-400" />
//                     </div>
//                     <div>
//                         <h4 className="font-semibold dark:text-foreground/90">Attendance Analysis</h4>
//                         <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
//                             Actual work hours and attendance
//                         </p>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="space-y-1">
//                     <InfoRow 
//                         label="Total Regular Hours" 
//                         value={`${breakdown.attendance_analysis.total_regular_hours} hrs`} 
//                         icon={<Clock className="w-4 h-4" />}
//                     />
//                     <InfoRow 
//                         label="Total Worked Hours" 
//                         value={`${breakdown.attendance_analysis.total_worked_hours} hrs`} 
//                         icon={<Clock className="w-4 h-4" />}
//                     />
//                     <InfoRow 
//                         label="Days Worked" 
//                         value={breakdown.attendance_analysis.days_worked} 
//                     />
//                     <InfoRow 
//                         label="Present Days" 
//                         value={breakdown.attendance_analysis.present_days} 
//                         icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
//                     />
//                     <InfoRow 
//                         label="Half Days" 
//                         value={breakdown.attendance_analysis.half_days} 
//                     />
//                     <InfoRow 
//                         label="Leave Days" 
//                         value={breakdown.attendance_analysis.leave_days} 
//                     />
//                     <InfoRow 
//                         label="Absent Days" 
//                         value={breakdown.attendance_analysis.absent_days} 
//                         icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
//                     />
//                 </CardContent>
//             </Card>
//         )}

//         <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-green-50/50 to-card dark:from-green-900/10 dark:to-card/50">
//             <CardHeader className="flex-row items-center space-x-3 pb-3">
//                 <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                     <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
//                 </div>
//                 <div>
//                     <h4 className="font-semibold dark:text-foreground/90">Final Calculation</h4>
//                     <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
//                         Prorated salary amount
//                     </p>
//                 </div>
//             </CardHeader>
//             <CardContent className="space-y-1">
//                 <InfoRow 
//                     label="Formula" 
//                     value={breakdown.final_calculation?.formula} 
//                     isCode 
//                 />
//                 <InfoRow 
//                     label="Regular Hours Worked" 
//                     value={`${breakdown.final_calculation?.regular_hours_worked} hrs`} 
//                     icon={<Clock className="w-4 h-4" />}
//                 />
//                 <InfoRow 
//                     label="Computed Amount" 
//                     value={formatCurrency(breakdown.final_calculation?.computed_amount || 0)} 
//                     icon={<DollarSign className="w-4 h-4" />}
//                 />
//             </CardContent>
//         </Card>
//     </div>
// );

const BaseSalaryBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        {breakdown.source && (
            <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-purple-50/50 to-card dark:from-purple-900/10 dark:to-card/50">
                <CardHeader className="flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold dark:text-foreground/90">Calculation Source</h4>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                            Data origin and method
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1">
                    <InfoRow 
                        label="Source" 
                        value={breakdown.source} 
                    />
                    {breakdown.calculation_method && (
                        <InfoRow 
                            label="Calculation Method" 
                            value={breakdown.calculation_method} 
                        />
                    )}
                </CardContent>
            </Card>
        )}

        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">Base Salary Structure</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Monthly salary configuration
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Monthly Amount" 
                    value={formatCurrency(breakdown.base_salary_structure?.monthly_amount || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Calculation Type" 
                    value={breakdown.base_salary_structure?.calculation_type || "N/A"} 
                />
                <InfoRow 
                    label="Component ID" 
                    value={breakdown.base_salary_structure?.component_id} 
                />
            </CardContent>
        </Card>

        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">Period Details</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Payroll cycle information
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Start Date" 
                    value={formatDate(breakdown.period_details?.start_date)} 
                    icon={<Clock className="w-4 h-4" />}
                />
                <InfoRow 
                    label="End Date" 
                    value={formatDate(breakdown.period_details?.end_date)} 
                    icon={<Clock className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Total Days in Period" 
                    value={breakdown.period_details?.total_days_in_period} 
                    icon={<Hash className="w-4 h-4" />}
                />
                {breakdown.period_details?.working_days_only !== undefined && (
                    <InfoRow 
                        label="Working Days Only" 
                        value={breakdown.period_details.working_days_only} 
                        icon={<CalendarDays className="w-4 h-4" />}
                    />
                )}
                {breakdown.period_details?.excluded_days !== undefined && (
                    <InfoRow 
                        label="Excluded Days" 
                        value={breakdown.period_details.excluded_days} 
                        icon={<XCircle className="w-4 h-4 text-orange-600" />}
                    />
                )}
                {breakdown.period_details?.excluded_days_note && (
                    <div className="pt-2">
                        <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                            <Info className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            <AlertDescription className="text-xs">
                                {breakdown.period_details.excluded_days_note}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Calculator className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">Rate Calculations</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Daily and hourly rate breakdown
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Daily Rate" 
                    value={formatCurrency(breakdown.rate_calculations?.daily_rate || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Daily Rate Formula" 
                    value={breakdown.rate_calculations?.daily_rate_formula} 
                    isCode 
                />
                <InfoRow 
                    label="Hourly Rate" 
                    value={formatCurrency(breakdown.rate_calculations?.hourly_rate || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Hourly Rate Formula" 
                    value={breakdown.rate_calculations?.hourly_rate_formula} 
                    isCode 
                />
            </CardContent>
        </Card>

        {breakdown.shift_details && (
            <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                <CardHeader className="flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                        <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold dark:text-foreground/90">Shift Details</h4>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                            Employee work schedule
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1">
                    <InfoRow 
                        label="Shift Name" 
                        value={breakdown.shift_details.shift_name} 
                    />
                    <InfoRow 
                        label="Scheduled Hours" 
                        value={`${breakdown.shift_details.scheduled_hours} hours/day`} 
                        icon={<Clock className="w-4 h-4" />}
                    />
                    <InfoRow 
                        label="From Time" 
                        value={formatTimeToTimezone(breakdown.shift_details.from_time)} 
                    />
                    <InfoRow 
                        label="To Time" 
                        value={formatTimeToTimezone(breakdown.shift_details.to_time)} 
                    />
                </CardContent>
            </Card>
        )}

        {breakdown.attendance_analysis && (
            <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                <CardHeader className="flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <ListChecks className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold dark:text-foreground/90">Attendance Analysis</h4>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                            Actual work hours and attendance
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1">
                    <InfoRow 
                        label="Total Regular Hours" 
                        value={`${breakdown.attendance_analysis.total_regular_hours} hrs`} 
                        icon={<Clock className="w-4 h-4" />}
                    />
                    <InfoRow 
                        label="Total Worked Hours" 
                        value={`${breakdown.attendance_analysis.total_worked_hours} hrs`} 
                        icon={<Clock className="w-4 h-4" />}
                    />
                    {breakdown.attendance_analysis.leave_hours_paid !== undefined && (
                        <InfoRow 
                            label="Leave Hours Paid" 
                            value={`${breakdown.attendance_analysis.leave_hours_paid} hrs`} 
                            icon={<Clock className="w-4 h-4 text-blue-600" />}
                        />
                    )}
                    <InfoRow 
                        label="Days Worked" 
                        value={breakdown.attendance_analysis.days_worked} 
                    />
                    <InfoRow 
                        label="Present Days" 
                        value={breakdown.attendance_analysis.present_days} 
                        icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
                    />
                    <InfoRow 
                        label="Half Days" 
                        value={breakdown.attendance_analysis.half_days} 
                    />
                    <InfoRow 
                        label="Leave Days" 
                        value={breakdown.attendance_analysis.leave_days} 
                    />
                    <InfoRow 
                        label="Absent Days" 
                        value={breakdown.attendance_analysis.absent_days} 
                        icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
                    />
                    {breakdown.attendance_analysis.leave_hours_note && (
                        <div className="pt-2">
                            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <AlertDescription className="text-xs">
                                    {breakdown.attendance_analysis.leave_hours_note}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}

        <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-green-50/50 to-card dark:from-green-900/10 dark:to-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">Final Calculation</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Prorated salary amount
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Formula" 
                    value={breakdown.final_calculation?.formula} 
                    isCode 
                />
                <InfoRow 
                    label="Regular Hours Worked" 
                    value={`${breakdown.final_calculation?.regular_hours_worked} hrs`} 
                    icon={<Clock className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Computed Amount" 
                    value={formatCurrency(breakdown.final_calculation?.computed_amount || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
                {breakdown.final_calculation?.note && (
                    <div className="pt-2">
                        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-xs">
                                {breakdown.final_calculation.note}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
);


// Percentage Based Breakdown
const PercentageBreakdown = ({ breakdown }: { breakdown: any }) => (
    <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
        <CardHeader className="flex-row items-center space-x-3 pb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Percent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
                <h4 className="font-semibold dark:text-foreground/90">Percentage Based Calculation</h4>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                    Calculated as percentage of another component
                </p>
            </div>
        </CardHeader>
        <CardContent className="space-y-1">
            {breakdown.structure_rule?.based_on_component && (
                <>
                    <InfoRow 
                        label={`Based on '${breakdown.structure_rule.based_on_component.name}'`}
                        value={formatCurrency(breakdown.structure_rule.based_on_component.current_value || 0)} 
                        icon={<DollarSign className="w-4 h-4" />}
                    />
                    <InfoRow 
                        label="Component ID" 
                        value={breakdown.structure_rule.based_on_component.id} 
                    />
                </>
            )}
            <InfoRow 
                label="Percentage Applied" 
                value={`${breakdown.structure_rule?.percentage}%`} 
                icon={<Percent className="w-4 h-4" />}
            />
            {breakdown.calculation_details?.step_by_step && (
                <InfoRow 
                    label="Step-by-Step" 
                    value={breakdown.calculation_details.step_by_step} 
                    isCode 
                />
            )}
            <InfoRow 
                label="Computed Value" 
                value={formatCurrency(breakdown.calculated_value || 0)} 
                icon={<DollarSign className="w-4 h-4" />}
            />
        </CardContent>
    </Card>
);

// Fixed Amount Prorated Breakdown
const FixedProratedBreakdown = ({ breakdown }: { breakdown: any }) => (
    <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
        <CardHeader className="flex-row items-center space-x-3 pb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h4 className="font-semibold dark:text-foreground/90">Fixed Amount Prorated</h4>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                    Fixed amount adjusted for attendance
                </p>
            </div>
        </CardHeader>
        <CardContent className="space-y-1">
            {breakdown.component_details && (
                <>
                    <InfoRow 
                        label="Component Name" 
                        value={breakdown.component_details.name} 
                    />
                    <InfoRow 
                        label="Component Type" 
                        value={breakdown.component_details.type} 
                    />
                </>
            )}
            {breakdown.structure_rule && (
                <InfoRow 
                    label="Configured Amount" 
                    value={formatCurrency(breakdown.structure_rule.configured_amount || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
            )}
            <InfoRow 
                label="Prorated for Attendance" 
                value={breakdown.prorated_for_attendance ? "Yes" : "No"} 
            />
            <InfoRow 
                label="Total Days in Period" 
                value={breakdown.total_days_in_period} 
                icon={<CalendarDays className="w-4 h-4" />}
            />
            <InfoRow 
                label="Prorated Amount" 
                value={formatCurrency(breakdown.prorated_amount || 0)} 
                icon={<DollarSign className="w-4 h-4" />}
            />
        </CardContent>
    </Card>
);
const PercentageProratedBreakdown = ({ breakdown }: { breakdown: any }) => (
    <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
        <CardHeader className="flex-row items-center space-x-3 pb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Percent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
                <h4 className="font-semibold dark:text-foreground/90">Percentage-Based Calculation</h4>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                    {breakdown.source}
                </p>
            </div>
        </CardHeader>
        <CardContent className="space-y-1">
            {/* Component Details */}
            {breakdown.component_details && (
                <>
                    <InfoRow 
                        label="Component Name" 
                        value={breakdown.component_details.name} 
                    />
                    <InfoRow 
                        label="Component Type" 
                        value={breakdown.component_details.type} 
                    />
                </>
            )}

            {/* Calculation Configuration */}
            {breakdown.structure_rule && (
                <>
                    <InfoRow 
                        label="Calculation Type" 
                        value={breakdown.structure_rule.calculation_type} 
                        icon={<Percent className="w-4 h-4" />}
                    />
                    <InfoRow 
                        label="Configured Percentage" 
                        value={`${breakdown.structure_rule.configured_value}%`} 
                        icon={<Percent className="w-4 h-4" />}
                    />
                </>
            )}

            {/* Base Component Reference */}
            {breakdown.percentage_calculation?.based_on_component && (
                <>
                    <div className="pt-2 pb-1">
                        <p className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">
                            Based On Component
                        </p>
                    </div>
                    <InfoRow 
                        label="Component" 
                        value={breakdown.percentage_calculation.based_on_component.name} 
                    />
                    <InfoRow 
                        label="Current Value" 
                        value={formatCurrency(breakdown.percentage_calculation.based_on_component.current_value || 0)} 
                        icon={<DollarSign className="w-4 h-4" />}
                    />
                </>
            )}

            {/* Formula Display */}
            {breakdown.percentage_calculation?.formula && (
                <div className="pt-2 pb-1">
                    <p className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80 mb-1">
                        Calculation Formula
                    </p>
                    <div className="bg-muted/50 dark:bg-muted/20 rounded-md p-2 border border-border/40 dark:border-border/20">
                        <code className="text-xs font-mono text-foreground dark:text-foreground/90">
                            {breakdown.percentage_calculation.formula}
                        </code>
                    </div>
                </div>
            )}

            {/* Calculated Amount */}
            <div className="pt-2">
                <InfoRowP 
                    label="Calculated Amount" 
                    value={formatCurrency(breakdown.calculated_amount || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                    highlight
                />
            </div>

            {/* Attendance Details */}
            <div className="pt-2 pb-1">
                <p className="text-xs font-medium text-muted-foreground dark:text-muted-foreground/80">
                    Attendance Details
                </p>
            </div>
            <InfoRow 
                label="Prorated for Attendance" 
                value={breakdown.prorated_for_attendance ? "Yes" : "No"} 
            />
            {breakdown.attendance_hours !== undefined && (
                <InfoRow 
                    label="Attendance Hours" 
                    value={`${breakdown.attendance_hours} hrs`} 
                    icon={<Clock className="w-4 h-4" />}
                />
            )}
            <InfoRow 
                label="Total Days in Period" 
                value={breakdown.total_days_in_period} 
                icon={<CalendarDays className="w-4 h-4" />}
            />
        </CardContent>
    </Card>
);

// Enhanced InfoRow with optional highlight
const InfoRowP = ({ 
    label, 
    value, 
    icon, 
    highlight = false 
}: { 
    label: string; 
    value: string | number; 
    icon?: React.ReactNode; 
    highlight?: boolean;
}) => (
    <div className={`flex items-center justify-between py-1.5 px-2 rounded ${
        highlight 
            ? 'bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30' 
            : ''
    }`}>
        <div className="flex items-center gap-2">
            {icon && (
                <span className="text-muted-foreground dark:text-muted-foreground/70">
                    {icon}
                </span>
            )}
            <span className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                {label}
            </span>
        </div>
        <span className={`text-sm font-medium ${
            highlight 
                ? 'text-primary dark:text-primary/90' 
                : 'dark:text-foreground/90'
        }`}>
            {value}
        </span>
    </div>
);


interface FormulaToken {
  type: 'component' | 'operator' | 'number' | 'parenthesis';
  value: string;
}

interface OvertimeRecord {
  date: string;
  shift_name: string;
  approved_hours: string;
}

interface OvertimeDetails {
  type: string;
  component_id: number;
  per_hour_rate: number;
  component_name: string;
  total_approved_hours: number;
}

interface CalculationBreakdown {
  result?: number;
  raw_formula_array?: FormulaToken[];
  parsed_expression?: string;
  component_values_used?: Record<string, number | string>;
  calculation_steps?: string;
  final_calculation?: string;
  overtime_records?: OvertimeRecord[];
  overtime_details?: OvertimeDetails;
  overtime_type?: string;
}

interface ComponentMap {
  [key: string]: string;
}

interface FormulaBreakdownProps {
  breakdown: CalculationBreakdown;
  componentMap?: ComponentMap;
}

interface ParsedCalculationSteps {
  formula: FormulaToken[] | null;
  expression: string | null;
  result: number | null;
}

const FormulaBreakdown: React.FC<FormulaBreakdownProps> = ({ breakdown,componentMap = {} }) => {

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const parseFormulaTokens = (tokens: FormulaToken[]): React.ReactNode => {
    if (!tokens || !Array.isArray(tokens)) return null;
    
    return tokens.map((token, idx) => {
      const getTokenColor = (type: string): string => {
        switch(type) {
          case 'component': return 'text-blue-600 dark:text-blue-400 font-semibold';
          case 'operator': return 'text-purple-600 dark:text-purple-400 font-bold';
          case 'number': return 'text-green-600 dark:text-green-400 font-semibold';
          case 'parenthesis': return 'text-gray-600 dark:text-gray-400 font-bold';
          default: return 'text-gray-800 dark:text-gray-200';
        }
      };

      let displayValue = token.value;
      
      // If it's a component token, show the component name
      if (token.type === 'component' && componentMap[token.value]) {
        displayValue = componentMap[token.value];
      }

      return (
        <span key={idx} className={`${getTokenColor(token.type)} mx-0.5`}>
          {displayValue}
        </span>
      );
    });
  };

  const getComponentNameFromKey = (key: string): string => {
    // Extract ID from key like "Component_1" -> "1"
    const match = key.match(/Component_(\d+)/);
    if (match && match[1] && componentMap[match[1]]) {
      return componentMap[match[1]];
    }
    // If key is already a component name (from component_values_used), return as is
    return key;
  };

  const parseCalculationSteps = (stepsString: string): ParsedCalculationSteps | null => {
    if (!stepsString) return null;

    try {
      const parts: ParsedCalculationSteps = {
        formula: null,
        expression: null,
        result: null
      };

      // Extract formula array
      const formulaMatch = stepsString.match(/Formula: (\[.*?\])/);
      if (formulaMatch) {
        try {
          parts.formula = JSON.parse(formulaMatch[1]) as FormulaToken[];
        } catch (e) {
          console.error('Error parsing formula:', e);
        }
      }

      // Extract expression
      const expressionMatch = stepsString.match(/Expression: (.*?) →/);
      if (expressionMatch) {
        parts.expression = expressionMatch[1].trim();
      }

      // Extract result
      const resultMatch = stepsString.match(/Result: ([\d.]+)/);
      if (resultMatch) {
        parts.result = parseFloat(resultMatch[1]);
      }

      return parts;
    } catch (e) {
      console.error('Error parsing calculation steps:', e);
      return null;
    }
  };

  const renderCalculationSteps = (): React.ReactNode => {
    if (!breakdown.calculation_steps) return null;

    const steps = parseCalculationSteps(breakdown.calculation_steps);
    if (!steps) {
      return (
        <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed whitespace-pre-wrap break-words font-mono">
          {breakdown.calculation_steps}
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {/* Step 1: Formula Structure */}
        {steps.formula && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-200">
                1
              </div>
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Formula Structure
              </span>
            </div>
            <div className="ml-8 bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
              <div className="font-mono text-base leading-relaxed">
                {parseFormulaTokens(steps.formula)}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Expression with Values */}
        {steps.expression && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-200">
                2
              </div>
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Substituted Expression
              </span>
            </div>
            <div className="ml-8 bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
              <code className="text-base font-mono text-amber-900 dark:text-amber-200">
                {steps.expression}
              </code>
            </div>
          </div>
        )}

        {/* Step 3: Per Hour Rate Result */}
        {steps.result !== null && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-200">
                3
              </div>
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Per Hour Rate
              </span>
            </div>
            <div className="ml-8 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg p-3 border-2 border-amber-300 dark:border-amber-700">
              <span className="text-lg font-bold text-amber-900 dark:text-amber-200">
                {formatCurrency(steps.result)} per hour
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="border border-border/40 dark:border-border/20 rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50 shadow-sm">
        {/* Header */}
        <div className="flex items-center space-x-3 p-4 border-b border-border/40 dark:border-border/20 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg shadow-sm">
            <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {breakdown.overtime_type ? 'Overtime Calculation' : 'Custom Formula Calculation'}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {breakdown.overtime_type 
                ? `${breakdown.overtime_type.charAt(0).toUpperCase() + breakdown.overtime_type.slice(1)} overtime calculation breakdown`
                : 'Step-by-step formula evaluation'}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Overtime Records - Show First */}
          {breakdown.overtime_records && breakdown.overtime_records.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Approved Overtime Hours
                </span>
              </div>
              <div className="space-y-2">
                {breakdown.overtime_records.map((record, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-100 dark:border-cyan-900/30"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <div>
                        <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-200">
                          {formatDate(record.date)}
                        </p>
                        <p className="text-xs text-cyan-700 dark:text-cyan-400">
                          {record.shift_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
                        {parseFloat(record.approved_hours).toFixed(2)} hrs
                      </p>
                    </div>
                  </div>
                ))}
                {breakdown.overtime_details && (
                  <div className="mt-2 p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg border-2 border-cyan-200 dark:border-cyan-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-cyan-900 dark:text-cyan-200">
                        Total Approved Hours
                      </span>
                      <span className="text-xl font-bold text-cyan-700 dark:text-cyan-300">
                        {breakdown.overtime_details.total_approved_hours} hrs
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw Formula Array */}
          {breakdown.raw_formula_array && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formula Structure
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="font-mono text-lg leading-relaxed">
                  {parseFormulaTokens(breakdown.raw_formula_array)}
                </div>
              </div>
            </div>
          )}

          {/* Component Values Used */}
          {breakdown.component_values_used && Object.keys(breakdown.component_values_used).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Component Values
                </span>
              </div>
              <div className="grid gap-2">
                {Object.entries(breakdown.component_values_used).map(([key, value]) => {
                  const componentName = getComponentNameFromKey(key);
                  return (
                    <div 
                      key={key}
                      className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30"
                    >
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                        {componentName}
                      </span>
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        {typeof value === 'number' ? formatCurrency(value) : String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Parsed Expression */}
          {breakdown.parsed_expression && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Evaluated Expression
                </span>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-100 dark:border-purple-900/30">
                <code className="text-base font-mono text-purple-900 dark:text-purple-200 break-all">
                  {breakdown.parsed_expression}
                </code>
              </div>
            </div>
          )}

          {/* Calculation Steps */}
          {breakdown.calculation_steps && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rate Calculation Process
                </span>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-100 dark:border-amber-900/30">
                {renderCalculationSteps()}
              </div>
            </div>
          )}

          {/* Final Calculation with Hours */}
          {breakdown.final_calculation && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Final Calculation
                </span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-100 dark:border-emerald-900/30">
                <code className="text-base font-mono text-emerald-900 dark:text-emerald-200 font-semibold">
                  {breakdown.final_calculation}
                </code>
              </div>
            </div>
          )}

          {/* Final Result */}
          
          
        </div>
      </div>
    </div>
  );
};



// Custom Formula Breakdown


// Overtime Breakdown
const OvertimeBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        {breakdown.overtime_details && (
            <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                <CardHeader className="flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold dark:text-foreground/90">Overtime Details</h4>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                            {breakdown.overtime_details.type ? `${breakdown.overtime_details.type} overtime` : "Overtime information"}
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1">
                    <InfoRow 
                        label="Overtime Type" 
                        value={breakdown.overtime_details.type} 
                    />
                    <InfoRow 
                        label="Component Name" 
                        value={breakdown.overtime_details.component_name} 
                    />
                    <InfoRow 
                        label="Total Approved Hours" 
                        value={`${breakdown.overtime_details.total_approved_hours} hrs`} 
                        icon={<Clock className="w-4 h-4" />}
                    />
                    {breakdown.overtime_details.per_hour_rate !== undefined && (
                        <InfoRow 
                            label="Rate Per Hour" 
                            value={formatCurrency(breakdown.overtime_details.per_hour_rate)} 
                            icon={<DollarSign className="w-4 h-4" />}
                        />
                    )}
                    {breakdown.overtime_details.fixed_rate_per_hour !== undefined && (
                        <InfoRow 
                            label="Fixed Rate Per Hour" 
                            value={formatCurrency(breakdown.overtime_details.fixed_rate_per_hour)} 
                            icon={<DollarSign className="w-4 h-4" />}
                        />
                    )}
                </CardContent>
            </Card>
        )}

        {breakdown.base_component && (
            <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                <CardHeader className="flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold dark:text-foreground/90">Base Component</h4>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                            Component used for rate calculation
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1">
                    <InfoRow 
                        label="Component Name" 
                        value={breakdown.base_component.name} 
                    />
                    <InfoRow 
                        label="Component ID" 
                        value={breakdown.base_component.id} 
                    />
                    <InfoRow 
                        label="Value" 
                        value={formatCurrency(breakdown.base_component.value || 0)} 
                        icon={<DollarSign className="w-4 h-4" />}
                    />
                </CardContent>
            </Card>
        )}

        {breakdown.percentage_calculation && (
            <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                <CardHeader className="flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Percent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold dark:text-foreground/90">Percentage Calculation</h4>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                            Rate calculation breakdown
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1">
                    <InfoRow 
                        label="Percentage" 
                        value={`${breakdown.percentage_calculation.percentage}%`} 
                        icon={<Percent className="w-4 h-4" />}
                    />
                    <InfoRow 
                        label="Formula" 
                        value={breakdown.percentage_calculation.formula} 
                        isCode 
                    />
                </CardContent>
            </Card>
        )}

        {breakdown.overtime_records && breakdown.overtime_records.length > 0 && (
            <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
                <CardHeader className="flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <ListChecks className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold dark:text-foreground/90">Approved Overtime Records</h4>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                            Individual overtime entries
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="dark:border-border/20">
                                <TableHead className="dark:text-muted-foreground/80">Date</TableHead>
                                <TableHead className="dark:text-muted-foreground/80">Shift</TableHead>
                                <TableHead className="text-right dark:text-muted-foreground/80">Approved Hours</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {breakdown.overtime_records.map((rec: any, index: number) => (
                                <TableRow key={index} className="dark:border-border/20">
                                    <TableCell className="dark:text-foreground/90">{formatDate(rec.date)}</TableCell>
                                    <TableCell className="dark:text-foreground/90">{rec.shift_name || "N/A"}</TableCell>
                                    <TableCell className="text-right font-semibold dark:text-foreground/90">
                                        {parseFloat(rec.approved_hours).toFixed(2)} hrs
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {breakdown.overtime_details?.total_approved_hours && (
                        <div className="pt-3 mt-2 border-t dark:border-border/20 font-bold text-right dark:text-foreground/90">
                            Total: {breakdown.overtime_details.total_approved_hours} hrs
                        </div>
                    )}
                </CardContent>
            </Card>
        )}

        {(breakdown.final_calculation || breakdown.overtime_details?.final_calculation) && (
            <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-green-50/50 to-card dark:from-green-900/10 dark:to-card/50">
                <CardHeader className="flex-row items-center space-x-3 pb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold dark:text-foreground/90">Final Overtime Pay</h4>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                            Total overtime amount
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1">
                    <InfoRow 
                        label="Calculation" 
                        value={breakdown.final_calculation || breakdown.overtime_details?.final_calculation} 
                        isCode 
                    />
                    {/* <InfoRow 
                        label="Computed Amount" 
                        value={formatCurrency(breakdown.computed_value || breakdown.computed_amount || breakdown.overtime_details?.fixed_rate_per_hour*breakdown.overtime_details?.total_approved_hours || 0)} 
                        icon={<DollarSign className="w-4 h-4" />}
                    /> */}
                </CardContent>
            </Card>
        )}
    </div>
);

// HR Case Breakdown
const HrCaseBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Gavel className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">HR Case Details</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Disciplinary case information
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Case Number" 
                    value={breakdown.case_details?.case_number} 
                    icon={<Hash className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Case Title" 
                    value={breakdown.case_details?.case_title} 
                />
                <InfoRow 
                    label="Category" 
                    value={breakdown.case_details?.category} 
                />
                <InfoRow 
                    label="Case Date" 
                    value={formatDateTime(breakdown.case_details?.case_date)} 
                    icon={<Clock className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Raised By" 
                    value={breakdown.case_details?.raised_by} 
                    icon={<UserCheck className="w-4 h-4" />}
                />
            </CardContent>
        </Card>

        <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-red-50/50 to-card dark:from-red-900/10 dark:to-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">Deduction Details</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Penalty deduction amount
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Deduction Type" 
                    value={breakdown.deduction_type} 
                />
                <InfoRow 
                    label="Reason" 
                    value={breakdown.deduction_details?.deduction_reason} 
                />
                <InfoRow 
                    label="Approved Amount" 
                    value={formatCurrency(breakdown.deduction_details?.approved_amount || breakdown.computed_value || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
            </CardContent>
        </Card>
    </div>
);

// Expense Reimbursement Breakdown
const ExpenseReimbursementBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">Expense Details</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Expense claim information
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Expense ID" 
                    value={breakdown.expense_details?.expense_id} 
                    icon={<Hash className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Title" 
                    value={breakdown.expense_details?.expense_title} 
                />
                <InfoRow 
                    label="Category" 
                    value={breakdown.expense_details?.category} 
                />
                <InfoRow 
                    label="Expense Date" 
                    value={formatDate(breakdown.expense_details?.expense_date)} 
                    icon={<CalendarDays className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Approved By" 
                    value={breakdown.expense_details?.approved_by || "N/A"} 
                    icon={<UserCheck className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Approval Date" 
                    value={formatDate(breakdown.expense_details?.approval_date)} 
                    icon={<Clock className="w-4 h-4" />}
                />
            </CardContent>
        </Card>

        <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-green-50/50 to-card dark:from-green-900/10 dark:to-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">Reimbursement Details</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Repayment information
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Reimbursement Type" 
                    value={breakdown.reimbursement_type} 
                />
                <InfoRow 
                    label="Method" 
                    value={breakdown.reimbursement_details?.reimbursement_method} 
                />
                <InfoRow 
                    label="Approved Amount" 
                    value={formatCurrency(breakdown.reimbursement_details?.approved_amount || breakdown.computed_value || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
            </CardContent>
        </Card>
    </div>
);

// Loan EMI Breakdown
const LoanBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Landmark className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">Loan Details</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Loan application information
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Application Number" 
                    value={breakdown.loan_details?.application_number} 
                    icon={<Hash className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Loan Type" 
                    value={breakdown.loan_details?.loan_type} 
                />
                <InfoRow 
                    label="Interest Rate" 
                    value={breakdown.loan_details?.interest_rate ? `${breakdown.loan_details.interest_rate}% p.a.` : "N/A"} 
                    icon={<Percent className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Due Date" 
                    value={formatDate(breakdown.loan_details?.due_date)} 
                    icon={<CalendarDays className="w-4 h-4" />}
                />
            </CardContent>
        </Card>

        <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-red-50/50 to-card dark:from-red-900/10 dark:to-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Calculator className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h4 className="font-semibold dark:text-foreground/90">EMI Schedule Details</h4>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground/70">
                        Monthly payment breakdown
                    </p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <InfoRow 
                    label="Deduction Type" 
                    value={breakdown.deduction_type} 
                />
                <InfoRow 
                    label="Principal Component" 
                    value={formatCurrency(breakdown.schedule_details?.principal_component || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                    label="Interest Component" 
                    value={formatCurrency(breakdown.schedule_details?.interest_component || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
                <InfoRow 
                    label="EMI Breakdown" 
                    value={breakdown.schedule_details?.breakdown_formula} 
                    isCode 
                />
                <InfoRow 
                    label="Total EMI" 
                    value={formatCurrency(breakdown.schedule_details?.total_emi || breakdown.computed_value || 0)} 
                    icon={<DollarSign className="w-4 h-4" />}
                />
            </CardContent>
        </Card>
    </div>
);

// Error Breakdown
const ErrorBreakdown = ({ breakdown }: { breakdown: any }) => (
    <Alert className="border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
        <AlertDescription className="space-y-3 dark:text-red-200">
            <div>
                <p className="font-semibold text-sm">Calculation Error</p>
                <p className="text-sm mt-1">{breakdown.error || "An unknown error occurred during calculation."}</p>
            </div>
            {breakdown.error_details && (
                <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800/40">
                    <p className="text-xs font-mono">
                        {breakdown.error_details.message || breakdown.error_details.name}
                    </p>
                </div>
            )}
            {breakdown.raw_formula && (
                <div className="mt-2">
                    <p className="text-xs font-semibold mb-1">Raw Formula:</p>
                    <pre className="text-xs bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-x-auto">
                        {typeof breakdown.raw_formula === 'string' 
                            ? breakdown.raw_formula 
                            : JSON.stringify(breakdown.raw_formula, null, 2)}
                    </pre>
                </div>
            )}
        </AlertDescription>
    </Alert>
);
