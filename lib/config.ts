export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api",
  ENDPOINTS: {
    // Authentication
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",

    // Users
    USERS: "/user",
    SELF: "/user/self",
    USER_PROFILE: "/user/profile",
    USER_BY_ID: (id: string) => `/user/profile/${id}`,
    USER_SEARCH: "/user/search",
    PERMISSION_SEARCH:"/user/permissions",
    DIRECT_REPORTS:"/user/reports",

    // Roles & Permissions
    ROLES: "/roles",
    PERMISSIONS: "/permissions",

    // Jobs & Shifts
    JOBS: "/jobs",
    SHIFTS: "/shifts",

    // Skills
    SKILLS: "/skills",
    SKILL_APPROVALS: "/skillMatrix/approvals",
    USER_SKILLS: (userId: string) => `/skillMatrix/employee/${userId}`,
    SKILL_MATRIX: "/skillMatrix",
    MY_SKILL_REQUESTS: "/skillMatrix/my-requests",

    // Documents
    DOCUMENTS: "/documents",
    DOCUMENT_TYPES: "/documents",
    USER_DOCUMENTS: (userId: string) => `/documents/employee/${userId}`,
    DOCUMENT_UPLOAD: "/documents/upload",
    MY_DOCUMENTS: "/documents/my-documents",
    EXPIRING_DOCUMENTS: "/documents/expiring",


    // Calendar
    CALENDAR: "/calender",
    WORK_WEEK: "/calender/work-week",

    // Attendance
    ATTENDANCE: "/attendance/me",
    ATTENDANCE_ALL: "/attendance/all",
    PUNCH_IN: "/attendance/punch-in",
    PUNCH_OUT: "/attendance/punch-out",


    // Leaves
    LEAVES: "/leaves",
    LEAVE_BALANCE: "/leaves/balance",
    LEAVE_APPROVALS: "/leaves/primary-approval",
    LEAVE_TYPES: "/leaves/types",
    REQUEST_LEAVE: "/leaves/request-leave",
    LEAVE_RECORDS: "/leaves/records",
    PRIMARY_LEAVE_APPROVALS: "/leaves/primary-approval",
    SECONDARY_LEAVE_APPROVALS: "/leaves/secondry-approval",


    // Payroll
    PAYROLL_COMPONENTS: "/payroll/components",
    PAYROLL_RUNS: "/payroll/runs",
    PAYROLL_STRUCTURE: (userId: string) => `/payroll/structure/${userId}`,
    MY_SALARY_STRUCTURE: "/payroll/structure",


    // Bank Details
    BANK_DETAILS: (userId: string) => `/bank/details/${userId}`,
    MY_BANK_DETAILS: "/bank/self",

    // Loans
    LOANS: "/loans",
    LOAN_APPROVALS: "/loans/all",
    MY_LOANS: "/loans/my-loans",
    REPAYMENTS: "/loans/repayments",
    // ADD_REPAYMENTS: ""


    // Expenses
    EXPENSES: "/expense",
    EXPENSE_APPROVALS: "/expense",

    // Summary 
    SUMMARY_EXPENSES : "/summary/expenses"
  },
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`

  const defaultHeaders: { [key: string]: string } = {
    "Content-Type": "application/json",
  }

  // Add auth token if available
  const token = localStorage.getItem("hr_token")
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.message || "API request failed", errorData)
    }

    // Handle 204 No Content response
    if (response.status === 204) {
      return Promise.resolve(null as T)
    }


    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, "Network error occurred")
  }
}