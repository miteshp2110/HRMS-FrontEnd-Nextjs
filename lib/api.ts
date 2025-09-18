// In a real application, these would make actual HTTP requests

import { API_CONFIG, ApiError, apiRequest } from "./config"

export interface LoanRepayment {
  id: number;
  loan_id: number;
  payslip_id: number;
  repayment_amount: number;
  repayment_date: string;
  created_at: string;
}


export interface LeaveBalance {
  id: number
  leave_type_name: string
  balance: number
}
export interface LeaveRecord{
  id:number,
  leave_type_name:string,      
  leave_description: string,
  applied_date: Date,
  from_date: Date,
  to_date: Date,
  rejection_reason: string | null,
  primary_status: Boolean | null,
  secondry_status: Boolean | null,
  primary_approver_name: string | null,
  secondary_approver_name: string | null,
  employee_id: number,
  employee_name:string,
  primary_user : number
}
export interface AttendanceRecord {
  id: number
  attendance_date: string
  shift: number
  punch_in: string | null
  punch_out: string | null
  hours_worked: string | null
  attendance_status: "present" | "absent" | "leave" | "late"
  pay_type: "full_day" | "half_day" | "unpaid" | "leave" | "overtime" | "no_punch_out"
  overtime_status: string | null
  overtime_approved_by: string | null
  created_at: string
  updated_at: string
  updated_by: string
  first_name: string
  last_name: string
  employee_id: number
}

export interface DashboardStats {
  pendingLeaveApprovals: number
  pendingSkillApprovals: number
  expiringDocuments: number
  totalEmployees: number
  presentToday: number
  absentToday: number
  onLeaveToday: number
}

export interface UserProfile {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  profile_url?: string
  is_active: boolean
  role_name: string
  job_title?: string
  full_employee_id:string
}

export interface DetailedUserProfile {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  profile_url?: string
  is_active: boolean
  role_name: string
  job_title?: string
  dob?: string
  gender?: string
  emergency_contact_name?: string
  emergency_contact_relation?: string
  emergency_contact_number?: string
  joining_date: string
  reports_to?: number
  reports_to_name?: string
  shift_name?: string
  is_probation?: boolean
  salary_visibility?: boolean
  inactive_date?:string
  inactive_reason?:string
  is_payroll_exempt:boolean
  nationality:string,
  inactivated_by_name:string
  inactivated_by:number
  full_employee_id:string

}

export interface BankDetails {
  id:number
  user_id: number
  bank_name: string
  bank_account: string
  bank_ifsc: string
  created_at : string
  updated_at : string
  updated_by_name:string
}

export interface EmployeeDocument {
  id: number
  document_id: number
  user_id: number
  upload_link: string
  upload_date: string
  expiry_date?: string
  document_name: string
}

export interface SalaryComponent {
  id: number
  component_name: string
  component_type: "earning" | "deduction"
  value_type: "fixed" | "percentage"
  value: string
  based_on_component_name?: string
  based_on_component_id: number
  component_id: number
  calculated_amount: number
}

export interface LoanRecord {
  id: number
  loan_type: "loan" | "advance"
  title: string
  description?: string | null
  principal_amount: string
  total_installments: number
  remaining_installments:number
  status: "pending_approval" | "active" | "rejected" | "paid_off" | "approved"
  request_date : string
  employee_name : string
  employee_id : number
  approved_by : number | null
  approved_by_name : string | null
  approval_date : string | null
  disbursement_date?: string | null
  created_at: string
  updated_at: string
  emi_amount : string
}

export interface PaginatedResponse<T> {
  success: boolean
  pagination: {
    total_users: number
    current_page: number
    per_page: number
    total_pages: number
  }
  data: T[]
}

// HR Administration interfaces
export interface Role {
  id: number
  name: string
  role_level: number
  permissions?: Permission[]
}

export interface Permission {
  id: number
  name: string
}

export interface Job {
  id: number
  title: string
  description: string
}

export interface Shift {
  id: number
  name: string
  from_time: string
  to_time: string
  half_day_threshold: number
  punch_in_margin: number
  punch_out_margin: number
}

export interface Skill {
  id: number
  skill_name: string
  skill_description: string
}

export interface ExpenseSummary{
  id: number
  employee_name : string
  total_amount : string
}

export interface DocumentType {
  id: number
  name: string
  reminder_threshold:number
}

export interface Holiday {
  id: number
  name: string
  holiday_date: string
}

// Payroll-related interfaces
export interface PayrollComponent {
  id: number
  name: string
  type: "earning" | "deduction"
}

export interface PayrollRun {
  id: number
  pay_period_start: string
  pay_period_end: string
  status: "processing" | "paid"
  total_net_pay : string
  created_at: string
  initiated_by:number
  initiated_by_name:string
  finalized_at:string
}

export interface Payslip {
  id: number
  payroll_id: number
  employee_id: number
  employee_name: string
  gross_earnings: string
  total_deductions: string
  net_pay: string
  pay_period_start: string
  pay_period_end:string
}

export interface PayslipDetail {
  id: number
  payslip_id: number
  component_name: string
  component_type: "earning" | "deduction"
  amount: number
  payroll_status : "paid"|"processing"
}

// New interfaces for missing functionality
export interface LeaveApproval {
  id: number
  employee_name: string
  leave_type: string
  from_date: string
  to_date: string
  status: "pending" | "approved" | "rejected"
  reason: string
}

export interface LeaveRequest {
    id: number;
    employee_id: number;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason: string;
    status: "pending" | "approved" | "rejected";
    applied_date: string;
}

export interface SkillApproval {
  id: number;
  employee_id: number;
  first_name:string
  last_name:string
  created_at:string
  skill_name: string;
  status: "pending" | "approved" | "rejected";
}

export interface LoanApproval {
    id: number;
    employee_id: number;
    employee_name: string;
    loan_type: string;
    amount: number;
    reason: string;
    status: "pending" | "approved" | "rejected" | "disbursed";
    applied_date: string;
    repayment_months: number;
}



export interface ExpenseApproval {
    id: number;
    employee_id: number;
    employee_name: string;
    expense_type: string;
    amount: number;
    description: string;
    status: "pending" | "approved" | "rejected" | "reimbursed";
    submitted_date: string;
    receipt_url?: string;
}

export interface UserSkill {
  id: number
  skill_name: string
  status: boolean | null
  approved_by_name : string | null
}

export interface ExpenseRecord {
  id: number
  expense_title: string
  expense: number
  expense_description: string
  created_at: string
  first_name : string
  last_name : string
  employee_id : number
}

export interface LeaveType {
  id: number
  name: string
  description: string
  initial_balance: number
  accurable: boolean
  accural_rate: number
  max_balance: number
}


export interface MyDashboardData {
  monthlyAttendance: AttendanceRecord[];
  pendingOvertimeRequests: { attendance_date: string; hours_worked: string }[];
  leaveBalances: { name: string; balance: string }[];
  documentStatus: {
    expiringSoon: { name: string; expiry_date: string }[];
    notUploaded: { name: string }[];
  };
  upcomingHoliday: { name: string; holiday_date: string } | null;
  upcomingLeave: { from_date: string; to_date: string } | null;
  ongoingLoans: {
    title: string;
    principal_amount: string;
    emi_amount: string;
    remaining_installments: number;
  }[];
  reportingManager: string | null;
}

export interface AdminDashboardData {
  headcount: number;
  todayAttendance: {
    present: number;
    absent: number;
    leave: number;
    late: number;
  };
  expiringDocuments: {
    id: number;
    employee_name: string;
    document_name: string;
    expiry_date: string;
  }[];
  pendingLeaveApprovals: {
    primary: number;
    secondary: number;
  };
  pendingSkillRequests: {
    id: number;
    employee_name: string;
    skill_name: string;
    created_at: string;
  }[];
  pendingLoanRequests: any[]; // Or a more specific type if you have it
}



export interface LeaveRecordHistory {
  id: number;
  leave_description: string;
  applied_date: string;
  from_date: string;
  to_date: string;
  rejection_reason: string | null;
  primary_status: boolean | null;
  secondry_status: boolean | null;
  leave_type_name: string;
  employee_name: string;
  employee_id: number; // Assuming this is available, if not, it can be removed
  primary_approver_name: string | null;
  secondary_approver_name: string | null;
  your_approval_level?: "primary" | "secondary";
}

export interface SkilledEmployee {
  employee_id: number;
  employee_name: string;
  approved_by_name: string | null;
}

export interface EmployeeInRole{
  id:number
  name:string
  profile_url:string | null
  job_title:string
}
export interface EmployeeInJob{
  id:number
  name:string
  profile_url:string | null
  role_name:string
}

export interface PayslipHistory {
  id: number
  payroll_id: number
  employee_id: number
  pay_period_start: string
  pay_period_end: string
  payment_date: string | null
  gross_earnings: string
  total_deductions: string
  net_pay: string
  created_at: string
  details: {
    id: number
    payslip_id: number
    component_name: string
    component_type: "earning" | "deduction"
    amount: string
  }[]
}

export interface EmployeePayslipHistory {
  id: number
  payroll_id: number
  employee_id: number
  pay_period_start: string
  pay_period_end: string
  payment_date: string | null
  gross_earnings: string
  total_deductions: string
  net_pay: string
  created_at: string
  details: {
    id: number
    payslip_id: number
    component_name: string
    component_type: "earning" | "deduction"
    amount: string
  }[]
}

export async function getEmployeePayslipHistory(employeeId: number, endDate: string): Promise<EmployeePayslipHistory[]> {
  const params = new URLSearchParams({ endDate });
  return apiRequest<EmployeePayslipHistory[]>(`/payroll/history/employee/${employeeId}?${params.toString()}`);
}

export async function getMyPayslipHistory(endDate: string): Promise<PayslipHistory[]> {
  const params = new URLSearchParams({ endDate });
  return apiRequest<PayslipHistory[]>(`/payroll/history/me?${params.toString()}`);
}



export async function getEmployeesInJob(jobId: number): Promise<EmployeeInJob[]> {
  return apiRequest<EmployeeInJob[]>(`/jobs/${jobId}/employees`);
}
export async function getEmployeesInRole(roleId: number): Promise<EmployeeInRole[]> {
  return apiRequest<EmployeeInRole[]>(`/roles/${roleId}/employees`);
}
export async function getEmployeesBySkill(skillName: string): Promise<SkilledEmployee[]> {
  return apiRequest<SkilledEmployee[]>(`/skillMatrix/skills/${encodeURIComponent(skillName)}/employees`);
}


export async function getApprovalHistory(startDate: string, endDate: string): Promise<LeaveRecordHistory[]> {
  const params = new URLSearchParams({ startDate, endDate });
  return apiRequest<LeaveRecordHistory[]>(`/leaves/history?${params.toString()}`);
}


export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  return apiRequest<AdminDashboardData>("/dashboard/admin");
}


export async function getMyDashboardData(): Promise<MyDashboardData> {
  return apiRequest<MyDashboardData>("/dashboard/me");
}

// Real API functions replacing mock implementations
export async function getLeaveBalances(): Promise<LeaveBalance[]> {
  return apiRequest<LeaveBalance[]>(API_CONFIG.ENDPOINTS.LEAVE_BALANCE)
}

export async function getMyAttendance(startDate?: string, endDate?: string): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams()
  if (startDate) params.append("start_date", startDate)
  if (endDate) params.append("end_date", endDate)

  const endpoint = `${API_CONFIG.ENDPOINTS.ATTENDANCE}?${params.toString()}`
  return apiRequest<AttendanceRecord[]>(endpoint)
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>("/dashboard/stats")
}

export async function getHeadcountTrends(): Promise<Array<{ month: string; headcount: number }>> {
  return apiRequest<Array<{ month: string; headcount: number }>>("/dashboard/headcount-trends")
}

export async function getAllUserProfiles(page = 1, limit = 20, search = ""): Promise<PaginatedResponse<UserProfile>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  if (search) params.append("search", search)

  const endpoint = `${API_CONFIG.ENDPOINTS.USERS}/profiles/all?${params.toString()}`
  return apiRequest<PaginatedResponse<UserProfile>>(endpoint)
}

export async function getDetailedUserProfile(userId: number): Promise<DetailedUserProfile> {
  return apiRequest<DetailedUserProfile>(API_CONFIG.ENDPOINTS.USER_BY_ID(userId.toString()))
}

export async function getBankDetails(employeeId: number): Promise<BankDetails | null> {
  return apiRequest<BankDetails>(API_CONFIG.ENDPOINTS.BANK_DETAILS(employeeId.toString()))
}

export async function getEmployeeDocuments(employeeId: number): Promise<EmployeeDocument[]> {
  return apiRequest<EmployeeDocument[]>(API_CONFIG.ENDPOINTS.USER_DOCUMENTS(employeeId.toString()))
}

export async function getSalaryStructure(employeeId: number): Promise<SalaryComponent[]> {
  return apiRequest<SalaryComponent[]>(API_CONFIG.ENDPOINTS.PAYROLL_STRUCTURE(employeeId.toString()))
}


export async function getLoanHistory(employeeId: number): Promise<LoanRecord[]> {
  return apiRequest<LoanRecord[]>(`${API_CONFIG.ENDPOINTS.LOANS}/employee/${employeeId}`)
}





export async function getEmployeeAttendance(
  employeeId: number,
  year?: number,
  month?: number,
): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams({
    employee_id: employeeId.toString(),
    limit: "31", // A month will never have more than 31 days
  })
  if (year) {
    params.append("year", year.toString())
  }
  if (month) {
    params.append("month", month.toString())
  }
  return apiRequest<AttendanceRecord[]>(`${API_CONFIG.ENDPOINTS.ATTENDANCE_ALL}?${params.toString()}`)
}

// HR Administration API functions
export async function getRoles(): Promise<Role[]> {
  return apiRequest<Role[]>(API_CONFIG.ENDPOINTS.ROLES)
}

export async function getRole(id: number): Promise<Role> {
  return apiRequest<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`)
}

export async function getPermissions(): Promise<Permission[]> {
  return apiRequest<Permission[]>(API_CONFIG.ENDPOINTS.PERMISSIONS)
}

export async function createRole(data: { name: string; role_level: number }): Promise<Role> {
  return apiRequest<Role>(API_CONFIG.ENDPOINTS.ROLES, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateRole(id: number, data: Partial<{ name: string; role_level: number }>): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteRole(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
    method: "DELETE",
  })
}

export async function getJobs(): Promise<Job[]> {
  return apiRequest<Job[]>(API_CONFIG.ENDPOINTS.JOBS)
}

export async function createJob(data: { title: string; description: string }): Promise<Job> {
  return apiRequest<Job>(API_CONFIG.ENDPOINTS.JOBS, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateJob(id: number, data: Partial<{ title: string; description: string }>): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.JOBS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteJob(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.JOBS}/${id}`, {
    method: "DELETE",
  })
}

export async function getShifts(): Promise<Shift[]> {
  return apiRequest<Shift[]>(API_CONFIG.ENDPOINTS.SHIFTS)
}

export async function createShift(data: {
  name: string
  from_time_local: string
  to_time_local: string
  timezone: string
  half_day_threshold: number
  punch_in_margin: number
  punch_out_margin: number
}): Promise<Shift> {
  return apiRequest<Shift>(API_CONFIG.ENDPOINTS.SHIFTS, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateShift(id: number, data: Partial<Shift>): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SHIFTS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteShift(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SHIFTS}/${id}`, {
    method: "DELETE",
  })
}

export async function getSkills(): Promise<Skill[]> {
  return apiRequest<Skill[]>(API_CONFIG.ENDPOINTS.SKILLS)
}

export async function createSkill(data: { skill_name: string; skill_description: string }): Promise<Skill> {
  return apiRequest<Skill>(API_CONFIG.ENDPOINTS.SKILLS, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateSkill(
  id: number,
  data: Partial<{ skill_name: string; skill_description: string }>,
): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SKILLS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteSkill(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SKILLS}/${id}`, {
    method: "DELETE",
  })
}

export async function getDocumentTypes(): Promise<DocumentType[]> {
  return apiRequest<DocumentType[]>(API_CONFIG.ENDPOINTS.DOCUMENT_TYPES)
}

export async function createDocumentType(data: { name: string, reminder_threshold:number }): Promise<DocumentType> {
  return apiRequest<DocumentType>(API_CONFIG.ENDPOINTS.DOCUMENT_TYPES, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateDocumentType(id: number, data: { name: string, reminder_threshold:number }): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.DOCUMENT_TYPES}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteDocumentType(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.DOCUMENT_TYPES}/${id}`, {
    method: "DELETE",
  })
}

export async function getHolidays(year?: number): Promise<Holiday[]> {
  const params = year ? `?year=${year}` : ""
  return apiRequest<Holiday[]>(`${API_CONFIG.ENDPOINTS.CALENDAR}${params}`)
}

export async function createHoliday(data: { name: string; holiday_date: string }): Promise<Holiday> {
  return apiRequest<Holiday>(API_CONFIG.ENDPOINTS.CALENDAR, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteHoliday(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.CALENDAR}/${id}`, {
    method: "DELETE",
  })
}

// Payroll API functions
export async function getPayrollComponents(): Promise<PayrollComponent[]> {
  return apiRequest<PayrollComponent[]>(API_CONFIG.ENDPOINTS.PAYROLL_COMPONENTS)
}

export async function createPayrollComponent(data: {
  name: string
  type: "earning" | "deduction"
}): Promise<PayrollComponent> {
  return apiRequest<PayrollComponent>(API_CONFIG.ENDPOINTS.PAYROLL_COMPONENTS, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updatePayrollComponent(
  id: number,
  data: Partial<{ name: string; type: "earning" | "deduction" }>,
): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_COMPONENTS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deletePayrollComponent(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_COMPONENTS}/${id}`, {
    method: "DELETE",
  })
}

export async function getPayrollRuns(search?: string): Promise<PayrollRun[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ""
  return apiRequest<PayrollRun[]>(`${API_CONFIG.ENDPOINTS.PAYROLL_RUNS}${params}`)
}

export async function initiatePayrollRun(data: { from_date: string; to_date: string }): Promise<{ payrollId: number }> {
  return apiRequest<{ payrollId: number }>(`${API_CONFIG.ENDPOINTS.PAYROLL_RUNS}/initiate`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function finalizePayrollRun(payrollId: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_RUN}/finalize/${payrollId}`, {
    method: "PATCH",
  })
}

export async function deletePayrollRun(payrollId: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_RUNS}/${payrollId}`, {
    method: "DELETE",
  })
}

export async function getPayslips(payrollId: number): Promise<Payslip[]> {
  return apiRequest<Payslip[]>(`/payroll/payslip/${payrollId}`)
}

export async function getPayslipDetails(payslipId: number): Promise<PayslipDetail[]> {
  return apiRequest<PayslipDetail[]>(`/payroll/payslip/${payslipId}/edit`)
}

export async function updatePayslipDetail(
  payslipId: number,
  detailId: number,
  data: { component_name: string; component_type: "earning" | "deduction"; amount: number },
): Promise<void> {
  await apiRequest(`/payroll/payslip/${payslipId}/details/${detailId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function addPayslipDetail(
  payslipId: number,
  data: { component_name: string; component_type: "earning" | "deduction"; amount: number },
): Promise<{ newDetailId: number }> {
  return apiRequest<{ newDetailId: number }>(`/payroll/payslip/${payslipId}/details`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deletePayslipDetail(payslipId: number, detailId: number): Promise<void> {
  await apiRequest(`/payroll/payslip/${payslipId}/details/${detailId}`, {
    method: "DELETE",
  })
}

// New API functions for missing functionality
export async function getLeaveRequests(): Promise<LeaveRequest[]> {
    return apiRequest<LeaveRequest[]>(API_CONFIG.ENDPOINTS.LEAVE_APPROVALS);
}

export async function updateLeaveStatus(leaveId: number, status: 'approved' | 'rejected'): Promise<void> {
    await apiRequest(`/leaves/approve-primary/${leaveId}`, {
        method: 'POST',
        body: JSON.stringify({ status: status === 'approved' }),
    });
}


export async function getSkillApprovals(): Promise<SkillApproval[]> {
  return apiRequest<SkillApproval[]>(API_CONFIG.ENDPOINTS.SKILL_APPROVALS)
}

export async function updateSkillApproval(approvalId: number, status: "approved" | "rejected"): Promise<void> {
    await apiRequest(`${API_CONFIG.ENDPOINTS.SKILL_APPROVALS}/${approvalId}`, {
        method: 'PATCH',
        body: JSON.stringify({ newStatus: status === 'approved' ? 1 : 0 }),
    });
}


export async function getLoanRequests(): Promise<LoanApproval[]> {
    return apiRequest<LoanApproval[]>(API_CONFIG.ENDPOINTS.LOAN_APPROVALS);
}

export async function updateLoanStatus(loanId: number, status: "approved" | "rejected"): Promise<void> {
    await apiRequest(`/loans/approve/${loanId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}


export async function getExpenseClaims(): Promise<ExpenseApproval[]> {
    return apiRequest<ExpenseApproval[]>(API_CONFIG.ENDPOINTS.EXPENSE_APPROVALS);
}

export async function updateExpenseStatus(expenseId: number, status: "approved" | "rejected"): Promise<void> {
    await apiRequest(`/expense/${expenseId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}


export async function getUserSkills(userId: number): Promise<UserSkill[]> {
  return apiRequest<UserSkill[]>(API_CONFIG.ENDPOINTS.USER_SKILLS(userId.toString()))
}

export async function getUserLoans(userId: number): Promise<LoanRecord[]> {
  const params = new URLSearchParams({ userId: userId.toString() })
  return apiRequest<LoanRecord[]>(`${API_CONFIG.ENDPOINTS.LOANS}?${params.toString()}`)
}

export async function getUserExpenses(userId: number): Promise<ExpenseRecord[]> {
  return apiRequest<ExpenseRecord[]>(`${API_CONFIG.ENDPOINTS.EXPENSES}/${userId}`)
}

export async function createUser(
  formData: FormData,
): Promise<{ success: boolean; message: string; user: { id: number; email: string } }> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.message || 'API request failed', errorData);
    }

    return await response.json();
}

export async function searchUsers(term: string, inActive: boolean = false): Promise<UserProfile[]> {
  const params = new URLSearchParams({ term });

  if (inActive) {
    params.append("inActive", "true");
  }

  return apiRequest<UserProfile[]>(`${API_CONFIG.ENDPOINTS.USER_SEARCH}?${params.toString()}`);
}

export async function searchUsersByPermissions(permissions: string[]): Promise<UserProfile[]> {
  const params = new URLSearchParams()
  permissions.forEach(permission =>{params.append('permission',permission)})
  return apiRequest<UserProfile[]>(`${API_CONFIG.ENDPOINTS.PERMISSION_SEARCH}?${params.toString()}`)
}

export async function getDirectReports(employeeId:number): Promise<UserProfile[]> {
  console.log(employeeId)
  return apiRequest<UserProfile[]>(`${API_CONFIG.ENDPOINTS.DIRECT_REPORTS}/${employeeId}`)
}

export async function updateUser(
  userId: number,
  data: Partial<DetailedUserProfile>,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.USER_PROFILE}/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),

  })
}

export async function updateSelfProfile(
  data: FormData | Partial<DetailedUserProfile>,
): Promise<{ success: boolean; message: string }> {

  const headers: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem("hr_token") || ""}`,
  }

  // Add Content-Type only if NOT FormData
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SELF}`,
    {
      method: "PATCH",
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      errorData.message || "API request failed",
      errorData
    )
  }

  return await response.json()
}


export async function getCurrentUserProfile(): Promise<DetailedUserProfile> {
  return apiRequest<DetailedUserProfile>(API_CONFIG.ENDPOINTS.USER_PROFILE)
}

export async function updateRolePermissions(
  roleId: number,
  permissionIds: number[],
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.ROLES}/${roleId}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissionIds }),
  })
}

// Document Management APIs
export async function uploadDocument(
  formData: FormData,
): Promise<{ success: boolean; message: string; document: { id: number; link: string } }> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENT_UPLOAD}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.message || 'API request failed', errorData);
    }

    return await response.json();
}

export async function getMyDocuments(): Promise<EmployeeDocument[]> {
  return apiRequest<EmployeeDocument[]>(API_CONFIG.ENDPOINTS.MY_DOCUMENTS)
}

export async function uploadEmployeeDocument(
  employeeId: number,
  formData: FormData,
): Promise<{ success: boolean; message: string; document: { id: number; link: string } }> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENTS}/employee/${employeeId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.message || 'API request failed', errorData);
    }

    return await response.json();
}

export async function getExpiringDocuments(): Promise<
  Array<{ id: number; upload_link: string; expiry_date: string; document_name: string; employee_name: string }>
> {
  return apiRequest<
    Array<{ id: number; upload_link: string; expiry_date: string; document_name: string; employee_name: string }>
  >(API_CONFIG.ENDPOINTS.EXPIRING_DOCUMENTS)
}

export async function deleteUploadedDocument(documentId: number): Promise<void> {
  await apiRequest(`/documents/uploaded/${documentId}`, {
    method: "DELETE",
  })
}

// Skill Matrix APIs
export async function createSkillRequest(skillId: number): Promise<{
  success: boolean
  message: string
  request: { id: number; employee_id: number; skill_id: number; status: null }
}> {
  return apiRequest<{
    success: boolean
    message: string
    request: { id: number; employee_id: number; skill_id: number; status: null }
  }>(API_CONFIG.ENDPOINTS.SKILL_MATRIX, {
    method: "POST",
    body: JSON.stringify({ skill_id: skillId }),
  })
}

export async function getMySkillRequests(): Promise<
  Array<{
    id: number
    employee_id: number
    skill_id: number
    status: null | 0 | 1
    approved_by: null | string
    created_at: string
    skill_name: string
  }>
> {
  return apiRequest<
    Array<{
      id: number
      employee_id: number
      skill_id: number
      status: null | 0 | 1
      approved_by: null | string
      created_at: string
      skill_name: string
    }>
  >(API_CONFIG.ENDPOINTS.MY_SKILL_REQUESTS)
}

export async function updateSkillRequest(
  requestId: number,
  skillId: number,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.SKILL_MATRIX}/${requestId}`, {
    method: "PATCH",
    body: JSON.stringify({ skill_id: skillId }),
  })
}

export async function deleteSkillRequest(requestId: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SKILL_MATRIX}/${requestId}`, {
    method: "DELETE",
  })
}

export async function getPendingSkillApprovals(): Promise<
  Array<{ id: number; status: null; created_at: string; first_name: string; last_name: string; skill_name: string }>
> {
  return apiRequest<
    Array<{ id: number; status: null; created_at: string; first_name: string; last_name: string; skill_name: string }>
  >(API_CONFIG.ENDPOINTS.SKILL_APPROVALS)
}

export async function approveSkillRequest(
  requestId: number,
  status: 0 | 1,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.SKILL_APPROVALS}/${requestId}`, {
    method: "PATCH",
    body: JSON.stringify({ newStatus: status }),
  })
}

// Leave Management APIs
export async function getLeaveTypes(): Promise<LeaveType[]> {
  return apiRequest<LeaveType[]>(API_CONFIG.ENDPOINTS.LEAVE_TYPES)
}

export async function createLeaveType(data: { name: string; description: string; initial_balance: number }): Promise<{
  success: boolean
  message: string
  leaveType: LeaveType
}> {
  return apiRequest<{ success: boolean; message: string; leaveType: LeaveType }>(API_CONFIG.ENDPOINTS.LEAVE_TYPES, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateLeaveType(
  id: number,
  data: Partial<LeaveType>,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.LEAVE_TYPES}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteLeaveType(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.LEAVE_TYPES}/${id}`, {
    method: "DELETE",
  })
}

export async function requestLeave(data: {
  leave_type: number
  leave_description: string
  from_date: string
  to_date: string
}): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(API_CONFIG.ENDPOINTS.REQUEST_LEAVE, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getMyLeaveRecords(): Promise<LeaveBalance[]> {
  return apiRequest<LeaveBalance[]>(API_CONFIG.ENDPOINTS.LEAVE_RECORDS)
}

export async function deleteLeaveRequest(recordId: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.LEAVE_REQUEST}/${recordId}`, {
    method: "DELETE",
  })
}

export async function getPrimaryLeaveApprovals(): Promise<LeaveRecord[]> {
  return apiRequest<LeaveRecord[]>(API_CONFIG.ENDPOINTS.PRIMARY_LEAVE_APPROVALS)
}

export async function approvePrimaryLeave(
  recordId: number,
  status: boolean,
  rejectionReason?: string,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.PRIMARY_LEAVE_APPROVALS}/${recordId}`,
    {
      method: "POST",
      body: JSON.stringify({ status, rejection_reason: rejectionReason || "" }),
    },
  )
}

export async function getSecondaryLeaveApprovals(): Promise<LeaveRecord[]> {
  return apiRequest<LeaveRecord[]>(API_CONFIG.ENDPOINTS.SECONDARY_LEAVE_APPROVALS)
}

export async function approveSecondaryLeave(
  recordId: number,
  status: boolean,
  rejectionReason?: string,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.SECONDARY_LEAVE_APPROVALS}/${recordId}`,
    {
      method: "POST",
      body: JSON.stringify({ status, rejection_reason: rejectionReason || "" }),
    },
  )
}

export async function getEmployeeLeaveBalance(employeeId: number): Promise<LeaveBalance[]> {
  return apiRequest<LeaveBalance[]>(`${API_CONFIG.ENDPOINTS.LEAVE_BALANCE}/${employeeId}`)
}

export async function getEmployeeLeaveRecords(
  employeeId: number,
  startDate?: string,
  endDate?: string,
): Promise<LeaveRecord[]> {
  const params = new URLSearchParams()
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)

  const endpoint = `${API_CONFIG.ENDPOINTS.LEAVE_RECORDS}/${employeeId}${params.toString() ? `?${params.toString()}` : ""}`
  return apiRequest<LeaveRecord[]>(endpoint)
}

// Expense Management APIs
export async function createExpense(data: {
  employee_id: number
  expense_title: string
  expense_description: string
  expense: number
}): Promise<{ success: boolean; message: string; expense: ExpenseRecord }> {
  return apiRequest<{ success: boolean; message: string; expense: ExpenseRecord }>(API_CONFIG.ENDPOINTS.EXPENSES, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getExpenses(employeeId?: number): Promise<ExpenseRecord[]> {
  const params = employeeId ? `?employee_id=${employeeId}` : ""
  return apiRequest<ExpenseRecord[]>(`${API_CONFIG.ENDPOINTS.EXPENSES}${params}`)
}

export async function getExpense(id: number): Promise<ExpenseRecord> {
  return apiRequest<ExpenseRecord>(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`)
}

export async function updateExpense(
  id: number,
  data: Partial<ExpenseRecord>,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteExpense(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, {
    method: "DELETE",
  })
}

// Bank Details APIs
export async function getMyBankDetails(): Promise<BankDetails> {
  return apiRequest<BankDetails>(API_CONFIG.ENDPOINTS.MY_BANK_DETAILS)
}

export async function updateMyBankDetails(data: {
  bank_name: string
  bank_account: string
  bank_ifsc: string
}): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(API_CONFIG.ENDPOINTS.MY_BANK_DETAILS, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateEmployeeBankDetails(
  employeeId: number,
  data: { bank_name: string; bank_account: string; bank_ifsc: string },
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(API_CONFIG.ENDPOINTS.BANK_DETAILS(employeeId.toString()), {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteEmployeeBankDetails(employeeId: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.BANK_DETAILS(employeeId.toString())}`, {
    method: "DELETE",
  })
}

// Attendance Management APIs
export async function punchIn(time_local:string,timezone:string,employee_id:number): Promise<{ message: string; attendanceStatus: string }> {
  const data = {time_local:time_local, timezone:timezone, employee_id:employee_id}
  return apiRequest<{ message: string; attendanceStatus: string }>(API_CONFIG.ENDPOINTS.PUNCH_IN, {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function punchOut(time_local:string,timezone:string,employee_id:number): Promise<{ message: string; attendanceStatus: string }> {
  const data = {time_local:time_local, timezone:timezone,employee_id:employee_id}
  return apiRequest<{ message: string; attendanceStatus: string }>(API_CONFIG.ENDPOINTS.PUNCH_OUT, {
    method: "POST",
    body: JSON.stringify(data)
  })
}



export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
    return apiRequest<AttendanceRecord[]>(API_CONFIG.ENDPOINTS.ATTENDANCE_ALL);
}


export async function getAllAttendance(params?: {
  employee_id?: number
  shift_id?: number
  date?: string
  week?: number
  month?: number
  year?: number
  page?: number
  limit?: number
}): Promise<AttendanceRecord[]> {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
  }

  const endpoint = `${API_CONFIG.ENDPOINTS.ATTENDANCE_ALL}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
  return apiRequest<AttendanceRecord[]>(endpoint)
}

export async function updateAttendancePayType(
  recordId: number,
  payType: "unpaid" | "full_day" | "half_day",
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`/attendance/update/pay-type/${recordId}`, {
    method: "POST",
    body: JSON.stringify({ pay_type: payType }),
  })
}

export async function approveOvertime(recordId: number, status: 0 | 1): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`/attendance/update/overtime/${recordId}`, {
    method: "POST",
    body: JSON.stringify({ status }),
  })
}

// Calendar/Holiday Management APIs
export async function getWorkWeek(): Promise<Array<{ day_of_week: string; is_working_day: boolean }>> {
  return apiRequest<Array<{ day_of_week: string; is_working_day: boolean }>>(API_CONFIG.ENDPOINTS.WORK_WEEK)
}

export async function updateWorkWeek(
  data: Array<{ day_of_week: string; is_working_day: boolean }>,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(API_CONFIG.ENDPOINTS.WORK_WEEK, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

// Loan Management APIs
export async function createLoan(data: {
  loan_type: "loan" | "advance"
  title: string
  description?: string
  principal_amount: number
  total_installments: number
}): Promise<{ success: boolean; message: string; loan: LoanRecord }> {
  return apiRequest<{ success: boolean; message: string; loan: LoanRecord }>(API_CONFIG.ENDPOINTS.LOANS, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getMyLoans(): Promise<LoanRecord[]> {
  return apiRequest<LoanRecord[]>(API_CONFIG.ENDPOINTS.MY_LOANS)
}

export async function getAllLoans(status?: string): Promise<LoanRecord[]> {
  return apiRequest<LoanRecord[]>(`${API_CONFIG.ENDPOINTS.LOAN_APPROVALS}`)
}

export async function approveLoan(
  loanId: number,
  status: "approved" | "rejected",
  disbursementDate?: string,
): Promise<{ success: boolean; message: string }> {
  const body: any = { status }
  if (disbursementDate) body.disbursement_date = disbursementDate

  return apiRequest<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.LOANS}/approve/${loanId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
// Add this new function to your existing lib/api.ts file

export async function addRepayment(loanId: number, amount: number): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.LOANS}/${loanId}/repay`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}
export async function getApprovedLoans(): Promise<LoanRecord[]> {
  return apiRequest<LoanRecord[]>(`${API_CONFIG.ENDPOINTS.LOANS}/approved`)
}

export async function getLoanRepayments(loanId: number): Promise<LoanRepayment[]> {
  return apiRequest<LoanRepayment[]>(`${API_CONFIG.ENDPOINTS.LOANS}/repayments/${loanId}`);
}

export async function editLoan(
  loanId: number,
  data: Partial<LoanRecord>,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`${API_CONFIG.ENDPOINTS.LOANS}/edit/${loanId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

// Salary Structure Management APIs
export async function assignSalaryComponent(
  employeeId: number,
  data: {
    component_id: number
    value_type: "fixed" | "percentage"
    value: number
    based_on_component_id?: number
  },
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.PAYROLL_STRUCTURE(employeeId.toString())}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  )
}

export async function getMySalaryStructure(): Promise<SalaryComponent[]> {
  return apiRequest<SalaryComponent[]>(API_CONFIG.ENDPOINTS.MY_SALARY_STRUCTURE)
}

export async function removeSalaryComponent(employeeId: number, componentId: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_STRUCTURE(employeeId.toString())}/components/${componentId}`, {
    method: "DELETE",
  })
}

export async function updateSalaryComponent(employeeId: number, componentId: number,data:Partial<SalaryComponent>): Promise<{ success: boolean; message: string }> {
  return await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_STRUCTURE(employeeId.toString())}/components/${componentId}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

export async function getExpensesSummary(): Promise<ExpenseSummary[]> {
  return await apiRequest(`${API_CONFIG.ENDPOINTS.SUMMARY_EXPENSES}`, {
    method: "GET",
  })
}


/**
 * @description Fetches the payroll report Excel file from the API and triggers a download in the browser.
 * @param payrollId The ID of the payroll run to generate the report for.
 * @returns A promise that resolves when the download is initiated, or rejects on error.
 */
export async function downloadPayrollReport(payrollId: number): Promise<void> {
  // Get the auth token from wherever you store it (e.g., localStorage, cookies)
  const token = localStorage.getItem('hr_token'); 

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.REPORT_PAYROLL_RUN}/${payrollId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        // No 'Content-Type': 'application/json' needed here
      },
    });

    if (!response.ok) {
      // If the server returns an error (e.g., 404, 500), handle it
      const errorData = await response.json(); // Try to parse error message as JSON
      throw new Error(errorData.message || 'Failed to download the report.');
    }

    // 1. Get the binary data (the file itself) as a Blob
    const blob = await response.blob();

    // 2. Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // 3. Create a temporary, hidden link element
    const link = document.createElement('a');
    link.href = url;

    // 4. Extract the filename from the 'Content-Disposition' header sent by the server
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `Payroll_Report_${payrollId}.xlsx`; // A default filename
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch!.length > 1) {
            filename = filenameMatch![1];
        }
    }
    link.setAttribute('download', filename);

    // 5. Add the link to the page, click it to trigger the download, and then remove it
    document.body.appendChild(link);
    link.click();
    link.parentNode!.removeChild(link);

    // 6. Clean up the temporary URL
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Download error:', error);
    // Re-throw the error so the component can catch it and show a notification
    throw error;
  }
}


export interface NameSeries {
  id: number;
  table_name: string;
  prefix: string;
  padding_length: number;
  created_at: string;
  updated_at: string;
  updated_by_name: string;
}

export async function getNameSeries(): Promise<NameSeries[]> {
    return apiRequest<NameSeries[]>('/settings/name-series');
}

export async function createNameSeries(data: { table_name: string; prefix: string; padding_length: number }): Promise<NameSeries> {
    return apiRequest<NameSeries>('/settings/name-series', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateNameSeries(id: number, data: { table_name: string; prefix: string; padding_length: number }): Promise<void> {
    await apiRequest(`/settings/name-series/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deactivateUser(userId: number, inactive_reason: string): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`/user/deactivate/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ inactive_reason }),
  });
}

export interface UserAudit {
  audit_id: number;
  field_changed: string;
  old_value: string;
  new_value: string;
  updated_at: string;
  updated_by_name: string;
  updated_by : number
}

export async function getUserAuditHistory(userId: number): Promise<UserAudit[]> {
  return apiRequest<UserAudit[]>(`/user/audit/${userId}`);
}