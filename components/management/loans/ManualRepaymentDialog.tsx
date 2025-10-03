"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { manualRepayment, type AmortizationEntry } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ManualRepaymentDialogProps {
    scheduleEntry: AmortizationEntry | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ManualRepaymentDialog({ scheduleEntry, open, onOpenChange, onSuccess }: ManualRepaymentDialogProps) {
    const { toast } = useToast();
    const [formData, setFormData] = React.useState({
        repayment_date: new Date().toISOString().split('T')[0],
        transaction_id: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    if (!scheduleEntry) return null;

    const handleSubmit = async () => {
        if (!formData.repayment_date || !formData.transaction_id) {
            toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await manualRepayment(scheduleEntry.id, formData);
            toast({ title: "Success", description: "Repayment has been recorded successfully." });
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to record repayment: ${error.message}`, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Record Manual Repayment</DialogTitle>
                    <DialogDescription>
                        For EMI of ${Number(scheduleEntry.emi_amount).toFixed(2)} due on {new Date(scheduleEntry.due_date).toLocaleDateString()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="repayment_date">Repayment Date</Label>
                        <Input 
                            id="repayment_date" 
                            type="date"
                            value={formData.repayment_date} 
                            onChange={(e) => setFormData({...formData, repayment_date: e.target.value})}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="transaction_id">Transaction ID / Reference</Label>
                        <Input 
                            id="transaction_id" 
                            value={formData.transaction_id} 
                            onChange={(e) => setFormData({...formData, transaction_id: e.target.value})}
                            required
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Repayment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}