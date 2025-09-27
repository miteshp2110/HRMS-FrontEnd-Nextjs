"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { disburseLoan, type LoanApplication } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface LoanDisbursementCardProps {
    application: LoanApplication;
    onSuccess: () => void;
}

export function LoanDisbursementCard({ application, onSuccess }: LoanDisbursementCardProps) {
    const { toast } = useToast();
    const [disbursementDate, setDisbursementDate] = React.useState('');
    const [jvNumber, setJvNumber] = React.useState('');

    const handleDisburse = async () => {
         if (!disbursementDate || !jvNumber) {
            toast({ title: "Error", description: "Disbursement date and JV number are required.", variant: "destructive"});
            return;
        }
        try {
            await disburseLoan(application.id, { disbursement_date: disbursementDate, jv_number: jvNumber });
            toast({ title: "Success", description: "Loan has been disbursed." });
            onSuccess();
        } catch (error: any) {
            toast({ title: "Error", description: `Disbursement failed: ${error.message}`, variant: "destructive" });
        }
    }

    return (
        <Card>
            <CardHeader><CardTitle>Disbursement Action</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="disbursement_date">Disbursement Date</Label>
                    <Input id="disbursement_date" type="date" value={disbursementDate} onChange={e => setDisbursementDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="jv_number">Journal Voucher #</Label>
                    <Input id="jv_number" value={jvNumber} onChange={e => setJvNumber(e.target.value)} />
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleDisburse}>Confirm Disbursement</Button>
                </div>
            </CardContent>
        </Card>
    );
}