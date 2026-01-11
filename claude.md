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
- After fixing a bug or issue
- After updating documentation or configuration
- After any milestone that moves the project forward
- Anytime changes are stable and ready to be saved

This ensures continuous version control and backup of project progress.
