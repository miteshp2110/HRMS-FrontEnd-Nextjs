"use client";
import { useEffect, useState } from "react";
import { getPendingExpenseApprovals, PendingExpenseApproval } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PendingExpenseApprovalWidget() {
  const [expenses, setExpenses] = useState<PendingExpenseApproval[]>([]);

  useEffect(() => {
    getPendingExpenseApprovals().then(setExpenses).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Expense Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-muted-foreground">No pending expense claims.</p>
        ) : (
          <ul className="space-y-4">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={expense.profile_url || undefined} />
                    <AvatarFallback>{expense.employee_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{expense.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.title}: ${expense.amount}
                    </p>
                  </div>
                </div>
                 <Button asChild variant="secondary" size="sm">
                  <Link href="/management/expenses">Review</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}