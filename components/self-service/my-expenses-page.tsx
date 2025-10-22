"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Plus, 
  Receipt, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  DollarSign,
  TrendingUp
} from "lucide-react"
import { getExpenseClaims, type ExpenseClaim } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { SubmitClaimDialog } from "./submit-claim-dialog"
import { ExpenseDetailsDialog } from "./expense-details-dialog"
import { useAuth } from "@/lib/auth-context"

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
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>
      <Skeleton className="h-10 w-48" />
    </div>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function MyExpensesPage() {
  const [claims, setClaims] = React.useState<ExpenseClaim[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false)
  const [selectedClaim, setSelectedClaim] = React.useState<ExpenseClaim | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchClaims = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getExpenseClaims()
      setClaims(data)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Could not fetch your expense claims: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchClaims()
  }, [fetchClaims])

  const handleRowClick = (claim: ExpenseClaim) => {
    setSelectedClaim(claim)
    setIsDetailsDialogOpen(true)
  }
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Pending': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Approved': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
      'Reimbursed': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Processed': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100', icon: CheckCircle },
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: Clock }
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  // Filter claims for current user
  const userClaims = claims.filter(claim => claim.employee_id === user?.id)

  // Calculate statistics
  const totalClaims = userClaims.length
  const pendingClaims = userClaims.filter(c => c.status === 'Pending').length
  const reimbursedClaims = userClaims.filter(c => c.status === 'Reimbursed').length
  const totalReimbursed = userClaims
    .filter(c => c.status === 'Reimbursed')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <TableSkeleton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Receipt className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Expenses</h1>
            <p className="text-muted-foreground">
              Submit claims for reimbursement and track your expense history
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setIsSubmitDialogOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit New Claim
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Total Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClaims}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingClaims}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Reimbursed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{reimbursedClaims}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Reimbursed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatAED(totalReimbursed)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Claims & Advances</CardTitle>
          <CardDescription>
            A complete history of your expense submissions. Click a row to view details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userClaims.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-muted rounded-full">
                  <Receipt className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Expense Claims</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any expense claims yet
              </p>
              <Button 
                onClick={() => setIsSubmitDialogOpen(true)} 
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Claim
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userClaims.map((claim) => (
                    <TableRow 
                      key={claim.id} 
                      onClick={() => handleRowClick(claim)} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <Badge variant="outline">{claim.claim_type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{claim.title}</TableCell>
                      <TableCell className="font-mono font-medium text-green-600">
                        {formatAED(claim.amount)}
                      </TableCell>
                      <TableCell>
                        {new Date(claim.expense_date).toLocaleDateString('en-AE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <SubmitClaimDialog 
        open={isSubmitDialogOpen} 
        onOpenChange={setIsSubmitDialogOpen} 
        onSuccess={fetchClaims} 
      />
      <ExpenseDetailsDialog 
        claim={selectedClaim} 
        open={isDetailsDialogOpen} 
        onOpenChange={setIsDetailsDialogOpen}
        onActionSuccess={fetchClaims}
      />
    </div>
  )
}
