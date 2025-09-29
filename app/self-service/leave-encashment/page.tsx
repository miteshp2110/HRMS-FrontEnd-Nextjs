"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, AlertCircle, Eye } from "lucide-react";
import { getLeaveBalances, submitLeaveEncashment, getLeaveEncashmentRequests, type LeaveBalance, type LeaveEncashmentRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeaveEncashmentDetailsDialog } from "@/components/self-service/leave-encashment-details-dialog";

export default function LeaveEncashmentPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [balances, setBalances] = React.useState<LeaveBalance[]>([]);
    const [requests, setRequests] = React.useState<LeaveEncashmentRequest[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    
    const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false);
    const [selectedRequest, setSelectedRequest] = React.useState<LeaveEncashmentRequest | null>(null);

    const [daysToEncash, setDaysToEncash] = React.useState<string>('');
    const [formError, setFormError] = React.useState<string>('');

    // Logic is now hardcoded to only find Annual Leave (ID 8)
    const annualLeave = balances.find(b => b.id === 8 && b.is_encashable);

    const fetchData = React.useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const [balanceData, requestData] = await Promise.all([
                getLeaveBalances(),
                getLeaveEncashmentRequests({ employee_id: user.id })
            ]);
            setBalances(balanceData);
            setRequests(requestData);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load your leave encashment data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast, user]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    React.useEffect(() => {
        if (annualLeave && Number(daysToEncash) > Number(annualLeave.balance)) {
            setFormError(`You cannot encash more than your available balance of ${annualLeave.balance} days.`);
        } else {
            setFormError('');
        }
    }, [daysToEncash, annualLeave]);
    
    const handleViewDetails = (request: LeaveEncashmentRequest) => {
        setSelectedRequest(request);
        setIsDetailsDialogOpen(true);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formError || !daysToEncash || !annualLeave) return;
        try {
            // The leave_type_id is now hardcoded to 8
            await submitLeaveEncashment({ leave_type_id: 8, days_to_encash: Number(daysToEncash) });
            toast({ title: "Success", description: "Your request has been submitted." });
            fetchData();
            setIsRequestDialogOpen(false);
            setDaysToEncash('');
        } catch (error: any) {
            toast({ title: "Error", description: `Request failed: ${error.message}`, variant: "destructive" });
        }
    }

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Approved': 'bg-blue-100 text-blue-800',
            'Processed': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800',
        };
        return <Badge className={statusMap[status] || ""}>{status}</Badge>;
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Wallet className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">Leave Encashment</h1>
                            <p className="text-muted-foreground">Request payment for your unused Annual Leave.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsRequestDialogOpen(true)} disabled={!annualLeave}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Request
                    </Button>
                </div>

                <Card>
                    <CardHeader><CardTitle>Annual Leave Balance</CardTitle></CardHeader>
                    <CardContent>
                        {annualLeave ? (
                            <div className="p-4 bg-muted rounded-lg w-fit">
                                <p className="text-2xl font-bold text-primary">{annualLeave.balance}</p>
                                <p className="text-xs text-muted-foreground">days available for encashment</p>
                            </div>
                        ) : <p className="text-muted-foreground">Your Annual Leave is not eligible for encashment at this time.</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>My Encashment History</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Days</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {requests.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24">No encashment requests found.</TableCell></TableRow>
                                ) : requests.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell>{new Date(req.request_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{req.days_to_encash}</TableCell>
                                        <TableCell>${Number(req.calculated_amount).toLocaleString()}</TableCell>
                                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                                        <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleViewDetails(req)}><Eye className="h-4 w-4 mr-2"/>View</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Annual Leave Encashment Request</DialogTitle>
                        <DialogDescription>Enter the number of days you wish to encash. The final amount will be calculated based on your current salary and benefits.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                         <div className="grid gap-2">
                            <Label htmlFor="days_to_encash">Days to Encash</Label>
                            <Input id="days_to_encash" type="number" value={daysToEncash} onChange={e => setDaysToEncash(e.target.value)} min="1" max={annualLeave?.balance} required/>
                        </div>
                        {formError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>{formError}</AlertTitle>
                            </Alert>
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={!!formError}>Submit Request</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <LeaveEncashmentDetailsDialog 
                request={selectedRequest}
                open={isDetailsDialogOpen}
                onOpenChange={setIsDetailsDialogOpen}
            />
        </MainLayout>
    )
}