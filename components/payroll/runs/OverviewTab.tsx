"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Cpu, Layers, PieChart, Sliders } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type PayrollCycle, type PayslipSummary, getPayslipsForCycle } from "@/lib/api";

interface Props {
  cycle: PayrollCycle;
  onStatusChange: (newStatus: string) => Promise<void>;
  onRefresh(): void;
}

export function OverviewTab({ cycle, onStatusChange, onRefresh }: Props) {
  const { toast } = useToast();
  const [payslips, setPayslips] = React.useState<PayslipSummary[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Load payslip summary for stats
  React.useEffect(() => {
    if (!["Review", "Finalized", "Paid"].includes(cycle.status)) return;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getPayslipsForCycle(cycle.id);
        setPayslips(data);
      } catch {
        toast({ title: "Error", description: "Failed to load payslips.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [cycle.id, cycle.status, toast]);

  // Compute summary
  const totalPayslips = payslips.length;
  const reviewed = payslips.filter(p => p.status === "Reviewed").length;
  const finalized = payslips.filter(p => p.status === "Finalized").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cycle Overview</CardTitle>
          <CardDescription>
            Quick summary and navigation for cycle “<strong>{cycle.cycle_name}</strong>”
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <PieChart className="w-5 h-5 text-blue-600 mr-2" />
                <span>Total Payslips</span>
              </div>
              <div className="text-2xl font-bold">{totalPayslips}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                <span>Reviewed</span>
              </div>
              <div className="text-2xl font-bold">{reviewed}</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Layers className="w-5 h-5 text-indigo-600 mr-2" />
                <span>Finalized</span>
              </div>
              <div className="text-2xl font-bold">{finalized}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Sliders className="w-5 h-5 text-gray-600 mr-2" />
                <span>Status</span>
              </div>
              <Badge className="capitalize">{cycle.status}</Badge>
            </div>
          </div>

          <div className="mt-6 flex space-x-2">
            <Button onClick={onRefresh} variant="outline">
              Refresh
            </Button>
            <Button
  onClick={() => onStatusChange('Auditing')}
  disabled={cycle.status !== 'Draft'}
>
  Move to Auditing
</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
