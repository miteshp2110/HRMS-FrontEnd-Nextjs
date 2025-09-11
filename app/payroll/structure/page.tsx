"use client"

import { MainLayout } from "@/components/main-layout"
import { SalaryStructureManagementPage } from "@/components/payroll/salary-structure-management-page"

export default function SalaryStructureManagementPageRoute() {
  return (
    <MainLayout>
      <SalaryStructureManagementPage />
    </MainLayout>
  )
}