"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { UserTable } from "@/components/directory/user-table"
import { CreateUserDialog } from "@/components/directory/create-user-dialog"
import { getAllUserProfiles, searchUsers, type PaginatedResponse, type UserProfile } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function DirectoryPage() {
  const { hasPermission } = useAuth()
  const [data, setData] = useState<PaginatedResponse<UserProfile> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [inActive,setInactive] = useState(false)
  
  
  // State for the immediate input value
  const [searchTerm, setSearchTerm] = useState("")
  // State for the debounced search value that triggers API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  const canManageUsers = hasPermission("user.manage")

  // Debounce effect for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    // Cleanup function to cancel the timeout if the user types again
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm,inActive]);


  const fetchUsers = useCallback(async () => {
    if (!canManageUsers) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      let result;
      if (debouncedSearchTerm) {
        // If there's a search term, call the search API
        const searchResult = await searchUsers(debouncedSearchTerm,inActive);
        // Adapt the search result to the PaginatedResponse structure for the table
        result = {
            success: true,
            data: searchResult,
            pagination: {
                total_users: searchResult.length,
                current_page: 1,
                per_page: searchResult.length,
                total_pages: 1,
            }
        };
      } else {
        // Otherwise, fetch the paginated list
        result = await getAllUserProfiles(currentPage, limit, "")
      }
      setData(result)
    } catch (error) {
      console.error("Error fetching users:", error)
      setData(null); // Clear data on error
    } finally {
      setIsLoading(false)
    }
  }, [canManageUsers, currentPage, limit, debouncedSearchTerm]);


  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }

  // handleSearch now just updates the immediate search term
  const handleSearch = (term: string,inActive:boolean) => {
    setSearchTerm(term)
    setInactive(inActive)
    setCurrentPage(1) 
  }

  if (!canManageUsers) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Employee Directory</h1>
            <p className="text-muted-foreground">Manage and view all employees in the organization.</p>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access the employee directory. Contact your administrator for access.
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
            <p className="text-muted-foreground">Manage and view all employees in the organization.</p>
          </div>
          <CreateUserDialog onUserCreated={fetchUsers} />
        </div>

        {/* UserTable now receives the search term from the state */}
        {data ? (
          <UserTable
            data={data}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        ) : (
            !isLoading && <p>No users found or an error occurred.</p>
        )}
      </div>
    </MainLayout>
  )
}