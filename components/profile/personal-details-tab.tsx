

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { DetailedUserProfile } from "@/lib/api"
import { changePassword } from "@/lib/api"
import * as React from "react"
import { Loader2, KeyRound } from "lucide-react"

interface PersonalDetailsTabProps {
  profile: DetailedUserProfile
  isEditing: boolean
  isSelfProfile?: boolean
  onSave: (updatedData: Partial<DetailedUserProfile>) => Promise<void>
  onCancel: () => void
}

export function PersonalDetailsTab({ profile, isEditing, isSelfProfile = false, onSave, onCancel }: PersonalDetailsTabProps) {
  const [formData, setFormData] = React.useState(profile)
  const [isSaving, setIsSaving] = React.useState(false)
  
  // Password reset state (admin function)
  const [isResettingPassword, setIsResettingPassword] = React.useState(false)
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPasswordSection, setShowPasswordSection] = React.useState(false)
  const [passwordErrors, setPasswordErrors] = React.useState({
    newPassword: "",
    confirmPassword: ""
  })
  
  const { toast } = useToast()

  React.useEffect(() => {
    setFormData(profile)
  }, [profile, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const changedData: Partial<DetailedUserProfile> = {};
      (Object.keys(formData) as Array<keyof DetailedUserProfile>).forEach(key => {
        if (formData[key] !== profile[key]) {
          (changedData as any)[key] = formData[key];
        }
      });
      
      if (Object.keys(changedData).length > 0) {
        await onSave(changedData)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        onCancel()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const validatePassword = (): boolean => {
    const errors = { newPassword: "", confirmPassword: "" }
    let isValid = true

    if (!newPassword) {
      errors.newPassword = "Password is required"
      isValid = false
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
      isValid = false
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm the password"
      isValid = false
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setPasswordErrors(errors)
    return isValid
  }

  const handlePasswordReset = async () => {
    if (!validatePassword()) {
      return
    }

    setIsResettingPassword(true)
    try {
      const result = await changePassword(newPassword, profile.id)
      console.log("API Response:", result)
      
      if (result.success) {
        alert("Password Updated")
        toast({
          title: "Success",
          description: "Password updated successfully",
        })
        // Reset form and hide section
        setNewPassword("")
        setConfirmPassword("")
        setShowPasswordSection(false)
        setPasswordErrors({ newPassword: "", confirmPassword: "" })
      } else {
        alert("Failed to update password, or you dont have permission to reset password")
        toast({
          title: "Error",
          description: "Failed to update password",
          variant:'destructive'
        })
      }
    } catch (error: any) {
      alert("Failed to reset password , or you dont have permission to reset password")
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      })
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handlePasswordChange = (field: 'newPassword' | 'confirmPassword', value: string) => {
    if (field === 'newPassword') {
      setNewPassword(value)
    } else {
      setConfirmPassword(value)
    }
    
    // Clear error for this field when user starts typing
    setPasswordErrors(prev => ({ ...prev, [field]: "" }))
  }

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toISOString().split("T")[0]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="first_name">First Name</Label>
              {isEditing ? (
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} disabled={isSelfProfile} />
              ) : (
                <p className="text-sm">{profile.first_name}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="last_name">Last Name</Label>
              {isEditing ? (
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} disabled={isSelfProfile} />
              ) : (
                <p className="text-sm">{profile.last_name}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={isSelfProfile} />
              ) : (
                <p className="text-sm">{profile.email}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
              ) : (
                <p className="text-sm">{profile.phone || "Not provided"}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="dob">Date of Birth</Label>
              {isEditing ? (
                <Input id="dob" name="dob" type="date" value={formatDateForInput(formData.dob)} onChange={handleChange} disabled={isSelfProfile} />
              ) : (
                <p className="text-sm">{profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)} disabled={isSelfProfile}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm capitalize">{profile.gender || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="nationality">Nationality</Label>
              <p className="text-sm capitalize">{profile.nationality || "Not provided"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>In case of an emergency, this is who we'll contact.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label htmlFor="emergency_contact_name">Contact Name</Label>
              {isEditing ? (
                <Input id="emergency_contact_name" name="emergency_contact_name" value={formData.emergency_contact_name || ""} onChange={handleChange} />
              ) : (
                <p className="text-sm">{profile.emergency_contact_name || "Not provided"}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="emergency_contact_relation">Relationship</Label>
              {isEditing ? (
                <Input id="emergency_contact_relation" name="emergency_contact_relation" value={formData.emergency_contact_relation || ""} onChange={handleChange} />
              ) : (
                <p className="text-sm">{profile.emergency_contact_relation || "Not provided"}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="emergency_contact_number">Contact Number</Label>
              {isEditing ? (
                <Input id="emergency_contact_number" name="emergency_contact_number" value={formData.emergency_contact_number || ""} onChange={handleChange} />
              ) : (
                <p className="text-sm">{profile.emergency_contact_number || "Not provided"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Password Reset Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Reset User Password
              </CardTitle>
              <CardDescription>
                Reset password for {profile.first_name} {profile.last_name}. They will need to use the new password to login.
              </CardDescription>
            </div>
            {!showPasswordSection && (
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordSection(true)}
                disabled={isResettingPassword}
              >
                Reset Password
              </Button>
            )}
          </div>
        </CardHeader>
        {showPasswordSection && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  disabled={isResettingPassword}
                  placeholder="Enter new password"
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  disabled={isResettingPassword}
                  placeholder="Confirm new password"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPasswordSection(false)
                  setNewPassword("")
                  setConfirmPassword("")
                  setPasswordErrors({ newPassword: "", confirmPassword: "" })
                }}
                disabled={isResettingPassword}
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordReset} disabled={isResettingPassword}>
                {isResettingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isResettingPassword ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
