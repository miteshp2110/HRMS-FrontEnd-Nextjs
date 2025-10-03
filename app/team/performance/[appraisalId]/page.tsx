// "use client"

// import * as React from "react";
// import { useParams } from "next/navigation";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { getAppraisalDetails, type AppraisalDetails } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Badge } from "@/components/ui/badge";
// import { SetupPhase } from "@/components/performance/SetupPhase";
// import { ReviewPhase } from "@/components/performance/ReviewPhase";

// export default function AppraisalDetailPage() {
//     const params = useParams();
//     const appraisalId = Number(params.appraisalId);
//     const { toast } = useToast();
//     const [appraisal, setAppraisal] = React.useState<AppraisalDetails | null>(null);
//     const [isLoading, setIsLoading] = React.useState(true);

//     const fetchData = React.useCallback(async () => {
//         if (!appraisalId) return;
//         setIsLoading(true);
//         try {
//             const data = await getAppraisalDetails(appraisalId);
//             setAppraisal(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load appraisal details.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [appraisalId, toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     if (isLoading || !appraisal) {
//         return <MainLayout><Skeleton className="h-screen w-full"/></MainLayout>
//     }

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div>
//                     <h1 className="text-3xl font-bold">Appraisal for {appraisal.employee_id}</h1>
//                     <p className="text-muted-foreground">Current Status: <Badge>{appraisal.status}</Badge></p>
//                 </div>

//                 {appraisal.status === 'Pending' && (
//                     <SetupPhase appraisal={appraisal} onSuccess={fetchData} />
//                 )}

//                 {appraisal.status === 'Manager-Review' && (
//                     <ReviewPhase appraisal={appraisal} onSuccess={fetchData} />
//                 )}
                
//                 {(appraisal.status === 'Self-Assessment' || appraisal.status === 'Completed') && (
//                     <Card>
//                         <CardHeader><CardTitle>Awaiting Employee</CardTitle></CardHeader>
//                         <CardContent><p>The appraisal is currently with the employee for their self-assessment. You will be notified when it is ready for your review.</p></CardContent>
//                     </Card>
//                 )}
//             </div>
//         </MainLayout>
//     );
// }

"use client"

import * as React from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppraisalDetails, type AppraisalDetails } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SetupPhase } from "@/components/performance/SetupPhase";
import { ReviewPhase } from "@/components/performance/ReviewPhase";

export default function AppraisalDetailPage() {
    const params = useParams();
    const appraisalId = Number(params.appraisalId);
    const { toast } = useToast();
    const [appraisal, setAppraisal] = React.useState<AppraisalDetails | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = React.useCallback(async () => {
        if (!appraisalId) return;
        setIsLoading(true);
        try {
            const data = await getAppraisalDetails(appraisalId);
            setAppraisal(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load appraisal details.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [appraisalId, toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading || !appraisal) {
        return <MainLayout><Skeleton className="h-screen w-full"/></MainLayout>
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Appraisal for {appraisal.employee_name}</h1>
                    <p className="text-muted-foreground">Current Status: <Badge>{appraisal.status}</Badge></p>
                </div>

                {appraisal.status === 'Pending' && (
                    <SetupPhase appraisal={appraisal} onSuccess={fetchData} />
                )}

                {appraisal.status === 'Manager-Review' && (
                    <ReviewPhase appraisal={appraisal} onSuccess={fetchData} isEditable={true} />
                )}
                
                {appraisal.status === 'Self-Assessment' && (
                    <Card>
                        <CardHeader><CardTitle>Awaiting Employee Self-Assessment</CardTitle></CardHeader>
                        <CardContent>
                            <p>The appraisal is currently with the employee. You will be notified when their self-assessment is complete and ready for your review.</p>
                        </CardContent>
                    </Card>
                )}

                {appraisal.status === 'Completed' && (
                     <Card>
                        <CardHeader><CardTitle>Appraisal Completed</CardTitle></CardHeader>
                        <CardContent>
                            <p>This appraisal has been finalized and is now read-only.</p>
                        </CardContent>
                        <ReviewPhase appraisal={appraisal} onSuccess={fetchData} isEditable={false}/>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
