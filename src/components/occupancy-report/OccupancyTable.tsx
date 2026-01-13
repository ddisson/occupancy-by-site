import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { SiteTableRow } from '../../types/occupancy.types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './OccupancyTable.css';

interface OccupancyTableProps {
  data: SiteTableRow[];
  onExportCSV: () => void;
}

const OccupancyTable: React.FC<OccupancyTableProps> = ({ data, onExportCSV }) => {
  const columnDefs: ColDef<SiteTableRow>[] = useMemo(
    () => [
      {
        field: 'siteName',
        headerName: 'Site', // Match Figma
        sortable: true,
        filter: true,
        pinned: 'left',
        width: 180,
      },
      {
        field: 'siteType',
        headerName: 'Type', // Match Figma
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        field: 'occupancyPercentage',
        headerName: 'Occupied nights, %', // Match Figma
        sortable: true,
        filter: 'agNumberColumnFilter',
        width: 180,
        cellRenderer: (params: any) => {
          const percentage = params.value;
          const occupiedNights = params.data?.on || 0;
          const fillWidth = Math.min(percentage, 100);
          return (
            <div className="occupancy-bar-cell">
              <div className="occupancy-progress-bar">
                <div
                  className="occupancy-progress-fill"
                  style={{ width: `${fillWidth}%` }}
                />
              </div>
              <span className="occupancy-label">{occupiedNights} ({percentage.toFixed(0)}%)</span>
            </div>
          );
        },
      },
      {
        field: 'an',
        headerName: 'Available', // Match Figma
        sortable: true,
        filter: 'agNumberColumnFilter',
        width: 100,
      },
      {
        field: 'alos',
        headerName: 'Av. Length of Stay', // Match Figma
        sortable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => `${params.value.toFixed(0)}`,
        width: 140,
      },
      {
        field: 'weekendOccupancyPercentage',
        headerName: 'Occupied Friday and Saturday, %', // Match Figma
        sortable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => `${Math.floor(params.data.on / 4)}/${Math.ceil(params.data.an / 7)} (${params.value.toFixed(0)}%)`,
        width: 200,
      },
      {
        field: 'adr',
        headerName: 'Average Nightly Rate', // Match Figma
        sortable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => `$${params.value.toFixed(0)}`,
        width: 160,
      },
      {
        field: 'revpar',
        headerName: 'Revenue per Site', // Match Figma
        sortable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => `$${params.value.toFixed(0)}`,
        width: 140,
      },
    ],
    []
  );

  const defaultColDef: ColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    []
  );

  return (
    <div className="occupancy-table-container">
      <div className="table-header">
        <div className="table-tabs">
          <button className="tab-button active">Report</button>
          <button className="tab-button">Occupancy Heatmap</button>
        </div>
        <button onClick={onExportCSV} className="export-button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 11L4 7H6.5V3H9.5V7H12L8 11Z" fill="currentColor"/>
            <path d="M3 13H13V14H3V13Z" fill="currentColor"/>
          </svg>
          CSV
        </button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={25}
          paginationPageSizeSelector={[10, 25, 50, 100]}
          enableCellTextSelection={true}
          suppressMovableColumns={false}
        />
      </div>
    </div>
  );
};

export default OccupancyTable;
