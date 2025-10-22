"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Eye,
  ExternalLink
} from "lucide-react"
import { getCaseByEmployee, type Case } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface EmployeeCasesTabProps {
  employeeId: number
}

// Skeleton Component
function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Case ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
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
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-28" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
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

export function EmployeeCasesTab({ employeeId }: EmployeeCasesTabProps) {
  const { toast } = useToast()
  const [cases, setCases] = React.useState<Case[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchCases = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getCaseByEmployee(employeeId)
      // Ensure data is an array
      setCases(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to fetch employee cases: ${error.message}`,
        variant: "destructive"
      })
      setCases([])
    } finally {
      setIsLoading(false)
    }
  }, [employeeId, toast])

  React.useEffect(() => {
    fetchCases()
  }, [fetchCases])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Open': { 
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100', 
        icon: FileQuestion 
      },
      'Under Review': { 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', 
        icon: Clock 
      },
      'Approved': { 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', 
        icon: CheckCircle 
      },
      'Rejected': { 
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', 
        icon: XCircle 
      },
      'Closed': { 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', 
        icon: CheckCircle 
      },
    }
    const { className, icon: Icon } = statusMap[status] || { 
      className: '', 
      icon: FileQuestion 
    }
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  // Calculate statistics
  const totalCases = cases.length
  const pendingCases = cases.filter(c => c.status === 'Open' || c.status === 'Under Review').length
  const approvedCases = cases.filter(c => c.status === 'Approved').length
  const rejectedCases = cases.filter(c => c.status === 'Rejected').length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SummaryCardsSkeleton />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
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
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingCases}</div>
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
              <XCircle className="h-4 w-4" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedCases}</div>
          </CardContent>
        </Card>
      </div>

      {/* Cases Table */}
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
          <CardTitle className="text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Employee Cases
          </CardTitle>
          <CardDescription className="text-indigo-700 dark:text-indigo-300">
            All cases related to this employee. Click "View Details" to see complete information
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {cases.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-muted rounded-full">
                  <FolderKanban className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Cases Found</h3>
              <p className="text-muted-foreground">
                This employee doesn't have any cases yet
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
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((caseItem) => (
                    <TableRow 
                      key={caseItem.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-mono font-medium">
                        {caseItem.case_id_text}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs truncate">
                        {caseItem.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {caseItem.category_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(caseItem.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(caseItem.created_at).toLocaleDateString('en-AE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          asChild
                        >
                          <Link 
                            href={`/admin/cases/${caseItem.id}`}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
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
  )
}
