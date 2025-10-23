

// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Plus, Calendar } from "lucide-react";
// import { getReviewCycles, createReviewCycle, type ReviewCycle } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// export default function CyclesManagementPage() {
//     const { toast } = useToast();
//     const [cycles, setCycles] = React.useState<ReviewCycle[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isDialogOpen, setIsDialogOpen] = React.useState(false);
//     const [formData, setFormData] = React.useState({ cycle_name: '', start_date: '', end_date: '' });

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const data = await getReviewCycles();
//             setCycles(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load review cycles.", variant: "destructive" });
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
//             await createReviewCycle(formData);
//             toast({ title: "Success", description: "Review cycle created." });
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
//                         <Calendar className="h-8 w-8" />
//                         <div>
//                             <h1 className="text-3xl font-bold">Review Cycles</h1>
//                             <p className="text-muted-foreground">Manage company-wide performance review periods.</p>
//                         </div>
//                     </div>
//                     <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Create New Cycle</Button>
//                 </div>
//                 <Card>
//                     <CardHeader><CardTitle>All Cycles</CardTitle></CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader><TableRow><TableHead>Cycle Name</TableHead><TableHead>Start Date</TableHead><TableHead>End Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
//                             <TableBody>
//                                 {cycles.length === 0? 
//                                 <TableCell colSpan={4} className="text-center h-24">No Record Found</TableCell>    
//                             :
//                             cycles.map(cycle => (
//                                     <TableRow key={cycle.id}>
//                                         <TableCell>{cycle.cycle_name}</TableCell>
//                                         <TableCell>{new Date(cycle.start_date).toLocaleDateString()}</TableCell>
//                                         <TableCell>{new Date(cycle.end_date).toLocaleDateString()}</TableCell>
//                                         <TableCell>{cycle.status}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>
//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader><DialogTitle>Create New Review Cycle</DialogTitle></DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4 py-4">
//                         <div className="grid gap-2"><Label>Cycle Name</Label><Input value={formData.cycle_name} onChange={e => setFormData({...formData, cycle_name: e.target.value})} required/></div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2"><Label>Start Date</Label><Input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required/></div>
//                             <div className="grid gap-2"><Label>End Date</Label><Input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required/></div>
//                         </div>
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Calendar, Loader2 } from "lucide-react";
import {
  getReviewCycles,
  createReviewCycle,
  type ReviewCycle,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusVariant(status?: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("active")) return "default" as const;
  if (s.includes("upcoming") || s.includes("future")) return "secondary" as const;
  if (s.includes("closed") || s.includes("ended") || s.includes("past"))
    return "outline" as const;
  return "outline" as const;
}

export default function CyclesManagementPage() {
  const { toast } = useToast();
  const [cycles, setCycles] = React.useState<ReviewCycle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    cycle_name: "",
    start_date: "",
    end_date: "",
  });

  const isFormValid =
    formData.cycle_name.trim().length > 0 &&
    !!formData.start_date &&
    !!formData.end_date;

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getReviewCycles();
      setCycles(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load review cycles.",
        variant: "destructive",
      });
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
      await createReviewCycle(formData);
      toast({ title: "Success", description: "Review cycle created." });
      fetchData();
      setIsDialogOpen(false);
      setFormData({ cycle_name: "", start_date: "", end_date: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Creation failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Review Cycles</h1>
              <p className="text-muted-foreground">
                Manage company-wide performance review periods.
              </p>
            </div>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Cycle
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Cycles</CardTitle>
            <CardDescription>Active, upcoming, and closed cycles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cycle Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                      <TableCell>
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : cycles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                      No record found
                    </TableCell>
                  </TableRow>
                ) : (
                  cycles.map((cycle) => (
                    <TableRow
                      key={cycle.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {cycle.cycle_name}
                      </TableCell>
                      <TableCell>{formatDate(cycle.start_date)}</TableCell>
                      <TableCell>{formatDate(cycle.end_date)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(cycle.status)}>
                          {cycle.status || "—"}
                        </Badge>
                      </TableCell>
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
            <DialogTitle>Create New Review Cycle</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4" aria-busy={isSubmitting}>
            <div className="grid gap-2">
              <Label htmlFor="cycle_name">Cycle Name</Label>
              <Input
                id="cycle_name"
                value={formData.cycle_name}
                onChange={(e) =>
                  setFormData({ ...formData, cycle_name: e.target.value })
                }
                required
                disabled={isSubmitting}
                placeholder="e.g., H1 2026 Performance"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
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
