"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, DollarSign } from "lucide-react";
import { getLoanTypes, createLoanType, updateLoanType, type LoanType } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function LoanTypesPage() {
    const { toast } = useToast();
    const [loanTypes, setLoanTypes] = React.useState<LoanType[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingType, setEditingType] = React.useState<LoanType | null>(null);
    const [formData, setFormData] = React.useState<Partial<LoanType>>({});

    const fetchLoanTypes = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getLoanTypes();
            setLoanTypes(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load loan types.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchLoanTypes();
    }, [fetchLoanTypes]);

    const handleOpenDialog = (type: LoanType | null = null) => {
        setEditingType(type);
        setFormData(type || { is_advance: false, interest_rate: 0, max_tenure_months: 12, eligibility_percentage: 50 });
        setIsDialogOpen(true);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingType) {
                await updateLoanType(editingType.id, formData);
                toast({ title: "Success", description: "Loan type updated." });
            } else {
                await createLoanType(formData);
                toast({ title: "Success", description: "Loan type created." });
            }
            fetchLoanTypes();
            setIsDialogOpen(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to save: ${error.message}`, variant: "destructive" });
        }
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <DollarSign className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">Loan & Advance Types</h1>
                            <p className="text-muted-foreground">Configure the financial products available to employees.</p>
                        </div>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Type
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Loan Products</CardTitle>
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
                                {loanTypes.map(type => (
                                    <TableRow key={type.id}>
                                        <TableCell>{type.name}</TableCell>
                                        <TableCell>{type.is_advance ? 'Salary Advance' : 'Loan'}</TableCell>
                                        <TableCell>{type.interest_rate}%</TableCell>
                                        <TableCell>{type.max_tenure_months} months</TableCell>
                                        <TableCell>{type.eligibility_percentage}%</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(type)}><Edit className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingType ? 'Edit' : 'Create'} Loan Type</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/></div>
                        <div className="flex items-center gap-2"><Switch id="is_advance" checked={formData.is_advance} onCheckedChange={c => setFormData({...formData, is_advance: c})}/><Label htmlFor="is_advance">Is Salary Advance?</Label></div>
                        <div className="grid gap-2"><Label htmlFor="interest_rate">Interest Rate (%)</Label><Input id="interest_rate" type="number" value={formData.interest_rate} onChange={e => setFormData({...formData, interest_rate: Number(e.target.value)})} /></div>
                        <div className="grid gap-2"><Label htmlFor="max_tenure_months">Max Tenure (Months)</Label><Input id="max_tenure_months" type="number" value={formData.max_tenure_months} onChange={e => setFormData({...formData, max_tenure_months: Number(e.target.value)})}/></div>
                        <div className="grid gap-2"><Label htmlFor="eligibility_percentage">Eligibility (% of Base Salary)</Label><Input id="eligibility_percentage" type="number" value={formData.eligibility_percentage} onChange={e => setFormData({...formData, eligibility_percentage: Number(e.target.value)})}/></div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MainLayout>
    )
}