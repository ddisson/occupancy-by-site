import React, { useState } from 'react';
import { useOccupancyFilters } from '../../hooks/useOccupancyFilters';
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

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        [field]: newDate,
      },
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>
          Start Date:
          <input
            type="date"
            value={filters.dateRange.start.toISOString().split('T')[0]}
            onChange={e => handleDateChange('start', e.target.value)}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={filters.dateRange.end.toISOString().split('T')[0]}
            onChange={e => handleDateChange('end', e.target.value)}
          />
        </label>
      </div>

      <div className="filter-group">
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

      <div className="filter-group filter-dropdown-group">
        <label htmlFor="filter-select">Select unit:</label>
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
