"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, DollarSign } from "lucide-react"
import { getMyLoans, createLoan, type LoanRecord } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function MyLoansPage() {
  const [loans, setLoans] = useState<LoanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    loan_type: "loan" as "loan" | "advance",
    title: "",
    description: "",
    principal_amount: "",
    total_installments: "",
  })

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = async () => {
    try {
      const data = await getMyLoans()
      setLoans(data)
    } catch (error) {
      console.error("Failed to load loans:", error)
      toast({
        title: "Error",
        description: "Failed to load loan records",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createLoan({
        loan_type: formData.loan_type,
        title: formData.title,
        description: formData.description,
        principal_amount: Number.parseFloat(formData.principal_amount),
        total_installments: Number.parseInt(formData.total_installments),
      })

      toast({
        title: "Success",
        description: "Loan request submitted successfully",
      })

      setIsDialogOpen(false)
      setFormData({
        loan_type: "loan",
        title: "",
        description: "",
        principal_amount: "",
        total_installments: "",
      })
      loadLoans()
    } catch (error) {
      console.error("Failed to create loan:", error)
      toast({
        title: "Error",
        description: "Failed to submit loan request",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      completed: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Loans</h1>
          <p className="text-muted-foreground">Manage your loan and advance requests</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Loan or Advance</DialogTitle>
              <DialogDescription>Submit a new loan or salary advance request</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loan_type">Type</Label>
                <Select
                  value={formData.loan_type}
                  onValueChange={(value: "loan" | "advance") => setFormData({ ...formData, loan_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loan">Loan</SelectItem>
                    <SelectItem value="advance">Salary Advance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Personal Loan, Emergency Advance"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Reason for loan/advance request"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="principal_amount">Amount</Label>
                <Input
                  id="principal_amount"
                  type="number"
                  step="0.01"
                  value={formData.principal_amount}
                  onChange={(e) => setFormData({ ...formData, principal_amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_installments">Total Installments</Label>
                <Input
                  id="total_installments"
                  type="number"
                  value={formData.total_installments}
                  onChange={(e) => setFormData({ ...formData, total_installments: e.target.value })}
                  placeholder={formData.loan_type === "advance" ? "1" : "12"}
                  required
                />
                {formData.loan_type === "advance" && (
                  <p className="text-sm text-muted-foreground">Salary advances must have exactly 1 installment</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Loan Records</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't submitted any loan or advance requests yet.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Request Your First Loan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Loan History</CardTitle>
            <CardDescription>Your loan and advance requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Installments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Disbursement Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <Badge variant={loan.loan_type === "loan" ? "default" : "secondary"}>
                        {loan.loan_type === "loan" ? "Loan" : "Advance"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{loan.title}</TableCell>
                    <TableCell>${loan.principal_amount.toLocaleString()}</TableCell>
                    <TableCell>{loan.total_installments}</TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell>{new Date(loan.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {loan.disbursement_date ? new Date(loan.disbursement_date).toLocaleDateString() : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
