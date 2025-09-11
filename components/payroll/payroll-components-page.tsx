"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit, Plus, Calculator, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import {
  type PayrollComponent,
  getPayrollComponents,
  createPayrollComponent,
  updatePayrollComponent,
  deletePayrollComponent,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { MainLayout } from "../main-layout"

export function PayrollComponentsPage() {
  const [components, setComponents] = useState<PayrollComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingComponent, setEditingComponent] = useState<PayrollComponent | null>(null)
  const [formData, setFormData] = useState({ name: "", type: "earning" as "earning" | "deduction" })
  const { toast } = useToast()
  const { hasPermission } = useAuth()

  const canManagePayroll = hasPermission("payroll.manage")

  const loadComponents = async () => {
    if (!canManagePayroll) { setLoading(false); return; }
    try {
      setLoading(true)
      const data = await getPayrollComponents()
      setComponents(data)
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to load payroll components: ${error.message}`, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadComponents()
  }, [canManagePayroll])

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
      loadComponents()
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to save component: ${error.message}`, variant: "destructive" })
    }
  }

  const handleEdit = (component: PayrollComponent) => {
    setEditingComponent(component)
    setFormData({ name: component.name, type: component.type })
    setDialogOpen(true)
  }
  
  const handleCreate = () => {
    setEditingComponent(null);
    setFormData({ name: "", type: "earning" });
    setDialogOpen(true);
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this component?")) return

    try {
      await deletePayrollComponent(id)
      toast({ title: "Success", description: "Component deleted successfully" })
      loadComponents()
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to delete component: ${error.message}`, variant: "destructive" })
    }
  }

  if (!canManagePayroll) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>You don't have permission to manage payroll components.</AlertDescription>
        </Alert>
    );
  }

  return (
    <MainLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
            <Calculator className="h-8 w-8"/>
            <div>
                <h1 className="text-3xl font-bold">Payroll Components</h1>
                <p className="text-muted-foreground">Manage salary components for payroll processing</p>
            </div>
        </div>
        <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Component
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Components Overview</CardTitle>
          <CardDescription>All payroll components used in salary calculations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> :
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
                    <Badge variant={component.type === "earning" ? "default" : "destructive"} className={component.type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {component.type === 'earning' ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                        {component.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(component)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(component.id)}
                        disabled={component.name === "Basic Salary"}
                        title={component.name === "Basic Salary" ? "Cannot delete the base component" : "Delete"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          }
        </CardContent>
      </Card>
      
       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingComponent ? "Edit Component" : "Add New Component"}</DialogTitle>
              <DialogDescription>
                {editingComponent ? "Update the component details" : "Create a new payroll component"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Component Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Medical Allowance"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Component Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "earning" | "deduction") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earning">Earning</SelectItem>
                      <SelectItem value="deduction">Deduction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingComponent ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
    </MainLayout>
  )
}