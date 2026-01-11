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
        headerName: 'Site Name',
        sortable: true,
        filter: true,
        pinned: 'left',
        width: 150,
      },
      {
        field: 'siteType',
        headerName: 'Site Type',
        sortable: true,
        filter: true,
        width: 150,
      },
      {
        field: 'occupancyPercentage',
        headerName: '% Occupied',
        sortable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => `${params.value.toFixed(1)}%`,
        width: 130,
        cellStyle: { fontWeight: 'bold' },
      },
      {
        field: 'on',
        headerName: '# Occupied Nights',
        sortable: true,
        filter: 'agNumberColumnFilter',
        width: 160,
        cellRenderer: (params: any) => {
          const percentage = (params.data.on / params.data.an) * 100;
          return (
            <div className="bar-cell">
              <div
                className="bar-fill"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: '#4CAF50',
                  height: '20px',
                  borderRadius: '3px',
                }}
              />
              <span className="bar-text">{params.value}</span>
            </div>
          );
        },
      },
      {
        field: 'an',
        headerName: '# Available Nights',
        sortable: true,
        filter: 'agNumberColumnFilter',
        width: 170,
      },
      {
        field: 'alos',
        headerName: 'Avg Length of Stay',
        sortable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => `${params.value.toFixed(1)} nights`,
        width: 170,
      },
      {
        field: 'weekendOccupancyPercentage',
        headerName: '% Occupied Weekend',
        sortable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => `${params.value.toFixed(1)}%`,
        width: 180,
      },
      {
        field: 'blockedNights',
        headerName: '# Blocked Nights',
        sortable: true,
        filter: 'agNumberColumnFilter',
        width: 160,
      },
      {
        field: 'adr',
        headerName: 'ADR',
        sortable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => `$${params.value.toFixed(2)}`,
        width: 120,
      },
      {
        field: 'revpar',
        headerName: 'RevPAR',
        sortable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => `$${params.value.toFixed(2)}`,
        width: 120,
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
        <h3>Site Details</h3>
        <button onClick={onExportCSV} className="export-button">
          📥 Export CSV
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
