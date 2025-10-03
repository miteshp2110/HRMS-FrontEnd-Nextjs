"use client"

import { MainLayout } from "@/components/main-layout";
import { AttendanceHeatmap } from "@/components/profile/attendance-heatmap";
import { MyAttendancePage } from "@/components/self-service/my-attendance-page";
import { useAuth } from "@/lib/auth-context";


export default function MyAttendancePageRoute() {
  const {user} = useAuth()
  return (
    <MainLayout>
      <AttendanceHeatmap employeeId={user?.id!} />
    </MainLayout>
  );
}