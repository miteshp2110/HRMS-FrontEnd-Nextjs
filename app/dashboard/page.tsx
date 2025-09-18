

// "use client"

// import { useEffect, useState } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { MainLayout } from "@/components/main-layout"
// import { getMyDashboardData, getAdminDashboardData, type MyDashboardData, type AdminDashboardData } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// // Personal Dashboard Widgets
// import { WelcomeWidget } from "@/components/dashboard/widgets/welcome-widget"
// import { AttendanceWidget } from "@/components/dashboard/widgets/attendance-widget"
// import { LeaveBalanceWidget } from "@/components/dashboard/widgets/leave-balance-widget"
// import { DocumentStatusWidget } from "@/components/dashboard/widgets/document-status-widget"
// import { AnnouncementsWidget } from "@/components/dashboard/widgets/announcements-widget"
// import { LoanStatusWidget } from "@/components/dashboard/widgets/loan-status-widget"
// import { OvertimeWidget } from "@/components/dashboard/widgets/overtime-widget"

// // Admin Dashboard Widgets
// import { Separator } from "@/components/ui/separator"
// import { AdminStatsWidget } from "@/components/dashboard/admin/admin-stats-widget"
// import { ExpiringDocumentsWidget } from "@/components/dashboard/admin/expiring-documents-widget"
// import { PendingApprovalsWidget } from "@/components/dashboard/admin/pending-approvals-widget"

// export default function DashboardPage() {
//   const { user, hasPermission } = useAuth()
//   const { toast } = useToast()
  
//   const [myData, setMyData] = useState<MyDashboardData | null>(null)
//   const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   const isManager = hasPermission("user.manage") || hasPermission("leaves.manage");

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       setIsLoading(true);
//       try {
//         const myDataPromise = getMyDashboardData();
//         let adminDataPromise = Promise.resolve(null as AdminDashboardData | null);

//         if (isManager) {
//             adminDataPromise = getAdminDashboardData();
//         }

//         const [myResult, adminResult] = await Promise.all([
//             myDataPromise.catch(e => { console.error("MyData fetch failed:", e); return null; }),
//             adminDataPromise.catch(e => { console.error("AdminData fetch failed:", e); return null; }),
//         ]);

//         if (!myResult) {
//             toast({ title: "Error", description: "Could not load your personal dashboard data.", variant: "destructive"});
//         }
        
//         setMyData(myResult);
//         setAdminData(adminResult);

//       } catch (error) {
//         console.error("Error fetching dashboard data:", error)
//         toast({ title: "Error", description: "A critical error occurred while loading the dashboard.", variant: "destructive"})
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchDashboardData()
//   }, [toast, isManager])

//   if (isLoading || !myData) {
//     return (
//       <MainLayout>
//         <div className="flex items-center justify-center h-full">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       </MainLayout>
//     )
//   }

//   return (
//     <MainLayout>
//       <div className="space-y-6">
        
//         <WelcomeWidget reportingManager={myData.reportingManager} />
//         {isManager && adminData && (
//           <>
                
//                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
//                     <AdminStatsWidget headcount={adminData.headcount} todayAttendance={adminData.todayAttendance} />
//                     {hasPermission('leaves.manage') && <PendingApprovalsWidget leaves={adminData.pendingLeaveApprovals} skills={adminData.pendingSkillRequests} loans={adminData.pendingLoanRequests} />}

//                     <div className="space-y-6">
                        
//                         {hasPermission('documents.manage') && <ExpiringDocumentsWidget documents={adminData.expiringDocuments} />}
//                     </div>
                    
//                 </div>
                
//             </>
//         )}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             <div className="lg:col-span-2 space-y-6">
//                 <AttendanceWidget attendanceData={myData.monthlyAttendance} />
//                 <OvertimeWidget pendingOvertime={myData.pendingOvertimeRequests} />
//             </div>
//             <div className="lg:col-span-1 space-y-6">
//                 <DocumentStatusWidget documentStatus={myData.documentStatus} />
//                 <AnnouncementsWidget 
//                     upcomingHoliday={myData.upcomingHoliday}
//                     upcomingLeave={myData.upcomingLeave}
//                 />
//                 <LeaveBalanceWidget leaveBalances={myData.leaveBalances} />
//                 <LoanStatusWidget ongoingLoans={myData.ongoingLoans} />
//             </div>
//         </div>
//       </div>
//     </MainLayout>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { getMyDashboardData, type MyDashboardData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Personal Dashboard Widgets
import { WelcomeWidget } from "@/components/dashboard/widgets/welcome-widget"
import { AttendanceWidget } from "@/components/dashboard/widgets/attendance-widget"
import { LeaveBalanceWidget } from "@/components/dashboard/widgets/leave-balance-widget"
import { DocumentStatusWidget } from "@/components/dashboard/widgets/document-status-widget"
import { AnnouncementsWidget } from "@/components/dashboard/widgets/announcements-widget"
import { LoanStatusWidget } from "@/components/dashboard/widgets/loan-status-widget"
import { OvertimeWidget } from "@/components/dashboard/widgets/overtime-widget"

export default function DashboardPage() {
  const { toast } = useToast()
  
  const [myData, setMyData] = useState<MyDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const myResult = await getMyDashboardData();
        
        if (!myResult) {
            toast({ title: "Error", description: "Could not load your personal dashboard data.", variant: "destructive"});
        }
        
        setMyData(myResult);

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({ title: "Error", description: "A critical error occurred while loading the dashboard.", variant: "destructive"})
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [toast])

  if (isLoading || !myData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        
        <WelcomeWidget reportingManager={myData.reportingManager} />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <AttendanceWidget attendanceData={myData.monthlyAttendance} />
                <OvertimeWidget pendingOvertime={myData.pendingOvertimeRequests} />
            </div>
            <div className="lg:col-span-1 space-y-6">
                <DocumentStatusWidget documentStatus={myData.documentStatus} />
                <AnnouncementsWidget 
                    upcomingHoliday={myData.upcomingHoliday}
                    upcomingLeave={myData.upcomingLeave}
                />
                <LeaveBalanceWidget leaveBalances={myData.leaveBalances} />
                <LoanStatusWidget ongoingLoans={myData.ongoingLoans} />
            </div>
        </div>
      </div>
    </MainLayout>
  )
}