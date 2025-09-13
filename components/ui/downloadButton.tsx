"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useState } from "react";

interface PayrollDownloadButtonProps {
  payrollId: number;
  downloadPayrollReport: (id: number) => Promise<void>;
}

export function PayrollDownloadButton({
  payrollId,
  downloadPayrollReport,
}: PayrollDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadPayrollReport(payrollId);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download
        </>
      )}
    </Button>
  );
}
