"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getLoanRepayments, type LoanRecord, type LoanRepayment } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface LoanRepaymentDialogProps {
  loan: LoanRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoanRepaymentDialog({ loan, open, onOpenChange }: LoanRepaymentDialogProps) {
  const { toast } = useToast();
  const [repayments, setRepayments] = React.useState<LoanRepayment[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && loan) {
      const fetchRepayments = async () => {
        setIsLoading(true);
        try {
          const data = await getLoanRepayments(loan.id);
          setRepayments(data);
        } catch (error: any) {
          toast({ title: "Error", description: `Failed to fetch repayment history: ${error.message}`, variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchRepayments();
    }
  }, [open, loan, toast]);
  
  if (!loan) return null;

  const totalPaid = repayments.reduce((sum, item) => sum + Number(item.repayment_amount), 0);
  const totalRemaining = Number(loan.principal_amount) - totalPaid;
  const progress = (totalPaid / Number(loan.principal_amount)) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Repayment Details: {loan.title}</DialogTitle>
          <DialogDescription>Detailed analysis of the repayment schedule for this loan.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6 max-h-[70vh] overflow-y-auto">
            <Card>
                <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div><p className="text-sm text-muted-foreground">Total Amount</p><p className="text-2xl font-bold">${Number(loan.principal_amount).toLocaleString()}</p></div>
                        <div><p className="text-sm text-muted-foreground">Amount Paid</p><p className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p></div>
                        <div><p className="text-sm text-muted-foreground">Remaining</p><p className="text-2xl font-bold text-red-600">${totalRemaining.toLocaleString()}</p></div>
                    </div>
                    <Progress value={progress} className="w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Repayment History</CardTitle></CardHeader>
                <CardContent>
                    {isLoading ? <p>Loading history...</p> : (
                        <Table>
                            <TableHeader><TableRow><TableHead>Installment</TableHead><TableHead>Due Date</TableHead><TableHead>Paid Date</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {repayments.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{new Date(item.repayment_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{item.repayment_date ? new Date(item.repayment_date).toLocaleDateString() : 'Pending'}</TableCell>
                                        <TableCell>${Number(item.repayment_amount).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}