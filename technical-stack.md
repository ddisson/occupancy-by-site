# Technical Stack - Occupancy by Site Report

## Frontend Framework
- **React** (Latest stable version)
- **TypeScript** (for type safety)

## UI Libraries

### Charts
- **Recharts** ^2.x
  - Purpose: All chart visualizations
  - Components used:
    - `PieChart` / `Pie` - Total Occupancy donut
    - `LineChart` / `Line` - Average Nightly Occupancy
    - `BarChart` / `Bar` - Occupancy Trend
  - License: MIT

### Data Table
- **AG-Grid Community** ^31.x
  - Purpose: Site-level data table
  - Features needed:
    - Column sorting
    - Pagination
    - CSV export
    - Column show/hide
    - Responsive design
  - License: MIT (Community Edition)

## Styling
- **CSS Modules** or **Styled Components** (TBD based on existing project)
- **Tailwind CSS** (optional, if already in project)

## Date Handling
- **date-fns** ^3.x
  - Purpose: Date formatting, calculations, week/month logic
  - US week definition (Sun-Sat)
  - mm/dd/yyyy formatting
  - YoY -364 day calculations

## State Management
- **React State** (useState, useReducer)
- **Context API** (for filter state sharing between charts)
- **React Query** (optional - for API data fetching when ready)

## Utilities
- **clsx** or **classnames** - Conditional CSS classes
- **lodash** (optional) - Data manipulation if needed

## Development Tools
- **Vite** or **Create React App** - Build tool (TBD)
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Data Layer (Development Phase)
- **Mock Data Generator** - Custom utility for generating sample site_night data
- Later: REST API integration (`/api/reports/occupancy/by-site`)

## Build & Deploy
- TBD based on existing infrastructure
- Expected: Standard React build process

## Dependencies Summary

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "recharts": "^2.x",
    "ag-grid-react": "^31.x",
    "ag-grid-community": "^31.x",
    "date-fns": "^3.x",
    "clsx": "^2.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "typescript": "^5.x",
    "vite": "^5.x"
  }
}
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- Flexbox/Grid CSS layout
