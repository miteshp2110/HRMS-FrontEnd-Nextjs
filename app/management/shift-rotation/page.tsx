

// "use client"

// import * as React from "react";
// import Link from "next/link";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { RefreshCw, Plus, ArrowRight } from "lucide-react";
// import { getAllShiftRotations, type ShiftRotation } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

// export default function ShiftRotationDashboardPage() {
//     const { toast } = useToast();
//     const [rotations, setRotations] = React.useState<ShiftRotation[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);

//     const fetchData = React.useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const data = await getAllShiftRotations();
//             setRotations(data);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load shift rotations.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     const getStatusBadge = (status: string) => {
//         const statusMap: Record<string, string> = {
//             'Draft': 'bg-gray-100 text-gray-800',
//             'Pending Approval': 'bg-yellow-100 text-yellow-800',
//             'Approved': 'bg-blue-100 text-blue-800',
//             'Executed': 'bg-green-100 text-green-800',
//         };
//         return <Badge className={statusMap[status] || ""}>{status}</Badge>;
//     }

//     return (
//         <MainLayout>
//              <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                         <RefreshCw className="h-8 w-8" />
//                         <div>
//                             <h1 className="text-3xl font-bold">Shift Rotations (Under Patch : update on 05-10-2025)</h1>
//                             <p className="text-muted-foreground">Manage and schedule employee shift changes.</p>
//                         </div>
//                     </div>
//                     <Button asChild>
//                         <Link href="/management/shift-rotation/create">
//                             <Plus className="h-4 w-4 mr-2" />
//                             Create New Rotation
//                         </Link>
//                     </Button>
//                 </div>
//                 <Card>
//                     <CardHeader><CardTitle>All Rotations</CardTitle></CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Rotation Name</TableHead>
//                                     <TableHead>Effective Date</TableHead>
//                                     <TableHead>Employees</TableHead>
//                                     <TableHead>Status</TableHead>
//                                     <TableHead className="text-right">Action</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {isLoading ? (
//                                     <TableRow><TableCell colSpan={5} className="text-center h-24">Loading rotations...</TableCell></TableRow>
//                                 ) : 
//                                   rotations.length === 0?
//                                   <TableRow><TableCell colSpan={5} className="text-center h-24">No Record Found</TableCell></TableRow>
//                                   :
//                                   rotations.map(item => (
//                                     <TableRow key={item.id}>
//                                         <TableCell className="font-medium">{item.rotation_name}</TableCell>
//                                         <TableCell>{new Date(item.effective_from).toLocaleDateString()}</TableCell>
//                                         <TableCell>{item.employee_count}</TableCell>
//                                         <TableCell>{getStatusBadge(item.status)}</TableCell>
//                                         <TableCell className="text-right">
//                                             <Button asChild variant="outline" size="sm">
//                                                 <Link href={`/management/shift-rotation/${item.id}`}>
//                                                     View Details <ArrowRight className="h-4 w-4 ml-2" />
//                                                 </Link>
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                                 }
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//              </div>
//         </MainLayout>
//     );
// }



"use client"

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Plus, ArrowRight, Calendar, Users } from "lucide-react";
import { getAllShiftRotations, type ShiftRotation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ShiftRotationDashboardPage() {
    const { toast } = useToast();
    const [rotations, setRotations] = React.useState<ShiftRotation[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const fetchData = React.useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        
        try {
            const data = await getAllShiftRotations();
            setRotations(data);
            if (isRefresh) {
                toast({ 
                    title: "Success", 
                    description: "Shift rotations refreshed successfully.",
                    variant: "default"
                });
            }
        } catch (error: any) {
            toast({ 
                title: "Error", 
                description: error?.message || "Could not load shift rotations.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { bg: string; text: string; icon?: string }> = {
            'Draft': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
            'Pending Approval': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
            'Approved': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
            'Executed': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
        };
        
        const config = statusMap[status] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };
        
        return (
            <Badge 
                variant="secondary"
                className={cn(
                    "font-medium transition-colors",
                    config.bg,
                    config.text
                )}
            >
                {status}
            </Badge>
        );
    };

    const TableSkeleton = () => (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                    <TableCell>
                        <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 w-28 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                        <Skeleton className="h-9 w-32 ml-auto" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );

    const StatsCard = ({ 
        title, 
        value, 
        icon: Icon, 
        color 
    }: { 
        title: string; 
        value: string | number; 
        icon: any; 
        color: string;
    }) => (
        <Card className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-primary/5">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold tracking-tight">{value}</p>
                    </div>
                    <div className={cn(
                        "p-3 rounded-xl",
                        color
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const stats = React.useMemo(() => {
        if (isLoading) return null;
        
        return {
            total: rotations.length,
            pending: rotations.filter(r => r.status === 'Pending Approval').length,
            executed: rotations.filter(r => r.status === 'Executed').length,
        };
    }, [rotations, isLoading]);

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/20 mt-1">
                            <RefreshCw className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Shift Rotations
                            </h1>
                            <p className="text-muted-foreground">
                                Manage and schedule employee shift changes efficiently
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                Last updated: 05-10-2025
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            size="default"
                            onClick={() => fetchData(true)}
                            disabled={isRefreshing}
                            className="transition-all"
                        >
                            <RefreshCw className={cn(
                                "h-4 w-4 mr-2",
                                isRefreshing && "animate-spin"
                            )} />
                            Refresh
                        </Button>
                        <Button asChild size="default" className="shadow-sm">
                            <Link href="/management/shift-rotation/create">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Rotation
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-8 w-16" />
                                        </div>
                                        <Skeleton className="h-12 w-12 rounded-xl" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : stats && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <StatsCard 
                            title="Total Rotations" 
                            value={stats.total}
                            icon={RefreshCw}
                            color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        />
                        <StatsCard 
                            title="Pending Approval" 
                            value={stats.pending}
                            icon={Calendar}
                            color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        />
                        <StatsCard 
                            title="Executed" 
                            value={stats.executed}
                            icon={Users}
                            color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        />
                    </div>
                )}

                {/* Rotations Table */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/50">
                        <CardTitle className="text-lg">All Rotations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold">Rotation Name</TableHead>
                                        <TableHead className="font-semibold">Effective Date</TableHead>
                                        <TableHead className="font-semibold">Employees</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="text-right font-semibold">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableSkeleton />
                                    ) : rotations.length === 0 ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell 
                                                colSpan={5} 
                                                className="h-32 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="p-4 rounded-full bg-muted">
                                                        <RefreshCw className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">No rotations found</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Create your first shift rotation to get started
                                                        </p>
                                                    </div>
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href="/management/shift-rotation/create">
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Create Rotation
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        rotations.map((item) => (
                                            <TableRow 
                                                key={item.id}
                                                className="transition-colors hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    {item.rotation_name}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(item.effective_from).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{item.employee_count}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(item.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        asChild 
                                                        variant="ghost" 
                                                        size="sm"
                                                        className="hover:bg-primary/10 dark:hover:bg-primary/20"
                                                    >
                                                        <Link href={`/management/shift-rotation/${item.id}`}>
                                                            View Details
                                                            <ArrowRight className="h-4 w-4 ml-2" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
