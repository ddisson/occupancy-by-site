import { format, getDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, differenceInDays } from 'date-fns';

// Format date range with night count
export function formatDateRange(start: Date, end: Date): string {
  const nights = differenceInDays(end, start);
  const startStr = format(start, 'MMM d');
  const endStr = format(end, 'MMM d, yyyy');
  return `${startStr} – ${endStr} (${nights} nights)`;
}

// Get weekday name (Sun, Mon, etc.)
export function getWeekdayName(dow: number, short: boolean = true): string {
  const days = short
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dow];
}

// Get week bounds (US: Sunday to Saturday)
export function getWeekBounds(date: Date): [Date, Date] {
  const startSun = startOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
  const endSat = endOfWeek(date, { weekStartsOn: 0 });
  return [startSun, endSat];
}

// Get month bounds
export function getMonthBounds(date: Date): [Date, Date] {
  return [startOfMonth(date), endOfMonth(date)];
}

// Check if date is weekend (Friday or Saturday night)
export function isWeekend(date: Date): boolean {
  const day = getDay(date);
  return day === 5 || day === 6; // Friday or Saturday
}

// Calculate year-over-year date (-364 days for weekday alignment)
export function calculateYoYDate(date: Date): Date {
  return subDays(date, 364);
}

// Format date as mm/dd/yyyy (PRD requirement)
export function formatDateUS(date: Date): string {
  return format(date, 'MM/dd/yyyy');
}

// Get US week number (W1 = first full Sunday-Saturday week)
export function getUSWeekNumber(date: Date): number {
  const year = date.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const firstSunday = startOfWeek(firstDayOfYear, { weekStartsOn: 0 });

  // If first Sunday is in previous year, adjust
  const firstFullWeek = firstSunday.getFullYear() < year
    ? startOfWeek(new Date(year, 0, 8), { weekStartsOn: 0 })
    : firstSunday;

  const weeksDiff = Math.floor(differenceInDays(date, firstFullWeek) / 7) + 1;
  return Math.max(1, Math.min(52, weeksDiff));
}

// Get month name
export function getMonthName(month: number, short: boolean = false): string {
  const date = new Date(2000, month - 1, 1);
  return format(date, short ? 'MMM' : 'MMMM');
}

// Check if two dates are in the same month
export function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

// Check if two dates are in the same week (US Sunday-Saturday)
export function isSameWeek(date1: Date, date2: Date): boolean {
  const [start1] = getWeekBounds(date1);
  const [start2] = getWeekBounds(date2);
  return start1.getTime() === start2.getTime();
}
