// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { format } from "date-fns";
// import { CalendarDays } from "lucide-react";

// interface UpcomingHolidayWidgetProps {
//   upcomingHoliday: {
//     name: string;
//     holiday_date: string;
//   } | null;
// }

// export function UpcomingHolidayWidget({
//   upcomingHoliday,
// }: UpcomingHolidayWidgetProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Upcoming Holiday</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {upcomingHoliday ? (
//           <div className="flex items-center">
//             <CalendarDays className="w-12 h-12 mr-4 text-primary" />
//             <div>
//               <p className="text-xl font-bold">{upcomingHoliday.name}</p>
//               <p className="text-muted-foreground">
//                 {format(new Date(upcomingHoliday.holiday_date), "EEEE, MMMM do")}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <p className="text-muted-foreground">No upcoming holidays.</p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { CalendarDays, PartyPopper, Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface UpcomingHolidayWidgetProps {
  upcomingHoliday: {
    name: string;
    holiday_date: string;
  } | null;
}

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  isToday: boolean;
  isPast: boolean;
}

export function UpcomingHolidayWidget({
  upcomingHoliday,
}: UpcomingHolidayWidgetProps) {
  const [countdown, setCountdown] = useState<CountdownData>({
    days: 0,
    hours: 0,
    minutes: 0,
    isToday: false,
    isPast: false,
  });

  useEffect(() => {
    if (!upcomingHoliday) return;

    const calculateCountdown = () => {
      const now = new Date();
      const holidayDate = new Date(upcomingHoliday.holiday_date);
      
      const days = differenceInDays(holidayDate, now);
      const hours = differenceInHours(holidayDate, now) % 24;
      const minutes = differenceInMinutes(holidayDate, now) % 60;
      
      setCountdown({
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        isToday: days === 0,
        isPast: days < 0,
      });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [upcomingHoliday]);

  if (!upcomingHoliday) {
    return (
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <CalendarDays className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No upcoming holidays scheduled</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Check back later for updates</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyColor = () => {
    if (countdown.isToday) return "from-green-500 to-emerald-600";
    if (countdown.days <= 7) return "from-orange-500 to-red-600";
    if (countdown.days <= 30) return "from-blue-500 to-indigo-600";
    return "from-purple-500 to-pink-600";
  };

  const getUrgencyBadge = () => {
    if (countdown.isToday) return { text: "Today!", variant: "default" as const };
    if (countdown.days <= 7) return { text: "Coming Soon", variant: "destructive" as const };
    return { text: "Upcoming", variant: "secondary" as const };
  };

  const urgencyBadge = getUrgencyBadge();

  return (
    <Card className="border-0 shadow-lg overflow-hidden relative group">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getUrgencyColor()} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-10">
        <Sparkles className="w-16 h-16 text-foreground animate-pulse" />
      </div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getUrgencyColor()} flex items-center justify-center shadow-lg`}>
              <PartyPopper className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Upcoming Holiday</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {countdown.isToday ? "Celebrate today!" : "Mark your calendar"}
              </p>
            </div>
          </div>
          
          <Badge 
            variant={urgencyBadge.variant}
            className="font-semibold px-3 py-1 text-xs shadow-sm"
          >
            {urgencyBadge.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 relative z-10">
        {/* Holiday Name & Date */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-border transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-foreground mb-2 leading-tight">
                {upcomingHoliday.name}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm font-medium">
                  {format(new Date(upcomingHoliday.holiday_date), "EEEE, MMMM do, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        {!countdown.isPast && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Countdown
              </h4>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Days */}
              <div className="relative">
                <div className="p-4 rounded-xl bg-background border-2 border-border/50 hover:border-primary/30 transition-all shadow-sm">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground tabular-nums leading-none mb-2">
                      {countdown.days}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {countdown.days === 1 ? "Day" : "Days"}
                    </p>
                  </div>
                </div>
                {countdown.days > 0 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Hours */}
              <div className="p-4 rounded-xl bg-background border-2 border-border/50 hover:border-primary/30 transition-all shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground tabular-nums leading-none mb-2">
                    {countdown.hours}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {countdown.hours === 1 ? "Hour" : "Hours"}
                  </p>
                </div>
              </div>

              {/* Minutes */}
              <div className="p-4 rounded-xl bg-background border-2 border-border/50 hover:border-primary/30 transition-all shadow-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground tabular-nums leading-none mb-2">
                    {countdown.minutes}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {countdown.minutes === 1 ? "Min" : "Mins"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Message */}
        <div className={`p-4 rounded-lg ${
          countdown.isToday 
            ? "bg-green-500/10 border border-green-500/20" 
            : "bg-primary/5 border border-primary/10"
        }`}>
          <p className={`text-center text-sm font-medium ${
            countdown.isToday ? "text-green-700" : "text-primary"
          }`}>
            {countdown.isToday 
              ? "🎉 Enjoy your holiday today!" 
              : countdown.days === 1
              ? "🎊 Holiday is tomorrow! Get ready!"
              : countdown.days <= 7
              ? `Only ${countdown.days} days left to prepare!`
              : "Looking forward to the celebration!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
