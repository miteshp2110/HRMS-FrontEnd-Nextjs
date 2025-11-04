

"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Edit, DollarSign, Eye, Calculator, TrendingUp, Loader2 } from "lucide-react"
import {
    getEmployeeSalaryStructure,
    getPayrollComponentDefs,
    assignSalaryComponent,
    removeSalaryComponent,
    getDetailedUserProfile,
    type EmployeeSalaryStructure,
    type PayrollComponentDef,
    type FormulaComponent,
    type DetailedUserProfile
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { FormulaBuilder } from "@/components/payroll/formula-builder"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { SalaryRevisionsPage } from "@/components/payroll/revisions/salary-revisions-page"
import EmployeePayslipTab from "@/components/payroll/payslips/payslipBaseTab"

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

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      <Skeleton className="h-10 w-40" />
    </div>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Calculation</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell className="text-right">
              <div className="flex gap-1 justify-end">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function PageSkeleton() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <TableSkeleton />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function EmployeeSalaryStructurePage() {
    const params = useParams()
    const employeeId = Number(params.id)
    const { toast } = useToast()

    const [employee, setEmployee] = React.useState<DetailedUserProfile | null>(null)
    const [structure, setStructure] = React.useState<EmployeeSalaryStructure[]>([])
    const [allComponents, setAllComponents] = React.useState<PayrollComponentDef[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingComponent, setEditingComponent] = React.useState<EmployeeSalaryStructure | null>(null)
    const [showDetails, setShowDetails] = React.useState<{ [key: number]: boolean }>({})
    const [realTimePreview, setRealTimePreview] = React.useState(0)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isRemoving, setIsRemoving] = React.useState<number | null>(null)

    // Form state
    const [componentId, setComponentId] = React.useState('')
    const [calculationType, setCalculationType] = React.useState<'Fixed' | 'Percentage' | 'Formula'>('Fixed')
    const [value, setValue] = React.useState('')
    const [basedOn, setBasedOn] = React.useState('')
    const [formula, setFormula] = React.useState<FormulaComponent[]>([])
    const [customFormula, setCustomFormula] = React.useState('')

    const fetchData = React.useCallback(async () => {
        if (!employeeId) return
        setIsLoading(true)
        try {
            const [structureData, componentsData, employeeData] = await Promise.all([
                getEmployeeSalaryStructure(employeeId),
                getPayrollComponentDefs(),
                getDetailedUserProfile(employeeId)
            ])
            setStructure(structureData)
            setAllComponents(componentsData)
            setEmployee(employeeData)
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load salary structure data.", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }, [employeeId, toast])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    // Real-time preview calculation
    React.useEffect(() => {
        if (calculationType === 'Fixed') {
            setRealTimePreview(Number(value) || 0)
        } else if (calculationType === 'Percentage') {
            const baseComponent = structure.find(s => s.component_id === Number(basedOn))
            const baseAmount = baseComponent?.calculated_amount || 0
            setRealTimePreview((Number(value) || 0) * baseAmount / 100)
        } else if (calculationType === 'Formula') {
            setRealTimePreview(0) // Would need formula evaluation logic
        }
    }, [calculationType, value, basedOn, formula, structure])

    const handleRemove = async (componentId: number) => {
        if (!window.confirm("Remove this component from the structure?")) return
        setIsRemoving(componentId)
        try {
            await removeSalaryComponent(employeeId, componentId)
            toast({ title: "Success", description: "Component removed." })
            fetchData()
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to remove: ${error.message}`, variant: "destructive" })
        } finally {
            setIsRemoving(null)
        }
    }

    const handleEdit = (component: EmployeeSalaryStructure) => {
        setEditingComponent(component)
        setComponentId(String(component.component_id))
        setCalculationType(component.calculation_type)
        setValue(String(component.value || ''))
        const baseComponent = structure.find(s => s.component_name === component.based_on_component_name)
        setBasedOn(String(baseComponent?.component_id || ''))
        setFormula(component.custom_formula || [])
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        let payload: any = {
            component_id: Number(componentId),
            calculation_type: calculationType
        }

        if (calculationType === 'Fixed') {
            payload.value = Number(value)
        }
        if (calculationType === 'Percentage') {
            payload.value = Number(value)
            payload.based_on_component_id = Number(basedOn)
        }
        if (calculationType === 'Formula') {
            payload.custom_formula = customFormula || formula
        }

        setIsSubmitting(true)
        try {
            await assignSalaryComponent(employeeId, payload)
            toast({
                title: "Success",
                description: editingComponent ? "Component updated." : "Component added to salary structure."
            })
            fetchData()
            resetForm()
            setIsDialogOpen(false)
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to save: ${error.message}`, variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setEditingComponent(null)
        setComponentId('')
        setCalculationType('Fixed')
        setValue('')
        setBasedOn('')
        setFormula([])
        setCustomFormula('')
        setRealTimePreview(0)
    }

    const toggleDetails = (componentId: number) => {
        setShowDetails(prev => ({
            ...prev,
            [componentId]: !prev[componentId]
        }))
    }

    const availableComponents = allComponents.filter(c =>
        !structure.some(s => s.component_id === c.id) ||
        (editingComponent && editingComponent.component_id === c.id)
    )

    const earnings = structure.filter(s => s.component_type === 'earning')
    const fixedEarnings = earnings.filter(item => item.component_id !== 5 && item.component_id !== 6)
    const variableEarnings = earnings.filter(item => item.component_id === 5 || item.component_id === 6)

    const deductions = structure.filter(s => s.component_type === 'deduction')
    const totalEarnings = fixedEarnings.reduce((sum, item) => sum + item.calculated_amount, 0)
    const totalDeductions = deductions.reduce((sum, item) => sum + item.calculated_amount, 0)
    const netSalary = totalEarnings - totalDeductions

    const renderCalculationDetails = (item: EmployeeSalaryStructure) => {
        const isExpanded = showDetails[item.component_id]

        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(item.component_id)}
                        className="h-6 p-1"
                    >
                        <Eye className="h-3 w-3" />
                    </Button>
                    <span className="text-sm">
                        {item.calculation_type === 'Fixed' && 'Fixed Amount'}
                        {item.calculation_type === 'Percentage' && `${item.value}% of ${item.based_on_component_name}`}
                        {item.calculation_type === 'Formula' && 'Custom Formula'}
                    </span>
                </div>

                {isExpanded && (
                    <div className="ml-8 p-3 bg-muted/50 rounded-md text-xs space-y-2">
                        {item.calculation_type === 'Fixed' && (
                            <div>
                                <div className="font-mono">Amount = {formatAED(item.value || 0)}</div>
                                <div className="text-muted-foreground">Direct fixed amount</div>
                            </div>
                        )}

                        {item.calculation_type === 'Percentage' && (
                            <div>
                                <div className="font-mono">
                                    {item.value}% × {item.based_on_component_name} = {formatAED(item.calculated_amount)}
                                </div>
                                <div className="text-muted-foreground">
                                    Base Amount: {formatAED((item.calculated_amount * 100 / (parseFloat(item.value!) || 1)))}
                                </div>
                            </div>
                        )}

                        {item.calculation_type === 'Formula' && item.custom_formula && (
                            <div>
                                <div className="font-mono text-xs bg-background p-2 rounded border">
                                    {typeof item.custom_formula === 'string' ? (
                                        <span>{item.custom_formula}</span>
                                    ) : (
                                        item.custom_formula.map((part, idx) => (
                                            <span key={idx} className={
                                                part.type === 'component' ? 'text-blue-600' :
                                                    part.type === 'standard_parameter' ? 'text-green-600' :
                                                        part.type === 'operator' ? 'text-orange-600' :
                                                            part.type === 'number' ? 'text-purple-600' :
                                                                'text-gray-600'
                                            }>
                                                {part.type === 'component' ? (allComponents.find(c => c.id === parseInt(part.value)))?.name : part.value}
                                            </span>
                                        ))
                                    )}
                                </div>
                                <div className="text-muted-foreground mt-1">
                                    Dynamic calculation based on formula
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    const renderFormulaPreview = () => {
        if (calculationType !== 'Formula') return null
        
        if (customFormula) {
            return (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Formula Preview</Label>
                    <div className="p-2 bg-muted rounded text-xs font-mono">
                        {customFormula}
                    </div>
                </div>
            )
        }

        if (formula.length === 0) return null

        return (
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Formula Preview</Label>
                <div className="p-2 bg-muted rounded text-xs font-mono">
                    {formula.map((part, idx) => (
                        <span key={idx} className={
                            part.type === 'component' ? 'text-blue-600 font-semibold' :
                                part.type === 'standard_parameter' ? 'text-green-600 font-semibold' :
                                    part.type === 'operator' ? 'text-orange-600' :
                                        part.type === 'number' ? 'text-purple-600' :
                                            'text-gray-600'
                        }>
                            {part.value}{' '}
                        </span>
                    ))}
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <PageSkeleton />
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <DollarSign className="h-8 w-8" />
                            Salary Structure
                        </h1>
                        <p className="text-muted-foreground">
                            {employee ? `${employee.first_name} ${employee.last_name} - ID: ${employee.id}` : 'Loading...'}
                        </p>
                    </div>
                    <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Component
                    </Button>
                </div>

                <Tabs defaultValue="structure" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="structure">Structure Details</TabsTrigger>
                        <TabsTrigger value="revisions">Revisions & Audit</TabsTrigger>
                        <TabsTrigger value="payslips">Payslips</TabsTrigger>
                    </TabsList>

                    <TabsContent value="structure" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Fixed Earnings Card */}
                                <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/30">
                                    <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Fixed Earnings
                                        </CardTitle>
                                        <CardDescription className="text-indigo-100">
                                            Components that add to the total salary
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Component</TableHead>
                                                    <TableHead>Calculation Details</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {fixedEarnings.map(item => (
                                                    <TableRow key={item.id} className="hover:bg-indigo-50 dark:hover:bg-indigo-950/50">
                                                        <TableCell className="font-medium">
                                                            <Badge variant="outline" className="text-indigo-700 border-indigo-300 dark:text-indigo-300">
                                                                {item.component_name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {renderCalculationDetails(item)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="space-y-1">
                                                                <div className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                                                    {formatAED(item.calculated_amount)}
                                                                </div>
                                                                <Progress
                                                                    value={(item.calculated_amount / totalEarnings) * 100}
                                                                    className="h-1 [&>div]:bg-indigo-500"
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex gap-1 justify-end">
                                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-8 w-8">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    onClick={() => handleRemove(item.component_id)} 
                                                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                                                    disabled={isRemoving === item.component_id}
                                                                >
                                                                    {isRemoving === item.component_id ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {fixedEarnings.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            No fixed earning components added yet
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                {/* Variable Earnings Card */}
                                <Card className="border-teal-200 bg-teal-50/50 dark:bg-teal-950/30">
                                    <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Variable Earnings
                                        </CardTitle>
                                        <CardDescription className="text-teal-100">
                                            Hourly or other variable rate components
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Component</TableHead>
                                                    <TableHead>Calculation Details</TableHead>
                                                    <TableHead className="text-right">Rate / Hr</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {variableEarnings.map(item => (
                                                    <TableRow key={item.id} className="hover:bg-teal-50 dark:hover:bg-teal-950/50">
                                                        <TableCell className="font-medium">
                                                            <Badge variant="outline" className="text-teal-700 border-teal-300 dark:text-teal-300">
                                                                {item.component_name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {renderCalculationDetails(item)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="space-y-1">
                                                                <div className="font-bold text-teal-600 dark:text-teal-400 text-lg">
                                                                    {formatAED(item.calculated_amount)} / Hr
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex gap-1 justify-end">
                                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-8 w-8">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    onClick={() => handleRemove(item.component_id)} 
                                                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                                                    disabled={isRemoving === item.component_id}
                                                                >
                                                                    {isRemoving === item.component_id ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {variableEarnings.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            No variable earning components added yet
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                {/* Deductions Card */}
                                <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/30">
                                    <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 rotate-180" />
                                            Deduction Components
                                        </CardTitle>
                                        <CardDescription className="text-amber-100">
                                            Components that reduce the total salary
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Component</TableHead>
                                                    <TableHead>Calculation Details</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {deductions.map(item => (
                                                    <TableRow key={item.id} className="hover:bg-amber-50 dark:hover:bg-amber-950/50">
                                                        <TableCell className="font-medium">
                                                            <Badge variant="outline" className="text-amber-700 border-amber-300 dark:text-amber-300">
                                                                {item.component_name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {renderCalculationDetails(item)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="space-y-1">
                                                                <div className="font-bold text-amber-600 dark:text-amber-400 text-lg">
                                                                    -{formatAED(item.calculated_amount)}
                                                                </div>
                                                                <Progress
                                                                    value={(item.calculated_amount / totalDeductions) * 100}
                                                                    className="h-1 [&>div]:bg-amber-500"
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex gap-1 justify-end">
                                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-8 w-8">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    onClick={() => handleRemove(item.component_id)} 
                                                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                                                    disabled={isRemoving === item.component_id}
                                                                >
                                                                    {isRemoving === item.component_id ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {deductions.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            No deduction components added yet
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Summary Sidebar */}
                            <div className="space-y-6">
                                <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border-gray-200 dark:from-slate-900 dark:to-gray-900">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900 dark:text-slate-100">Salary Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                            <span className="text-indigo-700 dark:text-indigo-300 font-medium">Total Earnings</span>
                                            <span className="font-bold text-xl text-indigo-800 dark:text-indigo-200">
                                                {formatAED(totalEarnings)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                                            <span className="text-amber-700 dark:text-amber-300 font-medium">Total Deductions</span>
                                            <span className="font-bold text-xl text-amber-800 dark:text-amber-200">
                                                -{formatAED(totalDeductions)}
                                            </span>
                                        </div>
                                        <hr className="border-gray-200 dark:border-gray-700" />
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-800 to-gray-900 text-white rounded-lg">
                                            <span className="font-semibold text-lg">Net Salary</span>
                                            <span className="font-bold text-2xl">
                                                {formatAED(netSalary)}
                                            </span>
                                        </div>
                                        <div className="text-center text-sm text-muted-foreground">
                                            Take-home pay after all deductions
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="revisions">
                        <SalaryRevisionsPage employeeId={employeeId}  />
                    </TabsContent>
                    <TabsContent value="payslips">
                        <EmployeePayslipTab  employeeId={employeeId} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add/Edit Component Dialog */}
            {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            {editingComponent ? 'Edit Salary Component' : 'Add Salary Component'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Component</Label>
                                <Select onValueChange={setComponentId} value={componentId} required disabled={isSubmitting}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select component..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableComponents.map(c => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={c.type === 'earning' ? 'default' : 'destructive'}>
                                                        {c.type}
                                                    </Badge>
                                                    {c.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Calculation Type</Label>
                                <Select value={calculationType} onValueChange={(v: any) => setCalculationType(v)} required disabled={isSubmitting}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fixed">Fixed Amount</SelectItem>
                                        <SelectItem value="Percentage">Percentage</SelectItem>
                                        <SelectItem value="Formula">Custom Formula</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {calculationType === 'Fixed' && (
                            <div className="space-y-2">
                                <Label>Amount (AED)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={value}
                                    onChange={e => setValue(e.target.value)}
                                    placeholder="Enter fixed amount"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}

                        {calculationType === 'Percentage' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Percentage (%)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        placeholder="Enter percentage"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Based On Component</Label>
                                    <Select onValueChange={setBasedOn} value={basedOn} required disabled={isSubmitting}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select base component..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {earnings.map(c => (
                                                <SelectItem key={c.component_id} value={String(c.component_id)}>
                                                    {c.component_name} ({formatAED(c.calculated_amount)})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {calculationType === 'Formula' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Custom Formula (Text)</Label>
                                    <Input
                                        value={customFormula}
                                        onChange={e => setCustomFormula(e.target.value)}
                                        placeholder="e.g., Basic * 0.15 + HRA"
                                        disabled={isSubmitting}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter a formula using component names and mathematical operators
                                    </p>
                                </div>
                                <div className="border-t pt-4">
                                    <Label className="mb-2 block">Or use Formula Builder</Label>
                                    <FormulaBuilder
                                        formula={formula}
                                        setFormula={setFormula}
                                        components={allComponents}
                                        existingStructure={structure}
                                    />
                                </div>
                                {renderFormulaPreview()}
                            </div>
                        )}

                        <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200 dark:from-slate-900 dark:to-gray-900">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Real-time Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Calculated Amount:</span>
                                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {formatAED(realTimePreview)}
                                    </span>
                                </div>
                                {calculationType === 'Percentage' && basedOn && (
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {value}% of {earnings.find(e => e.component_id === Number(basedOn))?.component_name || 'Selected Component'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    editingComponent ? 'Update Component' : 'Add to Structure'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog> */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                {editingComponent ? 'Edit Salary Component' : 'Add Salary Component'}
            </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Component</Label>
                    <Select 
                        onValueChange={(value) => {
                            setComponentId(value);
                            // Reset to Fixed if component ID is 1
                            if (value === "1") {
                                setCalculationType("Fixed");
                            }
                        }} 
                        value={componentId} 
                        required 
                        disabled={isSubmitting}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select component..." />
                        </SelectTrigger>
                        <SelectContent>
                            {availableComponents.map(c => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={c.type === 'earning' ? 'default' : 'destructive'}>
                                            {c.type}
                                        </Badge>
                                        {c.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Calculation Type</Label>
                    <Select 
                        value={calculationType} 
                        onValueChange={(v: any) => setCalculationType(v)} 
                        required 
                        disabled={isSubmitting || componentId === "1"}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Fixed">Fixed Amount</SelectItem>
                            {componentId !== "1" && (
                                <>
                                    <SelectItem value="Percentage">Percentage</SelectItem>
                                    <SelectItem value="Formula">Custom Formula</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                    {componentId === "1" && (
                        <p className="text-xs text-muted-foreground">
                            This component only supports fixed amount calculation
                        </p>
                    )}
                </div>
            </div>

            {calculationType === 'Fixed' && (
                <div className="space-y-2">
                    <Label>Amount (AED)</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Enter fixed amount"
                        required
                        disabled={isSubmitting}
                    />
                </div>
            )}

            {calculationType === 'Percentage' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Percentage (%)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder="Enter percentage"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Based On Component</Label>
                        <Select onValueChange={setBasedOn} value={basedOn} required disabled={isSubmitting}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select base component..." />
                            </SelectTrigger>
                            <SelectContent>
                                {earnings.map(c => (
                                    <SelectItem key={c.component_id} value={String(c.component_id)}>
                                        {c.component_name} ({formatAED(c.calculated_amount)})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {calculationType === 'Formula' && (
                <div className="space-y-4">
                    
                    <div className="border-t pt-4">
                        
                        <FormulaBuilder
                            formula={formula}
                            setFormula={setFormula}
                            components={allComponents}
                            existingStructure={structure}
                        />
                    </div>
                    {renderFormulaPreview()}
                </div>
            )}

            <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200 dark:from-slate-900 dark:to-gray-900">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Real-time Preview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Calculated Amount:</span>
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {formatAED(realTimePreview)}
                        </span>
                    </div>
                    {calculationType === 'Percentage' && basedOn && (
                        <div className="mt-2 text-xs text-muted-foreground">
                            {value}% of {earnings.find(e => e.component_id === Number(basedOn))?.component_name || 'Selected Component'}
                        </div>
                    )}
                </CardContent>
            </Card>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        editingComponent ? 'Update Component' : 'Add to Structure'
                    )}
                </Button>
            </DialogFooter>
        </form>
    </DialogContent>
</Dialog>

        </MainLayout>
    )
}
