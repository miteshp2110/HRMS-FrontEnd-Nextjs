"use client"

import { MainLayout } from "@/components/main-layout";
import { MySkillsPage } from "@/components/self-service/my-skills-page";

export default function MySkillsPageRoute() {
    return (
        <MainLayout>
            <MySkillsPage />
        </MainLayout>
    )
}