"use client";
import { useEffect, useState } from "react";
import {  AttendanceStats, getAttendanceStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Plane } from "lucide-react";

export function AttendanceStatusWidget() {
  const [stats, setStats] = useState<AttendanceStats | null>(null);

  useEffect(() => {
    getAttendanceStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <Card>Loading...</Card>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <div className="flex items-center space-x-4">
          <Users className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <UserCheck className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Present</p>
            <p className="text-2xl font-bold">{stats.present}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <UserX className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Absent</p>
            <p className="text-2xl font-bold">{stats.absent}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Plane className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">On Leave</p>
            <p className="text-2xl font-bold">{stats.leave}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}