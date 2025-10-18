"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getAppraisalDetails, type AppraisalDetails } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  Eye,
  Edit
} from "lucide-react"
import { SetupPhase } from "@/components/performance/SetupPhase"
import { ReviewPhase } from "@/components/performance/ReviewPhase"

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-9 w-96" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  )
}

function ContentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AppraisalDetailSkeleton() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <ContentSkeleton />
      </div>
    </MainLayout>
  )
}

export default function AppraisalDetailPage() {
  const params = useParams()
  const appraisalId = Number(params.appraisalId)
  const { toast } = useToast()
  const [appraisal, setAppraisal] = React.useState<AppraisalDetails | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchData = React.useCallback(async () => {
    if (!appraisalId) return
    setIsLoading(true)
    try {
      const data = await getAppraisalDetails(appraisalId)
      setAppraisal(data)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "Could not load appraisal details.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [appraisalId, toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; icon: any; label: string }> = {
      'Pending': { 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100', 
        icon: Clock, 
        label: 'Setup Pending' 
      },
      'Self-Assessment': { 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', 
        icon: Edit, 
        label: 'Self Assessment' 
      },
      'Manager-Review': { 
        className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100', 
        icon: ClipboardCheck, 
        label: 'Manager Review' 
      },
      'Completed': { 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', 
        icon: CheckCircle, 
        label: 'Completed' 
      },
    }
    const { className, icon: Icon, label } = statusMap[status] || statusMap['Pending']
    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const getStatusDescription = (status: string) => {
    const descriptions: Record<string, string> = {
      'Pending': 'Set up goals and competencies for this appraisal period',
      'Self-Assessment': 'Waiting for employee to complete their self-assessment',
      'Manager-Review': 'Review and provide ratings for this employee',
      'Completed': 'This appraisal has been finalized and is now read-only',
    }
    return descriptions[status] || 'Unknown status'
  }

  if (isLoading) {
    return <AppraisalDetailSkeleton />
  }

  if (!appraisal) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="p-4 bg-muted rounded-full mb-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Appraisal Not Found</h2>
          <p className="text-muted-foreground">
            The appraisal you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ClipboardCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Performance Appraisal</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                {appraisal.employee_name}
              </p>
            </div>
          </div>

          {/* Status Banner */}
          <Alert className={
            appraisal.status === 'Completed' ? 'border-green-200 bg-green-50 dark:bg-green-950/30' :
            appraisal.status === 'Manager-Review' ? 'border-purple-200 bg-purple-50 dark:bg-purple-950/30' :
            appraisal.status === 'Self-Assessment' ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/30' :
            'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30'
          }>
            <div className="flex items-start gap-3">
              {appraisal.status === 'Completed' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
              {appraisal.status === 'Manager-Review' && <ClipboardCheck className="h-5 w-5 text-purple-600 mt-0.5" />}
              {appraisal.status === 'Self-Assessment' && <Edit className="h-5 w-5 text-blue-600 mt-0.5" />}
              {appraisal.status === 'Pending' && <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />}
              <div className="flex-1">
                <AlertTitle className="flex items-center gap-2">
                  Current Status: {getStatusBadge(appraisal.status)}
                </AlertTitle>
                <AlertDescription className="mt-1">
                  {getStatusDescription(appraisal.status)}
                </AlertDescription>
              </div>
            </div>
          </Alert>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Review Cycle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{appraisal.cycle_name || 'N/A'}</p>
              </CardContent>
            </Card> */}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Employee ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{appraisal.employee_id}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Appraisal ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">#{appraisal.id}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status-based Content */}
        {appraisal.status === 'Pending' && (
          <SetupPhase appraisal={appraisal} onSuccess={fetchData} />
        )}

        {appraisal.status === 'Self-Assessment' && (
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Edit className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Awaiting Employee Self-Assessment</CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
                    The employee is currently completing their self-assessment
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900 dark:text-blue-100">
                    You will be notified when the employee completes their self-assessment. 
                    Once complete, you can proceed with your managerial review.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      What's Next?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Once the employee submits their self-assessment, the appraisal will move to the 
                      Manager Review stage where you can provide your evaluation.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Your Role
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Review the employee's self-assessment, provide your ratings, and add comments 
                      to complete the appraisal process.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {appraisal.status === 'Manager-Review' && (
          <div className="space-y-4">
            <Card className="border-purple-200 dark:border-purple-900">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <ClipboardCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Manager Review</CardTitle>
                    <CardDescription className="text-purple-700 dark:text-purple-300">
                      Review the employee's self-assessment and provide your ratings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <ReviewPhase appraisal={appraisal} onSuccess={fetchData} isEditable={true} />
          </div>
        )}

        {appraisal.status === 'Completed' && (
          <div className="space-y-4">
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Appraisal Completed</CardTitle>
                    <CardDescription className="text-green-700 dark:text-green-300">
                      This appraisal has been finalized and is now read-only
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30 mb-6">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900 dark:text-green-100">
                    This appraisal has been successfully completed and submitted. 
                    You can view all details below, but no further changes can be made.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            <ReviewPhase appraisal={appraisal} onSuccess={fetchData} isEditable={false} />
          </div>
        )}
      </div>
    </MainLayout>
  )
}
