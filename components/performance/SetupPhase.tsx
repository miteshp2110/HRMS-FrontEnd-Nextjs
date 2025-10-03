"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assignGoal, assignKpi, getAllKpis, type AppraisalDetails, type Kpi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
    appraisal: AppraisalDetails;
    onSuccess: () => void;
}

export function SetupPhase({ appraisal, onSuccess }: Props) {
    const { toast } = useToast();
    const [kpiLibrary, setKpiLibrary] = React.useState<Kpi[]>([]);

    const [goalForm, setGoalForm] = React.useState({ title: '', description: '', weightage: 50 });
    const [kpiForm, setKpiForm] = React.useState({ kpi_id: '', target: '', weightage: 50 });

    React.useEffect(() => {
        getAllKpis().then(setKpiLibrary);
    }, []);

    const handleAssignGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await assignGoal({
                appraisal_id: appraisal.id,
                goal_title: goalForm.title,
                goal_description: goalForm.description,
                weightage: goalForm.weightage
            });
            toast({ title: "Success", description: "Goal assigned." });
            setGoalForm({ title: '', description: '', weightage: 50 });
            onSuccess();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to assign goal: ${error.message}`, variant: "destructive" });
        }
    };
    
     const handleAssignKpi = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await assignKpi({
                appraisal_id: appraisal.id,
                kpi_id: Number(kpiForm.kpi_id),
                target: kpiForm.target,
                weightage: kpiForm.weightage
            });
            toast({ title: "Success", description: "KPI assigned." });
            setKpiForm({ kpi_id: '', target: '', weightage: 50 });
            onSuccess();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to assign KPI: ${error.message}`, variant: "destructive" });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
                 <Card>
                    <CardHeader><CardTitle>Assigned Goals ({appraisal.goals.length})</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Goal</TableHead><TableHead>Weightage</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {appraisal.goals.length === 0 ? <TableCell colSpan={2} className="text-center h-14">No Goal Assigned</TableCell>:appraisal.goals.map(g => <TableRow key={g.id}><TableCell>{g.goal_title}</TableCell><TableCell>{g.weightage}%</TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Assigned KPIs ({appraisal.kpis.length})</CardTitle></CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader><TableRow><TableHead>KPI</TableHead><TableHead>Target</TableHead><TableHead>Weightage</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {appraisal.kpis.length === 0 ?<TableCell colSpan={3} className="text-center h-14">No KPIs Assigned</TableCell>:appraisal.kpis.map(k => <TableRow key={k.id}><TableCell>{k.kpi_name}</TableCell><TableCell>{k.target}</TableCell><TableCell>{k.weightage}%</TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Add New Goal</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleAssignGoal} className="space-y-4">
                            <div className="grid gap-2"><Label>Goal Title</Label><Input value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})} required/></div>
                            <div className="grid gap-2"><Label>Description</Label><Textarea value={goalForm.description} onChange={e => setGoalForm({...goalForm, description: e.target.value})} required/></div>
                            <div className="grid gap-2"><Label>Weightage (%)</Label><Input type="number" value={goalForm.weightage} onChange={e => setGoalForm({...goalForm, weightage: Number(e.target.value)})} required/></div>
                            <Button type="submit">Assign Goal</Button>
                        </form>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Assign KPI from Library</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleAssignKpi} className="space-y-4">
                            <div className="grid gap-2"><Label>KPI</Label><Select required onValueChange={v => setKpiForm({...kpiForm, kpi_id: v})}><SelectTrigger><SelectValue placeholder="Select a KPI..."/></SelectTrigger><SelectContent>{kpiLibrary.map(k => <SelectItem key={k.id} value={String(k.id)}>{k.kpi_name}</SelectItem>)}</SelectContent></Select></div>
                            <div className="grid gap-2"><Label>Target</Label><Input value={kpiForm.target} onChange={e => setKpiForm({...kpiForm, target: e.target.value})} required/></div>
                            <div className="grid gap-2"><Label>Weightage (%)</Label><Input type="number" value={kpiForm.weightage} onChange={e => setKpiForm({...kpiForm, weightage: Number(e.target.value)})} required/></div>
                            <Button type="submit">Assign KPI</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
