// "use client";
// import { useEffect, useState } from "react";
// import { getUserDashboardData, UserDashboardData } from "@/lib/api";
// import { WelcomeWidget } from "./user/welcome-widget";
// import { DocumentStatusWidget } from "./user/document-status-widget";
// import { UpcomingHolidayWidget } from "./user/upcoming-holiday-widget";
// import { MonthlyAttendanceWidget } from "./user/monthly-attendance-widget";
// import { UpcomingLeaveWidget } from "./user/upcoming-leave-widget";
// import { PendingRequestsWidget } from "./user/pending-requests-widget";
// import { OngoingLoansWidget } from "./user/ongoing-loans-widget";
// import { PendingCasesWidget } from "./user/pending-cases-widget";
// import { ShortcutsWidget } from "./user/shortcuts-widget";

// export function UserDashboardPage() {
//   const [data, setData] = useState<UserDashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getUserDashboardData();
//         console.log(response)
//         setData(response);
//       } catch (err) {
//         setError("Failed to fetch dashboard data.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!data) {
//     return <div>No data available.</div>;
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         <div className="lg:col-span-2 xl:col-span-3">
//           <WelcomeWidget user={data.user} />
//         </div>
//         <ShortcutsWidget />
//         <DocumentStatusWidget documentStatus={data.documentStatus} />
//         <UpcomingHolidayWidget upcomingHoliday={data.upcomingHoliday} />
//         <MonthlyAttendanceWidget monthlyAttendance={data.monthlyAttendance} />
//         <UpcomingLeaveWidget upcomingLeave={data.upcomingLeave} />
//         <PendingRequestsWidget myPendingRequests={data.myPendingRequests} />
//         <OngoingLoansWidget ongoingLoans={data.ongoingLoans} />
//         <PendingCasesWidget pendingCases={data.pendingCases} />
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { getUserDashboardData, UserDashboardData } from "@/lib/api";
import { WelcomeWidget } from "./user/welcome-widget";
import { DocumentStatusWidget } from "./user/document-status-widget";
import { UpcomingHolidayWidget } from "./user/upcoming-holiday-widget";
import { MonthlyAttendanceWidget } from "./user/monthly-attendance-widget";
import { UpcomingLeaveWidget } from "./user/upcoming-leave-widget";
import { PendingRequestsWidget } from "./user/pending-requests-widget";
import { OngoingLoansWidget } from "./user/ongoing-loans-widget";
import { PendingCasesWidget } from "./user/pending-cases-widget";
import { ShortcutsWidget } from "./user/shortcuts-widget";

export function UserDashboardPage() {
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserDashboardData();
        setData(response);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-destructive font-semibold">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-muted-foreground">
        No data available.
      </div>
    );
  }

  return (
    <div className="p-1 md:p-1 max-w-full  space-y-6">
      {/* Top horizontal layout: Shortcuts left, Welcome right */}
      <div className="flex flex-col md:flex-row md:space-x-6 items-start">
        {/* Shortcuts in a compact vertical column with fixed width */}
        {/* <div className="w-full md:w-48 flex-shrink-0">
          <ShortcutsWidget />
        </div> */}
        {/* Welcome fills remaining space, horizontal compact */}
        <div className="flex-1 mt-4 md:mt-0">
          <WelcomeWidget user={data.user} />
        </div>
      </div>

      {/* Below top row, grid layout in 2 columns on md+ for other widgets */}
        <ShortcutsWidget/>
        <MonthlyAttendanceWidget monthlyAttendance={data.monthlyAttendance} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <DocumentStatusWidget documentStatus={data.documentStatus} />
        <PendingRequestsWidget myPendingRequests={data.myPendingRequests} pendingApprovals={data.pendingApprovals} />
        <UpcomingHolidayWidget upcomingHoliday={data.upcomingHoliday} />
        <UpcomingLeaveWidget upcomingLeave={data.upcomingLeave} />
        <OngoingLoansWidget ongoingLoans={data.ongoingLoans} />
        <PendingCasesWidget pendingCases={data.pendingCases} />
      </div>
    </div>
  )
}
