// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { MainLayout } from "@/components/main-layout"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
// import { ArrowLeft, Edit, Plus, Trash2, Download, AlertCircle } from "lucide-react"
// import {
//   type PayrollRun,
//   type Payslip,
//   type PayslipDetail,
//   getPayrollRuns,
//   getPayslips,
//   getPayslipDetails,
//   updatePayslipDetail,
//   addPayslipDetail,
//   deletePayslipDetail,
//   getPayrollComponents,
//   type PayrollComponent,
// } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"
// import { useAuth } from "@/lib/auth-context"

// interface PayrollDetailPageProps {
//   params: { id: string }
// }

// export default function PayrollDetailPage({ params }: PayrollDetailPageProps) {
//   const payrollId = params.id;
//   const [payrollRun, setPayrollRun] = useState<PayrollRun | null>(null)
//   const [payslips, setPayslips] = useState<Payslip[]>([])
//   const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)
//   const [payslipDetails, setPayslipDetails] = useState<PayslipDetail[]>([])
//   const [payrollComponents, setPayrollComponents] = useState<PayrollComponent[]>([])
//   const [loading, setLoading] = useState(true)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [editingDetail, setEditingDetail] = useState<PayslipDetail | null>(null)
//   const [formData, setFormData] = useState({ component_name: "", component_type: "earning" as "earning" | "deduction", amount: 0 })
//   const { toast } = useToast()
//   const { hasPermission } = useAuth()

//   const canManagePayroll = hasPermission("payroll.manage");

//   const loadPayrollData = async () => {
//     if (!canManagePayroll) { setLoading(false); return; }
//     try {
//       setLoading(true)
//       const [runs, slips, components] = await Promise.all([
//           getPayrollRuns(), 
//           getPayslips(Number.parseInt(payrollId)),
//           getPayrollComponents()
//       ]);

//       const currentRun = runs.find((run) => run.id === Number.parseInt(payrollId))
//       setPayrollRun(currentRun || null)
//       setPayslips(slips)
//       setPayrollComponents(components);

//       if (slips.length > 0) {
//           handlePayslipSelect(slips[0]);
//       }

//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to load payroll data: ${error.message}`, variant: "destructive" })
//     } finally {
//       setLoading(false)
//     }
//   }
  
//   useEffect(() => {
//     loadPayrollData()
//   }, [payrollId, canManagePayroll])

//   const loadPayslipDetails = async (payslipId: number) => {
//     try {
//       const details = await getPayslipDetails(payslipId)
//       setPayslipDetails(details)
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to load payslip details: ${error.message}`, variant: "destructive" })
//     }
//   }

//   const handlePayslipSelect = (payslip: Payslip) => {
//     setSelectedPayslip(payslip)
//     loadPayslipDetails(payslip.id)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!selectedPayslip) return

//     try {
//       if (editingDetail) {
//         await updatePayslipDetail(selectedPayslip.id, editingDetail.id, formData)
//         toast({ title: "Success", description: "Payslip component updated successfully" })
//       } else {
//         await addPayslipDetail(selectedPayslip.id, formData)
//         toast({ title: "Success", description: "Payslip component added successfully" })
//       }
//       setDialogOpen(false)
//       setEditingDetail(null)
//       loadPayslipDetails(selectedPayslip.id)
//       loadPayrollData();
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to save component: ${error.message}`, variant: "destructive" })
//     }
//   }

//   const handleEdit = (detail: PayslipDetail) => {
//     setEditingDetail(detail)
//     setFormData({ component_name: detail.component_name, component_type: detail.component_type, amount: detail.amount })
//     setDialogOpen(true)
//   }
  
//   const handleCreate = () => {
//       setEditingDetail(null);
//       setFormData({ component_name: "", component_type: "earning", amount: 0 });
//       setDialogOpen(true);
//   }

//   const handleDelete = async (detailId: number) => {
//     if (!selectedPayslip || !confirm("Are you sure you want to delete this component?")) return

//     try {
//       await deletePayslipDetail(selectedPayslip.id, detailId)
//       toast({ title: "Success", description: "Payslip component deleted successfully" })
//       loadPayslipDetails(selectedPayslip.id)
//       loadPayrollData();
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to delete component: ${error.message}`, variant: "destructive" })
//     }
//   }

//   const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
//   const getStatusBadge = (status: string) => { /* ... same as previous file ... */ };

//   if (!canManagePayroll) { return <MainLayout><Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Access Denied</AlertTitle><AlertDescription>You don't have permission to manage payroll.</AlertDescription></Alert></MainLayout>; }
//   if (loading) { return <MainLayout><p>Loading...</p></MainLayout>; }
//   if (!payrollRun) { return <MainLayout><p>Payroll run not found.</p></MainLayout> }

//   return (
//     <MainLayout>
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Button variant="outline" asChild><Link href="/payroll/runs"><ArrowLeft className="h-4 w-4 mr-2" />Back to Runs</Link></Button>
//         <div>
//           <h1 className="text-2xl font-bold">Payroll Run Details</h1>
//           <p className="text-muted-foreground">{new Date(payrollRun.pay_period_start).toLocaleDateString()} to {new Date(payrollRun.pay_period_end).toLocaleDateString()}</p>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-1">
//           <Card><CardHeader><CardTitle>Employee Payslips</CardTitle><CardDescription>{payslips.length} employees</CardDescription></CardHeader>
//             <CardContent className="max-h-[60vh] overflow-y-auto">
//               {payslips.map((payslip) => (
//                 <div key={payslip.id} className={`p-3 border rounded-lg cursor-pointer transition-colors mb-2 ${selectedPayslip?.id === payslip.id ? "bg-primary/10 border-primary" : "hover:bg-muted"}`} onClick={() => handlePayslipSelect(payslip)}>
//                   <div className="flex justify-between items-center"><p className="font-medium">{payslip.employee_name}</p><p className="text-sm font-bold">{formatCurrency(parseFloat(payslip.net_pay))}</p></div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <CardTitle>{selectedPayslip ? `${selectedPayslip.employee_name}'s Payslip` : "Select an Employee"}</CardTitle>
//                   <CardDescription>{selectedPayslip ? "Detailed breakdown of salary components" : "Choose an employee to view details"}</CardDescription>
//                 </div>
//                 {selectedPayslip && payrollRun.status === "processing" && <Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />Add Component</Button>}
//               </div>
//             </CardHeader>
//             <CardContent>
//               {selectedPayslip ? (
//                 <div className="space-y-4">
//                   <Table>
//                     <TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead>{payrollRun.status === "processing" && <TableHead className="text-right">Actions</TableHead>}</TableRow></TableHeader>
//                     <TableBody>
//                       {payslipDetails.map((detail) => (
//                         <TableRow key={detail.id}>
//                           <TableCell className="font-medium">{detail.component_name}</TableCell>
//                           <TableCell><Badge variant={detail.component_type === "earning" ? "default" : "destructive"}>{detail.component_type}</Badge></TableCell>
//                           <TableCell className="text-right">{formatCurrency(detail.amount)}</TableCell>
//                           {payrollRun.status === "processing" && (
//                             <TableCell className="text-right">
//                               <div className="flex justify-end gap-2">
//                                 <Button variant="ghost" size="sm" onClick={() => handleEdit(detail)}><Edit className="h-4 w-4" /></Button>
//                                 <Button variant="ghost" size="sm" onClick={() => handleDelete(detail.id)}><Trash2 className="h-4 w-4" /></Button>
//                               </div>
//                             </TableCell>
//                           )}
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               ) : <div className="text-center py-12 text-muted-foreground">Select an employee from the list.</div>}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>{editingDetail ? "Edit Component" : "Add New Component"}</DialogTitle>
//                     <DialogDescription>{editingDetail ? "Update the component details" : "Add a new salary component"}</DialogDescription>
//                 </DialogHeader>
//                 <form onSubmit={handleSubmit} className="space-y-4 py-4">
//                     <div className="grid gap-2">
//                     <Label htmlFor="component_name">Component Name</Label>
//                     <Input id="component_name" value={formData.component_name} onChange={(e) => setFormData({ ...formData, component_name: e.target.value })} placeholder="e.g., Overtime, Bonus" required />
//                     </div>
//                     <div className="grid gap-2">
//                     <Label htmlFor="component_type">Component Type</Label>
//                     <Select value={formData.component_type} onValueChange={(value: "earning" | "deduction") => setFormData({ ...formData, component_type: value })}>
//                         <SelectTrigger><SelectValue /></SelectTrigger>
//                         <SelectContent><SelectItem value="earning">Earning</SelectItem><SelectItem value="deduction">Deduction</SelectItem></SelectContent>
//                     </Select>
//                     </div>
//                     <div className="grid gap-2">
//                     <Label htmlFor="amount">Amount</Label>
//                     <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })} placeholder="0.00" required />
//                     </div>
//                 <DialogFooter>
//                     <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
//                     <Button type="submit">{editingDetail ? "Update" : "Add"}</Button>
//                 </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     </div>
//     </MainLayout>
//   )
// }




"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Edit, Plus, Trash2, Download, AlertCircle, Search } from "lucide-react"
import {
  type PayrollRun,
  type Payslip,
  type PayslipDetail,
  getPayrollRuns,
  getPayslips,
  getPayslipDetails,
  updatePayslipDetail,
  addPayslipDetail,
  deletePayslipDetail,
  getPayrollComponents,
  type PayrollComponent,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface PayrollDetailPageProps {
  params: { id: string }
}

export default function PayrollDetailPage({ params }: PayrollDetailPageProps) {
  const payrollId = params.id;
  const [payrollRun, setPayrollRun] = useState<PayrollRun | null>(null)
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)
  const [payslipDetails, setPayslipDetails] = useState<PayslipDetail[]>([])
  const [payrollComponents, setPayrollComponents] = useState<PayrollComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDetail, setEditingDetail] = useState<PayslipDetail | null>(null)
  const [formData, setFormData] = useState({ component_name: "", component_type: "earning" as "earning" | "deduction", amount: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { hasPermission } = useAuth()

  const canManagePayroll = hasPermission("payroll.manage");

  // Filter and sort payslips based on search term and alphabetical order
  const filteredAndSortedPayslips = useMemo(() => {
    return payslips
      .filter(payslip => 
        payslip.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.employee_name.localeCompare(b.employee_name))
  }, [payslips, searchTerm])

  const loadPayrollData = async () => {
    if (!canManagePayroll) { setLoading(false); return; }
    try {
      setLoading(true)
      const [runs, slips, components] = await Promise.all([
          getPayrollRuns(), 
          getPayslips(Number.parseInt(payrollId)),
          getPayrollComponents()
      ]);

      const currentRun = runs.find((run) => run.id === Number.parseInt(payrollId))
      setPayrollRun(currentRun || null)
      setPayslips(slips)
      setPayrollComponents(components);

      // Sort payslips initially and select first one if available
      const sortedSlips = slips.sort((a, b) => a.employee_name.localeCompare(b.employee_name));
      if (sortedSlips.length > 0) {
          handlePayslipSelect(sortedSlips[0]);
      }

    } catch (error: any) {
      toast({ title: "Error", description: `Failed to load payroll data: ${error.message}`, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadPayrollData()
  }, [payrollId, canManagePayroll])

  const loadPayslipDetails = async (payslipId: number) => {
    try {
      const details = await getPayslipDetails(payslipId)
      setPayslipDetails(details)
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to load payslip details: ${error.message}`, variant: "destructive" })
    }
  }

  const handlePayslipSelect = (payslip: Payslip) => {
    setSelectedPayslip(payslip)
    loadPayslipDetails(payslip.id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPayslip) return

    try {
      if (editingDetail) {
        await updatePayslipDetail(selectedPayslip.id, editingDetail.id, formData)
        toast({ title: "Success", description: "Payslip component updated successfully" })
      } else {
        await addPayslipDetail(selectedPayslip.id, formData)
        toast({ title: "Success", description: "Payslip component added successfully" })
      }
      setDialogOpen(false)
      setEditingDetail(null)
      loadPayslipDetails(selectedPayslip.id)
      loadPayrollData();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to save component: ${error.message}`, variant: "destructive" })
    }
  }

  const handleEdit = (detail: PayslipDetail) => {
    setEditingDetail(detail)
    setFormData({ component_name: detail.component_name, component_type: detail.component_type, amount: detail.amount })
    setDialogOpen(true)
  }
  
  const handleCreate = () => {
      setEditingDetail(null);
      setFormData({ component_name: "", component_type: "earning", amount: 0 });
      setDialogOpen(true);
  }

  const handleDelete = async (detailId: number) => {
    if (!selectedPayslip || !confirm("Are you sure you want to delete this component?")) return

    try {
      await deletePayslipDetail(selectedPayslip.id, detailId)
      toast({ title: "Success", description: "Payslip component deleted successfully" })
      loadPayslipDetails(selectedPayslip.id)
      loadPayrollData();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to delete component: ${error.message}`, variant: "destructive" })
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  
  const getStatusBadge = (status: string) => { /* ... same as previous file ... */ };

  // Helper function to determine if net pay is negative or zero
  const isNegativeOrZeroAmount = (netPay: string) => {
    const amount = parseFloat(netPay);
    return amount <= 0;
  }

  if (!canManagePayroll) { return <MainLayout><Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Access Denied</AlertTitle><AlertDescription>You don't have permission to manage payroll.</AlertDescription></Alert></MainLayout>; }
  if (loading) { return <MainLayout><p>Loading...</p></MainLayout>; }
  if (!payrollRun) { return <MainLayout><p>Payroll run not found.</p></MainLayout> }

  return (
    <MainLayout>
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild><Link href="/payroll/runs"><ArrowLeft className="h-4 w-4 mr-2" />Back to Runs</Link></Button>
        <div>
          <h1 className="text-2xl font-bold">Payroll Run Details</h1>
          <p className="text-muted-foreground">{new Date(payrollRun.pay_period_start).toLocaleDateString()} to {new Date(payrollRun.pay_period_end).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Employee Payslips</CardTitle>
              <CardDescription>
                {filteredAndSortedPayslips.length} of {payslips.length} employees
                {filteredAndSortedPayslips.some(p => isNegativeOrZeroAmount(p.net_pay)) && (
                  <span className="text-red-600 font-medium ml-2">⚠️ Issues at top</span>
                )}
              </CardDescription>
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto">
              {filteredAndSortedPayslips.length > 0 ? (
                filteredAndSortedPayslips.map((payslip) => (
                  <div 
                    key={payslip.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors mb-2 ${
                      selectedPayslip?.id === payslip.id 
                        ? "bg-primary/10 border-primary" 
                        : "hover:bg-muted"
                    } ${
                      isNegativeOrZeroAmount(payslip.net_pay) 
                        ? "border-red-500 bg-red-50 hover:bg-red-100" 
                        : ""
                    }`} 
                    onClick={() => handlePayslipSelect(payslip)}
                  >
                    <div className="flex justify-between items-center">
                      <p className={`font-medium ${
                        isNegativeOrZeroAmount(payslip.net_pay) ? "text-red-700" : ""
                      }`}>
                        {payslip.employee_name}
                      </p>
                      <p className={`text-sm font-bold ${
                        isNegativeOrZeroAmount(payslip.net_pay) ? "text-red-700" : ""
                      }`}>
                        {formatCurrency(parseFloat(payslip.net_pay))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No employees found matching your search" : "No employees in this payroll run"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className={selectedPayslip && isNegativeOrZeroAmount(selectedPayslip.net_pay) ? "text-red-700" : ""}>
                    {selectedPayslip ? `${selectedPayslip.employee_name}'s Payslip` : "Select an Employee"}
                  </CardTitle>
                  <CardDescription>
                    {selectedPayslip ? (
                      <>
                        Detailed breakdown of salary components
                        {isNegativeOrZeroAmount(selectedPayslip.net_pay) && (
                          <span className="text-red-600 font-medium ml-2">⚠️ Negative/Zero Net Pay</span>
                        )}
                      </>
                    ) : (
                      "Choose an employee to view details"
                    )}
                  </CardDescription>
                </div>
                {selectedPayslip && payrollRun.status === "processing" && <Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-2" />Add Component</Button>}
              </div>
            </CardHeader>
            <CardContent>
              {selectedPayslip ? (
                <div className="space-y-4">
                  <Table>
                    <TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead>{payrollRun.status === "processing" && <TableHead className="text-right">Actions</TableHead>}</TableRow></TableHeader>
                    <TableBody>
                      {payslipDetails.map((detail) => (
                        <TableRow key={detail.id}>
                          <TableCell className="font-medium">{detail.component_name}</TableCell>
                          <TableCell><Badge variant={detail.component_type === "earning" ? "default" : "destructive"}>{detail.component_type}</Badge></TableCell>
                          <TableCell className="text-right">{formatCurrency(detail.amount)}</TableCell>
                          {payrollRun.status === "processing" && (
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(detail)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(detail.id)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : <div className="text-center py-12 text-muted-foreground">Select an employee from the list.</div>}
            </CardContent>
          </Card>
        </div>
      </div>
       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingDetail ? "Edit Component" : "Add New Component"}</DialogTitle>
                    <DialogDescription>{editingDetail ? "Update the component details" : "Add a new salary component"}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                    <Label htmlFor="component_name">Component Name</Label>
                    <Input id="component_name" value={formData.component_name} onChange={(e) => setFormData({ ...formData, component_name: e.target.value })} placeholder="e.g., Overtime, Bonus" required />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="component_type">Component Type</Label>
                    <Select value={formData.component_type} onValueChange={(value: "earning" | "deduction") => setFormData({ ...formData, component_type: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="earning">Earning</SelectItem><SelectItem value="deduction">Deduction</SelectItem></SelectContent>
                    </Select>
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })} placeholder="0.00" required />
                    </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingDetail ? "Update" : "Add"}</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
    </MainLayout>
  )
}