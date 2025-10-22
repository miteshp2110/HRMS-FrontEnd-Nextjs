// "use client";

// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   createCase,
//   searchUsers,
//   getCaseCategories,
//   type UserProfile,
//   type CaseCategory,
// } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Check, ChevronsUpDown, Search } from "lucide-react";

// interface CreateCaseDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSuccess: () => void;
// }

// export function CreateCaseDialog({
//   open,
//   onOpenChange,
//   onSuccess,
// }: CreateCaseDialogProps) {
//   const { toast } = useToast();
//   const [categories, setCategories] = React.useState<CaseCategory[]>([]);
//   const [employeeSearch, setEmployeeSearch] = React.useState("");
//   const [debouncedSearch, setDebouncedSearch] = React.useState("");
//   const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([]);
//   const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(
//     null
//   );
//   const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

//   React.useEffect(() => {
//     if (open) {
//       getCaseCategories().then(setCategories);
//     }
//   }, [open]);

//   React.useEffect(() => {
//     const handler = setTimeout(() => setDebouncedSearch(employeeSearch), 300);
//     return () => clearTimeout(handler);
//   }, [employeeSearch]);

//   React.useEffect(() => {
//     if (debouncedSearch) {
//       searchUsers(debouncedSearch).then(setSearchedUsers);
//     } else {
//       setSearchedUsers([]);
//     }
//   }, [debouncedSearch]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const form = e.target as HTMLFormElement;
//     const formData = new FormData(form);
//     formData.set("employee_id", String(selectedUser?.id || ""));

//     try {
//       await createCase(formData);
//       toast({ title: "Success", description: "Case created successfully." });
//       onSuccess();
//       onOpenChange(false);
//       form.reset();
//       setSelectedUser(null);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: `Failed to create case: ${error.message}`,
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Create New HR Case</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4 py-4">
//           <div className="grid gap-2">
//             <Label>Employee</Label>
//             <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
//               <PopoverTrigger asChild>
//                 <button
//                   role="button"
//                   className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
//                 >
//                   {selectedUser
//                     ? `${selectedUser.first_name} ${selectedUser.last_name}`
//                     : "Select employee..."}
//                   <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </button>
//               </PopoverTrigger>
//               <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
//                 <Command>
//                   <CommandInput
//                     placeholder="Search employee..."
//                     onValueChange={setEmployeeSearch}
//                   />
//                   <CommandList>
//                     <CommandEmpty>No employee found.</CommandEmpty>
//                     <CommandGroup>
//                       {searchedUsers.map((user) => (
//                         <CommandItem
//                           key={user.id}
//                           value={`${user.first_name} ${user.last_name}`}
//                           onSelect={() => {
//                             setSelectedUser(user);
//                             setIsPopoverOpen(false);
//                           }}
//                         >
//                           <Check
//                             className={`mr-2 h-4 w-4 ${
//                               selectedUser?.id === user.id
//                                 ? "opacity-100"
//                                 : "opacity-0"
//                             }`}
//                           />
//                           {user.first_name} {user.last_name}
//                         </CommandItem>
//                       ))}
//                     </CommandGroup>
//                   </CommandList>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>
//           <div className="grid gap-2">
//             <Label>Category</Label>
//             <Select name="category_id" required>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map((c) => (
//                   <SelectItem key={c.id} value={String(c.id)}>
//                     {c.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="grid gap-2">
//             <Label>Title</Label>
//             <Input name="title" required />
//           </div>
//           <div className="grid gap-2">
//             <Label>Description</Label>
//             <Textarea name="description" required />
//           </div>
//           <div className="grid gap-2">
//             <Label>Deduction Amount </Label>
//             <Input name="deduction_amount" type="number" />
//           </div>
//           <div className="grid gap-2">
//             <Label>Evidence </Label>
//             <Input name="evidence" type="file" />
//           </div>
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">Create Case</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createCase,
  searchUsers,
  getCaseCategories,
  type UserProfile,
  type CaseCategory,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { 
  Check, 
  Search, 
  Loader2, 
  User, 
  FolderKanban, 
  FileText, 
  DollarSign,
  Upload,
  CheckCircle
} from "lucide-react"

interface CreateCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateCaseDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCaseDialogProps) {
  const { toast } = useToast()
  const [categories, setCategories] = React.useState<CaseCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false)
  const [employeeSearch, setEmployeeSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [searchedUsers, setSearchedUsers] = React.useState<UserProfile[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setIsLoadingCategories(true)
      getCaseCategories()
        .then(setCategories)
        .finally(() => setIsLoadingCategories(false))
    }
  }, [open])

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(employeeSearch), 300)
    return () => clearTimeout(handler)
  }, [employeeSearch])

  React.useEffect(() => {
    if (debouncedSearch) {
      setIsSearching(true)
      searchUsers(debouncedSearch)
        .then(setSearchedUsers)
        .finally(() => setIsSearching(false))
    } else {
      setSearchedUsers([])
      setIsSearching(false)
    }
  }, [debouncedSearch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUser) {
      toast({
        title: "Validation Error",
        description: "Please select an employee.",
        variant: "destructive",
      })
      return
    }

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    formData.set("employee_id", String(selectedUser?.id || ""))

    setIsSubmitting(true)
    try {
      await createCase(formData)
      toast({ 
        title: "Success", 
        description: "Case created successfully." 
      })
      onSuccess()
      onOpenChange(false)
      form.reset()
      setSelectedUser(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create case: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl h-[80vh] overflow-x-scroll">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FolderKanban className="h-6 w-6" />
            Create New HR Case
          </DialogTitle>
          <DialogDescription>
            Create a new case for an employee. Fill in all required details below.
          </DialogDescription>
        </DialogHeader>

        {isLoadingCategories ? (
          <div className="space-y-4 py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Employee Selection */}
            <div className="space-y-2">
              <Label htmlFor="employee" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Employee *
              </Label>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    role="button"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedUser
                      ? `${selectedUser.first_name} ${selectedUser.last_name}`
                      : "Search and select employee..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search employee by name..."
                      onValueChange={setEmployeeSearch}
                    />
                    <CommandList>
                      {isSearching ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <>
                          <CommandEmpty>
                            {employeeSearch ? "No employee found." : "Start typing to search..."}
                          </CommandEmpty>
                          <CommandGroup>
                            {searchedUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={`${user.first_name} ${user.last_name}`}
                                onSelect={() => {
                                  setSelectedUser(user)
                                  setIsPopoverOpen(false)
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    selectedUser?.id === user.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {user.first_name} {user.last_name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {user.email}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedUser && (
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4" />
                Case Category *
              </Label>
              <Select name="category_id" required disabled={isSubmitting}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Case Title *
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Brief title describing the case..."
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide detailed description of the case..."
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Deduction Amount */}
            <div className="space-y-2">
              <Label htmlFor="deduction_amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Deduction Amount (AED)
              </Label>
              <Input
                id="deduction_amount"
                name="deduction_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Enter amount if this case involves a salary deduction
              </p>
            </div>

            {/* Evidence Upload */}
            <div className="space-y-2">
              <Label htmlFor="evidence" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Evidence / Supporting Documents
              </Label>
              <Input
                id="evidence"
                name="evidence"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Upload any supporting documents (PDF, DOC, or images)
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  setSelectedUser(null)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedUser}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Case
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
