"use client"

import { MainLayout } from "@/components/main-layout"
import { SkillsPage } from "@/components/admin/skills-page"

export default function AdminSkillsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Skills Library</h1>
          <p className="text-muted-foreground">Manage the skills and competencies available across the organization.</p>
        </div>
        <SkillsPage />
      </div>
    </MainLayout>
  )
}