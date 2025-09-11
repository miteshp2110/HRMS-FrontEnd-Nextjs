"use client"

import { MainLayout } from "@/components/main-layout"
import { PayrollRunsPage } from "@/components/payroll/payroll-runs-page"

export default function PayrollRunsPageRoute() {
  return (
    <MainLayout>
        <PayrollRunsPage />
    </MainLayout>
    )
}