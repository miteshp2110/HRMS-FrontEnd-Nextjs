

"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import LoanFinanceTab from "@/components/management/finance/loan-finance-tab";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseFinanceTab from "@/components/management/finance/expense-finance-tab";
import { Banknote } from "lucide-react";


export default function FinancePage() {
    

    return (
        <MainLayout>
            <div className="flex items-center gap-4">
                    <Banknote className="h-8 w-8" />
                    <div>
                        <h1 className="text-3xl font-bold">Finance & Reimbursements</h1>
                        <p className="text-muted-foreground">Manage expense reimbursement settings and financial configurations.</p>
                    </div>
                </div>
            <Tabs defaultValue="expense" className="mt-2">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="expense">Expense</TabsTrigger>
                    <TabsTrigger value="loans">Loans</TabsTrigger>
                </TabsList>

                <TabsContent value="expense" className="mt-5">
                    <ExpenseFinanceTab/>
                </TabsContent>
                <TabsContent value="loans" className="mt-5">
                    <LoanFinanceTab/>
                </TabsContent>

            </Tabs>
        </MainLayout>
    )
}

// "use client"

// import * as React from "react";
// import Link from "next/link";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Banknote, CheckCircle, Eye } from "lucide-react";
// import { getExpenseClaims, getLoanApplications, type ExpenseClaim, type LoanApplication } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { ReimburseAdvanceDialog } from "@/components/finance/reimburse-advance-dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";

// export default function FinancePage() {
    // const { toast } = useToast();
//     const [approvedExpenses, setApprovedExpenses] = React.useState<ExpenseClaim[]>([]);
    // const [approvedLoans, setApprovedLoans] = React.useState<LoanApplication[]>([]);
    // const [isLoading, setIsLoading] = React.useState(true);
//     const [selectedExpense, setSelectedExpense] = React.useState<ExpenseClaim | null>(null);
//     const [isReimburseDialogOpen, setIsReimburseDialogOpen] = React.useState(false);

    // const fetchData = React.useCallback(async () => {
    //     setIsLoading(true);
    //     try {
    //         const [expenses, loans] = await Promise.all([
    //             getExpenseClaims({ status: 'Approved' }),
    //             getLoanApplications() // Fetch all and filter for 'Approved'
    //         ]);
    //         setApprovedExpenses(expenses);
    //         setApprovedLoans(loans.filter(l => l.status === 'Approved'));
    //     } catch (error: any) {
    //         toast({ title: "Error", description: "Could not load financial data.", variant: "destructive" });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }, [toast]);

    // React.useEffect(() => {
    //     fetchData();
    // }, [fetchData]);

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                     <Banknote className="h-8 w-8" />
//                     <div>
//                         <h1 className="text-3xl font-bold">Finance Center</h1>
//                         <p className="text-muted-foreground">Manage all disbursements and reimbursements.</p>
//                     </div>
//                 </div>

//                 <Tabs defaultValue="expenses">
//                     <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="expenses">Expense Reimbursements</TabsTrigger>
//                         <TabsTrigger value="loans">Loan Disbursements</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="expenses">
//                         <Card>
//                             <CardHeader><CardTitle>Pending Expense Reimbursements</CardTitle></CardHeader>
//                             <CardContent>
//                                 <Table>
//                                     <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
//                                     <TableBody>
//                                         {approvedExpenses.map(claim => (
//                                             <TableRow key={claim.id}>
//                                                 <TableCell>{claim.employee_name}</TableCell>
//                                                 <TableCell><Badge variant={claim.claim_type === 'Advance' ? 'secondary' : 'default'}>{claim.claim_type}</Badge></TableCell>
//                                                 <TableCell>${claim.amount.toLocaleString()}</TableCell>
//                                                 <TableCell className="text-right">
//                                                      <Button size="sm" onClick={() => { setSelectedExpense(claim); setIsReimburseDialogOpen(true); }}>
//                                                         <CheckCircle className="h-4 w-4 mr-2" />
//                                                         Process
//                                                     </Button>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </CardContent>
//                         </Card>
//                     </TabsContent>

//                     <TabsContent value="loans">
                        // <Card>
                        //     <CardHeader><CardTitle>Pending Loan Disbursements</CardTitle></CardHeader>
                        //     <CardContent>
                        //         <Table>
                        //             <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Employee</TableHead><TableHead>Approved Amount</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        //             <TableBody>
                        //                 {approvedLoans.map(loan => (
                        //                     <TableRow key={loan.id}>
                        //                         <TableCell>{loan.application_id_text}</TableCell>
                        //                         <TableCell>{loan.employee_name}</TableCell>
                        //                         <TableCell>${loan.approved_amount?.toLocaleString()}</TableCell>
                        //                         <TableCell className="text-right">
                        //                             <Button asChild variant="default" size="sm">
                        //                                 <Link href={`/management/loans/${loan.id}`}><Banknote className="h-4 w-4 mr-2"/>Disburse</Link>
                        //                             </Button>
                        //                         </TableCell>
                        //                     </TableRow>
                        //                 ))}
                        //             </TableBody>
                        //         </Table>
                        //     </CardContent>
                        // </Card>
//                     </TabsContent>
//                 </Tabs>
//             </div>
            
//             <ReimburseAdvanceDialog 
//                 claim={selectedExpense} 
//                 open={isReimburseDialogOpen} 
//                 onOpenChange={setIsReimburseDialogOpen} 
//                 onSuccess={fetchData} 
//             />
//         </MainLayout>
//     );
// }