// "use client"

// import * as React from "react";
// import { useParams } from "next/navigation";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { getCaseDetails, syncCaseToPayroll, type Case } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Skeleton } from "@/components/ui/skeleton";
// import { User, Tag, FileText, DollarSign, CheckCircle, Paperclip } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function CaseDetailPage() {
//     const params = useParams();
//     const caseId = Number(params.id);
//     const { toast } = useToast();
    
//     const [caseDetails, setCaseDetails] = React.useState<Case | null>(null);
//     const [isLoading, setIsLoading] = React.useState(true);

//     const fetchData = React.useCallback(async () => {
//         if (!caseId) return;
//         setIsLoading(true);
//         try {
//             const data = await getCaseDetails(caseId);
//             setCaseDetails(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: `Could not load case details: ${error.message}`, variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [caseId, toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const handleSync = async () => {
//         if (!window.confirm("Are you sure you want to create a deduction entry in the next payroll run for this case?")) return;
//         try {
//             await syncCaseToPayroll(caseId);
//             toast({ title: "Success", description: "Deduction has been synced to payroll."});
//             fetchData();
//         } catch (error: any) {
//             toast({ title: "Error", description: `Sync failed: ${error.message}`, variant: "destructive"});
//         }
//     }

//     if (isLoading || !caseDetails) return <MainLayout><Skeleton className="h-screen w-full" /></MainLayout>;

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div>
//                     <h1 className="text-3xl font-bold">Case: {caseDetails.case_id_text}</h1>
//                     <p className="text-muted-foreground">{caseDetails.title}</p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="md:col-span-2 space-y-6">
//                         <Card>
//                             <CardHeader><CardTitle>Case Details</CardTitle></CardHeader>
//                             <CardContent className="space-y-4 text-sm">
//                                 <p><User className="inline-block h-4 w-4 mr-2" /><strong>Employee:</strong> {caseDetails.employee_name}</p>
//                                 <p><Tag className="inline-block h-4 w-4 mr-2" /><strong>Category:</strong> {caseDetails.category_name}</p>
//                                 {caseDetails.deduction_amount && <p><DollarSign className="inline-block h-4 w-4 mr-2" /><strong>Deduction Amount:</strong> ${Number(caseDetails.deduction_amount).toLocaleString()}</p>}
//                                 <div className="pt-4 border-t"><p className="font-semibold">Description :</p><p>{caseDetails.description}</p></div>
//                                 {caseDetails.status === 'Rejected' ? <div className="pt-4 border-t"><p className="font-semibold">Rejection Reason:</p><p>{caseDetails.rejection_reason}</p></div>:<></>}
//                             </CardContent>
//                         </Card>
//                         {caseDetails.attachments && caseDetails.attachments.length > 0 && (
//                             <Card>
//                                 <CardHeader><CardTitle>Attachments</CardTitle></CardHeader>
//                                 <CardContent>
//                                     <ul className="list-disc pl-5">
//                                         {caseDetails.attachments.map(file => (
//                                             <li key={file.id}><a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"><Paperclip className="inline-block h-4 w-4 mr-1"/>Attachment</a></li>
//                                         ))}
//                                     </ul>
//                                 </CardContent>
//                             </Card>
//                         )}
//                     </div>
//                     <div className="space-y-6">
//                         <Card>
//                             <CardHeader><CardTitle>Status & Actions</CardTitle></CardHeader>
//                             <CardContent className="space-y-4">
//                                 <Badge>{caseDetails.status}</Badge>
//                                 {caseDetails.status === 'Approved' && !caseDetails.is_deduction_synced && caseDetails.deduction_amount && (
//                                     <Button className="w-full" onClick={handleSync}><CheckCircle className="h-4 w-4 mr-2"/>Sync to Payroll</Button>
//                                 )}
//                                  {caseDetails.is_deduction_synced ? <p className="text-sm text-green-600">Deduction has been synced to payroll.</p>:<></>}
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//         </MainLayout>
//     )
// }


"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
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
import { getCaseDetails, syncCaseToPayroll, type Case } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { 
  User, 
  Tag, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Paperclip,
  AlertCircle,
  Loader2,
  FolderKanban,
  XCircle,
  Clock,
  Download,
  Lock
} from "lucide-react"

// Format number as AED currency
const formatAED = (amount: number | string) => {
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
    <div className="space-y-2">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-96" />
    </div>
  )
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  )
}

export default function CaseDetailPage() {
  const params = useParams()
  const caseId = Number(params.id)
  const { toast } = useToast()
  
  const [caseDetails, setCaseDetails] = React.useState<Case | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [showSyncDialog, setShowSyncDialog] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    if (!caseId) return
    setIsLoading(true)
    try {
      const data = await getCaseDetails(caseId)
      setCaseDetails(data)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Could not load case details: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [caseId, toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await syncCaseToPayroll(caseId)
      toast({ 
        title: "Success", 
        description: "Deduction has been synced to payroll successfully." 
      })
      fetchData()
      setShowSyncDialog(false)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Sync failed: ${error.message}`, 
        variant: "destructive"
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Open': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100', icon: FolderKanban },
      'Under Review': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Approved': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
      'Closed': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
      'Locked': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: Lock },
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: FolderKanban }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
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
          <p className="text-muted-foreground">
            The case you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderKanban className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Case: {caseDetails.case_id_text}</h1>
              <p className="text-muted-foreground text-lg mt-1">{caseDetails.title}</p>
            </div>
          </div>
          {getStatusBadge(caseDetails.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Case Details Card */}
            <Card className="border-blue-200 dark:border-blue-900">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Case Details
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
                </div>

                <Separator className="my-4" />

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
                    <Separator className="my-4" />
                    <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Rejection Reason</AlertTitle>
                      <AlertDescription>{caseDetails.rejection_reason}</AlertDescription>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Attachments Card */}
            {caseDetails.attachments && caseDetails.attachments.length > 0 && (
              <Card className="border-purple-200 dark:border-purple-900">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                  <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Attachments ({caseDetails.attachments.length})
                  </CardTitle>
                  <CardDescription className="text-purple-700 dark:text-purple-300">
                    Supporting documents and evidence
                  </CardDescription>
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
                          <div className="text-xs text-muted-foreground">Click to view or download</div>
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
            {/* Status & Actions Card */}
            <Card className="border-indigo-200 dark:border-indigo-900">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
                <CardTitle className="text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Status & Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Current Status</div>
                  {getStatusBadge(caseDetails.status)}
                </div>

                <Separator />

                {caseDetails.is_deduction_synced ? (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-900 dark:text-green-100">Synced to Payroll</AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Deduction has been successfully synced to payroll.
                    </AlertDescription>
                  </Alert>
                ) : caseDetails.status === 'Approved' && caseDetails.deduction_amount ? (
                  <div className="space-y-3">
                    <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-900 dark:text-yellow-100 text-xs">
                        This case has been approved. Sync to payroll to apply the deduction.
                      </AlertDescription>
                    </Alert>
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700" 
                      onClick={() => setShowSyncDialog(true)}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Sync to Payroll
                        </>
                      )}
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Deduction Info card - Enhanced */}
{(caseDetails.status === 'Locked' || caseDetails.status === 'Closed') && (
  <Card className="border-l-4 border-l-primary/30">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Deduction Information
        </CardTitle>
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            caseDetails.status === 'Locked'
              ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/25'
              : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/25'
          }`}
        >
          {caseDetails.status}
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="group">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Payslip Reference
        </div>
        <div className="flex items-center gap-2">
          {caseDetails.payslip_id ? (
            <>
              <div className="font-mono text-sm font-semibold text-foreground bg-secondary/50 px-3 py-1.5 rounded-md border border-border/50">
                {caseDetails.payslip_id}
              </div>
              <svg
                className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Deducted in Final Settlements
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)}

            {/* Case Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Case Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Case ID</div>
                  <div className="font-mono font-medium">{caseDetails.case_id_text}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div className="font-medium">
                    {new Date(caseDetails.created_at).toLocaleDateString('en-AE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sync Confirmation Dialog */}
      <AlertDialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-indigo-600" />
              Sync Deduction to Payroll?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will create a deduction entry of <strong>{formatAED(caseDetails.deduction_amount || 0)}</strong> in the next payroll run for <strong>{caseDetails.employee_name}</strong>. 
              This action cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSyncing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Yes, Sync to Payroll
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}
