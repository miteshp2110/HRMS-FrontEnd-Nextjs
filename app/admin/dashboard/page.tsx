"use client"

import { AdminDashboardPage } from "@/components/dashboard/admin/admin-dashboard-page";
import { MainLayout } from "@/components/main-layout";


export default function AdminDashboard() {
  return (
    <MainLayout>
      <AdminDashboardPage/>
    </MainLayout>
  );
}

