
// "use client";

// import * as React from "react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Plus, Edit, Trash2, FileText, AlertCircle, Clock } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { getExpenseCategories, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory, type ExpenseCategory } from "@/lib/api";
// import { Skeleton } from "@/components/ui/skeleton";

// export function ExpenseCategoriesPage() {
//   const { toast } = useToast();
//   const [categories, setCategories] = React.useState<ExpenseCategory[]>([]);
//   const [isLoading, setIsLoading] = React.useState(true);
//   const [isDialogOpen, setIsDialogOpen] = React.useState(false);
//   const [editingCategory, setEditingCategory] = React.useState<ExpenseCategory | null>(null);

//   const [isSubmitting, setIsSubmitting] = React.useState(false);

//   const fetchCategories = React.useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const data = await getExpenseCategories();
//       setCategories(data);
//     } catch (error: any) {
//       toast({ title: "Error", description: "Could not load expense categories.", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast]);

//   React.useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const formData = new FormData(e.currentTarget);
//     const data = {
//       name: formData.get("name") as string,
//       description: formData.get("description") as string,
//     };

//     try {
//       if (editingCategory) {
//         await updateExpenseCategory(editingCategory.id, data);
//         toast({ title: "Success", description: "Category updated." });
//       } else {
//         await createExpenseCategory(data);
//         toast({ title: "Success", description: "Category created." });
//       }
//       setIsDialogOpen(false);
//       setEditingCategory(null);
//       fetchCategories();
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this category? This can only be done if no expenses are using it.")) return;
//     try {
//       await deleteExpenseCategory(id);
//       toast({ title: "Success", description: "Category deleted." });
//       fetchCategories();
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     }
//   };

//   return (
//     <>
//       <div className="flex justify-end mb-4">
//         <Button onClick={() => { setEditingCategory(null); setIsDialogOpen(true); }}>
//           <Plus className="h-4 w-4 mr-2" />
//           Create Category
//         </Button>
//       </div>
//       <div className="border rounded-md">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading
//               ? Array.from({ length: 4 }).map((_, idx) => (
//                   <TableRow key={idx}>
//                     <TableCell>
//                       <Skeleton className="h-4 w-32" />
//                     </TableCell>
//                     <TableCell>
//                       <Skeleton className="h-4 w-48" />
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Skeleton className="h-8 w-8 ml-auto" />
//                     </TableCell>
//                   </TableRow>
//                 ))
//               : categories.map(cat => (
//                   <TableRow key={cat.id}>
//                     <TableCell>{cat.name}</TableCell>
//                     <TableCell>{cat.description}</TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(cat); setIsDialogOpen(true); }}>
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
//                         <Trash2 className="h-4 w-4 text-destructive" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//           </TableBody>
//         </Table>
//       </div>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>{editingCategory ? "Edit" : "Create"} Expense Category</DialogTitle>
//             <DialogDescription>Manage categories for expense claims and advances.</DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleSubmit}>
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input id="name" name="name" defaultValue={editingCategory?.name} required />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Input id="description" name="description" defaultValue={editingCategory?.description} />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting && <Clock className="h-4 w-4 animate-spin mr-2" />}
//                 Save
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }


"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, AlertCircle, Clock } from "lucide-react";
import { getExpenseCategories, createExpenseCategory, updateExpenseCategory, deleteExpenseCategory, type ExpenseCategory } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function ExpenseCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ExpenseCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchCategories = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getExpenseCategories();
      setCategories(data);
    } catch (error: any) {
      toast({ title: "Error", description: "Could not load expense categories.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    try {
      if (editingCategory) {
        await updateExpenseCategory(editingCategory.id, data);
        toast({ title: "Success", description: "Category updated." });
      } else {
        await createExpenseCategory(data);
        toast({ title: "Success", description: "Category created." });
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category? This can only be done if no expenses are using it.")) return;
    try {
      await deleteExpenseCategory(id);
      toast({ title: "Success", description: "Category deleted." });
      fetchCategories();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setEditingCategory(null); setIsDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Category
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              : categories.map(cat => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(cat); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit" : "Create"} Expense Category</DialogTitle>
            <DialogDescription>Manage categories for expense claims and advances.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={editingCategory?.name || ""} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" defaultValue={editingCategory?.description || ""} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Clock className="h-4 w-4 animate-spin mr-2" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
