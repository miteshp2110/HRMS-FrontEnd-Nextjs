"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getLoanApplicationDetails,
  getOngoingLoans,
  adminUpdateLoanApplication,
  processLoanApplication,
  disburseLoan,
  type LoanApplication,
  type OngoingLoan,
  type AmortizationEntry,
  downloadLoanAgreement,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  DollarSign,
  Calendar,
  Hash,
  FileText,
  Banknote,
  UserCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";
import { ManualRepaymentDialog } from "@/components/management/loans/ManualRepaymentDialog";

// --- UTILITY FUNCTIONS ---
const calculateEMI = (p: number, r: number, t: number): number => {
  if (p <= 0 || t <= 0 || r < 0) return 0;
  if (r === 0) return parseFloat((p / t).toFixed(2));
  const monthlyRate = r / 12 / 100;
  const emi =
    (p * monthlyRate * Math.pow(1 + monthlyRate, t)) /
    (Math.pow(1 + monthlyRate, t) - 1);
  return parseFloat(emi.toFixed(2));
};

const generateAmortization = (
  principal: number,
  annualRate: number,
  tenureMonths: number
) => {
  if (principal <= 0 || tenureMonths <= 0) return [];
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  if (emi === 0) return [];

  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  const schedule = [];

  for (let i = 0; i < tenureMonths; i++) {
    const interest = balance * monthlyRate;
    const principalComponent = emi - interest;
    balance -= principalComponent;
    schedule.push({
      month: i + 1,
      emi: emi.toFixed(2),
      principal: principalComponent.toFixed(2),
      interest: interest.toFixed(2),
      balance: balance < 0 ? "0.00" : balance.toFixed(2),
    });
  }
  return schedule;
};

export default function LoanApplicationPage() {
  const params = useParams();
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  const [application, setApplication] = React.useState<LoanApplication | null>(
    null
  );
  const [ongoingLoans, setOngoingLoans] = React.useState<OngoingLoan[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [editableData, setEditableData] = React.useState({
    approved_amount: "",
    interest_rate: "",
    tenure_months: "",
  });
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [disbursementData, setDisbursementData] = React.useState({
    date: "",
    jv: "",
  });
  const [estimatedSchedule, setEstimatedSchedule] = React.useState<any[]>([]);

  // State for manual repayment dialog
  const [isRepaymentDialogOpen, setIsRepaymentDialogOpen] =
    React.useState(false);
  const [selectedScheduleEntry, setSelectedScheduleEntry] =
    React.useState<AmortizationEntry | null>(null);

  const applicationId = Number(params.id);

  // --- DATA FETCHING ---
  const fetchApplication = React.useCallback(async () => {
    if (!applicationId) return;
    setIsLoading(true);
    try {
      const data = await getLoanApplicationDetails(applicationId);
      setApplication(data);
      setEditableData({
        approved_amount: String(data.approved_amount || data.requested_amount),
        interest_rate: String(data.interest_rate),
        tenure_months: String(data.tenure_months),
      });
      const ongoing = await getOngoingLoans(data.employee_id);
      setOngoingLoans(ongoing);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load loan application details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, toast]);

  React.useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  // --- DYNAMIC CALCULATION ---
  React.useEffect(() => {
    const { approved_amount, interest_rate, tenure_months } = editableData;
    const schedule = generateAmortization(
      Number(approved_amount),
      Number(interest_rate),
      Number(tenure_months)
    );
    setEstimatedSchedule(schedule);
  }, [editableData]);

  // --- ACTIONS ---
  const handleApproval = async (status: "Approved" | "Rejected") => {
    try {
      // First, save any changes made by the approver
      await adminUpdateLoanApplication(applicationId, {
        approved_amount: Number(editableData.approved_amount),
        interest_rate: Number(editableData.interest_rate),
        tenure_months: Number(editableData.tenure_months),
      });

      // Then, process the approval or rejection
      await processLoanApplication(applicationId, {
        status,
        rejection_reason: status === "Rejected" ? rejectionReason : undefined,
      });
      toast({
        title: "Success",
        description: `Application has been ${status.toLowerCase()}.`,
      });
      fetchApplication();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Processing failed: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDisburse = async () => {
    if (!disbursementData.date || !disbursementData.jv) {
      toast({
        title: "Validation Error",
        description: "Disbursement Date and JV Number are required.",
        variant: "destructive",
      });
      return;
    }
    try {
      await disburseLoan(applicationId, {
        disbursement_date: disbursementData.date,
        jv_number: disbursementData.jv,
      });
      toast({ title: "Success", description: "Loan has been disbursed." });
      fetchApplication();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Disbursement failed: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleRecordRepaymentClick = (entry: AmortizationEntry) => {
    setSelectedScheduleEntry(entry);
    setIsRepaymentDialogOpen(true);
  };

  if (isLoading || !application)
    return (
      <MainLayout>
        <Skeleton className="h-screen w-full" />
      </MainLayout>
    );

  const isEditable = application.status === "Pending Approval";
  const isDisbursed =
    application.status === "Disbursed" || application.status === "Closed";
  const estimatedEMI = calculateEMI(
    Number(editableData.approved_amount),
    Number(editableData.interest_rate),
    Number(editableData.tenure_months)
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Loan Application: {application.application_id_text}
            </h1>
            <p className="text-muted-foreground">
              For {application.employee_name} -{" "}
              <Badge>{application.status}</Badge>
            </p>
          </div>

          <Button onClick={()=>{downloadLoanAgreement(applicationId,application.application_id_text)}}>Download Application </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="approved_amount">Approved Amount ($)</Label>
                    <Input
                      id="approved_amount"
                      type="number"
                      value={editableData.approved_amount}
                      onChange={(e) =>
                        setEditableData({
                          ...editableData,
                          approved_amount: e.target.value,
                        })
                      }
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                    <Input
                      id="interest_rate"
                      type="number"
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
                  <div className="grid gap-1.5">
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
                  <Alert>
                    <DollarSign className="h-4 w-4" />
                    <AlertDescription>
                      Estimated EMI based on current values:{" "}
                      <strong>${estimatedEMI.toLocaleString()}</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {!isDisbursed ? "Estimated" : "Official"} Amortization
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  {!isDisbursed ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>EMI</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {estimatedSchedule.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell>${row.emi}</TableCell>
                            <TableCell>${row.principal}</TableCell>
                            <TableCell>${row.interest}</TableCell>
                            <TableCell>${row.balance}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Due</TableHead>
                          <TableHead>EMI</TableHead>
                          <TableHead>Principal</TableHead>
                          <TableHead>Interest</TableHead>
                          <TableHead>Status</TableHead>
                          {hasPermission("finance.manage") && (
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {application.amortization_schedule.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              {new Date(row.due_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              ${Number(row.emi_amount).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              ${Number(row.principal_component).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              ${Number(row.interest_component).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  row.status === "Paid"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {row.status}
                              </Badge>
                            </TableCell>
                            {hasPermission("finance.manage") && (
                              <TableCell className="text-right">
                                {row.status === "Pending" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleRecordRepaymentClick(row)
                                    }
                                  >
                                    Record
                                  </Button>
                                )}
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
          <div className="space-y-6">
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
                  <div className="grid gap-1.5">
                    <Label htmlFor="rejection_reason">Rejection Reason</Label>
                    <Textarea
                      id="rejection_reason"
                      placeholder="Required if rejecting..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleApproval("Rejected")}
                    >
                      Reject
                    </Button>
                    <Button onClick={() => handleApproval("Approved")}>
                      Save & Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {application.status === "Approved" &&
              hasPermission("finance.manage") && (
                <Card>
                  <CardHeader>
                    <CardTitle>Disbursement</CardTitle>
                    <CardDescription>
                      Record the fund disbursement.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="disbursement_date">
                        Disbursement Date
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
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="jv_number">Journal Voucher #</Label>
                      <Input
                        id="jv_number"
                        value={disbursementData.jv}
                        onChange={(e) =>
                          setDisbursementData({
                            ...disbursementData,
                            jv: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleDisburse} className="w-full">
                      Confirm Disbursement
                    </Button>
                  </CardContent>
                </Card>
              )}
            <Card>
              <CardHeader>
                <CardTitle>Employee's Other Loans</CardTitle>
              </CardHeader>
              <CardContent>
                {ongoingLoans.length > 0 ? (
                  <Table>
                    <TableBody>
                      {ongoingLoans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell>
                            <div className="font-medium">
                              {loan.loan_type_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {loan.application_id_text}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-medium">
                              ${Number(loan.approved_amount).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {loan.emis_paid}/{loan.total_emis} paid
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No other ongoing loans.
                  </p>
                )}
              </CardContent>
            </Card>

            {isDisbursed && (
              <Card>
                <CardHeader>
                  <CardTitle>Repayment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {application.manual_repayments &&
                  application.manual_repayments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>TXN ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {application.manual_repayments.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              {new Date(
                                row.repayment_date
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              ${Number(row.repayment_amount).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {row.transaction_id || "Payroll"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No repayments have been made yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <ManualRepaymentDialog
        open={isRepaymentDialogOpen}
        onOpenChange={setIsRepaymentDialogOpen}
        scheduleEntry={selectedScheduleEntry}
        onSuccess={fetchApplication}
      />
    </MainLayout>
  );
}
