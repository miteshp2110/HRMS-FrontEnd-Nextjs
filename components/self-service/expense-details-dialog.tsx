"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  deleteExpenseClaim,
  type ExpenseClaim,
  updateExpenseClaim,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Calendar,
  FileText,
  AlertCircle,
  Receipt,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react"

// Format number as AED currency
const formatAED = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount)
}

interface ExpenseDetailsDialogProps {
  claim: ExpenseClaim | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onActionSuccess: () => void
}

export function ExpenseDetailsDialog({ claim, open, onOpenChange, onActionSuccess }: ExpenseDetailsDialogProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<ExpenseClaim>>({})

  React.useEffect(() => {
    if (claim) {
      setFormData({
        title: claim.title,
        description: claim.description,
        amount: claim.amount,
        expense_date: claim.expense_date,
      })
      setIsEditing(false)
    }
  }, [claim])

  if (!claim) return null

  const handleUpdate = async () => {
    if (!formData.title?.trim() || !formData.amount) {
      toast({ 
        title: "Validation Error", 
        description: "Please fill all required fields.", 
        variant: "destructive" 
      })
      return
    }

    setIsUpdating(true)
    try {
      await updateExpenseClaim({
        title: formData.title!,
        description: formData.description!,
        amount: formData.amount!
      }, claim.id)
      toast({ title: "Success", description: "Claim updated successfully." })
      onActionSuccess()
      onOpenChange(false)
      setIsEditing(false)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Failed to update claim: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteExpenseClaim(claim.id)
      toast({ title: "Success", description: "Claim deleted successfully." })
      onActionSuccess()
      onOpenChange(false)
      setShowDeleteAlert(false)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Failed to delete claim: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Pending': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Approved': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
      'Reimbursed': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Processed': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100', icon: CheckCircle },
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: Clock }
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl h-[80vh] overflow-x-scroll">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Receipt className="h-6 w-6" />
              Expense Claim Details
            </DialogTitle>
            <DialogDescription>
              Submitted on {new Date(claim.created_at).toLocaleDateString('en-AE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* Status Alert */}
            {claim.status === 'Rejected' && claim.rejection_reason && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Claim Rejected</AlertTitle>
                <AlertDescription>{claim.rejection_reason}</AlertDescription>
              </Alert>
            )}

            {claim.status === 'Reimbursed' && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900 dark:text-green-100">Claim Reimbursed</AlertTitle>
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Your claim has been successfully reimbursed.
                </AlertDescription>
              </Alert>
            )}

            {isEditing && claim.status === 'Pending' ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Title *
                  </Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={isUpdating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Amount (AED) *
                  </Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    step="0.01"
                    value={formData.amount} 
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    disabled={isUpdating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expense_date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Expense Date
                  </Label>
                  <Input 
                    id="expense_date" 
                    type="date" 
                    value={new Date(formData.expense_date!).toISOString().split('T')[0]} 
                    onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                    disabled={isUpdating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            ) : (
              /* View Mode */
              <>
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Claim Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <FileText className="h-4 w-4" />
                          Title
                        </div>
                        <div className="font-semibold">{claim.title}</div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <DollarSign className="h-4 w-4" />
                          Amount
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatAED(claim.amount)}
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Receipt className="h-4 w-4" />
                          Category
                        </div>
                        <div className="font-semibold">{claim.category_name}</div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          Expense Date
                        </div>
                        <div className="font-semibold">
                          {new Date(claim.expense_date).toLocaleDateString('en-AE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                          <AlertCircle className="h-4 w-4" />
                          Status
                        </div>
                        {getStatusBadge(claim.status)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                          <FileText className="h-4 w-4" />
                          Description
                        </div>
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {claim.description || "No description provided."}
                        </p>
                      </div>

                      {claim.receipt_url && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                            <Receipt className="h-4 w-4" />
                            Receipt
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                          >
                            <a 
                              href={claim.receipt_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Receipt
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Reimbursement Details */}
                {(claim.status === 'Reimbursed' || claim.status === 'Locked') && (
                  <Card className="border-green-200 dark:border-green-900">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                      <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Reimbursement Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Method</div>
                          <div className="font-semibold">{claim.reimbursement_method}</div>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">
                            {claim.reimbursement_method === 'Payroll' ? 'Payslip Id' : 'Transaction ID'}
                          </div>
                          <div className="font-mono font-semibold">
                            {claim.reimbursement_method === 'Payroll' 
                              ? (claim.reimbursed_in_payroll_id || "Processing...")
                              : (claim.transaction_id || "N/A")}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            {isEditing && claim.status === 'Pending' ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      title: claim.title,
                      description: claim.description,
                      amount: claim.amount,
                      expense_date: claim.expense_date,
                    })
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                {claim.status === 'Pending' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      onClick={() => setShowDeleteAlert(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Delete Expense Claim?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense claim for <strong>{claim.title}</strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Claim
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
