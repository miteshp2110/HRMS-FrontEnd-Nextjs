"use client";

import { useState, useEffect } from "react";
import { getSalaryStructureAudit, SalaryAuditLog } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AuditLogTabProps {
  employeeId: number;
}

export function AuditLogTab({ employeeId }: AuditLogTabProps) {
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<SalaryAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getSalaryStructureAudit(employeeId)
      .then(setAuditLogs)
      .catch(() => {
        toast({
          title: "Error fetching audit log",
          description: "Could not load the salary structure audit history.",
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  }, [employeeId, toast]);

  const renderChangeDescription = (log: SalaryAuditLog): string => {
    const changes = Object.keys(log.new_data).map(key => {
        const oldValue = log.old_data[key];
        const newValue = log.new_data[key];
        return `${key} from "${oldValue}" to "${newValue}"`;
    }).join(', ');

    return `${log.changed_by_name} changed ${changes}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Structure Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Description of Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : auditLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No audit history found.
                </TableCell>
              </TableRow>
            ) : (
              auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.changed_at), "dd MMM yyyy, hh:mm a")}
                  </TableCell>
                  <TableCell>{log.changed_by_name}</TableCell>
                  <TableCell>{renderChangeDescription(log)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}