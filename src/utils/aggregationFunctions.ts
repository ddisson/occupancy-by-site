import {
  SiteNight,
  DonutChartData,
  WeekdayChartData,
  TrendBucketData,
  SiteTableRow,
  OccupancyFilters,
} from '../types/occupancy.types';
import {
  calculateOccupancyRate,
  calculateADR,
  calculateRevPAR,
  aggregateByWeekday,
  aggregateByMonth,
  aggregateByWeek,
  aggregateByDay,
  aggregateBySite,
  determineGranularity,
} from './calculationHelpers';
import { getWeekdayName, getMonthName, calculateYoYDate } from './dateHelpers';
import { addDays, format } from 'date-fns';

// Calculate donut chart data (Total Occupancy)
export function calculateDonutData(
  siteNights: SiteNight[],
  includeBlocked: boolean
): DonutChartData {
  let totalOn = 0;
  let totalAn = 0;
  let totalBlocked = 0;

  siteNights.forEach(night => {
    totalOn += night.on;
    totalAn += night.an;
    if (night.isBlocked) {
      totalBlocked += 1;
    }
  });

  const available = totalAn - totalOn;
  const occupancyPercentage = calculateOccupancyRate(totalOn, totalAn);

  return {
    occupied: totalOn,
    available,
    blocked: includeBlocked ? totalBlocked : undefined,
    occupancyPercentage,
  };
}

// Calculate weekday chart data (Average Nightly Occupancy)
export function calculateWeekdayData(
  siteNights: SiteNight[],
  yoySiteNights?: SiteNight[]
): WeekdayChartData[] {
  const weekdayMap = aggregateByWeekday(siteNights);
  const yoyWeekdayMap = yoySiteNights ? aggregateByWeekday(yoySiteNights) : null;

  const weekdayData: WeekdayChartData[] = [];

  for (let dow = 0; dow < 7; dow++) {
    const current = weekdayMap.get(dow)!;
    const yoyCurrent = yoyWeekdayMap?.get(dow);

    weekdayData.push({
      weekday: dow,
      weekdayName: getWeekdayName(dow),
      currentPeriod: {
        occupancyPercentage: calculateOccupancyRate(current.on, current.an),
        on: current.on,
        an: current.an,
      },
      yoyPeriod: yoyCurrent
        ? {
            occupancyPercentage: calculateOccupancyRate(yoyCurrent.on, yoyCurrent.an),
            on: yoyCurrent.on,
            an: yoyCurrent.an,
          }
        : undefined,
    });
  }

  return weekdayData;
}

// Calculate trend data (Occupancy Trend bar chart)
export function calculateTrendData(
  siteNights: SiteNight[],
  filters: OccupancyFilters,
  yoySiteNights?: SiteNight[]
): TrendBucketData[] {
  const granularity = filters.granularity === 'auto'
    ? determineGranularity(filters.dateRange.start, filters.dateRange.end)
    : filters.granularity;

  switch (granularity) {
    case 'monthly':
      return calculateMonthlyTrendData(siteNights, filters, yoySiteNights);
    case 'weekly':
      return calculateWeeklyTrendData(siteNights, filters, yoySiteNights);
    case 'daily':
      return calculateDailyTrendData(siteNights, filters, yoySiteNights);
    default:
      return [];
  }
}

// Calculate monthly trend data
function calculateMonthlyTrendData(
  siteNights: SiteNight[],
  filters: OccupancyFilters,
  yoySiteNights?: SiteNight[]
): TrendBucketData[] {
  const monthMap = aggregateByMonth(siteNights);
  const yoyMonthMap = yoySiteNights ? aggregateByMonth(yoySiteNights) : null;

  const buckets: TrendBucketData[] = [];
  const selectionStart = filters.dateRange.start.toISOString().split('T')[0];
  const selectionEnd = filters.dateRange.end.toISOString().split('T')[0];

  // Get all months for the year of selection start
  const year = filters.dateRange.start.getFullYear();

  for (let month = 1; month <= 12; month++) {
    const key = `${year}-${String(month).padStart(2, '0')}`;
    const monthData = monthMap.get(key);

    if (!monthData) continue;

    const monthStart = `${key}-01`;
    const monthEnd = format(new Date(year, month, 0), 'yyyy-MM-dd');

    // Check if this month intersects with selection
    const isInSelection = monthEnd >= selectionStart && monthStart <= selectionEnd;

    // Calculate YoY data
    const yoyKey = `${year - 1}-${String(month).padStart(2, '0')}`;
    const yoyData = yoyMonthMap?.get(yoyKey);

    buckets.push({
      bucketKey: key,
      bucketLabel: getMonthName(month, true),
      startDate: monthStart,
      endDate: monthEnd,
      isInSelection,
      fullBucketOccupancy: calculateOccupancyRate(monthData.on, monthData.an),
      selectionOccupancy: isInSelection
        ? calculateOccupancyRate(monthData.on, monthData.an)
        : undefined,
      on: monthData.on,
      an: monthData.an,
      yoyOccupancy: yoyData ? calculateOccupancyRate(yoyData.on, yoyData.an) : undefined,
      yoyOn: yoyData?.on,
      yoyAn: yoyData?.an,
    });
  }

  return buckets;
}

// Calculate weekly trend data
function calculateWeeklyTrendData(
  siteNights: SiteNight[],
  filters: OccupancyFilters,
  yoySiteNights?: SiteNight[]
): TrendBucketData[] {
  const weekMap = aggregateByWeek(siteNights);
  const yoyWeekMap = yoySiteNights ? aggregateByWeek(yoySiteNights) : null;

  const buckets: TrendBucketData[] = [];
  const selectionStart = filters.dateRange.start.toISOString().split('T')[0];
  const selectionEnd = filters.dateRange.end.toISOString().split('T')[0];

  const year = filters.dateRange.start.getFullYear();

  for (let week = 1; week <= 52; week++) {
    const key = `${year}-W${String(week).padStart(2, '0')}`;
    const weekData = weekMap.get(key);

    if (!weekData) continue;

    const dates = Array.from(weekData.dates).sort();
    const weekStart = dates[0];
    const weekEnd = dates[dates.length - 1];

    const isInSelection = weekEnd >= selectionStart && weekStart <= selectionEnd;

    const yoyKey = `${year - 1}-W${String(week).padStart(2, '0')}`;
    const yoyData = yoyWeekMap?.get(yoyKey);

    buckets.push({
      bucketKey: key,
      bucketLabel: `W${week}`,
      startDate: weekStart,
      endDate: weekEnd,
      isInSelection,
      fullBucketOccupancy: calculateOccupancyRate(weekData.on, weekData.an),
      selectionOccupancy: isInSelection
        ? calculateOccupancyRate(weekData.on, weekData.an)
        : undefined,
      on: weekData.on,
      an: weekData.an,
      yoyOccupancy: yoyData ? calculateOccupancyRate(yoyData.on, yoyData.an) : undefined,
      yoyOn: yoyData?.on,
      yoyAn: yoyData?.an,
    });
  }

  return buckets;
}

// Calculate daily trend data
function calculateDailyTrendData(
  siteNights: SiteNight[],
  filters: OccupancyFilters,
  yoySiteNights?: SiteNight[]
): TrendBucketData[] {
  const dayMap = aggregateByDay(siteNights);
  const yoyDayMap = yoySiteNights ? aggregateByDay(yoySiteNights) : null;

  const buckets: TrendBucketData[] = [];

  let currentDate = new Date(filters.dateRange.start);
  const endDate = new Date(filters.dateRange.end);

  while (currentDate < endDate) {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    const dayData = dayMap.get(dateKey);

    if (dayData) {
      // Calculate YoY date
      const yoyDate = calculateYoYDate(currentDate);
      const yoyDateKey = format(yoyDate, 'yyyy-MM-dd');
      const yoyData = yoyDayMap?.get(yoyDateKey);

      buckets.push({
        bucketKey: dateKey,
        bucketLabel: format(currentDate, 'MM/dd'),
        startDate: dateKey,
        endDate: dateKey,
        isInSelection: true,
        fullBucketOccupancy: calculateOccupancyRate(dayData.on, dayData.an),
        selectionOccupancy: calculateOccupancyRate(dayData.on, dayData.an),
        on: dayData.on,
        an: dayData.an,
        yoyOccupancy: yoyData ? calculateOccupancyRate(yoyData.on, yoyData.an) : undefined,
        yoyOn: yoyData?.on,
        yoyAn: yoyData?.an,
      });
    }

    currentDate = addDays(currentDate, 1);
  }

  return buckets;
}

// Calculate table data (per-site rows)
export function calculateTableData(
  siteNights: SiteNight[],
  reservations?: { id: string; siteId: string; checkIn: Date; checkOut: Date }[]
): SiteTableRow[] {
  const siteMap = aggregateBySite(siteNights);
  const tableRows: SiteTableRow[] = [];

  siteMap.forEach(siteData => {
    // Calculate ALOS from reservations
    const siteReservations = reservations?.filter(r =>
      siteData.reservationIds.has(r.id)
    ) || [];

    const alos = siteReservations.length > 0
      ? siteReservations.reduce((sum, res) => {
          const nights = Math.ceil(
            (res.checkOut.getTime() - res.checkIn.getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + nights;
        }, 0) / siteReservations.length
      : 0;

    tableRows.push({
      siteId: siteData.siteId,
      siteName: siteData.siteName,
      siteType: siteData.siteType,
      occupancyPercentage: calculateOccupancyRate(siteData.on, siteData.an),
      on: siteData.on,
      an: siteData.an,
      alos: Math.round(alos * 10) / 10, // Round to 1 decimal
      weekendOccupancyPercentage: calculateOccupancyRate(siteData.weekendOn, siteData.weekendAn),
      blockedNights: siteData.blockedNights,
      adr: calculateADR(siteData.revenue, siteData.on),
      revpar: calculateRevPAR(siteData.revenue, siteData.an),
      totalRevenue: siteData.revenue,
      reservationCount: siteData.reservationIds.size,
    });
  });

  return tableRows;
}
