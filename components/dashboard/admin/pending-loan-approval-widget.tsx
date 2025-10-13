"use client";
import { useEffect, useState } from "react";
import { getPendingLoanApprovals, PendingLoanApproval } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, ArrowRight, Banknote } from "lucide-react";

function LoanApprovalSkeleton() {
  return (
    <div className="rounded-xl p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-5 w-44 rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-3 w-32 rounded bg-slate-100 dark:bg-zinc-800/60" />
        </div>
        <div className="h-7 w-12 rounded-full bg-slate-100 dark:bg-zinc-800" />
      </div>
      
      <div className="flex-1 space-y-2.5 overflow-hidden">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 animate-pulse"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-full w-9 h-9 bg-slate-200 dark:bg-zinc-700" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-zinc-700" />
                <div className="h-3 w-28 rounded bg-slate-100 dark:bg-zinc-800" />
                <div className="h-3 w-20 rounded bg-slate-100 dark:bg-zinc-800" />
              </div>
            </div>
            <div className="h-7 w-16 bg-slate-100 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PendingLoanApprovalWidget() {
  const [loans, setLoans] = useState<PendingLoanApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getPendingLoanApprovals()
      .then(setLoans)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoanApprovalSkeleton />;

  // Calculate total requested amount
  const totalRequested = loans.reduce((sum, loan) => sum + Number(loan.requested_amount), 0);

  // Empty state
  if (loans.length === 0) {
    return (
      <div className="rounded-xl p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
        <div className="mb-4">
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Pending Loan Approvals
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Employee loan requests
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2.5">
            <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <Wallet className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No pending requests
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              All applications processed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300 max-h-[400px] h-[400px] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Pending Loan Approvals
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {(Number(totalRequested) > 0) && `Total: AED ${totalRequested.toLocaleString()}`}
          </p>
        </div>
        
        {/* Count badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50">
          <Banknote className="h-3 w-3 text-teal-600 dark:text-teal-500" />
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
            {loans.length}
          </span>
        </div>
      </div>

      {/* Loan List */}
      <div className="flex-1 overflow-y-auto pr-1.5 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="group flex items-center justify-between gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <Avatar className="h-9 w-9 border-2 border-white dark:border-zinc-800 shadow-sm flex-shrink-0">
                <AvatarImage src={loan.profile_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white text-xs font-medium">
                  {loan.employee_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
                  {loan.employee_name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                  {loan.loan_type_name}
                </p>
                <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold mt-0.5">
                  AED {loan.requested_amount.toLocaleString()}
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-md text-xs h-7 px-2.5 shadow-sm bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 transition-all group-hover:shadow flex-shrink-0"
            >
              <Link href={`/management/loans/${loan.id}`} className="flex items-center gap-1">
                Review
                <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
