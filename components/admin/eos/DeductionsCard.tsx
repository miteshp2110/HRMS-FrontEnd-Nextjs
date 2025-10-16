// "use client"

// import * as React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { type EosSettlementDetails, updateEosDeductions } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// interface Props {
//     loanBreakdown: EosSettlementDetails['loan_deduction_breakdown'];
//     caseBreakdown : EosSettlementDetails['case_deduction_breakdown']
//     otherDeductions: string;
//     settlementId: number;
//     isFinalized: boolean;
//     onSuccess: () => void;
// }

// export function DeductionsCard({ loanBreakdown, otherDeductions, caseBreakdown,settlementId, isFinalized, onSuccess }: Props) {
//     const { toast } = useToast();
//     const [otherDeductionsAmount, setOtherDeductionsAmount] = React.useState(otherDeductions);

//     const handleSave = async () => {
//         try {
//             await updateEosDeductions(settlementId, { other_deductions: Number(otherDeductionsAmount) });
//             toast({ title: "Success", description: "Deductions saved." });
//             onSuccess();
//         } catch (error: any) {
//             toast({ title: "Error", description: `Could not save deductions: ${error.message}`, variant: "destructive" });
//         }
//     };

//     return (
//         <Card>
//             <CardHeader><CardTitle>Deductions</CardTitle></CardHeader>
//             <CardContent className="space-y-4">
//                 <div>
//                     <h3 className="font-semibold text-sm mb-2">Loan Deductions (Auto-Calculated)</h3>
//                     <Table>
//                         <TableHeader><TableRow><TableHead>Loan ID</TableHead><TableHead className="text-right">Outstanding Principal</TableHead></TableRow></TableHeader>
//                         <TableBody>
//                             {loanBreakdown.length === 0 ? 
//                             <TableRow><TableCell colSpan={2} className="text-center h-24">No Pending Loans</TableCell></TableRow>
//                         :
//                         loanBreakdown.map(loan => (
//                                 <TableRow key={loan.loan_id}><TableCell>{loan.loan_id}</TableCell><TableCell className="text-right">${Number(loan.outstanding_principal).toLocaleString()}</TableCell></TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>
//                 <div>
//                     <h3 className="font-semibold text-sm mb-2">Case Deductions (Auto-Calculated)</h3>
//                     <Table>
//                         <TableHeader><TableRow><TableHead>Case ID</TableHead><TableHead className="text-right">Outstanding Case Amount</TableHead></TableRow></TableHeader>
//                         <TableBody>
//                             {caseBreakdown.length === 0 ? 
//                             <TableRow><TableCell colSpan={2} className="text-center h-24">No Pending Cases</TableCell></TableRow>
//                         :
//                         caseBreakdown.map(loan => (
//                                 <TableRow key={loan.case_id}><TableCell>{loan.case_id}</TableCell><TableCell className="text-right">${Number(loan.amount).toLocaleString()}</TableCell></TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>
//                 <div className="pt-4 border-t">
//                      <h3 className="font-semibold text-sm mb-2">Other Deductions (Manual)</h3>
//                      <div className="grid gap-2">
//                         <Label htmlFor="other_deductions">Amount ($)</Label>
//                         <Input id="other_deductions" type="number" value={otherDeductionsAmount} onChange={e => setOtherDeductionsAmount(e.target.value)} disabled={isFinalized} />
//                      </div>
//                      {!isFinalized && <Button size="sm" className="mt-2" onClick={handleSave}>Save Other Deductions</Button>}
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }


"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MinusCircle, TrendingDown, Loader2, Save, CreditCard, Briefcase, CheckCircle } from "lucide-react"
import { type EosSettlementDetails, updateEosDeductions } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

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

interface Props {
  loanBreakdown: EosSettlementDetails['loan_deduction_breakdown']
  caseBreakdown: EosSettlementDetails['case_deduction_breakdown']
  otherDeductions: string
  settlementId: number
  canEdit: boolean
  onSuccess: () => void
}

export function DeductionsCard({ 
  loanBreakdown, 
  otherDeductions, 
  caseBreakdown,
  settlementId, 
  canEdit,
  onSuccess 
}: Props) {
  const { toast } = useToast()
  const [otherDeductionsAmount, setOtherDeductionsAmount] = React.useState(otherDeductions)
  const [isSaving, setIsSaving] = React.useState(false)

  // Calculate total deductions
  const totalLoanDeductions = loanBreakdown.reduce(
    (sum, loan) => sum + Number(loan.outstanding_principal), 
    0
  )
  const totalCaseDeductions = caseBreakdown.reduce(
    (sum, caseItem) => sum + Number(caseItem.amount), 
    0
  )
  const totalDeductions = totalLoanDeductions + totalCaseDeductions + Number(otherDeductionsAmount || 0)

  const handleSave = async () => {
    if (!otherDeductionsAmount || isNaN(Number(otherDeductionsAmount))) {
      toast({ 
        title: "Validation Error", 
        description: "Please enter a valid amount.", 
        variant: "destructive" 
      })
      return
    }

    setIsSaving(true)
    try {
      await updateEosDeductions(settlementId, { 
        other_deductions: Number(otherDeductionsAmount) 
      })
      toast({ 
        title: "Success", 
        description: "Deductions saved successfully." 
      })
      onSuccess()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Could not save deductions: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <MinusCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Deductions
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Amounts to be deducted from final settlement
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge 
              variant="secondary" 
              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 text-lg font-bold px-3 py-1"
            >
              <TrendingDown className="h-4 w-4 mr-1" />
              {formatAED(totalDeductions)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loan Deductions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Loan Deductions</h3>
            <Badge variant="outline" className="text-xs">Auto-Calculated</Badge>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Loan ID</TableHead>
                  <TableHead className="text-right font-semibold">Outstanding Principal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanBreakdown.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No Pending Loans</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  loanBreakdown.map(loan => (
                    <TableRow key={loan.loan_id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{loan.loan_id}</TableCell>
                      <TableCell className="text-right font-mono font-medium text-red-600 dark:text-red-400">
                        {formatAED(loan.outstanding_principal)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {loanBreakdown.length > 0 && (
            <div className="flex justify-between items-center mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <span className="text-sm font-medium">Subtotal:</span>
              <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                {formatAED(totalLoanDeductions)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Case Deductions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Case Deductions</h3>
            <Badge variant="outline" className="text-xs">Auto-Calculated</Badge>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Case ID</TableHead>
                  <TableHead className="text-right font-semibold">Outstanding Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseBreakdown.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                      <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No Pending Cases</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  caseBreakdown.map(caseItem => (
                    <TableRow key={caseItem.case_id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{caseItem.case_id}</TableCell>
                      <TableCell className="text-right font-mono font-medium text-red-600 dark:text-red-400">
                        {formatAED(caseItem.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {caseBreakdown.length > 0 && (
            <div className="flex justify-between items-center mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <span className="text-sm font-medium">Subtotal:</span>
              <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                {formatAED(totalCaseDeductions)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Other Deductions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MinusCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Other Deductions</h3>
            <Badge variant="outline" className="text-xs">Manual Entry</Badge>
            {canEdit && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                Editable
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="other_deductions" className="text-sm">
                Amount (AED)
              </Label>
              <Input 
                id="other_deductions" 
                type="number" 
                step="0.01"
                value={otherDeductionsAmount} 
                onChange={e => setOtherDeductionsAmount(e.target.value)} 
                disabled={!canEdit || isSaving}
                placeholder="0.00"
                className="font-mono"
              />
            </div>
            
            {canEdit ? (
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Other Deductions
                  </>
                )}
              </Button>
            ) : (
              <div className="flex items-start gap-2 p-3 bg-muted rounded-lg border">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium">Settlement Paid</p>
                  <p className="text-xs text-muted-foreground">
                    Deductions cannot be modified after payment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Total Deductions Summary */}
        <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Deductions</p>
              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                <span>Loans: {formatAED(totalLoanDeductions)}</span>
                <span>Cases: {formatAED(totalCaseDeductions)}</span>
                <span>Other: {formatAED(otherDeductionsAmount || 0)}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatAED(totalDeductions)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
