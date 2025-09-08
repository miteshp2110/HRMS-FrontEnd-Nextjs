// "use client"

// import { useState, useEffect } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { MainLayout } from "@/components/main-layout"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
// import { Award, Search, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
// import Link from "next/link"
// import { getPendingSkillApprovals, approveSkillRequest, type SkillApproval } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// export default function SkillApprovalsPage() {
//   const { hasPermission } = useAuth()
//   const { toast } = useToast()
//   const [approvals, setApprovals] = useState<SkillApproval[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")

//   const canManageSkills = hasPermission("skills.manage")

//   const fetchApprovals = async () => {
//     if (!canManageSkills) {
//         setLoading(false);
//         return;
//     }
//     try {
//       setLoading(true);
//       const data = await getPendingSkillApprovals()
//       setApprovals(data as SkillApproval[] | []);
//     } catch (error: any) {
//       toast({ title: "Error", description: `Could not fetch skill approvals: ${error.message}`, variant: "destructive" });
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchApprovals()
//   }, [canManageSkills])

//   const handleApprovalUpdate = async (requestId: number, status: 0 | 1) => {
//     try {
//       await approveSkillRequest(requestId, status)
//       toast({ title: "Success", description: `Request status has been updated.` });
//       fetchApprovals() // Refresh the list
//     } catch (error: any) {
//       toast({ title: "Error", description: error.message || "Failed to update skill approval.", variant: "destructive" });
//     }
//   }

//   const filteredApprovals = approvals.filter(
//     (approval) =>
//       `${approval.first_name} ${approval.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       approval.skill_name.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   return (
//     <MainLayout>
//         <div className="space-y-6">
//             <div className="flex items-center gap-4">
//                 <Award className="h-8 w-8" />
//                 <h1 className="text-3xl font-bold">Skill Approvals</h1>
//             </div>

//             {!canManageSkills ? (
//                  <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Access Denied</AlertTitle>
//                     <AlertDescription>
//                     You don't have permission to manage skill approvals.
//                     </AlertDescription>
//                 </Alert>
//             ) : (
//                 <Card>
//                     <CardHeader>
//                     <CardTitle>Pending Skill Requests</CardTitle>
//                     <CardDescription>Review and approve or reject employee skill requests.</CardDescription>
//                     <div className="relative pt-4">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                         <Input
//                         placeholder="Search by employee name or skill..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="pl-10"
//                         />
//                     </div>
//                     </CardHeader>
//                     <CardContent>
//                     {loading ? (
//                         <div className="text-center py-8">Loading pending approvals...</div>
//                     ) : filteredApprovals.length === 0 ? (
//                         <div className="text-center py-12 text-muted-foreground">
//                             <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500"/>
//                             <p>No pending skill approvals found. All caught up!</p>
//                         </div>
//                     ) : (
//                         <Table>
//                         <TableHeader>
//                             <TableRow>
//                             <TableHead>Employee</TableHead>
//                             <TableHead>Skill</TableHead>
//                             <TableHead>Requested On</TableHead>
//                             <TableHead className="text-right">Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {filteredApprovals.map((approval) => (
//                             <TableRow key={approval.id}>
//                                 <TableCell>
//                                 <Link href={`/directory/${approval.employee_id}`} className="font-medium text-primary hover:underline">
//                                     {approval.first_name} {approval.last_name}
//                                 </Link>
//                                 </TableCell>
//                                 <TableCell>{approval.skill_name}</TableCell>
//                                 <TableCell>{new Date(approval.created_at).toLocaleDateString()}</TableCell>
//                                 <TableCell className="text-right">
//                                     <div className="flex gap-2 justify-end">
//                                     <Button
//                                         size="sm"
//                                         variant="outline"
//                                         className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
//                                         onClick={() => handleApprovalUpdate(approval.id, 1)}
//                                     >
//                                         <CheckCircle className="h-4 w-4 mr-2" /> Approve
//                                     </Button>
//                                     <Button
//                                         size="sm"
//                                         variant="outline"
//                                         className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
//                                         onClick={() => handleApprovalUpdate(approval.id, 0)}
//                                     >
//                                         <XCircle className="h-4 w-4 mr-2" /> Reject
//                                     </Button>
//                                     </div>
//                                 </TableCell>
//                             </TableRow>
//                             ))}
//                         </TableBody>
//                         </Table>
//                     )}
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     </MainLayout>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Award, Search, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import { getPendingSkillApprovals, approveSkillRequest, type SkillApproval } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { EmployeeSkillsDialog } from "@/components/management/employee-skills-dialog" // Import the new dialog

export default function SkillApprovalsPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [approvals, setApprovals] = useState<SkillApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // State for the new dialog
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: number; name: string } | null>(null);


  const canManageSkills = hasPermission("skills.manage")

  const fetchApprovals = async () => {
    if (!canManageSkills) {
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      const data = await getPendingSkillApprovals()
      setApprovals(data as SkillApproval[] | []);
    } catch (error: any) {
      toast({ title: "Error", description: `Could not fetch skill approvals: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovals()
  }, [canManageSkills])

  const handleApprovalUpdate = async (requestId: number, status: 0 | 1) => {
    try {
      await approveSkillRequest(requestId, status)
      toast({ title: "Success", description: `Request status has been updated.` });
      fetchApprovals()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update skill approval.", variant: "destructive" });
    }
  }

  const handleRowClick = (approval: SkillApproval) => {
    setSelectedEmployee({ id: approval.employee_id, name: `${approval.first_name} ${approval.last_name}` });
    setIsSkillsDialogOpen(true);
  }

  const filteredApprovals = approvals.filter(
    (approval) =>
      `${approval.first_name} ${approval.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.skill_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <MainLayout>
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Award className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Skill Approvals</h1>
            </div>

            {!canManageSkills ? (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                    You don't have permission to manage skill approvals.
                    </AlertDescription>
                </Alert>
            ) : (
                <Card>
                    <CardHeader>
                    <CardTitle>Pending Skill Requests</CardTitle>
                    <CardDescription>Review and approve or reject employee skill requests. Click a row to view the employee's existing skills.</CardDescription>
                    <div className="relative pt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                        placeholder="Search by employee name or skill..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        />
                    </div>
                    </CardHeader>
                    <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading pending approvals...</div>
                    ) : filteredApprovals.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500"/>
                            <p>No pending skill approvals found. All caught up!</p>
                        </div>
                    ) : (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Skill Requested</TableHead>
                            <TableHead>Requested On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApprovals.map((approval) => (
                            <TableRow key={approval.id} onClick={() => handleRowClick(approval)} className="cursor-pointer">
                                <TableCell className="font-medium">
                                    {approval.first_name} {approval.last_name}
                                </TableCell>
                                <TableCell>{approval.skill_name}</TableCell>
                                <TableCell>{new Date(approval.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                                        onClick={() => handleApprovalUpdate(approval.id, 1)}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={() => handleApprovalUpdate(approval.id, 0)}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" /> Reject
                                    </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    )}
                    </CardContent>
                </Card>
            )}
        </div>

        <EmployeeSkillsDialog
            employeeId={selectedEmployee?.id || null}
            employeeName={selectedEmployee?.name || null}
            open={isSkillsDialogOpen}
            onOpenChange={setIsSkillsDialogOpen}
        />
    </MainLayout>
  )
}