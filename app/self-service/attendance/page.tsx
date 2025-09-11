"use client"

import { MainLayout } from "@/components/main-layout";
import { MyAttendancePage } from "@/components/self-service/my-attendance-page";

export default function MyAttendancePageRoute() {
  return (
    <MainLayout>
      <MyAttendancePage />
    </MainLayout>
  );
}