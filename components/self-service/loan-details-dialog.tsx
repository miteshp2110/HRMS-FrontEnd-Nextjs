"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { downloadLoanAgreement, getLoanApplicationDetails, type LoanApplication } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";

interface LoanDetailsDialogProps {
    applicationId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LoanDetailsDialog({ applicationId, open, onOpenChange }: LoanDetailsDialogProps) {
    const { toast } = useToast();
    const [details, setDetails] = React.useState<LoanApplication | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (open && applicationId) {
            setIsLoading(true);
            getLoanApplicationDetails(applicationId)
                .then(setDetails)
                .catch(err => toast({ title: "Error", description: `Could not load details: ${err.message}`, variant: "destructive" }))
                .finally(() => setIsLoading(false));
        }
    }, [applicationId, open, toast]);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'Pending Manager Approval': 'bg-yellow-100 text-yellow-800',
            'Pending HR Approval': 'bg-orange-100 text-orange-800',
            'Approved': 'bg-blue-100 text-blue-800',
            'Rejected': 'bg-red-100 text-red-800',
            'Disbursed': 'bg-green-100 text-green-800',
            'Closed': 'bg-gray-100 text-gray-800'
        };
        return <Badge className={statusMap[status] || ""}>{status}</Badge>;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    {details ? (
                        <>
                            <DialogTitle>Application Details: {details.application_id_text} <Button className="ml-3" onClick={()=>{downloadLoanAgreement(details.id,details.application_id_text)}}><Download /></Button></DialogTitle>
                            <DialogDescription>
                                Your application for a {details.loan_type_name}.
                            </DialogDescription>
                        </>
                    ) : (
                        <DialogTitle>Loading Details...</DialogTitle>
                    )}
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-4">
                    {isLoading || !details ? (
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="pt-4 border-t">
                                <Skeleton className="h-48 w-full" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Requested Amount:</strong> ${details.requested_amount.toLocaleString()}</div>
                                <div><strong>Approved Amount:</strong> ${details.approved_amount?.toLocaleString() || 'N/A'}</div>
                                <div><strong>Tenure:</strong> {details.tenure_months} months</div>
                                <div><strong>Interest Rate:</strong> {details.interest_rate}%</div>
                                <div className="col-span-2"><strong>Purpose:</strong> {details.purpose}</div>
                                <div className="col-span-2"><strong>Status:</strong> {getStatusBadge(details.status)}</div>
                                {details.status === 'Rejected' && <div className="col-span-2"><strong>Reason:</strong> <span className="text-red-600">{details.rejection_reason}</span></div>}
                                
                            </div>

                            {details.amortization_schedule && details.amortization_schedule.length > 0 && (
                                <div className="pt-4 border-t">
                                    <h3 className="font-semibold mb-2">Repayment Schedule</h3>
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Due Date</TableHead><TableHead>EMI</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {details.amortization_schedule.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{new Date(row.due_date).toLocaleDateString()}</TableCell>
                                                    <TableCell>${row.emi_amount}</TableCell>
                                                    
                                                    <TableCell><Badge variant={row.status === 'Paid' ? 'default' : 'secondary'}>{row.status}</Badge></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}