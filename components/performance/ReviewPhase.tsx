"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitManagerAssessment, type AppraisalDetails } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Props {
  appraisal: AppraisalDetails;
  onSuccess: () => void;
  isEditable: boolean;
}

export function ReviewPhase({ appraisal, onSuccess, isEditable }: Props) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    goals: appraisal.goals.map((g) => ({
      id: g.id,
      manager_rating: g.manager_rating || 0,
      manager_comments: g.manager_comments || "",
    })),
    kpis: appraisal.kpis.map((k) => ({
      id: k.id,
      manager_rating: k.manager_rating || 0,
      manager_comments: k.manager_comments || "",
    })),
    final_manager_comments: appraisal.final_manager_comments || "",
    overall_manager_rating: appraisal.overall_manager_rating || 0,
  });

  const handleFormChange = (
    type: "goals" | "kpis",
    id: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      await submitManagerAssessment(appraisal.id, formData);
      toast({
        title: "Success",
        description: "Final assessment has been submitted.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Submission failed: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {appraisal.goals.map((goal, index) => (
            <div key={goal.id} className="p-4 border rounded-md">
              <p className="font-semibold">{goal.goal_title}</p>
              <div className="p-2 bg-muted rounded-md my-2 text-sm">
                <p className="font-semibold">Employee's Assessment:</p>
                <p>
                  <strong>Rating:</strong> {goal.employee_rating}/5
                </p>
                <p>
                  <strong>Comments:</strong> {goal.employee_comments}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 grid gap-2">
                  <Label>Your Comments</Label>
                  <Textarea
                  disabled={!isEditable}
                    value={formData.goals[index]?.manager_comments}
                    onChange={(e) =>
                      handleFormChange(
                        "goals",
                        goal.id,
                        "manager_comments",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Your Rating (1-5)</Label>
                  <Input
                  disabled={!isEditable}
                    type="number"
                    min="1"
                    max="5"
                    value={formData.goals[index]?.manager_rating}
                    onChange={(e) =>
                      handleFormChange(
                        "goals",
                        goal.id,
                        "manager_rating",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Review KPIs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {appraisal.kpis.map((kpi, index) => (
            <div key={kpi.id} className="p-4 border rounded-md">
              <p className="font-semibold">
                {kpi.kpi_name} (Target: {kpi.target})
              </p>
              <div className="p-2 bg-muted rounded-md my-2 text-sm">
                <p className="font-semibold">Employee's Assessment:</p>
                <p>
                  <strong>Actual:</strong> {kpi.actual}
                </p>
                <p>
                  <strong>Rating:</strong> {kpi.employee_rating}/5
                </p>
                <p>
                  <strong>Comments:</strong> {kpi.employee_comments}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 grid gap-2">
                  <Label>Your Comments</Label>
                  <Textarea
                  disabled={!isEditable}
                    value={formData.kpis[index]?.manager_comments}
                    onChange={(e) =>
                      handleFormChange(
                        "kpis",
                        kpi.id,
                        "manager_comments",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Your Rating (1-5)</Label>
                  <Input
                  disabled={!isEditable}
                    type="number"
                    min="1"
                    max="5"
                    value={formData.kpis[index]?.manager_rating}
                    onChange={(e) =>
                      handleFormChange(
                        "kpis",
                        kpi.id,
                        "manager_rating",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Final Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Final Overall Comments</Label>
            <Textarea
            disabled={!isEditable}
              value={formData.final_manager_comments}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  final_manager_comments: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Final Overall Rating (1-5)</Label>
            <Input
            disabled={!isEditable}
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={formData.overall_manager_rating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overall_manager_rating: Number(e.target.value),
                })
              }
            />
          </div>
          <Button disabled={!isEditable} onClick={handleSubmit}>{isEditable?`Submit Final Review`:`Already Submitted`}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
