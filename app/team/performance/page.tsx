"use client";

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, ArrowRight } from "lucide-react";
import {
  getReviewCycles,
  getTeamAppraisalStatuses,
  initiateTeamAppraisals,
  type ReviewCycle,
  type TeamAppraisalStatus,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function TeamPerformancePage() {
  const { toast } = useToast();
  const [cycles, setCycles] = React.useState<ReviewCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = React.useState<string>("");
  const [teamStatuses, setTeamStatuses] = React.useState<TeamAppraisalStatus[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isInitiating, setIsInitiating] = React.useState(false);

  React.useEffect(() => {
    getReviewCycles().then(setCycles);
  }, []);

  React.useEffect(()=>{
    handleCycleChange(selectedCycleId)
  },[selectedCycleId])

  const handleCycleChange = async (cycleId: string) => {
    setSelectedCycleId(cycleId);
    setIsLoading(true);
    try {
      const data = await getTeamAppraisalStatuses(Number(cycleId));
      
      setTeamStatuses(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load team appraisal statuses.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiate = async () => {
    if (!selectedCycleId) return;
    setIsInitiating(true);
    try {
      await initiateTeamAppraisals(Number(selectedCycleId));
      toast({
        title: "Success",
        description: "Appraisals initiated for your team.",
      });
      handleCycleChange(selectedCycleId); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Initiation failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsInitiating(false);
    }
  };

  const appraisalsNotStarted =
    teamStatuses.length > 0 &&
    teamStatuses.every((s) => s.status === "Not Started");

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <BarChart className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Team Performance</h1>
            <p className="text-muted-foreground">
              Manage and track your team's appraisals for each review cycle.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Review Cycle Dashboard</CardTitle>
            <div className="flex justify-between items-center pt-2">
              <Select onValueChange={handleCycleChange}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a cycle..." />
                </SelectTrigger>
                <SelectContent>
                  {cycles.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.cycle_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedCycleId &&
                teamStatuses[0].status === null) && (
                  <Button onClick={handleInitiate} disabled={isInitiating}>
                    {isInitiating
                      ? "Initiating..."
                      : "Initiate Appraisals for Team"}
                  </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Loading team statuses...
                    </TableCell>
                  </TableRow>
                ) : selectedCycleId ? (
                  teamStatuses.map((emp) => (
                    <TableRow key={emp.employee_id}>
                      <TableCell className="font-medium">
                        {emp.employee_name}
                      </TableCell>
                      <TableCell>
                        <Badge>{emp.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {emp.appraisal_id ? (
                          <Button asChild variant="outline" size="sm">
                            <Link
                              href={`/team/performance/${emp.appraisal_id}`}
                            >
                              View/Edit Appraisal{" "}
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Not Initiated
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      No Cycle Selected
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
