"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Award } from "lucide-react"
import { API_CONFIG } from "@/lib/config"

interface UserSkill {
  id: number
  skill_name: string
  proficiency_level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  years_of_experience: number
  certification_details?: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

interface Skill {
  id: number
  name: string
  category: string
}

export default function MySkillsPage() {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([])
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState("")
  const [proficiencyLevel, setProficiencyLevel] = useState("")
  const [yearsOfExperience, setYearsOfExperience] = useState("")
  const [certificationDetails, setCertificationDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    fetchUserSkills()
    fetchAvailableSkills()
  }, [])

  const fetchUserSkills = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/skills/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUserSkills(data)
      }
    } catch (error) {
      console.error("Error fetching user skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableSkills = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAvailableSkills(data)
      }
    } catch (error) {
      console.error("Error fetching available skills:", error)
    }
  }

  const handleAddSkill = async () => {
    if (!selectedSkill || !proficiencyLevel || !yearsOfExperience) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/skills/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill_id: Number.parseInt(selectedSkill),
          proficiency_level: proficiencyLevel,
          years_of_experience: Number.parseInt(yearsOfExperience),
          certification_details: certificationDetails || undefined,
        }),
      })

      if (response.ok) {
        setIsAddOpen(false)
        setSelectedSkill("")
        setProficiencyLevel("")
        setYearsOfExperience("")
        setCertificationDetails("")
        fetchUserSkills()
      }
    } catch (error) {
      console.error("Error adding skill:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default">Approved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getProficiencyBadge = (level: string) => {
    const colors = {
      Beginner: "bg-blue-100 text-blue-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-green-100 text-green-800",
      Expert: "bg-purple-100 text-purple-800",
    }
    return <Badge className={colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{level}</Badge>
  }

  const filteredSkills = userSkills.filter((skill) => skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Skills</h1>
          <p className="text-muted-foreground">Manage your professional skills and certifications</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>Add a new skill to your professional profile</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="skill">Skill</Label>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id.toString()}>
                        {skill.name} ({skill.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="proficiency">Proficiency Level</Label>
                <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="years">Years of Experience</Label>
                <Input
                  id="years"
                  type="number"
                  min="0"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="Enter years of experience"
                />
              </div>
              <div>
                <Label htmlFor="certification">Certification Details (Optional)</Label>
                <Textarea
                  id="certification"
                  value={certificationDetails}
                  onChange={(e) => setCertificationDetails(e.target.value)}
                  placeholder="Enter any certification details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddSkill}
                disabled={!selectedSkill || !proficiencyLevel || !yearsOfExperience || isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Skill"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Skills Portfolio</CardTitle>
              <CardDescription>Your professional skills and expertise levels</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Certification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.skill_name}</TableCell>
                  <TableCell>{getProficiencyBadge(skill.proficiency_level)}</TableCell>
                  <TableCell>{skill.years_of_experience} years</TableCell>
                  <TableCell>
                    {skill.certification_details ? (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="text-sm">Yes</span>
                      </div>
                    ) : (
                      "No"
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(skill.status)}</TableCell>
                  <TableCell>{new Date(skill.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
