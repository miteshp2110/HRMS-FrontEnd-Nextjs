"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getLoanHistory, type LoanRecord } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface LoanHistoryDialogProps {
  employeeId: number | null
  employeeName: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoanHistoryDialog({ employeeId, employeeName, open, onOpenChange }: LoanHistoryDialogProps) {
  const { toast } = useToast();
  const [loanHistory, setLoanHistory] = React.useState<LoanRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && employeeId) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const data = await getLoanHistory(employeeId);
          setLoanHistory(data);
        } catch (error: any) {
          toast({ title: "Error", description: `Failed to fetch loan history: ${error.message}`, variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [open, employeeId, toast]);
  
  const getStatusBadge = (status: string) => {
    const variants = { pending: "secondary", approved: "default", rejected: "destructive", completed: "outline" } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Loan History for {employeeName}</DialogTitle>
          <DialogDescription>Review of all past loan and advance requests for this employee.</DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
            {isLoading ? <p>Loading history...</p> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Applied On</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {loanHistory.map(loan => (
                            <TableRow key={loan.id}>
                                <TableCell className="font-medium">{loan.title}</TableCell>
                                <TableCell>${loan.principal_amount.toLocaleString()}</TableCell>
                                <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                <TableCell>{new Date(loan.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}