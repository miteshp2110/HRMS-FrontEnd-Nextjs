"use client"

import { MainLayout } from "@/components/main-layout"
import { DocumentManagementPage } from "@/components/admin/document-management-page"

export default function AdminManageDocumentsPage() {
  return (
    <MainLayout>
        <DocumentManagementPage />
    </MainLayout>
  )
}
