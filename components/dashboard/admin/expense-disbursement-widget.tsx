"use client";
import { useEffect, useState } from "react";
import {  ExpenseDisbursementRequest, getExpenseDisbursementRequests } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ExpenseDisbursementWidget() {
  const [requests, setRequests] = useState<ExpenseDisbursementRequest[]>([]);

  useEffect(() => {
    getExpenseDisbursementRequests().then(setRequests).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Disbursements</CardTitle>
         <CardDescription>Approved claims ready for payment.</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground">No expenses ready for disbursement.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li key={req.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{req.employee_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {req.title}: ${req.amount}
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