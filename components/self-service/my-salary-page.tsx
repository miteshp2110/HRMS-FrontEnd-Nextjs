

"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Eye,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Target,
  Calculator,
  Activity
} from "lucide-react"
import { 
  getMySalaryStructure, 
  getMySalaryRevisions,
  type SalaryComponent, 
  type SalaryRevision,
  type FormulaComponent 
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

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

// Parse custom formula from API response
const parseCustomFormula = (formulaString: string | null | undefined): FormulaComponent[] => {
  if (!formulaString) return []
  try {
    if (typeof formulaString === 'string' && formulaString.startsWith('"')) {
      return JSON.parse(JSON.parse(formulaString))
    }
    return typeof formulaString === 'string' ? JSON.parse(formulaString) : formulaString
  } catch {
    return []
  }
}

// Skeleton Components
function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function MySalaryPage() {
  const [structure, setStructure] = React.useState<SalaryComponent[]>([])
  const [revisions, setRevisions] = React.useState<SalaryRevision[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRevisionsLoading, setIsRevisionsLoading] = React.useState(false)
  const [expandedComponents, setExpandedComponents] = React.useState<{ [key: number]: boolean }>({})
  const [expandedRevisions, setExpandedRevisions] = React.useState<{ [key: number]: boolean }>({})
  const { toast } = useToast()
  const { user } = useAuth()

  // Fetch salary structure on component mount
  React.useEffect(() => {
    const fetchStructure = async () => {
      setIsLoading(true)
      try {
        const structureData = await getMySalaryStructure()
        setStructure(structureData)
      } catch (error: any) {
        toast({ 
          title: "Error", 
          description: `Could not load your salary structure: ${error.message}`, 
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchStructure()
  }, [toast])

  // Fetch revisions when tab is switched
  const fetchRevisions = React.useCallback(async () => {
    if (!user?.id) return
    setIsRevisionsLoading(true)
    try {
      const revisionsData = await getMySalaryRevisions(user.id)
      setRevisions(revisionsData)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Could not load salary revisions: ${error.message}`, 
        variant: "destructive"
      })
    } finally {
      setIsRevisionsLoading(false)
    }
  }, [user?.id, toast])

  const toggleComponentExpansion = (id: number) => {
    setExpandedComponents(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleRevisionExpansion = (id: number) => {
    setExpandedRevisions(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Separate components into earnings, deductions, and variables
  const { earningsComponents, deductionsComponents, variableComponents } = React.useMemo(() => {
    const earnings = structure.filter(c => 
      c.component_type === 'earning' && !VARIABLE_COMPONENT_IDS.includes(c.component_id)
    )
    const deductions = structure.filter(c => 
      c.component_type === 'deduction' && !VARIABLE_COMPONENT_IDS.includes(c.component_id)
    )
    const variables = structure.filter(c => 
      VARIABLE_COMPONENT_IDS.includes(c.component_id)
    )
    return { earningsComponents: earnings, deductionsComponents: deductions, variableComponents: variables }
  }, [structure])

  const { totalEarnings, totalDeductions, netSalary } = React.useMemo(() => {
    const earnings = earningsComponents.reduce((sum, c) => sum + c.calculated_amount, 0)
    const deductions = deductionsComponents.reduce((sum, c) => sum + c.calculated_amount, 0)
    return { totalEarnings: earnings, totalDeductions: deductions, netSalary: earnings - deductions }
  }, [earningsComponents, deductionsComponents])

  const renderFormula = (formulaComponents: FormulaComponent[], allComponents: SalaryComponent[]) => {
    return formulaComponents.map((part, idx) => {
      if (part.type === 'component') {
        const component = allComponents.find(c => c.component_id === parseInt(part.value))
        return (
          <span key={idx} className="text-blue-600 dark:text-blue-400 font-semibold">
            {component?.component_name || `Component ${part.value}`}
            {idx < formulaComponents.length - 1 ? ' ' : ''}
          </span>
        )
      }
      return (
        <span key={idx} className={
          part.type === 'operator' ? 'text-orange-600 dark:text-orange-400' :
          part.type === 'number' ? 'text-purple-600 dark:text-purple-400' :
          part.type === 'parenthesis' ? 'text-gray-600 dark:text-gray-400' :
          'text-gray-600 dark:text-gray-400'
        }>
          {part.value}{idx < formulaComponents.length - 1 ? ' ' : ''}
        </span>
      )
    })
  }

  const renderComponentDetails = (component: SalaryComponent) => {
    const isExpanded = expandedComponents[component.id]

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleComponentExpansion(component.id)}
            className="h-6 p-1"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <span className="text-sm">
            {component.calculation_type === 'Fixed' && 'Fixed Amount'}
            {component.calculation_type === 'Percentage' && `${component.value}% of base`}
            {component.calculation_type === 'Formula' && 'Custom Formula'}
          </span>
        </div>

        {isExpanded && (
          <div className="ml-8 p-3 bg-muted/50 rounded-md text-xs space-y-2 border-l-2 border-indigo-500">
            {component.calculation_type === 'Fixed' && (
              <div>
                <div className="font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Fixed Amount</div>
                <div className="font-mono text-base">{formatAED(component.value)}</div>
                <div className="text-muted-foreground mt-1">Direct fixed amount assigned</div>
              </div>
            )}

            {component.calculation_type === 'Percentage' && (
              <div>
                <div className="font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Percentage Calculation</div>
                <div className="space-y-1">
                  <div className="font-mono">
                    {component.value}% of {component.based_on_component_name || 'Base Component'}
                  </div>
                  <div className="text-muted-foreground">
                    Base Component: {component.based_on_component_name}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="font-semibold">Calculation:</div>
                    <div className="font-mono">
                      {component.value}% × {formatAED(component.calculated_amount * 100 / parseFloat(component.value))} = {formatAED(component.calculated_amount)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {component.calculation_type === 'Formula' && component.custom_formula && (
              <div>
                <div className="font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Custom Formula</div>
                <div className="font-mono text-xs bg-background p-2 rounded border">
                  {renderFormula(component.custom_formula, structure)}
                </div>
                <div className="text-muted-foreground mt-1">
                  Dynamic calculation using formula components
                </div>
                <div className="pt-2 border-t">
                  <div className="font-semibold">Result:</div>
                  <div className="font-mono text-base">{formatAED(component.calculated_amount)}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderRevisionDetails = (revision: SalaryRevision) => {
    const isExpanded = expandedRevisions[revision.id]
    const parsedFormula = parseCustomFormula(revision.new_custom_formula)

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleRevisionExpansion(revision.id)}
            className="h-6 p-1"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <span className="text-sm">
            {revision.new_calculation_type === 'Fixed' && `New Amount: ${formatAED(revision.new_value)}`}
            {revision.new_calculation_type === 'Percentage' && `${revision.new_value}% of base component`}
            {revision.new_calculation_type === 'Formula' && 'Custom Formula'}
          </span>
        </div>

        {isExpanded && (
          <div className="ml-8 p-3 bg-muted/50 rounded-md text-xs space-y-2 border-l-2 border-indigo-500">
            {revision.new_calculation_type === 'Fixed' && (
              <div>
                <div className="font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Fixed Amount</div>
                <div className="font-mono text-base">{formatAED(revision.new_value)}</div>
                <div className="text-muted-foreground mt-1">Direct fixed amount assigned</div>
              </div>
            )}

            {revision.new_calculation_type === 'Percentage' && (
              <div>
                <div className="font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Percentage Calculation</div>
                <div className="font-mono">
                  {revision.new_value}% of base component
                </div>
              </div>
            )}

            {revision.new_calculation_type === 'Formula' && parsedFormula.length > 0 && (
              <div>
                <div className="font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Custom Formula</div>
                <div className="font-mono text-xs bg-background p-2 rounded border">
                  {renderFormula(parsedFormula, structure)}
                </div>
                <div className="text-muted-foreground mt-1">
                  Dynamic calculation using formula components
                </div>
              </div>
            )}

            <div className="pt-2 border-t mt-2">
              <div className="font-semibold mb-1">Reason:</div>
              <div className="text-muted-foreground">{revision.reason}</div>
            </div>

            <div className="pt-2 border-t mt-2">
              <div className="text-muted-foreground text-xs">
                Created by {revision.created_by_name} on {new Date(revision.created_at).toLocaleDateString('en-AE')}
              </div>
              {revision.applied_at && (
                <div className="text-muted-foreground text-xs mt-1">
                  Applied by {revision.applied_by_name} on {new Date(revision.applied_at).toLocaleDateString('en-AE')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Scheduled': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', icon: ClockIcon },
      'Applied': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: CheckCircle },
      'Cancelled': { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100', icon: XCircle }
    }
    const { className, icon: Icon } = statusMap[status] || statusMap['Scheduled']
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <DollarSign className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Salary</h1>
          <p className="text-muted-foreground">
            View your current salary structure and upcoming revisions
          </p>
        </div>
      </div>

      <Tabs defaultValue="structure" onValueChange={(value) => {
        if (value === 'revisions' && revisions.length === 0) {
          fetchRevisions()
        }
      }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Current Structure
          </TabsTrigger>
          <TabsTrigger value="revisions" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Revisions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-6">
          {isLoading ? (
            <>
              <SummaryCardsSkeleton />
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-80" />
                </CardHeader>
                <CardContent>
                  <TableSkeleton />
                </CardContent>
              </Card>
            </>
          ) : structure.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Salary Structure Found</AlertTitle>
              <AlertDescription>
                Your salary structure has not been configured yet. Please contact HR.
              </AlertDescription>
            </Alert>
          ) : (
            <>
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
                    All earning components that contribute to your salary
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                          <TableCell>{renderComponentDetails(component)}</TableCell>
                          <TableCell className="text-right font-mono font-bold text-green-600">
                            {formatAED(component.calculated_amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-green-50 dark:bg-green-950/30 font-bold">
                        <TableCell colSpan={2}>Total Earnings</TableCell>
                        <TableCell className="text-right font-mono text-green-600">
                          {formatAED(totalEarnings)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
                    All deduction components subtracted from your salary
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                          <TableCell>{renderComponentDetails(component)}</TableCell>
                          <TableCell className="text-right font-mono font-bold text-red-600">
                            {formatAED(component.calculated_amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-red-50 dark:bg-red-950/30 font-bold">
                        <TableCell colSpan={2}>Total Deductions</TableCell>
                        <TableCell className="text-right font-mono text-red-600">
                          {formatAED(totalDeductions)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Variable Components (Overtime) */}
              {variableComponents.length > 0 && (
                <Card className="border-orange-200 dark:border-orange-900">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                    <CardTitle className="text-orange-900 dark:text-orange-100 flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Variable Components
                    </CardTitle>
                    <CardDescription className="text-orange-700 dark:text-orange-300">
                      Overtime and other variable pay components (not included in net salary)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
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
                            <TableCell>{renderComponentDetails(component)}</TableCell>
                            <TableCell className="text-right font-mono font-bold text-orange-600">
                              {formatAED(component.calculated_amount)}/hr
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <Alert className="mt-4 border-orange-200 bg-orange-50 dark:bg-orange-950/30">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-900 dark:text-orange-100">
                        These components are calculated per hour and will be added to your payslip based on actual hours worked.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}

              {/* Net Salary Summary */}
              <Card className="border-blue-200 dark:border-blue-900">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span>Net Monthly Salary</span>
                    <span className="text-blue-600">{formatAED(netSalary)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is your base net salary excluding variable components
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="revisions" className="space-y-6">
          {isRevisionsLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent>
                <TableSkeleton />
              </CardContent>
            </Card>
          ) : revisions.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Revisions</AlertTitle>
              <AlertDescription>
                There are no salary revisions scheduled or applied for your account.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Salary Revisions</CardTitle>
                <CardDescription>
                  View all scheduled and applied salary revisions with complete details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Change Details</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revisions.map(revision => (
                      <TableRow key={revision.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Badge variant="outline">{revision.component_name}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-3 w-3 text-muted-foreground" />
                            {new Date(revision.effective_date).toLocaleDateString('en-AE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{renderRevisionDetails(revision)}</TableCell>
                        <TableCell>{getStatusBadge(revision.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
