// "use client"

// import * as React from "react"
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
// import type { SalaryComponent, DetailedUserProfile } from "@/lib/api"
// import { updateUser, getDetailedUserProfile } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { useParams } from "next/navigation"
// import { Button } from "../ui/button"
// import Link from "next/link"

// interface SalaryStructureTabProps {
//   employeeId:number
//   salaryStructure: SalaryComponent[]
//   isLoading: boolean
// }

// export function SalaryStructureTab({ salaryStructure, isLoading: initialIsLoading }: SalaryStructureTabProps) {
//   const params = useParams();
//   const employeeId = Number(params.id);
//   const { toast } = useToast();
//   const [isSaving, setIsSaving] = React.useState(false);
//   const [profile, setProfile] = React.useState<DetailedUserProfile | null>(null);
//   const [isLoading, setIsLoading] = React.useState(initialIsLoading);
//   const [isVisible,setVisible] = React.useState(false)


//   const fetchProfile = React.useCallback(async () => {
//     setIsLoading(true);
//     try {
//         const profileData = await getDetailedUserProfile(employeeId);
//         setVisible(profile?.salary_visibility!)
//         setProfile(profileData);
//     } catch (error) {
//         console.error("Failed to fetch profile for salary tab", error);
//         toast({ title: "Error", description: "Could not load latest profile data.", variant: "destructive"})
//     } finally {
//         setIsLoading(false);
//     }
//   }, [employeeId, toast]);

//   React.useEffect(() => {
//     fetchProfile();
//   }, [fetchProfile]);


//   const handleVisibilityChange = async (checked: boolean) => {
//     if (!profile) return;
//     setIsSaving(true);
//     // Optimistic UI update
//     setProfile(p => p ? { ...p, salary_visibility: checked } : null);
//     try {
//       await updateUser(profile.id, { salary_visibility: checked });
//       toast({
//         title: "Success",
//         description: `Salary visibility for ${profile.first_name} has been ${checked ? 'enabled' : 'disabled'}.`
//       });
//       // No need to call parent, just refetching its own data
//       // fetchProfile();
//     } catch (error: any) {
//       toast({
//         title: "Update Failed",
//         description: error.message || "Could not update salary visibility.",
//         variant: "destructive"
//       });
//        // Revert UI on error
//       setProfile(p => p ? { ...p, salary_visibility: !checked } : null);
//     } finally {
//       setIsSaving(false);
//     }
//   }

//   if (isLoading || !profile) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     )
//   }
  
//   if (!salaryStructure || salaryStructure.length === 0) {
//       return (
//         <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle>Salary Structure</CardTitle>
//                 <Link href={``}><Button>Salary Management</Button></Link>
//             </CardHeader>
//             <CardContent className="text-center py-12 text-muted-foreground">
//                 <DollarSign className="h-10 w-10 mx-auto mb-4" />
//                 <p>No salary structure has been assigned to this employee yet.</p>
//             </CardContent>
//         </Card>
//       )
//   }

//   const earnings = salaryStructure.filter((comp) => comp.component_type === "earning")
//   const deductions = salaryStructure.filter((comp) => comp.component_type === "deduction")

//   const totalEarnings = earnings.reduce((sum, comp) => sum + comp.calculated_amount, 0)
//   const totalDeductions = deductions.reduce((sum, comp) => sum + comp.calculated_amount, 0)
//   const netSalary = totalEarnings - totalDeductions

//   const chartData = [
//     { name: "Net Salary", value: netSalary, color: "#22c55e" },
//     { name: "Deductions", value: totalDeductions, color: "#ef4444" },
//   ]

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
//   }

//   const getComponentBadge = (type: "earning" | "deduction") => {
//     return (
//       <Badge
//         variant={type === "earning" ? "default" : "secondary"}
//         className={
//           type === "earning"
//             ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
//             : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
//         }
//       >
//         {type === "earning" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
//         {type === "earning" ? "Earning" : "Deduction"}
//       </Badge>
//     )
//   }

//   return (
//     <div className="space-y-6">
//        <Card>
//         <CardHeader>
//             <div className="flex justify-between items-center">
//                 <CardTitle>Settings</CardTitle>
//                 <Link href={`/payroll/structure/${employeeId}`}><Button>Salary Management</Button></Link>
//             </div>
//         </CardHeader>
//         <CardContent>
//             <div className="flex items-center justify-between p-4 border rounded-lg">
//                 <div>
//                     <Label htmlFor="salary-visibility" className="font-medium">
//                         Salary Visibility
//                     </Label>
//                     <p className="text-xs text-muted-foreground">
//                         Allow employee to view their salary structure and payslips in the self-service portal.
//                     </p>
//                 </div>
//                 <Switch
//                     id="salary-visibility"
//                     checked={profile.salary_visibility}
//                     onCheckedChange={handleVisibilityChange}
//                     disabled={isSaving}
//                 />
//             </div>
//         </CardContent>
//       </Card>


//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Card><CardHeader><CardTitle className="text-sm font-medium">Total Earnings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p></CardContent></Card>
//               <Card><CardHeader><CardTitle className="text-sm font-medium">Total Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p></CardContent></Card>
//               <Card><CardHeader><CardTitle className="text-sm font-medium">Net Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{formatCurrency(netSalary)}</p></CardContent></Card>
//             </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Earnings vs Deductions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={chartData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={120}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {chartData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(value) => formatCurrency(Number(value))} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Salary Components</CardTitle>
//             <CardDescription>Detailed breakdown of all components</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Component</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead className="text-right">Amount</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {salaryStructure.map((component) => (
//                     <TableRow key={component.id}>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{component.component_name}</p>
//                           {component.value_type === "percentage" && component.based_on_component_name && (
//                             <p className="text-xs text-muted-foreground">
//                               {component.value}% of {component.based_on_component_name}
//                             </p>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>{getComponentBadge(component.component_type)}</TableCell>
//                       <TableCell className="text-right font-medium">
//                         {formatCurrency(component.calculated_amount)}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Eye, 
  EyeOff,
  Loader2,
  Settings,
  ExternalLink
} from "lucide-react"
import type { SalaryComponent, DetailedUserProfile } from "@/lib/api"
import { updateUser, getDetailedUserProfile } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useParams } from "next/navigation"
import { Button } from "../ui/button"
import Link from "next/link"

// Variable component IDs (Overtime components)
const VARIABLE_COMPONENT_IDS = [5, 6]

// Format number as AED currency
const formatAED = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount)
}

interface SalaryStructureTabProps {
  employeeId: number
  salaryStructure: SalaryComponent[]
  isLoading: boolean
}

// Skeleton Components
function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function SalaryStructureTab({ salaryStructure, isLoading: initialIsLoading }: SalaryStructureTabProps) {
  const params = useParams()
  const employeeId = Number(params.id)
  const { toast } = useToast()
  const [isSaving, setIsSaving] = React.useState(false)
  const [profile, setProfile] = React.useState<DetailedUserProfile | null>(null)
  const [isLoading, setIsLoading] = React.useState(initialIsLoading)

  const fetchProfile = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const profileData = await getDetailedUserProfile(employeeId)
      setProfile(profileData)
    } catch (error) {
      console.error("Failed to fetch profile for salary tab", error)
      toast({ 
        title: "Error", 
        description: "Could not load latest profile data.", 
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [employeeId, toast])

  React.useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleVisibilityChange = async (checked: boolean) => {
    if (!profile) return
    setIsSaving(true)
    setProfile(p => p ? { ...p, salary_visibility: checked } : null)
    try {
      await updateUser(profile.id, { salary_visibility: checked })
      toast({
        title: "Success",
        description: `Salary visibility for ${profile.first_name} has been ${checked ? 'enabled' : 'disabled'}.`
      })
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update salary visibility.",
        variant: "destructive"
      })
      setProfile(p => p ? { ...p, salary_visibility: !checked } : null)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !profile) {
    return <PageSkeleton />
  }
  
  if (!salaryStructure || salaryStructure.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Salary Structure</CardTitle>
          <Button asChild>
            <Link href={`/payroll/structure/${employeeId}`}>
              <Settings className="h-4 w-4 mr-2" />
              Salary Management
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-muted rounded-full">
              <DollarSign className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No Salary Structure</h3>
          <p className="text-muted-foreground">
            No salary structure has been assigned to this employee yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Separate components into earnings, deductions, and variables
  const earningsComponents = salaryStructure.filter(
    (comp) => comp.component_type === "earning" && !VARIABLE_COMPONENT_IDS.includes(comp.component_id)
  )
  const deductionsComponents = salaryStructure.filter(
    (comp) => comp.component_type === "deduction" && !VARIABLE_COMPONENT_IDS.includes(comp.component_id)
  )
  const variableComponents = salaryStructure.filter((comp) => 
    VARIABLE_COMPONENT_IDS.includes(comp.component_id)
  )

  const totalEarnings = earningsComponents.reduce((sum, comp) => sum + comp.calculated_amount, 0)
  const totalDeductions = deductionsComponents.reduce((sum, comp) => sum + comp.calculated_amount, 0)
  const netSalary = totalEarnings - totalDeductions

  const chartData = [
    { name: "Net Salary", value: netSalary, color: "#22c55e" },
    { name: "Deductions", value: totalDeductions, color: "#ef4444" },
  ]

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
      {/* Settings Card */}
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900">
          <div className="flex justify-between items-center">
            <CardTitle className="text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <Button asChild variant="outline">
              <Link href={`/payroll/structure/${employeeId}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Salary Management
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-3">
              {profile.salary_visibility ? (
                <Eye className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <div>
                <Label htmlFor="salary-visibility" className="font-semibold cursor-pointer">
                  Salary Visibility
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Allow employee to view their salary structure and payslips in the self-service portal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              <Switch
                id="salary-visibility"
                checked={profile.salary_visibility}
                onCheckedChange={handleVisibilityChange}
                disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatAED(totalEarnings)}</p>
            <p className="text-xs text-muted-foreground mt-1">Excluding variable components</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Total Deductions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatAED(totalDeductions)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Net Salary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{formatAED(netSalary)}</p>
            <p className="text-xs text-muted-foreground mt-1">Base monthly salary</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Earnings vs Deductions</CardTitle>
            <CardDescription>Visual breakdown of salary composition</CardDescription>
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
                  <Tooltip formatter={(value) => formatAED(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Salary Summary</CardTitle>
            <CardDescription>Fixed salary components breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Gross Earnings</span>
                <span className="font-semibold text-green-600">{formatAED(totalEarnings)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Deductions</span>
                <span className="font-semibold text-red-600">- {formatAED(totalDeductions)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Net Monthly Salary</span>
                <span className="text-xl font-bold text-blue-600">{formatAED(netSalary)}</span>
              </div>
            </div>

            {variableComponents.length > 0 && (
              <>
                <Separator />
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/30">
                  <Activity className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-900 dark:text-orange-100 text-xs">
                    Variable components are excluded from net salary and calculated based on actual hours worked
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Earnings Components */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Earnings Components
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Fixed earning components contributing to monthly salary
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Calculation</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earningsComponents.map((component) => (
                  <TableRow key={component.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{component.component_name}</TableCell>
                    <TableCell>
                      {component.calculation_type === "Percentage" && component.based_on_component_name ? (
                        <span className="text-sm text-muted-foreground">
                          {component.value}% of {component.based_on_component_name}
                        </span>
                      ) : component.calculation_type === "Formula" ? (
                        <Badge variant="outline" className="text-xs">Formula</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Fixed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatAED(component.calculated_amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-green-50 dark:bg-green-950/30 font-bold">
                  <TableCell colSpan={2}>Total Earnings</TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatAED(totalEarnings)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Deductions Components */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Deductions Components
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-300">
            Fixed deduction components subtracted from monthly salary
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Calculation</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deductionsComponents.map((component) => (
                  <TableRow key={component.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{component.component_name}</TableCell>
                    <TableCell>
                      {component.calculation_type === "Percentage" && component.based_on_component_name ? (
                        <span className="text-sm text-muted-foreground">
                          {component.value}% of {component.based_on_component_name}
                        </span>
                      ) : component.calculation_type === "Formula" ? (
                        <Badge variant="outline" className="text-xs">Formula</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Fixed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      {formatAED(component.calculated_amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-red-50 dark:bg-red-950/30 font-bold">
                  <TableCell colSpan={2}>Total Deductions</TableCell>
                  <TableCell className="text-right text-red-600">
                    {formatAED(totalDeductions)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Variable Components */}
      {variableComponents.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardTitle className="text-orange-900 dark:text-orange-100 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Variable Components
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Overtime and variable pay components (not included in net salary)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Calculation</TableHead>
                    <TableHead className="text-right">Rate per Hour</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variableComponents.map((component) => (
                    <TableRow key={component.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{component.component_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">Formula-based</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-orange-600">
                        {formatAED(component.calculated_amount)}/hr
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Alert className="mt-4 border-orange-200 bg-orange-50 dark:bg-orange-950/30">
              <Activity className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-900 dark:text-orange-100 text-xs">
                These components are calculated per hour and will be added to payslips based on actual hours worked each month
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
