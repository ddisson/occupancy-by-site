import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { DonutChartData } from '../../types/occupancy.types';
import './TotalOccupancyChart.css';

interface TotalOccupancyChartProps {
  data: DonutChartData;
}

// Colors matching Figma design
const COLORS = {
  occupied: '#4D5D45', // Dark olive green
  available: '#E8E4DB', // Light beige/cream
  blocked: '#A89F8E', // Tan/beige
};

const TotalOccupancyChart: React.FC<TotalOccupancyChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Nights occupied', value: data.occupied, color: COLORS.occupied },
    { name: 'Available', value: data.available, color: COLORS.available },
  ];

  if (data.blocked !== undefined && data.blocked > 0) {
    chartData.push({ name: 'Blocked', value: data.blocked, color: COLORS.blocked });
  }

  const totalNights = chartData.reduce((sum, entry) => sum + entry.value, 0);

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="custom-legend">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} style={{ color: entry.color }}>
            <span className="legend-icon" style={{ backgroundColor: entry.color }}></span>
            {entry.value} {chartData[index].value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="chart-card total-occupancy-chart">
      <h3>Total occupancy</h3>
      <div className="chart-content-row">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} nights (${((value / totalNights) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="center-label">
            <div className="percentage">{data.occupancyPercentage.toFixed(1)}%</div>
          </div>
        </div>
        <div className="chart-legend-side">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: COLORS.occupied }}></span>
            <span>Nights occupied <strong>{data.occupied}</strong></span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: COLORS.available }}></span>
            <span>Available <strong>{data.available}</strong></span>
          </div>
        </div>
      </div>
      <div className="chart-note">
        Blocked nights included in occupancy
      </div>
    </div>
  );
};

export default TotalOccupancyChart;
