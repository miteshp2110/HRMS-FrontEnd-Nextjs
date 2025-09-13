"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { MainLayout } from "@/components/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  History,
  Edit,
  Search,
  PlusCircle,
} from "lucide-react";
import {
  getAllLoans,
  approveLoan,
  editLoan,
  getLoanHistory,
  getLoanRepayments,
  addRepayment,
  type LoanRecord,
  type LoanRepayment,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// --- SUB-COMPONENT: Loan History Dialog ---
const LoanHistoryDialog = ({
  employeeId,
  employeeName,
  open,
  onOpenChange,
}: {
  employeeId: number | null;
  employeeName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { toast } = useToast();
  const [loanHistory, setLoanHistory] = useState<LoanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && employeeId) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const data = await getLoanHistory(employeeId);
          setLoanHistory(data);
        } catch (error: any) {
          toast({
            title: "Error",
            description: `Failed to fetch loan history: ${error.message}`,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [open, employeeId, toast]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending_approval: "secondary",
      active: "default",
      rejected: "destructive",
      paid_off: "outline",
    } as const;
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Loan History for {employeeName}</DialogTitle>
          <DialogDescription>
            Review of all past loan and advance requests for this employee.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <p>Loading history...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanHistory.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.title}</TableCell>
                    <TableCell>
                      ${Number(loan.principal_amount).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell>
                      {new Date(loan.request_date)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- SUB-COMPONENT: Loan Repayment Dialog ---
const LoanRepaymentDialog = ({
  loan,
  open,
  onOpenChange,
}: {
  loan: LoanRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { toast } = useToast();
  const [repayments, setRepayments] = useState<LoanRepayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && loan) {
      const fetchRepayments = async () => {
        setIsLoading(true);
        try {
          const data = await getLoanRepayments(loan.id);
          setRepayments(data);
        } catch (error: any) {
          toast({
            title: "Error",
            description: `Failed to fetch repayment history: ${error.message}`,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchRepayments();
    }
  }, [open, loan, toast]);

  if (!loan) return null;

  const totalPaid = repayments.reduce(
    (sum, item) => sum + Number(item.repayment_amount),
    0
  );
  const totalRemaining = Number(loan.principal_amount) - totalPaid;
  const progress = (totalPaid / Number(loan.principal_amount)) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Repayment Details: {loan.title}</DialogTitle>
          <DialogDescription>
            Detailed analysis of the repayment schedule for this loan.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">
                    ${Number(loan.principal_amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalPaid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${totalRemaining.toLocaleString()}
                  </p>
                </div>
              </div>
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Repayment History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading history...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Installment</TableHead>
                      <TableHead>Paid Date</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repayments.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {new Date(item.repayment_date)
  .toLocaleDateString("en-GB")
  .replace(/\//g, "-")
}
                        </TableCell>
                        <TableCell>
                          ${Number(item.repayment_amount).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- SUB-COMPONENT: Edit Loan Dialog ---
const EditLoanDialog = ({
  loan,
  open,
  onOpenChange,
  onLoanUpdated,
}: {
  loan: LoanRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoanUpdated: () => void;
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<LoanRecord>>({});
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [amountLeft, setAmountLeft] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (loan) {
      const data = {
        title: loan.title,
        description: loan.description,
        principal_amount: loan.principal_amount,
        total_installments: loan.total_installments,
        remaining_installments: loan.remaining_installments,
        emi_amount: loan.emi_amount,
      };

      if (loan.status === "pending_approval") {
        data.remaining_installments = data.total_installments;
        setAmountLeft(Number(data.principal_amount)); // fresh loan, no payments
      } else {
        // fetch repayments to compute remaining
        getLoanRepayments(loan.id).then((repayments) => {
          const totalPaid = repayments.reduce(
            (sum, item) => sum + Number(item.repayment_amount),
            0
          );
          setAmountLeft(Number(loan.principal_amount) - totalPaid);
        });
      }

      setFormData(data);
    }
  }, [loan, open]);

  useEffect(() => {
    const principal = parseFloat(String(formData.principal_amount) || "0");
    const totalInstallments = formData.total_installments || 1;
    const remainingInstallments = formData.remaining_installments || 1;

    if (loan?.status === "pending_approval") {
      // when pending, monthly = principal / total_installments
      setMonthlyPayment(
        totalInstallments > 0 ? principal / totalInstallments : 0
      );
      setAmountLeft(principal); // always equal to principal for pending loan
    } else {
      // active loan
      setMonthlyPayment(
        remainingInstallments > 0 ? amountLeft / remainingInstallments : 0
      );
    }

    formData.emi_amount = monthlyPayment.toFixed(2).toString();
  }, [formData, amountLeft, loan?.status]);

  if (!loan) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const numberFields = [
      "principal_amount",
      "total_installments",
      "remaining_installments",
    ];
    if (numberFields.includes(name)) {
      const numValue = value === "" ? undefined : Number(value);

      if (name === "total_installments" && loan.status === "pending_approval") {
        setFormData((prev) => ({
          ...prev,
          total_installments: numValue,
          remaining_installments: numValue,
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: numValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedFormData = {
        ...formData,
        principal_amount: formData.principal_amount, // ensure latest principal goes
        emi_amount: monthlyPayment.toFixed(2).toString(), // properly set via calc
      };

      await editLoan(loan.id, updatedFormData);

      toast({
        title: "Success",
        description: "Loan details updated successfully.",
      });
      onLoanUpdated();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update loan: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Loan for {loan.employee_name}</DialogTitle>
          <DialogDescription>Update the loan details below.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="principal_amount">Principal Amount ($)</Label>
              <Input
                id="principal_amount"
                name="principal_amount"
                type="number"
                value={formData.principal_amount}
                onChange={handleInputChange}
                disabled={loan.status !== "pending_approval"}
              />
            </div>
            <div>
              <Label htmlFor="total_installments">Total Installments</Label>
              <Input
                id="total_installments"
                name="total_installments"
                type="number"
                value={formData.total_installments}
                onChange={handleInputChange}
                disabled={loan.status !== "pending_approval"}
              />
            </div>
          </div>
          {loan.status === "active" && (
            <div>
              <Label htmlFor="remaining_installments">
                Remaining Installments
              </Label>
              <Input
                max={formData.total_installments}
                id="remaining_installments"
                name="remaining_installments"
                type="number"
                value={formData.remaining_installments}
                onChange={handleInputChange}
              />
            </div>
          )}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Calculated Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Monthly Payment (EMI)</p>
                <p className="text-lg font-bold">
                  ${monthlyPayment.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount Left</p>
                <p className="text-lg font-bold">${amountLeft.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <DialogFooter className="justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- SUB-COMPONENT: Add Repayment Dialog ---
const AddRepaymentDialog = ({
  loan,
  open,
  onOpenChange,
  onRepaymentAdded,
}: {
  loan: LoanRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepaymentAdded: () => void;
}) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    if (loan && open) {
      getLoanRepayments(loan.id).then((repayments) => {
        const totalPaid = repayments.reduce(
          (sum, item) => sum + Number(item.repayment_amount),
          0
        );
        setRemainingAmount(Number(loan.principal_amount) - totalPaid);
      });
      setAmount("");
    }
  }, [loan, open]);

  if (!loan) return null;

  const handleSave = async () => {
    const repaymentAmount = parseFloat(amount);
    if (isNaN(repaymentAmount) || repaymentAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      });
      return;
    }
    if (repaymentAmount > remainingAmount) {
      toast({
        title: "Error",
        description: `Amount cannot be greater than the remaining balance of $${remainingAmount.toLocaleString()}.`,
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await addRepayment(loan.id, repaymentAmount);
      toast({
        title: "Success",
        description: "Repayment was successfully added.",
      });
      onRepaymentAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add repayment: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Manual Repayment</DialogTitle>
          <DialogDescription>
            Log a new repayment for {loan.employee_name}'s loan: "{loan.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <Label>Amount Remaining</Label>
            <p className="text-2xl font-bold">
              ${remainingAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <Label htmlFor="amount">Repayment Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Add Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function LoanManagementPage() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [allLoans, setAllLoans] = useState<LoanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedLoan, setSelectedLoan] = useState<LoanRecord | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isRepaymentDialogOpen, setIsRepaymentDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [disbursementDate, setDisbursementDate] = useState("");

  const canManageLoans = hasPermission("loans.manage");

  const fetchLoans = async () => {
    if (!canManageLoans) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getAllLoans();
      setAllLoans(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Could not fetch loan requests: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [canManageLoans]);

  const handleReject = async (loanId: number) => {
    if (!confirm("Are you sure you want to reject this loan request?")) return;
    try {
      await approveLoan(loanId, "rejected");
      toast({
        title: "Success",
        description: "Loan request has been rejected.",
      });
      fetchLoans();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to reject loan: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleApproveClick = (loan: LoanRecord) => {
    setSelectedLoan(loan);
    setDisbursementDate("");
    setIsApproveDialogOpen(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedLoan || !disbursementDate) {
      toast({
        title: "Error",
        description: "Please select a disbursement date.",
        variant: "destructive",
      });
      return;
    }
    try {
      await approveLoan(selectedLoan.id, "approved", disbursementDate);
      toast({
        title: "Success",
        description: "Loan request has been approved.",
      });
      setIsApproveDialogOpen(false);
      setSelectedLoan(null);
      fetchLoans();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to approve loan: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (loan: LoanRecord) => {
    setSelectedLoan(loan);
    if (loan.status === "pending_approval") setIsHistoryDialogOpen(true);
    if (["active", "paid_off", "approved"].includes(loan.status))
      setIsRepaymentDialogOpen(true);
  };

  const handleEditClick = (loan: LoanRecord) => {
    setSelectedLoan(loan);
    setIsEditDialogOpen(true);
  };

  const handleAddPaymentClick = (loan: LoanRecord) => {
    setSelectedLoan(loan);
    setIsAddPaymentOpen(true);
  };

  const getStatusBadge = (status: LoanRecord["status"]) => {
    const statusMap = {
      pending_approval: { variant: "secondary", icon: Clock, label: "Pending" },
      active: { variant: "default", icon: TrendingUp, label: "Active" },
      approved: { variant: "default", icon: CheckCircle, label: "Approved" },
      paid_off: { variant: "outline", icon: CheckCircle, label: "Paid Off" },
      rejected: { variant: "destructive", icon: XCircle, label: "Rejected" },
    } as const;
    const {
      variant,
      icon: Icon,
      label,
    } = statusMap[status] || {
      variant: "secondary",
      icon: Clock,
      label: status,
    };
    return (
      <Badge variant={variant}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const filteredLoans = useMemo(() => {
    if (!searchTerm) return allLoans;
    return allLoans.filter((l) =>
      l.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allLoans, searchTerm]);

  const pendingLoans = useMemo(
    () => filteredLoans.filter((l) => l.status === "pending_approval"),
    [filteredLoans]
  );
  const ongoingLoans = useMemo(
    () =>
      filteredLoans.filter(
        (l) => l.status === "active" || l.status === "approved"
      ),
    [filteredLoans]
  );
  const completedLoans = useMemo(
    () => filteredLoans.filter((l) => l.status === "paid_off"),
    [filteredLoans]
  );
  const rejectedLoans = useMemo(
    () => filteredLoans.filter((l) => l.status === "rejected"),
    [filteredLoans]
  );

  const renderTable = (loans: LoanRecord[]) => {
    if (loans.length === 0)
      return (
        <p className="text-center py-8 text-muted-foreground">
          No loans in this category matching your search.
        </p>
      );
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell
                className="font-medium"
                onClick={() => handleRowClick(loan)}
              >
                {loan.employee_name}
              </TableCell>
              <TableCell onClick={() => handleRowClick(loan)}>
                {loan.title}
              </TableCell>
              <TableCell onClick={() => handleRowClick(loan)}>
                ${Number(loan.principal_amount).toLocaleString()}
              </TableCell>
              <TableCell onClick={() => handleRowClick(loan)}>
                {new Date(loan.request_date)
  .toLocaleDateString("en-GB")
  .replace(/\//g, "-")
}
              </TableCell>
              <TableCell onClick={() => handleRowClick(loan)}>
                {getStatusBadge(loan.status)}
              </TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-1 justify-end">
                  {loan.status === "pending_approval" && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApproveClick(loan)}
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReject(loan.id)}
                      >
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  {loan.status === "active" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddPaymentClick(loan)}
                    >
                      <PlusCircle className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(loan)}
                    disabled={
                      loan.status === "rejected" || loan.status === "paid_off"
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <DollarSign className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Loan Management</h1>
        </div>

        {!canManageLoans ? (
          <Alert variant="destructive">...</Alert>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                Pending <Badge className="ml-2">{pendingLoans.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="ongoing">
                Ongoing <Badge className="ml-2">{ongoingLoans.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <div className="relative my-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Requests</CardTitle>
                  <CardDescription>
                    Click a request to view employee history and approve/reject.
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderTable(pendingLoans)}</CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ongoing">
              <Card>
                <CardHeader>
                  <CardTitle>Ongoing Loans</CardTitle>
                  <CardDescription>
                    Click a loan to view its repayment history and analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderTable(ongoingLoans)}</CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Loans</CardTitle>
                  <CardDescription>
                    These loans have been fully paid off.
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderTable(completedLoans)}</CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="rejected">
              <Card>
                <CardHeader>
                  <CardTitle>Rejected Requests</CardTitle>
                  <CardDescription>
                    These loan requests were not approved.
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderTable(rejectedLoans)}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <LoanHistoryDialog
        employeeId={selectedLoan?.employee_id!}
        employeeName={selectedLoan?.employee_name!}
        open={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
      />
      <LoanRepaymentDialog
        loan={selectedLoan}
        open={isRepaymentDialogOpen}
        onOpenChange={setIsRepaymentDialogOpen}
      />
      <EditLoanDialog
        loan={selectedLoan}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onLoanUpdated={fetchLoans}
      />
      <AddRepaymentDialog
        loan={selectedLoan}
        open={isAddPaymentOpen}
        onOpenChange={setIsAddPaymentOpen}
        onRepaymentAdded={fetchLoans}
      />

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Loan Request</DialogTitle>
            <DialogDescription>
              Please set the disbursement date for this loan. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="disbursement_date">Disbursement Date</Label>
            <Input
              id="disbursement_date"
              type="date"
              value={disbursementDate}
              onChange={(e) => setDisbursementDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmApproval}>Confirm Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
