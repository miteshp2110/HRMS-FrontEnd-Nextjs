"use client"

import * as React from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Award, AlertCircle, Sparkles, Fuel, GraduationCap, Plane, Stethoscope, CalendarPlus } from "lucide-react";
import { getMyBenefits, type MyBenefits } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const BenefitItem = ({ icon, title, value, unit }: { icon: React.ReactNode, title: string, value: string | number, unit?: string }) => {
    if (!value || value === "0" || value === 0) return null;
    return (
        <div className="flex items-start gap-4">
            <div className="bg-muted p-2 rounded-full">{icon}</div>
            <div>
                <p className="text-muted-foreground">{title}</p>
                <p className="font-semibold text-lg">{value} {unit}</p>
            </div>
        </div>
    )
}

export default function MyBenefitsPage() {
    const { toast } = useToast();
    const [benefits, setBenefits] = React.useState<MyBenefits | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        setIsLoading(true);
        getMyBenefits()
            .then(setBenefits)
            .catch(err => {
                setError(err.message || "An error occurred.");
                toast({ title: "Error", description: "Could not load your benefits information.", variant: "destructive" });
            })
            .finally(() => setIsLoading(false));
    }, [toast]);

    if (isLoading) {
        return <MainLayout><Skeleton className="h-[60vh] w-full" /></MainLayout>
    }

    if (error) {
        return (
            <MainLayout>
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Benefits Not Found</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </MainLayout>
        )
    }

    if (!benefits) {
        return <MainLayout><p>No benefits information available.</p></MainLayout>
    }
    
    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Award className="h-8 w-8" />
                    <div>
                        <h1 className="text-3xl font-bold">My Benefits</h1>
                        <p className="text-muted-foreground">Your automatically assigned benefits based on your tenure.</p>
                    </div>
                </div>

                <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5"/> Your Current Band</CardTitle>
                        <CardDescription className="text-primary-foreground/80">With {benefits.years_of_service} years of service, you are in:</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{benefits.band_name}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Entitlements</CardTitle>
                        <CardDescription>Here are the benefits you are currently entitled to under your band.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <BenefitItem icon={<Plane className="h-6 w-6"/>} title="LTA Allowance" value={`$${Number(benefits.lta_allowance).toLocaleString()}`} unit={`every ${benefits.lta_frequency_years} years`} />
                        <BenefitItem icon={<CalendarPlus className="h-6 w-6"/>} title="Additional Annual Leaves" value={benefits.additional_annual_leaves} unit="days" />
                        <BenefitItem icon={<Fuel className="h-6 w-6"/>} title="Fuel Allowance" value={`$${Number(benefits.fuel_allowance_monthly).toLocaleString()}`} unit="per month" />
                        <BenefitItem icon={<GraduationCap className="h-6 w-6"/>} title="Education Allowance" value={`$${Number(benefits.education_allowance_per_child).toLocaleString()}`} unit="per child" />
                        
                        <div className="flex items-start gap-4 col-span-full">
                            <div className="bg-muted p-2 rounded-full"><Stethoscope className="h-6 w-6"/></div>
                            <div>
                                <p className="text-muted-foreground">Medical Plan</p>
                                <p className="font-semibold">{benefits.medical_plan_details}</p>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}