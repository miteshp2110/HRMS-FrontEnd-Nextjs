"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus } from "lucide-react"
import {
  type PayrollComponent,
  getPayrollComponents,
  createPayrollComponent,
  updatePayrollComponent,
  deletePayrollComponent,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function PayrollComponentsPage() {
  const [components, setComponents] = useState<PayrollComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingComponent, setEditingComponent] = useState<PayrollComponent | null>(null)
  const [formData, setFormData] = useState({ name: "", type: "earning" as "earning" | "deduction" })
  const { toast } = useToast()

  useEffect(() => {
    loadComponents()
  }, [])

  const loadComponents = async () => {
    try {
      setLoading(true)
      const data = await getPayrollComponents()
      setComponents(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payroll components",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingComponent) {
        await updatePayrollComponent(editingComponent.id, formData)
        toast({ title: "Success", description: "Component updated successfully" })
      } else {
        await createPayrollComponent(formData)
        toast({ title: "Success", description: "Component created successfully" })
      }
      setDialogOpen(false)
      setEditingComponent(null)
      setFormData({ name: "", type: "earning" })
      loadComponents()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save component",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (component: PayrollComponent) => {
    setEditingComponent(component)
    setFormData({ name: component.name, type: component.type })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this component?")) return

    try {
      await deletePayrollComponent(id)
      toast({ title: "Success", description: "Component deleted successfully" })
      loadComponents()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete component",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll Components</h1>
          <p className="text-muted-foreground">Manage salary components for payroll processing</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingComponent(null)
                setFormData({ name: "", type: "earning" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingComponent ? "Edit Component" : "Add New Component"}</DialogTitle>
              <DialogDescription>
                {editingComponent ? "Update the component details" : "Create a new payroll component"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Component Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Basic Salary, Medical Allowance"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Component Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "earning" | "deduction") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earning">Earning</SelectItem>
                      <SelectItem value="deduction">Deduction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingComponent ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Components Overview</CardTitle>
          <CardDescription>All payroll components used in salary calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.name}</TableCell>
                  <TableCell>
                    <Badge variant={component.type === "earning" ? "default" : "destructive"}>{component.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(component)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(component.id)}
                        disabled={component.name === "Basic Salary"}
                      >
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
    </div>
  )
}
