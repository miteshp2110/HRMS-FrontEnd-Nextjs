"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addManualAdjustment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Calculator, AlertTriangle, DollarSign } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    payslipId: number;
}

const commonAdjustments = {
    earnings: [
        { name: "Special Allowance", description: "One-time special allowance" },
        { name: "Performance Bonus", description: "Performance-based bonus" },
        { name: "Festival Bonus", description: "Festival or holiday bonus" },
        { name: "Overtime Adjustment", description: "Manual overtime adjustment" },
        { name: "Travel Allowance", description: "Travel reimbursement" },
        { name: "Mobile Allowance", description: "Mobile/communication allowance" },
        { name: "Incentive", description: "Sales or performance incentive" },
        { name: "Arrears", description: "Salary arrears payment" }
    ],
    deductions: [
        { name: "Advance Deduction", description: "Salary advance recovery" },
        { name: "Late Coming Fine", description: "Penalty for late attendance" },
        { name: "Disciplinary Deduction", description: "Disciplinary action deduction" },
        { name: "Uniform/Equipment", description: "Uniform or equipment cost" },
        { name: "Canteen Charges", description: "Canteen or meal charges" },
        { name: "Parking Charges", description: "Parking fee deduction" },
        { name: "Excess Leave", description: "Unauthorized leave deduction" },
        { name: "Recovery", description: "Recovery of overpayment" }
    ]
};

export function ManualAdjustmentDialog({ open, onOpenChange, onSuccess, payslipId }: Props) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [usePreset, setUsePreset] = React.useState(false);
    
    const [formData, setFormData] = React.useState({
        component_name: '',
        component_type: 'earning' as 'earning' | 'deduction',
        amount: '',
        reason: ''
    });

    const resetForm = () => {
        setFormData({
            component_name: '',
            component_type: 'earning',
            amount: '',
            reason: ''
        });
        setUsePreset(false);
    };

    React.useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    const handlePresetSelect = (preset: { name: string; description: string }) => {
        setFormData(prev => ({
            ...prev,
            component_name: preset.name,
            reason: preset.description
        }));
        setUsePreset(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.component_name.trim()) {
            toast({ title: "Error", description: "Component name is required", variant: "destructive" });
            return;
        }
        
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await addManualAdjustment(payslipId, {
                component_name: formData.component_name.trim(),
                component_type: formData.component_type,
                amount: parseFloat(formData.amount),
                reason: formData.reason.trim() || `Manual ${formData.component_type} adjustment`
            });

            toast({
                title: "Success",
                description: `Manual ${formData.component_type} added successfully`
            });

            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: `Failed to add adjustment: ${error.message}`,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentPresets = formData.component_type === 'earning' ? commonAdjustments.earnings : commonAdjustments.deductions;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Calculator className="w-5 h-5 mr-2" />
                        Add Manual Adjustment
                    </DialogTitle>
                    <DialogDescription>
                        Add a custom earning or deduction to this payslip. This will recalculate the totals.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Component Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card 
                            className={`cursor-pointer border-2 transition-colors ${
                                formData.component_type === 'earning' 
                                    ? 'border-green-500 bg-green-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, component_type: 'earning' }))}
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center text-green-600">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    Earning
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Add money to the payslip
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card 
                            className={`cursor-pointer border-2 transition-colors ${
                                formData.component_type === 'deduction' 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, component_type: 'deduction' }))}
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center text-red-600">
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    Deduction
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Subtract money from the payslip
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Quick Presets */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-medium">Quick Presets</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setUsePreset(!usePreset)}
                            >
                                {usePreset ? 'Hide' : 'Show'} Presets
                            </Button>
                        </div>
                        
                        {usePreset && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                                {currentPresets.map((preset, index) => (
                                    <Button
                                        key={index}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="justify-start h-auto p-2 text-left"
                                        onClick={() => handlePresetSelect(preset)}
                                    >
                                        <div>
                                            <div className="font-medium text-xs">{preset.name}</div>
                                            <div className="text-xs text-gray-500">{preset.description}</div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Component Name */}
                    <div>
                        <Label htmlFor="component_name">
                            Component Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="component_name"
                            value={formData.component_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, component_name: e.target.value }))}
                            placeholder={`Enter ${formData.component_type} name`}
                            className="mt-1"
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <Label htmlFor="amount">
                            Amount (₹) <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                placeholder="0.00"
                                className="pl-8"
                                required
                            />
                        </div>
                        {formData.amount && parseFloat(formData.amount) > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                                Amount: ₹{parseFloat(formData.amount).toLocaleString()}
                            </p>
                        )}
                    </div>

                    {/* Reason */}
                    <div>
                        <Label htmlFor="reason">Reason / Notes</Label>
                        <Textarea
                            id="reason"
                            value={formData.reason}
                            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder={`Explain why this ${formData.component_type} is being added...`}
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    {/* Preview */}
                    {formData.component_name && formData.amount && parseFloat(formData.amount) > 0 && (
                        <Card className={`${formData.component_type === 'earning' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{formData.component_name}</div>
                                        <div className="text-xs text-gray-600">{formData.reason || 'No reason provided'}</div>
                                    </div>
                                    <div className={`font-bold ${
                                        formData.component_type === 'earning' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {formData.component_type === 'earning' ? '+' : '-'}₹{parseFloat(formData.amount).toLocaleString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || !formData.component_name || !formData.amount}
                            className={formData.component_type === 'earning' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {isSubmitting ? 'Adding...' : `Add ${formData.component_type === 'earning' ? 'Earning' : 'Deduction'}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}