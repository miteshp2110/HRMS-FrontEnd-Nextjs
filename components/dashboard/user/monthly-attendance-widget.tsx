
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Coffee,
} from "lucide-react";

interface MonthlyAttendanceWidgetProps {
  monthlyAttendance: {
    total_days: number;
    present_days: number;
    absent_days: number;
    leave_days: number;
    total_hours_worked: string;
    approved_overtime: string;
    rejected_overtime: string;
  };
}

export function MonthlyAttendanceWidget({
  monthlyAttendance,
}: MonthlyAttendanceWidgetProps) {
  const attendancePercentage = (
    (monthlyAttendance.present_days / monthlyAttendance.total_days) *
    100
  ).toFixed(1);

  const getAttendanceStatus = () => {
    const percentage = parseFloat(attendancePercentage);
    if (percentage >= 95) return { text: "Excellent", color: "text-green-600", bg: "bg-green-500" };
    if (percentage >= 85) return { text: "Good", color: "text-blue-600", bg: "bg-blue-500" };
    if (percentage >= 75) return { text: "Average", color: "text-orange-600", bg: "bg-orange-500" };
    return { text: "Needs Improvement", color: "text-red-600", bg: "bg-red-500" };
  };

  const status = getAttendanceStatus();

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Monthly Attendance</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Your attendance overview for this month
              </CardDescription>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className={`${status.color} border-current font-semibold px-3 py-1`}
          >
            {status.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Attendance Progress Circle */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Attendance Rate
            </h4>
            <span className="text-2xl font-bold text-foreground">
              {attendancePercentage}%
            </span>
          </div>
          
          <Progress 
            value={parseFloat(attendancePercentage)} 
            className="h-3 bg-muted"
          />
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>0%</span>
            <span>Target: 95%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Present Days */}
          <div className="relative group">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 hover:border-green-500/40 transition-all shadow-sm">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 tabular-nums">
                  {monthlyAttendance.present_days}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Present
                </p>
              </div>
            </div>
          </div>

          {/* Absent Days */}
          <div className="relative group">
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 hover:border-red-500/40 transition-all shadow-sm">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 tabular-nums">
                  {monthlyAttendance.absent_days}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Absent
                </p>
              </div>
            </div>
          </div>

          {/* Leave Days */}
          <div className="relative group">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all shadow-sm">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 tabular-nums">
                  {monthlyAttendance.leave_days}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  On Leave
                </p>
              </div>
            </div>
          </div>

          {/* Total Days */}
          <div className="relative group">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-sm">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 tabular-nums">
                  {monthlyAttendance.total_days}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Total Days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hours & Overtime Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Working Hours
            </h4>
          </div>

          <div className="space-y-3">
            {/* Total Hours Worked */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all border border-transparent hover:border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Total Hours Worked
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Regular working hours
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {monthlyAttendance.total_hours_worked}
                </p>
                <p className="text-xs text-muted-foreground">hours</p>
              </div>
            </div>

            {/* Overtime Stats */}
            <div className="grid grid-cols-2 gap-3">
              {/* Approved OT */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-all">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Approved OT
                    </p>
                    <p className="text-lg font-bold text-green-600 tabular-nums">
                      {monthlyAttendance.approved_overtime??0} Hrs
                    </p>
                  </div>
                </div>
              </div>

              {/* Rejected OT */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-all">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Rejected OT
                    </p>
                    <p className="text-lg font-bold text-red-600 tabular-nums">
                      {monthlyAttendance.rejected_overtime??0} Hrs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className={`p-4 rounded-lg border ${
          parseFloat(attendancePercentage) >= 95 
            ? "bg-green-500/5 border-green-500/20" 
            : parseFloat(attendancePercentage) >= 85
            ? "bg-blue-500/5 border-blue-500/20"
            : "bg-orange-500/5 border-orange-500/20"
        }`}>
          <p className={`text-sm font-medium text-center ${status.color}`}>
            {parseFloat(attendancePercentage) >= 95 
              ? "🎉 Outstanding attendance! Keep up the excellent work!"
              : parseFloat(attendancePercentage) >= 85
              ? "👍 Good attendance record. Maintain your consistency!"
              : parseFloat(attendancePercentage) >= 75
              ? "⚠️ Your attendance needs attention. Try to improve!"
              : "❗ Critical: Please focus on improving your attendance."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
