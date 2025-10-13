
// "use client"

// import { useEffect, useState } from "react";
// import type { CSSProperties } from 'react';
// import { MainLayout } from "@/components/main-layout";
// import { useToast } from "@/hooks/use-toast";
// import { motion } from "framer-motion";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { 
//     LogIn, 
//     LogOut, 
//     Bell, 
//     FileText,
//     TrendingUp,
//     User,
//     Building,
//     Plane,
// } from "lucide-react";

// // --- TYPE DEFINITIONS ---
// interface ChartData {
//   name: string;
//   value: number;
//   fill: string;
// }

// interface LeaveBalance {
//   name: 'Annual' | 'Sick' | 'Casual';
//   used: number;
//   total: number;
//   fill: string;
// }

// interface TeamMember {
//   name: string;
//   avatarUrl: string;
// }

// interface Announcement {
//     id: number;
//     text: string;
//     date: string;
// }

// interface Holiday {
//     name: string;
//     date: string;
// }

// type TaskStatus = 'Pending' | 'Action Required';

// interface Task {
//     id: number;
//     text: string;
//     status: TaskStatus;
//     due: string;
// }

// interface DashboardData {
//     user: {
//         name: string;
//         initials: string;
//         avatarUrl: string;
//         reportingManager: TeamMember;
//     };
//     liveAttendance: {
//         status: string;
//         punchInTime: string;
//         shift: string;
//     };
//     monthlyAttendance: ChartData[];
//     leaveBalances: LeaveBalance[];
//     teamHub: {
//         announcements: Announcement[];
//         upcomingHoliday: Holiday;
//         teamOnLeave: TeamMember[];
//     };
//     myTasks: Task[];
// }


// // --- MAIN DASHBOARD PAGE ---
// export default function DashboardPage(): JSX.Element {
//     const { toast } = useToast();
//     const [myData, setMyData] = useState<DashboardData | null>(null);
//     const [isLoading, setIsLoading] = useState(true);

//     // --- STATE MANAGEMENT ---
//     const [time, setTime] = useState(new Date());
//     const [isPunchedIn, setIsPunchedIn] = useState(false);
//     const [isPunchDialogOpen, setIsPunchDialogOpen] = useState(false);
//     const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

//     // --- MOCK DATA ---
//     const mockData: DashboardData = {
//         user: {
//             name: "Alex Doe (Upcoming Patch: 05-10-2025)",
//             initials: "AD",
//             avatarUrl: "https://github.com/shadcn.png",
//             reportingManager: {
//                 name: "Samantha Green",
//                 avatarUrl: "https://i.pravatar.cc/150?img=12",
//             }
//         },
//         liveAttendance: {
//             status: "Punched In",
//             punchInTime: "2025-10-01T09:05:00",
//             shift: "09:00 AM - 06:00 PM"
//         },
//         monthlyAttendance: [
//             { name: 'Present', value: 18, fill: '#22c55e' },
//             { name: 'Absent', value: 1, fill: '#ef4444' },
//             { name: 'Half-Day', value: 2, fill: '#f97316' },
//             { name: 'Leave', value: 3, fill: '#3b82f6' },
//         ],
//         leaveBalances: [
//             { name: 'Annual', used: 5, total: 12, fill: '#3b82f6' },
//             { name: 'Sick', used: 2, total: 8, fill: '#f97316' },
//             { name: 'Casual', used: 1, total: 5, fill: '#8b5cf6' },
//         ],
//         teamHub: {
//             announcements: [
//                 { id: 1, text: "Annual performance reviews are starting next week.", date: "2025-09-28" },
//                 { id: 2, text: "New coffee machine installed in the breakroom!", date: "2025-09-25" },
//             ],
//             upcomingHoliday: { name: "Diwali", date: "2025-11-01" },
//             teamOnLeave: [
//                 { name: "Charlie Brown", avatarUrl: "https://i.pravatar.cc/150?img=3" },
//                 { name: "Diana Prince", avatarUrl: "https://i.pravatar.cc/150?img=4" },
//             ]
//         },
//         myTasks: [
//             { id: 1, text: "Submit Q3 Performance Report", status: "Pending", due: "2025-10-05" },
//             { id: 2, text: "Approve overtime for John", status: "Action Required", due: "2025-10-02" },
//             { id: 3, text: "Complete mandatory security training", status: "Pending", due: "2025-10-15" }
//         ]
//     };
    
//     // --- EFFECTS ---
//     useEffect(() => {
//         const timer = setInterval(() => setTime(new Date()), 1000);
        
//         const fetchDashboardData = async () => {
//             setIsLoading(true);
//             try {
//                 await new Promise(resolve => setTimeout(resolve, 1000));
//                 setMyData(mockData);
//                 setIsPunchedIn(mockData.liveAttendance.status === "Punched In");
//             } catch (error) {
//                 console.error("Error fetching dashboard data:", error);
//                 toast({ title: "Error", description: "A critical error occurred while loading the dashboard.", variant: "destructive"});
//             } finally {
//                 setIsLoading(false);
//             }
//         };
        
//         fetchDashboardData();
//         return () => clearInterval(timer);
//     }, [toast]);


//     // --- HELPER FUNCTIONS ---
//     const getGreeting = () => {
//         const hour = time.getHours();
//         if (hour < 12) return "Good Morning";
//         if (hour < 18) return "Good Afternoon";
//         return "Good Evening";
//     };

//     const handlePunch = () => {
//         setIsPunchedIn(!isPunchedIn);
//         setIsPunchDialogOpen(false);
//         toast({
//             title: `Successfully ${isPunchedIn ? "Punched Out" : "Punched In"}!`,
//             description: `Your time has been recorded.`,
//         });
//     };
    
//     const handleRequestSubmit = () => {
//       setIsLeaveDialogOpen(false);
//       toast({title: "Success", description: "Your leave request has been submitted."});
//     };

//     const getStatusVariant = (status: TaskStatus) => {
//         if (status === "Action Required") return "destructive";
//         return "default";
//     };

//     // --- LOADING STATE ---
//     if (isLoading || !myData) {
//         return (
//             <MainLayout>
//                 <div className="flex items-center justify-center h-full">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//                 </div>
//             </MainLayout>
//         );
//     }

//     // --- ANIMATION VARIANTS ---
//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
//     };

//     const itemVariants = {
//         hidden: { y: 20, opacity: 0 },
//         visible: { y: 0, opacity: 1 }
//     };

//     // --- RENDER ---
//     return (
//         <MainLayout>
//             <motion.div 
//                 className="space-y-6"
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//             >
//                 {/* --- Welcome Header --- */}
//                 <motion.div variants={itemVariants}>
//                     <div className="flex justify-between items-center bg-card p-6 rounded-lg border">
//                         <div>
//                             <h1 className="text-2xl font-bold text-primary">{getGreeting()}, {myData.user.name}!</h1>
//                             <p className="text-muted-foreground">{time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
//                             <p className="text-muted-foreground font-mono mt-1">{time.toLocaleTimeString()}</p>
//                         </div>
//                         <div className="text-right">
//                             <p className="text-sm text-muted-foreground">Reporting to:</p>
//                             <div className="flex items-center gap-2 mt-1">
//                                 <Avatar className="h-8 w-8">
//                                     <AvatarImage src={myData.user.reportingManager.avatarUrl} alt={myData.user.reportingManager.name} />
//                                     <AvatarFallback>{myData.user.reportingManager.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
//                                 </Avatar>
//                                 <span className="font-semibold">{myData.user.reportingManager.name}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>
                
//                 <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
//                     {/* --- Column 1 --- */}
//                     <motion.div variants={itemVariants} className="space-y-6">
                        
//                         {/* --- Live Attendance Card --- */}
//                         <Card className="h-full flex flex-col">
//                             <CardHeader>
//                                 <CardTitle className="flex items-center justify-between">
//                                     <span>Live Attendance</span>
//                                     <Badge variant={isPunchedIn ? "default" : "outline"} className={isPunchedIn ? "bg-green-500 text-white" : ""}>
//                                         {isPunchedIn ? "Punched In" : "Punched Out"}
//                                     </Badge>
//                                 </CardTitle>
//                                 <CardDescription>{myData.liveAttendance.shift}</CardDescription>
//                             </CardHeader>
//                             <CardContent className="flex-grow flex flex-col justify-center items-center gap-4">
//                                 {isPunchedIn && (
//                                     <div className="text-center">
//                                         <p className="text-muted-foreground">Punched in at</p>
//                                         <p className="text-3xl font-bold font-mono text-primary">
//                                             {new Date(myData.liveAttendance.punchInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                         </p>
//                                     </div>
//                                 )}
//                                 <Button onClick={() => setIsPunchDialogOpen(true)} size="lg" className="w-full">
//                                     {isPunchedIn ? <LogOut className="mr-2 h-5 w-5"/> : <LogIn className="mr-2 h-5 w-5"/>}
//                                     {isPunchedIn ? "Punch Out" : "Punch In"}
//                                 </Button>
//                             </CardContent>
//                         </Card>

//                         {/* --- Leave Balance Card --- */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Leave Balances</CardTitle>
//                                 <CardDescription>Your available leaves for the year.</CardDescription>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 {myData.leaveBalances.map(leave => (
//                                     <div key={leave.name}>
//                                         <div className="flex justify-between items-center mb-1">
//                                             <span className="text-sm font-medium">{leave.name}</span>
//                                             <span className="text-sm text-muted-foreground">{leave.used}/{leave.total} Days</span>
//                                         </div>
//                                         <Progress value={(leave.used / leave.total) * 100} className="h-2" style={{'--progress-color': leave.fill} as CSSProperties}/>
//                                     </div>
//                                 ))}
//                                 <Button className="w-full mt-4" onClick={() => setIsLeaveDialogOpen(true)}>
//                                     <Plane className="mr-2 h-4 w-4"/> Request Leave
//                                 </Button>
//                             </CardContent>
//                         </Card>
//                     </motion.div>

//                     {/* --- Column 2 --- */}
//                     <motion.div variants={itemVariants} className="space-y-6">

//                         {/* --- Attendance Chart Card --- */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>This Month's Summary</CardTitle>
//                                 <CardDescription>Overview of your attendance in October.</CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <ResponsiveContainer width="100%" height={250}>
//                                     <BarChart data={myData.monthlyAttendance} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                                         <XAxis type="number" hide />
//                                         <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={60} />
//                                         <Tooltip cursor={{fill: 'rgba(128, 128, 128, 0.1)'}} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}/>
//                                         <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]} />
//                                     </BarChart>
//                                 </ResponsiveContainer>
//                             </CardContent>
//                         </Card>

//                         {/* --- My Tasks Card --- */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>My Tasks & Requests</CardTitle>
//                                 <CardDescription>Your pending actions and approvals.</CardDescription>
//                             </CardHeader>
//                             <CardContent className="space-y-3">
//                                 {myData.myTasks.map(task => (
//                                     <div key={task.id} className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50">
//                                         <div>
//                                             <p className="text-sm font-medium">{task.text}</p>
//                                             <p className="text-xs text-muted-foreground">Due: {new Date(task.due).toLocaleDateString()}</p>
//                                         </div>
//                                         <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
//                                     </div>
//                                 ))}
//                             </CardContent>
//                         </Card>
//                     </motion.div>
                    
//                     {/* --- Column 3 --- */}
//                     <motion.div variants={itemVariants} className="space-y-6">
                        
//                         {/* --- Team Hub Card --- */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Team Hub</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <Tabs defaultValue="announcements">
//                                     <TabsList className="grid w-full grid-cols-3">
//                                         <TabsTrigger value="announcements">Announcements</TabsTrigger>
//                                         <TabsTrigger value="holiday">Holiday</TabsTrigger>
//                                         <TabsTrigger value="on-leave">On Leave</TabsTrigger>
//                                     </TabsList>
//                                     <TabsContent value="announcements" className="mt-4 space-y-3">
//                                         {myData.teamHub.announcements.map(item => (
//                                             <div key={item.id} className="flex items-start gap-3">
//                                                 <Bell className="h-4 w-4 mt-1 text-primary"/>
//                                                 <div>
//                                                     <p className="text-sm">{item.text}</p>
//                                                     <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </TabsContent>
//                                     <TabsContent value="holiday" className="mt-4 text-center">
//                                         <p className="text-muted-foreground">Next Upcoming Holiday</p>
//                                         <p className="text-xl font-semibold text-primary">{myData.teamHub.upcomingHoliday.name}</p>
//                                         <p className="text-sm">{new Date(myData.teamHub.upcomingHoliday.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
//                                     </TabsContent>
//                                     <TabsContent value="on-leave" className="mt-4 space-y-2">
//                                         <p className="text-sm text-muted-foreground">Colleagues on leave today:</p>
//                                         {myData.teamHub.teamOnLeave.map(member => (
//                                             <div key={member.name} className="flex items-center gap-2">
//                                                 <Avatar className="h-6 w-6">
//                                                     <AvatarImage src={member.avatarUrl} alt={member.name} />
//                                                 </Avatar>
//                                                 <span className="text-sm">{member.name}</span>
//                                             </div>
//                                         ))}
//                                     </TabsContent>
//                                 </Tabs>
//                             </CardContent>
//                         </Card>
                        
//                         {/* --- Quick Actions Card --- */}
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Quick Actions</CardTitle>
//                             </CardHeader>
//                             <CardContent className="grid grid-cols-2 gap-4">
//                                 <Button variant="outline"><FileText className="mr-2 h-4 w-4"/>View Payslip</Button>
//                                 <Button variant="outline"><TrendingUp className="mr-2 h-4 w-4"/>Submit Expense</Button>
//                                 <Button variant="outline"><User className="mr-2 h-4 w-4"/>Update Profile</Button>
//                                 <Button variant="outline"><Building className="mr-2 h-4 w-4"/>Company Directory</Button>
//                             </CardContent>
//                         </Card>

//                     </motion.div>
//                 </div>
//             </motion.div>

//             {/* --- DIALOGS --- */}
//             <Dialog open={isPunchDialogOpen} onOpenChange={setIsPunchDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Confirm Action</DialogTitle>
//                         <DialogDescription>
//                             Are you sure you want to {isPunchedIn ? "punch out" : "punch in"}? Your time will be recorded as {time.toLocaleTimeString()}.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setIsPunchDialogOpen(false)}>Cancel</Button>
//                         <Button onClick={handlePunch}>Confirm</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>New Leave Request</DialogTitle>
//                         <DialogDescription>Fill out the details below to submit a leave request.</DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                         <div className="grid grid-cols-4 items-center gap-4">
//                             <Label htmlFor="leave-type" className="text-right">Leave Type</Label>
//                             <Select>
//                                 <SelectTrigger className="col-span-3">
//                                     <SelectValue placeholder="Select a leave type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="annual">Annual Leave</SelectItem>
//                                     <SelectItem value="sick">Sick Leave</SelectItem>
//                                     <SelectItem value="casual">Casual Leave</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                          <div className="grid grid-cols-4 items-center gap-4">
//                             <Label htmlFor="start-date" className="text-right">Start Date</Label>
//                             <Input id="start-date" type="date" className="col-span-3" />
//                         </div>
//                          <div className="grid grid-cols-4 items-center gap-4">
//                             <Label htmlFor="end-date" className="text-right">End Date</Label>
//                             <Input id="end-date" type="date" className="col-span-3" />
//                         </div>
//                          <div className="grid grid-cols-4 items-center gap-4">
//                             <Label htmlFor="reason" className="text-right">Reason</Label>
//                             <Textarea id="reason" className="col-span-3" placeholder="Reason for your leave..." />
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>Cancel</Button>
//                         <Button onClick={handleRequestSubmit}>Submit Request</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </MainLayout>
//     );
// }



"use client";

import { UserDashboardPage } from "@/components/dashboard/user-dashboard-page";
import { MainLayout } from "@/components/main-layout";
import { useAuth } from "@/lib/auth-context";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  else{
    return (
        <MainLayout>
            <UserDashboardPage />;
        </MainLayout>
    )
  }
  // return <AdminDashboardPage />;
}