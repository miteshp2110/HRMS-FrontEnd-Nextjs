"use client";
import { useEffect, useState } from "react";
import { ExpenseDisbursementRequest, getExpenseDisbursementRequests } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Banknote, ArrowRight, Send } from "lucide-react";

function ExpenseDisbursementSkeleton() {
  return (
    <div className="rounded-xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-5 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-56 rounded bg-slate-100 dark:bg-zinc-800/60" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 rounded-full bg-slate-100 dark:bg-zinc-800" />
          <div className="h-8 w-16 rounded-full bg-slate-100 dark:bg-zinc-800" />
        </div>
      </div>
      
      <div className="flex-1 space-y-3 overflow-hidden">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 animate-pulse"
          >
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-zinc-700" />
              <div className="h-3 w-44 rounded bg-slate-100 dark:bg-zinc-800" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-24 bg-slate-100 dark:bg-zinc-800 rounded" />
              <div className="h-8 w-20 bg-slate-100 dark:bg-zinc-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExpenseDisbursementWidget() {
  const [requests, setRequests] = useState<ExpenseDisbursementRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getExpenseDisbursementRequests()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <ExpenseDisbursementSkeleton />;

  // Calculate total disbursement amount
  const totalAmount = requests.reduce((sum, req) => sum + Number(req.amount), 0);

  // Empty state
  if (requests.length === 0) {
    return (
      <div className="rounded-xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
        <div className="mb-5">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Expense Disbursements
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Approved claims ready for payment
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <Send className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No expenses ready
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              All disbursements have been processed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300 max-h-[400px] h-[400px] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Expense Disbursements
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Approved claims ready for payment
          </p>
        </div>
        
        {/* Total amount and count badges */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Pending
            </span>
            <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
              AED {totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/50">
            <Banknote className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-500" />
            <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
              {requests.length}
            </span>
          </div>
        </div>
      </div>

      {/* Disbursement List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {requests.map((req) => (
          <div
            key={req.id}
            className="group flex items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {req.employee_name}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-0.5">
                {req.title}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                  AED {req.amount.toLocaleString()}
                </p>
              </div>
              
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-md shadow-sm bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 transition-all group-hover:shadow"
              >
                <Link href="/admin/finance" className="flex items-center gap-1.5">
                  Disburse
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
