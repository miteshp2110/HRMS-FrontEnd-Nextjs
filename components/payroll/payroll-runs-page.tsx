"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Trash2, Eye, Play, CheckCircle, CreditCard, AlertCircle } from "lucide-react"
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
  const { hasPermission } = useAuth()

  const canManagePayroll = hasPermission("payroll.manage");

  const loadPayrollRuns = async () => {
    if(!canManagePayroll) { setLoading(false); return; }
    try {
      setLoading(true)
      const data = await getPayrollRuns()
      setPayrollRuns(data)
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to load payroll runs: ${error.message}`, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayrollRuns()
  }, [canManagePayroll])

  const handleInitiatePayroll = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    try {
      const result = await initiatePayrollRun(formData);
      toast({ title: "Success", description: "Payroll run initiated successfully" })
      setDialogOpen(false)
      setFormData({ from_date: "", to_date: "" })
      router.push(`/payroll/runs/${result.payrollId}`);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to initiate payroll run: ${error.message}`, variant: "destructive" })
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
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to finalize payroll run: ${error.message}`, variant: "destructive" })
    }
  }

  const handleDelete = async (payrollId: number) => {
    if (!confirm("Are you sure you want to delete this payroll run?")) return
    try {
      await deletePayrollRun(payrollId)
      toast({ title: "Success", description: "Payroll run deleted successfully" })
      loadPayrollRuns()
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to delete payroll run: ${error.message}`, variant: "destructive" })
    }
  }

  const formatCurrency = (amount: string | number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount));

  const getStatusBadge = (status: PayrollRun['status']) => {
    switch (status) {
      case "processing": return <Badge variant="secondary">Processing</Badge>
      case "paid": return <Badge className="border-green-500 text-green-600 bg-green-100">Paid</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }
  
  if (!canManagePayroll) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>You don't have permission to manage payroll.</AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <CreditCard className="h-8 w-8"/>
                <div>
                    <h1 className="text-3xl font-bold">Payroll Runs</h1>
                    <p className="text-muted-foreground">Manage and process employee payroll</p>
                </div>
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
                <DialogDescription>Select the date range for the new payroll period.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInitiatePayroll} className="space-y-4 py-4">
                    <div>
                    <Label htmlFor="from_date">Pay Period Start</Label>
                    <Input id="from_date" type="date" value={formData.from_date} onChange={(e) => setFormData({ ...formData, from_date: e.target.value })} required />
                    </div>
                    <div>
                    <Label htmlFor="to_date">Pay Period End</Label>
                    <Input id="to_date" type="date" value={formData.to_date} onChange={(e) => setFormData({ ...formData, to_date: e.target.value })} required />
                    </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={processing}>{processing ? "Processing..." : "Initiate Payroll"}</Button>
                </DialogFooter>
                </form>
            </DialogContent>
            </Dialog>
        </div>
        <Card>
            <CardHeader><CardTitle>Payroll History</CardTitle><CardDescription>All payroll runs and their current status</CardDescription></CardHeader>
            <CardContent>
            {loading ? <p>Loading...</p> :
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Total Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Initiated By</TableHead>
                    <TableHead>Finalized On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {payrollRuns.map((run) => (
                    <TableRow key={run.id}>
                    <TableCell className="font-medium">{new Date(run.pay_period_start).toLocaleDateString()} - {new Date(run.pay_period_end).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(run.total_net_pay)}</TableCell>
                    <TableCell>{getStatusBadge(run.status)}</TableCell>
                    <TableCell>{run.initiated_by_name}</TableCell>
                    <TableCell>{run.finalized_at ? new Date(run.finalized_at).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/payroll/runs/${run.id}`)}><Eye className="h-4 w-4" /></Button>
                        {run.status === "processing" && (
                            <>
                            <Button variant="outline" size="sm" onClick={() => handleFinalize(run.id)} title="Finalize Run"><CheckCircle className="h-4 w-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(run.id)} title="Delete Run"><Trash2 className="h-4 w-4" /></Button>
                            </>
                        )}
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            }
            </CardContent>
        </Card>
    </div>
  )
}