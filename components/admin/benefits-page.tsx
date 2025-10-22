
"use client";

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Award, Clock } from "lucide-react";
import { getBenefitBands, createBenefitBand, updateBenefitBand, type BenefitBand } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const initialFormData: BenefitBand = {
  band_name: "",
  min_years_service: 0,
  max_years_service: 0,
  leave_salary_calculation: "Basic",
  leave_salary_percentage: 100,
  lta_allowance: 0,
  lta_frequency_years: 1,
  additional_annual_leaves: 0,
  medical_plan_details: "",
  education_allowance_per_child: 0,
  fuel_allowance_monthly: 0,
};

export default function BenefitsConfiguratorPage() {
  const { toast } = useToast();
  const [bands, setBands] = React.useState<BenefitBand[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBand, setEditingBand] = React.useState<BenefitBand | null>(null);
  const [formData, setFormData] = React.useState<BenefitBand>(initialFormData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBenefitBands();
      setBands(data);
    } catch {
      toast({ title: "Error", description: "Could not load benefit bands.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDialog = (band: BenefitBand | null = null) => {
    setEditingBand(band);
    setFormData(band || initialFormData);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBand) {
        await updateBenefitBand(editingBand.id!, formData);
        toast({ title: "Success", description: "Benefit band updated." });
      } else {
        await createBenefitBand(formData);
        toast({ title: "Success", description: "Benefit band created." });
      }
      fetchData();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: `Save failed: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Award className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Benefits Configurator</h1>
              <p className="text-muted-foreground">Define benefit bands based on employee years of service.</p>
            </div>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Band
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Benefit Bands</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Band Name</TableHead>
                    <TableHead>Tenure (Years)</TableHead>
                    <TableHead>LTA</TableHead>
                    <TableHead>Extra Leaves</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bands.map((band) => (
                    <TableRow key={band.id}>
                      <TableCell className="font-medium">{band.band_name}</TableCell>
                      <TableCell>
                        {band.min_years_service} - {band.max_years_service}
                      </TableCell>
                      <TableCell>AED {band.lta_allowance.toLocaleString()}</TableCell>
                      <TableCell>{band.additional_annual_leaves} days</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(band)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingBand ? "Edit" : "Create"} Benefit Band</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Label>Band Name *</Label>
              <Input
                value={formData.band_name}
                onChange={(e) => setFormData({ ...formData, band_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Min Years of Service *</Label>
              <Input

              required
                
                value={formData.min_years_service}
                onChange={(e) => setFormData({ ...formData, min_years_service: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Max Years of Service *</Label>
              <Input 
              required
                
                value={formData.max_years_service}
                onChange={(e) => setFormData({ ...formData, max_years_service: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Leave Salary Calculation *</Label>
              <Select required
                value={formData.leave_salary_calculation}
                onValueChange={(v: any) => setFormData({ ...formData, leave_salary_calculation: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Gross">Gross</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Leave Salary Percentage *</Label>
              <Input required
                
                value={formData.leave_salary_percentage}
                onChange={(e) => setFormData({ ...formData, leave_salary_percentage: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label>LTA Amount (AED) *</Label>
              <Input required
                
                value={formData.lta_allowance}
                onChange={(e) => setFormData({ ...formData, lta_allowance: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label>LTA Frequency (Years) *</Label>
              <Input required
                
                value={formData.lta_frequency_years}
                onChange={(e) => setFormData({ ...formData, lta_frequency_years: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Additional Annual Leaves *</Label>
              <Input required
                
                value={formData.additional_annual_leaves}
                onChange={(e) => setFormData({ ...formData, additional_annual_leaves: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Education Allowance (per child) *</Label>
              <Input required
                
                value={formData.education_allowance_per_child}
                onChange={(e) =>
                  setFormData({ ...formData, education_allowance_per_child: Number(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Fuel Allowance (monthly) *</Label>
              <Input required
                
                value={formData.fuel_allowance_monthly}
                onChange={(e) => setFormData({ ...formData, fuel_allowance_monthly: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label>Medical Plan Details *</Label>
              <Input required
                value={formData.medical_plan_details}
                onChange={(e) => setFormData({ ...formData, medical_plan_details: e.target.value })}
              />
            </div>
            <DialogFooter className="col-span-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Clock className="h-4 w-4 animate-spin mr-2" />}
                Save Band
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
