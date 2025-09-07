"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { type SalaryComponent, getMySalaryStructure } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MySalaryPage() {
  const [salaryStructure, setSalaryStructure] = useState<SalaryComponent[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSalaryData()
  }, [])

  const loadSalaryData = async () => {
    try {
      setLoading(true)
      // Using current user's ID (1) for demo
      const data = await getMySalaryStructure()
      setSalaryStructure(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load salary data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateTotals = () => {
    const earnings = salaryStructure
      .filter((component) => component.component_type === "earning")
      .reduce((sum, component) => sum + component.calculated_amount, 0)

    const deductions = salaryStructure
      .filter((component) => component.component_type === "deduction")
      .reduce((sum, component) => sum + component.calculated_amount, 0)

    return { earnings, deductions, netSalary: earnings - deductions }
  }

  const { earnings, deductions, netSalary } = calculateTotals()

  const pieData = [
    { name: "Net Salary", value: netSalary, color: "#22c55e" },
    { name: "Deductions", value: deductions, color: "#ef4444" },
  ]

  const COLORS = ["#22c55e", "#ef4444"]

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Salary</h1>
          <p className="text-muted-foreground">View your salary structure and components</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Download Payslip
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(earnings)}</div>
            <p className="text-xs text-muted-foreground">Total earnings before deductions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(deductions)}</div>
            <p className="text-xs text-muted-foreground">Total deductions from salary</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(netSalary)}</div>
            <p className="text-xs text-muted-foreground">Take-home salary</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Breakdown</CardTitle>
            <CardDescription>Visual representation of your salary structure</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent!! * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Salary Components */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Components</CardTitle>
            <CardDescription>Detailed breakdown of all salary components</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <TableCell className="font-medium">{component.component_name}</TableCell>
                    <TableCell>
                      <Badge variant={component.component_type === "earning" ? "default" : "destructive"}>
                        {component.component_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(component.calculated_amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell className="font-bold">Net Salary</TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right font-bold text-blue-600">{formatCurrency(netSalary)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
