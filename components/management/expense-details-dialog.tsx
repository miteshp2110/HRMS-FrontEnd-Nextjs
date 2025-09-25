// "use client"

// import * as React from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { processExpenseClaim, reimburseExpenseClaim, type ExpenseClaim } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
//   const [reimbursementMethod, setReimbursementMethod] = React.useState<'Payroll' | 'Direct Transfer' | ''>('');
//   const [transactionId, setTransactionId] = React.useState("")

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

//   const handleReimburse = async () => {
//       if (!reimbursementMethod) {
//           toast({ title: "Error", description: "Please select a reimbursement method.", variant: "destructive" });
//           return;
//       }
//       if (reimbursementMethod === 'Direct Transfer' && !transactionId) {
//           toast({ title: "Error", description: "Transaction ID is required for direct transfer.", variant: "destructive" });
//           return;
//       }

//       try {
//           await reimburseExpenseClaim(claim.id, {
//               reimbursement_method: reimbursementMethod,
//               transaction_id: reimbursementMethod === 'Direct Transfer' ? transactionId : "null"
//           });
//           toast({ title: "Success", description: "Claim has been marked as reimbursed." });
//           onActionSuccess();
//           onOpenChange(false);
//       } catch (error: any) {
//            toast({ title: "Error", description: `Failed to reimburse: ${error.message}`, variant: "destructive" });
//       }
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

//             {claim.status === 'Approved' && (
//                 <div className="pt-4 border-t space-y-4">
//                     <h3 className="font-semibold">Reimbursement</h3>
//                      <Select onValueChange={(value: 'Payroll' | 'Direct Transfer') => setReimbursementMethod(value)}>
//                         <SelectTrigger>
//                             <SelectValue placeholder="Select Reimbursement Method" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="Payroll">Add to next Payroll</SelectItem>
//                             <SelectItem value="Direct Transfer">Direct Transfer</SelectItem>
//                         </SelectContent>
//                     </Select>
//                     {reimbursementMethod === 'Direct Transfer' && (
//                         <div>
//                             <Label htmlFor="transaction_id">Transaction ID</Label>
//                             <Input id="transaction_id" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
//                         </div>
//                     )}
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
//            {claim.status === 'Approved' && (
//             <Button onClick={handleReimburse}>Mark as Reimbursed</Button>
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
import { processExpenseClaim, type ExpenseClaim } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AdminExpenseDetailsDialogProps {
  claim: ExpenseClaim | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onActionSuccess: () => void
}

export function AdminExpenseDetailsDialog({ claim, open, onOpenChange, onActionSuccess }: AdminExpenseDetailsDialogProps) {
  const { toast } = useToast()
  const [rejectionReason, setRejectionReason] = React.useState("")
console.log(claim?.receipt_url)
  React.useEffect(() => {
    if (claim) {
      setRejectionReason(claim.rejection_reason || "")
    }
  }, [claim])

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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {claim.status === 'Pending' && (
            <div className="flex gap-2">
                <Button variant="destructive" onClick={() => handleProcess('Rejected')}>Reject</Button>
                <Button onClick={() => handleProcess('Approved')}>Approve</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}