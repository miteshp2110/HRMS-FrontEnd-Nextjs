"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Search, Filter, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getLoanRequests, approveLoan, type LoanApproval } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function LoanManagementPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [loans, setLoans] = useState<LoanApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<LoanApproval | null>(null)
  const [disbursementDate, setDisbursementDate] = useState("")

  const canManageLoans = hasPermission("loans.manage")

  const fetchLoans = async () => {
    if (!canManageLoans) {
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      const data = await getLoanRequests() // Fetches all loans
      setLoans(data)
    } catch (error) {
      toast({ title: "Error", description: "Could not fetch loan requests.", variant: "destructive" });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLoans()
  }, [canManageLoans])


  const handleApproveClick = (loan: LoanApproval) => {
    setSelectedLoan(loan);
    setDisbursementDate("");
    setDialogOpen(true);
  }

  const handleReject = async (loanId: number) => {
    try {
        await approveLoan(loanId, "rejected");
        toast({ title: "Success", description: "Loan request has been rejected." });
        fetchLoans();
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to reject loan: ${error.message}`, variant: "destructive" });
    }
  }

  const handleConfirmApproval = async () => {
    if (!selectedLoan || !disbursementDate) {
        toast({ title: "Error", description: "Please select a disbursement date.", variant: "destructive" });
        return;
    }
    try {
        await approveLoan(selectedLoan.id, "approved", disbursementDate);
        toast({ title: "Success", description: "Loan request has been approved." });
        setDialogOpen(false);
        setSelectedLoan(null);
        fetchLoans();
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to approve loan: ${error.message}`, variant: "destructive" });
    }
  }


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "disbursed":
        return <Badge className="bg-blue-100 text-blue-800">Disbursed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.loan_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!canManageLoans) {
     return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <DollarSign className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Loan Management</h1>
            </div>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                You don't have permission to manage loans.
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <DollarSign className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Loan Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Requests</CardTitle>
          <CardDescription>Review and process employee loan and salary advance requests.</CardDescription>
          <div className="flex gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee or loan type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="disbursed">Disbursed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading loan requests...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Repayment</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <Link href={`/directory/${loan.employee_id}`} className="font-medium text-primary hover:underline">
                        {loan.employee_name}
                      </Link>
                    </TableCell>
                    <TableCell>{loan.loan_type}</TableCell>
                    <TableCell>${loan.amount.toLocaleString()}</TableCell>
                    <TableCell>{loan.repayment_months} months</TableCell>
                    <TableCell>{new Date(loan.applied_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell className="text-right">
                      {loan.status === "pending" && (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50" onClick={() => handleApproveClick(loan)}>
                            <CheckCircle className="h-4 w-4 mr-2"/>Approve
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50" onClick={() => handleReject(loan.id)}>
                            <XCircle className="h-4 w-4 mr-2"/>Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Approve Loan Request</DialogTitle>
                <DialogDescription>
                    Please set the disbursement date for this loan. This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="disbursement_date">Disbursement Date</Label>
                <Input id="disbursement_date" type="date" value={disbursementDate} onChange={(e) => setDisbursementDate(e.target.value)}/>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmApproval}>Confirm Approval</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}