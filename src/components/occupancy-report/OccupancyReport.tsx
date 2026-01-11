import React, { useState, useEffect, useMemo } from 'react';
import { OccupancyFiltersProvider, useOccupancyFilters } from '../../hooks/useOccupancyFilters';
import FilterBar from './FilterBar';
import SettingsModal from './SettingsModal';
import TotalOccupancyChart from './TotalOccupancyChart';
import AverageNightlyChart from './AverageNightlyChart';
import OccupancyTrendChart from './OccupancyTrendChart';
import OccupancyTable from './OccupancyTable';
import {
  generateSiteNightData,
  adjustSiteNightsForBlockedSetting,
  getSiteTypes,
} from '../../utils/mockDataGenerator';
import {
  calculateDonutData,
  calculateWeekdayData,
  calculateTrendData,
  calculateTableData,
} from '../../utils/aggregationFunctions';
import { filterByDateRange, determineGranularity } from '../../utils/calculationHelpers';
import { formatDateRange, calculateYoYDate } from '../../utils/dateHelpers';
import { SiteNight } from '../../types/occupancy.types';
import './OccupancyReport.css';

const OccupancyReportContent: React.FC = () => {
  const { filters, updateFilters } = useOccupancyFilters();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [allSiteNights, setAllSiteNights] = useState<SiteNight[]>([]);
  const [sites, setSites] = useState<{ id: string; name: string; typeId: string; typeName: string }[]>([]);
  const [siteTypes, setSiteTypes] = useState<{ id: string; name: string }[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current-high1');

  // Generate mock data on mount
  useEffect(() => {
    // Generate data for 400 days (covers current period + YoY period)
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2025-03-03');
    const mockData = generateSiteNightData(startDate, endDate);
    setAllSiteNights(mockData.siteNights);
    setSites(mockData.sites);
    setSiteTypes(getSiteTypes());
    setReservations(mockData.reservations);
  }, []);

  // Apply filters and settings to get filtered data
  const filteredData = useMemo(() => {
    let filtered = adjustSiteNightsForBlockedSetting(allSiteNights, filters.includeBlocked);

    // Filter by date range
    filtered = filterByDateRange(filtered, filters.dateRange.start, filters.dateRange.end);

    // Filter by sites
    if (filters.siteIds.length > 0) {
      filtered = filtered.filter(night => filters.siteIds.includes(night.siteId));
    }

    // Filter by site types
    if (filters.siteTypeIds.length > 0) {
      filtered = filtered.filter(night => filters.siteTypeIds.includes(night.siteTypeId));
    }

    return filtered;
  }, [allSiteNights, filters]);

  // Generate YoY data if needed
  const yoyData = useMemo(() => {
    if (!filters.showYoY) return undefined;

    const yoyStart = calculateYoYDate(filters.dateRange.start);
    const yoyEnd = calculateYoYDate(filters.dateRange.end);

    let yoyFiltered = adjustSiteNightsForBlockedSetting(allSiteNights, filters.includeBlocked);
    yoyFiltered = filterByDateRange(yoyFiltered, yoyStart, yoyEnd);

    if (filters.siteIds.length > 0) {
      yoyFiltered = yoyFiltered.filter(night => filters.siteIds.includes(night.siteId));
    }

    if (filters.siteTypeIds.length > 0) {
      yoyFiltered = yoyFiltered.filter(night => filters.siteTypeIds.includes(night.siteTypeId));
    }

    return yoyFiltered;
  }, [allSiteNights, filters]);

  // Calculate chart data
  const donutData = useMemo(() => {
    return calculateDonutData(filteredData, filters.includeBlocked);
  }, [filteredData, filters.includeBlocked]);

  const weekdayData = useMemo(() => {
    return calculateWeekdayData(filteredData, yoyData);
  }, [filteredData, yoyData]);

  const trendData = useMemo(() => {
    return calculateTrendData(filteredData, filters, yoyData);
  }, [filteredData, filters, yoyData]);

  const tableData = useMemo(() => {
    return calculateTableData(filteredData, reservations);
  }, [filteredData, reservations]);

  const granularity = filters.granularity === 'auto'
    ? determineGranularity(filters.dateRange.start, filters.dateRange.end)
    : filters.granularity as Exclude<typeof filters.granularity, 'auto'>;

  const handleExportCSV = () => {
    // Convert table data to CSV
    const headers = [
      'Site Name',
      'Site Type',
      '% Occupied',
      '# Occupied Nights',
      '# Available Nights',
      'Avg Length of Stay',
      '% Occupied Weekend',
      '# Blocked Nights',
      'ADR',
      'RevPAR',
    ];

    const csvRows = [
      headers.join(','),
      ...tableData.map(row =>
        [
          row.siteName,
          row.siteType,
          row.occupancyPercentage.toFixed(1),
          row.on,
          row.an,
          row.alos.toFixed(1),
          row.weekendOccupancyPercentage.toFixed(1),
          row.blockedNights,
          row.adr.toFixed(2),
          row.revpar.toFixed(2),
        ].join(',')
      ),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `occupancy-report-${filters.dateRange.start.toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    // Regenerate mock data
    const mockData = generateSiteNightData();
    setAllSiteNights(mockData.siteNights);
    setSites(mockData.sites);
    setReservations(mockData.reservations);
  };

  const handleToggleYoY = () => {
    updateFilters({ showYoY: !filters.showYoY });
  };

  const handleGranularityChange = (newGranularity: Exclude<typeof filters.granularity, 'auto'>) => {
    updateFilters({ granularity: newGranularity });
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  return (
    <div className="occupancy-report">
      <div className="breadcrumb">
        <span>Reports</span>
        <span className="separator"> &gt; </span>
        <span>Occupancy</span>
      </div>
      <div className="report-header">
        <h1>
          Occupancy: {formatDateRange(filters.dateRange.start, filters.dateRange.end)}
        </h1>
      </div>

      <FilterBar
        sites={sites}
        siteTypes={siteTypes}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefresh={handleRefresh}
      />

      <div className="charts-grid">
        <TotalOccupancyChart data={donutData} />
        <AverageNightlyChart
          data={weekdayData}
          showYoY={filters.showYoY}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
        <OccupancyTrendChart
          data={trendData}
          showYoY={filters.showYoY}
          granularity={granularity}
          onToggleYoY={handleToggleYoY}
          onGranularityChange={handleGranularityChange}
        />
      </div>

      <OccupancyTable data={tableData} onExportCSV={handleExportCSV} />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

const OccupancyReport: React.FC = () => {
  return (
    <OccupancyFiltersProvider>
      <OccupancyReportContent />
    </OccupancyFiltersProvider>
  );
};

export default OccupancyReport;
