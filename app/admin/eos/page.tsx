// "use client"

// import * as React from "react";
// import Link from "next/link";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Handshake, Plus, ArrowRight } from "lucide-react";
// import { getAllSettlements, type EosSettlement } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { InitiateSettlementDialog } from "@/components/admin/eos/InitiateSettlementDialog";

// export default function EosDashboardPage() {
//     const { toast } = useToast();
//     const [settlements, setSettlements] = React.useState<EosSettlement[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isInitiateDialogOpen, setIsInitiateDialogOpen] = React.useState(false);

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const data = await getAllSettlements();
//             setSettlements(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load settlements.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const getStatusBadge = (status: string) => {
//         const statusMap: Record<string, string> = {
//             'Pending': 'bg-yellow-100 text-yellow-800',
//             'Approved': 'bg-blue-100 text-blue-800',
//             'Paid': 'bg-green-100 text-green-800',
//         };
//         return <Badge className={statusMap[status] || ""}>{status}</Badge>;
//     }

//     return (
//         <MainLayout>
//              <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <Handshake className="h-8 w-8" />
//                         <div>
//                             <h1 className="text-3xl font-bold">End-of-Service Settlements</h1>
//                             <p className="text-muted-foreground">Manage the full and final settlement process for departing employees.</p>
//                         </div>
//                     </div>
//                     <Button onClick={() => setIsInitiateDialogOpen(true)}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         Initiate New Settlement
//                     </Button>
//                 </div>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Settlement Dashboard</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Employee Name</TableHead>
//                                     <TableHead>Last Working Date</TableHead>
//                                     <TableHead>Type</TableHead>
//                                     <TableHead>Net Amount</TableHead>
//                                     <TableHead>Status</TableHead>
//                                     <TableHead className="text-right">Action</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {isLoading ? (
//                                     <TableRow><TableCell colSpan={6} className="text-center h-24">Loading settlements...</TableCell></TableRow>
//                                 ) : settlements.length === 0?
                                
//                                 <TableRow><TableCell colSpan={6} className="text-center h-24">No Record Found</TableCell></TableRow>
//                                 :
//                                 settlements.map(item => (
//                                     <TableRow key={item.id}>
//                                         <TableCell className="font-medium">{item.employee_name}</TableCell>
//                                         <TableCell>{new Date(item.last_working_date).toLocaleDateString()}</TableCell>
//                                         <TableCell>{item.termination_type}</TableCell>
//                                         <TableCell>${Number(item.net_settlement_amount).toLocaleString()}</TableCell>
//                                         <TableCell>{getStatusBadge(item.status)}</TableCell>
//                                         <TableCell className="text-right">
//                                             <Button asChild variant="outline">
//                                                 <Link href={`/admin/eos/${item.id}`}>
//                                                     View Details <ArrowRight className="h-4 w-4 ml-2" />
//                                                 </Link>
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//              </div>
//              <InitiateSettlementDialog
//                 open={isInitiateDialogOpen}
//                 onOpenChange={setIsInitiateDialogOpen}
//                 onSuccess={fetchData}
//              />
//         </MainLayout>
//     );
// }


"use client"

import * as React from "react"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Handshake, Plus, ArrowRight } from "lucide-react"
import { getAllSettlements, type EosSettlement } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { InitiateSettlementDialog } from "@/components/admin/eos/InitiateSettlementDialog"

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

// Skeleton for table rows
function SettlementTableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-9 w-32 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

// Skeleton for page header
function PageHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-5 w-[500px]" />
        </div>
      </div>
      <Skeleton className="h-10 w-56" />
    </div>
  )
}

export default function EosDashboardPage() {
  const { toast } = useToast()
  const [settlements, setSettlements] = React.useState<EosSettlement[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isInitiateDialogOpen, setIsInitiateDialogOpen] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAllSettlements()
      setSettlements(data)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "Could not load settlements.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; label: string }> = {
      'Pending': { 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', 
        label: 'Pending' 
      },
      'Approved': { 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', 
        label: 'Approved' 
      },
      'Paid': { 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', 
        label: 'Paid' 
      },
    }
    
    const statusInfo = statusMap[status] || { 
      className: 'bg-gray-100 text-gray-800', 
      label: status 
    }
    
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {isLoading ? (
          <>
            <PageHeaderSkeleton />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-56" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Last Working Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SettlementTableSkeleton />
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Handshake className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">End-of-Service Settlements</h1>
                  <p className="text-muted-foreground">
                    Manage the full and final settlement process for departing employees.
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsInitiateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Initiate New Settlement
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Settlement Dashboard</CardTitle>
                    <CardDescription className="mt-1">
                      View and manage all employee settlements
                    </CardDescription>
                  </div>
                  {settlements.length > 0 && (
                    <Badge variant="secondary" className="text-sm">
                      {settlements.length} {settlements.length === 1 ? 'Settlement' : 'Settlements'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {settlements.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-muted rounded-full">
                        <Handshake className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Settlements Found</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      There are no settlement records available. Click "Initiate New Settlement" to start the process for a departing employee.
                    </p>
                    <Button onClick={() => setIsInitiateDialogOpen(true)} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Settlement
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee Name</TableHead>
                          <TableHead>Last Working Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Net Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {settlements.map(item => (
                          <TableRow key={item.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {item.employee_name}
                            </TableCell>
                            <TableCell>
                              {new Date(item.last_working_date).toLocaleDateString('en-AE', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {item.termination_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono font-medium">
                              {formatAED(item.net_settlement_amount)}
                            </TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/eos/${item.id}`}>
                                  View Details 
                                  <ArrowRight className="h-4 w-4 ml-2" />
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
          </>
        )}
      </div>

      <InitiateSettlementDialog
        open={isInitiateDialogOpen}
        onOpenChange={setIsInitiateDialogOpen}
        onSuccess={fetchData}
      />
    </MainLayout>
  )
}
