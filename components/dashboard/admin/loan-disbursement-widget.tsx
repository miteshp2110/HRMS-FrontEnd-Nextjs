"use client";
import { useEffect, useState } from "react";
import { getLoanDisbursementRequests, LoanDisbursementRequest } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoanDisbursementWidget() {
  const [requests, setRequests] = useState<LoanDisbursementRequest[]>([]);

  useEffect(() => {
    getLoanDisbursementRequests().then(setRequests).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Disbursements</CardTitle>
        <CardDescription>Approved loans ready for payment.</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground">No loans ready for disbursement.</p>
        ) : (
           <ul className="space-y-4">
            {requests.map((req) => (
              <li key={req.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{req.employee_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {req.loan_type_name}: ${req.approved_amount}
                  </p>
                </div>
                 <Button asChild variant="secondary" size="sm">
                  <Link href="/admin/finance">Disburse</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}