"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { DetailedUserProfile } from "@/lib/api"

interface MyPersonalDetailsTabProps {
  profile: DetailedUserProfile
  isEditing: boolean
  onSave: (updatedData: Partial<DetailedUserProfile>) => Promise<void>
  onCancel: () => void
}

export function MyPersonalDetailsTab({ profile, isEditing, onSave, onCancel }: MyPersonalDetailsTabProps) {
  const [formData, setFormData] = React.useState(profile)

  React.useEffect(() => {
    setFormData(profile)
  }, [profile, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    const changedData: Partial<DetailedUserProfile> = {};
    const editableFields: (keyof DetailedUserProfile)[] = [
        'phone', 
        'emergency_contact_name', 
        'emergency_contact_relation', 
        'emergency_contact_number'
    ];
    
    editableFields.forEach(key => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic personal details and contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label>First Name</Label>
              <p className="text-sm pt-2 text-muted-foreground">{profile.first_name}</p>
            </div>
            <div className="space-y-1">
              <Label>Last Name</Label>
              <p className="text-sm pt-2 text-muted-foreground">{profile.last_name}</p>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <p className="text-sm pt-2 text-muted-foreground">{profile.email}</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
              ) : (
                <p className="text-sm pt-2">{profile.phone || "Not provided"}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Date of Birth</Label>
              <p className="text-sm pt-2 text-muted-foreground">{profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <p className="text-sm capitalize pt-2 text-muted-foreground">{profile.gender || "Not provided"}</p>
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
                <p className="text-sm pt-2">{profile.emergency_contact_name || "Not provided"}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="emergency_contact_relation">Relationship</Label>
              {isEditing ? (
                <Input id="emergency_contact_relation" name="emergency_contact_relation" value={formData.emergency_contact_relation || ""} onChange={handleChange} />
              ) : (
                <p className="text-sm pt-2">{profile.emergency_contact_relation || "Not provided"}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="emergency_contact_number">Contact Number</Label>
              {isEditing ? (
                <Input id="emergency_contact_number" name="emergency_contact_number" value={formData.emergency_contact_number || ""} onChange={handleChange} />
              ) : (
                <p className="text-sm pt-2">{profile.emergency_contact_number || "Not provided"}</p>
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