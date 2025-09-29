"use client"

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { convertApplicantToEmployee, getRoles, getShifts, type Applicant, type Role, type Shift } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";

interface Props {
    applicant: Applicant;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ApplicantDetailsDialog({ applicant, open, onOpenChange, onSuccess }: Props) {
    const { toast } = useToast();
    const [roles, setRoles] = React.useState<Role[]>([]);
    const [shifts, setShifts] = React.useState<Shift[]>([]);
    const [formData, setFormData] = React.useState({ new_employee_id: '', joining_date: '', system_role: 0, shift: 0});
    const [tempPassword, setTempPassword] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (open && applicant.status === 'Approved') {
            getRoles().then(setRoles);
            getShifts().then(setShifts);
        }
    }, [open, applicant.status]);
    
    const handleConvert = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await convertApplicantToEmployee(applicant.id, formData);
            setTempPassword(response.temporary_password || '');
            toast({ title: "Success", description: "Applicant converted to employee!"});
            onSuccess();
        } catch (error: any) {
            toast({ title: "Error", description: `Conversion failed: ${error.message}`, variant: "destructive"});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{applicant.first_name} {applicant.last_name}</DialogTitle>
                    <DialogDescription>
                        Status: <Badge>{applicant.status}</Badge>
                    </DialogDescription>
                </DialogHeader>
                <div className="text-sm space-y-2">
                    <p><strong>Email:</strong> {applicant.email}</p>
                    <p><strong>Phone:</strong> {applicant.phone}</p>
                    {applicant.resume_url && <Button asChild variant="link" className="p-0"><a href={applicant.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a></Button>}
                </div>
                {applicant.status === 'Approved' && (
                    <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-4 text-lg">Convert to Employee</h3>
                        {!tempPassword ? (
                             <form onSubmit={handleConvert} className="space-y-4">
                                <div className="grid gap-2"><Label>New Employee ID *</Label><Input required value={formData.new_employee_id} onChange={e => setFormData({...formData, new_employee_id: e.target.value})} /></div>
                                <div className="grid gap-2"><Label>Joining Date *</Label><Input type="date" required value={formData.joining_date} onChange={e => setFormData({...formData, joining_date: e.target.value})}/></div>
                                <div className="grid gap-2"><Label>System Role *</Label><Select required onValueChange={v => setFormData({...formData, system_role: Number(v)})}><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger><SelectContent>{roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}</SelectContent></Select></div>
                                <div className="grid gap-2"><Label>Shift *</Label><Select required onValueChange={v => setFormData({...formData, shift: Number(v)})}><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger><SelectContent>{shifts.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent></Select></div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Converting..." : "Convert to Employee"}</Button>
                            </form>
                        ) : (
                            <Alert>
                                <AlertTitle>Conversion Successful!</AlertTitle>
                                <div className="mt-2">
                                    <Label>Temporary Password</Label>
                                    <Input readOnly value={tempPassword} />
                                    <p className="text-xs text-muted-foreground mt-1">Please copy this password and provide it to the new employee.</p>
                                </div>
                            </Alert>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}