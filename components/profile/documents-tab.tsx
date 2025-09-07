import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Calendar, AlertTriangle } from "lucide-react"
import type { EmployeeDocument } from "@/lib/api"

interface DocumentsTabProps {
  documents: EmployeeDocument[]
  isLoading: boolean
}

export function DocumentsTab({ documents, isLoading }: DocumentsTabProps) {
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
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Uploaded documents and their expiry status</CardDescription>
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
