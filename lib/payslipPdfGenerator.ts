import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==================== TYPES ====================
interface FormulaToken {
  type: 'component' | 'operator' | 'number' | 'parenthesis';
  value: string;
}

interface OvertimeRecord {
  date: string;
  shift_name: string;
  approved_hours: string;
}

interface CalculationBreakdown {
  source?: string;
  component_type?: string;
  calculation_method?: string;
  calculation_type?: string;
  reason?: string;
  timestamp?: string;
  adjusted_by?: number;
  added_by?: number;
  
  // Base Salary
  base_salary_structure?: {
    monthly_amount?: number;
    calculation_type?: string;
    component_id?: number;
  };
  period_details?: {
    start_date?: string;
    end_date?: string;
    total_days_in_period?: number;
  };
  rate_calculations?: {
    daily_rate?: number;
    daily_rate_formula?: string;
    hourly_rate?: number;
    hourly_rate_formula?: string;
  };
  shift_details?: {
    shift_name?: string;
    scheduled_hours?: number;
    from_time?: string;
    to_time?: string;
  };
  attendance_analysis?: {
    total_regular_hours?: number;
    total_worked_hours?: number;
    days_worked?: number;
    present_days?: number;
    half_days?: number;
    leave_days?: number;
    absent_days?: number;
  };
  final_calculation?: {
    formula?: string;
    regular_hours_worked?: number;
    computed_amount?: number;
  };
  
  // Percentage Based
  structurerule?: {
    basedoncomponent?: {
      name?: string;
      currentvalue?: number;
    };
    percentage?: number;
    configured_amount?: number;
    calculation_type?: string;
    configured_value?: number;
  };
  calculated_value?: number;
  calculated_amount?: number;
  
  // Prorated
  prorated_for_attendance?: boolean;
  total_days_in_period?: number;
  prorated_amount?: number;
  attendance_hours?: number;
  
  // Overtime
  overtime_details?: {
    type?: string;
    component_name?: string;
    total_approved_hours?: number;
    per_hour_rate?: number;
    fixed_rate_per_hour?: number;
    final_calculation?: string;
  };
  overtime_records?: OvertimeRecord[];
  base_component?: {
    name?: string;
    id?: number;
    value?: number;
  };
  percentage_calculation?: {
    percentage?: number;
    formula?: string;
    basedoncomponent?: {
      name?: string;
      currentvalue?: number;
    };
  };
  
  // Formula
  raw_formula_array?: FormulaToken[];
  parsed_expression?: string;
  component_values_used?: Record<string, number | string>;
  calculation_steps?: string;
  
  // HR Case
  case_details?: {
    case_number?: string;
    case_title?: string;
    category?: string;
    case_date?: string;
    raised_by?: string;
  };
  deduction_type?: string;
  deduction_details?: {
    deduction_reason?: string;
    approved_amount?: number;
  };
  
  // Expense
  expense_details?: {
    expense_id?: string;
    expense_title?: string;
    category?: string;
    expense_date?: string;
    approved_by?: string;
    approval_date?: string;
  };
  reimbursement_type?: string;
  reimbursement_details?: {
    reimbursement_method?: string;
    approved_amount?: number;
  };
  
  // Loan
  loan_details?: {
    application_number?: string;
    loan_type?: string;
    interest_rate?: number;
    due_date?: string;
  };
  schedule_details?: {
    principal_component?: number;
    interest_component?: number;
    breakdown_formula?: string;
    total_emi?: number;
  };
  
  computed_value?: number;
  computed_amount?: number;
  error?: string;
  error_details?: {
    message?: string;
    name?: string;
  };
}

interface PayslipComponentDetail {
  id: number;
  component_name: string;
  component_type: 'earning' | 'deduction';
  amount: number | string;
  group_name?: string;
  calculation_breakdown?: CalculationBreakdown;
}

interface PayslipDetails {
  employee_id: number;
  employee_name: string;
  cycle_name: string;
  start_date: string;
  end_date: string;
  status: string;
  gross_earnings: number | string;
  total_deductions: number | string;
  net_pay: number | string;
  details: PayslipComponentDetail[];
}

// ==================== PDF GENERATOR CLASS ====================
export class PayslipPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private currentY: number;
  private componentMap: Record<string, string>;
  private leftMargin: number = 15;
  private rightMargin: number = 15;
  private contentWidth: number;

  constructor(componentMap: Record<string, string> = {}) {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.currentY = 20;
    this.componentMap = componentMap;
    this.contentWidth = this.pageWidth - this.leftMargin - this.rightMargin;
  }

  // ==================== UTILITIES ====================
  private formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  }
  private formatTimeToTimezone(timeString: string): string  {
    try {
        const timeZone = localStorage.getItem('selectedTimezone') ?? 'UTC';

        // Combine today's date with given time as UTC
        const today = new Date().toISOString().split('T')[0]; // e.g. "2025-10-28"
        const utcDateTime = new Date(`${today}T${timeString}Z`); // 👈 interpret time as UTC

        // Convert and format for target timezone
        return utcDateTime.toLocaleString('en-AE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone,
        });
    } catch {
        return timeString;
    }
};

  private formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-AE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  private formatDateTime(dateString: string): string {
    try {
      return new Date(dateString).toLocaleString('en-AE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 20) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  private addSectionHeader(title: string, iconText: string, color: [number, number, number]): void {
    this.checkPageBreak(15);
    
    this.doc.setFillColor(color[0], color[1], color[2], 0.1);
    this.doc.roundedRect(this.leftMargin, this.currentY, this.contentWidth, 10, 2, 2, 'F');
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(color[0], color[1], color[2]);
    this.doc.text(`${iconText} ${title}`, this.leftMargin + 3, this.currentY + 7);
    
    this.currentY += 13;
  }

  private addInfoRow(label: string, value: string, indent: number = 0): void {
    this.checkPageBreak(6);
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(label + ':', this.leftMargin + 5 + indent, this.currentY);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    
    // Handle long text wrapping
    const maxWidth = this.contentWidth - 60 - indent;
    const lines = this.doc.splitTextToSize(value, maxWidth);
    lines.forEach((line: string, index: number) => {
      if (index > 0) {
        this.currentY += 4;
        this.checkPageBreak(4);
      }
      this.doc.text(line, this.leftMargin + 60 + indent, this.currentY);
    });
    
    this.currentY += 5;
  }

  private addSubheader(text: string, indent: number = 0): void {
    this.checkPageBreak(8);
    
    this.doc.setFillColor(245, 245, 245);
    this.doc.roundedRect(this.leftMargin + indent, this.currentY, this.contentWidth - indent, 7, 1, 1, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(50, 50, 50);
    this.doc.text(text, this.leftMargin + 3 + indent, this.currentY + 5);
    
    this.currentY += 10;
  }

  private addCodeBlock(code: string, indent: number = 0): void {
    this.checkPageBreak(10);
    
    this.doc.setFillColor(250, 250, 250);
    this.doc.setDrawColor(220, 220, 220);
    
    // Calculate required height based on text content
    const maxWidth = this.contentWidth - indent - 6;
    const lines = this.doc.splitTextToSize(code, maxWidth);
    const blockHeight = lines.length * 4 + 4;
    
    this.doc.roundedRect(this.leftMargin + indent, this.currentY, this.contentWidth - indent, blockHeight, 1, 1, 'FD');
    
    this.doc.setFontSize(8);
    this.doc.setFont('courier', 'normal');
    this.doc.setTextColor(0, 0, 0);
    
    // const maxWidth = this.contentWidth - indent - 6;
    // const lines = this.doc.splitTextToSize(code, maxWidth);
    // const blockHeight = lines.length * 4 + 4;
    
    this.doc.roundedRect(this.leftMargin + indent, this.currentY, this.contentWidth - indent, blockHeight, 1, 1, 'FD');
    
    lines.forEach((line: string, index: number) => {
      this.doc.text(line, this.leftMargin + 3 + indent, this.currentY + 5 + (index * 4));
    });
    
    this.currentY += blockHeight + 3;
  }

  // ==================== BREAKDOWN RENDERERS ====================
  private renderManualAdjustment(breakdown: CalculationBreakdown): void {
    this.addSubheader('Manual Adjustment Details', 5);
    
    if (breakdown.reason) {
      this.addInfoRow('Reason', breakdown.reason, 5);
    }
    if (breakdown.adjusted_by || breakdown.added_by) {
      this.addInfoRow('Adjusted By', `User ID: ${breakdown.adjusted_by || breakdown.added_by}`, 5);
    }
    if (breakdown.timestamp) {
      this.addInfoRow('Timestamp', this.formatDateTime(breakdown.timestamp), 5);
    }
    
    this.currentY += 3;
  }

  private renderBaseSalary(breakdown: CalculationBreakdown): void {
    // Base Salary Structure
    if (breakdown.base_salary_structure) {
      this.addSubheader('Base Salary Structure', 5);
      this.addInfoRow('Monthly Amount', this.formatCurrency(breakdown.base_salary_structure.monthly_amount || 0), 5);
      if (breakdown.base_salary_structure.calculation_type) {
        this.addInfoRow('Calculation Type', breakdown.base_salary_structure.calculation_type, 5);
      }
      if (breakdown.base_salary_structure.component_id) {
        this.addInfoRow('Component ID', String(breakdown.base_salary_structure.component_id), 5);
      }
      this.currentY += 3;
    }

    // Period Details
    if (breakdown.period_details) {
      this.addSubheader('Period Details', 5);
      if (breakdown.period_details.start_date) {
        this.addInfoRow('Start Date', this.formatDate(breakdown.period_details.start_date), 5);
      }
      if (breakdown.period_details.end_date) {
        this.addInfoRow('End Date', this.formatDate(breakdown.period_details.end_date), 5);
      }
      if (breakdown.period_details.total_days_in_period) {
        this.addInfoRow('Total Days in Period', String(breakdown.period_details.total_days_in_period), 5);
      }
      this.currentY += 3;
    }

    // Rate Calculations
    if (breakdown.rate_calculations) {
      this.addSubheader('Rate Calculations', 5);
      if (breakdown.rate_calculations.daily_rate !== undefined) {
        this.addInfoRow('Daily Rate', this.formatCurrency(breakdown.rate_calculations.daily_rate), 5);
      }
      if (breakdown.rate_calculations.daily_rate_formula) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('Formula:', this.leftMargin + 10, this.currentY);
        this.currentY += 4;
        this.addCodeBlock(breakdown.rate_calculations.daily_rate_formula, 10);
      }
      if (breakdown.rate_calculations.hourly_rate !== undefined) {
        this.addInfoRow('Hourly Rate', this.formatCurrency(breakdown.rate_calculations.hourly_rate), 5);
      }
      if (breakdown.rate_calculations.hourly_rate_formula) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('Formula:', this.leftMargin + 10, this.currentY);
        this.currentY += 4;
        this.addCodeBlock(breakdown.rate_calculations.hourly_rate_formula, 10);
      }
      this.currentY += 3;
    }

    // Shift Details
    if (breakdown.shift_details) {
      this.addSubheader('Shift Details', 5);
      if (breakdown.shift_details.shift_name) {
        this.addInfoRow('Shift Name', breakdown.shift_details.shift_name, 5);
      }
      if (breakdown.shift_details.scheduled_hours) {
        this.addInfoRow('Scheduled Hours', `${breakdown.shift_details.scheduled_hours} hours/day`, 5);
      }
      if (breakdown.shift_details.from_time && breakdown.shift_details.to_time) {
        this.addInfoRow('Time', `${this.formatTimeToTimezone(breakdown.shift_details.from_time)} - ${this.formatTimeToTimezone(breakdown.shift_details.to_time)}`, 5);
      }
      this.currentY += 3;
    }

    // Attendance Analysis
    if (breakdown.attendance_analysis) {
      this.addSubheader('Attendance Analysis', 5);
      if (breakdown.attendance_analysis.total_regular_hours !== undefined) {
        this.addInfoRow('Total Regular Hours', `${breakdown.attendance_analysis.total_regular_hours} hrs`, 5);
      }
      if (breakdown.attendance_analysis.total_worked_hours !== undefined) {
        this.addInfoRow('Total Worked Hours', `${breakdown.attendance_analysis.total_worked_hours} hrs`, 5);
      }
      if (breakdown.attendance_analysis.days_worked !== undefined) {
        this.addInfoRow('Days Worked', String(breakdown.attendance_analysis.days_worked), 5);
      }
      if (breakdown.attendance_analysis.present_days !== undefined) {
        this.addInfoRow('Present Days', String(breakdown.attendance_analysis.present_days), 5);
      }
      if (breakdown.attendance_analysis.half_days !== undefined) {
        this.addInfoRow('Half Days', String(breakdown.attendance_analysis.half_days), 5);
      }
      if (breakdown.attendance_analysis.leave_days !== undefined) {
        this.addInfoRow('Leave Days', String(breakdown.attendance_analysis.leave_days), 5);
      }
      if (breakdown.attendance_analysis.absent_days !== undefined) {
        this.addInfoRow('Absent Days', String(breakdown.attendance_analysis.absent_days), 5);
      }
      this.currentY += 3;
    }

    // Final Calculation
    if (breakdown.final_calculation) {
      this.addSubheader('Final Calculation', 5);
      if (breakdown.final_calculation.formula) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('Formula:', this.leftMargin + 10, this.currentY);
        this.currentY += 4;
        this.addCodeBlock(breakdown.final_calculation.formula, 10);
      }
      if (breakdown.final_calculation.regular_hours_worked !== undefined) {
        this.addInfoRow('Regular Hours Worked', `${breakdown.final_calculation.regular_hours_worked} hrs`, 5);
      }
      if (breakdown.final_calculation.computed_amount !== undefined) {
        this.addInfoRow('Computed Amount', this.formatCurrency(breakdown.final_calculation.computed_amount), 5);
      }
      this.currentY += 3;
    }
  }

  private renderPercentageBased(breakdown: CalculationBreakdown): void {
    this.addSubheader('Percentage Based Calculation', 5);
    
    if (breakdown.structurerule?.basedoncomponent) {
      this.addInfoRow('Based On Component', breakdown.structurerule.basedoncomponent.name || 'N/A', 5);
      if (breakdown.structurerule.basedoncomponent.currentvalue !== undefined) {
        this.addInfoRow('Base Value', this.formatCurrency(breakdown.structurerule.basedoncomponent.currentvalue), 5);
      }
    }
    
    if (breakdown.structurerule?.percentage !== undefined) {
      this.addInfoRow('Percentage Applied', `${breakdown.structurerule.percentage}%`, 5);
    }
    
    if (breakdown.percentage_calculation?.basedoncomponent) {
      this.addInfoRow('Reference Component', breakdown.percentage_calculation.basedoncomponent.name || 'N/A', 5);
      if (breakdown.percentage_calculation.basedoncomponent.currentvalue !== undefined) {
        this.addInfoRow('Reference Value', this.formatCurrency(breakdown.percentage_calculation.basedoncomponent.currentvalue), 5);
      }
    }
    
    if (breakdown.percentage_calculation?.formula) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('Calculation Formula:', this.leftMargin + 10, this.currentY);
      this.currentY += 4;
      this.addCodeBlock(breakdown.percentage_calculation.formula, 10);
    }
    
    if (breakdown.calculated_value !== undefined || breakdown.calculated_amount !== undefined) {
      this.addInfoRow('Calculated Value', this.formatCurrency(breakdown.calculated_value || breakdown.calculated_amount || 0), 5);
    }
    
    // Prorated attendance if applicable
    if (breakdown.prorated_for_attendance) {
      this.currentY += 2;
      this.addSubheader('Prorated for Attendance', 5);
      if (breakdown.attendance_hours !== undefined) {
        this.addInfoRow('Attendance Hours', `${breakdown.attendance_hours} hrs`, 5);
      }
      if (breakdown.total_days_in_period !== undefined) {
        this.addInfoRow('Total Days in Period', String(breakdown.total_days_in_period), 5);
      }
    }
    
    this.currentY += 3;
  }

  private renderFixedProrated(breakdown: CalculationBreakdown): void {
    this.addSubheader('Fixed Amount Prorated', 5);
    
    if (breakdown.structurerule?.configured_amount !== undefined) {
      this.addInfoRow('Configured Amount', this.formatCurrency(breakdown.structurerule.configured_amount), 5);
    }
    
    if (breakdown.prorated_for_attendance !== undefined) {
      this.addInfoRow('Prorated for Attendance', breakdown.prorated_for_attendance ? 'Yes' : 'No', 5);
    }
    
    if (breakdown.total_days_in_period !== undefined) {
      this.addInfoRow('Total Days in Period', String(breakdown.total_days_in_period), 5);
    }
    
    if (breakdown.prorated_amount !== undefined) {
      this.addInfoRow('Prorated Amount', this.formatCurrency(breakdown.prorated_amount), 5);
    }
    
    this.currentY += 3;
  }

  private renderOvertime(breakdown: CalculationBreakdown): void {
    // Overtime Details
    if (breakdown.overtime_details) {
      this.addSubheader('Overtime Details', 5);
      
      if (breakdown.overtime_details.type) {
        this.addInfoRow('Overtime Type', breakdown.overtime_details.type, 5);
      }
      if (breakdown.overtime_details.component_name) {
        this.addInfoRow('Component Name', breakdown.overtime_details.component_name, 5);
      }
      if (breakdown.overtime_details.total_approved_hours !== undefined) {
        this.addInfoRow('Total Approved Hours', `${breakdown.overtime_details.total_approved_hours} hrs`, 5);
      }
      if (breakdown.overtime_details.per_hour_rate !== undefined) {
        this.addInfoRow('Rate Per Hour', this.formatCurrency(breakdown.overtime_details.per_hour_rate), 5);
      }
      if (breakdown.overtime_details.fixed_rate_per_hour !== undefined) {
        this.addInfoRow('Fixed Rate Per Hour', this.formatCurrency(breakdown.overtime_details.fixed_rate_per_hour), 5);
      }
      
      this.currentY += 3;
    }

    // Base Component
    if (breakdown.base_component) {
      this.addSubheader('Base Component', 5);
      if (breakdown.base_component.name) {
        this.addInfoRow('Component Name', breakdown.base_component.name, 5);
      }
      if (breakdown.base_component.id) {
        this.addInfoRow('Component ID', String(breakdown.base_component.id), 5);
      }
      if (breakdown.base_component.value !== undefined) {
        this.addInfoRow('Value', this.formatCurrency(breakdown.base_component.value), 5);
      }
      this.currentY += 3;
    }

    // Percentage Calculation
    if (breakdown.percentage_calculation) {
      this.addSubheader('Rate Calculation', 5);
      if (breakdown.percentage_calculation.percentage !== undefined) {
        this.addInfoRow('Percentage', `${breakdown.percentage_calculation.percentage}%`, 5);
      }
      if (breakdown.percentage_calculation.formula) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('Formula:', this.leftMargin + 10, this.currentY);
        this.currentY += 4;
        this.addCodeBlock(breakdown.percentage_calculation.formula, 10);
      }
      this.currentY += 3;
    }

    // Overtime Records
    if (breakdown.overtime_records && breakdown.overtime_records.length > 0) {
      this.checkPageBreak(40);
      
      this.addSubheader('Approved Overtime Records', 5);
      
      const tableData = breakdown.overtime_records.map(record => [
        this.formatDate(record.date),
        record.shift_name || 'N/A',
        `${parseFloat(record.approved_hours).toFixed(2)} hrs`
      ]);

      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Date', 'Shift', 'Approved Hours']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 60 },
          2: { cellWidth: 'auto', halign: 'right' }
        },
        margin: { left: this.leftMargin + 5, right: this.rightMargin }
      });

      this.currentY = (this.doc as any).lastAutoTable.finalY + 5;
      
      if (breakdown.overtime_details?.total_approved_hours) {
        this.doc.setFillColor(240, 240, 240);
        this.doc.roundedRect(this.leftMargin + 5, this.currentY, this.contentWidth - 10, 8, 1, 1, 'F');
        
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(0, 0, 0);
        this.doc.text('Total:', this.leftMargin + 10, this.currentY + 5);
        this.doc.text(`${breakdown.overtime_details.total_approved_hours} hrs`, 
                     this.pageWidth - this.rightMargin - 10, this.currentY + 5, { align: 'right' });
        
        this.currentY += 12;
      }
    }

    // Final Calculation
    if (breakdown.final_calculation || breakdown.overtime_details?.final_calculation) {
      this.addSubheader('Final Overtime Pay', 5);
      const calculation = breakdown.final_calculation || breakdown.overtime_details?.final_calculation;
      if (calculation) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('Calculation:', this.leftMargin + 10, this.currentY);
        this.currentY += 4;
        if (typeof calculation === 'string') {
          this.addCodeBlock(calculation, 10);
        } else if (calculation && typeof calculation === 'object' && calculation.formula) {
          this.addCodeBlock(calculation.formula, 10);
        }
      }
      
      const amount = breakdown.computed_value || breakdown.computed_amount || 
                    (breakdown.overtime_details?.fixed_rate_per_hour && breakdown.overtime_details?.total_approved_hours
                      ? breakdown.overtime_details.fixed_rate_per_hour * breakdown.overtime_details.total_approved_hours
                      : 0);
      
      if (amount) {
        this.addInfoRow('Computed Amount', this.formatCurrency(amount), 5);
      }
      
      this.currentY += 3;
    }
  }

  private renderFormula(breakdown: CalculationBreakdown): void {
    this.addSubheader('Custom Formula Calculation', 5);

    if (breakdown.overtime_records && breakdown.overtime_records.length > 0) {
      this.checkPageBreak(40);
      
      this.addSubheader('Approved Overtime Records', 5);
      
      const tableData = breakdown.overtime_records.map(record => [
        this.formatDate(record.date),
        record.shift_name || 'N/A',
        `${parseFloat(record.approved_hours).toFixed(2)} hrs`
      ]);

      autoTable(this.doc, {
        startY: this.currentY,
        head: [['Date', 'Shift', 'Approved Hours']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 60 },
          2: { cellWidth: 'auto', halign: 'right' }
        },
        margin: { left: this.leftMargin + 5, right: this.rightMargin }
      });

      this.currentY = (this.doc as any).lastAutoTable.finalY + 5;
      
      if (breakdown.overtime_details?.total_approved_hours) {
        this.doc.setFillColor(240, 240, 240);
        this.doc.roundedRect(this.leftMargin + 5, this.currentY, this.contentWidth - 10, 8, 1, 1, 'F');
        
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(0, 0, 0);
        this.doc.text('Total:', this.leftMargin + 10, this.currentY + 5);
        this.doc.text(`${breakdown.overtime_details.total_approved_hours} hrs`, 
                     this.pageWidth - this.rightMargin - 10, this.currentY + 5, { align: 'right' });
        
        this.currentY += 12;
      }
    }
    
    // Raw Formula Array
    if (breakdown.raw_formula_array && breakdown.raw_formula_array.length > 0) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('Formula Structure:', this.leftMargin + 10, this.currentY);
      this.currentY += 4;
      
      const formulaText = breakdown.raw_formula_array
        .map(token => {
          if (token.type === 'component' && this.componentMap[token.value]) {
            return this.componentMap[token.value];
          }
          return token.value;
        })
        .join(' ');
      
      this.addCodeBlock(formulaText, 10);
    }

    // Component Values Used
    if (breakdown.component_values_used && Object.keys(breakdown.component_values_used).length > 0) {
      this.addSubheader('Component Values', 10);
      
      Object.entries(breakdown.component_values_used).forEach(([key, value]) => {
        const componentName = this.componentMap[key.split('_')[1]] || key;
        const displayValue = typeof value === 'number' ? this.formatCurrency(value) : String(value);
        this.addInfoRow(componentName, displayValue, 10);
      });
      
      this.currentY += 2;
    }

    // Parsed Expression
    if (breakdown.parsed_expression) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('Evaluated Expression:', this.leftMargin + 10, this.currentY);
      this.currentY += 4;
      this.addCodeBlock(breakdown.parsed_expression, 10);
    }

    // Calculation Steps
    // if (breakdown.calculation_steps) {
    //   this.doc.setFontSize(8);
    //   this.doc.setTextColor(100, 100, 100);
    //   this.doc.text('Calculation Process:', this.leftMargin + 10, this.currentY);
    //   this.currentY += 4;
      
    //   // Parse and display calculation steps
    //   const steps = breakdown.calculation_steps;
    //   this.checkPageBreak(30);
      
    //   this.doc.setFillColor(255, 248, 220);
    //   this.doc.setDrawColor(255, 193, 7);
    //   this.doc.setLineWidth(0.5);
      
    //   const maxWidth = this.contentWidth - 20;
    //   const lines = this.doc.splitTextToSize(steps, maxWidth);
    //   const blockHeight = Math.max(lines.length * 4 + 4, 15);
      
    //   this.doc.roundedRect(this.leftMargin + 10, this.currentY, this.contentWidth - 20, blockHeight, 1, 1, 'FD');
      
    //   this.doc.setFontSize(8);
    //   this.doc.setFont('courier', 'normal');
    //   this.doc.setTextColor(0, 0, 0);
      
    //   lines.forEach((line: string, index: number) => {
    //     this.doc.text(line, this.leftMargin + 13, this.currentY + 4 + (index * 4));
    //   });
      
    //   this.currentY += blockHeight + 3;
    // }

    // Final Calculation
    if (breakdown.final_calculation) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('Final Calculation with Hours:', this.leftMargin + 10, this.currentY);
      this.currentY += 4;
      this.addCodeBlock(String(breakdown.final_calculation) || '', 10);
    }

    // Result
    // if (breakdown.computed_value !== undefined || breakdown.computed_amount !== undefined) {
    //   const result = breakdown.computed_value || breakdown.computed_amount || 0;
      
    //   this.checkPageBreak(10);
    //   this.doc.setFillColor(16, 185, 129, 0.1);
    //   this.doc.roundedRect(this.leftMargin + 5, this.currentY, this.contentWidth - 10, 9, 1, 1, 'F');
      
    //   this.doc.setFontSize(10);
    //   this.doc.setFont('helvetica', 'bold');
    //   this.doc.setTextColor(16, 185, 129);
    //   this.doc.text('Result:', this.leftMargin + 10, this.currentY + 6);
    //   this.doc.text(this.formatCurrency(result), 
    //                this.pageWidth - this.rightMargin - 10, this.currentY + 6, { align: 'right' });
      
    //   this.currentY += 12;
    // }
  }

  private renderHRCase(breakdown: CalculationBreakdown): void {
    if (breakdown.case_details) {
      this.addSubheader('HR Case Details', 5);
      
      if (breakdown.case_details.case_number) {
        this.addInfoRow('Case Number', breakdown.case_details.case_number, 5);
      }
      if (breakdown.case_details.case_title) {
        this.addInfoRow('Case Title', breakdown.case_details.case_title, 5);
      }
      if (breakdown.case_details.category) {
        this.addInfoRow('Category', breakdown.case_details.category, 5);
      }
      if (breakdown.case_details.case_date) {
        this.addInfoRow('Case Date', this.formatDateTime(breakdown.case_details.case_date), 5);
      }
      if (breakdown.case_details.raised_by) {
        this.addInfoRow('Raised By', breakdown.case_details.raised_by, 5);
      }
      
      this.currentY += 3;
    }

    if (breakdown.deduction_details || breakdown.deduction_type) {
      this.addSubheader('Deduction Details', 5);
      
      if (breakdown.deduction_type) {
        this.addInfoRow('Deduction Type', breakdown.deduction_type, 5);
      }
      if (breakdown.deduction_details?.deduction_reason) {
        this.addInfoRow('Reason', breakdown.deduction_details.deduction_reason, 5);
      }
      if (breakdown.deduction_details?.approved_amount !== undefined) {
        this.addInfoRow('Approved Amount', this.formatCurrency(breakdown.deduction_details.approved_amount), 5);
      } else if (breakdown.computed_value !== undefined) {
        this.addInfoRow('Deduction Amount', this.formatCurrency(breakdown.computed_value), 5);
      }
      
      this.currentY += 3;
    }
  }

  private renderExpense(breakdown: CalculationBreakdown): void {
    if (breakdown.expense_details) {
      this.addSubheader('Expense Details', 5);
      
      if (breakdown.expense_details.expense_id) {
        this.addInfoRow('Expense ID', breakdown.expense_details.expense_id, 5);
      }
      if (breakdown.expense_details.expense_title) {
        this.addInfoRow('Title', breakdown.expense_details.expense_title, 5);
      }
      if (breakdown.expense_details.category) {
        this.addInfoRow('Category', breakdown.expense_details.category, 5);
      }
      if (breakdown.expense_details.expense_date) {
        this.addInfoRow('Expense Date', this.formatDate(breakdown.expense_details.expense_date), 5);
      }
      if (breakdown.expense_details.approved_by) {
        this.addInfoRow('Approved By', breakdown.expense_details.approved_by, 5);
      }
      if (breakdown.expense_details.approval_date) {
        this.addInfoRow('Approval Date', this.formatDate(breakdown.expense_details.approval_date), 5);
      }
      
      this.currentY += 3;
    }

    if (breakdown.reimbursement_details || breakdown.reimbursement_type) {
      this.addSubheader('Reimbursement Details', 5);
      
      if (breakdown.reimbursement_type) {
        this.addInfoRow('Reimbursement Type', breakdown.reimbursement_type, 5);
      }
      if (breakdown.reimbursement_details?.reimbursement_method) {
        this.addInfoRow('Method', breakdown.reimbursement_details.reimbursement_method, 5);
      }
      if (breakdown.reimbursement_details?.approved_amount !== undefined) {
        this.addInfoRow('Approved Amount', this.formatCurrency(breakdown.reimbursement_details.approved_amount), 5);
      } else if (breakdown.computed_value !== undefined) {
        this.addInfoRow('Reimbursement Amount', this.formatCurrency(breakdown.computed_value), 5);
      }
      
      this.currentY += 3;
    }
  }

  private renderLoan(breakdown: CalculationBreakdown): void {
    if (breakdown.loan_details) {
      this.addSubheader('Loan Details', 5);
      
      if (breakdown.loan_details.application_number) {
        this.addInfoRow('Application Number', breakdown.loan_details.application_number, 5);
      }
      if (breakdown.loan_details.loan_type) {
        this.addInfoRow('Loan Type', breakdown.loan_details.loan_type, 5);
      }
      if (breakdown.loan_details.interest_rate !== undefined) {
        this.addInfoRow('Interest Rate', `${breakdown.loan_details.interest_rate}% p.a.`, 5);
      }
      if (breakdown.loan_details.due_date) {
        this.addInfoRow('Due Date', this.formatDate(breakdown.loan_details.due_date), 5);
      }
      
      this.currentY += 3;
    }

    if (breakdown.schedule_details || breakdown.deduction_type) {
      this.addSubheader('EMI Schedule Details', 5);
      
      if (breakdown.deduction_type) {
        this.addInfoRow('Deduction Type', breakdown.deduction_type, 5);
      }
      if (breakdown.schedule_details?.principal_component !== undefined) {
        this.addInfoRow('Principal Component', this.formatCurrency(breakdown.schedule_details.principal_component), 5);
      }
      if (breakdown.schedule_details?.interest_component !== undefined) {
        this.addInfoRow('Interest Component', this.formatCurrency(breakdown.schedule_details.interest_component), 5);
      }
      if (breakdown.schedule_details?.breakdown_formula) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(100, 100, 100);
        this.doc.text('EMI Breakdown:', this.leftMargin + 10, this.currentY);
        this.currentY += 4;
        this.addCodeBlock(breakdown.schedule_details.breakdown_formula, 10);
      }
      if (breakdown.schedule_details?.total_emi !== undefined) {
        this.addInfoRow('Total EMI', this.formatCurrency(breakdown.schedule_details.total_emi), 5);
      } else if (breakdown.computed_value !== undefined) {
        this.addInfoRow('Total EMI', this.formatCurrency(breakdown.computed_value), 5);
      }
      
      this.currentY += 3;
    }
  }

  private renderError(breakdown: CalculationBreakdown): void {
    this.checkPageBreak(20);
    
    this.doc.setFillColor(254, 242, 242);
    this.doc.setDrawColor(239, 68, 68);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(this.leftMargin + 5, this.currentY, this.contentWidth - 10, 15, 2, 2, 'FD');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(239, 68, 68);
    this.doc.text('⚠ Calculation Error', this.leftMargin + 10, this.currentY + 7);
    
    this.currentY += 12;
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    
    const errorText = breakdown.error || 'An unknown error occurred during calculation.';
    const maxWidth = this.contentWidth - 20;
    const lines = this.doc.splitTextToSize(errorText, maxWidth);
    
    lines.forEach((line: string) => {
      this.doc.text(line, this.leftMargin + 10, this.currentY);
      this.currentY += 5;
    });
    
    if (breakdown.error_details) {
      this.currentY += 2;
      if (breakdown.error_details.name) {
        this.addInfoRow('Error Type', breakdown.error_details.name, 5);
      }
      if (breakdown.error_details.message) {
        this.addInfoRow('Error Message', breakdown.error_details.message, 5);
      }
    }
    
    this.currentY += 5;
  }

  private renderBreakdownContent(breakdown: CalculationBreakdown): void {
    const source = breakdown.source || '';
    const calcMethod = breakdown.calculation_method || '';
    const calcType = breakdown.calculation_type || '';
    const componentType = breakdown.component_type || '';

    // Manual Adjustment
    if (source === 'Manual Adjustment' || source === 'Bulk Manual Adjustment' || componentType === 'manual') {
      this.renderManualAdjustment(breakdown);
      return;
    }

    // Base Salary (Hours-based Prorated)
    if (calcMethod === 'Hours-based Prorated Calculation') {
      this.renderBaseSalary(breakdown);
      return;
    }

    // Percentage Based
    if (calcType === 'Percentage Based') {
      this.renderPercentageBased(breakdown);
      return;
    }

    // Fixed Amount Prorated
    if (calcType === 'Fixed Amount Prorated') {
      this.renderFixedProrated(breakdown);
      return;
    }

    // Prorated Percentage
    if (breakdown.prorated_for_attendance === true && calcType !== 'Custom Formula') {
      this.renderPercentageBased(breakdown);
      return;
    }

    // Custom Formula
    if (calcType === 'Custom Formula') {
      this.renderFormula(breakdown);
      return;
    }

    // Overtime
    if (source === 'Employee Salary Structure' && breakdown.overtime_details) {
      this.renderOvertime(breakdown);
      return;
    }

    // HR Case
    if (source === 'HR Case Management System') {
      this.renderHRCase(breakdown);
      return;
    }

    // Expense Reimbursement
    if (source === 'Expense Management System') {
      this.renderExpense(breakdown);
      return;
    }

    // Loan EMI
    if (source === 'Loan Management System') {
      this.renderLoan(breakdown);
      return;
    }

    // Error
    if (breakdown.error) {
      this.renderError(breakdown);
      return;
    }

    // Fallback - display available information
    this.addSubheader('Calculation Information', 5);
    
    if (source) {
      this.addInfoRow('Source', source, 5);
    }
    if (calcType) {
      this.addInfoRow('Calculation Type', calcType, 5);
    }
    if (calcMethod) {
      this.addInfoRow('Calculation Method', calcMethod, 5);
    }
    if (breakdown.computed_value !== undefined || breakdown.computed_amount !== undefined) {
      this.addInfoRow('Amount', this.formatCurrency(breakdown.computed_value || breakdown.computed_amount || 0), 5);
    }
    
    this.currentY += 3;
  }

  // ==================== MAIN GENERATION FUNCTION ====================
  public generate(payslipData: PayslipDetails): void {
    // Header
    this.doc.setFillColor(37, 99, 235);
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PAYSLIP', this.pageWidth / 2, 15, { align: 'center' });
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`${payslipData.cycle_name}`, this.pageWidth / 2, 25, { align: 'center' });
    
    // Status Badge
    const statusColor = payslipData.status === 'Finalized' ? [16, 185, 129] : 
                        payslipData.status === 'Reviewed' ? [59, 130, 246] : [107, 114, 128];
    this.doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    this.doc.roundedRect(this.pageWidth / 2 - 15, 30, 30, 6, 2, 2, 'F');
    this.doc.setFontSize(8);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(payslipData.status.toUpperCase(), this.pageWidth / 2, 34, { align: 'center' });
    
    this.currentY = 50;

    // Employee & Period Info
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFillColor(249, 250, 251);
    this.doc.roundedRect(this.leftMargin, this.currentY, this.contentWidth, 30, 3, 3, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(107, 114, 128);
    this.doc.text('Employee', 20, this.currentY + 8);
    this.doc.text('Pay Period', this.pageWidth / 2 + 5, this.currentY + 8);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(payslipData.employee_name, 20, this.currentY + 15);
    this.doc.text(`${this.formatDate(payslipData.start_date)} - ${this.formatDate(payslipData.end_date)}`, 
                 this.pageWidth / 2 + 5, this.currentY + 15);
    
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(107, 114, 128);
    this.doc.text(`ID: ${payslipData.employee_id}`, 20, this.currentY + 22);
    
    const daysDiff = Math.ceil(
      (new Date(payslipData.end_date).getTime() - new Date(payslipData.start_date).getTime()) / 
      (1000 * 60 * 60 * 24)
    ) + 1;
    this.doc.text(`${daysDiff} days`, this.pageWidth / 2 + 5, this.currentY + 22);
    
    this.currentY += 40;

    // Summary Cards
    this.checkPageBreak(35);
    const cardWidth = (this.contentWidth - 15) / 3;
    
    // Gross Earnings
    this.doc.setFillColor(236, 253, 245);
    this.doc.roundedRect(this.leftMargin, this.currentY, cardWidth, 25, 2, 2, 'F');
    this.doc.setDrawColor(16, 185, 129);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.leftMargin, this.currentY, this.leftMargin, this.currentY + 25);
    
    this.doc.setFontSize(9);
    this.doc.setTextColor(107, 114, 128);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Gross Earnings', this.leftMargin + 5, this.currentY + 8);
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(16, 185, 129);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatCurrency(payslipData.gross_earnings), this.leftMargin + 5, this.currentY + 18);
    
    // Total Deductions
    this.doc.setFillColor(254, 242, 242);
    this.doc.roundedRect(this.leftMargin + cardWidth + 7.5, this.currentY, cardWidth, 25, 2, 2, 'F');
    this.doc.setDrawColor(239, 68, 68);
    this.doc.line(this.leftMargin + cardWidth + 7.5, this.currentY, this.leftMargin + cardWidth + 7.5, this.currentY + 25);
    
    this.doc.setFontSize(9);
    this.doc.setTextColor(107, 114, 128);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Total Deductions', this.leftMargin + cardWidth + 12.5, this.currentY + 8);
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(239, 68, 68);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatCurrency(payslipData.total_deductions), this.leftMargin + cardWidth + 12.5, this.currentY + 18);
    
    // Net Pay
    this.doc.setFillColor(239, 246, 255);
    this.doc.roundedRect(this.leftMargin + (cardWidth + 7.5) * 2, this.currentY, cardWidth, 25, 2, 2, 'F');
    this.doc.setDrawColor(59, 130, 246);
    this.doc.line(this.leftMargin + (cardWidth + 7.5) * 2, this.currentY, this.leftMargin + (cardWidth + 7.5) * 2, this.currentY + 25);
    
    this.doc.setFontSize(9);
    this.doc.setTextColor(107, 114, 128);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Net Pay', this.leftMargin + (cardWidth + 7.5) * 2 + 5, this.currentY + 8);
    
    this.doc.setFontSize(14);
    this.doc.setTextColor(59, 130, 246);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatCurrency(payslipData.net_pay), this.leftMargin + (cardWidth + 7.5) * 2 + 5, this.currentY + 18);
    
    this.currentY += 35;

    // Group Components
    const groupedComponents: {
      earnings: Record<string, PayslipComponentDetail[]>;
      deductions: Record<string, PayslipComponentDetail[]>;
    } = { earnings: {}, deductions: {} };

    payslipData.details.forEach((item) => {
      const group = item.group_name || 'Other';
      if (item.component_type === 'earning') {
        if (!groupedComponents.earnings[group]) groupedComponents.earnings[group] = [];
        groupedComponents.earnings[group].push(item);
      } else {
        if (!groupedComponents.deductions[group]) groupedComponents.deductions[group] = [];
        groupedComponents.deductions[group].push(item);
      }
    });

    // ==================== DETAILED COMPONENT BREAKDOWN ====================
    // This section includes calculation details for each component
    
    // Earnings with Breakdown
    if (Object.keys(groupedComponents.earnings).length > 0) {
      this.addSectionHeader("Earnings Breakdown", "", [16, 185, 129]);

      Object.entries(groupedComponents.earnings).forEach(([groupName, items]) => {
        this.checkPageBreak(15);
        
        // Group Header
        this.doc.setFillColor(243, 244, 246);
        this.doc.rect(this.leftMargin, this.currentY, this.contentWidth, 7, 'F');
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(55, 65, 81);
        this.doc.text(groupName.toUpperCase(), this.leftMargin + 3, this.currentY + 5);
        this.currentY += 10;

        // Items with detailed breakdown
        items.forEach((item) => {
          this.checkPageBreak(20);
          
          // Component name and amount
          this.doc.setFillColor(249, 250, 251);
          this.doc.roundedRect(this.leftMargin, this.currentY, this.contentWidth, 10, 2, 2, 'F');
          
          this.doc.setFontSize(11);
          this.doc.setFont('helvetica', 'bold');
          this.doc.setTextColor(0, 0, 0);
          this.doc.text(item.component_name, this.leftMargin + 3, this.currentY + 7);
          
          this.doc.setFont('helvetica', 'bold');
          this.doc.setTextColor(16, 185, 129);
          this.doc.text(this.formatCurrency(item.amount), this.pageWidth - this.rightMargin - 3, this.currentY + 7, { align: 'right' });
          
          this.currentY += 13;

          // Render calculation breakdown if available
          if (item.calculation_breakdown) {
            const source = item.calculation_breakdown.source || 'Calculated';
            
            this.doc.setFontSize(8);
            this.doc.setFont('helvetica', 'italic');
            this.doc.setTextColor(107, 114, 128);
            this.doc.text(`Source: ${source}`, this.leftMargin + 5, this.currentY);
            this.currentY += 5;
            
            this.renderBreakdownContent(item.calculation_breakdown);
          }
          
          // Separator
          this.doc.setDrawColor(229, 231, 235);
          this.doc.setLineWidth(0.2);
          this.doc.line(this.leftMargin, this.currentY, this.pageWidth - this.rightMargin, this.currentY);
          this.currentY += 5;
        });
      });

      // Total Earnings
      this.checkPageBreak(12);
      this.doc.setFillColor(236, 253, 245);
      this.doc.roundedRect(this.leftMargin, this.currentY, this.contentWidth, 10, 2, 2, 'F');
      this.doc.setDrawColor(16, 185, 129);
      this.doc.setLineWidth(1);
      this.doc.roundedRect(this.leftMargin, this.currentY, this.contentWidth, 10, 2, 2, 'S');
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 0, 0);
      this.doc.text('Total Earnings', this.leftMargin + 5, this.currentY + 7);
      
      this.doc.setFontSize(13);
      this.doc.setTextColor(16, 185, 129);
      this.doc.text(this.formatCurrency(payslipData.gross_earnings), 
                   this.pageWidth - this.rightMargin - 5, this.currentY + 7, { align: 'right' });
      
      this.currentY += 18;
    }

    // Deductions with Breakdown
    if (Object.keys(groupedComponents.deductions).length > 0) {
      this.addSectionHeader("Deductions Breakdown", "", [239, 68, 68]);

      Object.entries(groupedComponents.deductions).forEach(([groupName, items]) => {
        this.checkPageBreak(15);
        
        // Group Header
        this.doc.setFillColor(243, 244, 246);
        this.doc.rect(this.leftMargin, this.currentY, this.contentWidth, 7, 'F');
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'bold');
        this.doc.setTextColor(55, 65, 81);
        this.doc.text(groupName.toUpperCase(), this.leftMargin + 3, this.currentY + 5);
        this.currentY += 10;

        // Items with detailed breakdown
        items.forEach((item) => {
          this.checkPageBreak(20);
          
          // Component name and amount
          this.doc.setFillColor(249, 250, 251);
          this.doc.roundedRect(this.leftMargin, this.currentY, this.contentWidth, 10, 2, 2, 'F');
          
          this.doc.setFontSize(11);
          this.doc.setFont('helvetica', 'bold');
          this.doc.setTextColor(0, 0, 0);
          this.doc.text(item.component_name, this.leftMargin + 3, this.currentY + 7);
          
          this.doc.setFont('helvetica', 'bold');
          this.doc.setTextColor(239, 68, 68);
          this.doc.text(this.formatCurrency(item.amount), this.pageWidth - this.rightMargin - 3, this.currentY + 7, { align: 'right' });
          
          this.currentY += 13;

          // Render calculation breakdown if available
          if (item.calculation_breakdown) {
            const source = item.calculation_breakdown.source || 'Calculated';
            
            this.doc.setFontSize(8);
            this.doc.setFont('helvetica', 'italic');
            this.doc.setTextColor(107, 114, 128);
            this.doc.text(`Source: ${source}`, this.leftMargin + 5, this.currentY);
            this.currentY += 5;
            
            this.renderBreakdownContent(item.calculation_breakdown);
          }
          
          // Separator
          this.doc.setDrawColor(229, 231, 235);
          this.doc.setLineWidth(0.2);
          this.doc.line(this.leftMargin, this.currentY, this.pageWidth - this.rightMargin, this.currentY);
          this.currentY += 5;
        });
      });

      // Total Deductions
      this.checkPageBreak(12);
      this.doc.setFillColor(254, 242, 242);
      this.doc.roundedRect(this.leftMargin, this.currentY, this.contentWidth, 10, 2, 2, 'F');
      this.doc.setDrawColor(239, 68, 68);
      this.doc.setLineWidth(1);
      this.doc.roundedRect(this.leftMargin, this.currentY, this.contentWidth, 10, 2, 2, 'S');
      
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 0, 0);
      this.doc.text('Total Deductions', this.leftMargin + 5, this.currentY + 7);
      
      this.doc.setFontSize(13);
      this.doc.setTextColor(239, 68, 68);
      this.doc.text(this.formatCurrency(payslipData.total_deductions), 
                   this.pageWidth - this.rightMargin - 5, this.currentY + 7, { align: 'right' });
      
      this.currentY += 18;
    }

    // Net Pay Summary
    this.checkPageBreak(30);
    this.doc.setFillColor(59, 130, 246);
    this.doc.roundedRect(this.leftMargin, this.currentY, this.contentWidth, 20, 3, 3, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Net Pay (Take Home)', this.leftMargin + 5, this.currentY + 8);
    
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(this.formatCurrency(payslipData.net_pay), 
                 this.pageWidth - this.rightMargin - 5, this.currentY + 15, { align: 'right' });
    
    this.currentY += 28;

    // Footer
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(107, 114, 128);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(
        `Generated on ${new Date().toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        this.leftMargin,
        this.pageHeight - 10
      );
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth - this.rightMargin,
        this.pageHeight - 10,
        { align: 'right' }
      );
    }
  }

  public download(payslipData: PayslipDetails): void {
    const fileName = `Payslip_${payslipData.employee_name.replace(/\s+/g, '_')}_${payslipData.cycle_name.replace(/\s+/g, '_')}.pdf`;
    this.doc.save(fileName);
  }
}

// ==================== EXPORT FUNCTION ====================
/**
 * Generate and download a complete payslip PDF with detailed calculation breakdowns
 * @param payslipData - The payslip data from API response
 * @param componentMap - Map of component IDs to names for formula resolution
 */
export const generateDetailedPayslipPDF = (
  payslipData: PayslipDetails,
  componentMap: Record<string, string> = {}
): void => {
  const generator = new PayslipPDFGenerator(componentMap);
  generator.generate(payslipData);
  generator.download(payslipData);
};
