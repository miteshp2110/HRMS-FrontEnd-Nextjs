
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DetailedUserProfile } from "@/lib/api"
import * as React from "react"

interface PersonalDetailsTabProps {
  profile: DetailedUserProfile
  isEditing: boolean
  isSelfProfile?: boolean // New prop to control which fields are editable
  onSave: (updatedData: Partial<DetailedUserProfile>) => Promise<void>
  onCancel: () => void
}

export function PersonalDetailsTab({ profile, isEditing, isSelfProfile = false, onSave, onCancel }: PersonalDetailsTabProps) {
  const [formData, setFormData] = React.useState(profile)

  React.useEffect(() => {
    setFormData(profile) // Reset form data if the profile prop changes or on cancel
  }, [profile, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = async () => {
    const changedData: Partial<DetailedUserProfile> = {};
    (Object.keys(formData) as Array<keyof DetailedUserProfile>).forEach(key => {
      if (formData[key] !== profile[key]) {
        (changedData as any)[key] = formData[key];
      }
    });
    if (Object.keys(changedData).length > 0) {
      await onSave(changedData);
    } else {
      onCancel(); // No changes, just exit edit mode
    }
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
                <p  className="text-sm capitalize">{profile.nationality || "Not provided"}</p>
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

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
    </div>
  )
}