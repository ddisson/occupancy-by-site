import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { DonutChartData } from '../../types/occupancy.types';
import './TotalOccupancyChart.css';

interface TotalOccupancyChartProps {
  data: DonutChartData;
}

const COLORS = {
  occupied: '#4CAF50',
  available: '#E0E0E0',
  blocked: '#D4A574',
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
    <div className="chart-card">
      <h3>Total occupancy</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={entry => `${entry.name}: ${entry.value}`}
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
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
        <div className="center-label">
          <div className="percentage">{data.occupancyPercentage.toFixed(1)}%</div>
          <div className="label">Occupancy</div>
        </div>
      </div>
      <div className="chart-summary">
        <div className="summary-item">
          <span className="label">Occupied:</span>
          <span className="value">{data.occupied} nights</span>
        </div>
        <div className="summary-item">
          <span className="label">Available:</span>
          <span className="value">{data.available} nights</span>
        </div>
        {data.blocked !== undefined && (
          <div className="summary-item">
            <span className="label">Blocked:</span>
            <span className="value">{data.blocked} nights</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalOccupancyChart;
