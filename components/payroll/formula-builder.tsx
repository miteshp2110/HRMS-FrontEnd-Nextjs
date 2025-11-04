

// "use client"

// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import { getPayrollParams, type PayrollComponentDef, type FormulaComponent, type PayrollParameter, type EmployeeSalaryStructure } from "@/lib/api";
// import { ChevronDown, Plus, X, Calculator, Hash, Parentheses, Eye, Info, InfoIcon, Keyboard, Trash2 } from "lucide-react";
// import { Label } from "../ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Separator } from "@/components/ui/separator";

// interface FormulaBuilderProps {
//   formula: FormulaComponent[];
//   setFormula: React.Dispatch<React.SetStateAction<FormulaComponent[]>>;
//   components: PayrollComponentDef[];
//   existingStructure?: EmployeeSalaryStructure[];
// }

// export function FormulaBuilder({ formula, setFormula, components, existingStructure = [] }: FormulaBuilderProps) {
//     const [previewValues, setPreviewValues] = React.useState<{[key: string]: number}>({});
//     const containerRef = React.useRef<HTMLDivElement>(null);

//     React.useEffect(() => {
//         // Setup preview values
//         const mockValues: {[key: string]: number} = {};
        
//         existingStructure.forEach(comp => {
//             mockValues[`component_${comp.component_id}`] = comp.calculated_amount;
//         });
        
//         setPreviewValues(mockValues);
//     }, [existingStructure]);

//     // Keyboard support
//     React.useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             // Only handle if focused on the formula builder
//             if (!containerRef.current?.contains(document.activeElement)) return;

//             if (e.key >= '0' && e.key <= '9') {
//                 e.preventDefault();
//                 addToFormula({ type: 'number', value: e.key });
//             } else if (e.key === '.') {
//                 e.preventDefault();
//                 addToFormula({ type: 'number', value: '.' });
//             } else if (['+', '-', '*', '/'].includes(e.key)) {
//                 e.preventDefault();
//                 addToFormula({ type: 'operator', value: e.key });
//             } else if (e.key === '(' || e.key === ')') {
//                 e.preventDefault();
//                 addToFormula({ type: 'parenthesis', value: e.key });
//             } else if (e.key === 'Backspace') {
//                 e.preventDefault();
//                 removeLastItem();
//             } else if (e.key === 'Escape') {
//                 e.preventDefault();
//                 clearFormula();
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [formula]);

//     const addToFormula = (item: FormulaComponent) => {
//         setFormula(prev => [...prev, item]);
//     };

//     const removeFromFormula = (index: number) => {
//         setFormula(prev => prev.filter((_, i) => i !== index));
//     };

//     const removeLastItem = () => {
//         setFormula(prev => prev.slice(0, -1));
//     };

//     const clearFormula = () => {
//         setFormula([]);
//     };

//     const getDisplayName = (item: FormulaComponent) => {
//         if (item.type === 'component') {
//             const component = components.find(c => c.id === Number(item.value));
//             return component?.name || 'Unknown Component';
//         }
//         return item.value;
//     };

//     const getPreviewValue = (item: FormulaComponent): number => {
//         if (item.type === 'number') {
//             return parseFloat(item.value) || 0;
//         }
//         if (item.type === 'component') {
//             return previewValues[`component_${item.value}`] || 0;
//         }
//         return 0;
//     };

//     const evaluateFormula = (): number => {
//         try {
//             let expression = '';
//             for (const item of formula) {
//                 if (item.type === 'number' || item.type === 'operator' || item.type === 'parenthesis') {
//                     expression += item.value;
//                 } else {
//                     expression += getPreviewValue(item);
//                 }
//             }
            
//             if (expression && /^[0-9+\-*/.() ]+$/.test(expression)) {
//                 return eval(expression);
//             }
//             return 0;
//         } catch {
//             return 0;
//         }
//     };

//     const formatAED = (amount: number) => {
//         return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//     };

//     const getItemColor = (type: string) => {
//         switch (type) {
//             case 'component':
//                 return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
//             case 'operator':
//                 return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
//             case 'number':
//                 return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
//             case 'parenthesis':
//                 return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600';
//             default:
//                 return 'bg-muted text-muted-foreground';
//         }
//     };

//     const getItemIcon = (type: string) => {
//         switch (type) {
//             case 'component':
//                 return <Calculator className="h-3 w-3" />;
//             case 'operator':
//                 return <Plus className="h-3 w-3" />;
//             case 'number':
//                 return <Hash className="h-3 w-3" />;
//             case 'parenthesis':
//                 return <Parentheses className="h-3 w-3" />;
//             default:
//                 return null;
//         }
//     };

//     const renderFormula = () => (
//         <Card className="min-h-[100px] bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
//             <CardContent className="p-6">
//                 <div className="flex flex-wrap items-center gap-2 min-h-[50px]">
//                     {formula.length === 0 ? (
//                         <div className="text-muted-foreground text-sm italic flex items-center gap-3 w-full justify-center py-4">
//                             <Keyboard className="h-5 w-5" />
//                             <span>Click buttons or use your keyboard to build formula...</span>
//                         </div>
//                     ) : (
//                         formula.map((item, index) => (
//                             <TooltipProvider key={index}>
//                                 <Tooltip>
//                                     <TooltipTrigger asChild>
//                                         <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all hover:shadow-lg hover:scale-105 ${getItemColor(item.type)}`}>
//                                             {getItemIcon(item.type)}
//                                             <span className="font-mono">
//                                                 {getDisplayName(item)}
//                                             </span>
//                                             <button 
//                                                 type="button" 
//                                                 onClick={() => removeFromFormula(index)} 
//                                                 className="ml-1 hover:bg-black/20 dark:hover:bg-white/20 rounded p-0.5 transition-colors"
//                                             >
//                                                 <X className="h-3.5 w-3.5"/>
//                                             </button>
//                                         </div>
//                                     </TooltipTrigger>
//                                     <TooltipContent className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
//                                         <div className="text-xs space-y-1">
//                                             <div className="font-semibold">Type: {item.type}</div>
//                                             {item.type === 'component' && (
//                                                 <div>Value: {formatAED(getPreviewValue(item))}</div>
//                                             )}
//                                         </div>
//                                     </TooltipContent>
//                                 </Tooltip>
//                             </TooltipProvider>
//                         ))
//                     )}
//                 </div>
                
//                 {formula.length > 0 && (
//                     <div className="mt-4 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
//                         <div className="flex justify-between items-center">
//                             <span className="text-sm font-medium text-muted-foreground">Formula Preview:</span>
//                             <div className="flex items-center gap-3">
//                                 <Badge variant="outline" className="font-mono text-base py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
//                                     {formatAED(evaluateFormula())}
//                                 </Badge>
//                                 <Button 
//                                     type="button" 
//                                     variant="ghost" 
//                                     size="sm" 
//                                     onClick={clearFormula}
//                                     className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
//                                 >
//                                     <Trash2 className="h-4 w-4 mr-2" />
//                                     Clear All
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     );

//     // Filter out components with id 5 or 6
//     const availableComponents = components.filter(c => 
//         existingStructure.some(s => s.component_id === c.id) && c.id !== 5 && c.id !== 6
//     );
    
//     return (
//         <div className="space-y-6" ref={containerRef} tabIndex={0}>
//             <div className="flex items-center justify-between">
//                 <div>
//                     <Label className="text-lg font-bold">Formula Builder</Label>
//                     <p className="text-xs text-muted-foreground mt-1">Use keyboard or click to build your formula</p>
//                 </div>
//                 <Badge variant="secondary" className="text-xs flex items-center gap-1.5">
//                     <Keyboard className="h-3.5 w-3.5" />
//                     Keyboard Enabled
//                 </Badge>
//             </div>
            
//             {renderFormula()}
            
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Components */}
//                 <Card className="lg:col-span-1 border-2 dark:bg-slate-900/50">
//                     <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-slate-900">
//                         <CardTitle className="text-sm flex items-center gap-2">
//                             <Calculator className="h-4 w-4" />
//                             Salary Components
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="pt-4">
//                         <div className="flex flex-col gap-2">
//                             {availableComponents.length > 0 ? (
//                                 availableComponents.map(c => (
//                                     <Button
//                                         key={c.id}
//                                         type="button"
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => addToFormula({ type: 'component', value: String(c.id) })}
//                                         className="justify-start text-left hover:bg-blue-50 hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:border-blue-700 transition-all h-auto py-3"
//                                     >
//                                         <div className="flex flex-col gap-1 w-full">
//                                             <div className="flex items-center gap-2">
//                                                 <Calculator className="h-3.5 w-3.5" />
//                                                 <span className="font-semibold">{c.name}</span>
//                                             </div>
//                                             <span className="text-xs text-muted-foreground">
//                                                 {formatAED(previewValues[`component_${c.id}`] || 0)}
//                                             </span>
//                                         </div>
//                                     </Button>
//                                 ))
//                             ) : (
//                                 <div className="text-center py-8 text-sm text-muted-foreground italic">
//                                     <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                                     No components available
//                                 </div>
//                             )}
//                         </div>
//                     </CardContent>
//                 </Card>
                
//                 {/* Operators and Numbers */}
//                 <Card className="lg:col-span-2 border-2 dark:bg-slate-900/50">
//                     <CardHeader className="pb-3 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
//                         <CardTitle className="text-sm flex items-center gap-2">
//                             <Hash className="h-4 w-4" />
//                             Operators & Numbers
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="pt-4 space-y-6">
//                         {/* Operators */}
//                         <div>
//                             <Label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wide">Operators</Label>
//                             <div className="flex flex-wrap gap-2">
//                                 {[
//                                     { op: '+', label: 'Add', color: 'hover:bg-orange-100 hover:border-orange-400 dark:hover:bg-orange-950' },
//                                     { op: '-', label: 'Subtract', color: 'hover:bg-orange-100 hover:border-orange-400 dark:hover:bg-orange-950' },
//                                     { op: '*', label: 'Multiply', color: 'hover:bg-orange-100 hover:border-orange-400 dark:hover:bg-orange-950' },
//                                     { op: '/', label: 'Divide', color: 'hover:bg-orange-100 hover:border-orange-400 dark:hover:bg-orange-950' },
//                                 ].map(({ op, label, color }) => (
//                                     <TooltipProvider key={op}>
//                                         <Tooltip>
//                                             <TooltipTrigger asChild>
//                                                 <Button 
//                                                     type="button" 
//                                                     variant="outline" 
//                                                     size="lg"
//                                                     onClick={() => addToFormula({ type: 'operator', value: op })}
//                                                     className={`w-16 h-16 text-2xl font-bold transition-all ${color}`}
//                                                 >
//                                                     {op}
//                                                 </Button>
//                                             </TooltipTrigger>
//                                             <TooltipContent>{label}</TooltipContent>
//                                         </Tooltip>
//                                     </TooltipProvider>
//                                 ))}
//                             </div>
//                         </div>
                        
//                         {/* Parentheses */}
//                         <div>
//                             <Label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wide">Parentheses</Label>
//                             <div className="flex gap-2">
//                                 {['(', ')'].map(paren => (
//                                     <Button 
//                                         key={paren} 
//                                         type="button" 
//                                         variant="outline" 
//                                         size="lg"
//                                         onClick={() => addToFormula({ type: 'parenthesis', value: paren })}
//                                         className="w-16 h-16 text-2xl font-bold hover:bg-slate-100 hover:border-slate-400 dark:hover:bg-slate-800 transition-all"
//                                     >
//                                         {paren}
//                                     </Button>
//                                 ))}
//                             </div>
//                         </div>
                        
//                         <Separator className="my-4" />
                        
//                         {/* Numbers */}
//                         <div>
//                             <Label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wide">Numbers</Label>
//                             <div className="grid grid-cols-5 gap-2">
//                                 {Array.from({ length: 10 }, (_, i) => i).map(num => (
//                                     <Button 
//                                         key={num} 
//                                         type="button" 
//                                         variant="outline" 
//                                         size="lg"
//                                         onClick={() => addToFormula({ type: 'number', value: String(num) })}
//                                         className="aspect-square text-xl font-bold hover:bg-purple-100 hover:border-purple-400 dark:hover:bg-purple-950 transition-all"
//                                     >
//                                         {num}
//                                     </Button>
//                                 ))}
//                                 <Button 
//                                     type="button" 
//                                     variant="outline" 
//                                     size="lg"
//                                     onClick={() => addToFormula({ type: 'number', value: '.' })}
//                                     className="aspect-square text-xl font-bold hover:bg-purple-100 hover:border-purple-400 dark:hover:bg-purple-950 transition-all"
//                                 >
//                                     .
//                                 </Button>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
            
//             {/* Formula Breakdown */}
//             {formula.length > 0 && (
//                 <Card className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-slate-900 dark:to-emerald-950 border-2 border-emerald-200 dark:border-emerald-900">
//                     <CardContent className="p-6">
//                         <div className="flex items-center gap-2 mb-3">
//                             <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
//                             <Label className="text-base font-bold text-emerald-900 dark:text-emerald-100">Formula Breakdown</Label>
//                         </div>
//                         <div className="text-sm text-emerald-800 dark:text-emerald-200 font-mono bg-white dark:bg-slate-950 p-4 rounded-lg border-2 border-emerald-200 dark:border-emerald-900 mb-3">
//                             {formula.map((item, index) => (
//                                 <span key={index} className="mr-2">
//                                     {item.type === 'component'
//                                         ? `[${getDisplayName(item)}: ${formatAED(getPreviewValue(item))}]`
//                                         : item.value
//                                     }
//                                 </span>
//                             ))}
//                         </div>
//                         <div className="flex items-baseline gap-2">
//                             <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Calculated Result:</span>
//                             <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{formatAED(evaluateFormula())}</span>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* Keyboard shortcuts info */}
//             <Card className="bg-slate-50 dark:bg-slate-900/50 border-dashed">
//                 <CardContent className="p-4">
//                     <div className="flex items-start gap-3">
//                         <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
//                         <div className="text-xs text-muted-foreground space-y-1">
//                             <p className="font-semibold text-foreground">Keyboard Shortcuts:</p>
//                             <p><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">0-9</kbd> Numbers • <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">+ - * /</kbd> Operators • <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">( )</kbd> Parentheses</p>
//                             <p><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">Backspace</kbd> Remove last • <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">Esc</kbd> Clear all</p>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }




"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { getPayrollParams, type PayrollComponentDef, type FormulaComponent, type PayrollParameter, type EmployeeSalaryStructure } from "@/lib/api";
import { ChevronDown, Plus, X, Calculator, Hash, Parentheses, Eye, Info, InfoIcon, Keyboard, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface FormulaBuilderProps {
  formula: FormulaComponent[];
  setFormula: React.Dispatch<React.SetStateAction<FormulaComponent[]>>;
  components: PayrollComponentDef[];
  existingStructure?: EmployeeSalaryStructure[];
}

export function FormulaBuilder({ formula, setFormula, components, existingStructure = [] }: FormulaBuilderProps) {
    const [previewValues, setPreviewValues] = React.useState<{[key: string]: number}>({});
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Setup preview values
        const mockValues: {[key: string]: number} = {};
        
        existingStructure.forEach(comp => {
            mockValues[`component_${comp.component_id}`] = comp.calculated_amount;
        });
        
        setPreviewValues(mockValues);
    }, [existingStructure]);

    // Keyboard support
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only handle if focused on the formula builder
            if (!containerRef.current?.contains(document.activeElement)) return;

            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                addToFormula({ type: 'number', value: e.key });
            } else if (e.key === '.') {
                e.preventDefault();
                addToFormula({ type: 'number', value: '.' });
            } else if (['+', '-', '*', '/'].includes(e.key)) {
                e.preventDefault();
                addToFormula({ type: 'operator', value: e.key });
            } else if (e.key === '(' || e.key === ')') {
                e.preventDefault();
                addToFormula({ type: 'parenthesis', value: e.key });
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                removeLastItem();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                clearFormula();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [formula]);

    const addToFormula = (item: FormulaComponent) => {
        setFormula(prev => [...prev, item]);
    };

    const removeFromFormula = (index: number) => {
        setFormula(prev => prev.filter((_, i) => i !== index));
    };

    const removeLastItem = () => {
        setFormula(prev => prev.slice(0, -1));
    };

    const clearFormula = () => {
        setFormula([]);
    };

    const getDisplayName = (item: FormulaComponent) => {
        if (item.type === 'component') {
            const component = components.find(c => c.id === Number(item.value));
            return component?.name || 'Unknown Component';
        }
        return item.value;
    };

    const getPreviewValue = (item: FormulaComponent): number => {
        if (item.type === 'number') {
            return parseFloat(item.value) || 0;
        }
        if (item.type === 'component') {
            return previewValues[`component_${item.value}`] || 0;
        }
        return 0;
    };

    const evaluateFormula = (): number => {
        try {
            let expression = '';
            for (const item of formula) {
                if (item.type === 'number' || item.type === 'operator' || item.type === 'parenthesis') {
                    expression += item.value;
                } else {
                    expression += getPreviewValue(item);
                }
            }
            
            if (expression && /^[0-9+\-*/.() ]+$/.test(expression)) {
                return eval(expression);
            }
            return 0;
        } catch {
            return 0;
        }
    };

    const formatAED = (amount: number) => {
        return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getItemColor = (type: string) => {
        switch (type) {
            case 'component':
                return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
            case 'operator':
                return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
            case 'number':
                return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
            case 'parenthesis':
                return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getItemIcon = (type: string) => {
        switch (type) {
            case 'component':
                return <Calculator className="h-3 w-3" />;
            case 'operator':
                return <Plus className="h-3 w-3" />;
            case 'number':
                return <Hash className="h-3 w-3" />;
            case 'parenthesis':
                return <Parentheses className="h-3 w-3" />;
            default:
                return null;
        }
    };

    const renderFormula = () => (
        <Card className="min-h-[100px] bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2 min-h-[50px]">
                    {formula.length === 0 ? (
                        <div className="text-muted-foreground text-sm italic flex items-center gap-3 w-full justify-center py-4">
                            <Keyboard className="h-5 w-5" />
                            <span>Click buttons or use your keyboard to build formula...</span>
                        </div>
                    ) : (
                        formula.map((item, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all hover:shadow-lg hover:scale-105 ${getItemColor(item.type)}`}>
                                            {getItemIcon(item.type)}
                                            <span className="font-mono">
                                                {getDisplayName(item)}
                                            </span>
                                            <button 
                                                type="button" 
                                                onClick={() => removeFromFormula(index)} 
                                                className="ml-1 hover:bg-black/20 dark:hover:bg-white/20 rounded p-0.5 transition-colors"
                                            >
                                                <X className="h-3.5 w-3.5"/>
                                            </button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
                                        <div className="text-xs space-y-1">
                                            <div className="font-semibold">Type: {item.type}</div>
                                            {item.type === 'component' && (
                                                <div>Value: {formatAED(getPreviewValue(item))}</div>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))
                    )}
                </div>
                
                {formula.length > 0 && (
                    <div className="mt-4 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Formula Preview:</span>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="font-mono text-base py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                                    {formatAED(evaluateFormula())}
                                </Badge>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={clearFormula}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear All
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    // Filter out components with id 5 or 6
    const availableComponents = components.filter(c => 
        existingStructure.some(s => s.component_id === c.id) && c.id !== 5 && c.id !== 6
    );
    
    return (
        <div className="space-y-6" ref={containerRef} tabIndex={0}>
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-lg font-bold">Formula Builder</Label>
                    <p className="text-xs text-muted-foreground mt-1">Use keyboard or click to build your formula</p>
                </div>
                <Badge variant="secondary" className="text-xs flex items-center gap-1.5">
                    <Keyboard className="h-3.5 w-3.5" />
                    Keyboard Enabled
                </Badge>
            </div>
            
            {renderFormula()}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Components */}
                <Card className="lg:col-span-1 border-2 dark:bg-slate-900/50">
                    <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-slate-900">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            Salary Components
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex flex-col gap-2">
                            {availableComponents.length > 0 ? (
                                availableComponents.map(c => (
                                    <Button
                                        key={c.id}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addToFormula({ type: 'component', value: String(c.id) })}
                                        className="justify-start text-left hover:bg-blue-50 hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:border-blue-700 transition-all h-auto py-3"
                                    >
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex items-center gap-2">
                                                <Calculator className="h-3.5 w-3.5" />
                                                <span className="font-semibold">{c.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {formatAED(previewValues[`component_${c.id}`] || 0)}
                                            </span>
                                        </div>
                                    </Button>
                                ))
                            ) : (
                                <div className="text-center py-8 text-sm text-muted-foreground italic">
                                    <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    No components available
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                
                {/* Operators and Numbers */}
                <Card className="lg:col-span-2 border-2 dark:bg-slate-900/50">
                    <CardHeader className="pb-3 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Operators & Numbers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-6">
                        {/* Operators */}
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wide">Operators</Label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { op: '+', label: 'Add', color: 'hover:bg-orange-100 hover:border-orange-400 dark:hover:bg-orange-950' },
                                    { op: '-', label: 'Subtract', color: 'hover:bg-orange-100 hover:border-orange-400 dark:hover:bg-orange-950' },
                                    { op: '*', label: 'Multiply', color: 'hover:bg-orange-100 hover:border-orange-400 dark:hover:bg-orange-950' },
                                    { op: '/', label: 'Divide', color: 'hover:bg-orange-100 hover:border-orange-400 dark:hover:bg-orange-950' },
                                ].map(({ op, label, color }) => (
                                    <TooltipProvider key={op}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="lg"
                                                    onClick={() => addToFormula({ type: 'operator', value: op })}
                                                    className={`w-16 h-16 text-2xl font-bold transition-all ${color}`}
                                                >
                                                    {op}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>{label}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                        
                        {/* Parentheses */}
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wide">Parentheses</Label>
                            <div className="flex gap-2">
                                {['(', ')'].map(paren => (
                                    <Button 
                                        key={paren} 
                                        type="button" 
                                        variant="outline" 
                                        size="lg"
                                        onClick={() => addToFormula({ type: 'parenthesis', value: paren })}
                                        className="w-16 h-16 text-2xl font-bold hover:bg-slate-100 hover:border-slate-400 dark:hover:bg-slate-800 transition-all"
                                    >
                                        {paren}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        {/* Numbers */}
                        <div>
                            <Label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wide">Numbers</Label>
                            <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: 10 }, (_, i) => i).map(num => (
                                    <Button 
                                        key={num} 
                                        type="button" 
                                        variant="outline" 
                                        size="lg"
                                        onClick={() => addToFormula({ type: 'number', value: String(num) })}
                                        className="aspect-square text-xl font-bold hover:bg-purple-100 hover:border-purple-400 dark:hover:bg-purple-950 transition-all"
                                    >
                                        {num}
                                    </Button>
                                ))}
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="lg"
                                    onClick={() => addToFormula({ type: 'number', value: '.' })}
                                    className="aspect-square text-xl font-bold hover:bg-purple-100 hover:border-purple-400 dark:hover:bg-purple-950 transition-all"
                                >
                                    .
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Formula Breakdown */}
            {formula.length > 0 && (
                <Card className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-slate-900 dark:to-emerald-950 border-2 border-emerald-200 dark:border-emerald-900">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <Label className="text-base font-bold text-emerald-900 dark:text-emerald-100">Formula Breakdown</Label>
                        </div>
                        <div className="text-sm text-emerald-800 dark:text-emerald-200 font-mono bg-white dark:bg-slate-950 p-4 rounded-lg border-2 border-emerald-200 dark:border-emerald-900 mb-3">
                            {formula.map((item, index) => (
                                <span key={index} className="mr-2">
                                    {item.type === 'component'
                                        ? `[${getDisplayName(item)}: ${formatAED(getPreviewValue(item))}]`
                                        : item.value
                                    }
                                </span>
                            ))}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Calculated Result:</span>
                            <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{formatAED(evaluateFormula())}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Keyboard shortcuts info */}
            <Card className="bg-slate-50 dark:bg-slate-900/50 border-dashed">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p className="font-semibold text-foreground">Keyboard Shortcuts:</p>
                            <p><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">0-9</kbd> Numbers • <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">+ - * /</kbd> Operators • <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">( )</kbd> Parentheses</p>
                            <p><kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">Backspace</kbd> Remove last • <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">Esc</kbd> Clear all</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
