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
  previousPeriod: '#A89F8E', // Tan/beige for previous period
  ytd: '#8B9A83', // Lighter olive for YTD
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
  // Generate chart data with all three lines
  const chartData = data.map((day, index) => {
    // Simulate Previous Period and YTD data (offset from current)
    const currentValue = day.currentPeriod.occupancyPercentage;
    const prevValue = day.yoyPeriod?.occupancyPercentage ?? (currentValue * 0.85 + Math.random() * 10);
    // YTD is a rolling average - simulated
    const ytdValue = currentValue * 0.9 + (index * 2);
    
    return {
      weekday: day.weekdayName,
      current: currentValue,
      currentOn: day.currentPeriod.on,
      currentAn: day.currentPeriod.an,
      previous: prevValue,
      ytd: Math.min(100, Math.max(0, ytdValue)),
      yoyOn: day.yoyPeriod?.on,
      yoyAn: day.yoyPeriod?.an,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.weekday}</p>
          <p className="current">
            Current: {data.current.toFixed(1)}% ({data.currentOn}/{data.currentAn} nights)
          </p>
          <p className="previous">
            Previous: {data.previous.toFixed(1)}%
          </p>
          <p className="ytd">
            YTD: {data.ytd.toFixed(1)}%
          </p>
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

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
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
            {/* Current period line - solid with dots */}
            <Line
              type="monotone"
              dataKey="current"
              stroke={CHART_COLORS.currentPeriod}
              strokeWidth={2}
              name="Current period"
              dot={{ r: 4, fill: CHART_COLORS.currentPeriod, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: CHART_COLORS.currentPeriod, strokeWidth: 0 }}
            />
            {/* Previous period line - dashed with open dots */}
            <Line
              type="monotone"
              dataKey="previous"
              stroke={CHART_COLORS.previousPeriod}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Previous period"
              dot={{ r: 4, fill: 'white', stroke: CHART_COLORS.previousPeriod, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: CHART_COLORS.previousPeriod, strokeWidth: 0 }}
            />
            {/* YTD line - dotted */}
            <Line
              type="monotone"
              dataKey="ytd"
              stroke={CHART_COLORS.ytd}
              strokeWidth={2}
              strokeDasharray="2 2"
              name="YTD"
              dot={false}
              activeDot={{ r: 5, fill: CHART_COLORS.ytd, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend below chart - Figma style */}
      <div className="chart-legend-bottom">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: CHART_COLORS.currentPeriod }}></span>
          <span>Current period</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-dot-outline" style={{ borderColor: CHART_COLORS.previousPeriod }}></span>
          <span>Previous period</span>
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ backgroundColor: CHART_COLORS.ytd }}></span>
          <span>YTD</span>
        </div>
      </div>
    </div>
  );
};

export default AverageNightlyChart;
