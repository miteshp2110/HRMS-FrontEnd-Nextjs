"use client"

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Handshake, Plus, ArrowRight } from "lucide-react";
import { getAllSettlements, type EosSettlement } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { InitiateSettlementDialog } from "@/components/admin/eos/InitiateSettlementDialog";

export default function EosDashboardPage() {
    const { toast } = useToast();
    const [settlements, setSettlements] = React.useState<EosSettlement[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isInitiateDialogOpen, setIsInitiateDialogOpen] = React.useState(false);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllSettlements();
            setSettlements(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load settlements.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Approved': 'bg-blue-100 text-blue-800',
            'Paid': 'bg-green-100 text-green-800',
        };
        return <Badge className={statusMap[status] || ""}>{status}</Badge>;
    }

    return (
        <MainLayout>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Handshake className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">End-of-Service Settlements</h1>
                            <p className="text-muted-foreground">Manage the full and final settlement process for departing employees.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsInitiateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Initiate New Settlement
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Settlement Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee Name</TableHead>
                                    <TableHead>Last Working Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Net Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="text-center h-24">Loading settlements...</TableCell></TableRow>
                                ) : settlements.length === 0?
                                
                                <TableRow><TableCell colSpan={6} className="text-center h-24">No Record Found</TableCell></TableRow>
                                :
                                settlements.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.employee_name}</TableCell>
                                        <TableCell>{new Date(item.last_working_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{item.termination_type}</TableCell>
                                        <TableCell>${Number(item.net_settlement_amount).toLocaleString()}</TableCell>
                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline">
                                                <Link href={`/admin/eos/${item.id}`}>
                                                    View Details <ArrowRight className="h-4 w-4 ml-2" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
             </div>
             <InitiateSettlementDialog
                open={isInitiateDialogOpen}
                onOpenChange={setIsInitiateDialogOpen}
                onSuccess={fetchData}
             />
        </MainLayout>
    );
}