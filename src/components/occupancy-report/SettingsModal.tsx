import React from 'react';
import { useOccupancyFilters } from '../../hooks/useOccupancyFilters';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useOccupancyFilters();

  if (!isOpen) return null;

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleGranularityChange = (value: 'auto' | 'monthly' | 'weekly' | 'daily') => {
    updateSettings({ granularity: value });
  };

  const handleTailsChange = (value: number) => {
    updateSettings({ tails: value });
  };

  const handleExportOptionsChange = (value: 'table-only' | 'include-charts') => {
    updateSettings({ exportOptions: value });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report Settings</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="setting-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.includeBlocked}
                onChange={() => handleToggle('includeBlocked')}
              />
              <span>Include Blocked days in Capacity</span>
            </label>
            <p className="setting-description">
              When enabled, blocked nights are counted in Available Nights (AN).
            </p>
          </div>

          <div className="setting-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.showYoY}
                onChange={() => handleToggle('showYoY')}
              />
              <span>Show previous year comparison</span>
            </label>
            <p className="setting-description">
              Display year-over-year data (-364 days for weekday alignment).
            </p>
          </div>

          <div className="setting-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.normalizeFebruary}
                onChange={() => handleToggle('normalizeFebruary')}
              />
              <span>Normalize February (leap year adjustment)</span>
            </label>
            <p className="setting-description">
              Rarely needed. Adjusts February comparisons for leap years.
            </p>
          </div>

          <div className="setting-group">
            <label>
              <strong>Trend Granularity:</strong>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="granularity"
                  value="auto"
                  checked={settings.granularity === 'auto'}
                  onChange={() => handleGranularityChange('auto')}
                />
                <span>Auto (based on date range)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="granularity"
                  value="monthly"
                  checked={settings.granularity === 'monthly'}
                  onChange={() => handleGranularityChange('monthly')}
                />
                <span>Monthly</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="granularity"
                  value="weekly"
                  checked={settings.granularity === 'weekly'}
                  onChange={() => handleGranularityChange('weekly')}
                />
                <span>Weekly</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="granularity"
                  value="daily"
                  checked={settings.granularity === 'daily'}
                  onChange={() => handleGranularityChange('daily')}
                />
                <span>Daily</span>
              </label>
            </div>
          </div>

          <div className="setting-group">
            <label>
              <strong>Trend Tails (context buckets):</strong>
            </label>
            <input
              type="range"
              min="0"
              max="6"
              value={settings.tails}
              onChange={e => handleTailsChange(Number(e.target.value))}
              className="slider"
            />
            <p className="setting-description">
              {settings.tails} bucket{settings.tails !== 1 ? 's' : ''} before/after selection
            </p>
          </div>

          <div className="setting-group">
            <label>
              <strong>Export Options:</strong>
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="exportOptions"
                  value="table-only"
                  checked={settings.exportOptions === 'table-only'}
                  onChange={() => handleExportOptionsChange('table-only')}
                />
                <span>Table only</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="exportOptions"
                  value="include-charts"
                  checked={settings.exportOptions === 'include-charts'}
                  onChange={() => handleExportOptionsChange('include-charts')}
                />
                <span>Include chart data</span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
