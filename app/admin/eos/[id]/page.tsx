"use client"

import * as React from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Handshake, MinusCircle, Receipt, Wallet } from "lucide-react";
import { getSettlementDetails, approveSettlement, recordEosPayment, type EosSettlementDetails } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { LeaveEncashmentCard } from "@/components/admin/eos/LeaveEncashmentCard";
import { GratuityCard } from "@/components/admin/eos/GratuityCard";
import { DeductionsCard } from "@/components/admin/eos/DeductionsCard";

export default function SettlementDetailPage() {
    const params = useParams();
    const settlementId = Number(params.id);
    const { toast } = useToast();
    
    const [settlement, setSettlement] = React.useState<EosSettlementDetails | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
    const [jvNumber, setJvNumber] = React.useState('');

    const fetchData = React.useCallback(async () => {
        if (!settlementId) return;
        setIsLoading(true);
        try {
            const data = await getSettlementDetails(settlementId);
            setSettlement(data);
        } catch (error: any) {
            toast({ title: "Error", description: `Could not load settlement details: ${error.message}`, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [settlementId, toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApprove = async () => {
        if (!window.confirm("Are you sure you want to approve this settlement? This action cannot be undone.")) return;
        try {
            await approveSettlement(settlementId);
            toast({ title: "Success", description: "Settlement has been approved." });
            fetchData();
        } catch(error: any) {
            toast({ title: "Error", description: `Approval failed: ${error.message}`, variant: "destructive" });
        }
    }

    const handleRecordPayment = async () => {
        if (!jvNumber) {
            toast({ title: "Error", description: "JV Number is required.", variant: "destructive" });
            return;
        }
        try {
            await recordEosPayment(settlementId, { jv_number: jvNumber });
            toast({ title: "Success", description: "Payment has been recorded." });
            fetchData();
            setIsPaymentDialogOpen(false);
        } catch(error: any) {
            toast({ title: "Error", description: `Payment failed: ${error.message}`, variant: "destructive" });
        }
    }

    if (isLoading || !settlement) {
        return <MainLayout><Skeleton className="h-screen w-full" /></MainLayout>
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Final Settlement for {settlement.employee_name}</h1>
                    <p className="text-muted-foreground flex items-center gap-4">
                        <span>{settlement.termination_type} on {new Date(settlement.last_working_date).toLocaleDateString()}</span>
                        <Badge>{settlement.status}</Badge>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Breakdown Cards */}
                        <LeaveEncashmentCard breakdown={settlement.leave_encashment_breakdown} totalAmount={settlement.leave_encashment_amount} />
                        <GratuityCard breakdown={settlement.gratuity_breakdown} totalAmount={settlement.gratuity_amount} />
                        <DeductionsCard 
                            loanBreakdown={settlement.loan_deduction_breakdown}
                            caseBreakdown={settlement.case_deduction_breakdown}
                            otherDeductions={settlement.other_deductions}
                            settlementId={settlement.id}
                            isFinalized={settlement.status !== 'Pending'}
                            onSuccess={fetchData}
                        />
                    </div>
                    <div className="space-y-6 sticky top-24">
                        <Card>
                            <CardHeader><CardTitle>Final Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-4 text-lg">
                                 <p className="flex justify-between"><span>Total Additions:</span> <span className="font-semibold">${Number(settlement.total_additions).toLocaleString()}</span></p>
                                 <p className="flex justify-between"><span>Total Deductions:</span> <span className="font-semibold text-red-500">-${Number(settlement.total_deductions).toLocaleString()}</span></p>
                                 <hr />
                                 <p className="flex justify-between text-xl"><strong>Net Settlement:</strong> <strong className="text-primary">${Number(settlement.net_settlement_amount).toLocaleString()}</strong></p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                            <CardContent>
                                {settlement.status === 'Pending' && <Button className="w-full" onClick={handleApprove}><CheckCircle className="h-4 w-4 mr-2"/>Approve Settlement</Button>}
                                {settlement.status === 'Approved' && <Button className="w-full" onClick={() => setIsPaymentDialogOpen(true)}><Receipt className="h-4 w-4 mr-2"/>Record Payment</Button>}
                                {settlement.status === 'Paid' && <p className="text-sm text-muted-foreground">This settlement has been paid. <br/><strong>JV Number:</strong> {settlement.jv_number}</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Record Payment</DialogTitle><DialogDescription>Enter the Journal Voucher (JV) number for this transaction.</DialogDescription></DialogHeader>
                    <div className="py-4"><div className="grid gap-2"><Label htmlFor="jv_number">JV Number</Label><Input id="jv_number" value={jvNumber} onChange={e => setJvNumber(e.target.value)}/></div></div>
                    <DialogFooter><Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button><Button onClick={handleRecordPayment}>Save Payment</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    )
}