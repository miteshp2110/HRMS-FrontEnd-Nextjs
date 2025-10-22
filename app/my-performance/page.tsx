"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Star, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  MessageSquare,
  Award,
  BarChart
} from "lucide-react"
import { 
  getReviewCycles, 
  getMyValuation, 
  submitSelfAssessment, 
  type ReviewCycle, 
  type AppraisalDetails 
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-[280px] mt-4" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function MyPerformancePage() {
  const { toast } = useToast()
  const [cycles, setCycles] = React.useState<ReviewCycle[]>([])
  const [selectedCycleId, setSelectedCycleId] = React.useState<string>('')
  const [appraisal, setAppraisal] = React.useState<AppraisalDetails | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isInitialLoading, setIsInitialLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState<{ goals: any[], kpis: any[] }>({ 
    goals: [], 
    kpis: [] 
  })

  React.useEffect(() => {
    getReviewCycles()
      .then(setCycles)
      .finally(() => setIsInitialLoading(false))
  }, [])

  const handleCycleChange = async (cycleId: string) => {
    setSelectedCycleId(cycleId)
    setIsLoading(true)
    try {
      const data = await getMyValuation(Number(cycleId))
      setAppraisal(data)
      setFormData({
        goals: data.goals.map(g => ({ 
          id: g.id, 
          employee_rating: g.employee_rating || 0, 
          employee_comments: g.employee_comments || '' 
        })),
        kpis: data.kpis.map(k => ({ 
          id: k.id, 
          actual: k.actual || '', 
          employee_rating: k.employee_rating || 0, 
          employee_comments: k.employee_comments || '' 
        }))
      })
    } catch (error: any) {
      setAppraisal(null)
      toast({ 
        title: "Not Available", 
        description: "Your appraisal has not been initiated for this cycle yet.", 
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleFormChange = (type: 'goals' | 'kpis', id: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map(item => item.id === id ? { ...item, [field]: value } : item)
    }))
  }

  const handleSubmit = async () => {
    if (!appraisal) return

    // Validation
    const hasUnratedGoals = formData.goals.some(g => !g.employee_rating || g.employee_rating < 1)
    const hasUnratedKpis = formData.kpis.some(k => !k.employee_rating || k.employee_rating < 1)
    
    if (hasUnratedGoals || hasUnratedKpis) {
      toast({
        title: "Incomplete Assessment",
        description: "Please provide ratings for all goals and KPIs before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await submitSelfAssessment(appraisal.id, formData)
      toast({ 
        title: "Success", 
        description: "Self-assessment submitted successfully." 
      })
      handleCycleChange(selectedCycleId)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Submission failed: ${error.message}`, 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSubmitted = appraisal?.status !== 'Pending'

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 dark:text-green-400"
    if (rating >= 3.5) return "text-blue-600 dark:text-blue-400"
    if (rating >= 2.5) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Excellent"
    if (rating >= 3.5) return "Good"
    if (rating >= 2.5) return "Average"
    if (rating >= 1.5) return "Below Average"
    return "Needs Improvement"
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    )
  }

  // Calculate completion percentage
  const totalItems = appraisal ? appraisal.goals.length + appraisal.kpis.length : 0
  const completedItems = formData.goals.filter(g => g.employee_rating > 0).length + 
                        formData.kpis.filter(k => k.employee_rating > 0).length
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  if (isInitialLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <ContentSkeleton />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Star className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Performance</h1>
            <p className="text-muted-foreground">View and complete your self-assessment for the review cycle</p>
          </div>
        </div>

        {/* Cycle Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Review Cycle</CardTitle>
            <CardDescription className="mt-1">
              Choose a review cycle to view or complete your performance assessment
            </CardDescription>
            <div className="pt-4">
              <Select onValueChange={handleCycleChange} value={selectedCycleId}>
                <SelectTrigger className="w-full sm:w-[320px]">
                  <SelectValue placeholder="Select a review cycle..." />
                </SelectTrigger>
                <SelectContent>
                  {cycles.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.cycle_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          {isLoading && (
            <CardContent>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </CardContent>
          )}

          {!isLoading && appraisal && (
            <CardContent className="space-y-6 pt-6">
              {/* Progress Card */}
              {!isSubmitted && (
                <Card className="border-indigo-200 dark:border-indigo-900">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BarChart className="h-4 w-4" />
                      Assessment Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {completedItems} of {totalItems} items completed
                        </span>
                        <span className="font-medium">{Math.round(completionPercentage)}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status Alert */}
              {isSubmitted && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Assessment Submitted</AlertTitle>
                  <AlertDescription className="text-green-900 dark:text-green-100">
                    Your self-assessment has been submitted and is now with your manager for review.
                  </AlertDescription>
                </Alert>
              )}

              {/* Goals Section */}
              <Card className="border-blue-200 dark:border-blue-900">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Goals Assessment</CardTitle>
                      <CardDescription className="text-blue-700 dark:text-blue-300">
                        Rate your performance on assigned goals
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {appraisal.goals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No goals have been assigned for this appraisal</p>
                    </div>
                  ) : (
                    appraisal.goals.map((goal, index) => (
                      <div key={goal.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">Goal {index + 1}</Badge>
                              <h4 className="font-semibold text-lg">{goal.goal_title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{goal.goal_description}</p>
                          </div>
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            {goal.weightage}%
                          </Badge>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-2">
                            <Label className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              My Achievements
                            </Label>
                            <Textarea
                              value={formData.goals[index]?.employee_comments}
                              onChange={e => handleFormChange('goals', goal.id, 'employee_comments', e.target.value)}
                              readOnly={isSubmitted}
                              placeholder="Describe your achievements for this goal..."
                              rows={4}
                              className="resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              My Rating (1-5)
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              step="0.5"
                              value={formData.goals[index]?.employee_rating || ""}
                              onChange={e => handleFormChange('goals', goal.id, 'employee_rating', Number(e.target.value))}
                              readOnly={isSubmitted}
                              placeholder="1-5"
                            />
                            {formData.goals[index]?.employee_rating > 0 && (
                              <div className="pt-2">
                                {renderStars(formData.goals[index]?.employee_rating)}
                                <p className={`text-xs mt-1 font-medium ${getRatingColor(formData.goals[index]?.employee_rating)}`}>
                                  {getRatingLabel(formData.goals[index]?.employee_rating)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* KPIs Section */}
              <Card className="border-green-200 dark:border-green-900">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>KPIs Assessment</CardTitle>
                      <CardDescription className="text-green-700 dark:text-green-300">
                        Provide actual results and rate your KPI performance
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {appraisal.kpis.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No KPIs have been assigned for this appraisal</p>
                    </div>
                  ) : (
                    appraisal.kpis.map((kpi, index) => (
                      <div key={kpi.id} className="p-4 border rounded-lg hover:border-green-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">KPI {index + 1}</Badge>
                              <h4 className="font-semibold text-lg">{kpi.kpi_name}</h4>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm">
                              <span className="text-muted-foreground">Target:</span>
                              <span className="font-medium">{kpi.target}</span>
                            </div>
                          </div>
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            {kpi.weightage}%
                          </Badge>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Actual Result
                            </Label>
                            <Input
                              value={formData.kpis[index]?.actual}
                              onChange={e => handleFormChange('kpis', kpi.id, 'actual', e.target.value)}
                              readOnly={isSubmitted}
                              placeholder="e.g., 98%"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              My Comments
                            </Label>
                            <Textarea
                              value={formData.kpis[index]?.employee_comments}
                              onChange={e => handleFormChange('kpis', kpi.id, 'employee_comments', e.target.value)}
                              readOnly={isSubmitted}
                              placeholder="Describe your performance..."
                              rows={3}
                              className="resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              My Rating (1-5)
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              step="0.5"
                              value={formData.kpis[index]?.employee_rating || ""}
                              onChange={e => handleFormChange('kpis', kpi.id, 'employee_rating', Number(e.target.value))}
                              readOnly={isSubmitted}
                              placeholder="1-5"
                            />
                            {formData.kpis[index]?.employee_rating > 0 && (
                              <div className="pt-2">
                                {renderStars(formData.kpis[index]?.employee_rating)}
                                <p className={`text-xs mt-1 font-medium ${getRatingColor(formData.kpis[index]?.employee_rating)}`}>
                                  {getRatingLabel(formData.kpis[index]?.employee_rating)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              {!isSubmitted && (
                <Card className="border-purple-200 dark:border-purple-900">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>Ready to Submit?</CardTitle>
                        <CardDescription className="text-purple-700 dark:text-purple-300">
                          Review your assessment and submit when ready
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {completionPercentage < 100 && (
                      <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30 mb-4">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-900 dark:text-yellow-100">
                          Please complete all ratings before submitting your assessment.
                        </AlertDescription>
                      </Alert>
                    )}
                    <Button 
                      onClick={handleSubmit} 
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Self-Assessment
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          )}

          {!isLoading && !appraisal && selectedCycleId && (
            <CardContent>
              <div className="text-center py-12">
                <div className="p-4 bg-muted rounded-full inline-block mb-4">
                  <AlertCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Appraisal Not Initiated</h3>
                <p className="text-muted-foreground">
                  Your appraisal has not been initiated for this cycle yet.
                  Please check back later or contact your manager.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </MainLayout>
  )
}
