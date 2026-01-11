# Design Alignment Checklist

## Iteration Tracker

**Current Iteration:** 0 (Baseline)
**Last Updated:** 2026-01-11
**Overall Progress:** 0% aligned with Figma
**Target:** 95%+ alignment across all components

---

## Precision Phase Tracker

**Current Phase:** Phase 1 - Broad Strokes (Iterations 1-3)
**Phase Goal:** Fix obvious and major discrepancies quickly
**Expected Visual Diff Reduction:** From baseline to ~20-30%

### Phase Progression

| Phase | Iteration Range | Status | Completion | Visual Diff Target |
|-------|----------------|--------|------------|-------------------|
| Phase 1: Broad Strokes | 1-3 | ⏳ Not Started | 0% | ~20-30% |
| Phase 2: Precision Refinement | 4-6 | 🔒 Locked | - | ~10-15% |
| Phase 3: Microscopic Alignment | 7-9 | 🔒 Locked | - | ~5% |
| Phase 4: Final Validation | 10+ | 🔒 Locked | - | <5% |

**Legend:**
- ⏳ Not Started
- 🔧 In Progress
- ✅ Completed
- 🔒 Locked (not yet accessible)

---

## Phase Technique Checklist

### Phase 1 Techniques (Iterations 1-3)
**Applied automatically - no checklist required**
- Visual comparison by eye
- Fix Critical and High priority issues
- Approximate measurements (±5px)
- Standard CSS properties
- Layout structure and positioning

**Phase 1 Acceptance Criteria:**
- [ ] All Critical issues resolved
- [ ] 70%+ of High priority issues resolved
- [ ] Major layout alignment achieved
- [ ] Visual diff reduced to ~20-30%

---

### Phase 2 Techniques (Iterations 4-6)
**MANDATORY - Must apply ALL before proceeding to Phase 3**

- [ ] **Exact Pixel Measurement:** 1px accuracy, documented in checklist
- [ ] **CSS Extraction:** CSS snippets from Figma Inspect copied
- [ ] **Color Precision:** Exact hex codes extracted and verified
- [ ] **Typography Exactness:** Font weights, line-heights, letter-spacing matched
- [ ] **Spacing System:** CSS variables created, spacing tokens implemented
- [ ] **Overlay Comparison:** Figma PNG overlaid on production screenshot

**Phase 2 Acceptance Criteria:**
- [ ] All High priority issues resolved
- [ ] 80%+ of Medium priority issues resolved
- [ ] Visual diff reduced to ~10-15%
- [ ] CSS variables file created
- [ ] Detailed measurements documented

**Phase 2 Deliverables:**
- [ ] `src/styles/design-tokens.css` created with spacing/color variables
- [ ] Annotated overlay comparison images saved
- [ ] Exact measurements table populated in this checklist

---

### Phase 3 Techniques (Iterations 7-9)
**MANDATORY - Must apply ALL before proceeding to Phase 4**

- [ ] **Grid Overlay Tool:** PerfectPixel or PixelParallel extension used
- [ ] **Computed Style Comparison:** Line-by-line CSS comparison documented
- [ ] **Sub-Pixel Adjustments:** Decimal values applied where needed
- [ ] **Chart Fine-Tuning:** Exact margins, axis alignment, stroke widths
- [ ] **State Validation:** All interactive states (hover, focus, active, disabled) verified
- [ ] **Cross-Browser Verification:** Chrome, Firefox, Safari tested

**Phase 3 Acceptance Criteria:**
- [ ] All Medium priority issues resolved
- [ ] 90%+ of Low priority issues resolved
- [ ] Visual diff reduced to ~5% or less
- [ ] Pixel-perfect on 1920x1080 resolution

**Phase 3 Deliverables:**
- [ ] Overlay screenshots showing perfect alignment saved
- [ ] Browser-specific CSS adjustments documented
- [ ] Final design token system implemented

---

### Phase 4 Techniques (Iterations 10+)
**MANDATORY - Final validation checklist**

- [ ] **Multi-Resolution Verification:** All 7 resolutions tested systematically
- [ ] **Edge Case Testing:** Long names, empty states, loading, errors, max data
- [ ] **Accessibility Audit:** WCAG contrast, focus indicators, keyboard nav
- [ ] **Performance Optimization:** Unused CSS removed, chart optimization
- [ ] **Final Screenshot Comparison:** All resolutions captured and compared

**Phase 4 Acceptance Criteria:**
- [ ] 95%+ overall alignment achieved
- [ ] All resolutions validated
- [ ] No Critical, High, or Medium priority issues
- [ ] Visual diff < 5% at all resolutions
- [ ] 100% checklist completion

**Phase 4 Deliverables:**
- [ ] Final screenshots at all 7 resolutions
- [ ] Side-by-side comparison document
- [ ] Remaining known differences documented (if any)

---

## Resolution Testing Status

| Resolution | Status | Visual Diff | Issues Count | Screenshot |
|------------|--------|-------------|--------------|------------|
| 1920x1080 (Desktop HD) | ⏳ Not Started | N/A | - | - |
| 1440x900 (Desktop Std) | ⏳ Not Started | N/A | - | - |
| 1366x768 (Desktop Compact) | ⏳ Not Started | N/A | - | - |
| 1024x768 (Tablet Landscape) | ⏳ Not Started | N/A | - | - |
| 768x1024 (Tablet Portrait) | ⏳ Not Started | N/A | - | - |
| 375x667 (Mobile SE) | ⏳ Not Started | N/A | - | - |
| 414x896 (Mobile Plus) | ⏳ Not Started | N/A | - | - |

**Legend:**
- ⏳ Not Started
- 🔍 In Review
- 🔧 Fixing Issues
- ✅ Validated
- ❌ Failed

---

## Component Alignment Status

### 1. Page Layout & Container

| Element | Figma Spec | Production | Status | Priority | Notes |
|---------|-----------|------------|--------|----------|-------|
| Page width | - | - | ⏳ | Critical | |
| Page padding | - | - | ⏳ | Critical | |
| Background color | - | - | ⏳ | High | |
| Main container width | - | - | ⏳ | Critical | |
| Component spacing | - | - | ⏳ | High | |

### 2. Header Section

| Element | Figma Spec | Production | Status | Priority | Notes |
|---------|-----------|------------|--------|----------|-------|
| Title font size | - | - | ⏳ | High | |
| Title font weight | - | - | ⏳ | High | |
| Title color | - | - | ⏳ | High | |
| Date range picker position | - | - | ⏳ | Critical | |
| Date range picker styling | - | - | ⏳ | Medium | |
| Filter controls alignment | - | - | ⏳ | High | |

### 3. Total Occupancy Chart (Donut)

| Element | Figma Spec | Production | Status | Priority | Notes |
|---------|-----------|------------|--------|----------|-------|
| Container width | - | - | ⏳ | Critical | |
| Container height | - | - | ⏳ | Critical | |
| Chart diameter | - | - | ⏳ | Critical | |
| Inner radius | - | - | ⏳ | Medium | |
| Outer radius | - | - | ⏳ | Medium | |
| Segment colors (ON) | - | - | ⏳ | High | |
| Segment colors (AN) | - | - | ⏳ | High | |
| Segment colors (Blocked) | - | - | ⏳ | High | |
| Center label font size | - | - | ⏳ | Medium | |
| Center label font weight | - | - | ⏳ | Medium | |
| Center label color | - | - | ⏳ | Medium | |
| Legend position | - | - | ⏳ | High | |
| Legend font size | - | - | ⏳ | Low | |
| Legend spacing | - | - | ⏳ | Low | |

### 4. Average Nightly Occupancy Chart (Line)

| Element | Figma Spec | Production | Status | Priority | Notes |
|---------|-----------|------------|--------|----------|-------|
| Container width | - | - | ⏳ | Critical | |
| Container height | - | - | ⏳ | Critical | |
| Chart margins | - | - | ⏳ | High | |
| Line color | - | - | ⏳ | High | |
| Line stroke width | - | - | ⏳ | Medium | |
| Dot size | - | - | ⏳ | Low | |
| Dot fill color | - | - | ⏳ | Low | |
| X-axis label font size | - | - | ⏳ | Medium | |
| X-axis label color | - | - | ⏳ | Medium | |
| Y-axis label font size | - | - | ⏳ | Medium | |
| Y-axis label color | - | - | ⏳ | Medium | |
| Y-axis position (fixed) | - | - | ⏳ | Critical | |
| Grid lines color | - | - | ⏳ | Low | |
| Grid lines dashArray | - | - | ⏳ | Low | |
| Tooltip styling | - | - | ⏳ | Medium | |

### 5. Occupancy Trend Chart (Bar)

| Element | Figma Spec | Production | Status | Priority | Notes |
|---------|-----------|------------|--------|----------|-------|
| Container width | - | - | ⏳ | Critical | |
| Container height | - | - | ⏳ | Critical | |
| Chart margins | - | - | ⏳ | High | |
| Bar width | - | - | ⏳ | Medium | |
| Bar gap | - | - | ⏳ | Medium | |
| Current year color | - | - | ⏳ | High | |
| Previous year color | - | - | ⏳ | High | |
| Bar border radius | - | - | ⏳ | Low | |
| X-axis label font size | - | - | ⏳ | Medium | |
| X-axis label color | - | - | ⏳ | Medium | |
| X-axis label rotation | - | - | ⏳ | Medium | |
| Y-axis label font size | - | - | ⏳ | Medium | |
| Y-axis label color | - | - | ⏳ | Medium | |
| Y-axis position (fixed) | - | - | ⏳ | Critical | |
| Grid lines color | - | - | ⏳ | Low | |
| Grid lines dashArray | - | - | ⏳ | Low | |
| Legend position | - | - | ⏳ | High | |
| Legend styling | - | - | ⏳ | Medium | |
| Mode toggle buttons | - | - | ⏳ | High | |

### 6. Data Table (AG-Grid)

| Element | Figma Spec | Production | Status | Priority | Notes |
|---------|-----------|------------|--------|----------|-------|
| Table width | - | - | ⏳ | Critical | |
| Header height | - | - | ⏳ | Medium | |
| Header background | - | - | ⏳ | High | |
| Header font size | - | - | ⏳ | Medium | |
| Header font weight | - | - | ⏳ | Medium | |
| Header text color | - | - | ⏳ | High | |
| Row height | - | - | ⏳ | Medium | |
| Row background (even) | - | - | ⏳ | Low | |
| Row background (odd) | - | - | ⏳ | Low | |
| Row hover color | - | - | ⏳ | Medium | |
| Cell padding | - | - | ⏳ | Medium | |
| Cell font size | - | - | ⏳ | Medium | |
| Cell text color | - | - | ⏳ | High | |
| Border color | - | - | ⏳ | Low | |
| Border width | - | - | ⏳ | Low | |
| Column widths | - | - | ⏳ | High | |
| Pagination styling | - | - | ⏳ | Medium | |

### 7. Controls & Filters

| Element | Figma Spec | Production | Status | Priority | Notes |
|---------|-----------|------------|--------|----------|-------|
| Export button width | - | - | ⏳ | Medium | |
| Export button height | - | - | ⏳ | Medium | |
| Export button color | - | - | ⏳ | High | |
| Export button font | - | - | ⏳ | Low | |
| Toggle switch styling | - | - | ⏳ | Medium | |
| Toggle switch colors | - | - | ⏳ | Medium | |
| Dropdown menu styling | - | - | ⏳ | Medium | |
| Dropdown menu position | - | - | ⏳ | High | |

---

## Issue Log

### Critical Issues (Layout/Functionality)
_No issues logged yet - run initial screenshot capture_

### High Priority Issues (Visual Accuracy)
_No issues logged yet - run initial screenshot capture_

### Medium Priority Issues (Minor Spacing/Styling)
_No issues logged yet - run initial screenshot capture_

### Low Priority Issues (Polish)
_No issues logged yet - run initial screenshot capture_

---

## Iteration History

### Iteration 0 - Baseline (2026-01-11)
- **Status:** Initial setup
- **Changes:** Created checklist template
- **Next Steps:** Run initial screenshot capture at all target resolutions

---

## Figma Reference Measurements

### Colors
_To be extracted from Figma design_

```
Primary Brand: #??????
Secondary: #??????
Background: #??????
Text Primary: #??????
Text Secondary: #??????
Border: #??????

Chart Colors:
- ON (Occupied): #??????
- AN (Available): #??????
- Blocked: #??????
- Current Year: #??????
- Previous Year: #??????
```

### Typography
_To be extracted from Figma design_

```
Font Family: ?
Heading 1: ?? px / weight ???
Heading 2: ?? px / weight ???
Body: ?? px / weight ???
Small: ?? px / weight ???
```

### Spacing Scale
_To be extracted from Figma design_

```
xs: ?? px
sm: ?? px
md: ?? px
lg: ?? px
xl: ?? px
2xl: ?? px
```

---

## Update Protocol

**REQUIRED:** Update this checklist after EVERY iteration:

1. **Before Fixes:**
   - Mark current batch items as 🔧 Fixing Issues
   - Document Figma specs from inspection

2. **After Fixes:**
   - Mark completed items as ✅ Validated or ❌ Failed
   - Update production values
   - Add notes about implementation approach
   - Update overall progress percentage

3. **After Screenshots:**
   - Update visual diff percentages
   - Link to screenshot files
   - Log new issues discovered

4. **After Iteration:**
   - Add entry to Iteration History
   - Increment iteration number
   - Update "Last Updated" date

---

## Alignment Calculation

**Formula:**
```
Total Checklist Items: X
Items Validated (✅): Y
Alignment % = (Y / X) × 100
```

**Current Status:**
- Total Items: TBD (after Figma measurement)
- Validated: 0
- **Progress: 0%**

**Target: 95%+ for production release**
