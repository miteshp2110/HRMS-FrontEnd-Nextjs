
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
//                                 {kpis.length === 0?
//                                 <TableCell colSpan={3} className="text-center h-24">No Record Found</TableCell>
//                                 :
//                                 kpis.map(kpi => (
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


"use client";

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Library, Loader2 } from "lucide-react";
import { getAllKpis, createKpi, type Kpi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function KpiLibraryPage() {
  const { toast } = useToast();
  const [kpis, setKpis] = React.useState<Kpi[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    kpi_name: "",
    description: "",
    category: "Quantitative" as "Quantitative" | "Qualitative",
  });

  const isFormValid =
    formData.kpi_name.trim().length > 0 &&
    formData.description.trim().length > 0 &&
    !!formData.category;

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
    setIsSubmitting(true);
    try {
      await createKpi(formData);
      toast({ title: "Success", description: "KPI created." });
      fetchData();
      setIsDialogOpen(false);
      setFormData({ kpi_name: "", description: "", category: "Quantitative" });
    } catch (error: any) {
      toast({ title: "Error", description: `Creation failed: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryVariant = (cat: string) =>
    cat === "Quantitative" ? ("default" as const) : ("secondary" as const);

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
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New KPI
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All KPIs</CardTitle>
            <CardDescription>Browse and add reusable KPIs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>KPI Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                      <TableCell>
                        <Skeleton className="h-5 w-64" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[80%]" />
                          <Skeleton className="h-4 w-[65%]" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : kpis.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No record found
                    </TableCell>
                  </TableRow>
                ) : (
                  kpis.map((kpi) => (
                    <TableRow key={kpi.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{kpi.kpi_name}</TableCell>
                      <TableCell>
                        <Badge variant={categoryVariant(kpi.category)}>{kpi.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{kpi.description}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New KPI</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4" aria-busy={isSubmitting}>
            <div className="grid gap-2">
              <Label htmlFor="kpi_name">KPI Name</Label>
              <Input
                id="kpi_name"
                value={formData.kpi_name}
                onChange={(e) => setFormData({ ...formData, kpi_name: e.target.value })}
                required
                disabled={isSubmitting}
                placeholder="e.g., On-time Delivery Rate"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v: "Quantitative" | "Qualitative") => setFormData({ ...formData, category: v })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quantitative">Quantitative</SelectItem>
                  <SelectItem value="Qualitative">Qualitative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={isSubmitting}
                placeholder="What does this KPI measure and how is it evaluated?"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
