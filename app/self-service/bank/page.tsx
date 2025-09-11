"use client"

import { MainLayout } from "@/components/main-layout";
import { MyBankDetailsPage } from "@/components/self-service/my-bank-details-page";

export default function MyBankDetailsPageRoute() {
    return (
        <MainLayout>
            <div className="space-y-6">
                 <div>
                    <h1 className="text-3xl font-bold">My Bank Details</h1>
                    <p className="text-muted-foreground">Manage the bank account where you receive your salary.</p>
                </div>
                <MyBankDetailsPage />
            </div>
        </MainLayout>
    )
}