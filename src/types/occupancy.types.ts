// Core data model matching PRD §5.1 - site_night fact table
export interface SiteNight {
  date: string; // ISO date string (YYYY-MM-DD)
  siteId: string;
  siteName: string;
  siteTypeId: string;
  siteTypeName: string;
  isBlocked: boolean;
  isOccupied: boolean;
  on: number; // 1 if occupied, 0 otherwise
  an: number; // 1 if bookable (adjusted by includeBlocked setting)
  weekday: number; // 0-6, Sunday=0
  weekIso: number;
  month: number; // 1-12
  year: number;
  revenueLodgingNet: number; // Pre-tax lodging revenue, discounts pro-rated
  weekendFlag: boolean; // True for Fri-Sun night pairs
  reservationId?: string; // For ALOS calculation
}

// Filter state for occupancy report
export interface OccupancyFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  siteIds: string[]; // Empty array = all sites
  siteTypeIds: string[]; // Empty array = all types
  includeBlocked: boolean; // Default: false
  showYoY: boolean; // Show year-over-year comparison
  granularity: 'auto' | 'monthly' | 'weekly' | 'daily'; // Default: auto
  tails: number; // Context buckets outside selection (0-6, default: 2)
}

// Settings for occupancy report
export interface OccupancySettings {
  includeBlocked: boolean;
  showYoY: boolean;
  normalizeFebruary: boolean; // Rarely used, default: false
  granularity: 'auto' | 'monthly' | 'weekly' | 'daily';
  tails: number;
  exportOptions: 'table-only' | 'include-charts';
}

// Donut chart data structure
export interface DonutChartData {
  occupied: number; // ON
  available: number; // AN - ON
  blocked?: number; // Optional, shown if includeBlocked is true
  occupancyPercentage: number; // ON / AN * 100
}

// Weekday chart data (Average Nightly Occupancy)
export interface WeekdayChartData {
  weekday: number; // 0-6, Sunday=0
  weekdayName: string; // "Sun", "Mon", etc.
  currentPeriod: {
    occupancyPercentage: number;
    on: number;
    an: number;
  };
  yoyPeriod?: {
    occupancyPercentage: number;
    on: number;
    an: number;
  };
}

// Trend bucket data (for bar chart)
export interface TrendBucketData {
  bucketKey: string; // e.g., "2025-02" for monthly, "W12" for weekly, "2025-02-15" for daily
  bucketLabel: string; // Display label
  startDate: string; // ISO date
  endDate: string; // ISO date
  isInSelection: boolean; // Full saturation vs 40% opacity
  fullBucketOccupancy: number; // Occupancy for entire month/week/day
  selectionOccupancy?: number; // Occupancy for just the overlapping portion
  on: number;
  an: number;
  yoyOccupancy?: number; // Year-over-year comparison (-364 days)
  yoyOn?: number;
  yoyAn?: number;
}

// Table row data for AG-Grid
export interface SiteTableRow {
  siteId: string;
  siteName: string;
  siteType: string;
  occupancyPercentage: number; // % Occupied
  on: number; // # Occupied nights
  an: number; // # Available nights
  alos: number; // Avg Length of Stay
  weekendOccupancyPercentage: number; // % Occupied weekend nights
  blockedNights: number; // # Blocked nights
  adr: number; // Average Daily Rate: L / ON
  revpar: number; // Revenue Per Available Room: L / AN
  totalRevenue?: number; // Total lodging revenue (optional)
  reservationCount?: number; // Number of reservations (optional)
}

// Site metadata
export interface Site {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
}

// Site type metadata
export interface SiteType {
  id: string;
  name: string;
}

// API response structure (for future integration)
export interface OccupancyReportResponse {
  siteNights: SiteNight[];
  sites: Site[];
  siteTypes: SiteType[];
  dateRange: {
    start: string;
    end: string;
  };
  settings: OccupancySettings;
}

// Granularity type
export type Granularity = 'auto' | 'monthly' | 'weekly' | 'daily';

// Export options type
export type ExportOptions = 'table-only' | 'include-charts';
