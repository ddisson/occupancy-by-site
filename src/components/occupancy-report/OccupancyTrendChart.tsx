import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendBucketData, Granularity } from '../../types/occupancy.types';
import './OccupancyTrendChart.css';

interface OccupancyTrendChartProps {
  data: TrendBucketData[];
  showYoY?: boolean;
  granularity: Exclude<Granularity, 'auto'>;
  onToggleYoY?: () => void;
  onGranularityChange?: (granularity: Exclude<Granularity, 'auto'>) => void;
}

const OccupancyTrendChart: React.FC<OccupancyTrendChartProps> = ({
  data,
  showYoY = false,
  granularity,
  onToggleYoY,
  onGranularityChange,
}) => {
  const chartData = data.map(bucket => ({
    label: bucket.bucketLabel,
    current: bucket.fullBucketOccupancy,
    yoy: bucket.yoyOccupancy,
    isSelected: bucket.isInSelection,
    on: bucket.on,
    an: bucket.an,
    yoyOn: bucket.yoyOn,
    yoyAn: bucket.yoyAn,
    selectionOccupancy: bucket.selectionOccupancy,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.label}</p>
          <p className="current">
            Current: {data.current.toFixed(1)}% ({data.on}/{data.an} nights)
          </p>
          {data.selectionOccupancy !== undefined && data.selectionOccupancy !== data.current && (
            <p className="selection">
              Selection: {data.selectionOccupancy.toFixed(1)}%
            </p>
          )}
          {showYoY && data.yoy !== undefined && (
            <p className="yoy">
              Year ago: {data.yoy.toFixed(1)}% ({data.yoyOn}/{data.yoyAn} nights)
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-card trend-chart">
      <div className="chart-header">
        <h3>Occupancy trend</h3>
        <div className="chart-controls">
          {onToggleYoY && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showYoY}
                onChange={onToggleYoY}
              />
              Previous period
            </label>
          )}
          {onGranularityChange && (
            <div className="granularity-control">
              <label htmlFor="granularity-select">Show data by</label>
              <select
                id="granularity-select"
                value={granularity}
                onChange={e => onGranularityChange(e.target.value as Exclude<Granularity, 'auto'>)}
              >
                <option value="daily">Days</option>
                <option value="weekly">Weeks</option>
                <option value="monthly">Months</option>
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              angle={granularity === 'daily' ? -45 : 0}
              textAnchor={granularity === 'daily' ? 'end' : 'middle'}
              height={granularity === 'daily' ? 80 : 50}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={value => `${value}%`}
              label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="current" name="Current Period" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isSelected ? '#D4A574' : 'rgba(212, 165, 116, 0.5)'}
                />
              ))}
            </Bar>
            {showYoY && (
              <Bar
                dataKey="yoy"
                name="Year Ago"
                fill="#4D8C57"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OccupancyTrendChart;
