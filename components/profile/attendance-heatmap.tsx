
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AttendanceRecord, Holiday, AttendanceSummary } from "@/lib/api";
import {
  getEmployeeAttendance,
  getHolidays,
  getAttendanceSummary,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BarChart3,
  List,
  Info,
  AlertTriangle,
  Timer,
  Coffee,
  Zap,
  CheckCircle2,
  AlertCircle,
  Ban,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface EmployeeAttendanceTabProps {
  employeeId: number;
}

const SummaryCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: any;
  color: string;
  bgColor: string;
}) => (
  <div
    className={`p-4 rounded-lg border-l-4 ${color} ${bgColor} shadow-sm hover:shadow-md transition-shadow`}
  >
    <div className="flex items-center justify-between mb-2">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {title}
      </span>
    </div>
    <div className="text-2xl font-bold">
      {value}{" "}
      <span className="text-sm text-muted-foreground font-normal">{unit}</span>
    </div>
  </div>
);

const LegendItem = ({
  color,
  label,
  count,
  icon: Icon,
}: {
  color: string;
  label: string;
  count?: number;
  icon?: any;
}) => (
  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
    <div
      className={`w-4 h-4 rounded-md ${color} border border-white shadow-sm`}
    ></div>
    {Icon && <Icon className="h-3 w-3 text-muted-foreground" />}
    <span className="text-sm font-medium">{label}</span>
    {count !== undefined && (
      <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
        ({count})
      </span>
    )}
  </div>
);

const StatusBadge = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Present":
        return {
          variant: "default",
          className: "bg-emerald-500 hover:bg-emerald-600 text-white",
          icon: CheckCircle2,
        };
      case "Half-Day":
        return {
          variant: "secondary",
          className: "bg-amber-500 hover:bg-amber-600 text-white",
          icon: Coffee,
        };
      case "Absent":
        return {
          variant: "destructive",
          className: "bg-red-500 hover:bg-red-600 text-white",
          icon: XCircle,
        };
      case "Leave":
        return {
          variant: "outline",
          className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500",
          icon: Calendar,
        };
      case "Holiday":
        return {
          variant: "outline",
          className:
            "bg-purple-500 hover:bg-purple-600 text-white border-purple-500",
          icon: Calendar,
        };
      default:
        return {
          variant: "outline",
          className: "bg-gray-100 text-gray-600",
          icon: AlertTriangle,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.className} ${className} flex items-center gap-1`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
};

const OvertimeBadge = ({
  status,
  hours,
  className,
}: {
  status: "pending_approval" | "approved" | "rejected" | null;
  hours: string | null;
  className?: string;
}) => {
  if (!status || !hours || parseFloat(hours) <= 0) return null;

  const getOvertimeConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle2,
          label: "OT Approved",
        };
      case "pending_approval":
        return {
          className: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Clock,
          label: "OT Pending",
        };
      case "rejected":
        return {
          className: "bg-red-100 text-red-800 border-red-200",
          icon: Ban,
          label: "OT Rejected",
        };
      default:
        return {
          className: "bg-gray-100 text-gray-600",
          icon: Timer,
          label: "Overtime",
        };
    }
  };

  const config = getOvertimeConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className} flex items-center gap-1 text-xs`}
    >
      <Icon className="h-3 w-3" />
      {config.label} ({hours}h)
    </Badge>
  );
};

export function AttendanceHeatmap({ employeeId }: EmployeeAttendanceTabProps) {
  const { toast } = useToast();
  const [attendanceData, setAttendanceData] = React.useState<
    AttendanceRecord[]
  >([]);
  const [summary, setSummary] = React.useState<AttendanceSummary | null>(null);
  const [holidays, setHolidays] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("calendar");

  const fetchAttendanceAndHolidays = React.useCallback(
    async (year: number, month: number) => {
      setIsLoading(true);
      try {
        const [attendance, holidayData, summaryData] = await Promise.all([
          getEmployeeAttendance(employeeId, year, month),
          getHolidays(year),
          getAttendanceSummary(employeeId, year, month),
        ]);

        setAttendanceData(attendance);
        setSummary(summaryData);
        const holidaySet = new Set(
          holidayData.map((h) => h.holiday_date.split("T")[0])
        );
        setHolidays(holidaySet);
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load attendance data: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [employeeId, toast]
  );

  React.useEffect(() => {
    fetchAttendanceAndHolidays(selectedDate.year, selectedDate.month);
  }, [fetchAttendanceAndHolidays, selectedDate.year, selectedDate.month]);

  const attendanceMap = new Map(
    attendanceData.map((r) => [r.attendance_date.split("T")[0], r])
  );
  const daysInMonth = new Date(
    selectedDate.year,
    selectedDate.month,
    0
  ).getDate();
  const firstDay = new Date(
    selectedDate.year,
    selectedDate.month - 1,
    1
  ).getDay();
  const monthName = new Date(
    selectedDate.year,
    selectedDate.month - 1
  ).toLocaleString("default", { month: "long" });

  const getStatusColor = (status: string, hasOvertime?: boolean) => {
    const baseClasses =
      "transition-all duration-200 transform hover:scale-105 cursor-pointer border-2";

    switch (status) {
      case "Present":
        return `${baseClasses} bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm border-emerald-600 ${
          hasOvertime ? "ring-2 ring-yellow-400" : ""
        }`;
      case "Half-Day":
        return `${baseClasses} bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-amber-600`;
      case "Absent":
        return `${baseClasses} bg-red-500 hover:bg-red-600 text-white shadow-sm border-red-600`;
      case "Leave":
        return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white shadow-sm border-blue-600`;
      case "Holiday":
        return `${baseClasses} bg-purple-500 hover:bg-purple-600 text-white shadow-sm border-purple-600`;
      default:
        return `${baseClasses} bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600`;
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setSelectedDate((prev) => {
      if (direction === "prev") {
        return prev.month === 1
          ? { year: prev.year - 1, month: 12 }
          : { ...prev, month: prev.month - 1 };
      } else {
        return prev.month === 12
          ? { year: prev.year + 1, month: 1 }
          : { ...prev, month: prev.month + 1 };
      }
    });
  };

  const getStatusCounts = () => {
    const counts = {
      Present: 0,
      "Half-Day": 0,
      Absent: 0,
      Leave: 0,
      Holiday: 0,
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${selectedDate.year}-${String(
        selectedDate.month
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const record = attendanceMap.get(dateString);
      const isHoliday = holidays.has(dateString);

      let status: string;
      if (isHoliday) {
        status = "Holiday";
      } else if (record) {
        status = record.attendance_status;
      } else {
        status = "NoRecord"; // No record = Absent
      }

      if (status in counts) counts[status as keyof typeof counts]++;
    }

    return counts;
  };

  const statusCounts = getStatusCounts();
  const selectedRecord = selectedDay ? attendanceMap.get(selectedDay) : null;
  const selectedIsHoliday = selectedDay ? holidays.has(selectedDay) : false;

  // Calculate overtime summary
  const overtimeStats = React.useMemo(() => {
    const stats = {
      approved: { count: 0, hours: 0 },
      pending: { count: 0, hours: 0 },
      rejected: { count: 0, hours: 0 },
    };

    attendanceData.forEach((record) => {
      if (record.overtime_hours && parseFloat(record.overtime_hours) > 0) {
        const hours = parseFloat(record.overtime_hours);
        switch (record.overtime_status) {
          case "approved":
            stats.approved.count++;
            stats.approved.hours += hours;
            break;
          case "pending_approval":
            stats.pending.count++;
            stats.pending.hours += hours;
            break;
          case "rejected":
            stats.rejected.count++;
            stats.rejected.hours += hours;
            break;
        }
      }
    });

    return stats;
  }, [attendanceData]);

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="h-6 w-6 text-primary" />
                Attendance Dashboard
              </CardTitle>
              <CardDescription className="text-base">
                Interactive attendance tracking and analytics
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="h-10 w-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-xl font-bold min-w-[160px] text-center bg-primary/10 px-4 py-2 rounded-lg">
                {monthName} {selectedDate.year}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="h-10 w-10 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Color Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Info className="h-5 w-5" />
              Status Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <LegendItem
                color="bg-emerald-500"
                label="Present"
                count={statusCounts.Present}
                icon={CheckCircle2}
              />
              <LegendItem
                color="bg-amber-500"
                label="Half-Day"
                count={statusCounts["Half-Day"]}
                icon={Coffee}
              />
              <LegendItem
                color="bg-red-500"
                label="Absent"
                count={statusCounts.Absent}
                icon={XCircle}
              />
              <LegendItem
                color="bg-blue-500"
                label="Leave"
                count={statusCounts.Leave}
                icon={Calendar}
              />
              <LegendItem
                color="bg-purple-500"
                label="Holiday"
                count={statusCounts.Holiday}
                icon={Calendar}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary && (
          <>
            <SummaryCard
              title="Present Days"
              value={summary.present_days + summary.half_days}
              icon={CheckCircle}
              color="border-l-emerald-500"
              bgColor="bg-emerald-50 dark:bg-emerald-950"
            />
            <SummaryCard
              title="Late Arrivals"
              value={summary.late_days}
              icon={Clock}
              color="border-l-amber-500"
              bgColor="bg-amber-50 dark:bg-amber-950"
            />
            <SummaryCard
              title="Early Departures"
              value={summary.early_departures}
              icon={TrendingDown}
              color="border-l-orange-500"
              bgColor="bg-orange-50 dark:bg-orange-950"
            />
            <SummaryCard
              title="Short Hours"
              value={summary.total_short_hours}
              unit="hrs"
              icon={BarChart3}
              color="border-l-red-500"
              bgColor="bg-red-50 dark:bg-red-950"
            />
          </>
        )}
      </div>

      {/* Overtime Summary */}
      {(overtimeStats.approved.count > 0 ||
        overtimeStats.pending.count > 0 ||
        overtimeStats.rejected.count > 0) && (
        <Card className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Zap className="h-5 w-5" />
              Overtime Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="font-semibold text-emerald-800 dark:text-emerald-200">
                    {overtimeStats.approved.count} Approved
                  </div>
                  <div className="text-sm text-emerald-600">
                    {overtimeStats.approved.hours.toFixed(1)} hours
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-semibold text-amber-800 dark:text-amber-200">
                    {overtimeStats.pending.count} Pending
                  </div>
                  <div className="text-sm text-amber-600">
                    {overtimeStats.pending.hours.toFixed(1)} hours
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <Ban className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-semibold text-red-800 dark:text-red-200">
                    {overtimeStats.rejected.count} Rejected
                  </div>
                  <div className="text-sm text-red-600">
                    {overtimeStats.rejected.hours.toFixed(1)} hours
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger
            value="calendar"
            className="flex items-center gap-2 text-base"
          >
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="flex items-center gap-2 text-base"
          >
            <List className="h-4 w-4" />
            Detailed Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center text-sm font-bold text-muted-foreground py-3 bg-muted/50 rounded-lg"
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-14"></div>
                      ))}

                      {Array.from({ length: daysInMonth }).map(
                        (_, dayIndex) => {
                          const day = dayIndex + 1;
                          const dateString = `${selectedDate.year}-${String(
                            selectedDate.month
                          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          const record = attendanceMap.get(dateString);
                          const isHoliday = holidays.has(dateString);
                          const isSelected = selectedDay === dateString;

                          let status: string;
                          if (isHoliday) {
                            status = "Holiday";
                          } else if (record) {
                            status = record.attendance_status;
                          } else {
                            status = "NoRecord";
                          }

                          const hasOvertime =
                            record?.overtime_hours &&
                            parseFloat(record.overtime_hours) > 0;

                          return (
                            <button
                              key={day}
                              onClick={() => setSelectedDay(dateString)}
                              className={`h-14 text-sm font-medium rounded-lg ${getStatusColor(
                                status,
                                hasOvertime ? true : false
                              )} ${
                                isSelected
                                  ? "ring-4 ring-primary ring-offset-2"
                                  : ""
                              }`}
                              title={`${dateString}: ${status}${
                                hasOvertime
                                  ? ` (OT: ${record.overtime_hours}h)`
                                  : ""
                              }`}
                            >
                              <div className="flex flex-col items-center">
                                <span className="text-lg font-bold">{day}</span>
                                {hasOvertime && (
                                  <Zap className="h-3 w-3 text-yellow-300" />
                                )}
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Day Details Sidebar */}
            <Card className="border-2 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Day Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDay && selectedRecord ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {new Date(selectedDay).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Updated by: {selectedRecord.updated_by_name}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Status:
                        </span>
                        <StatusBadge
                          status={selectedRecord.attendance_status}
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Punch In:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedRecord.punch_in
                            ? new Date(
                                selectedRecord.punch_in
                              ).toLocaleTimeString()
                            : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Punch Out:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedRecord.punch_out
                            ? new Date(
                                selectedRecord.punch_out
                              ).toLocaleTimeString()
                            : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Hours Worked:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedRecord.hours_worked || 0}h
                        </span>
                      </div>

                      {selectedRecord.short_hours ? (
                        parseFloat(selectedRecord.short_hours) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Short Hours:
                            </span>
                            <Badge
                              variant="outline"
                              className="text-orange-600 border-orange-500"
                            >
                              -{selectedRecord.short_hours}h
                            </Badge>
                          </div>
                        )
                      ) : (
                        <></>
                      )}

                      {selectedRecord.is_late ||
                      selectedRecord.is_early_departure ? (
                        <div className="pt-2 border-t">
                          <div className="space-y-2">
                            {selectedRecord.is_late === 1 && (
                              <Badge
                                variant="outline"
                                className="text-amber-600 border-amber-500 w-full justify-center"
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Late Arrival
                              </Badge>
                            )}
                            {selectedRecord.is_early_departure === 1 && (
                              <Badge
                                variant="outline"
                                className="text-orange-600 border-orange-500 w-full justify-center"
                              >
                                <TrendingDown className="h-3 w-3 mr-1" />
                                Early Departure
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}

                      {/* Overtime Information */}
                      {selectedRecord.overtime_hours &&
                        parseFloat(selectedRecord.overtime_hours) > 0 && (
                          <div className="pt-2 border-t">
                            <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              Overtime Details
                            </h5>
                            <div className="space-y-2">
                              <OvertimeBadge
                                status={selectedRecord.overtime_status}
                                hours={selectedRecord.overtime_hours}
                                className="w-full justify-center"
                              />
                              {selectedRecord.overtime_processed_by && (
                                <p className="text-xs text-muted-foreground">
                                  Processed by:{" "}
                                  {selectedRecord.overtime_processed_by}
                                </p>
                              )}
                              {selectedRecord.overtime_status === "rejected" &&
                                selectedRecord.rejection_reason && (
                                  <>
                                    <TooltipProvider>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-red-700">
                                          Rejected
                                        </span>

                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            {/* use a button/span that forwards ref; button is safe */}
                                            <button
                                              className="p-0"
                                              aria-label="Show rejection reason"
                                            >
                                              <Info className="h-4 w-4 cursor-help" />
                                            </button>
                                          </TooltipTrigger>

                                          <TooltipContent className="max-w-xs p-2">
                                            <p className="text-xs">
                                              {selectedRecord.rejection_reason ??
                                                "No reason provided"}
                                            </p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </TooltipProvider>
                                  </>
                                )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ) : selectedIsHoliday ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                      Holiday
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedDay &&
                        new Date(selectedDay).toLocaleDateString()}
                    </p>
                  </div>
                ) : selectedDay ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200">
                      Absent
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      No attendance record for this day
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click on a day to view details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Punch In / Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status & Flags</TableHead>
                      <TableHead>Overtime</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No attendance records found for this month
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendanceData.map((r) => (
                        <TableRow key={r.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div>
                              <div>
                                {new Date(
                                  r.attendance_date
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Updated by: {r.updated_by_name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-green-600" />
                                <span>
                                  {r.punch_in
                                    ? new Date(r.punch_in).toLocaleTimeString()
                                    : "-"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-red-600" />
                                <span>
                                  {r.punch_out
                                    ? new Date(r.punch_out).toLocaleTimeString()
                                    : "-"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {r.hours_worked || 0}h
                              </div>
                              {r.short_hours &&
                                parseFloat(r.short_hours) > 0 && (
                                  <div className="text-xs text-orange-600">
                                    Short: {r.short_hours}h
                                  </div>
                                )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              <StatusBadge status={r.attendance_status} />
                              {r.is_late === 1 && (
                                <Badge
                                  variant="outline"
                                  className="text-amber-600 border-amber-500"
                                >
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Late
                                </Badge>
                              )}
                              {r.is_early_departure === 1 && (
                                <Badge
                                  variant="outline"
                                  className="text-orange-600 border-orange-500"
                                >
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                  Early Exit
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <OvertimeBadge
                                status={r.overtime_status}
                                hours={r.overtime_hours}
                              />
                              {r.overtime_status === "rejected" &&
                                r.rejection_reason && (
                                  <div
                                    className="text-xs text-red-600 max-w-[150px] truncate"
                                    title={r.rejection_reason}
                                  >
                                    Reason: {r.rejection_reason}
                                  </div>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
