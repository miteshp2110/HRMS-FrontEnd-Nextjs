// "use client";

// import * as React from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { CheckCircle2, Cpu, Layers, PieChart, Sliders } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { type PayrollCycle, type PayslipSummary, getPayslipsForCycle } from "@/lib/api";

// interface Props {
//   cycle: PayrollCycle;
//   onStatusChange: (newStatus: string) => Promise<void>;
//   onRefresh(): void;
// }

// export function OverviewTab({ cycle, onStatusChange, onRefresh }: Props) {
//   const { toast } = useToast();
//   const [payslips, setPayslips] = React.useState<PayslipSummary[]>([]);
//   const [isLoading, setIsLoading] = React.useState(false);

//   // Load payslip summary for stats
//   React.useEffect(() => {
//     if (!["Review", "Finalized", "Paid"].includes(cycle.status)) return;
//     (async () => {
//       try {
//         setIsLoading(true);
//         const data = await getPayslipsForCycle(cycle.id);
//         setPayslips(data);
//       } catch {
//         toast({ title: "Error", description: "Failed to load payslips.", variant: "destructive" });
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, [cycle.id, cycle.status, toast]);

//   // Compute summary
//   const totalPayslips = payslips.length;
//   const reviewed = payslips.filter(p => p.status === "Reviewed").length;
//   const finalized = payslips.filter(p => p.status === "Finalized").length;

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Cycle Overview</CardTitle>
//           <CardDescription>
//             Quick summary and navigation for cycle “<strong>{cycle.cycle_name}</strong>”
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="p-4 bg-blue-50 rounded-lg">
//               <div className="flex items-center mb-2">
//                 <PieChart className="w-5 h-5 text-blue-600 mr-2" />
//                 <span>Total Payslips</span>
//               </div>
//               <div className="text-2xl font-bold">{totalPayslips}</div>
//             </div>
//             <div className="p-4 bg-green-50 rounded-lg">
//               <div className="flex items-center mb-2">
//                 <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
//                 <span>Reviewed</span>
//               </div>
//               <div className="text-2xl font-bold">{reviewed}</div>
//             </div>
//             <div className="p-4 bg-indigo-50 rounded-lg">
//               <div className="flex items-center mb-2">
//                 <Layers className="w-5 h-5 text-indigo-600 mr-2" />
//                 <span>Finalized</span>
//               </div>
//               <div className="text-2xl font-bold">{finalized}</div>
//             </div>
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center mb-2">
//                 <Sliders className="w-5 h-5 text-gray-600 mr-2" />
//                 <span>Status</span>
//               </div>
//               <Badge className="capitalize">{cycle.status}</Badge>
//             </div>
//           </div>

//           <div className="mt-6 flex space-x-2">
//             <Button onClick={onRefresh} variant="outline">
//               Refresh
//             </Button>
//             <Button
//   onClick={() => onStatusChange('Auditing')}
//   disabled={cycle.status !== 'Draft'}
// >
//   Move to Auditing
// </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle2, 
  Cpu, 
  Layers, 
  PieChart, 
  Sliders, 
  RefreshCw,
  ArrowRight,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Loader2,
  Sparkles,
  Clock,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type PayrollCycle, type PayslipSummary, getPayslipsForCycle } from "@/lib/api";

interface Props {
  cycle: PayrollCycle;
  onStatusChange: (newStatus: string) => Promise<void>;
  onRefresh(): void;
}

// Currency formatter for AED
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Loading Skeletons
const StatCardSkeleton = () => (
  <div className="p-5 bg-gradient-to-br from-muted/30 to-muted/10 dark:from-muted/10 dark:to-muted/5 rounded-lg border border-border/40 dark:border-border/20">
    <div className="flex items-center mb-3">
      <Skeleton className="w-5 h-5 mr-2 rounded bg-muted/50 dark:bg-muted/30" />
      <Skeleton className="h-4 w-24 bg-muted/50 dark:bg-muted/30" />
    </div>
    <Skeleton className="h-8 w-16 bg-muted/50 dark:bg-muted/30" />
  </div>
);

export function OverviewTab({ cycle, onStatusChange, onRefresh }: Props) {
  const { toast } = useToast();
  const [payslips, setPayslips] = React.useState<PayslipSummary[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Load payslip summary for stats
  React.useEffect(() => {
    if (!["Review", "Finalized", "Paid"].includes(cycle.status)) return;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getPayslipsForCycle(cycle.id);
        setPayslips(data);
      } catch (error: any) {
        toast({ 
          title: "Error", 
          description: `Failed to load payslip data: ${error.message}`, 
          variant: "destructive" 
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [cycle.id, cycle.status, toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast({ 
        title: "Refreshed", 
        description: "Cycle data has been updated",
        duration: 2000
      });
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusTransition = async () => {
    setIsTransitioning(true);
    try {
      await onStatusChange('Auditing');
      toast({ 
        title: "Success", 
        description: "Cycle moved to Auditing phase",
        duration: 3000
      });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Failed to transition: ${error.message}`, 
        variant: "destructive" 
      });
    } finally {
      setIsTransitioning(false);
    }
  };

  // Compute summary
  const totalPayslips = payslips.length;
  const reviewed = payslips.filter(p => p.status === "Reviewed").length;
  const finalized = payslips.filter(p => p.status === "Finalized").length;
  const totalGrossEarnings = payslips.reduce((sum, p) => sum + parseFloat(p.gross_earnings || '0'), 0);
  const totalDeductions = payslips.reduce((sum, p) => sum + parseFloat(p.total_deductions || '0'), 0);
  const totalNetPay = payslips.reduce((sum, p) => sum + parseFloat(p.net_pay || '0'), 0);

  // Calculate cycle duration
  const startDate = new Date(cycle.start_date);
  const endDate = new Date(cycle.end_date);
  const cycleDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6 p-6">
      {/* Overview Header */}
      <Card className="border-border/40 dark:border-border/20 bg-gradient-to-br from-card to-card/50 dark:from-card/40 dark:to-card/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg transition-all hover:scale-110 duration-300 shadow-md">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="dark:text-foreground/90">Cycle Overview</CardTitle>
                <CardDescription className="dark:text-muted-foreground/80">
                  Comprehensive summary for <strong className="text-foreground dark:text-foreground/90">{cycle.cycle_name}</strong>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleRefresh} 
                variant="outline"
                disabled={isRefreshing}
                className="gap-2 dark:border-border/40 dark:hover:bg-accent/30 transition-all duration-300"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              {cycle.status === 'Draft' && (
                <Button
                  onClick={handleStatusTransition}
                  disabled={isTransitioning}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 transition-all duration-300"
                >
                  {isTransitioning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Transitioning...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Start Audit
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cycle Information Card */}
      <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center dark:text-foreground/90">
            <FileText className="w-5 h-5 mr-2" />
            Cycle Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/40 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-200 dark:bg-blue-800/40 rounded-lg mr-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Cycle Name</span>
              </div>
              <div className="text-xl font-bold text-blue-900 dark:text-blue-200">{cycle.cycle_name}</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800/40 hover:shadow-lg dark:hover:shadow-green-500/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-200 dark:bg-green-800/40 rounded-lg mr-2">
                  <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Duration</span>
              </div>
              <div className="text-xl font-bold text-green-900 dark:text-green-200">{cycleDuration} days</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-purple-200 dark:bg-purple-800/40 rounded-lg mr-2">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Initiated By</span>
              </div>
              <div className="text-lg font-bold text-purple-900 dark:text-purple-200 truncate">{cycle.initiated_by_name}</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/40 hover:shadow-lg dark:hover:shadow-orange-500/10 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-orange-200 dark:bg-orange-800/40 rounded-lg mr-2">
                  <Sliders className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Status</span>
              </div>
              <Badge 
                className={`text-sm capitalize ${
                  cycle.status === 'Paid' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/40'
                    : cycle.status === 'Finalized'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
                    : cycle.status === 'Review'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/40'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200 border-gray-200 dark:border-gray-700'
                } border`}
              >
                {cycle.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payslip Statistics */}
      {["Review", "Finalized", "Paid"].includes(cycle.status) && (
        <Card className="border-border/40 dark:border-border/20 bg-card dark:bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-foreground/90">
              <PieChart className="w-5 h-5 mr-2" />
              Payslip Statistics
            </CardTitle>
            <CardDescription className="dark:text-muted-foreground/80">
              Comprehensive breakdown of payslip data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </div>
            ) : (
              <>
                {/* Count Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/40 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-200 dark:bg-blue-800/40 rounded-lg mr-2">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Payslips</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-200">{totalPayslips}</div>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-lg border border-green-200 dark:border-green-800/40 hover:shadow-lg dark:hover:shadow-green-500/10 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-green-200 dark:bg-green-800/40 rounded-lg mr-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Reviewed</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold text-green-900 dark:text-green-200">{reviewed}</div>
                      {totalPayslips > 0 && (
                        <Badge variant="secondary" className="text-xs dark:bg-secondary/50">
                          {Math.round((reviewed / totalPayslips) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-purple-200 dark:bg-purple-800/40 rounded-lg mr-2">
                        <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Finalized</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-bold text-purple-900 dark:text-purple-200">{finalized}</div>
                      {totalPayslips > 0 && (
                        <Badge variant="secondary" className="text-xs dark:bg-secondary/50">
                          {Math.round((finalized / totalPayslips) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/40 hover:shadow-lg dark:hover:shadow-orange-500/10 transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-orange-200 dark:bg-orange-800/40 rounded-lg mr-2">
                        <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending</span>
                    </div>
                    <div className="text-3xl font-bold text-orange-900 dark:text-orange-200">
                      {totalPayslips - reviewed}
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 dark:from-muted/20 dark:to-muted/10 rounded-lg border border-border/40 dark:border-border/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center dark:text-foreground/90">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center space-y-2 p-4 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Total Gross Earnings
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(totalGrossEarnings)}
                      </div>
                    </div>
                    <div className="text-center space-y-2 p-4 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                        <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400 rotate-180" />
                        Total Deductions
                      </div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(totalDeductions)}
                      </div>
                    </div>
                    <div className="text-center space-y-2 p-4 rounded-lg hover:bg-background/50 dark:hover:bg-background/30 transition-all duration-300">
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Total Net Pay
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(totalNetPay)}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
