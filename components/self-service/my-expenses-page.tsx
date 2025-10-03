// "use client"

// import * as React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Receipt } from "lucide-react"
// import { getExpenseClaims, type ExpenseClaim } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { SubmitClaimDialog } from "./submit-claim-dialog"

// export function MyExpensesPage() {
//   const [claims, setClaims] = React.useState<ExpenseClaim[]>([])
//   const [isLoading, setIsLoading] = React.useState(true)
//   const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false)
//   const { toast } = useToast()

//   const fetchClaims = React.useCallback(async () => {
//     setIsLoading(true)
//     try {
//       const data = await getExpenseClaims();
//       setClaims(data);
//     } catch (error: any) {
//       toast({ title: "Error", description: `Could not fetch your expense claims: ${error.message}`, variant: "destructive" })
//     } finally {
//       setIsLoading(false)
//     }
//   }, [toast])

//   React.useEffect(() => {
//     fetchClaims()
//   }, [fetchClaims])
  
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
//     <div className="space-y-6">
//        <div className="flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <Receipt className="h-8 w-8" />
//           <div>
//               <h1 className="text-3xl font-bold">My Expenses</h1>
//               <p className="text-muted-foreground">Submit claims for reimbursement and track your advances.</p>
//           </div>
//         </div>
//         <Button onClick={() => setIsSubmitDialogOpen(true)}>
//             <Plus className="h-4 w-4 mr-2"/>
//             Submit New Claim
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>My Claims & Advances</CardTitle>
//           <CardDescription>A complete history of your expense submissions.</CardDescription>
//         </CardHeader>
//         <CardContent>
//            <Table>
//                 <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Title</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
//                 <TableBody>
//                     {claims.map(claim => (
//                         <TableRow key={claim.id}>
//                             <TableCell><Badge variant="outline">{claim.claim_type}</Badge></TableCell>
//                             <TableCell>{claim.title}</TableCell>
//                             <TableCell>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(claim.amount)}</TableCell>
//                             <TableCell>{new Date(claim.expense_date).toLocaleDateString()}</TableCell>
//                             <TableCell>{getStatusBadge(claim.status)}</TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//            </Table>
//         </CardContent>
//       </Card>

//       <SubmitClaimDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen} onSuccess={fetchClaims} />
//     </div>
//   )
// }

"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Receipt } from "lucide-react"
import { getExpenseClaims, type ExpenseClaim } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { SubmitClaimDialog } from "./submit-claim-dialog"
import { ExpenseDetailsDialog } from "./expense-details-dialog" // Import the new dialog
import { useAuth } from "@/lib/auth-context"

export function MyExpensesPage() {
  const [claims, setClaims] = React.useState<ExpenseClaim[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false)
  const [selectedClaim, setSelectedClaim] = React.useState<ExpenseClaim | null>(null)
  const { toast } = useToast()
  const {user} = useAuth()

  const fetchClaims = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getExpenseClaims();
      setClaims(data);
    } catch (error: any) {
      toast({ title: "Error", description: `Could not fetch your expense claims: ${error.message}`, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  const handleRowClick = (claim: ExpenseClaim) => {
    setSelectedClaim(claim);
    setIsDetailsDialogOpen(true);
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
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Receipt className="h-8 w-8" />
          <div>
              <h1 className="text-3xl font-bold">My Expenses</h1>
              <p className="text-muted-foreground">Submit claims for reimbursement and track your advances.</p>
          </div>
        </div>
        <Button onClick={() => setIsSubmitDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2"/>
            Submit New Claim
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Claims & Advances</CardTitle>
          <CardDescription>A complete history of your expense submissions. Click a row to view details.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
                <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Title</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                    {claims.map((claim)=>{
                      if(claim.employee_id === user?.id){
                        return <TableRow key={claim.id} onClick={() => handleRowClick(claim)} className="cursor-pointer">
                            <TableCell><Badge variant="outline">{claim.claim_type}</Badge></TableCell>
                            <TableCell>{claim.title}</TableCell>
                            <TableCell>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'AED' }).format(claim.amount)}</TableCell>
                            <TableCell>{new Date(claim.expense_date).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(claim.status)}</TableCell>
                            
                        </TableRow>
                      }
                    })}
                </TableBody>
           </Table>
        </CardContent>
      </Card>

      <SubmitClaimDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen} onSuccess={fetchClaims} />
      <ExpenseDetailsDialog 
        claim={selectedClaim} 
        open={isDetailsDialogOpen} 
        onOpenChange={setIsDetailsDialogOpen}
        onActionSuccess={fetchClaims}
      />
    </div>
  )
}