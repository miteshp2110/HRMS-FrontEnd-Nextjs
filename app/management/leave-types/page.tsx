"use client"

import { MainLayout } from "@/components/main-layout"
import { LeaveTypesPage } from "@/components/management/leave-types-page"

export default function LeaveTypesManagementPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Leave Type Management</h1>
          <p className="text-muted-foreground">
            Define the types of leave available to employees and their default balances.
          </p>
        </div>
        <LeaveTypesPage />
      </div>
    </MainLayout>
  )
}