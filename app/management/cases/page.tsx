"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FolderKanban, Check, X } from "lucide-react";
import { getManagerCaseApprovals, processCaseApproval, type Case } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ManagerCaseApprovalPage() {
    const { toast } = useToast();
    const [cases, setCases] = React.useState<Case[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedCase, setSelectedCase] = React.useState<Case | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [rejectionReason, setRejectionReason] = React.useState('');

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getManagerCaseApprovals();
            setCases(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load approval queue.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => { fetchData(); }, [fetchData]);

    const handleProcess = async (status: 'Approved' | 'Rejected') => {
        if (!selectedCase) return;
        if (status === 'Rejected' && !rejectionReason) {
            toast({ title: "Error", description: "Rejection reason is required.", variant: "destructive" });
            return;
        }
        try {
            await processCaseApproval(selectedCase.id, { status, rejection_reason: rejectionReason });
            toast({ title: "Success", description: "Case has been processed." });
            fetchData();
            setIsModalOpen(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to process: ${error.message}`, variant: "destructive" });
        }
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <FolderKanban className="h-8 w-8"/>
                    <div>
                        <h1 className="text-3xl font-bold">Employee Case Management</h1>
                        <p className="text-muted-foreground">Review cases for your direct reports that require your approval.</p>
                    </div>
                </div>
                <Card>
                    <CardHeader><CardTitle>My Approval Queue</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Case ID</TableHead><TableHead>Employee</TableHead><TableHead>Title</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                            {cases.length === 0?
                            <TableBody><TableCell colSpan={4} className="text-center h-24">No Active Cases Found</TableCell></TableBody>
                            :
                            <TableBody>
                                {cases.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.case_id_text}</TableCell>
                                        <TableCell>{c.employee_name}</TableCell>
                                        <TableCell>{c.title}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => { setSelectedCase(c); setIsModalOpen(true); }}>Review</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            }
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Case: {selectedCase?.case_id_text}</DialogTitle>
                        <DialogDescription>{selectedCase?.title}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-sm"><strong>Employee:</strong> {selectedCase?.employee_name}</p>
                        <p className="text-sm"><strong>Description:</strong> {selectedCase?.description}</p>
                        <div className="grid gap-2">
                            <Label>Rejection Reason</Label>
                            <Textarea placeholder="Required if rejecting..." onChange={e => setRejectionReason(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => handleProcess('Rejected')}><X className="h-4 w-4 mr-2"/>Reject</Button>
                        <Button onClick={() => handleProcess('Approved')}><Check className="h-4 w-4 mr-2"/>Approve</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}