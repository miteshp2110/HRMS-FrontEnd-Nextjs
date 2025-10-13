

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
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Plus, Edit, Trash2, Shield, AlertCircle, Users } from "lucide-react"
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
// import { RoleHierarchyCanvas } from "./role-hierarchy-canvas"
// import { RoleEmployeesDialog } from "./role-employees-dialog"

// export function RolesPermissionsPage() {
//   const { hasPermission } = useAuth()
//   const { toast } = useToast()
//   const [roles, setRoles] = useState<Role[]>([])
//   const [permissions, setPermissions] = useState<Permission[]>([])
//   const [isLoading, setIsLoading] = useState(true)
  
//   const [createDialogOpen, setCreateDialogOpen] = useState(false)
//   const [editDialogOpen, setEditDialogOpen] = useState(false)
//   const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
//   const [employeesDialogOpen, setEmployeesDialogOpen] = useState(false)
  
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null)
//   const [selectedRolePermissions, setSelectedRolePermissions] = useState<number[]>([])

//   const canManageRoles = hasPermission("roles.manage")

//   const fetchAllData = async () => {
//     if (!canManageRoles) { setIsLoading(false); return }
//     try {
//       setIsLoading(true)
//       const [basicRolesData, permissionsData] = await Promise.all([getRoles(), getPermissions()])
//       const detailedRolesData = await Promise.all(
//           basicRolesData.map(role => getRole(role.id))
//       );
//       setRoles(detailedRolesData)
//       setPermissions(permissionsData)
//     } catch (error: any) {
//       toast({ title: "Error", description: `Failed to fetch roles and permissions: ${error.message}`, variant: "destructive" })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAllData()
//   }, [canManageRoles, toast])

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

//   const handleOpenManagePermissions = (role: Role) => {
//       setSelectedRole(role)
//       setSelectedRolePermissions(role.permissions?.map((p) => p.id) || [])
//       setPermissionsDialogOpen(true)
//   }
  
//   const handleOpenEmployeesDialog = (role: Role) => {
//       setSelectedRole(role);
//       setEmployeesDialogOpen(true);
//   }

//   const handleSavePermissions = async () => {
//     if (!selectedRole) return
//     try {
//       await updateRolePermissions(selectedRole.id, selectedRolePermissions)
//       toast({ title: "Success", description: "Permissions updated successfully." })
//       setPermissionsDialogOpen(false)
//       fetchAllData()
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to update permissions.", variant: "destructive" })
//     }
//   }

//   if (!canManageRoles) {
//     return ( <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Access Denied</AlertTitle><AlertDescription>You don't have permission to manage roles and permissions.</AlertDescription></Alert> )
//   }

//   if (isLoading) {
//     return ( <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div> )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Roles & Permissions</h1>
//           <p className="text-muted-foreground">Manage system roles and their permissions</p>
//         </div>
//         <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
//           <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Create Role</Button></DialogTrigger>
//           <DialogContent>
//             <DialogHeader><DialogTitle>Create New Role</DialogTitle><DialogDescription>Add a new role to the system with a specific access level.</DialogDescription></DialogHeader>
//             <form onSubmit={handleCreateRole} className="space-y-4 py-4">
//                 <div><Label htmlFor="name">Role Name</Label><Input id="name" name="name" required /></div>
//                 <div><Label htmlFor="role_level">Role Level</Label><Input id="role_level" name="role_level" type="number" min="1" max="100" required /><p className="text-xs text-muted-foreground">Lower numbers have higher priority (1 = highest)</p></div>
//                 <DialogFooter className="mt-6"><Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button><Button type="submit">Create Role</Button></DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>
      
//         <RoleHierarchyCanvas roles={roles} />    

//       <Card>
//         <CardHeader><CardTitle>Manage Roles</CardTitle><CardDescription>Click a role name to see assigned employees. Use actions to manage roles.</CardDescription></CardHeader>
//         <CardContent>
//         <Table>
//             <TableHeader><TableRow><TableHead>Role Name</TableHead><TableHead>Level</TableHead><TableHead>Permissions Count</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
//             <TableBody>
//             {roles.map((role) => (
//                 <TableRow key={role.id}>
//                 <TableCell className="font-medium">
//                     <span className="cursor-pointer hover:underline" onClick={() => handleOpenEmployeesDialog(role)}>
//                         {role.name}
//                     </span>
//                 </TableCell>
//                 <TableCell><Badge variant="outline">{role.role_level}</Badge></TableCell>
//                 <TableCell><Badge variant="secondary">{role.permissions?.length || 0} permissions</Badge></TableCell>
//                 <TableCell className="text-right">
//                     <div className="flex justify-end gap-1">
//                         <Button variant="ghost" size="sm" onClick={() => handleOpenManagePermissions(role)} title="Manage Permissions"><Shield className="h-4 w-4" /></Button>
//                         <Button variant="ghost" size="sm" onClick={() => { setSelectedRole(role); setEditDialogOpen(true); }} title="Edit Role"><Edit className="h-4 w-4" /></Button>
//                         <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)} title="Delete Role"><Trash2 className="h-4 w-4" /></Button>
//                     </div>
//                 </TableCell>
//                 </TableRow>
//             ))}
//             </TableBody>
//         </Table>
//         </CardContent>
//     </Card>

//       <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//         <DialogContent>
//             <DialogHeader><DialogTitle>Edit Role</DialogTitle><DialogDescription>Update the role name and level.</DialogDescription></DialogHeader>
//             <form onSubmit={handleEditRole} className="space-y-4 py-4">
//                 <div><Label htmlFor="edit-name">Role Name</Label><Input id="edit-name" name="name" defaultValue={selectedRole?.name} required /></div>
//                 <div><Label htmlFor="edit-role_level">Role Level</Label><Input id="edit-role_level" name="role_level" type="number" min="1" max="100" defaultValue={selectedRole?.role_level} required /></div>
//                 <DialogFooter className="mt-6"><Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button><Button type="submit">Update Role</Button></DialogFooter>
//             </form>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
//        <DialogContent className="max-w-2xl">
//          <DialogHeader><DialogTitle>Manage Permissions - {selectedRole?.name}</DialogTitle><DialogDescription>Select the permissions for this role.</DialogDescription></DialogHeader>
//          <div className="space-y-4 max-h-96 overflow-y-auto p-4 border rounded-md">
//            {permissions.map((permission) => (
//              <div key={permission.id} className="flex items-center space-x-3">
//                <Checkbox
//                  id={`permission-${permission.id}`}
//                  checked={selectedRolePermissions.includes(permission.id)}
//                  onCheckedChange={(checked) => {
//                    setSelectedRolePermissions((prev) =>
//                      checked ? [...prev, permission.id] : prev.filter((id) => id !== permission.id)
//                    )
//                  }}
//                />
//                <Label htmlFor={`permission-${permission.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                  {permission.name}
//                </Label>
//              </div>
//            ))}
//          </div>
//          <DialogFooter><Button type="button" variant="outline" onClick={() => setPermissionsDialogOpen(false)}>Cancel</Button><Button onClick={handleSavePermissions}>Save Permissions</Button></DialogFooter>
//        </DialogContent>
//       </Dialog>

//       <RoleEmployeesDialog 
//         role={selectedRole}
//         open={employeesDialogOpen}
//         onOpenChange={setEmployeesDialogOpen}
//       />
//     </div>
//   )
// }




"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Shield, AlertCircle, Users, Clock } from "lucide-react";
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
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { RoleHierarchyCanvas } from "./role-hierarchy-canvas";
import { RoleEmployeesDialog } from "./role-employees-dialog";

export function RolesPermissionsPage() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [employeesDialogOpen, setEmployeesDialogOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<number[]>([]);

  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isSubmittingPermissions, setIsSubmittingPermissions] = useState(false);

  const canManageRoles = hasPermission("roles.manage");

  const fetchAllData = async () => {
    if (!canManageRoles) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const [basicRolesData, permissionsData] = await Promise.all([getRoles(), getPermissions()]);
      const detailedRolesData = await Promise.all(basicRolesData.map((role) => getRole(role.id)));
      setRoles(detailedRolesData);
      setPermissions(permissionsData);
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to fetch roles and permissions: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [canManageRoles, toast]);

  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingCreate(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const role_level = Number(formData.get("role_level"));
    try {
      await createRole({ name, role_level });
      toast({ title: "Success", description: "Role created successfully." });
      setCreateDialogOpen(false);
      fetchAllData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create role.", variant: "destructive" });
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  const handleEditRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsSubmittingEdit(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const role_level = Number(formData.get("role_level"));
    try {
      await updateRole(selectedRole.id, { name, role_level });
      toast({ title: "Success", description: "Role updated successfully." });
      setEditDialogOpen(false);
      setSelectedRole(null);
      fetchAllData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update role.", variant: "destructive" });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id);
      toast({ title: "Success", description: "Role deleted successfully." });
      fetchAllData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete role.", variant: "destructive" });
    }
  };

  const handleOpenManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setSelectedRolePermissions(role.permissions?.map((p) => p.id) || []);
    setPermissionsDialogOpen(true);
  };

  const handleOpenEmployeesDialog = (role: Role) => {
    setSelectedRole(role);
    setEmployeesDialogOpen(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setIsSubmittingPermissions(true);
    try {
      await updateRolePermissions(selectedRole.id, selectedRolePermissions);
      toast({ title: "Success", description: "Permissions updated successfully." });
      setPermissionsDialogOpen(false);
      fetchAllData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update permissions.", variant: "destructive" });
    } finally {
      setIsSubmittingPermissions(false);
    }
  };

  if (!canManageRoles) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You don't have permission to manage roles and permissions.</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4">
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>Add a new role to the system with a specific access level.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRole} className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="role_level">Role Level</Label>
                <Input id="role_level" name="role_level" type="number" min="1" max="100" required />
                <p className="text-xs text-muted-foreground">Lower numbers have higher priority (1 = highest)</p>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingCreate}>
                  {isSubmittingCreate && <Clock className="h-4 w-4 animate-spin mr-2" />}
                  Create Role
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <RoleHierarchyCanvas roles={roles} />

      <Card>
        <CardHeader>
          <CardTitle>Manage Roles</CardTitle>
          <CardDescription>Click a role name to see assigned employees. Use actions to manage roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                    <TableCell className="font-medium">
                      <span className="cursor-pointer hover:underline" onClick={() => handleOpenEmployeesDialog(role)}>
                        {role.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.role_level}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.permissions?.length || 0} permissions</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenManagePermissions(role)} title="Manage Permissions">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRole(role);
                            setEditDialogOpen(true);
                          }}
                          title="Edit Role"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)} title="Delete Role">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update the role name and level.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRole} className="space-y-4 py-4">
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
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingEdit}>
                {isSubmittingEdit && <Clock className="h-4 w-4 animate-spin mr-2" />}
                Update Role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                    );
                  }}
                />
                <Label
                  htmlFor={`permission-${permission.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {permission.name}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={isSubmittingPermissions}>
              {isSubmittingPermissions && <Clock className="h-4 w-4 animate-spin mr-2" />}
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RoleEmployeesDialog role={selectedRole} open={employeesDialogOpen} onOpenChange={setEmployeesDialogOpen} />
    </div>
  );
}
