import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export interface AttendanceRecord {
  id: number;
  attendance_date: string;
  punch_in: string | null;
  punch_out: string | null;
  hours_worked: string | null;
  attendance_status: "Present" | "Absent" | "Leave" | "Half-Day";
  is_late: number;
  is_early_departure: number;
  short_hours: string | null;
  first_name: string;
  last_name: string;
  updated_by_name: string;
  overtime_hours: string | null;
  overtime_status: "pending_approval" | "approved" | "rejected" | null;
  employee_id: number;
  rejection_reason?: string;
  overtime_processed_by?: string;
}

/**
 * Converts UTC datetime string to formatted string in specified timezone
 */
const convertUTCToTimezone = (
  utcDateString: string | null, 
  timezone: string,
  dateFormat: string = 'yyyy-MM-dd HH:mm:ss'
): string => {
  if (!utcDateString) return 'N/A';
  
  try {
    // Parse the UTC date and format it in the target timezone
    return formatInTimeZone(new Date(utcDateString), timezone, dateFormat);
  } catch (error) {
    console.error('Error converting timezone:', error);
    return utcDateString;
  }
};

export const exportAttendanceToExcel = (
  data: AttendanceRecord[],
  timezone: string = 'UTC', // Default to UAE timezone
  filename: string = 'Attendance_Report'
): void => {
  // Transform data into readable format with timezone conversion
  const excelData = data.map((record) => ({
    'Employee ID': record.employee_id,
    'Employee Name': `${record.first_name} ${record.last_name}`,
    'Date': convertUTCToTimezone(record.attendance_date, timezone, 'dd-MMM-yyyy'),
    'Punch In': convertUTCToTimezone(record.punch_in, timezone, 'hh:mm a'),
    'Punch Out': convertUTCToTimezone(record.punch_out, timezone, 'hh:mm a'),
    'Hours Worked': record.hours_worked || '0',
    'Status': record.attendance_status,
    'Late': record.is_late ? 'Yes' : 'No',
    'Early Departure': record.is_early_departure ? 'Yes' : 'No',
    'Short Hours': record.short_hours || '0',
    'Overtime Hours': record.overtime_hours || '0',
    'Overtime Status': record.overtime_status 
      ? record.overtime_status.replace(/_/g, ' ').toUpperCase()
      : 'N/A',
    'Overtime Processed By': record.overtime_processed_by || 'N/A',
    'Rejection Reason': record.rejection_reason || 'N/A',
    'Updated By': record.updated_by_name,
  }));

  // Create a new workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  // Set column widths for better readability
  const columnWidths = [
    { wch: 12 },  // Employee ID
    { wch: 20 },  // Employee Name
    { wch: 14 },  // Date
    { wch: 12 },  // Punch In
    { wch: 12 },  // Punch Out
    { wch: 14 },  // Hours Worked
    { wch: 12 },  // Status
    { wch: 8 },   // Late
    { wch: 16 },  // Early Departure
    { wch: 12 },  // Short Hours
    { wch: 14 },  // Overtime Hours
    { wch: 16 },  // Overtime Status
    { wch: 20 },  // Overtime Processed By
    { wch: 25 },  // Rejection Reason
    { wch: 18 },  // Updated By
  ];
  
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');

  // Generate Excel file buffer
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array',
    compression: true 
  });

  // Create blob and trigger download
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const timestamp = new Date().toISOString().split('T')[0];
  saveAs(blob, `${filename}_${timestamp}.xlsx`);
};
