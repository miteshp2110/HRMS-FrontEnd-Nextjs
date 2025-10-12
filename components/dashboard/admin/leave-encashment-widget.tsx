"use client";
import { useEffect, useState } from "react";
import { getPendingLeaveEncashment, PendingLeaveEncashment } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LeaveEncashmentWidget() {
  const [requests, setRequests] = useState<PendingLeaveEncashment[]>([]);

  useEffect(() => {
    getPendingLeaveEncashment().then(setRequests).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Encashment Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground">No pending leave encashment requests.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li key={req.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{req.employee_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {req.days_to_encash} days for ${req.calculated_amount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                <Badge variant={req.status === "Pending" ? "default" : "secondary"}>
                  {req.status}
                </Badge>
                 <Button asChild variant="secondary" size="sm">
                  <Link href="/management/leave-encashment">Review</Link>
                </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}