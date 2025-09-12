// "use client"

// import * as React from "react"
// import { useAuth } from "@/lib/auth-context"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { FileText, AlertCircle, Upload, Search, Download, Trash2, XCircle, CheckCircle, Badge } from "lucide-react"
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
// import { getExpiringDocuments, getDocumentTypes, getAllUserProfiles, getEmployeeDocuments, uploadEmployeeDocument, deleteUploadedDocument, type DocumentType, type UserProfile, type EmployeeDocument } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// // --- Upload Dialog Sub-Component ---
// const UploadDocumentDialog = ({ open, onOpenChange, onUploadSuccess, users, docTypes }: { open: boolean, onOpenChange: (open: boolean) => void, onUploadSuccess: () => void, users: UserProfile[], docTypes: DocumentType[] }) => {
//     const { toast } = useToast();
//     const [isUploading, setIsUploading] = React.useState(false);
//     const [formData, setFormData] = React.useState({ employeeId: '', document_id: '', expiry_date: '' });
//     const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

//     const handleUpload = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedFile || !formData.document_id || !formData.employeeId) {
//             toast({ title: "Missing Information", description: "Please select an employee, a document type, and a file.", variant: "destructive" });
//             return;
//         }
//         setIsUploading(true);
//         const uploadFormData = new FormData();
//         uploadFormData.append("documentFile", selectedFile);
//         uploadFormData.append("document_id", formData.document_id);
//         if (formData.expiry_date) {
//             uploadFormData.append("expiry_date", formData.expiry_date);
//         }

//         try {
//             await uploadEmployeeDocument(Number(formData.employeeId), uploadFormData);
//             toast({ title: "Success", description: "Document uploaded successfully." });
//             onUploadSuccess();
//             onOpenChange(false);
//         } catch (error: any) {
//             toast({ title: "Upload Failed", description: error.message || "Could not upload document.", variant: "destructive" });
//         } finally {
//             setIsUploading(false);
//         }
//     }

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogTrigger asChild><Button><Upload className="mr-2 h-4 w-4"/>Upload Document</Button></DialogTrigger>
//             <DialogContent>
//                 <DialogHeader><DialogTitle>Upload Document for Employee</DialogTitle><DialogDescription>Select an employee, document type, and file to upload.</DialogDescription></DialogHeader>
//                 <form onSubmit={handleUpload} className="space-y-4 py-4">
//                     <Select onValueChange={(val) => setFormData(f => ({...f, employeeId: val}))}><SelectTrigger><SelectValue placeholder="Select Employee"/></SelectTrigger><SelectContent>{users.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.first_name} {u.last_name}</SelectItem>)}</SelectContent></Select>
//                     <Select onValueChange={(val) => setFormData(f => ({...f, document_id: val}))}><SelectTrigger><SelectValue placeholder="Select Document Type"/></SelectTrigger><SelectContent>{docTypes.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent></Select>
//                     <div><Label>File</Label><Input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} required/></div>
//                     <div><Label>Expiry Date (Optional)</Label><Input type="date" onChange={(e) => setFormData(f => ({...f, expiry_date: e.target.value}))}/></div>
//                     <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</Button></DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }


// export function DocumentManagementPage() {
//   const { hasPermission } = useAuth()
//   const { toast } = useToast()
  
//   const [expiringDocs, setExpiringDocs] = React.useState<any[]>([])
//   const [docTypes, setDocTypes] = React.useState<DocumentType[]>([])
//   const [users, setUsers] = React.useState<UserProfile[]>([]);
//   const [userDocuments, setUserDocuments] = React.useState<Map<number, EmployeeDocument[]>>(new Map());
//   const [isLoading, setIsLoading] = React.useState(true)
  
//   const [selectedDocType, setSelectedDocType] = React.useState<string>('');
//   const [searchTerm, setSearchTerm] = React.useState('');
//   const [isUploadOpen, setIsUploadOpen] = React.useState(false);

//   const canManageDocs = hasPermission("documents.manage")

//   const fetchData = async () => {
//     if (!canManageDocs) { setIsLoading(false); return }
//     try {
//       setIsLoading(true);
//       const [expiring, types, allUsers] = await Promise.all([
//           getExpiringDocuments(), 
//           getDocumentTypes(), 
//           getAllUserProfiles(1, 1000).then(res => res.data) // Fetch a large number of users
//       ]);
//       setExpiringDocs(expiring);
//       setDocTypes(types);
//       setUsers(allUsers);

//       // Pre-fetch all documents for all users
//       const allDocsPromises = allUsers.map(user => getEmployeeDocuments(user.id).then(docs => ({ userId: user.id, docs })));
//       const allDocsResults = await Promise.all(allDocsPromises);
//       const docsMap = new Map<number, EmployeeDocument[]>();
//       allDocsResults.forEach(result => {
//           docsMap.set(result.userId, result.docs);
//       });
//       setUserDocuments(docsMap);

//     } catch (error: any) {
//       toast({ title: "Error", description: `Could not fetch data: ${error.message}`, variant: "destructive" });
//     } finally {
//       setIsLoading(false)
//     }
//   }
  
//   React.useEffect(() => {
//     fetchData()
//   }, [canManageDocs])

//   const handleDelete = async (docId: number) => {
//     if(!confirm("Are you sure you want to delete this document?")) return;
//     try {
//         await deleteUploadedDocument(docId);
//         toast({ title: "Success", description: "Document deleted."});
//         fetchData();
//     } catch (error: any) {
//         toast({ title: "Error", description: `Failed to delete document: ${error.message}`, variant: "destructive"});
//     }
//   }

//   const filteredUsers = React.useMemo(() => {
//       return users.filter(user => `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()));
//   }, [users, searchTerm]);

//   const complianceData = React.useMemo(() => {
//       if (!selectedDocType) return [];
//       const uploadedCount = filteredUsers.filter(user => {
//           const docs = userDocuments.get(user.id) || [];
//           return docs.some(d => d.document_id === Number(selectedDocType));
//       }).length;
//       return [
//           { name: 'Compliant', value: uploadedCount, fill: '#22c55e' },
//           { name: 'Missing', value: filteredUsers.length - uploadedCount, fill: '#ef4444' },
//       ];
//   }, [filteredUsers, userDocuments, selectedDocType]);

//   if (!canManageDocs) {
//     return (
//       <Alert variant="destructive">
//         <AlertCircle className="h-4 w-4" />
//         <AlertTitle>Access Denied</AlertTitle>
//         <AlertDescription>You don't have permission to manage documents.</AlertDescription>
//       </Alert>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <FileText className="h-8 w-8" />
//           <h1 className="text-3xl font-bold">Document Management</h1>
//         </div>
//         <UploadDocumentDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} onUploadSuccess={fetchData} users={users} docTypes={docTypes} />
//       </div>
      
//       <Card>
//           <CardHeader><CardTitle>Upcoming Expiries (Next 30 Days)</CardTitle></CardHeader>
//           <CardContent>
//             {expiringDocs.length === 0 ? <p className="text-muted-foreground">No documents are expiring soon.</p> :
//                 <Table>
//                     <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Document</TableHead><TableHead>Expiry Date</TableHead></TableRow></TableHeader>
//                     <TableBody>
//                         {expiringDocs.map(doc => (
//                             <TableRow key={doc.id}>
//                                 <TableCell>{doc.employee_name}</TableCell>
//                                 <TableCell>{doc.document_name}</TableCell>
//                                 <TableCell className="text-red-500 font-medium">{new Date(doc.expiry_date).toLocaleDateString()}</TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             }
//           </CardContent>
//       </Card>
      
//       <Card>
//           <CardHeader>
//             <CardTitle>Document Explorer</CardTitle>
//             <CardDescription>Filter by document type to see employee compliance.</CardDescription>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
//                 <Select value={selectedDocType} onValueChange={setSelectedDocType}>
//                     <SelectTrigger><SelectValue placeholder="Select a document type to begin..."/></SelectTrigger>
//                     <SelectContent>{docTypes.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
//                 </Select>
//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input placeholder="Search by employee name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
//                 </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {!selectedDocType ? <div className="text-center py-12 text-muted-foreground">Please select a document type to see compliance data.</div> :
//             <>
//                 <Card className="mb-6">
//                     <CardHeader><CardTitle>Compliance Overview</CardTitle></CardHeader>
//                     <CardContent className="h-64">
//                          <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={complianceData} layout="vertical" margin={{ left: 20 }}>
//                                 <XAxis type="number" hide />
//                                 <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false}/>
//                                 <Tooltip cursor={{ fill: 'transparent' }}/>
//                                 <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]} />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </CardContent>
//                 </Card>
//                 <Table>
//                     <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Status</TableHead><TableHead>Uploaded On</TableHead><TableHead>Expires On</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
//                     <TableBody>
//                         {filteredUsers.map(user => {
//                             const userDocs = userDocuments.get(user.id) || [];
//                             const doc = userDocs.find(d => d.document_id === Number(selectedDocType));
//                             return (
//                                 <TableRow key={user.id} className={!doc ? 'bg-red-500/10' : ''}>
//                                     <TableCell><Link href={`/directory/${user.id}`} className="font-medium text-primary hover:underline">{user.first_name} {user.last_name}</Link></TableCell>
//                                     <TableCell>
//                                         {doc ? <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1"/>Uploaded</Badge> 
//                                              : <Badge ><XCircle className="h-3 w-3 mr-1"/>Missing</Badge>}
//                                     </TableCell>
//                                     <TableCell>{doc ? new Date(doc.upload_date).toLocaleDateString() : 'N/A'}</TableCell>
//                                     <TableCell>{doc?.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}</TableCell>
//                                     <TableCell className="text-right">
//                                         {doc && (
//                                             <>
//                                             <Button variant="ghost" size="sm" asChild><a href={doc.upload_link} target="_blank"><Download className="h-4 w-4"/></a></Button>
//                                             <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}><Trash2 className="h-4 w-4"/></Button>
//                                             </>
//                                         )}
//                                     </TableCell>
//                                 </TableRow>
//                             )
//                         })}
//                     </TableBody>
//                 </Table>
//             </>
//             }
//           </CardContent>
//       </Card>
//     </div>
//   )
// }



"use client"

import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, AlertCircle, Upload, Search, Download, Trash2, XCircle, CheckCircle, ChevronsUpDown, Badge } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { getExpiringDocuments, getDocumentTypes, getAllUserProfiles, getEmployeeDocuments, uploadEmployeeDocument, deleteUploadedDocument, searchUsers, type DocumentType, type UserProfile, type EmployeeDocument } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// --- Upload Dialog Sub-Component (Refactored with Search) ---
const UploadDocumentDialog = ({ open, onOpenChange, onUploadSuccess, docTypes }: { open: boolean, onOpenChange: (open: boolean) => void, onUploadSuccess: () => void, docTypes: DocumentType[] }) => {
    const { toast } = useToast();
    const [isUploading, setIsUploading] = React.useState(false);
    const [formData, setFormData] = React.useState({ employeeId: '', document_id: '', expiry_date: '' });
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    
    const [employeeSearch, setEmployeeSearch] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(null);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    React.useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(employeeSearch), 500);
        return () => clearTimeout(handler);
    }, [employeeSearch]);

    React.useEffect(() => {
        if (debouncedSearch) {
            setIsSearching(true);
            searchUsers(debouncedSearch).then(setSearchedUsers).finally(() => setIsSearching(false));
        } else {
            setSearchedUsers([]);
        }
    }, [debouncedSearch]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !formData.document_id || !formData.employeeId) {
            toast({ title: "Missing Information", description: "Please select an employee, a document type, and a file.", variant: "destructive" });
            return;
        }
        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("documentFile", selectedFile);
        uploadFormData.append("document_id", formData.document_id);
        if (formData.expiry_date) {
            uploadFormData.append("expiry_date", formData.expiry_date);
        }

        try {
            await uploadEmployeeDocument(Number(formData.employeeId), uploadFormData);
            toast({ title: "Success", description: "Document uploaded successfully." });
            onUploadSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({ title: "Upload Failed", description: error.message || "Could not upload document.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild><Button><Upload className="mr-2 h-4 w-4"/>Upload Document</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Upload Document for Employee</DialogTitle><DialogDescription>Select an employee, document type, and file to upload.</DialogDescription></DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Employee</Label>
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-full justify-between">
                                    {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : "Search and select employee..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search employee..." onValueChange={setEmployeeSearch} />
                                    <CommandList>
                                        <CommandEmpty>{isSearching ? "Searching..." : "No employee found."}</CommandEmpty>
                                        <CommandGroup>
                                            {searchedUsers.map((user) => (
                                                <CommandItem key={user.id} value={`${user.first_name} ${user.last_name}`} onSelect={() => {
                                                    setFormData(f => ({...f, employeeId: String(user.id)}));
                                                    setSelectedUser(user);
                                                    setIsPopoverOpen(false);
                                                }}>
                                                    {user.first_name} {user.last_name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Select onValueChange={(val) => setFormData(f => ({...f, document_id: val}))}><SelectTrigger><SelectValue placeholder="Select Document Type"/></SelectTrigger><SelectContent>{docTypes.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent></Select>
                    <div><Label>File</Label><Input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} required/></div>
                    <div><Label>Expiry Date (Optional)</Label><Input type="date" onChange={(e) => setFormData(f => ({...f, expiry_date: e.target.value}))}/></div>
                    <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


export function DocumentManagementPage() {
  const { hasPermission } = useAuth()
  const { toast } = useToast()
  
  const [expiringDocs, setExpiringDocs] = React.useState<any[]>([])
  const [docTypes, setDocTypes] = React.useState<DocumentType[]>([])
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [userDocuments, setUserDocuments] = React.useState<Map<number, EmployeeDocument[]>>(new Map());
  const [isLoading, setIsLoading] = React.useState(true)
  
  const [selectedDocType, setSelectedDocType] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  const canManageDocs = hasPermission("documents.manage")

  const fetchData = async () => {
    if (!canManageDocs) { setIsLoading(false); return }
    try {
      setIsLoading(true);
      const [expiring, types, allUsers] = await Promise.all([
          getExpiringDocuments(), 
          getDocumentTypes(), 
          getAllUserProfiles(1, 1000).then(res => res.data)
      ]);
      setExpiringDocs(expiring);
      setDocTypes(types);
      setUsers(allUsers);

      const allDocsPromises = allUsers.map(user => getEmployeeDocuments(user.id).then(docs => ({ userId: user.id, docs })));
      const allDocsResults = await Promise.all(allDocsPromises);
      const docsMap = new Map<number, EmployeeDocument[]>();
      allDocsResults.forEach(result => {
          docsMap.set(result.userId, result.docs);
      });
      setUserDocuments(docsMap);

    } catch (error: any) {
      toast({ title: "Error", description: `Could not fetch data: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoading(false)
    }
  }
  
  React.useEffect(() => {
    fetchData()
  }, [canManageDocs])

  const handleDelete = async (docId: number) => {
    if(!confirm("Are you sure you want to delete this document?")) return;
    try {
        await deleteUploadedDocument(docId);
        toast({ title: "Success", description: "Document deleted."});
        fetchData();
    } catch (error: any) {
        toast({ title: "Error", description: `Failed to delete document: ${error.message}`, variant: "destructive"});
    }
  }

  const activeUsers = React.useMemo(() => {
    return users.filter(user => user.is_active);
  }, [users]);

  const filteredUsers = React.useMemo(() => {
      return activeUsers.filter(user => `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [activeUsers, searchTerm]);

  const complianceData = React.useMemo(() => {
      if (!selectedDocType) return [];
      const uploadedCount = filteredUsers.filter(user => {
          const docs = userDocuments.get(user.id) || [];
          return docs.some(d => d.document_id === Number(selectedDocType));
      }).length;
      return [
          { name: 'Compliant', value: uploadedCount, fill: '#22c55e' },
          { name: 'Missing', value: filteredUsers.length - uploadedCount, fill: '#ef4444' },
      ];
  }, [filteredUsers, userDocuments, selectedDocType]);

  if (!canManageDocs) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You don't have permission to manage documents.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Document Management</h1>
        </div>
        <UploadDocumentDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} onUploadSuccess={fetchData} docTypes={docTypes} />
      </div>
      
      <Card>
          <CardHeader><CardTitle>Upcoming Expiries (Next 30 Days)</CardTitle></CardHeader>
          <CardContent>
            {expiringDocs.length === 0 ? <p className="text-muted-foreground">No documents are expiring soon.</p> :
                <Table>
                    <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Document</TableHead><TableHead>Expiry Date</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {expiringDocs.map(doc => (
                            <TableRow key={doc.id}>
                                <TableCell>{doc.employee_name}</TableCell>
                                <TableCell>{doc.document_name}</TableCell>
                                <TableCell className="text-red-500 font-medium">{new Date(doc.expiry_date).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
            <CardTitle>Document Explorer</CardTitle>
            <CardDescription>Filter by document type to see active employee compliance.</CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                    <SelectTrigger><SelectValue placeholder="Select a document type to begin..."/></SelectTrigger>
                    <SelectContent>{docTypes.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by employee name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedDocType ? <div className="text-center py-12 text-muted-foreground">Please select a document type to see compliance data.</div> :
            <>
                <Card className="mb-6">
                    <CardHeader><CardTitle>Compliance Overview</CardTitle></CardHeader>
                    <CardContent className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={complianceData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false}/>
                                <Tooltip cursor={{ fill: 'transparent' }}/>
                                <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Table>
                    <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Status</TableHead><TableHead>Uploaded On</TableHead><TableHead>Expires On</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {filteredUsers.map(user => {
                            const userDocs = userDocuments.get(user.id) || [];
                            const doc = userDocs.find(d => d.document_id === Number(selectedDocType));
                            return (
                                <TableRow key={user.id} className={!doc ? 'bg-red-500/10' : ''}>
                                    <TableCell><Link href={`/directory/${user.id}`} className="font-medium text-primary hover:underline">{user.first_name} {user.last_name}</Link></TableCell>
                                    <TableCell>
                                        {doc ? <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1"/>Uploaded</Badge> 
                                             : <Badge ><XCircle className="h-3 w-3 mr-1"/>Missing</Badge>}
                                    </TableCell>
                                    <TableCell>{doc ? new Date(doc.upload_date).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>{doc?.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        {doc && (
                                            <>
                                            <Button variant="ghost" size="sm" asChild><a href={doc.upload_link} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4"/></a></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}><Trash2 className="h-4 w-4"/></Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </>
            }
          </CardContent>
      </Card>
    </div>
  )
}