

// "use client"

// import { useState, useEffect, useMemo } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Download, Plus, AlertTriangle, CheckCircle, FileWarning } from "lucide-react"
// import { getMyDocuments, getDocumentTypes, uploadDocument, type EmployeeDocument, type DocumentType } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// export function MyDocumentsPage() {
//   const [documents, setDocuments] = useState<EmployeeDocument[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
//   const [isUploadOpen, setIsUploadOpen] = useState(false)
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [selectedDocumentType, setSelectedDocumentType] = useState("")
//   const [expiryDate, setExpiryDate] = useState("")
//   const [isUploading, setIsUploading] = useState(false)
//   const { toast } = useToast();

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const [docs, types] = await Promise.all([getMyDocuments(), getDocumentTypes()]);
//       setDocuments(docs);
//       setDocumentTypes(types);
//     } catch (error) {
//       console.error("Error fetching documents data:", error)
//       toast({ title: "Error", description: "Could not load your documents.", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const handleUpload = async () => {
//     if (!selectedFile || !selectedDocumentType) {
//         toast({ title: "Missing Information", description: "Please select a document type and a file.", variant: "destructive" });
//         return;
//     }

//     setIsUploading(true)
//     const formData = new FormData()
//     formData.append("documentFile", selectedFile)
//     formData.append("document_id", selectedDocumentType)
//     if (expiryDate) {
//       formData.append("expiry_date", expiryDate)
//     }

//     try {
//       await uploadDocument(formData);
//       toast({ title: "Success", description: "Document uploaded successfully." });
//       setIsUploadOpen(false)
//       setSelectedFile(null)
//       setSelectedDocumentType("")
//       setExpiryDate("")
//       fetchData(); // Refresh the list
//     } catch (error: any) {
//       console.error("Error uploading document:", error)
//       toast({ title: "Upload Failed", description: error.message || "Could not upload the document.", variant: "destructive" });
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   const { expiringSoonDocs, missingDocs } = useMemo(() => {
//     const thirtyDaysFromNow = new Date();
//     thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

//     const expiringSoon = documents.filter(doc => {
//         if (!doc.expiry_date) return false;
//         const expiry = new Date(doc.expiry_date);
//         return expiry > new Date() && expiry <= thirtyDaysFromNow;
//     });

//     const uploadedDocTypeIds = new Set(documents.map(doc => doc.document_id));
//     const missing = documentTypes.filter(type => !uploadedDocTypeIds.has(type.id));

//     return { expiringSoonDocs: expiringSoon, missingDocs: missing };
//   }, [documents, documentTypes]);

//   const isExpired = (expiryDate?: string) => {
//       if (!expiryDate) return false;
//       return new Date(expiryDate) < new Date();
//   };

//   const getStatusBadge = (expiryDate?: string) => {
//     if (isExpired(expiryDate)) {
//         return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Expired</Badge>
//     }
//     if (expiringSoonDocs.some(d => d.expiry_date === expiryDate)) {
//         return <Badge className="bg-orange-100 text-orange-800"><AlertTriangle className="h-3 w-3 mr-1" />Expiring Soon</Badge>
//     }
//     return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
//   }

//   return (
//     <div className="space-y-6">
//         <div className="flex justify-between items-center">
//             <div>
//                 <h1 className="text-3xl font-bold">My Documents</h1>
//                 <p className="text-muted-foreground">Manage your personal documents and certificates.</p>
//             </div>
//              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
//                 <DialogTrigger asChild>
//                     <Button>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Upload Document
//                     </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                     <DialogHeader>
//                     <DialogTitle>Upload New Document</DialogTitle>
//                     <DialogDescription>Select the document type and file to upload.</DialogDescription>
//                     </DialogHeader>
//                     <div className="space-y-4 py-4">
//                     <div>
//                         <Label htmlFor="document-type">Document Type</Label>
//                         <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
//                         <SelectTrigger>
//                             <SelectValue placeholder="Select document type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {documentTypes.map((type) => (
//                             <SelectItem key={type.id} value={type.id.toString()}>
//                                 {type.name}
//                             </SelectItem>
//                             ))}
//                         </SelectContent>
//                         </Select>
//                     </div>
//                     <div>
//                         <Label htmlFor="file">File</Label>
//                         <Input
//                         id="file"
//                         type="file"
//                         onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                         accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                         />
//                     </div>
//                     <div>
//                         <Label htmlFor="expiry-date">Expiry Date </Label>
//                         <Input
//                         id="expiry-date"
//                         type="date"
//                         value={expiryDate}
//                         onChange={(e) => setExpiryDate(e.target.value)}
//                         />
//                     </div>
//                     </div>
//                     <DialogFooter>
//                     <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
//                         Cancel
//                     </Button>
//                     <Button onClick={handleUpload} disabled={!selectedFile || !selectedDocumentType || isUploading}>
//                         {isUploading ? "Uploading..." : "Upload"}
//                     </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>

//         {missingDocs.length > 0 && (
//             <Card className="border-red-500 bg-red-50">
//                 <CardHeader>
//                     <CardTitle className="text-red-700 flex items-center gap-2"><FileWarning />Action Required</CardTitle>
//                     <CardDescription className="text-red-600">You have documents that are required but have not been uploaded yet.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <ul className="list-disc list-inside space-y-1 text-black">
//                         {missingDocs.map(doc => <li key={doc.id}>{doc.name}</li>)}
//                     </ul>
//                 </CardContent>
//             </Card>
//         )}

//         {expiringSoonDocs.length > 0 && (
//             <Card className="border-orange-500 bg-orange-50">
//                 <CardHeader>
//                     <CardTitle className="text-orange-700 flex items-center gap-2"><AlertTriangle />Expiring Soon</CardTitle>
//                     <CardDescription className="text-orange-600">The following documents will expire within the next 30 days.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <Table className="text-black">
//                         <TableHeader ><TableRow><TableHead className="text-black">Document</TableHead><TableHead className="text-black">Expires On</TableHead></TableRow></TableHeader>
//                         <TableBody>
//                             {expiringSoonDocs.map(doc => (
//                                 <TableRow key={doc.id}>
//                                     <TableCell>{doc.document_name}</TableCell>
//                                     <TableCell className="font-medium">{new Date(doc.expiry_date!).toLocaleDateString()}</TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//         )}

//       <Card>
//         <CardHeader>
//           <CardTitle>Uploaded Documents</CardTitle>
//           <CardDescription>A list of all your uploaded documents.</CardDescription>
//         </CardHeader>
//         <CardContent>
//             {isLoading ? <p>Loading documents...</p> : 
//             <Table>
//                 <TableHeader>
//                 <TableRow>
//                     <TableHead>Document Type</TableHead>
//                     <TableHead>Uploaded On</TableHead>
//                     <TableHead>Expiry Date</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                 {documents.map((doc) => (
//                     <TableRow key={doc.id}>
//                     <TableCell className="font-medium">{doc.document_name}</TableCell>
//                     <TableCell>{new Date(doc.upload_date).toLocaleDateString()}</TableCell>
//                     <TableCell>
//                         {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : "N/A"}
//                     </TableCell>
//                     <TableCell>{getStatusBadge(doc.expiry_date)}</TableCell>
//                     <TableCell className="text-right">
//                         <Button variant="ghost" size="sm" asChild>
//                             <a href={doc.upload_link} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4" /></a>
//                         </Button>
//                     </TableCell>
//                     </TableRow>
//                 ))}
//                 </TableBody>
//             </Table>
//             }
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Plus, AlertTriangle, CheckCircle, FileWarning, Loader2 } from "lucide-react"
import { getMyDocuments, getDocumentTypes, uploadDocument, type EmployeeDocument, type DocumentType } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Skeleton for alert cards
function AlertCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for documents table
function DocumentsTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document Type</TableHead>
          <TableHead>Uploaded On</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-24" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-8 w-8 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Full page skeleton
function DocumentsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-44" />
      </div>
      <AlertCardSkeleton />
      <AlertCardSkeleton />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <DocumentsTableSkeleton />
        </CardContent>
      </Card>
    </div>
  )
}

export function MyDocumentsPage() {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [docs, types] = await Promise.all([getMyDocuments(), getDocumentTypes()])
      setDocuments(docs)
      setDocumentTypes(types)
    } catch (error) {
      console.error("Error fetching documents data:", error)
      toast({ 
        title: "Error", 
        description: "Could not load your documents.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      toast({ 
        title: "Missing Information", 
        description: "Please select a document type and a file.", 
        variant: "destructive" 
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
      await uploadDocument(formData)
      toast({ 
        title: "Success", 
        description: "Document uploaded successfully." 
      })
      setIsUploadOpen(false)
      setSelectedFile(null)
      setSelectedDocumentType("")
      setExpiryDate("")
      fetchData() // Refresh the list
    } catch (error: any) {
      console.error("Error uploading document:", error)
      toast({ 
        title: "Upload Failed", 
        description: error.message || "Could not upload the document.", 
        variant: "destructive" 
      })
    } finally {
      setIsUploading(false)
    }
  }

  const { expiringSoonDocs, missingDocs } = useMemo(() => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const expiringSoon = documents.filter(doc => {
      if (!doc.expiry_date) return false
      const expiry = new Date(doc.expiry_date)
      return expiry > new Date() && expiry <= thirtyDaysFromNow
    })

    const uploadedDocTypeIds = new Set(documents.map(doc => doc.document_id))
    const missing = documentTypes.filter(type => !uploadedDocTypeIds.has(type.id))

    return { expiringSoonDocs: expiringSoon, missingDocs: missing }
  }, [documents, documentTypes])

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  const getStatusBadge = (expiryDate?: string) => {
    if (isExpired(expiryDate)) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      )
    }
    if (expiringSoonDocs.some(d => d.expiry_date === expiryDate)) {
      return (
        <Badge className="bg-orange-100 text-orange-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expiring Soon
        </Badge>
      )
    }
    return (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    )
  }

  if (isLoading) {
    return <DocumentsPageSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Documents</h1>
          <p className="text-muted-foreground">
            Manage your personal documents and certificates.
          </p>
        </div>
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
              <DialogDescription>
                Select the document type and file to upload.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="document-type">Document Type</Label>
                <Select 
                  value={selectedDocumentType} 
                  onValueChange={setSelectedDocumentType}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.length > 0 ? (
                      documentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-types" disabled>
                        No document types available
                      </SelectItem>
                    )}
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
                  disabled={isUploading}
                />
                {selectedFile && (
                  <p className="text-xs text-green-600 mt-1">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  disabled={isUploading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsUploadOpen(false)
                  setSelectedFile(null)
                  setSelectedDocumentType("")
                  setExpiryDate("")
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || !selectedDocumentType || isUploading}
              >
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {missingDocs.length > 0 && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
              <FileWarning />
              Action Required
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-500">
              You have documents that are required but have not been uploaded yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-black dark:text-red-200">
              {missingDocs.map(doc => (
                <li key={doc.id}>{doc.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {expiringSoonDocs.length > 0 && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-900">
          <CardHeader>
            <CardTitle className="text-orange-700 dark:text-orange-400 flex items-center gap-2">
              <AlertTriangle />
              Expiring Soon
            </CardTitle>
            <CardDescription className="text-orange-600 dark:text-orange-500">
              The following documents will expire within the next 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="text-black dark:text-orange-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black dark:text-orange-300">Document</TableHead>
                  <TableHead className="text-black dark:text-orange-300">Expires On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringSoonDocs.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.document_name}</TableCell>
                    <TableCell className="font-medium">
                      {new Date(doc.expiry_date!).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>A list of all your uploaded documents.</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileWarning className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-base font-medium mb-1">No documents uploaded</p>
              <p className="text-sm">
                Click "Upload Document" to add your first document.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Uploaded On</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.document_name}</TableCell>
                    <TableCell>
                      {new Date(doc.upload_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.expiry_date)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a 
                          href={doc.upload_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`Download ${doc.document_name}`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
