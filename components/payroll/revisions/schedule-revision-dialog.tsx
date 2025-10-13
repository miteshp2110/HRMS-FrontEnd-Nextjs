"use client";

import { useState, useEffect } from "react";
import {
  
  ScheduleRevisionPayload,
  PayrollComponent,
  getPayrollComponents,
  scheduleSalaryRevision,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ScheduleRevisionDialogProps {
  employeeId: number;
  onSuccess: () => void;
}

export function ScheduleRevisionDialog({
  employeeId,
  onSuccess,
}: ScheduleRevisionDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [components, setComponents] = useState<PayrollComponent[]>([]);
  const [formData, setFormData] = useState<Omit<ScheduleRevisionPayload, "employee_id">>({
    component_id: 0,
    effective_date: "",
    new_calculation_type: "Fixed",
    new_value: 0,
    reason: "",
  });

  useEffect(() => {
    // Fetch salary components when the dialog opens
    if (open) {
      getPayrollComponents().then(setComponents).catch(() => {
        toast({ title: "Error", description: "Could not fetch salary components.", variant: "destructive" });
      });
    }
  }, [open, toast]);

  const handleSubmit = async () => {
    if (
      !formData.component_id ||
      !formData.effective_date ||
      !formData.new_value ||
      !formData.reason
    ) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    try {
      await scheduleSalaryRevision({ ...formData, employee_id: employeeId });
      toast({ title: "Success", description: "Salary revision scheduled." });
      onSuccess();
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to schedule revision",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Schedule Revision</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Salary Revision</DialogTitle>
          <DialogDescription>
            Set up a future change for an employee's salary component.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="component" className="text-right">
              Component
            </Label>
            <Select
              onValueChange={(v) =>
                setFormData({ ...formData, component_id: parseInt(v) })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a component" />
              </SelectTrigger>
              <SelectContent>
                {components.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="effective-date" className="text-right">
              Effective Date
            </Label>
            <Input
              id="effective-date"
              type="date"
              className="col-span-3"
              onChange={(e) =>
                setFormData({ ...formData, effective_date: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="calc-type" className="text-right">
              Calculation
            </Label>
            <Select
              defaultValue="Fixed"
              onValueChange={(v: "Fixed" | "Percentage") =>
                setFormData({ ...formData, new_calculation_type: v })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fixed">Fixed Amount</SelectItem>
                <SelectItem value="Percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-value" className="text-right">
              New Value
            </Label>
            <Input
              id="new-value"
              type="number"
              className="col-span-3"
              onChange={(e) =>
                setFormData({ ...formData, new_value: parseFloat(e.target.value) })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Textarea
              id="reason"
              className="col-span-3"
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}