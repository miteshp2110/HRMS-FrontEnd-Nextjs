"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { processLoanApplication, type LoanApplication } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface LoanApprovalCardProps {
    application: LoanApplication;
    approvalStage: 'Manager Approval' | 'HR Approval' | 'N/A';
    onSuccess: () => void;
}

export function LoanApprovalCard({ application, approvalStage, onSuccess }: LoanApprovalCardProps) {
    const { toast } = useToast();
    const [approvedAmount, setApprovedAmount] = React.useState(String(application.approved_amount || application.requested_amount));
    const [rejectionReason, setRejectionReason] = React.useState('');

    const handleProcess = async (status: 'Approved' | 'Rejected') => {
        if (status === 'Rejected' && !rejectionReason) {
            toast({ title: "Error", description: "Rejection reason is required.", variant: "destructive"});
            return;
        }

        try {
            await processLoanApplication(application.id, {
                status: status, // Backend will handle the next status
                approved_amount: Number(approvedAmount),
                rejection_reason: rejectionReason,
            });
            toast({ title: "Success", description: "Application has been processed." });
            onSuccess();
        } catch (error: any) {
            toast({ title: "Error", description: `Processing failed: ${error.message}`, variant: "destructive" });
        }
    }

    return (
        <Card>
            <CardHeader><CardTitle>{approvalStage} Action</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="approved_amount">Approved Amount</Label>
                    <Input id="approved_amount" type="number" value={approvedAmount} onChange={e => setApprovedAmount(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="rejection_reason">Rejection Reason</Label>
                    <Textarea id="rejection_reason" placeholder="Required if rejecting..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="destructive" onClick={() => handleProcess('Rejected')}>Reject</Button>
                    <Button onClick={() => handleProcess('Approved')}>Approve</Button>
                </div>
            </CardContent>
        </Card>
    );
}