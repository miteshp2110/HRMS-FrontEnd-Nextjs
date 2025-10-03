"use client"

import { MainLayout } from "@/components/main-layout"
import { MyExpensesPage } from "@/components/self-service/my-expenses-page"

export default function SelfServiceExpenses() {
    return (
        <MainLayout>
            <MyExpensesPage />
        </MainLayout>
    )
}