
"use client";

import { useState, useEffect } from "react";
import { AttendanceAuditLog, getAttendanceAudit } from "@/lib/api";
import { format } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AttendanceAuditDialogProps {
  recordId: number;
}

function groupByTime(logs: AttendanceAuditLog[]) {
  const map = new Map<string, AttendanceAuditLog[]>();
  logs.forEach((log) => {
    // Group by down-to-the-second timestamp string
    const key = new Date(log.changedAt).toISOString().slice(0, 19);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(log);
  });
  // Sort outer groups by time descending, then sort inner logs by id
  const sorted = Array.from(map.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([time, logs]) => ({
      time,
      logs: logs.sort((a, b) => a.id - b.id),
    }));
  return sorted;
}

export function AttendanceAuditDialog({ recordId }: AttendanceAuditDialogProps) {
  const [auditLogs, setAuditLogs] = useState<AttendanceAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchAuditLogs = async () => {
        setIsLoading(true);
        try {
          const data = await getAttendanceAudit(recordId);
          setAuditLogs(data);
        } catch (error) {
          console.error("Failed to fetch attendance audit logs:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAuditLogs();
    }
  }, [isOpen, recordId]);

  const grouped = groupByTime(
    // sort initially to guarantee stable order
    (auditLogs || []).sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Attendance Audit Trail</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          {isLoading ? (
            <div className="space-y-4 mt-8">
              {Array.from({ length: 2 }).map((_,i)=>(
                <div key={i} className="rounded-lg border bg-card p-4 shadow animate-pulse flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-36" />
                  </div>
                </div>
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-muted-foreground text-sm">
              No changes have been recorded.
            </div>
          ) : (
            <div className="space-y-8 mt-2">
            {grouped.map(({ time, logs }, idx) => {
              const first = logs[0];
              
              const timezone = localStorage.getItem('selectedTimezone') ?? 'UTC';

const date = new Date(time);
console.log(date.toISOString())
const options: Intl.DateTimeFormatOptions = {
  year: "numeric",           // ✅ must be "numeric" or "2-digit"
  month: "short",            // ✅ "numeric" | "2-digit" | "narrow" | "short" | "long"
  day: "2-digit",            // ✅ "2-digit" | "numeric"
  hour: "2-digit",           // ✅ "2-digit" | "numeric"
  minute: "2-digit",         // ✅ "2-digit" | "numeric"
  second: "2-digit",         // ✅ "2-digit" | "numeric"
  hour12: true,
  timeZone: timezone
};


const prettyTime = new Intl.DateTimeFormat("en-GB", options).format(date);
console.log(prettyTime)
              return (
                <div key={time+idx} className="border rounded-lg bg-background shadow p-4 overflow-x-auto flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-gray-600">Changed by</span>
                      <span className="font-semibold">{first.changedBy}</span>
                      {first.isBulkUpdate && (
                        <Badge variant="secondary" className="text-xs">Bulk Update</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{prettyTime}</span>
                  </div>

                  {/* Ledger Table or Reason Box */}
                  {logs.length === 1 && logs[0].fieldChanged.toLowerCase().includes('reason') ? (
                    <div className="rounded bg-muted/70 border px-4 py-3 text-sm">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                        Reason
                      </div>
                      <div className="whitespace-pre-wrap text-base font-medium">{logs[0].newValue}</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table className="text-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Field</TableHead>
                            <TableHead>Old Value</TableHead>
                            <TableHead>New Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {logs.map((log) => {
                            if(log.fieldChanged === 'Update Reason'){
                                return (
                                    (
                            <TableRow key={log.id}>
                              <TableCell className="font-medium">{log.fieldChanged}</TableCell>
                              {/* <TableCell className="max-w-[180px] overflow-hidden whitespace-normal break-words text-muted-foreground">{log.oldValue}</TableCell> */}
                              <TableCell colSpan={2} className="max-w-[200px] overflow-hidden whitespace-normal break-words text-center ">{log.newValue}</TableCell>
                            </TableRow>
                          )
                                )
                            }
                            else{
                                return ((
                            <TableRow key={log.id}>
                              <TableCell className="font-medium">{log.fieldChanged}</TableCell>
                              <TableCell className="max-w-[180px] overflow-hidden whitespace-normal break-words text-muted-foreground">{log.oldValue}</TableCell>
                              <TableCell className="max-w-[200px] overflow-hidden whitespace-normal break-words ">{log.newValue}</TableCell>
                            </TableRow>
                          ))
                            }
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

