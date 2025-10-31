"use client";
import { useEffect, useState } from "react";
import { getOpenCasesOnDirectReports, OpenCase } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, ArrowRight, FolderOpen } from "lucide-react";

function OpenCasesSkeleton() {
  return (
    <div className="rounded-xl p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-3 w-32 rounded bg-slate-100 dark:bg-zinc-800/60" />
        </div>
        <div className="h-7 w-12 rounded-full bg-slate-100 dark:bg-zinc-800" />
      </div>
      
      <div className="flex-1 space-y-2.5 overflow-hidden">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 animate-pulse"
          >
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-zinc-700" />
              <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-zinc-800" />
            </div>
            <div className="h-7 w-16 bg-slate-100 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function OpenCasesWidget() {
  const [cases, setCases] = useState<OpenCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getOpenCasesOnDirectReports()
      .then(setCases)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <OpenCasesSkeleton />;

  // Empty state
  if (cases.length === 0) {
    return (
      <div className="rounded-xl p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
        <div className="mb-4">
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Open Cases on My Team
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Active cases from team members
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2.5">
            <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <FolderOpen className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No open cases
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              All cases have been resolved
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
            Open Cases on My Team
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active cases from team members
          </p>
        </div>
        
        {/* Count badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
          <AlertCircle className="h-3 w-3 text-orange-600 dark:text-orange-500" />
          <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
            {cases.length}
          </span>
        </div>
      </div>

      {/* Cases List */}
      <div className="flex-1 overflow-y-auto pr-1.5 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {cases.map((c) => (
          <div
            key={c.id}
            className="group flex items-start justify-between gap-2.5 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
                {c.employee_name}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {c.category_name}
                </p>
                
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-md text-xs h-7 px-2.5 shadow-sm bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 transition-all group-hover:shadow flex-shrink-0"
            >
              <Link href={`/team/cases/${c.id}`} className="flex items-center gap-1">
                View
                <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
