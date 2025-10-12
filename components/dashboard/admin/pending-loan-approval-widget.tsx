"use client";
import { useEffect, useState } from "react";
import { getPendingLoanApprovals, PendingLoanApproval } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PendingLoanApprovalWidget() {
  const [loans, setLoans] = useState<PendingLoanApproval[]>([]);

  useEffect(() => {
    getPendingLoanApprovals().then(setLoans).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Loan Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <p className="text-muted-foreground">No pending loan requests.</p>
        ) : (
          <ul className="space-y-4">
            {loans.map((loan) => (
              <li key={loan.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={loan.profile_url || undefined} />
                    <AvatarFallback>{loan.employee_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{loan.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {loan.loan_type_name}: ${loan.requested_amount}
                    </p>
                  </div>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/management/loans/${loan.id}`}>Review</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}