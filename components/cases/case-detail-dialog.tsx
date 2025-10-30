"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  FolderKanban,
  User,
  Tag,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  FileQuestion,
  Paperclip,
  Download,
  Calendar,
  LockIcon
} from "lucide-react"
import { type Case } from "@/lib/api"

interface CaseDetailDialogProps {
  caseItem: Case | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Format number as AED currency
const formatAED = (amount: number | string | null) => {
  if (!amount) return 'N/A'
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount)
}

export function CaseDetailDialog({ caseItem, open, onOpenChange }: CaseDetailDialogProps) {
  if (!caseItem) return null

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Open': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100', icon: FileQuestion },
      'Under Review': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Approved': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
      'Closed': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
      'Locked': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: LockIcon },
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: FileQuestion }
    return (
      <Badge className={`${className} text-base px-4 py-1`}>
        <Icon className="h-4 w-4 mr-1" />
        {status}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <FolderKanban className="h-6 w-6 text-primary" />
                Case: {caseItem.case_id_text}
              </DialogTitle>
              <DialogDescription className="text-lg mt-2">
                {caseItem.title}
              </DialogDescription>
            </div>
            {getStatusBadge(caseItem.status)}
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {/* Case Information */}
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Case Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    Employee
                  </div>
                  <div className="font-semibold">{caseItem.employee_name}</div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Tag className="h-4 w-4" />
                    Category
                  </div>
                  <div className="font-semibold">{caseItem.category_name}</div>
                </div>

                {caseItem.deduction_amount && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                    <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300 mb-1">
                      <DollarSign className="h-4 w-4" />
                      Deduction Amount
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatAED(caseItem.deduction_amount)}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Created On
                  </div>
                  <div className="font-semibold">
                    {new Date(caseItem.created_at).toLocaleDateString('en-AE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <FileText className="h-4 w-4" />
                  Description
                </div>
                <p className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap">
                  {caseItem.description}
                </p>
              </div>

              {caseItem.status === 'Rejected' && caseItem.rejection_reason && (
                <>
                  <Separator />
                  <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Rejection Reason</AlertTitle>
                    <AlertDescription>{caseItem.rejection_reason}</AlertDescription>
                  </Alert>
                </>
              )}

              {caseItem.is_deduction_synced && caseItem.deduction_amount && (
                <>
                  <Separator />
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-900 dark:text-green-100">
                      Deduction Synced to Payroll
                    </AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      The deduction has been successfully synced to payroll.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {caseItem.attachments && caseItem.attachments.length > 0 && (
            <Card className="border-purple-200 dark:border-purple-900">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Attachments ({caseItem.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {caseItem.attachments.map((file, index) => (
                    <a
                      key={file.id}
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded">
                        <Paperclip className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Attachment {index + 1}</div>
                        <div className="text-xs text-muted-foreground">
                          Uploaded on {new Date(file.uploaded_at).toLocaleDateString('en-AE')}
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

         {(caseItem.status==='Locked' || caseItem.status==='Closed') && 
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Deduction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payslip Reference</span>
                <span className="font-medium">{caseItem.payslip_id??'Deducted from Settlements'}</span>
              </div>
            </CardContent>
          </Card>
         }

          {/* Case Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Raised By</span>
                <span className="font-medium">{caseItem.raised_by_name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Case ID</span>
                <span className="font-mono font-medium">{caseItem.case_id_text}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                {getStatusBadge(caseItem.status)}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
