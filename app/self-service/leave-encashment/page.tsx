// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Wallet, Plus, AlertCircle, Eye } from "lucide-react";
// import { getLeaveBalances, submitLeaveEncashment, getLeaveEncashmentRequests, type LeaveBalance, type LeaveEncashmentRequest } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/lib/auth-context";
// import { Alert, AlertTitle } from "@/components/ui/alert";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { LeaveEncashmentDetailsDialog } from "@/components/self-service/leave-encashment-details-dialog";

// export default function LeaveEncashmentPage() {
//     const { toast } = useToast();
//     const { user } = useAuth();
//     const [balances, setBalances] = React.useState<LeaveBalance[]>([]);
//     const [requests, setRequests] = React.useState<LeaveEncashmentRequest[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
    
//     const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false);
//     const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false);
//     const [selectedRequest, setSelectedRequest] = React.useState<LeaveEncashmentRequest | null>(null);

//     const [daysToEncash, setDaysToEncash] = React.useState<string>('');
//     const [formError, setFormError] = React.useState<string>('');

//     // Logic is now hardcoded to only find Annual Leave (ID 8)
//     const annualLeave = balances.find(b => b.id === 8 && b.is_encashable);

//     const fetchData = React.useCallback(async () => {
//         if (!user) return;
//         setIsLoading(true);
//         try {
//             const [balanceData, requestData] = await Promise.all([
//                 getLeaveBalances(),
//                 getLeaveEncashmentRequests({ employee_id: user.id })
//             ]);
//             setBalances(balanceData);
//             setRequests(requestData);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load your leave encashment data.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast, user]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     React.useEffect(() => {
//         if (annualLeave && Number(daysToEncash) > Number(annualLeave.balance)) {
//             setFormError(`You cannot encash more than your available balance of ${annualLeave.balance} days.`);
//         } else {
//             setFormError('');
//         }
//     }, [daysToEncash, annualLeave]);
    
//     const handleViewDetails = (request: LeaveEncashmentRequest) => {
//         setSelectedRequest(request);
//         setIsDetailsDialogOpen(true);
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (formError || !daysToEncash || !annualLeave) return;
//         try {
//             // The leave_type_id is now hardcoded to 8
//             await submitLeaveEncashment({ leave_type_id: 8, days_to_encash: Number(daysToEncash) });
//             toast({ title: "Success", description: "Your request has been submitted." });
//             fetchData();
//             setIsRequestDialogOpen(false);
//             setDaysToEncash('');
//         } catch (error: any) {
//             toast({ title: "Error", description: `Request failed: ${error.message}`, variant: "destructive" });
//         }
//     }

//     const getStatusBadge = (status: string) => {
//         const statusMap: Record<string, string> = {
//             'Pending': 'bg-yellow-100 text-yellow-800',
//             'Approved': 'bg-blue-100 text-blue-800',
//             'Processed': 'bg-green-100 text-green-800',
//             'Rejected': 'bg-red-100 text-red-800',
//         };
//         return <Badge className={statusMap[status] || ""}>{status}</Badge>;
//     }

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <Wallet className="h-8 w-8" />
//                         <div>
//                             <h1 className="text-3xl font-bold">Leave Encashment</h1>
//                             <p className="text-muted-foreground">Request payment for your unused Annual Leave.</p>
//                         </div>
//                     </div>
//                     <Button onClick={() => setIsRequestDialogOpen(true)} disabled={!annualLeave}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         New Request
//                     </Button>
//                 </div>

//                 <Card>
//                     <CardHeader><CardTitle>Annual Leave Balance</CardTitle></CardHeader>
//                     <CardContent>
//                         {annualLeave ? (
//                             <div className="p-4 bg-muted rounded-lg w-fit">
//                                 <p className="text-2xl font-bold text-primary">{annualLeave.balance}</p>
//                                 <p className="text-xs text-muted-foreground">days available for encashment</p>
//                             </div>
//                         ) : <p className="text-muted-foreground">Your Annual Leave is not eligible for encashment at this time.</p>}
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader><CardTitle>My Encashment History</CardTitle></CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Days</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
//                             <TableBody>
//                                 {requests.length === 0 ? (
//                                     <TableRow><TableCell colSpan={5} className="text-center h-24">No encashment requests found.</TableCell></TableRow>
//                                 ) : requests.map(req => (
//                                     <TableRow key={req.id}>
//                                         <TableCell>{new Date(req.request_date).toLocaleDateString()}</TableCell>
//                                         <TableCell>{req.days_to_encash}</TableCell>
//                                         <TableCell>${Number(req.calculated_amount).toLocaleString()}</TableCell>
//                                         <TableCell>{getStatusBadge(req.status)}</TableCell>
//                                         <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleViewDetails(req)}><Eye className="h-4 w-4 mr-2"/>View</Button></TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>

//             <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>New Annual Leave Encashment Request</DialogTitle>
//                         <DialogDescription>Enter the number of days you wish to encash. The final amount will be calculated based on your current salary and benefits.</DialogDescription>
//                     </DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4 py-4">
//                          <div className="grid gap-2">
//                             <Label htmlFor="days_to_encash">Days to Encash</Label>
//                             <Input id="days_to_encash" type="number" value={daysToEncash} onChange={e => setDaysToEncash(e.target.value)} min="1" max={annualLeave?.balance} required/>
//                         </div>
//                         {formError && (
//                             <Alert variant="destructive">
//                                 <AlertCircle className="h-4 w-4" />
//                                 <AlertTitle>{formError}</AlertTitle>
//                             </Alert>
//                         )}
//                         <DialogFooter>
//                             <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
//                             <Button type="submit" disabled={!!formError}>Submit Request</Button>
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>

//             <LeaveEncashmentDetailsDialog 
//                 request={selectedRequest}
//                 open={isDetailsDialogOpen}
//                 onOpenChange={setIsDetailsDialogOpen}
//             />
//         </MainLayout>
//     )
// }

"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Wallet, 
  Plus, 
  AlertCircle, 
  Eye, 
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp
} from "lucide-react"
import { 
  getMyEncashableLeaves,
  submitLeaveEncashment, 
  getLeaveEncashmentRequests, 
  type LeaveBalance, 
  type LeaveEncashmentRequest 
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LeaveEncashmentDetailsDialog } from "@/components/self-service/leave-encashment-details-dialog"

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
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Leave Type</TableHead>
          <TableHead>Days</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-28" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function LeaveEncashmentPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [encashableLeaves, setEncashableLeaves] = React.useState<LeaveBalance[]>([])
  const [requests, setRequests] = React.useState<LeaveEncashmentRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false)
  const [selectedRequest, setSelectedRequest] = React.useState<LeaveEncashmentRequest | null>(null)

  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = React.useState<string>('')
  const [daysToEncash, setDaysToEncash] = React.useState<string>('')
  const [formError, setFormError] = React.useState<string>('')

  const selectedLeave = encashableLeaves.find(l => String(l.id) === selectedLeaveTypeId)

  const fetchData = React.useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const [leavesData, requestData] = await Promise.all([
        getMyEncashableLeaves(user.id),
        getLeaveEncashmentRequests({ employee_id: user.id })
      ])
      setEncashableLeaves(leavesData)
      setRequests(requestData)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "Could not load your leave encashment data.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, user])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  // Validation
  React.useEffect(() => {
    if (!selectedLeave) {
      setFormError('')
      return
    }

    const days = Number(daysToEncash)
    const balance = Number(selectedLeave.balance)

    if (daysToEncash && days <= 0) {
      setFormError('Days must be greater than 0.')
    } else if (daysToEncash && days > balance) {
      setFormError(`You cannot encash more than your available balance of ${balance} days.`)
    } else {
      setFormError('')
    }
  }, [daysToEncash, selectedLeave])
  
  const handleViewDetails = (request: LeaveEncashmentRequest) => {
    setSelectedRequest(request)
    setIsDetailsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedLeaveTypeId) {
      toast({
        title: "Validation Error",
        description: "Please select a leave type.",
        variant: "destructive"
      })
      return
    }

    if (!daysToEncash || formError) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await submitLeaveEncashment({ 
        leave_type_id: Number(selectedLeaveTypeId), 
        days_to_encash: Number(daysToEncash) 
      })
      toast({ 
        title: "Success", 
        description: "Your encashment request has been submitted successfully." 
      })
      fetchData()
      setIsRequestDialogOpen(false)
      setSelectedLeaveTypeId('')
      setDaysToEncash('')
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Request failed: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Pending': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Approved': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
      'Processed': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: Clock }
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  // Calculate form progress
  const formProgress = React.useMemo(() => {
    let filled = 0
    if (selectedLeaveTypeId) filled++
    if (daysToEncash && !formError) filled++
    return (filled / 2) * 100
  }, [selectedLeaveTypeId, daysToEncash, formError])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <TableSkeleton />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  const totalEncashableDays = encashableLeaves.reduce((sum, leave) => sum + Number(leave.balance), 0)
  const pendingRequests = requests.filter(r => r.status === 'Pending').length
  const processedRequests = requests.filter(r => r.status === 'Processed').length

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Leave Encashment</h1>
              <p className="text-muted-foreground">Request payment for your unused eligible leave days</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsRequestDialogOpen(true)} 
            disabled={encashableLeaves.length === 0}
            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Encashable Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalEncashableDays}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {encashableLeaves.length} leave type(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingRequests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{processedRequests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Encashable Leave Balances */}
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Wallet className="h-5 w-5" />
              Your Encashable Leave Balance
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Leave types available for encashment
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {encashableLeaves.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-muted rounded-full">
                    <AlertCircle className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Encashable Leave</h3>
                <p className="text-muted-foreground">
                  You don't have any leave types eligible for encashment at this time
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {encashableLeaves.map(leave => (
                  <div key={leave.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-900 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      {leave.leave_type_name}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-600">{leave.balance}</span>
                      <span className="text-sm text-green-700 dark:text-green-300">days</span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Available for encashment
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Encashment History */}
        <Card>
          <CardHeader>
            <CardTitle>My Encashment History</CardTitle>
            <CardDescription>View all your leave encashment requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-muted rounded-full">
                    <DollarSign className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Requests Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't submitted any encashment requests
                </p>
                <Button 
                  onClick={() => setIsRequestDialogOpen(true)} 
                  variant="outline"
                  disabled={encashableLeaves.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Request
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map(req => (
                      <TableRow key={req.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {new Date(req.request_date).toLocaleDateString('en-AE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {(encashableLeaves.find(leave => leave.id === req.leave_type_id))?.leave_type_name}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{req.days_to_encash} days</TableCell>
                        <TableCell className="font-mono font-medium text-green-600">
                          {formatAED(req.calculated_amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDetails(req)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
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

      {/* Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              New Leave Encashment Request
            </DialogTitle>
            <DialogDescription>
              Select a leave type and specify the number of days you wish to encash. 
              The amount will be calculated based on your current salary and benefits.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Progress Indicator */}
            {selectedLeave && (
              <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200 dark:from-slate-900 dark:to-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Request Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Form completion</span>
                      <span className="font-medium">{Math.round(formProgress)}%</span>
                    </div>
                    <Progress value={formProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leave Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="leave_type" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Select Leave Type *
              </Label>
              <Select 
                value={selectedLeaveTypeId} 
                onValueChange={setSelectedLeaveTypeId}
                disabled={isSubmitting}
              >
                <SelectTrigger id="leave_type">
                  <SelectValue placeholder="Choose a leave type..." />
                </SelectTrigger>
                <SelectContent>
                  {encashableLeaves.map(leave => (
                    <SelectItem key={leave.id} value={String(leave.id)}>
                      {leave.leave_type_name} ({leave.balance} days available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Balance Info */}
            {selectedLeave && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900 dark:text-blue-100">Available Balance</AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  You have <strong>{selectedLeave.balance} days</strong> of {selectedLeave.leave_type_name} available for encashment
                </AlertDescription>
              </Alert>
            )}

            {/* Days Input */}
            <div className="space-y-2">
              <Label htmlFor="days_to_encash" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Days to Encash *
              </Label>
              <Input 
                id="days_to_encash" 
                type="number" 
                value={daysToEncash} 
                onChange={e => setDaysToEncash(e.target.value)} 
                min="1" 
                max={selectedLeave?.balance}
                disabled={!selectedLeaveTypeId || isSubmitting}
                placeholder="Enter number of days"
              />
              {formError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formError}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsRequestDialogOpen(false)
                  setSelectedLeaveTypeId('')
                  setDaysToEncash('')
                  setFormError('')
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!!formError || !selectedLeaveTypeId || !daysToEncash || isSubmitting}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <LeaveEncashmentDetailsDialog 
        request={selectedRequest}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </MainLayout>
  )
}
