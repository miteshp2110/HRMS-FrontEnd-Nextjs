"use client"

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPayrollCycles, type PayrollCycle } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Receipt, ArrowRight } from "lucide-react";

export default function MyPayslipsPage() {
    const { toast } = useToast();
    const [cycles, setCycles] = React.useState<PayrollCycle[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        getPayrollCycles()
            .then(data => {
                // Employees can only see paid cycles
                setCycles(data.filter(c => c.status === 'Paid'));
            })
            .catch(() => toast({ title: "Error", description: "Could not load payslip history."}))
            .finally(() => setIsLoading(false));
    }, [toast]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Receipt className="h-8 w-8" />
                    <div>
                        <h1 className="text-3xl font-bold">My Payslips</h1>
                        <p className="text-muted-foreground">View your salary slips from completed payroll cycles.</p>
                    </div>
                </div>
                <Card>
                    <CardHeader><CardTitle>Payslip History</CardTitle></CardHeader>
                    <CardContent className="p-6">
                        {isLoading ? <p>Loading...</p> : (
                            <ul className="space-y-2">
                                {cycles.map(cycle => (
                                    <li key={cycle.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                                        <Link href={`/self-service/payslip/${cycle.id}`} className="font-medium text-primary hover:underline">
                                            {cycle.cycle_name}
                                        </Link>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
