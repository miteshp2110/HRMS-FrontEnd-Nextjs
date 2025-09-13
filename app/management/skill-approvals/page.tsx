"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { MainLayout } from "@/components/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import {
  getPendingSkillApprovals,
  approveSkillRequest,
  getSkills,
  getEmployeesBySkill,
  type SkillApproval,
  type Skill,
  type SkilledEmployee,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { EmployeeSkillsDialog } from "@/components/management/employee-skills-dialog";
import Link from "next/link";

// --- Sub-component for the Skill Matrix Tab ---
const SkillMatrixView = () => {
  const { toast } = useToast();
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [skilledEmployees, setSkilledEmployees] = useState<SkilledEmployee[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSkills()
      .then(setAllSkills)
      .catch((err) => {
        toast({
          title: "Error",
          description: "Could not load the skills library.",
          variant: "destructive",
        });
      });
  }, [toast]);

  useEffect(() => {
    if (selectedSkill) {
      setIsLoading(true);
      getEmployeesBySkill(selectedSkill)
        .then(setSkilledEmployees)
        .catch((err) =>
          toast({
            title: "Error",
            description: `Could not load employees for ${selectedSkill}.`,
            variant: "destructive",
          })
        )
        .finally(() => setIsLoading(false));
    }
  }, [selectedSkill, toast]);

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Matrix</CardTitle>
        <CardDescription>
          Select a skill to see which employees have been approved for it.
        </CardDescription>
        <div className="pt-4">
          <Select onValueChange={setSelectedSkill}>
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Select a skill to view employees..." />
            </SelectTrigger>
            <SelectContent>
              {allSkills.map((skill) => (
                <SelectItem key={skill.id} value={skill.skill_name}>
                  {skill.skill_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading skilled employees...</div>
        ) : !selectedSkill ? (
          <div className="text-center py-12 text-muted-foreground">
            <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            Please select a skill to begin.
          </div>
        ) : skilledEmployees.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            No employees have this skill verified yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skilledEmployees.map((emp) => (
              <Card key={emp.employee_id}>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarFallback>
                      {getInitials(emp.employee_name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{emp.employee_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Approved by {emp.approved_by_name || "N/A"}
                  </p>
                  <Button variant="ghost" size="sm" className="mt-4" asChild>
                    <Link href={`/directory/${emp.employee_id}`}>
                      View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Main Page Component ---
export default function SkillApprovalsPage() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [approvals, setApprovals] = useState<SkillApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const canManageSkills = hasPermission("skills.manage");

  const fetchApprovals = async () => {
    if (!canManageSkills) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getPendingSkillApprovals();
      setApprovals(data as SkillApproval[] | []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Could not fetch skill approvals: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [canManageSkills]);

  const handleApprovalUpdate = async (requestId: number, status: 0 | 1) => {
    try {
      await approveSkillRequest(requestId, status);
      toast({
        title: "Success",
        description: `Request status has been updated.`,
      });
      fetchApprovals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill approval.",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (approval: SkillApproval) => {
    setSelectedEmployee({
      id: approval.employee_id,
      name: `${approval.first_name} ${approval.last_name}`,
    });
    setIsSkillsDialogOpen(true);
  };

  const filteredApprovals = approvals.filter(
    (approval) =>
      `${approval.first_name} ${approval.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      approval.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Award className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Skills Center</h1>
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
              <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
              <TabsTrigger value="matrix">Skill Matrix</TabsTrigger>
            </TabsList>
            <TabsContent value="approvals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Skill Requests</CardTitle>
                  <CardDescription>
                    Review and approve or reject employee skill requests. Click
                    a row to view the employee's existing skills.
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
                  {loading ? (
                    <div className="text-center py-8">
                      Loading pending approvals...
                    </div>
                  ) : filteredApprovals.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500" />
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
                          <TableRow
                            key={approval.id}
                            onClick={() => handleRowClick(approval)}
                            className="cursor-pointer"
                          >
                            <TableCell className="font-medium">
                              {approval.first_name} {approval.last_name}
                            </TableCell>
                            <TableCell>{approval.skill_name}</TableCell>
                            <TableCell>
                              {new Date(approval.created_at)
                                .toLocaleDateString("en-GB")
                                .replace(/\//g, "-")}
                            </TableCell>
                            <TableCell className="text-right">
                              <div
                                className="flex gap-2 justify-end"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-500 text-green-600 hover:bg-green-50"
                                  onClick={() =>
                                    handleApprovalUpdate(approval.id, 1)
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />{" "}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-600 hover:bg-red-50"
                                  onClick={() =>
                                    handleApprovalUpdate(approval.id, 0)
                                  }
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
            </TabsContent>
            <TabsContent value="matrix" className="mt-6">
              <SkillMatrixView />
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
  );
}
