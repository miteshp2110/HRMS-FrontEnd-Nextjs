"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Receipt,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  TrendingUp,
  DollarSign,
  Users,
  Calendar
} from "lucide-react"
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense,
  searchUsers,
  type ExpenseRecord,
  type UserProfile
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

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

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
    </div>
  )
}

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>JV Number</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-right space-x-2">
              <Skeleton className="h-8 w-8 inline-block" />
              <Skeleton className="h-8 w-8 inline-block" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function ExpenseManagementPage() {
  const { toast } = useToast()
  const [expenses, setExpenses] = React.useState<ExpenseRecord[]>([])
  const [filteredExpenses, setFilteredExpenses] = React.useState<ExpenseRecord[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [editingExpense, setEditingExpense] = React.useState<ExpenseRecord | null>(null)
  const [deletingExpense, setDeletingExpense] = React.useState<ExpenseRecord | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [employeeSearch, setEmployeeSearch] = React.useState("")
  const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([])
  const [selectedEmployee, setSelectedEmployee] = React.useState<UserProfile | null>(null)

  const [formData, setFormData] = React.useState({
    employee_id: 0,
    expense_title: "",
    expense_description: "",
    expense: "",
    jv: ""
  })

  // Fetch expenses
  const fetchExpenses = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getExpenses()
      setExpenses(data)
      setFilteredExpenses(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load expenses.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  // Search employees
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (employeeSearch) {
        searchUsers(employeeSearch).then(setSearchedUsers)
      } else {
        setSearchedUsers([])
      }
    }, 300)
    return () => clearTimeout(handler)
  }, [employeeSearch])

  // Filter expenses by search
  React.useEffect(() => {
    if (searchTerm) {
      const filtered = expenses.filter(exp =>
        `${exp.first_name} ${exp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.expense_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.jv.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredExpenses(filtered)
    } else {
      setFilteredExpenses(expenses)
    }
  }, [searchTerm, expenses])

  // Handle dialog open
  const handleOpenDialog = (expense: ExpenseRecord | null = null) => {
    setEditingExpense(expense)
    if (expense) {
      setFormData({
        employee_id: expense.employee_id,
        expense_title: expense.expense_title,
        expense_description: expense.expense_description,
        expense: expense.expense.toString(),
        jv: expense.jv
      })
      setSelectedEmployee({
        id: expense.employee_id,
        first_name: expense.first_name,
        last_name: expense.last_name,
      } as UserProfile)
    } else {
      setFormData({
        employee_id: 0,
        expense_title: "",
        expense_description: "",
        expense: "",
        jv: ""
      })
      setSelectedEmployee(null)
    }
    setIsDialogOpen(true)
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee) {
      toast({
        title: "Validation Error",
        description: "Please select an employee.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const data = {
        ...formData,
        employee_id: selectedEmployee.id,
        expense: parseFloat(formData.expense)
      }

      if (editingExpense) {
        await updateExpense(editingExpense.id, data)
        toast({ title: "Success", description: "Expense updated successfully." })
      } else {
        await createExpense(data)
        toast({ title: "Success", description: "Expense created successfully." })
      }

      fetchExpenses()
      setIsDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to save: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deletingExpense) return

    setIsSubmitting(true)
    try {
      await deleteExpense(deletingExpense.id)
      toast({ title: "Success", description: "Expense deleted successfully." })
      fetchExpenses()
      setIsDeleteDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate statistics - using all expenses, not filtered
  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((sum, exp) => sum + Number(exp.expense), 0)
  }, [expenses])

  const avgExpense = React.useMemo(() => {
    return expenses.length > 0 ? totalExpenses / expenses.length : 0
  }, [expenses, totalExpenses])

  const uniqueEmployees = React.useMemo(() => {
    return new Set(expenses.map(exp => exp.employee_id)).size
  }, [expenses])

  const monthlyExpenses = React.useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return expenses.filter(exp => {
      const expDate = new Date(exp.created_at)
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
    }).reduce((sum, exp) => sum + Number(exp.expense), 0)
  }, [expenses])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <StatsCardsSkeleton />
          <Card>
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent><TableSkeleton /></CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Receipt className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Expense Management</h1>
              <p className="text-muted-foreground">
                Track and manage employee-related expenses
              </p>
            </div>
          </div>
          <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatAED(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatAED(monthlyExpenses)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-AE', { month: 'long', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Average Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatAED(avgExpense)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{uniqueEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">
                With expenses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <CardTitle>All Expenses</CardTitle>
                <CardDescription>
                  Complete list of employee expenses
                </CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee, title, or JV..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-muted rounded-full">
                    <Receipt className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Expenses Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No expenses match your search." : "Start by adding your first expense."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <TooltipProvider>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>JV Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow key={expense.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {expense.first_name} {expense.last_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{expense.expense_title}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="truncate cursor-help">
                                  {expense.expense_description}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-md">
                                <p className="text-sm">{expense.expense_description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="font-mono font-semibold text-green-600">
                            {formatAED(expense.expense)}
                          </TableCell>
                          <TableCell className="font-mono">{expense.jv}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(expense.created_at).toLocaleDateString('en-AE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeletingExpense(expense)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingExpense ? 'Edit' : 'Add'} Expense
            </DialogTitle>
            <DialogDescription>
              {editingExpense ? 'Update' : 'Record'} an expense for an employee
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Employee Selection */}
            <div className="space-y-2">
              <Label htmlFor="employee">Employee *</Label>
              <div className="relative">
                <Input
                  id="employee"
                  placeholder="Search employee..."
                  value={selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : employeeSearch}
                  onChange={(e) => {
                    setEmployeeSearch(e.target.value)
                    if (!e.target.value) setSelectedEmployee(null)
                  }}
                  disabled={isSubmitting}
                />
                {employeeSearch && !selectedEmployee && searchedUsers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="px-4 py-2 hover:bg-muted cursor-pointer"
                        onClick={() => {
                          setSelectedEmployee(user)
                          setEmployeeSearch("")
                        }}
                      >
                        {user.first_name} {user.last_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense_title">Expense Title *</Label>
              <Input
                id="expense_title"
                value={formData.expense_title}
                onChange={(e) => setFormData({ ...formData, expense_title: e.target.value })}
                placeholder="e.g., Travel, Training, Equipment"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense_description">Description *</Label>
              <Textarea
                id="expense_description"
                value={formData.expense_description}
                onChange={(e) => setFormData({ ...formData, expense_description: e.target.value })}
                placeholder="Describe the expense..."
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense">Amount (AED) *</Label>
                <Input
                  id="expense"
                  type="number"
                  step="0.01"
                  value={formData.expense}
                  onChange={(e) => setFormData({ ...formData, expense: e.target.value })}
                  placeholder="0.00"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jv">JV Number *</Label>
                <Input
                  id="jv"
                  value={formData.jv}
                  onChange={(e) => setFormData({ ...formData, jv: e.target.value })}
                  placeholder="JV-2025-001"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingExpense ? 'Update Expense' : 'Add Expense'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}
