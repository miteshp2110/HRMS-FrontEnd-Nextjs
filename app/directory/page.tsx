// "use client"

// import { useEffect, useState, useCallback } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { MainLayout } from "@/components/main-layout"
// import { UserTable } from "@/components/directory/user-table"
// import { CreateUserDialog } from "@/components/directory/create-user-dialog"
// import { getAllUserProfiles, searchUsers, type PaginatedResponse, type UserProfile } from "@/lib/api"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle, Upload } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { BulkUploadDialog } from "@/components/directory/bulk-upload-dialog"

// export default function DirectoryPage() {
//   const { hasPermission } = useAuth()
//   const [data, setData] = useState<PaginatedResponse<UserProfile> | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [limit, setLimit] = useState(20)
//   const [inActive,setInactive] = useState(false)
//   const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  
//   // State for the immediate input value
//   const [searchTerm, setSearchTerm] = useState("")
//   // State for the debounced search value that triggers API calls
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

//   const canManageUsers = hasPermission("user.manage")

//   // Debounce effect for search input
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 300); // 300ms delay

//     // Cleanup function to cancel the timeout if the user types again
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchTerm,inActive]);


//   const fetchUsers = useCallback(async () => {
//     if (!canManageUsers) {
//       setIsLoading(false)
//       return
//     }

//     setIsLoading(true)
//     try {
//       let result;
//       if (debouncedSearchTerm) {
//         // If there's a search term, call the search API
//         const searchResult = await searchUsers(debouncedSearchTerm,inActive);
//         // Adapt the search result to the PaginatedResponse structure for the table
//         result = {
//             success: true,
//             data: searchResult,
//             pagination: {
//                 total_users: searchResult.length,
//                 current_page: 1,
//                 per_page: searchResult.length,
//                 total_pages: 1,
//             }
//         };
//       } else {
//         // Otherwise, fetch the paginated list
//         result = await getAllUserProfiles(currentPage, limit, "")
//       }
//       setData(result)
//     } catch (error) {
//       console.error("Error fetching users:", error)
//       setData(null); // Clear data on error
//     } finally {
//       setIsLoading(false)
//     }
//   }, [canManageUsers, currentPage, limit, debouncedSearchTerm]);


//   useEffect(() => {
//     fetchUsers()
//   }, [fetchUsers])

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page)
//   }

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit)
//     setCurrentPage(1)
//   }

//   // handleSearch now just updates the immediate search term
//   const handleSearch = (term: string,inActive:boolean) => {
//     setSearchTerm(term)
//     setInactive(inActive)
//     setCurrentPage(1) 
//   }

//   if (!canManageUsers) {
//     return (
//       <MainLayout>
//         <div className="space-y-6">
//           <div>
//             <h1 className="text-3xl font-bold">Employee Directory</h1>
//             <p className="text-muted-foreground">Manage and view all employees in the organization.</p>
//           </div>

//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Access Denied</AlertTitle>
//             <AlertDescription>
//               You don't have permission to access the employee directory. Contact your administrator for access.
//             </AlertDescription>
//           </Alert>
//         </div>
//       </MainLayout>
//     )
//   }

//   return (
//     <MainLayout>
//       <div className="space-y-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold">Employee Directory</h1>
//             <p className="text-muted-foreground">Manage and view all employees in the organization.</p>
//           </div>
//           <div>
//             <CreateUserDialog onUserCreated={fetchUsers} />
//             <Button onClick={()=>{setIsUploadDialogOpen(true)}} className="ml-5.5 mr-2"><Upload/>Upload</Button>
//           </div>
            
          
//         </div>

//         {/* UserTable now receives the search term from the state */}
//         {data ? (
//           <UserTable
//             data={data}
//             onPageChange={handlePageChange}
//             onLimitChange={handleLimitChange}
//             onSearch={handleSearch}
//             isLoading={isLoading}
//           />
//         ) : (
//             !isLoading && <p>No users found or an error occurred.</p>
//         )}
//       </div>
//       <BulkUploadDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} onUploadSuccess={fetchUsers} />
//     </MainLayout>
//   )
// }





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
  const [inActive,setInactive] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
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

  // Skeleton loading component
  const DirectorySkeleton = () => (
    <div className="space-y-6">
      {/* Header skeleton */}
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

      {/* Search and filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        {/* Table header */}
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
        
        {/* Table rows */}
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

      {/* Pagination skeleton */}
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
      {isLoading ? (
        <DirectorySkeleton />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Employee Directory</h1>
              <p className="text-muted-foreground">Manage and view all employees in the organization.</p>
            </div>
            <div>
              <CreateUserDialog onUserCreated={fetchUsers} />
              <Button onClick={()=>{setIsUploadDialogOpen(true)}} className="ml-5.5 mr-2"><Upload/>Upload</Button>
            </div>
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
      )}
      <BulkUploadDialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} onUploadSuccess={fetchUsers} />
    </MainLayout>
  )
}
