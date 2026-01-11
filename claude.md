# Claude Context - Occupancy by Site Report

## Project Overview

**Product:** Camp Sol Manager Portal
**Feature:** Occupancy by Site Report
**Purpose:** B2B SaaS tool for managing camping sites with occupancy analytics

## Current Challenge

Developer attempted to use AG-Grid for graphs, but AG-Grid is a **table/data grid library**, not a charting library. This caused issues:
- Y-axis scrolling with graph content
- Inability to match Figma design specifications
- Limited chart customization options

## Solution Architecture

### Technology Split
- **Recharts** → Handle all chart visualizations (donut, line, bar)
- **AG-Grid Community** → Handle data table only

### Why This Approach
1. **Recharts** is purpose-built for React charts with:
   - Fixed axis positioning
   - Responsive design
   - Easy customization
   - Good performance
   - MIT license (free)

2. **AG-Grid Community** excels at:
   - Data tables with sorting/filtering
   - Column management
   - CSV export
   - Pagination
   - Performant rendering of large datasets

## Key Requirements from PRD

### Three Charts Needed:
1. **Total Occupancy** - Donut chart showing ON/AN/Blocked splits
2. **Average Nightly Occupancy** - Line chart with weekday breakdown
3. **Occupancy Trend** - Bar chart with Monthly/Weekly/Daily modes, YoY comparison

### Table Requirements:
- Site-level data with 10+ sortable columns
- CSV export
- Pagination (10/25/50 rows)
- Show/hide columns
- Filter integration with charts

### Critical Business Rules:
- Exclude draft reservations
- Blocked nights excluded from capacity by default (toggleable)
- YoY comparisons use -364 days for weekday alignment
- Date format: mm/dd/yyyy
- Week definition: US (Sun-Sat)

## Design Reference
- Figma screenshot: `screenshot_figma_design.png`
- Shows complete layout with all three charts and data table
- Key visual: Fixed Y-axis, grouped bars for trend comparison

## Implementation Philosophy
- Match Figma design exactly
- Use proper tools for proper jobs
- Keep code simple and maintainable
- Mock data first, API integration later

## Design Validation Protocol

### Recursive Design Alignment
**CRITICAL:** All frontend changes must follow the recursive design validation process to ensure pixel-perfect alignment with Figma design `DesignTuggedUIOccupancyReport2.0`.

### Required Documents
1. **FRONTEND_TESTING.md** - Complete testing and validation algorithm
2. **DESIGN_CHECKLIST.md** - Live checklist tracking design alignment progress

### Validation Rules

**MUST follow for every frontend change:**

1. **Before Implementation:**
   - Review DESIGN_CHECKLIST.md for current iteration status
   - Extract exact measurements from Figma design
   - Document Figma specs in checklist before coding

2. **During Implementation:**
   - Fix issues in priority order: Critical → High → Medium → Low
   - Process fixes in small batches (3-5 related issues)
   - Test immediately after each batch

3. **After Implementation:**
   - Capture screenshots at ALL target resolutions (see FRONTEND_TESTING.md)
   - Compare production vs Figma side-by-side
   - Calculate visual diff percentage
   - Update DESIGN_CHECKLIST.md with results

4. **Iteration Completion:**
   - Mark fixed items as ✅ or ❌ in DESIGN_CHECKLIST.md
   - Log new issues discovered
   - Update iteration number and progress percentage
   - Add entry to Iteration History section
   - Update CHANGELOG.md with iteration results
   - Git commit all changes

### Target Resolutions
Must validate at:
- Desktop: 1920x1080, 1440x900, 1366x768
- Tablet: 1024x768, 768x1024
- Mobile: 375x667, 414x896

### Success Criteria
- Visual diff < 5% at each resolution
- 95%+ overall design alignment
- All Critical and High priority issues resolved
- No layout breaks across resolutions

### Update Requirements
**MANDATORY after each iteration:**
- Update DESIGN_CHECKLIST.md with:
  - New Figma measurements
  - Production values
  - Status changes (⏳ → 🔧 → ✅/❌)
  - Progress percentage
  - Iteration history entry
- Update CHANGELOG.md with iteration summary
- Commit screenshots to repository

## Documentation Protocol

### Changelog Updates
**IMPORTANT:** Update `CHANGELOG.md` after each noticeable change:
- Technology or library decisions
- Significant implementation milestones
- Requirement changes or clarifications
- Design updates from Figma
- Problem resolutions
- Performance improvements
- API integration changes

This ensures a clear audit trail of project evolution and decision-making rationale.

### Git Commit and Push Protocol
**REQUIRED:** After each noticeable update:
1. Update `CHANGELOG.md` with the change
2. Stage all changes with `git add .`
3. Create a descriptive commit with the format:
   ```
   git commit -m "Brief summary of changes"
   ```
4. Push to remote repository:
   ```
   git push
   ```

**When to commit:**
- After completing a feature or component
- After completing a phase from the [/Users/dmitrydisson/Documents/Projects/agrid_element/implementation-steps.md]
- After fixing a bug or issue
- After updating documentation or configuration
- After any milestone that moves the project forward
- Anytime changes are stable and ready to be saved

This ensures continuous version control and backup of project progress.
