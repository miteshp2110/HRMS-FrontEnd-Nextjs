// "use client";
// import { useEffect, useState } from "react";
// import { AttendanceStats, getAttendanceStats } from "@/lib/api";
// import { Users, UserCheck, UserX, Plane } from "lucide-react";

// // Compact glassy skeleton loader full width
// function AttendanceSkeleton() {
//   return (
//     <div className="flex flex-col gap-2 animate-pulse p-4 rounded-xl
//       bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-700/30
//       shadow-sm backdrop-blur-md transition-all w-full">
//       <div className="w-24 h-4 rounded-md bg-white/60 dark:bg-zinc-700/60 mb-1" />
//       <div className="grid gap-3 grid-cols-2 md:grid-cols-4 w-full">
//         {[...Array(4)].map((_, idx) => (
//           <div
//             key={idx}
//             className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg
//               bg-white/50 dark:bg-zinc-900/50 border border-white/30 dark:border-zinc-700/40
//               shadow-sm w-full max-w-xs"
//           >
//             <div className="w-6 h-6 rounded-full bg-white/70 dark:bg-zinc-700/70" />
//             <div className="w-10 h-2 rounded bg-white/60 dark:bg-zinc-800/60" />
//             <div className="w-6 h-4 rounded bg-white/50 dark:bg-zinc-800/50" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export function AttendanceStatusWidget() {
//   const [stats, setStats] = useState<AttendanceStats | null>(null);

//   useEffect(() => {
//     getAttendanceStats().then(setStats).catch(console.error);
//   }, []);

//   if (!stats) return <AttendanceSkeleton />;

//   return (
//     <div className="p-4 rounded-xl w-full
//       bg-white/60 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-700/40
//       shadow-sm backdrop-blur-md transition-all">
//       <div className="mb-3 flex items-center gap-2">
//         <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
//           Today's Attendance
//         </span>
//         <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//       </div>
//       <div className="grid gap-3 grid-cols-2 md:grid-cols-4 w-full">
//         <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg
//           bg-white/50 dark:bg-zinc-900/50 border border-white/20 dark:border-zinc-700/30
//           shadow-sm hover:shadow transition-shadow max-w-xs w-full">
//           <Users className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
//           <div className="text-xs font-medium text-zinc-400 dark:text-zinc-500">Total</div>
//           <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</div>
//         </div>
//         <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg
//           bg-green-50 dark:bg-green-900/25 border border-green-200 dark:border-green-500
//           shadow-sm hover:shadow transition-shadow max-w-xs w-full">
//           <UserCheck className="h-6 w-6 text-green-500" />
//           <div className="text-xs font-medium text-green-400">Present</div>
//           <div className="text-xl font-bold text-green-700">{stats.present}</div>
//         </div>
//         <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg
//           bg-red-50 dark:bg-red-900/25 border border-red-200 dark:border-red-500
//           shadow-sm hover:shadow transition-shadow max-w-xs w-full">
//           <UserX className="h-6 w-6 text-red-500" />
//           <div className="text-xs font-medium text-red-400">Absent</div>
//           <div className="text-xl font-bold text-red-700">{stats.absent}</div>
//         </div>
//         <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg
//           bg-blue-50 dark:bg-blue-900/25 border border-blue-200 dark:border-blue-500
//           shadow-sm hover:shadow transition-shadow max-w-xs w-full">
//           <Plane className="h-6 w-6 text-blue-500" />
//           <div className="text-xs font-medium text-blue-400">On Leave</div>
//           <div className="text-xl font-bold text-blue-700">{stats.leave}</div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { AttendanceStats, getAttendanceStats } from "@/lib/api";
import { Users, UserCheck, UserX, Plane, TrendingUp } from "lucide-react";

// Professional minimal skeleton
function AttendanceSkeleton() {
  return (
    <div className="p-6 rounded-xl w-full
      bg-white dark:bg-zinc-900 
      border border-slate-200 dark:border-zinc-800
      shadow-sm">
      
      <div className="space-y-5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="w-36 h-5 rounded bg-slate-200 dark:bg-zinc-800" />
            <div className="w-28 h-3 rounded bg-slate-100 dark:bg-zinc-800/60" />
          </div>
          <div className="w-16 h-7 rounded-full bg-slate-100 dark:bg-zinc-800" />
        </div>
        
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} 
              className="flex flex-col gap-3 p-4 rounded-lg
                bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800
                h-28">
              <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-zinc-700" />
              <div className="space-y-2 mt-auto">
                <div className="w-16 h-2.5 rounded bg-slate-200 dark:bg-zinc-700" />
                <div className="w-10 h-6 rounded bg-slate-300 dark:bg-zinc-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AttendanceStatusWidget() {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getAttendanceStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !stats) return <AttendanceSkeleton />;

  const statCards = [
    {
      icon: Users,
      label: "Total Employees",
      value: stats.total,
      iconBg: "bg-slate-100 dark:bg-slate-800",
      iconColor: "text-slate-600 dark:text-slate-400",
      border: "border-slate-200 dark:border-zinc-800",
      cardBg: "bg-slate-50/50 dark:bg-zinc-900/50",
      textColor: "text-slate-900 dark:text-slate-100",
      labelColor: "text-slate-600 dark:text-slate-400",
    },
    {
      icon: UserCheck,
      label: "Present",
      value: stats.present,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
      iconColor: "text-emerald-600 dark:text-emerald-500",
      border: "border-emerald-100 dark:border-emerald-900/50",
      cardBg: "bg-emerald-50/30 dark:bg-emerald-950/20",
      textColor: "text-emerald-700 dark:text-emerald-400",
      labelColor: "text-emerald-600/80 dark:text-emerald-500/80",
    },
    {
      icon: UserX,
      label: "Absent",
      value: stats.absent,
      iconBg: "bg-rose-50 dark:bg-rose-950/50",
      iconColor: "text-rose-600 dark:text-rose-500",
      border: "border-rose-100 dark:border-rose-900/50",
      cardBg: "bg-rose-50/30 dark:bg-rose-950/20",
      textColor: "text-rose-700 dark:text-rose-400",
      labelColor: "text-rose-600/80 dark:text-rose-500/80",
    },
    {
      icon: Plane,
      label: "On Leave",
      value: stats.leave,
      iconBg: "bg-blue-50 dark:bg-blue-950/50",
      iconColor: "text-blue-600 dark:text-blue-500",
      border: "border-blue-100 dark:border-blue-900/50",
      cardBg: "bg-blue-50/30 dark:bg-blue-950/20",
      textColor: "text-blue-700 dark:text-blue-400",
      labelColor: "text-blue-600/80 dark:text-blue-500/80",
    },
  ];

  const attendanceRate = stats.total > 0 
    ? ((stats.present / stats.total) * 100).toFixed(1) 
    : "0";

  return (
    <div className="p-6 rounded-xl w-full
      bg-white dark:bg-zinc-900 
      border border-slate-200 dark:border-zinc-800
      shadow-sm hover:shadow-md transition-shadow duration-300">

      {/* Content */}
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Today's Attendance
              </h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full 
                  rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
          </div>
          
          {/* Attendance rate badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
            bg-emerald-50 dark:bg-emerald-950/30
            border border-emerald-200 dark:border-emerald-900/50">
            
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`group flex flex-col gap-3 p-4 rounded-lg
                  ${stat.cardBg} ${stat.border}
                  border transition-all duration-200
                  hover:shadow-md hover:-translate-y-0.5 cursor-default`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${stat.iconBg}
                    transition-transform duration-200 
                    group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
                
                <div className="mt-auto space-y-1">
                  <p className={`text-xs font-medium ${stat.labelColor}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-semibold tracking-tight ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
