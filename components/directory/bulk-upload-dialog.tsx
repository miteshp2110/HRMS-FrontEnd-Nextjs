"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Upload, Loader2 } from "lucide-react"
import { downloadUserTemplate, bulkUploadUsers } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export function BulkUploadDialog({ open, onOpenChange, onUploadSuccess }: BulkUploadDialogProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await downloadUserTemplate();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to download template: ${error.message}`, variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      toast({ title: "No file selected", description: "Please select an Excel file to upload.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const result = await bulkUploadUsers(formData);
      toast({ title: "Success", description: result.message || "Users uploaded successfully." });
      onUploadSuccess();
      onOpenChange(false);
      setSelectedFile(null);
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message || "Could not upload the file.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk User Upload</DialogTitle>
          <DialogDescription>
            Use this tool to add multiple users at once by uploading an Excel file.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
            <div className="space-y-2">
                <h3 className="font-semibold">Step 1: Download Template</h3>
                <p className="text-sm text-muted-foreground">Download the Excel template to ensure your data is in the correct format.</p>
                <Button variant="outline" onClick={handleDownloadTemplate} disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                    Download Template
                </Button>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold">Step 2: Upload File</h3>
                <p className="text-sm text-muted-foreground">Once you've filled out the template, upload the file here.</p>
                <Input
                    id="file"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".xlsx, .xls"
                />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUploadFile} disabled={isUploading || !selectedFile}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4"/>}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
