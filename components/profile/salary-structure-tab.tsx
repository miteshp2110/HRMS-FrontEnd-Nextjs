"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import type { SalaryComponent, DetailedUserProfile } from "@/lib/api"
import { updateUser, getDetailedUserProfile } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useParams } from "next/navigation"

interface SalaryStructureTabProps {
  salaryStructure: SalaryComponent[]
  isLoading: boolean
}

export function SalaryStructureTab({ salaryStructure, isLoading: initialIsLoading }: SalaryStructureTabProps) {
  const params = useParams();
  const employeeId = Number(params.id);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [profile, setProfile] = React.useState<DetailedUserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(initialIsLoading);


  const fetchProfile = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const profileData = await getDetailedUserProfile(employeeId);
        setProfile(profileData);
    } catch (error) {
        console.error("Failed to fetch profile for salary tab", error);
        toast({ title: "Error", description: "Could not load latest profile data.", variant: "destructive"})
    } finally {
        setIsLoading(false);
    }
  }, [employeeId, toast]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);


  const handleVisibilityChange = async (checked: boolean) => {
    if (!profile) return;
    setIsSaving(true);
    // Optimistic UI update
    setProfile(p => p ? { ...p, salary_visibility: checked } : null);
    try {
      await updateUser(profile.id, { salary_visibility: checked });
      toast({
        title: "Success",
        description: `Salary visibility for ${profile.first_name} has been ${checked ? 'enabled' : 'disabled'}.`
      });
      // No need to call parent, just refetching its own data
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update salary visibility.",
        variant: "destructive"
      });
       // Revert UI on error
      setProfile(p => p ? { ...p, salary_visibility: !checked } : null);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!salaryStructure || salaryStructure.length === 0) {
      return (
        <Card>
            <CardHeader>
                <CardTitle>Salary Structure</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-10 w-10 mx-auto mb-4" />
                <p>No salary structure has been assigned to this employee yet.</p>
            </CardContent>
        </Card>
      )
  }

  const earnings = salaryStructure.filter((comp) => comp.component_type === "earning")
  const deductions = salaryStructure.filter((comp) => comp.component_type === "deduction")

  const totalEarnings = earnings.reduce((sum, comp) => sum + comp.calculated_amount, 0)
  const totalDeductions = deductions.reduce((sum, comp) => sum + comp.calculated_amount, 0)
  const netSalary = totalEarnings - totalDeductions

  const chartData = [
    { name: "Net Salary", value: netSalary, color: "#22c55e" },
    { name: "Deductions", value: totalDeductions, color: "#ef4444" },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const getComponentBadge = (type: "earning" | "deduction") => {
    return (
      <Badge
        variant={type === "earning" ? "default" : "secondary"}
        className={
          type === "earning"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
        }
      >
        {type === "earning" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {type === "earning" ? "Earning" : "Deduction"}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Settings</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <Label htmlFor="salary-visibility" className="font-medium">
                        Salary Visibility
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        Allow employee to view their salary structure and payslips in the self-service portal.
                    </p>
                </div>
                <Switch
                    id="salary-visibility"
                    checked={profile.salary_visibility}
                    onCheckedChange={handleVisibilityChange}
                    disabled={isSaving}
                />
            </div>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card><CardHeader><CardTitle className="text-sm font-medium">Total Earnings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-sm font-medium">Total Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-sm font-medium">Net Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{formatCurrency(netSalary)}</p></CardContent></Card>
            </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Earnings vs Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salary Components</CardTitle>
            <CardDescription>Detailed breakdown of all components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryStructure.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{component.component_name}</p>
                          {component.value_type === "percentage" && component.based_on_component_name && (
                            <p className="text-xs text-muted-foreground">
                              {component.value}% of {component.based_on_component_name}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getComponentBadge(component.component_type)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(component.calculated_amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}