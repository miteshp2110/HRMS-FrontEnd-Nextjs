
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  UserCheck,
  UserPlus,
  ClipboardList,
  FileCheck,
  Award,
  FileText,
  RefreshCw,
  DollarSign as DollarSignIcon,
  FolderKanban,
  Handshake,
  BarChart,
  Banknote,
  Wallet as WalletIcon,
  DollarSign,
  Receipt,
  Wallet,
  CreditCard,
  Calculator,
  Users,
  Star,
  CalendarDays,
  Library,
  User,
  Clock,
  GraduationCap,
  FileWarning,
  Search,
  ArrowRight,
  LayoutDashboard,
  UsersIcon,
  Settings,
  Globe,
  Hash,
  Building2,
  Briefcase,
  Shield,
  CalendarIcon,
  CircleDollarSign,
  Gift,
  FileBox
} from "lucide-react"

interface NavItem {
  title: string
  href?: string
  icon?: any
  permission?: string
  userCheck?: string
  children?: NavItem[]
  description?: string
}

const adminNavigations: NavItem[] = [
  {
    title: "Employee Management",
    icon: UserCheck,
    permission: "user.manage",
    children: [
      { title: "My Team", href: "/team", icon: UserPlus, permission: "onboarding.manage", description: "View and manage your direct reports" },
      { title: "Onboarding", href: "/admin/onboarding", icon: UserPlus, permission: "onboarding.manage", description: "Manage new employee onboarding process" },
      { title: "Attendance Records", href: "/management/attendance", icon: ClipboardList, permission: "attendance.manage", description: "View and manage employee attendance" },
      { title: "Leave Approvals", href: "/management/leaves", icon: FileCheck, permission: "leaves.manage", description: "Approve or reject leave requests" },
      { title: "Skill Approvals", href: "/management/skill-approvals", icon: Award, permission: "skills.manage", description: "Approve employee skill certifications" },
      { title: "Documents", href: "/management/documents", icon: FileText, permission: "documents.manage", description: "Manage employee documents" },
      { title: "Shift Rotation", href: "/management/shift-rotation", icon: RefreshCw, permission: "shift.manage", description: "Manage employee shift schedules" },
      { title: "Employee's Cost", href: "/management/expense-on-employees", icon: DollarSignIcon, permission: "expenses.manage", description: "Track expenses on employees" },
      { title: "Employee Cases", href: "/admin/cases", icon: FolderKanban, permission: "cases.manage", description: "Manage employee cases and issues" },
      { title: "EOS Settlements", href: "/admin/eos", icon: Handshake, permission: "eos.manage", description: "Process end of service settlements" },
      { title: "Employee Reports", href: "/management/employee-reports", icon: BarChart, permission: "user.manage", description: "View employee analytics and reports" },
    ],
  },
  {
    title: "Finance & Payroll",
    icon: Banknote,
    children: [
      { title: "Finances", href: "/admin/finance", icon: WalletIcon, permission: "loans.manage", description: "Overview of financial operations" },
      { title: "Loan Management", href: "/management/loans", icon: DollarSign, permission: "loans.manage", description: "Manage employee loans and advances" },
      { title: "Expense Claims", href: "/management/expenses", icon: Receipt, permission: "expenses.manage", description: "Process employee expense claims" },
      { title: "Leave Encashment", href: "/management/leave-encashment", icon: Wallet, permission: "leaves.manage", description: "Process leave encashment requests" },
      { title: "Payroll Runs", href: "/payroll/runs", icon: CreditCard, permission: "payroll.manage", description: "Execute and manage payroll cycles" },
      { title: "Salary Structures", href: "/payroll/structure", icon: DollarSign, permission: "payroll.manage", description: "Configure employee salary structures" },
      { title: "Payroll Components", href: "/payroll/components", icon: Calculator, permission: "payroll.manage", description: "Manage salary components" },
      { title: "Payroll Groups", href: "/payroll/groups", icon: Users, permission: "payroll.manage", description: "Organize employees into payroll groups" },
    ]
  },
  {
    title: "Performance",
    icon: Star,
    permission: "performance.manage",
    children: [
      { title: "Review Cycles", href: "/performance/cycles", icon: CalendarDays,permission:'performance.manage' ,description: "Manage performance review cycles" },
      { title: "KPI Library", href: "/performance/kpi-library", icon: Library, permission:'performance.manage',description: "Library of KPIs and metrics" },
    ],
  },
  {
    title: "Quick Access",
    icon: LayoutDashboard,
    children: [
      { title: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, description: "View dashboard and analytics", permission: "user.manage" },
      { title: "Directory", href: "/directory", icon: UsersIcon, permission:'user.manage',description: "Browse employee directory" },
      { title: "Settings", href: "/admin/settings", icon: Settings,description: "System settings and configuration", permission: "user.manage" },
    ],
  },
]

const settingsNavigations: NavItem[] = [
  {
    title: "Settings > General",
    icon: Settings,
    permission: "user.manage",
    children: [
      { title: "Timezone", href: "/admin/settings?tab=general&section=timezone", icon: Globe, permission:'user.manage',description: "Configure system timezone" },
      { title: "Name Series", href: "/admin/settings?tab=general&section=name-series", icon: Hash, permission:'user.manage',description: "Manage naming conventions" },
      { title: "Document Types", href: "/admin/settings?tab=general&section=documents", icon: FileText, permission:'documents.manage',description: "Configure document categories" },
      { title: "Skill Libraries", href: "/admin/settings?tab=general&section=skills", icon: Library, permission:'skills.manage',description: "Manage skill categories" },
      { title: "Job Types", href: "/admin/settings?tab=general&section=jobs", icon: Briefcase, permission:'job.manage',description: "Configure job classifications" },
      { title: "Roles & Permissions", href: "/admin/settings?tab=general&section=roles", icon: Shield, permission:'roles.manage',description: "Manage user roles and access" },
      { title: "Shifts", href: "/admin/settings?tab=general&section=shifts", icon: Clock,permission:'shift.manage', description: "Configure work shifts" },
    ],
  },
  {
    title: "Settings > Organization",
    icon: Building2,
    permission: "user.manage",
    children: [
      { title: "Calendar", href: "/admin/settings?tab=calendar", icon: CalendarIcon,permission:'calender.manage', description: "Manage holidays and work days" },
      { title: "Leave Types", href: "/admin/settings?tab=leave-types", icon: CalendarDays, permission:'leaves.manage',description: "Configure leave categories" },
      { title: "Expense Categories", href: "/admin/settings?tab=expenses", icon: Receipt, permission:'expenses.manage',description: "Manage expense types" },
      { title: "Loan Types", href: "/admin/settings?tab=loan-types", icon: CircleDollarSign, permission:'loans.manage',description: "Configure loan products" },
      { title: "Benefits", href: "/admin/settings?tab=benefits", icon: Gift, permission:'benefits.manage',description: "Manage employee benefits" },
      { title: "Case Types", href: "/admin/settings?tab=cases", icon: FileBox, permission:'cases.manage',description: "Configure case categories" },
    ],
  },
]

const personalNavigations: NavItem[] = [
  {
    title: "Self Service",
    icon: User,
    children: [
      { title: "Attendance", href: "/self-service/attendance", icon: ClipboardList, description: "View your attendance records" },
      { title: "Overtime", href: "/self-service/overtime", icon: Clock, description: "Submit overtime requests" },
      { title: "Leaves", href: "/self-service/leaves", icon: CalendarDays, description: "Apply for leave and view balance" },
      { title: "Documents", href: "/self-service/documents", icon: FileCheck, description: "Access your documents" },
      { title: "Payslips", href: "/self-service/payslips", icon: Receipt, userCheck: 'salary_visibility', description: "Download your payslips" },
      { title: "Salary", href: "/self-service/salary", icon: Banknote, userCheck: 'salary_visibility', description: "View your salary structure" },
      { title: "Skills", href: "/self-service/skills", icon: GraduationCap, description: "Manage your skills and certifications" },
      { title: "Performance", href: "/my-performance", icon: Star, description: "View your performance reviews" },
      { title: "Cases", href: "/self-service/cases", icon: FileWarning, description: "View and manage your cases" },
      { title: "Expenses", href: "/self-service/expenses", icon: Receipt, description: "Submit expense claims" },
      { title: "Benefits", href: "/self-service/benefits", icon: Award, description: "View your benefits" },
      { title: "Leave Encashment", href: "/self-service/leave-encashment", icon: Wallet, description: "Request leave encashment" },
      { title: "Loans", href: "/self-service/loans", icon: DollarSign, description: "Apply for loans and advances" },
      { title: "Bank Details", href: "/self-service/bank", icon: Wallet, description: "Manage your bank account details" },
    ],
  },
]

interface CommandSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const router = useRouter()
  const { hasPermission, user } = useAuth()
  const [search, setSearch] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const selectedItemRef = React.useRef<HTMLDivElement>(null)

  // Flatten all navigations and filter by permissions
  const getAllPages = React.useMemo(() => {
    const pages: NavItem[] = []
    
    const processNav = (navItems: NavItem[]) => {
      navItems.forEach(section => {
        if (section.children) {
          section.children.forEach(item => {
            if (item.href) {
              // Check permissions
              if (item.permission && !hasPermission(item.permission)) return
              
              // Check user-specific flags
              if (item.userCheck && !user?.[item.userCheck as keyof typeof user]) return
              
              pages.push({
                ...item,
                title: `${section.title} > ${item.title}`,
              })
            }
          })
        }
      })
    }

    processNav(adminNavigations)
    processNav(settingsNavigations)
    processNav(personalNavigations)
    
    return pages
  }, [hasPermission, user])

  // Filter pages based on search
  const filteredPages = React.useMemo(() => {
    if (!search) return getAllPages

    const searchLower = search.toLowerCase()
    return getAllPages.filter(page =>
      page.title.toLowerCase().includes(searchLower) ||
      page.description?.toLowerCase().includes(searchLower)
    )
  }, [search, getAllPages])

  // Handle navigation
  const handleSelect = (href: string) => {
    router.push(href)
    onOpenChange(false)
    setSearch("")
    setSelectedIndex(0)
  }

  // Auto-scroll to selected item using scrollIntoView
  React.useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [selectedIndex])

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredPages.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredPages[selectedIndex]?.href) {
          handleSelect(filteredPages[selectedIndex].href!)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, selectedIndex, filteredPages])

  // Reset on open/close
  React.useEffect(() => {
    if (!open) {
      setSearch("")
      setSelectedIndex(0)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl sm:max-w-2xl backdrop-blur-3xl bg-background/80 border-2">
        <div className="flex items-center border-b px-4 gap-3">
          <Search className="h-5 w-5 shrink-0 text-primary" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            className="flex h-14 w-full rounded-none border-0 bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-[400px]">
          {filteredPages.length === 0 ? (
            <div className="py-14 text-center text-sm">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-medium text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredPages.map((page, index) => {
                const Icon = page.icon
                const isSelected = index === selectedIndex

                return (
                  <div
                    key={`${page.href}-${index}`}
                    ref={isSelected ? selectedItemRef : null}
                    onClick={() => page.href && handleSelect(page.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`
                      flex cursor-pointer items-start gap-3 rounded-lg px-4 py-3 text-sm
                      transition-all duration-150
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' 
                        : 'hover:bg-muted'
                      }
                    `}
                  >
                    <div className={`
                      mt-0.5 rounded-md p-2 transition-all
                      ${isSelected 
                        ? 'bg-primary-foreground/20 shadow-inner' 
                        : 'bg-muted'
                      }
                    `}>
                      {Icon && <Icon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium truncate ${isSelected ? '' : 'text-foreground'}`}>
                          {page.title.split(' > ').pop()}
                        </span>
                        <Badge 
                          variant={isSelected ? "secondary" : "outline"} 
                          className="text-[10px] h-5 shrink-0"
                        >
                          {page.title.split(' > ')[0]}
                        </Badge>
                      </div>
                      {page.description && (
                        <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'opacity-90' : 'text-muted-foreground'}`}>
                          {page.description}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <ArrowRight className="h-4 w-4 mt-1 shrink-0 animate-pulse" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground bg-muted/30 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 flex">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 flex">
                ↵
              </kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 flex">
                Ctrl Q
              </kbd>
              <span>Toggle</span>
            </div>
          </div>
          <span className="text-[10px] font-mono">{filteredPages.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
