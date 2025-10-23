// "use client"

// import * as React from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Check, X } from "lucide-react";
// import { approveLeaveEncashment, type LeaveEncashmentRequest } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// interface Props {
//     request: LeaveEncashmentRequest | null;
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     onSuccess: () => void;
// }

// export function LeaveEncashmentApprovalDialog({ request, open, onOpenChange, onSuccess }: Props) {
//     const { toast } = useToast();
//     const [rejectionReason, setRejectionReason] = React.useState('');

//     if (!request) return null;

//     const handleProcess = async (status: 'Approved' | 'Rejected') => {
//          if (status === 'Rejected' && !rejectionReason) {
//             toast({ title: "Validation Error", description: "Rejection reason is required.", variant: "destructive"});
//             return;
//         }

//         try {
//             await approveLeaveEncashment(request.id, { status, rejection_reason: rejectionReason });
//             toast({ title: "Success", description: "Request has been processed."});
//             onSuccess();
//             onOpenChange(false);
//         } catch (error: any) {
//             toast({ title: "Error", description: `Processing failed: ${error.message}`, variant: "destructive" });
//         }
//     }

//     return (
//          <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Review Encashment Request</DialogTitle>
//                     <DialogDescription>
//                         {request.employee_name} is requesting to encash {request.days_to_encash} days for an amount of ${Number(request.calculated_amount).toLocaleString()}.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="space-y-4 py-4">
//                     <div className="grid gap-2">
//                         <Label htmlFor="rejection_reason">Rejection Reason</Label>
//                         <Textarea id="rejection_reason" placeholder="Required if rejecting..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
//                     </div>
//                 </div>
//                 <DialogFooter>
//                     <Button variant="destructive" onClick={() => handleProcess('Rejected')}><X className="h-4 w-4 mr-2"/>Reject</Button>
//                     <Button onClick={() => handleProcess('Approved')}><Check className="h-4 w-4 mr-2"/>Approve</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     )
// }

"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2 } from "lucide-react";
import { approveLeaveEncashment, type LeaveEncashmentRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  request: LeaveEncashmentRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function formatAED(amount: number | string | null | undefined) {
  const n = typeof amount === "string" ? Number(amount) : amount ?? 0;
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 2,
  }).format(n);
}

export function LeaveEncashmentApprovalDialog({ request, open, onOpenChange, onSuccess }: Props) {
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [isApproving, setIsApproving] = React.useState(false);
  const [isRejecting, setIsRejecting] = React.useState(false);

  const isBusy = isApproving || isRejecting;

  const handleProcess = async (status: "Approved" | "Rejected") => {
    if (status === "Rejected" && !rejectionReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Rejection reason is required.",
        variant: "destructive",
      });
      return;
    }

    const setBusy = status === "Approved" ? setIsApproving : setIsRejecting;
    setBusy(true);
    try {
      await approveLeaveEncashment(request!.id, {
        status,
        rejection_reason: status === "Rejected" ? rejectionReason : "",
      });
      toast({ title: "Success", description: "Request has been processed." });
      setRejectionReason("");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Processing failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-busy={isBusy}>
        {request ? (
          <>
            <DialogHeader>
              <DialogTitle>Review Encashment Request</DialogTitle>
              <DialogDescription>
                {request.employee_name} is requesting to encash {request.days_to_encash} days for an amount of {formatAED(request.calculated_amount)}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="rejection_reason">Rejection Reason</Label>
                <Textarea
                  id="rejection_reason"
                  placeholder="Required if rejecting..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  disabled={isBusy}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => handleProcess("Rejected")}
                disabled={isBusy}
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </>
                )}
              </Button>
              <Button onClick={() => handleProcess("Approved")} disabled={isBusy}>
                {isApproving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Skeleton state while opening without a loaded request
          <>
            <DialogHeader>
              <DialogTitle>Review Encashment Request</DialogTitle>
              <div className="mt-1 space-y-2">
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Rejection Reason</Label>
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>
            <DialogFooter>
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
