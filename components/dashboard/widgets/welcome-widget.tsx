"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { User } from "lucide-react"

interface WelcomeWidgetProps {
  reportingManager?: string | null
}

export function WelcomeWidget({ reportingManager}: WelcomeWidgetProps) {
  const { user } = useAuth()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back, {user?.email || "User"}!</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-2">
            <User className="h-4 w-4"/> Reporting Manager: <strong>{reportingManager || "Not Assigned"}</strong>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}