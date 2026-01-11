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
- permissions.json (development workflow permissions)
- .gitignore (Node.js/React/Vite exclusions)

### Version Control Setup

**GitHub Repository Created:**
- Repository: `occupancy-by-site` (renamed from `agrid_element`)
- URL: https://github.com/ddisson/occupancy-by-site
- Visibility: Public
- Description: B2B SaaS tool for managing camping sites with occupancy analytics

**Initial Commit:**
- Committed all project documentation and planning files
- Established main branch
- Configured git ignore for Node.js/React/Vite project
- Pushed to GitHub remote

### Workflow Improvements

**Git Commit and Push Protocol Added:**
- Added automated git workflow to CLAUDE.md
- Rule: Commit and push after each noticeable update
- Ensures continuous version control and backup
- Standardized commit message format

**Project Renamed:**
- Local folder renamed from `agrid_element` to `occupancy-by-site`
- Now matches GitHub repository name
- All references updated

**Next Steps:**
- Phase 1: Initialize React + TypeScript + Vite project
- Install dependencies (Recharts, AG-Grid Community, date-fns, etc.)
- Set up project folder structure
- Create TypeScript type definitions
- Implement mock data generator
