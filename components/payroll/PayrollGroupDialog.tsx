"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPayrollGroup, updatePayrollGroup, getPayrollGroupDetails, getPayrollComponentDefs, type PayrollComponentDef } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    groupId: number | null;
}

const predefinedComponents: PayrollComponentDef[] = [
  { id: 97, name: "Loans/Advance Emi Deduction", type: "deduction" },
  { id: 98, name: "HR Cases Deduction", type: "deduction" },
  { id: 99, name: "Expense Reimbursements", type: "earning" },
];

export function PayrollGroupDialog({ open, onOpenChange, onSuccess, groupId }: Props) {
    const { toast } = useToast();
    const [allComponents, setAllComponents] = React.useState<PayrollComponentDef[]>([]);
    const [selectedComponents, setSelectedComponents] = React.useState<number[]>([]);
    const [groupName, setGroupName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setIsLoading(true);
            getPayrollComponentDefs().then(apiComponents => {
                    // merge predefined + API ones, avoiding duplicates by id
                    const merged = [
                        ...predefinedComponents,
                        ...apiComponents.filter(
                            apiComp => !predefinedComponents.some(pre => pre.id === apiComp.id)
                        ),
                    ];
                    setAllComponents(merged);
                })
                .finally(() => setIsLoading(false));

            if (groupId) {
                getPayrollGroupDetails(groupId).then(data => {
                    setGroupName(data.group_name);
                    setDescription(data.description);
                    setSelectedComponents(data.components.map(c => c.id));
                });
            } else {
                setGroupName('');
                setDescription('');
                setSelectedComponents([]);
            }
        }
    }, [groupId, open]);
    
    const handleComponentToggle = (componentId: number) => {
        setSelectedComponents(prev => 
            prev.includes(componentId) 
                ? prev.filter(id => id !== componentId)
                : [...prev, componentId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { group_name: groupName, description, components: selectedComponents };
        try {
            if (groupId) {
                await updatePayrollGroup(groupId, payload);
                toast({ title: "Success", description: "Group updated." });
            } else {
                await createPayrollGroup(payload);
                toast({ title: "Success", description: "Group created." });
            }
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: "Error", description: `Save failed: ${error.message}`, variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{groupId ? 'Edit' : 'Create'} Payroll Group</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2"><Label>Group Name</Label><Input value={groupName} onChange={e => setGroupName(e.target.value)} required /></div>
                    <div className="grid gap-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
                    <div className="grid gap-2">
                        <Label>Select Components</Label>
                        <ScrollArea className="h-48 rounded-md border p-4">
                            <div className="space-y-2">
                                {allComponents.map(component => (
                                    <div key={component.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`comp-${component.id}`}
                                            checked={selectedComponents.includes(component.id)}
                                            onCheckedChange={() => handleComponentToggle(component.id)}
                                        />
                                        <label htmlFor={`comp-${component.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {component.name} <span className="text-xs text-muted-foreground">({component.type})</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Group</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}