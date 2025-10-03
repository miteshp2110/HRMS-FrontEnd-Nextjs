
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useAuth } from "@/lib/auth-context"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import {
//   LayoutDashboard,
//   Users,
//   UserCheck,
//   Settings,
//   ChevronDown,
//   ChevronRight,
//   Menu,
//   X,
//   Building2,
//   Shield,
//   Briefcase,
//   Clock,
//   BookOpen,
//   FileText,
//   Calendar,
//   UserPlus,
//   ClipboardList,
//   Award,
//   DollarSign,
//   Receipt,
//   CreditCard,
//   Calculator,
//   User,
//   FileCheck,
//   GraduationCap,
//   Banknote,
//   Wallet,
//   CalendarPlus,
//   RefreshCw,
//   PanelRightDashedIcon,
//   Handshake,
//   FolderKanban,
//   Star,
//   Library,
//   BarChart,
// } from "lucide-react"
// import DashboardPage from "@/app/dashboard/page"

// interface NavItem {
//   title: string
//   href?: string
//   icon: React.ComponentType<{ className?: string }>
//   permission?: string
//   children?: NavItem[]
// }

// const navigationItems: NavItem[] = [
  
  
//   {
//     title: "Directory",
//     href: "/directory",
//     icon: Users,
//     permission: "user.manage",
//   },

  
//   {
//     title: "Employee Management",
//     icon: UserCheck,
//     children: [
//       {
//     title: "Onboarding",
//     href: "/admin/onboarding",
//     icon: UserPlus, // Or another suitable icon
//     permission: "onboarding.manage", // Assuming a new permission
//   },
//       {
//         title: "Leave Approvals", 
//         href: "/management/leaves",
//         icon: UserPlus,
//         permission: "leaves.manage",
//       },
//       {
//         title: "Attendance Records",
//         href: "/management/attendance",
//         icon: FileText,
//         permission: "user.manage",
//       },
//       {
//         title: "Documents Management",
//         href: "/management/documents",
//         icon: ClipboardList,
//         permission: "attendance.manage",
//       },
//       {
//         title: "Skill Approvals",
//         href: "/management/skill-approvals",
//         icon: Award,
//         permission: "skills.manage",
//       },
//       {
//         title: "Loan Management",
//         href: "/management/loans",
//         icon: DollarSign,
//         permission: "loans.manage",
//       },
//       {
//         title: "Expense Claims",
//         href: "/management/expenses",
//         icon: Receipt,
//         permission: "expenses.manage",
//       },
//       {
//         title: "Leave Encashment",
//         href: "/management/leave-encashment",
//         icon: Wallet,
//         permission: "leaves.manage",
//       },
//       {
//     title: "Finance",
//     href: "/admin/finance",
//     icon: Banknote,
//     permission: "expenses.manage",
//   },
//       {
//         title: "Shift Rotation",
//         href: "/management/shift-rotation",
//         icon: RefreshCw,
//         permission: "shift.manage", 
//       },
//       {
//         title: "EOS Settlements",
//         href: "/admin/eos",
//         icon: Handshake,
//         permission: "eos.manage", // Assuming a new permission
//       },
//       {
//         title: "Employee Cases",
//         href: "/management/cases",
//         icon: FolderKanban,
//         permission: "cases.manage", // Assuming a new permission
//       },
//       {
//         title: "Employee Reports",
//         href: "/management/employee-reports",
//         icon: FileText,
//         permission: "user.manage",
//       },
//     ],
//   },
//   {
//     title: "My Team",
//     icon: Users,
//     permission: "is.manager", // For Managers
//     children: [
//         // ... other team links
//         { title: "Team Performance", href: "/team/performance", icon: BarChart },
//     ]
//   },
//   {
//     title: "Performance",
//     icon: Star,
//     permission: "performance.manage", // For Admins
//     children: [
//         { title: "Review Cycles", href: "/performance/cycles", icon: Calendar },
//         { title: "KPI Library", href: "/performance/kpi-library", icon: Library },
//     ]
//   },
//   {
//     title: "Payroll",
//     icon: CreditCard,
//     permission: "payroll.manage",
//     children: [
//       {
//         title: "Payroll Components",
//         href: "/payroll/components",
//         icon: Calculator,
//         permission: "payroll.manage",
//       },
//       {
//         title: "Salary Structures",
//         href: "/payroll/structure",
//         icon: DollarSign, 
//         permission: "payroll.manage",
//       },

//        {
//         title: "Payroll Runs",
//         href: "/payroll/runs",
//         icon: CreditCard,
//         permission: "payroll.manage",
//       },
//        {
//         title: "Payroll Groups",
//         href: "/payroll/groups",
//         icon: Users,
//         permission: "payroll.manage",
//       },
//     ],
//   },
//   {
//     title: "Settings",
//     href: "/admin/settings",
//     icon: Settings,
//     permission: "roles.manage"
//   },
//   {
//     title: "My Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "My Profile",
//     href: "/profile",
//     icon: User,
//   },
//   {
//     title: "Self-Service",
//     icon: User,
//     children: [
      
//       {
//         title: "My Attendance",
//         href: "/self-service/attendance",
//         icon: ClipboardList,
//       },
//       {
//         title: "My Leaves",
//         href: "/self-service/leaves",
//         icon: UserPlus,
//       },
//       {
//         title: "My Documents",
//         href: "/self-service/documents",
//         icon: FileCheck,
//       },
//       {
//         title: "My Payslips",
//         href: "/self-service/payslips",
//         icon: Receipt,
//       },
//       {
//         title: "My Skills",
//         href: "/self-service/skills",
//         icon: GraduationCap,
//       },
//       {
//         title: "My Performance",
//         href: "/my-performance",
//         icon: Star,
//       },
//       {
//         title: "My Expenses",
//         href: "/self-service/expenses",
//         icon: Receipt,
//       },
//       {
//         title: "My Benefits",
//         href: "/self-service/benefits",
//         icon: Award,
//       },
//       {
//         title: "Leave Encashment",
//         href: "/self-service/leave-encashment",
//         icon: Wallet,
//       },
//       {
//         title: "My Loans",
//         href: "/self-service/loans",
//         icon: DollarSign,
//       },
//       {
//         title: "My Bank Details",
//         href: "/self-service/bank",
//         icon: Wallet,
//       },
//     ],
//   },
// ]

// export function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [openGroups, setOpenGroups] = useState<string[]>([])
//   const pathname = usePathname()
//   const { hasPermission, user } = useAuth()

//   useEffect(() => {
//     const savedCollapsed = localStorage.getItem("sidebar-collapsed")
//     if (savedCollapsed) {
//       setIsCollapsed(JSON.parse(savedCollapsed))
//     }
//     const savedOpenGroups = localStorage.getItem("sidebar-open-groups")
//     let initialOpenGroups: string[] = []
//     if (savedOpenGroups) {
//       initialOpenGroups = JSON.parse(savedOpenGroups)
//     }
//     const currentGroup = navigationItems.find((item) => item.children?.some((child) => child.href === pathname))
//     if (currentGroup && !initialOpenGroups.includes(currentGroup.title)) {
//       initialOpenGroups.push(currentGroup.title)
//     }
//     if (!savedOpenGroups && !initialOpenGroups.includes("Self-Service")) {
//       initialOpenGroups.push("Self-Service")
//     }
//     setOpenGroups(initialOpenGroups)
//   }, [pathname])

//   useEffect(() => {
//     localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed))
//   }, [isCollapsed])

//   useEffect(() => {
//     localStorage.setItem("sidebar-open-groups", JSON.stringify(openGroups))
//   }, [openGroups])

//   const toggleGroup = (title: string) => {
//     setOpenGroups((prev) => (prev.includes(title) ? prev.filter((group) => group !== title) : [...prev, title]))
//   }

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed)
//   }

//   const shouldShowItem = (item: NavItem): boolean => {
//     if (item.children) {
//       return item.children.some(child => shouldShowItem(child));
//     }
//     return !item.permission || hasPermission(item.permission);
//   }

//   const renderNavItem = (item: NavItem, level = 0) => {
//     if (!shouldShowItem(item)) return null

//     const Icon = item.icon
//     const isActive = pathname === item.href
//     const hasChildren = item.children && item.children.length > 0
//     const isOpen = openGroups.includes(item.title)
    
//     if (hasChildren) {
//       return (
//         <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleGroup(item.title)}>
//           <CollapsibleTrigger asChild>
//             <Button
//               variant="ghost"
//               className={cn("w-full justify-start gap-2 h-10", level > 0 && "pl-8", isCollapsed && "px-2")}
//             >
//               <Icon className="h-4 w-4 shrink-0" />
//               {!isCollapsed && (
//                 <>
//                   <span className="truncate">{item.title}</span>
//                   {isOpen ? (
//                     <ChevronDown className="h-4 w-4 ml-auto shrink-0" />
//                   ) : (
//                     <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
//                   )}
//                 </>
//               )}
//             </Button>
//           </CollapsibleTrigger>
//           <CollapsibleContent className="space-y-1">
//             {item.children?.map((child) => renderNavItem(child, level + 1))}
//           </CollapsibleContent>
//         </Collapsible>
//       )
//     }

//     return (
//       <Button
//         key={item.title}
//         variant={isActive ? "secondary" : "ghost"}
//         className={cn("w-full justify-start gap-2 h-10", level > 0 && "pl-8", isCollapsed && "px-2")}
//         asChild
//       >
//         <Link href={item.href!}>
//           <Icon className="h-4 w-4 shrink-0" />
//           {!isCollapsed && <span className="truncate">{item.title}</span>}
//         </Link>
//       </Button>
//     )
//   }
  
//   const isManager = hasPermission("user.manage") || hasPermission("leaves.manage");

//   return (
//     <div
//       className={cn(
//         "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
//         isCollapsed ? "w-16" : "w-64",
//       )}
//     >
//       <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
//         {!isCollapsed && (
//           <div className="flex items-center gap-2">
//             <Building2 className="h-6 w-6 text-sidebar-primary" />
//             <span className="font-semibold text-sidebar-foreground">HR System</span>
//           </div>
//         )}
//         <Button variant="ghost" size="sm" onClick={toggleCollapse} className="h-8 w-8 p-0">
//           {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
//         </Button>
//       </div>

//       <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
//         {isManager && (
//             <Button
//                 variant={pathname === "/admin/dashboard" ? "secondary" : "ghost"}
//                 className={cn("w-full justify-start gap-2 h-10", isCollapsed && "px-2")}
//                 asChild
//             >
//                 <Link href="/admin/dashboard">
//                     <LayoutDashboard className="h-4 w-4 shrink-0" />
//                     {!isCollapsed && <span className="truncate">Admin Dashboard</span>}
//                 </Link>
//             </Button>
//         )}    
//         {navigationItems.map((item) => renderNavItem(item))}

//         {user?.salary_visibility && (
//           <Button
//             variant={pathname === "/self-service/salary" ? "secondary" : "ghost"}
//             className={cn("w-full justify-start gap-2 h-10 pl-8", isCollapsed && "px-2")}
//             asChild
//           >
//             <Link href="/self-service/salary">
//               <Banknote className="h-4 w-4 shrink-0" />
//               {!isCollapsed && <span className="truncate">My Salary</span>}
//             </Link>
//           </Button>
//         )}
//       </nav>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Building2,
  Briefcase,
  FileText,
  ClipboardList,
  Award,
  DollarSign,
  Receipt,
  CreditCard,
  Calculator,
  User,
  FileCheck,
  GraduationCap,
  Banknote,
  Wallet,
  RefreshCw,
  Handshake,
  FolderKanban,
  Star,
  Library,
  BarChart,
  UserPlus,
  CalendarDays,
  User2,
  Users2Icon,
  WalletIcon,
} from "lucide-react"

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
  children?: NavItem[]
  userCheck?: 'salary_visibility'; // For special user-based visibility checks
}

// Grouping admin navigation at the top
const adminNavigations: NavItem[] = [
  
  {
    title: "Employee Management",
    icon: UserCheck,
    permission: "user.manage",
    children: [
      { title: "Onboarding", href: "/admin/onboarding", icon: UserPlus, permission: "onboarding.manage" },
      { title: "Attendance Records", href: "/management/attendance", icon: ClipboardList, permission: "attendance.manage" },
      { title: "Leave Approvals", href: "/management/leaves", icon: FileCheck, permission: "leaves.manage" },
      { title: "Skill Approvals", href: "/management/skill-approvals", icon: Award, permission: "skills.manage" },
      { title: "Documents", href: "/management/documents", icon: FileText, permission: "documents.manage" },
      { title: "Shift Rotation", href: "/management/shift-rotation", icon: RefreshCw, permission: "shift.manage" },
      { title: "Employee Cases", href: "/management/cases", icon: FolderKanban, permission: "cases.manage" },
      { title: "EOS Settlements", href: "/admin/eos", icon: Handshake, permission: "eos.manage" },
      { title: "Employee Reports", href: "/management/employee-reports", icon: BarChart, permission: "user.manage" },
    ],
  },
  {
    title: "Finance & Payroll",
    icon: Banknote,
    children: [
      { title: "Finances", href: "/admin/finance", icon: WalletIcon, permission: "loans.manage" },
      { title: "Loan Management", href: "/management/loans", icon: DollarSign, permission: "loans.manage" },
      { title: "Expense Claims", href: "/management/expenses", icon: Receipt, permission: "expenses.manage" },
      { title: "Leave Encashment", href: "/management/leave-encashment", icon: Wallet, permission: "leaves.manage" },
      { title: "Payroll Runs", href: "/payroll/runs", icon: CreditCard, permission: "payroll.manage" },
      { title: "Salary Structures", href: "/payroll/structure", icon: DollarSign, permission: "payroll.manage" },
      { title: "Payroll Components", href: "/payroll/components", icon: Calculator, permission: "payroll.manage" },
      { title: "Payroll Groups", href: "/payroll/groups", icon: Users, permission: "payroll.manage" },
    ]
  },
  {
    title: "Performance",
    icon: Star,
    permission: "performance.manage",
    children: [
      { title: "Review Cycles", href: "/performance/cycles", icon: CalendarDays },
      { title: "KPI Library", href: "/performance/kpi-library", icon: Library },
    ],
  },
  
];

// Consolidating all personal links under one group
const personalNavigations: NavItem[] = [
    {
    title: "Self Service",
    icon: User,
    children: [
      
      { title: "My Attendance", href: "/self-service/attendance", icon: ClipboardList },
      { title: "My Leaves", href: "/self-service/leaves", icon: CalendarDays },
      { title: "My Documents", href: "/self-service/documents", icon: FileCheck },
      { title: "My Payslips", href: "/self-service/payslips", icon: Receipt, userCheck: 'salary_visibility' },
      { title: "My Salary", href: "/self-service/salary", icon: Banknote, userCheck: 'salary_visibility' },
      { title: "My Skills", href: "/self-service/skills", icon: GraduationCap },
      { title: "My Performance", href: "/my-performance", icon: Star },
      { title: "My Expenses", href: "/self-service/expenses", icon: Receipt },
      { title: "My Benefits", href: "/self-service/benefits", icon: Award, permission: "benefits.manage" },
      { title: "Leave Encashment", href: "/self-service/leave-encashment", icon: Wallet },
      { title: "My Loans", href: "/self-service/loans", icon: DollarSign },
      { title: "My Bank Details", href: "/self-service/bank", icon: Wallet },
    ],
  },
];


export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>([])
  const pathname = usePathname()
  const { hasPermission, user } = useAuth()

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed")
    if (savedCollapsed) {
      setIsCollapsed(JSON.parse(savedCollapsed))
    }
    const savedOpenGroups = localStorage.getItem("sidebar-open-groups")
    let initialOpenGroups: string[] = []
    if (savedOpenGroups) {
      initialOpenGroups = JSON.parse(savedOpenGroups)
    }

    const allNavItems = [...adminNavigations, ...personalNavigations];
    const currentGroup = allNavItems.find((item) => item.children?.some((child) => child.href === pathname))
    
    if (currentGroup && !initialOpenGroups.includes(currentGroup.title)) {
      initialOpenGroups.push(currentGroup.title)
    }
    
    // Default to opening "My Workspace"
    if (initialOpenGroups.length === 0) {
      initialOpenGroups.push("My Workspace")
    }
    setOpenGroups(initialOpenGroups)
  }, [pathname])

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed))
  }, [isCollapsed])

  useEffect(() => {
    localStorage.setItem("sidebar-open-groups", JSON.stringify(openGroups))
  }, [openGroups])

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => (prev.includes(title) ? prev.filter((group) => group !== title) : [...prev, title]))
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const isGroupActive = (children: NavItem[]): boolean => {
    return children.some(child => child.href === pathname);
  }

  const shouldShowItem = (item: NavItem): boolean => {
    // Handle special user-based visibility checks first
    if (item.userCheck === 'salary_visibility') {
      return !!user?.salary_visibility; // '!!' converts the value to a boolean
    }
    
    // If an item has children, it should be shown if at least one child is shown
    if (item.children) {
      return item.children.some(child => shouldShowItem(child));
    }
    
    // For items without children, check permission
    return !item.permission || hasPermission(item.permission);
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    if (!shouldShowItem(item)) return null

    const Icon = item.icon
    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openGroups.includes(item.title)
    
    if (hasChildren) {
      const isParentActive = isGroupActive(item.children!);
      return (
        <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleGroup(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 h-10 font-semibold text-lg",
                isCollapsed && "px-2",
                isParentActive && !isOpen && "bg-accent text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="truncate">{item.title}</span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 ml-auto shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto shrink-0" />
                  )}
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 py-1 pl-4 border-l-2 border-muted ml-4">
            {item.children?.map((child) => renderNavItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Button
        key={item.title}
        variant={isActive ? "secondary" : "ghost"}
        className={cn("w-full justify-start gap-2 h-10", level > 0 && "pl-4", isCollapsed && "px-2")}
        asChild
      >
        <Link href={item.href!}>
          <Icon className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="truncate">{item.title}</span>}
        </Link>
      </Button>
    )
  }
  
  const isManager = hasPermission("user.manage") || hasPermission("leaves.manage");

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold">HR System</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={toggleCollapse} className="h-8 w-8 p-0">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
        {/* Admin & Management Section (Top) */}
        {isManager && (
            <div className="space-y-1">
                <Button
                    variant={pathname === "/admin/dashboard" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-2 h-10 font-semibold text-lg", isCollapsed && "px-2")}
                    asChild
                >
                    <Link href="/admin/dashboard">
                        <LayoutDashboard className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="truncate">Admin Dashboard</span>}
                    </Link>
                </Button>
                <Button
                    variant={pathname === "/directory" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-2 h-10 font-semibold text-lg", isCollapsed && "px-2")}
                    asChild
                >
                    <Link href="/directory">
                        <Users2Icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="truncate">Directory</span>}
                    </Link>
                </Button>
                {adminNavigations.map((item) => renderNavItem(item))}
                <Button
                    variant={pathname === "/admin/settings" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-2 h-10 font-semibold text-lg", isCollapsed && "px-2")}
                    asChild
                >
                    <Link href="/admin/settings">
                        <Settings className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="truncate">Settings</span>}
                    </Link>
                </Button>
            </div>
        )}
        
        {/* Personal Workspace Section (Bottom) */}
        <div className="w-full justify-start gap-2 h-10 font-semibold text-lg">
            Personal
        </div>
                <Button
                    variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-2 h-10 font-semibold text-lg", isCollapsed && "px-2")}
                    asChild
                >
                    <Link href="/dashboard">
                        <LayoutDashboard className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="truncate">My Dashboard</span>}
                    </Link>
                </Button>
                <Button
                    variant={pathname === "/profile" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start gap-2 h-10 font-semibold text-lg", isCollapsed && "px-2")}
                    asChild
                >
                    <Link href="/profile">
                        <User className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="truncate">Profile</span>}
                    </Link>
                </Button>
        
        <div className="space-y-1">
            {personalNavigations.map((item) => renderNavItem(item))}
        </div>
      </nav>
    </div>
  )
}