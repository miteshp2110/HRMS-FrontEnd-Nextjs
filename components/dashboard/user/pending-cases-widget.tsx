// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { ShieldAlert } from "lucide-react";

// interface PendingCasesWidgetProps {
//   pendingCases: {
//     id: number;
//     case_id_text: string;
//     title: string;
//   }[];
// }

// export function PendingCasesWidget({ pendingCases }: PendingCasesWidgetProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Pending Cases</CardTitle>
//         <CardDescription>
//           Disciplinary or other cases requiring your attention.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {pendingCases.length > 0 ? (
//           <ul>
//             {pendingCases.map((caseItem) => (
//               <li key={caseItem.id} className="flex items-center mb-2">
//                 <ShieldAlert className="w-5 h-5 mr-3 text-destructive" />
//                 <div>
//                   <p className="font-semibold">{caseItem.title}</p>
//                   <p className="text-sm text-muted-foreground">
//                     ID: {caseItem.case_id_text}
//                   </p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-muted-foreground">No pending cases.</p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert, AlertCircle, Info } from "lucide-react";

interface PendingCasesWidgetProps {
  pendingCases: {
    id: number;
    case_id_text: string;
    title: string;
  }[];
}

export function PendingCasesWidget({ pendingCases }: PendingCasesWidgetProps) {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader>
        <CardTitle>Pending Cases</CardTitle>
        <CardDescription>
          Disciplinary or other cases requiring your attention.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingCases.length > 0 ? (
          <ul className="divide-y divide-muted/40 border border-muted/30 rounded-md overflow-hidden">
            {pendingCases.map((caseItem) => (
              <li
                key={caseItem.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-destructive/10 cursor-pointer transition-colors"
                title={`Case ID: ${caseItem.case_id_text}`}
              >
                <ShieldAlert className="w-6 h-6 text-destructive flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {caseItem.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">
                    ID: {caseItem.case_id_text}
                  </p>
                </div>
                <AlertCircle className="w-5 h-5 text-destructive opacity-70" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground space-y-2">
            <Info className="w-10 h-10 text-muted-foreground/60" />
            <p className="text-sm font-medium">No pending cases.</p>
            <p className="text-xs">You are all clear! 🎉</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
