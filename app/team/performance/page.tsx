

"use client"

import * as React from "react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart, ArrowRight, Loader2, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getReviewCycles,
  getTeamAppraisalStatuses,
  initiateTeamAppraisals,
  type ReviewCycle,
  type TeamAppraisalStatus,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function TeamPerformancePage() {
  const { toast } = useToast()
  const [cycles, setCycles] = React.useState<ReviewCycle[]>([])
  const [selectedCycleId, setSelectedCycleId] = React.useState<string>("")
  const [teamStatuses, setTeamStatuses] = React.useState<TeamAppraisalStatus[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isInitiating, setIsInitiating] = React.useState(false)
  const [isInitialLoading, setIsInitialLoading] = React.useState(true)

  React.useEffect(() => {
    getReviewCycles()
      .then(setCycles)
      .catch((error) => {
        toast({
          title: "Error",
          description: "Could not load review cycles.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsInitialLoading(false)
      })
  }, [toast])

  React.useEffect(() => {
    if (selectedCycleId) {
      handleCycleChange(selectedCycleId)
    }
  }, [selectedCycleId])

  const handleCycleChange = async (cycleId: string) => {
    setSelectedCycleId(cycleId)
    setIsLoading(true)
    try {
      const data = await getTeamAppraisalStatuses(Number(cycleId))
      setTeamStatuses(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load team appraisal statuses.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInitiate = async () => {
    if (!selectedCycleId) return
    setIsInitiating(true)
    try {
      await initiateTeamAppraisals(Number(selectedCycleId))
      toast({
        title: "Success",
        description: "Appraisals initiated for your team.",
      })
      handleCycleChange(selectedCycleId) // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Initiation failed: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsInitiating(false)
    }
  }

  // Check if there are any team members with "Not Started" status
  const hasNotStartedMembers = teamStatuses.some(
    (s) => s.status === "Not Started" || s.status === null
  )

  // Show initiate button only if:
  // 1. A cycle is selected
  // 2. There are team members
  // 3. At least one member has "Not Started" status
  const shouldShowInitiateButton = selectedCycleId && 
    teamStatuses.length > 0 && 
    hasNotStartedMembers

  const getStatusBadge = (status: string | null) => {
    const statusMap: Record<string, { className: string }> = {
      'Not Started': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100' },
      'Self Assessment Pending': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
      'Manager Review Pending': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
      'Completed': { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
    }
    
    const displayStatus = status || 'Not Started'
    const badgeClass = statusMap[displayStatus]?.className || 'bg-gray-100 text-gray-800'
    
    return <Badge className={badgeClass}>{displayStatus}</Badge>
  }

  // Skeleton loading component
  const TeamPerformanceSkeleton = () => (
    <>
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        {/* Card skeleton */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-10 w-[280px]" />
                <Skeleton className="h-10 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Table skeleton */}
            <div className="space-y-4">
              {/* Table header */}
              <div className="flex justify-between items-center pb-2 border-b">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              
              {/* Table rows */}
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )

  // Show skeleton on initial loading
  if (isInitialLoading) {
    return <TeamPerformanceSkeleton />
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Team Performance</h1>
            <p className="text-muted-foreground">
              Manage and track your team's appraisals for each review cycle.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Review Cycle Dashboard</CardTitle>
            <CardDescription className="mt-1">
              Select a review cycle to view and manage your team's appraisals
            </CardDescription>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
              <Select onValueChange={handleCycleChange} value={selectedCycleId}>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Select a review cycle..." />
                </SelectTrigger>
                <SelectContent>
                  {cycles.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.cycle_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {shouldShowInitiateButton && (
                <Button 
                  onClick={handleInitiate} 
                  disabled={isInitiating}
                  className="w-full sm:w-auto"
                >
                  {isInitiating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Initiating...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Initiate Appraisals for Team
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Table loading skeleton
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-32" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : selectedCycleId ? (
              teamStatuses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamStatuses.map((emp) => (
                      <TableRow key={emp.employee_id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {emp.employee_name}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(emp.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {emp.appraisal_id ? (
                            <Button asChild variant="outline" size="sm">
                              <Link
                                href={`/team/performance/${emp.appraisal_id}`}
                              >
                                View/Edit Appraisal
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Not Initiated
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-muted rounded-full">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
                  <p className="text-muted-foreground">
                    No team members found for this cycle.
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-muted rounded-full">
                    <BarChart className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Cycle Selected</h3>
                <p className="text-muted-foreground">
                  Please select a review cycle to view team appraisals.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
