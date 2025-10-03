"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, FileText, Search, Filter, Eye, TrendingUp, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPayrollCycles, getMyPayslipForCycle, type PayrollCycle, type PayslipDetails } from "@/lib/api";
import { MainLayout } from "@/components/main-layout";

interface PayslipRecord extends PayslipDetails {
    cycle_name: string;
    cycle_start_date: string;
    cycle_end_date: string;
    cycle_status: string;
}

export default function MyPayslipsPage() {
    const router = useRouter();
    const { toast } = useToast();
    
    const [cycles, setCycles] = React.useState<PayrollCycle[]>([]);
    const [payslips, setPayslips] = React.useState<PayslipRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [yearFilter, setYearFilter] = React.useState('all');

    // Fetch cycles and payslips
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const cyclesData = await getPayrollCycles();
                setCycles(cyclesData);

                // Fetch payslips for finalized/paid cycles
                const finalizedCycles = cyclesData.filter(c => ['Finalized', 'Paid'].includes(c.status));
                const payslipPromises = finalizedCycles.map(async (cycle) => {
                    try {
                        const payslip = await getMyPayslipForCycle(cycle.id);
                        return {
                            ...payslip,
                            cycle_name: cycle.cycle_name,
                            cycle_start_date: cycle.start_date,
                            cycle_end_date: cycle.end_date,
                            cycle_status: cycle.status
                        };
                    } catch (error) {
                        // Payslip might not exist for this employee in this cycle
                        return null;
                    }
                });

                const payslipResults = await Promise.all(payslipPromises);
                const validPayslips = payslipResults.filter(p => p !== null) as PayslipRecord[];
                
                // Sort by end date descending
                validPayslips.sort((a, b) => new Date(b.cycle_end_date).getTime() - new Date(a.cycle_end_date).getTime());
                
                setPayslips(validPayslips);
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: `Failed to load payslips: ${error.message}`,
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    // Filter payslips
    const filteredPayslips = React.useMemo(() => {
        return payslips.filter(payslip => {
            const matchesSearch = payslip.cycle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                payslip.employee_name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || payslip.cycle_status.toLowerCase() === statusFilter.toLowerCase();
            
            const payslipYear = new Date(payslip.cycle_end_date).getFullYear().toString();
            const matchesYear = yearFilter === 'all' || payslipYear === yearFilter;
            
            return matchesSearch && matchesStatus && matchesYear;
        });
    }, [payslips, searchTerm, statusFilter, yearFilter]);

    // Calculate summary stats
    const currentYear = new Date().getFullYear();
    const currentYearPayslips = payslips.filter(p => new Date(p.cycle_end_date).getFullYear() === currentYear);
    const totalEarningsThisYear = currentYearPayslips.reduce((sum, p) => sum + parseFloat(p.gross_earnings), 0);
    const totalDeductionsThisYear = currentYearPayslips.reduce((sum, p) => sum + parseFloat(p.total_deductions), 0);
    const totalNetPayThisYear = currentYearPayslips.reduce((sum, p) => sum + parseFloat(p.net_pay), 0);

    const handleViewPayslip = (payslipId: number) => {
        router.push(`/payroll/payslips/${payslipId}/review`);
    };

    const handleDownloadPayslip = (payslip: PayslipRecord) => {
        // This would generate and download a PDF of the payslip
        toast({
            title: "Download Started",
            description: `Downloading payslip for ${payslip.cycle_name}...`
        });
        // Implementation would depend on your PDF generation service
    };

    // Get unique years for filter
    const availableYears = React.useMemo(() => {
        const years = [...new Set(payslips.map(p => new Date(p.cycle_end_date).getFullYear()))];
        return years.sort((a, b) => b - a);
    }, [payslips]);

    if (isLoading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your payslips...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Payslips (Under Patch)</h1>
                    <p className="text-gray-600">View and download your payslip history</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline">{filteredPayslips.length} payslips</Badge>
                </div>
            </div>

            {/* Year Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">YTD Gross Earnings</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{totalEarningsThisYear.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {currentYearPayslips.length} payslips in {currentYear}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">YTD Deductions</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{totalDeductionsThisYear.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Total deductions this year
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">YTD Net Pay</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">₹{totalNetPayThisYear.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Net earnings this year
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filter Payslips</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search payslips..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="finalized">Finalized</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={yearFilter} onValueChange={setYearFilter}>
                            <SelectTrigger className="w-full md:w-32">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                {availableYears.map(year => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Payslips Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Payslip History</CardTitle>
                    <CardDescription>
                        Your complete payslip records. Click to view details or download.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredPayslips.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Payslips Found</h3>
                            <p className="text-gray-500">
                                {searchTerm || statusFilter !== 'all' || yearFilter !== 'all' 
                                    ? 'No payslips match your current filters.'
                                    : 'You don\'t have any payslips yet.'
                                }
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pay Period</TableHead>
                                    <TableHead>Cycle Name</TableHead>
                                    <TableHead className="text-right">Gross Earnings</TableHead>
                                    <TableHead className="text-right">Deductions</TableHead>
                                    <TableHead className="text-right">Net Pay</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-32">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayslips.map((payslip) => (
                                    <TableRow key={payslip.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                <div className="text-sm">
                                                    <div className="font-medium">
                                                        {new Date(payslip.cycle_start_date).toLocaleDateString()} - 
                                                        {new Date(payslip.cycle_end_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">
                                                        {Math.ceil((new Date(payslip.cycle_end_date).getTime() - new Date(payslip.cycle_start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{payslip.cycle_name}</TableCell>
                                        <TableCell className="text-right font-semibold text-green-600">
                                            ₹{parseFloat(payslip.gross_earnings).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-red-600">
                                            ₹{parseFloat(payslip.total_deductions).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-blue-600">
                                            ₹{parseFloat(payslip.net_pay).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={payslip.cycle_status === 'Paid' ? 'default' : 'secondary'}>
                                                {payslip.cycle_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleViewPayslip(payslip.id)}
                                                >
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDownloadPayslip(payslip)}
                                                >
                                                    <Download className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
        </MainLayout>
    );
}