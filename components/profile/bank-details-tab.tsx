// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { CreditCard, Building, Hash } from "lucide-react"
// import type { BankDetails } from "@/lib/api"

// interface BankDetailsTabProps {
//   bankDetails: BankDetails | null
//   isLoading: boolean
// }

// export function BankDetailsTab({ bankDetails, isLoading }: BankDetailsTabProps) {
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading bank details...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!bankDetails) {
//     return (
//       <Card>
//         <CardContent className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <p className="text-muted-foreground">No bank details found</p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   const maskAccountNumber = (accountNumber: string) => {
//     if (accountNumber.length <= 4) return accountNumber
//     return `****${accountNumber.slice(-4)}`
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Bank Account Details</CardTitle>
//         <CardDescription>Banking information for salary and payments</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex items-start gap-3">
//             <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
//             <div>
//               <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
//               <p className="text-sm font-medium">{bankDetails.bank_name}</p>
//             </div>
//           </div>

//           <div className="flex items-start gap-3">
//             <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
//             <div>
//               <label className="text-sm font-medium text-muted-foreground">Account Number</label>
//               <p className="text-sm font-medium font-mono">{bankDetails.bank_account}</p>
//             </div>
//           </div>

//           <div className="flex items-start gap-3">
//             <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
//             <div>
//               <label className="text-sm font-medium text-muted-foreground">IFSC Code</label>
//               <p className="text-sm font-medium font-mono">{bankDetails.bank_ifsc}</p>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Building, Hash, Save, Edit, Calendar, User } from "lucide-react"
import type { BankDetails } from "@/lib/api"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { updateEmployeeBankDetails } from "@/lib/api"

interface BankDetailsTabProps {
  bankDetails: BankDetails | null
  isLoading: boolean
  employeeId: number;
  onUpdate: () => void;
}

export function BankDetailsTab({ bankDetails, isLoading, employeeId, onUpdate }: BankDetailsTabProps) {
    const { toast } = useToast()
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        bank_name: bankDetails?.bank_name || "",
        bank_account: bankDetails?.bank_account || "",
        bank_ifsc: bankDetails?.bank_ifsc || "",
    });
    const [timezone, setTimezone] = useState('UTC');

    useEffect(() => {
        const savedTimezone = localStorage.getItem("selectedTimezone") || "UTC";
        if (savedTimezone) {
            setTimezone(savedTimezone);
        }
    }, []);

    const handleSave = async () => {
        try {
            await updateEmployeeBankDetails(employeeId, formData);
            toast({ title: "Success", description: "Bank details updated." });
            setIsEditing(false);
            onUpdate();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to update: ${error.message}`, variant: "destructive" });
        }
    }

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString(undefined, { timeZone: timezone });
    }


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

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
            <CardTitle>Bank Account Details</CardTitle>
            <CardDescription>Banking information for salary and payments</CardDescription>
        </div>
        {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-2"/>Edit</Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
            <div className="space-y-4">
                 <div>
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input id="bank_name" value={formData.bank_name} onChange={e => setFormData({...formData, bank_name: e.target.value})} />
                </div>
                <div>
                    <Label htmlFor="bank_account">Account Number</Label>
                    <Input id="bank_account" value={formData.bank_account} onChange={e => setFormData({...formData, bank_account: e.target.value})} />
                </div>
                <div>
                    <Label htmlFor="bank_ifsc">IFSC Code</Label>
                    <Input id="bank_ifsc" value={formData.bank_ifsc} onChange={e => setFormData({...formData, bank_ifsc: e.target.value})} />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave}><Save className="h-4 w-4 mr-2"/>Save</Button>
                </div>
            </div>
        ) : !bankDetails ? (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No bank details found</p>
                </div>
            </div>
        ) : (
            <div>
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
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-muted-foreground space-y-2">
                    <div className="flex gap-2">
                        <span className="font-semibold">Created At:</span>
                        <span>{formatTimestamp(bankDetails.created_at)}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold">Last Updated:</span>
                        <span>{formatTimestamp(bankDetails.updated_at)} by {bankDetails.updated_by_name}</span>
                    </div>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  )
}