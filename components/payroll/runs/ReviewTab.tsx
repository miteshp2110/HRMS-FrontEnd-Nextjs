
// "use client"

// import * as React from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useToast } from "@/hooks/use-toast";
// import { 
//     getPayslipsForCycle, 
//     getPayslipForReview, 
//     updatePayslipStatus, 
//     addManualAdjustment,
//     bulkAddComponent,
//     updatePayrollCycleStatus,
//     type PayslipSummary, 
//     type PayslipDetails, 
//     deletePayrollComponent,
//     deleteComponentFromPayslip
// } from "@/lib/api";
// import { 
//     Eye, 
//     Plus, 
//     FileCheck, 
//     Loader2, 
//     Users, 
//     DollarSign,
//     CheckCircle2,
//     AlertTriangle,
//     Calculator,
//     Edit,
//     FileText,
//     Briefcase,
//     Clock,
//     Percent,
//     Hash,
//     Landmark,
//     Receipt,
//     Gavel,
//     Trash2
// } from "lucide-react";
// import { ManualAdjustmentDialog } from "./ManualAdjustmentDialog";
// // import { CalculationBreakdownDialog } from "./CalculationBreakdownDialog"; // We will create this component below

// // Define a more specific type for payslip component details for clarity
// type PayslipComponentDetail = PayslipDetails['details'][0];

// interface Props {
//     cycleId: number;
//     cycleStatus: string;
//     onStatusChange: () => void;
// }


// export function ReviewTab({ cycleId, cycleStatus, onStatusChange }: Props) {
//     const { toast } = useToast();
//     const [payslips, setPayslips] = React.useState<PayslipSummary[]>([]);
//     const [selectedPayslip, setSelectedPayslip] = React.useState<PayslipDetails | null>(null);
//     const [showDetails, setShowDetails] = React.useState(false);
//     const [showAdjustment, setShowAdjustment] = React.useState(false);
//     const [showBulkAdd, setShowBulkAdd] = React.useState(false);
//     const [isLoading, setIsLoading] = React.useState(false);
//     const [processingId, setProcessingId] = React.useState<number | null>(null);
//     const [isTransitioning, setIsTransitioning] = React.useState(false);
    
//     // State for the new calculation breakdown dialog
//     const [showBreakdown, setShowBreakdown] = React.useState(false);
//     const [selectedDetailForBreakdown, setSelectedDetailForBreakdown] = React.useState<PayslipComponentDetail | null>(null);

//     // Bulk add form
//     const [bulkForm, setBulkForm] = React.useState({
//         component_name: '',
//         component_type: 'earning' as 'earning' | 'deduction',
//         amount: '',
//         reason: ''
//     });

//     const fetchPayslips = React.useCallback(async () => {
//         if (!['Review', 'Finalized', 'Paid'].includes(cycleStatus)) return;
        
//         setIsLoading(true);
//         try {
//             const data = await getPayslipsForCycle(cycleId);
//             setPayslips(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load payslips.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [cycleId, cycleStatus, toast]);

//     React.useEffect(() => {
//         fetchPayslips();
//     }, [fetchPayslips]);

//     const handleViewDetails = async (payslipId: number) => {
//         try {
//             const details = await getPayslipForReview(payslipId);
//             setSelectedPayslip(details);
//             setShowDetails(true);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load payslip details.", variant: "destructive" });
//         }
//     };

//     const handleStatusUpdate = async (payslipId: number, newStatus: 'Reviewed') => {
//         setProcessingId(payslipId);
//         try {
//             await updatePayslipStatus(payslipId, newStatus);
//             toast({ title: "Success", description: `Payslip marked as ${newStatus}.` });
//             await fetchPayslips();
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to update status: ${error.message}`, variant: "destructive" });
//         } finally {
//             setProcessingId(null);
//         }
//     };

//     const handleBulkAdd = async (e: React.FormEvent) => {
//         e.preventDefault();
        
//         try {
//             await bulkAddComponent(cycleId, {
//                 component_name: bulkForm.component_name,
//                 component_type: bulkForm.component_type,
//                 amount: parseFloat(bulkForm.amount),
//                 reason: bulkForm.reason
//             });

//             toast({ title: "Success", description: "Bulk component added to all payslips." });
//             setShowBulkAdd(false);
//             setBulkForm({ component_name: '', component_type: 'earning', amount: '', reason: '' });
//             await fetchPayslips();
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to add bulk component: ${error.message}`, variant: "destructive" });
//         }
//     };

//     const handleTransitionToReview = async () => {
//         setIsTransitioning(true);
//         try {
//             await updatePayrollCycleStatus(cycleId, 'Review');
//             toast({ title: "Success", description: "Moved to review phase. Payslips generated!" });
//             onStatusChange();
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to transition: ${error.message}`, variant: "destructive" });
//         } finally {
//             setIsTransitioning(false);
//         }
//     };

//     const handleFinalizeCycle = async () => {
//         const unreviewed = payslips.filter(p => p.status === 'Draft').length;
//         if (unreviewed > 0) {
//             toast({ 
//                 title: "Cannot Finalize", 
//                 description: `${unreviewed} payslips are still in Draft status.`,
//                 variant: "destructive" 
//             });
//             return;
//         }

//         if (!confirm('Are you sure you want to finalize this payroll cycle? This action cannot be undone.')) {
//             return;
//         }

//         setIsTransitioning(true);
//         try {
//             await updatePayrollCycleStatus(cycleId, 'Finalized');
//             toast({ title: "Success", description: "Payroll cycle finalized successfully!" });
//             onStatusChange();
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to finalize: ${error.message}`, variant: "destructive" });
//         } finally {
//             setIsTransitioning(false);
//         }
//     };

//     // Calculate statistics
//     const reviewedCount = payslips.filter(p => p.status === 'Reviewed').length;
//     const draftCount = payslips.filter(p => p.status === 'Draft').length;
//     const totalPayslips = payslips.length;
//     const progressPercentage = totalPayslips > 0 ? (reviewedCount / totalPayslips) * 100 : 0;
    
//     const totalGrossEarnings = payslips.reduce((sum, p) => sum + parseFloat(p.gross_earnings), 0);
//     const totalDeductions = payslips.reduce((sum, p) => sum + parseFloat(p.total_deductions), 0);
//     const totalNetPay = payslips.reduce((sum, p) => sum + parseFloat(p.net_pay), 0);

//     const canFinalize = totalPayslips > 0 && reviewedCount === totalPayslips && cycleStatus === 'Review';
//     const canTransition = cycleStatus === 'Auditing';

//     return (
//         <div className="space-y-6">
//             {/* Review Header */}
//             <Card>
//                 <CardHeader>
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                             <div className="p-2 bg-green-100 rounded-lg">
//                                 <FileCheck className="w-6 h-6 text-green-600" />
//                             </div>
//                             <div>
//                                 <CardTitle>Payslip Review & Finalization</CardTitle>
//                                 <CardDescription>
//                                     Review individual payslips, make adjustments, and finalize the cycle
//                                 </CardDescription>
//                             </div>
//                         </div>
                        
//                         <div className="flex items-center space-x-2">
//                             {canTransition && (
//                                 <Button 
//                                     onClick={handleTransitionToReview}
//                                     disabled={isTransitioning}
//                                     className="bg-blue-600 hover:bg-blue-700"
//                                 >
//                                     {isTransitioning ? (
//                                         <>
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                             Generating...
//                                         </>
//                                     ) : (
//                                         'Generate Payslips'
//                                     )}
//                                 </Button>
//                             )}
                            
//                             {cycleStatus === 'Review' && (
//                                 <>
//                                     <Button onClick={() => setShowBulkAdd(true)} variant="outline">
//                                         <Plus className="w-4 h-4 mr-2" />
//                                         Bulk Add
//                                     </Button>
//                                     <Button 
//                                         onClick={handleFinalizeCycle}
//                                         disabled={!canFinalize || isTransitioning}
//                                         className="bg-green-600 hover:bg-green-700"
//                                     >
//                                         {isTransitioning ? (
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                         ) : (
//                                             <FileCheck className="w-4 h-4 mr-2" />
//                                         )}
//                                         Finalize Cycle ({reviewedCount}/{totalPayslips})
//                                     </Button>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </CardHeader>
                
//                 {totalPayslips > 0 && (
//                     <CardContent>
//                         <div className="space-y-4">
//                             {/* Progress Bar */}
//                             <div>
//                                 <div className="flex justify-between text-sm mb-2">
//                                     <span>Review Progress</span>
//                                     <span>{reviewedCount}/{totalPayslips} payslips reviewed</span>
//                                 </div>
//                                 <Progress value={progressPercentage} className="h-2" />
//                             </div>

//                             {/* Status Alert */}
//                             {draftCount > 0 ? (
//                                 <Alert>
//                                     <AlertTriangle className="h-4 w-4" />
//                                     <AlertDescription>
//                                         <strong>{draftCount} payslips</strong> are still in Draft status and need review before finalization.
//                                     </AlertDescription>
//                                 </Alert>
//                             ) : reviewedCount === totalPayslips ? (
//                                 <Alert className="border-green-200 bg-green-50">
//                                     <CheckCircle2 className="h-4 w-4 text-green-600" />
//                                     <AlertDescription className="text-green-800">
//                                         All payslips have been reviewed! Ready for finalization.
//                                     </AlertDescription>
//                                 </Alert>
//                             ) : null}

//                             {/* Financial Summary */}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
//                                 <div className="text-center">
//                                     <div className="text-sm text-gray-600">Total Gross Earnings</div>
//                                     <div className="text-lg font-bold text-green-600">₹{totalGrossEarnings.toLocaleString()}</div>
//                                 </div>
//                                 <div className="text-center">
//                                     <div className="text-sm text-gray-600">Total Deductions</div>
//                                     <div className="text-lg font-bold text-red-600">₹{totalDeductions.toLocaleString()}</div>
//                                 </div>
//                                 <div className="text-center">
//                                     <div className="text-sm text-gray-600">Total Net Pay</div>
//                                     <div className="text-xl font-bold text-blue-600">₹{totalNetPay.toLocaleString()}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </CardContent>
//                 )}
//             </Card>

//             {/* Payslips Table */}
//             {cycleStatus !== 'Review' && cycleStatus !== 'Finalized' && cycleStatus !== 'Paid' ? (
//                 <Card>
//                     <CardContent className="flex items-center justify-center h-64">
//                         <div className="text-center">
//                             {canTransition ? (
//                                 <>
//                                     <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
//                                     <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Generate Payslips</h3>
//                                     <p className="text-gray-500 mb-4">
//                                         All payroll runs have been completed. Generate payslips to start the review process.
//                                     </p>
//                                     <Button 
//                                         onClick={handleTransitionToReview}
//                                         disabled={isTransitioning}
//                                         className="bg-blue-600 hover:bg-blue-700"
//                                     >
//                                         {isTransitioning ? (
//                                             <>
//                                                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                                 Generating Payslips...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <FileText className="w-4 h-4 mr-2" />
//                                                 Generate Payslips
//                                             </>
//                                         )}
//                                     </Button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                                     <h3 className="text-lg font-semibold text-gray-600 mb-2">Complete Previous Steps</h3>
//                                     <p className="text-gray-500">
//                                         Complete audit and execution phases before reviewing payslips.
//                                     </p>
//                                 </>
//                             )}
//                         </div>
//                     </CardContent>
//                 </Card>
//             ) : (
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="flex items-center">
//                             <Users className="w-5 h-5 mr-2" />
//                             Payslips ({totalPayslips})
//                         </CardTitle>
//                         <CardDescription>
//                             Review individual payslips and mark them as reviewed
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         {isLoading ? (
//                             <div className="flex items-center justify-center py-12">
//                                 <Loader2 className="w-6 h-6 animate-spin mr-2" />
//                                 Loading payslips...
//                             </div>
//                         ) : payslips.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                                 <h3 className="text-lg font-semibold text-gray-600 mb-2">No Payslips Found</h3>
//                                 <p className="text-gray-500">No payslips have been generated for this cycle yet.</p>
//                             </div>
//                         ) : (
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>Employee</TableHead>
//                                         <TableHead className="text-right">Gross Earnings</TableHead>
//                                         <TableHead className="text-right">Deductions</TableHead>
//                                         <TableHead className="text-right">Net Pay</TableHead>
//                                         <TableHead>Status</TableHead>
//                                         <TableHead className="w-48">Actions</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {payslips.map((payslip) => (
//                                         <TableRow key={payslip.id} className="hover:bg-gray-50">
//                                             <TableCell className="font-medium">{payslip.employee_name}</TableCell>
//                                             <TableCell className="text-right font-semibold text-green-600">
//                                                 ₹{parseFloat(payslip.gross_earnings).toLocaleString()}
//                                             </TableCell>
//                                             <TableCell className="text-right font-semibold text-red-600">
//                                                 ₹{parseFloat(payslip.total_deductions).toLocaleString()}
//                                             </TableCell>
//                                             <TableCell className="text-right font-bold text-blue-600">
//                                                 ₹{parseFloat(payslip.net_pay).toLocaleString()}
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Badge variant={payslip.status === 'Reviewed' ? 'default' : 'secondary'}>
//                                                     {payslip.status}
//                                                 </Badge>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex gap-2">
//                                                     <Button
//                                                         size="sm"
//                                                         variant="outline"
//                                                         onClick={() => handleViewDetails(payslip.id)}
//                                                     >
//                                                         <Eye className="w-3 h-3 mr-1" />
//                                                         View
//                                                     </Button>
//                                                     {payslip.status === 'Draft' && cycleStatus === 'Review' && (
//                                                         <Button
//                                                             size="sm"
//                                                             onClick={() => handleStatusUpdate(payslip.id, 'Reviewed')}
//                                                             disabled={processingId === payslip.id}
//                                                             className="bg-green-600 hover:bg-green-700"
//                                                         >
//                                                             {processingId === payslip.id ? (
//                                                                 <Loader2 className="w-3 h-3 animate-spin" />
//                                                             ) : (
//                                                                 <>
//                                                                     <CheckCircle2 className="w-3 h-3 mr-1" />
//                                                                     Mark as Reviewed
//                                                                 </>
//                                                             )}
//                                                         </Button>
//                                                     )}
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         )}
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Payslip Details Dialog */}
//             <Dialog open={showDetails} onOpenChange={setShowDetails}>
//                 <DialogContent className="!max-w-6xl w-[50vw] max-h-[80vh] overflow-y-auto">
//                     <DialogHeader>
//                         <DialogTitle>
//                             Payslip Details - {selectedPayslip?.employee_name}
//                         </DialogTitle>
//                         <DialogDescription>
//                             {selectedPayslip?.cycle_name} 
//                         </DialogDescription>
//                     </DialogHeader>
                    
//                     {selectedPayslip && (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-3 gap-4 p-4 border rounded">
//                                 <div>
//                                     <Label className="text-sm font-medium">Gross Earnings</Label>
//                                     <div className="text-lg font-semibold text-green-600">
//                                         ₹{parseFloat(selectedPayslip.gross_earnings).toLocaleString()}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium">Total Deductions</Label>
//                                     <div className="text-lg font-semibold text-red-600">
//                                         ₹{parseFloat(selectedPayslip.total_deductions).toLocaleString()}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <Label className="text-sm font-medium">Net Pay</Label>
//                                     <div className="text-xl font-bold text-blue-600">
//                                         ₹{parseFloat(selectedPayslip.net_pay).toLocaleString()}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div>
//                                 <h4 className="font-semibold mb-2">Component Details</h4>
//                                 <Table>
//                                     <TableHeader>
//                                         <TableRow>
//                                             <TableHead>Component</TableHead>
//                                             <TableHead>Type</TableHead>
//                                             <TableHead className="text-right">Amount</TableHead>
//                                             <TableHead>Source</TableHead>
//                                             {/* ADDED: Header for breakdown button */}
//                                             <TableHead className="text-center">Breakdown</TableHead>
//                                             <TableHead className="text-center">Delete</TableHead>
//                                         </TableRow>
//                                     </TableHeader>
//                                     <TableBody>
//                                         {selectedPayslip.details.map((detail) => (
//                                             <TableRow key={detail.id}>
//                                                 <TableCell className="font-medium">{detail.component_name}</TableCell>
//                                                 <TableCell>
//                                                     <Badge variant={detail.component_type === 'earning' ? 'default' : 'destructive'}>
//                                                         {detail.component_type}
//                                                     </Badge>
//                                                 </TableCell>
//                                                 <TableCell className="text-right font-semibold">
//                                                     ₹{parseFloat(detail.amount).toLocaleString()}
//                                                 </TableCell>
//                                                 <TableCell className="text-sm text-gray-600">
//                                                     {detail.group_name}
//                                                 </TableCell>
//                                                 {/* ADDED: Button to trigger breakdown dialog */}
//                                                 <TableCell className="text-center">
//                                                     {detail.calculation_breakdown && (
//                                                         <Button
//                                                             size="icon"
//                                                             variant="ghost"
//                                                             onClick={() => {
//                                                                 setSelectedDetailForBreakdown(detail);
//                                                                 setShowBreakdown(true);
//                                                             }}
//                                                         >
//                                                             <Calculator className="w-4 h-4" />
//                                                         </Button>
//                                                     )}
//                                                 </TableCell>
//                                                 <TableCell className="text-center">
//                                                     <Button
//                                                             disabled={cycleStatus==='Paid'}
//                                                             size="icon"
//                                                             variant="ghost"
//                                                             onClick={async() => {
//                                                                 alert('This will delete the component')
//                                                                 await deleteComponentFromPayslip(selectedPayslip.id,detail.id)
//                                                                 await handleViewDetails(selectedPayslip.id)
//                                                             }}
//                                                         >
//                                                             <Trash2 className="w-4 h-4" />
//                                                         </Button>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                         </div>
//                     )}

//                     <DialogFooter>
//                         {selectedPayslip?.status !== 'Finalized' && cycleStatus === 'Review' && (
//                             <Button 
//                                 variant="outline" 
//                                 onClick={() => {
//                                     setShowAdjustment(true);
//                                     setShowDetails(false);
//                                 }}
//                             >
//                                 <Edit className="w-4 h-4 mr-2" />
//                                 Add Adjustment
//                             </Button>
//                         )}
//                         <Button onClick={() => setShowDetails(false)}>
//                             Close
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Manual Adjustment Dialog */}
//             {selectedPayslip && (
//                 <ManualAdjustmentDialog
//                     open={showAdjustment}
//                     onOpenChange={(open) => {
//                         setShowAdjustment(open);
//                         if (!open) {
//                             setShowDetails(true); // Return to details view
//                         }
//                     }}
//                     onSuccess={async () => {
//                         await fetchPayslips();
//                         if (selectedPayslip) {
//                             // Refresh the selected payslip details
//                             const updatedDetails = await getPayslipForReview(selectedPayslip.id);
//                             setSelectedPayslip(updatedDetails);
//                         }
//                     }}
//                     payslipId={selectedPayslip.id}
//                 />
//             )}
            
//             {/* ADDED: Calculation Breakdown Dialog */}
//             {selectedDetailForBreakdown && (
//                 <CalculationBreakdownDialog
//                     open={showBreakdown}
//                     onOpenChange={setShowBreakdown}
//                     detail={selectedDetailForBreakdown}
//                 />
//             )}


//             {/* Bulk Add Dialog */}
//             <Dialog open={showBulkAdd} onOpenChange={setShowBulkAdd}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle className="flex items-center">
//                             <Calculator className="w-5 h-5 mr-2" />
//                             Bulk Add Component
//                         </DialogTitle>
//                         <DialogDescription>
//                             Add the same component to all payslips in this cycle.
//                         </DialogDescription>
//                     </DialogHeader>
                    
//                     <form onSubmit={handleBulkAdd} className="space-y-4">
//                         <div>
//                             <Label htmlFor="bulk_component_name">Component Name</Label>
//                             <Input
//                                 id="bulk_component_name"
//                                 value={bulkForm.component_name}
//                                 onChange={(e) => setBulkForm(prev => ({ ...prev, component_name: e.target.value }))}
//                                 placeholder="e.g., Festival Bonus"
//                                 required
//                             />
//                         </div>
                        
//                         <div>
//                             <Label htmlFor="bulk_component_type">Type</Label>
//                             <Select
//                                 value={bulkForm.component_type}
//                                 onValueChange={(value: 'earning' | 'deduction') => 
//                                     setBulkForm(prev => ({ ...prev, component_type: value }))
//                                 }
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="earning">Earning</SelectItem>
//                                     <SelectItem value="deduction">Deduction</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
                        
//                         <div>
//                             <Label htmlFor="bulk_amount">Amount (₹)</Label>
//                             <Input
//                                 id="bulk_amount"
//                                 type="number"
//                                 step="0.01"
//                                 value={bulkForm.amount}
//                                 onChange={(e) => setBulkForm(prev => ({ ...prev, amount: e.target.value }))}
//                                 placeholder="0.00"
//                                 required
//                             />
//                         </div>
                        
//                         <div>
//                             <Label htmlFor="bulk_reason">Reason</Label>
//                             <Textarea
//                                 id="bulk_reason"
//                                 value={bulkForm.reason}
//                                 onChange={(e) => setBulkForm(prev => ({ ...prev, reason: e.target.value }))}
//                                 placeholder="Reason for this bulk addition..."
//                             />
//                         </div>
                        
//                         <DialogFooter>
//                             <Button type="button" variant="outline" onClick={() => setShowBulkAdd(false)}>
//                                 Cancel
//                             </Button>
//                             <Button type="submit">Add to All Payslips</Button>
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }


// // A helper component to render key-value pairs in the breakdown dialog
// const InfoRow = ({ label, value, isCode = false }: { label: string; value?: React.ReactNode; isCode?: boolean }) => {
//     if (value === undefined || value === null || value === '') return null;
//     return (
//         <div className="flex justify-between items-start py-2.5 border-b last:border-b-0">
//             <p className="text-sm text-gray-500">{label}</p>
//             {isCode ? (
//                 <code className="text-sm font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded-md text-right">{value}</code>
//             ) : (
//                 <p className="text-sm font-medium text-gray-800 text-right">{value}</p>
//             )}
//         </div>
//     );
// };


// // The new Calculation Breakdown Dialog component
// interface BreakdownDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   detail: PayslipComponentDetail;
// }

// const CalculationBreakdownDialog = ({ open, onOpenChange, detail }: BreakdownDialogProps) => {
//     const breakdown = detail.calculation_breakdown;

//     const renderContent = () => {
//         if (!breakdown) {
//             return <p className="text-center text-gray-500 py-8">No calculation breakdown available for this component.</p>;
//         }

//         // Render based on calculation source/type
//         if (breakdown.source === "Custom Formula Evaluation") {
//             return <OvertimeBreakdown breakdown={breakdown} />;
//         }
//         if (breakdown.calculation_type === "Percentage Based") {
//             return <PercentageBreakdown breakdown={breakdown} />;
//         }
//         if (breakdown.calculation_method === "Hours-based Prorated Calculation") {
//             return <ProratedBreakdown breakdown={breakdown} />;
//         }
//         if (breakdown.source === "HR Case Management System") return <HrCaseBreakdown breakdown={breakdown} />;
//         if (breakdown.source === "Expense Management System") return <ExpenseReimbursementBreakdown breakdown={breakdown} />;
//         if (breakdown.source === "Loan Management System") return <LoanBreakdown breakdown={breakdown} />;

//         // Fallback for any other structure
//         return <pre className="text-xs bg-gray-100 p-4 rounded-md overflow-x-auto">{JSON.stringify(breakdown, null, 2)}</pre>;
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle className="flex items-center">
//                         <Calculator className="w-5 h-5 mr-2" />
//                         Calculation Breakdown: {detail.component_name}
//                     </DialogTitle>
//                     <DialogDescription>
//                         Source: {breakdown?.source || "N/A"}
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="py-4 space-y-6">
//                     {renderContent()}
//                 </div>

//                 <DialogFooter>
//                     <Button onClick={() => onOpenChange(false)}>Close</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// // Sub-components for rendering specific breakdown types

// const ProratedBreakdown = ({ breakdown }: { breakdown: any }) => (
//     <div className="space-y-4">
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <Briefcase className="w-5 h-5 text-gray-500" />
//                 <h4 className="font-semibold">Base Salary Structure</h4>
//             </CardHeader>
//             <CardContent>
//                 <InfoRow label="Monthly Amount" value={`₹${parseFloat(breakdown.base_salary_structure?.monthly_amount).toLocaleString()}`} />
//                 <InfoRow label="Calculation Type" value={breakdown.base_salary_structure?.calculation_type} />
//             </CardContent>
//         </Card>

//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <Clock className="w-5 h-5 text-gray-500" />
//                 <h4 className="font-semibold">Attendance Analysis</h4>
//             </CardHeader>
//             <CardContent>
//                 <InfoRow label="Working Days in Period" value={breakdown.attendance_analysis?.working_days_in_period} />
//                 <InfoRow label="Present Days" value={breakdown.attendance_analysis?.present_days} />
//                 <InfoRow label="Half Days" value={breakdown.attendance_analysis?.half_days} />
//                 <InfoRow label="Leave Days" value={breakdown.attendance_analysis?.leave_days} />
//                 <InfoRow label="Absent Days" value={breakdown.attendance_analysis?.absent_days} />
//                 <InfoRow label="Total Worked Hours" value={`${breakdown.attendance_analysis?.total_worked_hours} hrs`} />
//             </CardContent>
//         </Card>
        
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <DollarSign className="w-5 h-5 text-gray-500" />
//                 <h4 className="font-semibold">Final Calculation</h4>
//             </CardHeader>
//             <CardContent>
//                  <InfoRow label="Hourly Rate Formula" value={breakdown.rate_calculations?.hourly_rate_formula} isCode />
//                  <InfoRow label="Final Calculation Formula" value={breakdown.final_calculation?.formula} isCode />
//                  <InfoRow label="Computed Amount" value={`₹${parseFloat(breakdown.final_calculation?.computed_amount).toLocaleString()}`} />
//             </CardContent>
//         </Card>
//     </div>
// );


// const PercentageBreakdown = ({ breakdown }: { breakdown: any }) => (
//     <Card>
//         <CardHeader className="flex-row items-center space-x-3 pb-2">
//             <Percent className="w-5 h-5 text-gray-500" />
//             <h4 className="font-semibold">Percentage Based Calculation</h4>
//         </CardHeader>
//         <CardContent>
//             <InfoRow 
//                 label={`Based on '${breakdown.structure_rule?.based_on_component?.name}'`} 
//                 value={`₹${parseFloat(breakdown.structure_rule?.based_on_component?.current_value).toLocaleString()}`} 
//             />
//             <InfoRow label="Percentage Applied" value={`${breakdown.structure_rule?.percentage}%`} />
//             <InfoRow label="Calculation Step-by-Step" value={breakdown.calculation_details?.step_by_step} isCode />
//             <InfoRow label="Computed Value" value={`₹${parseFloat(breakdown.computed_value).toLocaleString()}`} />
//         </CardContent>
//     </Card>
// );

// const OvertimeBreakdown = ({ breakdown }: { breakdown: any }) => (
//     <div className="space-y-4">
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <Hash className="w-5 h-5 text-gray-500" />
//                 <h4 className="font-semibold">Rate Per Hour Calculation</h4>
//             </CardHeader>
//             <CardContent>
//                 <InfoRow label="Context" value={breakdown.calculation_context} />
//                 <InfoRow label="Expression" value={breakdown.parsed_expression} isCode />
//                 <InfoRow label="Resulting Rate" value={`₹${parseFloat(breakdown.result).toLocaleString()}/hr`} />
//             </CardContent>
//         </Card>
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <Clock className="w-5 h-5 text-gray-500" />
//                 <h4 className="font-semibold">Approved Overtime Hours</h4>
//             </CardHeader>
//             <CardContent>
//                  <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Date</TableHead>
//                             <TableHead className="text-right">Approved Hours</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {breakdown.overtime_records?.map((rec: any, index: number) => (
//                            <TableRow key={index}>
//                                 <TableCell>{new Date(rec.date).toLocaleDateString()}</TableCell>
//                                 <TableCell className="text-right">{parseFloat(rec.approved_hours).toFixed(2)}</TableCell>
//                            </TableRow>
//                         ))}
//                     </TableBody>
//                  </Table>
//                 <div className="pt-2 font-bold text-right">
//                     Total: {breakdown.overtime_details?.total_approved_hours} hrs
//                 </div>
//             </CardContent>
//         </Card>
//          <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <DollarSign className="w-5 h-5 text-gray-500" />
//                 <h4 className="font-semibold">Final Overtime Pay</h4>
//             </CardHeader>
//             <CardContent>
//                 <InfoRow label="Final Calculation" value={breakdown.overtime_details?.final_calculation} isCode />
//                 <InfoRow label="Computed Amount" value={`₹${parseFloat(breakdown.computed_amount).toLocaleString()}`} />
//             </CardContent>
//         </Card>
//     </div>
// );

// const HrCaseBreakdown = ({ breakdown }: { breakdown: any }) => (
//     <div className="space-y-4">
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <Gavel className="w-5 h-5 text-gray-500" />
//                 <h4 className="font-semibold">Case Details</h4>
//             </CardHeader>
//             <CardContent>
//                 <InfoRow label="Case Number" value={breakdown.case_details?.case_number} />
//                 <InfoRow label="Case Title" value={breakdown.case_details?.case_title} />
//                 <InfoRow label="Category" value={breakdown.case_details?.category} />
//                 <InfoRow label="Case Date" value={new Date(breakdown.case_details?.case_date).toLocaleString()} />
//                 <InfoRow label="Raised By" value={breakdown.case_details?.raised_by} />
//             </CardContent>
//         </Card>
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <DollarSign className="w-5 h-5 text-red-500" />
//                 <h4 className="font-semibold">Deduction Details</h4>
//             </CardHeader>
//             <CardContent>
//                  <InfoRow label="Deduction Type" value={breakdown.deduction_type} />
//                  <InfoRow label="Reason" value={breakdown.deduction_details?.deduction_reason} />
//                  <InfoRow label="Approved Amount" value={`₹${parseFloat(breakdown.deduction_details?.approved_amount).toLocaleString()}`} />
//             </CardContent>
//         </Card>
//     </div>
// );

// const ExpenseReimbursementBreakdown = ({ breakdown }: { breakdown: any }) => (
//     <div className="space-y-4">
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <Receipt className="w-5 h-5 text-gray-500" />
//                 <h4 className="font-semibold">Expense Details</h4>
//             </CardHeader>
//             <CardContent>
//                 <InfoRow label="Expense ID" value={breakdown.expense_details?.expense_id} />
//                 <InfoRow label="Title" value={breakdown.expense_details?.expense_title} />
//                 <InfoRow label="Category" value={breakdown.expense_details?.category} />
//                 <InfoRow label="Expense Date" value={new Date(breakdown.expense_details?.expense_date).toLocaleDateString()} />
//                 <InfoRow label="Approved By" value={breakdown.expense_details?.approved_by} />
//                 <InfoRow label="Approval Date" value={new Date(breakdown.expense_details?.approval_date).toLocaleDateString()} />
//             </CardContent>
//         </Card>
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                  <DollarSign className="w-5 h-5 text-green-500" />
//                 <h4 className="font-semibold">Reimbursement Details</h4>
//             </CardHeader>
//             <CardContent>
//                  <InfoRow label="Reimbursement Type" value={breakdown.reimbursement_type} />
//                  <InfoRow label="Method" value={breakdown.reimbursement_details?.reimbursement_method} />
//                  <InfoRow label="Approved Amount" value={`₹${parseFloat(breakdown.reimbursement_details?.approved_amount).toLocaleString()}`} />
//             </CardContent>
//         </Card>
//     </div>
// );

// const LoanBreakdown = ({ breakdown }: { breakdown: any }) => (
//     <div className="space-y-4">
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <Landmark className="w-5 h-5 text-gray-500" />
//                 <h4 className="font-semibold">Loan Details</h4>
//             </CardHeader>
//             <CardContent>
//                 <InfoRow label="Application Number" value={breakdown.loan_details?.application_number} />
//                 <InfoRow label="Loan Type" value={breakdown.loan_details?.loan_type} />
//                 <InfoRow label="Interest Rate" value={`${breakdown.loan_details?.interest_rate}% p.a.`} />
//                 <InfoRow label="Next Due Date" value={new Date(breakdown.loan_details?.due_date).toLocaleDateString()} />
//             </CardContent>
//         </Card>
//         <Card>
//             <CardHeader className="flex-row items-center space-x-3 pb-2">
//                 <DollarSign className="w-5 h-5 text-red-500" />
//                 <h4 className="font-semibold">EMI Schedule Details</h4>
//             </CardHeader>
//             <CardContent>
//                  <InfoRow label="Deduction Type" value={breakdown.deduction_type} />
//                  <InfoRow label="Principal Component" value={`₹${parseFloat(breakdown.schedule_details?.principal_component).toLocaleString()}`} />
//                  <InfoRow label="Interest Component" value={`₹${parseFloat(breakdown.schedule_details?.interest_component).toLocaleString()}`} />
//                  <InfoRow label="EMI Breakdown" value={breakdown.schedule_details?.breakdown_formula} isCode />
//                  <InfoRow label="Total EMI" value={`₹${parseFloat(breakdown.schedule_details?.total_emi).toLocaleString()}`} />
//             </CardContent>
//         </Card>
//     </div>
// );



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
    deleteComponentFromPayslip
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
    Sparkles
} from "lucide-react";
import { ManualAdjustmentDialog } from "./ManualAdjustmentDialog";

// Currency formatter for AED
const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('EN-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numAmount);
};

// Define a more specific type for payslip component details for clarity
type PayslipComponentDetail = PayslipDetails['details'][0];

interface Props {
    cycleId: number;
    cycleStatus: string;
    onStatusChange: () => void;
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

export function ReviewTab({ cycleId, cycleStatus, onStatusChange }: Props) {
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
    
    // State for the new calculation breakdown dialog
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

            toast({ title: "Success", description: "Bulk component added to all payslips." });
            setShowBulkAdd(false);
            setBulkForm({ component_name: '', component_type: 'earning', amount: '', reason: '' });
            await fetchPayslips();
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
                            
                            {cycleStatus === 'Review' && (
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
                <DialogContent className="!max-w-6xl w-[50vw] max-h-[80vh] overflow-y-auto dark:bg-card/95 dark:border-border/20">
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
                        {selectedPayslip?.status !== 'Finalized' && cycleStatus === 'Review' && (
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
const InfoRow = ({ label, value, isCode = false }: { label: string; value?: React.ReactNode; isCode?: boolean }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex justify-between items-start py-2.5 border-b dark:border-border/20 last:border-b-0">
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">{label}</p>
            {isCode ? (
                <code className="text-sm font-medium text-foreground dark:text-foreground/90 bg-muted dark:bg-muted/30 px-2 py-1 rounded-md text-right">{value}</code>
            ) : (
                <p className="text-sm font-medium text-foreground dark:text-foreground/90 text-right">{value}</p>
            )}
        </div>
    );
};

// Calculation Breakdown Dialog
interface BreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: PayslipComponentDetail;
}

const CalculationBreakdownDialog = ({ open, onOpenChange, detail }: BreakdownDialogProps) => {
    const breakdown = detail.calculation_breakdown;

    const renderContent = () => {
        if (!breakdown) {
            return <p className="text-center text-muted-foreground dark:text-muted-foreground/70 py-8">No calculation breakdown available for this component.</p>;
        }

        if (breakdown.source === "Custom Formula Evaluation") {
            return <OvertimeBreakdown breakdown={breakdown} />;
        }
        if (breakdown.calculation_type === "Percentage Based") {
            return <PercentageBreakdown breakdown={breakdown} />;
        }
        if (breakdown.calculation_method === "Hours-based Prorated Calculation") {
            return <ProratedBreakdown breakdown={breakdown} />;
        }
        if (breakdown.source === "HR Case Management System") return <HrCaseBreakdown breakdown={breakdown} />;
        if (breakdown.source === "Expense Management System") return <ExpenseReimbursementBreakdown breakdown={breakdown} />;
        if (breakdown.source === "Loan Management System") return <LoanBreakdown breakdown={breakdown} />;

        return <pre className="text-xs bg-muted dark:bg-muted/30 p-4 rounded-md overflow-x-auto dark:text-foreground/80">{JSON.stringify(breakdown, null, 2)}</pre>;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-card/95 dark:border-border/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center dark:text-foreground/90">
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculation Breakdown: {detail.component_name}
                    </DialogTitle>
                    <DialogDescription className="dark:text-muted-foreground/80">
                        Source: {breakdown?.source || "N/A"}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {renderContent()}
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="dark:bg-primary/90">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Sub-components for rendering specific breakdown types
const ProratedBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <Briefcase className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
                <h4 className="font-semibold dark:text-foreground/90">Base Salary Structure</h4>
            </CardHeader>
            <CardContent>
                <InfoRow label="Monthly Amount" value={formatCurrency(breakdown.base_salary_structure?.monthly_amount)} />
                <InfoRow label="Calculation Type" value={breakdown.base_salary_structure?.calculation_type} />
            </CardContent>
        </Card>

        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <Clock className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
                <h4 className="font-semibold dark:text-foreground/90">Attendance Analysis</h4>
            </CardHeader>
            <CardContent>
                <InfoRow label="Working Days in Period" value={breakdown.attendance_analysis?.working_days_in_period} />
                <InfoRow label="Present Days" value={breakdown.attendance_analysis?.present_days} />
                <InfoRow label="Half Days" value={breakdown.attendance_analysis?.half_days} />
                <InfoRow label="Leave Days" value={breakdown.attendance_analysis?.leave_days} />
                <InfoRow label="Absent Days" value={breakdown.attendance_analysis?.absent_days} />
                <InfoRow label="Total Worked Hours" value={`${breakdown.attendance_analysis?.total_worked_hours} hrs`} />
            </CardContent>
        </Card>
        
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <DollarSign className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
                <h4 className="font-semibold dark:text-foreground/90">Final Calculation</h4>
            </CardHeader>
            <CardContent>
                 <InfoRow label="Hourly Rate Formula" value={breakdown.rate_calculations?.hourly_rate_formula} isCode />
                 <InfoRow label="Final Calculation Formula" value={breakdown.final_calculation?.formula} isCode />
                 <InfoRow label="Computed Amount" value={formatCurrency(breakdown.final_calculation?.computed_amount)} />
            </CardContent>
        </Card>
    </div>
);

const PercentageBreakdown = ({ breakdown }: { breakdown: any }) => (
    <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
        <CardHeader className="flex-row items-center space-x-3 pb-2">
            <Percent className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
            <h4 className="font-semibold dark:text-foreground/90">Percentage Based Calculation</h4>
        </CardHeader>
        <CardContent>
            <InfoRow 
                label={`Based on '${breakdown.structure_rule?.based_on_component?.name}'`} 
                value={formatCurrency(breakdown.structure_rule?.based_on_component?.current_value)} 
            />
            <InfoRow label="Percentage Applied" value={`${breakdown.structure_rule?.percentage}%`} />
            <InfoRow label="Calculation Step-by-Step" value={breakdown.calculation_details?.step_by_step} isCode />
            <InfoRow label="Computed Value" value={formatCurrency(breakdown.computed_value)} />
        </CardContent>
    </Card>
);

const OvertimeBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <Hash className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
                <h4 className="font-semibold dark:text-foreground/90">Rate Per Hour Calculation</h4>
            </CardHeader>
            <CardContent>
                <InfoRow label="Context" value={breakdown.calculation_context} />
                <InfoRow label="Expression" value={breakdown.parsed_expression} isCode />
                <InfoRow label="Resulting Rate" value={`${formatCurrency(breakdown.result)}/hr`} />
            </CardContent>
        </Card>
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <Clock className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
                <h4 className="font-semibold dark:text-foreground/90">Approved Overtime Hours</h4>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow className="dark:border-border/20">
                            <TableHead className="dark:text-muted-foreground/80">Date</TableHead>
                            <TableHead className="text-right dark:text-muted-foreground/80">Approved Hours</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {breakdown.overtime_records?.map((rec: any, index: number) => (
                           <TableRow key={index} className="dark:border-border/20">
                                <TableCell className="dark:text-foreground/90">{new Date(rec.date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right dark:text-foreground/90">{parseFloat(rec.approved_hours).toFixed(2)}</TableCell>
                           </TableRow>
                        ))}
                    </TableBody>
                 </Table>
                <div className="pt-2 font-bold text-right dark:text-foreground/90">
                    Total: {breakdown.overtime_details?.total_approved_hours} hrs
                </div>
            </CardContent>
        </Card>
         <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <DollarSign className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
                <h4 className="font-semibold dark:text-foreground/90">Final Overtime Pay</h4>
            </CardHeader>
            <CardContent>
                <InfoRow label="Final Calculation" value={breakdown.overtime_details?.final_calculation} isCode />
                <InfoRow label="Computed Amount" value={formatCurrency(breakdown.computed_amount)} />
            </CardContent>
        </Card>
    </div>
);

const HrCaseBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <Gavel className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
                <h4 className="font-semibold dark:text-foreground/90">Case Details</h4>
            </CardHeader>
            <CardContent>
                <InfoRow label="Case Number" value={breakdown.case_details?.case_number} />
                <InfoRow label="Case Title" value={breakdown.case_details?.case_title} />
                <InfoRow label="Category" value={breakdown.case_details?.category} />
                <InfoRow label="Case Date" value={new Date(breakdown.case_details?.case_date).toLocaleString()} />
                <InfoRow label="Raised By" value={breakdown.case_details?.raised_by} />
            </CardContent>
        </Card>
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <DollarSign className="w-5 h-5 text-red-500 dark:text-red-400" />
                <h4 className="font-semibold dark:text-foreground/90">Deduction Details</h4>
            </CardHeader>
            <CardContent>
                 <InfoRow label="Deduction Type" value={breakdown.deduction_type} />
                 <InfoRow label="Reason" value={breakdown.deduction_details?.deduction_reason} />
                 <InfoRow label="Approved Amount" value={formatCurrency(breakdown.deduction_details?.approved_amount)} />
            </CardContent>
        </Card>
    </div>
);

const ExpenseReimbursementBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <Receipt className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
                <h4 className="font-semibold dark:text-foreground/90">Expense Details</h4>
            </CardHeader>
            <CardContent>
                <InfoRow label="Expense ID" value={breakdown.expense_details?.expense_id} />
                <InfoRow label="Title" value={breakdown.expense_details?.expense_title} />
                <InfoRow label="Category" value={breakdown.expense_details?.category} />
                <InfoRow label="Expense Date" value={new Date(breakdown.expense_details?.expense_date).toLocaleDateString()} />
                <InfoRow label="Approved By" value={breakdown.expense_details?.approved_by} />
                <InfoRow label="Approval Date" value={new Date(breakdown.expense_details?.approval_date).toLocaleDateString()} />
            </CardContent>
        </Card>
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                 <DollarSign className="w-5 h-5 text-green-500 dark:text-green-400" />
                <h4 className="font-semibold dark:text-foreground/90">Reimbursement Details</h4>
            </CardHeader>
            <CardContent>
                 <InfoRow label="Reimbursement Type" value={breakdown.reimbursement_type} />
                 <InfoRow label="Method" value={breakdown.reimbursement_details?.reimbursement_method} />
                 <InfoRow label="Approved Amount" value={formatCurrency(breakdown.reimbursement_details?.approved_amount)} />
            </CardContent>
        </Card>
    </div>
);

const LoanBreakdown = ({ breakdown }: { breakdown: any }) => (
    <div className="space-y-4">
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <Landmark className="w-5 h-5 text-muted-foreground dark:text-muted-foreground/70" />
                <h4 className="font-semibold dark:text-foreground/90">Loan Details</h4>
            </CardHeader>
            <CardContent>
                <InfoRow label="Application Number" value={breakdown.loan_details?.application_number} />
                <InfoRow label="Loan Type" value={breakdown.loan_details?.loan_type} />
                <InfoRow label="Interest Rate" value={`${breakdown.loan_details?.interest_rate}% p.a.`} />
                <InfoRow label="Next Due Date" value={new Date(breakdown.loan_details?.due_date).toLocaleDateString()} />
            </CardContent>
        </Card>
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
                <DollarSign className="w-5 h-5 text-red-500 dark:text-red-400" />
                <h4 className="font-semibold dark:text-foreground/90">EMI Schedule Details</h4>
            </CardHeader>
            <CardContent>
                 <InfoRow label="Deduction Type" value={breakdown.deduction_type} />
                 <InfoRow label="Principal Component" value={formatCurrency(breakdown.schedule_details?.principal_component)} />
                 <InfoRow label="Interest Component" value={formatCurrency(breakdown.schedule_details?.interest_component)} />
                 <InfoRow label="EMI Breakdown" value={breakdown.schedule_details?.breakdown_formula} isCode />
                 <InfoRow label="Total EMI" value={formatCurrency(breakdown.schedule_details?.total_emi)} />
            </CardContent>
        </Card>
    </div>
);
