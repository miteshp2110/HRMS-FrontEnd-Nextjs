"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, CheckCircle, XCircle, Clock, Award } from "lucide-react"
import { getMySkillRequests, getSkills, createSkillRequest, type Skill } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface MySkillRequest {
    id: number;
    skill_name: string;
    status: null | 0 | 1; // null = pending, 0 = rejected, 1 = approved
    created_at: string;
}

export function MySkillsTab() {
    const { toast } = useToast();
    const [mySkills, setMySkills] = React.useState<MySkillRequest[]>([]);
    const [availableSkills, setAvailableSkills] = React.useState<Skill[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedSkillId, setSelectedSkillId] = React.useState<string>("");

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const [mySkillsData, availableSkillsData] = await Promise.all([
                getMySkillRequests(),
                getSkills()
            ]);
            setMySkills(mySkillsData);
            setAvailableSkills(availableSkillsData);
        } catch (error: any) {
            toast({
                title: "Error",
                description: `Failed to load skills data: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmitRequest = async () => {
        if (!selectedSkillId) {
            toast({ title: "Error", description: "Please select a skill.", variant: "destructive" });
            return;
        }
        try {
            await createSkillRequest(Number(selectedSkillId));
            toast({ title: "Success", description: "Skill request submitted for approval." });
            setIsDialogOpen(false);
            setSelectedSkillId("");
            fetchData(); // Refresh the list
        } catch (error: any) {
            toast({
                title: "Error",
                description: `Failed to submit request: ${error.message}`,
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: null | 0 | 1) => {
        if (status === 1) {
            return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
        }
        if (status === 0) {
            return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
        }
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>My Skills</CardTitle>
                    <CardDescription>Your professional skills and their approval status.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" />Add Skill</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request a New Skill</DialogTitle>
                            <DialogDescription>Select a skill to add to your profile. It will be sent for approval.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Label htmlFor="skill-select">Skill</Label>
                            <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                                <SelectTrigger id="skill-select">
                                    <SelectValue placeholder="Select a skill to request" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSkills.map(skill => (
                                        <SelectItem key={skill.id} value={skill.id.toString()}>{skill.skill_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmitRequest}>Submit Request</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center py-12">Loading your skills...</div>
                ) : mySkills.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Award className="h-10 w-10 mx-auto mb-4" />
                        <p>You haven't added any skills yet. Click "Add Skill" to get started.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Skill Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Requested On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mySkills.map(skill => (
                                <TableRow key={skill.id}>
                                    <TableCell className="font-medium">{skill.skill_name}</TableCell>
                                    <TableCell>{getStatusBadge(skill.status)}</TableCell>
                                    <TableCell>{new Date(skill.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}