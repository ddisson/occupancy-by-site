import React, { useRef, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { TrendBucketData, Granularity } from '../../types/occupancy.types';
import './OccupancyTrendChart.css';

// Colors matching Figma design
const CHART_COLORS = {
  currentPeriod: '#4D5D45', // Dark olive green
  currentPeriodFaded: 'rgba(77, 93, 69, 0.5)', // Faded for non-selected
  previousPeriod: '#A89F8E', // Tan/beige for previous period
  previousPeriodFaded: 'rgba(168, 159, 142, 0.5)',
};

// Chart dimensions constants
const CHART_HEIGHT = 280;
const Y_AXIS_WIDTH = 45;
const X_AXIS_HEIGHT_DAILY = 60;
const X_AXIS_HEIGHT_DEFAULT = 30;

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => data.map(bucket => ({
    label: bucket.bucketLabel,
    current: bucket.fullBucketOccupancy,
    yoy: bucket.yoyOccupancy,
    isSelected: bucket.isInSelection,
    on: bucket.on,
    an: bucket.an,
    yoyOn: bucket.yoyOn,
    yoyAn: bucket.yoyAn,
    selectionOccupancy: bucket.selectionOccupancy,
  })), [data]);

  // Calculate chart dimensions based on granularity and data count
  const { chartWidth, barSize, needsScroll, useResponsive } = useMemo(() => {
    const dataCount = chartData.length;
    
    // For monthly view (12 bars), use responsive container to fill space
    if (granularity === 'monthly') {
      return {
        chartWidth: 0, // Will use ResponsiveContainer
        barSize: showYoY ? 30 : 50, // Flexible bar size
        needsScroll: false,
        useResponsive: true,
      };
    }
    
    // For weekly/daily, calculate minimum width needed
    let minBarWidth: number;
    if (granularity === 'weekly') {
      minBarWidth = showYoY ? 20 : 28;
    } else {
      minBarWidth = showYoY ? 16 : 24;
    }
    
    const groupGap = 12;
    const barsPerGroup = showYoY ? 2 : 1;
    const groupWidth = (minBarWidth * barsPerGroup) + (showYoY ? 4 : 0) + groupGap;
    const calculatedWidth = dataCount * groupWidth + 60;
    
    return {
      chartWidth: calculatedWidth,
      barSize: minBarWidth,
      needsScroll: true,
      useResponsive: false,
    };
  }, [chartData.length, showYoY, granularity]);

  const bottomMargin = granularity === 'daily' ? X_AXIS_HEIGHT_DAILY : X_AXIS_HEIGHT_DEFAULT;

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

      {/* Chart area - responsive or scrollable depending on granularity */}
      {useResponsive ? (
        // Responsive container for monthly view - fills available space
        <div className="chart-responsive-container">
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <BarChart 
              data={chartData} 
              margin={{ top: 10, right: 20, left: 10, bottom: bottomMargin }}
              barGap={showYoY ? 2 : 0}
              barCategoryGap={showYoY ? '15%' : '20%'}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
              <XAxis
                dataKey="label"
                axisLine={{ stroke: '#E5E5E5' }}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#666' }}
                interval={0}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={value => `${value}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#666' }}
                ticks={[0, 25, 50, 75, 100]}
                width={Y_AXIS_WIDTH}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="current" 
                name="Current period" 
                radius={[2, 2, 0, 0]}
                maxBarSize={barSize}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-current-${index}`}
                    fill={entry.isSelected ? CHART_COLORS.currentPeriod : CHART_COLORS.currentPeriodFaded}
                  />
                ))}
              </Bar>
              {showYoY && (
                <Bar
                  dataKey="yoy"
                  name="Previous period"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={barSize}
                  fill={CHART_COLORS.previousPeriod}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        // Scrollable container for weekly/daily views
        <div className="chart-with-sticky-axis">
          {/* Fixed Y-axis - always visible */}
          <div className="sticky-y-axis">
            <BarChart
              data={chartData.slice(0, 1)}
              width={Y_AXIS_WIDTH}
              height={CHART_HEIGHT}
              margin={{ top: 10, right: 0, left: 0, bottom: bottomMargin }}
            >
              <YAxis
                domain={[0, 100]}
                tickFormatter={value => `${value}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#666' }}
                ticks={[0, 25, 50, 75, 100]}
                width={Y_AXIS_WIDTH}
                orientation="left"
              />
            </BarChart>
          </div>

          {/* Scrollable chart area */}
          <div 
            className={`chart-scroll-container ${needsScroll ? 'has-scroll' : ''}`}
            ref={scrollContainerRef}
          >
            <div 
              className="chart-inner" 
              style={{ width: chartWidth, minWidth: chartWidth }}
            >
              <BarChart 
                data={chartData} 
                width={chartWidth}
                height={CHART_HEIGHT}
                margin={{ top: 10, right: 20, left: 0, bottom: bottomMargin }}
                barGap={showYoY ? 2 : 0}
                barCategoryGap={showYoY ? '15%' : '25%'}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis
                  dataKey="label"
                  axisLine={{ stroke: '#E5E5E5' }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#666' }}
                  angle={granularity === 'daily' ? -45 : 0}
                  textAnchor={granularity === 'daily' ? 'end' : 'middle'}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                  width={0}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="current" 
                  name="Current period" 
                  radius={[2, 2, 0, 0]}
                  maxBarSize={barSize}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-current-${index}`}
                      fill={entry.isSelected ? CHART_COLORS.currentPeriod : CHART_COLORS.currentPeriodFaded}
                    />
                  ))}
                </Bar>
                {showYoY && (
                  <Bar
                    dataKey="yoy"
                    name="Previous period"
                    radius={[2, 2, 0, 0]}
                    maxBarSize={barSize}
                    fill={CHART_COLORS.previousPeriod}
                  />
                )}
              </BarChart>
            </div>
          </div>
        </div>
      )}

      {/* Legend below the chart */}
      <div className="chart-legend-bottom">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: CHART_COLORS.currentPeriod }}></span>
          <span>Current period</span>
        </div>
        {showYoY && (
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: CHART_COLORS.previousPeriod }}></span>
            <span>Previous period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OccupancyTrendChart;
