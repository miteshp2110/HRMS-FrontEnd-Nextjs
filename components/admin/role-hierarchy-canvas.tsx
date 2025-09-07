"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type Role, type Permission } from "@/lib/api"
import { ShieldCheck, ChevronRight } from "lucide-react"

interface RoleHierarchyCanvasProps {
  roles: Role[]
}

export function RoleHierarchyCanvas({ roles }: RoleHierarchyCanvasProps) {
  // 1. Group roles by their level
  const rolesByLevel = React.useMemo(() => {
    const grouped = new Map<number, Role[]>()
    roles.forEach(role => {
      const level = role.role_level
      if (!grouped.has(level)) {
        grouped.set(level, [])
      }
      grouped.get(level)?.push(role)
    })
    // Sort levels numerically and return as an array of [level, roles]
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0])
  }, [roles])

  if (roles.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Role Hierarchy</CardTitle>
                <CardDescription>A visual representation of the company's role structure.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No roles available to display.</p>
            </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Role Hierarchy</CardTitle>
        <CardDescription>Hover over a role to see its permissions.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 overflow-x-auto">
        <div className="flex items-start space-x-12 min-w-max">
            {rolesByLevel.map(([level, levelRoles], levelIndex) => (
                <div key={level} className="flex items-center">
                    {/* Render connector from previous level */}
                    {levelIndex > 0 && (
                        <div className="flex-shrink-0 mr-12">
                           <ChevronRight className="h-8 w-8 text-border"/>
                        </div>
                    )}
                    {/* Render the column for the current level */}
                    <div className="flex flex-col items-center space-y-8">
                        <Badge variant="outline">Level {level}</Badge>
                        {levelRoles.map(role => (
                            <Popover key={role.id}>
                                <PopoverTrigger asChild>
                                    <div className="group flex flex-col items-center cursor-pointer">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 group-hover:bg-primary/20 transition-colors">
                                            <ShieldCheck className="h-8 w-8 text-primary" />
                                        </div>
                                        <h4 className="mt-2 font-semibold text-center w-32 truncate">{role.name}</h4>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Permissions</h4>
                                        <p className="text-sm text-muted-foreground">
                                            This role has the following permissions:
                                        </p>
                                        <div className="max-h-48 overflow-y-auto pr-2">
                                            {role.permissions && role.permissions.length > 0 ? (
                                                <ul className="list-disc list-inside space-y-1 mt-2">
                                                {role.permissions.map((p: Permission) => (
                                                    <li key={p.id} className="text-sm">{p.name}</li>
                                                ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic mt-2">No permissions assigned.</p>
                                            )}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}