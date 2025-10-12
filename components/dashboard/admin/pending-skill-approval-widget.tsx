"use client";
import { useEffect, useState } from "react";
import { getPendingSkillApprovalsDashboard, PendingSkillApproval } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PendingSkillApprovalWidget() {
  const [skills, setSkills] = useState<PendingSkillApproval[]>([]);

  useEffect(() => {
    getPendingSkillApprovalsDashboard().then(setSkills).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Skill Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <p className="text-muted-foreground">No pending skill requests.</p>
        ) : (
          <ul className="space-y-4">
            {skills.map((skill) => (
              <li key={skill.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={skill.profile_url || undefined} />
                    <AvatarFallback>{skill.employee_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{skill.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Skill: {skill.skill_name}
                    </p>
                  </div>
                </div>
                 <Button asChild variant="secondary" size="sm">
                  <Link href="/management/skill-approvals">Review</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}