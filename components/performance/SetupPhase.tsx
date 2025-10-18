"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { assignGoal, assignKpi, getAllKpis, type AppraisalDetails, type Kpi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Target, 
  TrendingUp, 
  Plus, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Percent,
  FileText
} from "lucide-react"

interface Props {
  appraisal: AppraisalDetails
  onSuccess: () => void
}

export function SetupPhase({ appraisal, onSuccess }: Props) {
  const { toast } = useToast()
  const [kpiLibrary, setKpiLibrary] = React.useState<Kpi[]>([])
  const [isLoadingKpis, setIsLoadingKpis] = React.useState(true)
  const [isSubmittingGoal, setIsSubmittingGoal] = React.useState(false)
  const [isSubmittingKpi, setIsSubmittingKpi] = React.useState(false)

  const [goalForm, setGoalForm] = React.useState({ 
    title: '', 
    description: '', 
    weightage: 50 
  })
  const [kpiForm, setKpiForm] = React.useState({ 
    kpi_id: '', 
    target: '', 
    weightage: 50 
  })

  React.useEffect(() => {
    setIsLoadingKpis(true)
    getAllKpis()
      .then(setKpiLibrary)
      .catch(() => {
        toast({
          title: "Error",
          description: "Could not load KPI library.",
          variant: "destructive"
        })
      })
      .finally(() => setIsLoadingKpis(false))
  }, [toast])

  const handleAssignGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingGoal(true)
    try {
      await assignGoal({
        appraisal_id: appraisal.id,
        goal_title: goalForm.title,
        goal_description: goalForm.description,
        weightage: goalForm.weightage
      })
      toast({ 
        title: "Success", 
        description: "Goal assigned successfully." 
      })
      setGoalForm({ title: '', description: '', weightage: 50 })
      onSuccess()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Failed to assign goal: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsSubmittingGoal(false)
    }
  }
  
  const handleAssignKpi = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingKpi(true)
    try {
      await assignKpi({
        appraisal_id: appraisal.id,
        kpi_id: Number(kpiForm.kpi_id),
        target: kpiForm.target,
        weightage: kpiForm.weightage
      })
      toast({ 
        title: "Success", 
        description: "KPI assigned successfully." 
      })
      setKpiForm({ kpi_id: '', target: '', weightage: 50 })
      onSuccess()
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Failed to assign KPI: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsSubmittingKpi(false)
    }
  }

  // Calculate total weightage
  const totalGoalWeightage = appraisal.goals.reduce((sum, g) => sum + g.weightage, 0)
  const totalKpiWeightage = appraisal.kpis.reduce((sum, k) => sum + k.weightage, 0)
  const totalWeightage = totalGoalWeightage + totalKpiWeightage
  const isBalanced = totalWeightage === 100

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card className="border-indigo-200 dark:border-indigo-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Setup Progress
          </CardTitle>
          <CardDescription>
            Assign goals and KPIs to complete the appraisal setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Goals</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{appraisal.goals.length}</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {totalGoalWeightage}% weightage
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900 dark:text-green-100">KPIs</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{appraisal.kpis.length}</p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                {totalKpiWeightage}% weightage
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${
              isBalanced 
                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900' 
                : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Percent className={`h-4 w-4 ${isBalanced ? 'text-green-600' : 'text-yellow-600'}`} />
                <span className={`text-sm font-medium ${
                  isBalanced 
                    ? 'text-green-900 dark:text-green-100' 
                    : 'text-yellow-900 dark:text-yellow-100'
                }`}>
                  Total Weightage
                </span>
              </div>
              <p className={`text-2xl font-bold ${isBalanced ? 'text-green-600' : 'text-yellow-600'}`}>
                {totalWeightage}%
              </p>
              <p className={`text-xs mt-1 ${
                isBalanced 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-yellow-700 dark:text-yellow-300'
              }`}>
                {isBalanced ? 'Balanced ✓' : 'Must equal 100%'}
              </p>
            </div>
          </div>

          {!isBalanced && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-900 dark:text-yellow-100">
                Total weightage should equal 100%. Current total: {totalWeightage}%
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Weightage Distribution</span>
              <span className="font-medium">{totalWeightage}%</span>
            </div>
            <Progress value={Math.min(totalWeightage, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column - Assigned Items */}
        <div className="space-y-6">
          {/* Assigned Goals */}
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Assigned Goals</CardTitle>
                    <CardDescription className="text-blue-700 dark:text-blue-300">
                      {appraisal.goals.length} goal{appraisal.goals.length !== 1 ? 's' : ''} assigned
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  {totalGoalWeightage}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {appraisal.goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-sm">
                    No goals assigned yet. Add goals using the form on the right.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appraisal.goals.map((g, index) => (
                    <div key={g.id} className="p-3 border rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">Goal {index + 1}</Badge>
                            <h4 className="font-semibold">{g.goal_title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{g.goal_description}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          {g.weightage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned KPIs */}
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Assigned KPIs</CardTitle>
                    <CardDescription className="text-green-700 dark:text-green-300">
                      {appraisal.kpis.length} KPI{appraisal.kpis.length !== 1 ? 's' : ''} assigned
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  {totalKpiWeightage}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {appraisal.kpis.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-sm">
                    No KPIs assigned yet. Add KPIs using the form on the right.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appraisal.kpis.map((k, index) => (
                    <div key={k.id} className="p-3 border rounded-lg hover:border-green-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">KPI {index + 1}</Badge>
                            <h4 className="font-semibold">{k.kpi_name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Target: <span className="font-medium text-green-600">{k.target}</span>
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          {k.weightage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="space-y-6">
          {/* Add Goal Form */}
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Add New Goal</CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
                    Define a performance goal for this appraisal
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAssignGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Goal Title *
                  </Label>
                  <Input
                    id="goal-title"
                    value={goalForm.title}
                    onChange={e => setGoalForm({ ...goalForm, title: e.target.value })}
                    placeholder="e.g., Improve team productivity"
                    required
                    disabled={isSubmittingGoal}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description *
                  </Label>
                  <Textarea
                    id="goal-description"
                    value={goalForm.description}
                    onChange={e => setGoalForm({ ...goalForm, description: e.target.value })}
                    placeholder="Describe the goal in detail..."
                    rows={4}
                    required
                    disabled={isSubmittingGoal}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-weightage" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Weightage (%) *
                  </Label>
                  <Input
                    id="goal-weightage"
                    type="number"
                    min="1"
                    max="100"
                    value={goalForm.weightage}
                    onChange={e => setGoalForm({ ...goalForm, weightage: Number(e.target.value) })}
                    required
                    disabled={isSubmittingGoal}
                  />
                  <p className="text-xs text-muted-foreground">
                    Remaining: {100 - totalWeightage}%
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmittingGoal}>
                  {isSubmittingGoal ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Goal
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Add KPI Form */}
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Assign KPI from Library</CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    Select a KPI and set the target value
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoadingKpis ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <form onSubmit={handleAssignKpi} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="kpi-select" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      KPI *
                    </Label>
                    <Select
                      required
                      value={kpiForm.kpi_id}
                      onValueChange={v => setKpiForm({ ...kpiForm, kpi_id: v })}
                      disabled={isSubmittingKpi}
                    >
                      <SelectTrigger id="kpi-select">
                        <SelectValue placeholder="Select a KPI from library..." />
                      </SelectTrigger>
                      <SelectContent>
                        {kpiLibrary.map(k => (
                          <SelectItem key={k.id} value={String(k.id)}>
                            {k.kpi_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpi-target" className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Target Value *
                    </Label>
                    <Input
                      id="kpi-target"
                      value={kpiForm.target}
                      onChange={e => setKpiForm({ ...kpiForm, target: e.target.value })}
                      placeholder="e.g., 95%, 1000 units, etc."
                      required
                      disabled={isSubmittingKpi}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpi-weightage" className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Weightage (%) *
                    </Label>
                    <Input
                      id="kpi-weightage"
                      type="number"
                      min="1"
                      max="100"
                      value={kpiForm.weightage}
                      onChange={e => setKpiForm({ ...kpiForm, weightage: Number(e.target.value) })}
                      required
                      disabled={isSubmittingKpi}
                    />
                    <p className="text-xs text-muted-foreground">
                      Remaining: {100 - totalWeightage}%
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmittingKpi}>
                    {isSubmittingKpi ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Assign KPI
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
