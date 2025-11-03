

"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { UserTable } from "@/components/directory/user-table"
import { CreateUserDialog } from "@/components/directory/create-user-dialog"
import { getAllUserProfiles, searchUsers, type PaginatedResponse, type UserProfile } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BulkUploadDialog } from "@/components/directory/bulk-upload-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function DirectoryPage() {
  const { hasPermission } = useAuth()
  const [data, setData] = useState<PaginatedResponse<UserProfile> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [showInactive, setShowInactive] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  const canManageUsers = hasPermission("user.manage")

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  const fetchUsers = useCallback(async () => {
    if (!canManageUsers) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      let result

      if (debouncedSearchTerm.trim()) {
        console.log('🔍 Calling searchUsers:', { term: debouncedSearchTerm, showInactive })
        const searchResult = await searchUsers(debouncedSearchTerm, showInactive)
        
        result = {
          success: true,
          data: searchResult,
          pagination: {
            total_users: searchResult.length,
            current_page: 1,
            per_page: searchResult.length,
            total_pages: 1,
          }
        }
      } else {
        const status = showInactive ? "inactive" : "active"
        console.log('🔍 Calling getAllUserProfiles:', { page: currentPage, limit, status })
        
        result = await getAllUserProfiles(currentPage, limit, "", status)
      }

      console.log('✅ Fetched data:', { 
        totalUsers: result.pagination.total_users, 
        dataLength: result.data.length 
      })
      setData(result)
    } catch (error: any) {
      console.error("❌ Error fetching users:", error)
      setError(error.message || "Failed to fetch users. Please try again.")
      // ✅ Set empty data instead of null to keep UI visible
      setData({
        success: false,
        data: [],
        pagination: {
          total_users: 0,
          current_page: 1,
          per_page: limit,
          total_pages: 0,
        }
      })
    } finally {
      setIsLoading(false)
    }
  }, [canManageUsers, currentPage, limit, debouncedSearchTerm, showInactive])

  useEffect(() => {
    console.log('🔄 fetchUsers triggered by dependency change')
    fetchUsers()
  }, [fetchUsers])

  const handlePageChange = (page: number) => {
    console.log('📄 Page changed to:', page)
    setCurrentPage(page)
  }

  const handleLimitChange = (newLimit: number) => {
    console.log('📊 Limit changed to:', newLimit)
    setLimit(newLimit)
    setCurrentPage(1)
  }

  const handleSearch = (term: string, inactive: boolean) => {
    console.log('🔍 handleSearch called:', { term, inactive })
    setSearchTerm(term)
    setShowInactive(inactive)
    setCurrentPage(1)
  }

  const handleUserCreated = () => {
    fetchUsers()
  }

  const handleUploadSuccess = () => {
    fetchUsers()
  }

  const DirectorySkeleton = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="rounded-md border">
        <div className="border-b bg-muted/50 p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border-b p-4 last:border-b-0">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-4" />
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )

  if (!canManageUsers) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Employee Directory</h1>
            <p className="text-muted-foreground">
              Manage and view all employees in the organization.
            </p>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access the employee directory. 
              Contact your administrator for access.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Employee Directory</h1>
            <p className="text-muted-foreground">
              Manage and view all employees in the organization.
            </p>
          </div>
          <div className="flex gap-2">
            <CreateUserDialog onUserCreated={handleUserCreated} />
            <Button 
              onClick={() => setIsUploadDialogOpen(true)} 
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ✅ ALWAYS render UserTable or skeleton - never conditionally hide */}
        {isLoading ? (
          <DirectorySkeleton />
        ) : data ? (
          <UserTable
            data={data}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearch}
            isLoading={isLoading}
            searchTerm={searchTerm}
            showInactive={showInactive}
          />
        ) : null}
      </div>

      <BulkUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
        onUploadSuccess={handleUploadSuccess} 
      />
    </MainLayout>
  )
}
