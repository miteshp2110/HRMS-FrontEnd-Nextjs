// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useEffect, useState } from "react";

// interface WelcomeWidgetProps {
//   user: {
//     first_name: string;
//     reports_to_name: string;
//   };
// }

// export function WelcomeWidget({ user }: WelcomeWidgetProps) {
//   const [time, setTime] = useState("");
//   const [date, setDate] = useState("");
//   const [timeZone, setTimeZone] = useState("");

//   useEffect(() => {
    // const storedTimeZone = localStorage.getItem("selectedTimezone");
//     const tz = storedTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
//     setTimeZone(tz);

//     const updateDateTime = () => {
//       const now = new Date();
//       setTime(
//         now.toLocaleTimeString("en-US", {
//           timeZone: tz,
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       );
//       setDate(
//         now.toLocaleDateString("en-US", {
//           timeZone: tz,
//           weekday: "long",
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })
//       );
//     };

//     updateDateTime();
//     const timer = setInterval(updateDateTime, 1000 * 60); // Update every minute

//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Welcome, {user.first_name}!</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="text-4xl font-bold">{time}</div>
//         <p className="text-muted-foreground">{date}</p>
//         <p className="text-muted-foreground">Timezone: {timeZone}</p>
//         <div className="mt-4">
//           <p>
//             Reporting Manager: <strong>{user.reports_to_name}</strong>
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Clock, Calendar, User, Sun, Moon, Sunrise, Sunset } from "lucide-react";

interface WelcomeWidgetProps {
  user: {
    first_name: string;
    last_name: string;
    full_employee_id: string;
    reports_to_name: string;
  };
}

interface GreetingData {
  text: string;
  icon: typeof Sun;
}

export function WelcomeWidget({ user }: WelcomeWidgetProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [greeting, setGreeting] = useState<GreetingData>({ text: "", icon: Sun });
  
    
  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  const getGreeting = useCallback((hour: number): GreetingData => {
    if (hour >= 5 && hour < 12) return { text: "Good Morning", icon: Sunrise };
    if (hour >= 12 && hour < 17) return { text: "Good Afternoon", icon: Sun };
    if (hour >= 17 && hour < 21) return { text: "Good Evening", icon: Sunset };
    return { text: "Good Night", icon: Moon };
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone,
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );

      setDate(
        now.toLocaleDateString("en-US", {
          timeZone,
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );

      setGreeting(getGreeting(hour));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000); // Update every second for smoother time display

    return () => clearInterval(timer);
  }, [timeZone, getGreeting]);

  const GreetingIcon = greeting.icon;

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Primary Section - Greeting */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-sm">
              <GreetingIcon className="w-8 h-8 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 tracking-tight">
                {greeting.text}, {user.first_name}!
              </h2>
              <p className="text-sm text-muted-foreground mb-2">
                Welcome back to your dashboard
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold border border-primary/20">
                  {user.full_employee_id}
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid - Responsive Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-3 lg:flex lg:items-center flex-shrink-0">
            {/* Time Card */}
            <div className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md border border-blue-200/50 dark:border-blue-800/30">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              </div>
              <div>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium mb-0.5">
                  Current Time
                </p>
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100 tabular-nums leading-none">
                  {time}
                </div>
              </div>
            </div>

            {/* Date Card */}
            <div className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md border border-purple-200/50 dark:border-purple-800/30">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70 font-medium mb-0.5">
                  Today
                </p>
                <p className="text-sm font-bold text-purple-900 dark:text-purple-100 truncate">
                  {date}
                </p>
              </div>
            </div>

            {/* Manager Card */}
            <div className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium mb-0.5">
                  Reports To
                </p>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 truncate">
                  {user.reports_to_name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
