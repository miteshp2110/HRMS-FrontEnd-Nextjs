"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type PayslipHistory } from "@/lib/api"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PayslipDetailDialogProps {
  payslip: PayslipHistory | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PayslipDetailDialog({ payslip, open, onOpenChange }: PayslipDetailDialogProps) {
  if (!payslip) return null;

  const formatCurrency = (amount: string | number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));

  const earnings = payslip.details.filter(d => d.component_type === 'earning');
  const deductions = payslip.details.filter(d => d.component_type === 'deduction');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Payslip Details</DialogTitle>
          <DialogDescription>
            For pay period: {new Date(payslip.pay_period_start).toLocaleDateString()} - {new Date(payslip.pay_period_end).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Gross Earnings</p>
              <p className="font-bold text-lg text-green-600">{formatCurrency(payslip.gross_earnings)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Deductions</p>
              <p className="font-bold text-lg text-red-600">{formatCurrency(payslip.total_deductions)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Net Pay</p>
              <p className="font-bold text-lg text-blue-600">{formatCurrency(payslip.net_pay)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center"><TrendingUp className="h-4 w-4 mr-2 text-green-500"/>Earnings</h4>
              <Table>
                <TableHeader><TableRow><TableHead>Component</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {earnings.map(item => (
                    <TableRow key={item.id}><TableCell>{item.component_name}</TableCell><TableCell className="text-right">{formatCurrency(item.amount)}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2 flex items-center"><TrendingDown className="h-4 w-4 mr-2 text-red-500"/>Deductions</h4>
              <Table>
                <TableHeader><TableRow><TableHead>Component</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                   {deductions.map(item => (
                    <TableRow key={item.id}><TableCell>{item.component_name}</TableCell><TableCell className="text-right">{formatCurrency(item.amount)}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
