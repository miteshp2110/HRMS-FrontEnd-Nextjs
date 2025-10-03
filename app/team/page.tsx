import { MainLayout } from "@/components/main-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TeamPerformancePage from "./performance/page"
import ManagerCaseApprovalPage from "../management/cases/page"

export default function MyTeam() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Manage Your Team</h1>
        
        <Tabs defaultValue="performance" className="w-full">
          <TabsList>
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
            <TabsTrigger value="cases">Team Cases</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
           <TeamPerformancePage/>
          </TabsContent>

          <TabsContent value="cases">
            <ManagerCaseApprovalPage/>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
