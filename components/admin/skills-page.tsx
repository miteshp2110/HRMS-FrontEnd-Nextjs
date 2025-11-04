
// "use client";

// import type React from "react";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/lib/auth-context";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Plus, Edit, Trash2, BookOpen, AlertCircle, Clock } from "lucide-react";
// import { getSkills, createSkill, updateSkill, deleteSkill, type Skill } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// export function SkillsPage() {
//   const { hasPermission } = useAuth();
//   const { toast } = useToast();
//   const [skills, setSkills] = useState<Skill[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

//   const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
//   const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

//   const canManageSkills = hasPermission("skills.manage");

//   const fetchSkills = async () => {
//     if (!canManageSkills) {
//       setIsLoading(false);
//       return;
//     }
//     try {
//       setIsLoading(true);
//       const skillsData = await getSkills();
//       setSkills(skillsData);
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to fetch skills: ${error.message}`, variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSkills();
//   }, [canManageSkills]);

//   const handleCreateSkill = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmittingCreate(true);
//     const formData = new FormData(e.currentTarget);
//     const skill_name = formData.get("skill_name") as string;
//     const skill_description = formData.get("skill_description") as string;

//     try {
//       await createSkill({ skill_name, skill_description });
//       toast({ title: "Success", description: "Skill created successfully." });
//       setCreateDialogOpen(false);
//       fetchSkills();
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to create skill: ${error.message}`, variant: "destructive" });
//     } finally {
//       setIsSubmittingCreate(false);
//     }
//   };

//   const handleEditSkill = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedSkill) return;
//     setIsSubmittingEdit(true);
//     const formData = new FormData(e.currentTarget);
//     const skill_name = formData.get("skill_name") as string;
//     const skill_description = formData.get("skill_description") as string;

//     try {
//       await updateSkill(selectedSkill.id, { skill_name, skill_description });
//       toast({ title: "Success", description: "Skill updated successfully." });
//       setEditDialogOpen(false);
//       setSelectedSkill(null);
//       fetchSkills();
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to update skill: ${error.message}`, variant: "destructive" });
//     } finally {
//       setIsSubmittingEdit(false);
//     }
//   };

//   const handleDeleteSkill = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this skill?")) return;
//     try {
//       await deleteSkill(id);
//       toast({ title: "Success", description: "Skill deleted successfully." });
//       fetchSkills();
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to delete skill: ${error.message}`, variant: "destructive" });
//     }
//   };

//   if (!canManageSkills) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Access Denied</AlertTitle>
//         <AlertDescription>You don't have permission to manage the skills library.</AlertDescription>
//       </Alert>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Skill Library</h1>
//           <p className="text-muted-foreground">Manage skills across organization</p>
//         </div>
//         <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Create Skill
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Create New Skill</DialogTitle>
//               <DialogDescription>Add a new skill to the company's library.</DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleCreateSkill}>
//               <div className="space-y-4 py-4">
//                 <div>
//                   <Label htmlFor="skill_name">Skill Name</Label>
//                   <Input id="skill_name" name="skill_name" required />
//                 </div>
//                 <div>
//                   <Label htmlFor="skill_description">Description</Label>
//                   <Textarea id="skill_description" name="skill_description" rows={3} required />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmittingCreate}>
//                   {isSubmittingCreate && <Clock className="h-4 w-4 animate-spin mr-2" />}
//                   Create Skill
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Skills Library</CardTitle>
//           <CardDescription>Manage all available skills in the organization.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Skill</TableHead>
//                 <TableHead>Description</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {skills.map((skill) => (
//                 <TableRow key={skill.id}>
//                   <TableCell className="font-medium">
//                     <div className="flex items-center gap-2">
//                       <BookOpen className="h-4 w-4 text-muted-foreground" />
//                       {skill.skill_name}
//                     </div>
//                   </TableCell>
//                   <TableCell className="max-w-md">
//                     <p className="text-sm text-muted-foreground truncate">{skill.skill_description}</p>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedSkill(skill);
//                           setEditDialogOpen(true);
//                         }}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm" onClick={() => handleDeleteSkill(skill.id)}>
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Skill</DialogTitle>
//             <DialogDescription>Update the skill name and description.</DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleEditSkill}>
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label htmlFor="edit-skill_name">Skill Name</Label>
//                 <Input id="edit-skill_name" name="skill_name" defaultValue={selectedSkill?.skill_name} required />
//               </div>
//               <div>
//                 <Label htmlFor="edit-skill_description">Description</Label>
//                 <Textarea
//                   id="edit-skill_description"
//                   name="skill_description"
//                   rows={3}
//                   defaultValue={selectedSkill?.skill_description}
//                   required
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmittingEdit}>
//                 {isSubmittingEdit && <Clock className="h-4 w-4 animate-spin mr-2" />}
//                 Update Skill
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Edit, Trash2, BookOpen, AlertCircle, Clock } from "lucide-react";
import { getSkills, createSkill, updateSkill, deleteSkill, type Skill } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function SkillsPage() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const canManageSkills = hasPermission("skills.manage");

  const fetchSkills = async () => {
    if (!canManageSkills) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const skillsData = await getSkills();
      setSkills(skillsData);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to fetch skills: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [canManageSkills]);

  const handleCreateSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingCreate(true);
    const formData = new FormData(e.currentTarget);
    const skill_name = formData.get("skill_name") as string;
    const skill_description = formData.get("skill_description") as string;

    try {
      await createSkill({ skill_name, skill_description });
      toast({ title: "Success", description: "Skill created successfully." });
      setCreateDialogOpen(false);
      fetchSkills();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to create skill: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleEditSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSkill) return;
    setIsSubmittingEdit(true);
    const formData = new FormData(e.currentTarget);
    const skill_name = formData.get("skill_name") as string;
    const skill_description = formData.get("skill_description") as string;

    try {
      await updateSkill(selectedSkill.id, { skill_name, skill_description });
      toast({ title: "Success", description: "Skill updated successfully." });
      setEditDialogOpen(false);
      setSelectedSkill(null);
      fetchSkills();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to update skill: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteSkill(id);
      toast({ title: "Success", description: "Skill deleted successfully." });
      fetchSkills();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to delete skill: ${error.message}`, variant: "destructive" });
    }
  };

  if (!canManageSkills) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You don't have permission to manage the skills library.</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Skill Library</h1>
          <p className="text-muted-foreground">Manage skills across organization</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Skill</DialogTitle>
              <DialogDescription>Add a new skill to the company's library.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSkill}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="skill_name">Skill Name</Label>
                  <Input id="skill_name" name="skill_name" required />
                </div>
                <div>
                  <Label htmlFor="skill_description">Description</Label>
                  <Textarea id="skill_description" name="skill_description" rows={3} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingCreate}>
                  {isSubmittingCreate && <Clock className="h-4 w-4 animate-spin mr-2" />}
                  Create Skill
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills Library</CardTitle>
          <CardDescription>Manage all available skills in the organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No skills found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your skills library by creating your first skill.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Skill
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        {skill.skill_name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground truncate">{skill.skill_description}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSkill(skill);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSkill(skill.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update the skill name and description.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSkill}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-skill_name">Skill Name</Label>
                <Input id="edit-skill_name" name="skill_name" defaultValue={selectedSkill?.skill_name} required />
              </div>
              <div>
                <Label htmlFor="edit-skill_description">Description</Label>
                <Textarea
                  id="edit-skill_description"
                  name="skill_description"
                  rows={3}
                  defaultValue={selectedSkill?.skill_description}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingEdit}>
                {isSubmittingEdit && <Clock className="h-4 w-4 animate-spin mr-2" />}
                Update Skill
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
