// "use client";

// import * as React from "react";
// import { useParams } from "next/navigation";
// import { MainLayout } from "@/components/main-layout";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   getLoanApplicationDetails,
//   getOngoingLoans,
//   adminUpdateLoanApplication,
//   processLoanApplication,
//   disburseLoan,
//   type LoanApplication,
//   type OngoingLoan,
//   type AmortizationEntry,
//   downloadLoanAgreement,
// } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import {
//   User,
//   DollarSign,
//   Calendar,
//   Hash,
//   FileText,
//   Banknote,
//   UserCheck,
// } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useAuth } from "@/lib/auth-context";
// import { ManualRepaymentDialog } from "@/components/management/loans/ManualRepaymentDialog";

// // --- UTILITY FUNCTIONS ---
// const calculateEMI = (p: number, r: number, t: number): number => {
//   if (p <= 0 || t <= 0 || r < 0) return 0;
//   if (r === 0) return parseFloat((p / t).toFixed(2));
//   const monthlyRate = r / 12 / 100;
//   const emi =
//     (p * monthlyRate * Math.pow(1 + monthlyRate, t)) /
//     (Math.pow(1 + monthlyRate, t) - 1);
//   return parseFloat(emi.toFixed(2));
// };

// const generateAmortization = (
//   principal: number,
//   annualRate: number,
//   tenureMonths: number
// ) => {
//   if (principal <= 0 || tenureMonths <= 0) return [];
//   const emi = calculateEMI(principal, annualRate, tenureMonths);
//   if (emi === 0) return [];

//   const monthlyRate = annualRate / 12 / 100;
//   let balance = principal;
//   const schedule = [];

//   for (let i = 0; i < tenureMonths; i++) {
//     const interest = balance * monthlyRate;
//     const principalComponent = emi - interest;
//     balance -= principalComponent;
//     schedule.push({
//       month: i + 1,
//       emi: emi.toFixed(2),
//       principal: principalComponent.toFixed(2),
//       interest: interest.toFixed(2),
//       balance: balance < 0 ? "0.00" : balance.toFixed(2),
//     });
//   }
//   return schedule;
// };

// export default function LoanApplicationPage() {
//   const params = useParams();
//   const { toast } = useToast();
//   const { hasPermission } = useAuth();

//   const [application, setApplication] = React.useState<LoanApplication | null>(
//     null
//   );
//   const [ongoingLoans, setOngoingLoans] = React.useState<OngoingLoan[]>([]);
//   const [isLoading, setIsLoading] = React.useState(true);

//   const [editableData, setEditableData] = React.useState({
//     approved_amount: "",
//     interest_rate: "",
//     tenure_months: "",
//   });
//   const [rejectionReason, setRejectionReason] = React.useState("");
//   const [disbursementData, setDisbursementData] = React.useState({
//     date: "",
//     jv: "",
//   });
//   const [estimatedSchedule, setEstimatedSchedule] = React.useState<any[]>([]);

//   // State for manual repayment dialog
//   const [isRepaymentDialogOpen, setIsRepaymentDialogOpen] =
//     React.useState(false);
//   const [selectedScheduleEntry, setSelectedScheduleEntry] =
//     React.useState<AmortizationEntry | null>(null);

//   const applicationId = Number(params.id);

//   // --- DATA FETCHING ---
//   const fetchApplication = React.useCallback(async () => {
//     if (!applicationId) return;
//     setIsLoading(true);
//     try {
//       const data = await getLoanApplicationDetails(applicationId);
//       setApplication(data);
//       setEditableData({
//         approved_amount: String(data.approved_amount || data.requested_amount),
//         interest_rate: String(data.interest_rate),
//         tenure_months: String(data.tenure_months),
//       });
//       const ongoing = await getOngoingLoans(data.employee_id);
//       setOngoingLoans(ongoing);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: "Could not load loan application details.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [applicationId, toast]);

//   React.useEffect(() => {
//     fetchApplication();
//   }, [fetchApplication]);

//   // --- DYNAMIC CALCULATION ---
//   React.useEffect(() => {
//     const { approved_amount, interest_rate, tenure_months } = editableData;
//     const schedule = generateAmortization(
//       Number(approved_amount),
//       Number(interest_rate),
//       Number(tenure_months)
//     );
//     setEstimatedSchedule(schedule);
//   }, [editableData]);

//   // --- ACTIONS ---
//   const handleApproval = async (status: "Approved" | "Rejected") => {
//     try {
//       // First, save any changes made by the approver
//       await adminUpdateLoanApplication(applicationId, {
//         approved_amount: Number(editableData.approved_amount),
//         interest_rate: Number(editableData.interest_rate),
//         tenure_months: Number(editableData.tenure_months),
//       });

//       // Then, process the approval or rejection
//       await processLoanApplication(applicationId, {
//         status,
//         rejection_reason: status === "Rejected" ? rejectionReason : undefined,
//       });
//       toast({
//         title: "Success",
//         description: `Application has been ${status.toLowerCase()}.`,
//       });
//       fetchApplication();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: `Processing failed: ${error.message}`,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDisburse = async () => {
//     if (!disbursementData.date || !disbursementData.jv) {
//       toast({
//         title: "Validation Error",
//         description: "Disbursement Date and JV Number are required.",
//         variant: "destructive",
//       });
//       return;
//     }
//     try {
//       await disburseLoan(applicationId, {
//         disbursement_date: disbursementData.date,
//         jv_number: disbursementData.jv,
//       });
//       toast({ title: "Success", description: "Loan has been disbursed." });
//       fetchApplication();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: `Disbursement failed: ${error.message}`,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleRecordRepaymentClick = (entry: AmortizationEntry) => {
//     setSelectedScheduleEntry(entry);
//     setIsRepaymentDialogOpen(true);
//   };

//   if (isLoading || !application)
//     return (
//       <MainLayout>
//         <Skeleton className="h-screen w-full" />
//       </MainLayout>
//     );

//   const isEditable = application.status === "Pending Approval";
//   const isDisbursed =
//     application.status === "Disbursed" || application.status === "Closed";
//   const estimatedEMI = calculateEMI(
//     Number(editableData.approved_amount),
//     Number(editableData.interest_rate),
//     Number(editableData.tenure_months)
//   );

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">
//               Loan Application: {application.application_id_text}
//             </h1>
//             <p className="text-muted-foreground">
//               For {application.employee_name} -{" "}
//               <Badge>{application.status}</Badge>
//             </p>
//           </div>

//           <Button onClick={()=>{downloadLoanAgreement(applicationId,application.application_id_text)}}>Download Application </Button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Loan Details</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   <div className="grid gap-1.5">
//                     <Label htmlFor="approved_amount">Approved Amount ($)</Label>
//                     <Input
//                       id="approved_amount"
//                       type="number"
//                       value={editableData.approved_amount}
//                       onChange={(e) =>
//                         setEditableData({
//                           ...editableData,
//                           approved_amount: e.target.value,
//                         })
//                       }
//                       disabled={!isEditable}
//                     />
//                   </div>
//                   <div className="grid gap-1.5">
//                     <Label htmlFor="interest_rate">Interest Rate (%)</Label>
//                     <Input
//                       id="interest_rate"
//                       type="number"
//                       value={editableData.interest_rate}
//                       onChange={(e) =>
//                         setEditableData({
//                           ...editableData,
//                           interest_rate: e.target.value,
//                         })
//                       }
//                       disabled={!isEditable}
//                     />
//                   </div>
//                   <div className="grid gap-1.5">
//                     <Label htmlFor="tenure_months">Tenure (Months)</Label>
//                     <Input
//                       id="tenure_months"
//                       type="number"
//                       value={editableData.tenure_months}
//                       onChange={(e) =>
//                         setEditableData({
//                           ...editableData,
//                           tenure_months: e.target.value,
//                         })
//                       }
//                       disabled={!isEditable}
//                     />
//                   </div>
//                 </div>
//                 {isEditable && (
//                   <Alert>
//                     <DollarSign className="h-4 w-4" />
//                     <AlertDescription>
//                       Estimated EMI based on current values:{" "}
//                       <strong>${estimatedEMI.toLocaleString()}</strong>
//                     </AlertDescription>
//                   </Alert>
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>
//                   {!isDisbursed ? "Estimated" : "Official"} Amortization
//                   Schedule
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ScrollArea className="h-72">
//                   {!isDisbursed ? (
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Month</TableHead>
//                           <TableHead>EMI</TableHead>
//                           <TableHead>Principal</TableHead>
//                           <TableHead>Interest</TableHead>
//                           <TableHead>Balance</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {estimatedSchedule.map((row) => (
//                           <TableRow key={row.month}>
//                             <TableCell>{row.month}</TableCell>
//                             <TableCell>${row.emi}</TableCell>
//                             <TableCell>${row.principal}</TableCell>
//                             <TableCell>${row.interest}</TableCell>
//                             <TableCell>${row.balance}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   ) : (
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Due</TableHead>
//                           <TableHead>EMI</TableHead>
//                           <TableHead>Principal</TableHead>
//                           <TableHead>Interest</TableHead>
//                           <TableHead>Status</TableHead>
//                           {hasPermission("finance.manage") && (
//                             <TableHead className="text-right">
//                               Actions
//                             </TableHead>
//                           )}
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {application.amortization_schedule.map((row) => (
//                           <TableRow key={row.id}>
//                             <TableCell>
//                               {new Date(row.due_date).toLocaleDateString()}
//                             </TableCell>
//                             <TableCell>
//                               ${Number(row.emi_amount).toFixed(2)}
//                             </TableCell>
//                             <TableCell>
//                               ${Number(row.principal_component).toFixed(2)}
//                             </TableCell>
//                             <TableCell>
//                               ${Number(row.interest_component).toFixed(2)}
//                             </TableCell>
//                             <TableCell>
//                               <Badge
//                                 variant={
//                                   row.status === "Paid"
//                                     ? "default"
//                                     : "secondary"
//                                 }
//                               >
//                                 {row.status}
//                               </Badge>
//                             </TableCell>
//                             {hasPermission("finance.manage") && (
//                               <TableCell className="text-right">
//                                 {row.status === "Pending" && (
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={() =>
//                                       handleRecordRepaymentClick(row)
//                                     }
//                                   >
//                                     Record
//                                   </Button>
//                                 )}
//                               </TableCell>
//                             )}
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   )}
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           </div>
//           <div className="space-y-6">
//             {application.status === "Pending Approval" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Approval Action</CardTitle>
//                   <CardDescription>
//                     Current Stage:{" "}
//                     {application.manager_approver_id
//                       ? "HR Approval"
//                       : "Manager Approval"}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid gap-1.5">
//                     <Label htmlFor="rejection_reason">Rejection Reason</Label>
//                     <Textarea
//                       id="rejection_reason"
//                       placeholder="Required if rejecting..."
//                       value={rejectionReason}
//                       onChange={(e) => setRejectionReason(e.target.value)}
//                     />
//                   </div>
//                   <div className="flex justify-end gap-2">
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleApproval("Rejected")}
//                     >
//                       Reject
//                     </Button>
//                     <Button onClick={() => handleApproval("Approved")}>
//                       Save & Approve
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//             {application.status === "Approved" &&
//               hasPermission("finance.manage") && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Disbursement</CardTitle>
//                     <CardDescription>
//                       Record the fund disbursement.
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid gap-1.5">
//                       <Label htmlFor="disbursement_date">
//                         Disbursement Date
//                       </Label>
//                       <Input
//                         id="disbursement_date"
//                         type="date"
//                         value={disbursementData.date}
//                         onChange={(e) =>
//                           setDisbursementData({
//                             ...disbursementData,
//                             date: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <div className="grid gap-1.5">
//                       <Label htmlFor="jv_number">Journal Voucher #</Label>
//                       <Input
//                         id="jv_number"
//                         value={disbursementData.jv}
//                         onChange={(e) =>
//                           setDisbursementData({
//                             ...disbursementData,
//                             jv: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                     <Button onClick={handleDisburse} className="w-full">
//                       Confirm Disbursement
//                     </Button>
//                   </CardContent>
//                 </Card>
//               )}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Employee's Other Loans</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {ongoingLoans.length > 0 ? (
//                   <Table>
//                     <TableBody>
//                       {ongoingLoans.map((loan) => (
//                         <TableRow key={loan.id}>
//                           <TableCell>
//                             <div className="font-medium">
//                               {loan.loan_type_name}
//                             </div>
//                             <div className="text-xs text-muted-foreground">
//                               {loan.application_id_text}
//                             </div>
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <div className="font-medium">
//                               ${Number(loan.approved_amount).toLocaleString()}
//                             </div>
//                             <div className="text-xs text-muted-foreground">
//                               {loan.emis_paid}/{loan.total_emis} paid
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 ) : (
//                   <p className="text-sm text-muted-foreground">
//                     No other ongoing loans.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>

//             {isDisbursed && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Repayment History</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {application.manual_repayments &&
//                   application.manual_repayments.length > 0 ? (
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Date</TableHead>
//                           <TableHead>Amount</TableHead>
//                           <TableHead>TXN ID</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {application.manual_repayments.map((row) => (
//                           <TableRow key={row.id}>
//                             <TableCell>
//                               {new Date(
//                                 row.repayment_date
//                               ).toLocaleDateString()}
//                             </TableCell>
//                             <TableCell>
//                               ${Number(row.repayment_amount).toFixed(2)}
//                             </TableCell>
//                             <TableCell>
//                               {row.transaction_id || "Payroll"}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   ) : (
//                     <p className="text-sm text-muted-foreground">
//                       No repayments have been made yet.
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//       <ManualRepaymentDialog
//         open={isRepaymentDialogOpen}
//         onOpenChange={setIsRepaymentDialogOpen}
//         scheduleEntry={selectedScheduleEntry}
//         onSuccess={fetchApplication}
//       />
//     </MainLayout>
//   );
// }



"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getLoanApplicationDetails,
  getOngoingLoans,
  adminUpdateLoanApplication,
  processLoanApplication,
  disburseLoan,
  rescheduleEmi,
  makeLumpSumPayment,
  type LoanApplication,
  type OngoingLoan,
  type AmortizationEntry,
  downloadLoanAgreement,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  DollarSign,
  Calendar,
  Hash,
  FileText,
  Banknote,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Loader2,
  Edit,
  Wallet,
  TrendingDown,
  AlertCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { ManualRepaymentDialog } from "@/components/management/loans/ManualRepaymentDialog"

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

// --- UTILITY FUNCTIONS ---
const calculateEMI = (p: number, r: number, t: number): number => {
  if (p <= 0 || t <= 0 || r < 0) return 0
  if (r === 0) return parseFloat((p / t).toFixed(2))
  const monthlyRate = r / 12 / 100
  const emi =
    (p * monthlyRate * Math.pow(1 + monthlyRate, t)) /
    (Math.pow(1 + monthlyRate, t) - 1)
  return parseFloat(emi.toFixed(2))
}

const generateAmortization = (
  principal: number,
  annualRate: number,
  tenureMonths: number
) => {
  if (principal <= 0 || tenureMonths <= 0) return []
  const emi = calculateEMI(principal, annualRate, tenureMonths)
  if (emi === 0) return []

  const monthlyRate = annualRate / 12 / 100
  let balance = principal
  const schedule = []

  for (let i = 0; i < tenureMonths; i++) {
    const interest = balance * monthlyRate
    const principalComponent = emi - interest
    balance -= principalComponent
    schedule.push({
      month: i + 1,
      emi: emi.toFixed(2),
      principal: principalComponent.toFixed(2),
      interest: interest.toFixed(2),
      balance: balance < 0 ? "0.00" : balance.toFixed(2),
    })
  }
  return schedule
}

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9 w-96" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function LoanDetailsSkeleton() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function LoanApplicationPage() {
  const params = useParams()
  const { toast } = useToast()
  const { hasPermission } = useAuth()

  const [application, setApplication] = React.useState<LoanApplication | null>(null)
  const [ongoingLoans, setOngoingLoans] = React.useState<OngoingLoan[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isApproving, setIsApproving] = React.useState(false)
  const [isRejecting, setIsRejecting] = React.useState(false)
  const [isDisbursing, setIsDisbursing] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)

  const [editableData, setEditableData] = React.useState({
    approved_amount: "",
    interest_rate: "",
    tenure_months: "",
  })
  const [rejectionReason, setRejectionReason] = React.useState("")
  const [disbursementData, setDisbursementData] = React.useState({
    date: "",
    jv: "",
  })
  const [estimatedSchedule, setEstimatedSchedule] = React.useState<any[]>([])

  // Dialog states
  const [isRepaymentDialogOpen, setIsRepaymentDialogOpen] = React.useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = React.useState(false)
  const [isLumpSumDialogOpen, setIsLumpSumDialogOpen] = React.useState(false)
  
  const [selectedScheduleEntry, setSelectedScheduleEntry] = React.useState<AmortizationEntry | null>(null)
  const [rescheduleData, setRescheduleData] = React.useState({ new_amount: "" })
  const [lumpSumData, setLumpSumData] = React.useState({
    amount: "",
    date: "",
    transaction_id: "",
  })
  
  const [isRescheduling, setIsRescheduling] = React.useState(false)
  const [isProcessingLumpSum, setIsProcessingLumpSum] = React.useState(false)

  const applicationId = Number(params.id)

  // --- DATA FETCHING ---
  const fetchApplication = React.useCallback(async () => {
    if (!applicationId) return
    setIsLoading(true)
    try {
      const data = await getLoanApplicationDetails(applicationId)
      setApplication(data)
      setEditableData({
        approved_amount: String(data.approved_amount || data.requested_amount),
        interest_rate: String(data.interest_rate),
        tenure_months: String(data.tenure_months),
      })
      const ongoing = await getOngoingLoans(data.employee_id)
      setOngoingLoans(ongoing)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load loan application details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [applicationId, toast])

  React.useEffect(() => {
    fetchApplication()
  }, [fetchApplication])

  // --- DYNAMIC CALCULATION ---
  React.useEffect(() => {
    const { approved_amount, interest_rate, tenure_months } = editableData
    const schedule = generateAmortization(
      Number(approved_amount),
      Number(interest_rate),
      Number(tenure_months)
    )
    setEstimatedSchedule(schedule)
  }, [editableData])

  // --- ACTIONS ---
  const handleApproval = async (status: "Approved" | "Rejected") => {
    if (status === "Rejected" && !rejectionReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a rejection reason.",
        variant: "destructive",
      })
      return
    }

    const setLoadingState = status === "Approved" ? setIsApproving : setIsRejecting
    setLoadingState(true)
    
    try {
      // First, save any changes made by the approver
      await adminUpdateLoanApplication(applicationId, {
        approved_amount: Number(editableData.approved_amount),
        interest_rate: Number(editableData.interest_rate),
        tenure_months: Number(editableData.tenure_months),
      })

      // Then, process the approval or rejection
      await processLoanApplication(applicationId, {
        status,
        rejection_reason: status === "Rejected" ? rejectionReason : undefined,
      })
      
      toast({
        title: "Success",
        description: `Application has been ${status.toLowerCase()}.`,
      })
      fetchApplication()
      setRejectionReason("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Processing failed: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoadingState(false)
    }
  }

  const handleDisburse = async () => {
    if (!disbursementData.date || !disbursementData.jv) {
      toast({
        title: "Validation Error",
        description: "Disbursement Date and JV Number are required.",
        variant: "destructive",
      })
      return
    }
    
    setIsDisbursing(true)
    try {
      await disburseLoan(applicationId, {
        disbursement_date: disbursementData.date,
        jv_number: disbursementData.jv,
      })
      toast({ title: "Success", description: "Loan has been disbursed." })
      fetchApplication()
      setDisbursementData({ date: "", jv: "" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Disbursement failed: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsDisbursing(false)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await downloadLoanAgreement(applicationId, application!.application_id_text)
      toast({
        title: "Success",
        description: "Loan agreement downloaded successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Download failed: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleRecordRepaymentClick = (entry: AmortizationEntry) => {
    setSelectedScheduleEntry(entry)
    setIsRepaymentDialogOpen(true)
  }

  const handleRescheduleClick = (entry: AmortizationEntry) => {
    setSelectedScheduleEntry(entry)
    setRescheduleData({ new_amount: entry.emi_amount.toString() })
    setIsRescheduleDialogOpen(true)
  }

  const handleRescheduleSubmit = async () => {
    if (!selectedScheduleEntry) return
    
    const newAmount = Number(rescheduleData.new_amount)
    const currentAmount = Number(selectedScheduleEntry.emi_amount)
    
    if (newAmount >= currentAmount) {
      toast({
        title: "Validation Error",
        description: "New EMI amount must be less than the current amount.",
        variant: "destructive",
      })
      return
    }
    
    if (newAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "EMI amount must be greater than zero.",
        variant: "destructive",
      })
      return
    }

    setIsRescheduling(true)
    try {
      await rescheduleEmi(newAmount, selectedScheduleEntry.id)
      toast({
        title: "Success",
        description: "EMI has been rescheduled successfully.",
      })
      setIsRescheduleDialogOpen(false)
      fetchApplication()
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Rescheduling failed: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsRescheduling(false)
    }
  }

  const handleLumpSumSubmit = async () => {
    if (!lumpSumData.amount || !lumpSumData.date || !lumpSumData.transaction_id) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingLumpSum(true)
    try {
      await makeLumpSumPayment(
        applicationId,
        Number(lumpSumData.amount),
        lumpSumData.date,
        lumpSumData.transaction_id
      )
      toast({
        title: "Success",
        description: "Lump sum payment recorded successfully.",
      })
      setIsLumpSumDialogOpen(false)
      setLumpSumData({ amount: "", date: "", transaction_id: "" })
      fetchApplication()
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Payment failed: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsProcessingLumpSum(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Pending Approval': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Approved': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
      'Disbursed': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: Banknote },
      'Closed': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100', icon: CheckCircle }
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: Clock }
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  // Get next upcoming pending EMI
  const getNextPendingEmi = () => {
    if (!application?.amortization_schedule) return null
    const pending = application.amortization_schedule
      .filter(entry => entry.status === 'Pending')
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    return pending[0] || null
  }

  if (isLoading || !application) return <LoanDetailsSkeleton />

  const isEditable = application.status === "Pending Approval"
  const isDisbursed = application.status === "Disbursed" || application.status === "Closed"
  const estimatedEMI = calculateEMI(
    Number(editableData.approved_amount),
    Number(editableData.interest_rate),
    Number(editableData.tenure_months)
  )
  const nextPendingEmi = getNextPendingEmi()

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Loan Application: {application.application_id_text}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                {application.employee_name}
              </p>
              {getStatusBadge(application.status)}
            </div>
          </div>
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            variant="outline"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Agreement
              </>
            )}
          </Button>
        </div>

        {/* Loan Purpose Card */}
        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
              <FileText className="h-5 w-5" />
              Loan Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Loan Type</Label>
                <p className="font-medium mt-1">{application.loan_type_name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Application ID</Label>
                <p className="font-mono font-medium mt-1">{application.application_id_text}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Requested Amount</Label>
                <p className="font-mono font-medium mt-1 text-blue-600 dark:text-blue-400">
                  {formatAED(application.requested_amount)}
                </p>
              </div>
            </div>
            {application.purpose && (
              <>
                <Separator className="my-4" />
                <div>
                  <Label className="text-sm text-muted-foreground">Purpose</Label>
                  <p className="mt-2 text-sm bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
                    {application.purpose}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Approval Status Card */}
        {application.status !== "Rejected" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Approval Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  {application.manager_approver_id ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Manager Approval</p>
                    <p className="text-sm text-muted-foreground">
                      {application.manager_approver_name || "Pending"}
                    </p>
                  </div>
                  {application.manager_approver_id ? (
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  {application.hr_approver_id ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">HR Approval</p>
                    <p className="text-sm text-muted-foreground">
                      {application.hr_approver_name || "Pending"}
                    </p>
                  </div>
                  {application.hr_approver_id ? (
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejection Reason */}
        {application.rejection_reason && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Rejected</AlertTitle>
            <AlertDescription>{application.rejection_reason}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Loan Details
                </CardTitle>
                <CardDescription>
                  Configure loan terms and conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="approved_amount">Approved Amount (AED)</Label>
                    <Input
                      id="approved_amount"
                      type="number"
                      step="0.01"
                      value={editableData.approved_amount}
                      onChange={(e) =>
                        setEditableData({
                          ...editableData,
                          approved_amount: e.target.value,
                        })
                      }
                      disabled={!isEditable}
                      className="font-mono"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                    <Input
                      id="interest_rate"
                      type="number"
                      step="0.01"
                      value={editableData.interest_rate}
                      onChange={(e) =>
                        setEditableData({
                          ...editableData,
                          interest_rate: e.target.value,
                        })
                      }
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tenure_months">Tenure (Months)</Label>
                    <Input
                      id="tenure_months"
                      type="number"
                      value={editableData.tenure_months}
                      onChange={(e) =>
                        setEditableData({
                          ...editableData,
                          tenure_months: e.target.value,
                        })
                      }
                      disabled={!isEditable}
                    />
                  </div>
                </div>
                {isEditable && (
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      <span className="text-blue-900 dark:text-blue-200">
                        Estimated EMI based on current values:{" "}
                        <strong className="font-mono">{formatAED(estimatedEMI)}</strong>
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Amortization Schedule */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {!isDisbursed ? "Estimated" : "Official"} Amortization Schedule
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {isDisbursed 
                        ? "Track EMI payments and outstanding balance"
                        : "Preview of payment schedule"}
                    </CardDescription>
                  </div>
                  {isDisbursed && hasPermission("finance.manage") && (
                    <Button
                      onClick={() => setIsLumpSumDialogOpen(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Lump Sum Payment
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {!isDisbursed ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>EMI</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {estimatedSchedule.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell className="font-mono">{formatAED(row.emi)}</TableCell>
                            <TableCell className="font-mono">{formatAED(row.principal)}</TableCell>
                            <TableCell className="font-mono">{formatAED(row.interest)}</TableCell>
                            <TableCell className="font-mono text-right">{formatAED(row.balance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Due Date</TableHead>
                          <TableHead>EMI</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Status</TableHead>
                          {hasPermission("finance.manage") && (
                            <TableHead className="text-right">Actions</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {application.amortization_schedule.map((row) => (
                          <TableRow key={row.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {new Date(row.due_date).toLocaleDateString('en-AE', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell className="font-mono font-medium">
                              {formatAED(row.emi_amount)}
                            </TableCell>
                            <TableCell className="font-mono">
                              {formatAED(row.principal_component)}
                            </TableCell>
                            <TableCell className="font-mono">
                              {formatAED(row.interest_component)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={row.status === "Paid" ? "default" : "secondary"}
                                className={row.status === "Paid" ? "bg-green-100 text-green-800" : ""}
                              >
                                {row.status}
                              </Badge>
                            </TableCell>
                            {hasPermission("finance.manage") && (
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  {row.status === "Pending" && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRecordRepaymentClick(row)}
                                      >
                                        Record
                                      </Button>
                                      {nextPendingEmi?.id === row.id && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleRescheduleClick(row)}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Approval Action Card */}
            {application.status === "Pending Approval" && (
              <Card>
                <CardHeader>
                  <CardTitle>Approval Action</CardTitle>
                  <CardDescription>
                    Current Stage:{" "}
                    {application.manager_approver_id
                      ? "HR Approval"
                      : "Manager Approval"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rejection_reason">Rejection Reason</Label>
                    <Textarea
                      id="rejection_reason"
                      placeholder="Required if rejecting..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleApproval("Rejected")}
                      disabled={isRejecting || isApproving}
                      className="w-full"
                    >
                      {isRejecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => handleApproval("Approved")}
                      disabled={isApproving || isRejecting}
                      className="w-full"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Save & Approve
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Disbursement Card */}
            {application.status === "Approved" && hasPermission("finance.manage") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-5 w-5" />
                    Disbursement
                  </CardTitle>
                  <CardDescription>
                    Record the fund disbursement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="disbursement_date">
                      Disbursement Date *
                    </Label>
                    <Input
                      id="disbursement_date"
                      type="date"
                      value={disbursementData.date}
                      onChange={(e) =>
                        setDisbursementData({
                          ...disbursementData,
                          date: e.target.value,
                        })
                      }
                      disabled={isDisbursing}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="jv_number">Journal Voucher # *</Label>
                    <Input
                      id="jv_number"
                      value={disbursementData.jv}
                      onChange={(e) =>
                        setDisbursementData({
                          ...disbursementData,
                          jv: e.target.value,
                        })
                      }
                      placeholder="Enter JV number"
                      disabled={isDisbursing}
                    />
                  </div>
                  <Button 
                    onClick={handleDisburse} 
                    className="w-full"
                    disabled={isDisbursing}
                  >
                    {isDisbursing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Banknote className="h-4 w-4 mr-2" />
                        Confirm Disbursement
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Other Loans Card */}
            <Card>
              <CardHeader>
                <CardTitle>Employee's Other Loans</CardTitle>
                <CardDescription>
                  Active loans for this employee
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ongoingLoans.length > 0 ? (
                  <div className="space-y-3">
                    {ongoingLoans.map((loan) => (
                      <div key={loan.id} className="p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{loan.loan_type_name}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {loan.application_id_text}
                            </p>
                          </div>
                          <p className="font-mono font-medium text-green-600">
                            {formatAED(loan.approved_amount)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ 
                                width: `${(loan.emis_paid / loan.total_emis) * 100}%` 
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            {loan.emis_paid}/{loan.total_emis}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No other ongoing loans.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Repayment History */}
            {isDisbursed && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Repayment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {application.manual_repayments && application.manual_repayments.length > 0 ? (
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {application.manual_repayments.map((row) => (
                          <div key={row.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-sm font-medium">
                                {new Date(row.repayment_date).toLocaleDateString('en-AE', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              <p className="font-mono font-medium text-green-600">
                                {formatAED(row.repayment_amount)}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              TXN: {row.transaction_id || "Payroll Deduction"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No repayments have been made yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Manual Repayment Dialog */}
      <ManualRepaymentDialog
        open={isRepaymentDialogOpen}
        onOpenChange={setIsRepaymentDialogOpen}
        scheduleEntry={selectedScheduleEntry}
        onSuccess={fetchApplication}
      />

      {/* Reschedule EMI Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Next EMI</DialogTitle>
            <DialogDescription>
              Reduce the upcoming EMI amount. The remaining balance will be redistributed.
            </DialogDescription>
          </DialogHeader>
          
          {selectedScheduleEntry && (
            <div className="space-y-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-sm mb-2">
                    <strong>Due Date:</strong> {new Date(selectedScheduleEntry.due_date).toLocaleDateString('en-AE')}
                  </p>
                  <p className="text-sm">
                    <strong>Current EMI:</strong> {formatAED(selectedScheduleEntry.emi_amount)}
                  </p>
                </AlertDescription>
              </Alert>

              <div className="grid gap-2">
                <Label htmlFor="new_emi_amount">New EMI Amount (AED) *</Label>
                <Input
                  id="new_emi_amount"
                  type="number"
                  step="0.01"
                  value={rescheduleData.new_amount}
                  onChange={(e) => setRescheduleData({ new_amount: e.target.value })}
                  placeholder="Enter new amount"
                  disabled={isRescheduling}
                  className="font-mono"
                  max={selectedScheduleEntry.emi_amount}
                />
                <p className="text-xs text-muted-foreground">
                  Must be less than {formatAED(selectedScheduleEntry.emi_amount)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRescheduleDialogOpen(false)}
              disabled={isRescheduling}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRescheduleSubmit}
              disabled={isRescheduling}
            >
              {isRescheduling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                "Reschedule EMI"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lump Sum Payment Dialog */}
      <Dialog open={isLumpSumDialogOpen} onOpenChange={setIsLumpSumDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Lump Sum Payment</DialogTitle>
            <DialogDescription>
              Record a one-time payment towards the outstanding loan balance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="lump_sum_amount">Payment Amount (AED) *</Label>
              <Input
                id="lump_sum_amount"
                type="number"
                step="0.01"
                value={lumpSumData.amount}
                onChange={(e) => setLumpSumData({ ...lumpSumData, amount: e.target.value })}
                placeholder="0.00"
                disabled={isProcessingLumpSum}
                className="font-mono"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lump_sum_date">Payment Date *</Label>
              <Input
                id="lump_sum_date"
                type="date"
                value={lumpSumData.date}
                onChange={(e) => setLumpSumData({ ...lumpSumData, date: e.target.value })}
                disabled={isProcessingLumpSum}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lump_sum_txn">Transaction ID *</Label>
              <Input
                id="lump_sum_txn"
                value={lumpSumData.transaction_id}
                onChange={(e) => setLumpSumData({ ...lumpSumData, transaction_id: e.target.value })}
                placeholder="Enter transaction reference"
                disabled={isProcessingLumpSum}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsLumpSumDialogOpen(false)
                setLumpSumData({ amount: "", date: "", transaction_id: "" })
              }}
              disabled={isProcessingLumpSum}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLumpSumSubmit}
              disabled={isProcessingLumpSum}
            >
              {isProcessingLumpSum ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Record Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
