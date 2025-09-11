"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Loan {
    title: string
    principal_amount: string
    emi_amount: string
    remaining_installments: number
}

interface LoanStatusWidgetProps {
  ongoingLoans: Loan[]
}

export function LoanStatusWidget({ ongoingLoans }: LoanStatusWidgetProps) {
  if (ongoingLoans.length === 0) {
    return null; // Don't show the card if there are no active loans
  }
  
  const loan = ongoingLoans[0]; // Displaying the first ongoing loan
  const totalInstallments = Number(loan.principal_amount) / Number(loan.emi_amount);
  const progress = ((totalInstallments - loan.remaining_installments) / totalInstallments) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Loan Status</CardTitle>
        <CardDescription>Your current repayment progress.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-semibold">{loan.title}</p>
        <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{loan.remaining_installments} EMIs left</span>
        </div>
        <Progress value={progress} />
      </CardContent>
    </Card>
  )
}