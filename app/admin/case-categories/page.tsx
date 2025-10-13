// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Plus, Tag } from "lucide-react";
// import { getCaseCategories, createCaseCategory, type CaseCategory } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// export default function CaseCategoriesPage() {
//     const { toast } = useToast();
//     const [categories, setCategories] = React.useState<CaseCategory[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isDialogOpen, setIsDialogOpen] = React.useState(false);
//     const [newCategoryName, setNewCategoryName] = React.useState('');

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const data = await getCaseCategories();
//             setCategories(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load case categories.", variant: "destructive" });
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
//             await createCaseCategory({ name: newCategoryName });
//             toast({ title: "Success", description: "Category created." });
//             fetchData();
//             setIsDialogOpen(false);
//             setNewCategoryName('');
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to create category: ${error.message}`, variant: "destructive" });
//         }
//     }

//     return (
//         <>
        
//             <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <Tag className="h-8 w-8" />
//                         <div>
//                             <h1 className="text-3xl font-bold">Case Categories</h1>
//                             <p className="text-muted-foreground">Manage the categories for HR cases.</p>
//                         </div>
//                     </div>
//                     <Button onClick={() => setIsDialogOpen(true)}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         New Category
//                     </Button>
//                 </div>

//                 <Card>
//                     <CardHeader><CardTitle>Existing Categories</CardTitle></CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead></TableRow></TableHeader>
//                             <TableBody>
//                                 {
//                                     categories.length === 0 ?
//                                     <TableRow><TableCell colSpan={2} className="text-center h-24">No Category Found</TableCell></TableRow>:
//                                     categories.map(cat => (
//                                     <TableRow key={cat.id}>
//                                         <TableCell>{cat.id}</TableCell>
//                                         <TableCell>{cat.name}</TableCell>
//                                     </TableRow>
//                                 ))
//                                 }
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>
//              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader><DialogTitle>Create New Category</DialogTitle></DialogHeader>
//                     <form onSubmit={handleSubmit} className="py-4">
//                         <div className="grid gap-2">
//                             <Label htmlFor="name">Category Name</Label>
//                             <Input id="name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} required/>
//                         </div>
//                         <DialogFooter className="mt-4">
//                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
//                             <Button type="submit">Create</Button>
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </>
//     )
// }

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Tag, Trash2, Clock } from "lucide-react";
import { getCaseCategories, createCaseCategory, type CaseCategory } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function CaseCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<CaseCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCaseCategories();
      setCategories(data);
    } catch (error: any) {
      toast({ title: "Error", description: "Could not load case categories.", variant: "destructive" });
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
      await createCaseCategory({ name: newCategoryName });
      toast({ title: "Success", description: "Category created." });
      fetchData();
      setIsDialogOpen(false);
      setNewCategoryName('');
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to create category: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Tag className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Case Categories</h1>
              <p className="text-muted-foreground">Manage the categories for HR cases.</p>
            </div>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      </TableRow>
                    ))
                  : categories.length === 0
                  ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center h-24">No Category Found</TableCell>
                      </TableRow>
                    )
                  : categories.map(cat => (
                      <TableRow key={cat.id}>
                        <TableCell>{cat.id}</TableCell>
                        <TableCell>{cat.name}</TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} required/>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Clock className="h-4 w-4 animate-spin mr-2" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
