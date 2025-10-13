"use client";
import { useEffect, useState } from "react";
import { getPendingOvertimeRequests, PendingOvertimeRequest } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, ArrowRight, Timer } from "lucide-react";

function OvertimeSkeleton() {
  return (
    <div className="rounded-xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-5 animate-pulse">
        <div className="space-y-2">
          <div className="h-5 w-52 rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-3 w-40 rounded bg-slate-100 dark:bg-zinc-800/60" />
        </div>
        <div className="h-8 w-16 rounded-full bg-slate-100 dark:bg-zinc-800" />
      </div>
      
      <div className="flex-1 space-y-3 overflow-hidden">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full w-10 h-10 bg-slate-200 dark:bg-zinc-700" />
              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-slate-200 dark:bg-zinc-700" />
                <div className="h-3 w-40 rounded bg-slate-100 dark:bg-zinc-800" />
              </div>
            </div>
            <div className="h-8 w-20 bg-slate-100 dark:bg-zinc-800 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PendingOvertimeRequestWidget() {
  const [overtime, setOvertime] = useState<PendingOvertimeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getPendingOvertimeRequests()
      .then(setOvertime)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <OvertimeSkeleton />;

  // Empty state
  if (overtime.length === 0) {
    return (
      <div className="rounded-xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
        <div className="mb-5">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Pending Overtime Requests
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and approve overtime hours
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <Timer className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No pending requests
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              All overtime requests have been processed
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
            Pending Overtime Requests
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and approve overtime hours
          </p>
        </div>
        
        {/* Count badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/50">
          <Clock className="h-3.5 w-3.5 text-violet-600 dark:text-violet-500" />
          <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">
            {overtime.length}
          </span>
        </div>
      </div>

      {/* Overtime List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {overtime.map((ot) => (
          <div
            key={ot.id}
            className="group flex items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-800 shadow-sm">
                <AvatarImage src={ot.profile_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600 text-white text-sm font-medium">
                  {ot.employee_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {ot.employee_name}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {ot.overtime_hours} {Number(ot.overtime_hours) === 1 ? 'hour' : 'hours'}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span className="truncate capitalize">
                    {ot.overtime_type}
                  </span>
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-md shadow-sm bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 transition-all group-hover:shadow flex-shrink-0"
            >
              <Link href="/management/attendance" className="flex items-center gap-1.5">
                Review
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
