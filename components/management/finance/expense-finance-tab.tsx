

// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Banknote,
//   CheckCircle,
//   Filter,
//   Loader2,
// } from "lucide-react";
// import {
//   getExpenseClaims,
//   reimburseExpenseClaim,
//   getProcessedClaims,
//   getUpcomingPayrollReimbursements,
//   type ExpenseClaim,
// } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { ReimburseAdvanceDialog } from "@/components/finance/reimburse-advance-dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function ExpenseFinanceTab() {
//   const { toast } = useToast();
//   const [approvedClaims, setApprovedClaims] = React.useState<ExpenseClaim[]>([]);
//   const [processedClaims, setProcessedClaims] = React.useState<ExpenseClaim[]>([]);
//   const [upcomingPayrollClaims, setUpcomingPayrollClaims] = React.useState<ExpenseClaim[]>([]);
//   const [isLoading, setIsLoading] = React.useState(true);
//   const [isSubmitting, setIsSubmitting] = React.useState(false);
//   const [selectedClaim, setSelectedClaim] = React.useState<ExpenseClaim | null>(null);
//   const [isReimburseDialogOpen, setIsReimburseDialogOpen] = React.useState(false);
//   const [reimbursementMethod, setReimbursementMethod] = React.useState<'Payroll' | 'Direct Transfer' | ''>('');
//   const [transactionId, setTransactionId] = React.useState("");
//   const [isAdvanceReimburseOpen, setIsAdvanceReimburseOpen] = React.useState(false);
//   const [historyDateRange, setHistoryDateRange] = React.useState({
//     from: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
//       .toISOString()
//       .split("T")[0],
//     to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
//       .toISOString()
//       .split("T")[0],
//   });

//   const fetchData = React.useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const [approved, processed, upcoming] = await Promise.all([
//         getExpenseClaims({ status: "Approved" }),
//         getProcessedClaims(historyDateRange.from, historyDateRange.to),
//         getUpcomingPayrollReimbursements(),
//       ]);
//       setApprovedClaims(approved);
//       setProcessedClaims(processed);
//       setUpcomingPayrollClaims(upcoming);
//     } catch {
//       toast({ title: "Error", description: "Could not load expense data.", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast, historyDateRange]);

//   React.useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleReimburseClick = (claim: ExpenseClaim) => {
//     setSelectedClaim(claim);
//     if (claim.claim_type === "Advance") {
//       setIsAdvanceReimburseOpen(true);
//     } else {
//       setIsReimburseDialogOpen(true);
//     }
//   };

//   const handleConfirmReimbursement = async () => {
//     if (!selectedClaim || !reimbursementMethod) {
//       toast({ title: "Error", description: "Please select a reimbursement method.", variant: "destructive" });
//       return;
//     }
//     if (reimbursementMethod === "Direct Transfer" && !transactionId) {
//       toast({ title: "Error", description: "Transaction ID is required for direct transfer.", variant: "destructive" });
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload: {
//         reimbursement_method: "Payroll" | "Direct Transfer";
//         transaction_id: string;
//       } = {
//         reimbursement_method: reimbursementMethod,
//         transaction_id: reimbursementMethod === "Direct Transfer" ? transactionId : "",
//       };
//       await reimburseExpenseClaim(selectedClaim.id, payload);
//       toast({ title: "Success", description: "Claim has been marked as reimbursed." });
//       await fetchData();
//       setIsReimburseDialogOpen(false);
//       setReimbursementMethod("");
//       setTransactionId("");
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to reimburse: ${error.message}`, variant: "destructive" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const statusColors: Record<string, string> = {
//       Pending: "bg-yellow-100 text-yellow-800",
//       Approved: "bg-blue-100 text-blue-800",
//       Rejected: "bg-red-100 text-red-800",
//       Reimbursed: "bg-green-100 text-green-800",
//       Processed: "bg-gray-100 text-gray-800",
//     };
//     return <Badge className={statusColors[status] || ""}>{status}</Badge>;
//   };

//   // Skeleton while initial loading
//   if (isLoading) {
//     return (
//       <Skeleton className="h-96 w-full rounded-lg" />
//     );
//   }

//   return (
//     <>
//       <div className="space-y-6">
//         <Tabs defaultValue="pending">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="pending">Pending Reimbursements</TabsTrigger>
//             <TabsTrigger value="upcoming">Upcoming Payroll</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//           </TabsList>

//           {/* Pending Tab */}
//           <TabsContent value="pending">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Pending Reimbursements</CardTitle>
//                 <CardDescription>
//                   These claims have been approved by managers and are ready for reimbursement.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Employee</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead>Title</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Approved By</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {approvedClaims.length === 0 ? (
//                       <TableCell colSpan={6} className="text-center h-24">
//                         No Records Found
//                       </TableCell>
//                     ) : (
//                       approvedClaims.map((claim) => (
//                         <TableRow
//                           key={claim.id}
//                           onClick={() => handleReimburseClick(claim)}
//                           className="cursor-pointer"
//                         >
//                           <TableCell>{claim.employee_name}</TableCell>
//                           <TableCell>
//                             <Badge variant={claim.claim_type === "Advance" ? "secondary" : "default"}>
//                               {claim.claim_type}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>{claim.title}</TableCell>
//                           <TableCell>${claim.amount.toLocaleString()}</TableCell>
//                           <TableCell>{claim.approver_name}</TableCell>
//                           <TableCell className="text-right">
//                             <Button size="sm" disabled={isSubmitting}>
//                               {isSubmitting ? (
//                                 <Loader2 className="animate-spin h-4 w-4 mr-2" />
//                               ) : (
//                                 <CheckCircle className="h-4 w-4 mr-2" />
//                               )}
//                               Reimburse
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Upcoming Tab */}
//           <TabsContent value="upcoming">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Upcoming Payroll Reimbursements</CardTitle>
//                 <CardDescription>
//                   These expenses will be added to the next payroll run.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Employee</TableHead>
//                       <TableHead>Title</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Processed By</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {upcomingPayrollClaims.length === 0 ? (
//                       <TableCell colSpan={4} className="text-center h-24">
//                         No Records Found
//                       </TableCell>
//                     ) : (
//                       upcomingPayrollClaims.map((claim) => (
//                         <TableRow key={claim.id}>
//                           <TableCell>{claim.employee_name}</TableCell>
//                           <TableCell>{claim.title}</TableCell>
//                           <TableCell>${claim.amount.toLocaleString()}</TableCell>
//                           <TableCell>{claim.processor_name}</TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* History Tab */}
//           <TabsContent value="history">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Processed Claims History</CardTitle>
//                 <CardDescription>
//                   A log of all processed and reimbursed claims.
//                 </CardDescription>
//                 <div className="flex gap-4 pt-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="from-date">From</Label>
//                     <Input
//                       type="date"
//                       id="from-date"
//                       value={historyDateRange.from}
//                       onChange={(e) =>
//                         setHistoryDateRange({ ...historyDateRange, from: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="to-date">To</Label>
//                     <Input
//                       type="date"
//                       id="to-date"
//                       value={historyDateRange.to}
//                       onChange={(e) =>
//                         setHistoryDateRange({ ...historyDateRange, to: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="flex items-end">
//                     <Button onClick={() => fetchData()}>
//                       <Filter className="h-4 w-4 mr-2" />
//                       Filter
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Employee</TableHead>
//                       <TableHead>Title</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Processed By</TableHead>
//                       <TableHead>Transaction ID</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {processedClaims.length === 0 ? (
//                       <TableCell colSpan={6} className="text-center h-24">
//                         No Records Found
//                       </TableCell>
//                     ) : (
//                       processedClaims.map((claim) => (
//                         <TableRow key={claim.id}>
//                           <TableCell>{claim.employee_name}</TableCell>
//                           <TableCell>{claim.title}</TableCell>
//                           <TableCell>${claim.amount.toLocaleString()}</TableCell>
//                           <TableCell>{getStatusBadge(claim.status)}</TableCell>
//                           <TableCell>{claim.processor_name}</TableCell>
//                           <TableCell>{claim.transaction_id || "N/A"}</TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Reimburse Dialog */}
//       <Dialog open={isReimburseDialogOpen} onOpenChange={setIsReimburseDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Reimburse Expense</DialogTitle>
//             <DialogDescription>
//               Processing claim for {selectedClaim?.employee_name} of $
//               {selectedClaim?.amount.toLocaleString()}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4 space-y-4">
//             {selectedClaim?.receipt_url && (
//               <a
//                 href={selectedClaim.receipt_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 hover:underline font-medium"
//               >
//                 View Receipt
//               </a>
//             )}

//             <div className="grid gap-2">
//               <Label>Reimbursement Method</Label>
//               <Select
//                 onValueChange={(value: "Payroll" | "Direct Transfer") =>
//                   setReimbursementMethod(value)
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Method" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Payroll">Add to next Payroll</SelectItem>
//                   <SelectItem value="Direct Transfer">Direct Transfer</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {reimbursementMethod === "Direct Transfer" && (
//               <div className="grid gap-2">
//                 <Label htmlFor="transaction_id">Transaction ID</Label>
//                 <Input
//                   id="transaction_id"
//                   value={transactionId}
//                   onChange={(e) => setTransactionId(e.target.value)}
//                 />
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsReimburseDialogOpen(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleConfirmReimbursement} disabled={isSubmitting}>
//               {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
//               Confirm Reimbursement
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <ReimburseAdvanceDialog
//         claim={selectedClaim}
//         open={isAdvanceReimburseOpen}
//         onOpenChange={setIsAdvanceReimburseOpen}
//         onSuccess={fetchData}
//       />
//     </>
//   );
// }


"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Banknote,
  CheckCircle,
  Filter,
  Loader2,
  Eye,
} from "lucide-react";
import {
  getExpenseClaims,
  reimburseExpenseClaim,
  getProcessedClaims,
  getUpcomingPayrollReimbursements,
  type ExpenseClaim,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ReimburseAdvanceDialog } from "@/components/finance/reimburse-advance-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function formatAED(amount: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function ExpenseFinanceTab() {
  const { toast } = useToast();
  const [approvedClaims, setApprovedClaims] = React.useState<ExpenseClaim[]>([]);
  const [processedClaims, setProcessedClaims] = React.useState<ExpenseClaim[]>([]);
  const [upcomingPayrollClaims, setUpcomingPayrollClaims] = React.useState<ExpenseClaim[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedClaim, setSelectedClaim] = React.useState<ExpenseClaim | null>(null);
  const [isReimburseDialogOpen, setIsReimburseDialogOpen] = React.useState(false);
  const [reimbursementMethod, setReimbursementMethod] = React.useState<'Payroll' | 'Direct Transfer' | ''>('');
  const [transactionId, setTransactionId] = React.useState("");
  const [isAdvanceReimburseOpen, setIsAdvanceReimburseOpen] = React.useState(false);
  const [historyDateRange, setHistoryDateRange] = React.useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0],
  });

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [approved, processed, upcoming] = await Promise.all([
        getExpenseClaims({ status: "Approved" }),
        getProcessedClaims(historyDateRange.from, historyDateRange.to),
        getUpcomingPayrollReimbursements(),
      ]);
      setApprovedClaims(approved);
      setProcessedClaims(processed);
      setUpcomingPayrollClaims(upcoming);
    } catch (e: any) {
      toast({ title: "Error", description: "Could not load expense data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast, historyDateRange]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReimburseClick = (claim: ExpenseClaim) => {
    setSelectedClaim(claim);
    if (claim.claim_type === "Advance") {
      setIsAdvanceReimburseOpen(true);
    } else {
      setIsReimburseDialogOpen(true);
    }
  };

  const handleConfirmReimbursement = async () => {
    if (!selectedClaim || !reimbursementMethod) {
      toast({ title: "Error", description: "Please select a reimbursement method.", variant: "destructive" });
      return;
    }
    if (reimbursementMethod === "Direct Transfer" && !transactionId) {
      toast({ title: "Error", description: "Transaction ID is required for direct transfer.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: {
        reimbursement_method: "Payroll" | "Direct Transfer";
        transaction_id: string;
      } = {
        reimbursement_method: reimbursementMethod,
        transaction_id: reimbursementMethod === "Direct Transfer" ? transactionId : "",
      };
      await reimburseExpenseClaim(selectedClaim.id, payload);
      toast({ title: "Success", description: "Claim has been marked as reimbursed." });
      await fetchData();
      setIsReimburseDialogOpen(false);
      setReimbursementMethod("");
      setTransactionId("");
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to reimburse: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-blue-100 text-blue-800",
      Rejected: "bg-red-100 text-red-800",
      Reimbursed: "bg-green-100 text-green-800",
      Processed: "bg-gray-100 text-gray-800",
    };
    return <Badge className={statusColors[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Reimbursements</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payroll</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reimbursements</CardTitle>
              <CardDescription>These claims have been approved by managers and are ready for reimbursement.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-28 rounded-md" /></TableCell>
                      </TableRow>
                    ))
                  ) : approvedClaims.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No Records Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    approvedClaims.map((claim) => (
                      <TableRow key={claim.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>{claim.employee_name}</TableCell>
                        <TableCell>
                          <Badge variant={claim.claim_type === "Advance" ? "secondary" : "default"}>
                            {claim.claim_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{claim.title}</TableCell>
                        <TableCell>{formatAED(claim.amount)}</TableCell>
                        <TableCell>{claim.approver_name}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleReimburseClick(claim)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                Processing
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Reimburse
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Payroll Reimbursements</CardTitle>
              <CardDescription>These expenses will be added to the next payroll run.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Processed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      </TableRow>
                    ))
                  ) : upcomingPayrollClaims.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No Records Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    upcomingPayrollClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell>{claim.employee_name}</TableCell>
                        <TableCell>{claim.title}</TableCell>
                        <TableCell>{formatAED(claim.amount)}</TableCell>
                        <TableCell>{claim.processor_name}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Processed Claims History</CardTitle>
              <CardDescription>A log of all processed and reimbursed claims.</CardDescription>
              <div className="flex gap-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="from-date">From</Label>
                  <Input
                    type="date"
                    id="from-date"
                    value={historyDateRange.from}
                    onChange={(e) => setHistoryDateRange({ ...historyDateRange, from: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-date">To</Label>
                  <Input
                    type="date"
                    id="to-date"
                    value={historyDateRange.to}
                    onChange={(e) => setHistoryDateRange({ ...historyDateRange, to: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={() => fetchData()} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Filter className="h-4 w-4 mr-2" />
                    )}
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processed By</TableHead>
                    <TableHead>Transaction ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      </TableRow>
                    ))
                  ) : processedClaims.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No Records Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    processedClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell>{claim.employee_name}</TableCell>
                        <TableCell>{claim.title}</TableCell>
                        <TableCell>{formatAED(claim.amount)}</TableCell>
                        <TableCell>{getStatusBadge(claim.status)}</TableCell>
                        <TableCell>{claim.processor_name}</TableCell>
                        <TableCell>{claim.transaction_id || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reimburse Dialog */}
      <Dialog open={isReimburseDialogOpen} onOpenChange={setIsReimburseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reimburse Expense</DialogTitle>
            <DialogDescription>
              Processing claim for {selectedClaim?.employee_name} of {selectedClaim ? formatAED(selectedClaim.amount) : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4" aria-busy={isSubmitting}>
            {selectedClaim?.receipt_url && (
              <a
                href={selectedClaim.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline font-medium"
              >
                View Receipt
              </a>
            )}

            <div className="grid gap-2">
              <Label>Reimbursement Method</Label>
              <Select
                value={reimbursementMethod || undefined}
                onValueChange={(value: "Payroll" | "Direct Transfer") => setReimbursementMethod(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Payroll">Add to next Payroll</SelectItem>
                  <SelectItem value="Direct Transfer">Direct Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reimbursementMethod === "Direct Transfer" && (
              <div className="grid gap-2">
                <Label htmlFor="transaction_id">Transaction ID</Label>
                <Input
                  id="transaction_id"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReimburseDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmReimbursement} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Confirm Reimbursement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReimburseAdvanceDialog
        claim={selectedClaim}
        open={isAdvanceReimburseOpen}
        onOpenChange={setIsAdvanceReimburseOpen}
        onSuccess={fetchData}
      />
    </div>
  );
}
