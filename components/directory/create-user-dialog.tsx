

// "use client"

// import * as React from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Switch } from "@/components/ui/switch"
// import { UserPlus, Image as ImageIcon } from "lucide-react"
// import { SearchableSelect } from "@/components/ui/searchable-select"
// import {
//   createUser,
//   getRoles,
//   getJobs,
//   getShifts,
//   searchUsersByPermissions,
//   type Role,
//   type Job,
//   type Shift,
//   type UserProfile,
// } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

// interface CreateUserDialogProps {
//   onUserCreated: () => void;
// }

// export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
//   const [open, setOpen] = React.useState(false)
//   const [isLoading, setIsLoading] = React.useState(false)
//   const [previewImage, setPreviewImage] = React.useState<string | null>(null)
//   const [isProbation, setProbation] = React.useState<boolean>(true)
//   const [validationErrors, setValidationErrors] = React.useState<Record<string, boolean>>({})
//   const { toast } = useToast()

//   // Dropdown data state
//   const [roles, setRoles] = React.useState<Role[]>([])
//   const [jobs, setJobs] = React.useState<Job[]>([])
//   const [shifts, setShifts] = React.useState<Shift[]>([])
//   const [managers, setManagers] = React.useState<UserProfile[]>([])

//   // Selected values for searchable selects
//   const [selectedRole, setSelectedRole] = React.useState<string>("")
//   const [selectedJob, setSelectedJob] = React.useState<string>("")
//   const [selectedShift, setSelectedShift] = React.useState<string>("")
//   const [selectedManager, setSelectedManager] = React.useState<string>("")

//   React.useEffect(() => {
//     if (open) {
//       Promise.all([
//         getRoles(),
//         getJobs(),
//         getShifts(),
//         searchUsersByPermissions(["leaves.approve", "attendance.view"]),
//       ])
//         .then(([rolesData, jobsData, shiftsData, usersData]) => {
//           setRoles(rolesData)
//           setJobs(jobsData)
//           setShifts(shiftsData)
//           setManagers(usersData)
//         })
//         .catch(() => {
//           toast({
//             title: "Error",
//             description: "Could not load necessary data for the form.",
//             variant: "destructive",
//           })
//         })
//     }
//   }, [open, toast])

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         toast({
//           title: "Error",
//           description: "Image size cannot exceed 2MB.",
//           variant: "destructive",
//         })
//         e.target.value = ""
//         return
//       }
//       const reader = new FileReader()
//       reader.onloadend = () => setPreviewImage(reader.result as string)
//       reader.readAsDataURL(file)
//     }
//   }

//   const validateForm = (formData: FormData) => {
//     const errors: Record<string, boolean> = {}
//     const requiredFields = [
//       "firstName",
//       "lastName",
//       "id",
//       "email",
//       "phone",
//       "password",
//       "nationality",
//       "joiningDate",
//     ]

//     requiredFields.forEach((field) => {
//       const value = formData.get(field) as string
//       if (!value?.trim()) errors[field] = true
//     })

//     // Validate searchable selects
//     if (!selectedRole) errors["systemRole"] = true
//     if (!selectedJob) errors["jobRole"] = true
//     if (!selectedShift) errors["shift"] = true
//     if (!selectedManager) errors["reportsTo"] = true

//     if (isProbation) {
//       const period = formData.get("probationPeriod") as string
//       if (!period?.trim() || parseInt(period) <= 0) errors["probationPeriod"] = true
//     }

//     setValidationErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     formData.set("isProbation", String(isProbation))
    
//     // Add selected values from searchable selects
//     formData.set("systemRole", selectedRole)
//     formData.set("jobRole", selectedJob)
//     formData.set("shift", selectedShift)
//     formData.set("reportsTo", selectedManager)

//     if (!validateForm(formData)) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsLoading(true)
//     try {
//       await createUser(formData)
//       toast({
//         title: "Success",
//         description: "User created successfully",
//       })
//       onUserCreated()
//       setOpen(false)
//       setPreviewImage(null)
//       setProbation(true)
//       setValidationErrors({})
//       setSelectedRole("")
//       setSelectedJob("")
//       setSelectedShift("")
//       setSelectedManager("")
//     } catch (err: any) {
//       toast({
//         title: "Error",
//         description: err.message || "Failed to create user",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleDialogOpenChange = (value: boolean) => {
//     setOpen(value)
//     if (!value) {
//       setValidationErrors({})
//       setPreviewImage(null)
//       setProbation(true)
//       setSelectedRole("")
//       setSelectedJob("")
//       setSelectedShift("")
//       setSelectedManager("")
//     }
//   }

//   const errorClass = (field: string) =>
//     validationErrors[field]
//       ? "border-red-500 focus:ring-red-500 focus:border-red-500"
//       : ""

//   return (
//     <Dialog open={open} onOpenChange={handleDialogOpenChange}>
//       <DialogTrigger asChild>
//         <Button>
//           <UserPlus className="h-4 w-4 mr-2" />
//           Create User
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Create New User</DialogTitle>
//           <DialogDescription>
//             Add a new employee to the system. Fill in the required information below.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             {/* Avatar Upload */}
//             <div className="flex flex-col items-center space-y-2">
//               <Avatar className="h-24 w-24 mb-2">
//                 <AvatarImage src={previewImage || undefined} />
//                 <AvatarFallback>
//                   <ImageIcon className="h-10 w-10 text-muted-foreground" />
//                 </AvatarFallback>
//               </Avatar>
//               <Label htmlFor="profileImage">Profile Image (Max 2MB)</Label>
//               <Input
//                 id="profileImage"
//                 name="profileImage"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="max-w-xs"
//               />
//             </div>

//             {/* Name & ID */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName" className={validationErrors.firstName ? "text-red-500" : ""}>
//                   First Name *
//                 </Label>
//                 <Input id="firstName" name="firstName" className={errorClass("firstName")} />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="lastName" className={validationErrors.lastName ? "text-red-500" : ""}>
//                   Last Name *
//                 </Label>
//                 <Input id="lastName" name="lastName" className={errorClass("lastName")} />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="id" className={validationErrors.id ? "text-red-500" : ""}>
//                 Employee ID *
//               </Label>
//               <Input id="id" name="id" type="number" className={errorClass("id")} />
//             </div>

//             {/* Contact & Security */}
//             <div className="space-y-2">
//               <Label htmlFor="email" className={validationErrors.email ? "text-red-500" : ""}>
//                 Email *
//               </Label>
//               <Input id="email" name="email" type="email" className={errorClass("email")} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone" className={validationErrors.phone ? "text-red-500" : ""}>
//                 Phone *
//               </Label>
//               <Input id="phone" name="phone" type="tel" className={errorClass("phone")} />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password" className={validationErrors.password ? "text-red-500" : ""}>
//                 Password *
//               </Label>
//               <Input id="password" name="password" type="password" className={errorClass("password")} />
//             </div>

//             {/* Demographics */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="nationality" className={validationErrors.nationality ? "text-red-500" : ""}>
//                   Nationality *
//                 </Label>
//                 <Input id="nationality" name="nationality" className={errorClass("nationality")} />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="gender">Gender</Label>
//                 <Select name="gender">
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select gender" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="dob">Date of Birth</Label>
//               <Input id="dob" name="dob" type="date" />
//             </div>

//             {/* Joining Date */}
//             <div className="space-y-2">
//               <Label htmlFor="joiningDate" className={validationErrors.joiningDate ? "text-red-500" : ""}>
//                 Joining Date *
//               </Label>
//               <Input id="joiningDate" name="joiningDate" type="date" className={errorClass("joiningDate")} />
//             </div>

//             {/* Probation Section */}
//             <div className="p-4 border rounded-md bg-muted/30 space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Switch id="isProbation" checked={isProbation} onCheckedChange={setProbation} />
//                 <Label htmlFor="isProbation" className="font-medium text-foreground">
//                   Employee is on Probation
//                 </Label>
//               </div>
//               {isProbation && (
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="probationPeriod"
//                     className={validationErrors.probationPeriod ? "text-red-500" : ""}
//                   >
//                     Probation Period (Days) *
//                   </Label>
//                   <Input
//                     id="probationPeriod"
//                     name="probationPeriod"
//                     type="number"
//                     min={1}
//                     placeholder="Enter probation period"
//                     className={errorClass("probationPeriod")}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Roles & Reporting with Searchable Selects */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label className={validationErrors.systemRole ? "text-red-500" : ""}>
//                   System Role *
//                 </Label>
//                 <SearchableSelect
//                   options={roles}
//                   value={selectedRole}
//                   onValueChange={setSelectedRole}
//                   placeholder="Select role"
//                   searchPlaceholder="Search roles..."
//                   emptyMessage="No roles found."
//                   className={errorClass("systemRole")}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className={validationErrors.jobRole ? "text-red-500" : ""}>
//                   Job Title *
//                 </Label>
//                 <SearchableSelect
//                   options={jobs}
//                   value={selectedJob}
//                   onValueChange={setSelectedJob}
//                   placeholder="Select job title"
//                   searchPlaceholder="Search job titles..."
//                   emptyMessage="No job titles found."
//                   className={errorClass("jobRole")}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label className={validationErrors.shift ? "text-red-500" : ""}>
//                   Shift *
//                 </Label>
//                 <SearchableSelect
//                   options={shifts}
//                   value={selectedShift}
//                   onValueChange={setSelectedShift}
//                   placeholder="Select shift"
//                   searchPlaceholder="Search shifts..."
//                   emptyMessage="No shifts found."
//                   className={errorClass("shift")}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className={validationErrors.reportsTo ? "text-red-500" : ""}>
//                   Reports To *
//                 </Label>
//                 <SearchableSelect
//                   options={managers}
//                   value={selectedManager}
//                   onValueChange={setSelectedManager}
//                   placeholder="Select manager"
//                   searchPlaceholder="Search managers..."
//                   emptyMessage="No managers found."
//                   className={errorClass("reportsTo")}
//                 />
//               </div>
//             </div>

//             {/* Emergency Contact */}
//             <div className="space-y-2">
//               <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
//               <Input id="emergencyContactName" name="emergencyContactName" />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="emergencyContactRelation">Relation</Label>
//                 <Input id="emergencyContactRelation" name="emergencyContactRelation" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="emergencyContactNumber">Number</Label>
//                 <Input id="emergencyContactNumber" name="emergencyContactNumber" type="tel" />
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Creating..." : "Create User"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { UserPlus, Image as ImageIcon, Eye, EyeOff } from "lucide-react"
import { SearchableSelect } from "@/components/ui/searchable-select"
import {
  createUser,
  getRoles,
  getJobs,
  getShifts,
  searchUsersByPermissions,
  type Role,
  type Job,
  type Shift,
  type UserProfile,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface CreateUserDialogProps {
  onUserCreated: () => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)
  const [isProbation, setProbation] = React.useState<boolean>(true)
  const [validationErrors, setValidationErrors] = React.useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = React.useState(false)
  const { toast } = useToast()

  // Dropdown data state
  const [roles, setRoles] = React.useState<Role[]>([])
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [shifts, setShifts] = React.useState<Shift[]>([])
  const [managers, setManagers] = React.useState<UserProfile[]>([])

  // Selected values for searchable selects
  const [selectedRole, setSelectedRole] = React.useState<string>("")
  const [selectedJob, setSelectedJob] = React.useState<string>("")
  const [selectedShift, setSelectedShift] = React.useState<string>("")
  const [selectedManager, setSelectedManager] = React.useState<string>("")

  // Form field values for auto-population
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [employeeId, setEmployeeId] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("password")

  React.useEffect(() => {
    if (open) {
      Promise.all([
        getRoles(),
        getJobs(),
        getShifts(),
        searchUsersByPermissions(["leaves.approve", "attendance.view"]),
      ])
        .then(([rolesData, jobsData, shiftsData, usersData]) => {
          setRoles(rolesData)
          setJobs(jobsData)
          setShifts(shiftsData)
          setManagers(usersData)
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Could not load necessary data for the form.",
            variant: "destructive",
          })
        })
    }
  }, [open, toast])

  // Auto-populate email based on firstName, lastName, and employeeId
  React.useEffect(() => {
    if (firstName && lastName && employeeId) {
      const autoEmail = `${firstName.toLowerCase()}${lastName.toLowerCase()}${employeeId}@org.com`
      setEmail(autoEmail)
    }
  }, [firstName, lastName, employeeId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size cannot exceed 2MB.",
          variant: "destructive",
        })
        e.target.value = ""
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (formData: FormData) => {
    const errors: Record<string, boolean> = {}
    const requiredFields = [
      "firstName",
      "lastName",
      "id",
      "email",
      "phone",
      "password",
      "nationality",
      "joiningDate",
    ]

    requiredFields.forEach((field) => {
      const value = formData.get(field) as string
      if (!value?.trim()) errors[field] = true
    })

    // Validate searchable selects
    if (!selectedRole) errors["systemRole"] = true
    if (!selectedJob) errors["jobRole"] = true
    if (!selectedShift) errors["shift"] = true
    if (!selectedManager) errors["reportsTo"] = true

    if (isProbation) {
      const period = formData.get("probationPeriod") as string
      if (!period?.trim() || parseInt(period) <= 0) errors["probationPeriod"] = true
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("isProbation", String(isProbation))
    
    // Add selected values from searchable selects
    formData.set("systemRole", selectedRole)
    formData.set("jobRole", selectedJob)
    formData.set("shift", selectedShift)
    formData.set("reportsTo", selectedManager)

    // Handle dob - pass null if not entered
    const dobValue = formData.get("dob") as string
    if (!dobValue || dobValue.trim() === "") {
      formData.delete("dob")
      formData.set("dob", "null")
    }

    if (!validateForm(formData)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await createUser(formData)
      toast({
        title: "Success",
        description: "User created successfully",
      })
      onUserCreated()
      setOpen(false)
      resetForm()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setPreviewImage(null)
    setProbation(true)
    setValidationErrors({})
    setSelectedRole("")
    setSelectedJob("")
    setSelectedShift("")
    setSelectedManager("")
    setFirstName("")
    setLastName("")
    setEmployeeId("")
    setEmail("")
    setPassword("password")
    setShowPassword(false)
  }

  const handleDialogOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) {
      resetForm()
    }
  }

  const errorClass = (field: string) =>
    validationErrors[field]
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : ""

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new employee to the system. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={previewImage || undefined} />
                <AvatarFallback>
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="profileImage">Profile Image (Max 2MB)</Label>
              <Input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="max-w-xs"
              />
            </div>

            {/* Name & ID */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className={validationErrors.firstName ? "text-red-500" : ""}>
                  First Name *
                </Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  className={errorClass("firstName")} 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className={validationErrors.lastName ? "text-red-500" : ""}>
                  Last Name *
                </Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  className={errorClass("lastName")} 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="id" className={validationErrors.id ? "text-red-500" : ""}>
                Employee ID *
              </Label>
              <Input 
                id="id" 
                name="id" 
                type="number" 
                className={errorClass("id")} 
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>

            {/* Contact & Security */}
            <div className="space-y-2">
              <Label htmlFor="email" className={validationErrors.email ? "text-red-500" : ""}>
                Email *
              </Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                className={errorClass("email")} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated as: firstname+lastname+id@org.com
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className={validationErrors.phone ? "text-red-500" : ""}>
                Phone *
              </Label>
              <Input id="phone" name="phone" type="tel" className={errorClass("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className={validationErrors.password ? "text-red-500" : ""}>
                Password *
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  className={errorClass("password")} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Default password is "password". You can change it by typing a new one.
              </p>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality" className={validationErrors.nationality ? "text-red-500" : ""}>
                  Nationality *
                </Label>
                <Input id="nationality" name="nationality" className={errorClass("nationality")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender">
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" />
              <p className="text-xs text-muted-foreground">
                Leave empty if not available (will be stored as null)
              </p>
            </div>

            {/* Joining Date */}
            <div className="space-y-2">
              <Label htmlFor="joiningDate" className={validationErrors.joiningDate ? "text-red-500" : ""}>
                Joining Date *
              </Label>
              <Input id="joiningDate" name="joiningDate" type="date" className={errorClass("joiningDate")} />
            </div>

            {/* Probation Section */}
            <div className="p-4 border rounded-md bg-muted/30 space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="isProbation" checked={isProbation} onCheckedChange={setProbation} />
                <Label htmlFor="isProbation" className="font-medium text-foreground">
                  Employee is on Probation
                </Label>
              </div>
              {isProbation && (
                <div className="space-y-2">
                  <Label
                    htmlFor="probationPeriod"
                    className={validationErrors.probationPeriod ? "text-red-500" : ""}
                  >
                    Probation Period (Days) *
                  </Label>
                  <Input
                    id="probationPeriod"
                    name="probationPeriod"
                    type="number"
                    min={1}
                    placeholder="Enter probation period"
                    className={errorClass("probationPeriod")}
                  />
                </div>
              )}
            </div>

            {/* Roles & Reporting with Searchable Selects */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={validationErrors.systemRole ? "text-red-500" : ""}>
                  System Role *
                </Label>
                <SearchableSelect
                  options={roles}
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  placeholder="Select role"
                  searchPlaceholder="Search roles..."
                  emptyMessage="No roles found."
                  className={errorClass("systemRole")}
                />
              </div>
              <div className="space-y-2">
                <Label className={validationErrors.jobRole ? "text-red-500" : ""}>
                  Job Title *
                </Label>
                <SearchableSelect
                  options={jobs}
                  value={selectedJob}
                  onValueChange={setSelectedJob}
                  placeholder="Select job title"
                  searchPlaceholder="Search job titles..."
                  emptyMessage="No job titles found."
                  className={errorClass("jobRole")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={validationErrors.shift ? "text-red-500" : ""}>
                  Shift *
                </Label>
                <SearchableSelect
                  options={shifts}
                  value={selectedShift}
                  onValueChange={setSelectedShift}
                  placeholder="Select shift"
                  searchPlaceholder="Search shifts..."
                  emptyMessage="No shifts found."
                  className={errorClass("shift")}
                />
              </div>
              <div className="space-y-2">
                <Label className={validationErrors.reportsTo ? "text-red-500" : ""}>
                  Reports To *
                </Label>
                <SearchableSelect
                  options={managers}
                  value={selectedManager}
                  onValueChange={setSelectedManager}
                  placeholder="Select manager"
                  searchPlaceholder="Search managers..."
                  emptyMessage="No managers found."
                  className={errorClass("reportsTo")}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
              <Input id="emergencyContactName" name="emergencyContactName" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relation</Label>
                <Input id="emergencyContactRelation" name="emergencyContactRelation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactNumber">Number</Label>
                <Input id="emergencyContactNumber" name="emergencyContactNumber" type="tel" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
