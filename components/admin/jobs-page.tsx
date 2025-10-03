

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Briefcase, AlertCircle } from "lucide-react"
import { getJobs, createJob, updateJob, deleteJob, type Job } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { JobEmployeesDialog } from "./job-employees-dialog"

export function JobsPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [employeesDialogOpen, setEmployeesDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const canManageJobs = hasPermission("job.manage")

  const fetchJobs = async () => {
    if (!canManageJobs) {
      setIsLoading(false)
      return
    }
    try {
      const jobsData = await getJobs()
      setJobs(jobsData)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast({ title: "Error", description: "Failed to load job titles.", variant: "destructive" });
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [canManageJobs, toast])

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    try {
      await createJob({ title, description })
      toast({ title: "Success", description: "Job title created successfully." });
      setCreateDialogOpen(false)
      fetchJobs();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to create job: ${error.message}`, variant: "destructive" });
    }
  }

  const handleEditJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedJob) return

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    try {
      await updateJob(selectedJob.id, { title, description })
      toast({ title: "Success", description: "Job title updated successfully." });
      setEditDialogOpen(false)
      setSelectedJob(null)
      fetchJobs();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to update job: ${error.message}`, variant: "destructive" });
    }
  }

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job title?")) return

    try {
      await deleteJob(id)
      toast({ title: "Success", description: "Job title deleted successfully." });
      fetchJobs();
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to delete job: ${error.message}`, variant: "destructive" });
    }
  }

  const handleOpenEmployeesDialog = (job: Job) => {
      setSelectedJob(job);
      setEmployeesDialogOpen(true);
  }

  if (!canManageJobs) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to manage job titles.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Job Titles</h1>
          <p className="text-muted-foreground">Manage job titles and descriptions</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Job Title
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Job Title</DialogTitle>
              <DialogDescription>Add a new job title with description.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateJob}>
              <div className="space-y-4 py-4">
                <div><Label htmlFor="title">Job Title</Label><Input id="title" name="title" required /></div>
                <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={3} required /></div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Job Title</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Titles</CardTitle>
          <CardDescription>Manage available job titles in the organization. Click a title to see assigned employees.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <span className="cursor-pointer hover:underline" onClick={() => handleOpenEmployeesDialog(job)}>
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            {job.title}
                        </div>
                    </span>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-muted-foreground truncate">{job.description}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Job Title</DialogTitle>
            <DialogDescription>Update the job title and description.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditJob}>
            <div className="space-y-4 py-4">
              <div><Label htmlFor="edit-title">Job Title</Label><Input id="edit-title" name="title" defaultValue={selectedJob?.title} required /></div>
              <div><Label htmlFor="edit-description">Description</Label><Textarea id="edit-description" name="description" rows={3} defaultValue={selectedJob?.description} required/></div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update Job Title</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <JobEmployeesDialog
        job={selectedJob}
        open={employeesDialogOpen}
        onOpenChange={setEmployeesDialogOpen}
      />
    </div>
  )
}
