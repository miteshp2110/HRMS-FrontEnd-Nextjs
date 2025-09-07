"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Receipt, Search, Filter, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getExpenseClaims, updateExpenseStatus, type ExpenseApproval } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ExpenseClaimsPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [expenses, setExpenses] = useState<ExpenseApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const canManageExpenses = hasPermission("expenses.manage")

  const fetchExpenses = async () => {
    if (!canManageExpenses) {
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      const data = await getExpenseClaims()
      setExpenses(data)
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch expense claims.", variant: "destructive"});
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchExpenses()
  }, [canManageExpenses])


  const handleStatusUpdate = async (expenseId: number, status: "approved" | "rejected") => {
    try {
      await updateExpenseStatus(expenseId, status)
      toast({ title: "Success", description: `Expense claim has been ${status}.`});
      fetchExpenses()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update expense status.", variant: "destructive"});
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "reimbursed":
        return <Badge className="bg-blue-100 text-blue-800">Reimbursed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.expense_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!canManageExpenses) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Receipt className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Expense Claims</h1>
            </div>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                You don't have permission to manage expense claims.
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Receipt className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Expense Claims</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Claims</CardTitle>
           <CardDescription>Review and process employee expense claims.</CardDescription>
          <div className="flex gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee or expense type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="reimbursed">Reimbursed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading claims...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Expense Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <Link href={`/directory/${expense.employee_id}`} className="font-medium text-primary hover:underline">
                        {expense.employee_name}
                      </Link>
                    </TableCell>
                    <TableCell>{expense.expense_type}</TableCell>
                    <TableCell>${expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(expense.submitted_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell className="text-right">
                      {expense.status === "pending" && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(expense.id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2"/> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                             className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(expense.id, "rejected")}
                          >
                            <XCircle className="h-4 w-4 mr-2"/> Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}