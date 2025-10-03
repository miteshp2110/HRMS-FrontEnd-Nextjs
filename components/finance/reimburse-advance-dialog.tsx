"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reimburseAdvance, type ExpenseClaim } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ReimburseAdvanceDialogProps {
    claim: ExpenseClaim | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ReimburseAdvanceDialog({ claim, open, onOpenChange, onSuccess }: ReimburseAdvanceDialogProps) {
    const { toast } = useToast();
    const [transactionId, setTransactionId] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    if (!claim) return null;

    const handleSubmit = async () => {
        if (!transactionId) {
            toast({ title: "Error", description: "Transaction ID is required.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await reimburseAdvance(claim.id, transactionId);
            toast({ title: "Success", description: "Advance has been marked as reimbursed." });
            onSuccess();
            onOpenChange(false);
            setTransactionId("");
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to reimburse: ${error.message}`, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reimburse Advance</DialogTitle>
                    <DialogDescription>
                        Confirm reimbursement for {claim.employee_name} for the amount of ${claim.amount.toLocaleString()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <p><strong>Title:</strong> {claim.title}</p>
                    <p><strong>Approved by:</strong> {claim.approver_name}</p>
                    <div>
                        <Label htmlFor="transaction_id">Transaction ID *</Label>
                        <Input 
                            id="transaction_id" 
                            value={transactionId} 
                            onChange={(e) => setTransactionId(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Confirm Reimbursement"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}