// components/admin/reports-page.tsx

"use client";

import React, { useState } from "react";
import { reportsApi, downloadFile } from "@/lib/api";

type Field = {
  name: string;
  label: string;
  type: "date" | "number" | "select" | "text";
  required?: boolean;
};

type ReportDef = {
  id: string;
  label: string;
  category: string;
  key: keyof typeof reportsApi;
  fields: Field[];
  description: string;
};

const REPORTS: ReportDef[] = [
  // Attendance Reports
  {
    id: "attendance-detailed",
    label: "Detailed Attendance Report",
    category: "Attendance",
    key: "attendanceDetailed",
    description: "Comprehensive attendance data with punch times and analysis",
    fields: [
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  {
    id: "attendance-monthly",
    label: "Monthly Attendance Summary",
    category: "Attendance",
    key: "attendanceMonthly",
    description: "Monthly summary of attendance patterns by employee",
    fields: [
      { name: "month", label: "Month", type: "number", required: true },
      { name: "year", label: "Year", type: "number", required: true },
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  // Payroll Reports
  {
    id: "payroll-cycle",
    label: "Payroll Cycle Report",
    category: "Payroll",
    key: "payrollCycle",
    description: "Complete payroll processing report for a cycle",
    fields: [
      { name: "cycleId", label: "Cycle ID", type: "number", required: true },
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  {
    id: "payroll-salary",
    label: "Salary Structure Report",
    category: "Payroll",
    key: "payrollSalary",
    description: "Employee salary structure comparison and analysis",
    fields: [
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  // Leave Reports
  {
    id: "leave-detailed",
    label: "Detailed Leave Report",
    category: "Leave",
    key: "leaveDetailed",
    description: "Comprehensive leave data with applications and balances",
    fields: [
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  {
    id: "leave-balances",
    label: "Leave Balance Report",
    category: "Leave",
    key: "leaveBalances",
    description: "Current leave balances and utilization",
    fields: [
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  // Employee Reports
  {
    id: "employee-directory",
    label: "Employee Directory",
    category: "Employee",
    key: "employeeDirectory",
    description: "Complete employee directory with contact information",
    fields: [
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  // Performance Reports
  {
    id: "performance-appraisals",
    label: "Performance Appraisal Report",
    category: "Performance",
    key: "performanceAppraisals",
    description: "Comprehensive performance appraisal data",
    fields: [
      { name: "cycleId", label: "Cycle ID", type: "number", required: true },
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  // HR Cases
  {
    id: "hrcase-detailed",
    label: "Detailed HR Case Report",
    category: "HR Cases",
    key: "hrCaseDetailed",
    description: "Comprehensive HR case data with attachments",
    fields: [
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  // Loans
  {
    id: "loan-applications",
    label: "Loan Applications Report",
    category: "Loans",
    key: "loanApplications",
    description: "Loan applications with approval status",
    fields: [
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  // Expenses
  {
    id: "expense-claims",
    label: "Expense Claims Report",
    category: "Expenses",
    key: "expenseClaims",
    description: "Employee expense claims with approval workflow",
    fields: [
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
  // Audit
  {
    id: "audit-user",
    label: "User Audit Trail",
    category: "Audit",
    key: "auditUser",
    description: "User changes and modifications audit trail",
    fields: [
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
      { name: "format", label: "Format", type: "select", required: true },
    ],
  },
];

const CATEGORIES = [...new Set(REPORTS.map((r) => r.category))];

export function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedReport, setSelectedReport] = useState<ReportDef | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryReports = REPORTS.filter(
    (r) => r.category === selectedCategory
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

    try {
      const fn = reportsApi[selectedReport.key];
      const res = await fn(form);

      if (res.success) {
        downloadFile(res.downloadUrl);
        alert("Report generated successfully!");
      } else {
        setError(res.message);
      }
    } catch (e: any) {
      setError(e.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: Field) => {
    const value = form[field.name] || "";

    switch (field.type) {
      case "select":
        if (!form[field.name]) {
          onChange(field.name, "pdf"); // set default on first render
        }
        return (
          <select
            value={form[field.name]}
            onChange={(e) => onChange(field.name, e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              onChange(field.name, parseInt(e.target.value) || "")
            }
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        );
    }
  };

  return (
    <>
    <div className="bg-red-500 text-center font-bold">Under Maintainence: (Database failed)</div>
    <div style={{ display: "flex", height: "100vh", background: "#f5f5f5" }}>
        
      {/* Categories Sidebar */}
      <aside
        style={{
          width: 250,
          background: "#fff",
          borderRight: "1px solid #e0e0e0",
          padding: 20,
        }}
      >
        <h2 style={{ marginBottom: 20, fontSize: "18px", fontWeight: "600" }}>
          Report Categories
        </h2>
        {CATEGORIES.map((category) => (
          <div
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSelectedReport(null);
              setForm({});
              setError(null);
            }}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              borderRadius: "6px",
              marginBottom: "8px",
              background:
                category === selectedCategory ? "#e3f2fd" : "transparent",
              border:
                category === selectedCategory
                  ? "1px solid #2196f3"
                  : "1px solid transparent",
              fontWeight: category === selectedCategory ? "500" : "normal",
            }}
          >
            {category}
          </div>
        ))}
      </aside>

      {/* Reports List */}
      <div
        style={{
          width: 350,
          background: "#fff",
          borderRight: "1px solid #e0e0e0",
          padding: 20,
        }}
      >
        <h3 style={{ marginBottom: 20, fontSize: "16px", fontWeight: "600" }}>
          {selectedCategory} Reports
        </h3>
        {categoryReports.map((report) => (
          <div
            key={report.id}
            onClick={() => {
              setSelectedReport(report);
              setForm({});
              setError(null);
            }}
            style={{
              padding: "16px",
              cursor: "pointer",
              borderRadius: "8px",
              marginBottom: "12px",
              background:
                selectedReport?.id === report.id ? "#f3e5f5" : "#f9f9f9",
              border:
                selectedReport?.id === report.id
                  ? "2px solid #9c27b0"
                  : "1px solid #e0e0e0",
              transition: "all 0.2s",
            }}
          >
            <h4
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              {report.label}
            </h4>
            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
              {report.description}
            </p>
          </div>
        ))}
      </div>

      {/* Report Configuration */}
      <main style={{ flex: 1, padding: 30, background: "#fff" }}>
        {selectedReport ? (
          <>
            <h2
              style={{ marginBottom: 10, fontSize: "20px", fontWeight: "600" }}
            >
              {selectedReport.label}
            </h2>
            <p style={{ color: "#666", marginBottom: 30 }}>
              {selectedReport.description}
            </p>

            {error && (
              <div
                style={{
                  background: "#ffebee",
                  color: "#c62828",
                  padding: "12px",
                  borderRadius: "4px",
                  marginBottom: "20px",
                  border: "1px solid #ffcdd2",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 20,
                marginBottom: 30,
              }}
            >
              {selectedReport.fields.map((field) => (
                <div key={field.name}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    {field.label}{" "}
                    {field.required && (
                      <span style={{ color: "#f44336" }}>*</span>
                    )}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            <button
              onClick={generate}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: loading ? "#ccc" : "#2196f3",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Generating Report..." : "Generate & Download Report"}
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", color: "#666", marginTop: 100 }}>
            <h3>Select a Report</h3>
            <p>Choose a report from the list to configure and generate</p>
          </div>
        )}
      </main>
    </div>
    </>
  );
}
