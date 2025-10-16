// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ChevronsUpDown } from "lucide-react";
// import { type EosSettlementDetails } from "@/lib/api";

// interface Props {
//     totalAmount: string;
//     breakdown: EosSettlementDetails['gratuity_breakdown'];
// }

// export function GratuityCard({ totalAmount, breakdown }: Props) {


//     return (
//          <Card>
//             <CardHeader>
//                 <div className="flex justify-between items-center">
//                     <CardTitle>Gratuity</CardTitle>
//                     <p className="text-2xl font-bold text-green-600">+ ${Number(totalAmount).toLocaleString()}</p>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <Collapsible>
//                     <CollapsibleTrigger asChild>
//                         <Button variant="outline" size="sm"><ChevronsUpDown className="h-4 w-4 mr-2" /> Show Calculation Details</Button>
//                     </CollapsibleTrigger>
//                     <CollapsibleContent className="pt-4 space-y-2 text-sm">
//                         <p className="flex justify-between"><span>Total Years of Service:</span><span className="font-mono">{breakdown.service_years}</span></p>
//                         <p className="flex justify-between"><span>Basic Salary Used:</span><span className="font-mono">${breakdown.basic_salary?.toLocaleString()}</span></p>
//                         <Table className="mt-2">
//                             <TableHeader><TableRow><TableHead>Years</TableHead><TableHead>Rate (Days/Year)</TableHead><TableHead>Payable Days</TableHead></TableRow></TableHeader>
//                             <TableBody>
//                                 {breakdown.breakdown?.map((item, index) => (
//                                     <TableRow key={index}><TableCell>{item.years}</TableCell><TableCell>{item.rate_in_days}</TableCell><TableCell>{item.days_payable}</TableCell></TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                          <hr/>
//                         <p className="flex justify-between font-semibold"><span>Total Payable Days:</span><span className="font-mono">{breakdown.total_days_payable}</span></p>
//                         <p className="flex justify-between text-xs text-muted-foreground pt-2"><span>Calculation:</span><span className="font-mono">{breakdown.calculation}</span></p>
//                     </CollapsibleContent>
//                 </Collapsible>
//             </CardContent>
//         </Card>
//     );
// }

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronsUpDown, Award, TrendingUp } from "lucide-react"
import { type EosSettlementDetails } from "@/lib/api"

// Format number as AED currency
const formatAED = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount)
}

interface Props {
  totalAmount: string
  breakdown: EosSettlementDetails['gratuity_breakdown']
}

export function GratuityCard({ 
  totalAmount, 
  breakdown
}: Props) {
  return (
    <Card className="border-green-200 dark:border-green-900">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Gratuity
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                End-of-service benefit based on tenure
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-lg font-bold px-3 py-1"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              {formatAED(totalAmount)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <ChevronsUpDown className="h-4 w-4 mr-2" /> 
              Show Calculation Details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Years of Service:</span>
                  <span className="font-mono font-medium">
                    {breakdown.service_years} years
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Basic Salary Used:</span>
                  <span className="font-mono font-medium">
                    {formatAED(breakdown.basic_salary || 0)}
                  </span>
                </div>
              </div>

              {breakdown.breakdown && breakdown.breakdown.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Years</TableHead>
                        <TableHead className="font-semibold">Rate (Days/Year)</TableHead>
                        <TableHead className="font-semibold text-right">Payable Days</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {breakdown.breakdown.map((item, index) => (
                        <TableRow key={index} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{item.years}</TableCell>
                          <TableCell className="font-mono">{item.rate_in_days}</TableCell>
                          <TableCell className="font-mono text-right font-medium">
                            {item.days_payable}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <span className="font-semibold">Total Payable Days:</span>
                  <span className="font-mono font-bold text-green-700 dark:text-green-300">
                    {breakdown.total_days_payable} days
                  </span>
                </div>
              </div>

              <div className="pt-2 px-3 py-2 bg-muted/30 rounded-md border border-dashed">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Calculation Formula:
                </p>
                <p className="text-xs font-mono text-foreground">
                  {breakdown.calculation}
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
