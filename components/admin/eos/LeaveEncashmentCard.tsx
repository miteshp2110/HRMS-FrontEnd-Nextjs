"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { type EosSettlementDetails } from "@/lib/api";

interface Props {
    totalAmount: string;
    breakdown: EosSettlementDetails['leave_encashment_breakdown'];
}

export function LeaveEncashmentCard({ totalAmount, breakdown }: Props) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Leave Encashment</CardTitle>
                    <p className="text-2xl font-bold text-green-600">+ ${Number(totalAmount).toLocaleString()}</p>
                </div>
            </CardHeader>
            <CardContent>
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm"><ChevronsUpDown className="h-4 w-4 mr-2" /> Show Calculation Details</Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-2 text-sm">
                        <p className="flex justify-between"><span>Basic Salary:</span><span className="font-mono">${breakdown.basic_salary.toLocaleString()}</span></p>
                        <p className="flex justify-between"><span>Daily Rate:</span><span className="font-mono">${breakdown.daily_rate}</span></p>
                        <p className="flex justify-between"><span>Total Leave Balance:</span><span className="font-mono">{breakdown.total_leave_balance} days</span></p>
                        <p className="flex justify-between"><span>Unpaid Days Deducted:</span><span className="font-mono">{breakdown.unpaid_days_deducted} days</span></p>
                        <hr/>
                        <p className="flex justify-between font-semibold"><span>Net Encashable Days:</span><span className="font-mono">{breakdown.net_encashable_days} days</span></p>
                        <p className="flex justify-between text-xs text-muted-foreground pt-2"><span>Calculation:</span><span className="font-mono">{breakdown.calculation}</span></p>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}