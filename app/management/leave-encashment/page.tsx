
// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Wallet, Check, X, BadgeCent } from "lucide-react";
// import { getLeaveEncashmentRequests, type LeaveEncashmentRequest } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/lib/auth-context";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { LeaveEncashmentApprovalDialog } from "@/components/management/leave-encashment/LeaveEncashmentApprovalDialog";
// import { LeaveEncashmentDisbursementDialog } from "@/components/management/leave-encashment/LeaveEncashmentDisbursementDialog";
// import { Badge } from "@/components/ui/badge";

// export default function LeaveEncashmentApprovalPage() {
//     const { toast } = useToast();
//     const { hasPermission } = useAuth();
//     const [pendingRequests, setPendingRequests] = React.useState<LeaveEncashmentRequest[]>([]);
//     const [approvedRequests, setApprovedRequests] = React.useState<LeaveEncashmentRequest[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
    
//     const [selectedRequest, setSelectedRequest] = React.useState<LeaveEncashmentRequest | null>(null);
//     const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false);
//     const [isDisburseDialogOpen, setIsDisburseDialogOpen] = React.useState(false);

//     const canManageLeaves = hasPermission('leaves.manage');

//     const fetchData = React.useCallback(async () => {
//         if (!canManageLeaves) {
//             setIsLoading(false);
//             return;
//         }
//         setIsLoading(true);
//         try {
//             const allRequests = await getLeaveEncashmentRequests();
//             setPendingRequests(allRequests.filter(r => r.status === 'Pending'));
//             setApprovedRequests(allRequests.filter(r => r.status === 'Approved'));
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load pending requests.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast, canManageLeaves]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     if (!canManageLeaves) {
//         return (
//             <MainLayout>
//                 <Alert variant="destructive">
//                     <AlertTitle>Access Denied</AlertTitle>
//                     <AlertDescription>You do not have permission to manage leave requests.</AlertDescription>
//                 </Alert>
//             </MainLayout>
//         );
//     }

//     const renderApprovalTable = () => (
//         <Table>
//             <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Request Date</TableHead><TableHead>Days</TableHead><TableHead>Est. Amount</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
//             <TableBody>
//                 {isLoading ? (
//                     <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
//                 ) : pendingRequests.length === 0 ? (
//                     <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No pending requests for manager approval.</TableCell></TableRow>
//                 ) : (
//                     pendingRequests.map(req => (
//                         <TableRow key={req.id}>
//                             <TableCell>{req.employee_name}</TableCell>
//                             <TableCell>{new Date(req.request_date).toLocaleDateString()}</TableCell>
//                             <TableCell>{req.days_to_encash}</TableCell>
//                             <TableCell>${Number(req.calculated_amount).toLocaleString()}</TableCell>
//                             <TableCell className="text-right">
//                                 <Button size="sm" onClick={() => { setSelectedRequest(req); setIsApprovalDialogOpen(true); }}>Review</Button>
//                             </TableCell>
//                         </TableRow>
//                     ))
//                 )}
//             </TableBody>
//         </Table>
//     );

//     const renderDisbursementTable = () => (
//         <Table>
//             <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Days</TableHead><TableHead>Final Amount</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
//             <TableBody>
//                 {isLoading ? (
//                     <TableRow><TableCell colSpan={4} className="text-center h-24">Loading...</TableCell></TableRow>
//                 ) : approvedRequests.length === 0 ? (
//                     <TableRow><TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No approved requests pending disbursement.</TableCell></TableRow>
//                 ) : (
//                     approvedRequests.map(req => (
//                         <TableRow key={req.id}>
//                             <TableCell>{req.employee_name}</TableCell>
//                             <TableCell>{req.days_to_encash}</TableCell>
//                             <TableCell>${Number(req.calculated_amount).toLocaleString()}</TableCell>
//                             <TableCell className="text-right">
//                                 <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(req); setIsDisburseDialogOpen(true); }}>
//                                     <BadgeCent className="h-4 w-4 mr-2" />
//                                     Disburse
//                                 </Button>
//                             </TableCell>
//                         </TableRow>
//                     ))
//                 )}
//             </TableBody>
//         </Table>
//     );

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                  <div className="flex items-center gap-4">
//                     <Wallet className="h-8 w-8" />
//                     <div>
//                         <h1 className="text-3xl font-bold">Leave Encashment Processing</h1>
//                         <p className="text-muted-foreground">Review, approve, and disburse employee leave encashment requests.</p>
//                     </div>
//                 </div>

//                 <Tabs defaultValue="approval">
//                     <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="approval">Manager Approval Queue <Badge className="ml-2">{pendingRequests.length}</Badge></TabsTrigger>
//                         <TabsTrigger value="disbursement">Finance Disbursement Queue <Badge className="ml-2">{approvedRequests.length}</Badge></TabsTrigger>
//                     </TabsList>
//                     <TabsContent value="approval">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Pending Manager Approval</CardTitle>
//                                 <CardDescription>Review and approve or reject new encashment requests.</CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 {renderApprovalTable()}
//                             </CardContent>
//                         </Card>
//                     </TabsContent>
//                     <TabsContent value="disbursement">
//                          <Card>
//                             <CardHeader>
//                                 <CardTitle>Pending Disbursement</CardTitle>
//                                 <CardDescription>These requests have been approved by a manager and are ready for financial processing.</CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 {renderDisbursementTable()}
//                             </CardContent>
//                         </Card>
//                     </TabsContent>
//                 </Tabs>
//             </div>
            
//             <LeaveEncashmentApprovalDialog 
//                 request={selectedRequest}
//                 open={isApprovalDialogOpen}
//                 onOpenChange={setIsApprovalDialogOpen}
//                 onSuccess={fetchData}
//             />

//             <LeaveEncashmentDisbursementDialog
//                 request={selectedRequest}
//                 open={isDisburseDialogOpen}
//                 onOpenChange={setIsDisburseDialogOpen}
//                 onSuccess={fetchData}
//             />
//         </MainLayout>
//     );
// }

"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, BadgeCent, Loader2 } from "lucide-react";
import { getLeaveEncashmentRequests, type LeaveEncashmentRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LeaveEncashmentApprovalDialog } from "@/components/management/leave-encashment/LeaveEncashmentApprovalDialog";
import { LeaveEncashmentDisbursementDialog } from "@/components/management/leave-encashment/LeaveEncashmentDisbursementDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function formatAED(amount: number | string) {
  const n = typeof amount === "string" ? Number(amount) : amount ?? 0;
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 2 }).format(n);
}

export default function LeaveEncashmentApprovalPage() {
  const { toast } = useToast();
  const { hasPermission } = useAuth();
  const [pendingRequests, setPendingRequests] = React.useState<LeaveEncashmentRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = React.useState<LeaveEncashmentRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [selectedRequest, setSelectedRequest] = React.useState<LeaveEncashmentRequest | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false);
  const [isDisburseDialogOpen, setIsDisburseDialogOpen] = React.useState(false);

  // per-row action loaders
  const [openingApprovalId, setOpeningApprovalId] = React.useState<string | number | null>(null);
  const [openingDisburseId, setOpeningDisburseId] = React.useState<string | number | null>(null);

  const canManageLeaves = hasPermission("leaves.manage");

  const fetchData = React.useCallback(async () => {
    if (!canManageLeaves) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const allRequests = await getLeaveEncashmentRequests();
      setPendingRequests(allRequests.filter((r) => r.status === "Pending"));
      setApprovedRequests(allRequests.filter((r) => r.status === "Approved"));
    } catch (error: any) {
      toast({ title: "Error", description: "Could not load pending requests.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast, canManageLeaves]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!canManageLeaves) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to manage leave requests.</AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  const renderApprovalTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Days</TableHead>
          <TableHead>Est. Amount</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell><Skeleton className="h-5 w-40" /></TableCell>
              <TableCell><Skeleton className="h-5 w-36" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
              <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-24 rounded-md" /></TableCell>
            </TableRow>
          ))
        ) : pendingRequests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
              No pending requests for manager approval.
            </TableCell>
          </TableRow>
        ) : (
          pendingRequests.map((req) => (
            <TableRow key={req.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>{req.employee_name}</TableCell>
              <TableCell>{new Date(req.request_date).toLocaleDateString()}</TableCell>
              <TableCell>{req.days_to_encash}</TableCell>
              <TableCell>{formatAED(Number(req.calculated_amount))}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(req);
                    setOpeningApprovalId(req.id);
                    setIsApprovalDialogOpen(true);
                    setTimeout(() => setOpeningApprovalId(null), 200);
                  }}
                  disabled={openingApprovalId !== null}
                >
                  {openingApprovalId === req.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    "Review"
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const renderDisbursementTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Days</TableHead>
          <TableHead>Final Amount</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell><Skeleton className="h-5 w-40" /></TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
              <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-28 rounded-md" /></TableCell>
            </TableRow>
          ))
        ) : approvedRequests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
              No approved requests pending disbursement.
            </TableCell>
          </TableRow>
        ) : (
          approvedRequests.map((req) => (
            <TableRow key={req.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>{req.employee_name}</TableCell>
              <TableCell>{req.days_to_encash}</TableCell>
              <TableCell>{formatAED(Number(req.calculated_amount))}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(req);
                    setOpeningDisburseId(req.id);
                    setIsDisburseDialogOpen(true);
                    setTimeout(() => setOpeningDisburseId(null), 200);
                  }}
                  disabled={openingDisburseId !== null}
                >
                  {openingDisburseId === req.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <BadgeCent className="h-4 w-4 mr-2" />
                      Disburse
                    </>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Wallet className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Leave Encashment Processing</h1>
            <p className="text-muted-foreground">Review, approve, and disburse employee leave encashment requests.</p>
          </div>
        </div>

        <Tabs defaultValue="approval">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approval">
              Manager Approval Queue{" "}
              {isLoading ? (
                <span className="ml-2 inline-flex items-center">
                  <Skeleton className="h-5 w-8 rounded-full" />
                </span>
              ) : (
                <Badge className="ml-2">{pendingRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="disbursement">
              Finance Disbursement Queue{" "}
              {isLoading ? (
                <span className="ml-2 inline-flex items-center">
                  <Skeleton className="h-5 w-8 rounded-full" />
                </span>
              ) : (
                <Badge className="ml-2">{approvedRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approval">
            <Card>
              <CardHeader>
                <CardTitle>Pending Manager Approval</CardTitle>
                <CardDescription>Review and approve or reject new encashment requests.</CardDescription>
              </CardHeader>
              <CardContent>{renderApprovalTable()}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disbursement">
            <Card>
              <CardHeader>
                <CardTitle>Pending Disbursement</CardTitle>
                <CardDescription>These requests have been approved by a manager and are ready for financial processing.</CardDescription>
              </CardHeader>
              <CardContent>{renderDisbursementTable()}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <LeaveEncashmentApprovalDialog
        request={selectedRequest}
        open={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
        onSuccess={fetchData}
      />

      <LeaveEncashmentDisbursementDialog
        request={selectedRequest}
        open={isDisburseDialogOpen}
        onOpenChange={setIsDisburseDialogOpen}
        onSuccess={fetchData}
      />
    </MainLayout>
  );
}
