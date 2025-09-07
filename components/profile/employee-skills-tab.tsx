"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Award, CheckCircle } from "lucide-react"
import type { UserSkill } from "@/lib/api"

interface EmployeeSkillsTabProps {
  skills: UserSkill[]
  isLoading: boolean
}

export function EmployeeSkillsTab({ skills, isLoading }: EmployeeSkillsTabProps) {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verified Skills</CardTitle>
        <CardDescription>A list of skills this employee has been approved for.</CardDescription>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Award className="h-10 w-10 mx-auto mb-4" />
            <p>No verified skills have been recorded for this employee.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map(skill => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.skill_name}</TableCell>
                  
                  <TableCell>
                    {skill.status ? (
                       <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                         <CheckCircle className="h-3 w-3 mr-1" />
                         Verified
                       </Badge>
                    ) : (
                        <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {skill.approved_by_name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}