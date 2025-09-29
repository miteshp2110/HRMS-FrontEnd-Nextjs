"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { approveLeaveEncashment, type LeaveEncashmentRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Props {
    request: LeaveEncashmentRequest | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function LeaveEncashmentApprovalDialog({ request, open, onOpenChange, onSuccess }: Props) {
    const { toast } = useToast();
    const [rejectionReason, setRejectionReason] = React.useState('');

    if (!request) return null;

    const handleProcess = async (status: 'Approved' | 'Rejected') => {
         if (status === 'Rejected' && !rejectionReason) {
            toast({ title: "Validation Error", description: "Rejection reason is required.", variant: "destructive"});
            return;
        }

        try {
            await approveLeaveEncashment(request.id, { status, rejection_reason: rejectionReason });
            toast({ title: "Success", description: "Request has been processed."});
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Processing failed: ${error.message}`, variant: "destructive" });
        }
    }

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review Encashment Request</DialogTitle>
                    <DialogDescription>
                        {request.employee_name} is requesting to encash {request.days_to_encash} days for an amount of ${Number(request.calculated_amount).toLocaleString()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="rejection_reason">Rejection Reason</Label>
                        <Textarea id="rejection_reason" placeholder="Required if rejecting..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="destructive" onClick={() => handleProcess('Rejected')}><X className="h-4 w-4 mr-2"/>Reject</Button>
                    <Button onClick={() => handleProcess('Approved')}><Check className="h-4 w-4 mr-2"/>Approve</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}