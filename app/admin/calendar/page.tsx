"use client"

import { MainLayout } from "@/components/main-layout"
import { CompanyCalendarPage } from "@/components/admin/company-calendar-page"

export default function AdminCalendarPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Company Calendar</h1>
          <p className="text-muted-foreground">Manage holidays, events, and company-wide work schedules.</p>
        </div>
        <CompanyCalendarPage />
      </div>
    </MainLayout>
  )
}