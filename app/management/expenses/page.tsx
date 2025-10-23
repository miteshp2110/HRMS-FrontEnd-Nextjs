

"use client"

import { MainLayout } from "@/components/main-layout";
import { ExpensesManagementPage } from "@/components/management/expenses-management-page";

export default function ManagementExpenses() {
    return (
        <MainLayout>
            <ExpensesManagementPage />
        </MainLayout>
    )
}