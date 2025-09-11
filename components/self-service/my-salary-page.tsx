
"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getMySalaryStructure, type SalaryComponent } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MySalaryPage() {
  const [structure, setStructure] = React.useState<SalaryComponent[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const { toast } = useToast()

  React.useEffect(() => {
    const fetchStructure = async () => {
      try {
        setIsLoading(true)
        const data = await getMySalaryStructure()
        setStructure(data)
      } catch (error: any) {
        toast({ title: "Error", description: `Could not load your salary structure: ${error.message}`, variant: "destructive"})
      } finally {
        setIsLoading(false)
      }
    }
    fetchStructure()
  }, [toast])

  const { totalEarnings, totalDeductions, netSalary } = React.useMemo(() => {
    const earnings = structure.filter(c => c.component_type === 'earning').reduce((sum, c) => sum + c.calculated_amount, 0);
    const deductions = structure.filter(c => c.component_type === 'deduction').reduce((sum, c) => sum + c.calculated_amount, 0);
    return { totalEarnings: earnings, totalDeductions: deductions, netSalary: earnings - deductions };
  }, [structure]);

  const chartData = [
    { name: "Net Salary", value: netSalary, color: "#22c55e" },
    { name: "Deductions", value: totalDeductions, color: "#ef4444" },
  ]

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  
  const getComponentBadge = (type: "earning" | "deduction") => (
    <Badge variant={type === "earning" ? "default" : "secondary"} className={type === "earning" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
      {type === "earning" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
      {type === "earning" ? "Earning" : "Deduction"}
    </Badge>
  )
  
  if (isLoading) {
    return <div className="text-center py-12">Loading your salary details...</div>
  }

  if (!structure || structure.length === 0) {
      return (
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Salary Structure Found</AlertTitle>
            <AlertDescription>Your salary structure has not been configured yet. Please contact HR for assistance.</AlertDescription>
        </Alert>
      )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="text-sm font-medium">Total Earnings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Total Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Net Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{formatCurrency(netSalary)}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Salary Breakdown</CardTitle><CardDescription>Visual breakdown of your salary components</CardDescription></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Salary Components</CardTitle><CardDescription>Detailed breakdown of all your components</CardDescription></CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader><TableRow><TableHead>Component</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {structure.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{component.component_name}</p>
                          {component.value_type === "percentage" && component.based_on_component_name && (
                            <p className="text-xs text-muted-foreground">{component.value}% of {component.based_on_component_name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getComponentBadge(component.component_type)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(component.calculated_amount)}</TableCell>
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