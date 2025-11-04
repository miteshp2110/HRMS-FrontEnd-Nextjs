
// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Plus, Users, Edit } from "lucide-react";
// import { getPayrollGroups, type PayrollGroup } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { PayrollGroupDialog } from "@/components/payroll/PayrollGroupDialog";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function PayrollGroupsPage() {
//   const { toast } = useToast();
//   const [groups, setGroups] = React.useState<PayrollGroup[]>([]);
//   const [isLoading, setIsLoading] = React.useState(true);
//   const [isDialogOpen, setIsDialogOpen] = React.useState(false);
//   const [editingGroupId, setEditingGroupId] = React.useState<number | null>(null);

//   const fetchData = React.useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const data = await getPayrollGroups();
//       setGroups(data);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: "Could not load payroll groups.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [toast]);

//   React.useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleOpenDialog = (groupId: number | null = null) => {
//     setEditingGroupId(groupId);
//     setIsDialogOpen(true);
//   };

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <Users className="h-8 w-8" />
//             <div>
//               <h1 className="text-3xl font-bold">
//                 {isLoading ? <Skeleton className="h-8 w-48" /> : "Payroll Groups"}
//               </h1>
//               <p className="text-muted-foreground">
//                 {isLoading ? <Skeleton className="h-4 w-64 mt-1" /> : "Group salary components for sequential payroll execution."}
//               </p>
//             </div>
//           </div>
//           <Button onClick={() => handleOpenDialog()} disabled={isLoading}>
//             <Plus className="h-4 w-4 mr-2" />
//             Create New Group
//           </Button>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>All Groups</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Group Name</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Components</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading
//                   ? Array.from({ length: 5 }).map((_, idx) => (
//                       <TableRow key={idx}>
//                         <TableCell>
//                           <Skeleton className="h-4 w-32" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-4 w-48" />
//                         </TableCell>
//                         <TableCell>
//                           <Skeleton className="h-4 w-12" />
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <Skeleton className="h-4 w-4 inline-block" />
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   : groups.map((group) => (
//                       <TableRow key={group.id}>
//                         <TableCell>{group.group_name}</TableCell>
//                         <TableCell>{group.description}</TableCell>
//                         <TableCell>{group.component_count}</TableCell>
//                         <TableCell className="text-right">
//                           <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(group.id)}>
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>

//       <PayrollGroupDialog
//         open={isDialogOpen}
//         onOpenChange={setIsDialogOpen}
//         onSuccess={fetchData}
//         groupId={editingGroupId}
//       />
//     </MainLayout>
// );
// }



"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Users, Edit } from "lucide-react";
import { getPayrollGroups, type PayrollGroup } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { PayrollGroupDialog } from "@/components/payroll/PayrollGroupDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function PayrollGroupsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = React.useState<PayrollGroup[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingGroupId, setEditingGroupId] = React.useState<number | null>(null);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPayrollGroups();
      setGroups(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not load payroll groups.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDialog = (groupId: number | null = null) => {
    setEditingGroupId(groupId);
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-48" /> : "Payroll Groups"}
              </h1>
              <p className="text-muted-foreground">
                {isLoading ? <Skeleton className="h-4 w-64 mt-1" /> : "Group salary components for sequential payroll execution."}
              </p>
            </div>
          </div>
          <Button onClick={() => handleOpenDialog()} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Group
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Groups</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-4 inline-block" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No payroll groups found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first payroll group to organize salary components for efficient processing.
                </p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Group
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>{group.group_name}</TableCell>
                      <TableCell>{group.description}</TableCell>
                      <TableCell>{group.component_count}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(group.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <PayrollGroupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchData}
        groupId={editingGroupId}
      />
    </MainLayout>
  );
}
