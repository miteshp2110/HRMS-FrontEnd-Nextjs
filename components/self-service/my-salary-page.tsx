
// "use client"

// import * as React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
// import { getMySalaryStructure, type SalaryComponent } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// export function MySalaryPage() {
//   const [structure, setStructure] = React.useState<SalaryComponent[]>([])
//   const [isLoading, setIsLoading] = React.useState(true)
//   const { toast } = useToast()

//   React.useEffect(() => {
//     const fetchStructure = async () => {
//       try {
//         setIsLoading(true)
//         const data = await getMySalaryStructure()
//         setStructure(data)
//       } catch (error: any) {
//         toast({ title: "Error", description: `Could not load your salary structure: ${error.message}`, variant: "destructive"})
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchStructure()
//   }, [toast])

//   const { totalEarnings, totalDeductions, netSalary } = React.useMemo(() => {
//     const earnings = structure.filter(c => c.component_type === 'earning').reduce((sum, c) => sum + c.calculated_amount, 0);
//     const deductions = structure.filter(c => c.component_type === 'deduction').reduce((sum, c) => sum + c.calculated_amount, 0);
//     return { totalEarnings: earnings, totalDeductions: deductions, netSalary: earnings - deductions };
//   }, [structure]);

//   const chartData = [
//     { name: "Net Salary", value: netSalary, color: "#22c55e" },
//     { name: "Deductions", value: totalDeductions, color: "#ef4444" },
//   ]

//   const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  
//   const getComponentBadge = (type: "earning" | "deduction") => (
//     <Badge variant={type === "earning" ? "default" : "secondary"} className={type === "earning" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
//       {type === "earning" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
//       {type === "earning" ? "Earning" : "Deduction"}
//     </Badge>
//   )
  
//   if (isLoading) {
//     return <div className="text-center py-12">Loading your salary details...</div>
//   }

//   if (!structure || structure.length === 0) {
//       return (
//         <Alert>
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>No Salary Structure Found</AlertTitle>
//             <AlertDescription>Your salary structure has not been configured yet. Please contact HR for assistance.</AlertDescription>
//         </Alert>
//       )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card><CardHeader><CardTitle className="text-sm font-medium">Total Earnings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p></CardContent></Card>
//         <Card><CardHeader><CardTitle className="text-sm font-medium">Total Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p></CardContent></Card>
//         <Card><CardHeader><CardTitle className="text-sm font-medium">Net Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{formatCurrency(netSalary)}</p></CardContent></Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader><CardTitle>Salary Breakdown</CardTitle><CardDescription>Visual breakdown of your salary components</CardDescription></CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
//                     {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
//                   </Pie>
//                   <Tooltip formatter={(value) => formatCurrency(Number(value))} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader><CardTitle>Salary Components</CardTitle><CardDescription>Detailed breakdown of all your components</CardDescription></CardHeader>
//           <CardContent>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
//                 <TableBody>
//                   {structure.map((component) => (
//                     <TableRow key={component.id}>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{component.component_name}</p>
//                           {component.value_type === "percentage" && component.based_on_component_name && (
//                             <p className="text-xs text-muted-foreground">{component.value}% of {component.based_on_component_name}</p>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>{getComponentBadge(component.component_type)}</TableCell>
//                       <TableCell className="text-right font-medium">{formatCurrency(component.calculated_amount)}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }\




// "use client"

// import * as React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Eye } from "lucide-react"
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
// import { getMySalaryStructure, getMyPayslipHistory, type SalaryComponent, type PayslipHistory } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { PayslipDetailDialog } from "./payslip-detail-dialog"
// import { Button } from "../ui/button"


// export function MySalaryPage() {
//   const [structure, setStructure] = React.useState<SalaryComponent[]>([])
//   const [payslipHistory, setPayslipHistory] = React.useState<PayslipHistory[]>([]);
//   const [isLoading, setIsLoading] = React.useState(true)
//   const { toast } = useToast()
  
//   const [selectedPayslip, setSelectedPayslip] = React.useState<PayslipHistory | null>(null);
//   const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);

//   React.useEffect(() => {
//     const fetchAllData = async () => {
//       setIsLoading(true)
//       try {
//         const today = new Date();
//         const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

//         const [structureData, historyData] = await Promise.all([
//           getMySalaryStructure(),
//           getMyPayslipHistory(endDate)
//         ]);
//         setStructure(structureData)
//         setPayslipHistory(historyData.sort((a,b) => new Date(a.pay_period_start).getTime() - new Date(b.pay_period_start).getTime()));
//       } catch (error: any) {
//         toast({ title: "Error", description: `Could not load your salary information: ${error.message}`, variant: "destructive"})
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchAllData()
//   }, [toast])

//   const { totalEarnings, totalDeductions, netSalary } = React.useMemo(() => {
//     const earnings = structure.filter(c => c.component_type === 'earning').reduce((sum, c) => sum + c.calculated_amount, 0);
//     const deductions = structure.filter(c => c.component_type === 'deduction').reduce((sum, c) => sum + c.calculated_amount, 0);
//     return { totalEarnings: earnings, totalDeductions: deductions, netSalary: earnings - deductions };
//   }, [structure]);

//   const chartData = payslipHistory.map(p => ({
//       month: new Date(p.pay_period_end).toLocaleString('default', { month: 'short' }),
//       "Net Pay": parseFloat(p.net_pay)
//   }));
  
//   const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  
//   const handlePayslipClick = (payslip: PayslipHistory) => {
//       setSelectedPayslip(payslip);
//       setIsDetailDialogOpen(true);
//   }
  
//   if (isLoading) {
//     return <div className="text-center py-12">Loading your salary details...</div>
//   }

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="structure">
//           <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="structure">Current Salary Structure</TabsTrigger>
//               <TabsTrigger value="history">Payslip History</TabsTrigger>
//           </TabsList>
//           <TabsContent value="structure">
//             {structure.length === 0 ? (
//                 <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Salary Structure Found</AlertTitle><AlertDescription>Your salary structure has not been configured yet. Please contact HR.</AlertDescription></Alert>
//             ) : (
//                 <div className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <Card><CardHeader><CardTitle className="text-sm font-medium">Total Earnings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p></CardContent></Card>
//                         <Card><CardHeader><CardTitle className="text-sm font-medium">Total Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p></CardContent></Card>
//                         <Card><CardHeader><CardTitle className="text-sm font-medium">Net Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{formatCurrency(netSalary)}</p></CardContent></Card>
//                     </div>
//                     <Card>
//                         <CardHeader><CardTitle>Salary Components</CardTitle><CardDescription>Detailed breakdown of all your components</CardDescription></CardHeader>
//                         <CardContent>
//                             <Table>
//                                 <TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
//                                 <TableBody>
//                                 {structure.map((component) => (
//                                     <TableRow key={component.id}>
//                                     <TableCell>{component.component_name}</TableCell>
//                                     <TableCell><Badge variant={component.component_type === 'earning' ? 'default' : 'destructive'}>{component.component_type}</Badge></TableCell>
//                                     <TableCell className="text-right font-medium">{formatCurrency(component.calculated_amount)}</TableCell>
//                                     </TableRow>
//                                 ))}
//                                 </TableBody>
//                             </Table>
//                         </CardContent>
//                     </Card>
//                 </div>
//             )}
//           </TabsContent>
//           <TabsContent value="history">
//             {payslipHistory.length === 0 ? (
//                  <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Payslip History</AlertTitle><AlertDescription>There are no payslips available for you to view yet.</AlertDescription></Alert>
//             ) : (
//                 <div className="space-y-6">
//                     <Card>
//                         <CardHeader><CardTitle>Net Pay Trend</CardTitle><CardDescription>Your take-home salary over the last year.</CardDescription></CardHeader>
//                         <CardContent>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <LineChart data={chartData}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="month" />
//                                     <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
//                                     <Tooltip formatter={(value) => formatCurrency(Number(value))}/>
//                                     <Legend />
//                                     <Line type="monotone" dataKey="Net Pay" stroke="#3b82f6" strokeWidth={2} />
//                                 </LineChart>
//                             </ResponsiveContainer>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <CardHeader><CardTitle>Past Payslips</CardTitle><CardDescription>Click on a row to see the detailed breakdown.</CardDescription></CardHeader>
//                         <CardContent>
//                             <Table>
//                                 <TableHeader><TableRow><TableHead>Pay Period</TableHead><TableHead className="text-right">Net Pay</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
//                                 <TableBody>
//                                     {payslipHistory.map(p => (
//                                         <TableRow key={p.id} className="cursor-pointer hover:bg-muted" onClick={() => handlePayslipClick(p)}>
//                                             <TableCell>{new Date(p.pay_period_start).toLocaleDateString()} - {new Date(p.pay_period_end).toLocaleDateString()}</TableCell>
//                                             <TableCell className="text-right font-bold">{formatCurrency(parseFloat(p.net_pay))}</TableCell>
//                                             <TableCell className="text-right"><Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-2"/>View</Button></TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </CardContent>
//                     </Card>
//                 </div>
//             )}
//           </TabsContent>
//       </Tabs>
//       <PayslipDetailDialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} payslip={selectedPayslip} />
//     </div>
//   )
// }



"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Eye, Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { getMySalaryStructure, getMyPayslipHistory, type SalaryComponent, type PayslipHistory } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { PayslipDetailDialog } from "./payslip-detail-dialog"
import { Button } from "../ui/button"


export function MySalaryPage() {
  const [structure, setStructure] = React.useState<SalaryComponent[]>([])
  const [payslipHistory, setPayslipHistory] = React.useState<PayslipHistory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true)
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(false)
  const { toast } = useToast()
  
  const [selectedPayslip, setSelectedPayslip] = React.useState<PayslipHistory | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  
  // Date selection state
  const [endDate, setEndDate] = React.useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  });

  // Fetch salary structure on component mount
  React.useEffect(() => {
    const fetchStructure = async () => {
      setIsLoading(true)
      try {
        const structureData = await getMySalaryStructure();
        setStructure(structureData)
      } catch (error: any) {
        toast({ title: "Error", description: `Could not load your salary structure: ${error.message}`, variant: "destructive"})
      } finally {
        setIsLoading(false)
      }
    }
    fetchStructure()
  }, [toast])

  // Fetch payslip history when endDate changes
  React.useEffect(() => {
    const fetchPayslipHistory = async () => {
      setIsHistoryLoading(true)
      try {
        const historyData = await getMyPayslipHistory(endDate);
        setPayslipHistory(historyData.sort((a,b) => new Date(a.pay_period_start).getTime() - new Date(b.pay_period_start).getTime()));
      } catch (error: any) {
        toast({ title: "Error", description: `Could not load payslip history: ${error.message}`, variant: "destructive"})
      } finally {
        setIsHistoryLoading(false)
      }
    }
    
    if (endDate) {
      fetchPayslipHistory()
    }
  }, [endDate, toast])

  const { totalEarnings, totalDeductions, netSalary } = React.useMemo(() => {
    const earnings = structure.filter(c => c.component_type === 'earning').reduce((sum, c) => sum + c.calculated_amount, 0);
    const deductions = structure.filter(c => c.component_type === 'deduction').reduce((sum, c) => sum + c.calculated_amount, 0);
    return { totalEarnings: earnings, totalDeductions: deductions, netSalary: earnings - deductions };
  }, [structure]);

  const chartData = payslipHistory.map(p => ({
      month: new Date(p.pay_period_end).toLocaleString('default', { month: 'short' }),
      "Net Pay": parseFloat(p.net_pay)
  }));
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  
  const handlePayslipClick = (payslip: PayslipHistory) => {
      setSelectedPayslip(payslip);
      setIsDetailDialogOpen(true);
  }
  
  if (isLoading) {
    return <div className="text-center py-12">Loading your salary details...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="structure">
          <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="structure">Current Salary Structure</TabsTrigger>
              <TabsTrigger value="history">Payslip History</TabsTrigger>
          </TabsList>
          <TabsContent value="structure">
            {structure.length === 0 ? (
                <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Salary Structure Found</AlertTitle><AlertDescription>Your salary structure has not been configured yet. Please contact HR.</AlertDescription></Alert>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Total Earnings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Total Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-sm font-medium">Net Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{formatCurrency(netSalary)}</p></CardContent></Card>
                    </div>
                    <Card>
                        <CardHeader><CardTitle>Salary Components</CardTitle><CardDescription>Detailed breakdown of all your components</CardDescription></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                                <TableBody>
                                {structure.map((component) => (
                                    <TableRow key={component.id}>
                                    <TableCell>{component.component_name}</TableCell>
                                    <TableCell><Badge variant={component.component_type === 'earning' ? 'default' : 'destructive'}>{component.component_type}</Badge></TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(component.calculated_amount)}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
          </TabsContent>
          <TabsContent value="history">
            <div className="space-y-6">
              {/* Date Selection Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Date Range Selection
                  </CardTitle>
                  <CardDescription>Select the end date to view past 1 year payslips from that date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2 max-w-sm">
                    <Label htmlFor="endDate">Past 1 year payslips from date</Label>
                    <Input 
                      id="endDate"
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      This will fetch payslips from {new Date(new Date(endDate).getTime() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {isHistoryLoading ? (
                <div className="text-center py-8">Loading payslip history...</div>
              ) : payslipHistory.length === 0 ? (
                 <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>No Payslip History</AlertTitle><AlertDescription>There are no payslips available for the selected date range.</AlertDescription></Alert>
              ) : (
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Net Pay Trend</CardTitle><CardDescription>Your take-home salary from {new Date(new Date(endDate).getTime() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}</CardDescription></CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                                    <Tooltip formatter={(value) => formatCurrency(Number(value))}/>
                                    <Legend />
                                    <Line type="monotone" dataKey="Net Pay" stroke="#3b82f6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Past Payslips</CardTitle><CardDescription>Click on a row to see the detailed breakdown. Showing {payslipHistory.length} payslip(s).</CardDescription></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Pay Period</TableHead><TableHead className="text-right">Net Pay</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {payslipHistory.map(p => (
                                        <TableRow key={p.id} className="cursor-pointer hover:bg-muted" onClick={() => handlePayslipClick(p)}>
                                            <TableCell>{new Date(p.pay_period_start).toLocaleDateString()} - {new Date(p.pay_period_end).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(parseFloat(p.net_pay))}</TableCell>
                                            <TableCell className="text-right"><Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-2"/>View</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
              )}
            </div>
          </TabsContent>
      </Tabs>
      <PayslipDetailDialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} payslip={selectedPayslip} />
    </div>
  )
}