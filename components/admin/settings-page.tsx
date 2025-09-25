
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Globe, Plus, Edit, Trash2 } from "lucide-react"
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
import React, { useState, useEffect } from "react"
import { getNameSeries, createNameSeries, updateNameSeries, type NameSeries } from "@/lib/api"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ExpenseCategoriesPage } from "./expense-categories-page"

const timezones = [
    "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "Europe/London", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney"
];

const tableNameMap: { [key: string]: string } = {
    "employee_leave_records": "Leave Records",
    "employee_loans": "Employee Loans",
    "user": "Users"
};

export function SettingsPage() {
    const { toast } = useToast();
    const [selectedTimezone, setSelectedTimezone] = React.useState<string | null>(null);
    const [nameSeries, setNameSeries] = useState<NameSeries[]>([]);
    const [isNameSeriesDialogOpen, setIsNameSeriesDialogOpen] = useState(false);
    const [editingNameSeries, setEditingNameSeries] = useState<NameSeries | null>(null);
    const [nameSeriesFormData, setNameSeriesFormData] = useState({
        table_name: '',
        prefix: '',
        padding_length: 5
    });

    useEffect(() => {
        const savedTimezone = localStorage.getItem("selectedTimezone");
        if (savedTimezone && timezones.includes(savedTimezone)) {
          setSelectedTimezone(savedTimezone);
        }
        fetchNameSeries();
      }, []);
    
    useEffect(() => {
        if(editingNameSeries) {
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
        toast({ title: "Success", description: `Timezone updated to ${tz}`});
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

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                    <TabsTrigger value="jobs">Job Titles</TabsTrigger>
                    <TabsTrigger value="shifts">Shifts</TabsTrigger>
                    <TabsTrigger value="skills">Skills Library</TabsTrigger>
                    <TabsTrigger value="documents">Document Types</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="leave-types">Leave Types</TabsTrigger>
                    <TabsTrigger value="expenses">Expense Categories</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="mt-6">
                   <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>Manage general settings for the application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Globe className="h-5 w-5 text-muted-foreground"/>
                                <Label htmlFor="timezone-select">Application Timezone</Label>
                            </div>
                            <Select value={selectedTimezone || ""} onValueChange={handleTimezoneChange}>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select a timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timezones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">This timezone will be used to display dates and times across the application.</p>
                        </CardContent>
                   </Card>
                   <Card className="mt-6">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Name Series</CardTitle>
                                    <CardDescription>Configure prefixes for auto-generated IDs.</CardDescription>
                                </div>
                                <Button onClick={() => { setEditingNameSeries(null); setIsNameSeriesDialogOpen(true); }}><Plus className="h-4 w-4 mr-2"/>New Series</Button>
                            </div>
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
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                   </Card>
                </TabsContent>
                <TabsContent value="roles" className="mt-6">
                    <RolesPermissionsPage />
                </TabsContent>
                <TabsContent value="jobs" className="mt-6">
                   <JobsPage />
                </TabsContent>
                <TabsContent value="shifts" className="mt-6">
                    <ShiftsPage />
                </TabsContent>
                <TabsContent value="skills" className="mt-6">
                    <SkillsPage />
                </TabsContent>
                <TabsContent value="documents" className="mt-6">
                    <DocumentTypesPage />
                </TabsContent>
                <TabsContent value="calendar" className="mt-6">
                    <CompanyCalendarPage />
                </TabsContent>
                <TabsContent value="leave-types" className="mt-6">
                    <LeaveTypesPage />
                </TabsContent>
                <TabsContent value="expenses" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Expense Categories</CardTitle>
                            <CardDescription>Manage categories for expense claims and advances.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ExpenseCategoriesPage />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <Dialog open={isNameSeriesDialogOpen} onOpenChange={setIsNameSeriesDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingNameSeries ? 'Edit' : 'Create'} Name Series</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSaveNameSeries}>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="table_name">Document Type</Label>
                                <Select name="table_name" value={nameSeriesFormData.table_name} onValueChange={value => setNameSeriesFormData(d => ({...d, table_name: value}))}>
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
                                <Input id="prefix" name="prefix" value={nameSeriesFormData.prefix} onChange={e => setNameSeriesFormData(d => ({...d, prefix: e.target.value}))} />
                            </div>
                            <div>
                                <Label htmlFor="padding_length">Padding Length</Label>
                                <Input id="padding_length" name="padding_length" type="number" value={nameSeriesFormData.padding_length} onChange={e => setNameSeriesFormData(d => ({...d, padding_length: Number(e.target.value)}))} />
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

