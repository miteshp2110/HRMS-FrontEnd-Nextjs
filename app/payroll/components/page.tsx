

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
// import { Plus, Edit, Trash2, Calculator } from "lucide-react";
// import { getPayrollComponentDefs, createPayrollComponentDef, updatePayrollComponentDef, deletePayrollComponentDef, type PayrollComponentDef } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// export default function PayrollComponentsPage() {
//     const { toast } = useToast();
//     const [components, setComponents] = React.useState<PayrollComponentDef[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isDialogOpen, setIsDialogOpen] = React.useState(false);
//     const [editingComponent, setEditingComponent] = React.useState<PayrollComponentDef | null>(null);
//     const [formData, setFormData] = React.useState<{ name: string; type: 'earning' | 'deduction' }>({ name: '', type: 'earning' });

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const data = await getPayrollComponentDefs();
//             setComponents(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load payroll components.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const handleOpenDialog = (component: PayrollComponentDef | null = null) => {
//         setEditingComponent(component);
//         setFormData(component ? { name: component.name, type: component.type } : { name: '', type: 'earning' });
//         setIsDialogOpen(true);
//     }

//     const handleDelete = async (id: number) => {
//         if (!window.confirm("Are you sure you want to delete this component?")) return;
//         try {
//             await deletePayrollComponentDef(id);
//             toast({ title: "Success", description: "Component deleted."});
//             fetchData();
//         } catch (error: any) {
//             toast({ title: "Error", description: `Deletion failed: ${error.message}`, variant: "destructive"});
//         }
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             if (editingComponent) {
//                 await updatePayrollComponentDef(editingComponent.id, formData);
//                 toast({ title: "Success", description: "Component updated." });
//             } else {
//                 await createPayrollComponentDef(formData);
//                 toast({ title: "Success", description: "Component created." });
//             }
//             fetchData();
//             setIsDialogOpen(false);
//         } catch (error: any) {
//             toast({ title: "Error", description: `Save failed: ${error.message}`, variant: "destructive" });
//         }
//     }

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <Calculator className="h-8 w-8" />
//                         <div>
//                             <h1 className="text-3xl font-bold">Payroll Components</h1>
//                             <p className="text-muted-foreground">Manage the building blocks for salary structures.</p>
//                         </div>
//                     </div>
//                     <Button onClick={() => handleOpenDialog()}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         New Component
//                     </Button>
//                 </div>

//                 <Card>
//                     <CardHeader><CardTitle>Component Library</CardTitle></CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
//                             <TableBody>
//                                 {components.map(comp => (
//                                     <TableRow key={comp.id}>
//                                         <TableCell className="font-medium">{comp.name}</TableCell>
//                                         <TableCell>{comp.type}</TableCell>
//                                         <TableCell className="text-right">
//                                             <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(comp)}><Edit className="h-4 w-4"/></Button>
//                                             <Button variant="ghost" size="icon" onClick={() => handleDelete(comp.id)}><Trash2 className="h-4 w-4"/></Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>
//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader><DialogTitle>{editingComponent ? 'Edit' : 'Create'} Component</DialogTitle></DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-4 py-4">
//                         <div className="grid gap-2"><Label htmlFor="name">Component Name</Label><Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/></div>
//                         <div className="grid gap-2">
//                             <Label htmlFor="type">Component Type</Label>
//                             <Select name="type" value={formData.type} onValueChange={(v: 'earning' | 'deduction') => setFormData({...formData, type: v})}>
//                                 <SelectTrigger><SelectValue/></SelectTrigger>
//                                 <SelectContent><SelectItem value="earning">Earning</SelectItem><SelectItem value="deduction">Deduction</SelectItem></SelectContent>
//                             </Select>
//                         </div>
//                         <DialogFooter>
//                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                             <Button type="submit">Save</Button>
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </MainLayout>
//     )
// }


"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2, Calculator, Loader2 } from "lucide-react"
import {
  getPayrollComponentDefs,
  createPayrollComponentDef,
  updatePayrollComponentDef,
  deletePayrollComponentDef,
  type PayrollComponentDef,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function PayrollComponentsPage() {
  const { toast } = useToast()
  const [components, setComponents] = React.useState<PayrollComponentDef[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingComponent, setEditingComponent] = React.useState<PayrollComponentDef | null>(null)
  const [formData, setFormData] = React.useState<{
    name: string
    type: "earning" | "deduction"
  }>({ name: "", type: "earning" })

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getPayrollComponentDefs()
      setComponents(data)
    } catch (error: any) {
      toast({ title: "Error", description: "Could not load payroll components.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleOpenDialog = (component: PayrollComponentDef | null = null) => {
    setEditingComponent(component)
    setFormData(component ? { name: component.name, type: component.type } : { name: "", type: "earning" })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this component?")) return
    try {
      await deletePayrollComponentDef(id)
      toast({ title: "Success", description: "Component deleted." })
      fetchData()
    } catch (error: any) {
      toast({ title: "Error", description: `Deletion failed: ${error.message}`, variant: "destructive" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingComponent) {
        await updatePayrollComponentDef(editingComponent.id, formData)
        toast({ title: "Success", description: "Component updated." })
      } else {
        await createPayrollComponentDef(formData)
        toast({ title: "Success", description: "Component created." })
      }
      fetchData()
      setIsDialogOpen(false)
    } catch (error: any) {
      toast({ title: "Error", description: `Save failed: ${error.message}`, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Calculator className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-48" /> : "Payroll Components"}
              </h1>
              <p className="text-muted-foreground">
                {isLoading ? <Skeleton className="h-4 w-64 mt-1" /> : "Manage the building blocks for salary structures."}
              </p>
            </div>
          </div>
          <Button onClick={() => handleOpenDialog()} disabled={isLoading || isSubmitting}>
            {isSubmitting && !editingComponent ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            New Component
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Component Library</CardTitle>
            <CardDescription>
              {isLoading ? <Skeleton className="h-4 w-32" /> : "List of available payroll components."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-12" /></TableCell>
                      </TableRow>
                    ))
                  : components.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell className="font-medium">{comp.name}</TableCell>
                        <TableCell>{comp.type}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(comp)}
                            disabled={isSubmitting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(comp.id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingComponent ? "Edit" : "Create"} Component</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Component Name</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded" />
              ) : (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Component Type</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full rounded" />
              ) : (
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(v: "earning" | "deduction") => setFormData({ ...formData, type: v })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="earning">Earning</SelectItem>
                    <SelectItem value="deduction">Deduction</SelectItem>
                  </SelectContent>
                </Select>
              )}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
)
}
