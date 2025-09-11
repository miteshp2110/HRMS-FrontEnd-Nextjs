"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateExpense, type ExpenseRecord } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface EditExpenseDialogProps {
  expense: ExpenseRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onExpenseUpdated: () => void
}

export function EditExpenseDialog({ expense, open, onOpenChange, onExpenseUpdated }: EditExpenseDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({ expense_title: '', expense_description: '', expense: '' });
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (expense) {
      setFormData({
        expense_title: expense.expense_title,
        expense_description: expense.expense_description,
        expense: String(expense.expense)
      });
    }
  }, [expense]);

  if (!expense) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateExpense(expense.id, {
          expense_title: formData.expense_title,
          expense_description: formData.expense_description,
          expense: Number(formData.expense)
      });
      toast({ title: "Success", description: "Expense updated successfully." });
      onExpenseUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to update expense: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Expense Record</DialogTitle>
          <DialogDescription>
            Update the expense details for {expense.first_name} {expense.last_name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="expense_title">Expense Title</Label>
                <Input id="expense_title" value={formData.expense_title} onChange={(e) => setFormData({...formData, expense_title: e.target.value})} required/>
            </div>
            <div>
                <Label htmlFor="expense">Amount ($)</Label>
                <Input id="expense" type="number" step="0.01" value={formData.expense} onChange={(e) => setFormData({...formData, expense: e.target.value})} required/>
            </div>
          </div>
          <div>
            <Label htmlFor="expense_description">Description</Label>
            <Textarea id="expense_description" value={formData.expense_description} onChange={(e) => setFormData({...formData, expense_description: e.target.value})}/>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}