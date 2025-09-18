"use client"

import { MainLayout } from "@/components/main-layout";
import { AdminDashboardPage } from "@/components/dashboard/admin-dashboard-page";

export default function AdminDashboard() {
  return (
    <MainLayout>
      <AdminDashboardPage />
    </MainLayout>
  );
}