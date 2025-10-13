"use client";

import { useState, useEffect, useCallback } from "react";
import { cancelScheduledRevision, getEmployeeRevisions, SalaryRevision } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScheduleRevisionDialog } from "./schedule-revision-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RevisionHistoryTabProps {
  employeeId: number;
}

export function RevisionHistoryTab({ employeeId }: RevisionHistoryTabProps) {
  const { toast } = useToast();
  const [revisions, setRevisions] = useState<SalaryRevision[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRevisions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getEmployeeRevisions(employeeId);
      setRevisions(data);
    } catch (error) {
      toast({
        title: "Error fetching revisions",
        description: "Could not load the salary revision history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, toast]);

  useEffect(() => {
    fetchRevisions();
  }, [fetchRevisions]);

  const handleCancelRevision = async (revisionId: number) => {
    try {
      await cancelScheduledRevision(revisionId);
      toast({
        title: "Success",
        description: "The scheduled revision has been cancelled.",
      });
      fetchRevisions(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not cancel the revision. It may have already been processed.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Badge variant="default">Scheduled</Badge>;
      case "Applied":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Applied</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revision History</CardTitle>
        <ScheduleRevisionDialog
          employeeId={employeeId}
          onSuccess={fetchRevisions}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>New Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : revisions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No revision history found.
                </TableCell>
              </TableRow>
            ) : (
              revisions.map((rev) => (
                <TableRow key={rev.id}>
                  <TableCell>{rev.component_name}</TableCell>
                  <TableCell>
                    {format(new Date(rev.effective_date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>{rev.new_value}</TableCell>
                  <TableCell>{getStatusBadge(rev.status)}</TableCell>
                  <TableCell>{rev.reason}</TableCell>
                  <TableCell>{rev.created_by_name}</TableCell>
                  <TableCell className="text-right">
                    {rev.status === "Scheduled" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will cancel the scheduled salary revision. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Back</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelRevision(rev.id)}
                            >
                              Confirm Cancel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}