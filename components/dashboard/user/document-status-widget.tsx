// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";

// interface DocumentStatusWidgetProps {
//   documentStatus: {
//     expiring: { name: string; expiry_date: string }[];
//     notUploaded: { name: string }[];
//   };
// }

// export function DocumentStatusWidget({
//   documentStatus,
// }: DocumentStatusWidgetProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Document Status</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div>
//           <h4 className="font-semibold mb-2">Expiring Soon</h4>
//           {documentStatus.expiring.length > 0 ? (
//             <ul>
//               {documentStatus.expiring.map((doc, index) => (
//                 <li key={index} className="flex justify-between items-center">
//                   <span>{doc.name}</span>
//                   <Badge variant="destructive">
//                     Expires: {format(new Date(doc.expiry_date), "MMM dd, yyyy")}
//                   </Badge>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-muted-foreground">No expiring documents.</p>
//           )}
//         </div>
//         <div className="mt-4">
//           <h4 className="font-semibold mb-2">Not Uploaded</h4>
//           {documentStatus.notUploaded.length > 0 ? (
//             <ul>
//               {documentStatus.notUploaded.map((doc, index) => (
//                 <li key={index} className="flex justify-between items-center">
//                   <span>{doc.name}</span>
//                   <Badge variant="secondary">Missing</Badge>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-muted-foreground">All documents are uploaded.</p>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, differenceInDays } from "date-fns";
import {
  AlertTriangle,
  FileX,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface DocumentStatusWidgetProps {
  documentStatus: {
    expiring: { name: string; expiry_date: string }[];
    notUploaded: { name: string }[];
  };
}

const moveToDocuments = ()=>{
    window.location.href='/self-service/documents'
}

export function DocumentStatusWidget({
  documentStatus,
}: DocumentStatusWidgetProps) {
  const [expandedExpiring, setExpandedExpiring] = useState(true);
  const [expandedNotUploaded, setExpandedNotUploaded] = useState(true);

  const getExpiryUrgency = (expiryDate: string) => {
    const daysLeft = differenceInDays(new Date(expiryDate), new Date());
    if (daysLeft <= 7) return { level: "critical", color: "destructive" as const };
    if (daysLeft <= 30) return { level: "warning", color: "warning" as const };
    return { level: "normal", color: "secondary" as const };
  };

  const totalIssues = documentStatus.expiring.length + documentStatus.notUploaded.length;
  const allClear = totalIssues === 0;

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-muted/50 to-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              allClear 
                ? "bg-green-500/10" 
                : "bg-orange-500/10"
            }`}>
              {allClear ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl">Document Status</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {allClear ? "All documents are up to date" : `${totalIssues} item${totalIssues !== 1 ? 's' : ''} requiring attention`}
              </p>
            </div>
          </div>
          
          {!allClear && (
            <Badge 
              variant="outline" 
              className="bg-orange-500/10 text-orange-700 border-orange-300 font-semibold px-3 py-1"
            >
              {totalIssues} Alert{totalIssues !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Expiring Soon Section */}
        <div className="space-y-3">
          <button
            onClick={() => setExpandedExpiring(!expandedExpiring)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/60 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-red-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-sm">Expiring Soon</h4>
                <p className="text-xs text-muted-foreground">
                  {documentStatus.expiring.length} document{documentStatus.expiring.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-muted-foreground transition-transform ${
                expandedExpiring ? 'rotate-90' : ''
              }`}
            />
          </button>

          {expandedExpiring && (
            <div className="space-y-2 pl-2">
              {documentStatus.expiring.length > 0 ? (
                documentStatus.expiring.map((doc, index) => {
                  const urgency = getExpiryUrgency(doc.expiry_date);
                  const daysLeft = differenceInDays(new Date(doc.expiry_date), new Date());
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 hover:border-border transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          urgency.level === 'critical' 
                            ? 'bg-red-500 animate-pulse' 
                            : urgency.level === 'warning'
                            ? 'bg-orange-500'
                            : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining` : 'Expired'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant='destructive'
                          className="flex items-center gap-1 text-xs font-medium whitespace-nowrap"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {format(new Date(doc.expiry_date), "MMM dd, yyyy")}
                        </Badge>
                        <Button
                        onClick={moveToDocuments}
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700">No documents expiring soon</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Not Uploaded Section */}
        <div className="space-y-3">
          <button
            onClick={() => setExpandedNotUploaded(!expandedNotUploaded)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/60 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center">
                <FileX className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-sm">Not Uploaded</h4>
                <p className="text-xs text-muted-foreground">
                  {documentStatus.notUploaded.length} document{documentStatus.notUploaded.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-muted-foreground transition-transform ${
                expandedNotUploaded ? 'rotate-90' : ''
              }`}
            />
          </button>

          {expandedNotUploaded && (
            <div className="space-y-2 pl-2">
              {documentStatus.notUploaded.length > 0 ? (
                documentStatus.notUploaded.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-dashed border-border/50 bg-card hover:bg-muted/30 hover:border-solid hover:border-border transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary"
                        className="bg-amber-500/10 text-amber-700 border-amber-300 text-xs font-medium"
                      >
                        Missing
                      </Badge>
                      <Button
                      onClick={moveToDocuments}
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-3 text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700">All documents are uploaded</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!allClear && (
          <div className="flex gap-2 pt-2">
            <Button variant="default" className="flex-1" size="sm" onClick={moveToDocuments}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
            <Button variant="outline" className="flex-1" size="sm" onClick={moveToDocuments}>
              View All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
