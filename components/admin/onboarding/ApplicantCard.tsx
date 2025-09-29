"use client"

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Draggable } from "@hello-pangea/dnd";
import { type Applicant } from "@/lib/api";
import { ApplicantDetailsDialog } from "./ApplicantDetailsDialog";

interface Props {
    applicant: Applicant;
    index: number;
    onSuccess: () => void;
}

export function ApplicantCard({ applicant, index, onSuccess }: Props) {
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
    return (
        <>
            <Draggable draggableId={String(applicant.id)} index={index}>
                {(provided:any) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setIsDetailsOpen(true)}
                    >
                        <Card className="hover:bg-card-hover cursor-pointer">
                            <CardContent className="p-4 text-sm">
                                <p className="font-semibold">{applicant.first_name} {applicant.last_name}</p>
                                <p className="text-muted-foreground">{applicant.email}</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </Draggable>
            <ApplicantDetailsDialog 
                applicant={applicant}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onSuccess={onSuccess}
            />
        </>
    );
}