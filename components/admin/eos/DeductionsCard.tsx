"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { type EosSettlementDetails, updateEosDeductions } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Props {
    loanBreakdown: EosSettlementDetails['loan_deduction_breakdown'];
    caseBreakdown : EosSettlementDetails['case_deduction_breakdown']
    otherDeductions: string;
    settlementId: number;
    isFinalized: boolean;
    onSuccess: () => void;
}

export function DeductionsCard({ loanBreakdown, otherDeductions, caseBreakdown,settlementId, isFinalized, onSuccess }: Props) {
    const { toast } = useToast();
    const [otherDeductionsAmount, setOtherDeductionsAmount] = React.useState(otherDeductions);

    const handleSave = async () => {
        try {
            await updateEosDeductions(settlementId, { other_deductions: Number(otherDeductionsAmount) });
            toast({ title: "Success", description: "Deductions saved." });
            onSuccess();
        } catch (error: any) {
            toast({ title: "Error", description: `Could not save deductions: ${error.message}`, variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Deductions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-sm mb-2">Loan Deductions (Auto-Calculated)</h3>
                    <Table>
                        <TableHeader><TableRow><TableHead>Loan ID</TableHead><TableHead className="text-right">Outstanding Principal</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {loanBreakdown.length === 0 ? 
                            <TableRow><TableCell colSpan={2} className="text-center h-24">No Pending Loans</TableCell></TableRow>
                        :
                        loanBreakdown.map(loan => (
                                <TableRow key={loan.loan_id}><TableCell>{loan.loan_id}</TableCell><TableCell className="text-right">${Number(loan.outstanding_principal).toLocaleString()}</TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <h3 className="font-semibold text-sm mb-2">Case Deductions (Auto-Calculated)</h3>
                    <Table>
                        <TableHeader><TableRow><TableHead>Case ID</TableHead><TableHead className="text-right">Outstanding Case Amount</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {caseBreakdown.length === 0 ? 
                            <TableRow><TableCell colSpan={2} className="text-center h-24">No Pending Cases</TableCell></TableRow>
                        :
                        caseBreakdown.map(loan => (
                                <TableRow key={loan.case_id}><TableCell>{loan.case_id}</TableCell><TableCell className="text-right">${Number(loan.amount).toLocaleString()}</TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="pt-4 border-t">
                     <h3 className="font-semibold text-sm mb-2">Other Deductions (Manual)</h3>
                     <div className="grid gap-2">
                        <Label htmlFor="other_deductions">Amount ($)</Label>
                        <Input id="other_deductions" type="number" value={otherDeductionsAmount} onChange={e => setOtherDeductionsAmount(e.target.value)} disabled={isFinalized} />
                     </div>
                     {!isFinalized && <Button size="sm" className="mt-2" onClick={handleSave}>Save Other Deductions</Button>}
                </div>
            </CardContent>
        </Card>
    );
}