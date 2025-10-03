"use client"

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Calculator, ChevronDown, ChevronRight, Eye, FileText, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPayslipForReview, type PayslipDetails } from "@/lib/api";


// Component to render formula breakdown
function FormulaBreakdown({ breakdown }: { breakdown: any }) {
    if (!breakdown || typeof breakdown !== 'object') {
        return <span className="text-gray-400 italic">No breakdown available</span>;
    }

    return (
        <div className="space-y-2 text-sm">
            <div className="font-medium text-gray-700">
                Source: <span className="text-blue-600">{breakdown.source || 'Unknown'}</span>
            </div>
            
            {breakdown.calculation_type && (
                <div>
                    <span className="font-medium">Type:</span> {breakdown.calculation_type}
                </div>
            )}

            {breakdown.raw_formula_array && (
                <div>
                    <span className="font-medium">Formula:</span>
                    <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                        {JSON.stringify(breakdown.raw_formula_array)}
                    </code>
                </div>
            )}

            {breakdown.expression && (
                <div>
                    <span className="font-medium">Expression:</span>
                    <code className="ml-2 px-2 py-1 bg-blue-50 rounded">{breakdown.expression}</code>
                </div>
            )}

            {breakdown.component_values_used && (
                <div>
                    <span className="font-medium">Components Used:</span>
                    <div className="ml-4 mt-1">
                        {Object.entries(breakdown.component_values_used).map(([key, value]: [string, any]) => (
                            <div key={key} className="text-xs">
                                {key}: ₹{Number(value).toLocaleString()}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {breakdown.rate_calculations && (
                <div>
                    <span className="font-medium">Rate Calculations:</span>
                    <div className="ml-4 mt-1 space-y-1">
                        {breakdown.rate_calculations.daily_rate && (
                            <div className="text-xs">
                                Daily Rate: ₹{Number(breakdown.rate_calculations.daily_rate).toLocaleString()}
                                {breakdown.rate_calculations.daily_rate_formula && (
                                    <span className="text-gray-500 ml-2">({breakdown.rate_calculations.daily_rate_formula})</span>
                                )}
                            </div>
                        )}
                        {breakdown.rate_calculations.hourly_rate && (
                            <div className="text-xs">
                                Hourly Rate: ₹{Number(breakdown.rate_calculations.hourly_rate).toLocaleString()}
                                {breakdown.rate_calculations.hourly_rate_formula && (
                                    <span className="text-gray-500 ml-2">({breakdown.rate_calculations.hourly_rate_formula})</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {breakdown.attendance_analysis && (
                <div>
                    <span className="font-medium">Attendance Analysis:</span>
                    <div className="ml-4 mt-1 text-xs">
                        <div>Regular Hours: {breakdown.attendance_analysis.total_regular_hours}h</div>
                        <div>Present Days: {breakdown.attendance_analysis.present_days}</div>
                        <div>Leave Days: {breakdown.attendance_analysis.leave_days}</div>
                    </div>
                </div>
            )}

            {breakdown.final_calculation && (
                <div className="bg-green-50 p-2 rounded">
                    <span className="font-medium text-green-700">Final Calculation:</span>
                    <div className="text-xs text-green-600 mt-1">
                        {breakdown.final_calculation.formula}
                        <div className="font-semibold">
                            Result: ₹{Number(breakdown.final_calculation.computed_amount || breakdown.computed_value || 0).toLocaleString()}
                        </div>
                    </div>
                </div>
            )}

            {breakdown.overtime_details && (
                <div>
                    <span className="font-medium">Overtime Details:</span>
                    <div className="ml-4 mt-1 text-xs">
                        <div>Type: {breakdown.overtime_details.type}</div>
                        <div>Total Hours: {breakdown.overtime_details.total_approved_hours}h</div>
                        <div>Per Hour Rate: ₹{Number(breakdown.overtime_details.per_hour_rate).toLocaleString()}</div>
                    </div>
                </div>
            )}

            {breakdown.loan_details && (
                <div>
                    <span className="font-medium">Loan Details:</span>
                    <div className="ml-4 mt-1 text-xs">
                        <div>Application: {breakdown.loan_details.application_number}</div>
                        <div>Type: {breakdown.loan_details.loan_type}</div>
                        <div>Principal: ₹{Number(breakdown.schedule_details?.principal_component || 0).toLocaleString()}</div>
                        <div>Interest: ₹{Number(breakdown.schedule_details?.interest_component || 0).toLocaleString()}</div>
                    </div>
                </div>
            )}

            {breakdown.error && (
                <div className="bg-red-50 p-2 rounded">
                    <span className="font-medium text-red-700">Error:</span>
                    <div className="text-xs text-red-600 mt-1">{breakdown.error}</div>
                </div>
            )}
        </div>
    );
}

export default function PayslipReviewPage() {
    const { payslipId } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [payslip, setPayslip] = React.useState<PayslipDetails | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedComponent, setSelectedComponent] = React.useState<any>(null);
    const [showBreakdown, setShowBreakdown] = React.useState(false);

    React.useEffect(() => {
        const fetchPayslip = async () => {
            try {
                setIsLoading(true);
                const data = await getPayslipForReview(Number(payslipId));
                setPayslip(data);
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: `Failed to load payslip: ${error.message}`,
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayslip();
    }, [payslipId, toast]);

    const handleViewBreakdown = (component: any) => {
        setSelectedComponent(component);
        setShowBreakdown(true);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading payslip details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!payslip) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Payslip Not Found</h3>
                            <p className="text-gray-500">The requested payslip could not be found.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const earnings = payslip.details.filter(d => d.component_type === 'earning');
    const deductions = payslip.details.filter(d => d.component_type === 'deduction');

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Payslip Review</h1>
                        <p className="text-gray-600">{payslip.employee_name}</p>
                    </div>
                </div>
                <Badge variant={payslip.status === 'Reviewed' ? 'default' : 'secondary'}>
                    {payslip.status}
                </Badge>
            </div>

            {/* Payslip Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>{payslip.cycle_name}</CardTitle>
                    <CardDescription>
                        Pay Period: {new Date(payslip.start_date).toLocaleDateString()} - {new Date(payslip.end_date).toLocaleDateString()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-sm text-green-600 font-medium">Gross Earnings</div>
                            <div className="text-2xl font-bold text-green-700">
                                ₹{parseFloat(payslip.gross_earnings).toLocaleString()}
                            </div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-sm text-red-600 font-medium">Total Deductions</div>
                            <div className="text-2xl font-bold text-red-700">
                                ₹{parseFloat(payslip.total_deductions).toLocaleString()}
                            </div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-600 font-medium">Net Pay</div>
                            <div className="text-3xl font-bold text-blue-700">
                                ₹{parseFloat(payslip.net_pay).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Earnings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                        Earnings ({earnings.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Component</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {earnings.map((earning) => (
                                <TableRow key={earning.id}>
                                    <TableCell className="font-medium">{earning.component_name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{earning.group_name}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-green-600">
                                        ₹{parseFloat(earning.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleViewBreakdown(earning)}
                                        >
                                            <Calculator className="w-3 h-3" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="bg-green-50">
                                <TableCell colSpan={2} className="font-semibold">Total Earnings</TableCell>
                                <TableCell className="text-right font-bold text-green-700">
                                    ₹{parseFloat(payslip.gross_earnings).toLocaleString()}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Deductions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                        Deductions ({deductions.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Component</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deductions.map((deduction) => (
                                <TableRow key={deduction.id}>
                                    <TableCell className="font-medium">{deduction.component_name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{deduction.group_name}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-red-600">
                                        ₹{parseFloat(deduction.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleViewBreakdown(deduction)}
                                        >
                                            <Calculator className="w-3 h-3" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="bg-red-50">
                                <TableCell colSpan={2} className="font-semibold">Total Deductions</TableCell>
                                <TableCell className="text-right font-bold text-red-700">
                                    ₹{parseFloat(payslip.total_deductions).toLocaleString()}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Net Pay Summary */}
            <Card className="bg-blue-50">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900">Net Pay</h3>
                            <p className="text-sm text-blue-600">
                                Gross Earnings - Total Deductions = Net Pay
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-900">
                                ₹{parseFloat(payslip.net_pay).toLocaleString()}
                            </div>
                            <p className="text-sm text-blue-600">
                                {payslip.employee_name}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Breakdown Dialog */}
            <Dialog open={showBreakdown} onOpenChange={setShowBreakdown}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>
      Calculation Logic: {selectedComponent?.component_name}
    </DialogTitle>
    <DialogDescription>Step-by-step breakdown</DialogDescription>
  </DialogHeader>

  {/* Collapsible sections for each breakdown step */}
  <div className="space-y-4">
    {Object.entries(selectedComponent.calculation_breakdown || {}).map(([key, value]) => (
      <Collapsible key={key} defaultOpen={key === "final_calculation"}>
        <CollapsibleTrigger className="flex justify-between p-3 bg-gray-100 rounded cursor-pointer">
          <span className="capitalize">{key.replace(/_/g, " ")}</span>
          <span className="text-sm text-gray-500">
            {typeof value === "object" ? "Details" : String(value)}
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border rounded">
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(value, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    ))}
  </div>

  <DialogFooter>
    <Button onClick={() => setShowBreakdown(false)}>Close</Button>
  </DialogFooter>
</DialogContent>
            </Dialog>
        </div>
    );
}