
// "use client"

// import * as React from "react"
// import { useParams } from "next/navigation"
// import { MainLayout } from "@/components/main-layout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { CheckCircle, Handshake, Receipt, Loader2 } from "lucide-react"
// import { getSettlementDetails, approveSettlement, recordEosPayment, type EosSettlementDetails } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
// import { LeaveEncashmentCard } from "@/components/admin/eos/LeaveEncashmentCard"
// import { GratuityCard } from "@/components/admin/eos/GratuityCard"
// import { DeductionsCard } from "@/components/admin/eos/DeductionsCard"

// // Format number as AED currency
// const formatAED = (amount: number | string) => {
//   const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
//   return new Intl.NumberFormat('en-AE', {
//     style: 'currency',
//     currency: 'AED',
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(numAmount)
// }

// // Skeleton for page header
// function PageHeaderSkeleton() {
//   return (
//     <div className="space-y-2">
//       <Skeleton className="h-9 w-96" />
//       <div className="flex items-center gap-4">
//         <Skeleton className="h-5 w-48" />
//         <Skeleton className="h-6 w-24" />
//       </div>
//     </div>
//   )
// }

// // Skeleton for breakdown cards
// function BreakdownCardSkeleton() {
//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <Skeleton className="h-6 w-48" />
//           <Skeleton className="h-8 w-32" />
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         {[...Array(3)].map((_, i) => (
//           <div key={i} className="flex justify-between items-center">
//             <Skeleton className="h-4 w-40" />
//             <Skeleton className="h-4 w-24" />
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   )
// }

// // Skeleton for summary card
// function SummaryCardSkeleton() {
//   return (
//     <Card>
//       <CardHeader>
//         <Skeleton className="h-6 w-32" />
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex justify-between">
//           <Skeleton className="h-6 w-32" />
//           <Skeleton className="h-6 w-28" />
//         </div>
//         <div className="flex justify-between">
//           <Skeleton className="h-6 w-32" />
//           <Skeleton className="h-6 w-28" />
//         </div>
//         <Skeleton className="h-px w-full my-4" />
//         <div className="flex justify-between">
//           <Skeleton className="h-7 w-36" />
//           <Skeleton className="h-7 w-32" />
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // Full page skeleton
// function SettlementDetailSkeleton() {
//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <PageHeaderSkeleton />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           <div className="lg:col-span-2 space-y-6">
//             <BreakdownCardSkeleton />
//             <BreakdownCardSkeleton />
//             <BreakdownCardSkeleton />
//           </div>
//           <div className="space-y-6">
//             <SummaryCardSkeleton />
//             <Card>
//               <CardHeader>
//                 <Skeleton className="h-6 w-24" />
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-10 w-full" />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   )
// }

// export default function SettlementDetailPage() {
//   const params = useParams()
//   const settlementId = Number(params.id)
//   const { toast } = useToast()
  
//   const [settlement, setSettlement] = React.useState<EosSettlementDetails | null>(null)
//   const [isLoading, setIsLoading] = React.useState(true)
//   const [isApproving, setIsApproving] = React.useState(false)
//   const [isRecordingPayment, setIsRecordingPayment] = React.useState(false)
//   const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false)
//   const [jvNumber, setJvNumber] = React.useState('')

//   const fetchData = React.useCallback(async () => {
//     if (!settlementId) return
//     setIsLoading(true)
//     try {
//       const data = await getSettlementDetails(settlementId)
//       setSettlement(data)
//     } catch (error: any) {
//       toast({ 
//         title: "Error", 
//         description: `Could not load settlement details: ${error.message}`, 
//         variant: "destructive" 
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }, [settlementId, toast])

//   React.useEffect(() => {
//     fetchData()
//   }, [fetchData])

//   const handleApprove = async () => {
//     if (!window.confirm("Are you sure you want to approve this settlement? This action cannot be undone.")) return
    
//     setIsApproving(true)
//     try {
//       await approveSettlement(settlementId)
//       toast({ 
//         title: "Success", 
//         description: "Settlement has been approved." 
//       })
//       fetchData()
//     } catch(error: any) {
//       toast({ 
//         title: "Error", 
//         description: `Approval failed: ${error.message}`, 
//         variant: "destructive" 
//       })
//     } finally {
//       setIsApproving(false)
//     }
//   }

//   const handleRecordPayment = async () => {
//     if (!jvNumber.trim()) {
//       toast({ 
//         title: "Error", 
//         description: "JV Number is required.", 
//         variant: "destructive" 
//       })
//       return
//     }
    
//     setIsRecordingPayment(true)
//     try {
//       await recordEosPayment(settlementId, { jv_number: jvNumber })
//       toast({ 
//         title: "Success", 
//         description: "Payment has been recorded." 
//       })
//       fetchData()
//       setIsPaymentDialogOpen(false)
//       setJvNumber('')
//     } catch(error: any) {
//       toast({ 
//         title: "Error", 
//         description: `Payment failed: ${error.message}`, 
//         variant: "destructive" 
//       })
//     } finally {
//       setIsRecordingPayment(false)
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     const statusMap: Record<string, { className: string; label: string }> = {
//       'Pending': { 
//         className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', 
//         label: 'Pending' 
//       },
//       'Approved': { 
//         className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', 
//         label: 'Approved' 
//       },
//       'Paid': { 
//         className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', 
//         label: 'Paid' 
//       },
//     }
    
//     const statusInfo = statusMap[status] || { 
//       className: 'bg-gray-100 text-gray-800', 
//       label: status 
//     }
    
//     return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
//   }

//   if (isLoading) {
//     return <SettlementDetailSkeleton />
//   }

//   if (!settlement) {
//     return (
//       <MainLayout>
//         <div className="flex flex-col items-center justify-center h-[60vh]">
//           <Handshake className="h-16 w-16 text-muted-foreground mb-4" />
//           <h2 className="text-2xl font-bold mb-2">Settlement Not Found</h2>
//           <p className="text-muted-foreground">
//             The settlement you're looking for doesn't exist or has been removed.
//           </p>
//         </div>
//       </MainLayout>
//     )
//   }

//   const canEditDeductions = settlement.status !== 'Paid'

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">
//               Final Settlement for {settlement.employee_name}
//             </h1>
//             <p className="text-muted-foreground flex items-center gap-4 mt-2">
//               <span>
//                 {settlement.termination_type} on{' '}
//                 {new Date(settlement.last_working_date).toLocaleDateString('en-AE', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </span>
//               {getStatusBadge(settlement.status)}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           <div className="lg:col-span-2 space-y-6">
//             <LeaveEncashmentCard 
//               breakdown={settlement.leave_encashment_breakdown} 
//               totalAmount={settlement.leave_encashment_amount}
//             />
            
//             <GratuityCard 
//               breakdown={settlement.gratuity_breakdown} 
//               totalAmount={settlement.gratuity_amount}
//             />
            
//             <DeductionsCard 
//               loanBreakdown={settlement.loan_deduction_breakdown}
//               caseBreakdown={settlement.case_deduction_breakdown}
//               otherDeductions={settlement.other_deductions}
//               settlementId={settlement.id}
//               canEdit={canEditDeductions}
//               onSuccess={fetchData}
//             />
//           </div>

//           <div className="space-y-6 lg:sticky lg:top-24">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Receipt className="h-5 w-5" />
//                   Final Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-lg">
//                 <div className="flex justify-between items-center">
//                   <span className="text-muted-foreground">Total Additions:</span>
//                   <span className="font-semibold text-green-600">
//                     {formatAED(settlement.total_additions)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-muted-foreground">Total Deductions:</span>
//                   <span className="font-semibold text-red-500">
//                     -{formatAED(settlement.total_deductions)}
//                   </span>
//                 </div>
//                 <hr className="my-2" />
//                 <div className="flex justify-between items-center text-xl pt-2">
//                   <strong>Net Settlement:</strong>
//                   <strong className="text-primary">
//                     {formatAED(settlement.net_settlement_amount)}
//                   </strong>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Actions</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {settlement.status === 'Pending' && (
//                   <Button 
//                     className="w-full" 
//                     onClick={handleApprove}
//                     disabled={isApproving}
//                   >
//                     {isApproving ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Approving...
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircle className="h-4 w-4 mr-2" />
//                         Approve Settlement
//                       </>
//                     )}
//                   </Button>
//                 )}
                
//                 {settlement.status === 'Approved' && (
//                   <Button 
//                     className="w-full" 
//                     onClick={() => setIsPaymentDialogOpen(true)}
//                   >
//                     <Receipt className="h-4 w-4 mr-2" />
//                     Record Payment
//                   </Button>
//                 )}
                
//                 {settlement.status === 'Paid' && (
//                   <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
//                     <div className="flex items-center gap-2 mb-2">
//                       <CheckCircle className="h-5 w-5 text-green-600" />
//                       <p className="font-semibold text-green-800 dark:text-green-300">
//                         Payment Completed
//                       </p>
//                     </div>
//                     <p className="text-sm text-green-700 dark:text-green-400">
//                       <strong>JV Number:</strong> {settlement.jv_number}
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Record Payment</DialogTitle>
//             <DialogDescription>
//               Enter the Journal Voucher (JV) number for this transaction.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="jv_number">JV Number *</Label>
//               <Input 
//                 id="jv_number" 
//                 value={jvNumber} 
//                 onChange={e => setJvNumber(e.target.value)}
//                 placeholder="Enter JV number"
//                 disabled={isRecordingPayment}
//                 required
//               />
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button 
//               variant="outline" 
//               onClick={() => {
//                 setIsPaymentDialogOpen(false)
//                 setJvNumber('')
//               }}
//               disabled={isRecordingPayment}
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleRecordPayment}
//               disabled={isRecordingPayment || !jvNumber.trim()}
//             >
//               {isRecordingPayment ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Recording...
//                 </>
//               ) : (
//                 'Save Payment'
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </MainLayout>
//   )
// }



"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Handshake, Receipt, Loader2, Trash2, AlertTriangle, FileText, MessageSquare } from "lucide-react"
import { getSettlementDetails, approveSettlement, recordEosPayment, deleteSettlement, type EosSettlementDetails } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { LeaveEncashmentCard } from "@/components/admin/eos/LeaveEncashmentCard"
import { GratuityCard } from "@/components/admin/eos/GratuityCard"
import { DeductionsCard } from "@/components/admin/eos/DeductionsCard"

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

// Skeleton for page header
function PageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9 w-96" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  )
}

// Skeleton for breakdown cards
function BreakdownCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Skeleton for summary card
function SummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-28" />
        </div>
        <Skeleton className="h-px w-full my-4" />
        <div className="flex justify-between">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-7 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}

// Full page skeleton
function SettlementDetailSkeleton() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <BreakdownCardSkeleton />
            <BreakdownCardSkeleton />
            <BreakdownCardSkeleton />
          </div>
          <div className="space-y-6">
            <SummaryCardSkeleton />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function SettlementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const settlementId = Number(params.id)
  const { toast } = useToast()
  
  const [settlement, setSettlement] = React.useState<EosSettlementDetails | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isApproving, setIsApproving] = React.useState(false)
  const [isRecordingPayment, setIsRecordingPayment] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [jvNumber, setJvNumber] = React.useState('')

  const fetchData = React.useCallback(async () => {
    if (!settlementId) return
    setIsLoading(true)
    try {
      const data = await getSettlementDetails(settlementId)
      setSettlement(data)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Could not load settlement details: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [settlementId, toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this settlement? This action cannot be undone.")) return
    
    setIsApproving(true)
    try {
      await approveSettlement(settlementId)
      toast({ 
        title: "Success", 
        description: "Settlement has been approved." 
      })
      fetchData()
    } catch(error: any) {
      toast({ 
        title: "Error", 
        description: `Approval failed: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleRecordPayment = async () => {
    if (!jvNumber.trim()) {
      toast({ 
        title: "Error", 
        description: "JV Number is required.", 
        variant: "destructive" 
      })
      return
    }
    
    setIsRecordingPayment(true)
    try {
      await recordEosPayment(settlementId, { jv_number: jvNumber })
      toast({ 
        title: "Success", 
        description: "Payment has been recorded." 
      })
      fetchData()
      setIsPaymentDialogOpen(false)
      setJvNumber('')
    } catch(error: any) {
      toast({ 
        title: "Error", 
        description: `Payment failed: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsRecordingPayment(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteSettlement(settlementId)
      toast({ 
        title: "Success", 
        description: "Settlement has been deleted." 
      })
      setIsDeleteDialogOpen(false)
      router.push('/admin/eos')
    } catch(error: any) {
      toast({ 
        title: "Error", 
        description: `Deletion failed: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; label: string }> = {
      'Pending': { 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', 
        label: 'Pending' 
      },
      'Approved': { 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', 
        label: 'Approved' 
      },
      'Paid': { 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', 
        label: 'Paid' 
      },
    }
    
    const statusInfo = statusMap[status] || { 
      className: 'bg-gray-100 text-gray-800', 
      label: status 
    }
    
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
  }

  if (isLoading) {
    return <SettlementDetailSkeleton />
  }

  if (!settlement) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Handshake className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Settlement Not Found</h2>
          <p className="text-muted-foreground">
            The settlement you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </MainLayout>
    )
  }

  const canEditDeductions = settlement.status !== 'Paid'
  const canDelete = settlement.status !== 'Paid'

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Final Settlement for {settlement.employee_name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-4 mt-2">
              <span>
                {settlement.termination_type} on{' '}
                {new Date(settlement.last_working_date).toLocaleDateString('en-AE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {getStatusBadge(settlement.status)}
            </p>
          </div>
          {canDelete && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Settlement
            </Button>
          )}
        </div>

        {/* Termination Reason Alert */}
        {settlement.termination_reason && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Termination Reason:
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                  {settlement.termination_reason}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column - Breakdown Cards */}
          <div className="lg:col-span-2 space-y-6">
            <LeaveEncashmentCard 
              breakdown={settlement.leave_encashment_breakdown} 
              totalAmount={settlement.leave_encashment_amount}
            />
            
            <GratuityCard 
              breakdown={settlement.gratuity_breakdown} 
              totalAmount={settlement.gratuity_amount}
            />
            
            <DeductionsCard 
              loanBreakdown={settlement.loan_deduction_breakdown}
              caseBreakdown={settlement.case_deduction_breakdown}
              otherDeductions={settlement.other_deductions}
              settlementId={settlement.id}
              canEdit={canEditDeductions}
              onSuccess={fetchData}
            />

            {/* Notes Card - Bottom of Left Column */}
            {settlement.notes && (
              <Card className="border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                    <MessageSquare className="h-5 w-5" />
                    Notes
                  </CardTitle>
                  <CardDescription>
                    Additional information about this settlement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                    <p className="text-sm text-blue-900 dark:text-blue-200 whitespace-pre-wrap">
                      {settlement.notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary and Actions */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Final Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-lg">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Additions:</span>
                  <span className="font-semibold text-green-600">
                    {formatAED(settlement.total_additions)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Deductions:</span>
                  <span className="font-semibold text-red-500">
                    -{formatAED(settlement.total_deductions)}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center text-xl pt-2">
                  <strong>Net Settlement:</strong>
                  <strong className="text-primary">
                    {formatAED(settlement.net_settlement_amount)}
                  </strong>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {settlement.status === 'Pending' && (
                  <Button 
                    className="w-full" 
                    onClick={handleApprove}
                    disabled={isApproving}
                  >
                    {isApproving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Settlement
                      </>
                    )}
                  </Button>
                )}
                
                {settlement.status === 'Approved' && (
                  <Button 
                    className="w-full" 
                    onClick={() => setIsPaymentDialogOpen(true)}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                )}
                
                {settlement.status === 'Paid' && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="font-semibold text-green-800 dark:text-green-300">
                        Payment Completed
                      </p>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      <strong>JV Number:</strong> {settlement.jv_number}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes Card - Right Column (Alternative Position) */}
            {/* Uncomment if you prefer notes in the sidebar instead
            {settlement.notes && (
              <Card className="border-blue-200 dark:border-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-200">
                    <MessageSquare className="h-5 w-5" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                    <p className="text-sm text-blue-900 dark:text-blue-200 whitespace-pre-wrap">
                      {settlement.notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            */}
          </div>
        </div>
      </div>

      {/* Record Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Enter the Journal Voucher (JV) number for this transaction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid gap-2">
              <Label htmlFor="jv_number">JV Number *</Label>
              <Input 
                id="jv_number" 
                value={jvNumber} 
                onChange={e => setJvNumber(e.target.value)}
                placeholder="Enter JV number"
                disabled={isRecordingPayment}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPaymentDialogOpen(false)
                setJvNumber('')
              }}
              disabled={isRecordingPayment}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRecordPayment}
              disabled={isRecordingPayment || !jvNumber.trim()}
            >
              {isRecordingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                'Save Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Settlement
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this settlement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Warning:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All settlement calculations will be permanently deleted</li>
                  <li>This settlement record will be removed from the system</li>
                  <li>Employee: <strong>{settlement.employee_name}</strong></li>
                  <li>Amount: <strong>{formatAED(settlement.net_settlement_amount)}</strong></li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Settlement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
