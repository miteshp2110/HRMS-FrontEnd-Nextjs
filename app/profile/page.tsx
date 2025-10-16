

// "use client"

// import { useEffect, useState, useCallback } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { MainLayout } from "@/components/main-layout"
// import { MyPersonalDetailsTab } from "@/components/self-service/my-personal-details-tab"
// import { JobEmploymentTab } from "@/components/profile/job-employment-tab"
// import { MyBankDetailsPage } from "@/components/self-service/my-bank-details-page"
// import { MyDocumentsPage } from "@/components/self-service/my-documents-page"

// import { MyLeavesPage } from "@/components/self-service/my-leaves-page"

// import { MySkillsTab } from "@/components/profile/my-skills-tab"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   getCurrentUserProfile,
//   updateSelfProfile,
//   type DetailedUserProfile,
// } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { SelfProfileHeader } from "@/components/profile/self-profile"

// export default function MyProfilePage() {
//   const { user } = useAuth()
//   const { toast } = useToast()
  
//   const [profile, setProfile] = useState<DetailedUserProfile | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState("personal")
//   const [isEditing, setIsEditing] = useState(false)

//   const fetchProfileData = useCallback(async () => {
//     if (!user) {
//         setIsLoading(false);
//         return;
//     }
//     setIsLoading(true);
//     try {
//       const profileData = await getCurrentUserProfile();
//       setProfile(profileData);
//     } catch (error) {
//       console.error("Error fetching profile data:", error);
//       toast({ title: "Error", description: "Could not load your profile.", variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user, toast]);

//   useEffect(() => {
//     fetchProfileData();
//   }, [fetchProfileData]);

//   const handleToggleEdit = () => setIsEditing(prev => !prev);

//   const handleSaveChanges = async (updatedData: Partial<DetailedUserProfile> | FormData) => {
//     if (!user) return;
//     try {
//         await updateSelfProfile(updatedData);
//         toast({ title: "Success", description: "Your profile has been updated." });
//         setIsEditing(false);
//         await fetchProfileData();
//     } catch(error: any) {
//         toast({ title: "Update Failed", description: error.message || "Could not save changes.", variant: "destructive"});
//     }
//   }

//   if (isLoading) {
//     return (
//       <MainLayout>
//         <div className="flex items-center justify-center h-full">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//         </div>
//       </MainLayout>
//     )
//   }

//   if (!profile || !user) {
//     return (
//         <MainLayout>
//             <p className="p-6">Could not load your profile. Please try logging in again.</p>
//         </MainLayout>
//     )
//   }

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <SelfProfileHeader profile={profile} isEditing={isEditing} onToggleEdit={handleToggleEdit} />

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
//             <TabsTrigger value="personal">Personal</TabsTrigger>
//             <TabsTrigger value="employment">Employment</TabsTrigger>
            
//             <TabsTrigger value="leaves">Leaves</TabsTrigger>
            
//             <TabsTrigger value="skills">Skills</TabsTrigger>
//             <TabsTrigger value="documents">Documents</TabsTrigger>
//             <TabsTrigger value="bank">Bank Details</TabsTrigger>
//           </TabsList>

//           <TabsContent value="personal">
//             <MyPersonalDetailsTab 
//                 profile={profile} 
//                 isEditing={isEditing}
//                 onSave={handleSaveChanges}
//                 onCancel={handleToggleEdit}
//               />
//           </TabsContent>
//           <TabsContent value="employment">
//             <JobEmploymentTab 
//                 isSelfProfile={true}
//                 profile={profile} 
//                 isEditing={false}
//                 onSave={async () => {}}
//                 onCancel={() => {}}
//               />
//           </TabsContent>
          
//           <TabsContent value="leaves"><MyLeavesPage /></TabsContent>
          
//           <TabsContent value="skills"><MySkillsTab /></TabsContent>
//           <TabsContent value="documents"><MyDocumentsPage /></TabsContent>
//           <TabsContent value="bank"><MyBankDetailsPage /></TabsContent>
//         </Tabs>
//       </div>
//     </MainLayout>
//   )
// }

"use client"

import { useEffect, useState, useCallback, useTransition } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { MyPersonalDetailsTab } from "@/components/self-service/my-personal-details-tab"
import { JobEmploymentTab } from "@/components/profile/job-employment-tab"
import { MyBankDetailsPage } from "@/components/self-service/my-bank-details-page"
import { MyDocumentsPage } from "@/components/self-service/my-documents-page"
import { MyLeavesPage } from "@/components/self-service/my-leaves-page"
import { MySkillsTab } from "@/components/profile/my-skills-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getCurrentUserProfile,
  updateSelfProfile,
  type DetailedUserProfile,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { SelfProfileHeader } from "@/components/profile/self-profile"

// Skeleton component for profile header
function ProfileHeaderSkeleton() {
  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

// Skeleton component for tabs content
function TabContentSkeleton() {
  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

// Skeleton for tab triggers
function TabsListSkeleton() {
  return (
    <div className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

export default function MyProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [profile, setProfile] = useState<DetailedUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isSaving, setIsSaving] = useState(false)

  const fetchProfileData = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    try {
      const profileData = await getCurrentUserProfile()
      setProfile(profileData)
    } catch (error) {
      console.error("Error fetching profile data:", error)
      toast({ 
        title: "Error", 
        description: "Could not load your profile.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    fetchProfileData()
  }, [fetchProfileData])

  const handleToggleEdit = () => {
    startTransition(() => {
      setIsEditing(prev => !prev)
    })
  }

  const handleSaveChanges = async (
    updatedData: Partial<DetailedUserProfile> | FormData
  ) => {
    if (!user) return
    
    setIsSaving(true)
    try {
      await updateSelfProfile(updatedData)
      toast({ 
        title: "Success", 
        description: "Your profile has been updated." 
      })
      setIsEditing(false)
      await fetchProfileData()
    } catch (error: any) {
      toast({ 
        title: "Update Failed", 
        description: error.message || "Could not save changes.", 
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTabChange = (value: string) => {
    startTransition(() => {
      setActiveTab(value)
    })
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <ProfileHeaderSkeleton />
          <TabsListSkeleton />
          <TabContentSkeleton />
        </div>
      </MainLayout>
    )
  }

  if (!profile || !user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-muted-foreground">
            Could not load your profile. Please try logging in again.
          </p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <SelfProfileHeader 
          profile={profile} 
          isEditing={isEditing} 
          onToggleEdit={handleToggleEdit} 
        />

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="personal" disabled={isPending}>
              Personal
            </TabsTrigger>
            <TabsTrigger value="employment" disabled={isPending}>
              Employment
            </TabsTrigger>
            <TabsTrigger value="leaves" disabled={isPending}>
              Leaves
            </TabsTrigger>
            <TabsTrigger value="skills" disabled={isPending}>
              Skills
            </TabsTrigger>
            <TabsTrigger value="documents" disabled={isPending}>
              Documents
            </TabsTrigger>
            <TabsTrigger value="bank" disabled={isPending}>
              Bank Details
            </TabsTrigger>
          </TabsList>

          {isPending ? (
            <TabContentSkeleton />
          ) : (
            <>
              <TabsContent value="personal">
                <MyPersonalDetailsTab 
                  profile={profile} 
                  isEditing={isEditing}
                  onSave={handleSaveChanges}
                  onCancel={handleToggleEdit}
                  isSaving={isSaving}
                />
              </TabsContent>

              <TabsContent value="employment">
                <JobEmploymentTab 
                  isSelfProfile={true}
                  profile={profile} 
                  isEditing={false}
                  onSave={async () => {}}
                  onCancel={() => {}}
                />
              </TabsContent>
              
              <TabsContent value="leaves">
                <MyLeavesPage />
              </TabsContent>
              
              <TabsContent value="skills">
                <MySkillsTab />
              </TabsContent>

              <TabsContent value="documents">
                <MyDocumentsPage />
              </TabsContent>

              <TabsContent value="bank">
                <MyBankDetailsPage />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </MainLayout>
  )
}
