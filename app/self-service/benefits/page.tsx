// "use client"

// import * as React from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Award, AlertCircle, Sparkles, Fuel, GraduationCap, Plane, Stethoscope, CalendarPlus } from "lucide-react";
// import { getMyBenefits, type MyBenefits } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Skeleton } from "@/components/ui/skeleton";

// const BenefitItem = ({ icon, title, value, unit }: { icon: React.ReactNode, title: string, value: string | number, unit?: string }) => {
//     if (!value || value === "0" || value === 0) return null;
//     return (
//         <div className="flex items-start gap-4">
//             <div className="bg-muted p-2 rounded-full">{icon}</div>
//             <div>
//                 <p className="text-muted-foreground">{title}</p>
//                 <p className="font-semibold text-lg">{value} {unit}</p>
//             </div>
//         </div>
//     )
// }

// export default function MyBenefitsPage() {
//     const { toast } = useToast();
//     const [benefits, setBenefits] = React.useState<MyBenefits | null>(null);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [error, setError] = React.useState<string | null>(null);

//     React.useEffect(() => {
//         setIsLoading(true);
//         getMyBenefits()
//             .then(setBenefits)
//             .catch(err => {
//                 setError(err.message || "An error occurred.");
//                 toast({ title: "Error", description: "Could not load your benefits information.", variant: "destructive" });
//             })
//             .finally(() => setIsLoading(false));
//     }, [toast]);

//     if (isLoading) {
//         return <MainLayout><Skeleton className="h-[60vh] w-full" /></MainLayout>
//     }

//     if (error) {
//         return (
//             <MainLayout>
//                  <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Benefits Not Found</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             </MainLayout>
//         )
//     }

//     if (!benefits) {
//         return <MainLayout><p>No benefits information available.</p></MainLayout>
//     }
    
//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                     <Award className="h-8 w-8" />
//                     <div>
//                         <h1 className="text-3xl font-bold">My Benefits</h1>
//                         <p className="text-muted-foreground">Your automatically assigned benefits based on your tenure.</p>
//                     </div>
//                 </div>

//                 <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
//                     <CardHeader>
//                         <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5"/> Your Current Band</CardTitle>
//                         <CardDescription className="text-primary-foreground/80">With {benefits.years_of_service} years of service, you are in:</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <p className="text-4xl font-bold">{benefits.band_name}</p>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Your Entitlements</CardTitle>
//                         <CardDescription>Here are the benefits you are currently entitled to under your band.</CardDescription>
//                     </CardHeader>
//                     <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         <BenefitItem icon={<Plane className="h-6 w-6"/>} title="LTA Allowance" value={`$${Number(benefits.lta_allowance).toLocaleString()}`} unit={`every ${benefits.lta_frequency_years} years`} />
//                         <BenefitItem icon={<CalendarPlus className="h-6 w-6"/>} title="Additional Annual Leaves" value={benefits.additional_annual_leaves} unit="days" />
//                         <BenefitItem icon={<Fuel className="h-6 w-6"/>} title="Fuel Allowance" value={`$${Number(benefits.fuel_allowance_monthly).toLocaleString()}`} unit="per month" />
//                         <BenefitItem icon={<GraduationCap className="h-6 w-6"/>} title="Education Allowance" value={`$${Number(benefits.education_allowance_per_child).toLocaleString()}`} unit="per child" />
                        
//                         <div className="flex items-start gap-4 col-span-full">
//                             <div className="bg-muted p-2 rounded-full"><Stethoscope className="h-6 w-6"/></div>
//                             <div>
//                                 <p className="text-muted-foreground">Medical Plan</p>
//                                 <p className="font-semibold">{benefits.medical_plan_details}</p>
//                             </div>
//                         </div>

//                     </CardContent>
//                 </Card>
//             </div>
//         </MainLayout>
//     )
// }

"use client"

import * as React from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Award, 
  AlertCircle, 
  Sparkles, 
  Fuel, 
  GraduationCap, 
  Plane, 
  Stethoscope, 
  CalendarPlus,
  Clock,
  TrendingUp
} from "lucide-react"
import { getMyBenefits, type MyBenefits } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

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

// Skeleton Components
function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
    </div>
  )
}

function BandCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-12 w-64" />
      </CardContent>
    </Card>
  )
}

function BenefitsGridSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PageSkeleton() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <BandCardSkeleton />
        <BenefitsGridSkeleton />
      </div>
    </MainLayout>
  )
}

interface BenefitItemProps {
  icon: React.ReactNode
  title: string
  value: string | number
  unit?: string
  color?: string
}

const BenefitItem = ({ icon, title, value, unit, color = "blue" }: BenefitItemProps) => {
  if (!value || value === "0" || value === 0) return null
  
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-900",
    green: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-900",
    purple: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-900",
    orange: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-900",
    teal: "from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-900",
    pink: "from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-900",
  }

  return (
    <div className={`p-4 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border rounded-lg hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-xl font-bold">{value}</p>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyBenefitsPage() {
  const { toast } = useToast()
  const [benefits, setBenefits] = React.useState<MyBenefits | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setIsLoading(true)
    getMyBenefits()
      .then(setBenefits)
      .catch(err => {
        setError(err.message || "An error occurred.")
        toast({ 
          title: "Error", 
          description: "Could not load your benefits information.", 
          variant: "destructive" 
        })
      })
      .finally(() => setIsLoading(false))
  }, [toast])

  if (isLoading) {
    return <PageSkeleton />
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="p-4 bg-red-100 dark:bg-red-950 rounded-full mb-4">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Benefits Not Found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {error}
          </p>
        </div>
      </MainLayout>
    )
  }

  if (!benefits) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="p-4 bg-muted rounded-full mb-4">
            <Award className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Benefits Information</h2>
          <p className="text-muted-foreground">
            No benefits information is available for your account.
          </p>
        </div>
      </MainLayout>
    )
  }

  // Count active benefits
  const activeBenefitsCount = [
    benefits.lta_allowance > 0,
    benefits.additional_annual_leaves > 0,
    benefits.fuel_allowance_monthly > 0,
    benefits.education_allowance_per_child > 0,
    benefits.medical_plan_details
  ].filter(Boolean).length

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Benefits</h1>
            <p className="text-muted-foreground">
              Your automatically assigned benefits based on your tenure and band
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Years of Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{benefits.years_of_service}</div>
              <p className="text-xs text-muted-foreground mt-1">years</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Current Band
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{benefits.band_name}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeBenefitsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">entitlements</p>
            </CardContent>
          </Card>
        </div>

        {/* Band Information Card */}
        <Card className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5" />
              Your Current Benefits Band
            </CardTitle>
            <CardDescription className="text-indigo-100">
              With {benefits.years_of_service} year{Number(benefits.years_of_service) !== 1 ? 's' : ''} of service, you are currently in:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-5xl font-bold">{benefits.band_name}</div>
              <Badge variant="secondary" className="bg-white text-indigo-600">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Your Entitlements</CardTitle>
            <CardDescription>
              Here are the benefits you are currently entitled to under your band
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BenefitItem 
                icon={<Plane className="h-6 w-6 text-blue-600" />} 
                title="LTA Allowance" 
                value={formatAED(benefits.lta_allowance)} 
                unit={`every ${benefits.lta_frequency_years} year${benefits.lta_frequency_years !== 1 ? 's' : ''}`}
                color="blue"
              />
              
              <BenefitItem 
                icon={<CalendarPlus className="h-6 w-6 text-green-600" />} 
                title="Additional Annual Leaves" 
                value={benefits.additional_annual_leaves} 
                unit="days per year"
                color="green"
              />
              
              <BenefitItem 
                icon={<Fuel className="h-6 w-6 text-orange-600" />} 
                title="Fuel Allowance" 
                value={formatAED(benefits.fuel_allowance_monthly)} 
                unit="per month"
                color="orange"
              />
              
              <BenefitItem 
                icon={<GraduationCap className="h-6 w-6 text-purple-600" />} 
                title="Education Allowance" 
                value={formatAED(benefits.education_allowance_per_child)} 
                unit="per child"
                color="purple"
              />
              
              {benefits.medical_plan_details && (
                <div className="col-span-full">
                  <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border border-teal-200 dark:border-teal-900 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                        <Stethoscope className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Medical Plan</p>
                        <p className="font-semibold text-lg">{benefits.medical_plan_details}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          Healthcare Coverage
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {activeBenefitsCount === 0 && (
              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Active Benefits</AlertTitle>
                <AlertDescription>
                  You currently don't have any active benefits assigned to your band. 
                  Please contact HR if you believe this is an error.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900 dark:text-blue-100">Benefits Information</AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Your benefits are automatically assigned based on your years of service and current band. 
            They will be updated automatically when you move to a different band. 
            For any questions about your benefits, please contact the HR department.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  )
}
