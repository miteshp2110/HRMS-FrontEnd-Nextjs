
// "use client";

// import * as React from "react";
// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Clock,
//   UserPlus,
//   Filter,
//   Eye,
// } from "lucide-react";
// import type { LeaveBalance, LeaveRecord } from "@/lib/api";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { LeaveLedgerDialog } from "@/components/management/leave-ledger-dialog"; // Import the new dialog
// import { useParams } from "next/navigation";

// interface LeaveHistoryTabProps {
//   leaveBalances: LeaveBalance[];
//   leaveRecords: LeaveRecord[];
//   isLoading: boolean;
//   onDateChange: (startDate: string, endDate: string) => void;
// }

// export function LeaveHistoryTab({
//   leaveBalances,
//   leaveRecords,
//   isLoading,
//   onDateChange,
// }: LeaveHistoryTabProps) {
//   const params = useParams();
//   const employeeId = Number(params.id);
//   const [startDate, setStartDate] = React.useState("");
//   const [endDate, setEndDate] = React.useState("");
//   const [isLedgerOpen, setIsLedgerOpen] = useState(false);
//   const [selectedLeaveBalance, setSelectedLeaveBalance] = useState<LeaveBalance | null>(null);

//   React.useEffect(() => {
//     const today = new Date();
//     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     setStartDate(firstDayOfMonth.toISOString().split("T")[0]);
//     setEndDate(today.toISOString().split("T")[0]);
//   }, []);

//   const handleFilter = () => {
//     onDateChange(startDate, endDate);
//   };

//   const handleBalanceClick = (balance: LeaveBalance) => {
//     setSelectedLeaveBalance(balance);
//     setIsLedgerOpen(true);
//   };

//   const getStatusFromRecord = (
//     record: LeaveRecord
//   ): "approved" | "rejected" | "pending" => {
//     if (record.primary_status == false || record.secondry_status == false) {
//       return "rejected";
//     }
//     if (record.primary_status == true && record.secondry_status == true) {
//       return "approved";
//     }
//     return "pending";
//   };

//   const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
//     switch (status) {
//       case "approved":
//         return (
//           <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Approved
//           </Badge>
//         );
//       case "rejected":
//         return (
//           <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
//             <XCircle className="h-3 w-3 mr-1" />
//             Rejected
//           </Badge>
//         );
//       case "pending":
//         return (
//           <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
//             <Clock className="h-3 w-3 mr-1" />
//             Pending
//           </Badge>
//         );
//       default:
//         return <Badge variant="secondary">{status}</Badge>;
//     }
//   };

//   const calculateLeaveDays = (startDate: Date, endDate: Date) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//     return diffDays;
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Leave Balances</CardTitle>
//             <CardDescription>
//               Current available leave balances by type. Click any balance to view its ledger.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="text-center py-4">Loading balances...</div>
//             ) : leaveBalances.length === 0 ? (
//               <p className="text-muted-foreground text-center py-4">
//                 No leave balances found.
//               </p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {leaveBalances.map((balance) => (
//                   <Card key={balance.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleBalanceClick(balance)}>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                       <CardTitle className="text-sm font-medium">
//                         {balance.leave_type_name}
//                       </CardTitle>
//                       <Calendar className="h-4 w-4 text-muted-foreground" />
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-2xl font-bold">{balance.balance}</div>
//                       <p className="text-xs text-muted-foreground">
//                         days available
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Leave Application History</CardTitle>
//             <CardDescription>
//               View and filter leave requests submitted by this employee.
//             </CardDescription>
//             <div className="flex flex-col md:flex-row gap-4 pt-4">
//               <div className="grid gap-2 w-full">
//                 <Label htmlFor="start-date">Start Date</Label>
//                 <Input
//                   id="start-date"
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </div>
//               <div className="grid gap-2 w-full">
//                 <Label htmlFor="end-date">End Date</Label>
//                 <Input
//                   id="end-date"
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                 />
//               </div>
//               <div className="flex items-end">
//                 <Button onClick={handleFilter} className="w-full md:w-auto">
//                   <Filter className="h-4 w-4 mr-2" />
//                   Filter
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="text-center py-12">Loading records...</div>
//             ) : leaveRecords.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 text-center">
//                 <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">
//                   No Leave Records Found
//                 </h3>
//                 <p className="text-muted-foreground">
//                   No leave requests found for the selected date range.
//                 </p>
//               </div>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Leave Id</TableHead>
//                     <TableHead>Leave Type</TableHead>
//                     <TableHead>Dates</TableHead>
//                     <TableHead>Days</TableHead>
//                     <TableHead>Final Status</TableHead>
//                     <TableHead>Applied On</TableHead>
//                     <TableHead>Primary Approver</TableHead>
//                     <TableHead>Secondary Approver</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {leaveRecords.map((record) => (
//                     <TableRow key={record.id}>
//                       <TableCell className="font-medium">
//                         {record.full_leave_id}
//                       </TableCell>
//                       <TableCell className="font-medium">
//                         {record.leave_type_name}
//                       </TableCell>
//                       <TableCell>
//                         {new Date(record.from_date).toLocaleDateString()} -{" "}
//                         {new Date(record.to_date).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>
//                         {calculateLeaveDays(record.from_date, record.to_date)}
//                       </TableCell>
//                       <TableCell>
//                         {getStatusBadge(getStatusFromRecord(record))}
//                       </TableCell>
//                       <TableCell>
//                         {new Date(record.applied_date).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>
//                         {record.primary_approver_name || "N/A"}
//                       </TableCell>
//                       <TableCell>
//                         {record.secondary_approver_name || "N/A"}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//       <LeaveLedgerDialog 
//         employeeId={employeeId} 
//         leaveBalance={selectedLeaveBalance}
//         open={isLedgerOpen} 
//         onOpenChange={setIsLedgerOpen}
//       />
//     </>
//   );
// }

"use client";

import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  Filter,
  Eye,
} from "lucide-react";
import type { LeaveBalance, LeaveRecord } from "@/lib/api";
import { getHolidays, getWorkWeek } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LeaveLedgerDialog } from "@/components/management/leave-ledger-dialog";
import { redirect, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Updated interface to match API response
interface ApiWorkWeekDay {
  id?: number;
  day_of_week: string;
  is_working_day: number | boolean;
  created_at?: string;
  updated_at?: string;
  updated_by?: string | null;
}

interface LeaveHistoryTabProps {
  leaveBalances: LeaveBalance[];
  leaveRecords: LeaveRecord[];
  isLoading: boolean;
  onDateChange: (startDate: string, endDate: string) => void;
}

export function LeaveHistoryTab({
  leaveBalances,
  leaveRecords,
  isLoading,
  onDateChange,
}: LeaveHistoryTabProps) {
  const params = useParams();
  const employeeId = Number(params.id);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [selectedLeaveBalance, setSelectedLeaveBalance] = useState<LeaveBalance | null>(null);
  const [holidays, setHolidays] = React.useState<Date[]>([]);
  const [workWeek, setWorkWeek] = React.useState<ApiWorkWeekDay[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDayOfMonth.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  // Load holidays and work week data
  React.useEffect(() => {
    const loadStaticData = async () => {
      try {
        setDataLoading(true);
        const [holidaysData, workWeekData] = await Promise.all([
          getHolidays(new Date().getFullYear()),
          getWorkWeek()
        ]);
        
        setHolidays(holidaysData.map(h => new Date(h.holiday_date)));
        
        // Normalize the workWeek data to handle both boolean and number types
        const normalizedWorkWeek = workWeekData.map(day => ({
          ...day,
          is_working_day: typeof day.is_working_day === 'boolean' ? (day.is_working_day ? 1 : 0) : day.is_working_day
        }));
        setWorkWeek(normalizedWorkWeek);
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load holiday and work week data: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };

    loadStaticData();
  }, [toast]);

  const handleFilter = () => {
    onDateChange(startDate, endDate);
  };

  const handleBalanceClick = (balance: LeaveBalance) => {
    setSelectedLeaveBalance(balance);
    setIsLedgerOpen(true);
  };

  const getStatusFromRecord = (
    record: LeaveRecord
  ): "approved" | "rejected" | "pending" => {
    if (record.rejection_reason != null) return "rejected";
    if (record.primary_status && record.secondry_status) return "approved";
    return "pending";
  };

  const getStatusBadge = (status: "approved" | "rejected" | "pending") => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Enhanced leave days calculation that excludes holidays and non-working days
  const calculateLeaveDays = React.useCallback((startDate: Date | string, endDate: Date | string) => {
    if (dataLoading || workWeek.length === 0) {
      // Fallback to simple calculation while data is loading
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }

    let count = 0;
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    // Reset time to avoid timezone issues
    currentDate.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    while(currentDate <= lastDate) {
        const dayOfWeek = currentDate.getDay();
        
        // Check if it's a holiday
        const isHoliday = holidays.some(h => {
          const holidayDate = new Date(h);
          holidayDate.setHours(0, 0, 0, 0);
          return holidayDate.getTime() === currentDate.getTime();
        });
        
        // Handle both boolean and number types for is_working_day
        const workDayConfig = workWeek.find(d => 
          ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
          .indexOf(d.day_of_week) === dayOfWeek
        );
        const isWorkingDay = workDayConfig ? 
          (typeof workDayConfig.is_working_day === 'boolean' ? workDayConfig.is_working_day : workDayConfig.is_working_day === 1) : 
          true; // Default to working day if not configured
        
        // Only count if it's a working day and not a holiday
        if(!isHoliday && isWorkingDay) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  }, [holidays, workWeek, dataLoading]);

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Balances</CardTitle>
            <CardDescription>
              Current available leave balances by type. Click any balance to view its ledger.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading balances...</p>
                </div>
              </div>
            ) : leaveBalances.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No leave balances found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {leaveBalances.map((balance) => (
                  <Card 
                    key={balance.id} 
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${balance.balance === 0 ? "opacity-60" : ""}`}
                    onClick={() => handleBalanceClick(balance)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {balance.leave_type_name}
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{balance.balance}</div>
                      <p className="text-xs text-muted-foreground">
                        {balance.balance === 1 ? "day available" : "days available"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Application History</CardTitle>
            <CardDescription>
              View and filter leave requests submitted by this employee. Working days calculation excludes holidays and non-working days.
            </CardDescription>
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <div className="grid gap-2 w-full md:w-auto">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full md:w-auto"
                />
              </div>
              <div className="grid gap-2 w-full md:w-auto">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full md:w-auto"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleFilter} 
                  className="w-full md:w-auto"
                  variant="outline"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filter
                </Button>
              </div>
            </div>
            {dataLoading && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                Loading holiday and work schedule data for accurate calculations...
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading records...</p>
                </div>
              </div>
            ) : leaveRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Leave Records Found
                </h3>
                <p className="text-muted-foreground">
                  No leave requests found for the selected date range.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave ID</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Working Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied On</TableHead>
                      <TableHead>Primary Approver</TableHead>
                      <TableHead>Secondary Approver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRecords.map((record) => (
                      <TableRow  key={record.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link href={`/management/leaves/${record.id}`}>{record.full_leave_id || record.id}</Link>
                        </TableCell>
                        <TableCell className="font-medium">
                          {record.leave_type_name}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(record.from_date).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">to</div>
                            <div>{new Date(record.to_date).toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {calculateLeaveDays(record.from_date, record.to_date)}
                          </div>
                          {dataLoading && (
                            <div className="text-xs text-muted-foreground">Calculating...</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(getStatusFromRecord(record))}
                        </TableCell>
                        <TableCell>
                          {new Date(record.applied_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {record.primary_approver_name || "Not assigned"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {record.secondary_approver_name || "Not assigned"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <LeaveLedgerDialog 
        employeeId={employeeId} 
        leaveBalance={selectedLeaveBalance}
        open={isLedgerOpen} 
        onOpenChange={setIsLedgerOpen}
      />
    </>
  );
}