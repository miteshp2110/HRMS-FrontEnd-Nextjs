
"use client"

import * as React from "react"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllUserProfiles, type UserProfile } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Users, ArrowRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export default function SalaryStructureListPage() {
  const { toast } = useToast()
  const [allUsers, setAllUsers] = React.useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = React.useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")

  React.useEffect(() => {
    setIsLoading(true)
    getAllUserProfiles(1, 1000)
      .then((response) => {
        setAllUsers(response.data)
        setFilteredUsers(response.data)
      })
      .catch(() =>
        toast({
          title: "Error",
          description: "Could not load employees.",
          variant: "destructive",
        })
      )
      .finally(() => setIsLoading(false))
  }, [toast])

  React.useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(allUsers)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredUsers(
        allUsers.filter(
          (u) =>
            `${u.first_name} ${u.last_name}`.toLowerCase().includes(term) ||
            u.full_employee_id.includes(term)
        )
      )
    }
  }, [searchTerm, allUsers])

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-48" /> : "Salary Structures"}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-64 mt-1" />
              ) : (
                "Select an employee to view or manage their salary structure."
              )}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <CardTitle>All Employees</CardTitle>
              <CardDescription className="mt-1">
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  "Search by name or ID to filter the list."
                )}
              </CardDescription>
            </div>
            <Input
              placeholder="Search name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
              className="max-w-sm"
            />
          </CardHeader>

          <CardContent>
            <ScrollArea className="h-[60vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-20 inline-block" />
                          </TableCell>
                        </TableRow>
                      ))
                    : filteredUsers.map((user) => {
                        if(user.is_active){
                            return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>{user.full_employee_id}</TableCell>
                          <TableCell className="text-right">
                            <Button asChild>
                              <Link href={`/payroll/structure/${user.id}`}>
                                Manage Structure{" "}
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                        }
                    })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
