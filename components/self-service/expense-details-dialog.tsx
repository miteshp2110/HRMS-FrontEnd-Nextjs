

// "use client"

// import * as React from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import {
//   getExpenseClaims,
//   updateExpense,
//   deleteExpense,
//   type ExpenseClaim,
// } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// interface ExpenseDetailsDialogProps {
//   claim: ExpenseClaim | null
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onActionSuccess: () => void
// }

// export function ExpenseDetailsDialog({ claim, open, onOpenChange, onActionSuccess }: ExpenseDetailsDialogProps) {
//   const { toast } = useToast()
//   const [isEditing, setIsEditing] = React.useState(false)
//   const [formData, setFormData] = React.useState<Partial<ExpenseClaim>>({})

//   React.useEffect(() => {
//     if (claim) {
//       setFormData({
//         title: claim.title,
//         description: claim.description,
//         amount: claim.amount,
//         expense_date: claim.expense_date,
//       })
//     }
//   }, [claim])

//   if (!claim) return null

//   const handleUpdate = async () => {
//     try {
//         await updateExpense(claim.id, {
//             expense_title: formData.title,
//             expense_description: formData.description,
//             expense: formData.amount
//         });
//         toast({ title: "Success", description: "Claim updated successfully." });
//         onActionSuccess();
//         onOpenChange(false);
//         setIsEditing(false);
//     } catch (error: any) {
//         toast({ title: "Error", description: `Failed to update claim: ${error.message}`, variant: "destructive" });
//     }
//   }

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this expense claim?")) return;
//     try {
//         await deleteExpense(claim.id);
//         toast({ title: "Success", description: "Claim deleted successfully." });
//         onActionSuccess();
//         onOpenChange(false);
//     } catch (error: any) {
//         toast({ title: "Error", description: `Failed to delete claim: ${error.message}`, variant: "destructive" });
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     const statusColors: Record<string, string> = {
//       Pending: "bg-yellow-100 text-yellow-800",
//       Approved: "bg-blue-100 text-blue-800",
//       Rejected: "bg-red-100 text-red-800",
//       Reimbursed: "bg-green-100 text-green-800",
//       Processed: "bg-gray-100 text-gray-800",
//     };
//     return <Badge className={statusColors[status] || ""}>{status}</Badge>;
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Expense Claim Details</DialogTitle>
//           <DialogDescription>
//             Details for your expense claim submitted on {new Date(claim.created_at).toLocaleDateString()}.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="py-4 space-y-4">
//             {isEditing && claim.status === 'Pending' ? (
//                 <>
//                     <div className="grid gap-2">
//                         <Label htmlFor="title">Title</Label>
//                         <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value })} />
//                     </div>
//                     <div className="grid gap-2">
//                         <Label htmlFor="amount">Amount</Label>
//                         <Input id="amount" type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value) })} />
//                     </div>
//                      <div className="grid gap-2">
//                         <Label htmlFor="expense_date">Expense Date</Label>
//                         <Input id="expense_date" type="date" value={new Date(formData.expense_date!).toISOString().split('T')[0]} onChange={(e) => setFormData({...formData, expense_date: e.target.value})} />
//                     </div>
//                     <div className="grid gap-2">
//                         <Label htmlFor="description">Description</Label>
//                         <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
//                     </div>
//                 </>
//             ) : (
//                  <>
//                     <div className="flex justify-between"><strong>Title:</strong> {claim.title}</div>
//                     <div className="flex justify-between"><strong>Amount:</strong> ${claim.amount.toLocaleString()}</div>
//                     <div className="flex justify-between"><strong>Category:</strong> {claim.category_name}</div>
//                     <div className="flex justify-between"><strong>Expense Date:</strong> {new Date(claim.expense_date).toLocaleDateString()}</div>
//                     <div className="flex justify-between items-center"><strong>Status:</strong> {getStatusBadge(claim.status)}</div>
//                     <div><strong>Description:</strong> <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{claim.description || "No description provided."}</p></div>
//                     {claim.rejection_reason && (
//                         <div><strong>Rejection Reason:</strong> <p className="text-sm text-red-600 p-2 bg-red-50 border border-red-200 rounded-md">{claim.rejection_reason}</p></div>
//                     )}
//                     {claim.receipt_url && <a href={claim.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Receipt</a>}
//                  </>
//             )}

//         </div>
//         <DialogFooter>
//           {isEditing && claim.status === 'Pending' ? (
//             <>
//                 <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
//                 <Button onClick={handleUpdate}>Save Changes</Button>
//             </>
//           ) : (
//             <>
//                 <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
//                 {claim.status === 'Pending' && (
//                     <div className="flex gap-2">
//                         <Button variant="destructive" onClick={handleDelete}>Delete</Button>
//                         <Button onClick={() => setIsEditing(true)}>Edit</Button>
//                     </div>
//                 )}
//             </>
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
import {
  deleteExpense,
  type ExpenseClaim,
  updateExpense,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ExpenseDetailsDialogProps {
  claim: ExpenseClaim | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onActionSuccess: () => void
}

export function ExpenseDetailsDialog({ claim, open, onOpenChange, onActionSuccess }: ExpenseDetailsDialogProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<ExpenseClaim>>({})

  React.useEffect(() => {
    if (claim) {
      setFormData({
        title: claim.title,
        description: claim.description,
        amount: claim.amount,
        expense_date: claim.expense_date,
      })
    }
  }, [claim])

  if (!claim) return null

  const handleUpdate = async () => {
    try {
        await updateExpense(claim.id, {
            expense_title: formData.title,
            expense_description: formData.description,
            expense: formData.amount
        });
        toast({ title: "Success", description: "Claim updated successfully." });
        onActionSuccess();
        onOpenChange(false);
        setIsEditing(false);
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to update claim: ${error.message}`, variant: "destructive" });
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense claim?")) return;
    try {
        await deleteExpense(claim.id);
        toast({ title: "Success", description: "Claim deleted successfully." });
        onActionSuccess();
        onOpenChange(false);
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to delete claim: ${error.message}`, variant: "destructive" });
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Expense Claim Details</DialogTitle>
          <DialogDescription>
            Details for your expense claim submitted on {new Date(claim.created_at).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            {isEditing && claim.status === 'Pending' ? (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value) })} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="expense_date">Expense Date</Label>
                        <Input id="expense_date" type="date" value={new Date(formData.expense_date!).toISOString().split('T')[0]} onChange={(e) => setFormData({...formData, expense_date: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                </>
            ) : (
                 <>
                    <div className="flex justify-between"><strong>Title:</strong> {claim.title}</div>
                    <div className="flex justify-between"><strong>Amount:</strong> ${claim.amount.toLocaleString()}</div>
                    <div className="flex justify-between"><strong>Category:</strong> {claim.category_name}</div>
                    <div className="flex justify-between"><strong>Expense Date:</strong> {new Date(claim.expense_date).toLocaleDateString()}</div>
                    <div className="flex justify-between items-center"><strong>Status:</strong> {getStatusBadge(claim.status)}</div>
                    <div><strong>Description:</strong> <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{claim.description || "No description provided."}</p></div>
                    {claim.rejection_reason && (
                        <div><strong>Rejection Reason:</strong> <p className="text-sm text-red-600 p-2 bg-red-50 border border-red-200 rounded-md">{claim.rejection_reason}</p></div>
                    )}
                    {claim.receipt_url && <a href={claim.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Receipt</a>}
                    {(claim.status === 'Reimbursed' || claim.status === 'Processed') && (
                        <div className="pt-4 border-t mt-4">
                            <h4 className="font-semibold mb-2">Reimbursement Details</h4>
                            <div className="flex justify-between"><strong>Method:</strong> {claim.reimbursement_method}</div>
                            {claim.transaction_id && <div className="flex justify-between"><strong>Transaction ID:</strong> {claim.transaction_id}</div>}
                        </div>
                    )}
                 </>
            )}

        </div>
        <DialogFooter>
          {isEditing && claim.status === 'Pending' ? (
            <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
            </>
          ) : (
            <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                {claim.status === 'Pending' && (
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    </div>
                )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}