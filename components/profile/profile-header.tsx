import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Calendar, User, Edit, X } from "lucide-react"
import type { DetailedUserProfile } from "@/lib/api"

interface ProfileHeaderProps {
  profile: DetailedUserProfile
  isEditing: boolean
  onToggleEdit: () => void
}

export function ProfileHeader({ profile, isEditing, onToggleEdit }: ProfileHeaderProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={
          isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
        }
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-32 w-32">
              <AvatarImage
              className="object-cover"
                src={profile.profile_url || undefined}
                alt={`${profile.first_name} ${profile.last_name}`}
              />
              <AvatarFallback className="text-2xl">{getInitials(profile.first_name, profile.last_name)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-balance">
                        {profile.first_name} {profile.last_name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        <p className="text-lg text-muted-foreground">{profile.job_title || "No job title"}</p>
                        <Badge variant="outline">{profile.role_name}</Badge>
                        {getStatusBadge(profile.is_active)}
                    </div>
                </div>
                <Button variant={isEditing ? "destructive" : "outline"} onClick={onToggleEdit}>
                    {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {new Date(profile.joining_date).toLocaleDateString()}</span>
              </div>
              {profile.reports_to_name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Reports to {profile.reports_to_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}