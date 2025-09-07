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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye, Play, CheckCircle } from "lucide-react"
import { type PayrollRun, getPayrollRuns, initiatePayrollRun, finalizePayrollRun, deletePayrollRun } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function PayrollRunsPage() {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({ from_date: "", to_date: "" })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadPayrollRuns()
  }, [])

  const loadPayrollRuns = async () => {
    try {
      setLoading(true)
      const data = await getPayrollRuns()
      setPayrollRuns(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payroll runs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInitiatePayroll = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setProcessing(true)
      await initiatePayrollRun(formData)
      toast({ title: "Success", description: "Payroll run initiated successfully" })
      setDialogOpen(false)
      setFormData({ from_date: "", to_date: "" })
      loadPayrollRuns()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payroll run",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleFinalize = async (payrollId: number) => {
    if (!confirm("Are you sure you want to finalize this payroll run? This action cannot be undone.")) return

    try {
      await finalizePayrollRun(payrollId)
      toast({ title: "Success", description: "Payroll run finalized successfully" })
      loadPayrollRuns()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to finalize payroll run",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (payrollId: number) => {
    if (!confirm("Are you sure you want to delete this payroll run?")) return

    try {
      await deletePayrollRun(payrollId)
      toast({ title: "Success", description: "Payroll run deleted successfully" })
      loadPayrollRuns()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payroll run",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll Runs</h1>
          <p className="text-muted-foreground">Manage and process employee payroll</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Initiate Payroll
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Initiate New Payroll Run</DialogTitle>
              <DialogDescription>Select the date range for the new payroll period</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInitiatePayroll}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="from_date">From Date</Label>
                  <Input
                    id="from_date"
                    type="date"
                    value={formData.from_date}
                    onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to_date">To Date</Label>
                  <Input
                    id="to_date"
                    type="date"
                    value={formData.to_date}
                    onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? "Processing..." : "Initiate Payroll"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>All payroll runs and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-medium">
                    {new Date(run.from_date).toLocaleDateString()} - {new Date(run.to_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{run.total_employees}</TableCell>
                  <TableCell>{formatCurrency(run.total_amount)}</TableCell>
                  <TableCell>{getStatusBadge(run.status)}</TableCell>
                  <TableCell>{new Date(run.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/payroll/runs/${run.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {run.status === "draft" && (
                        <Button variant="outline" size="sm" onClick={() => handleFinalize(run.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {run.status !== "paid" && (
                        <Button variant="outline" size="sm" onClick={() => handleDelete(run.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
