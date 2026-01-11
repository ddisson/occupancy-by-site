import { SiteNight, Granularity } from '../types/occupancy.types';
import { differenceInDays } from 'date-fns';

// Calculate occupancy rate percentage
export function calculateOccupancyRate(on: number, an: number): number {
  if (an === 0) return 0;
  return (on / an) * 100;
}

// Calculate ADR (Average Daily Rate): L / ON
export function calculateADR(totalRevenue: number, on: number): number {
  if (on === 0) return 0;
  return totalRevenue / on;
}

// Calculate RevPAR (Revenue Per Available Room): L / AN
export function calculateRevPAR(totalRevenue: number, an: number): number {
  if (an === 0) return 0;
  return totalRevenue / an;
}

// Aggregate site nights by weekday
export function aggregateByWeekday(
  siteNights: SiteNight[]
): Map<number, { on: number; an: number; revenue: number }> {
  const weekdayMap = new Map<number, { on: number; an: number; revenue: number }>();

  // Initialize all weekdays (0-6)
  for (let i = 0; i < 7; i++) {
    weekdayMap.set(i, { on: 0, an: 0, revenue: 0 });
  }

  // Aggregate
  siteNights.forEach(night => {
    const current = weekdayMap.get(night.weekday)!;
    weekdayMap.set(night.weekday, {
      on: current.on + night.on,
      an: current.an + night.an,
      revenue: current.revenue + night.revenueLodgingNet,
    });
  });

  return weekdayMap;
}

// Aggregate site nights by month
export function aggregateByMonth(
  siteNights: SiteNight[]
): Map<string, { on: number; an: number; revenue: number; dates: Set<string> }> {
  const monthMap = new Map<string, { on: number; an: number; revenue: number; dates: Set<string> }>();

  siteNights.forEach(night => {
    const key = `${night.year}-${String(night.month).padStart(2, '0')}`;

    if (!monthMap.has(key)) {
      monthMap.set(key, { on: 0, an: 0, revenue: 0, dates: new Set() });
    }

    const current = monthMap.get(key)!;
    monthMap.set(key, {
      on: current.on + night.on,
      an: current.an + night.an,
      revenue: current.revenue + night.revenueLodgingNet,
      dates: current.dates.add(night.date),
    });
  });

  return monthMap;
}

// Aggregate site nights by week
export function aggregateByWeek(
  siteNights: SiteNight[]
): Map<string, { on: number; an: number; revenue: number; dates: Set<string> }> {
  const weekMap = new Map<string, { on: number; an: number; revenue: number; dates: Set<string> }>();

  siteNights.forEach(night => {
    const key = `${night.year}-W${String(night.weekIso).padStart(2, '0')}`;

    if (!weekMap.has(key)) {
      weekMap.set(key, { on: 0, an: 0, revenue: 0, dates: new Set() });
    }

    const current = weekMap.get(key)!;
    weekMap.set(key, {
      on: current.on + night.on,
      an: current.an + night.an,
      revenue: current.revenue + night.revenueLodgingNet,
      dates: current.dates.add(night.date),
    });
  });

  return weekMap;
}

// Aggregate site nights by day
export function aggregateByDay(
  siteNights: SiteNight[]
): Map<string, { on: number; an: number; revenue: number }> {
  const dayMap = new Map<string, { on: number; an: number; revenue: number }>();

  siteNights.forEach(night => {
    if (!dayMap.has(night.date)) {
      dayMap.set(night.date, { on: 0, an: 0, revenue: 0 });
    }

    const current = dayMap.get(night.date)!;
    dayMap.set(night.date, {
      on: current.on + night.on,
      an: current.an + night.an,
      revenue: current.revenue + night.revenueLodgingNet,
    });
  });

  return dayMap;
}

// Aggregate site nights by site (for table)
export function aggregateBySite(
  siteNights: SiteNight[]
): Map<string, {
  siteId: string;
  siteName: string;
  siteType: string;
  on: number;
  an: number;
  revenue: number;
  blockedNights: number;
  weekendOn: number;
  weekendAn: number;
  reservationIds: Set<string>;
}> {
  const siteMap = new Map<string, {
    siteId: string;
    siteName: string;
    siteType: string;
    on: number;
    an: number;
    revenue: number;
    blockedNights: number;
    weekendOn: number;
    weekendAn: number;
    reservationIds: Set<string>;
  }>();

  siteNights.forEach(night => {
    if (!siteMap.has(night.siteId)) {
      siteMap.set(night.siteId, {
        siteId: night.siteId,
        siteName: night.siteName,
        siteType: night.siteTypeName,
        on: 0,
        an: 0,
        revenue: 0,
        blockedNights: 0,
        weekendOn: 0,
        weekendAn: 0,
        reservationIds: new Set(),
      });
    }

    const current = siteMap.get(night.siteId)!;
    siteMap.set(night.siteId, {
      ...current,
      on: current.on + night.on,
      an: current.an + night.an,
      revenue: current.revenue + night.revenueLodgingNet,
      blockedNights: current.blockedNights + (night.isBlocked ? 1 : 0),
      weekendOn: current.weekendOn + (night.weekendFlag ? night.on : 0),
      weekendAn: current.weekendAn + (night.weekendFlag ? night.an : 0),
      reservationIds: night.reservationId
        ? current.reservationIds.add(night.reservationId)
        : current.reservationIds,
    });
  });

  return siteMap;
}

// Filter site nights by date range
export function filterByDateRange(
  siteNights: SiteNight[],
  start: Date,
  end: Date
): SiteNight[] {
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];

  return siteNights.filter(night => night.date >= startStr && night.date < endStr);
}

// Determine granularity based on date range
export function determineGranularity(start: Date, end: Date): Exclude<Granularity, 'auto'> {
  const days = differenceInDays(end, start);

  if (days > 90) return 'monthly';
  if (days >= 32) return 'weekly';
  return 'daily';
}
