"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronsUpDown } from "lucide-react";
import { type EosSettlementDetails } from "@/lib/api";

interface Props {
    totalAmount: string;
    breakdown: EosSettlementDetails['gratuity_breakdown'];
}

export function GratuityCard({ totalAmount, breakdown }: Props) {


    return (
         <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Gratuity</CardTitle>
                    <p className="text-2xl font-bold text-green-600">+ ${Number(totalAmount).toLocaleString()}</p>
                </div>
            </CardHeader>
            <CardContent>
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm"><ChevronsUpDown className="h-4 w-4 mr-2" /> Show Calculation Details</Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-2 text-sm">
                        <p className="flex justify-between"><span>Total Years of Service:</span><span className="font-mono">{breakdown.service_years}</span></p>
                        <p className="flex justify-between"><span>Basic Salary Used:</span><span className="font-mono">${breakdown.basic_salary?.toLocaleString()}</span></p>
                        <Table className="mt-2">
                            <TableHeader><TableRow><TableHead>Years</TableHead><TableHead>Rate (Days/Year)</TableHead><TableHead>Payable Days</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {breakdown.breakdown?.map((item, index) => (
                                    <TableRow key={index}><TableCell>{item.years}</TableCell><TableCell>{item.rate_in_days}</TableCell><TableCell>{item.days_payable}</TableCell></TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <hr/>
                        <p className="flex justify-between font-semibold"><span>Total Payable Days:</span><span className="font-mono">{breakdown.total_days_payable}</span></p>
                        <p className="flex justify-between text-xs text-muted-foreground pt-2"><span>Calculation:</span><span className="font-mono">{breakdown.calculation}</span></p>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}