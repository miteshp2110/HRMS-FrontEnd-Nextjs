import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getLoanApplications, LoanApplication } from "@/lib/api";
import { Banknote } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function LoanFinanceTab() {
  const { toast } = useToast();
  const [approvedLoans, setApprovedLoans] = React.useState<LoanApplication[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [loans] = await Promise.all([
        getLoanApplications(), // Fetch all and filter for 'Approved'
      ]);
      setApprovedLoans(loans.filter((l) => l.status === "Approved"));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load financial data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Loan Disbursements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Approved Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading?
              <TableCell colSpan={4} className="text-center h-24">Loading</TableCell>
            :
            approvedLoans.length === 0?
              <TableCell colSpan={4} className="text-center h-24">No Records Found</TableCell>
            :
            approvedLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.application_id_text}</TableCell>
                  <TableCell>{loan.employee_name}</TableCell>
                  <TableCell>
                    ${loan.approved_amount?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="default" size="sm">
                      <Link href={`/management/loans/${loan.id}`}>
                        <Banknote className="h-4 w-4 mr-2" />
                        Disburse
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
