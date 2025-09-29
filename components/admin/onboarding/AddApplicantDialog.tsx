"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addApplicant } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Props {
    openingId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AddApplicantDialog({ openingId, open, onOpenChange, onSuccess }: Props) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setIsSubmitting(true);
        try {
            await addApplicant(openingId, formData);
            toast({ title: "Success", description: "Applicant added." });
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to add applicant: ${error.message}`, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader><DialogTitle>Add New Applicant</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4"><div className="grid gap-2"><Label>First Name</Label><Input name="first_name" required/></div><div className="grid gap-2"><Label>Last Name</Label><Input name="last_name" required/></div></div>
                    <div className="grid gap-2"><Label>Email</Label><Input name="email" type="email" required/></div>
                    <div className="grid gap-2"><Label>Phone</Label><Input name="phone" required/></div>
                    <div className="grid gap-2"><Label>Resume</Label><Input name="resume" type="file" required/></div>
                    <div className="grid gap-2"><Label>Notes</Label><Textarea name="notes"/></div>
                     <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Applicant'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}