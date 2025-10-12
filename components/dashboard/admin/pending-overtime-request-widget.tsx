"use client";
import { useEffect, useState } from "react";
import { getPendingOvertimeRequests, PendingOvertimeRequest } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PendingOvertimeRequestWidget() {
  const [overtime, setOvertime] = useState<PendingOvertimeRequest[]>([]);

  useEffect(() => {
    getPendingOvertimeRequests().then(setOvertime).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Overtime Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {overtime.length === 0 ? (
          <p className="text-muted-foreground">No pending overtime requests.</p>
        ) : (
          <ul className="space-y-4">
            {overtime.map((ot) => (
              <li key={ot.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={ot.profile_url || undefined} />
                    <AvatarFallback>{ot.employee_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{ot.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ot.overtime_hours} hours ({ot.overtime_type})
                    </p>
                  </div>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/management/attendance">Review</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}