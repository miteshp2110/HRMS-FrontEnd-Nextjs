"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Receipt, Plus, FileText, DollarSign } from "lucide-react"
import type { ExpenseRecord } from "@/lib/api"
import { getExpenses } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { AddExpenseDialog } from "./add-expense-dialog"

interface EmployeeExpensesTabProps {
  initialExpenses: ExpenseRecord[]
  employeeId: number
  isLoading: boolean
}

// AED Currency formatter
const formatAED = (amount: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Truncate text with ellipsis
const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return "N/A"
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

// Skeleton loader for table
const TableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Expense Type</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>JV Number</TableHead>
        <TableHead>Date Recorded</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export function EmployeeExpensesTab({ initialExpenses, employeeId, isLoading: initialIsLoading }: EmployeeExpensesTabProps) {
  const [expenses, setExpenses] = React.useState(initialExpenses)
  const [isLoading, setIsLoading] = React.useState(initialIsLoading)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    setExpenses(initialExpenses)
  }, [initialExpenses])

  const refetchExpenses = async () => {
    setIsRefreshing(true)
    try {
      const data = await getExpenses(employeeId)
      setExpenses(data)
      toast({ 
        title: "Success", 
        description: "Expense data refreshed successfully." 
      })
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Could not refresh expense data.", 
        variant: "destructive" 
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.expense), 0)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Investment</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-9 w-32" />
                ) : (
                  formatAED(totalExpenses)
                )}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  expenses.length
                )}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Per Expense</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-9 w-32" />
                ) : expenses.length > 0 ? (
                  formatAED(totalExpenses / expenses.length)
                ) : (
                  formatAED(0)
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Company Expenses on Employee
              </CardTitle>
              <CardDescription>
                Track all expenses incurred by the company for this employee (visa, training, equipment, etc.)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={refetchExpenses}
                disabled={isLoading || isRefreshing}
              >
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button onClick={() => setIsDialogOpen(true)} disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2"/>
                Record Expense
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton />
            ) : expenses.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-muted p-6">
                    <Receipt className="h-12 w-12" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">No Expenses Recorded</h3>
                    <p className="text-sm">
                      No company expenses have been recorded for this employee yet.
                    </p>
                  </div>
                  <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2"/>
                    Record First Expense
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Expense Type</TableHead>
                      <TableHead className="font-semibold">Details</TableHead>
                      <TableHead className="font-semibold text-right">Amount Spent</TableHead>
                      <TableHead className="font-semibold">JV Number</TableHead>
                      <TableHead className="font-semibold">Date Recorded</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map(expense => (
                      <TableRow key={expense.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {expense.expense_title}
                          </div>
                        </TableCell>
                        <TableCell>
                          {expense.expense_description && expense.expense_description.length > 50 ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help text-sm">
                                  {truncateText(expense.expense_description, 50)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <p className="text-sm">{expense.expense_description}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-sm">{expense.expense_description || "No details provided"}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatAED(Number(expense.expense))}
                        </TableCell>
                        <TableCell>
                          {expense.jv ? (
                            <Badge variant="outline" className="font-mono text-xs">
                              {expense.jv}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(expense.created_at).toLocaleDateString('en-AE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddExpenseDialog 
        employeeId={employeeId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onExpenseAdded={refetchExpenses}
      />
    </TooltipProvider>
  )
}
