"use client"

import { MainLayout } from "@/components/main-layout";
import { MyLoansPage } from "@/components/self-service/my-loans-page";

export default function MyLoansPageRoute() {
    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                <h1 className="text-3xl font-bold">My Loans</h1>
                <p className="text-muted-foreground">Manage your loan applications and view history.</p>
                </div>
                <MyLoansPage />
            </div>
        </MainLayout>
    )
}