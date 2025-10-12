"use client";
import { useEffect, useState } from "react";
import {  getOpenCasesOnDirectReports, OpenCase } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OpenCasesWidget() {
  const [cases, setCases] = useState<OpenCase[]>([]);

  useEffect(() => {
    getOpenCasesOnDirectReports().then(setCases).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Cases on My Team</CardTitle>
      </CardHeader>
      <CardContent>
        {cases.length === 0 ? (
          <p className="text-muted-foreground">No open cases on your direct reports.</p>
        ) : (
          <ul className="space-y-4">
            {cases.map((c) => (
              <li key={c.id} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.employee_name} - {c.category_name}
                  </p>
                </div>
                 <Button asChild variant="secondary" size="sm">
                  <Link href={`/admin/cases/${c.id}`}>View Case</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}