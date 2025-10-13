// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { FileText, Download, Calendar, AlertTriangle } from "lucide-react"
// import type { EmployeeDocument } from "@/lib/api"

// interface DocumentsTabProps {
//   documents: EmployeeDocument[]
//   isLoading: boolean
// }

// export function DocumentsTab({ documents, isLoading }: DocumentsTabProps) {
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading documents...</p>
//         </div>
//       </div>
//     )
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString()
//   }

//   const isExpiringSoon = (expiryDate?: string) => {
//     if (!expiryDate) return false
//     const expiry = new Date(expiryDate)
//     const now = new Date()
//     const diffTime = expiry.getTime() - now.getTime()
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays <= 30 && diffDays > 0
//   }

//   const isExpired = (expiryDate?: string) => {
//     if (!expiryDate) return false
//     const expiry = new Date(expiryDate)
//     const now = new Date()
//     return expiry < now
//   }

//   const getExpiryBadge = (expiryDate?: string) => {
//     if (!expiryDate) return null

//     if (isExpired(expiryDate)) {
//       return (
//         <Badge variant="destructive" className="flex items-center gap-1">
//           <AlertTriangle className="h-3 w-3" />
//           Expired
//         </Badge>
//       )
//     }

//     if (isExpiringSoon(expiryDate)) {
//       return (
//         <Badge
//           variant="secondary"
//           className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 flex items-center gap-1"
//         >
//           <AlertTriangle className="h-3 w-3" />
//           Expiring Soon
//         </Badge>
//       )
//     }

//     return (
//       <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//         Valid
//       </Badge>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Documents</CardTitle>
//       <Button >Upload</Button>
//         <CardDescription>Uploaded documents and their expiry status</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {documents.length === 0 ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <p className="text-muted-foreground">No documents uploaded</p>
//             </div>
//           </div>
//         ) : (
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Document Type</TableHead>
//                   <TableHead>Upload Date</TableHead>
//                   <TableHead>Expiry Date</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {documents.map((doc) => (
//                   <TableRow key={doc.id}>
//                     <TableCell className="font-medium">{doc.document_name}</TableCell>
//                     <TableCell>{formatDate(doc.upload_date)}</TableCell>
//                     <TableCell>
//                       {doc.expiry_date ? (
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4 text-muted-foreground" />
//                           {formatDate(doc.expiry_date)}
//                         </div>
//                       ) : (
//                         "No expiry"
//                       )}
//                     </TableCell>
//                     <TableCell>{getExpiryBadge(doc.expiry_date)}</TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="sm" onClick={()=>{window.open(doc.upload_link,"_blank")}}>
//                         <Download className="h-4 w-4 mr-2" />
//                         Download
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Calendar, AlertTriangle, Upload, Command, Search, Plus } from "lucide-react"
import { searchUsers, uploadEmployeeDocument, type EmployeeDocument, type UserProfile, type DocumentType, uploadDocument, getDocumentTypes } from "@/lib/api"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "@radix-ui/react-label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { useToast } from "../ui/use-toast"
import React from "react"

interface DocumentsTabProps {
  onUpload:()=>void;
  documents: EmployeeDocument[]
  isLoading: boolean
  employeeId:number
  
}


interface DocumentUploadDialogProps {
  employeeId:number
  documentTypes: DocumentType[]
  onUploadSuccess?: () => void
}

export function DocumentUploadDialog({ employeeId,documentTypes, onUploadSuccess }: DocumentUploadDialogProps) {
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [selectedDocumentType, setSelectedDocumentType] = React.useState("")
  const [expiryDate, setExpiryDate] = React.useState("")
  const [isUploading, setIsUploading] = React.useState(false)
  const { toast } = useToast()
  

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      toast({
        title: "Missing Information",
        description: "Please select a document type and a file.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("documentFile", selectedFile)
    formData.append("document_id", selectedDocumentType)
    if (expiryDate) {
      formData.append("expiry_date", expiryDate)
    }

    try {
      await uploadEmployeeDocument(employeeId,formData)
      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      })
      resetForm()
      setIsUploadOpen(false)
      if (onUploadSuccess) {
        onUploadSuccess()
      }
    } catch (error: any) {
      console.error("Error uploading document:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload the document.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setSelectedDocumentType("")
    setExpiryDate("")
  }

  return (
    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogDescription>Select the document type and file to upload.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="document-type">Document Type</Label>
            <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
          <div>
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <Input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              setIsUploadOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || !selectedDocumentType || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DocumentsTab({ employeeId,onUpload,documents, isLoading }: DocumentsTabProps) {
  
  const [documentTypes, setDocumentTypes] = React.useState<DocumentType[]>([])
    const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    )
  }
  React.useEffect(() => {
    const fetchTypes = async () => {
      const types = await getDocumentTypes()
      setDocumentTypes(types)
    }
    fetchTypes()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const now = new Date()
    return expiry < now
  }

  const getExpiryBadge = (expiryDate?: string) => {
    if (!expiryDate) return null

    if (isExpired(expiryDate)) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Expired
        </Badge>
      )
    }

    if (isExpiringSoon(expiryDate)) {
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          Expiring Soon
        </Badge>
      )
    }

    return (
      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
        Valid
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Uploaded documents and their expiry status</CardDescription>
        </div>
        <DocumentUploadDialog employeeId={employeeId} documentTypes={documentTypes} onUploadSuccess={onUpload}/>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No documents uploaded</p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.document_name}</TableCell>
                    <TableCell>{formatDate(doc.upload_date)}</TableCell>
                    <TableCell>
                      {doc.expiry_date ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(doc.expiry_date)}
                        </div>
                      ) : (
                        "No expiry"
                      )}
                    </TableCell>
                    <TableCell>{getExpiryBadge(doc.expiry_date)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={()=>{window.open(doc.upload_link,"_blank")}}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}