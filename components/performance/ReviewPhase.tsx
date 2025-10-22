"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { submitManagerAssessment, type AppraisalDetails } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { 
  Target, 
  TrendingUp, 
  Star, 
  MessageSquare, 
  CheckCircle, 
  Loader2,
  AlertCircle,
  Award,
  BarChart
} from "lucide-react"

interface Props {
  appraisal: AppraisalDetails
  onSuccess: () => void
  isEditable: boolean
}

export function ReviewPhase({ appraisal, onSuccess, isEditable }: Props) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    goals: appraisal.goals.map((g) => ({
      id: g.id,
      manager_rating: g.manager_rating || 0,
      manager_comments: g.manager_comments || "",
    })),
    kpis: appraisal.kpis.map((k) => ({
      id: k.id,
      manager_rating: k.manager_rating || 0,
      manager_comments: k.manager_comments || "",
    })),
    final_manager_comments: appraisal.final_manager_comments || "",
    overall_manager_rating: appraisal.overall_manager_rating || 0,
  })

  const handleFormChange = (
    type: "goals" | "kpis",
    id: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }))
  }

  const handleSubmit = async () => {
    // Validation
    const hasUnratedGoals = formData.goals.some(g => !g.manager_rating || g.manager_rating < 1)
    const hasUnratedKpis = formData.kpis.some(k => !k.manager_rating || k.manager_rating < 1)
    
    if (hasUnratedGoals || hasUnratedKpis) {
      toast({
        title: "Incomplete Review",
        description: "Please provide ratings for all goals and KPIs before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!formData.overall_manager_rating || formData.overall_manager_rating < 1) {
      toast({
        title: "Missing Overall Rating",
        description: "Please provide an overall rating before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await submitManagerAssessment(appraisal.id, formData)
      toast({
        title: "Success",
        description: "Final assessment has been submitted successfully.",
      })
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Submission failed: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
  const totalItems = appraisal.goals.length + appraisal.kpis.length
  const completedItems = formData.goals.filter(g => g.manager_rating > 0).length + 
                        formData.kpis.filter(k => k.manager_rating > 0).length
  const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {isEditable && (
        <Card className="border-indigo-200 dark:border-indigo-900">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Review Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {completedItems} of {totalItems} items reviewed
                </span>
                <span className="font-medium">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Review */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Goals Review</CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Review and rate employee performance on their goals
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {appraisal.goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No goals have been set for this appraisal</p>
            </div>
          ) : (
            appraisal.goals.map((goal, index) => (
              <div key={goal.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{goal.goal_title}</h4>
                    {/* <p className="text-sm text-muted-foreground mt-1">{goal.description}</p> */}
                  </div>
                  <Badge variant="outline" className="ml-2">Goal {index + 1}</Badge>
                </div>

                <Separator className="my-4" />

                {/* Employee's Assessment */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg mb-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                      Employee's Self-Assessment
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-2">
                        {renderStars(goal.employee_rating??0)}
                        <span className={`font-medium ${getRatingColor(goal.employee_rating??0)}`}>
                          {goal.employee_rating}/5
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getRatingLabel(goal.employee_rating??0)}
                        </Badge>
                      </div>
                    </div>
                    {goal.employee_comments && (
                      <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                        <p className="text-muted-foreground">Comments:</p>
                        <p className="mt-1 text-blue-900 dark:text-blue-100">{goal.employee_comments}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manager's Assessment */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Your Comments
                    </Label>
                    <Textarea
                      disabled={!isEditable}
                      value={formData.goals[index]?.manager_comments}
                      onChange={(e) =>
                        handleFormChange(
                          "goals",
                          goal.id,
                          "manager_comments",
                          e.target.value
                        )
                      }
                      placeholder="Provide your feedback on this goal..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Your Rating (1-5)
                    </Label>
                    <Input
                      disabled={!isEditable}
                      type="number"
                      min="1"
                      max="5"
                      step="0.5"
                      value={formData.goals[index]?.manager_rating || ""}
                      onChange={(e) =>
                        handleFormChange(
                          "goals",
                          goal.id,
                          "manager_rating",
                          Number(e.target.value)
                        )
                      }
                      placeholder="1-5"
                    />
                    {formData.goals[index]?.manager_rating > 0 && (
                      <div className="pt-2">
                        {renderStars(formData.goals[index]?.manager_rating)}
                        <p className={`text-xs mt-1 font-medium ${getRatingColor(formData.goals[index]?.manager_rating)}`}>
                          {getRatingLabel(formData.goals[index]?.manager_rating)}
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

      {/* KPIs Review */}
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>KPIs Review</CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                Evaluate performance on key performance indicators
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {appraisal.kpis.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No KPIs have been set for this appraisal</p>
            </div>
          ) : (
            appraisal.kpis.map((kpi, index) => (
              <div key={kpi.id} className="p-4 border rounded-lg hover:border-green-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{kpi.kpi_name}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="font-medium">{kpi.target}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Actual:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {kpi.actual}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">KPI {index + 1}</Badge>
                </div>

                <Separator className="my-4" />

                {/* Employee's Assessment */}
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg mb-4 border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <p className="font-semibold text-sm text-green-900 dark:text-green-100">
                      Employee's Self-Assessment
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-2">
                        {renderStars(kpi.employee_rating??0)}
                        <span className={`font-medium ${getRatingColor(kpi.employee_rating??0)}`}>
                          {kpi.employee_rating}/5
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getRatingLabel(kpi.employee_rating??0)}
                        </Badge>
                      </div>
                    </div>
                    {kpi.employee_comments && (
                      <div className="pt-2 border-t border-green-200 dark:border-green-800">
                        <p className="text-muted-foreground">Comments:</p>
                        <p className="mt-1 text-green-900 dark:text-green-100">{kpi.employee_comments}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manager's Assessment */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Your Comments
                    </Label>
                    <Textarea
                      disabled={!isEditable}
                      value={formData.kpis[index]?.manager_comments}
                      onChange={(e) =>
                        handleFormChange(
                          "kpis",
                          kpi.id,
                          "manager_comments",
                          e.target.value
                        )
                      }
                      placeholder="Provide your feedback on this KPI..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Your Rating (1-5)
                    </Label>
                    <Input
                      disabled={!isEditable}
                      type="number"
                      min="1"
                      max="5"
                      step="0.5"
                      value={formData.kpis[index]?.manager_rating || ""}
                      onChange={(e) =>
                        handleFormChange(
                          "kpis",
                          kpi.id,
                          "manager_rating",
                          Number(e.target.value)
                        )
                      }
                      placeholder="1-5"
                    />
                    {formData.kpis[index]?.manager_rating > 0 && (
                      <div className="pt-2">
                        {renderStars(formData.kpis[index]?.manager_rating)}
                        <p className={`text-xs mt-1 font-medium ${getRatingColor(formData.kpis[index]?.manager_rating)}`}>
                          {getRatingLabel(formData.kpis[index]?.manager_rating)}
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

      {/* Final Assessment */}
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Final Assessment</CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                Provide your overall evaluation and rating
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              Final Overall Comments
            </Label>
            <Textarea
              disabled={!isEditable}
              value={formData.final_manager_comments}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  final_manager_comments: e.target.value,
                })
              }
              placeholder="Provide your overall assessment and feedback for the employee..."
              rows={6}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4" />
              Final Overall Rating (1-5)
            </Label>
            <Input
              disabled={!isEditable}
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={formData.overall_manager_rating || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overall_manager_rating: Number(e.target.value),
                })
              }
              placeholder="Enter overall rating (1.0 - 5.0)"
              className="max-w-xs"
            />
            {formData.overall_manager_rating > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {renderStars(formData.overall_manager_rating)}
                <span className={`font-semibold ${getRatingColor(formData.overall_manager_rating)}`}>
                  {formData.overall_manager_rating}/5 - {getRatingLabel(formData.overall_manager_rating)}
                </span>
              </div>
            )}
          </div>

          {isEditable && completionPercentage < 100 && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-900 dark:text-yellow-100">
                Please complete all ratings before submitting the final assessment.
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4">
            <Button 
              disabled={!isEditable || isSubmitting} 
              onClick={handleSubmit}
              className="w-full sm:w-auto"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : isEditable ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Final Review
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review Submitted
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
