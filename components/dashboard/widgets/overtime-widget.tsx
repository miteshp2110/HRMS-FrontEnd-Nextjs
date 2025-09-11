"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Timer } from "lucide-react"
import Link from "next/link"

interface OvertimeRequest {
  attendance_date: string
  hours_worked: string
}

interface OvertimeWidgetProps {
  pendingOvertime: OvertimeRequest[]
}

export function OvertimeWidget({ pendingOvertime }: OvertimeWidgetProps) {
    if(pendingOvertime.length === 0) return null;

    const request = pendingOvertime[0];
    const overtimeHours = Number(request.hours_worked) - 8; // Assuming 8 hour shift

    return (
        <Card className="bg-yellow-50 border-yellow-300">
            <CardHeader>
                <CardTitle className="text-yellow-800">Pending Overtime Approval</CardTitle>
                <CardDescription className="text-yellow-700">You have overtime requests that need manager approval.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <div>
                    <p className="font-semibold text-black">{new Date(request.attendance_date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">{overtimeHours.toFixed(2)} extra hours</p>
                </div>
                <Button asChild variant="secondary">
                    <Link href="/self-service/attendance">View Details</Link>
                </Button>
            </CardContent>
        </Card>
    )
}