"use client"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RefreshCw, Wrench } from "lucide-react"

export default function ShiftRotationPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <RefreshCw className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Shift Rotation</h1>
            <p className="text-muted-foreground">Manage and schedule employee shift rotations.</p>
          </div>
        </div>
        <Card className="text-center py-24">
          <CardHeader>
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Coming Soon!</CardTitle>
            <CardDescription>
                A powerful shift rotation and scheduling tool is on its way.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </MainLayout>
  )
}
