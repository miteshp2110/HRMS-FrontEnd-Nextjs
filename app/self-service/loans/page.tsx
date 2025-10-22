
// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { DollarSign, Plus, Eye, AlertCircle } from "lucide-react";
// import { getLoanEligibility, applyForLoan, getLoanApplications, type LoanEligibility, type LoanApplication, getLoanApplicationsByEmployee } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { LoanDetailsDialog } from "@/components/self-service/loan-details-dialog"; // Updated Import
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useAuth } from "@/lib/auth-context";

// export default function MyLoansPage() {
//     const { toast } = useToast();
//     const {user} = useAuth()
//     const [eligibility, setEligibility] = React.useState<LoanEligibility | null>(null);
//     const [applications, setApplications] = React.useState<LoanApplication[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isApplyOpen, setIsApplyOpen] = React.useState(false);
//     const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
//     const [selectedApplicationId, setSelectedApplicationId] = React.useState<number | null>(null);
//     const [selectedLoanType, setSelectedLoanType] = React.useState<LoanEligibility['eligible_products'][0] | null>(null);

//     const [formData, setFormData] = React.useState({
//         loan_type_id: '',
//         requested_amount: '',
//         tenure_months: '',
//         purpose: ''
//     });

//     const [formErrors, setFormErrors] = React.useState({
//         requested_amount: '',
//         tenure_months: ''
//     });

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const hr_user = JSON.parse(localStorage.getItem('hr_user')!)
            
//             const [eligibilityData, applicationsData] = await Promise.all([
//                 getLoanEligibility(),
//                 getLoanApplicationsByEmployee(hr_user.id)
                
//             ]);
//             setEligibility(eligibilityData);
//             setApplications(applicationsData);
//         } catch (error: any) {
//             toast({ title: "Error", description: `Could not load loan data: ${error.message}`, variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const handleLoanTypeChange = (loanTypeId: string) => {
//         const selectedType = eligibility?.eligible_products.find(p => String(p.loan_type_id) === loanTypeId) || null;
//         setSelectedLoanType(selectedType);
//         setFormData(prev => ({ ...prev, loan_type_id: loanTypeId, requested_amount: '', tenure_months: '' }));
//         setFormErrors({ requested_amount: '', tenure_months: '' });
//     };

//     const validateField = (name: string, value: string) => {
//         if (!selectedLoanType) return;

//         let error = '';
//         if (name === 'requested_amount' && Number(value) > selectedLoanType.max_eligible_amount) {
//             error = `Amount cannot exceed the eligible limit of $${selectedLoanType.max_eligible_amount.toLocaleString()}.`;
//         }
//         if (name === 'tenure_months' && Number(value) > selectedLoanType.max_tenure_months) {
//             error = `Tenure cannot exceed the maximum of ${selectedLoanType.max_tenure_months} months.`;
//         }

//         setFormErrors(prev => ({ ...prev, [name]: error }));
//     };


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (formErrors.requested_amount || formErrors.tenure_months) {
//             toast({ title: "Validation Error", description: "Please fix the errors before submitting.", variant: "destructive"});
//             return;
//         }

//         try {
//             await applyForLoan({
//                 loan_type_id: Number(formData.loan_type_id),
//                 requested_amount: Number(formData.requested_amount),
//                 tenure_months: Number(formData.tenure_months),
//                 purpose: formData.purpose
//             });
//             toast({ title: "Success", description: "Your application has been submitted." });
//             setIsApplyOpen(false);
//             fetchData();
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to apply: ${error.message}`, variant: "destructive" });
//         }
//     }

//     const getStatusBadge = (status: string) => {
//         const statusMap: Record<string, string> = {
//             'Pending Manager Approval': 'bg-yellow-100 text-yellow-800',
//             'Pending HR Approval': 'bg-orange-100 text-orange-800',
//             'Approved': 'bg-blue-100 text-blue-800',
//             'Rejected': 'bg-red-100 text-red-800',
//             'Disbursed': 'bg-green-100 text-green-800',
//             'Closed': 'bg-gray-100 text-gray-800'
//         };
//         return <Badge className={statusMap[status] || ""}>{status}</Badge>;
//     }

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <DollarSign className="h-8 w-8" />
//                         <div>
//                             <h1 className="text-3xl font-bold">My Loans & Advances</h1>
//                             <p className="text-muted-foreground">Check your eligibility and manage your applications.</p>
//                         </div>
//                     </div>
//                     <Button onClick={() => setIsApplyOpen(true)}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         Apply Now
//                     </Button>
//                 </div>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>My Applications</CardTitle>
//                         <CardDescription>A history of your loan and advance applications.</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>ID</TableHead>
//                                     <TableHead>Type</TableHead>
//                                     <TableHead>Amount</TableHead>
//                                     <TableHead>Status</TableHead>
//                                     <TableHead className="text-right">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {isLoading ? (
//                                     <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
//                                 ) : applications.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
//                                             No loan records found.
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     applications.map(app => (
//                                         <TableRow key={app.id}>
//                                             <TableCell>{app.application_id_text}</TableCell>
//                                             <TableCell><Badge variant={app.is_advance ? "secondary" : "default"}>{app.loan_type_name}</Badge></TableCell>
//                                             <TableCell>${app.requested_amount.toLocaleString()}</TableCell>
//                                             <TableCell>{getStatusBadge(app.status)}</TableCell>
//                                             <TableCell className="text-right">
//                                                 <Button variant="ghost" size="sm" onClick={() => { setSelectedApplicationId(app.id); setIsDetailsOpen(true); }}><Eye className="h-4 w-4 mr-2"/>View</Button>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>

//             <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Apply for Loan or Advance</DialogTitle>
//                         <DialogDescription>Select a product to view eligibility and fill out the form.</DialogDescription>
//                     </DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4 py-4">
//                         <div className="grid gap-2">
//                             <Label htmlFor="loan_type_id">Product</Label>
//                             <Select name="loan_type_id" onValueChange={handleLoanTypeChange}>
//                                 <SelectTrigger><SelectValue placeholder="Select a product"/></SelectTrigger>
//                                 <SelectContent>
//                                     {eligibility?.eligible_products.map(p => <SelectItem key={p.loan_type_id} value={String(p.loan_type_id)}>{p.name}</SelectItem>)}
//                                 </SelectContent>
//                             </Select>
//                         </div>
                        
//                         {selectedLoanType && (
//                             <Alert>
//                                 <AlertCircle className="h-4 w-4" />
//                                 <AlertDescription>
//                                     You are eligible for a maximum amount of <strong>${selectedLoanType.max_eligible_amount.toLocaleString()}</strong> for a tenure up to <strong>{selectedLoanType.max_tenure_months} months</strong>.
//                                 </AlertDescription>
//                             </Alert>
//                         )}

//                         <div className="grid gap-2">
//                             <Label htmlFor="requested_amount">Amount</Label>
//                             <Input 
//                                 id="requested_amount" 
//                                 type="number" 
//                                 value={formData.requested_amount}
//                                 onChange={e => {
//                                     setFormData({...formData, requested_amount: e.target.value});
//                                     validateField('requested_amount', e.target.value);
//                                 }}
//                                 disabled={!selectedLoanType}
//                             />
//                             {formErrors.requested_amount && <p className="text-sm text-red-500">{formErrors.requested_amount}</p>}
//                         </div>
//                         <div className="grid gap-2">
//                             <Label htmlFor="tenure_months">Tenure (Months)</Label>
//                             <Input 
//                                 id="tenure_months" 
//                                 type="number" 
//                                 value={formData.tenure_months}
//                                 onChange={e => {
//                                     setFormData({...formData, tenure_months: e.target.value});
//                                     validateField('tenure_months', e.target.value);
//                                 }}
//                                 disabled={!selectedLoanType}
//                             />
//                              {formErrors.tenure_months && <p className="text-sm text-red-500">{formErrors.tenure_months}</p>}
//                         </div>
//                         <div className="grid gap-2">
//                             <Label htmlFor="purpose">Purpose</Label>
//                             <Textarea 
//                                 id="purpose" 
//                                 value={formData.purpose}
//                                 onChange={e => setFormData({...formData, purpose: e.target.value})} 
//                                 disabled={!selectedLoanType}
//                             />
//                         </div>
//                         <DialogFooter>
//                             <Button type="button" variant="outline" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
//                             <Button type="submit" disabled={!selectedLoanType || !!formErrors.requested_amount || !!formErrors.tenure_months}>Submit</Button>
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>

//             <LoanDetailsDialog 
//                 applicationId={selectedApplicationId} 
//                 open={isDetailsOpen} 
//                 onOpenChange={setIsDetailsOpen}
//             />
//         </MainLayout>
//     )
// }

"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign, 
  Plus, 
  Eye, 
  AlertCircle, 
  Loader2, 
  Wallet,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { 
  getLoanEligibility, 
  applyForLoan, 
  getLoanApplicationsByEmployee, 
  type LoanEligibility, 
  type LoanApplication 
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { LoanDetailsDialog } from "@/components/self-service/loan-details-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

// Format number as AED currency
const formatAED = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount)
}

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-28" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function MyLoansPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [eligibility, setEligibility] = React.useState<LoanEligibility | null>(null)
  const [applications, setApplications] = React.useState<LoanApplication[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isApplyOpen, setIsApplyOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedApplicationId, setSelectedApplicationId] = React.useState<number | null>(null)
  const [selectedLoanType, setSelectedLoanType] = React.useState<LoanEligibility['eligible_products'][0] | null>(null)

  const [formData, setFormData] = React.useState({
    loan_type_id: '',
    requested_amount: '',
    tenure_months: '',
    purpose: ''
  })

  const [formErrors, setFormErrors] = React.useState({
    requested_amount: '',
    tenure_months: ''
  })

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const hr_user = JSON.parse(localStorage.getItem('hr_user')!)
      
      const [eligibilityData, applicationsData] = await Promise.all([
        getLoanEligibility(),
        getLoanApplicationsByEmployee(hr_user.id)
      ])
      setEligibility(eligibilityData)
      setApplications(applicationsData)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Could not load loan data: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleLoanTypeChange = (loanTypeId: string) => {
    const selectedType = eligibility?.eligible_products.find(p => String(p.loan_type_id) === loanTypeId) || null
    setSelectedLoanType(selectedType)
    setFormData(prev => ({ ...prev, loan_type_id: loanTypeId, requested_amount: '', tenure_months: '' }))
    setFormErrors({ requested_amount: '', tenure_months: '' })
  }

  const validateField = (name: string, value: string) => {
    if (!selectedLoanType) return

    let error = ''
    if (name === 'requested_amount' && Number(value) > selectedLoanType.max_eligible_amount) {
      error = `Amount cannot exceed the eligible limit of ${formatAED(selectedLoanType.max_eligible_amount)}.`
    }
    if (name === 'tenure_months' && Number(value) > selectedLoanType.max_tenure_months) {
      error = `Tenure cannot exceed the maximum of ${selectedLoanType.max_tenure_months} months.`
    }

    setFormErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formErrors.requested_amount || formErrors.tenure_months) {
      toast({ 
        title: "Validation Error", 
        description: "Please fix the errors before submitting.", 
        variant: "destructive"
      })
      return
    }

    if (!formData.purpose.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Please provide a purpose for the loan.", 
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await applyForLoan({
        loan_type_id: Number(formData.loan_type_id),
        requested_amount: Number(formData.requested_amount),
        tenure_months: Number(formData.tenure_months),
        purpose: formData.purpose
      })
      toast({ 
        title: "Success", 
        description: "Your loan application has been submitted successfully." 
      })
      setIsApplyOpen(false)
      setFormData({ loan_type_id: '', requested_amount: '', tenure_months: '', purpose: '' })
      setSelectedLoanType(null)
      fetchData()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Failed to apply: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Pending Manager Approval': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Pending HR Approval': { className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100', icon: Clock },
      'Approved': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
      'Disbursed': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Closed': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100', icon: CheckCircle }
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: Clock }
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  // Calculate form progress
  const formProgress = React.useMemo(() => {
    if (!selectedLoanType) return 0
    let filled = 1 // loan type is selected
    if (formData.requested_amount && !formErrors.requested_amount) filled++
    if (formData.tenure_months && !formErrors.tenure_months) filled++
    if (formData.purpose.trim()) filled++
    return (filled / 4) * 100
  }, [selectedLoanType, formData, formErrors])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent>
              <TableSkeleton />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Loans & Advances</h1>
              <p className="text-muted-foreground">Check your eligibility and manage your applications</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsApplyOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {applications.filter(a => a.status === 'Disbursed').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {applications.filter(a => a.status.includes('Pending')).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
            <CardDescription>A history of your loan and advance applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-muted rounded-full">
                    <Wallet className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Loan Applications</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't submitted any loan applications yet
                </p>
                <Button 
                  onClick={() => setIsApplyOpen(true)} 
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Apply for a Loan
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map(app => (
                      <TableRow key={app.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-medium">
                          {app.application_id_text}
                        </TableCell>
                        <TableCell>
                          <Badge variant={app.is_advance ? "secondary" : "default"}>
                            {app.loan_type_name}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono font-medium text-green-600">
                          {formatAED(app.requested_amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => { 
                              setSelectedApplicationId(app.id)
                              setIsDetailsOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Apply Dialog */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="sm:max-w-2xl h-[80vh] overflow-x-scroll">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Apply for Loan or Advance
            </DialogTitle>
            <DialogDescription>
              Select a loan product, verify your eligibility, and submit your application
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Progress Indicator */}
            {selectedLoanType && (
              <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200 dark:from-slate-900 dark:to-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Application Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Form completion</span>
                      <span className="font-medium">{Math.round(formProgress)}%</span>
                    </div>
                    <Progress value={formProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="loan_type_id" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Select Loan Product *
              </Label>
              <Select 
                name="loan_type_id" 
                onValueChange={handleLoanTypeChange}
                value={formData.loan_type_id}
                disabled={isSubmitting}
              >
                <SelectTrigger id="loan_type_id">
                  <SelectValue placeholder="Choose a loan or advance product..." />
                </SelectTrigger>
                <SelectContent>
                  {eligibility?.eligible_products.map(p => (
                    <SelectItem key={p.loan_type_id} value={String(p.loan_type_id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Eligibility Alert */}
            {selectedLoanType && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900 dark:text-blue-100">Your Eligibility</AlertTitle>
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Maximum amount: <strong>{formatAED(selectedLoanType.max_eligible_amount)}</strong>
                  {" · "}
                  Maximum tenure: <strong>{selectedLoanType.max_tenure_months} months</strong>
                </AlertDescription>
              </Alert>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="requested_amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Requested Amount (AED) *
              </Label>
              <Input 
                id="requested_amount" 
                type="number" 
                step="0.01"
                value={formData.requested_amount}
                onChange={e => {
                  setFormData({...formData, requested_amount: e.target.value})
                  validateField('requested_amount', e.target.value)
                }}
                disabled={!selectedLoanType || isSubmitting}
                placeholder="Enter amount in AED"
              />
              {formErrors.requested_amount && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.requested_amount}
                </p>
              )}
            </div>

            {/* Tenure Input */}
            <div className="space-y-2">
              <Label htmlFor="tenure_months" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Repayment Tenure (Months) *
              </Label>
              <Input 
                id="tenure_months" 
                type="number" 
                value={formData.tenure_months}
                onChange={e => {
                  setFormData({...formData, tenure_months: e.target.value})
                  validateField('tenure_months', e.target.value)
                }}
                disabled={!selectedLoanType || isSubmitting}
                placeholder="Enter number of months"
              />
              {formErrors.tenure_months && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.tenure_months}
                </p>
              )}
            </div>

            {/* Purpose Input */}
            <div className="space-y-2">
              <Label htmlFor="purpose" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Purpose *
              </Label>
              <Textarea 
                id="purpose" 
                value={formData.purpose}
                onChange={e => setFormData({...formData, purpose: e.target.value})} 
                disabled={!selectedLoanType || isSubmitting}
                placeholder="Please describe the purpose of this loan..."
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsApplyOpen(false)
                  setFormData({ loan_type_id: '', requested_amount: '', tenure_months: '', purpose: '' })
                  setSelectedLoanType(null)
                  setFormErrors({ requested_amount: '', tenure_months: '' })
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!selectedLoanType || !!formErrors.requested_amount || !!formErrors.tenure_months || isSubmitting}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <LoanDetailsDialog 
        applicationId={selectedApplicationId} 
        open={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen}
      />
    </MainLayout>
  )
}
