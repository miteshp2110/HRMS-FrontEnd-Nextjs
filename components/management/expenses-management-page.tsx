
"use client"

import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Receipt, AlertCircle, Eye } from "lucide-react"
import { getExpenseApprovals, getExpenseClaims, type ExpenseClaim } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { AdminExpenseDetailsDialog } from "./expense-details-dialog" // Import the new dialog
import { AdvanceDialog } from "./advance-dialog"

export function ExpensesManagementPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  
  const [pendingApprovals, setPendingApprovals] = React.useState<ExpenseClaim[]>([])
  const [allClaims, setAllClaims] = React.useState<ExpenseClaim[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeClaim, setActiveClaim] = React.useState<ExpenseClaim | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false)
  const [isAdvanceDialogOpen, setIsAdvanceDialogOpen] = React.useState(false)
  
  const canManage = hasPermission("expenses.manage")

  const fetchData = React.useCallback(async () => {
    if (!canManage) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
        const [approvals, all] = await Promise.all([
            getExpenseApprovals(),
            getExpenseClaims()
        ]);
        setPendingApprovals(approvals);
        setAllClaims(all);
    } catch (error: any) {
        toast({ title: "Error", description: `Could not fetch data: ${error.message}`, variant: "destructive"})
    } finally {
        setIsLoading(false);
    }
  }, [canManage, toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReviewClick = (claim: ExpenseClaim) => {
    setActiveClaim(claim);
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

  if (!canManage) {
      return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Access Denied</AlertTitle><AlertDescription>You don't have permission to manage expenses.</AlertDescription></Alert>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Receipt className="h-8 w-8" />
            <div>
                <h1 className="text-3xl font-bold">Expense Management</h1>
                <p className="text-muted-foreground">Approve claims and manage company expenses.</p>
            </div>
        </div>
        <Button onClick={() => setIsAdvanceDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2"/>
            New Advance
        </Button>
      </div>
      
      <Tabs defaultValue="approvals">
        <TabsList><TabsTrigger value="approvals">Pending Approvals <Badge className="ml-2">{pendingApprovals.length}</Badge></TabsTrigger><TabsTrigger value="all">All Expenses</TabsTrigger></TabsList>
        <TabsContent value="approvals">
            <Card>
                <CardHeader><CardTitle>Pending Approvals</CardTitle><CardDescription>Review and process employee reimbursement claims.</CardDescription></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Employee</TableHead><TableHead>Title</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {pendingApprovals.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No pending approvals found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingApprovals.map(claim => (
                                    <TableRow key={claim.id}>
                                        <TableCell><Badge variant="outline">{claim.claim_type}</Badge></TableCell>
                                        <TableCell>{claim.employee_name}</TableCell>
                                        <TableCell>{claim.title}</TableCell>
                                        <TableCell>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(claim.amount)}</TableCell>
                                        <TableCell>{new Date(claim.expense_date).toLocaleDateString()}</TableCell>
                                        
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleReviewClick(claim)}><Eye className="h-4 w-4 mr-2"/>Review</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="all">
            <Card>
                <CardHeader><CardTitle>All Company Expenses</CardTitle><CardDescription>A complete log of all claims and advances. Click a row to view details.</CardDescription></CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Title</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Receipt</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {allClaims.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No expense records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                allClaims.map(claim => (
                                    <TableRow key={claim.id} onClick={() => handleReviewClick(claim)} className="cursor-pointer">
                                        <TableCell>{claim.employee_name}</TableCell>
                                        <TableCell>{claim.title}</TableCell>
                                        <TableCell>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(claim.amount)}</TableCell>
                                        <TableCell>{new Date(claim.expense_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{getStatusBadge(claim.status)}</TableCell>
                                        <TableCell className="text-right">
                                            {claim.receipt_url && (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={claim.receipt_url} target="_blank" rel="noopener noreferrer">View Receipt</a>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      <AdminExpenseDetailsDialog
        claim={activeClaim}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        onActionSuccess={fetchData}
      />
      <AdvanceDialog
        open={isAdvanceDialogOpen}
        onOpenChange={setIsAdvanceDialogOpen}
        onSuccess={fetchData}
      />
    </div>
  )
}