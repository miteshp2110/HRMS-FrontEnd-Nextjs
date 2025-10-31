// "use client"

// import * as React from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { downloadLoanAgreement, getLoanApplicationDetails, type LoanApplication } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Download } from "lucide-react";

// interface LoanDetailsDialogProps {
//     applicationId: number | null;
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// export function LoanDetailsDialog({ applicationId, open, onOpenChange }: LoanDetailsDialogProps) {
//     const { toast } = useToast();
//     const [details, setDetails] = React.useState<LoanApplication | null>(null);
//     const [isLoading, setIsLoading] = React.useState(true);

//     React.useEffect(() => {
//         if (open && applicationId) {
//             setIsLoading(true);
//             getLoanApplicationDetails(applicationId)
//                 .then(setDetails)
//                 .catch(err => toast({ title: "Error", description: `Could not load details: ${err.message}`, variant: "destructive" }))
//                 .finally(() => setIsLoading(false));
//         }
//     }, [applicationId, open, toast]);

//     const getStatusBadge = (status: string) => {
//         const statusMap: Record<string, string> = {
//             'Pending Manager Approval': 'bg-yellow-100 text-yellow-800',
//             'Pending HR Approval': 'bg-orange-100 text-orange-800',
//             'Approved': 'bg-blue-100 text-blue-800',
//             'Rejected': 'bg-red-100 text-red-800',
//             'Disbursed': 'bg-green-100 text-green-800',
//             'Closed': 'bg-gray-100 text-gray-800'
//         };
//         return <Badge className={statusMap[status] || ""}>{status}</Badge>;
//     }

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-2xl">
//                 <DialogHeader>
//                     {details ? (
//                         <>
//                             <DialogTitle>Application Details: {details.application_id_text} <Button className="ml-3" onClick={()=>{downloadLoanAgreement(details.id,details.application_id_text)}}><Download /></Button></DialogTitle>
//                             <DialogDescription>
//                                 Your application for a {details.loan_type_name}.
//                             </DialogDescription>
//                         </>
//                     ) : (
//                         <DialogTitle>Loading Details...</DialogTitle>
//                     )}
//                 </DialogHeader>
//                 <ScrollArea className="max-h-[70vh] p-4">
//                     {isLoading || !details ? (
//                         <div className="space-y-4">
//                             <Skeleton className="h-6 w-3/4" />
//                             <Skeleton className="h-4 w-1/2" />
//                             <div className="pt-4 border-t">
//                                 <Skeleton className="h-48 w-full" />
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4 text-sm">
//                                 <div><strong>Requested Amount:</strong> ${details.requested_amount.toLocaleString()}</div>
//                                 <div><strong>Approved Amount:</strong> ${details.approved_amount?.toLocaleString() || 'N/A'}</div>
//                                 <div><strong>Tenure:</strong> {details.tenure_months} months</div>
//                                 <div><strong>Interest Rate:</strong> {details.interest_rate}%</div>
//                                 <div className="col-span-2"><strong>Purpose:</strong> {details.purpose}</div>
//                                 <div className="col-span-2"><strong>Status:</strong> {getStatusBadge(details.status)}</div>
//                                 {details.status === 'Rejected' && <div className="col-span-2"><strong>Reason:</strong> <span className="text-red-600">{details.rejection_reason}</span></div>}
                                
//                             </div>

//                             {details.amortization_schedule && details.amortization_schedule.length > 0 && (
//                                 <div className="pt-4 border-t">
//                                     <h3 className="font-semibold mb-2">Repayment Schedule</h3>
//                                     <Table>
//                                         <TableHeader><TableRow><TableHead>Due Date</TableHead><TableHead>EMI</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
//                                         <TableBody>
//                                             {details.amortization_schedule.map(row => (
//                                                 <TableRow key={row.id}>
//                                                     <TableCell>{new Date(row.due_date).toLocaleDateString()}</TableCell>
//                                                     <TableCell>${row.emi_amount}</TableCell>
                                                    
//                                                     <TableCell><Badge variant={row.status === 'Paid' ? 'default' : 'secondary'}>{row.status}</Badge></TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </ScrollArea>
//                 <DialogFooter>
//                     <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }

"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { downloadLoanAgreement, getLoanApplicationDetails, type LoanApplication } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { 
  Download, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Calendar,
  Percent,
  FileText,
  AlertCircle,
  TrendingUp
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

interface LoanDetailsDialogProps {
  applicationId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoanDetailsDialog({ applicationId, open, onOpenChange }: LoanDetailsDialogProps) {
  const { toast } = useToast()
  const [details, setDetails] = React.useState<LoanApplication | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDownloading, setIsDownloading] = React.useState(false)

  React.useEffect(() => {
    if (open && applicationId) {
      setIsLoading(true)
      getLoanApplicationDetails(applicationId)
        .then(setDetails)
        .catch(err => {
          toast({ 
            title: "Error", 
            description: `Could not load details: ${err.message}`, 
            variant: "destructive" 
          })
        })
        .finally(() => setIsLoading(false))
    }
  }, [applicationId, open, toast])

  const handleDownload = async () => {
    if (!details) return
    setIsDownloading(true)
    try {
      await downloadLoanAgreement(details.id, details.application_id_text)
      toast({ 
        title: "Success", 
        description: "Loan agreement downloaded successfully." 
      })
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: `Download failed: ${err.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Pending Manager Approval': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Pending HR Approval': { className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100', icon: Clock },
      'Approved': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
      'Disbursed': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Closed': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100', icon: CheckCircle }
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: Clock }
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  // Calculate repayment progress
  const repaymentProgress = React.useMemo(() => {
    if (!details?.amortization_schedule || details.amortization_schedule.length === 0) return 0
    const totalEMIs = details.amortization_schedule.length
    const paidEMIs = details.amortization_schedule.filter(row => row.status === 'Paid').length
    return (paidEMIs / totalEMIs) * 100
  }, [details])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          {details ? (
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="h-6 w-6" />
                    Loan Application Details
                  </DialogTitle>
                  <DialogDescription className="mt-2 flex items-center gap-2">
                    <span className="font-mono font-medium">{details.application_id_text}</span>
                    <span>·</span>
                    <span>{details.loan_type_name}</span>
                  </DialogDescription>
                </div>
                {/* <Button 
                  onClick={handleDownload} 
                  disabled={isDownloading}
                  variant="outline"
                  size="sm"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </Button> */}
              </div>
            </>
          ) : (
            <DialogTitle>Loading Details...</DialogTitle>
          )}
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          {isLoading || !details ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ) : (
            <div className="space-y-6 p-4">
              {/* Status Alert */}
              {details.status === 'Rejected' && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Application Rejected</AlertTitle>
                  <AlertDescription>
                    {details.rejection_reason || 'No reason provided'}
                  </AlertDescription>
                </Alert>
              )}

              {details.status === 'Disbursed' && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900 dark:text-green-100">Loan Disbursed</AlertTitle>
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Your loan has been successfully disbursed. Track your repayment schedule below.
                  </AlertDescription>
                </Alert>
              )}

              {/* Main Details Card */}
              <Card className="border-blue-200 dark:border-blue-900">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <DollarSign className="h-5 w-5" />
                    Loan Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <DollarSign className="h-4 w-4" />
                        Requested Amount
                      </div>
                      <div className="text-2xl font-bold">{formatAED(details.requested_amount)}</div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <CheckCircle className="h-4 w-4" />
                        Approved Amount
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {details.approved_amount ? formatAED(details.approved_amount) : 'Pending'}
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        Tenure
                      </div>
                      <div className="text-2xl font-bold">{details.tenure_months} months</div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Percent className="h-4 w-4" />
                        Interest Rate
                      </div>
                      <div className="text-2xl font-bold">{details.interest_rate}%</div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                        <FileText className="h-4 w-4" />
                        Purpose
                      </div>
                      <p className="text-sm bg-muted p-3 rounded-md">{details.purpose}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                        <AlertCircle className="h-4 w-4" />
                        Application Status
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(details.status)}
                        <span className="text-sm text-muted-foreground">
                          Applied on {new Date(details.created_at).toLocaleDateString('en-AE')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Repayment Schedule */}
              {details.amortization_schedule && details.amortization_schedule.length > 0 && (
                <Card className="border-green-200 dark:border-green-900">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                        <TrendingUp className="h-5 w-5" />
                        Repayment Schedule
                      </CardTitle>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {details.amortization_schedule.filter(r => r.status === 'Paid').length} / {details.amortization_schedule.length} EMIs Paid
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Repayment Progress</span>
                        <span className="font-medium">{Math.round(repaymentProgress)}%</span>
                      </div>
                      <Progress value={repaymentProgress} className="h-2" />
                    </div>

                    {/* Schedule Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Due Date</TableHead>
                            <TableHead>EMI Amount</TableHead>
                            <TableHead>Principal</TableHead>
                            <TableHead>Interest</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {details.amortization_schedule.map(row => (
                            <TableRow key={row.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">
                                {new Date(row.due_date).toLocaleDateString('en-AE', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </TableCell>
                              <TableCell className="font-mono font-medium">
                                {formatAED(row.emi_amount)}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {formatAED(row.principal_component)}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {formatAED(row.interest_component)}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={row.status === 'Paid' ? 'default' : 'secondary'}
                                  className={row.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                                >
                                  {row.status === 'Paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {row.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                                  {row.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
