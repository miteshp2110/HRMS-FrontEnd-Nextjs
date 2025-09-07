"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Building, CreditCard, Hash, Save, Edit } from "lucide-react"
import { getMyBankDetails, updateMyBankDetails, type BankDetails } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MyBankDetailsPage() {
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    bank_name: "",
    bank_account: "",
    bank_ifsc: "",
  })

  const loadBankDetails = async () => {
    try {
      setLoading(true);
      const data = await getMyBankDetails()
      setBankDetails(data)
      setFormData({
        bank_name: data.bank_name,
        bank_account: data.bank_account,
        bank_ifsc: data.bank_ifsc,
      })
      setIsEditing(false); // If details exist, start in view mode
    } catch (error) {
      console.error("Failed to load bank details:", error)
      setIsEditing(true); // If no details exist, start in edit mode
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBankDetails()
  }, [])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateMyBankDetails(formData)

      toast({
        title: "Success",
        description: "Bank details updated successfully",
      })

      setIsEditing(false)
      loadBankDetails()
    } catch (error: any) {
      console.error("Failed to update bank details:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update bank details",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (bankDetails) {
      setFormData({
        bank_name: bankDetails.bank_name,
        bank_account: bankDetails.bank_account,
        bank_ifsc: bankDetails.bank_ifsc,
      })
      setIsEditing(false);
    } else {
        // If there were no details to begin with, just clear the form
        setFormData({ bank_name: "", bank_account: "", bank_ifsc: "" });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
            <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Banking Information
            </CardTitle>
            <CardDescription>Your bank account for salary and reimbursement.</CardDescription>
        </div>
        {bankDetails && !isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_name" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Bank Name
              </Label>
              <Input
                id="bank_name"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                placeholder="e.g., State Bank of India"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_account" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Account Number
              </Label>
              <Input
                id="bank_account"
                value={formData.bank_account}
                onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                placeholder="e.g., 1234567890123456"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_ifsc" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                IFSC Code
              </Label>
              <Input
                id="bank_ifsc"
                value={formData.bank_ifsc}
                onChange={(e) => setFormData({ ...formData, bank_ifsc: e.target.value.toUpperCase() })}
                placeholder="e.g., SBIN0001234"
                required
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Details"}
            </Button>
          </div>
        </form>
      ) : bankDetails ? (
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Building className="h-4 w-4" />
                Bank Name
              </Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{bankDetails.bank_name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Hash className="h-4 w-4" />
                Account Number
              </Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-mono">{bankDetails.bank_account.replace(/(.{4})/g, "$1 ").trim()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="h-4 w-4" />
                IFSC Code
              </Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-mono">{bankDetails.bank_ifsc}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bank Details Found</h3>
          <p className="text-muted-foreground mb-4">Add your bank account information to receive salary payments.</p>
        </div>
      )}
    </CardContent>
  </Card>
  )
}