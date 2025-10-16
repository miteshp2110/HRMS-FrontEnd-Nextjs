// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { Button } from "@/components/ui/button";
// import { ChevronsUpDown } from "lucide-react";
// import { type EosSettlementDetails } from "@/lib/api";

// interface Props {
//     totalAmount: string;
//     breakdown: EosSettlementDetails['leave_encashment_breakdown'];
// }

// export function LeaveEncashmentCard({ totalAmount, breakdown }: Props) {
//     return (
//         <Card>
//             <CardHeader>
//                 <div className="flex justify-between items-center">
//                     <CardTitle>Leave Encashment</CardTitle>
//                     <p className="text-2xl font-bold text-green-600">+ ${Number(totalAmount).toLocaleString()}</p>
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 <Collapsible>
//                     <CollapsibleTrigger asChild>
//                         <Button variant="outline" size="sm"><ChevronsUpDown className="h-4 w-4 mr-2" /> Show Calculation Details</Button>
//                     </CollapsibleTrigger>
//                     <CollapsibleContent className="pt-4 space-y-2 text-sm">
//                         <p className="flex justify-between"><span>Basic Salary:</span><span className="font-mono">${breakdown.basic_salary.toLocaleString()}</span></p>
//                         <p className="flex justify-between"><span>Daily Rate:</span><span className="font-mono">${breakdown.daily_rate}</span></p>
//                         <p className="flex justify-between"><span>Total Leave Balance:</span><span className="font-mono">{breakdown.total_leave_balance} days</span></p>
//                         <p className="flex justify-between"><span>Unpaid Days Deducted:</span><span className="font-mono">{breakdown.unpaid_days_deducted} days</span></p>
//                         <hr/>
//                         <p className="flex justify-between font-semibold"><span>Net Encashable Days:</span><span className="font-mono">{breakdown.net_encashable_days} days</span></p>
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
import { ChevronsUpDown, Calendar, TrendingUp } from "lucide-react"
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
  breakdown: EosSettlementDetails['leave_encashment_breakdown']
}

export function LeaveEncashmentCard({ 
  totalAmount, 
  breakdown
}: Props) {
  return (
    <Card className="border-green-200 dark:border-green-900">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Leave Encashment
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Unused leave days converted to payment
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
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Basic Salary:</span>
                  <span className="font-mono font-medium">
                    {formatAED(breakdown.basic_salary)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Daily Rate:</span>
                  <span className="font-mono font-medium">
                    {formatAED(breakdown.daily_rate)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Leave Balance:</span>
                  <span className="font-mono font-medium">
                    {breakdown.total_leave_balance} days
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unpaid Days Deducted:</span>
                  <span className="font-mono font-medium text-red-600 dark:text-red-400">
                    {breakdown.unpaid_days_deducted} days
                  </span>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <span className="font-semibold">Net Encashable Days:</span>
                  <span className="font-mono font-bold text-green-700 dark:text-green-300">
                    {breakdown.net_encashable_days} days
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
