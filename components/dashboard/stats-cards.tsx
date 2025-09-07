import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, UserX, Calendar, Award, AlertTriangle } from "lucide-react"

interface StatsCardsProps {
  stats: {
    pendingLeaveApprovals: number
    pendingSkillApprovals: number
    expiringDocuments: number
    totalEmployees: number
    presentToday: number
    absentToday: number
    onLeaveToday: number
  }
  showManagerStats: boolean
}

export function StatsCards({ stats, showManagerStats }: StatsCardsProps) {
  const attendanceRate = ((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Always visible cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          <p className="text-xs text-muted-foreground">Active employees</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendanceRate}%</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Present: {stats.presentToday}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Manager/Admin only cards */}
      {showManagerStats && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingLeaveApprovals}</div>
              <p className="text-xs text-muted-foreground">Leave requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skill Approvals</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingSkillApprovals}</div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Documents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.expiringDocuments}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Status</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Absent:</span>
                  <Badge variant="destructive">{stats.absentToday}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">On Leave:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    {stats.onLeaveToday}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
