"use client"

import { MainLayout } from "@/components/main-layout";
import { LeaveDetailPage } from "@/components/management/leave-detail-page";
import { useParams } from "next/navigation";

export default function LeaveApplicationDetailPage() {
    const params = useParams();
    const leaveId = Number(params.id);

    return (
        <MainLayout>
            <LeaveDetailPage leaveId={leaveId} />
        </MainLayout>
    );
}