"use client"

import { MainLayout } from "@/components/main-layout"
import { JobsPage } from "@/components/admin/jobs-page"

export default function AdminJobsPage() {
  return (
    <MainLayout>
      <JobsPage />
    </MainLayout>
  )
}
