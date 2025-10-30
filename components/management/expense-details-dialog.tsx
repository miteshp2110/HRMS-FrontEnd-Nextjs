"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  processExpenseClaim,
  adminUpdateExpense,
  type ExpenseClaim,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  FileText,
  Receipt,
  User,
  DollarSign,
  Tag,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  X,
  Banknote,
  Hash,
  CreditCard,
  Lock,
} from "lucide-react"

interface AdminExpenseDetailsDialogProps {
  claim: ExpenseClaim | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onActionSuccess: () => void
}

export function AdminExpenseDetailsDialog({
  claim,
  open,
  onOpenChange,
  onActionSuccess,
}: AdminExpenseDetailsDialogProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<ExpenseClaim>>({})
  const [rejectionReason, setRejectionReason] = React.useState("")

  React.useEffect(() => {
    if (claim) {
      setFormData({
        title: claim.title,
        description: claim.description,
        amount: claim.amount,
        expense_date: claim.expense_date,
        status: claim.status,
      })
      setRejectionReason(claim.rejection_reason || "")
      setIsEditing(false)
    }
  }, [claim, open])

  if (!claim) return null

  const handleProcess = async (status: "Approved" | "Rejected") => {
    if (status === "Rejected" && !rejectionReason.trim()) {
      toast({
        title: "Validation Error",
        description: "A reason is required to reject a claim.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      await processExpenseClaim(claim.id, {
        status,
        rejection_reason: status === "Rejected" ? rejectionReason : undefined,
      })
      toast({
        title: "Success",
        description: `Claim has been ${status.toLowerCase()} successfully.`,
      })
      onActionSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process claim",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdate = async () => {
    if (formData.status === "Rejected" && !rejectionReason.trim()) {
      toast({
        title: "Validation Error",
        description: "A reason is required to reject a claim.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const payload: Partial<ExpenseClaim> = {
        amount: formData.amount,
        status: formData.status,
        rejection_reason: formData.status === "Rejected" ? rejectionReason : null,
      }

      await adminUpdateExpense(claim.id, payload)
      toast({
        title: "Success",
        description: "Claim updated successfully.",
      })
      onActionSuccess()
      onOpenChange(false)
      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update claim",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    if (isEditing) {
      setFormData({
        title: claim.title,
        description: claim.description,
        amount: claim.amount,
        expense_date: claim.expense_date,
        status: claim.status,
      })
      setRejectionReason(claim.rejection_reason || "")
      setIsEditing(false)
    } else {
      onOpenChange(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { variant: string; icon: any; color: string }
    > = {
      Pending: {
        variant: "status--warning",
        icon: AlertCircle,
        color: "text-warning",
      },
      Approved: {
        variant: "status--info",
        icon: CheckCircle2,
        color: "text-info",
      },
      Rejected: {
        variant: "status--error",
        icon: XCircle,
        color: "text-error",
      },
      Reimbursed: {
        variant: "status--success",
        icon: CheckCircle2,
        color: "text-success",
      },
      Processed: {
        variant: "status--info",
        icon: CheckCircle2,
        color: "text-info",
      },
      Locked: {
        variant: "status--secondary",
        icon: Lock,
        color: "text-muted-foreground",
      },
    }
    return (
      configs[status] || {
        variant: "",
        icon: AlertCircle,
        color: "text-muted-foreground",
      }
    )
  }

  const statusConfig = getStatusConfig(claim.status)
  const StatusIcon = statusConfig.icon

  const canEdit =
    claim.status !== "Reimbursed" && 
    claim.status !== "Processed" && 
    claim.status !== "Locked"
  const isPending = claim.status === "Pending"

  // Determine if we should show reimbursement details
  const showPayrollReimbursement =
    claim.reimbursement_method === "Payroll" &&
    (claim.status === "Locked" || claim.status === "Reimbursed") &&
    claim.reimbursed_in_payroll_id

  const showDirectTransfer =
    claim.reimbursement_method === "Direct Transfer" &&
    claim.status === "Reimbursed" &&
    claim.transaction_id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">
                Review Expense Claim
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{claim.employee_name}</span>
                <span className="text-muted-foreground">•</span>
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">
                  AED {claim.amount.toLocaleString()}
                </span>
              </DialogDescription>
            </div>
            <Badge className={statusConfig.variant}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {claim.status}
            </Badge>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {isEditing ? (
              // Edit Mode
              <>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="amount" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Amount (AED)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="expense_date"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Expense Date
                    </Label>
                    <Input
                      id="expense_date"
                      type="date"
                      value={
                        new Date(formData.expense_date!)
                          .toISOString()
                          .split("T")[0]
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      disabled
                      className="bg-muted min-h-[80px]"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.status === "Rejected" && (
                    <div className="grid gap-2 p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                      <Label
                        htmlFor="rejection_reason"
                        className="flex items-center gap-2 text-destructive"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Rejection Reason *
                      </Label>
                      <Textarea
                        id="rejection_reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a detailed reason for rejection..."
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              // View Mode
              <>
                <div className="grid gap-4">
                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <FileText className="h-4 w-4" />
                        <span>Title</span>
                      </div>
                      <p className="font-medium">{claim.title}</p>
                    </div>

                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Tag className="h-4 w-4" />
                        <span>Category</span>
                      </div>
                      <p className="font-medium">{claim.category_name}</p>
                    </div>

                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>Expense Date</span>
                      </div>
                      <p className="font-medium">
                        {new Date(claim.expense_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Amount</span>
                      </div>
                      <p className="font-semibold text-lg">
                        AED {claim.amount.toLocaleString()}
                      </p>
                    </div>

                    {/* Claim Type */}
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Tag className="h-4 w-4" />
                        <span>Claim Type</span>
                      </div>
                      <Badge variant="outline">{claim.claim_type}</Badge>
                    </div>

                    {/* Reimbursement Method */}
                    {claim.reimbursement_method && (
                      <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Banknote className="h-4 w-4" />
                          <span>Reimbursement Method</span>
                        </div>
                        <p className="font-medium">{claim.reimbursement_method}</p>
                      </div>
                    )}
                  </div>

                  {/* Reimbursement Details - Payroll */}
                  {showPayrollReimbursement && (
                    <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
                      <div className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-400 mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Reimbursed via Payroll</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Hash className="h-4 w-4 text-green-600 dark:text-green-500" />
                        <span className="text-sm text-muted-foreground">Payroll Cycle ID:</span>
                        <Badge variant="secondary" className="font-mono">
                          {claim.reimbursed_in_payroll_id}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Reimbursement Details - Direct Transfer */}
                  {showDirectTransfer && (
                    <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Direct Transfer Completed</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Hash className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                        <span className="text-sm text-muted-foreground">Transaction ID:</span>
                        <Badge variant="secondary" className="font-mono">
                          {claim.transaction_id}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      <span>Description</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {claim.description || (
                        <span className="text-muted-foreground italic">
                          No description provided.
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Receipt */}
                  {claim.receipt_url && (
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Receipt className="h-4 w-4" />
                        <span>Receipt</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <a
                          href={claim.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          View Uploaded Receipt
                        </a>
                      </Button>
                    </div>
                  )}

                  {/* Rejection Reason Input for Pending */}
                  {isPending && (
                    <div className="p-4 rounded-lg border border-warning/20 bg-warning/5">
                      <Label
                        htmlFor="rejection_reason"
                        className="flex items-center gap-2 mb-2"
                      >
                        <AlertCircle className="h-4 w-4 text-warning" />
                        Rejection Reason (if rejecting)
                      </Label>
                      <Textarea
                        id="rejection_reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason if you choose to reject this claim..."
                        className="min-h-[80px]"
                      />
                    </div>
                  )}

                  {/* Display Rejection Reason */}
                  {claim.status === "Rejected" && claim.rejection_reason && (
                    <div className="p-4 rounded-lg border border-destructive bg-destructive/5">
                      <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
                        <XCircle className="h-4 w-4" />
                        <span>Rejection Reason</span>
                      </div>
                      <p className="text-sm text-destructive/90">
                        {claim.rejection_reason}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="flex flex-row items-center justify-between gap-2">
          <div>
            {canEdit && !isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={isProcessing}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={isProcessing}>
                  <Save className="h-4 w-4 mr-2" />
                  {isProcessing ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : isPending ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isProcessing}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleProcess("Rejected")}
                  disabled={isProcessing}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Reject"}
                </Button>
                <Button
                  onClick={() => handleProcess("Approved")}
                  disabled={isProcessing}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Approve"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleCancel}>
                Close
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
