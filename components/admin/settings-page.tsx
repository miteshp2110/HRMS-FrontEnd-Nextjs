
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Plus, Edit } from "lucide-react"
import { RolesPermissionsPage } from "@/components/admin/roles-permissions-page"
import { JobsPage } from "@/components/admin/jobs-page"
import { ShiftsPage } from "@/components/admin/shifts-page"
import { SkillsPage } from "@/components/admin/skills-page"
import { DocumentTypesPage } from "@/components/admin/document-types-page"
import { CompanyCalendarPage } from "@/components/admin/company-calendar-page"
import { LeaveTypesPage } from "@/components/management/leave-types-page"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useToast } from "@/hooks/use-toast"
import React, { useState, useEffect, useMemo } from "react"
import { getNameSeries, createNameSeries, updateNameSeries, type NameSeries } from "@/lib/api"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ExpenseCategoriesPage } from "./expense-categories-page"
import { LoanTypesPage } from "./loan-types-page"
import BenefitsConfiguratorPage from "./benefits-page"
import { useAuth } from "@/lib/auth-context" // ✅ Import useAuth
import CaseCategoriesPage from "@/app/admin/case-categories/page"

const timezones = [
 "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
 "Europe/London", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney"
];

const tableNameMap: { [key: string]: string } = {
 "employee_leave_records": "Leave Records",
 "employee_loans": "Employee Loans",
 "user": "Users"
};

// ✅ Define Tab Configuration with Permissions
const mainTabsConfig = [
    { value: "general", title: "General", permission: "roles.manage" }, // General requires a base admin permission
    { value: "calendar", title: "Calendar", permission: "calender.manage" },
    { value: "leave-types", title: "Leave Types", permission: "leaves.manage" },
    { value: "expenses", title: "Expense Categories", permission: "expenses.manage" },
    { value: "loan-types", title: "Loan Types", permission: "loans.manage" },
    { value: "benefits", title: "Benefits", permission: "benefits.manage" },
    { value: "cases", title: "Case Types", permission: "benefits.manage" },
];

const generalTabsConfig = [
    { value: "timezone", title: "Timezone", permission: "roles.manage" }, // Core setting
    { value: "name-series", title: "Name Series", permission: "roles.manage" }, // Core setting
    { value: "documents", title: "Document Types", permission: "documents.manage" },
    { value: "skills", title: "Skill Libraries", permission: "skills.manage" },
    { value: "jobs", title: "Job Types", permission: "job.manage" },
    { value: "roles", title: "Roles & Permissions", permission: "roles.manage" },
    { value: "shifts", title: "Shifts", permission: "shift.manage" },
];


export function SettingsPage() {
 const { toast } = useToast();
 const { hasPermission } = useAuth(); // ✅ Get permission checker
 const [selectedTimezone, setSelectedTimezone] = React.useState<string | null>(null);
 const [nameSeries, setNameSeries] = useState<NameSeries[]>([]);
 const [isNameSeriesDialogOpen, setIsNameSeriesDialogOpen] = useState(false);
 const [editingNameSeries, setEditingNameSeries] = useState<NameSeries | null>(null);
 const [nameSeriesFormData, setNameSeriesFormData] = useState({
  table_name: '',
  prefix: '',
  padding_length: 5
 });
 
 // ✅ Filter tabs based on user permissions
 const visibleMainTabs = useMemo(() => mainTabsConfig.filter(tab => hasPermission(tab.permission)), [hasPermission]);
 const visibleGeneralTabs = useMemo(() => generalTabsConfig.filter(tab => hasPermission(tab.permission)), [hasPermission]);

 useEffect(() => {
  const savedTimezone = localStorage.getItem("selectedTimezone");
  if (savedTimezone && timezones.includes(savedTimezone)) {
   setSelectedTimezone(savedTimezone);
  }
  fetchNameSeries();
 }, []);

 useEffect(() => {
  if (editingNameSeries) {
   setNameSeriesFormData({
    table_name: editingNameSeries.table_name,
    prefix: editingNameSeries.prefix,
    padding_length: editingNameSeries.padding_length,
   })
  } else {
   setNameSeriesFormData({ table_name: '', prefix: '', padding_length: 5 });
  }
 }, [editingNameSeries])

 const fetchNameSeries = async () => {
  try {
   const data = await getNameSeries();
   setNameSeries(data);
  } catch (error: any) {
   toast({ title: "Error", description: "Could not load name series.", variant: "destructive" });
  }
 }

 const handleTimezoneChange = (tz: string) => {
  setSelectedTimezone(tz);
  localStorage.setItem("selectedTimezone", tz);
  toast({ title: "Success", description: `Timezone updated to ${tz}` });
 }

 const handleSaveNameSeries = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
   if (editingNameSeries) {
    await updateNameSeries(editingNameSeries.id, nameSeriesFormData);
    toast({ title: "Success", description: "Name series updated." });
   } else {
    await createNameSeries(nameSeriesFormData);
    toast({ title: "Success", description: "Name series created." });
   }
   fetchNameSeries();
   setIsNameSeriesDialogOpen(false);
   setEditingNameSeries(null);
  } catch (error: any) {
   toast({ title: "Error", description: `Failed to save: ${error.message}`, variant: "destructive" });
  }
 }

 const availableTables = Object.entries(tableNameMap).filter(([key]) => {
  if (editingNameSeries && editingNameSeries.table_name === key) return true;
  return !nameSeries.some(s => s.table_name === key);
 });

 if (visibleMainTabs.length === 0) {
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                 <Settings className="h-8 w-8" />
                 <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">You do not have permission to view any settings.</p>
                </div>
            </div>
        </div>
    );
 }

 return (
  <div className="space-y-6">
   <div className="flex items-center gap-4">
    <Settings className="h-8 w-8" />
    <div>
     <h1 className="text-3xl font-bold">Settings</h1>
     <p className="text-muted-foreground">
      Manage all company-wide configurations and settings from one place.
     </p>
    </div>
   </div>

   {/* ✅ Dynamically render tabs */}
   <Tabs defaultValue={visibleMainTabs[0]?.value} className="w-full">
    <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${visibleMainTabs.length}, minmax(0, 1fr))` }}>
        {visibleMainTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.title}</TabsTrigger>
        ))}
    </TabsList>

    {/* General Tab with Nested Tabs */}
    {hasPermission("roles.manage") && (
     <TabsContent value="general" className="mt-6">
      <Tabs defaultValue={visibleGeneralTabs[0]?.value}>
       <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${visibleGeneralTabs.length}, minmax(0, 1fr))` }}>
        {visibleGeneralTabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.title}</TabsTrigger>
        ))}
       </TabsList>

       {/* Timezone Settings */}
       {hasPermission("roles.manage") && (
        <TabsContent value="timezone" className="mt-6">
         <Card>
          <CardHeader>
           <CardTitle>Application Timezone</CardTitle>
           <CardDescription>Select the default timezone for the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
           <Select value={selectedTimezone || ""} onValueChange={handleTimezoneChange}>
            <SelectTrigger className="w-[280px]">
             <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
             {timezones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
            </SelectContent>
           </Select>
           <p className="text-sm text-muted-foreground">
            This timezone will be used across the system.
           </p>
          </CardContent>
         </Card>
        </TabsContent>
       )}

       {/* Name Series Settings */}
       {hasPermission("roles.manage") && (
        <TabsContent value="name-series" className="mt-6">
         <Card>
          <CardHeader className="flex flex-row justify-between items-center">
           <div>
            <CardTitle>Name Series</CardTitle>
            <CardDescription>Configure prefixes for auto-generated IDs.</CardDescription>
           </div>
           <Button onClick={() => { setEditingNameSeries(null); setIsNameSeriesDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />New Series
           </Button>
          </CardHeader>
          <CardContent>
           <Table>
            <TableHeader>
             <TableRow>
              <TableHead>Document Type</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Padding Length</TableHead>
              <TableHead>Example</TableHead>
              <TableHead className="text-right">Actions</TableHead>
             </TableRow>
            </TableHeader>
            <TableBody>
             {nameSeries.map(series => (
              <TableRow key={series.id}>
               <TableCell>{tableNameMap[series.table_name] || series.table_name}</TableCell>
               <TableCell>{series.prefix}</TableCell>
               <TableCell>{series.padding_length}</TableCell>
               <TableCell>{series.prefix}-{ "1".padStart(series.padding_length, '0')}</TableCell>
               <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => { setEditingNameSeries(series); setIsNameSeriesDialogOpen(true); }}>
                 <Edit className="h-4 w-4" />
                </Button>
               </TableCell>
              </TableRow>
             ))}
            </TableBody>
           </Table>
          </CardContent>
         </Card>
        </TabsContent>
       )}

       {hasPermission("documents.manage") && <TabsContent value="documents" className="mt-6"><DocumentTypesPage /></TabsContent>}
       {hasPermission("skills.manage") && <TabsContent value="skills" className="mt-6"><SkillsPage /></TabsContent>}
       {hasPermission("job.manage") && <TabsContent value="jobs" className="mt-6"><JobsPage /></TabsContent>}
       {hasPermission("roles.manage") && <TabsContent value="roles" className="mt-6"><RolesPermissionsPage /></TabsContent>}
       {hasPermission("shift.manage") && <TabsContent value="shifts" className="mt-6"><ShiftsPage /></TabsContent>}
      </Tabs>
     </TabsContent>
    )}

    {/* Other main tabs */}
    {hasPermission("calender.manage") && <TabsContent value="calendar" className="mt-6"><CompanyCalendarPage /></TabsContent>}
    {hasPermission("leaves.manage") && <TabsContent value="leave-types" className="mt-6"><LeaveTypesPage /></TabsContent>}
    {hasPermission("expenses.manage") && <TabsContent value="expenses" className="mt-6"><ExpenseCategoriesPage /></TabsContent>}
    {hasPermission("loans.manage") && <TabsContent value="loan-types" className="mt-6"><LoanTypesPage /></TabsContent>}
    {hasPermission("benefits.manage") && <TabsContent value="benefits" className="mt-6"><BenefitsConfiguratorPage /></TabsContent>}
    {hasPermission("benefits.manage") && <TabsContent value="cases" className="mt-6"><CaseCategoriesPage /></TabsContent>}

   </Tabs>

   {/* Name Series Dialog (remains unchanged) */}
   <Dialog open={isNameSeriesDialogOpen} onOpenChange={setIsNameSeriesDialogOpen}>
    <DialogContent>
     <DialogHeader>
      <DialogTitle>{editingNameSeries ? 'Edit' : 'Create'} Name Series</DialogTitle>
     </DialogHeader>
     <form onSubmit={handleSaveNameSeries}>
      <div className="grid gap-4 py-4">
       <div>
        <Label htmlFor="table_name">Document Type</Label>
        <Select
         name="table_name"
         value={nameSeriesFormData.table_name}
         onValueChange={value => setNameSeriesFormData(d => ({ ...d, table_name: value }))}
        >
         <SelectTrigger>
          <SelectValue placeholder="Select a document type" />
         </SelectTrigger>
         <SelectContent>
          {availableTables.map(([key, value]) => (
           <SelectItem key={key} value={key}>{value}</SelectItem>
          ))}
         </SelectContent>
        </Select>
       </div>
       <div>
        <Label htmlFor="prefix">Prefix</Label>
        <Input id="prefix" name="prefix" value={nameSeriesFormData.prefix} onChange={e => setNameSeriesFormData(d => ({ ...d, prefix: e.target.value }))} />
       </div>
       <div>
        <Label htmlFor="padding_length">Padding Length</Label>
        <Input id="padding_length" name="padding_length" type="number" value={nameSeriesFormData.padding_length} onChange={e => setNameSeriesFormData(d => ({ ...d, padding_length: Number(e.target.value) }))} />
       </div>
       <div className="text-sm text-muted-foreground">
        Preview: {nameSeriesFormData.prefix}-{ "1".padStart(nameSeriesFormData.padding_length, '0')}
       </div>
      </div>
      <DialogFooter>
       <Button type="button" variant="outline" onClick={() => setIsNameSeriesDialogOpen(false)}>Cancel</Button>
       <Button type="submit">Save</Button>
      </DialogFooter>
     </form>
    </DialogContent>
   </Dialog>
  </div>
 )
}