"use client"

import { MainLayout } from "@/components/main-layout"
import { DocumentTypesPage } from "@/components/admin/document-types-page"

export default function AdminDocumentsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Document Types</h1>
          <p className="text-muted-foreground">Manage the types of documents employees can upload.</p>
        </div>
        <DocumentTypesPage />
      </div>
    </MainLayout>
  )
}