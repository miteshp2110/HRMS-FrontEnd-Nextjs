"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Download, Eye, Plus, Search } from "lucide-react"
import { API_CONFIG } from "@/lib/config"

interface Document {
  id: number
  document_type: string
  file_name: string
  file_path: string
  uploaded_at: string
  expiry_date?: string
  status: "active" | "expired" | "pending"
}

interface DocumentType {
  id: number
  name: string
  is_required: boolean
  has_expiry: boolean
}

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    fetchDocuments()
    fetchDocumentTypes()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/documents/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDocumentTypes = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/document-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setDocumentTypes(data)
      }
    } catch (error) {
      console.error("Error fetching document types:", error)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", selectedFile)
    formData.append("document_type_id", selectedDocumentType)
    if (expiryDate) {
      formData.append("expiry_date", expiryDate)
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/documents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        setIsUploadOpen(false)
        setSelectedFile(null)
        setSelectedDocumentType("")
        setExpiryDate("")
        fetchDocuments()
      }
    } catch (error) {
      console.error("Error uploading document:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusBadge = (status: string, expiryDate?: string) => {
    if (status === "expired" || (expiryDate && new Date(expiryDate) < new Date())) {
      return <Badge variant="destructive">Expired</Badge>
    }
    if (status === "pending") {
      return <Badge variant="secondary">Pending</Badge>
    }
    return <Badge variant="default">Active</Badge>
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Documents</h1>
          <p className="text-muted-foreground">Manage your personal documents and certificates</p>
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
              <DialogDescription>Upload a new document to your personal collection</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
                <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!selectedFile || !selectedDocumentType || isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Your uploaded documents and certificates</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.document_type}</TableCell>
                  <TableCell>{document.file_name}</TableCell>
                  <TableCell>{new Date(document.uploaded_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {document.expiry_date ? new Date(document.expiry_date).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>{getStatusBadge(document.status, document.expiry_date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
