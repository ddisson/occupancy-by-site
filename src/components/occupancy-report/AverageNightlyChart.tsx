import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { WeekdayChartData } from '../../types/occupancy.types';
import './AverageNightlyChart.css';

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
    <div className="chart-card">
      <div className="chart-header">
        <h3>Average Nightly Occupancy</h3>
        <div className="chart-controls">
          {onPeriodChange && (
            <div className="period-selector">
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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="weekday" />
            <YAxis
              domain={[0, 100]}
              tickFormatter={value => `${value}%`}
              label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#4CAF50"
              strokeWidth={2}
              name="Current Period"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            {showYoY && (
              <Line
                type="monotone"
                dataKey="yoy"
                stroke="#D4A574"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Year Ago"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AverageNightlyChart;
