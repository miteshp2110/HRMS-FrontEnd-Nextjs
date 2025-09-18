// "use client"

// import * as React from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { type UserAudit } from "@/lib/api"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import Link from "next/link"
// import { Link2 } from "lucide-react"

// interface AuditHistoryDialogProps {
//   auditHistory: UserAudit[]
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// export function AuditHistoryDialog({ auditHistory, open, onOpenChange }: AuditHistoryDialogProps) {
//     const [timezone, setTimezone] = React.useState('UTC');

//     React.useEffect(() => {
//         const savedTimezone = localStorage.getItem("selectedTimezone");
//         if (savedTimezone) {
//             setTimezone(savedTimezone);
//         }
//     }, []);
    
//     const formatTimestamp = (timestamp: string) => {
//         return new Date(timestamp).toLocaleString(undefined, { timeZone: timezone });
//     }

//     const groupedHistory = React.useMemo(() => {
//         const groups: { [key: string]: { updated_by_name: string, updated_at: string, changes: UserAudit[] ,updated_by:number} } = {};
//         auditHistory.forEach(log => {
//             const key = `${log.updated_by_name}-${log.updated_at}`;
//             if (!groups[key]) {
//                 groups[key] = {
//                     updated_by_name: log.updated_by_name,
//                     updated_at: log.updated_at,
//                     changes: [],
//                     updated_by : log.updated_by
//                 };
//             }
//             groups[key].changes.push(log);
//         });
//         return Object.values(groups);
//     }, [auditHistory]);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-3xl">
//         <DialogHeader>
//           <DialogTitle>Audit History</DialogTitle>
//           <DialogDescription>
//             Changes made to this user's profile.
//           </DialogDescription>
//         </DialogHeader>
//         <ScrollArea className="max-h-[60vh] max-w-[60vw] p-4 overflow-x-scroll">
//             <div className="space-y-6">
//                 {groupedHistory.map((group, index) => (
//                     <div key={index} className="p-4 border rounded-lg">
//                         <div className="flex justify-between items-center mb-4">
//                             <div>
//                                 <p className="font-semibold">Updated By: <Link href={`/directory/${group.updated_by}`}>{group.updated_by_name}</Link></p>
//                                 <p className="text-sm text-muted-foreground">{formatTimestamp(group.updated_at)}</p>
//                             </div>
//                         </div>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Field Changed</TableHead>
//                                     <TableHead>Old Value</TableHead>
//                                     <TableHead>New Value</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {group.changes.map(change => (
//                                     <TableRow key={change.audit_id}>
//                                         <TableCell>{change.field_changed}</TableCell>
//                                         <TableCell>{change.old_value}</TableCell>
//                                         <TableCell>{change.new_value}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 ))}
//             </div>
//         </ScrollArea>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type UserAudit } from "@/lib/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface AuditHistoryDialogProps {
  auditHistory: UserAudit[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuditHistoryDialog({
  auditHistory,
  open,
  onOpenChange,
}: AuditHistoryDialogProps) {
  const [timezone, setTimezone] = React.useState("UTC")

  React.useEffect(() => {
    const savedTimezone = localStorage.getItem("selectedTimezone")
    if (savedTimezone) {
      setTimezone(savedTimezone)
    }
  }, [])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(undefined, { timeZone: timezone })
  }

  const groupedHistory = React.useMemo(() => {
    const groups: {
      [key: string]: {
        updated_by_name: string
        updated_at: string
        changes: UserAudit[]
        updated_by: number
      }
    } = {}
    auditHistory.forEach((log) => {
      const key = `${log.updated_by_name}-${log.updated_at}`
      if (!groups[key]) {
        groups[key] = {
          updated_by_name: log.updated_by_name,
          updated_at: log.updated_at,
          changes: [],
          updated_by: log.updated_by,
        }
      }
      groups[key].changes.push(log)
    })
    return Object.values(groups)
  }, [auditHistory])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Audit History</DialogTitle>
          <DialogDescription>
            Changes made to this user&apos;s profile.
          </DialogDescription>
        </DialogHeader>

        {/* vertical scroll for long history */}
        <ScrollArea className="max-h-[65vh] pr-2">
          <div className="space-y-6">
            {groupedHistory.map((group, index) => (
              <div key={index} className="p-4 border rounded-lg bg-background">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">
                      Updated By:{" "}
                      <Link
                        href={`/directory/${group.updated_by}`}
                        className="text-primary hover:underline"
                      >
                        {group.updated_by_name}
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatTimestamp(group.updated_at)}
                    </p>
                  </div>
                </div>

                {/* keep table inside container, prevent overflow */}
                <div className="overflow-x-auto max-w-full">
                  <Table className="table-fixed w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4">Field Changed</TableHead>
                        <TableHead className="w-1/3">Old Value</TableHead>
                        <TableHead className="w-1/3">New Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.changes.map((change) => (
                        <TableRow key={change.audit_id}>
                          <TableCell className="break-words whitespace-pre-wrap">
                            {change.field_changed}
                          </TableCell>
                          <TableCell className="break-words whitespace-pre-wrap">
                            {change.old_value}
                          </TableCell>
                          <TableCell className="break-words whitespace-pre-wrap">
                            {change.new_value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
