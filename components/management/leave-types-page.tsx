"use client"

import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Edit, Trash2, CalendarPlus, AlertCircle, Check, X } from "lucide-react"
import { getLeaveTypes, createLeaveType, updateLeaveType, deleteLeaveType, type LeaveType } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function LeaveTypesPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [leaveTypes, setLeaveTypes] = React.useState<LeaveType[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingType, setEditingType] = React.useState<LeaveType | null>(null)
  
  // State for the form, including new accrual fields
  const [formData, setFormData] = React.useState({
      name: "",
      description: "",
      initial_balance: 0,
      accurable: false,
      accural_rate: 0,
      max_balance: 0,
  });


  const canManageLeaves = hasPermission("leaves.manage")

  const fetchLeaveTypes = async () => {
    if (!canManageLeaves) {
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true)
      const data = await getLeaveTypes()
      setLeaveTypes(data)
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to fetch leave types: ${error.message}`, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchLeaveTypes()
  }, [canManageLeaves])
  
  const handleOpenDialog = (leaveType: LeaveType | null = null) => {
    setEditingType(leaveType);
    if (leaveType) {
        setFormData({
            name: leaveType.name,
            description: leaveType.description,
            initial_balance: leaveType.initial_balance,
            accurable: leaveType.accurable,
            accural_rate: leaveType.accural_rate,
            max_balance: leaveType.max_balance,
        });
    } else {
        setFormData({ name: "", description: "", initial_balance: 0, accurable: false, accural_rate: 0, max_balance: 0 });
    }
    setIsDialogOpen(true);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Construct data object from state
    const dataToSubmit = {
        ...formData,
        accural_rate: formData.accurable ? formData.accural_rate : 0, // Ensure rate is 0 if not accruable
    };

    try {
      if (editingType) {
        await updateLeaveType(editingType.id, dataToSubmit)
        toast({ title: "Success", description: "Leave type updated successfully." })
      } else {
        await createLeaveType(dataToSubmit)
        toast({ title: "Success", description: "Leave type created successfully." })
      }
      setIsDialogOpen(false)
      setEditingType(null)
      fetchLeaveTypes()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save leave type.", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this leave type?")) return

    try {
      await deleteLeaveType(id)
      toast({ title: "Success", description: "Leave type deleted successfully." })
      fetchLeaveTypes()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete leave type.", variant: "destructive" })
    }
  }

  if (!canManageLeaves) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to manage leave types.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Leave Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Leave Types</CardTitle>
          <CardDescription>Manage the types of leave employees can request.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-center py-8">Loading...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Balance (Days)</TableHead>
                  <TableHead>Accruable</TableHead>
                  <TableHead>Monthly Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.initial_balance}</TableCell>
                    <TableCell>
                        {type.accurable ? <Check className="h-5 w-5 text-green-500"/> : <X className="h-5 w-5 text-muted-foreground"/>}
                    </TableCell>
                    <TableCell>{type.accurable ? `${type.accural_rate} days` : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(type)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(type.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{editingType ? 'Edit Leave Type' : 'Create New Leave Type'}</DialogTitle>
                  <DialogDescription>
                      {editingType ? 'Update the details for this leave type.' : 'Define a new type of leave for your organization.'}
                  </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div>
                      <Label htmlFor="name">Leave Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                   <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                  </div>
                   <div>
                      <Label htmlFor="initial_balance">Initial Balance (Days)</Label>
                      <Input id="initial_balance" name="initial_balance" type="number" value={formData.initial_balance} onChange={(e) => setFormData({...formData, initial_balance: Number(e.target.value)})} required />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                          <Label htmlFor="accurable">Accruable Leave</Label>
                          <p className="text-xs text-muted-foreground">Do employees earn this leave over time?</p>
                      </div>
                      <Switch id="accurable" checked={formData.accurable} onCheckedChange={(checked) => setFormData({...formData, accurable: checked})} />
                  </div>
                  {formData.accurable && (
                    <div className="space-y-2 pl-2 border-l-2 ml-6">
                        <div>
                            <Label htmlFor="accural_rate">Monthly Accrual Rate (Days)</Label>
                            <Input id="accural_rate" name="accural_rate" type="number" step="0.5" value={formData.accural_rate} onChange={(e) => setFormData({...formData, accural_rate: Number(e.target.value)})} />
                        </div>
                        <div>
                            <Label htmlFor="max_balance">Maximum Accrual Balance</Label>
                            <Input id="max_balance" name="max_balance" type="number" value={formData.max_balance} onChange={(e) => setFormData({...formData, max_balance: Number(e.target.value)})} />
                        </div>
                    </div>
                  )}
                  <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">{editingType ? 'Save Changes' : 'Create Type'}</Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </div>
  )
}