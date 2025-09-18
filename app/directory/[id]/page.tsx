
"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { ProfileHeader } from "@/components/profile/profile-header"
import { PersonalDetailsTab } from "@/components/profile/personal-details-tab"
import { JobEmploymentTab } from "@/components/profile/job-employment-tab"
import { BankDetailsTab } from "@/components/profile/bank-details-tab"
import { DocumentsTab } from "@/components/profile/documents-tab"
import { SalaryStructureTab } from "@/components/profile/salary-structure-tab"
import { AttendanceHeatmap } from "@/components/profile/attendance-heatmap"
import { LoanHistoryTab } from "@/components/profile/loan-history-tab"
import { LeaveHistoryTab } from "@/components/profile/leave-history-tab"
import { EmployeeSkillsTab } from "@/components/profile/employee-skills-tab"
import { EmployeeExpensesTab } from "@/components/profile/employee-expenses-tab"
import { AuditHistoryDialog } from "@/components/profile/audit-history-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import {
  getDetailedUserProfile,
  updateUser,
  getBankDetails,
  getEmployeeDocuments,
  getSalaryStructure,
  getLoanHistory,
  getEmployeeLeaveBalance,
  getEmployeeLeaveRecords,
  getUserSkills,
  getExpenses,
  getUserAuditHistory,
  type DetailedUserProfile,
  type BankDetails,
  type EmployeeDocument,
  type SalaryComponent,
  type LoanRecord,
  type LeaveBalance,
  type LeaveRecord,
  type UserSkill,
  type ExpenseRecord,
  type UserAudit,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function EmployeeProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  const employeeId = Number(params.id)

  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [profile, setProfile] = useState<DetailedUserProfile | null>(null)
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null)
  const [documents, setDocuments] = useState<EmployeeDocument[]>([])
  const [salaryStructure, setSalaryStructure] = useState<SalaryComponent[]>([])
  const [loanHistory, setLoanHistory] = useState<LoanRecord[]>([])
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([])
  const [auditHistory, setAuditHistory] = useState<UserAudit[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingLeaves, setIsLoadingLeaves] = useState(false);
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [isAuditHistoryOpen, setIsAuditHistoryOpen] = useState(false);

  const canManageUsers = hasPermission("user.manage")
  const canViewPayroll = hasPermission("payroll.manage")
  const canManageExpense = hasPermission("expenses.manage")
  const canManageLoans = hasPermission("loans.manage")
  const canManageLeaves = hasPermission("leaves.manage")
  const canManageSkills = hasPermission("skills.manage")

  const fetchProfileData = useCallback(async () => {
      if (!canManageUsers) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const promises = [
          getDetailedUserProfile(employeeId),
          getBankDetails(employeeId),
          getEmployeeDocuments(employeeId),
          getLoanHistory(employeeId),
          getEmployeeLeaveBalance(employeeId),
          getEmployeeLeaveRecords(employeeId, firstDayOfMonth.toISOString().split('T')[0], today.toISOString().split('T')[0]),
          getUserSkills(employeeId),
          getExpenses(employeeId),
          getUserAuditHistory(employeeId),
        ];

        const results = await Promise.all(promises.map(p => p.catch(e => {
            console.error("API call failed:", e);
            toast({
                title: "Data Fetch Error",
                description: `Could not load some data. ${e.message}`,
                variant: "destructive"
            });
            return null;
        })));

        let salaryData: SalaryComponent[] | null = null;
        if (canViewPayroll) {
          try {
            salaryData = await getSalaryStructure(employeeId);
          } catch (e: any) {
            console.error("API call failed:", e);
            toast({
              title: "Data Fetch Error",
              description: `Could not load salary structure. ${e.message}`,
              variant: "destructive"
            });
          }
        }

        const [
          profileData, bankData, documentsData, loansData,
          leaveBalanceData, initialLeaveRecords, skillsData, expensesData, auditData
        ] = results;

        setProfile(profileData as DetailedUserProfile | null);
        setBankDetails(bankData as BankDetails | null);
        setDocuments(documentsData as EmployeeDocument[] || []);
        if(canManageLoans && loansData){
          setLoanHistory(loansData as LoanRecord[] || []);
        }
        if(canManageLeaves && leaveBalanceData){
          setLeaveBalances(leaveBalanceData as LeaveBalance[] || []);
        }
        if(canManageLeaves && initialLeaveRecords){
          setLeaveRecords(initialLeaveRecords as LeaveRecord[] || []);
        }
        if(canManageSkills && skillsData){
          setSkills(skillsData as UserSkill[] || []);
        }
        if(canManageExpense && expensesData){
          setExpenses(expensesData as ExpenseRecord[] || []);
        }
        if (auditData) {
            setAuditHistory(auditData as UserAudit[] || []);
        }
        if (canViewPayroll && salaryData) {
          setSalaryStructure(salaryData as SalaryComponent[]);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
        toast({ title: "Error", description: "Could not load employee profile.", variant: "destructive" })
        router.push('/directory');
      } finally {
        setIsLoading(false)
      }
  }, [employeeId, canManageUsers, canViewPayroll, toast, router]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const fetchLeaveRecordsForEmployee = useCallback(async (startDate?: string, endDate?: string) => {
    setIsLoadingLeaves(true);
    try {
        const records = await getEmployeeLeaveRecords(employeeId, startDate, endDate);
        setLeaveRecords(records);
    } catch (error: any) {
        toast({ title: "Error", description: `Could not fetch leave records: ${error.message}`, variant: "destructive" });
    } finally {
        setIsLoadingLeaves(false);
    }
  }, [employeeId, toast]);

  const handleToggleEdit = () => setIsEditing(prev => !prev);

  const handleSaveChanges = async (updatedData: Partial<DetailedUserProfile>) => {
    try {
        if(updatedData.inactive_reason==="@@##@@"){
          fetchProfileData()
        }
        else{
          await updateUser(employeeId, updatedData);
        toast({ title: "Success", description: "Profile updated successfully." });
        setIsEditing(false);
        fetchProfileData();
        }
        
    } catch(error: any) {
        toast({ title: "Update Failed", description: error.message || "Could not save changes.", variant: "destructive"});
    }
  }

  if (!canManageUsers) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to view employee profiles.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    )
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/directory"><ArrowLeft className="h-4 w-4 mr-2" />Back to Directory</Link>
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
             <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>Employee profile not found.</AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/directory"><ArrowLeft className="h-4 w-4 mr-2" />Back to Directory</Link>
        </Button>

        <ProfileHeader profile={profile} isEditing={isEditing} onToggleEdit={handleToggleEdit} onViewAuditHistory={() => setIsAuditHistoryOpen(true)} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            {canViewPayroll?<TabsTrigger value="salary">Salary</TabsTrigger>:<></>}
            {canManageLeaves?<TabsTrigger value="leaves">Leaves</TabsTrigger>:<></>}
            {canManageLoans?<TabsTrigger value="loans">Loans</TabsTrigger>:<></>}
            {canManageSkills?<TabsTrigger value="skills">Skills</TabsTrigger>:<></>}
            {canManageExpense ?<TabsTrigger value="expenses">Expenses</TabsTrigger>:<></>}
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
              <PersonalDetailsTab 
                profile={profile} 
                isEditing={isEditing}
                onSave={handleSaveChanges}
                onCancel={handleToggleEdit}
              />
          </TabsContent>
          <TabsContent value="employment">
              <JobEmploymentTab 
                profile={profile} 
                isEditing={isEditing}
                onSave={handleSaveChanges}
                onCancel={handleToggleEdit}
              />
          </TabsContent>
          <TabsContent value="bank"><BankDetailsTab bankDetails={bankDetails} isLoading={isLoading} employeeId={employeeId} onUpdate={fetchProfileData} /></TabsContent>
          <TabsContent value="documents"><DocumentsTab documents={documents} isLoading={isLoading} /></TabsContent>
          {canViewPayroll?<TabsContent value="salary"><SalaryStructureTab salaryStructure={salaryStructure} isLoading={isLoading} /></TabsContent>:<></>}
          <TabsContent value="leaves"><LeaveHistoryTab leaveBalances={leaveBalances} leaveRecords={leaveRecords} isLoading={isLoadingLeaves} onDateChange={fetchLeaveRecordsForEmployee} /></TabsContent>
          <TabsContent value="loans"><LoanHistoryTab loanHistory={loanHistory} isLoading={isLoading} /></TabsContent>
          <TabsContent value="skills"><EmployeeSkillsTab skills={skills} isLoading={isLoading} /></TabsContent>
          <TabsContent value="expenses"><EmployeeExpensesTab initialExpenses={expenses} employeeId={employeeId} isLoading={isLoading} /></TabsContent>
          <TabsContent value="attendance"><AttendanceHeatmap employeeId={employeeId} /></TabsContent>
        </Tabs>
      </div>
      <AuditHistoryDialog auditHistory={auditHistory} open={isAuditHistoryOpen} onOpenChange={setIsAuditHistoryOpen} />
    </MainLayout>
  )
}