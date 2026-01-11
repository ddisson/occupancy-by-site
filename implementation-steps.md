Okay, implement all steps from the implementation steps.md according to the product requirements and technical stack.# Implementation Steps - Occupancy by Site Report

## Phase 1: Project Setup

### 1.1 Initialize Project Structure
- [ ] Set up React + TypeScript project (Vite or CRA)
- [ ] Configure folder structure:
  ```
  src/
  ├── components/
  │   ├── occupancy-report/
  │   │   ├── OccupancyReport.tsx
  │   │   ├── TotalOccupancyChart.tsx
  │   │   ├── AverageNightlyChart.tsx
  │   │   ├── OccupancyTrendChart.tsx
  │   │   ├── OccupancyTable.tsx
  │   │   ├── FilterBar.tsx
  │   │   └── SettingsModal.tsx
  │   └── shared/
  ├── utils/
  │   ├── mockDataGenerator.ts
  │   ├── dateHelpers.ts
  │   └── calculationHelpers.ts
  ├── types/
  │   └── occupancy.types.ts
  └── hooks/
      └── useOccupancyFilters.ts
  ```

### 1.2 Install Dependencies
- [ ] Install Recharts: `npm install recharts`
- [ ] Install AG-Grid: `npm install ag-grid-react ag-grid-community`
- [ ] Install date-fns: `npm install date-fns`
- [ ] Install utilities: `npm install clsx`
- [ ] Install dev dependencies (TypeScript types)

## Phase 2: Type Definitions & Data Models

### 2.1 Create TypeScript Interfaces
- [ ] Define `SiteNight` interface (matching PRD §5.1)
- [ ] Define `OccupancyFilters` interface
- [ ] Define `OccupancySettings` interface
- [ ] Define chart data interfaces:
  - `DonutChartData`
  - `WeekdayChartData`
  - `TrendBucketData`
- [ ] Define `SiteTableRow` interface
- [ ] Define API response types (for future integration)

## Phase 3: Mock Data Generation

### 3.1 Create Mock Data Generator
- [ ] Implement `generateSiteNightData()` function:
  - Generate sample sites (10-20 sites with varied types)
  - Generate date range (default: 30 days)
  - Randomize occupancy patterns (weekends higher)
  - Include blocked nights (~10% of capacity)
  - Calculate revenue (ADR range $50-$150)
  - Ensure realistic ALOS (2-7 nights)

### 3.2 Create Aggregation Functions
- [ ] `calculateDonutData(siteNights, filters)` → ON/AN/Blocked
- [ ] `calculateWeekdayData(siteNights, filters)` → 7 weekday averages
- [ ] `calculateTrendData(siteNights, filters, granularity)` → bucket array
- [ ] `calculateTableData(siteNights, filters)` → site rows with KPIs
- [ ] `calculateYoYData(siteNights, filters)` → comparison dataset

### 3.3 Implement Business Logic
- [ ] Exclude draft reservations filter
- [ ] Blocked nights capacity toggle (default: excluded)
- [ ] Week calculation (US Sun-Sat, W1 = first full week)
- [ ] YoY alignment (-364 days)
- [ ] Revenue pro-rata allocation logic
- [ ] ADR = L / ON calculation
- [ ] RevPAR = L / AN calculation

## Phase 4: Utility Functions

### 4.1 Date Helpers
- [ ] `formatDateRange(start, end)` → "Feb 27 – Mar 26, 2025 (30 nights)"
- [ ] `getWeekdayName(dow)` → "Sun", "Mon", etc.
- [ ] `getWeekBounds(date)` → [startSun, endSat]
- [ ] `getMonthBounds(date)` → [start, end]
- [ ] `isWeekend(date)` → boolean (Fri-Sun nights)
- [ ] `calculateYoYDate(date)` → date - 364 days

### 4.2 Calculation Helpers
- [ ] `calculateOccupancyRate(on, an)` → percentage
- [ ] `aggregateByWeekday(siteNights)` → Map<dow, metrics>
- [ ] `aggregateByBucket(siteNights, mode)` → bucket array
- [ ] `filterByDateRange(siteNights, start, end)` → filtered array

## Phase 5: Filter & Settings Management

### 5.1 Create Filter Hook
- [ ] `useOccupancyFilters()` hook:
  - State: dateRange, siteIds, siteTypeIds
  - State: includeBlocked, showYoY, granularity, tails
  - Methods: updateFilters, resetFilters
  - Context provider for global state

### 5.2 Build Filter Bar Component
- [ ] Date picker (range selector)
- [ ] Unit selector (conditional rendering)
- [ ] Site filter (multi-select)
- [ ] Site type filter (multi-select)
- [ ] Site/Type toggle button
- [ ] Settings gear icon button
- [ ] Refresh button

### 5.3 Build Settings Modal
- [ ] "Include Blocked" toggle
- [ ] "Show previous year" toggle
- [ ] Granularity selector (Auto/Monthly/Weekly/Daily)
- [ ] Tails slider (0-6)
- [ ] Export options (Table only / Include charts)

## Phase 6: Chart Components

### 6.1 Total Occupancy Donut Chart
- [ ] Recharts `PieChart` with `Pie` component
- [ ] Three segments: Occupied, Available, Blocked (conditional)
- [ ] Center label: "60.26%" with occupancy percentage
- [ ] Legend with counts
- [ ] Tooltips with numbers
- [ ] Colors matching Figma (green, gray, tan)
- [ ] Responsive sizing

### 6.2 Average Nightly Occupancy Line Chart
- [ ] Recharts `LineChart` with dual `Line` components
- [ ] X-axis: Sun → Sat (7 points)
- [ ] Y-axis: 0% → 100% (fixed, non-scrolling)
- [ ] Current period line (darker)
- [ ] Comparison line(s): YoY, High Season (conditional, lighter)
- [ ] Grid lines
- [ ] Tooltips: "Thu: 75% (12/16 nights)"
- [ ] Legend toggle for comparisons
- [ ] Dropdown: "Current, High season 1" selector

### 6.3 Occupancy Trend Bar Chart
- [ ] Recharts `BarChart` with grouped `Bar` components
- [ ] X-axis: Date labels (dynamic based on granularity)
- [ ] Y-axis: 0% → 100% (fixed, non-scrolling)
- [ ] Current period bars (darker green)
- [ ] Previous period bars (tan/beige, conditional)
- [ ] Selection highlighting (full saturation vs 40% opacity)
- [ ] Tooltips: Full bucket context + selection slice metrics
- [ ] Mode selector: Weeks/Months/Days dropdown
- [ ] "Previous period" checkbox
- [ ] Auto-granularity logic (>90d=Monthly, 32-90d=Weekly, ≤31d=Daily)

### 6.4 Chart Polish
- [ ] Consistent color palette across all charts
- [ ] Responsive breakpoints (mobile/tablet/desktop)
- [ ] Loading skeletons
- [ ] Empty states: "No data for selected filters"
- [ ] Accessibility: aria-labels, keyboard navigation

## Phase 7: Data Table Component

### 7.1 AG-Grid Setup
- [ ] Initialize AG-Grid with Community Edition
- [ ] Configure column definitions (per PRD §4.5):
  - Site name
  - Site type
  - % Occupied
  - # Occupied nights (ON)
  - # Available nights (AN)
  - Avg Length of Stay
  - % Occupied weekend nights
  - # Blocked nights
  - ADR
  - RevPAR
- [ ] Column sorting (all columns)
- [ ] Column show/hide menu
- [ ] Sticky header row

### 7.2 Table Features
- [ ] Pagination (10/25/50/100 rows per page)
- [ ] Row data from `calculateTableData()` mock function
- [ ] Occupied nights column: Horizontal bar visualization
- [ ] Number formatting ($999, 70%, etc.)
- [ ] CSV export button (top-right)
- [ ] Export respects current filters
- [ ] Empty state handling

### 7.3 Table Styling
- [ ] Match Figma design (fonts, spacing, colors)
- [ ] Alternating row backgrounds
- [ ] Hover states
- [ ] Mobile responsive (horizontal scroll)

## Phase 8: Integration & Layout

### 8.1 Main Report Component
- [ ] Assemble all components in `OccupancyReport.tsx`
- [ ] Layout structure matching Figma:
  - Header with title and date range
  - Filter bar
  - Three chart cards (2-column grid on desktop)
  - Full-width table below
- [ ] Wire up filter context to all components
- [ ] Synchronize filter changes across charts and table

### 8.2 State Management
- [ ] Filter changes trigger data recalculation
- [ ] Loading states during "refresh"
- [ ] Error boundaries for chart/table failures

### 8.3 Responsive Design
- [ ] Desktop: 2-column chart grid
- [ ] Tablet: 1-column chart stack
- [ ] Mobile: Full stack, horizontal table scroll

## Phase 9: Testing & Validation

### 9.1 Data Validation
- [ ] Verify mock data matches PRD business rules
- [ ] Test blocked toggle affects all visualizations
- [ ] Test YoY comparison calculations
- [ ] Test granularity auto-selection logic
- [ ] Verify ADR/RevPAR calculations

### 9.2 Visual QA
- [ ] Compare against Figma pixel-by-pixel
- [ ] Test all filter combinations
- [ ] Test settings permutations
- [ ] Verify chart tooltips display correctly
- [ ] Check responsive breakpoints

### 9.3 Performance Testing
- [ ] Load 500 sites × 365 days mock data
- [ ] Measure render time (<2s target)
- [ ] Test filter change responsiveness
- [ ] Test CSV export with large datasets

## Phase 10: Polish & Documentation

### 10.1 Code Quality
- [ ] Add PropTypes/TypeScript types to all components
- [ ] Add inline code comments for complex logic
- [ ] Clean up console logs
- [ ] ESLint/Prettier formatting

### 10.2 Documentation
- [ ] Update CHANGELOG.md with implementation notes
- [ ] Document component props and usage
- [ ] Create README with setup instructions
- [ ] Add inline code examples

### 10.3 Handoff Preparation
- [ ] Create demo with various filter scenarios
- [ ] Document API integration points (future)
- [ ] List known limitations or TODOs
- [ ] Update technical-stack.md with final versions

## Phase 11: API Integration (Future)

### 11.1 API Layer (when backend ready)
- [ ] Create API service module
- [ ] Implement `/api/reports/occupancy/by-site` endpoint call
- [ ] Replace mock data with API data
- [ ] Add loading/error states
- [ ] Add retry logic

### 11.2 Performance Optimization
- [ ] Implement data caching (React Query)
- [ ] Debounce filter changes
- [ ] Lazy load table rows (infinite scroll)
- [ ] Optimize chart re-renders (memoization)

---

## Development Order Priority

**Sprint 1 (Foundation):**
- Steps 1-4: Setup, types, mock data, utilities

**Sprint 2 (Visualizations):**
- Steps 5-6: Filters and charts

**Sprint 3 (Table & Integration):**
- Steps 7-8: Table and full integration

**Sprint 4 (Polish):**
- Steps 9-10: Testing and documentation
