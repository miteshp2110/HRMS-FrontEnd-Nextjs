
// "use client"

// import { useAuth } from "@/lib/auth-context"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { LogOut, User, Sun, Moon } from "lucide-react"
// import Link from "next/link"
// import { useTheme } from "next-themes"
// import { useEffect, useState } from "react"

// export function Navbar() {
//   const { user, logout } = useAuth()
//   const { theme, setTheme } = useTheme()
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   const getInitials = (firstName?: string, lastName?: string) => {
//     if (firstName && lastName) {
//       return `${firstName[0]}${lastName[0]}`.toUpperCase()
//     }
//     if (user?.email) {
//       return user.email.substring(0, 2).toUpperCase()
//     }
//     return "U"
//   }

//   const getDisplayName = () => {
//     if (user?.first_name && user?.last_name) {
//       return `${user.first_name} ${user.last_name}`
//     }
//     return user?.email || "User"
//   }

//   return (
//     <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="flex h-full items-center justify-between px-6">
//         <div className="flex items-center gap-4">
//           <Link href="/" className="text-lg font-semibold">
//             HR Management System
//           </Link>
//         </div>

//         <div className="flex items-center gap-4">
//           {mounted && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//               className="h-9 w-9 px-0"
//             >
//               {theme === "dark" ? (
//                 <Sun className="h-4 w-4" />
//               ) : (
//                 <Moon className="h-4 w-4" />
//               )}
//               <span className="sr-only">Toggle theme</span>
//             </Button>
//           )}

//           {/* Profile and Logout Button */}
//           <div className="relative group flex items-center">
//             <Link href="/profile">
//               <Avatar className="h-10 w-10 cursor-pointer">
//                 <AvatarImage
//                   className="object-cover"
//                   src={user?.profile_url}
//                   alt={getDisplayName()}
//                 />
//                 <AvatarFallback className="bg-primary text-primary-foreground">
//                   {getInitials(user?.first_name, user?.last_name)}
//                 </AvatarFallback>
//               </Avatar>
//             </Link>

//             <Button
//               onClick={logout}
//               variant="destructive"
//               size="icon"
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 group-hover:opacity-90 transition-opacity duration-200"
//             >
//               <LogOut className="h-5 w-5" />
//               <span className="sr-only">Logout</span>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Sun, Moon, Search } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { CommandSearch } from "@/components/command-search"

export function Navbar() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut - Changed to Ctrl+Q
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user?.email || "User"
  }

  return (
    <>
      <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold">
              HR Management System
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Button */}
            <Button
              variant="outline"
              className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search...</span>
              <span className="inline-flex lg:hidden">Search</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">Ctrl</span>Q
              </kbd>
            </Button>

            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 px-0"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Profile and Logout Button */}
            <div className="relative group flex items-center">
              <Link href="/profile">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage
                    className="object-cover"
                    src={user?.profile_url}
                    alt={getDisplayName()}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user?.first_name, user?.last_name)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <Button
                onClick={logout}
                variant="destructive"
                size="icon"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 group-hover:opacity-90 transition-opacity duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <CommandSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
