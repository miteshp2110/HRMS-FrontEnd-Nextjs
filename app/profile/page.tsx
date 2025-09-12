

"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { ProfileHeader } from "@/components/profile/profile-header"
import { MyPersonalDetailsTab } from "@/components/self-service/my-personal-details-tab"
import { JobEmploymentTab } from "@/components/profile/job-employment-tab"
import { MyBankDetailsPage } from "@/components/self-service/my-bank-details-page"
import { MyDocumentsPage } from "@/components/self-service/my-documents-page"
import { MySalaryPage } from "@/components/self-service/my-salary-page"
import { MyLeavesPage } from "@/components/self-service/my-leaves-page"
import { MyLoansPage } from "@/components/self-service/my-loans-page"
import { MySkillsTab } from "@/components/profile/my-skills-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getCurrentUserProfile,
  updateSelfProfile,
  updateUser,
  type DetailedUserProfile,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function MyProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [profile, setProfile] = useState<DetailedUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)

  const fetchProfileData = useCallback(async () => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
      const profileData = await getCurrentUserProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({ title: "Error", description: "Could not load your profile.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleToggleEdit = () => setIsEditing(prev => !prev);

  const handleSaveChanges = async (updatedData: Partial<DetailedUserProfile> | FormData) => {
    if (!user) return;
    try {
        await updateSelfProfile(updatedData);
        toast({ title: "Success", description: "Your profile has been updated." });
        setIsEditing(false);
        await fetchProfileData();
    } catch(error: any) {
        toast({ title: "Update Failed", description: error.message || "Could not save changes.", variant: "destructive"});
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (!profile || !user) {
    return (
        <MainLayout>
            <p className="p-6">Could not load your profile. Please try logging in again.</p>
        </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <ProfileHeader profile={profile} isEditing={isEditing} onToggleEdit={handleToggleEdit} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            {profile.salary_visibility?<TabsTrigger value="salary">Salary</TabsTrigger>:<></>}
            <TabsTrigger value="leaves">Leaves</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <MyPersonalDetailsTab 
                profile={profile} 
                isEditing={isEditing}
                onSave={handleSaveChanges}
                onCancel={handleToggleEdit}
              />
          </TabsContent>
          <TabsContent value="employment">
            <JobEmploymentTab 
                profile={profile} 
                isEditing={false}
                onSave={async () => {}}
                onCancel={() => {}}
              />
          </TabsContent>
          {profile.salary_visibility?(<TabsContent value="salary"><MySalaryPage /></TabsContent>):<></>}
          <TabsContent value="leaves"><MyLeavesPage /></TabsContent>
          <TabsContent value="loans"><MyLoansPage /></TabsContent>
          <TabsContent value="skills"><MySkillsTab /></TabsContent>
          <TabsContent value="documents"><MyDocumentsPage /></TabsContent>
          <TabsContent value="bank"><MyBankDetailsPage /></TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}