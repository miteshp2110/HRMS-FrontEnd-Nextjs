// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Plus, Edit, Trash2, Shield, AlertCircle } from "lucide-react"
// import {
//   getRoles,
//   getPermissions,
//   createRole,
//   updateRole,
//   deleteRole,
//   getRole,
//   updateRolePermissions,
//   type Role,
//   type Permission,
// } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// export function RolesPermissionsPage() {
//   const { hasPermission } = useAuth()
//   const { toast } = useToast()
//   const [roles, setRoles] = useState<Role[]>([])
//   const [permissions, setPermissions] = useState<Permission[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [createDialogOpen, setCreateDialogOpen] = useState(false)
//   const [editDialogOpen, setEditDialogOpen] = useState(false)
//   const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null)
//   const [selectedRolePermissions, setSelectedRolePermissions] = useState<number[]>([])

//   const canManageRoles = hasPermission("roles.manage")

//   const fetchAllData = async () => {
//     if (!canManageRoles) {
//       setIsLoading(false)
//       return
//     }
//     try {
//       setIsLoading(true)
//       const [rolesData, permissionsData] = await Promise.all([getRoles(), getPermissions()])
//       setRoles(rolesData)
//       setPermissions(permissionsData)
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to fetch roles and permissions.", variant: "destructive" })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAllData()
//   }, [canManageRoles])

//   const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     const name = formData.get("name") as string
//     const role_level = Number(formData.get("role_level"))

//     try {
//       await createRole({ name, role_level })
//       toast({ title: "Success", description: "Role created successfully." })
//       setCreateDialogOpen(false)
//       fetchAllData()
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to create role.", variant: "destructive" })
//     }
//   }

//   const handleEditRole = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (!selectedRole) return

//     const formData = new FormData(e.currentTarget)
//     const name = formData.get("name") as string
//     const role_level = Number(formData.get("role_level"))

//     try {
//       await updateRole(selectedRole.id, { name, role_level })
//       toast({ title: "Success", description: "Role updated successfully." })
//       setEditDialogOpen(false)
//       setSelectedRole(null)
//       fetchAllData()
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to update role.", variant: "destructive" })
//     }
//   }

//   const handleDeleteRole = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this role?")) return

//     try {
//       await deleteRole(id)
//       toast({ title: "Success", description: "Role deleted successfully." })
//       fetchAllData()
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to delete role.", variant: "destructive" })
//     }
//   }

//   const handleOpenManagePermissions = async (role: Role) => {
//     try {
//       const roleWithPermissions = await getRole(role.id)
//       setSelectedRole(roleWithPermissions)
//       setSelectedRolePermissions(roleWithPermissions.permissions?.map((p) => p.id) || [])
//       setPermissionsDialogOpen(true)
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to fetch role permissions.", variant: "destructive" })
//     }
//   }

//   const handleSavePermissions = async () => {
//     if (!selectedRole) return
//     try {
//       await updateRolePermissions(selectedRole.id, selectedRolePermissions)
//       toast({ title: "Success", description: "Permissions updated successfully." })
//       setPermissionsDialogOpen(false)
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to update permissions.", variant: "destructive" })
//     }
//   }

//   if (!canManageRoles) {
//     return (
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold">Roles & Permissions</h1>
//           <p className="text-muted-foreground">Manage system roles and their permissions</p>
//         </div>

//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>
//             You don't have permission to manage roles and permissions. Contact your administrator for access.
//           </AlertDescription>
//         </Alert>
//       </div>
//     )
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading roles and permissions...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Roles & Permissions</h1>
//           <p className="text-muted-foreground">Manage system roles and their permissions</p>
//         </div>
//         <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Create Role
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Create New Role</DialogTitle>
//               <DialogDescription>Add a new role to the system with a specific access level.</DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleCreateRole}>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="name">Role Name</Label>
//                   <Input id="name" name="name" required />
//                 </div>
//                 <div>
//                   <Label htmlFor="role_level">Role Level</Label>
//                   <Input id="role_level" name="role_level" type="number" min="1" max="100" required />
//                   <p className="text-xs text-muted-foreground">Lower numbers have higher priority (1 = highest)</p>
//                 </div>
//               </div>
//               <DialogFooter className="mt-6">
//                 <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">Create Role</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>System Roles</CardTitle>
//           <CardDescription>Manage roles and their hierarchy levels</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Role Name</TableHead>
//                 <TableHead>Level</TableHead>
//                 <TableHead>Priority</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {roles.map((role) => (
//                 <TableRow key={role.id}>
//                   <TableCell className="font-medium">{role.name}</TableCell>
//                   <TableCell>
//                     <Badge variant="outline">{role.role_level}</Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={role.role_level <= 3 ? "default" : role.role_level <= 7 ? "secondary" : "outline"}>
//                       {role.role_level <= 3 ? "High" : role.role_level <= 7 ? "Medium" : "Low"}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button variant="ghost" size="sm" onClick={() => handleOpenManagePermissions(role)}>
//                         <Shield className="h-4 w-4 mr-2" />
//                         Permissions
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           setSelectedRole(role)
//                           setEditDialogOpen(true)
//                         }}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)}>
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Edit Role Dialog */}
//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Role</DialogTitle>
//             <DialogDescription>Update the role name and level.</DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleEditRole}>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="edit-name">Role Name</Label>
//                 <Input id="edit-name" name="name" defaultValue={selectedRole?.name} required />
//               </div>
//               <div>
//                 <Label htmlFor="edit-role_level">Role Level</Label>
//                 <Input
//                   id="edit-role_level"
//                   name="role_level"
//                   type="number"
//                   min="1"
//                   max="100"
//                   defaultValue={selectedRole?.role_level}
//                   required
//                 />
//               </div>
//             </div>
//             <DialogFooter className="mt-6">
//               <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit">Update Role</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Permissions Dialog */}
//       <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Manage Permissions - {selectedRole?.name}</DialogTitle>
//             <DialogDescription>Select the permissions for this role.</DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 max-h-96 overflow-y-auto p-4 border rounded-md">
//             {permissions.map((permission) => (
//               <div key={permission.id} className="flex items-center space-x-3">
//                 <Checkbox
//                   id={`permission-${permission.id}`}
//                   checked={selectedRolePermissions.includes(permission.id)}
//                   onCheckedChange={(checked) => {
//                     setSelectedRolePermissions((prev) =>
//                       checked ? [...prev, permission.id] : prev.filter((id) => id !== permission.id)
//                     )
//                   }}
//                 />
//                 <Label htmlFor={`permission-${permission.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                   {permission.name}
//                 </Label>
//               </div>
//             ))}
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setPermissionsDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSavePermissions}>Save Permissions</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Shield, AlertCircle } from "lucide-react"
import {
  getRoles,
  getPermissions,
  createRole,
  updateRole,
  deleteRole,
  getRole,
  updateRolePermissions,
  type Role,
  type Permission,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { RoleHierarchyCanvas } from "./role-hierarchy-canvas" // Import the new component

export function RolesPermissionsPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<number[]>([])

  const canManageRoles = hasPermission("roles.manage")

  const fetchAllData = async () => {
    if (!canManageRoles) {
      setIsLoading(false)
      return
    }
    try {
      setIsLoading(true)
      const [basicRolesData, permissionsData] = await Promise.all([getRoles(), getPermissions()])
      
      // Fetch detailed data for each role to get its permissions for the hover effect
      const detailedRolesData = await Promise.all(
          basicRolesData.map(role => getRole(role.id))
      );

      setRoles(detailedRolesData)
      setPermissions(permissionsData)
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch roles and permissions.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [canManageRoles])

  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const role_level = Number(formData.get("role_level"))

    try {
      await createRole({ name, role_level })
      toast({ title: "Success", description: "Role created successfully." })
      setCreateDialogOpen(false)
      fetchAllData()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create role.", variant: "destructive" })
    }
  }

  const handleEditRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedRole) return

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const role_level = Number(formData.get("role_level"))

    try {
      await updateRole(selectedRole.id, { name, role_level })
      toast({ title: "Success", description: "Role updated successfully." })
      setEditDialogOpen(false)
      setSelectedRole(null)
      fetchAllData()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update role.", variant: "destructive" })
    }
  }

  const handleDeleteRole = async (id: number) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      await deleteRole(id)
      toast({ title: "Success", description: "Role deleted successfully." })
      fetchAllData()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete role.", variant: "destructive" })
    }
  }

  const handleOpenManagePermissions = (role: Role) => {
      setSelectedRole(role)
      setSelectedRolePermissions(role.permissions?.map((p) => p.id) || [])
      setPermissionsDialogOpen(true)
  }

  const handleSavePermissions = async () => {
    if (!selectedRole) return
    try {
      await updateRolePermissions(selectedRole.id, selectedRolePermissions)
      toast({ title: "Success", description: "Permissions updated successfully." })
      setPermissionsDialogOpen(false)
      fetchAllData() // Refetch to update hover data
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update permissions.", variant: "destructive" })
    }
  }

  if (!canManageRoles) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to manage roles and permissions.
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
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage system roles and their permissions</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>Add a new role to the system with a specific access level.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRole}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Role Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="role_level">Role Level</Label>
                  <Input id="role_level" name="role_level" type="number" min="1" max="100" required />
                  <p className="text-xs text-muted-foreground">Lower numbers have higher priority (1 = highest)</p>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Role</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* New Layout: Visualization is now the main focus */}
      <RoleHierarchyCanvas roles={roles} />

      <Card>
        <CardHeader>
        <CardTitle>Manage Roles</CardTitle>
        <CardDescription>Edit roles and manage their specific permissions from this table.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Permissions Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {roles.map((role) => (
                <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>
                    <Badge variant="outline">{role.role_level}</Badge>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary">{role.permissions?.length || 0} permissions</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenManagePermissions(role)}>
                        <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                        setSelectedRole(role)
                        setEditDialogOpen(true)
                        }}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)}>
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

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update the role name and level.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRole}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Role Name</Label>
                <Input id="edit-name" name="name" defaultValue={selectedRole?.name} required />
              </div>
              <div>
                <Label htmlFor="edit-role_level">Role Level</Label>
                <Input
                  id="edit-role_level"
                  name="role_level"
                  type="number"
                  min="1"
                  max="100"
                  defaultValue={selectedRole?.role_level}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update Role</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Permissions - {selectedRole?.name}</DialogTitle>
            <DialogDescription>Select the permissions for this role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto p-4 border rounded-md">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={selectedRolePermissions.includes(permission.id)}
                  onCheckedChange={(checked) => {
                    setSelectedRolePermissions((prev) =>
                      checked ? [...prev, permission.id] : prev.filter((id) => id !== permission.id)
                    )
                  }}
                />
                <Label htmlFor={`permission-${permission.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {permission.name}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPermissionsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePermissions}>Save Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}