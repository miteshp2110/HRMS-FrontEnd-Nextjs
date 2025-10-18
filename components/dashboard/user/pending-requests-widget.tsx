

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronDown, ChevronUp, DollarSign, Clock, Wallet, CalendarDays } from "lucide-react";

interface PendingRequestsWidgetProps {
  myPendingRequests: {
    loans: { id: number; requested_amount: string; name: string }[];
    expenses: { id: number; title: string; amount: string }[];
    overtime: { id: number; overtime_hours: string; request_date: string }[];
  };
  pendingApprovals: {
    leaves: { id: number; fromDate:string;toDate:string; leave_type_name: string }[];
  };
}

export function PendingRequestsWidget({
  myPendingRequests,
  pendingApprovals,
}: PendingRequestsWidgetProps) {
  const [expandedSections, setExpandedSections] = useState({
    loans: true,
    expenses: true,
    overtime: true,
    leaves: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderList = (
    items: { 
      id: number; 
      requested_amount?: string;
      name?: string; 
      title?: string; 
      amount?: string; 
      overtime_hours?: string; 
      request_date?: string;
      fromDate?:string;
      toDate?:string;
      leave_type_name?: string;
    }[],
    type: "loan" | "expense" | "overtime" | "leave"
  ) => {
    if (items.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          {type === "loan"
            ? "No pending loan requests."
            : type === "expense"
            ? "No pending expense requests."
            : type === "overtime"
            ? "No pending overtime requests."
            : "No pending leave approval requests."}
        </p>
      );
    }

    return (
      <ul className="divide-y divide-muted/40 border border-muted/30 rounded-md overflow-hidden">
        {items.map((item) => (
          <li
            onClick={() => {
              if (type === 'expense') {
                window.location.href = '/self-service/expenses';
              } else if (type === 'loan') {
                window.location.href = '/self-service/loans';
              } else if (type === 'overtime') {
                // Add overtime navigation if needed
              } else if (type === 'leave') {
                window.location.href = '/self-service/leaves';
              }
            }}
            key={item.id}
            className="flex justify-between items-center px-4 py-3 hover:bg-muted transition-colors cursor-pointer"
            title={
              type === "loan"
                ? `${item.name} for AED ${item.requested_amount}`
                : type === "expense"
                ? `${item.title} - AED${item.amount}`
                : type === "overtime"
                ? `Overtime Request #${item.id} for ${item.overtime_hours} hours`
                : `${item.leave_type_name} (${new Date(item.fromDate!).toISOString().split('T')[0]} to ${new Date(item.toDate!).toISOString().split('T')[0]})`
            }
          >
            <span className="truncate font-medium text-foreground max-w-[70%]">
              {type === "loan"
                ? `${item.name}`
                : type === "expense"
                ? item.title
                : type === "overtime"
                ? `Overtime Request on ${new Date(item.request_date!).toISOString().split('T')[0]}`
                : `${item.leave_type_name} (${new Date(item.fromDate!).toISOString().split('T')[0]} to ${new Date(item.toDate!).toISOString().split('T')[0]})`}
            </span>
            <Badge
              variant={
                type === "loan"
                  ? "destructive"
                  : type === "expense"
                  ? "destructive"
                  : type === "overtime"
                  ? "secondary"
                  : "default"
              }
              className="whitespace-nowrap"
            >
              {type === "loan"
                ? `AED ${item.requested_amount}`
                : type === "expense"
                ? `AED ${item.amount}`
                : type === "overtime"
                ? `${item.overtime_hours} hrs`
                : "Pending"}
            </Badge>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle>My Pending Requests</CardTitle>
        <CardDescription>Requests that are awaiting approval.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loans Section */}
        <section>
          <button
            onClick={() => toggleSection("loans")}
            className="w-full flex justify-between items-center mb-3 p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors cursor-pointer"
            aria-expanded={expandedSections.loans}
            aria-controls="loans-list"
            type="button"
          >
            <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
              <Wallet className="w-5 h-5 text-primary" />
              Loans
            </div>
            {expandedSections.loans ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.loans && renderList(myPendingRequests.loans, "loan")}
        </section>

        {/* Expenses Section */}
        <section>
          <button
            onClick={() => toggleSection("expenses")}
            className="w-full flex justify-between items-center mb-3 p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors cursor-pointer"
            aria-expanded={expandedSections.expenses}
            aria-controls="expenses-list"
            type="button"
          >
            <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              Expenses
            </div>
            {expandedSections.expenses ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.expenses && renderList(myPendingRequests.expenses, "expense")}
        </section>

        {/* Overtime Section */}
        <section>
          <button
            onClick={() => toggleSection("overtime")}
            className="w-full flex justify-between items-center mb-3 p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors cursor-pointer"
            aria-expanded={expandedSections.overtime}
            aria-controls="overtime-list"
            type="button"
          >
            <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
              <Clock className="w-5 h-5 text-indigo-600" />
              Overtime
            </div>
            {expandedSections.overtime ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.overtime && renderList(myPendingRequests.overtime, "overtime")}
        </section>

        {/* Leave Approvals Section */}
        <section>
          <button
            onClick={() => toggleSection("leaves")}
            className="w-full flex justify-between items-center mb-3 p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors cursor-pointer"
            aria-expanded={expandedSections.leaves}
            aria-controls="leaves-list"
            type="button"
          >
            <div className="flex items-center gap-2 font-semibold text-lg text-foreground">
              <CalendarDays className="w-5 h-5 text-green-600" />
              Leave Approvals
            </div>
            {expandedSections.leaves ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSections.leaves && renderList(pendingApprovals.leaves, "leave")}
        </section>
      </CardContent>
    </Card>
  );
}

export interface UserDashboardData {
    user: {
        first_name: string;
        last_name: string;
        full_employee_id: string;
        reports_to_name: string;
    };
    documentStatus: {
        expiring: {
            name: string;
            expiry_date: string;
        }[];
        notUploaded: {
            name: string;
        }[];
    };
    upcomingHoliday: {
        name: string;
        holiday_date: string;
    } | null;
    monthlyAttendance: {
        total_days: number;
        present_days: number;
        absent_days: number;
        leave_days: number;
        total_hours_worked: string;
        approved_overtime: string;
        rejected_overtime: string;
    };
    upcomingLeave: {
        from_date: string;
        to_date: string;
        leave_description: string;
    } | null;
    pendingApprovals: {
        leaves: {
            id: number;
            employee_name: string;
            leave_type_name: string;
        }[];
    };
    myPendingRequests: {
        loans: {
            id: number;
            requested_amount: string;
            name: string;
        }[];
        expenses: {
            id: number;
            title: string;
            amount: string;
        }[];
        overtime: {
            id: number;
            overtime_hours: string;
            request_date: string;
        }[];
    };
    ongoingLoans: {
        id: number;
        application_id_text: string;
        approved_amount: string;
        emi_amount: string;
        tenure_months: number;
        loan_type_name: string;
        emis_paid: number;
        total_emis: number;
    }[];
    pendingCases: {
        id: number;
        case_id_text: string;
        title: string;
    }[];
}
