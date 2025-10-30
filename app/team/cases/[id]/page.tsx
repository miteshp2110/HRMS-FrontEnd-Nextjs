"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  Loader2,
  AlertCircle,
  ArrowLeft,
  LockIcon
} from "lucide-react"
import Link from "next/link"
import { getCaseDetails, processCaseApproval, type Case } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

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

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  )
}

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const caseId = Number(params.id)
  const { toast } = useToast()
  const { user, hasPermission } = useAuth()
  
  const [caseDetails, setCaseDetails] = React.useState<Case | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isApproving, setIsApproving] = React.useState(false)
  const [isRejecting, setIsRejecting] = React.useState(false)
  const [showRejectDialog, setShowRejectDialog] = React.useState(false)
  const [rejectionReason, setRejectionReason] = React.useState("")

  const fetchCaseDetails = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const details = await getCaseDetails(caseId)
      setCaseDetails(details)
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load case details: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [caseId, toast])

  React.useEffect(() => {
    fetchCaseDetails()
  }, [fetchCaseDetails])

  const handleApprove = async () => {
    if (!caseDetails) return

    setIsApproving(true)
    try {
      await processCaseApproval(caseDetails.id, { status: 'Approved' })
      toast({
        title: "Success",
        description: "Case has been approved successfully.",
      })
      fetchCaseDetails() // Refresh data
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to approve case: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!caseDetails) return

    if (!rejectionReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a rejection reason.",
        variant: "destructive"
      })
      return
    }

    setIsRejecting(true)
    try {
      await processCaseApproval(caseDetails.id, {
        status: 'Rejected',
        rejection_reason: rejectionReason
      })
      toast({
        title: "Success",
        description: "Case has been rejected.",
      })
      setShowRejectDialog(false)
      setRejectionReason("")
      fetchCaseDetails() // Refresh data
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to reject case: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setIsRejecting(false)
    }
  }

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="space-y-6">
              <CardSkeleton />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!caseDetails) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="p-4 bg-red-100 dark:bg-red-950 rounded-full mb-4">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Case Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The case you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/team">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cases
            </Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  const canManageCases = hasPermission("cases.manage")
  const isAssignedManager = caseDetails.assigned_to_id === user?.id
  const canApprove = (canManageCases || isAssignedManager) && 
                     (caseDetails.status === 'Open' || caseDetails.status === 'Under Review')

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/team">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cases
          </Link>
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderKanban className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Case: {caseDetails.case_id_text}</h1>
              <p className="text-muted-foreground text-lg mt-1">
                {caseDetails.title}
              </p>
            </div>
          </div>
          {getStatusBadge(caseDetails.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                    <div className="font-semibold">{caseDetails.employee_name}</div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Tag className="h-4 w-4" />
                      Category
                    </div>
                    <div className="font-semibold">{caseDetails.category_name}</div>
                  </div>

                  {caseDetails.deduction_amount && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                      <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300 mb-1">
                        <DollarSign className="h-4 w-4" />
                        Deduction Amount
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {formatAED(caseDetails.deduction_amount)}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Created On
                    </div>
                    <div className="font-semibold">
                      {new Date(caseDetails.created_at).toLocaleDateString('en-AE', {
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
                    {caseDetails.description}
                  </p>
                </div>

                {caseDetails.status === 'Rejected' && caseDetails.rejection_reason && (
                  <>
                    <Separator />
                    <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Rejection Reason</AlertTitle>
                      <AlertDescription>{caseDetails.rejection_reason}</AlertDescription>
                    </Alert>
                  </>
                )}

                {caseDetails.is_deduction_synced && caseDetails.deduction_amount && (
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
            {caseDetails.attachments && caseDetails.attachments.length > 0 && (
              <Card className="border-purple-200 dark:border-purple-900">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Attachments ({caseDetails.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {caseDetails.attachments.map((file, index) => (
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions Card */}
            {canApprove && (
              <Card className="border-indigo-200 dark:border-indigo-900">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
                  <CardTitle className="text-indigo-900 dark:text-indigo-100">
                    Manager Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting}
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Case
                      </>
                    )}
                  </Button>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isApproving || isRejecting}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Case
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Case Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Raised By</span>
                  <span className="font-medium">{caseDetails.raised_by_name}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Case ID</span>
                  <span className="font-mono font-medium">{caseDetails.case_id_text}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(caseDetails.status)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rejection Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Reject Case?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this case. This will be visible to the employee.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="rejection-reason">Rejection Reason *</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please explain why this case is being rejected..."
              rows={4}
              disabled={isRejecting}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isRejecting}
              onClick={() => setRejectionReason("")}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Confirm Rejection
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}
