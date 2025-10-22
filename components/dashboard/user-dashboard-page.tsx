
"use client"

import { useEffect, useState } from "react"
import { getUserDashboardData, UserDashboardData } from "@/lib/api"
import { WelcomeWidget } from "./user/welcome-widget"
import { DocumentStatusWidget } from "./user/document-status-widget"
import { UpcomingHolidayWidget } from "./user/upcoming-holiday-widget"
import { MonthlyAttendanceWidget } from "./user/monthly-attendance-widget"
import { UpcomingLeaveWidget } from "./user/upcoming-leave-widget"
import { PendingRequestsWidget } from "./user/pending-requests-widget"
import { OngoingLoansWidget } from "./user/ongoing-loans-widget"
import { PendingCasesWidget } from "./user/pending-cases-widget"
import { ShortcutsWidget } from "./user/shortcuts-widget"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Skeleton Components
function WelcomeWidgetSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ShortcutsWidgetSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function AttendanceWidgetSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function StandardWidgetSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="p-1 md:p-1 max-w-full space-y-6">
      {/* Welcome Widget Skeleton */}
      <div className="flex flex-col md:flex-row md:space-x-6 items-start">
        <div className="flex-1 mt-4 md:mt-0">
          <WelcomeWidgetSkeleton />
        </div>
      </div>

      {/* Shortcuts Widget Skeleton */}
      <ShortcutsWidgetSkeleton />

      {/* Monthly Attendance Widget Skeleton */}
      <AttendanceWidgetSkeleton />

      {/* Grid of Other Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <StandardWidgetSkeleton />
        <StandardWidgetSkeleton />
        <StandardWidgetSkeleton />
        <StandardWidgetSkeleton />
        <StandardWidgetSkeleton />
        <StandardWidgetSkeleton />
      </div>
    </div>
  )
}

export function UserDashboardPage() {
  const [data, setData] = useState<UserDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserDashboardData()
        setData(response)
      } catch (err) {
        setError("Failed to fetch dashboard data.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No data available.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-1 md:p-1 max-w-full space-y-6">
      {/* Top horizontal layout: Shortcuts left, Welcome right */}
      <div className="flex flex-col md:flex-row md:space-x-6 items-start">
        {/* Welcome fills remaining space, horizontal compact */}
        <div className="flex-1 mt-4 md:mt-0">
          <WelcomeWidget user={data.user} />
        </div>
      </div>

      {/* Shortcuts and Attendance Widgets */}
      <ShortcutsWidget />
      <MonthlyAttendanceWidget monthlyAttendance={data.monthlyAttendance} />

      {/* Below top row, grid layout in 2 columns on md+ for other widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <DocumentStatusWidget documentStatus={data.documentStatus} />
        <PendingRequestsWidget 
          myPendingRequests={data.myPendingRequests} 
          pendingApprovals={data.pendingApprovals} 
        />
        <UpcomingHolidayWidget upcomingHoliday={data.upcomingHoliday} />
        <UpcomingLeaveWidget upcomingLeave={data.upcomingLeave} />
        <OngoingLoansWidget ongoingLoans={data.ongoingLoans} />
        <PendingCasesWidget pendingCases={data.pendingCases} />
      </div>
    </div>
  )
}
