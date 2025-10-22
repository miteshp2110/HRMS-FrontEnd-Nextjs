

// "use client";

// import * as React from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Plus, Edit, Clock } from "lucide-react";
// import { getLoanTypes, createLoanType, updateLoanType, type LoanType } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";

// export function LoanTypesPage() {
//     const { toast } = useToast();
//     const [loanTypes, setLoanTypes] = React.useState<LoanType[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isDialogOpen, setIsDialogOpen] = React.useState(false);
//     const [editingType, setEditingType] = React.useState<LoanType | null>(null);
//     const [formData, setFormData] = React.useState<Partial<LoanType>>({
//         name: '',
//         is_advance: false,
//         interest_rate: 0,
//         max_tenure_months: 12,
//         eligibility_percentage: 50
//     });
//     const [isSubmitting, setIsSubmitting] = React.useState(false);

//     React.useEffect(() => {
//         if (formData.is_advance) {
//             setFormData(prev => ({
//                 ...prev,
//                 interest_rate: 0,
//                 max_tenure_months: 1,
//             }));
//         }
//     }, [formData.is_advance]);

//     const fetchLoanTypes = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const data = await getLoanTypes();
//             setLoanTypes(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load loan types.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => {
//         fetchLoanTypes();
//     }, [fetchLoanTypes]);

//     const handleOpenDialog = (type: LoanType | null = null) => {
//         setEditingType(type);
//         setFormData(type || {
//             name: '',
//             is_advance: false,
//             interest_rate: 0,
//             max_tenure_months: 12,
//             eligibility_percentage: 50
//         });
//         setIsDialogOpen(true);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         try {
//             if (editingType) {
//                 await updateLoanType(editingType.id, formData);
//                 toast({ title: "Success", description: "Loan type updated." });
//             } else {
//                 await createLoanType(formData);
//                 toast({ title: "Success", description: "Loan type created." });
//             }
//             fetchLoanTypes();
//             setIsDialogOpen(false);
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to save: ${error.message}`, variant: "destructive" });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <Card>
//             <CardHeader>
//                 <div className="flex justify-between items-center">
//                     <div>
//                         <CardTitle>Loan & Advance Types</CardTitle>
//                         <CardDescription>Configure the financial products available to employees.</CardDescription>
//                     </div>
//                     <Button onClick={() => handleOpenDialog()}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         Create Type
//                     </Button>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Name</TableHead>
//                             <TableHead>Type</TableHead>
//                             <TableHead>Interest Rate</TableHead>
//                             <TableHead>Max Tenure</TableHead>
//                             <TableHead>Eligibility %</TableHead>
//                             <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {isLoading ? (
//                             Array.from({ length: 4 }).map((_, idx) => (
//                                 <TableRow key={idx}>
//                                     <TableCell><Skeleton className="h-4 w-32" /></TableCell>
//                                     <TableCell><Skeleton className="h-4 w-24" /></TableCell>
//                                     <TableCell><Skeleton className="h-4 w-16" /></TableCell>
//                                     <TableCell><Skeleton className="h-4 w-16" /></TableCell>
//                                     <TableCell><Skeleton className="h-4 w-16" /></TableCell>
//                                     <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
//                                 </TableRow>
//                             ))
//                         ) : loanTypes.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
//                                     No loan types created yet.
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             loanTypes.map(type => (
//                                 <TableRow key={type.id}>
//                                     <TableCell className="font-medium">{type.name}</TableCell>
//                                     <TableCell>
//                                         <Badge variant={type.is_advance ? "outline" : "default"}>
//                                             {type.is_advance ? 'Salary Advance' : 'Loan'}
//                                         </Badge>
//                                     </TableCell>
//                                     <TableCell>{type.interest_rate}%</TableCell>
//                                     <TableCell>{type.max_tenure_months} months</TableCell>
//                                     <TableCell>{type.eligibility_percentage}%</TableCell>
//                                     <TableCell className="text-right">
//                                         <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(type)}>
//                                             <Edit className="h-4 w-4" />
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         )}
//                     </TableBody>
//                 </Table>
//             </CardContent>

//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent className="max-w-md">
//                     <DialogHeader>
//                         <DialogTitle>{editingType ? 'Edit' : 'Create'} Loan Type</DialogTitle>
//                     </DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4 py-4">
//                         <div className="grid gap-2">
//                             <Label htmlFor="name">Name *</Label>
//                             <Input id="name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
//                         </div>
//                         <div className="flex items-center space-x-2">
//                             <Switch id="is_advance" checked={formData.is_advance} onCheckedChange={c => setFormData({ ...formData, is_advance: c })} />
//                             <Label htmlFor="is_advance">Is Salary Advance?</Label>
//                         </div>
//                         <div className="grid gap-2">
//                             <Label htmlFor="interest_rate">Interest Rate (%) *</Label>
//                             <Input
//                                 id="interest_rate"
//                                 type="number"
//                                 value={formData.interest_rate ?? 0}
//                                 onChange={e => setFormData({ ...formData, interest_rate: Number(e.target.value) })}
//                                 disabled={formData.is_advance}
//                                 required
//                             />
//                         </div>
//                         <div className="grid gap-2">
//                             <Label htmlFor="max_tenure_months">Max Tenure (Months) *</Label>
//                             <Input
//                                 id="max_tenure_months"
//                                 type="number"
//                                 value={formData.max_tenure_months ?? 0}
//                                 onChange={e => setFormData({ ...formData, max_tenure_months: Number(e.target.value) })}
//                                 disabled={formData.is_advance}
//                                 required
//                             />
//                         </div>
//                         <div className="grid gap-2">
//                             <Label htmlFor="eligibility_percentage">Eligibility (% of Base Salary) *</Label>
//                             <Input
//                                 id="eligibility_percentage"
//                                 type="number"
//                                 value={formData.eligibility_percentage ?? 0}
//                                 onChange={e => setFormData({ ...formData, eligibility_percentage: Number(e.target.value) })}
//                                 required
//                             />
//                         </div>
//                         <DialogFooter>
//                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
//                                 Cancel
//                             </Button>
//                             <Button type="submit" disabled={isSubmitting}>
//                                 {isSubmitting && <Clock className="h-4 w-4 animate-spin mr-2" />}
//                                 Save
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </Card>
//     );
// }


"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit, Loader2, Info, Calculator, TrendingUp, Calendar } from "lucide-react"
import { getLoanTypes, createLoanType, updateLoanType, type LoanType } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function LoanTypesPage() {
    const { toast } = useToast()
    const [loanTypes, setLoanTypes] = React.useState<LoanType[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingType, setEditingType] = React.useState<LoanType | null>(null)
    const [formData, setFormData] = React.useState<Partial<LoanType>>({
        name: '',
        is_advance: false,
        interest_rate: 0,
        max_tenure_months: 12,
        eligibility_percentage: 50
    })
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    React.useEffect(() => {
        if (formData.is_advance) {
            setFormData(prev => ({
                ...prev,
                interest_rate: 0,
                max_tenure_months: 1,
            }))
        }
    }, [formData.is_advance])

    const fetchLoanTypes = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await getLoanTypes()
            setLoanTypes(data)
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load loan types.", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }, [toast])

    React.useEffect(() => {
        fetchLoanTypes()
    }, [fetchLoanTypes])

    const handleOpenDialog = (type: LoanType | null = null) => {
        setEditingType(type)
        setFormData(type || {
            name: '',
            is_advance: false,
            interest_rate: 0,
            max_tenure_months: 12,
            eligibility_percentage: 50
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (editingType) {
                await updateLoanType(editingType.id, formData)
                toast({ title: "Success", description: "Loan type updated successfully." })
            } else {
                await createLoanType(formData)
                toast({ title: "Success", description: "Loan type created successfully." })
            }
            fetchLoanTypes()
            setIsDialogOpen(false)
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to save: ${error.message}`, variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Loan & Advance Types</CardTitle>
                        <CardDescription>Configure the financial products available to employees</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Type
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Interest Rate</TableHead>
                            <TableHead>Max Tenure</TableHead>
                            <TableHead>Eligibility %</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, idx) => (
                                <TableRow key={idx}>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : loanTypes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No loan types created yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            loanTypes.map(type => (
                                <TableRow key={type.id}>
                                    <TableCell className="font-medium">{type.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={type.is_advance ? "outline" : "default"}>
                                            {type.is_advance ? 'Salary Advance' : 'Loan'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{type.interest_rate}%</TableCell>
                                    <TableCell>{type.max_tenure_months} months</TableCell>
                                    <TableCell>{type.eligibility_percentage}%</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(type)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {editingType ? 'Edit' : 'Create'} Loan Type
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input 
                                    id="name" 
                                    value={formData.name || ''} 
                                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                    placeholder="e.g., Personal Loan, Emergency Loan"
                                    required 
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="space-y-0.5">
                                    <Label htmlFor="is_advance" className="text-base font-semibold cursor-pointer">
                                        Is Salary Advance?
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Short-term cash flow with next payroll deduction
                                    </p>
                                </div>
                                <Switch 
                                    id="is_advance" 
                                    checked={formData.is_advance} 
                                    onCheckedChange={c => setFormData({ ...formData, is_advance: c })} 
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="interest_rate">Interest Rate (%) *</Label>
                                    <Input
                                        id="interest_rate"
                                        type="number"
                                        step="0.01"
                                        value={formData.interest_rate ?? 0}
                                        onChange={e => setFormData({ ...formData, interest_rate: Number(e.target.value) })}
                                        disabled={formData.is_advance}
                                        required
                                    />
                                    {formData.is_advance && (
                                        <p className="text-xs text-muted-foreground">
                                            Salary advances have 0% interest
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="max_tenure_months">Max Tenure (Months) *</Label>
                                    <Input
                                        id="max_tenure_months"
                                        type="number"
                                        value={formData.max_tenure_months ?? 0}
                                        onChange={e => setFormData({ ...formData, max_tenure_months: Number(e.target.value) })}
                                        disabled={formData.is_advance}
                                        required
                                    />
                                    {formData.is_advance && (
                                        <p className="text-xs text-muted-foreground">
                                            Advances are deducted in next payroll
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="eligibility_percentage">
                                    Eligibility Percentage *
                                </Label>
                                <Input
                                    id="eligibility_percentage"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={formData.eligibility_percentage ?? 0}
                                    onChange={e => setFormData({ ...formData, eligibility_percentage: Number(e.target.value) })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    {formData.is_advance 
                                        ? "Percentage of earned salary available as advance" 
                                        : "Percentage of (Leave Liability + Gratuity Accrued) available as loan"}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Formula Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">Calculation Formula</h3>
                            </div>

                            {formData.is_advance ? (
                                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                    <AlertTitle className="text-blue-900 dark:text-blue-100">
                                        Salary Advance Calculation
                                    </AlertTitle>
                                    <AlertDescription className="text-blue-800 dark:text-blue-200 space-y-3 mt-2">
                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold">Step 1: Calculate Days Worked</div>
                                            <div className="font-mono text-xs bg-blue-100 dark:bg-blue-900 p-2 rounded">
                                                Days Worked = Current Date - Last Payroll Date
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold">Step 2: Calculate Earned Salary</div>
                                            <div className="font-mono text-xs bg-blue-100 dark:bg-blue-900 p-2 rounded">
                                                Earned Salary = (Monthly Gross Salary ÷ Total Days in Month) × Days Worked
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold">Step 3: Calculate Eligible Advance Amount</div>
                                            <div className="font-mono text-xs bg-blue-100 dark:bg-blue-900 p-2 rounded">
                                                Eligible Amount = Earned Salary × {formData.eligibility_percentage}%
                                            </div>
                                        </div>

                                        <ul className="text-sm space-y-1 mt-3 border-t border-blue-200 dark:border-blue-800 pt-3">
                                            <li>• <strong>Interest Rate:</strong> 0% (No interest charged)</li>
                                            <li>• <strong>Repayment:</strong> Full deduction in next payroll cycle</li>
                                            <li>• <strong>Example:</strong> If monthly salary is AED 10,000, 15 days worked, and {formData.eligibility_percentage}% eligible:</li>
                                            <li className="ml-4 font-mono text-xs">
                                                → (10,000 ÷ 30) × 15 × {formData.eligibility_percentage}% = AED {((10000 / 30) * 15 * (formData.eligibility_percentage ?? 0) / 100).toFixed(2)}
                                            </li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                                    <Calculator className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-900 dark:text-green-100">
                                        Loan Eligibility Calculation
                                    </AlertTitle>
                                    <AlertDescription className="text-green-800 dark:text-green-200 space-y-3 mt-2">
                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold">Step 1: Leave Encashment Liability</div>
                                            <div className="font-mono text-xs bg-green-100 dark:bg-green-900 p-2 rounded">
                                                Leave Liability = Unused Leave Days × Daily Gross Salary
                                            </div>
                                            <div className="text-xs text-green-700 dark:text-green-300 ml-2">
                                                Daily Gross = Monthly Gross Salary ÷ 30
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold">Step 2: Gratuity Accrued</div>
                                            <div className="font-mono text-xs bg-green-100 dark:bg-green-900 p-2 rounded">
                                                Gratuity = (Last Basic Salary × 15 ÷ 26) × Years of Service
                                            </div>
                                            <div className="text-xs text-green-700 dark:text-green-300 ml-2">
                                                Based on UAE Labor Law calculation
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold">Step 3: Eligible Loan Amount</div>
                                            <div className="font-mono text-xs bg-green-100 dark:bg-green-900 p-2 rounded">
                                                Eligible Amount = (Leave Liability + Gratuity) × {formData.eligibility_percentage}%
                                            </div>
                                        </div>

                                        <ul className="text-sm space-y-1 mt-3 border-t border-green-200 dark:border-green-800 pt-3">
                                            <li>• <strong>Interest Rate:</strong> {formData.interest_rate}% per annum</li>
                                            <li>• <strong>Max Tenure:</strong> {formData.max_tenure_months} months</li>
                                            <li>• <strong>Repayment:</strong> Equal monthly installments (EMI)</li>
                                            <li>• <strong>Example:</strong> If leave liability is AED 5,000 and gratuity is AED 15,000:</li>
                                            <li className="ml-4 font-mono text-xs">
                                                → (5,000 + 15,000) × {formData.eligibility_percentage}% = AED {((20000 * (formData.eligibility_percentage ?? 0)) / 100).toFixed(2)}
                                            </li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Loan Type'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
