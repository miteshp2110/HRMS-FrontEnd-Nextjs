"use client";
import { useEffect, useState } from "react";
import { ExpiringDocument, getDocumentExpiries } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function UpcomingDocumentExpiryWidget() {
  const [documents, setDocuments] = useState<ExpiringDocument[]>([]);

  useEffect(() => {
    getDocumentExpiries().then(setDocuments).catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Document Expiries</CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <p className="text-muted-foreground">No documents expiring soon.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id} className="flex justify-between items-center">
                <Link href={`/directory/${doc.employee_id}`}>
                  <span className="font-semibold hover:underline">{doc.employee_name}</span>: {doc.document_name}
                </Link>
                <Badge variant="destructive">
                  {format(new Date(doc.expiry_date), "MMM dd, yyyy")}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}