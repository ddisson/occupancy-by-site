import { addDays, format, getDay } from 'date-fns';
import { SiteNight, Site, SiteType } from '../types/occupancy.types';

// Site types with different characteristics
const SITE_TYPES: SiteType[] = [
  { id: 'type-1', name: 'RV Full Hookup' },
  { id: 'type-2', name: 'RV Partial Hookup' },
  { id: 'type-3', name: 'Tent Site' },
  { id: 'type-4', name: 'Cabin' },
  { id: 'type-5', name: 'Glamping' },
];

// Generate sample sites
export function generateSites(count: number = 15): Site[] {
  const sites: Site[] = [];

  for (let i = 1; i <= count; i++) {
    const typeIndex = Math.floor(Math.random() * SITE_TYPES.length);
    const siteType = SITE_TYPES[typeIndex];

    sites.push({
      id: `site-${i}`,
      name: `Site ${String(i).padStart(3, '0')}`,
      typeId: siteType.id,
      typeName: siteType.name,
    });
  }

  return sites;
}

// Get site types
export function getSiteTypes(): SiteType[] {
  return SITE_TYPES;
}

// Helper to check if date is weekend (Fri, Sat nights)
function isWeekendNight(date: Date): boolean {
  const day = getDay(date);
  return day === 5 || day === 6; // Friday or Saturday
}

// Generate realistic ALOS-based reservations
interface Reservation {
  id: string;
  siteId: string;
  checkIn: Date;
  checkOut: Date;
  adr: number;
}

function generateReservations(
  sites: Site[],
  startDate: Date,
  endDate: Date
): Reservation[] {
  const reservations: Reservation[] = [];
  let reservationId = 1;

  sites.forEach(site => {
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      // Decide if this site gets occupied starting from currentDate
      const isWeekend = isWeekendNight(currentDate);
      const occupancyChance = isWeekend ? 0.75 : 0.55; // Higher on weekends

      if (Math.random() < occupancyChance) {
        // Generate realistic ALOS (2-7 nights, weighted toward shorter stays)
        const alosWeights = [0.3, 0.25, 0.2, 0.15, 0.07, 0.03]; // 2-7 nights
        const rand = Math.random();
        let alos = 2;
        let cumulative = 0;

        for (let i = 0; i < alosWeights.length; i++) {
          cumulative += alosWeights[i];
          if (rand < cumulative) {
            alos = i + 2;
            break;
          }
        }

        const checkOut = addDays(currentDate, alos);

        // ADR varies by site type and weekend
        const baseAdr = site.typeName.includes('Cabin') ? 120 :
                       site.typeName.includes('Glamping') ? 100 :
                       site.typeName.includes('RV Full') ? 60 :
                       site.typeName.includes('RV Partial') ? 45 :
                       35; // Tent

        const weekendMultiplier = isWeekend ? 1.2 : 1.0;
        const adr = baseAdr * weekendMultiplier * (0.8 + Math.random() * 0.4);

        reservations.push({
          id: `res-${reservationId++}`,
          siteId: site.id,
          checkIn: new Date(currentDate),
          checkOut,
          adr,
        });

        // Move to checkout date
        currentDate = checkOut;
      } else {
        // Move to next day
        currentDate = addDays(currentDate, 1);
      }
    }
  });

  return reservations;
}

// Main function to generate site_night data
export function generateSiteNightData(
  startDate: Date = new Date('2025-02-01'),
  endDate: Date = addDays(new Date('2025-02-01'), 30),
  siteCount: number = 15
): { siteNights: SiteNight[]; sites: Site[]; reservations: Reservation[] } {
  const sites = generateSites(siteCount);
  const reservations = generateReservations(sites, startDate, endDate);
  const siteNights: SiteNight[] = [];

  // Create a map of occupied dates by site
  const occupancyMap = new Map<string, Set<string>>();
  const reservationMap = new Map<string, string>(); // siteId-date -> reservationId
  const revenueMap = new Map<string, number>();

  reservations.forEach(res => {
    const nights = Math.ceil((res.checkOut.getTime() - res.checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const revenuePerNight = res.adr;

    let currentDate = new Date(res.checkIn);
    for (let i = 0; i < nights; i++) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const mapKey = `${res.siteId}-${dateKey}`;

      if (!occupancyMap.has(res.siteId)) {
        occupancyMap.set(res.siteId, new Set());
      }
      occupancyMap.get(res.siteId)!.add(dateKey);
      reservationMap.set(mapKey, res.id);
      revenueMap.set(mapKey, revenuePerNight);

      currentDate = addDays(currentDate, 1);
    }
  });

  // Generate blocked dates (~10% of total capacity)
  const blockedMap = new Map<string, Set<string>>();
  sites.forEach(site => {
    blockedMap.set(site.id, new Set());

    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      // 10% chance of being blocked, but not if already occupied
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const isOccupied = occupancyMap.get(site.id)?.has(dateKey);

      if (!isOccupied && Math.random() < 0.10) {
        blockedMap.get(site.id)!.add(dateKey);
      }

      currentDate = addDays(currentDate, 1);
    }
  });

  // Generate site_night rows for each site and each date
  sites.forEach(site => {
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const mapKey = `${site.id}-${dateKey}`;

      const isOccupied = occupancyMap.get(site.id)?.has(dateKey) || false;
      const isBlocked = blockedMap.get(site.id)?.has(dateKey) || false;
      const reservationId = reservationMap.get(mapKey);
      const revenue = revenueMap.get(mapKey) || 0;

      const weekday = getDay(currentDate);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const weekendFlag = isWeekendNight(currentDate);

      // Calculate ISO week (simplified - using approximation)
      const weekIso = Math.ceil(
        (currentDate.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
      );

      siteNights.push({
        date: dateKey,
        siteId: site.id,
        siteName: site.name,
        siteTypeId: site.typeId,
        siteTypeName: site.typeName,
        isBlocked,
        isOccupied,
        on: isOccupied ? 1 : 0,
        an: isBlocked ? 0 : 1, // Default: blocked excluded from capacity
        weekday,
        weekIso,
        month,
        year,
        revenueLodgingNet: revenue,
        weekendFlag,
        reservationId,
      });

      currentDate = addDays(currentDate, 1);
    }
  });

  return { siteNights, sites, reservations };
}

// Helper to adjust AN based on includeBlocked setting
export function adjustSiteNightsForBlockedSetting(
  siteNights: SiteNight[],
  includeBlocked: boolean
): SiteNight[] {
  return siteNights.map(night => ({
    ...night,
    an: includeBlocked ? 1 : (night.isBlocked ? 0 : 1),
  }));
}
