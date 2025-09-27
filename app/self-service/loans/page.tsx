
"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, Eye, AlertCircle } from "lucide-react";
import { getLoanEligibility, applyForLoan, getLoanApplications, type LoanEligibility, type LoanApplication, getLoanApplicationsByEmployee } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LoanDetailsDialog } from "@/components/self-service/loan-details-dialog"; // Updated Import
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";

export default function MyLoansPage() {
    const { toast } = useToast();
    const {user} = useAuth()
    const [eligibility, setEligibility] = React.useState<LoanEligibility | null>(null);
    const [applications, setApplications] = React.useState<LoanApplication[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isApplyOpen, setIsApplyOpen] = React.useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = React.useState<number | null>(null);
    const [selectedLoanType, setSelectedLoanType] = React.useState<LoanEligibility['eligible_products'][0] | null>(null);

    const [formData, setFormData] = React.useState({
        loan_type_id: '',
        requested_amount: '',
        tenure_months: '',
        purpose: ''
    });

    const [formErrors, setFormErrors] = React.useState({
        requested_amount: '',
        tenure_months: ''
    });

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const [eligibilityData, applicationsData] = await Promise.all([
                getLoanEligibility(),
                getLoanApplicationsByEmployee(user?.id!)
            ]);
            setEligibility(eligibilityData);
            setApplications(applicationsData);
        } catch (error: any) {
            toast({ title: "Error", description: `Could not load loan data: ${error.message}`, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLoanTypeChange = (loanTypeId: string) => {
        const selectedType = eligibility?.eligible_products.find(p => String(p.loan_type_id) === loanTypeId) || null;
        setSelectedLoanType(selectedType);
        setFormData(prev => ({ ...prev, loan_type_id: loanTypeId, requested_amount: '', tenure_months: '' }));
        setFormErrors({ requested_amount: '', tenure_months: '' });
    };

    const validateField = (name: string, value: string) => {
        if (!selectedLoanType) return;

        let error = '';
        if (name === 'requested_amount' && Number(value) > selectedLoanType.max_eligible_amount) {
            error = `Amount cannot exceed the eligible limit of $${selectedLoanType.max_eligible_amount.toLocaleString()}.`;
        }
        if (name === 'tenure_months' && Number(value) > selectedLoanType.max_tenure_months) {
            error = `Tenure cannot exceed the maximum of ${selectedLoanType.max_tenure_months} months.`;
        }

        setFormErrors(prev => ({ ...prev, [name]: error }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formErrors.requested_amount || formErrors.tenure_months) {
            toast({ title: "Validation Error", description: "Please fix the errors before submitting.", variant: "destructive"});
            return;
        }

        try {
            await applyForLoan({
                loan_type_id: Number(formData.loan_type_id),
                requested_amount: Number(formData.requested_amount),
                tenure_months: Number(formData.tenure_months),
                purpose: formData.purpose
            });
            toast({ title: "Success", description: "Your application has been submitted." });
            setIsApplyOpen(false);
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to apply: ${error.message}`, variant: "destructive" });
        }
    }

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'Pending Manager Approval': 'bg-yellow-100 text-yellow-800',
            'Pending HR Approval': 'bg-orange-100 text-orange-800',
            'Approved': 'bg-blue-100 text-blue-800',
            'Rejected': 'bg-red-100 text-red-800',
            'Disbursed': 'bg-green-100 text-green-800',
            'Closed': 'bg-gray-100 text-gray-800'
        };
        return <Badge className={statusMap[status] || ""}>{status}</Badge>;
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <DollarSign className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">My Loans & Advances</h1>
                            <p className="text-muted-foreground">Check your eligibility and manage your applications.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsApplyOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Apply Now
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>My Applications</CardTitle>
                        <CardDescription>A history of your loan and advance applications.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
                                ) : applications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No loan records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    applications.map(app => (
                                        <TableRow key={app.id}>
                                            <TableCell>{app.application_id_text}</TableCell>
                                            <TableCell><Badge variant={app.is_advance ? "secondary" : "default"}>{app.loan_type_name}</Badge></TableCell>
                                            <TableCell>${app.requested_amount.toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => { setSelectedApplicationId(app.id); setIsDetailsOpen(true); }}><Eye className="h-4 w-4 mr-2"/>View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Apply for Loan or Advance</DialogTitle>
                        <DialogDescription>Select a product to view eligibility and fill out the form.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="loan_type_id">Product</Label>
                            <Select name="loan_type_id" onValueChange={handleLoanTypeChange}>
                                <SelectTrigger><SelectValue placeholder="Select a product"/></SelectTrigger>
                                <SelectContent>
                                    {eligibility?.eligible_products.map(p => <SelectItem key={p.loan_type_id} value={String(p.loan_type_id)}>{p.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {selectedLoanType && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    You are eligible for a maximum amount of <strong>${selectedLoanType.max_eligible_amount.toLocaleString()}</strong> for a tenure up to <strong>{selectedLoanType.max_tenure_months} months</strong>.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="requested_amount">Amount</Label>
                            <Input 
                                id="requested_amount" 
                                type="number" 
                                value={formData.requested_amount}
                                onChange={e => {
                                    setFormData({...formData, requested_amount: e.target.value});
                                    validateField('requested_amount', e.target.value);
                                }}
                                disabled={!selectedLoanType}
                            />
                            {formErrors.requested_amount && <p className="text-sm text-red-500">{formErrors.requested_amount}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tenure_months">Tenure (Months)</Label>
                            <Input 
                                id="tenure_months" 
                                type="number" 
                                value={formData.tenure_months}
                                onChange={e => {
                                    setFormData({...formData, tenure_months: e.target.value});
                                    validateField('tenure_months', e.target.value);
                                }}
                                disabled={!selectedLoanType}
                            />
                             {formErrors.tenure_months && <p className="text-sm text-red-500">{formErrors.tenure_months}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="purpose">Purpose</Label>
                            <Textarea 
                                id="purpose" 
                                value={formData.purpose}
                                onChange={e => setFormData({...formData, purpose: e.target.value})} 
                                disabled={!selectedLoanType}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsApplyOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={!selectedLoanType || !!formErrors.requested_amount || !!formErrors.tenure_months}>Submit</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <LoanDetailsDialog 
                applicationId={selectedApplicationId} 
                open={isDetailsOpen} 
                onOpenChange={setIsDetailsOpen}
            />
        </MainLayout>
    )
}