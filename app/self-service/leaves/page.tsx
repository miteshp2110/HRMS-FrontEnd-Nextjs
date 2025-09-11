"use client"

import { MainLayout } from "@/components/main-layout";
import { MyLeavesPage } from "@/components/self-service/my-leaves-page";

export default function MyLeavesPageRoute() {
    return (
        <MainLayout>
            <MyLeavesPage />
        </MainLayout>
    )
}