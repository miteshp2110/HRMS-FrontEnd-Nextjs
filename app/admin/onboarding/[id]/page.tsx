
"use client"

import * as React from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { getApplicantsForOpening, updateApplicantStatus, type Applicant, getJobOpenings, type JobOpening } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddApplicantDialog } from "@/components/admin/onboarding/AddApplicantDialog";
import { ApplicantCard } from "@/components/admin/onboarding/ApplicantCard";

const columns = ['Applied', 'Interviewing', 'Approved', 'Rejected', 'Hired'];

export default function OpeningDetailsPage() {
    const params = useParams();
    const openingId = Number(params.id);
    const { toast } = useToast();
    const [opening, setOpening] = React.useState<JobOpening | null>(null);
    const [applicants, setApplicants] = React.useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

    const fetchData = React.useCallback(async () => {
        if (!openingId) return;
        setIsLoading(true);
        try {
            // Fetch all openings and applicants for the current opening concurrently
            const [allOpenings, applicantsData] = await Promise.all([
                getJobOpenings(),
                getApplicantsForOpening(openingId)
            ]);
            
            // Find the current opening from the list of all openings
            const currentOpening = allOpenings.find(o => o.id === openingId);
            setOpening(currentOpening || null);
            setApplicants(applicantsData);

        } catch (error: any) {
            toast({ title: "Error", description: `Could not load opening details: ${error.message}`, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [openingId, toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        
        const applicant = applicants.find(a => a.id === Number(draggableId));
        if (!applicant) return;

        const newStatus = destination.droppableId as Applicant['status'];
        
        const originalApplicants = applicants;
        const updatedApplicants = applicants.map(a => 
            a.id === applicant.id ? { ...a, status: newStatus } : a
        );
        setApplicants(updatedApplicants);
        
        try {
            await updateApplicantStatus(applicant.id, { status: newStatus });
            toast({ title: "Success", description: `${applicant.first_name}'s status updated to ${newStatus}.`});
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to update status. Reverting change.", variant: "destructive"});
            // Revert optimistic update on failure
            setApplicants(originalApplicants);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Briefcase className="h-8 w-8" />
                        <div>
                            <h1 className="text-3xl font-bold">{opening?.job_title || "Applicant Tracking"}</h1>
                            <p className="text-muted-foreground">Manage candidates for this job opening.</p>
                        </div>
                    </div>
                     {opening?.status === 'Open' && (
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Applicant
                        </Button>
                     )}
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-5 gap-4 items-start">
                        {columns.map(columnId => (
                            <Droppable key={columnId} droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div 
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`p-4 rounded-lg space-y-4 ${snapshot.isDraggingOver ? 'bg-muted' : 'bg-muted/50'}`}
                                    >
                                        <h2 className="font-semibold">{columnId}</h2>
                                        {applicants.filter(a => a.status === columnId).map((applicant, index) => (
                                            <ApplicantCard key={applicant.id} applicant={applicant} index={index} onSuccess={fetchData}/>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>
            <AddApplicantDialog
                openingId={openingId}
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={fetchData}
            />
        </MainLayout>
    );
}