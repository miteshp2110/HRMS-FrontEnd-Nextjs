// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Banknote, CheckCircle } from "lucide-react";
// import { getExpenseClaims, reimburseExpenseClaim, type ExpenseClaim } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// export default function FinancePage() {
//     const { toast } = useToast();
//     const [approvedClaims, setApprovedClaims] = React.useState<ExpenseClaim[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [selectedClaim, setSelectedClaim] = React.useState<ExpenseClaim | null>(null);
//     const [isReimburseDialogOpen, setIsReimburseDialogOpen] = React.useState(false);
//     const [reimbursementMethod, setReimbursementMethod] = React.useState<'Payroll' | 'Direct Transfer' | ''>('');
//     const [transactionId, setTransactionId] = React.useState("");

//     const fetchApprovedClaims = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const allClaims = await getExpenseClaims({ status: 'Approved' });
//             setApprovedClaims(allClaims);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load approved claims.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => {
//         fetchApprovedClaims();
//     }, [fetchApprovedClaims]);

//     const handleReimburseClick = (claim: ExpenseClaim) => {
//         setSelectedClaim(claim);
//         setIsReimburseDialogOpen(true);
//     }

//     const handleConfirmReimbursement = async () => {
//         if (!selectedClaim || !reimbursementMethod) {
//             toast({ title: "Error", description: "Please select a reimbursement method.", variant: "destructive" });
//             return;
//         }
//         if (reimbursementMethod === 'Direct Transfer' && !transactionId) {
//             toast({ title: "Error", description: "Transaction ID is required for direct transfer.", variant: "destructive" });
//             return;
//         }

//         try {
//             await reimburseExpenseClaim(selectedClaim.id, {
//                 reimbursement_method: reimbursementMethod,
//                 transaction_id: reimbursementMethod === 'Direct Transfer' ? transactionId : "undefined"
//             });
//             toast({ title: "Success", description: "Claim has been marked as reimbursed." });
//             fetchApprovedClaims();
//             setIsReimburseDialogOpen(false);
//             setReimbursementMethod('');
//             setTransactionId('');
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to reimburse: ${error.message}`, variant: "destructive" });
//         }
//     }

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                     <Banknote className="h-8 w-8" />
//                     <div>
//                         <h1 className="text-3xl font-bold">Finance & Reimbursements</h1>
//                         <p className="text-muted-foreground">Manage expense reimbursement settings and financial configurations.</p>
//                     </div>
//                 </div>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Pending Reimbursements</CardTitle>
//                         <CardDescription>
//                             These claims have been approved by managers and are ready for reimbursement.
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Employee</TableHead>
//                                     <TableHead>Title</TableHead>
//                                     <TableHead>Amount</TableHead>
//                                     <TableHead>Approved By</TableHead>
//                                     <TableHead className="text-right">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {approvedClaims.map(claim => (
//                                     <TableRow key={claim.id}>
//                                         <TableCell>{claim.employee_name}</TableCell>
//                                         <TableCell>{claim.title}</TableCell>
//                                         <TableCell>${claim.amount.toLocaleString()}</TableCell>
//                                         <TableCell>{claim.approver_name}</TableCell>
//                                         <TableCell className="text-right">
//                                             <Button size="sm" onClick={() => handleReimburseClick(claim)}>
//                                                 <CheckCircle className="h-4 w-4 mr-2" />
//                                                 Reimburse
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>

//             <Dialog open={isReimburseDialogOpen} onOpenChange={setIsReimburseDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Reimburse Expense</DialogTitle>
//                         <DialogDescription>
//                             Processing claim for {selectedClaim?.employee_name} of ${selectedClaim?.amount.toLocaleString()}
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="py-4 space-y-4">
//                         <a href={selectedClaim?.receipt_url || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">View Receipt</a>
                        
//                         <div className="grid gap-2">
//                             <Label>Reimbursement Method</Label>
//                             <Select onValueChange={(value: 'Payroll' | 'Direct Transfer') => setReimbursementMethod(value)}>
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select Method" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="Payroll">Add to next Payroll</SelectItem>
//                                     <SelectItem value="Direct Transfer">Direct Transfer</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         {reimbursementMethod === 'Direct Transfer' && (
//                             <div className="grid gap-2">
//                                 <Label htmlFor="transaction_id">Transaction ID</Label>
//                                 <Input id="transaction_id" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
//                             </div>
//                         )}
//                     </div>
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setIsReimburseDialogOpen(false)}>Cancel</Button>
//                         <Button onClick={handleConfirmReimbursement}>Confirm Reimbursement</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </MainLayout>
//     )
// }


"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, CheckCircle, Eye } from "lucide-react";
import { getExpenseClaims, reimburseExpenseClaim, type ExpenseClaim } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function FinancePage() {
    const { toast } = useToast();
    const [approvedClaims, setApprovedClaims] = React.useState<ExpenseClaim[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedClaim, setSelectedClaim] = React.useState<ExpenseClaim | null>(null);
    const [isReimburseDialogOpen, setIsReimburseDialogOpen] = React.useState(false);
    const [reimbursementMethod, setReimbursementMethod] = React.useState<'Payroll' | 'Direct Transfer' | ''>('');
    const [transactionId, setTransactionId] = React.useState("");

    const fetchApprovedClaims = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const allClaims = await getExpenseClaims({ status: 'Approved' });
            setApprovedClaims(allClaims);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load approved claims.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchApprovedClaims();
    }, [fetchApprovedClaims]);

    const handleReimburseClick = (claim: ExpenseClaim) => {
        setSelectedClaim(claim);
        setIsReimburseDialogOpen(true);
    }

    const handleConfirmReimbursement = async () => {
        if (!selectedClaim || !reimbursementMethod) {
            toast({ title: "Error", description: "Please select a reimbursement method.", variant: "destructive" });
            return;
        }
        if (reimbursementMethod === 'Direct Transfer' && !transactionId) {
            toast({ title: "Error", description: "Transaction ID is required for direct transfer.", variant: "destructive" });
            return;
        }

        try {
            const payload: {
                reimbursement_method: 'Payroll' | 'Direct Transfer';
                transaction_id: string;
            } = {
                reimbursement_method: reimbursementMethod,
                transaction_id:""
            };

            if (reimbursementMethod === 'Direct Transfer') {
                payload.transaction_id = transactionId;
            }

            await reimburseExpenseClaim(selectedClaim.id, payload);
            toast({ title: "Success", description: "Claim has been marked as reimbursed." });
            fetchApprovedClaims();
            setIsReimburseDialogOpen(false);
            setReimbursementMethod('');
            setTransactionId('');
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to reimburse: ${error.message}`, variant: "destructive" });
        }
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Banknote className="h-8 w-8" />
                    <div>
                        <h1 className="text-3xl font-bold">Finance & Reimbursements</h1>
                        <p className="text-muted-foreground">Manage expense reimbursement settings and financial configurations.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Reimbursements</CardTitle>
                        <CardDescription>
                            These claims have been approved by managers and are ready for reimbursement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Approved By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {approvedClaims.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No pending reimbursements found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    approvedClaims.map(claim => (
                                        <TableRow key={claim.id} onClick={() => handleReimburseClick(claim)} className="cursor-pointer">
                                            <TableCell>{claim.employee_name}</TableCell>
                                            <TableCell>{claim.title}</TableCell>
                                            <TableCell>${claim.amount.toLocaleString()}</TableCell>
                                            <TableCell>{claim.approver_name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm">
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Reimburse
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isReimburseDialogOpen} onOpenChange={setIsReimburseDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reimburse Expense</DialogTitle>
                        <DialogDescription>
                            Processing claim for {selectedClaim?.employee_name} of ${selectedClaim?.amount.toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {selectedClaim?.receipt_url && <a href={selectedClaim.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">View Receipt</a>}
                        
                        <div className="grid gap-2">
                            <Label>Reimbursement Method</Label>
                            <Select onValueChange={(value: 'Payroll' | 'Direct Transfer') => setReimbursementMethod(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Payroll">Add to next Payroll</SelectItem>
                                    <SelectItem value="Direct Transfer">Direct Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {reimbursementMethod === 'Direct Transfer' && (
                            <div className="grid gap-2">
                                <Label htmlFor="transaction_id">Transaction ID</Label>
                                <Input id="transaction_id" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReimburseDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmReimbursement}>Confirm Reimbursement</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    )
}