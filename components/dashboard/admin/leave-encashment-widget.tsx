"use client";
import { useEffect, useState } from "react";
import { getPendingLeaveEncashment, PendingLeaveEncashment } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Coins, ArrowRight, Calendar } from "lucide-react";

function LeaveEncashmentSkeleton() {
  return (
    <div className="rounded-xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-5 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 w-52 rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-4 w-44 rounded bg-slate-100 dark:bg-zinc-800/60" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-28 rounded-full bg-slate-100 dark:bg-zinc-800" />
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
              <div className="h-3 w-40 rounded bg-slate-100 dark:bg-zinc-800" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-slate-100 dark:bg-zinc-800 rounded-full" />
              <div className="h-7 w-24 bg-slate-100 dark:bg-zinc-800 rounded" />
              <div className="h-8 w-20 bg-slate-100 dark:bg-zinc-800 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaveEncashmentWidget() {
  const [requests, setRequests] = useState<PendingLeaveEncashment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getPendingLeaveEncashment()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LeaveEncashmentSkeleton />;

  // Calculate total encashment amount and days
  const totalAmount = requests.reduce((sum, req) => sum + Number(req.calculated_amount), 0);
  const totalDays = requests.reduce((sum, req) => sum + Number(req.days_to_encash), 0);

  // Empty state
  if (requests.length === 0) {
    return (
      <div className="rounded-xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
        <div className="mb-5">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Leave Encashment Requests
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Employee leave conversion to cash
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No pending requests
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              All leave encashment requests processed
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
            Leave Encashment Requests
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {Number(totalDays)} days • AED {totalAmount.toLocaleString()}
          </p>
        </div>
        
        {/* Count badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <Coins className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            {requests.length}
          </span>
        </div>
      </div>

      {/* Encashment List */}
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {req.days_to_encash} {Number(req.days_to_encash) === 1 ? 'day' : 'days'} • AED {req.calculated_amount.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <Badge 
                variant={req.status === "Pending" ? "default" : "secondary"}
                className="text-xs"
              >
                {req.status}
              </Badge>
              
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-md shadow-sm bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 transition-all group-hover:shadow"
              >
                <Link href="/management/leave-encashment" className="flex items-center gap-1.5">
                  Review
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
