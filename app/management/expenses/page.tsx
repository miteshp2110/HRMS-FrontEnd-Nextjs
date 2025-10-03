// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useAuth } from "@/lib/auth-context";
// import { MainLayout } from "@/components/main-layout";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { Receipt, Search, Plus, AlertCircle, Edit, Trash2 } from "lucide-react";
// import Link from "next/link";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { getExpenses, deleteExpense, type ExpenseRecord } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { AddExpenseDialog } from "@/components/management/add-expense-dialog";
// import { EditExpenseDialog } from "@/components/management/edit-expense-dialog";

// export default function ExpenseClaimsPage() {
//   const { hasPermission } = useAuth();
//   const { toast } = useToast();
//   const [allExpenses, setAllExpenses] = useState<ExpenseRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(
//     null
//   );

//   const canManageExpenses = hasPermission("expenses.manage");

//   const fetchExpenses = async () => {
//     if (!canManageExpenses) {
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const data = await getExpenses();
//       setAllExpenses(data);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: `Could not fetch expenses: ${error.message}`,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, [canManageExpenses]);

//   const handleEditClick = (expense: ExpenseRecord) => {
//     setSelectedExpense(expense);
//     setIsEditDialogOpen(true);
//   };

//   const handleDeleteClick = async (expenseId: number) => {
//     if (
//       !confirm(
//         "Are you sure you want to delete this expense record? This action cannot be undone."
//       )
//     )
//       return;
//     try {
//       await deleteExpense(expenseId);
//       toast({ title: "Success", description: "Expense record deleted." });
//       fetchExpenses();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: `Failed to delete expense: ${error.message}`,
//         variant: "destructive",
//       });
//     }
//   };

//   const filteredExpenses = useMemo(() => {
//     if (!searchTerm) return allExpenses;
//     return allExpenses.filter((expense) =>
//       `${expense.first_name} ${expense.last_name}`
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//   }, [allExpenses, searchTerm]);

//   const { totalAmount, totalEmployees } = useMemo(() => {
//     const totalAmount = filteredExpenses.reduce(
//       (sum, exp) => sum + Number(exp.expense),
//       0
//     );
//     const uniqueEmployees = new Set(
//       filteredExpenses.map((exp) => exp.employee_id)
//     ).size;
//     return { totalAmount, totalEmployees: uniqueEmployees };
//   }, [filteredExpenses]);

//   const expensesByType = useMemo(() => {
//     const grouped = filteredExpenses.reduce((acc, curr) => {
//       acc[curr.expense_title] =
//         (acc[curr.expense_title] || 0) + Number(curr.expense);
//       return acc;
//     }, {} as Record<string, number>);
//     return Object.entries(grouped).map(([name, amount]) => ({ name, amount }));
//   }, [filteredExpenses]);

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <Receipt className="h-8 w-8" />
//             <h1 className="text-3xl font-bold">Employee Expenses</h1>
//           </div>
//           {canManageExpenses && (
//             <Button onClick={() => setIsAddDialogOpen(true)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Expense
//             </Button>
//           )}
//         </div>

//         {!canManageExpenses ? (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Access Denied</AlertTitle>
//             <AlertDescription>
//               You don't have permission to manage expenses.
//             </AlertDescription>
//           </Alert>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Total Expense Amount</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-3xl font-bold">
//                     ${totalAmount.toLocaleString()}
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Employees with Expenses</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-3xl font-bold">{totalEmployees}</p>
//                 </CardContent>
//               </Card>
//             </div>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Expenses by Type</CardTitle>
//                 <CardDescription>
//                   A visual breakdown of expenses by their title/type.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={expensesByType}>
//                     <XAxis
//                       dataKey="name"
//                       stroke="#888888"
//                       fontSize={12}
//                       tickLine={false}
//                       axisLine={false}
//                     />
//                     <YAxis
//                       stroke="#888888"
//                       fontSize={12}
//                       tickLine={false}
//                       axisLine={false}
//                       tickFormatter={(value) => `$${value}`}
//                     />
//                     <Tooltip
//                       formatter={(value) =>
//                         `$${Number(value).toLocaleString()}`
//                       }
//                     />
//                     <Bar
//                       dataKey="amount"
//                       fill="#8884d8"
//                       radius={[4, 4, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <CardTitle>All Expense Records</CardTitle>
//                 <div className="relative pt-2">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search by employee name..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {loading ? (
//                   <p>Loading...</p>
//                 ) : (
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Employee</TableHead>
//                         <TableHead>Title</TableHead>
//                         <TableHead>Amount</TableHead>
//                         <TableHead>Submitted On</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredExpenses.map((expense) => (
//                         <TableRow key={expense.id}>
//                           <TableCell>
//                             <Link
//                               href={`/directory/${expense.employee_id}`}
//                               className="font-medium text-primary hover:underline"
//                             >{`${expense.first_name} ${expense.last_name}`}</Link>
//                           </TableCell>
//                           <TableCell>{expense.expense_title}</TableCell>
//                           <TableCell>
//                             ${Number(expense.expense).toLocaleString()}
//                           </TableCell>
//                           <TableCell>
//                             {
//                               <TableCell>
//                                 {new Date(expense.created_at)
//                                   .toLocaleDateString("en-GB")
//                                   .replace(/\//g, "-")}
//                               </TableCell>
//                             }
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleEditClick(expense)}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleDeleteClick(expense.id)}
//                             >
//                               <Trash2 className="h-4 w-4 text-destructive" />
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 )}
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </div>
//       <AddExpenseDialog
//         open={isAddDialogOpen}
//         onOpenChange={setIsAddDialogOpen}
//         onExpenseAdded={fetchExpenses}
//       />
//       <EditExpenseDialog
//         expense={selectedExpense}
//         open={isEditDialogOpen}
//         onOpenChange={setIsEditDialogOpen}
//         onExpenseUpdated={fetchExpenses}
//       />
//     </MainLayout>
//   );
// }



"use client"

import { MainLayout } from "@/components/main-layout";
import { ExpensesManagementPage } from "@/components/management/expenses-management-page";

export default function ManagementExpenses() {
    return (
        <MainLayout>
            <ExpensesManagementPage />
        </MainLayout>
    )
}