import { useState, createContext, useContext, ReactNode } from 'react';
import { OccupancyFilters, OccupancySettings } from '../types/occupancy.types';
import { addDays } from 'date-fns';

// Default filter values
const defaultFilters: OccupancyFilters = {
  dateRange: {
    start: new Date('2025-02-01'),
    end: addDays(new Date('2025-02-01'), 30),
  },
  siteIds: [],
  siteTypeIds: [],
  includeBlocked: false,
  showYoY: false,
  granularity: 'auto',
  tails: 2,
};

const defaultSettings: OccupancySettings = {
  includeBlocked: false,
  showYoY: false,
  normalizeFebruary: false,
  granularity: 'auto',
  tails: 2,
  exportOptions: 'table-only',
};

interface OccupancyFiltersContextValue {
  filters: OccupancyFilters;
  settings: OccupancySettings;
  updateFilters: (updates: Partial<OccupancyFilters>) => void;
  updateSettings: (updates: Partial<OccupancySettings>) => void;
  resetFilters: () => void;
}

const OccupancyFiltersContext = createContext<OccupancyFiltersContextValue | undefined>(
  undefined
);

// Custom hook to use occupancy filters
export function useOccupancyFilters() {
  const context = useContext(OccupancyFiltersContext);

  if (!context) {
    throw new Error('useOccupancyFilters must be used within OccupancyFiltersProvider');
  }

  return context;
}

// Provider component
export function OccupancyFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<OccupancyFilters>(defaultFilters);
  const [settings, setSettings] = useState<OccupancySettings>(defaultSettings);

  const updateFilters = (updates: Partial<OccupancyFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<OccupancySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));

    // Sync relevant settings to filters
    const filterUpdates: Partial<OccupancyFilters> = {};

    if ('includeBlocked' in updates) {
      filterUpdates.includeBlocked = updates.includeBlocked;
    }
    if ('showYoY' in updates) {
      filterUpdates.showYoY = updates.showYoY;
    }
    if ('granularity' in updates) {
      filterUpdates.granularity = updates.granularity;
    }
    if ('tails' in updates) {
      filterUpdates.tails = updates.tails;
    }

    if (Object.keys(filterUpdates).length > 0) {
      updateFilters(filterUpdates);
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSettings(defaultSettings);
  };

  const value: OccupancyFiltersContextValue = {
    filters,
    settings,
    updateFilters,
    updateSettings,
    resetFilters,
  };

  return (
    <OccupancyFiltersContext.Provider value={value}>
      {children}
    </OccupancyFiltersContext.Provider>
  );
}
