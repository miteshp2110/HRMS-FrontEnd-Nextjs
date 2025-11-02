// In a real application, these would make actual HTTP requests

import { API_CONFIG, ApiError, apiRequest } from "./config";

export interface LoanRepayment {
  id: number;
  loan_id: number;
  payslip_id: number;
  repayment_amount: number;
  repayment_date: string;
  created_at: string;
}

export interface LeaveRecord {
  id: number;
  leave_type_name: string;
  leave_description: string;
  applied_date: Date;
  from_date: Date;
  to_date: Date;
  rejection_reason: string | null;
  primary_status: Boolean | null | number;
  secondry_status: Boolean | null | number;
  primary_approver_name: string | null;
  secondary_approver_name: string | null;
  employee_id: number;
  employee_name: string;
  primary_user: number;
  full_leave_id: string;
}

// export interface AttendanceRecord {
//   id: number
//   attendance_date: string
//   shift: number
//   punch_in: string | null
//   punch_out: string | null
//   hours_worked: string | null
//   attendance_status: "present" | "absent" | "leave" | "late"
//   pay_type: "full_day" | "half_day" | "unpaid" | "leave" | "overtime" | "no_punch_out"
//   overtime_status: string | null
//   overtime_approved_by: string | null
//   created_at: string
//   updated_at: string
//   updated_by: string
//   first_name: string
//   last_name: string
//   employee_id: number
// }

export interface DashboardStats {
  pendingLeaveApprovals: number;
  pendingSkillApprovals: number;
  expiringDocuments: number;
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_url?: string;
  is_active: boolean;
  role_name: string;
  job_title?: string;
  full_employee_id: string;
  shift_id: number;
}

export interface DetailedUserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_url?: string;
  is_active: boolean;
  role_name: string;
  job_title?: string;
  dob?: string;
  gender?: string;
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
  emergency_contact_number?: string;
  joining_date: string;
  reports_to?: number;
  reports_to_name?: string;
  shift_name?: string;
  is_probation?: boolean;
  probation_days: string;
  salary_visibility?: boolean;
  inactive_date?: string;
  inactive_reason?: string;
  is_payroll_exempt: boolean;
  nationality: string;
  inactivated_by_name: string;
  inactivated_by: number;
  full_employee_id: string;
  shift_id: number;
}

export interface BankDetails {
  id: number;
  user_id: number;
  bank_name: string;
  bank_account: string;
  bank_ifsc: string;
  created_at: string;
  updated_at: string;
  updated_by_name: string;
}

export interface EmployeeDocument {
  id: number;
  document_id: number;
  user_id: number;
  upload_link: string;
  upload_date: string;
  expiry_date?: string;
  document_name: string;
}

export interface SalaryComponent {
  id: number;
  component_id: number;
  component_name: string;
  component_type: "earning" | "deduction";
  calculation_type: "Fixed" | "Percentage" | "Formula";
  value: string;
  custom_formula: FormulaComponent[] | null;
  based_on_component_name?: string;
  based_on_component_id: number;
  calculated_amount: number;
}

export interface LoanRecord {
  id: number;
  loan_type: "loan" | "advance";
  title: string;
  description?: string | null;
  principal_amount: string;
  total_installments: number;
  remaining_installments: number;
  status: "pending_approval" | "active" | "rejected" | "paid_off" | "approved";
  request_date: string;
  employee_name: string;
  employee_id: number;
  approved_by: number | null;
  approved_by_name: string | null;
  approval_date: string | null;
  disbursement_date?: string | null;
  created_at: string;
  updated_at: string;
  emi_amount: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  pagination: {
    total_users: number;
    current_page: number;
    per_page: number;
    total_pages: number;
  };
  data: T[];
}

// HR Administration interfaces
export interface Role {
  id: number;
  name: string;
  role_level: number;
  permissions?: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
}

export interface Shift {
  id: number;
  name: string;
  from_time: string;
  to_time: string;
  half_day_threshold: number;
  punch_in_margin: number;
  punch_out_margin: number;
  overtime_threshold: number;
}

export interface Skill {
  id: number;
  skill_name: string;
  skill_description: string;
}

export interface ExpenseSummary {
  id: number;
  employee_name: string;
  total_amount: string;
}

export interface DocumentType {
  id: number;
  name: string;
  reminder_threshold: number;
}

export interface Holiday {
  id: number;
  name: string;
  holiday_date: string;
}

// Payroll-related interfaces
export interface PayrollComponent {
  id: number;
  name: string;
  type: "earning" | "deduction";
}

export interface PayrollRun {
  id: number;
  pay_period_start: string;
  pay_period_end: string;
  status: "processing" | "paid";
  total_net_pay: string;
  created_at: string;
  initiated_by: number;
  initiated_by_name: string;
  finalized_at: string;
}

export interface Payslip {
  id: number;
  payroll_id: number;
  employee_id: number;
  employee_name: string;
  gross_earnings: string;
  total_deductions: string;
  net_pay: string;
  pay_period_start: string;
  pay_period_end: string;
}

export interface PayslipDetail {
  id: number;
  payslip_id: number;
  component_name: string;
  component_type: "earning" | "deduction";
  amount: number;
  payroll_status: "paid" | "processing";
}

// New interfaces for missing functionality
export interface LeaveApproval {
  id: number;
  employee_name: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
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
  first_name: string;
  last_name: string;
  created_at: string;
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
  id: number;
  skill_name: string;
  status: boolean | null;
  approved_by_name: string | null;
}

export interface ExpenseRecord {
  id: number;
  expense_title: string;
  expense: number;
  expense_description: string;
  created_at: string;
  first_name: string;
  last_name: string;
  employee_id: number;
  jv: string;
}

export interface LeaveType {
  id: number;
  name: string;
  description: string;
  initial_balance: number;
  accurable: boolean;
  accural_rate: number;
  max_balance: number;
  is_encashable: boolean;
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
  full_leave_id: string;
}

export interface SkilledEmployee {
  employee_id: number;
  employee_name: string;
  approved_by_name: string | null;
}

export interface EmployeeInRole {
  id: number;
  name: string;
  profile_url: string | null;
  job_title: string;
}
export interface EmployeeInJob {
  id: number;
  name: string;
  profile_url: string | null;
  role_name: string;
}

export interface PayslipHistory {
  id: number;
  payroll_id: number;
  employee_id: number;
  pay_period_start: string;
  pay_period_end: string;
  payment_date: string | null;
  gross_earnings: string;
  total_deductions: string;
  net_pay: string;
  created_at: string;
  details: {
    id: number;
    payslip_id: number;
    component_name: string;
    component_type: "earning" | "deduction";
    amount: string;
  }[];
}

export interface EmployeePayslipHistory {
  id: number;
  payroll_id: number;
  employee_id: number;
  pay_period_start: string;
  pay_period_end: string;
  payment_date: string | null;
  gross_earnings: string;
  total_deductions: string;
  net_pay: string;
  created_at: string;
  details: {
    id: number;
    payslip_id: number;
    component_name: string;
    component_type: "earning" | "deduction";
    amount: string;
  }[];
}

export async function getEmployeePayslipHistory(
  employeeId: number,
  endDate: string
): Promise<EmployeePayslipHistory[]> {
  const params = new URLSearchParams({ endDate });
  return apiRequest<EmployeePayslipHistory[]>(
    `/payroll/history/employee/${employeeId}?${params.toString()}`
  );
}

export async function getMyPayslipHistory(
  endDate: string
): Promise<PayslipHistory[]> {
  const params = new URLSearchParams({ endDate });
  return apiRequest<PayslipHistory[]>(
    `/payroll/history/me?${params.toString()}`
  );
}

export async function getEmployeesInJob(
  jobId: number
): Promise<EmployeeInJob[]> {
  return apiRequest<EmployeeInJob[]>(`/jobs/${jobId}/employees`);
}
export async function getEmployeesInRole(
  roleId: number
): Promise<EmployeeInRole[]> {
  return apiRequest<EmployeeInRole[]>(`/roles/${roleId}/employees`);
}
export async function getEmployeesBySkill(
  skillName: string
): Promise<SkilledEmployee[]> {
  return apiRequest<SkilledEmployee[]>(
    `/skillMatrix/skills/${encodeURIComponent(skillName)}/employees`
  );
}

export async function getApprovalHistory(
  startDate: string,
  endDate: string
): Promise<LeaveRecordHistory[]> {
  const params = new URLSearchParams({ startDate, endDate });
  return apiRequest<LeaveRecordHistory[]>(
    `/leaves/history?${params.toString()}`
  );
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  return apiRequest<AdminDashboardData>("/dashboard/admin");
}

export async function getMyDashboardData(): Promise<MyDashboardData> {
  return apiRequest<MyDashboardData>("/dashboard/me");
}

// Real API functions replacing mock implementations
export async function getLeaveBalances(): Promise<LeaveBalance[]> {
  return apiRequest<LeaveBalance[]>(API_CONFIG.ENDPOINTS.LEAVE_BALANCE);
}

export async function getMyAttendance(
  startDate?: string,
  endDate?: string
): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  const endpoint = `${API_CONFIG.ENDPOINTS.ATTENDANCE}?${params.toString()}`;
  return apiRequest<AttendanceRecord[]>(endpoint);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>("/dashboard/stats");
}

export async function getHeadcountTrends(): Promise<
  Array<{ month: string; headcount: number }>
> {
  return apiRequest<Array<{ month: string; headcount: number }>>(
    "/dashboard/headcount-trends"
  );
}

export async function getAllUserProfiles(
  page = 1,
  limit = 20,
  search = ""
): Promise<PaginatedResponse<UserProfile>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append("search", search);

  const endpoint = `${
    API_CONFIG.ENDPOINTS.USERS
  }/profiles/all?${params.toString()}`;
  return apiRequest<PaginatedResponse<UserProfile>>(endpoint);
}

export async function getDetailedUserProfile(
  userId: number
): Promise<DetailedUserProfile> {
  return apiRequest<DetailedUserProfile>(
    API_CONFIG.ENDPOINTS.USER_BY_ID(userId.toString())
  );
}

export async function getBankDetails(
  employeeId: number
): Promise<BankDetails | null> {
  return apiRequest<BankDetails>(
    API_CONFIG.ENDPOINTS.BANK_DETAILS(employeeId.toString())
  );
}

export async function getEmployeeDocuments(
  employeeId: number
): Promise<EmployeeDocument[]> {
  return apiRequest<EmployeeDocument[]>(
    API_CONFIG.ENDPOINTS.USER_DOCUMENTS(employeeId.toString())
  );
}

export async function getSalaryStructure(
  employeeId: number
): Promise<SalaryComponent[]> {
  return apiRequest<SalaryComponent[]>(
    API_CONFIG.ENDPOINTS.PAYROLL_STRUCTURE(employeeId.toString())
  );
}

export async function getLoanHistory(
  employeeId: number
): Promise<LoanRecord[]> {
  return apiRequest<LoanRecord[]>(
    `${API_CONFIG.ENDPOINTS.LOANS}/employee/${employeeId}`
  );
}

export async function getEmployeeAttendance(
  employeeId: number,
  year?: number,
  month?: number
): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams({
    employee_id: employeeId.toString(),
    limit: "31", // A month will never have more than 31 days
  });
  if (year) {
    params.append("year", year.toString());
  }
  if (month) {
    params.append("month", month.toString());
  }
  return apiRequest<AttendanceRecord[]>(
    `${API_CONFIG.ENDPOINTS.ATTENDANCE_ALL}?${params.toString()}`
  );
}

// HR Administration API functions
export async function getRoles(): Promise<Role[]> {
  return apiRequest<Role[]>(API_CONFIG.ENDPOINTS.ROLES);
}

export async function getRole(id: number): Promise<Role> {
  return apiRequest<Role>(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`);
}

export async function getPermissions(): Promise<Permission[]> {
  return apiRequest<Permission[]>(API_CONFIG.ENDPOINTS.PERMISSIONS);
}

export async function createRole(data: {
  name: string;
  role_level: number;
}): Promise<Role> {
  return apiRequest<Role>(API_CONFIG.ENDPOINTS.ROLES, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateRole(
  id: number,
  data: Partial<{ name: string; role_level: number }>
): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteRole(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.ROLES}/${id}`, {
    method: "DELETE",
  });
}

export async function getJobs(): Promise<Job[]> {
  return apiRequest<Job[]>(API_CONFIG.ENDPOINTS.JOBS);
}

export async function createJob(data: {
  title: string;
  description: string;
}): Promise<Job> {
  return apiRequest<Job>(API_CONFIG.ENDPOINTS.JOBS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateJob(
  id: number,
  data: Partial<{ title: string; description: string }>
): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.JOBS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteJob(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.JOBS}/${id}`, {
    method: "DELETE",
  });
}

export async function getShifts(): Promise<Shift[]> {
  return apiRequest<Shift[]>(API_CONFIG.ENDPOINTS.SHIFTS);
}

export async function createShift(data: {
  name: string;
  from_time_local: string;
  to_time_local: string;
  timezone: string;
  half_day_threshold: number;
  punch_in_margin: number;
  punch_out_margin: number;
}): Promise<Shift> {
  return apiRequest<Shift>(API_CONFIG.ENDPOINTS.SHIFTS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateShift(
  id: number,
  data: Partial<Shift>
): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SHIFTS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteShift(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SHIFTS}/${id}`, {
    method: "DELETE",
  });
}

export async function getSkills(): Promise<Skill[]> {
  return apiRequest<Skill[]>(API_CONFIG.ENDPOINTS.SKILLS);
}

export async function createSkill(data: {
  skill_name: string;
  skill_description: string;
}): Promise<Skill> {
  return apiRequest<Skill>(API_CONFIG.ENDPOINTS.SKILLS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSkill(
  id: number,
  data: Partial<{ skill_name: string; skill_description: string }>
): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SKILLS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteSkill(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SKILLS}/${id}`, {
    method: "DELETE",
  });
}

export async function getDocumentTypes(): Promise<DocumentType[]> {
  return apiRequest<DocumentType[]>(API_CONFIG.ENDPOINTS.DOCUMENT_TYPES);
}

export async function createDocumentType(data: {
  name: string;
  reminder_threshold: number;
}): Promise<DocumentType> {
  return apiRequest<DocumentType>(API_CONFIG.ENDPOINTS.DOCUMENT_TYPES, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDocumentType(
  id: number,
  data: { name: string; reminder_threshold: number }
): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.DOCUMENT_TYPES}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteDocumentType(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.DOCUMENT_TYPES}/${id}`, {
    method: "DELETE",
  });
}

export async function getHolidays(year?: number): Promise<Holiday[]> {
  const params = year ? `?year=${year}` : "";
  return apiRequest<Holiday[]>(`${API_CONFIG.ENDPOINTS.CALENDAR}${params}`);
}

export async function createHoliday(data: {
  name: string;
  holiday_date: string;
}): Promise<Holiday> {
  return apiRequest<Holiday>(API_CONFIG.ENDPOINTS.CALENDAR, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteHoliday(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.CALENDAR}/${id}`, {
    method: "DELETE",
  });
}

// Payroll API functions
export async function getPayrollComponents(): Promise<PayrollComponent[]> {
  return apiRequest<PayrollComponent[]>(
    API_CONFIG.ENDPOINTS.PAYROLL_COMPONENTS
  );
}

export async function createPayrollComponent(data: {
  name: string;
  type: "earning" | "deduction";
}): Promise<PayrollComponent> {
  return apiRequest<PayrollComponent>(API_CONFIG.ENDPOINTS.PAYROLL_COMPONENTS, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePayrollComponent(
  id: number,
  data: Partial<{ name: string; type: "earning" | "deduction" }>
): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_COMPONENTS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePayrollComponent(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_COMPONENTS}/${id}`, {
    method: "DELETE",
  });
}

export async function getPayrollRuns(search?: string): Promise<PayrollRun[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiRequest<PayrollRun[]>(
    `${API_CONFIG.ENDPOINTS.PAYROLL_RUNS}${params}`
  );
}

export async function initiatePayrollRun(data: {
  from_date: string;
  to_date: string;
}): Promise<{ payrollId: number }> {
  return apiRequest<{ payrollId: number }>(
    `${API_CONFIG.ENDPOINTS.PAYROLL_RUNS}/initiate`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function finalizePayrollRun(payrollId: number): Promise<void> {
  await apiRequest(
    `${API_CONFIG.ENDPOINTS.PAYROLL_RUN}/finalize/${payrollId}`,
    {
      method: "PATCH",
    }
  );
}

export async function deletePayrollRun(payrollId: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_RUNS}/${payrollId}`, {
    method: "DELETE",
  });
}

export async function getPayslips(payrollId: number): Promise<Payslip[]> {
  return apiRequest<Payslip[]>(`/payroll/payslip/${payrollId}`);
}

export async function getPayslipDetails(
  payslipId: number
): Promise<PayslipDetail[]> {
  return apiRequest<PayslipDetail[]>(`/payroll/payslip/${payslipId}/edit`);
}

export async function updatePayslipDetail(
  payslipId: number,
  detailId: number,
  data: {
    component_name: string;
    component_type: "earning" | "deduction";
    amount: number;
  }
): Promise<void> {
  await apiRequest(`/payroll/payslip/${payslipId}/details/${detailId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function addPayslipDetail(
  payslipId: number,
  data: {
    component_name: string;
    component_type: "earning" | "deduction";
    amount: number;
  }
): Promise<{ newDetailId: number }> {
  return apiRequest<{ newDetailId: number }>(
    `/payroll/payslip/${payslipId}/details`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function deletePayslipDetail(
  payslipId: number,
  detailId: number
): Promise<void> {
  await apiRequest(`/payroll/payslip/${payslipId}/details/${detailId}`, {
    method: "DELETE",
  });
}

// New API functions for missing functionality
export async function getLeaveRequests(): Promise<LeaveRequest[]> {
  return apiRequest<LeaveRequest[]>(API_CONFIG.ENDPOINTS.LEAVE_APPROVALS);
}

export async function updateLeaveStatus(
  leaveId: number,
  status: "approved" | "rejected"
): Promise<void> {
  await apiRequest(`/leaves/approve-primary/${leaveId}`, {
    method: "POST",
    body: JSON.stringify({ status: status === "approved" }),
  });
}

export async function getSkillApprovals(): Promise<SkillApproval[]> {
  return apiRequest<SkillApproval[]>(API_CONFIG.ENDPOINTS.SKILL_APPROVALS);
}

export async function updateSkillApproval(
  approvalId: number,
  status: "approved" | "rejected"
): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SKILL_APPROVALS}/${approvalId}`, {
    method: "PATCH",
    body: JSON.stringify({ newStatus: status === "approved" ? 1 : 0 }),
  });
}

export async function getLoanRequests(): Promise<LoanApproval[]> {
  return apiRequest<LoanApproval[]>(API_CONFIG.ENDPOINTS.LOAN_APPROVALS);
}

export async function updateLoanStatus(
  loanId: number,
  status: "approved" | "rejected"
): Promise<void> {
  await apiRequest(`/loans/approve/${loanId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// export async function getExpenseClaims(): Promise<ExpenseApproval[]> {
//     return apiRequest<ExpenseApproval[]>(API_CONFIG.ENDPOINTS.EXPENSE_APPROVALS);
// }

export async function updateExpenseStatus(
  expenseId: number,
  status: "approved" | "rejected"
): Promise<void> {
  await apiRequest(`/expense/${expenseId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getUserSkills(userId: number): Promise<UserSkill[]> {
  return apiRequest<UserSkill[]>(
    API_CONFIG.ENDPOINTS.USER_SKILLS(userId.toString())
  );
}

export async function getUserLoans(userId: number): Promise<LoanRecord[]> {
  const params = new URLSearchParams({ userId: userId.toString() });
  return apiRequest<LoanRecord[]>(
    `${API_CONFIG.ENDPOINTS.LOANS}?${params.toString()}`
  );
}

export async function getUserExpenses(
  userId: number
): Promise<ExpenseRecord[]> {
  return apiRequest<ExpenseRecord[]>(
    `${API_CONFIG.ENDPOINTS.EXPENSES}/${userId}`
  );
}

export async function createUser(
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  user: { id: number; email: string };
}> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "API request failed",
      errorData
    );
  }

  return await response.json();
}

export async function searchUsers(
  term: string,
  inActive: boolean = false
): Promise<UserProfile[]> {
  const params = new URLSearchParams({ term });

  if (inActive) {
    params.append("inActive", "true");
  }

  return apiRequest<UserProfile[]>(
    `${API_CONFIG.ENDPOINTS.USER_SEARCH}?${params.toString()}`
  );
}

export async function searchUsersByPermissions(
  permissions: string[]
): Promise<UserProfile[]> {
  const params = new URLSearchParams();
  permissions.forEach((permission) => {
    params.append("permission", permission);
  });
  return apiRequest<UserProfile[]>(
    `${API_CONFIG.ENDPOINTS.PERMISSION_SEARCH}?${params.toString()}`
  );
}

export async function getDirectReports(
  employeeId: number
): Promise<UserProfile[]> {
  return apiRequest<UserProfile[]>(
    `${API_CONFIG.ENDPOINTS.DIRECT_REPORTS}/${employeeId}`
  );
}
export async function getMyReports(): Promise<UserProfile[]> {
  return apiRequest<UserProfile[]>(
    `${API_CONFIG.ENDPOINTS.USERS}/direct-reports`
  );
}

export async function updateUser(
  userId: number,
  data: Partial<DetailedUserProfile>
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.USER_PROFILE}/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function updateSelfProfile(
  data: FormData | Partial<DetailedUserProfile>
): Promise<{ success: boolean; message: string }> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem("hr_token") || ""}`,
  };

  // Add Content-Type only if NOT FormData
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SELF}`,
    {
      method: "PATCH",
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "API request failed",
      errorData
    );
  }

  return await response.json();
}

export async function getCurrentUserProfile(): Promise<DetailedUserProfile> {
  return apiRequest<DetailedUserProfile>(API_CONFIG.ENDPOINTS.USER_PROFILE);
}

export async function updateRolePermissions(
  roleId: number,
  permissionIds: number[]
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.ROLES}/${roleId}/permissions`,
    {
      method: "PUT",
      body: JSON.stringify({ permissionIds }),
    }
  );
}

// Document Management APIs
export async function uploadDocument(
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  document: { id: number; link: string };
}> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENT_UPLOAD}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "API request failed",
      errorData
    );
  }

  return await response.json();
}

export async function getMyDocuments(): Promise<EmployeeDocument[]> {
  return apiRequest<EmployeeDocument[]>(API_CONFIG.ENDPOINTS.MY_DOCUMENTS);
}

export async function uploadEmployeeDocument(
  employeeId: number,
  formData: FormData
): Promise<{
  success: boolean;
  message: string;
  document: { id: number; link: string };
}> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENTS}/employee/${employeeId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "API request failed",
      errorData
    );
  }

  return await response.json();
}

export async function getExpiringDocuments(): Promise<
  Array<{
    id: number;
    upload_link: string;
    expiry_date: string;
    document_name: string;
    employee_name: string;
  }>
> {
  return apiRequest<
    Array<{
      id: number;
      upload_link: string;
      expiry_date: string;
      document_name: string;
      employee_name: string;
    }>
  >(API_CONFIG.ENDPOINTS.EXPIRING_DOCUMENTS);
}

export async function deleteUploadedDocument(
  documentId: number
): Promise<void> {
  await apiRequest(`/documents/uploaded/${documentId}`, {
    method: "DELETE",
  });
}

// Skill Matrix APIs
export async function createSkillRequest(skillId: number): Promise<{
  success: boolean;
  message: string;
  request: { id: number; employee_id: number; skill_id: number; status: null };
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    request: {
      id: number;
      employee_id: number;
      skill_id: number;
      status: null;
    };
  }>(API_CONFIG.ENDPOINTS.SKILL_MATRIX, {
    method: "POST",
    body: JSON.stringify({ skill_id: skillId }),
  });
}

export async function getMySkillRequests(): Promise<
  Array<{
    id: number;
    employee_id: number;
    skill_id: number;
    status: null | 0 | 1;
    approved_by: null | string;
    created_at: string;
    skill_name: string;
  }>
> {
  return apiRequest<
    Array<{
      id: number;
      employee_id: number;
      skill_id: number;
      status: null | 0 | 1;
      approved_by: null | string;
      created_at: string;
      skill_name: string;
    }>
  >(API_CONFIG.ENDPOINTS.MY_SKILL_REQUESTS);
}

export async function updateSkillRequest(
  requestId: number,
  skillId: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.SKILL_MATRIX}/${requestId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ skill_id: skillId }),
    }
  );
}

export async function deleteSkillRequest(requestId: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.SKILL_MATRIX}/${requestId}`, {
    method: "DELETE",
  });
}

export async function getPendingSkillApprovals(): Promise<
  Array<{
    id: number;
    status: null;
    created_at: string;
    first_name: string;
    last_name: string;
    skill_name: string;
  }>
> {
  return apiRequest<
    Array<{
      id: number;
      status: null;
      created_at: string;
      first_name: string;
      last_name: string;
      skill_name: string;
    }>
  >(API_CONFIG.ENDPOINTS.SKILL_APPROVALS);
}

export async function approveSkillRequest(
  requestId: number,
  status: 0 | 1
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.SKILL_APPROVALS}/${requestId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ newStatus: status }),
    }
  );
}

// Leave Management APIs
export async function getLeaveTypes(): Promise<LeaveType[]> {
  return apiRequest<LeaveType[]>(API_CONFIG.ENDPOINTS.LEAVE_TYPES);
}

export async function createLeaveType(data: {
  name: string;
  description: string;
  initial_balance: number;
}): Promise<{
  success: boolean;
  message: string;
  leaveType: LeaveType;
}> {
  return apiRequest<{
    success: boolean;
    message: string;
    leaveType: LeaveType;
  }>(API_CONFIG.ENDPOINTS.LEAVE_TYPES, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLeaveType(
  id: number,
  data: Partial<LeaveType>
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.LEAVE_TYPES}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteLeaveType(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.LEAVE_TYPES}/${id}`, {
    method: "DELETE",
  });
}

export async function requestLeave(data: {
  leave_type: number;
  leave_description: string;
  from_date: string;
  to_date: string;
}): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    API_CONFIG.ENDPOINTS.REQUEST_LEAVE,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

// export async function getMyLeaveRecords(): Promise<LeaveBalance[]> {
//   return apiRequest<LeaveBalance[]>(API_CONFIG.ENDPOINTS.LEAVE_RECORDS)
// }

export async function deleteLeaveRequest(recordId: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.LEAVE_REQUEST}/${recordId}`, {
    method: "DELETE",
  });
}

export async function getPrimaryLeaveApprovals(): Promise<LeaveRecord[]> {
  return apiRequest<LeaveRecord[]>(
    API_CONFIG.ENDPOINTS.PRIMARY_LEAVE_APPROVALS
  );
}

export async function approvePrimaryLeave(
  recordId: number,
  status: boolean,
  rejectionReason?: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.PRIMARY_LEAVE_APPROVALS}/${recordId}`,
    {
      method: "POST",
      body: JSON.stringify({ status, rejection_reason: rejectionReason || "" }),
    }
  );
}

export async function getSecondaryLeaveApprovals(): Promise<LeaveRecord[]> {
  return apiRequest<LeaveRecord[]>(
    API_CONFIG.ENDPOINTS.SECONDARY_LEAVE_APPROVALS
  );
}

export async function approveSecondaryLeave(
  recordId: number,
  status: boolean,
  rejectionReason?: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.SECONDARY_LEAVE_APPROVALS}/${recordId}`,
    {
      method: "POST",
      body: JSON.stringify({ status, rejection_reason: rejectionReason || "" }),
    }
  );
}

export async function getEmployeeLeaveBalance(
  employeeId: number
): Promise<LeaveBalance[]> {
  return apiRequest<LeaveBalance[]>(
    `${API_CONFIG.ENDPOINTS.LEAVE_BALANCE}/${employeeId}`
  );
}
export async function getMyEncashableLeaves(
  employeeId: number
): Promise<LeaveBalance[]> {
  return apiRequest<LeaveBalance[]>(`/leaves/encashable-balance`);
}

export async function getEmployeeLeaveRecords(
  employeeId: number,
  startDate?: string,
  endDate?: string
): Promise<LeaveRecord[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const endpoint = `${API_CONFIG.ENDPOINTS.LEAVE_RECORDS}/${employeeId}${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  return apiRequest<LeaveRecord[]>(endpoint);
}

// Expense Management APIs
export async function createExpense(data: {
  employee_id: number;
  expense_title: string;
  expense_description: string;
  expense: number;
  jv: string;
}): Promise<{ success: boolean; message: string; expense: ExpenseRecord }> {
  return apiRequest<{
    success: boolean;
    message: string;
    expense: ExpenseRecord;
  }>(API_CONFIG.ENDPOINTS.EXPENSES, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getExpenses(
  employeeId?: number
): Promise<ExpenseRecord[]> {
  const params = employeeId ? `?employee_id=${employeeId}` : "";
  return apiRequest<ExpenseRecord[]>(
    `${API_CONFIG.ENDPOINTS.EXPENSES}${params}`
  );
}

export async function getExpense(id: number): Promise<ExpenseRecord> {
  return apiRequest<ExpenseRecord>(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`);
}

export async function updateExpense(
  id: number,
  data: Partial<ExpenseRecord>
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteExpense(id: number): Promise<void> {
  await apiRequest(`${API_CONFIG.ENDPOINTS.EXPENSES}/${id}`, {
    method: "DELETE",
  });
}

// Bank Details APIs
export async function getMyBankDetails(): Promise<BankDetails> {
  return apiRequest<BankDetails>(API_CONFIG.ENDPOINTS.MY_BANK_DETAILS);
}

export async function updateMyBankDetails(data: {
  bank_name: string;
  bank_account: string;
  bank_ifsc: string;
}): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    API_CONFIG.ENDPOINTS.MY_BANK_DETAILS,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateEmployeeBankDetails(
  employeeId: number,
  data: { bank_name: string; bank_account: string; bank_ifsc: string }
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    API_CONFIG.ENDPOINTS.BANK_DETAILS(employeeId.toString()),
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteEmployeeBankDetails(
  employeeId: number
): Promise<void> {
  await apiRequest(
    `${API_CONFIG.ENDPOINTS.BANK_DETAILS(employeeId.toString())}`,
    {
      method: "DELETE",
    }
  );
}

// Attendance Management APIs
export async function punchIn(
  time_local: string,
  timezone: string,
  employee_id: number
): Promise<{ message: string; attendanceStatus: string }> {
  const data = {
    time_local: time_local,
    timezone: timezone,
    employee_id: employee_id,
  };
  return apiRequest<{ message: string; attendanceStatus: string }>(
    API_CONFIG.ENDPOINTS.PUNCH_IN,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function punchOut(
  time_local: string,
  timezone: string,
  employee_id: number
): Promise<{ message: string; attendanceStatus: string }> {
  const data = {
    time_local: time_local,
    timezone: timezone,
    employee_id: employee_id,
  };
  return apiRequest<{ message: string; attendanceStatus: string }>(
    API_CONFIG.ENDPOINTS.PUNCH_OUT,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  return apiRequest<AttendanceRecord[]>(API_CONFIG.ENDPOINTS.ATTENDANCE_ALL);
}

// export async function getAllAttendance(params?: {
//   employee_id?: number
//   shift_id?: number
//   date?: string
//   week?: number
//   month?: number
//   year?: number
//   page?: number
//   limit?: number
// }): Promise<AttendanceRecord[]> {
//   const searchParams = new URLSearchParams()
//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined) {
//         searchParams.append(key, value.toString())
//       }
//     })
//   }

//   const endpoint = `${API_CONFIG.ENDPOINTS.ATTENDANCE_ALL}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
//   return apiRequest<AttendanceRecord[]>(endpoint)
// }
export async function getAllAttendance(
  params: {
    employee_id?: number;
    shift_id?: number;
    date?: string; // Changed from day, month, year to a single date string
    week?: number;
    month?: number;
    year?: number;
    page?: number;
    limit?: number;
  } = {}
): Promise<AttendanceRecord[]> {
  const query = new URLSearchParams();
  if (params.employee_id)
    query.append("employee_id", String(params.employee_id));
  if (params.shift_id) query.append("shift_id", String(params.shift_id));
  if (params.date) query.append("date", params.date);
  if (params.week) query.append("week", String(params.week));
  if (params.month) query.append("month", String(params.month));
  if (params.year) query.append("year", String(params.year));
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));

  return apiRequest<AttendanceRecord[]>(`/attendance/all?${query.toString()}`);
}

export async function updateAttendancePayType(
  recordId: number,
  payType: "unpaid" | "full_day" | "half_day"
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `/attendance/update/pay-type/${recordId}`,
    {
      method: "POST",
      body: JSON.stringify({ pay_type: payType }),
    }
  );
}

export async function approveOvertime(
  recordId: number,
  status: 0 | 1
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `/attendance/update/overtime/${recordId}`,
    {
      method: "POST",
      body: JSON.stringify({ status }),
    }
  );
}

// Calendar/Holiday Management APIs

export async function updateWorkWeek(
  data: Array<{ day_of_week: string; is_working_day: boolean }>
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    API_CONFIG.ENDPOINTS.WORK_WEEK,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

// Loan Management APIs
export async function createLoan(data: {
  loan_type: "loan" | "advance";
  title: string;
  description?: string;
  principal_amount: number;
  total_installments: number;
}): Promise<{ success: boolean; message: string; loan: LoanRecord }> {
  return apiRequest<{ success: boolean; message: string; loan: LoanRecord }>(
    API_CONFIG.ENDPOINTS.LOANS,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function getMyLoans(): Promise<LoanRecord[]> {
  return apiRequest<LoanRecord[]>(API_CONFIG.ENDPOINTS.MY_LOANS);
}

export async function getAllLoans(status?: string): Promise<LoanRecord[]> {
  return apiRequest<LoanRecord[]>(`${API_CONFIG.ENDPOINTS.LOAN_APPROVALS}`);
}

export async function approveLoan(
  loanId: number,
  status: "approved" | "rejected",
  disbursementDate?: string
): Promise<{ success: boolean; message: string }> {
  const body: any = { status };
  if (disbursementDate) body.disbursement_date = disbursementDate;

  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.LOANS}/approve/${loanId}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );
}
// Add this new function to your existing lib/api.ts file

export async function addRepayment(
  loanId: number,
  amount: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.LOANS}/${loanId}/repay`,
    {
      method: "POST",
      body: JSON.stringify({ amount }),
    }
  );
}
export async function getApprovedLoans(): Promise<LoanRecord[]> {
  return apiRequest<LoanRecord[]>(`${API_CONFIG.ENDPOINTS.LOANS}/approved`);
}

export async function getLoanRepayments(
  loanId: number
): Promise<LoanRepayment[]> {
  return apiRequest<LoanRepayment[]>(
    `${API_CONFIG.ENDPOINTS.LOANS}/repayments/${loanId}`
  );
}

export async function editLoan(
  loanId: number,
  data: Partial<LoanRecord>
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.LOANS}/edit/${loanId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}
export async function rescheduleEmi(
  new_emi_amount: number,
  scheduleId: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.LOANS}/repayment/reschedule/${scheduleId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ new_emi_amount }),
    }
  );
}
export async function makeLumpSumPayment(
  applicationId: number,
  paid_amount: number,
  repayment_date: string,
  transaction_id: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `${API_CONFIG.ENDPOINTS.LOANS}/repayment/lump-sum/${applicationId}`,
    {
      method: "POST",
      body: JSON.stringify({ paid_amount, repayment_date, transaction_id }),
    }
  );
}

// Salary Structure Management APIs
// export async function assignSalaryComponent(
//   employeeId: number,
//   data: {
//     component_id: number
//     value_type: "fixed" | "percentage"
//     value: number
//     based_on_component_id?: number
//   },
// ): Promise<{ success: boolean; message: string }> {
//   return apiRequest<{ success: boolean; message: string }>(
//     `${API_CONFIG.ENDPOINTS.PAYROLL_STRUCTURE(employeeId.toString())}`,
//     {
//       method: "POST",
//       body: JSON.stringify(data),
//     },
//   )
// }

export async function getMySalaryStructure(): Promise<SalaryComponent[]> {
  return apiRequest<SalaryComponent[]>(
    API_CONFIG.ENDPOINTS.MY_SALARY_STRUCTURE
  );
}

// export async function removeSalaryComponent(employeeId: number, componentId: number): Promise<void> {
//   await apiRequest(`${API_CONFIG.ENDPOINTS.PAYROLL_STRUCTURE(employeeId.toString())}/components/${componentId}`, {
//     method: "DELETE",
//   })
// }

export async function updateSalaryComponent(
  employeeId: number,
  componentId: number,
  data: Partial<SalaryComponent>
): Promise<{ success: boolean; message: string }> {
  return await apiRequest(
    `${API_CONFIG.ENDPOINTS.PAYROLL_STRUCTURE(
      employeeId.toString()
    )}/components/${componentId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function getExpensesSummary(): Promise<ExpenseSummary[]> {
  return await apiRequest(`${API_CONFIG.ENDPOINTS.SUMMARY_EXPENSES}`, {
    method: "GET",
  });
}

/**
 * @description Fetches the payroll report Excel file from the API and triggers a download in the browser.
 * @param payrollId The ID of the payroll run to generate the report for.
 * @returns A promise that resolves when the download is initiated, or rejects on error.
 */
export async function downloadPayrollReport(payrollId: number): Promise<void> {
  // Get the auth token from wherever you store it (e.g., localStorage, cookies)
  const token = localStorage.getItem("hr_token");

  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.REPORT_PAYROLL_RUN}/${payrollId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          // No 'Content-Type': 'application/json' needed here
        },
      }
    );

    if (!response.ok) {
      // If the server returns an error (e.g., 404, 500), handle it
      const errorData = await response.json(); // Try to parse error message as JSON
      throw new Error(errorData.message || "Failed to download the report.");
    }

    // 1. Get the binary data (the file itself) as a Blob
    const blob = await response.blob();

    // 2. Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // 3. Create a temporary, hidden link element
    const link = document.createElement("a");
    link.href = url;

    // 4. Extract the filename from the 'Content-Disposition' header sent by the server
    const contentDisposition = response.headers.get("content-disposition");
    let filename = `Payroll_Report_${payrollId}.xlsx`; // A default filename
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch!.length > 1) {
        filename = filenameMatch![1];
      }
    }
    link.setAttribute("download", filename);

    // 5. Add the link to the page, click it to trigger the download, and then remove it
    document.body.appendChild(link);
    link.click();
    link.parentNode!.removeChild(link);

    // 6. Clean up the temporary URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
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
  return apiRequest<NameSeries[]>("/settings/name-series");
}

export async function createNameSeries(data: {
  table_name: string;
  prefix: string;
  padding_length: number;
}): Promise<NameSeries> {
  return apiRequest<NameSeries>("/settings/name-series", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateNameSeries(
  id: number,
  data: { table_name: string; prefix: string; padding_length: number }
): Promise<void> {
  await apiRequest(`/settings/name-series/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deactivateUser(
  userId: number,
  inactive_reason: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `/user/deactivate/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ inactive_reason }),
    }
  );
}

export interface UserAudit {
  audit_id: number;
  field_changed: string;
  old_value: string;
  new_value: string;
  updated_at: string;
  updated_by_name: string;
  updated_by: number;
}

export async function getUserAuditHistory(
  userId: number
): Promise<UserAudit[]> {
  return apiRequest<UserAudit[]>(`/user/audit/${userId}`);
}

export async function downloadUserTemplate(): Promise<void> {
  const token = localStorage.getItem("hr_token");
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/user/template`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to download template.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const contentDisposition = response.headers.get("content-disposition");
    let filename = "user_template.xlsx"; // Default filename
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    link.parentNode!.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}

export async function bulkUploadUsers(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/user/bulk-upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      // Don't set Content-Type, browser does it for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "API request failed",
      errorData
    );
  }

  return await response.json();
}

export interface AttendanceRecord {
  id: number;
  attendance_date: string;
  punch_in: string | null;
  punch_out: string | null;
  hours_worked: string | null;
  attendance_status: "Present" | "Absent" | "Leave" | "Half-Day";
  is_late: number;
  is_early_departure: number;
  short_hours: string | null;
  first_name: string;
  last_name: string;
  updated_by_name: string;
  overtime_hours: string | null;
  overtime_status: "pending_approval" | "approved" | "rejected" | null;
  employee_id: number;
  rejection_reason?: string;
  overtime_processed_by?: string;
}

export interface OvertimeRecord {
  id: number;
  attendance_record_id: number | null;
  employee_id: number;
  request_date: string;
  overtime_hours: string;
  approved_hours: string;
  status: "pending_approval" | "approved" | "rejected";
  overtime_type: "regular" | "holiday";
  overtime_start: string;
  overtime_end: string;
  processed_by: number | null;
  processed_at: string | null;
  rejection_reason: string | null;
  employee_name: string;
  reason: string | null;
  processed_by_name: string | null;
}
export interface RequestOvertimePayload {
  attendance_date: string;
  overtime_start: string;
  overtime_end: string;
  overtime_type?: "regular" | "holiday" | string;
  reason: string;
  timezone: string;
}

export async function getOvertimeApprovals(
  employee_id?: number
): Promise<OvertimeRecord[]> {
  let path = "/attendance/overtime/approvals";
  if (employee_id) {
    path = `/attendance/overtime/approvals/${employee_id}`;
  }
  return apiRequest<OvertimeRecord[]>(path);
}

export async function processOvertimeRequest(
  overtimeId: number,
  data: {
    status: "approved" | "rejected";
    approved_hours?: number;
    rejection_reason?: string;
  }
): Promise<void> {
  await apiRequest(`/attendance/overtime/process/${overtimeId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function editOvertimeRequest(
  overtimeId: number,
  data: Partial<OvertimeRecord>
): Promise<void> {
  await apiRequest(`/attendance/overtime/edit/${overtimeId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
export async function requestOvertime(
  data: RequestOvertimePayload
): Promise<void> {
  await apiRequest(`/attendance/overtime/request`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function getMyOvertimeRecords(): Promise<OvertimeRecord[]> {
  return apiRequest<OvertimeRecord[]>(`/attendance/overtime/my-records`);
}

export interface AttendanceSummary {
  total_hours_worked: string;
  total_short_hours: string;
  late_days: number;
  early_departures: number;
  absent_days: number;
  leave_days: number;
  present_days: number;
  half_days: number;
  overtime: {
    requested: string;
    approved: string;
    rejected: string;
  };
}

export async function getAttendanceRecordById(
  recordId: number
): Promise<AttendanceRecord> {
  return apiRequest<AttendanceRecord>(`/attendance/${recordId}`);
}

export async function getAttendanceSummary(
  employeeId: number,
  year: number,
  month: number
): Promise<AttendanceSummary> {
  return apiRequest<AttendanceSummary>(
    `/attendance/summary/${employeeId}/${year}/${month}`
  );
}

export interface Holiday {
  id: number;
  name: string;
  holiday_date: string;
}

export async function getHoliday(year: number): Promise<Holiday[]> {
  return apiRequest<Holiday[]>(`/settings/holidays?year=${year}`);
}

export interface UserByShift {
  id: number;
  first_name: string;
  last_name: string;
  full_employee_id: string;
}
export async function getUserByShift(shiftId: number): Promise<UserByShift[]> {
  return apiRequest<UserByShift[]>(
    `${API_CONFIG.BASE_URL}/${API_CONFIG.ENDPOINTS.SHIFTS}/${shiftId}/users`
  );
}
// export async function getUserWithUnmarkedAttendance(shiftId: number,date:string): Promise<UserByShift[]> {
//     return apiRequest<UserByShift[]>(`${API_CONFIG.ENDPOINTS.SHIFTS}/${shiftId}/unmarked-attendance/${date}`);
// }

export async function getUserWithUnmarkedAttendance(
  shiftId: number,
  date: string,
  punchoutOnly?: boolean
): Promise<UserByShift[]> {
  const url = `/shifts/${shiftId}/unmarked-attendance/${date}${
    punchoutOnly ? "?punchout=true" : ""
  }`;
  return apiRequest<UserByShift[]>(url);
}

export async function bulkCreateAttendance(data: {
  reason: string;
  attendance_date: string;
  punch_in_local?: string;
  punch_out_local?: string;
  timezone: string;
  is_late?: boolean;
  is_early_departure?: boolean;
  records: { employee_id: number }[];
}): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>("/attendance/bulk", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getLeaveRecordById(id: number): Promise<LeaveRecord> {
  return apiRequest<LeaveRecord>(`${API_CONFIG.ENDPOINTS.LEAVES}/${id}`);
}

export async function downloadLeaveApplication(leaveId: number): Promise<void> {
  const token = localStorage.getItem("hr_token");
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/leaves/download/${leaveId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || "Failed to download the leave application."
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const contentDisposition = response.headers.get("content-disposition");
    let filename = `Leave_Application_${leaveId}.pdf`; // Default
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}

export interface LeaveLedgerEntry {
  id: number;
  transaction_date: string;
  transaction_type: "deduction" | "accrual" | "adjustment";
  previous_balance: string;
  change_amount: string;
  new_balance: string;
  leave_record_id: number | null;
  leave_type_name: string;
}

export async function getLeaveLedger(
  employeeId: number,
  leaveTypeId: number
): Promise<LeaveLedgerEntry[]> {
  return apiRequest<LeaveLedgerEntry[]>(
    `/leaves/ledger/${employeeId}?leave_type_id=${leaveTypeId}`
  );
}

export interface WorkWeekDay {
  day_of_week: string;
  is_working_day: boolean;
}

// ... existing code ...

export async function getMyLeaveRecords(
  startDate?: string,
  endDate?: string
): Promise<LeaveRecord[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  return apiRequest<LeaveRecord[]>(
    `${API_CONFIG.ENDPOINTS.LEAVE_RECORDS}?${params.toString()}`
  );
}

export async function getWorkWeek(): Promise<
  Array<{ day_of_week: string; is_working_day: boolean }>
> {
  return apiRequest<Array<{ day_of_week: string; is_working_day: boolean }>>(
    API_CONFIG.ENDPOINTS.WORK_WEEK
  );
}

export interface SkillMatrixData {
  id: number;
  skill_name: string;
  employee_count: number;
}

export async function getSkillMatrix(): Promise<SkillMatrixData[]> {
  return apiRequest<SkillMatrixData[]>("/skillMatrix/matrix");
}

// ... (existing code at the top of the file)

// EXPENSE MANAGEMENT INTERFACES
export interface ExpenseCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  updated_by: number;
}

export interface ExpenseClaim {
  id: number;
  claim_type: "Reimbursement" | "Advance";
  employee_id: number;
  category_id: number;
  title: string;
  description?: string;
  amount: number;
  expense_date: string;
  status:
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Processed"
    | "Reimbursed"
    | "Locked";
  receipt_url?: string;
  rejection_reason?: string | null;
  transaction_id?: string | null;
  approved_by?: number | null;
  processed_by?: number | null;
  created_at: string;
  updated_at: string;
  category_name: string;
  employee_name: string;
  approver_name?: string | null;
  processor_name?: string | null;
  reimbursement_method?: string | null;
  reimbursed_in_payroll_id?: number | null;
}

// ... (rest of the interfaces)

// EXPENSE CATEGORY FUNCTIONS
export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  return apiRequest<ExpenseCategory[]>("/expense/categories");
}

export async function createExpenseCategory(data: {
  name: string;
  description?: string;
}): Promise<{ success: boolean; message: string; categoryId: number }> {
  return apiRequest("/expense/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExpenseCategory(
  id: number,
  data: { name: string; description?: string }
): Promise<void> {
  await apiRequest(`/expense/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteExpenseCategory(id: number): Promise<void> {
  await apiRequest(`/expense/categories/${id}`, { method: "DELETE" });
}

export async function submitExpenseClaim(
  data: FormData
): Promise<{ success: boolean; message: string }> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem("hr_token") || ""}`,
  };

  // Add Content-Type only if NOT FormData
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/expense/claim`, {
    method: "POST",
    headers,
    body: data instanceof FormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "API request failed",
      errorData
    );
  }

  return await response.json();
}

export async function updateExpenseClaim(
  data: { title: string; description: string; amount: number },
  id: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/expense/claims/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
export async function deleteExpenseClaim(
  id: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/expense/claims/${id}`, { method: "DELETE" });
}
// EXPENSE CLAIMS & ADVANCES FUNCTIONS
// export async function submitExpenseClaim(formData: FormData): Promise<{ success: boolean; message: string; claimId: number }> {
//   // For multipart requests, the body is passed directly without stringifying
//   return apiRequest('/expense/claim', { method: 'POST', body: formData, multipart: true });
// }

export async function getExpenseClaims(params?: {
  employee_id?: number;
  status?: string;
  claim_type?: string;
}): Promise<ExpenseClaim[]> {
  const query = new URLSearchParams();
  if (params?.employee_id)
    query.append("employee_id", String(params.employee_id));
  if (params?.status) query.append("status", params.status);
  if (params?.claim_type) query.append("claim_type", params.claim_type);
  const queryString = query.toString();
  return apiRequest<ExpenseClaim[]>(
    `/expense/claims${queryString ? `?${queryString}` : ""}`
  );
}

// APPROVAL WORKFLOW FUNCTIONS
export async function getExpenseApprovals(): Promise<ExpenseClaim[]> {
  return apiRequest<ExpenseClaim[]>("/expense/approvals");
}

export async function processExpenseClaim(
  claimId: number,
  data: { status: "Approved" | "Rejected"; rejection_reason?: string }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/expense/process/${claimId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function reimburseExpenseClaim(
  claimId: number,
  data: { transaction_id: string; reimbursement_method: string }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/expense/reimburse/${claimId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function adminUpdateExpense(
  claimId: number,
  data: Partial<ExpenseClaim>
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/expense/admin/claim/${claimId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function createExpenseAdvance(data: {
  employee_id: number;
  category_id: number;
  title: string;
  description?: string;
  amount: number;
  expense_date: string;
}): Promise<{ success: boolean; message: string; claimId: number }> {
  return apiRequest("/expense/advance", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function reimburseAdvance(
  claimId: number,
  transaction_id: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/expense/advance/reimburse/${claimId}`, {
    method: "PATCH",
    body: JSON.stringify({ transaction_id }),
  });
}

export async function getProcessedClaims(
  startDate?: string,
  endDate?: string
): Promise<ExpenseClaim[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const queryString = params.toString();
  return apiRequest(
    `/expense/claims/processed${queryString ? `?${queryString}` : ""}`
  );
}

export async function getUpcomingPayrollReimbursements(
  startDate?: string,
  endDate?: string
): Promise<ExpenseClaim[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const queryString = params.toString();
  return apiRequest(
    `/expense/claims/upcoming-payroll${queryString ? `?${queryString}` : ""}`
  );
}

export interface LoanType {
  id: number;
  name: string;
  is_advance: boolean;
  interest_rate: number;
  max_tenure_months: number;
  eligibility_percentage: number;
}

export interface LoanEligibility {
  eligible_base_amount: number;
  eligible_products: Array<{
    loan_type_id: number;
    name: string;
    is_advance: boolean;
    interest_rate: number;
    max_tenure_months: number;
    max_eligible_amount: number;
  }>;
}
export interface Repayment {
  id: number;
  loan_application_id: number;
  schedule_id: number;
  payslip_id: number | null;
  repayment_amount: string;
  repayment_date: string;
  transaction_id: string | null;
  created_at: string;
}

export interface LoanApplication {
  id: number;
  application_id_text: string;
  employee_id: number;
  loan_type_id: number;
  requested_amount: string;
  approved_amount: string | null;
  tenure_months: number;
  emi_amount: string | null;
  interest_rate: string;
  purpose: string | null;
  status: "Pending Approval" | "Approved" | "Rejected" | "Disbursed" | "Closed";
  manager_approver_id: number | null;
  hr_approver_id: number | null;
  rejection_reason: string | null;
  disbursement_date: string | null;
  jv_number: string | null;
  created_at: string;
  updated_at: string;
  loan_type_name: string;
  is_advance: number; // is_advance is 0 or 1
  employee_name: string;
  manager_approver_name: string | null;
  hr_approver_name: string | null;
  amortization_schedule: AmortizationEntry[];
  manual_repayments: Repayment[];
}

export interface AmortizationEntry {
  id: number;
  loan_application_id: number;
  due_date: string;
  emi_amount: string;
  principal_component: string;
  interest_component: string;
  status: "Pending" | "Paid";
  repayment_id: number | null;
}
export interface ManualRepayment {
  id: number;
  schedule_id: number;
  repayment_date: string;
  transaction_id: string;
}

export interface OngoingLoan {
  id: number;
  application_id_text: string;
  approved_amount: string;
  emi_amount: string;
  tenure_months: number;
  loan_type_name: string;
  emis_paid: number;
  total_emis: number;
}

export async function getOngoingLoans(
  employeeId: number
): Promise<OngoingLoan[]> {
  return apiRequest(`/loans/applications/ongoing/${employeeId}`);
}

// Loan Type Management
export async function getLoanTypes(): Promise<LoanType[]> {
  return apiRequest("/loans/types");
}

export async function createLoanType(
  data: Partial<LoanType>
): Promise<{ success: boolean; message: string; loanTypeId: number }> {
  return apiRequest("/loans/types", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLoanType(
  id: number,
  data: Partial<LoanType>
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/loans/types/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Employee Application Process
export async function getLoanEligibility(): Promise<LoanEligibility> {
  return apiRequest("/loans/eligibility");
}

export async function applyForLoan(data: {
  loan_type_id: number;
  requested_amount: number;
  tenure_months: number;
  purpose: string;
}): Promise<{
  success: boolean;
  message: string;
  applicationId: number;
  application_id_text: string;
}> {
  return apiRequest("/loans/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Approval & Disbursement Workflow
export async function getPendingApprovals(): Promise<LoanApplication[]> {
  return apiRequest("/loans/approvals");
}

export async function processLoanApplication(
  applicationId: number,
  data: {
    status: "Approved" | "Rejected";
    approved_amount?: number;
    rejection_reason?: string;
  }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/loans/process/${applicationId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function disburseLoan(
  applicationId: number,
  data: { disbursement_date: string; jv_number: string }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/loans/disburse/${applicationId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Viewing & Tracking Applications
export async function getLoanApplications(): Promise<LoanApplication[]> {
  return apiRequest("/loans/applications");
}
export async function getLoanApplicationsByEmployee(
  employeeId: number
): Promise<LoanApplication[]> {
  return apiRequest(`/loans/applications?employee_id=${employeeId}`);
}

export async function getLoanApplicationDetails(
  applicationId: number
): Promise<LoanApplication> {
  return apiRequest(`/loans/applications/${applicationId}`);
}

// Repayment & Closure
export async function manualRepayment(
  scheduleId: number,
  data: { repayment_date: string; transaction_id: string }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/loans/repayment/manual/${scheduleId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function forecloseLoan(
  applicationId: number
): Promise<{
  success: boolean;
  message: string;
  final_settlement_amount: number;
}> {
  return apiRequest(`/loans/foreclose/${applicationId}`, { method: "POST" });
}

export async function adminUpdateLoanApplication(
  applicationId: number,
  data: {
    approved_amount?: number;
    interest_rate?: number;
    tenure_months?: number;
  }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/loans/admin/update/${applicationId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function downloadLoanAgreement(
  applicationId: number,
  fileName: string
): Promise<void> {
  const token = localStorage.getItem("hr_token");
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/loans/download/${applicationId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download file.");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.pdf` || "loan-agreement.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export interface PayrollComponentDef {
  id: number;
  name: string;
  type: "earning" | "deduction";
}

export interface PayrollParameter {
  name: string;
  value: string;
}

export interface FormulaComponent {
  type:
    | "component"
    | "standard_parameter"
    | "number"
    | "operator"
    | "parenthesis";
  value: string;
}

// Updated interface to match the detailed API response
export interface EmployeeSalaryStructure {
  id: number;
  component_name: string;
  component_type: "earning" | "deduction";
  calculation_type: "Fixed" | "Percentage" | "Formula";
  value: string | null; // Value can be a number or percentage
  custom_formula: FormulaComponent[] | null;
  based_on_component_name: string | null;
  component_id: number;
  calculated_amount: number;
}

// Manage Payroll Component Definitions
export async function createPayrollComponentDef(data: {
  name: string;
  type: "earning" | "deduction";
}): Promise<{
  success: boolean;
  message: string;
  component: PayrollComponentDef;
}> {
  return apiRequest("/payroll/components", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// export async function getPayrollComponentDefs(): Promise<PayrollComponentDef[]> {
//   return apiRequest('/payroll/components');
// }

export async function updatePayrollComponentDef(
  id: number,
  data: { name?: string; type?: "earning" | "deduction" }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/payroll/components/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePayrollComponentDef(id: number): Promise<void> {
  await apiRequest(`/payroll/components/${id}`, { method: "DELETE" });
}

// Fetch Formula Building Blocks
export async function getPayrollParams(): Promise<PayrollParameter[]> {
  return apiRequest("/payroll/structure/params");
}

// Manage Employee's Salary Structure
export async function getEmployeeSalaryStructure(
  employeeId: number
): Promise<EmployeeSalaryStructure[]> {
  return apiRequest(`/payroll/structure/${employeeId}`);
}

export async function assignSalaryComponent(
  employeeId: number,
  data: any
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/payroll/structure/${employeeId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function removeSalaryComponent(
  employeeId: number,
  componentId: number
): Promise<void> {
  await apiRequest(
    `/payroll/structure/${employeeId}/components/${componentId}`,
    { method: "DELETE" }
  );
}

export interface BenefitBand {
  id?: number;
  band_name: string;
  min_years_service: number;
  max_years_service: number;
  leave_salary_calculation: "Basic" | "Gross";
  leave_salary_percentage: number;
  lta_allowance: number;
  lta_frequency_years: number;
  additional_annual_leaves: number;
  medical_plan_details: string;
  education_allowance_per_child: number;
  fuel_allowance_monthly: number;
}

export interface MyBenefits extends BenefitBand {
  years_of_service: string;
}

// Manage Benefit Bands (Admin)
export async function createBenefitBand(
  data: BenefitBand
): Promise<{ success: boolean; message: string; bandId: number }> {
  return apiRequest("/benefits/bands", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getBenefitBands(): Promise<BenefitBand[]> {
  return apiRequest("/benefits/bands");
}

export async function updateBenefitBand(
  id: number,
  data: Partial<BenefitBand>
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/benefits/bands/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Employee Benefit Assignment
export async function getMyBenefits(): Promise<MyBenefits> {
  return apiRequest("/benefits/my-band");
}

export interface LeaveBalance {
  id: number;
  leave_type_name: string;
  is_encashable: boolean;
  balance: string;
}

export interface LeaveEncashmentRequest {
  id: number;
  employee_id: number;
  request_date: string;
  days_to_encash: string;
  calculated_amount: string;
  status: "Pending" | "Approved" | "Rejected" | "Processed"; // Added 'Processed'
  employee_name: string;
  jv_number?: string;
  rejection_reason?: string;
  leave_type_id: number;
}

export async function submitLeaveEncashment(data: {
  leave_type_id: number;
  days_to_encash: number;
}): Promise<{ success: boolean; message: string; encashmentId: number }> {
  return apiRequest("/leaves/encashment/request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Admin gets ALL requests (can be filtered on the frontend)
export async function getLeaveEncashmentRequests(params?: {
  employee_id?: number;
  status?: string;
}): Promise<LeaveEncashmentRequest[]> {
  const query = new URLSearchParams();
  if (params?.employee_id)
    query.append("employee_id", String(params.employee_id));
  if (params?.status) query.append("status", params.status);
  const queryString = query.toString();
  return apiRequest(
    `/leaves/encashment/all${queryString ? `?${queryString}` : ""}`
  );
}

// Manager approves or rejects a 'Pending' request
export async function approveLeaveEncashment(
  id: number,
  data: { status: "Approved" | "Rejected"; rejection_reason?: string }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/leaves/encashment/approval/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Finance/HR disburses an 'Approved' request
export async function disburseLeaveEncashment(
  id: number,
  data: { jv_number: string }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/leaves/encashment/disburse/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export interface EosSettlement {
  id: number;
  employee_id: number;
  last_working_date: string;
  termination_type:
    | "Resignation"
    | "Termination"
    | "End of Contract"
    | "Retirement";
  net_settlement_amount: string;
  status: "Pending" | "Approved" | "Paid";
  employee_name: string;
}

// V2 Detailed Interface with Breakdowns
export interface EosSettlementDetails {
  id: number;
  employee_id: number;
  last_working_date: string;
  termination_type:
    | "Resignation"
    | "Termination"
    | "End of Contract"
    | "Retirement";
  termination_reason: string | null;
  notes: string | null;
  leave_encashment_amount: string;
  leave_encashment_breakdown: {
    basic_salary: number;
    daily_rate: string;
    total_leave_balance: number;
    unpaid_days_deducted: number;
    net_encashable_days: number;
    calculation: string;
  };
  gratuity_amount: string;
  gratuity_breakdown: {
    service_years: string;
    basic_salary: number;
    breakdown: {
      years: number | string;
      rate_in_days: number;
      days_payable: number | string;
    }[];
    total_days_payable: string;
    calculation: string;
  };
  loan_deduction_amount: string;
  loan_deduction_breakdown: {
    loan_id: string;
    outstanding_principal: string;
  }[];
  case_deduction_amount: string;
  case_deduction_breakdown: {
    case_id: string;
    title: string;
    amount: string;
  }[];
  other_deductions: string;
  total_additions: string;
  total_deductions: string;
  net_settlement_amount: string;
  status: "Pending" | "Approved" | "Paid";
  jv_number: string | null;
  employee_name: string;
}

// 1. Initiate a New Settlement
export async function initiateSettlement(data: {
  employee_id: number;
  termination_type: string;
  last_working_date: string;
  termination_reason?: string;
  notes?: string;
}): Promise<{ success: boolean; message: string }> {
  return apiRequest("/eos/initiate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 2. Get All Settlements
export async function getAllSettlements(): Promise<EosSettlement[]> {
  return apiRequest("/eos/");
}

// 3. Get Single Settlement Details
export async function getSettlementDetails(
  settlementId: number
): Promise<EosSettlementDetails> {
  return apiRequest(`/eos/${settlementId}`);
}

// 4. Update Deductions (Simplified for V2)
export async function updateEosDeductions(
  settlementId: number,
  data: {
    other_deductions?: number;
  }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/eos/${settlementId}/deductions`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// 5. Approve a Settlement
export async function approveSettlement(
  settlementId: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/eos/${settlementId}/approve`, { method: "PATCH" });
}
export async function deleteSettlement(settlementId: number): Promise<{}> {
  return apiRequest(`/eos/${settlementId}`, { method: "DELETE" });
}

// 6. Record a Payment
export async function recordEosPayment(
  settlementId: number,
  data: { jv_number: string }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/eos/${settlementId}/payment`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export interface CaseCategory {
  id: number;
  name: string;
}

export interface CaseFile {
  id: number;
  case_id: number;
  file_url: string;
  uploaded_at: string;
}

export interface Case {
  id: number;
  case_id_text: string;
  employee_id: number;
  employee_name: string;
  category_id: number;
  category_name: string;
  title: string;
  description: string;
  status:
    | "Open"
    | "Under Review"
    | "Approved"
    | "Rejected"
    | "Closed"
    | "Locked";
  deduction_amount: string | null;
  is_deduction_synced: boolean;
  raised_by_id: number;
  raised_by_name: string;
  assigned_to_id: number | null;
  rejection_reason: string | null;
  created_at: string;
  attachments?: CaseFile[];
  payslip_id?: number;
}

// Case Categories
export async function getCaseCategories(): Promise<CaseCategory[]> {
  return apiRequest("/cases/categories");
}

export async function createCaseCategory(data: { name: string }): Promise<any> {
  return apiRequest("/cases/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Cases
export async function createCase(formData: FormData): Promise<any> {
  // This requires a direct fetch call to handle multipart/form-data
  const token = localStorage.getItem("hr_token");
  const response = await fetch(`${API_CONFIG.BASE_URL}/cases`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create case");
  }
  return response.json();
}

export async function getAllCases(params?: {
  status?: string;
  employee_id?: number;
}): Promise<Case[]> {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.employee_id)
    query.append("employee_id", String(params.employee_id));
  const queryString = query.toString();
  return apiRequest(`/cases${queryString ? `?${queryString}` : ""}`);
}

export async function getCaseDetails(caseId: number): Promise<Case> {
  // Assuming a GET /api/cases/:id endpoint exists as per standard practice
  return apiRequest(`/cases/${caseId}`);
}
export async function getCaseByEmployee(employeeId: number): Promise<Case> {
  return apiRequest(`/cases/employee/${employeeId}`);
}
export async function getMyCases(): Promise<Case> {
  // Assuming a GET /api/cases/:id endpoint exists as per standard practice
  return apiRequest(`/cases/my-cases`);
}

export async function getManagerCaseApprovals(): Promise<Case[]> {
  return apiRequest("/cases/approvals");
}

export async function processCaseApproval(
  caseId: number,
  data: { status: "Approved" | "Rejected"; rejection_reason?: string }
): Promise<any> {
  return apiRequest(`/cases/approvals/${caseId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function syncCaseToPayroll(caseId: number): Promise<any> {
  return apiRequest(`/cases/${caseId}/sync-payroll`, { method: "POST" });
}

export interface JobOpening {
  id: number;
  job_title: string;
  status: "Open" | "Closed";
  number_of_positions: number;
  applicant_count: number;
}

export interface Applicant {
  id: number;
  opening_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string | null;
  resume_url: string | null;
  status: "Applied" | "Interviewing" | "Approved" | "Rejected" | "Hired";
}

// Job Openings
export async function createJobOpening(data: {
  job_id: number;
  number_of_positions: number;
  required_skill_ids: number[];
}): Promise<any> {
  return apiRequest("/onboarding/openings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getJobOpenings(): Promise<JobOpening[]> {
  return apiRequest("/onboarding/openings");
}

// Applicants
export async function addApplicant(
  openingId: number,
  formData: FormData
): Promise<any> {
  const token = localStorage.getItem("hr_token");
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/onboarding/openings/${openingId}/applicants`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add applicant");
  }
  return response.json();
}

export async function getApplicantsForOpening(
  openingId: number
): Promise<Applicant[]> {
  return apiRequest(`/onboarding/openings/${openingId}/applicants`);
}

export async function updateApplicantStatus(
  applicantId: number,
  data: { status: string; notes?: string }
): Promise<any> {
  return apiRequest(`/onboarding/applicants/${applicantId}/status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function convertApplicantToEmployee(
  applicantId: number,
  data: {
    new_employee_id: string;
    joining_date: string;
    system_role: number;
    shift: number;
  }
): Promise<{
  success: boolean;
  message: string;
  user_id: number;
  temporary_password?: string;
}> {
  return apiRequest(`/onboarding/applicants/${applicantId}/convert`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateJobOpeningStatus(
  openingId: number,
  status: "Open" | "Closed" | "OnHold"
): Promise<any> {
  return apiRequest(`/onboarding/openings/${openingId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export interface ReviewCycle {
  id: number;
  cycle_name: string;
  start_date: string;
  end_date: string;
  status: "Upcoming" | "Active" | "Closed";
}

export interface Kpi {
  id: number;
  kpi_name: string;
  description: string;
  category: "Qualitative" | "Quantitative";
}

export interface TeamAppraisalStatus {
  employee_id: number;
  employee_name: string;
  appraisal_id: number | null;
  status:
    | "Not Started"
    | "Pending"
    | "Self-Assessment"
    | "Manager-Review"
    | "Completed";
}

export interface AppraisalGoal {
  id: number;
  appraisal_id: number;
  goal_title: string;
  goal_description: string;
  weightage: number;
  employee_comments: string | null;
  employee_rating: number | null;
  manager_comments: string | null;
  manager_rating: number | null;
}

export interface AppraisalKpi {
  id: number;
  appraisal_id: number;
  kpi_id: number;
  kpi_name: string;
  target: string;
  actual: string | null;
  weightage: number;
  employee_comments: string | null;
  employee_rating: number | null;
  manager_comments: string | null;
  manager_rating: number | null;
}

export interface AppraisalDetails {
  id: number;
  cycle_id: number;
  employee_id: number;
  employee_name: string;
  manager_id: number;
  status: "Pending" | "Self-Assessment" | "Manager-Review" | "Completed";
  final_manager_comments: string | null;
  overall_manager_rating: number | null;
  goals: AppraisalGoal[];
  kpis: AppraisalKpi[];
}

// Admin APIs
export async function createReviewCycle(data: {
  cycle_name: string;
  start_date: string;
  end_date: string;
}): Promise<any> {
  return apiRequest("/performance/cycles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getReviewCycles(): Promise<ReviewCycle[]> {
  return apiRequest("/performance/cycles");
}

export async function createKpi(data: {
  kpi_name: string;
  description: string;
  category: "Qualitative" | "Quantitative";
}): Promise<any> {
  return apiRequest("/performance/kpis", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllKpis(): Promise<Kpi[]> {
  return apiRequest("/performance/kpis");
}

// Manager APIs

export async function initiateTeamAppraisals(cycle_id: number): Promise<any> {
  return apiRequest("/performance/appraisals/initiate-team", {
    method: "POST",
    body: JSON.stringify({ cycle_id }),
  });
}

export async function assignGoal(data: {
  appraisal_id: number;
  goal_title: string;
  goal_description: string;
  weightage: number;
}): Promise<any> {
  return apiRequest("/performance/goals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function assignKpi(data: {
  appraisal_id: number;
  kpi_id: number;
  target: string;
  weightage: number;
}): Promise<any> {
  return apiRequest("/performance/kpis/assign", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getTeamAppraisalStatuses(
  cycleId: number
): Promise<TeamAppraisalStatus[]> {
  return apiRequest(`/performance/appraisals/team/${cycleId}`);
}

// Assumes an endpoint to get a single appraisal's details
export async function getAppraisalDetails(
  appraisalId: number
): Promise<AppraisalDetails> {
  return apiRequest(`/performance/appraisals/${appraisalId}`);
}

export async function submitManagerAssessment(
  appraisalId: number,
  data: any
): Promise<any> {
  return apiRequest(`/performance/appraisals/${appraisalId}/manager-assess`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Employee APIs
export async function getMyValuation(
  cycleId: number
): Promise<AppraisalDetails> {
  return apiRequest(`/performance/appraisals/my/${cycleId}`);
}

export async function submitSelfAssessment(
  appraisalId: number,
  data: any
): Promise<any> {
  return apiRequest(`/performance/appraisals/${appraisalId}/self-assess`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export interface PayrollGroup {
  id: number;
  group_name: string;
  description: string;
  created_by: number;
  created_by_name?: string;
  created_at: string;
  component_count: string;
}

export interface PayrollGroupDetails {
  id: number;
  group_name: string;
  description: string;
  components: { id: number; name: string; type: "earning" | "deduction" }[];
}

export interface PayrollComponentDef {
  id: number;
  name: string;
  type: "earning" | "deduction";
  description?: string;
}

export interface PayrollCycle {
  id: number;
  cycle_name: string;
  start_date: string;
  end_date: string;
  status: "Draft" | "Auditing" | "Review" | "Finalized" | "Paid";
  initiated_by: number;
  initiated_by_name: string;
  created_at: string;
  runs: {
    id: number;
    cycle_id: number;
    group_id: number;
    status: "Pending" | "Calculated";
    group_name: string;
  }[];
  payslips: {
    id: number;
    employee_id: number;
    employee_name: string;
    status: "Draft" | "Reviewed";
    gross_earnings: string;
    total_deductions: string;
    net_pay: string;
  }[];
}

export interface AuditFlag {
  id: number;
  cycle_id: number;
  employee_id: number;
  flag_type: string;
  description: string;
  status: "Open" | "Resolved";
  employee_name: string;
  joining_date?: string;
  shift_name?: string;
}

export interface PayslipSummary {
  id: number;
  employee_id: number;
  employee_name: string;
  gross_earnings: string;
  total_deductions: string;
  net_pay: string;
  status: "Draft" | "Reviewed" | "Finalized";
}

export interface PayslipDetails extends PayslipSummary {
  cycle_id: number;
  cycle_name: string;
  start_date: string;
  end_date: string;
  details: {
    id: number;
    component_id: number | null;
    component_name: string;
    component_type: "earning" | "deduction";
    amount: string;
    calculation_breakdown: any;
    group_name: string;
  }[];
}

// Section 1: Setup - Managing Payroll Groups
export async function getPayrollGroups(): Promise<PayrollGroup[]> {
  return apiRequest("/payroll/groups");
}

export async function getPayrollGroupDetails(
  groupId: number
): Promise<PayrollGroupDetails> {
  return apiRequest(`/payroll/groups/${groupId}`);
}

export async function createPayrollGroup(data: {
  group_name: string;
  description: string;
  components: number[];
}): Promise<{ success: boolean; message: string; groupId: number }> {
  return apiRequest("/payroll/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePayrollGroup(
  groupId: number,
  data: {
    group_name: string;
    description: string;
    components: number[];
  }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/payroll/groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePayrollGroup(groupId: number): Promise<void> {
  await apiRequest(`/payroll/groups/${groupId}`, { method: "DELETE" });
}

export async function getPayrollComponentDefs(): Promise<
  PayrollComponentDef[]
> {
  return apiRequest("/payroll/components");
}

// Section 2: The Payroll Cycle Workflow
export async function getPayrollCycles(): Promise<PayrollCycle[]> {
  return apiRequest("/payroll/cycles");
}

export async function getPayrollCycleDetails(
  cycleId: number
): Promise<PayrollCycle> {
  return apiRequest(`/payroll/cycles/${cycleId}`);
}

export async function createPayrollCycle(data: {
  cycle_name: string;
  start_date: string;
  end_date: string;
  group_ids: number[];
}): Promise<{ success: boolean; message: string; cycleId: number }> {
  return apiRequest("/payroll/cycles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function runPrePayrollAudit(cycleId: number): Promise<{
  success: boolean;
  message: string;
  audit_summary: {
    total_issues_found: number;
    missing_attendance: number;
    unapproved_overtime: number;
    missing_salary_structure: number;
    incomplete_structures: number;
    invalid_formulas: number;
  };
}> {
  return apiRequest(`/payroll/cycles/${cycleId}/audit`, { method: "POST" });
}

export async function verifyAudit(cycleId: number): Promise<{
  cycle_id: number;
  is_clear: boolean;
  open_flags_count: number;
  new_flags_found: number;
  message: string;
}> {
  return apiRequest(`/payroll/cycles/${cycleId}/verifyAudit`, {
    method: "POST",
  });
}

export async function getAuditFlags(cycleId: number): Promise<AuditFlag[]> {
  return apiRequest(`/payroll/cycles/${cycleId}/audit/flags`);
}

export async function resolveAuditFlag(
  flagId: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/payroll/audit/flags/${flagId}/resolve`, {
    method: "PATCH",
  });
}

export async function executePayrollGroupRun(
  cycleId: number,
  groupId: number
): Promise<{
  success: boolean;
  message: string;
  summary?: {
    total_employees: number;
    processed: number;
    errors: number;
    components_processed: number;
  };
}> {
  return apiRequest(`/payroll/cycles/${cycleId}/groups/${groupId}/execute`, {
    method: "POST",
  });
}

export async function getPayslipsForCycle(
  cycleId: number
): Promise<PayslipSummary[]> {
  return apiRequest(`/payroll/payslips/cycle/${cycleId}`);
}

export async function getPayslipForReview(
  payslipId: number
): Promise<PayslipDetails> {
  return apiRequest(`/payroll/payslips/${payslipId}/review`);
}

export async function addManualAdjustment(
  payslipId: number,
  data: {
    component_name: string;
    component_type: "earning" | "deduction";
    amount: number;
    reason: string;
  }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/payroll/payslips/${payslipId}/adjust`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function markCycleAsPaid(
  cycleId: number,
  jv: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/payroll/cycles/paid`, {
    method: "PATCH",
    body: JSON.stringify({ cycleId: cycleId, jv: jv }),
  });
}

export async function updatePayslipStatus(
  payslipId: number,
  status: "Reviewed"
): Promise<{
  success: boolean;
  message: string;
}> {
  return apiRequest(`/payroll/payslips/${payslipId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function bulkAddComponent(
  cycleId: number,
  data: {
    component_name: string;
    component_type: "earning" | "deduction";
    amount: number;
    reason: string;
  }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/payroll/cycles/${cycleId}/bulk-add`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Section 3: Finalization & Employee Self-Service
export async function updatePayrollCycleStatus(
  cycleId: number,
  status: "Auditing" | "Review" | "Finalized" | "Paid"
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/payroll/cycles/${cycleId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deletePayrollCycle(cycleId: number): Promise<void> {
  await apiRequest(`/payroll/cycles/${cycleId}`, { method: "DELETE" });
}

export async function getMyPayslipForCycle(
  cycleId: number
): Promise<PayslipDetails> {
  return apiRequest(`/payroll/cycles/${cycleId}/my-payslip`);
}
export async function getEmployeePayslipForCycle(
  cycleId: number,
  employeeId: number
): Promise<PayslipDetails> {
  return apiRequest(
    `/payroll/cycles/${cycleId}/employee-payslip/${employeeId}`
  );
}
export async function deleteComponentFromPayslip(
  payslipId: number,
  payslipDetailsId: number
): Promise<void> {
  return apiRequest(
    `/payroll/payslips/${payslipId}/details/${payslipDetailsId}`,
    { method: "DELETE" }
  );
}

export interface ShiftRotation {
  id: number;
  rotation_name: string;
  effective_from: string;
  status: "Draft" | "Pending Approval" | "Approved" | "Executed";
  created_by_name: string;
  employee_count: number;
}

export interface ShiftRotationDetailItem {
  id: number;
  rotation_id: number;
  employee_id: number;
  employee_name: string;
  from_shift_id: number;
  from_shift_name: string;
  to_shift_id: number;
  to_shift_name: string;
}

export interface ShiftRotationAudit {
  id: number;
  rotation_id: number;
  changed_by: number;
  action: string;
  details: string;
  changed_at: string;
  changed_by_name: string;
}

export interface ShiftRotationDetails extends ShiftRotation {
  details: ShiftRotationDetailItem[];
  audit: ShiftRotationAudit[];
}

// Create a new Shift Rotation
export async function createShiftRotation(data: {
  rotation_name: string;
  effective_from: string;
  rotations: {
    employee_id: number;
    from_shift_id: number;
    to_shift_id: number;
  }[];
}): Promise<{ success: boolean; message: string; rotation_id: number }> {
  return apiRequest("/shift-rotations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get all Shift Rotations
export async function getAllShiftRotations(): Promise<ShiftRotation[]> {
  return apiRequest("/shift-rotations");
}

// Get a single Shift Rotation's details
export async function getShiftRotationDetails(
  rotationId: number
): Promise<ShiftRotationDetails> {
  return apiRequest(`/shift-rotations/${rotationId}`);
}

// Update a Shift Rotation (Drafts only)
export async function updateShiftRotation(
  rotationId: number,
  data: {
    rotation_name: string;
    effective_from: string;
    rotations: {
      employee_id: number;
      from_shift_id: number;
      to_shift_id: number;
    }[];
  }
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/shift-rotations/${rotationId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Submit for Approval
export async function submitShiftRotationForApproval(
  rotationId: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/shift-rotations/${rotationId}/submit`, {
    method: "PATCH",
  });
}

// Approve or Reject a Rotation
export async function processShiftRotationApproval(
  rotationId: number,
  status: "Approved" | "Draft",
  reason?: string
): Promise<{ success: boolean; message: string }> {
  let body;
  if (reason) {
    body = { status: status, reason: reason };
  } else {
    body = { status: status };
  }
  return apiRequest(`/shift-rotations/${rotationId}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ body }),
  });
}

// Delete a Shift Rotation (Drafts only)
export async function deleteShiftRotation(rotationId: number): Promise<void> {
  await apiRequest(`/shift-rotations/${rotationId}`, { method: "DELETE" });
}

export interface ReportResponse {
  success: boolean;
  message: string;
  downloadUrl: string;
  summary: any;
}

export const reportsApi = {
  attendanceDetailed: (filters: any) =>
    apiRequest<ReportResponse>("/reports/attendance/detailed", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  attendanceMonthly: (filters: any) =>
    apiRequest<ReportResponse>("/reports/attendance/monthly", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  attendanceEmployee: (filters: any) =>
    apiRequest<ReportResponse>("/reports/attendance/employee-summary", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  payrollCycle: (filters: any) =>
    apiRequest<ReportResponse>("/reports/payroll/cycle", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  payrollSalary: (filters: any) =>
    apiRequest<ReportResponse>("/reports/payroll/salary-structure", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  payrollCostCenter: (filters: any) =>
    apiRequest<ReportResponse>("/reports/payroll/cost-center", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  leaveDetailed: (filters: any) =>
    apiRequest<ReportResponse>("/reports/leave/detailed", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  leaveBalances: (filters: any) =>
    apiRequest<ReportResponse>("/reports/leave/balances", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  leaveEncashment: (filters: any) =>
    apiRequest<ReportResponse>("/reports/leave/encashment", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  employeeDirectory: (filters: any) =>
    apiRequest<ReportResponse>("/reports/employee/directory", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  employeeDemographics: (filters: any) =>
    apiRequest<ReportResponse>("/reports/employee/demographics", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  performanceAppraisals: (filters: any) =>
    apiRequest<ReportResponse>("/reports/performance/appraisals", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  performanceGoals: (filters: any) =>
    apiRequest<ReportResponse>("/reports/performance/goals", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  hrCaseDetailed: (filters: any) =>
    apiRequest<ReportResponse>("/reports/cases/detailed", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  hrCaseSummary: (filters: any) =>
    apiRequest<ReportResponse>("/reports/cases/summary", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  loanApplications: (filters: any) =>
    apiRequest<ReportResponse>("/reports/loans/applications", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  loanRepayments: (filters: any) =>
    apiRequest<ReportResponse>("/reports/loans/repayments", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  expenseClaims: (filters: any) =>
    apiRequest<ReportResponse>("/reports/expenses/claims", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  auditUser: (filters: any) =>
    apiRequest<ReportResponse>("/reports/audit/user-changes", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

  auditAttendance: (filters: any) =>
    apiRequest<ReportResponse>("/reports/audit/attendance-changes", {
      method: "POST",
      body: JSON.stringify(filters),
    }),
};

export function downloadFile(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  a.click();
}

export interface UserDashboardData {
  user: {
    first_name: string;
    last_name: string;
    full_employee_id: string;
    reports_to_name: string;
  };
  documentStatus: {
    expiring: {
      name: string;
      expiry_date: string;
    }[];
    notUploaded: {
      name: string;
    }[];
  };
  upcomingHoliday: {
    name: string;
    holiday_date: string;
  } | null;
  monthlyAttendance: {
    total_days: number;
    present_days: number;
    absent_days: number;
    leave_days: number;
    total_hours_worked: string;
    approved_overtime: string;
    rejected_overtime: string;
  };
  upcomingLeave: {
    from_date: string;
    to_date: string;
    leave_description: string;
  } | null;
  pendingApprovals: {
    leaves: {
      id: number;
      fromDate: string;
      toDate: string;
      leave_type_name: string;
    }[];
  };
  myPendingRequests: {
    loans: {
      id: number;
      requested_amount: string;
      name: string;
    }[];
    expenses: {
      id: number;
      title: string;
      amount: string;
    }[];
    overtime: {
      id: number;
      overtime_hours: string;
      request_date: string;
    }[];
  };
  ongoingLoans: {
    id: number;
    application_id_text: string;
    approved_amount: string;
    emi_amount: string;
    tenure_months: number;
    loan_type_name: string;
    emis_paid: number;
    total_emis: number;
  }[];
  pendingCases: {
    id: number;
    case_id_text: string;
    title: string;
  }[];
}

export async function getUserDashboardData(): Promise<UserDashboardData> {
  return apiRequest("/dashboard/user");
}

export async function updateAttendanceRecord(
  recordId: number,
  data: any
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/attendance/${recordId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export interface AttendanceAuditLog {
  id: number;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changedAt: string;
  changedBy: string;
  isBulkUpdate: boolean;
}

// Add this new method to your Api class
export async function getAttendanceAudit(
  recordId: number
): Promise<AttendanceAuditLog[]> {
  return apiRequest(`/attendance/audit/attendance/${recordId}`);
}

export interface SalaryRevision {
  id: number;
  employee_id: number;
  component_id: number;
  effective_date: string;
  new_calculation_type: "Fixed" | "Percentage" | "Formula";
  new_value: string;
  new_based_on_component_id?: number | null;
  new_custom_formula?: string | null;
  status: "Scheduled" | "Applied" | "Cancelled";
  reason: string;
  created_by_name: string;
  applied_by_name?: string | null;
  applied_at?: string | null;
  created_at: string;
  component_name: string;
}

export interface ScheduleRevisionPayload {
  employee_id: number;
  component_id: number;
  effective_date: string;
  new_calculation_type: "Fixed" | "Percentage" | "Formula";
  new_value: number;
  new_based_on_component_id?: number;
  new_custom_formula?: string | null;
  reason: string;
}

// Interfaces for Salary Audit
export interface SalaryAuditLog {
  id: number;
  action_type: "UPDATE" | "INSERT" | "DELETE";
  old_data: Record<string, any>;
  new_data: Record<string, any>;
  changed_at: string;
  changed_by_name: string;
  component_name: string;
}

// Add these methods to your Api class in lib/api.ts

export async function scheduleSalaryRevision(
  payload: ScheduleRevisionPayload
): Promise<{ success: boolean; message: string; revisionId: number }> {
  return apiRequest("/payroll/structure/revisions/schedule", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export async function updateSalaryRevision(
  payload: ScheduleRevisionPayload,
  revisionId: number
): Promise<{ success: boolean; message: string; revisionId: number }> {
  return apiRequest(`/payroll/structure/revisions/scheduled/${revisionId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getEmployeeRevisions(
  employeeId: number
): Promise<SalaryRevision[]> {
  return apiRequest(`/payroll/structure/revisions/${employeeId}`, {
    method: "GET",
  });
}
export async function getMySalaryRevisions(
  employeeId: number
): Promise<SalaryRevision[]> {
  return apiRequest(`/payroll/structure/revisions/me`, { method: "GET" });
}

export async function cancelScheduledRevision(
  revisionId: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/payroll/structure/revisions/cancel/${revisionId}`, {
    method: "PATCH",
  });
}

export async function getSalaryStructureAudit(
  employeeId: number
): Promise<SalaryAuditLog[]> {
  return apiRequest(`/payroll/structure/audit/${employeeId}`, {
    method: "GET",
  });
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  leave: number;
}

export interface PendingLeaveApproval {
  id: number;
  applied_date: string;
  from_date: string;
  to_date: string;
  leave_type_name: string;
  employee_name: string;
  profile_url: string | null;
}

export interface PendingLoanApproval {
  id: number;
  application_id_text: string;
  request_date: string;
  requested_amount: string;
  loan_type_name: string;
  employee_name: string;
  profile_url: string | null;
}

export interface PendingSkillApproval {
  id: number;
  request_date: string;
  skill_name: string;
  employee_name: string;
  profile_url: string | null;
}

export interface PendingExpenseApproval {
  id: number;
  request_date: string;
  title: string;
  amount: string;
  category_name: string;
  employee_name: string;
  profile_url: string | null;
}

export interface PendingOvertimeRequest {
  id: number;
  request_date: string;
  overtime_hours: string;
  overtime_type: string;
  employee_name: string;
  profile_url: string | null;
}

export interface ExpiringDocument {
  id: number;
  expiry_date: string;
  document_name: string;
  employee_name: string;
  profile_url: string | null;
  employee_id: number;
}

export interface OpenCase {
  id: number;
  case_id_text: string;
  title: string;
  created_at: string;
  category_name: string;
  employee_name: string;
  profile_url: string | null;
}

export interface ExpenseDisbursementRequest {
  id: number;
  approval_date: string;
  title: string;
  amount: string;
  claim_type: string;
  category_name: string;
  employee_name: string;
  profile_url: string | null;
}

export interface LoanDisbursementRequest {
  id: number;
  application_id_text: string;
  approval_date: string;
  approved_amount: string;
  loan_type_name: string;
  employee_name: string;
  profile_url: string | null;
}

export interface PendingLeaveEncashment {
  id: number;
  request_date: string;
  days_to_encash: string;
  calculated_amount: string;
  status: "Pending" | "Approved";
  employee_name: string;
  profile_url: string | null;
}

export async function getAttendanceStats(): Promise<AttendanceStats> {
  return apiRequest("/dashboard/admin/attendance-stats", { method: "GET" });
}

export async function getPendingLeaveApprovals(): Promise<
  PendingLeaveApproval[]
> {
  return apiRequest("/dashboard/admin/pending-leave-approvals", {
    method: "GET",
  });
}

export async function getPendingLoanApprovals(): Promise<
  PendingLoanApproval[]
> {
  return apiRequest("/dashboard/admin/pending-loan-approvals", {
    method: "GET",
  });
}

export async function getPendingSkillApprovalsDashboard(): Promise<
  PendingSkillApproval[]
> {
  return apiRequest("/dashboard/admin/pending-skill-approvals", {
    method: "GET",
  });
}

export async function getPendingExpenseApprovals(): Promise<
  PendingExpenseApproval[]
> {
  return apiRequest("/dashboard/admin/pending-expense-approvals", {
    method: "GET",
  });
}

export async function getPendingOvertimeRequests(): Promise<
  PendingOvertimeRequest[]
> {
  return apiRequest("/dashboard/admin/pending-overtime-requests", {
    method: "GET",
  });
}

export async function getDocumentExpiries(
  days: number = 30
): Promise<ExpiringDocument[]> {
  return apiRequest(`/dashboard/admin/document-expiries?days=${days}`, {
    method: "GET",
  });
}

export async function getOpenCasesOnDirectReports(): Promise<OpenCase[]> {
  return apiRequest("/dashboard/admin/open-cases-direct-reports", {
    method: "GET",
  });
}

export async function getExpenseDisbursementRequests(): Promise<
  ExpenseDisbursementRequest[]
> {
  return apiRequest("/dashboard/admin/expense-disbursement-requests", {
    method: "GET",
  });
}

export async function getLoanDisbursementRequests(): Promise<
  LoanDisbursementRequest[]
> {
  return apiRequest("/dashboard/admin/loan-disbursement-requests", {
    method: "GET",
  });
}

export async function getPendingLeaveEncashment(): Promise<
  PendingLeaveEncashment[]
> {
  return apiRequest("/dashboard/admin/pending-leave-encashment", {
    method: "GET",
  });
}

export async function updateLeaveBalance(
  newBalance: number,
  employeeId: number,
  leaveId: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/leaves/balance/${employeeId}/${leaveId}`, {
    method: "PATCH",
    body: JSON.stringify({ newBalance }),
  });
}



export interface BulkUploadAttendanceResponse {
  success: boolean;
  message: string;
  processedCount: number;
  errors: {
    row: number;
    employeeId?: string;
    message: string;
  }[];
}


export async function bulkUploadAttendance(
    file: File,
    timezone: string,
    reason: string
): Promise<BulkUploadAttendanceResponse> {
  const formData = new FormData();
    formData.append("file", file);
    formData.append("timezone", timezone);
    formData.append("reason", reason);
  const response = await fetch(`${API_CONFIG.BASE_URL}/attendance/bulk-upload-excel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("hr_token")}`,
      // Don't set Content-Type, browser does it for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "API request failed",
      errorData
    );
  }

  return await response.json();
}


export async function changePassword(
  newPassword: string,
  employeeId: number,
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/auth/change-password`, {
    method: "POST",
    body: JSON.stringify({ password:newPassword,id:employeeId }),
  });
}