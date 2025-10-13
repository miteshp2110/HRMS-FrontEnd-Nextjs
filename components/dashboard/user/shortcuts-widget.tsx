
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  PlaneIcon,
} from "lucide-react";

export function ShortcutsWidget() {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle>Shortcuts</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/self-service/leaves" passHref legacyBehavior>
          <Button
            
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-1 hover:bg-primary/5 transition-colors border-zinc-600"
            aria-label="Apply for Leave"
          >
            <PlaneIcon className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              Apply for Leave
            </span>
          </Button>
        </Link>
        <Link href="/self-service/expenses" passHref legacyBehavior>
          <Button
            
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-1 hover:bg-primary/5 transition-colors border-zinc-600"
            aria-label="Submit Expense"
          >
            <DollarSignIcon className="w-6 h-6 text-amber-600" />
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              Submit Expense
            </span>
          </Button>
        </Link>
        <Link href="/self-service/attendance" passHref legacyBehavior>
          <Button
            
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-1 hover:bg-primary/5 transition-colors border-zinc-600"
            aria-label="My Attendance"
          >
            <CalendarIcon className="w-6 h-6 text-sky-600" />
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              My Attendance
            </span>
          </Button>
        </Link>
        <Link href="/self-service/documents" passHref legacyBehavior>
          <Button
            
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-1 hover:bg-primary/5 transition-colors border-zinc-600"
            aria-label="My Documents"
          >
            <FileTextIcon className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              My Documents
            </span>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
