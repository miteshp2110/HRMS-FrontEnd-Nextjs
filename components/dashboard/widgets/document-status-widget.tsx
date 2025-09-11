"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileWarning, FileClock } from "lucide-react"

interface DocumentStatus {
  expiringSoon: { name: string; expiry_date: string }[]
  notUploaded: { name: string }[]
}

interface DocumentStatusWidgetProps {
  documentStatus: DocumentStatus
}

export function DocumentStatusWidget({ documentStatus }: DocumentStatusWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Status</CardTitle>
        <CardDescription>Important updates about your required documents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {documentStatus.notUploaded.length > 0 && (
            <Alert variant="destructive">
                <FileWarning className="h-4 w-4"/>
                <AlertTitle>Action Required</AlertTitle>
                <AlertDescription>
                    You still need to upload: {documentStatus.notUploaded.map(d => d.name).join(', ')}
                </AlertDescription>
            </Alert>
        )}
        {documentStatus.expiringSoon.length > 0 && (
             <Alert>
                <FileClock className="h-4 w-4"/>
                <AlertTitle>Expiring Soon</AlertTitle>
                <AlertDescription>
                   Your {documentStatus.expiringSoon[0].name} will expire on {new Date(documentStatus.expiringSoon[0].expiry_date).toLocaleDateString()}.
                </AlertDescription>
            </Alert>
        )}
         {documentStatus.notUploaded.length === 0 && documentStatus.expiringSoon.length === 0 && (
             <p className="text-sm text-muted-foreground text-center py-4">All your documents are up to date!</p>
         )}
      </CardContent>
    </Card>
  )
}