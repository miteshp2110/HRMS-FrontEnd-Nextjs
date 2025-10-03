"use client"

import { MainLayout } from "@/components/main-layout";
import { AttendanceHeatmap } from "@/components/profile/attendance-heatmap";
import { MyAttendancePage } from "@/components/self-service/my-attendance-page";


export default function MyAttendancePageRoute() {
  return (
    <MainLayout>
      <AttendanceHeatmap employeeId={4} />
    </MainLayout>
  );
}