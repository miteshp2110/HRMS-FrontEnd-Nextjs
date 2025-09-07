"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DollarSign } from "lucide-react"
import type { LoanRecord, LoanRepayment } from "@/lib/api"
import { getLoanRepayments } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface LoanHistoryTabProps {
  loanHistory: LoanRecord[]
  isLoading: boolean
}

export function LoanHistoryTab({ loanHistory, isLoading }: LoanHistoryTabProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedLoan, setSelectedLoan] = React.useState<LoanRecord | null>(null);
  const [repayments, setRepayments] = React.useState<LoanRepayment[]>([]);
  const [isRepaymentLoading, setIsRepaymentLoading] = React.useState(false);
  const { toast } = useToast();

  const handleRowClick = async (loan: LoanRecord) => {
    setSelectedLoan(loan);
    setIsDialogOpen(true);
    setIsRepaymentLoading(true);
    try {
      const repaymentData = await getLoanRepayments(loan.id);
      setRepayments(repaymentData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to fetch repayment history: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsRepaymentLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      completed: "outline",
      paid_off: "outline",
    } as const

    const statusText = status.replace('_', ' ');

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className={status === 'paid_off' ? 'border-green-500 text-green-600' : ''}>
        {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </Badge>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Loan & Advance History</CardTitle>
          <CardDescription>All loan and salary advance records for this employee. Click a row to see details.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          ) : loanHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Loan Records Found</h3>
              <p className="text-muted-foreground">This employee has not requested any loans or advances.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Installments</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanHistory.map((loan) => (
                    <TableRow key={loan.id} onClick={() => handleRowClick(loan)} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Badge variant={loan.loan_type === "loan" ? "default" : "secondary"}>
                          {loan.loan_type === "loan" ? "Loan" : "Advance"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{loan.title}</TableCell>
                      <TableCell>${loan.principal_amount.toLocaleString()}</TableCell>
                      <TableCell>{loan.total_installments}</TableCell>
                      <TableCell>{loan.remaining_installments}</TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell>{new Date(loan.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Repayment History for "{selectedLoan?.title}"</DialogTitle>
            <DialogDescription>
              Total Amount: ${selectedLoan?.principal_amount.toLocaleString()} | Installments: {selectedLoan?.total_installments}
            </DialogDescription>
          </DialogHeader>
          {isRepaymentLoading ? (
             <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
          ) : repayments.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No repayment records found for this loan.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto pr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Repayment Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payslip ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {repayments.map(repayment => (
                            <TableRow key={repayment.id}>
                                <TableCell>{new Date(repayment.repayment_date).toLocaleDateString()}</TableCell>
                                <TableCell>${Number(repayment.repayment_amount).toLocaleString()}</TableCell>
                                <TableCell>#{repayment.payslip_id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}