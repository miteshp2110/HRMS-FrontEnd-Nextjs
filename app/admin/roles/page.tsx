"use client"

import { MainLayout } from "@/components/main-layout"
import { RolesPermissionsPage } from "@/components/admin/roles-permissions-page"

export default function AdminRolesPage() {
  return (
    <MainLayout>
      <RolesPermissionsPage />
    </MainLayout>
  )
}
