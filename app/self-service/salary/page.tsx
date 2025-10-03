"use client"

import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { MySalaryPage } from "@/components/self-service/my-salary-page"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function MySalaryPageRoute() {
  const { user } = useAuth();

  // This check ensures that even if a user navigates here directly,
  // they won't see the content unless the visibility flag is true.
  if (!user?.salary_visibility) {
      console.log(user)
      return (
          <MainLayout>
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Access Denied</AlertTitle>
                  <AlertDescription>You do not have permission to view this page. Please contact HR.</AlertDescription>
              </Alert>
          </MainLayout>
      )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Salary (Under Patch)</h1>
          <p className="text-muted-foreground">A detailed breakdown of your current salary structure.</p>
        </div>
        <MySalaryPage />
      </div>
    </MainLayout>
  )
}