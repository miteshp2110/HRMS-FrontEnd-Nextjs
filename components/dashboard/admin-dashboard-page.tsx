"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAdminDashboardData, type AdminDashboardData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

import { AdminStatsWidget } from "@/components/dashboard/admin/admin-stats-widget"
import { ExpiringDocumentsWidget } from "@/components/dashboard/admin/expiring-documents-widget"
import { PendingApprovalsWidget } from "@/components/dashboard/admin/pending-approvals-widget"
import { HeadcountChartWidget } from "@/components/dashboard/admin/headcount-chart-widget"
import { CompanyAttendanceChart } from "@/components/dashboard/company-attendance-chart"


export function AdminDashboardPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isManager = hasPermission("user.manage") || hasPermission("leaves.manage");

  useEffect(() => {
    const fetchAdminData = async () => {
      if(isManager) {
        setIsLoading(true);
        try {
          const data = await getAdminDashboardData();
          setAdminData(data);
        } catch (error) {
          console.error("Error fetching admin dashboard data:", error)
          toast({ title: "Error", description: "Could not load admin dashboard data.", variant: "destructive"})
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchAdminData()
  }, [isManager, toast])

  if (isLoading || !adminData) {
    return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <AdminStatsWidget headcount={adminData.headcount} todayAttendance={adminData.todayAttendance} />
            {hasPermission('leaves.manage') && <PendingApprovalsWidget leaves={adminData.pendingLeaveApprovals} skills={adminData.pendingSkillRequests} loans={adminData.pendingLoanRequests} />}
            <div className="space-y-6">
                {hasPermission('documents.manage') && <ExpiringDocumentsWidget documents={adminData.expiringDocuments} />}
            </div>
            <CompanyAttendanceChart data={{presentToday:adminData.todayAttendance.present,absentToday:adminData.todayAttendance.absent,onLeaveToday:adminData.todayAttendance.leave}} />
        </div>
    </div>
  )
}