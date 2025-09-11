"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addRepayment, getLoanRepayments, type LoanRecord, type LoanRepayment } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AddRepaymentDialogProps {
  loan: LoanRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onRepaymentAdded: () => void
}

export function AddRepaymentDialog({ loan, open, onOpenChange, onRepaymentAdded }: AddRepaymentDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [remainingAmount, setRemainingAmount] = React.useState(0);

  React.useEffect(() => {
    if (loan && open) {
      // Fetch repayments to calculate the remaining amount accurately
      getLoanRepayments(loan.id).then(repayments => {
        const totalPaid = repayments.reduce((sum, item) => sum + Number(item.repayment_amount), 0);
        setRemainingAmount(Number(loan.principal_amount) - totalPaid);
      });
      setAmount(""); // Reset amount on open
    }
  }, [loan, open]);

  if (!loan) return null;

  const handleSave = async () => {
    const repaymentAmount = parseFloat(amount);
    if (isNaN(repaymentAmount) || repaymentAmount <= 0) {
        toast({ title: "Error", description: "Please enter a valid positive amount.", variant: "destructive" });
        return;
    }
    if (repaymentAmount > remainingAmount) {
        toast({ title: "Error", description: `Amount cannot be greater than the remaining balance of $${remainingAmount.toLocaleString()}.`, variant: "destructive" });
        return;
    }

    setIsSaving(true);
    try {
      await addRepayment(loan.id, repaymentAmount);
      toast({ title: "Success", description: "Repayment was successfully added." });
      onRepaymentAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to add repayment: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Manual Repayment</DialogTitle>
          <DialogDescription>
            Log a new repayment for {loan.employee_name}'s loan: "{loan.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
                <Label>Amount Remaining</Label>
                <p className="text-2xl font-bold">${remainingAmount.toLocaleString()}</p>
            </div>
            <div>
                <Label htmlFor="amount">Repayment Amount</Label>
                <Input id="amount" name="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Add Payment'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}