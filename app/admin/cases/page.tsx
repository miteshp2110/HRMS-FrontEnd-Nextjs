"use client"

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Plus, ArrowRight } from "lucide-react";
import { getAllCases, type Case } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CreateCaseDialog } from "@/components/admin/cases/CreateCaseDialog";

export default function CaseDashboardPage() {
    const { toast } = useToast();
    const [cases, setCases] = React.useState<Case[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllCases();
            setCases(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load cases.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'Open': 'bg-gray-100 text-gray-800',
            'Under Review': 'bg-yellow-100 text-yellow-800',
            'Approved': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800',
            'Closed': 'bg-blue-100 text-blue-800',
        };
        return <Badge className={statusMap[status] || ""}>{status}</Badge>;
    }

    return (
        <MainLayout>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <FolderKanban className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">HR Case Management</h1>
                            <p className="text-muted-foreground">Track and manage all employee-related cases and incidents.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Case
                    </Button>
                </div>
                <Card>
                    <CardHeader><CardTitle>All Cases</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Case ID</TableHead><TableHead>Employee</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Amount</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="text-center h-24">Loading cases...</TableCell></TableRow>
                                ) : cases.length === 0?
                                <TableRow><TableCell colSpan={6} className="text-center h-24">No Active Cases Found</TableCell></TableRow>
                                
                                :
                                cases.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-mono">{item.case_id_text}</TableCell>
                                        <TableCell>{item.employee_name}</TableCell>
                                        <TableCell>{item.category_name}</TableCell>
                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                        <TableCell>${Number(item.deduction_amount || 0).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/admin/cases/${item.id}`}>View Details <ArrowRight className="h-4 w-4 ml-2" /></Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                                
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
             </div>
             <CreateCaseDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={fetchData}
             />
        </MainLayout>
    );
}