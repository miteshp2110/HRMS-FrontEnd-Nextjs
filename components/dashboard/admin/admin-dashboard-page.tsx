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
    <div className="p-4 md:p-8 grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
      {/* Row 1: Key Stats & High Priority */}
      <div className="lg:col-span-3 xl:col-span-4">
        {/* <WelcomeWidget  user={data}/> */}
        <AttendanceStatusWidget />
      </div>
      <div className="lg:col-span-1 xl:col-span-2">
         <PendingLeaveApprovalWidget />
      </div>
       <div className="lg:col-span-1 xl:col-span-2">
         <PendingExpenseApprovalWidget />
      </div>


      {/* Row 2: Approvals */}
      <PendingLoanApprovalWidget />
      <PendingSkillApprovalWidget />
      <PendingOvertimeRequestWidget />
      <OpenCasesWidget />


      {/* Row 3: Expiries & Disbursements */}
       <div className="lg:col-span-1 xl:col-span-2">
        <UpcomingDocumentExpiryWidget />
      </div>
       <div className="lg:col-span-1 xl:col-span-2">
         <LeaveEncashmentWidget />
      </div>
      <div className="lg:col-span-1 xl:col-span-2">
        <ExpenseDisbursementWidget />
      </div>
      <div className="lg:col-span-1 xl:col-span-2">
        <LoanDisbursementWidget />
      </div>
    </div>
  );
}