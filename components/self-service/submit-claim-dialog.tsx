"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getExpenseCategories, submitExpenseClaim, type ExpenseCategory } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface SubmitClaimDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function SubmitClaimDialog({ open, onOpenChange, onSuccess }: SubmitClaimDialogProps) {
  const { toast } = useToast()
  const [categories, setCategories] = React.useState<ExpenseCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      getExpenseCategories().then(setCategories).catch(() => {
        toast({ title: "Error", description: "Could not load expense categories.", variant: "destructive" })
      })
    }
  }, [open, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const receiptFile = formData.get("receipt");
    if (!receiptFile || (receiptFile instanceof File && receiptFile.size === 0)) {
        toast({ title: "Error", description: "A receipt must be uploaded.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
      await submitExpenseClaim(formData);
      toast({ title: "Success", description: "Your expense claim has been submitted for approval." });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Expense Claim</DialogTitle>
          <DialogDescription>Fill out the details below to request a reimbursement.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label htmlFor="category_id">Category *</Label><Select name="category_id" required><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger><SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid gap-2"><Label htmlFor="title">Title *</Label><Input id="title" name="title" required /></div>
            <div className="grid gap-2"><Label htmlFor="amount">Amount *</Label><Input id="amount" name="amount" type="number" step="0.01" required /></div>
            <div className="grid gap-2"><Label htmlFor="expense_date">Date of Expense *</Label><Input id="expense_date" name="expense_date" type="date" required /></div>
            <div className="grid gap-2"><Label htmlFor="receipt">Receipt *</Label><Input id="receipt" name="receipt" type="file" required /></div>
            <div className="grid gap-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" /></div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit Claim'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}