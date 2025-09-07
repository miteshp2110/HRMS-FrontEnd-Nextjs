import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Building, Hash } from "lucide-react"
import type { BankDetails } from "@/lib/api"

interface BankDetailsTabProps {
  bankDetails: BankDetails | null
  isLoading: boolean
}

export function BankDetailsTab({ bankDetails, isLoading }: BankDetailsTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bank details...</p>
        </div>
      </div>
    )
  }

  if (!bankDetails) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bank details found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber
    return `****${accountNumber.slice(-4)}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Account Details</CardTitle>
        <CardDescription>Banking information for salary and payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
              <p className="text-sm font-medium">{bankDetails.bank_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Number</label>
              <p className="text-sm font-medium font-mono">{bankDetails.bank_account}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <label className="text-sm font-medium text-muted-foreground">IFSC Code</label>
              <p className="text-sm font-medium font-mono">{bankDetails.bank_ifsc}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
