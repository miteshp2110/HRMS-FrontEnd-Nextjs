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
import { Loader2, FileText } from "lucide-react"

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
    jv: "",
  })
  const [errors, setErrors] = React.useState({
    expense_title: "",
    expense: "",
    jv: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors = {
      expense_title: "",
      expense: "",
      jv: "",
    }
    let isValid = true

    // Validate title
    if (!formData.expense_title.trim()) {
      newErrors.expense_title = "Expense title is required"
      isValid = false
    } else if (formData.expense_title.length < 3) {
      newErrors.expense_title = "Title must be at least 3 characters"
      isValid = false
    }

    // Validate amount
    if (!formData.expense) {
      newErrors.expense = "Amount is required"
      isValid = false
    } else if (Number(formData.expense) <= 0) {
      newErrors.expense = "Amount must be greater than 0"
      isValid = false
    }

    // Validate JV number (optional but if provided must be valid)
    if (formData.jv && formData.jv.length < 2) {
      newErrors.jv = "JV number must be at least 2 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await createExpense({
        employee_id: employeeId,
        expense_title: formData.expense_title.trim(),
        expense_description: formData.expense_description.trim(),
        expense: Number(formData.expense),
        jv: formData.jv.trim(),
      })
      
      toast({ 
        title: "Success", 
        description: "Employee expense recorded successfully.",
      })
      
      onExpenseAdded()
      onOpenChange(false)
      
      // Reset form after successful submission
      setFormData({ 
        expense_title: "", 
        expense_description: "", 
        expense: "",
        jv: "" 
      })
      setErrors({ expense_title: "", expense: "", jv: "" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record expense.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      setFormData({ 
        expense_title: "", 
        expense_description: "", 
        expense: "",
        jv: "" 
      })
      setErrors({ expense_title: "", expense: "", jv: "" })
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Record Employee Expense
          </DialogTitle>
          <DialogDescription>
            Record expenses incurred by the company for this employee such as visa processing, training fees, equipment costs, etc.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="expense_title">
                Expense Type <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="expense_title" 
                name="expense_title" 
                value={formData.expense_title} 
                onChange={handleInputChange}
                placeholder="e.g., Visa Processing, Training Course, Work Permit"
                disabled={isLoading}
                className={errors.expense_title ? "border-destructive" : ""}
              />
              {errors.expense_title && (
                <p className="text-sm text-destructive">{errors.expense_title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense_description">
                Description
              </Label>
              <Textarea 
                id="expense_description" 
                name="expense_description" 
                value={formData.expense_description} 
                onChange={handleInputChange}
                placeholder="Provide details about this expense (vendor, purpose, date incurred, etc.)"
                rows={3}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add notes about vendor, invoice details, or purpose.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense">
                  Amount (AED) <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="expense" 
                  name="expense" 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  value={formData.expense} 
                  onChange={handleInputChange}
                  placeholder="0.00"
                  disabled={isLoading}
                  className={errors.expense ? "border-destructive" : ""}
                />
                {errors.expense && (
                  <p className="text-sm text-destructive">{errors.expense}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jv">
                  JV Number
                </Label>
                <Input 
                  id="jv" 
                  name="jv" 
                  value={formData.jv} 
                  onChange={handleInputChange}
                  placeholder="JV-001"
                  disabled={isLoading}
                  className={errors.jv ? "border-destructive" : ""}
                />
                {errors.jv && (
                  <p className="text-sm text-destructive">{errors.jv}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Journal voucher reference number
                </p>
              </div>
            </div>

            {formData.expense && Number(formData.expense) > 0 && (
              <div className="rounded-lg bg-muted p-3 border">
                <p className="text-sm text-muted-foreground">
                  Total Expense: <span className="font-semibold text-foreground">
                    {new Intl.NumberFormat('en-AE', {
                      style: 'currency',
                      currency: 'AED',
                    }).format(Number(formData.expense))}
                  </span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Recording..." : "Record Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
