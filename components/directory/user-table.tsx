"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Eye, ChevronLeft, ChevronRight, Check } from "lucide-react"
import type { UserProfile, PaginatedResponse } from "@/lib/api"

interface UserTableProps {
  data: PaginatedResponse<UserProfile>
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onSearch: (search: string,inActivity:boolean) => void
  isLoading: boolean
}

export function UserTable({ data, onPageChange, onLimitChange, onSearch, isLoading }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [inActive,setInactive] = useState(false)


  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch(value,inActive)
  }

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

  const { pagination } = data
  const canGoPrevious = pagination.current_page > 1
  const canGoNext = pagination.current_page < pagination.total_pages

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Employee Directory</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <input
                id="inactive-users"
                type="checkbox"
                checked={inActive} 
                onChange={(e) => setInactive(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="inactive-users" className="text-sm text-gray-700">
                Inactive Users
              </label>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={pagination.per_page.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading employees...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No employees found.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data.map((user) =>{
                      if(inActive){
                        return (user.is_active==false?<TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                className="object-cover"
                                src={user.profile_url || undefined}
                                alt={`${user.first_name} ${user.last_name}`}
                              />
                              <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.first_name} {user.last_name}
                              </p>
                              {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.job_title || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role_name}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/directory/${user.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>:<></>)
                      }
                      else{
                        return(user.is_active==true?<TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                className="object-cover"
                                src={user.profile_url || undefined}
                                alt={`${user.first_name} ${user.last_name}`}
                              />
                              <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.first_name} {user.last_name}
                              </p>
                              {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.job_title || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role_name}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/directory/${user.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>:<></>)
                      }
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total_users)} of{" "}
                {pagination.total_users} employees
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.current_page - 1)}
                  disabled={!canGoPrevious}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  {pagination.total_pages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant={pagination.total_pages === pagination.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pagination.total_pages)}
                        className="w-8 h-8 p-0"
                      >
                        {pagination.total_pages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.current_page + 1)}
                  disabled={!canGoNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}