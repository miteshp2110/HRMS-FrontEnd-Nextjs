// "use client"

// import { MainLayout } from "@/components/main-layout"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { FileText, Wrench } from "lucide-react"

// export default function EmployeeReportsPage() {
//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex items-center gap-4">
//           <FileText className="h-8 w-8" />
//           <div>
//             <h1 className="text-3xl font-bold">Employee Reports</h1>
//             <p className="text-muted-foreground">Generate and view reports related to employee data.</p>
//           </div>
//         </div>
//         <Card className="text-center py-24">
//           <CardHeader>
//             <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//             <CardTitle>Coming Soon!</CardTitle>
//             <CardDescription>
//               We're working hard on building a comprehensive reporting module.
//             </CardDescription>
//           </CardHeader>
//         </Card>
//       </div>
//     </MainLayout>
//   )
// }


// app/reports/page.tsx

"use client";

import { MainLayout } from "@/components/main-layout";
import { ReportsPage } from "@/components/admin/reports-page";

export default function ReportsRoot() {
  return (
    <MainLayout>
      <ReportsPage />
    </MainLayout>
  );
}
