

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
import { Plus, Edit, Trash2, FileText, AlertCircle, Clock } from "lucide-react";
import { getDocumentTypes, createDocumentType, updateDocumentType, deleteDocumentType, type DocumentType } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function DocumentTypesPage() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);

  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const canManageDocs = hasPermission("documents.manage");

  const fetchDocumentTypes = async () => {
    if (!canManageDocs) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const data = await getDocumentTypes();
      setDocumentTypes(data);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to fetch document types: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, [canManageDocs]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingCreate(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const reminder_threshold = Number(formData.get("reminder_threshold"));

    try {
      await createDocumentType({ name, reminder_threshold });
      toast({ title: "Success", description: "Document type created successfully." });
      setCreateDialogOpen(false);
      fetchDocumentTypes();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to create document type: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDocType) return;
    setIsSubmittingEdit(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const reminder_threshold = Number(formData.get("reminder_threshold"));

    try {
      await updateDocumentType(selectedDocType.id, { name, reminder_threshold });
      toast({ title: "Success", description: "Document type updated successfully." });
      setEditDialogOpen(false);
      setSelectedDocType(null);
      fetchDocumentTypes();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to update document type: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this document type?")) return;
    try {
      await deleteDocumentType(id);
      toast({ title: "Success", description: "Document type deleted successfully." });
      fetchDocumentTypes();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to delete document type: ${error.message}`, variant: "destructive" });
    }
  };

  if (!canManageDocs) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You don't have permission to manage document types.</AlertDescription>
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
        <div />
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Document Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Document Type</DialogTitle>
              <DialogDescription>Add a new document type for employees to upload.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Document Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Passport, Visa, ID Card" required />
                </div>
                <div>
                  <Label htmlFor="reminder_threshold">Reminder Threshold (Months)</Label>
                  <Input id="reminder_threshold" name="reminder_threshold" type="number" placeholder="e.g., 30" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingCreate}>
                  {isSubmittingCreate && <Clock className="h-4 w-4 animate-spin mr-2" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Types</CardTitle>
          <CardDescription>Manage all required document types in the organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {documentTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No document types found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first document type.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Document Type
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Reminder Threshold (Months)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentTypes.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>{doc.reminder_threshold}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocType(doc);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
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
            <DialogTitle>Edit Document Type</DialogTitle>
            <DialogDescription>Update the name of the document type.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Document Name</Label>
                <Input id="edit-name" name="name" defaultValue={selectedDocType?.name} required />
              </div>
              <div>
                <Label htmlFor="edit-reminder_threshold">Reminder Threshold (Months)</Label>
                <Input
                  id="edit-reminder_threshold"
                  name="reminder_threshold"
                  type="number"
                  defaultValue={selectedDocType?.reminder_threshold}
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
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
