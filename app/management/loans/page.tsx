
// "use client"

// import * as React from "react";
// import Link from "next/link";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { DollarSign, Eye, Filter } from "lucide-react";
// import { getLoanApplications, type LoanApplication } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";

// export default function LoanManagementPage() {
//     const { toast } = useToast();
//     const [allApplications, setAllApplications] = React.useState<LoanApplication[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [historyFilter, setHistoryFilter] = React.useState<string>("All");

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const data = await getLoanApplications();
//             setAllApplications(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load loan applications.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const pendingApplications = React.useMemo(() => 
//         allApplications.filter(app => app.status === 'Pending Approval'), 
//         [allApplications]
//     );

//     const historicalApplications = React.useMemo(() => {
//         const history = allApplications.filter(app => app.status !== 'Pending Approval');
//         if (historyFilter === 'All') {
//             return history;
//         }
//         return history.filter(app => app.status === historyFilter);
//     }, [allApplications, historyFilter]);

//     const getStatusBadge = (status: string) => {
//         const statusMap: Record<string, string> = {
//             'Pending Approval': 'bg-yellow-100 text-yellow-800',
//             'Approved': 'bg-blue-100 text-blue-800',
//             'Rejected': 'bg-red-100 text-red-800',
//             'Disbursed': 'bg-green-100 text-green-800',
//             'Closed': 'bg-gray-100 text-gray-800'
//         };
//         return <Badge className={statusMap[status] || ""}>{status}</Badge>;
//     }

//     const renderTable = (data: LoanApplication[], tabName: string) => {
//         if (isLoading) {
//              return <p className="text-muted-foreground text-center py-8">Loading...</p>;
//         }
//         if (data.length === 0) {
//             return <p className="text-muted-foreground text-center py-8">No applications found {tabName === 'History' && historyFilter !== 'All' ? `with status "${historyFilter}"` : `in ${tabName}`}.</p>;
//         }
//         return (
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>ID</TableHead>
//                         <TableHead>Employee</TableHead>
//                         <TableHead>Type</TableHead>
//                         <TableHead>Amount</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {data.map(app => (
//                         <TableRow key={app.id}>
//                             <TableCell>{app.application_id_text}</TableCell>
//                             <TableCell>{app.employee_name}</TableCell>
//                             <TableCell><Badge variant={app.is_advance ? "secondary" : "default"}>{app.loan_type_name}</Badge></TableCell>
//                             <TableCell>${Number(app.requested_amount).toLocaleString()}</TableCell>
//                             <TableCell>{getStatusBadge(app.status)}</TableCell>
//                             <TableCell className="text-right">
//                                 <Button asChild variant="ghost" size="sm">
//                                     <Link href={`/management/loans/${app.id}`}><Eye className="h-4 w-4 mr-2"/>View Details</Link>
//                                 </Button>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         );
//     }

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                     <DollarSign className="h-8 w-8" />
//                     <div>
//                         <h1 className="text-3xl font-bold">Loan & Advance Management</h1>
//                         <p className="text-muted-foreground">Review, approve, and track all employee loan applications.</p>
//                     </div>
//                 </div>

//                 <Tabs defaultValue="pending">
//                     <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="pending">Pending Requests <Badge className="ml-2">{pendingApplications.length}</Badge></TabsTrigger>
//                         <TabsTrigger value="history">History</TabsTrigger>
//                     </TabsList>
//                     <TabsContent value="pending">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Pending Approval</CardTitle>
//                                 <CardDescription>These applications require review and action.</CardDescription>
//                             </CardHeader>
//                             <CardContent>{renderTable(pendingApplications, "Pending Requests")}</CardContent>
//                         </Card>
//                     </TabsContent>
//                     <TabsContent value="history">
//                          <Card>
//                             <CardHeader>
//                                 <CardTitle>Application History</CardTitle>
//                                 <CardDescription>A complete log of all processed loan applications.</CardDescription>
//                                 <div className="pt-4">
//                                     <Select value={historyFilter} onValueChange={setHistoryFilter}>
//                                         <SelectTrigger className="w-[280px]">
//                                             <SelectValue placeholder="Filter by status..." />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="All">All Statuses</SelectItem>
//                                             <SelectItem value="Approved">Approved</SelectItem>
//                                             <SelectItem value="Disbursed">Disbursed</SelectItem>
//                                             <SelectItem value="Rejected">Rejected</SelectItem>
//                                             <SelectItem value="Closed">Closed</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                             </CardHeader>
//                             <CardContent>{renderTable(historicalApplications, "History")}</CardContent>
//                         </Card>
//                     </TabsContent>
//                 </Tabs>
//             </div>
//         </MainLayout>
//     )
// }

"use client"

import * as React from "react"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, Eye } from "lucide-react"
import { getLoanApplications, type LoanApplication } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

// Skeleton for page header
function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-80" />
        <Skeleton className="h-5 w-96" />
      </div>
    </div>
  )
}

// Skeleton for table rows
function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-28" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-9 w-32 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Skeleton for card content
function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent>
        <TableSkeleton />
      </CardContent>
    </Card>
  )
}

// Full page skeleton
function LoanManagementSkeleton() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton />
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
          <CardSkeleton />
        </div>
      </div>
    </MainLayout>
  )
}

export default function LoanManagementPage() {
  const { toast } = useToast()
  const [allApplications, setAllApplications] = React.useState<LoanApplication[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [historyFilter, setHistoryFilter] = React.useState<string>("All")

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getLoanApplications()
      setAllApplications(data)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "Could not load loan applications.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const pendingApplications = React.useMemo(() => 
    allApplications.filter(app => app.status === 'Pending Approval'), 
    [allApplications]
  )

  const historicalApplications = React.useMemo(() => {
    const history = allApplications.filter(app => app.status !== 'Pending Approval')
    if (historyFilter === 'All') {
      return history
    }
    return history.filter(app => app.status === historyFilter)
  }, [allApplications, historyFilter])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'Pending Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      'Approved': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      'Disbursed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
    }
    return <Badge className={statusMap[status] || ""}>{status}</Badge>
  }

  const renderTable = (data: LoanApplication[], tabName: string) => {
    if (data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-muted rounded-full">
              <DollarSign className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
          <p className="text-muted-foreground">
            {tabName === 'History' && historyFilter !== 'All' 
              ? `No applications found with status "${historyFilter}".` 
              : `No applications found in ${tabName}.`}
          </p>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(app => (
              <TableRow key={app.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{app.application_id_text}</TableCell>
                <TableCell>{app.employee_name}</TableCell>
                <TableCell>
                  <Badge variant={app.is_advance ? "secondary" : "default"}>
                    {app.loan_type_name}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono font-medium">
                  {formatAED(app.requested_amount)}
                </TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/management/loans/${app.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (isLoading) {
    return <LoanManagementSkeleton />
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Loan & Advance Management</h1>
            <p className="text-muted-foreground">
              Review, approve, and track all employee loan applications.
            </p>
          </div>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pending Requests 
              {pendingApplications.length > 0 && (
                <Badge className="ml-2" variant="secondary">
                  {pendingApplications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pending Approval</CardTitle>
                    <CardDescription className="mt-1">
                      These applications require review and action.
                    </CardDescription>
                  </div>
                  {pendingApplications.length > 0 && (
                    <Badge variant="outline" className="text-sm">
                      {pendingApplications.length} {pendingApplications.length === 1 ? 'Request' : 'Requests'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {renderTable(pendingApplications, "Pending Requests")}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Application History</CardTitle>
                    <CardDescription className="mt-1">
                      A complete log of all processed loan applications.
                    </CardDescription>
                  </div>
                  {historicalApplications.length > 0 && (
                    <Badge variant="outline" className="text-sm">
                      {historicalApplications.length} {historicalApplications.length === 1 ? 'Application' : 'Applications'}
                    </Badge>
                  )}
                </div>
                <div className="pt-4">
                  <div className="flex items-center gap-2">
                    <Select value={historyFilter} onValueChange={setHistoryFilter}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Filter by status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Disbursed">Disbursed</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    {historyFilter !== 'All' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setHistoryFilter('All')}
                      >
                        Clear Filter
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderTable(historicalApplications, "History")}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
