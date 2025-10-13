"use client";
import { useEffect, useState } from "react";
import { ExpiringDocument, getDocumentExpiries } from "@/lib/api";
import { format, differenceInDays } from "date-fns";
import { AlertCircle, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

function getBadgeVariant(daysLeft: number): string {
  if (daysLeft <= 7) return "destructive";
  if (daysLeft <= 30) return "warning";
  return "secondary";
}

function getStatusIcon(daysLeft: number) {
  if (daysLeft <= 7) return <AlertCircle className="w-4 h-4 flex-shrink-0" />;
  return <Clock className="w-4 h-4 flex-shrink-0" />;
}

function UpcomingDocumentExpirySkeleton() {
  return (
    <div className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
      <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Upcoming Document Expiries
        </h3>
      </div>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-400 dark:scrollbar-thumb-zinc-600">
        <div className="flex gap-2 p-4 min-w-max">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 px-4 py-4 w-80 animate-pulse flex-shrink-0"
            >
              <div className="h-6 w-6 bg-zinc-300 dark:bg-zinc-700 rounded" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-zinc-300 dark:bg-zinc-700 rounded mb-2" />
                <div className="h-3 w-32 bg-zinc-300 dark:bg-zinc-700 rounded" />
              </div>
              <div className="h-6 w-24 bg-zinc-300 dark:bg-zinc-700 rounded flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UpcomingDocumentExpiryWidget() {
  const [documents, setDocuments] = useState<ExpiringDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocumentExpiries()
      .then((docs) => {
        setDocuments(docs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <UpcomingDocumentExpirySkeleton />;

  return (
    <div className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-red-100 dark:bg-red-500/50">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Upcoming Document Expiries
        </h3>
      </div>

      {/* Content */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-400 dark:scrollbar-thumb-zinc-600">
        {documents.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No documents expiring soon.
            </p>
          </div>
        ) : (
          <div className="flex gap-2 p-4 min-w-max">
            {documents.map((doc) => {
              const daysLeft = differenceInDays(new Date(doc.expiry_date), new Date());

              return (
                <Link
                  key={doc.id}
                  href={`/directory/${doc.employee_id}`}
                  className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800/50 dark:to-zinc-900/50 
                    border border-zinc-200 dark:border-zinc-700 px-4 py-4 flex-shrink-0 w-80
                    hover:bg-gradient-to-r hover:from-zinc-100 hover:to-zinc-200 dark:hover:from-zinc-700/50 dark:hover:to-zinc-800/50
                    hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 group"
                  title={`${doc.employee_name}: ${doc.document_name}`}
                >
                  {/* Status Icon */}
                  <div className={`${
                    daysLeft <= 7
                      ? "text-red-600 dark:text-red-400"
                      : daysLeft <= 30
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}>
                    {getStatusIcon(daysLeft)}
                  </div>

                  {/* Name & Document & Date */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {doc.employee_name}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                      {doc.document_name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
                      {format(new Date(doc.expiry_date), "MMM dd, yyyy")}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold flex-shrink-0 ${
                    daysLeft <= 7
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : daysLeft <= 30
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                    title={daysLeft + (daysLeft === 1 ? " day left" : " days left")}
                  >
                    {daysLeft === 0 ? "Today" : daysLeft === 1 ? "1 day" : `${daysLeft}d`}
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}