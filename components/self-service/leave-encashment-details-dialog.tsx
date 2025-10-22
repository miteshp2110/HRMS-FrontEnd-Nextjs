// "use client"

// import * as React from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { type LeaveEncashmentRequest } from "@/lib/api";

// interface Props {
//     request: LeaveEncashmentRequest | null;
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// export function LeaveEncashmentDetailsDialog({ request, open, onOpenChange }: Props) {
    
//     if (!request) return null;

//     const getStatusBadge = (status: string) => {
//         const statusMap: Record<string, string> = {
//             'Pending': 'bg-yellow-100 text-yellow-800',
//             'Approved': 'bg-blue-100 text-blue-800',
//             'Processed': 'bg-green-100 text-green-800',
//             'Rejected': 'bg-red-100 text-red-800',
//         };
//         return <Badge className={statusMap[status] || ""}>{status}</Badge>;
//     }

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Encashment Request Details</DialogTitle>
//                     <DialogDescription>
//                         Details for your request submitted on {new Date(request.request_date).toLocaleDateString()}.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="space-y-4 py-4 text-sm">
//                     <div className="flex justify-between">
//                         <span className="text-muted-foreground">Status</span>
//                         {getStatusBadge(request.status)}
//                     </div>
//                     <div className="flex justify-between">
//                         <span className="text-muted-foreground">Days Encahsed</span>
//                         <span className="font-medium">{request.days_to_encash}</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span className="text-muted-foreground">Calculated Amount</span>
//                         <span className="font-medium">${Number(request.calculated_amount).toLocaleString()}</span>
//                     </div>
//                     {request.jv_number && (
//                          <div className="flex justify-between">
//                             <span className="text-muted-foreground">Journal Voucher #</span>
//                             <span className="font-medium">{request.jv_number}</span>
//                         </div>
//                     )}
//                     {request.status === 'Rejected' && request.rejection_reason && (
//                         <div className="pt-4 border-t">
//                             <p className="text-muted-foreground">Rejection Reason</p>
//                             <p className="text-red-600">{request.rejection_reason}</p>
//                         </div>
//                     )}
//                 </div>
//                 <DialogFooter>
//                     <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     )
// }

"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Calendar,
  FileText,
  AlertCircle,
  TrendingUp
} from "lucide-react"
import { type LeaveEncashmentRequest } from "@/lib/api"

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

interface Props {
  request: LeaveEncashmentRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeaveEncashmentDetailsDialog({ request, open, onOpenChange }: Props) {
  if (!request) return null

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Pending': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: Clock },
      'Approved': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: CheckCircle },
      'Processed': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Rejected': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle },
    }
    const { className, icon: Icon } = statusMap[status] || { className: '', icon: Clock }
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[80vh] overflow-x-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6" />
            Encashment Request Details
          </DialogTitle>
          <DialogDescription>
            Request submitted on {new Date(request.request_date).toLocaleDateString('en-AE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Alert */}
          {request.status === 'Rejected' && request.rejection_reason && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Request Rejected</AlertTitle>
              <AlertDescription>
                {request.rejection_reason}
              </AlertDescription>
            </Alert>
          )}

          {request.status === 'Processed' && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900 dark:text-green-100">Request Processed</AlertTitle>
              <AlertDescription className="text-green-800 dark:text-green-200">
                Your encashment has been successfully processed and the amount has been credited.
              </AlertDescription>
            </Alert>
          )}

          {request.status === 'Approved' && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900 dark:text-blue-100">Request Approved</AlertTitle>
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Your request has been approved and is being processed for payment.
              </AlertDescription>
            </Alert>
          )}

          {/* Main Details Card */}
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Encashment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <FileText className="h-4 w-4" />
                    Leave Type
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Request Date
                  </div>
                  <div className="text-lg font-semibold">
                    {new Date(request.request_date).toLocaleDateString('en-AE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="h-4 w-4" />
                    Days Encashed
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {request.days_to_encash} days
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    Amount
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatAED(request.calculated_amount)}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <AlertCircle className="h-4 w-4" />
                    Status
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                {request.jv_number && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      Journal Voucher Number
                    </div>
                    <div className="font-mono text-sm bg-muted p-3 rounded-md">
                      {request.jv_number}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employee Info */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Employee</div>
            <div className="font-medium">{request.employee_name}</div>
            <div className="text-xs text-muted-foreground mt-1">ID: {request.employee_id}</div>
          </div>
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
