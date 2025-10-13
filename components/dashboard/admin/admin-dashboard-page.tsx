"use client";

import { WelcomeWidget } from "../user/welcome-widget";
import { AttendanceStatusWidget } from "./attendance-status-widget";
import { ExpenseDisbursementWidget } from "./expense-disbursement-widget";
import { LeaveEncashmentWidget } from "./leave-encashment-widget";
import { LoanDisbursementWidget } from "./loan-disbursement-widget";
import { OpenCasesWidget } from "./open-cases-widget";
import { PendingExpenseApprovalWidget } from "./pending-expense-approval-widget";
import { PendingLeaveApprovalWidget } from "./pending-leave-approval-widget";
import { PendingLoanApprovalWidget } from "./pending-loan-approval-widget";
import { PendingOvertimeRequestWidget } from "./pending-overtime-request-widget";
import { PendingSkillApprovalWidget } from "./pending-skill-approval-widget";
import { UpcomingDocumentExpiryWidget } from "./upcoming-document-expiry-widget";


export function AdminDashboardPage() {
  return (
    <div className="p-1  md:p-1 grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-3 xl:grid-cols-6">
      {/* Row 1: Key Stats & High Priority */}
      <div className="lg:col-span-3 xl:col-span-6">
        <AttendanceStatusWidget />
      </div>
      <div className="lg:col-span-3 xl:col-span-6">
        <UpcomingDocumentExpiryWidget />
      </div>
      <div className="lg:col-span-1 xl:col-span-3">
         <PendingLeaveApprovalWidget />
      </div>
       <div className="lg:col-span-1 xl:col-span-3">
        <PendingOvertimeRequestWidget />
         
      </div>


      {/* Row 2: Approvals */}
      <div className="lg:col-span-1 xl:col-span-2">
      <PendingLoanApprovalWidget />
      </div>
      <div className="lg:col-span-1 xl:col-span-2">
      <PendingSkillApprovalWidget />
      </div>
      <div className="lg:col-span-1 xl:col-span-2">
      <OpenCasesWidget />
      </div>


      {/* Row 3: Expiries & Disbursements */}
       <div className="lg:col-span-1 xl:col-span-3">
        <PendingExpenseApprovalWidget />
      </div>
       <div className="lg:col-span-1 xl:col-span-3">
        <ExpenseDisbursementWidget />
      </div>
      <div className="lg:col-span-1 xl:col-span-3">
         <LeaveEncashmentWidget />
      </div>
      <div className="lg:col-span-1 xl:col-span-3">
        <LoanDisbursementWidget />
      </div>
    </div>
  );
}