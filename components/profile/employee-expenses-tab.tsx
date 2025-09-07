"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Receipt, CheckCircle, XCircle, Clock, Plus } from "lucide-react"
import type { ExpenseRecord } from "@/lib/api"
import { getExpenses } from "@/lib/api" // Import getExpenses to refetch data
import { useToast } from "@/hooks/use-toast"
import { AddExpenseDialog } from "./add-expense-dialog" // Import the new dialog

interface EmployeeExpensesTabProps {
  initialExpenses: ExpenseRecord[]
  employeeId: number
  isLoading: boolean
}

export function EmployeeExpensesTab({ initialExpenses, employeeId, isLoading: initialIsLoading }: EmployeeExpensesTabProps) {
  const [expenses, setExpenses] = React.useState(initialExpenses);
  const [isLoading, setIsLoading] = React.useState(initialIsLoading);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const refetchExpenses = async () => {
    setIsLoading(true);
    try {
        const data = await getExpenses(employeeId);
        setExpenses(data);
    } catch (error: any) {
        toast({ title: "Error", description: "Could not refresh expense data.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Expense History</CardTitle>
                <CardDescription>A list of all expense claims submitted for this employee.</CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2"/>
                Add Expense
            </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          ): expenses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-10 w-10 mx-auto mb-4" />
              <p>No expense claims have been submitted for this employee.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submitted On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map(expense => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.expense_title}</TableCell>
                    <TableCell>{expense.expense_description}</TableCell>
                    <TableCell>${Number(expense.expense).toLocaleString()}</TableCell>
                    <TableCell>{new Date(expense.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddExpenseDialog 
        employeeId={employeeId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onExpenseAdded={refetchExpenses}
      />
    </>
  );
}