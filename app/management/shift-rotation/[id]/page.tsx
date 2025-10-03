"use client"

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getShiftRotationDetails, submitShiftRotationForApproval, processShiftRotationApproval, deleteShiftRotation, type ShiftRotationDetails } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Check, Send, Trash2, X } from "lucide-react";

export default function ShiftRotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const rotationId = Number(params.id);
    const { toast } = useToast();
    const [rotation, setRotation] = React.useState<ShiftRotationDetails | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = React.useCallback(async () => {
        if (!rotationId) return;
        setIsLoading(true);
        try {
            const data = await getShiftRotationDetails(rotationId);
            setRotation(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load rotation details.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [rotationId, toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleSubmitForApproval = async () => {
        try {
            await submitShiftRotationForApproval(rotationId);
            toast({ title: "Success", description: "Rotation submitted for approval." });
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: `Submission failed: ${error.message}`, variant: "destructive" });
        }
    };

    const handleApproval = async (status: 'Approved' | 'Draft') => {
        try {
            await processShiftRotationApproval(rotationId, status);
            toast({ title: "Success", description: `Rotation has been ${status === 'Approved' ? 'approved' : 'sent for rework'}.` });
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: `Action failed: ${error.message}`, variant: "destructive" });
        }
    };
    
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this draft?")) return;
        try {
            await deleteShiftRotation(rotationId);
            toast({ title: "Success", description: "Rotation draft deleted." });
            router.push('/management/shift-rotation');
        } catch (error: any) {
             toast({ title: "Error", description: `Deletion failed: ${error.message}`, variant: "destructive" });
        }
    };

    if (isLoading || !rotation) {
        return <MainLayout><Skeleton className="h-screen w-full" /></MainLayout>;
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{rotation.rotation_name}</h1>
                        <p className="text-muted-foreground">Effective from {new Date(rotation.effective_from).toLocaleDateString()}</p>
                        <Badge className="mt-2">{rotation.status}</Badge>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {rotation.status === 'Draft' && (
                            <>
                                <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2"/>Delete</Button>
                                <Button variant="outline" onClick={() => {/* Navigate to Edit Page */}}> <ArrowRight className="h-4 w-4 mr-2"/>Edit</Button>
                                <Button onClick={handleSubmitForApproval}><Send className="h-4 w-4 mr-2"/>Submit for Approval</Button>
                            </>
                        )}
                        {rotation.status === 'Pending Approval' && (
                            <>
                                <Button variant="destructive" onClick={() => handleApproval('Draft')}><X className="h-4 w-4 mr-2"/>Send for Rework</Button>
                                <Button onClick={() => handleApproval('Approved')}><Check className="h-4 w-4 mr-2"/>Approve</Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Employee Shift Changes</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>From Shift</TableHead><TableHead>To Shift</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {rotation.details.map(d => (
                                        <TableRow key={d.employee_id}>
                                            <TableCell>{d.employee_name}</TableCell>
                                            <TableCell><Badge variant="secondary">{d.from_shift_name}</Badge></TableCell>
                                            <TableCell><Badge>{d.to_shift_name}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Audit History</CardTitle></CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {rotation.audit_log.map(log => (
                                        <TableRow key={log.id}>
                                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                            <TableCell>{log.user_name}</TableCell>
                                            <TableCell>{log.action}: {log.details}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
