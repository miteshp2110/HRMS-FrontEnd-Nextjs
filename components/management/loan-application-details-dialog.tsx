// "use client"

// import * as React from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { getLoanApplicationDetails, processLoanApplication, disburseLoan, manualRepayment, forecloseLoan, type LoanApplication } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface LoanApplicationDetailsDialogProps {
//     application: LoanApplication | null;
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     onSuccess: () => void;
// }

// export function LoanApplicationDetailsDialog({ application, open, onOpenChange, onSuccess }: LoanApplicationDetailsDialogProps) {
//     const { toast } = useToast();
//     const [details, setDetails] = React.useState<LoanApplication | null>(null);
//     const [isLoading, setIsLoading] = React.useState(false);

//     // Form state for actions
//     const [approvedAmount, setApprovedAmount] = React.useState('');
//     const [rejectionReason, setRejectionReason] = React.useState('');
//     const [disbursementDate, setDisbursementDate] = React.useState('');
//     const [jvNumber, setJvNumber] = React.useState('');

//     React.useEffect(() => {
//         if (open && application) {
//             setIsLoading(true);
//             getLoanApplicationDetails(application.id)
//                 .then(data => {
//                     setDetails(data);
//                     setApprovedAmount(String(data.requested_amount));
//                 })
//                 .catch(err => toast({ title: "Error", description: `Could not load details: ${err.message}`, variant: "destructive" }))
//                 .finally(() => setIsLoading(false));
//         }
//     }, [application, open, toast]);

//     if (!details) return null;

//     const handleProcess = async (status: 'Approved' | 'Rejected') => {
//         try {
//             await processLoanApplication(details.id, {
//                 status,
//                 approved_amount: status === 'Approved' ? Number(approvedAmount) : undefined,
//                 rejection_reason: status === 'Rejected' ? rejectionReason : undefined
//             });
//             toast({ title: "Success", description: `Application ${status.toLowerCase()}.` });
//             onSuccess();
//             onOpenChange(false);
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to process: ${error.message}`, variant: "destructive" });
//         }
//     }

//     const handleDisburse = async () => {
//         try {
//             await disburseLoan(details.id, { disbursement_date: disbursementDate, jv_number: jvNumber });
//             toast({ title: "Success", description: "Loan disbursed." });
//             onSuccess();
//             onOpenChange(false);
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to disburse: ${error.message}`, variant: "destructive" });
//         }
//     }

//     const renderActionSection = () => {
//         switch (details.status) {
//             case 'Pending Manager Approval':
//             case 'Pending HR Approval':
//                 return (
//                     <div className="pt-4 border-t space-y-4">
//                         <h3 className="font-semibold">Actions</h3>
//                         <div className="grid gap-2">
//                             <Label htmlFor="approved_amount">Approved Amount</Label>
//                             <Input id="approved_amount" type="number" value={approvedAmount} onChange={e => setApprovedAmount(e.target.value)} />
//                         </div>
//                         <div className="grid gap-2">
//                             <Label htmlFor="rejection_reason">Rejection Reason</Label>
//                             <Textarea id="rejection_reason" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
//                         </div>
//                         <div className="flex gap-2 justify-end">
//                             <Button variant="destructive" onClick={() => handleProcess('Rejected')}>Reject</Button>
//                             <Button onClick={() => handleProcess('Approved')}>Approve</Button>
//                         </div>
//                     </div>
//                 );
//             case 'Approved':
//                  return (
//                     <div className="pt-4 border-t space-y-4">
//                         <h3 className="font-semibold">Disbursement</h3>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="disbursement_date">Disbursement Date</Label>
//                                 <Input id="disbursement_date" type="date" value={disbursementDate} onChange={e => setDisbursementDate(e.target.value)} />
//                             </div>
//                              <div className="grid gap-2">
//                                 <Label htmlFor="jv_number">Journal Voucher #</Label>
//                                 <Input id="jv_number" value={jvNumber} onChange={e => setJvNumber(e.target.value)} />
//                             </div>
//                         </div>
//                         <div className="flex justify-end">
//                             <Button onClick={handleDisburse}>Confirm Disbursement</Button>
//                         </div>
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     }

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-3xl">
//                 <DialogHeader>
//                     <DialogTitle>Loan Application: {details.application_id_text}</DialogTitle>
//                     <DialogDescription>
//                         {details.employee_name} - {details.loan_type_name}
//                     </DialogDescription>
//                 </DialogHeader>
//                 <ScrollArea className="max-h-[60vh] p-4">
//                     <div className="space-y-4">
//                         {/* Details */}
//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                             <div><strong>Requested Amount:</strong> ${details.requested_amount.toLocaleString()}</div>
//                             <div><strong>Approved Amount:</strong> ${details.approved_amount?.toLocaleString() || 'N/A'}</div>
//                             <div><strong>Tenure:</strong> {details.tenure_months} months</div>
//                             <div><strong>Interest Rate:</strong> {details.interest_rate}%</div>
//                             <div className="col-span-2"><strong>Purpose:</strong> {details.purpose}</div>
//                             <div className="col-span-2"><strong>Status:</strong> <Badge>{details.status}</Badge></div>
//                         </div>
                        
//                         {/* Amortization Schedule */}
//                         {details.amortization_schedule && details.amortization_schedule.length > 0 && (
//                             <div className="pt-4 border-t">
//                                 <h3 className="font-semibold mb-2">Amortization Schedule</h3>
//                                 <Table>
//                                     <TableHeader><TableRow><TableHead>Due Date</TableHead><TableHead>EMI</TableHead><TableHead>Principal</TableHead><TableHead>Interest</TableHead><TableHead>Balance</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
//                                     <TableBody>
//                                         {details.amortization_schedule.map(row => (
//                                             <TableRow key={row.id}>
//                                                 <TableCell>{new Date(row.due_date).toLocaleDateString()}</TableCell>
//                                                 <TableCell>${row.emi_amount.toFixed(2)}</TableCell>
//                                                 <TableCell>${row.principal.toFixed(2)}</TableCell>
//                                                 <TableCell>${row.interest.toFixed(2)}</TableCell>
//                                                 <TableCell>${row.balance.toFixed(2)}</TableCell>
//                                                 <TableCell><Badge variant={row.status === 'Paid' ? 'default' : 'secondary'}>{row.status}</Badge></TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </div>
//                         )}
//                         {renderActionSection()}
//                     </div>
//                 </ScrollArea>
//                 <DialogFooter>
//                     <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }

"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLoanApplicationDetails, processLoanApplication, disburseLoan, adminUpdateLoanApplication, type LoanApplication } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit } from "lucide-react";

interface LoanApplicationDetailsDialogProps {
    applicationId: number | null | undefined;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function LoanApplicationDetailsDialog({ applicationId, open, onOpenChange, onSuccess }: LoanApplicationDetailsDialogProps) {
    const { toast } = useToast();
    const [details, setDetails] = React.useState<LoanApplication | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);

    // Form state for actions
    const [approvedAmount, setApprovedAmount] = React.useState('');
    const [interestRate, setInterestRate] = React.useState('');
    const [rejectionReason, setRejectionReason] = React.useState('');
    const [disbursementDate, setDisbursementDate] = React.useState('');
    const [jvNumber, setJvNumber] = React.useState('');

    const fetchDetails = React.useCallback(async () => {
        if (open && applicationId) {
            setIsLoading(true);
            try {
                const data = await getLoanApplicationDetails(applicationId);
                setDetails(data);
                setApprovedAmount(String(data.approved_amount || data.requested_amount));
                setInterestRate(String(data.interest_rate));
                setIsEditing(false); // Reset editing state on new data
            } catch (err: any) {
                toast({ title: "Error", description: `Could not load details: ${err.message}`, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        }
    }, [applicationId, open, toast]);

    React.useEffect(() => {
        fetchDetails();
    }, [applicationId, open]);

    if (!details) return null;

    const handleProcess = async (status: 'Approved' | 'Rejected') => {
        try {
            await processLoanApplication(details.id, {
                status,
                approved_amount: status === 'Approved' ? Number(approvedAmount) : undefined,
                rejection_reason: status === 'Rejected' ? rejectionReason : undefined
            });
            toast({ title: "Success", description: `Application ${status.toLowerCase()}.` });
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to process: ${error.message}`, variant: "destructive" });
        }
    }

    const handleAdminUpdate = async () => {
        try {
            await adminUpdateLoanApplication(details.id, {
                approved_amount: Number(approvedAmount),
                interest_rate: Number(interestRate)
            });
            toast({ title: "Success", description: "Application details updated." });
            fetchDetails(); // Refetch details to show updated data
        } catch (error: any) {
             toast({ title: "Error", description: `Failed to update: ${error.message}`, variant: "destructive" });
        }
    }

    const handleDisburse = async () => {
        try {
            await disburseLoan(details.id, { disbursement_date: disbursementDate, jv_number: jvNumber });
            toast({ title: "Success", description: "Loan disbursed." });
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to disburse: ${error.message}`, variant: "destructive" });
        }
    }

    const renderActionSection = () => {
        // Updated to handle the single 'Pending Approval' status
        if (details.status === 'Pending Approval') {
            return (
                <div className="pt-4 border-t space-y-4">
                    <h3 className="font-semibold">Process Application</h3>
                    <div className="grid gap-2">
                        <Label htmlFor="approved_amount">Approved Amount</Label>
                        <Input id="approved_amount" type="number" value={approvedAmount} onChange={e => setApprovedAmount(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="rejection_reason">Rejection Reason (if rejecting)</Label>
                        <Textarea id="rejection_reason" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="destructive" onClick={() => handleProcess('Rejected')}>Reject</Button>
                        <Button onClick={() => handleProcess('Approved')}>Approve</Button>
                    </div>
                </div>
            );
        }
        if (details.status === 'Approved') {
             return (
                <div className="pt-4 border-t space-y-4">
                    <h3 className="font-semibold">Disbursement Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="disbursement_date">Disbursement Date *</Label>
                            <Input id="disbursement_date" type="date" value={disbursementDate} onChange={e => setDisbursementDate(e.target.value)} required/>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="jv_number">Journal Voucher # *</Label>
                            <Input id="jv_number" value={jvNumber} onChange={e => setJvNumber(e.target.value)} required/>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleDisburse}>Confirm Disbursement</Button>
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Loan Application: {details.application_id_text}</DialogTitle>
                    <DialogDescription>
                        {details.employee_name} - {details.loan_type_name}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] p-4">
                    <div className="space-y-4">
                        {isEditing ? (
                            <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                                <h3 className="font-semibold">Editing Application</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit_approved_amount">Approved Amount</Label>
                                        <Input id="edit_approved_amount" type="number" value={approvedAmount} onChange={e => setApprovedAmount(e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit_interest_rate">Interest Rate (%)</Label>
                                        <Input id="edit_interest_rate" type="number" step="0.01" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleAdminUpdate}>Save Changes</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Requested Amount:</strong> ${details.requested_amount.toLocaleString()}</div>
                                <div><strong>Approved Amount:</strong> ${details.approved_amount?.toLocaleString() || 'N/A'}</div>
                                <div><strong>Tenure:</strong> {details.tenure_months} months</div>
                                <div><strong>Interest Rate:</strong> {details.interest_rate}%</div>
                                <div className="col-span-2"><strong>Purpose:</strong> {details.purpose}</div>
                                <div className="col-span-2"><strong>Status:</strong> <Badge>{details.status}</Badge></div>
                            </div>
                        )}
                        
                        {details.amortization_schedule && details.amortization_schedule.length > 0 && (
                            <div className="pt-4 border-t">
                                <h3 className="font-semibold mb-2">Amortization Schedule</h3>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Due Date</TableHead><TableHead>EMI</TableHead><TableHead>Principal</TableHead><TableHead>Interest</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {details.amortization_schedule.map(row => (
                                            <TableRow key={row.id}>
                                                <TableCell>{new Date(row.due_date).toLocaleDateString()}</TableCell>
                                                <TableCell>${row.emi_amount}</TableCell>
                                                <TableCell>${row.principal_component}</TableCell>
                                                <TableCell>${row.interest_component}</TableCell>
                                                
                                                <TableCell><Badge variant={row.status === 'Paid' ? 'default' : 'secondary'}>{row.status}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                        {renderActionSection()}
                    </div>
                </ScrollArea>
                <DialogFooter className="flex justify-between w-full">
                    <div>
                        {details.status !== 'Disbursed' && details.status !== 'Closed' && !isEditing && (
                            <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-2" /> Edit Rate/Amount</Button>
                        )}
                    </div>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}