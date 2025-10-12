// "use client"

// import { useEffect, useState } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { getAdminDashboardData, type AdminDashboardData } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// import { AdminStatsWidget } from "@/components/dashboard/admin/admin-stats-widget"
// import { ExpiringDocumentsWidget } from "@/components/dashboard/admin/expiring-documents-widget"
// import { PendingApprovalsWidget } from "@/components/dashboard/admin/pending-approvals-widget"
// import { HeadcountChartWidget } from "@/components/dashboard/admin/headcount-chart-widget"
// import { CompanyAttendanceChart } from "@/components/dashboard/company-attendance-chart"


// export function AdminDashboardPage() {
//   const { hasPermission } = useAuth()
//   const { toast } = useToast()
  
//   const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   const isManager = hasPermission("user.manage") || hasPermission("leaves.manage");

//   useEffect(() => {
//     const fetchAdminData = async () => {
//       if(isManager) {
//         setIsLoading(true);
//         try {
//           const data = await getAdminDashboardData();
//           setAdminData(data);
//         } catch (error) {
//           console.error("Error fetching admin dashboard data:", error)
//           toast({ title: "Error", description: "Could not load admin dashboard data.", variant: "destructive"})
//         } finally {
//           setIsLoading(false)
//         }
//       }
//     }
//     fetchAdminData()
//   }, [isManager, toast])

//   if (isLoading || !adminData) {
//     return (
//         <div className="flex items-center justify-center h-full">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
//             <AdminStatsWidget headcount={adminData.headcount} todayAttendance={adminData.todayAttendance} />
//             {hasPermission('leaves.manage') && <PendingApprovalsWidget leaves={adminData.pendingLeaveApprovals} skills={adminData.pendingSkillRequests} loans={adminData.pendingLoanRequests} />}
//             <div className="space-y-6">
//                 {hasPermission('documents.manage') && <ExpiringDocumentsWidget documents={adminData.expiringDocuments} />}
//             </div>
//             <CompanyAttendanceChart data={{presentToday:adminData.todayAttendance.present,absentToday:adminData.todayAttendance.absent,onLeaveToday:adminData.todayAttendance.leave}} />
//         </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react";
import type { CSSProperties } from 'react';
import { MainLayout } from "@/components/main-layout";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Users,
    ClipboardCheck,
    Hourglass,
    UserCheck,
    UserX,
    Plane,
    TrendingUp,
    FileWarning,
    Cake,
    Building,
    Check,
    X,
    HandCoins,
    Receipt,
    User,
    Badge,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
type ApprovalType = 'Leave' | 'Loan' | 'Expense';
interface PendingApproval {
    id: number;
    type: ApprovalType;
    person: {
        name: string;
        avatarUrl: string;
    };
    details: string;
    date: string;
}
interface StatCard {
    title: string;
    value: string;
    change?: string;
    icon: React.ElementType;
    color: string;
}
interface HeadcountData {
    month: string;
    count: number;
}
interface ExpiringDocument {
    id: number;
    personName: string;
    docName: string;
    expiryDate: string;
}
interface UpcomingEvent {
    id: number;
    personName: string;
    eventName: string;
    date: string;
}
interface AdminDashboardData {
    stats: StatCard[];
    pendingApprovals: PendingApproval[];
    headcountGrowth: HeadcountData[];
    todayAttendance: { present: number; absent: number; leave: number };
    expiringDocuments: ExpiringDocument[];
    upcomingEvents: UpcomingEvent[];
}

// --- MOCK DATA STORE ---
const mockAdminData: AdminDashboardData = {
    stats: [
        { title: "Total Employees", value: "142", change: "+2 this month", icon: Users, color: "text-blue-500" },
        { title: "On Duty Today", value: "128", change: "90%", icon: UserCheck, color: "text-green-500" },
        { title: "On Leave Today", value: "8", icon: Plane, color: "text-yellow-500" },
        { title: "Pending Approvals", value: "6", icon: Hourglass, color: "text-red-500" },
    ],
    pendingApprovals: [
        { id: 1, type: 'Leave', person: { name: "John Doe", avatarUrl: "https://i.pravatar.cc/150?img=1" }, details: "Casual Leave (2 days)", date: "2025-10-05" },
        { id: 2, type: 'Loan', person: { name: "Jane Smith", avatarUrl: "https://i.pravatar.cc/150?img=2" }, details: "Emergency Loan ($2000)", date: "2025-10-02" },
        { id: 3, type: 'Expense', person: { name: "Peter Jones", avatarUrl: "https://i.pravatar.cc/150?img=3" }, details: "Client Dinner ($150)", date: "2025-10-01" },
        { id: 4, type: 'Leave', person: { name: "Mary Williams", avatarUrl: "https://i.pravatar.cc/150?img=4" }, details: "Sick Leave (1 day)", date: "2025-10-04" },
        { id: 5, type: 'Leave', person: { name: "Charlie Brown", avatarUrl: "https://i.pravatar.cc/150?img=5" }, details: "Annual Leave (5 days)", date: "2025-10-10" },
        { id: 6, type: 'Loan', person: { name: "Diana Prince", avatarUrl: "https://i.pravatar.cc/150?img=6" }, details: "Home Improvement ($5000)", date: "2025-09-30" },
    ],
    headcountGrowth: [
        { month: "Apr", count: 120 },
        { month: "May", count: 125 },
        { month: "Jun", count: 128 },
        { month: "Jul", count: 130 },
        { month: "Aug", count: 135 },
        { month: "Sep", count: 140 },
        { month: "Oct", count: 142 },
    ],
    todayAttendance: { present: 128, absent: 6, leave: 8 },
    expiringDocuments: [
        { id: 1, personName: "Ahmed Khan", docName: "Work Visa", expiryDate: "2025-10-25" },
        { id: 2, personName: "Susan Lee", docName: "Passport", expiryDate: "2025-11-15" },
    ],
    upcomingEvents: [
        { id: 1, personName: "Michael Scott", eventName: "Work Anniversary (5 Years)", date: "2025-10-08" },
        { id: 2, personName: "Pam Beesly", eventName: "Birthday", date: "2025-10-12" },
    ],
};

// --- MAIN ADMIN DASHBOARD PAGE ---
export default function AdminDashboardPageX(): JSX.Element {
    const { toast } = useToast();
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
    
    // MOCK PERMISSION
    const isManager = true;

    // --- DATA LOADING EFFECT ---
    useEffect(() => {
        const fetchAdminData = async () => {
            if(isManager) {
                setIsLoading(true);
                try {
                    // Simulating API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setData(mockAdminData);
                } catch (error) {
                    console.error("Error fetching admin dashboard data:", error)
                    toast({ title: "Error", description: "Could not load admin dashboard data.", variant: "destructive"})
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchAdminData()
    }, [isManager, toast])

    // --- HANDLER FUNCTIONS ---
    const handleReviewClick = (approval: PendingApproval) => {
        setSelectedApproval(approval);
        setIsApprovalDialogOpen(true);
    };

    const handleApprovalAction = (action: 'Approved' | 'Rejected') => {
        if (!selectedApproval || !data) return;

        // Simulate updating the data by filtering out the handled request
        setData({
            ...data,
            pendingApprovals: data.pendingApprovals.filter(p => p.id !== selectedApproval.id)
        });

        toast({
            title: `Request ${action}`,
            description: `${selectedApproval.type} request for ${selectedApproval.person.name} has been ${action.toLowerCase()}.`,
        });
        setIsApprovalDialogOpen(false);
        setSelectedApproval(null);
    };

    // --- LOADING STATE ---
    if (isLoading || !data) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </MainLayout>
        );
    }
    
    const attendanceChartData = [
        { name: 'Present', value: data.todayAttendance.present, fill: '#22c55e' },
        { name: 'Absent', value: data.todayAttendance.absent, fill: '#ef4444' },
        { name: 'On Leave', value: data.todayAttendance.leave, fill: '#f97316' },
    ];

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };
    
    // --- RENDER ---
    return (
        <MainLayout>
            <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                
                {/* --- STATS CARDS --- */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {data.stats.map((stat) => (
                        <motion.div key={stat.title} variants={itemVariants}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                    <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    {stat.change && <p className="text-xs text-muted-foreground">{stat.change}</p>}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    {/* --- PENDING APPROVALS (MAIN WIDGET) --- */}
                    <motion.div className="lg:col-span-2" variants={itemVariants}>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Pending Approvals</CardTitle>
                                <CardDescription>Review and act on pending requests from your team.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="Leave">
                                    <TabsList className="grid w-full grid-cols-3">
                                        {(['Leave', 'Loan', 'Expense'] as ApprovalType[]).map(type => (
                                            <TabsTrigger key={type} value={type}>
                                                {type}
                                                <Badge className="ml-2">{data.pendingApprovals.filter(p => p.type === type).length}</Badge>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {(['Leave', 'Loan', 'Expense'] as ApprovalType[]).map(type => (
                                        <TabsContent key={type} value={type} className="mt-4 space-y-2">
                                            {data.pendingApprovals.filter(p => p.type === type).map(approval => (
                                                <div key={approval.id} className="flex items-center justify-between p-2 rounded-md border">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={approval.person.avatarUrl} />
                                                            <AvatarFallback>{approval.person.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold text-sm">{approval.person.name}</p>
                                                            <p className="text-xs text-muted-foreground">{approval.details}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="secondary" size="sm" onClick={() => handleReviewClick(approval)}>Review</Button>
                                                </div>
                                            ))}
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    {/* --- ATTENDANCE CHART --- */}
                    <motion.div variants={itemVariants}>
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Today's Live Attendance</CardTitle>
                                <CardDescription>Company-wide presence summary.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={attendanceChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false}>
                                            {attendanceChartData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {/* --- HEADCOUNT GROWTH CHART --- */}
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Headcount Growth</CardTitle>
                                <CardDescription>Employee count over the last 6 months.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={data.headcountGrowth}>
                                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                        <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    {/* --- ALERTS & EVENTS --- */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <Card>
                             <CardHeader>
                                <CardTitle>Alerts & Upcoming Events</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.expiringDocuments.map(doc => (
                                    <div key={doc.id} className="flex items-center gap-3 p-2 bg-destructive/10 rounded-md">
                                        <FileWarning className="h-5 w-5 text-destructive" />
                                        <div>
                                            <p className="text-sm font-semibold">{doc.docName} expiring for {doc.personName}</p>
                                            <p className="text-xs text-muted-foreground">Expires on {doc.expiryDate}</p>
                                        </div>
                                    </div>
                                ))}
                                {data.upcomingEvents.map(event => (
                                     <div key={event.id} className="flex items-center gap-3">
                                        <Cake className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm font-semibold">{event.eventName}</p>
                                            <p className="text-xs text-muted-foreground">{event.personName} on {event.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Admin Actions</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <Button><User className="mr-2 h-4 w-4"/>Onboard Employee</Button>
                                <Button><ClipboardCheck className="mr-2 h-4 w-4"/>Run Payroll</Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

            </motion.div>
            
            {/* --- APPROVAL DIALOG --- */}
            {selectedApproval && (
                <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Review {selectedApproval.type} Request</DialogTitle>
                            <DialogDescription>
                                From: {selectedApproval.person.name}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-2">
                           <p><span className="font-semibold">Details:</span> {selectedApproval.details}</p>
                           <p><span className="font-semibold">Date:</span> {selectedApproval.date}</p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleApprovalAction('Rejected')}><X className="mr-2 h-4 w-4" /> Reject</Button>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprovalAction('Approved')}><Check className="mr-2 h-4 w-4" /> Approve</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </MainLayout>
    );
}