// "use client"

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { FileClock } from "lucide-react"
// import Link from "next/link"

// interface ExpiringDocument {
//   id: number
//   employee_name: string
//   document_name: string
//   expiry_date: string
// }

// interface ExpiringDocumentsWidgetProps {
//   documents: ExpiringDocument[]
// }

// export function ExpiringDocumentsWidget({ documents }: ExpiringDocumentsWidgetProps) {
//   const getInitials = (name: string) => {
//     const names = name.split(' ');
//     return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Expiring Documents</CardTitle>
//         <CardDescription>Documents that will expire within the next 30 days.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {documents.length > 0 ? (
//         <div className="space-y-4 max-h-80 overflow-y-auto">
//           {documents.map((doc) => (
//             <div key={doc.id} className="flex items-center">
//               <Avatar className="h-9 w-9">
//                 <AvatarFallback>{getInitials(doc.employee_name)}</AvatarFallback>
//               </Avatar>
//               <div className="ml-4 space-y-1">
//                 <p className="text-sm font-medium leading-none">{doc.employee_name}</p>
//                 <p className="text-sm text-muted-foreground">{doc.document_name}</p>
//               </div>
//               <div className="ml-auto font-medium text-sm text-red-500">
//                 Expires: {new Date(doc.expiry_date).toLocaleDateString()}
//               </div>
//             </div>
//           ))}
//         </div>
//         ) : (
//             <div className="text-center text-muted-foreground py-8">
//                 <FileClock className="h-10 w-10 mx-auto mb-2"/>
//                 <p>No documents are expiring soon.</p>
//             </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileClock } from "lucide-react"

interface ExpiringDocument {
  id: number
  employee_name: string
  document_name: string
  expiry_date: string
}

interface ExpiringDocumentsWidgetProps {
  documents: ExpiringDocument[]
}

export function ExpiringDocumentsWidget({ documents }: ExpiringDocumentsWidgetProps) {
  const getInitials = (name: string) => {
    const names = name.split(" ")
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expiring Documents</CardTitle>
        <CardDescription>Documents that will expire within the next 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {documents.map((doc) => (
              <Card key={doc.id} className="flex-1 min-w-[250px]">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(doc.employee_name)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{doc.employee_name}</p>
                    <p className="text-xs text-muted-foreground">{doc.document_name}</p>
                    <p className="text-xs font-medium text-red-500">
                      Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <FileClock className="h-10 w-10 mx-auto mb-2" />
            <p>No documents are expiring soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
