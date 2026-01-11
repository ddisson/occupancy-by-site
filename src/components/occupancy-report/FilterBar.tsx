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
            By Site
          </button>
          <button
            className={filterMode === 'type' ? 'active' : ''}
            onClick={() => setFilterMode('type')}
          >
            By Type
          </button>
        </div>

        {filterMode === 'site' && (
          <div className="filter-select">
            <select
              multiple
              value={filters.siteIds}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                updateFilters({ siteIds: selected });
              }}
            >
              <option value="">All Sites</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {filterMode === 'type' && (
          <div className="filter-select">
            <select
              multiple
              value={filters.siteTypeIds}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                updateFilters({ siteTypeIds: selected });
              }}
            >
              <option value="">All Types</option>
              {siteTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="filter-actions">
        <button onClick={onOpenSettings} className="settings-button" title="Settings">
          ⚙️ Settings
        </button>
        <button onClick={onRefresh} className="refresh-button" title="Refresh">
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
