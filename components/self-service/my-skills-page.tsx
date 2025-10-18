"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, CheckCircle, XCircle, Clock, Award, Trash2, Loader2, AlertCircle, TrendingUp } from "lucide-react"
import { getMySkillRequests, getSkills, createSkillRequest, deleteSkillRequest, type Skill } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface MySkillRequest {
  id: number
  skill_name: string
  status: null | 0 | 1 // null = pending, 0 = rejected, 1 = approved
  created_at: string
}

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <Skeleton className="h-10 w-48" />
    </div>
  )
}

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Skill Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Requested On</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function MySkillsPage() {
  const { toast } = useToast()
  const [mySkills, setMySkills] = React.useState<MySkillRequest[]>([])
  const [availableSkills, setAvailableSkills] = React.useState<Skill[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)
  const [skillToDelete, setSkillToDelete] = React.useState<MySkillRequest | null>(null)
  const [selectedSkillId, setSelectedSkillId] = React.useState<string>("")

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const [mySkillsData, availableSkillsData] = await Promise.all([
        getMySkillRequests(),
        getSkills()
      ])
      setMySkills(mySkillsData)
      setAvailableSkills(availableSkillsData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load skills data: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmitRequest = async () => {
    if (!selectedSkillId) {
      toast({ title: "Validation Error", description: "Please select a skill.", variant: "destructive" })
      return
    }
    
    setIsSubmitting(true)
    try {
      await createSkillRequest(Number(selectedSkillId))
      toast({ title: "Success", description: "Skill request submitted for approval." })
      setIsDialogOpen(false)
      setSelectedSkillId("")
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to submit request: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteRequest = async () => {
    if (!skillToDelete) return
    
    setDeletingId(skillToDelete.id)
    try {
      await deleteSkillRequest(skillToDelete.id)
      toast({ title: "Success", description: "Skill request has been cancelled." })
      fetchData()
      setShowDeleteAlert(false)
      setSkillToDelete(null)
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: `Failed to cancel request: ${error.message}`, 
        variant: "destructive"
      })
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: null | 0 | 1) => {
    if (status === 1) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    }
    if (status === 0) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    )
  }

  // Calculate statistics
  const totalSkills = mySkills.length
  const approvedSkills = mySkills.filter(s => s.status === 1).length
  const pendingSkills = mySkills.filter(s => s.status === null).length
  const rejectedSkills = mySkills.filter(s => s.status === 0).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <TableSkeleton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Skills</h1>
            <p className="text-muted-foreground">
              Manage your professional skills and their approval status
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Request a New Skill
              </DialogTitle>
              <DialogDescription>
                Select a skill to add to your profile. It will be sent for manager approval.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="skill-select" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Select Skill *
                </Label>
                <Select 
                  value={selectedSkillId} 
                  onValueChange={setSelectedSkillId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="skill-select">
                    <SelectValue placeholder="Choose a skill from the library..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills.map(skill => (
                      <SelectItem key={skill.id} value={skill.id.toString()}>
                        {skill.skill_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false)
                  setSelectedSkillId("")
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitRequest}
                disabled={isSubmitting || !selectedSkillId}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Total Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSkills}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedSkills}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingSkills}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedSkills}</div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Skill Requests</CardTitle>
          <CardDescription>
            A list of all your requested skills and their approval status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mySkills.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-muted rounded-full">
                  <Award className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Skills Added</h3>
              <p className="text-muted-foreground mb-4">
                You haven't added any skills yet. Click "Add Skill Request" to get started.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)} 
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Skill
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mySkills.map(skill => (
                    <TableRow key={skill.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{skill.skill_name}</TableCell>
                      <TableCell>{getStatusBadge(skill.status)}</TableCell>
                      <TableCell>
                        {new Date(skill.created_at).toLocaleDateString('en-AE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {skill.status === null && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSkillToDelete(skill)
                              setShowDeleteAlert(true)
                            }}
                            disabled={deletingId === skill.id}
                            className="hover:bg-red-100 hover:text-red-600"
                          >
                            {deletingId === skill.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Cancel Skill Request?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your request for <strong>{skillToDelete?.skill_name}</strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={!!deletingId}
              onClick={() => setSkillToDelete(null)}
            >
              Keep Request
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRequest}
              disabled={!!deletingId}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Request
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
