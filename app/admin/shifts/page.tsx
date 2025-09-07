"use client"

import { MainLayout } from "@/components/main-layout"
import { ShiftsPage } from "@/components/admin/shifts-page"

export default function AdminShiftsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Shifts Management</h1>
          <p className="text-muted-foreground">Manage work shifts and schedules for your organization.</p>
        </div>
        <ShiftsPage />
      </div>
    </MainLayout>
  )
}