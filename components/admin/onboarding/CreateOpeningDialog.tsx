"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createJobOpening, getJobs, getSkills, type Job, type Skill } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronsUpDown, Plus, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateOpeningDialog({ open, onOpenChange, onSuccess }: Props) {
    const { toast } = useToast();
    const [jobs, setJobs] = React.useState<Job[]>([]);
    const [skills, setSkills] = React.useState<Skill[]>([]);
    const [selectedSkills, setSelectedSkills] = React.useState<Skill[]>([]);
    const [jobId, setJobId] = React.useState<string>('');
    const [positions, setPositions] = React.useState<number>(1);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSkillsPopoverOpen, setIsSkillsPopoverOpen] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            getJobs().then(setJobs);
            getSkills().then(setSkills);
        }
    }, [open]);

    const handleSelectSkill = (skill: Skill) => {
        if (!selectedSkills.some(s => s.id === skill.id)) {
            setSelectedSkills(prev => [...prev, skill]);
        }
        setIsSkillsPopoverOpen(false);
    }
    
    const handleRemoveSkill = (skillId: number) => {
        setSelectedSkills(prev => prev.filter(s => s.id !== skillId));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobId) {
            toast({ title: "Validation Error", description: "Please select a Job Title.", variant: "destructive"});
            return;
        }
        setIsSubmitting(true);
        try {
            await createJobOpening({
                job_id: Number(jobId),
                number_of_positions: positions,
                required_skill_ids: selectedSkills.map(s => s.id)
            });
            toast({ title: "Success", description: "Job opening created." });
            onSuccess();
            onOpenChange(false);
            // Reset form state
            setJobId('');
            setPositions(1);
            setSelectedSkills([]);
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to create opening: ${error.message}`, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Job Opening</DialogTitle>
                    <DialogDescription>Fill in the details for the new vacancy.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="job-title">Job Title</Label>
                        <Select onValueChange={setJobId} required>
                            <SelectTrigger id="job-title"><SelectValue placeholder="Select a job title..." /></SelectTrigger>
                            <SelectContent>{jobs.map(j => <SelectItem key={j.id} value={String(j.id)}>{j.title}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="positions">Number of Positions</Label>
                        <Input id="positions" type="number" value={positions} onChange={e => setPositions(Number(e.target.value))} min={1} required />
                    </div>
                    <div className="grid gap-2">
                        <Label>Required Skills</Label>
                         <Popover open={isSkillsPopoverOpen} onOpenChange={setIsSkillsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <button  role="button" className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                    Select skills...
                                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search skills..." />
                                    <CommandList>
                                        <CommandEmpty>No skills found.</CommandEmpty>
                                        <CommandGroup>
                                            {skills.map(skill => (
                                                <CommandItem
                                                    key={skill.id}
                                                    value={skill.skill_name}
                                                    onSelect={() => handleSelectSkill(skill)}
                                                >
                                                    <Check className={cn("mr-2 h-4 w-4", selectedSkills.some(s => s.id === skill.id) ? "opacity-100" : "opacity-0")} />
                                                    {skill.skill_name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSkills.map(skill => (
                                <Badge key={skill.id} variant="secondary">
                                    {skill.skill_name}
                                    <button type="button" onClick={() => handleRemoveSkill(skill.id)} className="ml-2 rounded-full outline-none hover:bg-destructive/80">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Opening"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}