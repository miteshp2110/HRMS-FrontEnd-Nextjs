"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { disburseLeaveEncashment, type LeaveEncashmentRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Props {
    request: LeaveEncashmentRequest | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function LeaveEncashmentDisbursementDialog({ request, open, onOpenChange, onSuccess }: Props) {
    const { toast } = useToast();
    const [jvNumber, setJvNumber] = React.useState('');

    if (!request) return null;

    const handleDisburse = async () => {
         if (!jvNumber) {
            toast({ title: "Validation Error", description: "JV Number is required for disbursement.", variant: "destructive"});
            return;
        }

        try {
            await disburseLeaveEncashment(request.id, { jv_number: jvNumber });
            toast({ title: "Success", description: "Request has been disbursed and will be processed in the next payroll."});
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Disbursement failed: ${error.message}`, variant: "destructive" });
        }
    }

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Disburse Encashment Request</DialogTitle>
                     <DialogDescription>
                        Confirm disbursement for {request.employee_name} for an amount of ${Number(request.calculated_amount).toLocaleString()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="jv_number">JV Number</Label>
                        <Input id="jv_number" value={jvNumber} onChange={e => setJvNumber(e.target.value)} required />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleDisburse}><Check className="h-4 w-4 mr-2"/>Confirm & Disburse</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}