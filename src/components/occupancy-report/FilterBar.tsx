import React, { useState } from 'react';
import { useOccupancyFilters } from '../../hooks/useOccupancyFilters';
import DateRangePicker from './DateRangePicker';
import './FilterBar.css';

interface FilterBarProps {
  sites: { id: string; name: string }[];
  siteTypes: { id: string; name: string }[];
  onOpenSettings: () => void;
  onRefresh: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  sites,
  siteTypes,
  onOpenSettings,
  onRefresh,
}) => {
  const { filters, updateFilters } = useOccupancyFilters();
  const [filterMode, setFilterMode] = useState<'site' | 'type'>('site');

  const handleDateRangeChange = (start: Date, end: Date) => {
    updateFilters({
      dateRange: { start, end },
    });
  };

  return (
    <div className="filter-bar">
      {/* Date Range Picker */}
      <div className="filter-group">
        <DateRangePicker
          startDate={filters.dateRange.start}
          endDate={filters.dateRange.end}
          onChange={handleDateRangeChange}
          label="Select date period"
        />
      </div>

      {/* Select Unit - stacked layout like Figma */}
      <div className="filter-group filter-dropdown-group">
        <span className="filter-dropdown-label">Select unit</span>
        {filterMode === 'site' && (
          <select
            id="filter-select"
            className="filter-dropdown"
            value={filters.siteIds.length > 0 ? filters.siteIds[0] : ''}
            onChange={e => {
              updateFilters({ siteIds: e.target.value ? [e.target.value] : [] });
            }}
          >
            <option value="">All</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        )}

        {filterMode === 'type' && (
          <select
            id="filter-select"
            className="filter-dropdown"
            value={filters.siteTypeIds.length > 0 ? filters.siteTypeIds[0] : ''}
            onChange={e => {
              updateFilters({ siteTypeIds: e.target.value ? [e.target.value] : [] });
            }}
          >
            <option value="">All</option>
            {siteTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Site/Type Toggle - moved to right side like Figma */}
      <div className="filter-group filter-toggle-group">
        <div className="filter-mode-toggle">
          <button
            className={filterMode === 'site' ? 'active' : ''}
            onClick={() => setFilterMode('site')}
          >
            Site
          </button>
          <button
            className={filterMode === 'type' ? 'active' : ''}
            onClick={() => setFilterMode('type')}
          >
            Type
          </button>
        </div>
      </div>

      {/* Settings & Refresh */}
      <div className="filter-actions">
        <button onClick={onOpenSettings} className="settings-button" title="Settings" aria-label="Settings">
          ⚙️
        </button>
        <button onClick={onRefresh} className="refresh-button" title="Refresh" aria-label="Refresh">
          🔄
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
