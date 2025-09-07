"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createExpense } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AddExpenseDialogProps {
  employeeId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onExpenseAdded: () => void
}

export function AddExpenseDialog({ employeeId, open, onOpenChange, onExpenseAdded }: AddExpenseDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    expense_title: "",
    expense_description: "",
    expense: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await createExpense({
        employee_id: employeeId,
        expense_title: formData.expense_title,
        expense_description: formData.expense_description,
        expense: Number(formData.expense),
      })
      toast({ title: "Success", description: "Expense record added successfully." })
      onExpenseAdded()
      onOpenChange(false)
      setFormData({ expense_title: "", expense_description: "", expense: "" }) // Reset form
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add expense: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Add a new expense record for this employee. This is typically used for reimbursements.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expense_title" className="text-right">
                Title
              </Label>
              <Input id="expense_title" name="expense_title" value={formData.expense_title} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expense_description" className="text-right">
                Description
              </Label>
              <Textarea id="expense_description" name="expense_description" value={formData.expense_description} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expense" className="text-right">
                Amount ($)
              </Label>
              <Input id="expense" name="expense" type="number" step="0.01" value={formData.expense} onChange={handleInputChange} className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}