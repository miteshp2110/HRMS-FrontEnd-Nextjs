

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import type { UserProfile, PaginatedResponse } from "@/lib/api"

interface UserTableProps {
  data: PaginatedResponse<UserProfile>
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onSearch: (search: string, inActivity: boolean) => void
  isLoading: boolean
  searchTerm?: string
  showInactive?: boolean
}

export function UserTable({ 
  data, 
  onPageChange, 
  onLimitChange, 
  onSearch, 
  isLoading,
  searchTerm: initialSearchTerm = "",
  showInactive: initialShowInactive = false
}: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [inActive, setInactive] = useState(initialShowInactive)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Sync with parent props
  useEffect(() => {
    setSearchTerm(initialSearchTerm)
  }, [initialSearchTerm])

  useEffect(() => {
    setInactive(initialShowInactive)
  }, [initialShowInactive])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value, inActive)
    // ✅ Keep focus in the input - no need for complex state management
  }

  const handleInactiveToggle = (checked: boolean) => {
    console.log('🔄 Inactive checkbox toggled:', checked)
    setInactive(checked)
    onSearch(searchTerm, checked)
  }

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    onSearch("", inActive)
    // Focus after state update
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
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
            <div className="flex items-center space-x-2 px-3 py-2 border rounded-md bg-background">
              <input
                id="inactive-users"
                type="checkbox"
                checked={inActive}
                onChange={(e) => handleInactiveToggle(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label 
                htmlFor="inactive-users" 
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
              >
                Show Inactive
              </label>
            </div>

            <form onSubmit={handleSearchFormSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-full sm:w-64"
                autoComplete="off"
              />
            </form>

            <Select 
              value={pagination.per_page.toString()} 
              onValueChange={(value) => onLimitChange(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mt-2">
          Showing <span className="font-medium">{inActive ? 'inactive' : 'active'}</span> users
          {searchTerm && (
            <span> matching <span className="font-medium">"{searchTerm}"</span></span>
          )}
          {' • '}
          <span className="font-medium">{pagination.total_users}</span> total found
        </div>
      </CardHeader>

      <CardContent>
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
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="rounded-full bg-muted p-3">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-base">No employees found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {searchTerm ? (
                            <>
                              No {inActive ? 'inactive' : 'active'} employees matching{' '}
                              <span className="font-medium">"{searchTerm}"</span>
                            </>
                          ) : (
                            <>No {inActive ? 'inactive' : 'active'} employees in the system</>
                          )}
                        </p>
                        {searchTerm && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={handleClearSearch}
                            className="mt-2"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            className="object-cover"
                            src={user.profile_url || undefined}
                            alt={`${user.first_name} ${user.last_name}`}
                          />
                          <AvatarFallback>
                            {getInitials(user.first_name, user.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.full_employee_id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="truncate">{user.email}</p>
                        {user.phone && (
                          <p className="text-sm text-muted-foreground truncate">
                            {user.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.job_title || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role_name}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/directory/${user.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.total_pages > 0 && data.data.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">
                {(pagination.current_page - 1) * pagination.per_page + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.current_page * pagination.per_page,
                  pagination.total_users
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.total_users}</span> employees
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
                  let pageNum: number

                  if (pagination.total_pages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.current_page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.current_page >= pagination.total_pages - 2) {
                    pageNum = pagination.total_pages - 4 + i
                  } else {
                    pageNum = pagination.current_page - 2 + i
                  }

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

                {pagination.total_pages > 5 &&
                  pagination.current_page < pagination.total_pages - 2 && (
                    <>
                      <span className="px-2 text-muted-foreground">...</span>
                      <Button
                        variant="outline"
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
        )}
      </CardContent>
    </Card>
  )
}
