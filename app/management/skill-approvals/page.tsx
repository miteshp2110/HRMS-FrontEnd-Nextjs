

// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@/lib/auth-context";
// import { MainLayout } from "@/components/main-layout";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Award,
//   Search,
//   CheckCircle,
//   XCircle,
//   Clock,
//   AlertCircle,
// } from "lucide-react";
// import {
//   getPendingSkillApprovals,
//   approveSkillRequest,
//   type SkillApproval,
// } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { EmployeeSkillsDialog } from "@/components/management/employee-skills-dialog";
// import { SkillMatrixVisualization } from "@/components/management/skill-matrix-visualization"; // New import

// export default function SkillApprovalsPage() {
//   const { hasPermission } = useAuth();
//   const { toast } = useToast();
//   const [approvals, setApprovals] = useState<SkillApproval[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState<{
//     id: number;
//     name: string;
//   } | null>(null);

//   const canManageSkills = hasPermission("skills.manage");

//   const fetchApprovals = async () => {
//     if (!canManageSkills) {
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const data = await getPendingSkillApprovals();
//       setApprovals(data as SkillApproval[] | []);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: `Could not fetch skill approvals: ${error.message}`,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApprovals();
//   }, [canManageSkills]);

//   const handleApprovalUpdate = async (requestId: number, status: 0 | 1) => {
//     try {
//       await approveSkillRequest(requestId, status);
//       toast({
//         title: "Success",
//         description: `Request status has been updated.`,
//       });
//       fetchApprovals();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update skill approval.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleRowClick = (approval: SkillApproval) => {
//     setSelectedEmployee({
//       id: approval.employee_id,
//       name: `${approval.first_name} ${approval.last_name}`,
//     });
//     setIsSkillsDialogOpen(true);
//   };

//   const filteredApprovals = approvals.filter(
//     (approval) =>
//       `${approval.first_name} ${approval.last_name}`
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       approval.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex items-center gap-4">
//           <Award className="h-8 w-8" />
//           <h1 className="text-3xl font-bold">Skills Center</h1>
//         </div>

//         {!canManageSkills ? (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Access Denied</AlertTitle>
//             <AlertDescription>
//               You don't have permission to manage skill approvals.
//             </AlertDescription>
//           </Alert>
//         ) : (
//           <Tabs defaultValue="approvals">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
//               <TabsTrigger value="matrix">Skill Matrix</TabsTrigger>
//             </TabsList>
//             <TabsContent value="approvals" className="mt-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Pending Skill Requests</CardTitle>
//                   <CardDescription>
//                     Review and approve or reject employee skill requests. Click
//                     a row to view the employee's existing skills.
//                   </CardDescription>
//                   <div className="relative pt-4">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Search by employee name or skill..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   {loading ? (
//                     <div className="text-center py-8">
//                       Loading pending approvals...
//                     </div>
//                   ) : filteredApprovals.length === 0 ? (
//                     <div className="text-center py-12 text-muted-foreground">
//                       <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500" />
//                       <p>No pending skill approvals found. All caught up!</p>
//                     </div>
//                   ) : (
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Employee</TableHead>
//                           <TableHead>Skill Requested</TableHead>
//                           <TableHead>Requested On</TableHead>
//                           <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {filteredApprovals.map((approval) => (
//                           <TableRow
//                             key={approval.id}
//                             onClick={() => handleRowClick(approval)}
//                             className="cursor-pointer"
//                           >
//                             <TableCell className="font-medium">
//                               {approval.first_name} {approval.last_name}
//                             </TableCell>
//                             <TableCell>{approval.skill_name}</TableCell>
//                             <TableCell>
//                               {new Date(approval.created_at)
//                                 .toLocaleDateString("en-GB")
//                                 .replace(/\//g, "-")}
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <div
//                                 className="flex gap-2 justify-end"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   className="border-green-500 text-green-600 hover:bg-green-50"
//                                   onClick={() =>
//                                     handleApprovalUpdate(approval.id, 1)
//                                   }
//                                 >
//                                   <CheckCircle className="h-4 w-4 mr-2" />{" "}
//                                   Approve
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   className="border-red-500 text-red-600 hover:bg-red-50"
//                                   onClick={() =>
//                                     handleApprovalUpdate(approval.id, 0)
//                                   }
//                                 >
//                                   <XCircle className="h-4 w-4 mr-2" /> Reject
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             <TabsContent value="matrix" className="mt-6">
//                 <SkillMatrixVisualization />
//             </TabsContent>
//           </Tabs>
//         )}
//       </div>

//       <EmployeeSkillsDialog
//         employeeId={selectedEmployee?.id || null}
//         employeeName={selectedEmployee?.name || null}
//         open={isSkillsDialogOpen}
//         onOpenChange={setIsSkillsDialogOpen}
//       />
//     </MainLayout>
//   );
// }

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Eye,
  TrendingUp
} from "lucide-react"
import {
  getPendingSkillApprovals,
  approveSkillRequest,
  type SkillApproval,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { EmployeeSkillsDialog } from "@/components/management/employee-skills-dialog"
import { SkillMatrixVisualization } from "@/components/management/skill-matrix-visualization"

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-9 w-64" />
    </div>
  )
}

function TableSkeleton() {
  return (
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
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function SkillApprovalsPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const [approvals, setApprovals] = useState<SkillApproval[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set())
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: number
    name: string
  } | null>(null)

  const canManageSkills = hasPermission("skills.manage")

  const fetchApprovals = async () => {
    if (!canManageSkills) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await getPendingSkillApprovals()
      setApprovals(data as SkillApproval[] | [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Could not fetch skill approvals: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovals()
  }, [canManageSkills])

  const handleApprovalUpdate = async (requestId: number, status: 0 | 1) => {
    setProcessingIds(prev => new Set(prev).add(requestId))
    try {
      await approveSkillRequest(requestId, status)
      toast({
        title: "Success",
        description: status === 1 
          ? "Skill request has been approved successfully." 
          : "Skill request has been rejected.",
      })
      fetchApprovals()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill approval.",
        variant: "destructive",
      })
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  const handleRowClick = (approval: SkillApproval) => {
    setSelectedEmployee({
      id: approval.employee_id,
      name: `${approval.first_name} ${approval.last_name}`,
    })
    setIsSkillsDialogOpen(true)
  }

  const filteredApprovals = approvals.filter(
    (approval) =>
      `${approval.first_name} ${approval.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      approval.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <PageHeaderSkeleton />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="pt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </CardHeader>
            <CardContent>
              <TableSkeleton />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Skills Center</h1>
            <p className="text-muted-foreground">
              Manage employee skill approvals and view skill matrix
            </p>
          </div>
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
          <Tabs defaultValue="approvals">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="approvals" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger value="matrix" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Skill Matrix
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approvals" className="mt-6">
              {/* Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600">
                      {approvals.length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Unique Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {new Set(approvals.map(a => a.skill_name)).size}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Employees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {new Set(approvals.map(a => a.employee_id)).size}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Skill Requests</CardTitle>
                  <CardDescription>
                    Review and approve or reject employee skill requests. Click a row to view the employee's existing skills.
                  </CardDescription>
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
                  {filteredApprovals.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-green-100 dark:bg-green-950 rounded-full">
                          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? "No pending approvals match your search."
                          : "No pending skill approvals found."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
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
                            <TableRow
                              key={approval.id}
                              onClick={() => handleRowClick(approval)}
                              className="cursor-pointer hover:bg-muted/50"
                            >
                              <TableCell className="font-medium">
                                {approval.first_name} {approval.last_name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {approval.skill_name}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(approval.created_at).toLocaleDateString("en-AE", {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </TableCell>
                              <TableCell className="text-right">
                                <div
                                  className="flex gap-2 justify-end"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                                    onClick={() => handleApprovalUpdate(approval.id, 1)}
                                    disabled={processingIds.has(approval.id)}
                                  >
                                    {processingIds.has(approval.id) ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                    onClick={() => handleApprovalUpdate(approval.id, 0)}
                                    disabled={processingIds.has(approval.id)}
                                  >
                                    {processingIds.has(approval.id) ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <XCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="matrix" className="mt-6">
              <SkillMatrixVisualization />
            </TabsContent>
          </Tabs>
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
