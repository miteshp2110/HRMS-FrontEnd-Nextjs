"use client";
import { useEffect, useState } from "react";
import { getPendingLeaveApprovals, PendingLeaveApproval } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export function PendingLeaveApprovalWidget() {
  const [leaves, setLeaves] = useState<PendingLeaveApproval[]>([]);

  useEffect(() => {
    getPendingLeaveApprovals().then(setLeaves).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Leave Approvals</CardTitle>
        <CardDescription>Requests from your direct reports.</CardDescription>
      </CardHeader>
      <CardContent>
        {leaves.length === 0 ? (
          <p className="text-muted-foreground">No pending leave requests.</p>
        ) : (
          <ul className="space-y-4">
            {leaves.map((leave) => (
              <li key={leave.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={leave.profile_url || undefined} />
                    <AvatarFallback>{leave.employee_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{leave.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {leave.leave_type_name}: {format(new Date(leave.from_date), "MMM dd")} - {format(new Date(leave.to_date), "MMM dd")}
                    </p>
                  </div>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/management/leaves/${leave.id}`}>Review</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}