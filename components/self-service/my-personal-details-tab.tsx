
// "use client"

// import * as React from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// import { Camera } from "lucide-react"
// import type { DetailedUserProfile } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { cn } from "@/lib/utils"

// interface MyPersonalDetailsTabProps {
//   profile: DetailedUserProfile
//   isEditing: boolean
//   onSave: (updatedData: Partial<DetailedUserProfile> | FormData) => Promise<void>
//   onCancel: () => void
// }

// export function MyPersonalDetailsTab({ profile, isEditing, onSave, onCancel }: MyPersonalDetailsTabProps) {
//   const [formData, setFormData] = React.useState(profile)
//   const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
//   const [previewImage, setPreviewImage] = React.useState<string | null>(profile.profile_url || null);
//   const { toast } = useToast();

//   React.useEffect(() => {
//     setFormData(profile);
//     setPreviewImage(profile.profile_url || null);
//     setSelectedFile(null);
//   }, [profile, isEditing])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) { // 2MB validation
//         toast({ title: "Error", description: "Image size cannot exceed 2MB.", variant: "destructive" });
//         e.target.value = "";
//         return;
//       }
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = async () => {
//     const changedData: Partial<DetailedUserProfile> = {};
//     const editableFields: (keyof DetailedUserProfile)[] = [ 'phone', 'emergency_contact_name', 'emergency_contact_relation', 'emergency_contact_number' ];
    
//     editableFields.forEach(key => {
//       const formValue = formData[key] || '';
//       const profileValue = profile[key] || '';
//       if (formValue !== profileValue) {
//         (changedData as any)[key] = formValue;
//       }
//     });

//     if (selectedFile) {
//         const formDataPayload = new FormData();
//         Object.entries(changedData).forEach(([key, value]) => {
//             formDataPayload.append(key, value as string);
//         });
//         formDataPayload.append("profileImage", selectedFile);
//         await onSave(formDataPayload);
//     } else if (Object.keys(changedData).length > 0) {
//         await onSave(changedData);
//     } else {
//       onCancel();
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Personal Information</CardTitle>
//           <CardDescription>Your basic personal details and contact information.</CardDescription>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-1 flex flex-col items-center pt-4">
//              <Label htmlFor="profile-image-upload" className={cn("relative", isEditing && "cursor-pointer group")}>
//                 <Avatar className="h-32 w-32">
//                     <AvatarImage className="object-cover" src={previewImage || undefined}/>
//                     <AvatarFallback className="text-4xl">{profile.first_name[0]}{profile.last_name[0]}</AvatarFallback>
//                 </Avatar>
//                 {isEditing && (
//                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-100 transition-opacity">
//                        <Camera className="h-8 w-8 text-white"/>
//                     </div>
//                 )}
//              </Label>
//              {isEditing && <Input id="profile-image-upload" name="profile_image" type="file" accept="image/*" className="hidden" onChange={handleImageChange}/>}
//           </div>
//           <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-l md:pl-6">
//             <div className="space-y-1"><Label>First Name</Label><p className="text-sm pt-2 text-muted-foreground">{profile.first_name}</p></div>
//             <div className="space-y-1"><Label>Last Name</Label><p className="text-sm pt-2 text-muted-foreground">{profile.last_name}</p></div>
//             <div className="space-y-1"><Label>Email</Label><p className="text-sm pt-2 text-muted-foreground">{profile.email}</p></div>
//             <div className="space-y-1">
//               <Label htmlFor="phone">Phone</Label>
//               {isEditing ? <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} /> : <p className="text-sm pt-2">{profile.phone || "Not provided"}</p>}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Emergency Contact</CardTitle>
//           <CardDescription>In case of an emergency, this is who we'll contact.</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="space-y-1">
//               <Label htmlFor="emergency_contact_name">Contact Name</Label>
//               {isEditing ? <Input id="emergency_contact_name" name="emergency_contact_name" value={formData.emergency_contact_name || ""} onChange={handleChange} /> : <p className="text-sm pt-2">{profile.emergency_contact_name || "Not provided"}</p>}
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="emergency_contact_relation">Relationship</Label>
//               {isEditing ? <Input id="emergency_contact_relation" name="emergency_contact_relation" value={formData.emergency_contact_relation || ""} onChange={handleChange} /> : <p className="text-sm pt-2">{profile.emergency_contact_relation || "Not provided"}</p>}
//             </div>
//             <div className="space-y-1">
//               <Label htmlFor="emergency_contact_number">Contact Number</Label>
//               {isEditing ? <Input id="emergency_contact_number" name="emergency_contact_number" value={formData.emergency_contact_number || ""} onChange={handleChange} /> : <p className="text-sm pt-2">{profile.emergency_contact_number || "Not provided"}</p>}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {isEditing && (
//         <div className="flex justify-end gap-4">
//           <Button variant="outline" onClick={onCancel}>Cancel</Button>
//           <Button onClick={handleSave}>Save Changes</Button>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Camera, Loader2 } from "lucide-react"
import type { DetailedUserProfile } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface MyPersonalDetailsTabProps {
  profile: DetailedUserProfile
  isEditing: boolean
  onSave: (updatedData: Partial<DetailedUserProfile> | FormData) => Promise<void>
  onCancel: () => void
  isSaving?: boolean
  isLoading?: boolean
}

// Skeleton component matching your exact layout
function PersonalDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80 mt-2" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar skeleton */}
          <div className="md:col-span-1 flex flex-col items-center pt-4">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
          
          {/* Form fields skeleton */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-l md:pl-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function MyPersonalDetailsTab({ 
  profile, 
  isEditing, 
  onSave, 
  onCancel,
  isSaving = false,
  isLoading = false 
}: MyPersonalDetailsTabProps) {
  const [formData, setFormData] = React.useState(profile)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewImage, setPreviewImage] = React.useState<string | null>(profile.profile_url || null)
  const [imageLoading, setImageLoading] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    setFormData(profile)
    setPreviewImage(profile.profile_url || null)
    setSelectedFile(null)
  }, [profile, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ 
          title: "Error", 
          description: "Image size cannot exceed 2MB.", 
          variant: "destructive" 
        })
        e.target.value = ""
        return
      }
      
      setImageLoading(true)
      setSelectedFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        setImageLoading(false)
      }
      reader.onerror = () => {
        toast({ 
          title: "Error", 
          description: "Failed to load image preview.", 
          variant: "destructive" 
        })
        setImageLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    const changedData: Partial<DetailedUserProfile> = {}
    const editableFields: (keyof DetailedUserProfile)[] = [
      'phone', 
      'emergency_contact_name', 
      'emergency_contact_relation', 
      'emergency_contact_number'
    ]
    
    editableFields.forEach(key => {
      const formValue = formData[key] || ''
      const profileValue = profile[key] || ''
      if (formValue !== profileValue) {
        (changedData as any)[key] = formValue
      }
    })

    if (selectedFile) {
      const formDataPayload = new FormData()
      Object.entries(changedData).forEach(([key, value]) => {
        formDataPayload.append(key, value as string)
      })
      formDataPayload.append("profileImage", selectedFile)
      await onSave(formDataPayload)
    } else if (Object.keys(changedData).length > 0) {
      await onSave(changedData)
    } else {
      onCancel()
    }
  }

  // Show skeleton while loading
  if (isLoading) {
    return <PersonalDetailsSkeleton />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your basic personal details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center pt-4">
            <Label 
              htmlFor="profile-image-upload" 
              className={cn(
                "relative",
                isEditing && !isSaving && "cursor-pointer group"
              )}
            >
              <Avatar className="h-32 w-32">
                {imageLoading ? (
                  <div className="flex items-center justify-center w-full h-full bg-muted">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <AvatarImage 
                      className="object-cover" 
                      src={previewImage || undefined}
                    />
                    <AvatarFallback className="text-4xl">
                      {profile.first_name[0]}{profile.last_name[0]}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              {isEditing && !isSaving && !imageLoading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white"/>
                </div>
              )}
              {isSaving && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                  <Loader2 className="h-8 w-8 animate-spin text-white"/>
                </div>
              )}
            </Label>
            {isEditing && (
              <Input 
                id="profile-image-upload" 
                name="profile_image" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
                disabled={isSaving || imageLoading}
              />
            )}
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-l md:pl-6">
            <div className="space-y-1">
              <Label>First Name</Label>
              <p className="text-sm pt-2 text-muted-foreground">
                {profile.first_name}
              </p>
            </div>
            <div className="space-y-1">
              <Label>Last Name</Label>
              <p className="text-sm pt-2 text-muted-foreground">
                {profile.last_name}
              </p>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <p className="text-sm pt-2 text-muted-foreground">
                {profile.email}
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone || ""} 
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-sm pt-2">
                  {profile.phone || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>
            In case of an emergency, this is who we'll contact.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label htmlFor="emergency_contact_name">Contact Name</Label>
              {isEditing ? (
                <Input 
                  id="emergency_contact_name" 
                  name="emergency_contact_name" 
                  value={formData.emergency_contact_name || ""} 
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="Enter contact name"
                />
              ) : (
                <p className="text-sm pt-2">
                  {profile.emergency_contact_name || "Not provided"}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="emergency_contact_relation">Relationship</Label>
              {isEditing ? (
                <Input 
                  id="emergency_contact_relation" 
                  name="emergency_contact_relation" 
                  value={formData.emergency_contact_relation || ""} 
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="e.g., Spouse, Parent"
                />
              ) : (
                <p className="text-sm pt-2">
                  {profile.emergency_contact_relation || "Not provided"}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="emergency_contact_number">Contact Number</Label>
              {isEditing ? (
                <Input 
                  id="emergency_contact_number" 
                  name="emergency_contact_number" 
                  value={formData.emergency_contact_number || ""} 
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="Enter contact number"
                />
              ) : (
                <p className="text-sm pt-2">
                  {profile.emergency_contact_number || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || imageLoading}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
