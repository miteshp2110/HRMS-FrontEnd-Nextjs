"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type LeaveEncashmentRequest } from "@/lib/api";

interface Props {
    request: LeaveEncashmentRequest | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LeaveEncashmentDetailsDialog({ request, open, onOpenChange }: Props) {
    
    if (!request) return null;

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Approved': 'bg-blue-100 text-blue-800',
            'Processed': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800',
        };
        return <Badge className={statusMap[status] || ""}>{status}</Badge>;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Encashment Request Details</DialogTitle>
                    <DialogDescription>
                        Details for your request submitted on {new Date(request.request_date).toLocaleDateString()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        {getStatusBadge(request.status)}
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Days Encahsed</span>
                        <span className="font-medium">{request.days_to_encash}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Calculated Amount</span>
                        <span className="font-medium">${Number(request.calculated_amount).toLocaleString()}</span>
                    </div>
                    {request.jv_number && (
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Journal Voucher #</span>
                            <span className="font-medium">{request.jv_number}</span>
                        </div>
                    )}
                    {request.status === 'Rejected' && request.rejection_reason && (
                        <div className="pt-4 border-t">
                            <p className="text-muted-foreground">Rejection Reason</p>
                            <p className="text-red-600">{request.rejection_reason}</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}