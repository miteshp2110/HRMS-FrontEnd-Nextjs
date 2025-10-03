
// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Plus, Library } from "lucide-react";
// import { getAllKpis, createKpi, type Kpi } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Textarea } from "@/components/ui/textarea";

// export default function KpiLibraryPage() {
//     const { toast } = useToast();
//     const [kpis, setKpis] = React.useState<Kpi[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isDialogOpen, setIsDialogOpen] = React.useState(false);
//     const [formData, setFormData] = React.useState({ kpi_name: '', description: '', category: 'Quantitative' as 'Quantitative' | 'Qualitative' });

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const data = await getAllKpis();
//             setKpis(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load KPI library.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             await createKpi(formData);
//             toast({ title: "Success", description: "KPI created." });
//             fetchData();
//             setIsDialogOpen(false);
//         } catch (error: any) {
//             toast({ title: "Error", description: `Creation failed: ${error.message}`, variant: "destructive" });
//         }
//     }

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <Library className="h-8 w-8" />
//                         <div>
//                             <h1 className="text-3xl font-bold">KPI Library</h1>
//                             <p className="text-muted-foreground">Manage standard Key Performance Indicators for appraisals.</p>
//                         </div>
//                     </div>
//                     <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Create New KPI</Button>
//                 </div>
//                 <Card>
//                     <CardHeader><CardTitle>All KPIs</CardTitle></CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader><TableRow><TableHead>KPI Name</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
//                             <TableBody>
//                                 {kpis.map(kpi => (
//                                     <TableRow key={kpi.id}>
//                                         <TableCell>{kpi.kpi_name}</TableCell>
//                                         <TableCell>{kpi.category}</TableCell>
//                                         <TableCell>{kpi.description}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>
//              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader><DialogTitle>Create New KPI</DialogTitle></DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4 py-4">
//                         <div className="grid gap-2"><Label>KPI Name</Label><Input value={formData.kpi_name} onChange={e => setFormData({...formData, kpi_name: e.target.value})} required/></div>
//                         <div className="grid gap-2"><Label>Category</Label><Select value={formData.category} onValueChange={(v: any) => setFormData({...formData, category: v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Quantitative">Quantitative</SelectItem><SelectItem value="Qualitative">Qualitative</SelectItem></SelectContent></Select></div>
//                         <div className="grid gap-2"><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required/></div>
//                         <DialogFooter>
//                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                             <Button type="submit">Create</Button>
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </MainLayout>
//     )
// }

"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Library } from "lucide-react";
import { getAllKpis, createKpi, type Kpi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function KpiLibraryPage() {
    const { toast } = useToast();
    const [kpis, setKpis] = React.useState<Kpi[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({ kpi_name: '', description: '', category: 'Quantitative' as 'Quantitative' | 'Qualitative' });

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllKpis();
            setKpis(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load KPI library.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createKpi(formData);
            toast({ title: "Success", description: "KPI created." });
            fetchData();
            setIsDialogOpen(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Creation failed: ${error.message}`, variant: "destructive" });
        }
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Library className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">KPI Library</h1>
                            <p className="text-muted-foreground">Manage standard Key Performance Indicators for appraisals.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Create New KPI</Button>
                </div>
                <Card>
                    <CardHeader><CardTitle>All KPIs</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>KPI Name</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {kpis.length === 0?
                                <TableCell colSpan={3} className="text-center h-24">No Record Found</TableCell>
                                :
                                kpis.map(kpi => (
                                    <TableRow key={kpi.id}>
                                        <TableCell>{kpi.kpi_name}</TableCell>
                                        <TableCell>{kpi.category}</TableCell>
                                        <TableCell>{kpi.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Create New KPI</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid gap-2"><Label>KPI Name</Label><Input value={formData.kpi_name} onChange={e => setFormData({...formData, kpi_name: e.target.value})} required/></div>
                        <div className="grid gap-2"><Label>Category</Label><Select value={formData.category} onValueChange={(v: any) => setFormData({...formData, category: v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Quantitative">Quantitative</SelectItem><SelectItem value="Qualitative">Qualitative</SelectItem></SelectContent></Select></div>
                        <div className="grid gap-2"><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required/></div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MainLayout>
    )
}
