"use client"

import * as React from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCaseDetails, syncCaseToPayroll, type Case } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Tag, FileText, DollarSign, CheckCircle, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CaseDetailPage() {
    const params = useParams();
    const caseId = Number(params.id);
    const { toast } = useToast();
    
    const [caseDetails, setCaseDetails] = React.useState<Case | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = React.useCallback(async () => {
        if (!caseId) return;
        setIsLoading(true);
        try {
            const data = await getCaseDetails(caseId);
            setCaseDetails(data);
        } catch (error: any) {
            toast({ title: "Error", description: `Could not load case details: ${error.message}`, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [caseId, toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSync = async () => {
        if (!window.confirm("Are you sure you want to create a deduction entry in the next payroll run for this case?")) return;
        try {
            await syncCaseToPayroll(caseId);
            toast({ title: "Success", description: "Deduction has been synced to payroll."});
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: `Sync failed: ${error.message}`, variant: "destructive"});
        }
    }

    if (isLoading || !caseDetails) return <MainLayout><Skeleton className="h-screen w-full" /></MainLayout>;

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Case: {caseDetails.case_id_text}</h1>
                    <p className="text-muted-foreground">{caseDetails.title}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Case Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <p><User className="inline-block h-4 w-4 mr-2" /><strong>Employee:</strong> {caseDetails.employee_name}</p>
                                <p><Tag className="inline-block h-4 w-4 mr-2" /><strong>Category:</strong> {caseDetails.category_name}</p>
                                {caseDetails.deduction_amount && <p><DollarSign className="inline-block h-4 w-4 mr-2" /><strong>Deduction Amount:</strong> ${Number(caseDetails.deduction_amount).toLocaleString()}</p>}
                                <div className="pt-4 border-t"><p className="font-semibold">Description :</p><p>{caseDetails.description}</p></div>
                                {caseDetails.status === 'Rejected' ? <div className="pt-4 border-t"><p className="font-semibold">Rejection Reason:</p><p>{caseDetails.rejection_reason}</p></div>:<></>}
                            </CardContent>
                        </Card>
                        {caseDetails.attachments && caseDetails.attachments.length > 0 && (
                            <Card>
                                <CardHeader><CardTitle>Attachments</CardTitle></CardHeader>
                                <CardContent>
                                    <ul className="list-disc pl-5">
                                        {caseDetails.attachments.map(file => (
                                            <li key={file.id}><a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"><Paperclip className="inline-block h-4 w-4 mr-1"/>Attachment</a></li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Status & Actions</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <Badge>{caseDetails.status}</Badge>
                                {caseDetails.status === 'Approved' && !caseDetails.is_deduction_synced && caseDetails.deduction_amount && (
                                    <Button className="w-full" onClick={handleSync}><CheckCircle className="h-4 w-4 mr-2"/>Sync to Payroll</Button>
                                )}
                                 {caseDetails.is_deduction_synced ? <p className="text-sm text-green-600">Deduction has been synced to payroll.</p>:<></>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}