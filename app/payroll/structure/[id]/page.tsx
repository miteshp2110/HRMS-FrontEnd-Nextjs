
// "use client"

// import * as React from "react";
// import { useParams } from "next/navigation";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Plus, Trash2, Edit, DollarSign, Eye, Calculator, TrendingUp, PieChart, BarChart } from "lucide-react";
// import { 
//     getEmployeeSalaryStructure, 
//     getPayrollComponentDefs, 
//     assignSalaryComponent, 
//     removeSalaryComponent,
//     getDetailedUserProfile,
//     type EmployeeSalaryStructure,
//     type PayrollComponentDef,
//     type FormulaComponent,
//     type DetailedUserProfile
// } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { FormulaBuilder } from "@/components/payroll/formula-builder";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie } from 'recharts';

// export default function EmployeeSalaryStructurePage() {
//     const params = useParams();
//     const employeeId = Number(params.id);
//     const { toast } = useToast();

//     const [employee, setEmployee] = React.useState<DetailedUserProfile | null>(null);
//     const [structure, setStructure] = React.useState<EmployeeSalaryStructure[]>([]);
//     const [allComponents, setAllComponents] = React.useState<PayrollComponentDef[]>([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isDialogOpen, setIsDialogOpen] = React.useState(false);
//     const [editingComponent, setEditingComponent] = React.useState<EmployeeSalaryStructure | null>(null);
//     const [showDetails, setShowDetails] = React.useState<{[key: number]: boolean}>({});
//     const [realTimePreview, setRealTimePreview] = React.useState(0);

//     // Form state
//     const [componentId, setComponentId] = React.useState('');
//     const [calculationType, setCalculationType] = React.useState<'Fixed' | 'Percentage' | 'Formula'>('Fixed');
//     const [value, setValue] = React.useState('');
//     const [basedOn, setBasedOn] = React.useState('');
//     const [formula, setFormula] = React.useState<FormulaComponent[]>([]);

//     const fetchData = React.useCallback(async () => {
//         if (!employeeId) return;
//         setIsLoading(true);
//         try {
//             const [structureData, componentsData, employeeData] = await Promise.all([
//                 getEmployeeSalaryStructure(employeeId),
//                 getPayrollComponentDefs(),
//                 getDetailedUserProfile(employeeId)
//             ]);
//             setStructure(structureData);
//             setAllComponents(componentsData);
//             setEmployee(employeeData);
//         } catch (error: any) {
//             toast({ title: "Error", description: "Could not load salary structure data.", variant: "destructive" });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [employeeId, toast]);

//     React.useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     // Real-time preview calculation
//     React.useEffect(() => {
//         if (calculationType === 'Fixed') {
//             setRealTimePreview(Number(value) || 0);
//         } else if (calculationType === 'Percentage') {
//             const baseComponent = structure.find(s => s.component_id === Number(basedOn));
//             const baseAmount = baseComponent?.calculated_amount || 0;
//             setRealTimePreview((Number(value) || 0) * baseAmount / 100);
//         } else if (calculationType === 'Formula') {
//             // Simplified formula preview - in real app, you'd evaluate the formula
//             const hasNumbers = formula.some(f => f.type === 'number');
//             setRealTimePreview(hasNumbers ? 1000 : 0); // Mock calculation
//         }
//     }, [calculationType, value, basedOn, formula, structure]);

//     const handleRemove = async (componentId: number) => {
//         if (!window.confirm("Remove this component from the structure?")) return;
//         try {
//             await removeSalaryComponent(employeeId, componentId);
//             toast({ title: "Success", description: "Component removed." });
//             fetchData();
//         } catch (error: any) {
//             toast({ title: "Error", description: `Failed to remove: ${error.message}`, variant: "destructive" });
//         }
//     };

//     const handleEdit = (component: EmployeeSalaryStructure) => {
//         setEditingComponent(component);
//         setComponentId(String(component.component_id));
//         setCalculationType(component.calculation_type);
//         setValue(String(component.value || ''));
//         // Find the component ID from the name
//         const baseComponent = structure.find(s => s.component_name === component.based_on_component_name);
//         setBasedOn(String(baseComponent?.component_id || ''));
//         setFormula(component.custom_formula || []);
//         setIsDialogOpen(true);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         let payload: any = { 
//             component_id: Number(componentId), 
//             calculation_type: calculationType 
//         };
        
//         if (calculationType === 'Fixed') {
//             payload.value = Number(value);
//         }
//         if (calculationType === 'Percentage') { 
//             payload.value = Number(value); 
//             payload.based_on_component_id = Number(basedOn);
//         }
//         if (calculationType === 'Formula') {
//             payload.custom_formula = formula;
//         }

//         try {
//             await assignSalaryComponent(employeeId, payload);
//             toast({ 
//                 title: "Success", 
//                 description: editingComponent ? "Component updated." : "Component added to salary structure." 
//             });
//             fetchData();
//             resetForm();
//             setIsDialogOpen(false);
//         } catch (error: any) {
//              toast({ title: "Error", description: `Failed to save: ${error.message}`, variant: "destructive" });
//         }
//     };
    
//     const resetForm = () => {
//         setEditingComponent(null);
//         setComponentId('');
//         setCalculationType('Fixed');
//         setValue('');
//         setBasedOn('');
//         setFormula([]);
//         setRealTimePreview(0);
//     };

//     const toggleDetails = (componentId: number) => {
//         setShowDetails(prev => ({
//             ...prev,
//             [componentId]: !prev[componentId]
//         }));
//     };

//     const availableComponents = allComponents.filter(c => 
//         !structure.some(s => s.component_id === c.id) || 
//         (editingComponent && editingComponent.component_id === c.id)
//     );
    
//     const earnings = structure.filter(s => s.component_type === 'earning');
//     const deductions = structure.filter(s => s.component_type === 'deduction');
//     const totalEarnings = earnings.reduce((sum, item) => sum + item.calculated_amount, 0);
//     const totalDeductions = deductions.reduce((sum, item) => sum + item.calculated_amount, 0);
//     const netSalary = totalEarnings - totalDeductions;

//     // Chart data
//     const pieChartData = [
//         { name: 'Net Salary', value: netSalary, color: '#22c55e' },
//         { name: 'Deductions', value: totalDeductions, color: '#ef4444' }
//     ];

//     const barChartData = [
//         ...earnings.map(e => ({ name: e.component_name, amount: e.calculated_amount, type: 'earning' })),
//         ...deductions.map(d => ({ name: d.component_name, amount: d.calculated_amount, type: 'deduction' }))
//     ];

//     const renderCalculationDetails = (item: EmployeeSalaryStructure) => {
//         const isExpanded = showDetails[item.component_id];
        
//         return (
//             <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleDetails(item.component_id)}
//                         className="h-6 p-1"
//                     >
//                         <Eye className="h-3 w-3" />
//                     </Button>
//                     <span className="text-sm">
//                         {item.calculation_type === 'Fixed' && 'Fixed Amount'}
//                         {item.calculation_type === 'Percentage' && `${item.value}% of ${item.based_on_component_name}`}
//                         {item.calculation_type === 'Formula' && 'Custom Formula'}
//                     </span>
//                 </div>
                
//                 {isExpanded && (
//                     <div className="ml-8 p-3 bg-muted/50 rounded-md text-xs space-y-2">
//                         {item.calculation_type === 'Fixed' && (
//                             <div>
//                                 <div className="font-mono">Amount = ${item.value?.toLocaleString()}</div>
//                                 <div className="text-muted-foreground">Direct fixed amount</div>
//                             </div>
//                         )}
                        
//                         {item.calculation_type === 'Percentage' && (
//                             <div>
//                                 <div className="font-mono">
//                                     {item.value}% × {item.based_on_component_name} = ${item.calculated_amount.toLocaleString()}
//                                 </div>
//                                 <div className="text-muted-foreground">
//                                     Base Amount: ${(item.calculated_amount * 100 / (parseFloat(item.value!) || 1)).toLocaleString()}
//                                 </div>
//                             </div>
//                         )}
                        
//                         {item.calculation_type === 'Formula' && item.custom_formula && (
//                             <div>
//                                 <div className="font-mono text-xs bg-background p-2 rounded border">
//                                     {item.custom_formula.map((part, idx) => (
//                                         <span key={idx} className={
//                                             part.type === 'component' ? 'text-blue-600' :
//                                             part.type === 'standard_parameter' ? 'text-green-600' :
//                                             part.type === 'operator' ? 'text-orange-600' :
//                                             part.type === 'number' ? 'text-purple-600' :
//                                             'text-gray-600'
//                                         }>
//                                             {part.value}
//                                         </span>
//                                     ))}
//                                 </div>
//                                 <div className="text-muted-foreground mt-1">
//                                     Dynamic calculation based on formula
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     const renderFormulaPreview = () => {
//         if (formula.length === 0) return null;
        
//         return (
//             <div className="space-y-2">
//                 <Label className="text-xs text-muted-foreground">Formula Preview</Label>
//                 <div className="p-2 bg-muted rounded text-xs font-mono">
//                     {formula.map((part, idx) => (
//                         <span key={idx} className={
//                             part.type === 'component' ? 'text-blue-600 font-semibold' :
//                             part.type === 'standard_parameter' ? 'text-green-600 font-semibold' :
//                             part.type === 'operator' ? 'text-orange-600' :
//                             part.type === 'number' ? 'text-purple-600' :
//                             'text-gray-600'
//                         }>
//                             {part.value}{' '}
//                         </span>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     if (isLoading) {
//         return (
//             <MainLayout>
//                 <div className="flex items-center justify-center h-64">
//                     <div className="text-center">
//                         <Calculator className="h-8 w-8 animate-spin mx-auto mb-2" />
//                         <p>Loading salary structure...</p>
//                     </div>
//                 </div>
//             </MainLayout>
//         );
//     }

//     return (
//         <MainLayout>
//             <div className="space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div>
//                         <h1 className="text-3xl font-bold flex items-center gap-2">
//                             <DollarSign className="h-8 w-8" />
//                             Salary Structure
//                         </h1>
//                         <p className="text-muted-foreground">
//                             {employee ? `${employee.first_name} ${employee.last_name} - ID: ${employee.id}` : 'Loading...'}
//                         </p>
//                     </div>
//                     <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
//                         <Plus className="h-4 w-4 mr-2"/>
//                         Add Component
//                     </Button>
//                 </div>

//                 <Tabs defaultValue="structure" className="space-y-6">
//                     <TabsList className="grid w-full grid-cols-3">
//                         <TabsTrigger value="structure">Structure Details</TabsTrigger>
//                         <TabsTrigger value="analytics">Analytics</TabsTrigger>
//                         <TabsTrigger value="summary">Summary</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="structure" className="space-y-6">
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                             <div className="lg:col-span-2 space-y-6">
//                                 <Card className="border-green-200 bg-green-50/50">
//                                     <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
//                                         <CardTitle className="flex items-center gap-2">
//                                             <TrendingUp className="h-5 w-5" />
//                                             Earnings Components
//                                         </CardTitle>
//                                         <CardDescription className="text-green-100">
//                                             Components that add to the total salary
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent className="p-0">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Component</TableHead>
//                                                     <TableHead>Calculation Details</TableHead>
//                                                     <TableHead className="text-right">Amount</TableHead>
//                                                     <TableHead className="text-right">Actions</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {earnings.map(item => (
//                                                     <TableRow key={item.id} className="hover:bg-green-50">
//                                                         <TableCell className="font-medium">
//                                                             <div className="flex items-center gap-2">
//                                                                 <Badge variant="outline" className="text-green-700 border-green-300">
//                                                                     {item.component_name}
//                                                                 </Badge>
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             {renderCalculationDetails(item)}
//                                                         </TableCell>
//                                                         <TableCell className="text-right">
//                                                             <div className="space-y-1">
//                                                                 <div className="font-bold text-green-600 text-lg">
//                                                                     ${item.calculated_amount.toLocaleString()}
//                                                                 </div>
//                                                                 <Progress 
//                                                                     value={(item.calculated_amount / totalEarnings) * 100} 
//                                                                     className="h-1" 
//                                                                 />
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell className="text-right">
//                                                             <div className="flex gap-1 justify-end">
//                                                                 <Button 
//                                                                     variant="ghost" 
//                                                                     size="icon"
//                                                                     onClick={() => handleEdit(item)}
//                                                                     className="h-8 w-8"
//                                                                 >
//                                                                     <Edit className="h-4 w-4" />
//                                                                 </Button>
//                                                                 <Button 
//                                                                     variant="ghost" 
//                                                                     size="icon" 
//                                                                     onClick={() => handleRemove(item.component_id)}
//                                                                     className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
//                                                                 >
//                                                                     <Trash2 className="h-4 w-4" />
//                                                                 </Button>
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                                 {earnings.length === 0 && (
//                                                     <TableRow>
//                                                         <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
//                                                             No earning components added yet
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                             </TableBody>
//                                         </Table>
//                                     </CardContent>
//                                 </Card>

//                                 <Card className="border-red-200 bg-red-50/50">
//                                     <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
//                                         <CardTitle className="flex items-center gap-2">
//                                             <TrendingUp className="h-5 w-5 rotate-180" />
//                                             Deduction Components
//                                         </CardTitle>
//                                         <CardDescription className="text-red-100">
//                                             Components that reduce the total salary
//                                         </CardDescription>
//                                     </CardHeader>
//                                     <CardContent className="p-0">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Component</TableHead>
//                                                     <TableHead>Calculation Details</TableHead>
//                                                     <TableHead className="text-right">Amount</TableHead>
//                                                     <TableHead className="text-right">Actions</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {deductions.map(item => (
//                                                     <TableRow key={item.id} className="hover:bg-red-50">
//                                                         <TableCell className="font-medium">
//                                                             <div className="flex items-center gap-2">
//                                                                 <Badge variant="outline" className="text-red-700 border-red-300">
//                                                                     {item.component_name}
//                                                                 </Badge>
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             {renderCalculationDetails(item)}
//                                                         </TableCell>
//                                                         <TableCell className="text-right">
//                                                             <div className="space-y-1">
//                                                                 <div className="font-bold text-red-600 text-lg">
//                                                                     -${item.calculated_amount.toLocaleString()}
//                                                                 </div>
//                                                                 <Progress 
//                                                                     value={(item.calculated_amount / totalDeductions) * 100} 
//                                                                     className="h-1"
//                                                                 />
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell className="text-right">
//                                                             <div className="flex gap-1 justify-end">
//                                                                 <Button 
//                                                                     variant="ghost" 
//                                                                     size="icon"
//                                                                     onClick={() => handleEdit(item)}
//                                                                     className="h-8 w-8"
//                                                                 >
//                                                                     <Edit className="h-4 w-4" />
//                                                                 </Button>
//                                                                 <Button 
//                                                                     variant="ghost" 
//                                                                     size="icon" 
//                                                                     onClick={() => handleRemove(item.component_id)}
//                                                                     className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
//                                                                 >
//                                                                     <Trash2 className="h-4 w-4" />
//                                                                 </Button>
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                                 {deductions.length === 0 && (
//                                                     <TableRow>
//                                                         <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
//                                                             No deduction components added yet
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                             </TableBody>
//                                         </Table>
//                                     </CardContent>
//                                 </Card>
//                             </div>

//                             <div className="space-y-6">
//                                 <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
//                                     <CardHeader>
//                                         <CardTitle className="text-blue-900">Salary Summary</CardTitle>
//                                     </CardHeader>
//                                     <CardContent className="space-y-4">
//                                         <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
//                                             <span className="text-green-700 font-medium">Total Earnings</span>
//                                             <span className="font-bold text-xl text-green-800">
//                                                 ${totalEarnings.toLocaleString()}
//                                             </span>
//                                         </div>
//                                         <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg">
//                                             <span className="text-red-700 font-medium">Total Deductions</span>
//                                             <span className="font-bold text-xl text-red-800">
//                                                 -${totalDeductions.toLocaleString()}
//                                             </span>
//                                         </div>
//                                         <hr className="border-blue-200"/>
//                                         <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg">
//                                             <span className="font-semibold text-lg">Net Salary</span>
//                                             <span className="font-bold text-2xl">
//                                                 ${netSalary.toLocaleString()}
//                                             </span>
//                                         </div>
//                                         <div className="text-center text-sm text-muted-foreground">
//                                             Take-home pay after all deductions
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="analytics" className="space-y-6">
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className="flex items-center gap-2">
//                                         <PieChart className="h-5 w-5" />
//                                         Salary Breakdown
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <ResponsiveContainer width="100%" height={300}>
//                                         <RechartsPieChart>
//                                             <Pie
//                                                 data={pieChartData}
//                                                 cx="50%"
//                                                 cy="50%"
//                                                 innerRadius={60}
//                                                 outerRadius={100}
//                                                 dataKey="value"
//                                             >
//                                                 {pieChartData.map((entry, index) => (
//                                                     <Cell key={`cell-${index}`} fill={entry.color} />
//                                                 ))}
//                                             </Pie>
//                                             <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
//                                             <Legend />
//                                         </RechartsPieChart>
//                                     </ResponsiveContainer>
//                                 </CardContent>
//                             </Card>

//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle className="flex items-center gap-2">
//                                         <BarChart className="h-5 w-5" />
//                                         Component Analysis
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <ResponsiveContainer width="100%" height={300}>
//                                         <RechartsBarChart data={barChartData}>
//                                             <CartesianGrid strokeDasharray="3 3" />
//                                             <XAxis 
//                                                 dataKey="name" 
//                                                 angle={-45}
//                                                 textAnchor="end"
//                                                 height={80}
//                                                 fontSize={10}
//                                             />
//                                             <YAxis formatter={(value: any) => `$${value.toLocaleString()}`} />
//                                             <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
//                                             <Bar dataKey="amount" fill="#3b82f6" />
//                                         </RechartsBarChart>
//                                     </ResponsiveContainer>
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </TabsContent>

//                     <TabsContent value="summary" className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <Card className="text-center">
//                                 <CardContent className="pt-6">
//                                     <div className="text-3xl font-bold text-green-600">{earnings.length}</div>
//                                     <p className="text-sm text-muted-foreground">Earning Components</p>
//                                 </CardContent>
//                             </Card>
//                             <Card className="text-center">
//                                 <CardContent className="pt-6">
//                                     <div className="text-3xl font-bold text-red-600">{deductions.length}</div>
//                                     <p className="text-sm text-muted-foreground">Deduction Components</p>
//                                 </CardContent>
//                             </Card>
//                             <Card className="text-center">
//                                 <CardContent className="pt-6">
//                                     <div className="text-3xl font-bold text-blue-600">
//                                         {((netSalary / totalEarnings) * 100).toFixed(1)}%
//                                     </div>
//                                     <p className="text-sm text-muted-foreground">Net Salary Ratio</p>
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </TabsContent>
//                 </Tabs>
//             </div>

//             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
//                     <DialogHeader>
//                         <DialogTitle className="flex items-center gap-2">
//                             <Calculator className="h-5 w-5" />
//                             {editingComponent ? 'Edit Salary Component' : 'Add Salary Component'}
//                         </DialogTitle>
//                     </DialogHeader>
//                     <form onSubmit={handleSubmit} className="space-y-6 py-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <Label>Component</Label>
//                                 <Select onValueChange={setComponentId} value={componentId} required>
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select component..." />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {availableComponents.map(c => (
//                                             <SelectItem key={c.id} value={String(c.id)}>
//                                                 <div className="flex items-center gap-2">
//                                                     <Badge variant={c.type === 'earning' ? 'default' : 'destructive'}>
//                                                         {c.type}
//                                                     </Badge>
//                                                     {c.name}
//                                                 </div>
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label>Calculation Type</Label>
//                                 <Select value={calculationType} onValueChange={(v: any) => setCalculationType(v)} required>
//                                     <SelectTrigger>
//                                         <SelectValue />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="Fixed">Fixed Amount</SelectItem>
//                                         <SelectItem value="Percentage">Percentage</SelectItem>
//                                         <SelectItem value="Formula">Custom Formula</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>

//                         {calculationType === 'Fixed' && (
//                             <div className="space-y-2">
//                                 <Label>Amount ($)</Label>
//                                 <Input 
//                                     type="number" 
//                                     value={value} 
//                                     onChange={e => setValue(e.target.value)} 
//                                     placeholder="Enter fixed amount"
//                                     required
//                                 />
//                             </div>
//                         )}

//                         {calculationType === 'Percentage' && (
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label>Percentage (%)</Label>
//                                     <Input 
//                                         type="number" 
//                                         step="0.01"
//                                         value={value} 
//                                         onChange={e => setValue(e.target.value)} 
//                                         placeholder="Enter percentage"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label>Based On Component</Label>
//                                     <Select onValueChange={setBasedOn} value={basedOn} required>
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select base component..." />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {earnings.map(c => (
//                                                 <SelectItem key={c.component_id} value={String(c.component_id)}>
//                                                     {c.component_name} (${c.calculated_amount.toLocaleString()})
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                             </div>
//                         )}

//                         {calculationType === 'Formula' && (
//                             <div className="space-y-4">
//                                 <FormulaBuilder 
//                                     formula={formula} 
//                                     setFormula={setFormula} 
//                                     components={allComponents}
//                                     existingStructure={structure}
//                                 />
//                                 {renderFormulaPreview()}
//                             </div>
//                         )}

//                         {/* Real-time Preview */}
//                         <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
//                             <CardHeader className="pb-3">
//                                 <CardTitle className="text-sm flex items-center gap-2">
//                                     <Eye className="h-4 w-4" />
//                                     Real-time Preview
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="flex justify-between items-center">
//                                     <span className="text-sm text-muted-foreground">Calculated Amount:</span>
//                                     <span className="text-xl font-bold text-blue-600">
//                                         ${realTimePreview.toLocaleString()}
//                                     </span>
//                                 </div>
//                                 {calculationType === 'Percentage' && basedOn && (
//                                     <div className="mt-2 text-xs text-muted-foreground">
//                                         {value}% of {earnings.find(e => e.component_id === Number(basedOn))?.component_name || 'Selected Component'}
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>

//                         <DialogFooter>
//                             <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
//                                 Cancel
//                             </Button>
//                             <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
//                                 {editingComponent ? 'Update Component' : 'Add to Structure'}
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </MainLayout>
//     );
// }


"use client"

import * as React from "react";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit, DollarSign, Eye, Calculator, TrendingUp, PieChart, BarChart } from "lucide-react";
import { 
    getEmployeeSalaryStructure, 
    getPayrollComponentDefs, 
    assignSalaryComponent, 
    removeSalaryComponent,
    getDetailedUserProfile,
    type EmployeeSalaryStructure,
    type PayrollComponentDef,
    type FormulaComponent,
    type DetailedUserProfile
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { FormulaBuilder } from "@/components/payroll/formula-builder";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie } from 'recharts';

export default function EmployeeSalaryStructurePage() {
    const params = useParams();
    const employeeId = Number(params.id);
    const { toast } = useToast();

    const [employee, setEmployee] = React.useState<DetailedUserProfile | null>(null);
    const [structure, setStructure] = React.useState<EmployeeSalaryStructure[]>([]);
    const [allComponents, setAllComponents] = React.useState<PayrollComponentDef[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingComponent, setEditingComponent] = React.useState<EmployeeSalaryStructure | null>(null);
    const [showDetails, setShowDetails] = React.useState<{[key: number]: boolean}>({});
    const [realTimePreview, setRealTimePreview] = React.useState(0);

    // Form state
    const [componentId, setComponentId] = React.useState('');
    const [calculationType, setCalculationType] = React.useState<'Fixed' | 'Percentage' | 'Formula'>('Fixed');
    const [value, setValue] = React.useState('');
    const [basedOn, setBasedOn] = React.useState('');
    const [formula, setFormula] = React.useState<FormulaComponent[]>([]);

    const fetchData = React.useCallback(async () => {
        if (!employeeId) return;
        setIsLoading(true);
        try {
            const [structureData, componentsData, employeeData] = await Promise.all([
                getEmployeeSalaryStructure(employeeId),
                getPayrollComponentDefs(),
                getDetailedUserProfile(employeeId)
            ]);
            setStructure(structureData);
            setAllComponents(componentsData);
            setEmployee(employeeData);
        } catch (error: any) {
            toast({ title: "Error", description: "Could not load salary structure data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [employeeId, toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Real-time preview calculation
    React.useEffect(() => {
        if (calculationType === 'Fixed') {
            setRealTimePreview(Number(value) || 0);
        } else if (calculationType === 'Percentage') {
            const baseComponent = structure.find(s => s.component_id === Number(basedOn));
            const baseAmount = baseComponent?.calculated_amount || 0;
            setRealTimePreview((Number(value) || 0) * baseAmount / 100);
        } else if (calculationType === 'Formula') {
            // Simplified formula preview - in real app, you'd evaluate the formula
            const hasNumbers = formula.some(f => f.type === 'number');
            setRealTimePreview(hasNumbers ? 1000 : 0); // Mock calculation
        }
    }, [calculationType, value, basedOn, formula, structure]);

    const handleRemove = async (componentId: number) => {
        if (!window.confirm("Remove this component from the structure?")) return;
        try {
            await removeSalaryComponent(employeeId, componentId);
            toast({ title: "Success", description: "Component removed." });
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to remove: ${error.message}`, variant: "destructive" });
        }
    };

    const handleEdit = (component: EmployeeSalaryStructure) => {
        setEditingComponent(component);
        setComponentId(String(component.component_id));
        setCalculationType(component.calculation_type);
        setValue(String(component.value || ''));
        // Find the component ID from the name
        const baseComponent = structure.find(s => s.component_name === component.based_on_component_name);
        setBasedOn(String(baseComponent?.component_id || ''));
        setFormula(component.custom_formula || []);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let payload: any = { 
            component_id: Number(componentId), 
            calculation_type: calculationType 
        };
        
        if (calculationType === 'Fixed') {
            payload.value = Number(value);
        }
        if (calculationType === 'Percentage') { 
            payload.value = Number(value); 
            payload.based_on_component_id = Number(basedOn);
        }
        if (calculationType === 'Formula') {
            payload.custom_formula = formula;
        }

        try {
            await assignSalaryComponent(employeeId, payload);
            toast({ 
                title: "Success", 
                description: editingComponent ? "Component updated." : "Component added to salary structure." 
            });
            fetchData();
            resetForm();
            setIsDialogOpen(false);
        } catch (error: any) {
             toast({ title: "Error", description: `Failed to save: ${error.message}`, variant: "destructive" });
        }
    };
    
    const resetForm = () => {
        setEditingComponent(null);
        setComponentId('');
        setCalculationType('Fixed');
        setValue('');
        setBasedOn('');
        setFormula([]);
        setRealTimePreview(0);
    };

    const toggleDetails = (componentId: number) => {
        setShowDetails(prev => ({
            ...prev,
            [componentId]: !prev[componentId]
        }));
    };

    const availableComponents = allComponents.filter(c => 
        !structure.some(s => s.component_id === c.id) || 
        (editingComponent && editingComponent.component_id === c.id)
    );
    
    const earnings = structure.filter(s => s.component_type === 'earning');
    const deductions = structure.filter(s => s.component_type === 'deduction');
    const totalEarnings = earnings.reduce((sum, item) => sum + item.calculated_amount, 0);
    const totalDeductions = deductions.reduce((sum, item) => sum + item.calculated_amount, 0);
    const netSalary = totalEarnings - totalDeductions;

    // Chart data
    const pieChartData = [
        { name: 'Net Salary', value: netSalary, color: '#22c55e' },
        { name: 'Deductions', value: totalDeductions, color: '#ef4444' }
    ];

    const barChartData = [
        ...earnings.map(e => ({ name: e.component_name, amount: e.calculated_amount, type: 'earning' })),
        ...deductions.map(d => ({ name: d.component_name, amount: d.calculated_amount, type: 'deduction' }))
    ];

    const renderCalculationDetails = (item: EmployeeSalaryStructure) => {
        const isExpanded = showDetails[item.component_id];
        
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(item.component_id)}
                        className="h-6 p-1"
                    >
                        <Eye className="h-3 w-3" />
                    </Button>
                    <span className="text-sm">
                        {item.calculation_type === 'Fixed' && 'Fixed Amount'}
                        {item.calculation_type === 'Percentage' && `${item.value}% of ${item.based_on_component_name}`}
                        {item.calculation_type === 'Formula' && 'Custom Formula'}
                    </span>
                </div>
                
                {isExpanded && (
                    <div className="ml-8 p-3 bg-muted/50 rounded-md text-xs space-y-2">
                        {item.calculation_type === 'Fixed' && (
                            <div>
                                <div className="font-mono">Amount = ${item.value?.toLocaleString()}</div>
                                <div className="text-muted-foreground">Direct fixed amount</div>
                            </div>
                        )}
                        
                        {item.calculation_type === 'Percentage' && (
                            <div>
                                <div className="font-mono">
                                    {item.value}% × {item.based_on_component_name} = ${item.calculated_amount.toLocaleString()}
                                </div>
                                <div className="text-muted-foreground">
                                    Base Amount: ${(item.calculated_amount * 100 / (parseFloat(item.value!) || 1)).toLocaleString()}
                                </div>
                            </div>
                        )}
                        
                        {item.calculation_type === 'Formula' && item.custom_formula && (
                            <div>
                                <div className="font-mono text-xs bg-background p-2 rounded border">
                                    {item.custom_formula.map((part, idx) => (
                                        <span key={idx} className={
                                            part.type === 'component' ? 'text-blue-600' :
                                            part.type === 'standard_parameter' ? 'text-green-600' :
                                            part.type === 'operator' ? 'text-orange-600' :
                                            part.type === 'number' ? 'text-purple-600' :
                                            'text-gray-600'
                                        }>
                                            {part.type === 'component'?(allComponents.filter(c => c.id === parseInt(part.value)))[0].name:part.value}

                                        </span>
                                    ))}
                                </div>
                                <div className="text-muted-foreground mt-1">
                                    Dynamic calculation based on formula
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderFormulaPreview = () => {
        if (formula.length === 0) return null;
        
        return (
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Formula Preview</Label>
                <div className="p-2 bg-muted rounded text-xs font-mono">
                    {formula.map((part, idx) => (
                        <span key={idx} className={
                            part.type === 'component' ? 'text-blue-600 font-semibold' :
                            part.type === 'standard_parameter' ? 'text-green-600 font-semibold' :
                            part.type === 'operator' ? 'text-orange-600' :
                            part.type === 'number' ? 'text-purple-600' :
                            'text-gray-600'
                        }>
                            {part.value}{' '}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Calculator className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Loading salary structure...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <DollarSign className="h-8 w-8" />
                            Salary Structure
                        </h1>
                        <p className="text-muted-foreground">
                            {employee ? `${employee.first_name} ${employee.last_name} - ID: ${employee.id}` : 'Loading...'}
                        </p>
                    </div>
                    <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Component
                    </Button>
                </div>

                <Tabs defaultValue="structure" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="structure">Structure Details</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                    </TabsList>

                    <TabsContent value="structure" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="border-green-200 bg-green-50/50">
                                    <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Earnings Components
                                        </CardTitle>
                                        <CardDescription className="text-green-100">
                                            Components that add to the total salary
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Component</TableHead>
                                                    <TableHead>Calculation Details</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {earnings.map(item => (
                                                    <TableRow key={item.id} className="hover:bg-green-50">
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-green-700 border-green-300">
                                                                    {item.component_name}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {renderCalculationDetails(item)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="space-y-1">
                                                                <div className="font-bold text-green-600 text-lg">
                                                                    ${item.calculated_amount.toLocaleString()}
                                                                </div>
                                                                <Progress 
                                                                    value={(item.calculated_amount / totalEarnings) * 100} 
                                                                    className="h-1" 
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex gap-1 justify-end">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    onClick={() => handleEdit(item)}
                                                                    className="h-8 w-8"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    onClick={() => handleRemove(item.component_id)}
                                                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {earnings.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            No earning components added yet
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                <Card className="border-red-200 bg-red-50/50">
                                    <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 rotate-180" />
                                            Deduction Components
                                        </CardTitle>
                                        <CardDescription className="text-red-100">
                                            Components that reduce the total salary
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Component</TableHead>
                                                    <TableHead>Calculation Details</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {deductions.map(item => (
                                                    <TableRow key={item.id} className="hover:bg-red-50">
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-red-700 border-red-300">
                                                                    {item.component_name}
                                                                </Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {renderCalculationDetails(item)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="space-y-1">
                                                                <div className="font-bold text-red-600 text-lg">
                                                                    -${item.calculated_amount.toLocaleString()}
                                                                </div>
                                                                <Progress 
                                                                    value={(item.calculated_amount / totalDeductions) * 100} 
                                                                    className="h-1"
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex gap-1 justify-end">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    onClick={() => handleEdit(item)}
                                                                    className="h-8 w-8"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    onClick={() => handleRemove(item.component_id)}
                                                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {deductions.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            No deduction components added yet
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-6">
                                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-blue-900">Salary Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                                            <span className="text-green-700 font-medium">Total Earnings</span>
                                            <span className="font-bold text-xl text-green-800">
                                                ${totalEarnings.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg">
                                            <span className="text-red-700 font-medium">Total Deductions</span>
                                            <span className="font-bold text-xl text-red-800">
                                                -${totalDeductions.toLocaleString()}
                                            </span>
                                        </div>
                                        <hr className="border-blue-200"/>
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg">
                                            <span className="font-semibold text-lg">Net Salary</span>
                                            <span className="font-bold text-2xl">
                                                ${netSalary.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-center text-sm text-muted-foreground">
                                            Take-home pay after all deductions
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PieChart className="h-5 w-5" />
                                        Salary Breakdown
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                dataKey="value"
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                                            <Legend />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart className="h-5 w-5" />
                                        Component Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RechartsBarChart data={barChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="name" 
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                fontSize={10}
                                            />
                                            <YAxis tickFormatter={(value: any) => `${value.toLocaleString()}`} />
                                            <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                                            <Bar dataKey="amount" fill="#3b82f6" />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="summary" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-3xl font-bold text-green-600">{earnings.length}</div>
                                    <p className="text-sm text-muted-foreground">Earning Components</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-3xl font-bold text-red-600">{deductions.length}</div>
                                    <p className="text-sm text-muted-foreground">Deduction Components</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {((netSalary / totalEarnings) * 100).toFixed(1)}%
                                    </div>
                                    <p className="text-sm text-muted-foreground">Net Salary Ratio</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            {editingComponent ? 'Edit Salary Component' : 'Add Salary Component'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Component</Label>
                                <Select onValueChange={setComponentId} value={componentId} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select component..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableComponents.map(c => (
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
                                <Label>Calculation Type</Label>
                                <Select value={calculationType} onValueChange={(v: any) => setCalculationType(v)} required>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fixed">Fixed Amount</SelectItem>
                                        <SelectItem value="Percentage">Percentage</SelectItem>
                                        <SelectItem value="Formula">Custom Formula</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {calculationType === 'Fixed' && (
                            <div className="space-y-2">
                                <Label>Amount ($)</Label>
                                <Input 
                                    type="number" 
                                    value={value} 
                                    onChange={e => setValue(e.target.value)} 
                                    placeholder="Enter fixed amount"
                                    required
                                />
                            </div>
                        )}

                        {calculationType === 'Percentage' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Percentage (%)</Label>
                                    <Input 
                                        type="number" 
                                        step="0.01"
                                        value={value} 
                                        onChange={e => setValue(e.target.value)} 
                                        placeholder="Enter percentage"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Based On Component</Label>
                                    <Select onValueChange={setBasedOn} value={basedOn} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select base component..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {earnings.map(c => (
                                                <SelectItem key={c.component_id} value={String(c.component_id)}>
                                                    {c.component_name} (${c.calculated_amount.toLocaleString()})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {calculationType === 'Formula' && (
                            <div className="space-y-4">
                                <FormulaBuilder 
                                    formula={formula} 
                                    setFormula={setFormula} 
                                    components={allComponents}
                                    existingStructure={structure}
                                />
                                {renderFormulaPreview()}
                            </div>
                        )}

                        {/* Real-time Preview */}
                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Real-time Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Calculated Amount:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        ${realTimePreview.toLocaleString()}
                                    </span>
                                </div>
                                {calculationType === 'Percentage' && basedOn && (
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {value}% of {earnings.find(e => e.component_id === Number(basedOn))?.component_name || 'Selected Component'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                                {editingComponent ? 'Update Component' : 'Add to Structure'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}