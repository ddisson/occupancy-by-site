# Changelog - Occupancy by Site Report

## 2026-01-11

### Initial Planning & Decision Making

**Problem Identified:**
- Developer stuck with AG-Grid Community Edition
- Y-axis scrolling with graph in occupancy trend chart
- Difficulty implementing design-accurate visualizations
- Confusion about AG-Grid capabilities (it's a table library, not charting)

**Key Decisions:**
- **Charting Library:** Recharts (for donut, line, and bar charts)
- **Table Library:** AG-Grid Community Edition
- **Reason:** AG-Grid is a data grid library, not a charting library. Recharts provides simple, declarative React API for the three required visualizations

**Documentation Created:**
- CHANGELOG.md (this file)
- claude.md (context and approach summary)
- implementation-steps.md (detailed development plan)
- technical-stack.md (technology decisions)

**Next Steps:**
- Set up project structure
- Install dependencies
- Create mock data based on PRD specifications
- Implement components following Figma design
