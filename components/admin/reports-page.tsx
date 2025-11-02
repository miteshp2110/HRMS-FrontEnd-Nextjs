// components/admin/reports-page.tsx

"use client";

import React, { useState } from "react";
import {
  generateEmployeeMasterReport,
  generateInactiveProbationReport,
  generateDailyAttendanceReport,
  generateLateEarlyReport,
  generateOvertimeReport,
  generateLeaveBalanceReport,
  generateLeaveApplicationsReport,
  generateLeaveEncashmentReport,
  generateLeaveLedgerReport,
  generateLoanAmortizationReport,
  generateExpenseClaimReport,
  generateAppraisalSummaryReport,
  generateGoalKpiReport,
  generateJobApplicationsReport,
  generateHrCasesReport,
  generateShiftConfigurationReport,
  generateWorkWeekConfigurationReport,
} from "@/lib/api";
import {
  FileText,
  Users,
  Clock,
  Calendar,
  DollarSign,
  Award,
  Briefcase,
  AlertCircle,
  Settings,
  Download,
  Filter,
  X,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type Field = {
  name: string;
  label: string;
  type:
    | "date"
    | "number"
    | "select"
    | "text"
    | "multiselect"
    | "checkbox"
    | "radio";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  description?: string;
};

type ReportDef = {
  id: string;
  label: string;
  category: string;
  generateFn: (filters: any) => Promise<void>;
  fields: Field[];
  description: string;
  icon: React.ReactNode;
};

const REPORTS: ReportDef[] = [
  // Employee Reports
  {
    id: "employee-master",
    label: "Employee Master Report",
    category: "Employee",
    generateFn: generateEmployeeMasterReport,
    description:
      "Comprehensive employee directory with all details including personal info, job details, bank details, and emergency contacts",
    icon: <Users className="w-5 h-5" />,
    fields: [
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees (leave empty for all)",
        description: "Select specific employees or leave empty for all",
      },
      {
        name: "jobIds",
        label: "Filter by Job Roles",
        type: "multiselect",
        placeholder: "All job roles",
        description: "Filter employees by job roles",
      },
      {
        name: "includeInactive",
        label: "Include Inactive Employees",
        type: "checkbox",
        description: "Include inactive and terminated employees",
      },
    ],
  },
  {
    id: "inactive-probation",
    label: "Inactive & Probation Report",
    category: "Employee",
    generateFn: generateInactiveProbationReport,
    description:
      "Report on inactive employees and employees on probation with probation end dates and inactive reasons",
    icon: <Users className="w-5 h-5" />,
    fields: [
      {
        name: "reportType",
        label: "Report Type",
        type: "radio",
        required: true,
        options: [
          { value: "inactive", label: "Inactive Only" },
          { value: "probation", label: "Probation Only" },
          { value: "both", label: "Both Inactive & Probation" },
        ],
      },
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
    ],
  },

  // Attendance Reports
  {
    id: "daily-attendance",
    label: "Daily Attendance Report",
    category: "Attendance",
    generateFn: generateDailyAttendanceReport,
    description:
      "Detailed daily attendance records with punch times, hours worked, and attendance status",
    icon: <Clock className="w-5 h-5" />,
    fields: [
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
        required: true,
        description: "Start date of the report period",
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
        required: true,
        description: "End date of the report period",
      },
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "attendanceStatus",
        label: "Attendance Status",
        type: "select",
        options: [
          { value: "", label: "All Statuses" },
          { value: "Present", label: "Present" },
          { value: "Absent", label: "Absent" },
          { value: "Half Day", label: "Half Day" },
          { value: "Leave", label: "Leave" },
        ],
      },
    ],
  },
  {
    id: "late-early",
    label: "Late Arrival & Early Departure",
    category: "Attendance",
    generateFn: generateLateEarlyReport,
    description:
      "Track late arrivals and early departures with grace period analysis and shift timing comparison",
    icon: <Clock className="w-5 h-5" />,
    fields: [
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
        required: true,
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
        required: true,
      },
      {
        name: "reportType",
        label: "Report Type",
        type: "radio",
        required: true,
        options: [
          { value: "late", label: "Late Arrivals Only" },
          { value: "early", label: "Early Departures Only" },
          { value: "both", label: "Both Late & Early" },
        ],
      },
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
    ],
  },
  {
    id: "overtime",
    label: "Overtime Report",
    category: "Attendance",
    generateFn: generateOvertimeReport,
    description:
      "Overtime hours tracking with approval status, regular hours comparison, and payment calculation",
    icon: <Clock className="w-5 h-5" />,
    fields: [
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
        required: true,
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
        required: true,
      },
      {
        name: "approvalStatus",
        label: "Approval Status",
        type: "select",
        options: [
          { value: "", label: "All Statuses" },
          { value: "Pending", label: "Pending" },
          { value: "Approved", label: "Approved" },
          { value: "Rejected", label: "Rejected" },
        ],
      },
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
    ],
  },

  // Leave Reports
  {
    id: "leave-balance",
    label: "Leave Balance Report",
    category: "Leave",
    generateFn: generateLeaveBalanceReport,
    description:
      "Current leave balances by leave type with available days for all employees",
    icon: <Calendar className="w-5 h-5" />,
    fields: [
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "leaveTypeIds",
        label: "Leave Types",
        type: "multiselect",
        placeholder: "All leave types",
        description: "Filter by specific leave types",
      },
    ],
  },
  {
    id: "leave-applications",
    label: "Leave Applications Report",
    category: "Leave",
    generateFn: generateLeaveApplicationsReport,
    description:
      "Detailed leave applications with approval workflow, dates, reasons, and current status",
    icon: <Calendar className="w-5 h-5" />,
    fields: [
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
        description: "Leave start date range (optional)",
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
        description: "Leave end date range (optional)",
      },
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "leaveTypeIds",
        label: "Leave Types",
        type: "multiselect",
        placeholder: "All leave types",
      },
      {
        name: "approvalStatus",
        label: "Approval Status",
        type: "select",
        options: [
          { value: "", label: "All Statuses" },
          { value: "Pending", label: "Pending" },
          { value: "Approved", label: "Approved" },
          { value: "Rejected", label: "Rejected" },
        ],
      },
    ],
  },
  {
    id: "leave-encashment",
    label: "Leave Encashment Report",
    category: "Leave",
    generateFn: generateLeaveEncashmentReport,
    description:
      "Leave encashment requests with days encashed, amount, and payroll cycle information",
    icon: <Calendar className="w-5 h-5" />,
    fields: [
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
      },
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "approvalStatus",
        label: "Approval Status",
        type: "select",
        options: [
          { value: "", label: "All Statuses" },
          { value: "Pending", label: "Pending" },
          { value: "Approved", label: "Approved" },
          { value: "Rejected", label: "Rejected" },
        ],
      },
    ],
  },
  {
    id: "leave-ledger",
    label: "Leave Ledger Report",
    category: "Leave",
    generateFn: generateLeaveLedgerReport,
    description:
      "Complete leave transaction history with credits, debits, adjustments, and balance tracking",
    icon: <Calendar className="w-5 h-5" />,
    fields: [
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
      },
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "leaveTypeIds",
        label: "Leave Types",
        type: "multiselect",
        placeholder: "All leave types",
      },
      {
        name: "transactionType",
        label: "Transaction Type",
        type: "select",
        options: [
          { value: "", label: "All Types" },
          { value: "Credit", label: "Credit" },
          { value: "Debit", label: "Debit" },
          { value: "Adjustment", label: "Adjustment" },
          { value: "Allocation", label: "Allocation" },
          { value: "Used", label: "Used" },
        ],
      },
    ],
  },

  // Financial Reports
  {
    id: "loan-amortization",
    label: "Loan Amortization Report",
    category: "Financial",
    generateFn: generateLoanAmortizationReport,
    description:
      "Loan details with monthly deductions, balance, payment history, and amortization schedule",
    icon: <DollarSign className="w-5 h-5" />,
    fields: [
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "loanStatus",
        label: "Loan Status",
        type: "select",
        options: [
          { value: "", label: "All Statuses" },
          { value: "Pending", label: "Pending" },
          { value: "Approved", label: "Approved" },
          { value: "Rejected", label: "Rejected" },
          { value: "Completed", label: "Completed" },
        ],
      },
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
      },
    ],
  },
  {
    id: "expense-claims",
    label: "Expense Claims Report",
    category: "Financial",
    generateFn: generateExpenseClaimReport,
    description:
      "Employee expense claims with categories, amounts, approval status, and payment tracking",
    icon: <DollarSign className="w-5 h-5" />,
    fields: [
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
      },
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "approvalStatus",
        label: "Approval Status",
        type: "select",
        options: [
          { value: "", label: "All Statuses" },
          { value: "Pending", label: "Pending" },
          { value: "Approved", label: "Approved" },
          { value: "Rejected", label: "Rejected" },
        ],
      },
      {
        name: "expenseCategory",
        label: "Expense Category",
        type: "text",
        placeholder: "e.g., Travel, Food, Transport",
        description: "Filter by expense category",
      },
    ],
  },

  // Performance Reports
  {
    id: "appraisal-summary",
    label: "Appraisal Summary Report",
    category: "Performance",
    generateFn: generateAppraisalSummaryReport,
    description:
      "Performance appraisal summary with ratings, comments, and year-wise comparison",
    icon: <Award className="w-5 h-5" />,
    fields: [
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "year",
        label: "Year",
        type: "number",
        placeholder: "e.g., 2024",
        description: "Appraisal year",
      },
      {
        name: "appraisalStatus",
        label: "Appraisal Status",
        type: "text",
        placeholder: "e.g., Completed, Pending",
      },
    ],
  },
  {
    id: "goal-kpi",
    label: "Goal & KPI Report",
    category: "Performance",
    generateFn: generateGoalKpiReport,
    description:
      "Employee goals and KPIs with target vs achieved values and completion status",
    icon: <Award className="w-5 h-5" />,
    fields: [
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "year",
        label: "Year",
        type: "number",
        placeholder: "e.g., 2024",
      },
      {
        name: "goalStatus",
        label: "Goal Status",
        type: "select",
        options: [
          { value: "", label: "All Statuses" },
          { value: "Not Started", label: "Not Started" },
          { value: "In Progress", label: "In Progress" },
          { value: "Completed", label: "Completed" },
          { value: "Overdue", label: "Overdue" },
          { value: "Achieved", label: "Achieved" },
        ],
      },
    ],
  },

  // Recruitment Reports
  {
    id: "job-applications",
    label: "Job Applications Report",
    category: "Recruitment",
    generateFn: generateJobApplicationsReport,
    description:
      "Job applications with candidate details, job openings, application status, and timeline",
    icon: <Briefcase className="w-5 h-5" />,
    fields: [
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
      },
      {
        name: "jobOpeningIds",
        label: "Job Openings",
        type: "multiselect",
        placeholder: "All job openings",
      },
      {
        name: "applicationStatus",
        label: "Application Status",
        type: "text",
        placeholder: "e.g., Applied, Interview, Hired, Rejected",
      },
    ],
  },

  // HR Management Reports
  {
    id: "hr-cases",
    label: "HR Cases Report",
    category: "HR Management",
    generateFn: generateHrCasesReport,
    description:
      "HR case management report with case details, status, assignments, and resolution tracking",
    icon: <AlertCircle className="w-5 h-5" />,
    fields: [
      {
        name: "fromDate",
        label: "From Date",
        type: "date",
      },
      {
        name: "toDate",
        label: "To Date",
        type: "date",
      },
      {
        name: "employeeIds",
        label: "Select Employees",
        type: "multiselect",
        placeholder: "All employees",
      },
      {
        name: "caseStatus",
        label: "Case Status",
        type: "select",
        options: [
          { value: "", label: "All Statuses" },
          { value: "Open", label: "Open" },
          { value: "Closed", label: "Closed" },
          { value: "In Progress", label: "In Progress" },
          { value: "New", label: "New" },
          { value: "Resolved", label: "Resolved" },
        ],
      },
    ],
  },

  // Configuration Reports
  {
    id: "shift-configuration",
    label: "Shift Configuration Report",
    category: "Configuration",
    generateFn: generateShiftConfigurationReport,
    description:
      "Shift configuration details with timings, grace periods, and employee assignments",
    icon: <Settings className="w-5 h-5" />,
    fields: [
      {
        name: "shiftIds",
        label: "Select Shifts",
        type: "multiselect",
        placeholder: "All shifts",
      },
      {
        name: "includeInactive",
        label: "Include Inactive Shifts",
        type: "checkbox",
      },
    ],
  },
  {
    id: "work-week-configuration",
    label: "Work Week Configuration Report",
    category: "Configuration",
    generateFn: generateWorkWeekConfigurationReport,
    description:
      "Work week configuration with working days, weekly hours, and employee assignments",
    icon: <Settings className="w-5 h-5" />,
    fields: [
      {
        name: "workWeekIds",
        label: "Select Work Weeks",
        type: "multiselect",
        placeholder: "All work weeks",
      },
      {
        name: "includeInactive",
        label: "Include Inactive Work Weeks",
        type: "checkbox",
      },
    ],
  },
];

const CATEGORIES = [
  { name: "Employee", icon: <Users className="w-4 h-4" /> },
  { name: "Attendance", icon: <Clock className="w-4 h-4" /> },
  { name: "Leave", icon: <Calendar className="w-4 h-4" /> },
  { name: "Financial", icon: <DollarSign className="w-4 h-4" /> },
  { name: "Performance", icon: <Award className="w-4 h-4" /> },
  { name: "Recruitment", icon: <Briefcase className="w-4 h-4" /> },
  { name: "HR Management", icon: <AlertCircle className="w-4 h-4" /> },
  { name: "Configuration", icon: <Settings className="w-4 h-4" /> },
];

export function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  const [selectedReport, setSelectedReport] = useState<ReportDef | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categoryReports = REPORTS.filter(
    (r) =>
      r.category === selectedCategory &&
      (searchQuery === "" ||
        r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const onChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (report: ReportDef): string | null => {
    for (const field of report.fields) {
      if (field.required && !form[field.name]) {
        return `${field.label} is required`;
      }
    }
    return null;
  };

  const generate = async () => {
    if (!selectedReport) return;

    const validationError = validateForm(selectedReport);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await selectedReport.generateFn(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({});
    setError(null);
    setSuccess(false);
  };

  const renderField = (field: Field) => {
    const value = form[field.name] || "";

    const fieldClasses =
      "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

    switch (field.type) {
      case "checkbox":
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form[field.name] || false}
              onChange={(e) => onChange(field.name, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{field.description}</span>
          </label>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={form[field.name] === option.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "select":
        return (
          <select
            value={form[field.name] || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={fieldClasses}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const ids = e.target.value
                .split(",")
                .map((id) => parseInt(id.trim()))
                .filter((id) => !isNaN(id));
              onChange(field.name, ids.length > 0 ? ids : undefined);
            }}
            className={fieldClasses}
            placeholder={
              field.placeholder || "Enter comma-separated IDs (e.g., 1,2,3)"
            }
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              onChange(field.name, parseInt(e.target.value) || "")
            }
            className={fieldClasses}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={fieldClasses}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reports Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Generate comprehensive reports with advanced filtering options
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">
                {REPORTS.length} Reports Available
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Categories Sidebar */}
          <aside className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </h2>
              </div>
              <nav className="p-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setSelectedReport(null);
                      resetForm();
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      category.name === selectedCategory
                        ? "bg-blue-50 text-blue-700 font-medium shadow-sm border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`${
                        category.name === selectedCategory
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {category.icon}
                    </div>
                    <span className="text-sm">{category.name}</span>
                    <ChevronRight
                      className={`w-4 h-4 ml-auto ${
                        category.name === selectedCategory
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Reports List */}
          <div className="col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {selectedCategory} Reports
                </h3>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-purple-300 text-sm"
                />
              </div>

              <div className="p-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {categoryReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No reports found</p>
                  </div>
                ) : (
                  categoryReports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => {
                        setSelectedReport(report);
                        resetForm();
                      }}
                      className={`w-full text-left p-4 rounded-lg mb-2 transition-all duration-200 ${
                        selectedReport?.id === report.id
                          ? "bg-purple-50 border-2 border-purple-500 shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`mt-1 ${
                            selectedReport?.id === report.id
                              ? "text-purple-600"
                              : "text-gray-500"
                          }`}
                        >
                          {report.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-semibold mb-1 ${
                              selectedReport?.id === report.id
                                ? "text-purple-900"
                                : "text-gray-900"
                            }`}
                          >
                            {report.label}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Report Configuration */}
          <main className="col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {selectedReport ? (
                <div>
                  {/* Report Header */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          {selectedReport.icon}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {selectedReport.label}
                          </h2>
                          <p className="mt-1 text-sm text-gray-600">
                            {selectedReport.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedReport(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Success Message */}
                  {success && (
                    <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-medium text-green-800">
                        Report generated and downloaded successfully!
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Error
                        </p>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="p-6 space-y-6 max-h-[calc(100vh-500px)] overflow-y-auto">
                    {selectedReport.fields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        {renderField(field)}
                        {field.description && field.type !== "checkbox" && (
                          <p className="mt-1 text-xs text-gray-500">
                            {field.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Reset Form
                    </button>
                    <button
                      onClick={generate}
                      disabled={loading}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                      } text-white`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Generate & Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] text-center px-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Report
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Choose a report from the list to configure filters and
                    generate your customized report
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
