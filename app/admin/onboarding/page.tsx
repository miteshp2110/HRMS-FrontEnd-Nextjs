
"use client"

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, Users, ArrowRight } from "lucide-react";
import { getJobOpenings, updateJobOpeningStatus, type JobOpening } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CreateOpeningDialog } from "@/components/admin/onboarding/CreateOpeningDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OnboardingDashboardPage() {
    const { toast } = useToast();
    const [openings, setOpenings] = React.useState<JobOpening[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getJobOpenings();
            setOpenings(data);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load job openings.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusChange = async (openingId: number, status: 'Open' | 'Closed' | 'OnHold') => {
        try {
            await updateJobOpeningStatus(openingId, status);
            toast({ title: "Success", description: "Opening status updated." });
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to update status: ${error.message}`, variant: "destructive" });
        }
    };

    return (
        <MainLayout>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Briefcase className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">Recruitment & Onboarding</h1>
                            <p className="text-muted-foreground">Manage job openings and track applicants through the hiring pipeline.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Opening
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <Card key={i} className="animate-pulse h-48"/>)
                    ) : openings.length === 0 ?
                    <div className="text-2xl">No Opening Found</div>
                    :
                    openings.map(opening => (
                        <Card key={opening.id}>
                            <CardHeader>
                                <CardTitle>{opening.job_title}</CardTitle>
                                <CardDescription>
                                    <Select value={opening.status} onValueChange={(value: 'Open' | 'Closed' | 'OnHold') => handleStatusChange(opening.id, value)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                            <SelectItem value="OnHold">On Hold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Positions</span>
                                    <span className="font-bold">{opening.number_of_positions}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Applicants</span>
                                    <span className="font-bold">{opening.applicant_count}</span>
                                </div>
                                <Button asChild className="w-full">
                                    <Link href={`/admin/onboarding/${opening.id}`}>Manage Applicants <ArrowRight className="h-4 w-4 ml-2" /></Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                    }
                </div>
             </div>
             <CreateOpeningDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={fetchData}
             />
        </MainLayout>
    );
}