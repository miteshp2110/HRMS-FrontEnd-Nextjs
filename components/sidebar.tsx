
// "use client";

// import type React from "react";
// import { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useAuth } from "@/lib/auth-context";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
//   FileText,
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
//   RefreshCw,
//   Handshake,
//   FolderKanban,
//   Star,
//   Library,
//   BarChart,
//   UserPlus,
//   CalendarDays,
//   Users2Icon,
//   WalletIcon,
// } from "lucide-react";

// interface NavItem {
//   title: string;
//   href?: string;
//   icon: React.ComponentType<{ className?: string }>;
//   permission?: string;
//   children?: NavItem[];
//   userCheck?: 'salary_visibility';
// }

// // Navigation data remains the same
// const adminNavigations: NavItem[] = [
//   {
//     title: "Employee Management",
//     icon: UserCheck,
//     permission: "user.manage",
//     children: [
//       { title: "My Team", href: "/team", icon: UserPlus, permission: "onboarding.manage" },
//       { title: "Onboarding", href: "/admin/onboarding", icon: UserPlus, permission: "onboarding.manage" },
//       { title: "Attendance Records", href: "/management/attendance", icon: ClipboardList, permission: "attendance.manage" },
//       { title: "Leave Approvals", href: "/management/leaves", icon: FileCheck, permission: "leaves.manage" },
//       { title: "Skill Approvals", href: "/management/skill-approvals", icon: Award, permission: "skills.manage" },
//       { title: "Documents", href: "/management/documents", icon: FileText, permission: "documents.manage" },
//       { title: "Shift Rotation", href: "/management/shift-rotation", icon: RefreshCw, permission: "shift.manage" },
//       { title: "Employee Cases", href: "/admin/cases", icon: FolderKanban, permission: "cases.manage" },
//       { title: "EOS Settlements", href: "/admin/eos", icon: Handshake, permission: "eos.manage" },
//       { title: "Employee Reports", href: "/management/employee-reports", icon: BarChart, permission: "user.manage" },
//     ],
//   },
//   {
//     title: "Finance & Payroll",
//     icon: Banknote,
//     children: [
//       { title: "Finances", href: "/admin/finance", icon: WalletIcon, permission: "loans.manage" },
//       { title: "Loan Management", href: "/management/loans", icon: DollarSign, permission: "loans.manage" },
//       { title: "Expense Claims", href: "/management/expenses", icon: Receipt, permission: "expenses.manage" },
//       { title: "Leave Encashment", href: "/management/leave-encashment", icon: Wallet, permission: "leaves.manage" },
//       { title: "Payroll Runs", href: "/payroll/runs", icon: CreditCard, permission: "payroll.manage" },
//       { title: "Salary Structures", href: "/payroll/structure", icon: DollarSign, permission: "payroll.manage" },
//       { title: "Payroll Components", href: "/payroll/components", icon: Calculator, permission: "payroll.manage" },
//       { title: "Payroll Groups", href: "/payroll/groups", icon: Users, permission: "payroll.manage" },
//     ]
//   },
//   {
//     title: "Performance",
//     icon: Star,
//     permission: "performance.manage",
//     children: [
//       { title: "Review Cycles", href: "/performance/cycles", icon: CalendarDays },
//       { title: "KPI Library", href: "/performance/kpi-library", icon: Library },
//     ],
//   },
// ];

// const personalNavigations: NavItem[] = [
//   {
//     title: "Self Service",
//     icon: User,
//     children: [
//       { title: "My Attendance", href: "/self-service/attendance", icon: ClipboardList },
//       { title: "My Leaves", href: "/self-service/leaves", icon: CalendarDays },
//       { title: "My Documents", href: "/self-service/documents", icon: FileCheck },
//       { title: "My Payslips", href: "/self-service/payslips", icon: Receipt, userCheck: 'salary_visibility' },
//       { title: "My Salary", href: "/self-service/salary", icon: Banknote, userCheck: 'salary_visibility' },
//       { title: "My Skills", href: "/self-service/skills", icon: GraduationCap },
//       { title: "My Performance", href: "/my-performance", icon: Star },
//       { title: "My Expenses", href: "/self-service/expenses", icon: Receipt },
//       { title: "My Benefits", href: "/self-service/benefits", icon: Award, permission: "benefits.manage" },
//       { title: "Leave Encashment", href: "/self-service/leave-encashment", icon: Wallet },
//       { title: "My Loans", href: "/self-service/loans", icon: DollarSign },
//       { title: "My Bank Details", href: "/self-service/bank", icon: Wallet },
//     ],
//   },
// ];

// export function Sidebar() {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [openGroups, setOpenGroups] = useState<string[]>([]);
//   const pathname = usePathname();
//   const { hasPermission, user } = useAuth();
//   const navRef = useRef<HTMLElement>(null);

//   // Scroll position management
//   useEffect(() => {
//     const navElement = navRef.current;
//     if (!navElement) return;

//     const handleScroll = () => {
//       sessionStorage.setItem("sidebar-scroll-position", navElement.scrollTop.toString());
//     };

//     navElement.addEventListener("scroll", handleScroll, { passive: true });
//     return () => navElement.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const navElement = navRef.current;
//     if (!navElement) return;

//     requestAnimationFrame(() => {
//       const savedScrollPosition = sessionStorage.getItem("sidebar-scroll-position");
//       if (savedScrollPosition) {
//         navElement.scrollTop = parseInt(savedScrollPosition, 10);
//       }
//     });
//   }, [pathname]);

//   // Initialize collapsed state and open groups
//   useEffect(() => {
//     const savedCollapsed = localStorage.getItem("sidebar-collapsed");
//     if (savedCollapsed) {
//       setIsCollapsed(JSON.parse(savedCollapsed));
//     }

//     const savedOpenGroups = localStorage.getItem("sidebar-open-groups");
//     let initialOpenGroups: string[] = [];
//     if (savedOpenGroups) {
//       initialOpenGroups = JSON.parse(savedOpenGroups);
//     }

//     const allNavItems = [...adminNavigations, ...personalNavigations];
//     const currentGroup = allNavItems.find((item) => 
//       item.children?.some((child) => child.href === pathname)
//     );
    
//     if (currentGroup && !initialOpenGroups.includes(currentGroup.title)) {
//       initialOpenGroups.push(currentGroup.title);
//     }
    
//     if (initialOpenGroups.length === 0) {
//       initialOpenGroups.push("Self Service");
//     }
//     setOpenGroups(initialOpenGroups);
//   }, [pathname]);

//   // Save state to localStorage
//   useEffect(() => {
//     localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
//   }, [isCollapsed]);

//   useEffect(() => {
//     localStorage.setItem("sidebar-open-groups", JSON.stringify(openGroups));
//   }, [openGroups]);

//   const toggleGroup = useCallback((title: string) => {
//     setOpenGroups((prev) => 
//       prev.includes(title) 
//         ? prev.filter((group) => group !== title) 
//         : [...prev, title]
//     );
//   }, []);

//   const toggleCollapse = useCallback(() => {
//     setIsCollapsed((prev) => !prev);
//   }, []);

//   const isGroupActive = useCallback((children: NavItem[]): boolean => {
//     return children.some(child => child.href === pathname);
//   }, [pathname]);

//   const shouldShowItem = useCallback((item: NavItem): boolean => {
//     if (item.userCheck === 'salary_visibility') {
//       return !!user?.salary_visibility;
//     }
    
//     if (item.children) {
//       return item.children.some(child => shouldShowItem(child));
//     }
    
//     return !item.permission || hasPermission(item.permission);
//   }, [user, hasPermission]);

//   const renderNavItem = useCallback((item: NavItem, level = 0) => {
//     if (!shouldShowItem(item)) return null;

//     const Icon = item.icon;
//     const isActive = pathname === item.href;
//     const hasChildren = item.children && item.children.length > 0;
//     const isOpen = openGroups.includes(item.title);
//     const isParentActive = hasChildren ? isGroupActive(item.children!) : false;

//     if (hasChildren) {
//       const trigger = (
//         <Button
//           variant="ghost"
//           size="sm"
//           className={cn(
//             "w-full justify-start h-9 px-3 font-medium text-sm transition-all duration-200",
//             "hover:bg-accent hover:text-accent-foreground",
//             "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
//             isCollapsed && "px-2 justify-center",
//             (isParentActive || isOpen) && "bg-accent/50 text-accent-foreground font-semibold"
//           )}
//         >
//           <Icon className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-3")} />
//           {!isCollapsed && (
//             <>
//               <span className="truncate flex-1 text-left">{item.title}</span>
//               {isOpen ? (
//                 <ChevronDown className="h-3.5 w-3.5 ml-2 flex-shrink-0 transition-transform" />
//               ) : (
//                 <ChevronRight className="h-3.5 w-3.5 ml-2 flex-shrink-0 transition-transform" />
//               )}
//             </>
//           )}
//         </Button>
//       );

//       return (
//         <TooltipProvider key={item.title}>
//           <Collapsible open={isOpen} onOpenChange={() => toggleGroup(item.title)}>
//             <CollapsibleTrigger asChild>
//               {isCollapsed ? (
//                 <Tooltip>
//                   <TooltipTrigger asChild>{trigger}</TooltipTrigger>
//                   <TooltipContent side="right" className="font-medium">
//                     {item.title}
//                   </TooltipContent>
//                 </Tooltip>
//               ) : (
//                 trigger
//               )}
//             </CollapsibleTrigger>
//             <CollapsibleContent className={cn(
//               "space-y-1 mt-1 mb-2",
//               !isCollapsed && "ml-7 pl-3 border-l border-border/60"
//             )}>
//               {item.children?.map((child) => renderNavItem(child, level + 1))}
//             </CollapsibleContent>
//           </Collapsible>
//         </TooltipProvider>
//       );
//     }

//     const linkButton = (
//       <Button
//         variant={isActive ? "secondary" : "ghost"}
//         size="sm"
//         className={cn(
//           "w-full justify-start h-9 px-3 font-medium text-sm transition-all duration-200",
//           "hover:bg-accent hover:text-accent-foreground",
//           "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
//           level > 0 && "text-muted-foreground hover:text-foreground",
//           isActive && "bg-primary text-primary-foreground font-semibold shadow-sm",
//           isCollapsed && "px-2 justify-center"
//         )}
//         asChild
//       >
//         <Link href={item.href!}>
//           <Icon className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-3")} />
//           {!isCollapsed && <span className="truncate">{item.title}</span>}
//         </Link>
//       </Button>
//     );

//     return (
//       <TooltipProvider key={item.title}>
//         {isCollapsed ? (
//           <Tooltip>
//             <TooltipTrigger asChild>{linkButton}</TooltipTrigger>
//             <TooltipContent side="right" className="font-medium">
//               {item.title}
//             </TooltipContent>
//           </Tooltip>
//         ) : (
//           linkButton
//         )}
//       </TooltipProvider>
//     );
//   }, [isCollapsed, pathname, openGroups, toggleGroup, shouldShowItem, isGroupActive]);

//   const isManager = useMemo(() => 
//     hasPermission("user.manage") || hasPermission("leaves.manage"), 
//     [hasPermission]
//   );

//   return (
//     <div
//       className={cn(
//         "flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
//         "border-r border-border/60 shadow-sm",
//         "transition-all duration-300 ease-in-out",
//         isCollapsed ? "w-16" : "w-72"
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-border/60 bg-background/50">
//         {!isCollapsed && (
//           <div className="flex items-center gap-3">
//             <div className="p-1.5 rounded-lg bg-primary/10">
//               <Building2 className="h-5 w-5 text-primary" />
//             </div>
//             <span className="font-semibold text-lg tracking-tight">HR System</span>
//           </div>
//         )}
        
//         <Button 
//           variant="ghost" 
//           size="sm" 
//           onClick={toggleCollapse}
//           className="h-8 w-8 p-0 hover:bg-accent transition-colors"
//           aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {isCollapsed ? 
//             <Menu className="h-4 w-4" /> : 
//             <X className="h-4 w-4" />
//           }
//         </Button>
//       </div>

//       {/* Navigation */}
//       <nav 
//         ref={navRef}
//         className="flex-1 p-3 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
//       >
//         <div className="space-y-6">
//           {/* Admin Section */}
//           {isManager && (
//             <div className="space-y-2">
//               {!isCollapsed && (
//                 <div className="px-2 py-1">
//                   <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//                     Administration
//                   </h2>
//                 </div>
//               )}
              
//               <div className="space-y-1">
//                 <TooltipProvider>
//                   {[
//                     { href: "/admin/dashboard", icon: LayoutDashboard, title: "Admin Dashboard" },
//                     { href: "/directory", icon: Users2Icon, title: "Directory" }
//                   ].map(({ href, icon: Icon, title }) => {
//                     const button = (
//                       <Button
//                         variant={pathname === href ? "secondary" : "ghost"}
//                         size="sm"
//                         className={cn(
//                           "w-full justify-start h-9 px-3 font-medium text-sm",
//                           "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
//                           pathname === href && "bg-primary text-primary-foreground font-semibold shadow-sm",
//                           isCollapsed && "px-2 justify-center"
//                         )}
//                         asChild
//                       >
//                         <Link href={href}>
//                           <Icon className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-3")} />
//                           {!isCollapsed && <span className="truncate">{title}</span>}
//                         </Link>
//                       </Button>
//                     );

//                     return isCollapsed ? (
//                       <Tooltip key={href}>
//                         <TooltipTrigger asChild>{button}</TooltipTrigger>
//                         <TooltipContent side="right" className="font-medium">
//                           {title}
//                         </TooltipContent>
//                       </Tooltip>
//                     ) : button;
//                   })}
//                 </TooltipProvider>

//                 {adminNavigations.map(renderNavItem)}

//                 <TooltipProvider>
//                   {(() => {
//                     const button = (
//                       <Button
//                         variant={pathname === "/admin/settings" ? "secondary" : "ghost"}
//                         size="sm"
//                         className={cn(
//                           "w-full justify-start h-9 px-3 font-medium text-sm",
//                           "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
//                           pathname === "/admin/settings" && "bg-primary text-primary-foreground font-semibold shadow-sm",
//                           isCollapsed && "px-2 justify-center"
//                         )}
//                         asChild
//                       >
//                         <Link href="/admin/settings">
//                           <Settings className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-3")} />
//                           {!isCollapsed && <span className="truncate">Settings</span>}
//                         </Link>
//                       </Button>
//                     );

//                     return isCollapsed ? (
//                       <Tooltip>
//                         <TooltipTrigger asChild>{button}</TooltipTrigger>
//                         <TooltipContent side="right" className="font-medium">
//                           Settings
//                         </TooltipContent>
//                       </Tooltip>
//                     ) : button;
//                   })()}
//                 </TooltipProvider>
//               </div>
//             </div>
//           )}

//           {/* Personal Section */}
//           <div className="space-y-2">
//             {!isCollapsed && (
//               <div className="px-2 py-1">
//                 <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//                   Personal
//                 </h2>
//               </div>
//             )}

//             <div className="space-y-1">
//               <TooltipProvider>
//                 {[
//                   { href: "/dashboard", icon: LayoutDashboard, title: "My Dashboard" },
//                   { href: "/profile", icon: User, title: "Profile" }
//                 ].map(({ href, icon: Icon, title }) => {
//                   const button = (
//                     <Button
//                       variant={pathname === href ? "secondary" : "ghost"}
//                       size="sm"
//                       className={cn(
//                         "w-full justify-start h-9 px-3 font-medium text-sm",
//                         "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
//                         pathname === href && "bg-primary text-primary-foreground font-semibold shadow-sm",
//                         isCollapsed && "px-2 justify-center"
//                       )}
//                       asChild
//                     >
//                       <Link href={href}>
//                         <Icon className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-3")} />
//                         {!isCollapsed && <span className="truncate">{title}</span>}
//                       </Link>
//                     </Button>
//                   );

//                   return isCollapsed ? (
//                     <Tooltip key={href}>
//                       <TooltipTrigger asChild>{button}</TooltipTrigger>
//                       <TooltipContent side="right" className="font-medium">
//                         {title}
//                       </TooltipContent>
//                     </Tooltip>
//                   ) : button;
//                 })}
//               </TooltipProvider>

//               {personalNavigations.map(renderNavItem)}
//             </div>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }


"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  ChevronDown,
  Menu,
  Building2,
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
  Users2Icon,
  WalletIcon,
  Clock,
  FileWarning,
  DollarSignIcon,
} from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  children?: NavItem[];
  userCheck?: 'salary_visibility';
}

const adminNavigations: NavItem[] = [
  {
    title: "Employee Management",
    icon: UserCheck,
    permission: "user.manage",
    children: [
      { title: "My Team", href: "/team", icon: UserPlus, permission: "onboarding.manage" },
      { title: "Onboarding", href: "/admin/onboarding", icon: UserPlus, permission: "onboarding.manage" },
      { title: "Attendance Records", href: "/management/attendance", icon: ClipboardList, permission: "attendance.manage" },
      { title: "Leave Approvals", href: "/management/leaves", icon: FileCheck, permission: "leaves.manage" },
      { title: "Skill Approvals", href: "/management/skill-approvals", icon: Award, permission: "skills.manage" },
      { title: "Documents", href: "/management/documents", icon: FileText, permission: "documents.manage" },
      { title: "Shift Rotation", href: "/management/shift-rotation", icon: RefreshCw, permission: "shift.manage" },
      { title: "Employee's Cost", href: "/management/expense-on-employees", icon: DollarSignIcon, permission: "expenses.manage" },
      { title: "Employee Cases", href: "/admin/cases", icon: FolderKanban, permission: "cases.manage" },
      { title: "EOS Settlements", href: "/admin/eos", icon: Handshake, permission: "eos.manage" },
      // { title: "Employee Reports", href: "/management/employee-reports", icon: BarChart, permission: "user.manage" },
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

const personalNavigations: NavItem[] = [
  {
    title: "Self Service",
    icon: User,
    children: [
      { title: "Attendance", href: "/self-service/attendance", icon: ClipboardList },
      { title: "Overtime", href: "/self-service/overtime", icon: Clock },
      { title: "Leaves", href: "/self-service/leaves", icon: CalendarDays },
      { title: "Documents", href: "/self-service/documents", icon: FileCheck },
      { title: "Payslips", href: "/self-service/payslips", icon: Receipt, userCheck: 'salary_visibility' },
      { title: "Salary", href: "/self-service/salary", icon: Banknote, userCheck: 'salary_visibility' },
      { title: "Skills", href: "/self-service/skills", icon: GraduationCap },
      { title: "Performance", href: "/my-performance", icon: Star },
      { title: "Cases", href: "/self-service/cases", icon: FileWarning },
      { title: "Expenses", href: "/self-service/expenses", icon: Receipt },
      { title: "Benefits", href: "/self-service/benefits", icon: Award },
      { title: "Leave Encashment", href: "/self-service/leave-encashment", icon: Wallet },
      { title: "Loans", href: "/self-service/loans", icon: DollarSign },
      { title: "Bank Details", href: "/self-service/bank", icon: Wallet },
    ],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const pathname = usePathname();
  const { hasPermission, user } = useAuth();
  const navRef = useRef<HTMLElement>(null);

  // Scroll position management
  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    const handleScroll = () => {
      sessionStorage.setItem("sidebar-scroll-position", navElement.scrollTop.toString());
    };

    navElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => navElement.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    requestAnimationFrame(() => {
      const savedScrollPosition = sessionStorage.getItem("sidebar-scroll-position");
      if (savedScrollPosition) {
        navElement.scrollTop = parseInt(savedScrollPosition, 10);
      }
    });
  }, [pathname]);

  // Initialize collapsed state and open groups
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed");
    if (savedCollapsed) {
      setIsCollapsed(JSON.parse(savedCollapsed));
    }

    const savedOpenGroups = localStorage.getItem("sidebar-open-groups");
    let initialOpenGroups: string[] = [];
    if (savedOpenGroups) {
      initialOpenGroups = JSON.parse(savedOpenGroups);
    }

    const allNavItems = [...adminNavigations, ...personalNavigations];
    const currentGroup = allNavItems.find((item) => 
      item.children?.some((child) => child.href === pathname)
    );
    
    if (currentGroup && !initialOpenGroups.includes(currentGroup.title)) {
      initialOpenGroups.push(currentGroup.title);
    }
    
    if (initialOpenGroups.length === 0) {
      initialOpenGroups.push("Self Service");
    }
    setOpenGroups(initialOpenGroups);
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem("sidebar-open-groups", JSON.stringify(openGroups));
  }, [openGroups]);

  const toggleGroup = useCallback((title: string) => {
    setOpenGroups((prev) => 
      prev.includes(title) 
        ? prev.filter((group) => group !== title) 
        : [...prev, title]
    );
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const isGroupActive = useCallback((children: NavItem[]): boolean => {
    return children.some(child => child.href === pathname);
  }, [pathname]);

  const shouldShowItem = useCallback((item: NavItem): boolean => {
    if (item.userCheck === 'salary_visibility') {
      return !!user?.salary_visibility;
    }
    
    if (item.children) {
      return item.children.some(child => shouldShowItem(child));
    }
    
    return !item.permission || hasPermission(item.permission);
  }, [user, hasPermission]);

  const renderNavItem = useCallback((item: NavItem, level = 0) => {
    if (!shouldShowItem(item)) return null;

    const Icon = item.icon;
    const isActive = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openGroups.includes(item.title);
    const isParentActive = hasChildren ? isGroupActive(item.children!) : false;

    if (hasChildren) {
      const trigger = (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start h-10 px-3 font-medium text-sm transition-all duration-200 group relative",
            "text-slate-700 dark:text-slate-300",
            "hover:bg-slate-100 dark:hover:bg-slate-800",
            isCollapsed && "px-2 justify-center",
            (isParentActive || isOpen) && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          )}
        >
          <div className={cn(
            "flex items-center justify-center rounded-lg p-1.5 transition-all duration-200",
            (isParentActive || isOpen)
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-white group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
          )}>
            <Icon className="h-4 w-4 flex-shrink-0" />
          </div>
          {!isCollapsed && (
            <>
              <span className="truncate flex-1 text-left ml-2.5">
                {item.title}
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 ml-auto flex-shrink-0 transition-transform duration-200 text-white",
                isOpen && "rotate-180"
              )} />
            </>
          )}
        </Button>
      );

      return (
        <TooltipProvider key={item.title}>
          <Collapsible open={isOpen} onOpenChange={() => toggleGroup(item.title)}>
            <CollapsibleTrigger asChild>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                  <TooltipContent 
                    side="right" 
                    className="font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-0 shadow-lg"
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                trigger
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className={cn(
              "space-y-0.5 mt-1 overflow-hidden",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1",
              !isCollapsed && "ml-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700"
            )}>
              {item.children?.map((child) => renderNavItem(child, level + 1))}
            </CollapsibleContent>
          </Collapsible>
        </TooltipProvider>
      );
    }

    const linkButton = (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "w-full justify-start h-9 px-3 font-medium text-sm transition-all duration-200 group relative",
          "text-slate-700 dark:text-slate-300",
          level > 0 && "text-slate-600 dark:text-white",
          isActive 
            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20" 
            : "hover:bg-slate-100 dark:hover:bg-slate-800",
          isCollapsed && "px-2 justify-center"
        )}
        asChild
      >
        <Link href={item.href!} className="flex items-center">
          {/* Active indicator bar */}
          {isActive && !isCollapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
          )}
          
          <div className={cn(
            "flex items-center justify-center rounded-lg p-1.5 transition-all duration-200",
            isActive 
              ? "bg-white/20 text-white" 
              : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-white group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
          )}>
            <Icon className="h-4 w-4 flex-shrink-0" />
          </div>
          {!isCollapsed && (
            <span className={cn(
              "truncate ml-2.5",
              isActive && "font-semibold"
            )}>
              {item.title}
            </span>
          )}
        </Link>
      </Button>
    );

    return (
      <TooltipProvider key={item.title}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>{linkButton}</TooltipTrigger>
            <TooltipContent 
              side="right" 
              className="font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-0 shadow-lg"
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ) : (
          linkButton
        )}
      </TooltipProvider>
    );
  }, [isCollapsed, pathname, openGroups, toggleGroup, shouldShowItem, isGroupActive]);

  const isManager = useMemo(() => 
    hasPermission("user.manage") || hasPermission("leaves.manage"), 
    [hasPermission]
  );

  return (
    <div
      className={cn(
        "flex flex-col h-full",
        "bg-white dark:bg-zinc-950",
        "border-r border-slate-200 dark:border-zinc-900",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-y-zinc-800 bg-slate-50/50 dark:bg-zinc-950">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                HR System
              </span>
              <p className="text-xs text-slate-500 dark:text-white">Enterprise HRMS</p>
            </div>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleCollapse}
          className="h-9 w-9 p-0 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="h-4 w-4 text-slate-600 dark:text-white" />
        </Button>
      </div>

      {/* Navigation */}
      <nav 
        ref={navRef}
        className="flex-1 p-3 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-600"
      >
        <div className="space-y-6">
          {/* Admin Section */}
          {isManager && (
            <div className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-2">
                  <h2 className="text-[10px] font-bold text-slate-500 dark:text-white uppercase tracking-wider">
                    Administration
                  </h2>
                </div>
              )}
              
              <div className="space-y-0.5">
                <TooltipProvider>
                  {[
                    { href: "/admin/dashboard", icon: LayoutDashboard, title: "Admin Dashboard" },
                    { href: "/directory", icon: Users2Icon, title: "Directory" }
                  ].map(({ href, icon: Icon, title }) => {
                    const isActive = pathname === href;
                    const button = (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start h-9 px-3 font-medium text-sm group relative transition-all duration-200",
                          "text-slate-700 dark:text-white",
                          isActive 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                            : "hover:bg-slate-100 dark:hover:bg-slate-800",
                          isCollapsed && "px-2 justify-center"
                        )}
                        asChild
                      >
                        <Link href={href} className="flex items-center">
                          {isActive && !isCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                          )}
                          <div className={cn(
                            "flex items-center justify-center rounded-lg p-1.5 transition-all duration-200",
                            isActive 
                              ? "bg-white/20 text-white" 
                              : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-white group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                          )}>
                            <Icon className="h-4 w-4 flex-shrink-0" />
                          </div>
                          {!isCollapsed && (
                            <span className={cn("truncate ml-2.5", isActive && "font-semibold")}>
                              {title}
                            </span>
                          )}
                        </Link>
                      </Button>
                    );

                    return isCollapsed ? (
                      <Tooltip key={href}>
                        <TooltipTrigger asChild>{button}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium bg-slate-900 text-white border-0">
                          {title}
                        </TooltipContent>
                      </Tooltip>
                    ) : button;
                  })}
                </TooltipProvider>

                {adminNavigations.map(renderNavItem)}

                <TooltipProvider>
                  {(() => {
                    const isActive = pathname === "/admin/settings";
                    const button = (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-full justify-start h-9 px-3 font-medium text-sm group relative transition-all duration-200",
                          "text-slate-700 dark:text-white",
                          isActive 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                            : "hover:bg-slate-100 dark:hover:bg-slate-800",
                          isCollapsed && "px-2 justify-center"
                        )}
                        asChild
                      >
                        <Link href="/admin/settings" className="flex items-center">
                          {isActive && !isCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                          )}
                          <div className={cn(
                            "flex items-center justify-center rounded-lg p-1.5 transition-all duration-200",
                            isActive 
                              ? "bg-white/20 text-white" 
                              : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-white group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                          )}>
                            <Settings className="h-4 w-4 flex-shrink-0" />
                          </div>
                          {!isCollapsed && (
                            <span className={cn("truncate ml-2.5", isActive && "font-semibold")}>
                              Settings
                            </span>
                          )}
                        </Link>
                      </Button>
                    );

                    return isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{button}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium bg-slate-900 text-white border-0">
                          Settings
                        </TooltipContent>
                      </Tooltip>
                    ) : button;
                  })()}
                </TooltipProvider>
              </div>
            </div>
          )}

          {/* Personal Section */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-2">
                <h2 className="text-[10px] font-bold text-slate-500 dark:text-white uppercase tracking-wider">
                  Personal
                </h2>
              </div>
            )}

            <div className="space-y-0.5">
              <TooltipProvider>
                {[
                  { href: "/dashboard", icon: LayoutDashboard, title: "My Dashboard" },
                  { href: "/profile", icon: User, title: "Profile" }
                ].map(({ href, icon: Icon, title }) => {
                  const isActive = pathname === href;
                  const button = (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start h-9 px-3 font-medium text-sm group relative transition-all duration-200",
                        "text-slate-700 dark:text-slate-300",
                        isActive 
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                          : "hover:bg-slate-100 dark:hover:bg-slate-800",
                        isCollapsed && "px-2 justify-center"
                      )}
                      asChild
                    >
                      <Link href={href} className="flex items-center">
                        {isActive && !isCollapsed && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                        )}
                        <div className={cn(
                          "flex items-center justify-center rounded-lg p-1.5 transition-all duration-200",
                          isActive 
                            ? "bg-white/20 text-white" 
                            : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-white group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                        )}>
                          <Icon className="h-4 w-4 flex-shrink-0" />
                        </div>
                        {!isCollapsed && (
                          <span className={cn("truncate ml-2.5", isActive && "font-semibold")}>
                            {title}
                          </span>
                        )}
                      </Link>
                    </Button>
                  );

                  return isCollapsed ? (
                    <Tooltip key={href}>
                      <TooltipTrigger asChild>{button}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium bg-slate-900 text-white border-0">
                        {title}
                      </TooltipContent>
                    </Tooltip>
                  ) : button;
                })}
              </TooltipProvider>

              {personalNavigations.map(renderNavItem)}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
