
// "use client"

// import * as React from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { processExpenseClaim, type ExpenseClaim } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"

// interface AdminExpenseDetailsDialogProps {
//   claim: ExpenseClaim | null
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onActionSuccess: () => void
// }

// export function AdminExpenseDetailsDialog({ claim, open, onOpenChange, onActionSuccess }: AdminExpenseDetailsDialogProps) {
//   const { toast } = useToast()
//   const [rejectionReason, setRejectionReason] = React.useState("")
// console.log(claim?.receipt_url)
//   React.useEffect(() => {
//     if (claim) {
//       setRejectionReason(claim.rejection_reason || "")
//     }
//   }, [claim])

//   if (!claim) return null

//   const handleProcess = async (status: 'Approved' | 'Rejected') => {
//     if (status === 'Rejected' && !rejectionReason) {
//       toast({ title: "Error", description: "A reason is required to reject a claim.", variant: "destructive" });
//       return;
//     }
//     try {
//       await processExpenseClaim(claim.id, { status, rejection_reason: status === 'Rejected' ? rejectionReason : undefined });
//       toast({ title: "Success", description: `Claim has been ${status.toLowerCase()}.` });
//       onActionSuccess();
//       onOpenChange(false);
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to process claim: ${error.message}`, variant: "destructive" });
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     const statusColors: Record<string, string> = {
//         Pending: "bg-yellow-100 text-yellow-800",
//         Approved: "bg-blue-100 text-blue-800",
//         Rejected: "bg-red-100 text-red-800",
//         Reimbursed: "bg-green-100 text-green-800",
//         Processed: "bg-gray-100 text-gray-800",
//     };
//     return <Badge className={statusColors[status] || ""}>{status}</Badge>;
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Review Expense Claim</DialogTitle>
//           <DialogDescription>
//             Claim from {claim.employee_name} for ${claim.amount.toLocaleString()}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
//             <div className="grid grid-cols-2 gap-4">
//                 <div><strong>Title:</strong> {claim.title}</div>
//                 <div><strong>Category:</strong> {claim.category_name}</div>
//                 <div><strong>Expense Date:</strong> {new Date(claim.expense_date).toLocaleDateString()}</div>
//                 <div><strong>Status:</strong> {getStatusBadge(claim.status)}</div>
//             </div>
//             <div><strong>Description:</strong> <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{claim.description || "No description."}</p></div>
//             {claim.receipt_url && <a href={claim.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">View Uploaded Receipt</a>}

//             {claim.status === 'Pending' && (
//                 <div className="pt-4 border-t">
//                     <Label htmlFor="rejection_reason">Rejection Reason (if rejecting)</Label>
//                     <Textarea id="rejection_reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
//                 </div>
//             )}
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
//           {claim.status === 'Pending' && (
//             <div className="flex gap-2">
//                 <Button variant="destructive" onClick={() => handleProcess('Rejected')}>Reject</Button>
//                 <Button onClick={() => handleProcess('Approved')}>Approve</Button>
//             </div>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { processExpenseClaim, adminUpdateExpense, type ExpenseClaim } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface AdminExpenseDetailsDialogProps {
  claim: ExpenseClaim | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onActionSuccess: () => void
}

export function AdminExpenseDetailsDialog({ claim, open, onOpenChange, onActionSuccess }: AdminExpenseDetailsDialogProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<ExpenseClaim>>({})
  const [rejectionReason, setRejectionReason] = React.useState("")

  React.useEffect(() => {
    if (claim) {
      setFormData({
        title: claim.title,
        description: claim.description,
        amount: claim.amount,
        expense_date: claim.expense_date,
        status: claim.status
      });
      setRejectionReason(claim.rejection_reason || "");
      setIsEditing(false);
    }
  }, [claim, open]);

  if (!claim) return null

  const handleProcess = async (status: 'Approved' | 'Rejected') => {
    if (status === 'Rejected' && !rejectionReason) {
      toast({ title: "Error", description: "A reason is required to reject a claim.", variant: "destructive" });
      return;
    }
    try {
      await processExpenseClaim(claim.id, { status, rejection_reason: status === 'Rejected' ? rejectionReason : undefined });
      toast({ title: "Success", description: `Claim has been ${status.toLowerCase()}.` });
      onActionSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to process claim: ${error.message}`, variant: "destructive" });
    }
  }

  const handleUpdate = async () => {
    if (formData.status === 'Rejected' && !rejectionReason) {
      toast({ title: "Error", description: "A reason is required to reject a claim.", variant: "destructive" });
      return;
    }

    try {
      const payload: Partial<ExpenseClaim> = {
          amount: formData.amount,
          status: formData.status,
          rejection_reason: formData.status === 'Rejected' ? rejectionReason : null,
          
          

      };

      await adminUpdateExpense(claim.id, payload);
      toast({ title: "Success", description: "Claim updated successfully." });
      onActionSuccess();
      onOpenChange(false);
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to update claim: ${error.message}`, variant: "destructive" });
    }
  }


  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
        Pending: "bg-yellow-100 text-yellow-800",
        Approved: "bg-blue-100 text-blue-800",
        Rejected: "bg-red-100 text-red-800",
        Reimbursed: "bg-green-100 text-green-800",
        Processed: "bg-gray-100 text-gray-800",
    };
    return <Badge className={statusColors[status] || ""}>{status}</Badge>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Expense Claim</DialogTitle>
          <DialogDescription>
            Claim from {claim.employee_name} for ${claim.amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {isEditing ? (
                 <>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={formData.title} disabled />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value) })} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="expense_date">Expense Date</Label>
                        <Input id="expense_date" type="date" value={new Date(formData.expense_date!).toISOString().split('T')[0]} disabled />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formData.description} disabled />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {formData.status === 'Rejected' && (
                        <div className="pt-4 border-t">
                            <Label htmlFor="rejection_reason">Rejection Reason</Label>
                            <Textarea id="rejection_reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div><strong>Title:</strong> {claim.title}</div>
                        <div><strong>Category:</strong> {claim.category_name}</div>
                        <div><strong>Expense Date:</strong> {new Date(claim.expense_date).toLocaleDateString()}</div>
                        <div><strong>Status:</strong> {getStatusBadge(claim.status)}</div>
                    </div>
                    <div><strong>Description:</strong> <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{claim.description || "No description."}</p></div>
                    {claim.receipt_url && <a href={claim.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">View Uploaded Receipt</a>}

                    {claim.status === 'Pending' && (
                        <div className="pt-4 border-t">
                            <Label htmlFor="rejection_reason">Rejection Reason (if rejecting)</Label>
                            <Textarea id="rejection_reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                        </div>
                    )}
                     {claim.status === 'Rejected' && claim.rejection_reason && (
                        <div><strong>Rejection Reason:</strong> <p className="text-sm text-red-600 p-2 bg-red-50 border border-red-200 rounded-md">{claim.rejection_reason}</p></div>
                    )}
                </>
            )}
        </div>
        <DialogFooter className="flex justify-between w-full">
            <div>
                 {claim.status !== 'Reimbursed' && claim.status !== 'Processed' && !isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                )}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => { onOpenChange(false); setIsEditing(false); }}>Cancel</Button>
                {isEditing ? (
                    <Button onClick={handleUpdate}>Save Changes</Button>
                ) : claim.status === 'Pending' ? (
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={() => handleProcess('Rejected')}>Reject</Button>
                        <Button onClick={() => handleProcess('Approved')}>Approve</Button>
                    </div>
                ) : null}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}