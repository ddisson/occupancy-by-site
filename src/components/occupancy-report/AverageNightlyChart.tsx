import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { WeekdayChartData } from '../../types/occupancy.types';
import './AverageNightlyChart.css';

// Colors matching Figma design
const CHART_COLORS = {
  currentPeriod: '#4D5D45', // Dark olive green
  comparison: '#A89F8E', // Tan/beige for comparison
};

interface AverageNightlyChartProps {
  data: WeekdayChartData[];
  showYoY?: boolean;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

const AverageNightlyChart: React.FC<AverageNightlyChartProps> = ({
  data,
  showYoY = false,
  selectedPeriod = 'current-high1',
  onPeriodChange,
}) => {
  const chartData = data.map(day => ({
    weekday: day.weekdayName,
    current: day.currentPeriod.occupancyPercentage,
    currentOn: day.currentPeriod.on,
    currentAn: day.currentPeriod.an,
    yoy: day.yoyPeriod?.occupancyPercentage,
    yoyOn: day.yoyPeriod?.on,
    yoyAn: day.yoyPeriod?.an,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.weekday}</p>
          <p className="current">
            Current: {data.current.toFixed(1)}% ({data.currentOn}/{data.currentAn} nights)
          </p>
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
    <div className="chart-card average-nightly-chart">
      <div className="chart-header">
        <h3>Average Nightly Occupancy</h3>
        <div className="chart-controls">
          {onPeriodChange && (
            <div className="period-selector">
              <label>Select data</label>
              <select
                value={selectedPeriod}
                onChange={e => onPeriodChange(e.target.value)}
              >
                <option value="current-high1">Current, High season 1</option>
                <option value="current-high2">Current, High season 2</option>
                <option value="current-low">Current, Low season</option>
                <option value="yoy-high1">Year Ago, High season 1</option>
              </select>
            </div>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-line" style={{ backgroundColor: CHART_COLORS.currentPeriod }}></span>
          <span>Current period</span>
        </div>
        {showYoY && (
          <div className="legend-item">
            <span className="legend-line" style={{ backgroundColor: CHART_COLORS.comparison }}></span>
            <span>High season 2</span>
          </div>
        )}
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
            <XAxis 
              dataKey="weekday" 
              axisLine={{ stroke: '#E5E5E5' }}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={value => `${value}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#666' }}
              ticks={[0, 25, 50, 75, 100]}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="current"
              stroke={CHART_COLORS.currentPeriod}
              strokeWidth={2}
              name="Current period"
              dot={{ r: 4, fill: CHART_COLORS.currentPeriod, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: CHART_COLORS.currentPeriod, strokeWidth: 0 }}
            />
            {showYoY && (
              <Line
                type="monotone"
                dataKey="yoy"
                stroke={CHART_COLORS.comparison}
                strokeWidth={2}
                name="High season 2"
                dot={{ r: 4, fill: CHART_COLORS.comparison, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: CHART_COLORS.comparison, strokeWidth: 0 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AverageNightlyChart;
