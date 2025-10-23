// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useToast } from "@/hooks/use-toast";
// import { getLoanApplications, LoanApplication } from "@/lib/api";
// import { Banknote } from "lucide-react";
// import Link from "next/link";
// import React from "react";

// export default function LoanFinanceTab() {
//   const { toast } = useToast();
//   const [approvedLoans, setApprovedLoans] = React.useState<LoanApplication[]>(
//     []
//   );
//   const [isLoading, setIsLoading] = React.useState(true);

//   const fetchData = React.useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const [loans] = await Promise.all([
//         getLoanApplications(), // Fetch all and filter for 'Approved'
//       ]);
//       setApprovedLoans(loans.filter((l) => l.status === "Approved"));
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: "Could not load financial data.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast]);

//   React.useEffect(() => {
//     fetchData();
//   }, [fetchData]);
//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Pending Loan Disbursements</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Employee</TableHead>
//                 <TableHead>Approved Amount</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading?
//               <TableCell colSpan={4} className="text-center h-24">Loading</TableCell>
//             :
//             approvedLoans.length === 0?
//               <TableCell colSpan={4} className="text-center h-24">No Records Found</TableCell>
//             :
//             approvedLoans.map((loan) => (
//                 <TableRow key={loan.id}>
//                   <TableCell>{loan.application_id_text}</TableCell>
//                   <TableCell>{loan.employee_name}</TableCell>
//                   <TableCell>
//                     ${loan.approved_amount?.toLocaleString()}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Button asChild variant="default" size="sm">
//                       <Link href={`/management/loans/${loan.id}`}>
//                         <Banknote className="h-4 w-4 mr-2" />
//                         Disburse
//                       </Link>
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </>
//   );
// }


"use client";

import React from "react";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getLoanApplications, LoanApplication } from "@/lib/api";
import { Banknote, Loader2 } from "lucide-react";

function formatAED(amount: number | null | undefined) {
  const n = typeof amount === "number" ? amount : 0;
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 2,
  }).format(n);
}

export default function LoanFinanceTab() {
  const { toast } = useToast();
  const [approvedLoans, setApprovedLoans] = React.useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [navigatingId, setNavigatingId] = React.useState<string | number | null>(null);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [loans] = await Promise.all([getLoanApplications()]);
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
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-28 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : approvedLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    No Records Found
                  </TableCell>
                </TableRow>
              ) : (
                approvedLoans.map((loan) => (
                  <TableRow key={loan.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>{loan.application_id_text}</TableCell>
                    <TableCell>{loan.employee_name}</TableCell>
                    <TableCell>{formatAED(Number(loan.approved_amount))}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        asChild
                        variant="default"
                        size="sm"
                        aria-busy={navigatingId === loan.id}
                      >
                        <Link
                          href={`/management/loans/${loan.id}`}
                          onClick={() => setNavigatingId(loan.id)}
                        >
                          {navigatingId === loan.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Disbursing...
                            </>
                          ) : (
                            <>
                              <Banknote className="h-4 w-4 mr-2" />
                              Disburse
                            </>
                          )}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
