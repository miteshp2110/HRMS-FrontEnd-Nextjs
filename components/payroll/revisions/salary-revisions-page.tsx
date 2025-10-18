// "use client";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { RevisionHistoryTab } from "./revision-history-tab";
// import { AuditLogTab } from "./audit-log-tab";

// interface SalaryRevisionsPageProps {
//   employeeId: number;
// }

// export function SalaryRevisionsPage({ employeeId }: SalaryRevisionsPageProps) {
//   return (
//     <Tabs defaultValue="revisions">
//       <TabsList className="grid w-full grid-cols-2">
//         <TabsTrigger value="revisions">Revision History</TabsTrigger>
//         <TabsTrigger value="audit">Audit Log</TabsTrigger>
//       </TabsList>
//       <TabsContent value="revisions">
//         <RevisionHistoryTab employeeId={employeeId} />
//       </TabsContent>
//       <TabsContent value="audit">
//         <AuditLogTab employeeId={employeeId} />
//       </TabsContent>
//     </Tabs>
//   );
// }

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Eye } from "lucide-react"
import { RevisionHistoryTab } from "./revision-history-tab"
import { AuditLogTab } from "./audit-log-tab"

interface SalaryRevisionsPageProps {
  employeeId: number
}

export function SalaryRevisionsPage({ employeeId }: SalaryRevisionsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Salary Revisions & Audit Trail</h2>
        <p className="text-muted-foreground">Schedule future changes and view complete history</p>
      </div>

      <Tabs defaultValue="revisions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revisions" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Revision History
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>
        <TabsContent value="revisions">
          <RevisionHistoryTab employeeId={employeeId} />
        </TabsContent>
        <TabsContent value="audit">
          <AuditLogTab employeeId={employeeId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
