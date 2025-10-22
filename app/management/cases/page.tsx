

// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { FolderKanban, Check, X } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { getManagerCaseApprovals, processCaseApproval, type Case } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// export default function ManagerCaseApprovalPage() {
//     const { toast } = useToast();
//     const [cases, setCases] = React.useState<Case[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [selectedCase, setSelectedCase] = React.useState<Case | null>(null);
//     const [isModalOpen, setIsModalOpen] = React.useState(false);
//     const [rejectionReason, setRejectionReason] = React.useState('');

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const data = await getManagerCaseApprovals();
//             setCases(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load approval queue.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => { fetchData(); }, [fetchData]);

//     const handleProcess = async (status: 'Approved' | 'Rejected') => {
//         if (!selectedCase) return;
//         if (status === 'Rejected' && !rejectionReason) {
//             toast({ title: "Error", description: "Rejection reason is required.", variant: "destructive" });
//             return;
//         }
//         try {
//             await processCaseApproval(selectedCase.id, { status, rejection_reason: rejectionReason });
//             toast({ title: "Success", description: "Case has been processed." });
//             fetchData();
//             setIsModalOpen(false);
//             setRejectionReason('');
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to process: ${error.message}`, variant: "destructive" });
//         }
//     }

//     // Skeleton loading component
//     const CaseApprovalSkeleton = () => (
        
//             <div className="space-y-6">
//                 {/* Header skeleton */}
//                 <div className="flex items-center gap-4">
//                     <Skeleton className="h-8 w-8" />
//                     <div className="space-y-2">
//                         <Skeleton className="h-8 w-80" />
//                         <Skeleton className="h-4 w-96" />
//                     </div>
//                 </div>

//                 {/* Card skeleton */}
//                 <Card>
//                     <CardHeader>
//                         <Skeleton className="h-6 w-48" />
//                     </CardHeader>
//                     <CardContent>
//                         {/* Table skeleton */}
//                         <div className="space-y-4">
//                             {/* Table header */}
//                             <div className="flex justify-between items-center pb-2 border-b">
//                                 <Skeleton className="h-4 w-20" />
//                                 <Skeleton className="h-4 w-24" />
//                                 <Skeleton className="h-4 w-16" />
//                                 <Skeleton className="h-4 w-16" />
//                             </div>
                            
//                             {/* Table rows */}
//                             {Array.from({ length: 4 }).map((_, index) => (
//                                 <div key={index} className="flex justify-between items-center py-3 border-b">
//                                     <Skeleton className="h-4 w-24" />
//                                     <Skeleton className="h-4 w-32" />
//                                     <Skeleton className="h-4 w-48" />
//                                     <Skeleton className="h-8 w-20" />
//                                 </div>
//                             ))}
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
        
//     );

//     // Show skeleton while loading
//     if (isLoading) {
//         return <CaseApprovalSkeleton />;
//     }

//     return (
//         <>
//             <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                     <FolderKanban className="h-8 w-8"/>
//                     <div>
//                         <h1 className="text-3xl font-bold">Employee Case Management</h1>
//                         <p className="text-muted-foreground">Review cases for your direct reports that require your approval.</p>
//                     </div>
//                 </div>
//                 <Card>
//                     <CardHeader><CardTitle>My Approval Queue</CardTitle></CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Case ID</TableHead>
//                                     <TableHead>Employee</TableHead>
//                                     <TableHead>Title</TableHead>
//                                     <TableHead className="text-right">Action</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {cases.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={4} className="text-center h-24">
//                                             No Active Cases Found
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     cases.map(c => (
//                                         <TableRow key={c.id}>
//                                             <TableCell>{c.case_id_text}</TableCell>
//                                             <TableCell>{c.employee_name}</TableCell>
//                                             <TableCell>{c.title}</TableCell>
//                                             <TableCell className="text-right">
//                                                 <Button size="sm" onClick={() => { setSelectedCase(c); setIsModalOpen(true); }}>
//                                                     Review
//                                                 </Button>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>
//             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Approve Case: {selectedCase?.case_id_text}</DialogTitle>
//                         <DialogDescription>{selectedCase?.title}</DialogDescription>
//                     </DialogHeader>
//                     <div className="py-4 space-y-4">
//                         <p className="text-sm"><strong>Employee:</strong> {selectedCase?.employee_name}</p>
//                         <p className="text-sm"><strong>Description:</strong> {selectedCase?.description}</p>
//                         <div className="grid gap-2">
//                             <Label>Rejection Reason</Label>
//                             <Textarea 
//                                 placeholder="Required if rejecting..." 
//                                 value={rejectionReason}
//                                 onChange={e => setRejectionReason(e.target.value)} 
//                             />
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button variant="destructive" onClick={() => handleProcess('Rejected')}>
//                             <X className="h-4 w-4 mr-2"/>Reject
//                         </Button>
//                         <Button onClick={() => handleProcess('Approved')}>
//                             <Check className="h-4 w-4 mr-2"/>Approve
//                         </Button>
//                     </DialogFooter>
//                     </DialogContent>
//             </Dialog>
            
//         </>
//     );
// }


"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  FolderKanban, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileQuestion,
  Users,
  AlertCircle
} from "lucide-react"
import { getManagerCaseApprovals, type Case } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-96" />
        <Skeleton className="h-5 w-[600px]" />
      </div>
    </div>
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

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Case ID</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-6 w-28" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-28" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function ManagerCaseApprovalPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [cases, setCases] = React.useState<Case[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getManagerCaseApprovals()
      setCases(Array.isArray(data) ? data : [])
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "Could not load approval queue.", 
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
  const pendingCases = cases.filter(c => c.status === 'Open' || c.status === 'Under Review').length
  const uniqueEmployees = new Set(cases.map(c => c.employee_id)).size

  if (isLoading) {
    return (
      <>
        <div className="space-y-6">
          <PageHeaderSkeleton />
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
      </>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FolderKanban className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Team Case Management</h1>
            <p className="text-muted-foreground">
              Review and manage cases for your direct reports that require your approval
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingCases}</div>
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
              <div className="text-3xl font-bold text-blue-600">{uniqueEmployees}</div>
            </CardContent>
          </Card>
        </div>

        {/* Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Approval Queue</CardTitle>
            <CardDescription>
              Click "View Details" to review complete case information and take action
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
                  There are no cases requiring your approval at the moment
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cases.map(c => (
                      <TableRow 
                        key={c.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-mono font-medium">
                          {c.case_id_text}
                        </TableCell>
                        <TableCell className="font-medium">
                          {c.employee_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {c.category_name}
                          </Badge>
                        </TableCell>
                        <TableCell>{c.title}</TableCell>
                        <TableCell>{getStatusBadge(c.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            asChild
                            className="gap-2"
                          >
                            <Link href={`/team/cases/${c.id}`}>
                              <Eye className="h-4 w-4" />
                              View Details
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
    </>
  )
}
