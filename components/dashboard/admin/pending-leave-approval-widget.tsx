
// "use client";
// import { useEffect, useState } from "react";
// import { getPendingLeaveApprovals, PendingLeaveApproval } from "@/lib/api";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { format } from "date-fns";

// function LeaveApprovalSkeleton() {
//   return (
//     <div className="rounded-2xl p-6 bg-white/40 dark:bg-zinc-900/30 border border-white/20 dark:border-zinc-700/30 shadow-md backdrop-blur-md transition-all max-h-[400px] h-[400px] flex flex-col">
//       <div className="h-7 w-40 rounded mb-4 bg-white/70 dark:bg-zinc-700/60 animate-pulse" />
//       <div className="h-4 w-60 rounded bg-white/60 dark:bg-zinc-800/60 animate-pulse mb-4" />
//       <ul className="flex-1 space-y-5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
//         {[...Array(5)].map((_, idx) => (
//           <li
//             key={idx}
//             className="flex items-center justify-between gap-6 py-4 px-3 rounded-2xl border border-white/20 dark:border-zinc-700/30 bg-white/30 dark:bg-zinc-900/30 shadow-sm backdrop-blur-md animate-pulse"
//           >
//             <div className="flex items-center gap-4">
//               <div className="rounded-full w-12 h-12 bg-white/70 dark:bg-zinc-700/60" />
//               <div>
//                 <div className="h-4 w-24 rounded bg-white/60 dark:bg-zinc-800/60 mb-2" />
//                 <div className="h-3 w-36 rounded bg-white/40 dark:bg-zinc-800/40" />
//               </div>
//             </div>
//             <div className="h-8 w-20 bg-white/50 dark:bg-zinc-700/30 rounded-md" />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export function PendingLeaveApprovalWidget() {
//   const [leaves, setLeaves] = useState<PendingLeaveApproval[]>([]);
//   useEffect(() => {
//     getPendingLeaveApprovals().then(setLeaves).catch(console.error);
//   }, []);

//   if (!leaves.length) return <LeaveApprovalSkeleton />;

//   return (
//     <div className="rounded-2xl p-6 bg-white/50 dark:bg-zinc-900/30 border border-white/30 dark:border-zinc-700/40 shadow-md backdrop-blur-md transition-all max-w-full max-h-[400px] h-[400px] flex flex-col">
//       <div className="mb-4 flex-shrink-0">
//         <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
//           Pending Leave Approvals
//         </span>
//         <div className="text-sm text-zinc-600 dark:text-zinc-400">
//           Requests from direct reports
//         </div>
//       </div>
//       <ul className="flex-1 space-y-5 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
//         {leaves.map((leave) => (
//           <li
//             key={leave.id}
//             className="flex items-center justify-between gap-6 p-4 rounded-2xl border border-white/20 dark:border-zinc-700/30 bg-white/30 dark:bg-zinc-900/30 shadow-sm backdrop-blur-md transition"
//           >
//             <div className="flex items-center gap-4">
//               <Avatar>
//                 <AvatarImage src={leave.profile_url || undefined} />
//                 <AvatarFallback>{leave.employee_name.charAt(0)}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-semibold text-zinc-900 dark:text-zinc-100">
//                   {leave.employee_name}
//                 </p>
//                 <p className="text-sm text-zinc-600 dark:text-zinc-400">
//                   {leave.leave_type_name}:{" "}
//                   {format(new Date(leave.from_date), "MMM dd")} -{" "}
//                   {format(new Date(leave.to_date), "MMM dd")}
//                 </p>
//               </div>
//             </div>
//             <Button
//               asChild
//               variant="outline"
//               size="sm"
//               className="rounded-full shadow-sm bg-white/60 dark:bg-zinc-800/60 border-white/20 dark:border-zinc-700/30 hover:bg-white/70 dark:hover:bg-zinc-800/70 transition"
//             >
//               <Link href={`/management/leaves/${leave.id}`}>Review</Link>
//             </Button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { getPendingLeaveApprovals, PendingLeaveApproval } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Calendar, ArrowRight } from "lucide-react";

function LeaveApprovalSkeleton() {
  return (
    <div className="rounded-xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-5 animate-pulse">
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-slate-200 dark:bg-zinc-800" />
          <div className="h-3 w-36 rounded bg-slate-100 dark:bg-zinc-800/60" />
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

export function PendingLeaveApprovalWidget() {
  const [leaves, setLeaves] = useState<PendingLeaveApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getPendingLeaveApprovals()
      .then(setLeaves)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LeaveApprovalSkeleton />;

  // Empty state
  if (!leaves.length) {
    return (
      <div className="rounded-xl p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm max-h-[400px] h-[400px] flex flex-col">
        <div className="mb-5">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Pending Leave Approvals
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Requests from direct reports
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No pending approvals
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              All leave requests have been processed
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
            Pending Leave Approvals
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Requests from direct reports
          </p>
        </div>
        
        {/* Count badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            {leaves.length}
          </span>
        </div>
      </div>

      {/* Leave List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {leaves.map((leave) => (
          <div
            key={leave.id}
            className="group flex items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-zinc-800 shadow-sm">
                <AvatarImage src={leave.profile_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium">
                  {leave.employee_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {leave.employee_name}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {leave.leave_type_name}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <span className="truncate">
                    {format(new Date(leave.from_date), "MMM dd")} - {format(new Date(leave.to_date), "MMM dd")}
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
              <Link href={`/management/leaves/${leave.id}`} className="flex items-center gap-1.5">
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
