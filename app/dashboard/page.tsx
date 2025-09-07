"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { LeaveBalanceChart } from "@/components/dashboard/leave-balance-chart"
import { AttendanceSummary } from "@/components/dashboard/attendance-summary"
import { CompanyAttendanceChart } from "@/components/dashboard/company-attendance-chart"
import { HeadcountTrendsChart } from "@/components/dashboard/headcount-trends-chart"
import {
  getLeaveBalances,
  getMyAttendance,
  getDashboardStats,
  getHeadcountTrends,
  type LeaveBalance,
  type AttendanceRecord,
  type DashboardStats,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { user, hasPermission } = useAuth()
  const { toast } = useToast()
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [headcountTrends, setHeadcountTrends] = useState<Array<{ month: string; headcount: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  const isManager = hasPermission("leaves.manage") || hasPermission("attendance.manage") || hasPermission("user.manage")

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const promises = [
          getLeaveBalances(),
          getMyAttendance(),
          getDashboardStats(),
          getHeadcountTrends(),
        ];
        
        const [balances, attendance, stats, trends] = await Promise.all(
            promises.map(p => p.catch(e => {
                console.error("Dashboard API call failed:", e);
                return null; // Return null on error to not break Promise.all
            }))
        );

        if (Array.isArray(balances) && balances.length > 0 && "leave_type_name" in balances[0]) {
          setLeaveBalances(balances as LeaveBalance[]);
        }
        if (Array.isArray(attendance) && attendance.length > 0 && "attendance_date" in attendance[0]) {
          setAttendanceData(attendance as AttendanceRecord[]);
        }
        if (stats && typeof stats === "object" && !Array.isArray(stats)) setDashboardStats(stats as DashboardStats);
        if (
          Array.isArray(trends) &&
          trends.length > 0 &&
          typeof trends[0] === "object" &&
          "month" in trends[0] &&
          "headcount" in trends[0]
        ) {
          setHeadcountTrends(trends as Array<{ month: string; headcount: number }>);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({ title: "Error", description: "Could not load dashboard data.", variant: "destructive"})
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Welcome back, {user?.firstName || user?.email?.split("@")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground">Here's what's happening in your organization today.</p>
        </div>

        {/* Stats Cards */}
        {dashboardStats && <StatsCards stats={dashboardStats} showManagerStats={isManager} />}

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User-specific charts */}
          <LeaveBalanceChart data={leaveBalances} />
          <AttendanceSummary data={attendanceData} />

          {/* Manager/Admin charts */}
          {isManager && dashboardStats && (
            <>
              <CompanyAttendanceChart
                data={{
                  presentToday: dashboardStats.presentToday,
                  absentToday: dashboardStats.absentToday,
                  onLeaveToday: dashboardStats.onLeaveToday,
                }}
              />
              <HeadcountTrendsChart data={headcountTrends} />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}