"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { getPayrollParams, type PayrollComponentDef, type FormulaComponent, type PayrollParameter, type EmployeeSalaryStructure } from "@/lib/api";
import { ChevronDown, Plus, X, Calculator, Hash, Parentheses, Eye, Info, InfoIcon } from "lucide-react";
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
    const [params, setParams] = React.useState<PayrollParameter[]>([]);
    const [previewValues, setPreviewValues] = React.useState<{[key: string]: number}>({});
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchParams = async () => {
            setIsLoading(true);
            try {
                const parameters = await getPayrollParams();
                setParams(parameters);
                
                // Mock preview values for demonstration
                const mockValues: {[key: string]: number} = {};
                parameters.forEach(param => {
                    switch (param.value) {
                        case 'days_in_month':
                            mockValues[param.value] = 30;
                            break;
                        case 'normal_overtime_hours':
                            mockValues[param.value] = 8;
                            break;
                        case 'holiday_overtime_hours':
                            mockValues[param.value] = 4;
                            break;
                        case 'working_days':
                            mockValues[param.value] = 22;
                            break;
                        default:
                            mockValues[param.value] = 100; // Default mock value
                    }
                });
                
                // Add component values
                existingStructure.forEach(comp => {
                    mockValues[`component_${comp.component_id}`] = comp.calculated_amount;
                });
                
                setPreviewValues(mockValues);
            } catch (error) {
                console.error('Failed to fetch payroll parameters:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchParams();
    }, [existingStructure]);

    const addToFormula = (item: FormulaComponent) => {
        setFormula(prev => [...prev, item]);
    };

    const removeFromFormula = (index: number) => {
        setFormula(prev => prev.filter((_, i) => i !== index));
    };

    const insertAtPosition = (item: FormulaComponent, position: number) => {
        setFormula(prev => [
            ...prev.slice(0, position),
            item,
            ...prev.slice(position)
        ]);
    };

    const clearFormula = () => {
        setFormula([]);
    };

    const getDisplayName = (item: FormulaComponent) => {
        if (item.type === 'component') {
            const component = components.find(c => c.id === Number(item.value));
            return component?.name || 'Unknown Component';
        }
        if (item.type === 'standard_parameter') {
            const param = params.find(p => p.value === item.value);
            return param?.name || 'Unknown Param';
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
        if (item.type === 'standard_parameter') {
            return previewValues[item.value] || 0;
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
            
            // Simple evaluation - in production, use a safer formula parser
            if (expression && /^[0-9+\-*/.() ]+$/.test(expression)) {
                return eval(expression);
            }
            return 0;
        } catch {
            return 0;
        }
    };

    const getItemColor = (type: string) => {
        switch (type) {
            case 'component':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'standard_parameter':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'operator':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'number':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'parenthesis':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    const getItemIcon = (type: string) => {
        switch (type) {
            case 'component':
                return <Calculator className="h-3 w-3" />;
            case 'standard_parameter':
                return <InfoIcon className="h-3 w-3" />;
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
        <Card className="min-h-[80px] bg-gradient-to-r from-slate-50 to-gray-50">
            <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-2 min-h-[40px]">
                    {formula.length === 0 ? (
                        <div className="text-muted-foreground text-sm italic flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            Click buttons below to build your formula...
                        </div>
                    ) : (
                        formula.map((item, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-all hover:shadow-md ${getItemColor(item.type)}`}>
                                            {getItemIcon(item.type)}
                                            <span className="font-mono">
                                                {getDisplayName(item)}
                                            </span>
                                            <button 
                                                type="button" 
                                                onClick={() => removeFromFormula(index)} 
                                                className="ml-1 hover:bg-black/10 rounded p-0.5"
                                            >
                                                <X className="h-3 w-3"/>
                                            </button>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-xs">
                                            <div>Type: {item.type}</div>
                                            {(item.type === 'component' || item.type === 'standard_parameter') && (
                                                <div>Preview Value: {getPreviewValue(item)}</div>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))
                    )}
                </div>
                
                {formula.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Formula Preview:</span>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">
                                    Result: ${evaluateFormula().toLocaleString()}
                                </Badge>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={clearFormula}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    Clear All
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const availableComponents = components.filter(c => 
        existingStructure.some(s => s.component_id === c.id)
    );
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Formula Builder</Label>
                <Badge variant="outline" className="text-xs">
                    <Info className="h-3 w-3 mr-1" />
                    Interactive Formula Creation
                </Badge>
            </div>
            
            {renderFormula()}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Components and Parameters */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Components & Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-xs font-medium text-muted-foreground mb-2 block">SALARY COMPONENTS</Label>
                            <div className="flex flex-wrap gap-2">
                                {availableComponents.length > 0 ? (
                                    availableComponents.map(c => (
                                        <Button
                                            key={c.id}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addToFormula({ type: 'component', value: String(c.id) })}
                                            className="text-xs hover:bg-blue-50 hover:border-blue-300"
                                        >
                                            <Calculator className="h-3 w-3 mr-1" />
                                            {c.name}
                                        </Button>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">No components available</p>
                                )}
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                            <Label className="text-xs font-medium text-muted-foreground mb-2 block">PAYROLL PARAMETERS</Label>
                            <div className="flex flex-wrap gap-2">
                                {isLoading ? (
                                    <div className="text-xs text-muted-foreground">Loading parameters...</div>
                                ) : params.length > 0 ? (
                                    params.map(p => (
                                        <TooltipProvider key={p.value}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addToFormula({ type: 'standard_parameter', value: p.value })}
                                                        className="text-xs hover:bg-green-50 hover:border-green-300"
                                                    >
                                                        <InfoIcon className="h-3 w-3 mr-1" />
                                                        {p.name}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="text-xs">
                                                        <div>Parameter: {p.name}</div>
                                                        <div>Value: {p.value}</div>
                                                        <div>Preview: {previewValues[p.value] || 0}</div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">No parameters available</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Operators and Numbers */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Operators & Numbers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-xs font-medium text-muted-foreground mb-2 block">OPERATORS</Label>
                            <div className="flex flex-wrap gap-2">
                                {['+', '-', '*', '/'].map(op => (
                                    <Button 
                                        key={op} 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => addToFormula({ type: 'operator', value: op })}
                                        className="w-10 h-10 text-base font-bold hover:bg-orange-50 hover:border-orange-300"
                                    >
                                        {op}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <Label className="text-xs font-medium text-muted-foreground mb-2 block">PARENTHESES</Label>
                            <div className="flex gap-2">
                                {['(', ')'].map(paren => (
                                    <Button 
                                        key={paren} 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => addToFormula({ type: 'parenthesis', value: paren })}
                                        className="w-10 h-10 text-base font-bold hover:bg-gray-50 hover:border-gray-300"
                                    >
                                        {paren}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                            <Label className="text-xs font-medium text-muted-foreground mb-2 block">NUMBERS</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 10 }, (_, i) => i).map(num => (
                                    <Button 
                                        key={num} 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => addToFormula({ type: 'number', value: String(num) })}
                                        className="aspect-square hover:bg-purple-50 hover:border-purple-300"
                                    >
                                        {num}
                                    </Button>
                                ))}
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => addToFormula({ type: 'number', value: '.' })}
                                    className="aspect-square hover:bg-purple-50 hover:border-purple-300"
                                >
                                    .
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Formula Validation */}
            {formula.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <Label className="text-sm font-medium text-blue-900">Formula Breakdown</Label>
                        </div>
                        <div className="text-xs text-blue-700 font-mono bg-white p-2 rounded border">
                            {formula.map((item, index) => (
                                <span key={index} className="mr-1">
                                    {item.type === 'component' || item.type === 'standard_parameter' 
                                        ? `[${getDisplayName(item)}: ${getPreviewValue(item)}]`
                                        : item.value
                                    }
                                </span>
                            ))}
                        </div>
                        <div className="mt-2 text-sm">
                            <span className="text-blue-700">Calculated Result: </span>
                            <span className="font-bold text-blue-900">${evaluateFormula().toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}