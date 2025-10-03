"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createShiftRotation, getShifts, searchUsers, getDetailedUserProfile, type Shift, type UserProfile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RotationEntry {
    employee_id: number;
    employee_name: string;
    from_shift_id: number;
    from_shift_name: string;
    to_shift_id: number;
}

export default function CreateShiftRotationPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [rotationName, setRotationName] = React.useState('');
    const [effectiveFrom, setEffectiveFrom] = React.useState('');
    const [rotations, setRotations] = React.useState<RotationEntry[]>([]);
    
    const [allShifts, setAllShifts] = React.useState<Shift[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([]);
    
    React.useEffect(() => {
        getShifts().then(setAllShifts);
    }, []);
    
    React.useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm) searchUsers(searchTerm).then(setSearchedUsers);
            else setSearchedUsers([]);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const addEmployeeToRotation = async (user: UserProfile) => {
        if (rotations.some(r => r.employee_id === user.id)) return; // Don't add duplicates
        
        try {
            // We need to fetch the employee's current shift ID. 
            // This assumes getDetailedUserProfile returns an object with shift_id.
            const userDetails = await getDetailedUserProfile(user.id);
            
            setRotations(prev => [...prev, {
                employee_id: user.id,
                employee_name: `${user.first_name} ${user.last_name}`,
                from_shift_id: userDetails.shift_id || 0, // Fallback to 0 or handle error
                from_shift_name: userDetails.shift_name || 'N/A',
                to_shift_id: 0,
            }]);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch employee's current shift."});
        }
        setSearchTerm('');
        setSearchedUsers([]);
    };
    
    const handleToShiftChange = (employeeId: number, toShiftId: string) => {
        setRotations(prev => prev.map(r => r.employee_id === employeeId ? { ...r, to_shift_id: Number(toShiftId) } : r));
    };

    const removeEmployee = (employeeId: number) => {
        setRotations(prev => prev.filter(r => r.employee_id !== employeeId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createShiftRotation({
                rotation_name: rotationName,
                effective_from: effectiveFrom,
                rotations: rotations.map(({ employee_id, from_shift_id, to_shift_id }) => ({ employee_id, from_shift_id, to_shift_id }))
            });
            toast({ title: "Success", description: "Shift rotation draft created." });
            router.push('/management/shift-rotation');
        } catch (error: any) {
            toast({ title: "Error", description: `Creation failed: ${error.message}`, variant: "destructive"});
        }
    };

    return (
        <MainLayout>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Shift Rotation</CardTitle>
                        <CardDescription>Define the details and add employees for the new shift schedule.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2"><Label>Rotation Name</Label><Input value={rotationName} onChange={e => setRotationName(e.target.value)} required /></div>
                            <div className="grid gap-2"><Label>Effective From</Label><Input type="date" value={effectiveFrom} onChange={e => setEffectiveFrom(e.target.value)} required /></div>
                        </div>
                        <div className="grid gap-2 pt-4 border-t">
                            <Label>Add Employee to Rotation</Label>
                            <Command className="rounded-lg border shadow-md">
                                <CommandInput placeholder="Search for an employee..." onValueChange={setSearchTerm}/>
                                <CommandList>
                                    <CommandEmpty>No employees found.</CommandEmpty>
                                    <CommandGroup>
                                        {searchedUsers.map(user => (
                                            <CommandItem key={user.id} onSelect={() => addEmployeeToRotation(user)}>
                                                {user.first_name} {user.last_name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>Rotation Details</CardTitle></CardHeader>
                    <CardContent>
                       {rotations.map(r => (
                           <div key={r.employee_id} className="grid grid-cols-4 items-center gap-4 py-2 border-b">
                               <span>{r.employee_name}</span>
                               <p className="text-sm">From: <Badge variant="secondary">{r.from_shift_name}</Badge></p>
                               <Select onValueChange={(value) => handleToShiftChange(r.employee_id, value)}>
                                   <SelectTrigger><SelectValue placeholder="Select 'To' Shift..." /></SelectTrigger>
                                   <SelectContent>{allShifts.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                               </Select>
                               <Button variant="ghost" size="icon" onClick={() => removeEmployee(r.employee_id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                           </div>
                       ))}
                    </CardContent>
                 </Card>

                 <div className="flex justify-end gap-2">
                     <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                     <Button type="submit">Create Draft</Button>
                 </div>
            </form>
        </MainLayout>
    );
}
