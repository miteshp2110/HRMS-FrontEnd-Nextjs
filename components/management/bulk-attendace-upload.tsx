"use client"

import * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { bulkUploadAttendance, type BulkUploadAttendanceResponse } from "@/lib/api"
import {
  Upload,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Download,
  X,
} from "lucide-react"

// Strict type for file validation
interface FileValidationResult {
  valid: boolean
  error?: string
}

// Props interface
interface BulkUploadAttendanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  timezone: string
  onSuccess?: () => void
}

// Constants
const ALLOWED_FILE_TYPES = [
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/x-excel",
  "application/x-dos_ms_excel",
]

const ALLOWED_EXTENSIONS = [".xls", ".xlsx"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const BulkUploadAttendanceDialog: React.FC<BulkUploadAttendanceDialogProps> = ({
  open,
  onOpenChange,
  timezone,
  onSuccess,
}) => {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [reason, setReason] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadResult, setUploadResult] = useState<BulkUploadAttendanceResponse | null>(null)
  const [validationError, setValidationError] = useState<string>("")

  // File validation function
  const validateFile = (file: File): FileValidationResult => {
    // Check file extension
    const fileName = file.name.toLowerCase()
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext))

    if (!hasValidExtension) {
      return {
        valid: false,
        error: `Invalid file type. Please upload an Excel file (${ALLOWED_EXTENSIONS.join(", ")})`,
      }
    }

    // Check MIME type
    const hasValidMimeType =
      ALLOWED_FILE_TYPES.includes(file.type) ||
      file.type === "" // Some browsers don't set MIME type for xlsx

    if (!hasValidMimeType && file.type !== "") {
      return {
        valid: false,
        error: "Invalid file format. Please upload a valid Excel file.",
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
      }
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        valid: false,
        error: "File is empty. Please upload a valid Excel file.",
      }
    }

    return { valid: true }
  }

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setValidationError("")
    setUploadResult(null)

    if (!file) {
      setSelectedFile(null)
      return
    }

    const validation = validateFile(file)

    if (!validation.valid) {
      setValidationError(validation.error || "Invalid file")
      setSelectedFile(null)
      event.target.value = "" // Reset input
      return
    }

    setSelectedFile(file)
  }

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setValidationError("")
    setUploadResult(null)
    // Reset file input
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  // Reset form
  const resetForm = () => {
    setSelectedFile(null)
    setReason("")
    setValidationError("")
    setUploadResult(null)
    setLoading(false)
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Validation
    if (!selectedFile) {
      setValidationError("Please select a file to upload")
      return
    }

    if (!reason.trim()) {
      setValidationError("Please provide a reason for the bulk upload")
      return
    }

    if (!timezone) {
      setValidationError("Timezone is required")
      return
    }

    setLoading(true)
    setValidationError("")

    try {
      const result: BulkUploadAttendanceResponse = await bulkUploadAttendance(
        selectedFile,
        timezone,
        reason.trim()
      )

      setUploadResult(result)

      if (result.success) {
        toast({
          title: "Upload Successful",
          description: `${result.processedCount} record(s) processed successfully.`,
        })

        if (result.errors && result.errors.length > 0) {
          toast({
            title: "Partial Success",
            description: `${result.errors.length} row(s) had errors. Check details below.`,
            variant: "default",
          })
        }

        // Call onSuccess callback after successful upload
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast({
          title: "Upload Failed",
          description: result.message || "Failed to process the file",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Bulk upload error:", error)
      toast({
        title: "Upload Error",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      })
      setValidationError(error.message || "An error occurred during upload")
    } finally {
      setLoading(false)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  // Handle dialog close
  const handleDialogClose = (isOpen: boolean) => {
    if (!loading) {
      if (!isOpen) {
        resetForm()
      }
      onOpenChange(isOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Attendance</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import multiple attendance records at once.
            Ensure your file follows the required format.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* File Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">
              Excel File <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="file-upload"
                  type="file"
                  accept={ALLOWED_EXTENSIONS.join(",")}
                  onChange={handleFileChange}
                  disabled={loading}
                  className="cursor-pointer"
                />
              </div>
              {selectedFile && !loading && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRemoveFile}
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Accepted formats: .xls, .xlsx (Max size: {MAX_FILE_SIZE / 1024 / 1024}MB)
            </p>
          </div>

          {/* Timezone Display (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <span className="text-sm font-medium">{timezone}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All times in the uploaded file will be processed using this timezone.
            </p>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Upload <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g., Importing attendance data for October 2025"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              required
              rows={3}
            />
          </div>

          {/* Validation Error */}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-2">
              <Alert variant={uploadResult.success ? "default" : "destructive"}>
                {uploadResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="font-semibold">{uploadResult.message}</div>
                  <div className="text-sm mt-1">
                    Processed: {uploadResult.processedCount} record(s)
                  </div>
                </AlertDescription>
              </Alert>

              {/* Error Details */}
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto bg-muted/50">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Errors ({uploadResult.errors.length})
                  </h4>
                  <ul className="space-y-1">
                    {uploadResult.errors.map((error, index) => (
                      <li key={index} className="text-xs">
                        <span className="font-medium">Row {error.row}:</span>{" "}
                        {error.employeeId && (
                          <span className="text-muted-foreground">
                            (Employee: {error.employeeId}){" "}
                          </span>
                        )}
                        {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Template Download Link */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>
                Need a template?{" "}
                <a
                  href="/templates/attendance-template.xlsx"
                  download
                  className="text-primary hover:underline"
                >
                  Download sample Excel template
                </a>
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={loading}
            >
              {uploadResult?.success ? "Close" : "Cancel"}
            </Button>
            <Button type="submit" disabled={loading || !selectedFile} aria-busy={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
