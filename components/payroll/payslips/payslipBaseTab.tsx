"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FileText, Search, Eye, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPayrollCycles, type PayrollCycle } from "@/lib/api";
import { MainLayout } from "@/components/main-layout";

export default function EmployeePayslipTab({ employeeId }: { employeeId: number }) {
    const router = useRouter();
    const { toast } = useToast();
    
    const [cycles, setCycles] = React.useState<PayrollCycle[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [yearFilter, setYearFilter] = React.useState('all');

    // Fetch cycles only
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const cyclesData = await getPayrollCycles();
                
                // Filter to show only Finalized and Paid cycles
                const availableCycles = cyclesData.filter(c => 
                    ['Finalized', 'Paid'].includes(c.status)
                );
                
                // Sort by end date descending
                availableCycles.sort((a, b) => 
                    new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
                );
                
                setCycles(availableCycles);
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: `Failed to load payroll cycles: ${error.message}`,
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    // Filter cycles
    const filteredCycles = React.useMemo(() => {
        return cycles.filter(cycle => {
            const matchesSearch = cycle.cycle_name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || 
                                cycle.status.toLowerCase() === statusFilter.toLowerCase();
            
            const cycleYear = new Date(cycle.end_date).getFullYear().toString();
            const matchesYear = yearFilter === 'all' || cycleYear === yearFilter;
            
            return matchesSearch && matchesStatus && matchesYear;
        });
    }, [cycles, searchTerm, statusFilter, yearFilter]);

    const handleViewCycle = (cycleId: number) => {
        router.push(`/payroll/payslips/${cycleId}/payslip/${employeeId}`);
    };

    // Get unique years for filter
    const availableYears = React.useMemo(() => {
        const years = [...new Set(cycles.map(c => new Date(c.end_date).getFullYear()))];
        return years.sort((a, b) => b - a);
    }, [cycles]);

    return (
        <>
            <div className="container mx-auto p-2 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Employee Payslips
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            View Employee's payroll cycle history and details
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge 
                            variant="outline" 
                            className="bg-blue-50 dark:bg-zinc-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-zinc-800"
                        >
                            {filteredCycles.length} cycles
                        </Badge>
                    </div>
                </div>

                {/* Filters */}
                {isLoading ? (
                    <Card className="dark:bg-black dark:border-zinc-800">
                        <CardHeader>
                            <Skeleton className="h-6 w-32 dark:bg-zinc-900" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Skeleton className="h-10 flex-1 dark:bg-zinc-900" />
                                <Skeleton className="h-10 w-full md:w-48 dark:bg-zinc-900" />
                                <Skeleton className="h-10 w-full md:w-32 dark:bg-zinc-900" />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="dark:bg-black dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-lg text-gray-900 dark:text-white">
                                Filter Cycles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                                        <Input
                                            placeholder="Search cycles..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 dark:bg-zinc-950 dark:border-zinc-800 dark:text-white dark:placeholder-gray-500"
                                        />
                                    </div>
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full md:w-48 dark:bg-zinc-950 dark:border-zinc-800 dark:text-white">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-black dark:border-zinc-800">
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="finalized">Finalized</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={yearFilter} onValueChange={setYearFilter}>
                                    <SelectTrigger className="w-full md:w-32 dark:bg-zinc-950 dark:border-zinc-800 dark:text-white">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-black dark:border-zinc-800">
                                        <SelectItem value="all">All Years</SelectItem>
                                        {availableYears.map(year => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Cycles Table */}
                <Card className="dark:bg-black dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">
                            Payroll Cycles
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400">
                            View detailed payslip information for each completed payroll cycle
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center space-x-4 p-4">
                                        <Skeleton className="h-12 w-12 rounded dark:bg-zinc-900" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4 dark:bg-zinc-900" />
                                            <Skeleton className="h-3 w-1/2 dark:bg-zinc-900" />
                                        </div>
                                        <Skeleton className="h-8 w-20 dark:bg-zinc-900" />
                                        <Skeleton className="h-9 w-24 dark:bg-zinc-900" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredCycles.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    No Cycles Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-500">
                                    {searchTerm || statusFilter !== 'all' || yearFilter !== 'all' 
                                        ? 'No cycles match your current filters.'
                                        : 'You don\'t have any payroll cycles yet.'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-950">
                                            <TableHead className="dark:text-gray-400">Cycle Name</TableHead>
                                            <TableHead className="dark:text-gray-400">Pay Period</TableHead>
                                            <TableHead className="dark:text-gray-400">Duration</TableHead>
                                            <TableHead className="dark:text-gray-400">Status</TableHead>
                                            <TableHead className="w-32 dark:text-gray-400">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCycles.map((cycle) => {
                                            const durationDays = Math.ceil(
                                                (new Date(cycle.end_date).getTime() - new Date(cycle.start_date).getTime()) / 
                                                (1000 * 60 * 60 * 24)
                                            )+1;
                                            
                                            return (
                                                <TableRow 
                                                    key={cycle.id} 
                                                    className="hover:bg-gray-50 dark:hover:bg-zinc-950 dark:border-zinc-800 transition-colors"
                                                >
                                                    <TableCell className="font-medium text-gray-900 dark:text-white">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 dark:from-blue-600 dark:to-violet-600 flex items-center justify-center mr-3">
                                                                <FileText className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold">{cycle.cycle_name}</div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                                                    Cycle #{cycle.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                                                            <div className="text-sm">
                                                                <div className="font-medium">
                                                                    {new Date(cycle.start_date).toLocaleDateString('en-AE', { 
                                                                        day: 'numeric', 
                                                                        month: 'short', 
                                                                        year: 'numeric' 
                                                                    })}
                                                                </div>
                                                                <div className="text-gray-500 dark:text-gray-500 text-xs">
                                                                    to {new Date(cycle.end_date).toLocaleDateString('en-AE', { 
                                                                        day: 'numeric', 
                                                                        month: 'short', 
                                                                        year: 'numeric' 
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant="outline" 
                                                            className="bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-800"
                                                        >
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {durationDays} days
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant={cycle.status === 'Paid' ? 'default' : 'secondary'}
                                                            className={
                                                                cycle.status === 'Paid' 
                                                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900' 
                                                                    : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900'
                                                            }
                                                        >
                                                            {cycle.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleViewCycle(cycle.id)}
                                                            className="bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300"
                                                        >
                                                            <Eye className="w-3 h-3 mr-1.5" />
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
