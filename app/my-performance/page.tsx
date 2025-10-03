// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Star, Target } from "lucide-react";
// import { getReviewCycles, getMyValuation, submitSelfAssessment, type ReviewCycle, type AppraisalDetails } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";

// export default function MyPerformancePage() {
//     const { toast } = useToast();
//     const [cycles, setCycles] = React.useState<ReviewCycle[]>([]);
//     const [selectedCycleId, setSelectedCycleId] = React.useState<string>('');
//     const [appraisal, setAppraisal] = React.useState<AppraisalDetails | null>(null);
//     const [isLoading, setIsLoading] = React.useState(false);
//     const [formData, setFormData] = React.useState<{ goals: any[], kpis: any[] }>({ goals: [], kpis: [] });

//     React.useEffect(() => {
//         getReviewCycles().then(setCycles);
//     }, []);

//     const handleCycleChange = async (cycleId: string) => {
//         setSelectedCycleId(cycleId);
//         setIsLoading(true);
//         try {
//             const data = await getMyValuation(Number(cycleId));
//             setAppraisal(data);
//             // Initialize form data
//             setFormData({
//                 goals: data.goals.map(g => ({ id: g.id, employee_rating: g.employee_rating || 0, employee_comments: g.employee_comments || '' })),
//                 kpis: data.kpis.map(k => ({ id: k.id, actual: k.actual || '', employee_rating: k.employee_rating || 0, employee_comments: k.employee_comments || '' }))
//             });
//         } catch (error: any) {
//             setAppraisal(null);
//             toast({ title: "Info", description: "Your appraisal has not been initiated for this cycle yet.", variant: "default" });
//         } finally {
//             setIsLoading(false);
//         }
//     }
    
//     const handleFormChange = (type: 'goals' | 'kpis', id: number, field: string, value: any) => {
//         setFormData(prev => ({
//             ...prev,
//             [type]: prev[type].map(item => item.id === id ? { ...item, [field]: value } : item)
//         }));
//     }

//     const handleSubmit = async () => {
//         if (!appraisal) return;
//         try {
//             await submitSelfAssessment(appraisal.id, formData);
//             toast({ title: "Success", description: "Self-assessment submitted successfully." });
//             handleCycleChange(selectedCycleId); // Refresh
//         } catch (error: any) {
//             toast({ title: "Error", description: `Submission failed: ${error.message}`, variant: "destructive" });
//         }
//     }

//     const isSubmitted = appraisal?.status !== 'Pending';

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                     <Star className="h-8 w-8" />
//                     <div>
//                         <h1 className="text-3xl font-bold">My Performance</h1>
//                         <p className="text-muted-foreground">View and complete your self-assessment.</p>
//                     </div>
//                 </div>
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Select Review Cycle</CardTitle>
//                         <Select onValueChange={handleCycleChange}><SelectTrigger className="w-[280px]"><SelectValue placeholder="Select a cycle..."/></SelectTrigger><SelectContent>{cycles.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.cycle_name}</SelectItem>)}</SelectContent></Select>
//                     </CardHeader>
//                     {appraisal && (
//                         <CardContent className="space-y-6">
//                             <Card>
//                                 <CardHeader><CardTitle>Goals</CardTitle></CardHeader>
//                                 <CardContent className="space-y-4">
//                                     {appraisal.goals.map((goal, index) => (
//                                         <div key={goal.id} className="p-4 border rounded-md">
//                                             <p className="font-semibold">{goal.goal_title}</p>
//                                             <p className="text-sm text-muted-foreground">{goal.goal_description}</p>
//                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
//                                                 <div className="md:col-span-2 grid gap-2"><Label>My Achievements</Label><Textarea value={formData.goals[index]?.employee_comments} onChange={e => handleFormChange('goals', goal.id, 'employee_comments', e.target.value)} readOnly={isSubmitted}/></div>
//                                                 <div className="grid gap-2"><Label>My Rating (1-5)</Label><Input type="number" min="1" max="5" value={formData.goals[index]?.employee_rating} onChange={e => handleFormChange('goals', goal.id, 'employee_rating', Number(e.target.value))} readOnly={isSubmitted}/></div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </CardContent>
//                             </Card>
//                             <Card>
//                                 <CardHeader><CardTitle>KPIs</CardTitle></CardHeader>
//                                 <CardContent className="space-y-4">
//                                      {appraisal.kpis.map((kpi, index) => (
//                                          <div key={kpi.id} className="p-4 border rounded-md">
//                                             <p className="font-semibold">{kpi.kpi_name}</p>
//                                             <p className="text-sm text-muted-foreground">Target: {kpi.target}</p>
//                                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
//                                                 <div className="grid gap-2"><Label>Actual</Label><Input value={formData.kpis[index]?.actual} onChange={e => handleFormChange('kpis', kpi.id, 'actual', e.target.value)} readOnly={isSubmitted}/></div>
//                                                 <div className="md:col-span-2 grid gap-2"><Label>My Comments</Label><Textarea value={formData.kpis[index]?.employee_comments} onChange={e => handleFormChange('kpis', kpi.id, 'employee_comments', e.target.value)} readOnly={isSubmitted}/></div>
//                                                 <div className="grid gap-2"><Label>My Rating (1-5)</Label><Input type="number" min="1" max="5" value={formData.kpis[index]?.employee_rating} onChange={e => handleFormChange('kpis', kpi.id, 'employee_rating', Number(e.target.value))} readOnly={isSubmitted}/></div>
//                                             </div>
//                                         </div>
//                                      ))}
//                                 </CardContent>
//                             </Card>
//                             {!isSubmitted && <div className="p-6"><Button onClick={handleSubmit}>Submit Self-Assessment</Button></div>}
//                         </CardContent>
//                     )}
//                 </Card>
//             </div>
//         </MainLayout>
//     )
// }

"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Target } from "lucide-react";
import { getReviewCycles, getMyValuation, submitSelfAssessment, type ReviewCycle, type AppraisalDetails } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function MyPerformancePage() {
    const { toast } = useToast();
    const [cycles, setCycles] = React.useState<ReviewCycle[]>([]);
    const [selectedCycleId, setSelectedCycleId] = React.useState<string>('');
    const [appraisal, setAppraisal] = React.useState<AppraisalDetails | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState<{ goals: any[], kpis: any[] }>({ goals: [], kpis: [] });

    React.useEffect(() => {
        getReviewCycles().then(setCycles);
    }, []);

    const handleCycleChange = async (cycleId: string) => {
        setSelectedCycleId(cycleId);
        setIsLoading(true);
        try {
            const data = await getMyValuation(Number(cycleId));
            setAppraisal(data);
            setFormData({
                goals: data.goals.map(g => ({ id: g.id, employee_rating: g.employee_rating || 0, employee_comments: g.employee_comments || '' })),
                kpis: data.kpis.map(k => ({ id: k.id, actual: k.actual || '', employee_rating: k.employee_rating || 0, employee_comments: k.employee_comments || '' }))
            });
        } catch (error: any) {
            setAppraisal(null);
            toast({ title: "Info", description: "Your appraisal has not been initiated for this cycle yet.", variant: "default" });
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleFormChange = (type: 'goals' | 'kpis', id: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    }

    const handleSubmit = async () => {
        if (!appraisal) return;
        try {
            await submitSelfAssessment(appraisal.id, formData);
            toast({ title: "Success", description: "Self-assessment submitted successfully." });
            handleCycleChange(selectedCycleId); // Refresh
        } catch (error: any) {
            toast({ title: "Error", description: `Submission failed: ${error.message}`, variant: "destructive" });
        }
    }

    const isSubmitted = appraisal?.status !== 'Pending';

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Star className="h-8 w-8" />
                    <div>
                        <h1 className="text-3xl font-bold">My Performance</h1>
                        <p className="text-muted-foreground">View and complete your self-assessment.</p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Select Review Cycle</CardTitle>
                        <Select onValueChange={handleCycleChange}><SelectTrigger className="w-[280px]"><SelectValue placeholder="Select a cycle..."/></SelectTrigger><SelectContent>{cycles.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.cycle_name}</SelectItem>)}</SelectContent></Select>
                    </CardHeader>
                    {appraisal && (
                        <CardContent className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Goals</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {appraisal.goals.map((goal, index) => (
                                        <div key={goal.id} className="p-4 border rounded-md">
                                            <p className="font-semibold">{goal.goal_title}</p>
                                            <p className="text-sm text-muted-foreground">{goal.goal_description}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                                <div className="md:col-span-2 grid gap-2"><Label>My Achievements</Label><Textarea value={formData.goals[index]?.employee_comments} onChange={e => handleFormChange('goals', goal.id, 'employee_comments', e.target.value)} readOnly={isSubmitted}/></div>
                                                <div className="grid gap-2"><Label>My Rating (1-5)</Label><Input type="number" min="1" max="5" value={formData.goals[index]?.employee_rating} onChange={e => handleFormChange('goals', goal.id, 'employee_rating', Number(e.target.value))} readOnly={isSubmitted}/></div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>KPIs</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                     {appraisal.kpis.map((kpi, index) => (
                                         <div key={kpi.id} className="p-4 border rounded-md">
                                            <p className="font-semibold">{kpi.kpi_name}</p>
                                            <p className="text-sm text-muted-foreground">Target: {kpi.target}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                                                <div className="grid gap-2"><Label>Actual</Label><Input value={formData.kpis[index]?.actual} onChange={e => handleFormChange('kpis', kpi.id, 'actual', e.target.value)} readOnly={isSubmitted}/></div>
                                                <div className="md:col-span-2 grid gap-2"><Label>My Comments</Label><Textarea value={formData.kpis[index]?.employee_comments} onChange={e => handleFormChange('kpis', kpi.id, 'employee_comments', e.target.value)} readOnly={isSubmitted}/></div>
                                                <div className="grid gap-2"><Label>My Rating (1-5)</Label><Input type="number" min="1" max="5" value={formData.kpis[index]?.employee_rating} onChange={e => handleFormChange('kpis', kpi.id, 'employee_rating', Number(e.target.value))} readOnly={isSubmitted}/></div>
                                            </div>
                                        </div>
                                     ))}
                                </CardContent>
                            </Card>
                            {!isSubmitted && <div className="p-6"><Button onClick={handleSubmit}>Submit Self-Assessment</Button></div>}
                        </CardContent>
                    )}
                </Card>
            </div>
        </MainLayout>
    )
}