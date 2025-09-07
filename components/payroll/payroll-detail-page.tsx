"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Plus, Trash2, Download } from "lucide-react"
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
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface PayrollDetailPageProps {
  payrollId: string
}

export function PayrollDetailPage({ payrollId }: PayrollDetailPageProps) {
  const [payrollRun, setPayrollRun] = useState<PayrollRun | null>(null)
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)
  const [payslipDetails, setPayslipDetails] = useState<PayslipDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDetail, setEditingDetail] = useState<PayslipDetail | null>(null)
  const [formData, setFormData] = useState({
    component_name: "",
    component_type: "earning" as "earning" | "deduction",
    amount: 0,
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadPayrollData()
  }, [payrollId])

  const loadPayrollData = async () => {
    try {
      setLoading(true)
      const [runs, slips] = await Promise.all([getPayrollRuns(), getPayslips(Number.parseInt(payrollId))])

      const currentRun = runs.find((run) => run.id === Number.parseInt(payrollId))
      setPayrollRun(currentRun || null)
      setPayslips(slips)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payroll data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadPayslipDetails = async (payslipId: number) => {
    try {
      const details = await getPayslipDetails(payslipId)
      setPayslipDetails(details)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payslip details",
        variant: "destructive",
      })
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
      setFormData({ component_name: "", component_type: "earning", amount: 0 })
      loadPayslipDetails(selectedPayslip.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payslip component",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (detail: PayslipDetail) => {
    setEditingDetail(detail)
    setFormData({
      component_name: detail.component_name,
      component_type: detail.component_type,
      amount: detail.amount,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (detailId: number) => {
    if (!selectedPayslip || !confirm("Are you sure you want to delete this component?")) return

    try {
      await deletePayslipDetail(selectedPayslip.id, detailId)
      toast({ title: "Success", description: "Payslip component deleted successfully" })
      loadPayslipDetails(selectedPayslip.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payslip component",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "finalized":
        return <Badge variant="default">Finalized</Badge>
      case "paid":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Paid
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!payrollRun) {
    return <div className="flex items-center justify-center h-64">Payroll run not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            Payroll Run - {new Date(payrollRun.from_date).toLocaleDateString()} to{" "}
            {new Date(payrollRun.to_date).toLocaleDateString()}
          </h1>
          <p className="text-muted-foreground">
            {payrollRun.total_employees} employees • {formatCurrency(payrollRun.total_amount)} total
          </p>
        </div>
        {getStatusBadge(payrollRun.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payslips List */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Payslips</CardTitle>
            <CardDescription>Select an employee to view payslip details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {payslips.map((payslip) => (
                <div
                  key={payslip.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPayslip?.id === payslip.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                  }`}
                  onClick={() => handlePayslipSelect(payslip)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{payslip.employee_name}</p>
                      <p className="text-sm text-muted-foreground">Net Pay: {formatCurrency(payslip.net_pay)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Gross: {formatCurrency(payslip.gross_earnings)}</p>
                      <p className="text-sm text-muted-foreground">
                        Deductions: {formatCurrency(payslip.total_deductions)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payslip Details */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {selectedPayslip ? `${selectedPayslip.employee_name}'s Payslip` : "Select Employee"}
                </CardTitle>
                <CardDescription>
                  {selectedPayslip ? "Detailed breakdown of salary components" : "Choose an employee to view details"}
                </CardDescription>
              </div>
              {selectedPayslip && payrollRun.status === "draft" && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingDetail(null)
                        setFormData({ component_name: "", component_type: "earning", amount: 0 })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Component
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingDetail ? "Edit Component" : "Add New Component"}</DialogTitle>
                      <DialogDescription>
                        {editingDetail ? "Update the component details" : "Add a new salary component"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="component_name">Component Name</Label>
                          <Input
                            id="component_name"
                            value={formData.component_name}
                            onChange={(e) => setFormData({ ...formData, component_name: e.target.value })}
                            placeholder="e.g., Overtime, Bonus"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="component_type">Component Type</Label>
                          <Select
                            value={formData.component_type}
                            onValueChange={(value: "earning" | "deduction") =>
                              setFormData({ ...formData, component_type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="earning">Earning</SelectItem>
                              <SelectItem value="deduction">Deduction</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) =>
                              setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })
                            }
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">{editingDetail ? "Update" : "Add"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedPayslip ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">Net Pay</span>
                  <span className="text-lg font-bold">{formatCurrency(selectedPayslip.net_pay)}</span>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      {payrollRun.status === "draft" && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslipDetails.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell className="font-medium">{detail.component_name}</TableCell>
                        <TableCell>
                          <Badge variant={detail.component_type === "earning" ? "default" : "destructive"}>
                            {detail.component_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(detail.amount)}</TableCell>
                        {payrollRun.status === "draft" && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(detail)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete(detail.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Payslip
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Select an employee from the list to view payslip details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
