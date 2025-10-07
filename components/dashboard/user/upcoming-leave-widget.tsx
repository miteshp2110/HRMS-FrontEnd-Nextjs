// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { format } from "date-fns";
// import { Plane } from "lucide-react";

// interface UpcomingLeaveWidgetProps {
//   upcomingLeave: {
//     from_date: string;
//     to_date: string;
//     leave_description: string;
//   } | null;
// }

// export function UpcomingLeaveWidget({ upcomingLeave }: UpcomingLeaveWidgetProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Upcoming Leave</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {upcomingLeave ? (
//           <div className="flex items-center">
//             <Plane className="w-12 h-12 mr-4 text-primary" />
//             <div>
//               <p className="font-bold">
//                 {format(new Date(upcomingLeave.from_date), "MMM dd")} -{" "}
//                 {format(new Date(upcomingLeave.to_date), "MMM dd, yyyy")}
//               </p>
//               <p className="text-muted-foreground">
//                 {upcomingLeave.leave_description}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <p className="text-muted-foreground">No upcoming leaves scheduled.</p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays, differenceInCalendarDays } from "date-fns";
import { 
  Plane, 
  Calendar, 
  Clock, 
  Sunrise,
  MapPin,
  Palmtree,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";

interface UpcomingLeaveWidgetProps {
  upcomingLeave: {
    from_date: string;
    to_date: string;
    leave_description: string;
  } | null;
}

export function UpcomingLeaveWidget({ 
  upcomingLeave 
}: UpcomingLeaveWidgetProps) {
  const [daysUntil, setDaysUntil] = useState(0);
  const [isStartingSoon, setIsStartingSoon] = useState(false);

  useEffect(() => {
    if (!upcomingLeave) return;

    const calculateCountdown = () => {
      const now = new Date();
      const startDate = new Date(upcomingLeave.from_date);
      const days = differenceInDays(startDate, now);
      
      setDaysUntil(Math.max(0, days));
      setIsStartingSoon(days <= 7 && days >= 0);
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 60000);

    return () => clearInterval(timer);
  }, [upcomingLeave]);

  if (!upcomingLeave) {
    return (
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center mb-4">
              <Palmtree className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              No upcoming leaves scheduled
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Time to plan your next vacation!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const leaveDuration = differenceInCalendarDays(
    new Date(upcomingLeave.to_date),
    new Date(upcomingLeave.from_date)
  ) + 1;

  const isToday = daysUntil === 0;

  return (
    <Card className="border-0 shadow-lg overflow-hidden relative group">
      {/* Animated tropical gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-10 animate-bounce">
        <Plane className="w-16 h-16 text-foreground rotate-45" />
      </div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg animate-pulse">
              <Palmtree className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Upcoming Leave</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isToday ? "Your vacation starts today!" : "Your next time off"}
              </p>
            </div>
          </div>
          
          <Badge 
            variant={isToday ? "default" : isStartingSoon ? "destructive" : "secondary"}
            className="font-semibold px-3 py-1 text-xs shadow-sm"
          >
            {isToday ? "Starting Today!" : isStartingSoon ? "Very Soon" : "Scheduled"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 relative z-10">
        {/* Countdown Section */}
        {!isToday && (
          <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                    Countdown
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {daysUntil === 1 ? "Tomorrow!" : `${daysUntil} Days`}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <Sparkles className={`w-8 h-8 ${
                  isStartingSoon ? "text-orange-500 animate-pulse" : "text-blue-500"
                }`} />
              </div>
            </div>
          </div>
        )}

        {/* Leave Details Card */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-border transition-all space-y-4">
          {/* Date Range */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-background shadow-sm flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Leave Period
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-bold text-foreground">
                  {format(new Date(upcomingLeave.from_date), "MMM dd")}
                </p>
                <span className="text-muted-foreground">→</span>
                <p className="text-base font-bold text-foreground">
                  {format(new Date(upcomingLeave.to_date), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <Badge 
                  variant="outline" 
                  className="bg-primary/5 text-primary border-primary/20 text-xs font-medium"
                >
                  {leaveDuration} {leaveDuration === 1 ? "Day" : "Days"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Leave Description */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-background shadow-sm flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Purpose
              </p>
              <p className="text-sm text-foreground font-medium leading-relaxed">
                {upcomingLeave.leave_description}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Start Date Detail */}
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Sunrise className="w-4 h-4 text-green-600" />
              <p className="text-xs text-muted-foreground font-medium">
                Start Date
              </p>
            </div>
            <p className="text-sm font-bold text-green-600">
              {format(new Date(upcomingLeave.from_date), "EEE, MMM dd")}
            </p>
          </div>

          {/* End Date Detail */}
          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 hover:bg-orange-500/10 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <p className="text-xs text-muted-foreground font-medium">
                End Date
              </p>
            </div>
            <p className="text-sm font-bold text-orange-600">
              {format(new Date(upcomingLeave.to_date), "EEE, MMM dd")}
            </p>
          </div>
        </div>

        {/* Status Message */}
        <div className={`p-4 rounded-lg border ${
          isToday
            ? "bg-green-500/10 border-green-500/20"
            : isStartingSoon
            ? "bg-orange-500/10 border-orange-500/20"
            : "bg-blue-500/10 border-blue-500/20"
        }`}>
          <p className={`text-sm font-medium text-center ${
            isToday
              ? "text-green-700"
              : isStartingSoon
              ? "text-orange-700"
              : "text-blue-700"
          }`}>
            {isToday
              ? "🎉 Your vacation begins today! Enjoy your time off!"
              : daysUntil === 1
              ? "🎊 Your leave starts tomorrow! Get ready to unwind!"
              : isStartingSoon
              ? `⏰ Only ${daysUntil} days until your vacation begins!`
              : `✈️ Looking forward to your ${leaveDuration}-day break!`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
