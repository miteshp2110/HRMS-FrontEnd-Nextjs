// // "use client";

// // import { useState, useEffect } from "react";
// // import { getSalaryStructureAudit, SalaryAuditLog } from "@/lib/api";
// // import { useToast } from "@/hooks/use-toast";
// // import { format } from "date-fns";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";

// // interface AuditLogTabProps {
// //   employeeId: number;
// // }

// // export function AuditLogTab({ employeeId }: AuditLogTabProps) {
// //   const { toast } = useToast();
// //   const [auditLogs, setAuditLogs] = useState<SalaryAuditLog[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     setIsLoading(true);
// //     getSalaryStructureAudit(employeeId)
// //       .then(setAuditLogs)
// //       .catch(() => {
// //         toast({
// //           title: "Error fetching audit log",
// //           description: "Could not load the salary structure audit history.",
// //           variant: "destructive",
// //         });
// //       })
// //       .finally(() => setIsLoading(false));
// //   }, [employeeId, toast]);

// //   const renderChangeDescription = (log: SalaryAuditLog): string => {
// //     const changes = Object.keys(log.new_data).map(key => {
// //         const oldValue = log.old_data[key];
// //         const newValue = log.new_data[key];
// //         return `${key} from "${oldValue}" to "${newValue}"`;
// //     }).join(', ');

// //     return `${log.changed_by_name} changed ${changes}`;
// //   }

// //   return (
// //     <Card>
// //       <CardHeader>
// //         <CardTitle>Structure Audit Log</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <Table>
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead>Date</TableHead>
// //               <TableHead>User</TableHead>
// //               <TableHead>Description of Change</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {isLoading ? (
// //               <TableRow>
// //                 <TableCell colSpan={3} className="text-center">
// //                   Loading...
// //                 </TableCell>
// //               </TableRow>
// //             ) : auditLogs.length === 0 ? (
// //               <TableRow>
// //                 <TableCell colSpan={3} className="text-center">
// //                   No audit history found.
// //                 </TableCell>
// //               </TableRow>
// //             ) : (
// //               auditLogs.map((log) => (
// //                 <TableRow key={log.id}>
// //                   <TableCell>
// //                     {format(new Date(log.changed_at), "dd MMM yyyy, hh:mm a")}
// //                   </TableCell>
// //                   <TableCell>{log.changed_by_name}</TableCell>
// //                   <TableCell>{renderChangeDescription(log)}</TableCell>
// //                 </TableRow>
// //               ))
// //             )}
// //           </TableBody>
// //         </Table>
// //       </CardContent>
// //     </Card>
// //   );
// // }


// "use client"

// import { useState, useEffect } from "react"
// import { getSalaryStructureAudit, type SalaryAuditLog } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { format } from "date-fns"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Skeleton } from "@/components/ui/skeleton"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Eye, AlertCircle } from "lucide-react"

// // Format number as AED currency
// const formatAED = (amount: number | string) => {
//   const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
//   if (isNaN(numAmount)) return amount
//   return new Intl.NumberFormat('en-AE', {
//     style: 'currency',
//     currency: 'AED',
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(numAmount)
// }

// // Skeleton Component
// function AuditLogSkeleton() {
//   return (
//     <div className="space-y-4">
//       {[...Array(3)].map((_, i) => (
//         <Card key={i} className="border-l-4">
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <Skeleton className="h-6 w-24" />
//               <Skeleton className="h-4 w-32" />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <Skeleton className="h-20 w-full" />
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

// interface AuditLogTabProps {
//   employeeId: number
// }

// export function AuditLogTab({ employeeId }: AuditLogTabProps) {
//   const { toast } = useToast()
//   const [auditLogs, setAuditLogs] = useState<SalaryAuditLog[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [expandedAudits, setExpandedAudits] = useState<{ [key: number]: boolean }>({})

//   useEffect(() => {
//     setIsLoading(true)
//     getSalaryStructureAudit(employeeId)
//       .then(setAuditLogs)
//       .catch(() => {
//         toast({
//           title: "Error fetching audit log",
//           description: "Could not load the salary structure audit history.",
//           variant: "destructive",
//         })
//       })
//       .finally(() => setIsLoading(false))
//   }, [employeeId, toast])

//   const toggleExpansion = (id: number) => {
//     setExpandedAudits(prev => ({ ...prev, [id]: !prev[id] }))
//   }

//   const formatValue = (key: string, value: any): string => {
//     if (value === null || value === undefined) return 'N/A'
//     if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('value')) {
//       if (typeof value === 'number' || !isNaN(Number(value))) {
//         return String(formatAED(value))
//       }
//     }
//     if (key.toLowerCase().includes('date')) {
//       try {
//         return format(new Date(value), "dd MMM yyyy")
//       } catch {
//         return String(value)
//       }
//     }
//     return String(value)
//   }

//   const renderAuditDetails = (log: SalaryAuditLog) => {
//     const isExpanded = expandedAudits[log.id]

//     return (
//       <div className="space-y-2">
//         <div className="flex items-center gap-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => toggleExpansion(log.id)}
//             className="h-6 p-1"
//           >
//             <Eye className="h-3 w-3" />
//           </Button>
//           <span className="text-sm text-muted-foreground">
//             Click to view detailed changes
//           </span>
//         </div>

//         {isExpanded && (
//           <div className="ml-8 space-y-4">
//             {log.old_data && Object.keys(log.old_data).length > 0 && (
//               <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-md border-l-2 border-red-500">
//                 <div className="font-semibold mb-2 text-red-700 dark:text-red-400 flex items-center gap-2">
//                   <div className="h-2 w-2 rounded-full bg-red-500" />
//                   Old Values
//                 </div>
//                 <div className="space-y-2 pl-4">
//                   {Object.entries(log.old_data).map(([key, value]) => (
//                     <div key={key} className="flex justify-between items-center text-sm">
//                       <span className="text-muted-foreground capitalize">
//                         {key.replace(/_/g, ' ')}:
//                       </span>
//                       <span className="font-mono font-medium">
//                         {formatValue(key, value)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {log.new_data && Object.keys(log.new_data).length > 0 && (
//               <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-md border-l-2 border-green-500">
//                 <div className="font-semibold mb-2 text-green-700 dark:text-green-400 flex items-center gap-2">
//                   <div className="h-2 w-2 rounded-full bg-green-500" />
//                   New Values
//                 </div>
//                 <div className="space-y-2 pl-4">
//                   {Object.entries(log.new_data).map(([key, value]) => (
//                     <div key={key} className="flex justify-between items-center text-sm">
//                       <span className="text-muted-foreground capitalize">
//                         {key.replace(/_/g, ' ')}:
//                       </span>
//                       <span className="font-mono font-medium">
//                         {formatValue(key, value)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Changes Summary */}
//             <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border-l-2 border-blue-500">
//               <div className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
//                 Changes Made
//               </div>
//               <ul className="space-y-1 pl-4 text-sm">
//                 {Object.keys(log.new_data).map(key => {
//                   const oldValue = log.old_data[key]
//                   const newValue = log.new_data[key]
//                   if (oldValue === newValue) return null
//                   return (
//                     <li key={key} className="text-muted-foreground">
//                       <span className="capitalize">{key.replace(/_/g, ' ')}</span>
//                       : <span className="line-through text-red-600">{formatValue(key, oldValue)}</span>
//                       {' → '}
//                       <span className="text-green-600 font-medium">{formatValue(key, newValue)}</span>
//                     </li>
//                   )
//                 })}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Structure Audit Log</CardTitle>
//         <CardDescription>
//           Complete history of all changes made to the salary structure
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <AuditLogSkeleton />
//         ) : auditLogs.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="flex justify-center mb-4">
//               <div className="p-4 bg-muted rounded-full">
//                 <AlertCircle className="h-12 w-12 text-muted-foreground" />
//               </div>
//             </div>
//             <h3 className="text-lg font-semibold mb-2">No Audit History</h3>
//             <p className="text-muted-foreground">
//               No changes have been recorded for this employee's salary structure yet.
//             </p>
//           </div>
//         ) : (
//           <ScrollArea className="h-[500px]">
//             <div className="space-y-4">
//               {auditLogs.map((log) => (
//                 <Card 
//                   key={log.id} 
//                   className={`border-l-4 ${
//                     log.action_type === 'INSERT' ? 'border-l-green-500' :
//                     log.action_type === 'UPDATE' ? 'border-l-blue-500' :
//                     'border-l-red-500'
//                   }`}
//                 >
//                   <CardHeader className="pb-3">
//                     <div className="flex items-center justify-between">
//                       <Badge variant={
//                         log.action_type === 'INSERT' ? 'default' :
//                         log.action_type === 'UPDATE' ? 'secondary' :
//                         'destructive'
//                       }>
//                         {log.action_type}
//                       </Badge>
//                       <div className="text-right">
//                         <div className="text-sm font-medium">{log.changed_by_name}</div>
//                         <div className="text-xs text-muted-foreground">
//                           {format(new Date(log.changed_at), "dd MMM yyyy, hh:mm a")}
//                         </div>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     {renderAuditDetails(log)}
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         )}
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { getSalaryStructureAudit, getPayrollComponents, type SalaryAuditLog, type PayrollComponent, type FormulaComponent } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, AlertCircle } from "lucide-react"

// Format number as AED currency
const formatAED = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numAmount)) return amount
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount)
}

// Parse formula from string
const parseFormula = (formulaString: string): FormulaComponent[] => {
  try {
    return JSON.parse(formulaString)
  } catch {
    return []
  }
}

// Skeleton Component
function AuditLogSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="border-l-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface AuditLogTabProps {
  employeeId: number
}

export function AuditLogTab({ employeeId }: AuditLogTabProps) {
  const { toast } = useToast()
  const [auditLogs, setAuditLogs] = useState<SalaryAuditLog[]>([])
  const [components, setComponents] = useState<PayrollComponent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedAudits, setExpandedAudits] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      getSalaryStructureAudit(employeeId),
      getPayrollComponents()
    ])
      .then(([logs, comps]) => {
        setAuditLogs(logs)
        setComponents(comps)
      })
      .catch(() => {
        toast({
          title: "Error fetching audit log",
          description: "Could not load the salary structure audit history.",
          variant: "destructive",
        })
      })
      .finally(() => setIsLoading(false))
  }, [employeeId, toast])

  const toggleExpansion = (id: number) => {
    setExpandedAudits(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const renderFormula = (formulaComponents: FormulaComponent[]) => {
    return formulaComponents.map((part, idx) => {
      if (part.type === 'component') {
        const component = components.find(c => c.id === parseInt(part.value))
        return (
          <span key={idx} className="text-blue-600 dark:text-blue-400 font-semibold">
            {component?.name || `Component ${part.value}`}
            {idx < formulaComponents.length - 1 ? ' ' : ''}
          </span>
        )
      }
      return (
        <span key={idx} className={
          part.type === 'operator' ? 'text-orange-600 dark:text-orange-400' :
          part.type === 'number' ? 'text-purple-600 dark:text-purple-400' :
          part.type === 'parenthesis' ? 'text-gray-600 dark:text-gray-400' :
          'text-gray-600 dark:text-gray-400'
        }>
          {part.value}{idx < formulaComponents.length - 1 ? ' ' : ''}
        </span>
      )
    })
  }

  const formatValue = (key: string, value: any): string | JSX.Element => {
    if (value === null || value === undefined) return 'N/A'
    
    // Handle custom formula
    if (key.toLowerCase().includes('formula') && typeof value === 'string') {
      const parsed = parseFormula(value)
      if (parsed.length > 0) {
        return (
          <div className="font-mono text-xs bg-background p-2 rounded border inline-block max-w-full">
            {renderFormula(parsed)}
          </div>
        )
      }
      return value
    }
    
    // Handle amounts
    if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('value')) {
      if (typeof value === 'number' || !isNaN(Number(value))) {
        return String(formatAED(value))
      }
    }
    
    // Handle dates
    if (key.toLowerCase().includes('date')) {
      try {
        return format(new Date(value), "dd MMM yyyy")
      } catch {
        return String(value)
      }
    }
    
    // Handle component references
    if (key.toLowerCase().includes('component_id')) {
      const component = components.find(c => c.id === Number(value))
      if (component) {
        return `${component.name} (ID: ${value})`
      }
    }
    
    return String(value)
  }

  const renderAuditDetails = (log: SalaryAuditLog) => {
    const isExpanded = expandedAudits[log.id]

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleExpansion(log.id)}
            className="h-6 p-1"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Click to view detailed changes
          </span>
        </div>

        {isExpanded && (
          <div className="ml-8 space-y-4">
            {log.old_data && Object.keys(log.old_data).length > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-md border-l-2 border-red-500">
                <div className="font-semibold mb-2 text-red-700 dark:text-red-400 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  Old Values
                </div>
                <div className="space-y-2 pl-4">
                  {Object.entries(log.old_data).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-start text-sm">
                        <span className="text-muted-foreground capitalize min-w-[150px]">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="font-medium text-right flex-1">
                          {formatValue(key, value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {log.new_data && Object.keys(log.new_data).length > 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-md border-l-2 border-green-500">
                <div className="font-semibold mb-2 text-green-700 dark:text-green-400 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  New Values
                </div>
                <div className="space-y-2 pl-4">
                  {Object.entries(log.new_data).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-start text-sm">
                        <span className="text-muted-foreground capitalize min-w-[150px]">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="font-medium text-right flex-1">
                          {formatValue(key, value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Changes Summary */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border-l-2 border-blue-500">
              <div className="font-semibold mb-2 text-blue-700 dark:text-blue-400">
                Changes Summary
              </div>
              <ul className="space-y-2 pl-4 text-sm">
                {Object.keys(log.new_data).map(key => {
                  const oldValue = log.old_data[key]
                  const newValue = log.new_data[key]
                  if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return null
                  
                  return (
                    <li key={key} className="text-muted-foreground">
                      <span className="capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <span className="line-through text-red-600 dark:text-red-400">
                          {typeof formatValue(key, oldValue) === 'string' 
                            ? formatValue(key, oldValue) 
                            : 'Previous formula'}
                        </span>
                        <span>→</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {typeof formatValue(key, newValue) === 'string' 
                            ? formatValue(key, newValue) 
                            : 'New formula'}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Structure Audit Log</CardTitle>
        <CardDescription>
          Complete history of all changes made to the salary structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <AuditLogSkeleton />
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-muted rounded-full">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Audit History</h3>
            <p className="text-muted-foreground">
              No changes have been recorded for this employee's salary structure yet.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <Card 
                  key={log.id} 
                  className={`border-l-4 ${
                    log.action_type === 'INSERT' ? 'border-l-green-500' :
                    log.action_type === 'UPDATE' ? 'border-l-blue-500' :
                    'border-l-red-500'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={
                        log.action_type === 'INSERT' ? 'default' :
                        log.action_type === 'UPDATE' ? 'secondary' :
                        'destructive'
                      }>
                        {log.action_type} on {log.component_name}
                      </Badge>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">{log.changed_by_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(log.changed_at), "dd MMM yyyy, hh:mm a")}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderAuditDetails(log)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
