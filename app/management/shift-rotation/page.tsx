

"use client"

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, ArrowRight } from "lucide-react";
import { getAllShiftRotations, type ShiftRotation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ShiftRotationDashboardPage() {
    const { toast } = useToast();
    const [rotations, setRotations] = React.useState<ShiftRotation[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllShiftRotations();
            setRotations(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load shift rotations.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'Draft': 'bg-gray-100 text-gray-800',
            'Pending Approval': 'bg-yellow-100 text-yellow-800',
            'Approved': 'bg-blue-100 text-blue-800',
            'Executed': 'bg-green-100 text-green-800',
        };
        return <Badge className={statusMap[status] || ""}>{status}</Badge>;
    }

    return (
        <MainLayout>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <RefreshCw className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">Shift Rotations (Under Patch : update on 05-10-2025)</h1>
                            <p className="text-muted-foreground">Manage and schedule employee shift changes.</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/management/shift-rotation/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Rotation
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader><CardTitle>All Rotations</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rotation Name</TableHead>
                                    <TableHead>Effective Date</TableHead>
                                    <TableHead>Employees</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24">Loading rotations...</TableCell></TableRow>
                                ) : 
                                  rotations.length === 0?
                                  <TableRow><TableCell colSpan={5} className="text-center h-24">No Record Found</TableCell></TableRow>
                                  :
                                  rotations.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.rotation_name}</TableCell>
                                        <TableCell>{new Date(item.effective_from).toLocaleDateString()}</TableCell>
                                        <TableCell>{item.employee_count}</TableCell>
                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/management/shift-rotation/${item.id}`}>
                                                    View Details <ArrowRight className="h-4 w-4 ml-2" />
                                                </Link>
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
        </MainLayout>
    );
}
