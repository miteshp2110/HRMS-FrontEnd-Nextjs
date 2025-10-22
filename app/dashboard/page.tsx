

"use client";

import { UserDashboardPage } from "@/components/dashboard/user-dashboard-page";
import { MainLayout } from "@/components/main-layout";
import { useAuth } from "@/lib/auth-context";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  else{
    return (
        <MainLayout>
            <UserDashboardPage />;
        </MainLayout>
    )
  }
  // return <AdminDashboardPage />;
}