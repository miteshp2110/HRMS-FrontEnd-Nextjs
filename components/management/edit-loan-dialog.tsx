"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { editLoan, type LoanRecord } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"

interface EditLoanDialogProps {
  loan: LoanRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoanUpdated: () => void
}

export function EditLoanDialog({ loan, open, onOpenChange, onLoanUpdated }: EditLoanDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<Partial<LoanRecord>>({});
  const [monthlyPayment, setMonthlyPayment] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (loan) {
      setFormData({
        title: loan.title,
        description: loan.description,
        principal_amount: loan.principal_amount,
        total_installments: loan.total_installments,
      });
    }
  }, [loan]);

  React.useEffect(() => {
    const principal = parseFloat(formData.principal_amount || '0');
    const installments = formData.total_installments || 1;
    if (installments > 0) {
      setMonthlyPayment(principal / installments);
    } else {
      setMonthlyPayment(0);
    }
  }, [formData.principal_amount, formData.total_installments]);
  
  if (!loan) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await editLoan(loan.id, formData);
      toast({ title: "Success", description: "Loan details updated successfully." });
      onLoanUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to update loan: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Loan for {loan.employee_name}</DialogTitle>
          <DialogDescription>Update the loan details below. Changes will be reflected immediately.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div><Label htmlFor="title">Title</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange}/></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange}/></div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="principal_amount">Principal Amount ($)</Label><Input id="principal_amount" name="principal_amount" type="number" value={formData.principal_amount} onChange={handleInputChange}/></div>
                <div><Label htmlFor="total_installments">Total Installments</Label><Input id="total_installments" name="total_installments" type="number" value={formData.total_installments} onChange={handleInputChange}/></div>
            </div>
            <Card className="bg-muted/50">
                <CardHeader><CardTitle className="text-base">Calculated Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div><p className="text-sm font-medium">Monthly Payment</p><p className="text-lg font-bold">${monthlyPayment.toFixed(2)}</p></div>
                    <div><p className="text-sm font-medium">Installments Left</p><p className="text-lg font-bold">{loan.remaining_installments}</p></div>
                </CardContent>
            </Card>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}