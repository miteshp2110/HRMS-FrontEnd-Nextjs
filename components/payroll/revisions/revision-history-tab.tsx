"use client"

import { useState, useEffect, useCallback } from "react"
import {
  cancelScheduledRevision,
  getEmployeeRevisions,
  updateSalaryRevision,
  getPayrollComponents,
  getEmployeeSalaryStructure,
  type SalaryRevision,
  type ScheduleRevisionPayload,
  type PayrollComponent,
  type EmployeeSalaryStructure,
  type FormulaComponent,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Eye, Loader2, CheckCircle, XCircle, Clock, Trash2, AlertCircle, TrendingUp, Calculator } from "lucide-react"
import { ScheduleRevisionDialog } from "./schedule-revision-dialog"
import { FormulaBuilder } from "@/components/payroll/formula-builder"

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
const parseCustomFormula = (formulaString: string | null): FormulaComponent[] => {
  if (!formulaString) return []
  try {
    // Handle double-encoded JSON
    let parsed = formulaString
    if (formulaString.startsWith('"')) {
      parsed = JSON.parse(formulaString)
    }
    return JSON.parse(parsed)
  } catch {
    return []
  }
}

// Skeleton Component
function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Effective Date</TableHead>
          <TableHead>Change Details</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell className="text-right">
              <div className="flex gap-1 justify-end">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-20" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

interface RevisionHistoryTabProps {
  employeeId: number
}

export function RevisionHistoryTab({ employeeId }: RevisionHistoryTabProps) {
  const { toast } = useToast()
  const [revisions, setRevisions] = useState<SalaryRevision[]>([])
  const [components, setComponents] = useState<PayrollComponent[]>([])
  const [structure, setStructure] = useState<EmployeeSalaryStructure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedRevisions, setExpandedRevisions] = useState<{ [key: number]: boolean }>({})
  const [isCancelling, setIsCancelling] = useState<number | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRevision, setSelectedRevision] = useState<SalaryRevision | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Edit form state
  const [editFormData, setEditFormData] = useState<Partial<ScheduleRevisionPayload>>({})
  const [formula, setFormula] = useState<FormulaComponent[]>([])
  const [realTimePreview, setRealTimePreview] = useState(0)

  const fetchRevisions = useCallback(async () => {
    setIsLoading(true)
    try {
      const [revisionsData, componentsData, structureData] = await Promise.all([
        getEmployeeRevisions(employeeId),
        getPayrollComponents(),
        getEmployeeSalaryStructure(employeeId)
      ])
      setRevisions(revisionsData)
      setComponents(componentsData)
      setStructure(structureData)
    } catch (error) {
      toast({
        title: "Error fetching revisions",
        description: "Could not load the salary revision history.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [employeeId, toast])

  useEffect(() => {
    fetchRevisions()
  }, [fetchRevisions])

  // Real-time preview calculation
  useEffect(() => {
    if (!editFormData.new_calculation_type) return

    if (editFormData.new_calculation_type === 'Fixed') {
      setRealTimePreview(editFormData.new_value || 0)
    } else if (editFormData.new_calculation_type === 'Percentage') {
      const baseComponent = structure.find(s => s.component_id === editFormData.new_based_on_component_id)
      const baseAmount = baseComponent?.calculated_amount || 0
      setRealTimePreview((editFormData.new_value || 0) * baseAmount / 100)
    } else {
      setRealTimePreview(0)
    }
  }, [editFormData, structure])

  const handleCancelRevision = async (revisionId: number) => {
    setIsCancelling(revisionId)
    try {
      await cancelScheduledRevision(revisionId)
      toast({
        title: "Success",
        description: "The scheduled revision has been cancelled.",
      })
      fetchRevisions()
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not cancel the revision. It may have already been processed.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(null)
    }
  }

  const handleEditClick = (revision: SalaryRevision) => {
    setSelectedRevision(revision)
    const parsedFormula = parseCustomFormula(revision.new_custom_formula??'')
    
    setEditFormData({
      employee_id: employeeId,
      component_id: revision.component_id,
      effective_date: revision.effective_date.split('T')[0],
      new_calculation_type: revision.new_calculation_type,
      new_value: parseFloat(revision.new_value),
      new_based_on_component_id: revision.new_based_on_component_id || undefined,
      new_custom_formula: revision.new_custom_formula,
      reason: revision.reason
    })
    
    setFormula(parsedFormula)
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRevision) return

    const payload = { ...editFormData } as ScheduleRevisionPayload
    
    if (payload.new_calculation_type === 'Formula') {
      payload.new_custom_formula = JSON.stringify(formula)
    } else {
      payload.new_custom_formula = null
    }

    if (payload.new_calculation_type !== 'Percentage') {
      payload.new_based_on_component_id = undefined
    }

    setIsUpdating(true)
    try {
      await updateSalaryRevision(payload, selectedRevision.id)
      toast({
        title: "Success",
        description: "Revision updated successfully.",
      })
      setIsEditDialogOpen(false)
      setSelectedRevision(null)
      setFormula([])
      fetchRevisions()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update revision.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleExpansion = (id: number) => {
    setExpandedRevisions(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any }> = {
      'Scheduled': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: Clock },
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

  const renderFormula = (formulaComponents: FormulaComponent[]) => {
    return formulaComponents.map((part, idx) => {
      if (part.type === 'component') {
        const component = components.find(c => c.id === parseInt(part.value))
        return (
          <span key={idx} className="text-blue-600 dark:text-blue-400 font-semibold">
            {component?.name || `Component ${part.value}`}
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

  const renderCalculationDetails = (revision: SalaryRevision) => {
    const isExpanded = expandedRevisions[revision.id]
    const parsedFormula = parseCustomFormula(revision.new_custom_formula??'')

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleExpansion(revision.id)}
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
                <div className="space-y-1">
                  <div className="font-mono">
                    {revision.new_value}% of{' '}
                    {components.find(c => c.id === revision.new_based_on_component_id)?.name || 'Base Component'}
                  </div>
                  {revision.new_based_on_component_id && (
                    <div className="text-muted-foreground">
                      Base Component: {components.find(c => c.id === revision.new_based_on_component_id)?.name}
                      {(() => {
                        const baseComp = structure.find(s => s.component_id === revision.new_based_on_component_id)
                        if (baseComp) {
                          const calculatedValue = (parseFloat(revision.new_value) * baseComp.calculated_amount / 100)
                          return ` (Current: ${formatAED(baseComp.calculated_amount)} → New will be: ${formatAED(calculatedValue)})`
                        }
                        return ''
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {revision.new_calculation_type === 'Formula' && parsedFormula.length > 0 && (
              <div>
                <div className="font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Custom Formula</div>
                <div className="font-mono text-xs bg-background p-2 rounded border">
                  {renderFormula(parsedFormula)}
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
                Created by {revision.created_by_name} on {format(new Date(revision.created_at), "dd MMM yyyy, hh:mm a")}
              </div>
              {revision.applied_at && (
                <div className="text-muted-foreground text-xs mt-1">
                  Applied by {revision.applied_by_name} on {format(new Date(revision.applied_at), "dd MMM yyyy, hh:mm a")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revision History</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all salary component changes
          </p>
        </div>
        <ScheduleRevisionDialog
          employeeId={employeeId}
          onSuccess={fetchRevisions}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton />
        ) : revisions.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-muted rounded-full">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Revisions Found</h3>
            <p className="text-muted-foreground mb-4">
              No salary revisions have been scheduled for this employee yet.
            </p>
            <ScheduleRevisionDialog
              employeeId={employeeId}
              onSuccess={fetchRevisions}
              trigger={
                <Button variant="outline">
                  Schedule First Revision
                </Button>
              }
            />
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Change Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revisions.map((rev) => (
                  <TableRow key={rev.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {rev.component_name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(rev.effective_date), "dd MMM yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderCalculationDetails(rev)}
                    </TableCell>
                    <TableCell>{getStatusBadge(rev.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{rev.created_by_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(rev.created_at), "dd MMM yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {rev.status === "Scheduled" && (
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(rev)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-red-100 hover:text-red-600" disabled={isCancelling === rev.id}>
                                {isCancelling === rev.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertCircle className="h-5 w-5 text-red-600" />
                                  Cancel Scheduled Revision?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will cancel the scheduled salary revision for <strong>{rev.component_name}</strong>.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelRevision(rev.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Confirm Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>

      {/* Edit Dialog - Full Editing Capability */}
      {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Scheduled Revision
            </DialogTitle>
            <DialogDescription>
              Modify all aspects of the scheduled salary revision. You can change calculation types, values, and more.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Component</Label>
                <Select
                  value={String(editFormData.component_id || '')}
                  onValueChange={(v) => setEditFormData({ ...editFormData, component_id: Number(v) })}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {components.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={editFormData.effective_date || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, effective_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isUpdating}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Calculation Type</Label>
              <Select
                value={editFormData.new_calculation_type}
                onValueChange={(v: any) => {
                  setEditFormData({ ...editFormData, new_calculation_type: v })
                  if (v !== 'Formula') setFormula([])
                }}
                disabled={isUpdating}
              >
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

            {editFormData.new_calculation_type === 'Fixed' && (
              <div className="space-y-2">
                <Label>New Amount (AED)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editFormData.new_value || 0}
                  onChange={(e) => setEditFormData({ ...editFormData, new_value: Number(e.target.value) })}
                  disabled={isUpdating}
                  required
                />
              </div>
            )}

            {editFormData.new_calculation_type === 'Percentage' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Percentage (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editFormData.new_value || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, new_value: Number(e.target.value) })}
                    disabled={isUpdating}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Based On Component</Label>
                  <Select
                    value={String(editFormData.new_based_on_component_id || '')}
                    onValueChange={(v) => setEditFormData({ ...editFormData, new_based_on_component_id: Number(v) })}
                    disabled={isUpdating}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select base..." />
                    </SelectTrigger>
                    <SelectContent>
                      {structure.filter(s => s.component_type === 'earning').map(c => (
                        <SelectItem key={c.component_id} value={String(c.component_id)}>
                          {c.component_name} ({formatAED(c.calculated_amount)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {editFormData.new_calculation_type === 'Formula' && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Formula Builder</Label>
                  <FormulaBuilder
                    formula={formula}
                    setFormula={setFormula}
                    components={components}
                    existingStructure={structure}
                  />
                </div>
                {formula.length > 0 && (
                  <div className="p-3 bg-muted rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Formula Preview:</div>
                    <div className="font-mono text-sm">
                      {renderFormula(formula)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={editFormData.reason || ''}
                onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
                rows={3}
                disabled={isUpdating}
                required
              />
            </div>

            <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200 dark:from-slate-900 dark:to-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Real-time Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Amount:</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatAED(realTimePreview)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setFormula([])
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Revision'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog> */}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <Edit className="h-5 w-5" />
        Edit Scheduled Revision
      </DialogTitle>
      <DialogDescription>
        Modify all aspects of the scheduled salary revision. You can change calculation types, values, and more.
      </DialogDescription>
    </DialogHeader>
    <form onSubmit={handleEditSubmit} className="space-y-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Component</Label>
          <Select
            value={String(editFormData.component_id || '')}
            onValueChange={(v) => {
              const componentId = Number(v);
              setEditFormData({ 
                ...editFormData, 
                component_id: componentId,
                // Force Fixed calculation type if component id is 1
                new_calculation_type: componentId === 1 ? 'Fixed' : editFormData.new_calculation_type
              });
              // Clear formula if component id is 1
              if (componentId === 1) {
                setFormula([]);
              }
            }}
            disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {components.map(c => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Effective Date</Label>
          <Input
            type="date"
            value={editFormData.effective_date || ''}
            onChange={(e) => setEditFormData({ ...editFormData, effective_date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            disabled={isUpdating}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Calculation Type</Label>
        <Select
          value={editFormData.new_calculation_type}
          onValueChange={(v: any) => {
            setEditFormData({ ...editFormData, new_calculation_type: v })
            if (v !== 'Formula') setFormula([])
          }}
          disabled={isUpdating || editFormData.component_id === 1}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fixed">Fixed Amount</SelectItem>
            {editFormData.component_id !== 1 && (
              <>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="Formula">Custom Formula</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
        {editFormData.component_id === 1 && (
          <p className="text-xs text-muted-foreground">
            This component only supports fixed amount calculation
          </p>
        )}
      </div>

      {editFormData.new_calculation_type === 'Fixed' && (
        <div className="space-y-2">
          <Label>New Amount (AED)</Label>
          <Input
            type="number"
            step="0.01"
            value={editFormData.new_value || 0}
            onChange={(e) => setEditFormData({ ...editFormData, new_value: Number(e.target.value) })}
            disabled={isUpdating}
            required
          />
        </div>
      )}

      {editFormData.new_calculation_type === 'Percentage' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Percentage (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={editFormData.new_value || 0}
              onChange={(e) => setEditFormData({ ...editFormData, new_value: Number(e.target.value) })}
              disabled={isUpdating}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Based On Component</Label>
            <Select
              value={String(editFormData.new_based_on_component_id || '')}
              onValueChange={(v) => setEditFormData({ ...editFormData, new_based_on_component_id: Number(v) })}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select base..." />
              </SelectTrigger>
              <SelectContent>
                {structure.filter(s => s.component_type === 'earning').map(c => (
                  <SelectItem key={c.component_id} value={String(c.component_id)}>
                    {c.component_name} ({formatAED(c.calculated_amount)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {editFormData.new_calculation_type === 'Formula' && (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Formula Builder</Label>
            <FormulaBuilder
              formula={formula}
              setFormula={setFormula}
              components={components}
              existingStructure={structure}
            />
          </div>
          {formula.length > 0 && (
            <div className="p-3 bg-muted rounded-md">
              <div className="text-xs text-muted-foreground mb-1">Formula Preview:</div>
              <div className="font-mono text-sm">
                {renderFormula(formula)}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Reason</Label>
        <Textarea
          value={editFormData.reason || ''}
          onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
          rows={3}
          disabled={isUpdating}
          required
        />
      </div>

      <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200 dark:from-slate-900 dark:to-gray-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Real-time Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estimated Amount:</span>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatAED(realTimePreview)}
            </span>
          </div>
        </CardContent>
      </Card>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsEditDialogOpen(false)
            setFormula([])
          }}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Revision'
          )}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

    </Card>
  )
}
