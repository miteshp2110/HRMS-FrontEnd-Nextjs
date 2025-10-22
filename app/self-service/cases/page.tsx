"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FolderKanban,
  CheckCircle,
  XCircle,
  Clock,
  FileQuestion,
  AlertCircle,
  Eye
} from "lucide-react"
import { getMyCases, type Case } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { CaseDetailDialog } from "@/components/cases/case-detail-dialog"

// Format number as AED currency
const formatAED = (amount: number | string | null) => {
  if (!amount) return 'N/A'
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

function SummaryCardsSkeleton() {
  return (
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
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Case ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Deduction Amount</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-6 w-28" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function MyCasesPage() {
  const { toast } = useToast()
  const [cases, setCases] = React.useState<Case[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedCase, setSelectedCase] = React.useState<Case | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false)

  const fetchCases = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getMyCases()
      // Ensure data is an array
      setCases(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load your cases.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchCases()
  }, [fetchCases])

  const handleRowClick = (caseItem: Case) => {
    setSelectedCase(caseItem)
    setIsDetailDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Open': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100', icon: FileQuestion },
      'Under Review': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Approved': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
      'Closed': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: FileQuestion }
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  // Calculate statistics
  const totalCases = cases.length
  const openCases = cases.filter(c => c.status === 'Open' || c.status === 'Under Review').length
  const approvedCases = cases.filter(c => c.status === 'Approved').length
  const closedCases = cases.filter(c => c.status === 'Closed').length

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <SummaryCardsSkeleton />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <TableSkeleton />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FolderKanban className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Cases</h1>
            <p className="text-muted-foreground">
              View and track all cases related to you
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FolderKanban className="h-4 w-4" />
                Total Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCases}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Open Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{openCases}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{approvedCases}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Closed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{closedCases}</div>
            </CardContent>
          </Card>
        </div>

        {/* Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Cases</CardTitle>
            <CardDescription>
              Click on any case to view detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cases.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-muted rounded-full">
                    <FolderKanban className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Cases Found</h3>
                <p className="text-muted-foreground">
                  You don't have any cases assigned to you at the moment
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deduction Amount</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cases.map((caseItem) => (
                      <TableRow 
                        key={caseItem.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(caseItem)}
                      >
                        <TableCell className="font-mono font-medium">
                          {caseItem.case_id_text}
                        </TableCell>
                        <TableCell className="font-medium">
                          {caseItem.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {caseItem.category_name}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                        <TableCell className="font-mono font-medium text-red-600">
                          {formatAED(caseItem.deduction_amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Eye className="h-4 w-4 inline-block text-muted-foreground" />
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

      <CaseDetailDialog
        caseItem={selectedCase}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </MainLayout>
  )
}
