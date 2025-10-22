
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, CreditCard, Clock } from "lucide-react";

interface OngoingLoansWidgetProps {
  ongoingLoans: {
    id: number;
    loan_type_name: string;
    approved_amount: string;
    emis_paid: number;
    total_emis: number;
  }[];
}

export function OngoingLoansWidget({ ongoingLoans }: OngoingLoansWidgetProps) {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle>Ongoing Loans</CardTitle>
        <CardDescription>Your active loan accounts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {ongoingLoans.length > 0 ? (
          ongoingLoans.map((loan) => {
            const progressPercent = (loan.emis_paid / loan.total_emis) * 100;
            return (
              <div
                key={loan.id}
                className="p-4 rounded-lg bg-muted/30 border border-muted/50 hover:bg-muted/40 transition-colors shadow-sm"
                title={`${loan.loan_type_name} - AED ${loan.approved_amount}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-lg truncate max-w-xs">
                      {loan.loan_type_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground font-medium">
                    
                    <span>AED {loan.approved_amount}</span>
                  </div>
                </div>
                <Progress value={progressPercent} className="h-4 rounded-md" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2 font-mono">
                  <span>
                    <Clock className="inline w-4 h-4 mr-1" />
                    Paid: {loan.emis_paid}/{loan.total_emis} EMIs
                  </span>
                  <span>
                    Pending: {loan.total_emis - loan.emis_paid} EMIs
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-center py-10">
            You have no ongoing loans.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
