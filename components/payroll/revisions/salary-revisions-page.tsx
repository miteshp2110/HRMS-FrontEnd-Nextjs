"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevisionHistoryTab } from "./revision-history-tab";
import { AuditLogTab } from "./audit-log-tab";

interface SalaryRevisionsPageProps {
  employeeId: number;
}

export function SalaryRevisionsPage({ employeeId }: SalaryRevisionsPageProps) {
  return (
    <Tabs defaultValue="revisions">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="revisions">Revision History</TabsTrigger>
        <TabsTrigger value="audit">Audit Log</TabsTrigger>
      </TabsList>
      <TabsContent value="revisions">
        <RevisionHistoryTab employeeId={employeeId} />
      </TabsContent>
      <TabsContent value="audit">
        <AuditLogTab employeeId={employeeId} />
      </TabsContent>
    </Tabs>
  );
}