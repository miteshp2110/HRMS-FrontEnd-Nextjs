
"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import LoanFinanceTab from "@/components/management/finance/loan-finance-tab";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ExpenseFinanceTab from "@/components/management/finance/expense-finance-tab";
import { Banknote } from "lucide-react";

export default function FinancePage() {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate loading time - replace with your actual loading logic
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const SkeletonContent = () => (
        <div className="space-y-6">
            {/* Header section skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-80" />
                <Skeleton className="h-4 w-96" />
            </div>
            
            {/* Tab skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-full max-w-md" />
                
                {/* Content area skeleton */}
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-48" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-3/5" />
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <MainLayout>
                <SkeletonContent />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex items-center gap-4">
                <Banknote className="h-8 w-8" />
                <div>
                    <h1 className="text-3xl font-bold">Finance & Reimbursements</h1>
                    <p className="text-muted-foreground">Manage expense reimbursement settings and financial configurations.</p>
                </div>
            </div>
            <Tabs defaultValue="expense" className="mt-2">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="expense">Expense</TabsTrigger>
                    <TabsTrigger value="loans">Loans</TabsTrigger>
                </TabsList>

                <TabsContent value="expense" className="mt-5">
                    <ExpenseFinanceTab/>
                </TabsContent>
                <TabsContent value="loans" className="mt-5">
                    <LoanFinanceTab/>
                </TabsContent>
            </Tabs>
        </MainLayout>
    )
}
