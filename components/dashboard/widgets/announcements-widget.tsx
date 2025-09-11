"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PartyPopper, Plane } from "lucide-react"

interface AnnouncementsWidgetProps {
  upcomingHoliday?: { name: string; holiday_date: string } | null
  upcomingLeave?: { from_date: string; to_date: string } | null
}

export function AnnouncementsWidget({ upcomingHoliday, upcomingLeave }: AnnouncementsWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>Upcoming holidays and your approved time off.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingHoliday && (
            <div className="flex items-start gap-4">
                <div className="bg-purple-100 text-purple-700 p-3 rounded-full"><PartyPopper className="h-5 w-5"/></div>
                <div>
                    <p className="font-semibold">{upcomingHoliday.name}</p>
                    <p className="text-sm text-muted-foreground">Next holiday is on {new Date(upcomingHoliday.holiday_date).toLocaleDateString()}.</p>
                </div>
            </div>
        )}
         {upcomingLeave && (
            <div className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-700 p-3 rounded-full"><Plane className="h-5 w-5"/></div>
                <div>
                    <p className="font-semibold">Your Upcoming Leave</p>
                    <p className="text-sm text-muted-foreground">From {new Date(upcomingLeave.from_date).toLocaleDateString()} to {new Date(upcomingLeave.to_date).toLocaleDateString()}.</p>
                </div>
            </div>
        )}
        {!upcomingHoliday && !upcomingLeave && (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming events.</p>
        )}
      </CardContent>
    </Card>
  )
}