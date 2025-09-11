// "use client"

// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { UserPlus, Award, DollarSign, ArrowRight, Badge } from "lucide-react"
// import Link from "next/link"

// interface PendingApprovalsWidgetProps {
//   leaves: { primary: number; secondary: number }
//   skills: any[]
//   loans: any[]
// }

// export function PendingApprovalsWidget({ leaves, skills, loans }: PendingApprovalsWidgetProps) {
//   const totalLeaves = leaves.primary + leaves.secondary;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Action Center</CardTitle>
//         <CardDescription>Items that require your immediate attention.</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex items-center">
//             <UserPlus className="h-5 w-5 mr-4 text-blue-500"/>
//             <div className="flex-1"><p className="font-medium">Leave Approvals</p></div>
//             <Badge  className="mr-4">{totalLeaves} Pending</Badge>
//             <Button variant="ghost" size="sm" asChild><Link href="/management/leaves"><ArrowRight className="h-4 w-4"/></Link></Button>
//         </div>
//         <Separator/>
//         <div className="flex items-center">
//             <Award className="h-5 w-5 mr-4 text-green-500"/>
//             <div className="flex-1"><p className="font-medium">Skill Requests</p></div>
//             <Badge  className="mr-4">{skills.length} Pending</Badge>
//             <Button variant="ghost" size="sm" asChild><Link href="/management/skill-approvals"><ArrowRight className="h-4 w-4"/></Link></Button>
//         </div>
//         <Separator/>
//         <div className="flex items-center">
//             <DollarSign className="h-5 w-5 mr-4 text-red-500"/>
//             <div className="flex-1"><p className="font-medium">Loan Requests</p></div>
//             <Badge  className="mr-4">{loans.length} Pending</Badge>
//             <Button variant="ghost" size="sm" asChild><Link href="/management/loans"><ArrowRight className="h-4 w-4"/></Link></Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Award, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PendingApprovalsWidgetProps {
  leaves: { primary: number; secondary: number }
  skills: any[]
  loans: any[]
}

export function PendingApprovalsWidget({ leaves, skills, loans }: PendingApprovalsWidgetProps) {
  const totalLeaves = leaves.primary + leaves.secondary;
  const totalSkills = skills.length;
  const totalLoans = loans.length;

  // If nothing is pending, don't render the card
  if (totalLeaves === 0 && totalSkills === 0 && totalLoans === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Center</CardTitle>
        <CardDescription>Items that require your immediate attention.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalLeaves > 0 && (
          <div className="flex items-center">
              <UserPlus className="h-5 w-5 mr-4 text-blue-500"/>
              <div className="flex-1"><p className="font-medium">Leave Approvals</p></div>
              <Badge variant="secondary" className="mr-4">{totalLeaves} Pending</Badge>
              <Button variant="ghost" size="sm" asChild><Link href="/management/leaves"><ArrowRight className="h-4 w-4"/></Link></Button>
          </div>
        )}
        {totalSkills > 0 && (
            <>
            <Separator/>
            <div className="flex items-center">
                <Award className="h-5 w-5 mr-4 text-green-500"/>
                <div className="flex-1"><p className="font-medium">Skill Requests</p></div>
                <Badge variant="secondary" className="mr-4">{totalSkills} Pending</Badge>
                <Button variant="ghost" size="sm" asChild><Link href="/management/skill-approvals"><ArrowRight className="h-4 w-4"/></Link></Button>
            </div>
            </>
        )}
        {totalLoans > 0 && (
            <>
            <Separator/>
            <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-4 text-red-500"/>
                <div className="flex-1"><p className="font-medium">Loan Requests</p></div>
                <Badge variant="secondary" className="mr-4">{totalLoans} Pending</Badge>
                <Button variant="ghost" size="sm" asChild><Link href="/management/loans"><ArrowRight className="h-4 w-4"/></Link></Button>
            </div>
            </>
        )}
      </CardContent>
    </Card>
  )
}