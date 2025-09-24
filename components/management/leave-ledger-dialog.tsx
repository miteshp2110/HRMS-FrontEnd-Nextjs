"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getLeaveLedger, type LeaveBalance, type LeaveLedgerEntry } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowDown, ArrowUp, BookOpen } from "lucide-react"
import Link from "next/link"

interface LeaveLedgerDialogProps {
  leaveBalance: LeaveBalance | null
  employeeId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeaveLedgerDialog({ leaveBalance, employeeId, open, onOpenChange }: LeaveLedgerDialogProps) {
  const { toast } = useToast();
  const [ledger, setLedger] = React.useState<LeaveLedgerEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [timezone, setTimezone] = React.useState('UTC');

  React.useEffect(() => {
    const savedTimezone = localStorage.getItem("selectedTimezone");
    if (savedTimezone) {
        setTimezone(savedTimezone);
    }
  }, []);

  React.useEffect(() => {
    if (open && employeeId && leaveBalance) {
      const fetchLedger = async () => {
        setIsLoading(true);
        try {
          const data = await getLeaveLedger(employeeId, leaveBalance.id);
          setLedger(data);
        } catch (error: any) {
          toast({ title: "Error", description: `Failed to fetch leave ledger: ${error.message}`, variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchLedger();
    }
  }, [open, employeeId, leaveBalance, toast]);
  
  if (!leaveBalance) return null;
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(undefined, { timeZone: timezone, dateStyle: 'medium', timeStyle: 'short' });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Leave Ledger: {leaveBalance.leave_type_name}</DialogTitle>
          <DialogDescription>
            Transactional history for this leave type.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
            {isLoading ? <p className="text-center">Loading ledger...</p> : 
             ledger.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                    <BookOpen className="h-10 w-10 mx-auto mb-4"/>
                    <p>No transaction history found for this leave type.</p>
                </div>
             ) : (
                <Table>
                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Transaction</TableHead><TableHead className="text-center">Change</TableHead><TableHead className="text-center">Balance</TableHead><TableHead className="text-right">Reference</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {ledger.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{formatTimestamp(entry.transaction_date)}</TableCell>
                                <TableCell className="capitalize">{entry.transaction_type}</TableCell>
                                <TableCell className={`text-center font-medium ${parseFloat(entry.change_amount) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    <div className="flex items-center justify-center gap-1">
                                        {parseFloat(entry.change_amount) < 0 ? <ArrowDown className="h-3 w-3"/> : <ArrowUp className="h-3 w-3"/>}
                                        {entry.change_amount}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">{entry.previous_balance} → {entry.new_balance}</TableCell>
                                <TableCell className="text-right">
                                    {entry.leave_record_id ? (
                                        <Button variant="link" asChild className="h-auto p-0"><Link href={`/management/leaves/${entry.leave_record_id}`}>View Request</Link></Button>
                                    ) : '-'}
                                </TableCell>
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