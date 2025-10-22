// // "use client";

// // import { useState, useEffect } from "react";
// // import {
  
// //   ScheduleRevisionPayload,
// //   PayrollComponent,
// //   getPayrollComponents,
// //   scheduleSalaryRevision,
// // } from "@/lib/api";
// // import { useToast } from "@/hooks/use-toast";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Textarea } from "@/components/ui/textarea";

// // interface ScheduleRevisionDialogProps {
// //   employeeId: number;
// //   onSuccess: () => void;
// // }

// // export function ScheduleRevisionDialog({
// //   employeeId,
// //   onSuccess,
// // }: ScheduleRevisionDialogProps) {
// //   const { toast } = useToast();
// //   const [open, setOpen] = useState(false);
// //   const [components, setComponents] = useState<PayrollComponent[]>([]);
// //   const [formData, setFormData] = useState<Omit<ScheduleRevisionPayload, "employee_id">>({
// //     component_id: 0,
// //     effective_date: "",
// //     new_calculation_type: "Fixed",
// //     new_value: 0,
// //     reason: "",
// //   });

// //   useEffect(() => {
// //     // Fetch salary components when the dialog opens
// //     if (open) {
// //       getPayrollComponents().then(setComponents).catch(() => {
// //         toast({ title: "Error", description: "Could not fetch salary components.", variant: "destructive" });
// //       });
// //     }
// //   }, [open, toast]);

// //   const handleSubmit = async () => {
// //     if (
// //       !formData.component_id ||
// //       !formData.effective_date ||
// //       !formData.new_value ||
// //       !formData.reason
// //     ) {
// //       toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
// //       return;
// //     }

// //     try {
// //       await scheduleSalaryRevision({ ...formData, employee_id: employeeId });
// //       toast({ title: "Success", description: "Salary revision scheduled." });
// //       onSuccess();
// //       setOpen(false);
// //     } catch (error: any) {
// //       toast({
// //         title: "Failed to schedule revision",
// //         description: error.message || "An unexpected error occurred.",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={setOpen}>
// //       <DialogTrigger asChild>
// //         <Button>Schedule Revision</Button>
// //       </DialogTrigger>
// //       <DialogContent>
// //         <DialogHeader>
// //           <DialogTitle>Schedule Salary Revision</DialogTitle>
// //           <DialogDescription>
// //             Set up a future change for an employee's salary component.
// //           </DialogDescription>
// //         </DialogHeader>
// //         <div className="grid gap-4 py-4">
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="component" className="text-right">
// //               Component
// //             </Label>
// //             <Select
// //               onValueChange={(v) =>
// //                 setFormData({ ...formData, component_id: parseInt(v) })
// //               }
// //             >
// //               <SelectTrigger className="col-span-3">
// //                 <SelectValue placeholder="Select a component" />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 {components.map((c) => (
// //                   <SelectItem key={c.id} value={String(c.id)}>
// //                     {c.name}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //           </div>
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="effective-date" className="text-right">
// //               Effective Date
// //             </Label>
// //             <Input
// //               id="effective-date"
// //               type="date"
// //               className="col-span-3"
// //               onChange={(e) =>
// //                 setFormData({ ...formData, effective_date: e.target.value })
// //               }
// //             />
// //           </div>
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="calc-type" className="text-right">
// //               Calculation
// //             </Label>
// //             <Select
// //               defaultValue="Fixed"
// //               onValueChange={(v: "Fixed" | "Percentage") =>
// //                 setFormData({ ...formData, new_calculation_type: v })
// //               }
// //             >
// //               <SelectTrigger className="col-span-3">
// //                 <SelectValue />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="Fixed">Fixed Amount</SelectItem>
// //                 <SelectItem value="Percentage">Percentage</SelectItem>
// //               </SelectContent>
// //             </Select>
// //           </div>
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="new-value" className="text-right">
// //               New Value
// //             </Label>
// //             <Input
// //               id="new-value"
// //               type="number"
// //               className="col-span-3"
// //               onChange={(e) =>
// //                 setFormData({ ...formData, new_value: parseFloat(e.target.value) })
// //               }
// //             />
// //           </div>
// //           <div className="grid grid-cols-4 items-center gap-4">
// //             <Label htmlFor="reason" className="text-right">
// //               Reason
// //             </Label>
// //             <Textarea
// //               id="reason"
// //               className="col-span-3"
// //               onChange={(e) =>
// //                 setFormData({ ...formData, reason: e.target.value })
// //               }
// //             />
// //           </div>
// //         </div>
// //         <DialogFooter>
// //           <Button type="submit" onClick={handleSubmit}>
// //             Schedule
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// "use client"

// import { useState, useEffect } from "react"
// import {
//   ScheduleRevisionPayload,
//   PayrollComponent,
//   getPayrollComponents,
//   scheduleSalaryRevision,
//   getEmployeeSalaryStructure,
//   type EmployeeSalaryStructure,
//   type FormulaComponent,
// } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Badge } from "@/components/ui/badge"
// import { Loader2, Plus, TrendingUp, Eye, Calculator } from "lucide-react"
// import { FormulaBuilder } from "@/components/payroll/formula-builder"

// // Format number as AED currency
// const formatAED = (amount: number | string) => {
//   const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
//   return new Intl.NumberFormat('en-AE', {
//     style: 'currency',
//     currency: 'AED',
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(numAmount)
// }

// interface ScheduleRevisionDialogProps {
//   employeeId: number
//   onSuccess: () => void
//   trigger?: React.ReactNode
// }

// export function ScheduleRevisionDialog({
//   employeeId,
//   onSuccess,
//   trigger
// }: ScheduleRevisionDialogProps) {
//   const { toast } = useToast()
//   const [open, setOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [components, setComponents] = useState<PayrollComponent[]>([])
//   const [structure, setStructure] = useState<EmployeeSalaryStructure[]>([])
//   const [formula, setFormula] = useState<FormulaComponent[]>([])
//   const [customFormula, setCustomFormula] = useState('')
//   const [realTimePreview, setRealTimePreview] = useState(0)

//   const [formData, setFormData] = useState<Omit<ScheduleRevisionPayload, "employee_id">>({
//     component_id: 0,
//     effective_date: "",
//     new_calculation_type: "Fixed",
//     new_value: 0,
//     new_based_on_component_id: undefined,
//     new_custom_formula: null,
//     reason: "",
//   })

//   useEffect(() => {
//     if (open) {
//       setIsLoading(true)
//       Promise.all([
//         getPayrollComponents(),
//         getEmployeeSalaryStructure(employeeId)
//       ])
//         .then(([comps, struct]) => {
//           setComponents(comps)
//           setStructure(struct)
//         })
//         .catch(() => {
//           toast({ 
//             title: "Error", 
//             description: "Could not fetch salary components.", 
//             variant: "destructive" 
//           })
//         })
//         .finally(() => setIsLoading(false))
//     }
//   }, [open, employeeId, toast])

//   // Real-time preview calculation
//   useEffect(() => {
//     if (formData.new_calculation_type === 'Fixed') {
//       setRealTimePreview(formData.new_value)
//     } else if (formData.new_calculation_type === 'Percentage') {
//       const baseComponent = structure.find(s => s.component_id === formData.new_based_on_component_id)
//       const baseAmount = baseComponent?.calculated_amount || 0
//       setRealTimePreview(formData.new_value * baseAmount / 100)
//     } else {
//       setRealTimePreview(0)
//     }
//   }, [formData, structure])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.component_id || !formData.effective_date || !formData.reason.trim()) {
//       toast({ 
//         title: "Validation Error", 
//         description: "Please fill all required fields.", 
//         variant: "destructive" 
//       })
//       return
//     }

//     if (formData.new_calculation_type === 'Percentage' && !formData.new_based_on_component_id) {
//       toast({ 
//         title: "Validation Error", 
//         description: "Please select a base component for percentage calculation.", 
//         variant: "destructive" 
//       })
//       return
//     }

//     const payload = { ...formData, employee_id: employeeId }
    
//     if (formData.new_calculation_type === 'Formula') {
//       payload.new_custom_formula = customFormula || JSON.stringify(formula)
//     }

//     setIsSubmitting(true)
//     try {
//       await scheduleSalaryRevision(payload)
//       toast({ 
//         title: "Success", 
//         description: "Salary revision scheduled successfully." 
//       })
//       onSuccess()
//       setOpen(false)
//       resetForm()
//     } catch (error: any) {
//       toast({
//         title: "Failed to schedule revision",
//         description: error.message || "An unexpected error occurred.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       component_id: 0,
//       effective_date: "",
//       new_calculation_type: "Fixed",
//       new_value: 0,
//       new_based_on_component_id: undefined,
//       new_custom_formula: null,
//       reason: "",
//     })
//     setFormula([])
//     setCustomFormula('')
//     setRealTimePreview(0)
//   }

//   const renderFormulaPreview = () => {
//     if (formData.new_calculation_type !== 'Formula') return null
    
//     if (customFormula) {
//       return (
//         <div className="space-y-2">
//           <Label className="text-xs text-muted-foreground">Formula Preview</Label>
//           <div className="p-2 bg-muted rounded text-xs font-mono">
//             {customFormula}
//           </div>
//         </div>
//       )
//     }

//     if (formula.length === 0) return null

//     return (
//       <div className="space-y-2">
//         <Label className="text-xs text-muted-foreground">Formula Preview</Label>
//         <div className="p-2 bg-muted rounded text-xs font-mono">
//           {formula.map((part, idx) => (
//             <span key={idx} className={
//               part.type === 'component' ? 'text-blue-600 font-semibold' :
//               part.type === 'standard_parameter' ? 'text-green-600 font-semibold' :
//               part.type === 'operator' ? 'text-orange-600' :
//               part.type === 'number' ? 'text-purple-600' :
//               'text-gray-600'
//             }>
//               {part.value}{' '}
//             </span>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700">
//             <Plus className="h-4 w-4 mr-2" />
//             Schedule Revision
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Schedule Salary Revision
//           </DialogTitle>
//           <DialogDescription>
//             Plan a future change to a salary component. The change will be applied automatically on the effective date.
//           </DialogDescription>
//         </DialogHeader>

//         {isLoading ? (
//           <div className="space-y-4 py-4">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="grid grid-cols-4 items-center gap-4">
//                 <Skeleton className="h-4 w-20" />
//                 <Skeleton className="h-10 w-full col-span-3" />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-6 py-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="component">Component *</Label>
//                 <Select
//                   value={String(formData.component_id || '')}
//                   onValueChange={(v) => setFormData({ ...formData, component_id: parseInt(v) })}
//                   required
//                   disabled={isSubmitting}
//                 >
//                   <SelectTrigger id="component">
//                     <SelectValue placeholder="Select a component" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {components.map((c) => (
//                       <SelectItem key={c.id} value={String(c.id)}>
//                         <div className="flex items-center gap-2">
//                           <Badge variant={c.type === 'earning' ? 'default' : 'destructive'}>
//                             {c.type}
//                           </Badge>
//                           {c.name}
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="effective-date">Effective Date *</Label>
//                 <Input
//                   id="effective-date"
//                   type="date"
//                   value={formData.effective_date}
//                   onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
//                   min={new Date().toISOString().split('T')[0]}
//                   required
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="calc-type">New Calculation Type *</Label>
//               <Select
//                 value={formData.new_calculation_type}
//                 onValueChange={(v: any) => setFormData({ ...formData, new_calculation_type: v })}
//                 required
//                 disabled={isSubmitting}
//               >
//                 <SelectTrigger id="calc-type">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Fixed">Fixed Amount</SelectItem>
//                   <SelectItem value="Percentage">Percentage</SelectItem>
//                   <SelectItem value="Formula">Custom Formula</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {formData.new_calculation_type === 'Fixed' && (
//               <div className="space-y-2">
//                 <Label htmlFor="new-value">New Amount (AED) *</Label>
//                 <Input
//                   id="new-value"
//                   type="number"
//                   step="0.01"
//                   value={formData.new_value}
//                   onChange={(e) => setFormData({ ...formData, new_value: parseFloat(e.target.value) })}
//                   placeholder="Enter new fixed amount"
//                   required
//                   disabled={isSubmitting}
//                 />
//               </div>
//             )}

//             {formData.new_calculation_type === 'Percentage' && (
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="percentage">Percentage (%) *</Label>
//                   <Input
//                     id="percentage"
//                     type="number"
//                     step="0.01"
//                     value={formData.new_value}
//                     onChange={(e) => setFormData({ ...formData, new_value: parseFloat(e.target.value) })}
//                     placeholder="Enter percentage"
//                     required
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="based-on">Based On Component *</Label>
//                   <Select
//                     value={String(formData.new_based_on_component_id || '')}
//                     onValueChange={(v) => setFormData({ ...formData, new_based_on_component_id: parseInt(v) })}
//                     required
//                     disabled={isSubmitting}
//                   >
//                     <SelectTrigger id="based-on">
//                       <SelectValue placeholder="Select base component" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {structure.filter(s => s.component_type === 'earning').map((c) => (
//                         <SelectItem key={c.component_id} value={String(c.component_id)}>
//                           {c.component_name} ({formatAED(c.calculated_amount)})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}

//             {formData.new_calculation_type === 'Formula' && (
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="custom-formula">Custom Formula (Text)</Label>
//                   <Input
//                     id="custom-formula"
//                     value={customFormula}
//                     onChange={(e) => setCustomFormula(e.target.value)}
//                     placeholder="e.g., Basic * 0.15 + HRA"
//                     disabled={isSubmitting}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Enter a formula using component names and mathematical operators
//                   </p>
//                 </div>
//                 <div className="border-t pt-4">
//                   <Label className="mb-2 block">Or use Formula Builder</Label>
//                   <FormulaBuilder
//                     formula={formula}
//                     setFormula={setFormula}
//                     components={components}
//                     existingStructure={structure}
//                   />
//                 </div>
//                 {renderFormulaPreview()}
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="reason">Reason for Change *</Label>
//               <Textarea
//                 id="reason"
//                 value={formData.reason}
//                 onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                 placeholder="Enter reason for this salary revision..."
//                 rows={3}
//                 required
//                 disabled={isSubmitting}
//               />
//             </div>

//             <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200 dark:from-slate-900 dark:to-gray-900">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm flex items-center gap-2">
//                   <TrendingUp className="h-4 w-4" />
//                   Real-time Preview
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Estimated Amount:</span>
//                   <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
//                     {formatAED(realTimePreview)}
//                   </span>
//                 </div>
//                 {formData.new_calculation_type === 'Percentage' && formData.new_based_on_component_id && (
//                   <div className="mt-2 text-xs text-muted-foreground">
//                     {formData.new_value}% of {structure.find(s => s.component_id === formData.new_based_on_component_id)?.component_name || 'Selected Component'}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <DialogFooter>
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => {
//                   setOpen(false)
//                   resetForm()
//                 }}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit" 
//                 className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Scheduling...
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Schedule Revision
//                   </>
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import {
  ScheduleRevisionPayload,
  PayrollComponent,
  getPayrollComponents,
  scheduleSalaryRevision,
  getEmployeeSalaryStructure,
  type EmployeeSalaryStructure,
  type FormulaComponent,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, TrendingUp, Calculator } from "lucide-react"
import { FormulaBuilder } from "@/components/payroll/formula-builder"

// Format number as AED currency
const formatAED = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount)
}

interface ScheduleRevisionDialogProps {
  employeeId: number
  onSuccess: () => void
  trigger?: React.ReactNode
}

export function ScheduleRevisionDialog({
  employeeId,
  onSuccess,
  trigger
}: ScheduleRevisionDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [components, setComponents] = useState<PayrollComponent[]>([])
  const [structure, setStructure] = useState<EmployeeSalaryStructure[]>([])
  const [formula, setFormula] = useState<FormulaComponent[]>([])
  const [realTimePreview, setRealTimePreview] = useState(0)

  const [formData, setFormData] = useState<Omit<ScheduleRevisionPayload, "employee_id">>({
    component_id: 0,
    effective_date: "",
    new_calculation_type: "Fixed",
    new_value: 0,
    new_based_on_component_id: undefined,
    new_custom_formula: null,
    reason: "",
  })

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      Promise.all([
        getPayrollComponents(),
        getEmployeeSalaryStructure(employeeId)
      ])
        .then(([comps, struct]) => {
          setComponents(comps)
          setStructure(struct)
        })
        .catch(() => {
          toast({ 
            title: "Error", 
            description: "Could not fetch salary components.", 
            variant: "destructive" 
          })
        })
        .finally(() => setIsLoading(false))
    }
  }, [open, employeeId, toast])

  // Real-time preview calculation
  useEffect(() => {
    if (formData.new_calculation_type === 'Fixed') {
      setRealTimePreview(formData.new_value)
    } else if (formData.new_calculation_type === 'Percentage') {
      const baseComponent = structure.find(s => s.component_id === formData.new_based_on_component_id)
      const baseAmount = baseComponent?.calculated_amount || 0
      setRealTimePreview(formData.new_value * baseAmount / 100)
    } else {
      setRealTimePreview(0)
    }
  }, [formData, structure])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.component_id || !formData.effective_date || !formData.reason.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Please fill all required fields.", 
        variant: "destructive" 
      })
      return
    }

    if (formData.new_calculation_type === 'Percentage' && !formData.new_based_on_component_id) {
      toast({ 
        title: "Validation Error", 
        description: "Please select a base component for percentage calculation.", 
        variant: "destructive" 
      })
      return
    }

    if (formData.new_calculation_type === 'Formula' && formula.length === 0) {
      toast({ 
        title: "Validation Error", 
        description: "Please build a formula using the formula builder.", 
        variant: "destructive" 
      })
      return
    }

    const payload = { ...formData, employee_id: employeeId }
    
    if (formData.new_calculation_type === 'Formula') {
      payload.new_custom_formula = JSON.stringify(formula)
    } else {
      payload.new_custom_formula = null
    }

    if (formData.new_calculation_type !== 'Percentage') {
      payload.new_based_on_component_id = undefined
    }

    setIsSubmitting(true)
    try {
      await scheduleSalaryRevision(payload)
      toast({ 
        title: "Success", 
        description: "Salary revision scheduled successfully." 
      })
      onSuccess()
      setOpen(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Failed to schedule revision",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      component_id: 0,
      effective_date: "",
      new_calculation_type: "Fixed",
      new_value: 0,
      new_based_on_component_id: undefined,
      new_custom_formula: null,
      reason: "",
    })
    setFormula([])
    setRealTimePreview(0)
  }

  const renderFormula = (formulaComponents: FormulaComponent[]) => {
    return formulaComponents.map((part, idx) => {
      if (part.type === 'component') {
        const component = components.find(c => c.id === parseInt(part.value))
        return (
          <span key={idx} className="text-blue-600 dark:text-blue-400 font-semibold">
            {component?.name || `Component ${part.value}`}
            {idx < formulaComponents.length - 1 ? ' ' : ''}
          </span>
        )
      }
      return (
        <span key={idx} className={
          part.type === 'operator' ? 'text-orange-600 dark:text-orange-400' :
          part.type === 'number' ? 'text-purple-600 dark:text-purple-400' :
          part.type === 'parenthesis' ? 'text-gray-600 dark:text-gray-400' :
          'text-gray-600 dark:text-gray-400'
        }>
          {part.value}{idx < formulaComponents.length - 1 ? ' ' : ''}
        </span>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Revision
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Schedule Salary Revision
          </DialogTitle>
          <DialogDescription>
            Plan a future change to a salary component. The change will be applied automatically on the effective date.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full col-span-3" />
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="component">Component *</Label>
                <Select
                  value={String(formData.component_id || '')}
                  onValueChange={(v) => setFormData({ ...formData, component_id: parseInt(v) })}
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="component">
                    <SelectValue placeholder="Select a component" />
                  </SelectTrigger>
                  <SelectContent>
                    {components.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        <div className="flex items-center gap-2">
                          <Badge variant={c.type === 'earning' ? 'default' : 'destructive'}>
                            {c.type}
                          </Badge>
                          {c.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effective-date">Effective Date *</Label>
                <Input
                  id="effective-date"
                  type="date"
                  value={formData.effective_date}
                  onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calc-type">New Calculation Type *</Label>
              <Select
                value={formData.new_calculation_type}
                onValueChange={(v: any) => {
                  setFormData({ ...formData, new_calculation_type: v })
                  if (v !== 'Formula') setFormula([])
                }}
                required
                disabled={isSubmitting}
              >
                <SelectTrigger id="calc-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed">Fixed Amount</SelectItem>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Formula">Custom Formula</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.new_calculation_type === 'Fixed' && (
              <div className="space-y-2">
                <Label htmlFor="new-value">New Amount (AED) *</Label>
                <Input
                  id="new-value"
                  type="number"
                  step="0.01"
                  value={formData.new_value}
                  onChange={(e) => setFormData({ ...formData, new_value: parseFloat(e.target.value) })}
                  placeholder="Enter new fixed amount"
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

            {formData.new_calculation_type === 'Percentage' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage (%) *</Label>
                  <Input
                    id="percentage"
                    type="number"
                    step="0.01"
                    value={formData.new_value}
                    onChange={(e) => setFormData({ ...formData, new_value: parseFloat(e.target.value) })}
                    placeholder="Enter percentage"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="based-on">Based On Component *</Label>
                  <Select
                    value={String(formData.new_based_on_component_id || '')}
                    onValueChange={(v) => setFormData({ ...formData, new_based_on_component_id: parseInt(v) })}
                    required
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="based-on">
                      <SelectValue placeholder="Select base component" />
                    </SelectTrigger>
                    <SelectContent>
                      {structure.filter(s => s.component_type === 'earning').map((c) => (
                        <SelectItem key={c.component_id} value={String(c.component_id)}>
                          {c.component_name} ({formatAED(c.calculated_amount)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {formData.new_calculation_type === 'Formula' && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Formula Builder *</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Build your custom formula using the buttons below. Click components, operators, and numbers to construct your formula.
                  </p>
                  <FormulaBuilder
                    formula={formula}
                    setFormula={setFormula}
                    components={components}
                    existingStructure={structure}
                  />
                </div>
                {formula.length > 0 && (
                  <div className="p-3 bg-muted rounded-md border">
                    <div className="text-xs text-muted-foreground mb-1">Formula Preview:</div>
                    <div className="font-mono text-sm">
                      {renderFormula(formula)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Change *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Enter reason for this salary revision..."
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>

            <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200 dark:from-slate-900 dark:to-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Real-time Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated Amount:</span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatAED(realTimePreview)}
                  </span>
                </div>
                {formData.new_calculation_type === 'Percentage' && formData.new_based_on_component_id && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {formData.new_value}% of {structure.find(s => s.component_id === formData.new_based_on_component_id)?.component_name || 'Selected Component'}
                  </div>
                )}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setOpen(false)
                  resetForm()
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Revision
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
