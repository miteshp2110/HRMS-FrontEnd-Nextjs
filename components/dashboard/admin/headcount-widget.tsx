"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight } from "lucide-react"
import Link from "next/link"

interface HeadcountWidgetProps {
  count: number
}

export function HeadcountWidget({ count }: HeadcountWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">active employees in the system</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
            <Link href="/directory">View Directory <ArrowRight className="h-4 w-4 ml-2"/></Link>
        </Button>
      </CardContent>
    </Card>
  )
}