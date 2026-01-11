# Frontend Testing & Recursive Design Validation

## Overview

This document defines the systematic approach for achieving pixel-perfect alignment between production implementation and Figma design specifications for the Occupancy by Site Report feature.

## Objective

Ensure the production UI matches `DesignTuggedUIOccupancyReport2.0` Figma design exactly across all target resolutions with a visual difference of less than 5%.

## Target Resolutions

### Desktop
- **Primary:** 1920x1080 (HD)
- **Standard:** 1440x900
- **Compact:** 1366x768

### Tablet
- **Landscape:** 1024x768
- **Portrait:** 768x1024

### Mobile
- **iPhone SE:** 375x667
- **iPhone Plus:** 414x896

## Iterative Validation Algorithm

### Phase 1: Setup & Baseline

1. **Prepare Figma References**
   - Export Figma design at each target resolution
   - Save to `/design-references/figma/`
   - Document design specifications (colors, spacing, typography)

2. **Setup Testing Environment**
   - Install Playwright for automated screenshots
   - Configure viewport presets
   - Create screenshot storage structure

3. **Create Baseline Snapshots**
   - Capture current production state at all resolutions
   - Save to `/screenshots/baseline/`

### Phase 2: Comparison Loop

```
FOR each resolution IN target_resolutions:
  1. Set browser viewport to resolution
  2. Navigate to production URL
  3. Capture full-page screenshot
  4. Side-by-side comparison with Figma reference
  5. Document discrepancies in DESIGN_CHECKLIST.md
  6. Calculate visual diff percentage
END FOR
```

### Phase 3: Issue Identification

**Severity Classification:**
- **Critical:** Layout breaks, components missing, major misalignment (>20px)
- **High:** Wrong colors, incorrect spacing (10-20px), typography issues
- **Medium:** Minor spacing (5-10px), border/shadow inconsistencies
- **Low:** Subtle differences (<5px), minor color variations

**Documentation:**
- Log all issues in `DESIGN_CHECKLIST.md`
- Include screenshots with markup showing discrepancies
- Note exact measurements from Figma vs Production

### Phase 4: Fix Implementation

**Priority Order:**
1. Fix Critical issues first
2. Address High priority issues
3. Resolve Medium priority issues
4. Polish Low priority issues

**Batch Processing:**
- Fix 3-5 related issues per batch
- Test fixes immediately
- Update checklist after each batch

### Phase 5: Validation & Iteration

```
WHILE (discrepancies_exist):
  1. Implement fixes for current batch
  2. Re-run screenshot capture
  3. Compare new vs Figma reference
  4. Update DESIGN_CHECKLIST.md with results

  IF improvements_verified:
    Mark issues as FIXED
    Update CHANGELOG.md
    Git commit changes
    Move to next batch
  ELSE:
    Document blockers
    Try alternative approach

  5. Calculate overall alignment percentage

  IF alignment >= 95%:
    BREAK (Success)
END WHILE
```

## Automated Testing Script

### Playwright Screenshot Automation

Location: `/tests/visual-regression/capture-screenshots.spec.ts`

```typescript
import { test } from '@playwright/test';

const resolutions = [
  { width: 1920, height: 1080, name: 'desktop-hd' },
  { width: 1440, height: 900, name: 'desktop-standard' },
  { width: 1366, height: 768, name: 'desktop-compact' },
  { width: 1024, height: 768, name: 'tablet-landscape' },
  { width: 768, height: 1024, name: 'tablet-portrait' },
  { width: 375, height: 667, name: 'mobile-se' },
  { width: 414, height: 896, name: 'mobile-plus' },
];

test.describe('Visual Regression - Occupancy Report', () => {
  for (const res of resolutions) {
    test(`Capture at ${res.name} (${res.width}x${res.height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width: res.width, height: res.height });

      // Navigate to report
      await page.goto('http://localhost:5173/occupancy-report');

      // Wait for charts to render
      await page.waitForSelector('.recharts-wrapper', { timeout: 5000 });

      // Capture screenshot
      await page.screenshot({
        path: `screenshots/production/iteration-${Date.now()}-${res.name}.png`,
        fullPage: true,
      });
    });
  }
});
```

### Running Tests

```bash
# Capture screenshots for all resolutions
npm run test:visual

# Capture for specific resolution
npm run test:visual -- --grep "desktop-hd"
```

## Component Checklist Template

Each component must be verified against these criteria:

### Layout & Structure
- [ ] Container dimensions (width × height)
- [ ] Padding (top, right, bottom, left)
- [ ] Margins (top, right, bottom, left)
- [ ] Flexbox/Grid properties
- [ ] Component positioning (absolute/relative coordinates)

### Typography
- [ ] Font family
- [ ] Font size (px/rem)
- [ ] Font weight
- [ ] Line height
- [ ] Letter spacing
- [ ] Text color (hex)
- [ ] Text alignment

### Colors & Styling
- [ ] Background colors (hex)
- [ ] Border colors (hex)
- [ ] Border width & style
- [ ] Border radius
- [ ] Box shadows
- [ ] Gradients (direction, stops, colors)
- [ ] Opacity values

### Charts
- [ ] Chart container dimensions
- [ ] Chart margins
- [ ] Axis positioning
- [ ] Label positioning & styling
- [ ] Legend placement & styling
- [ ] Color palette (exact hex values)
- [ ] Stroke widths
- [ ] Grid lines (color, width, dashArray)
- [ ] Tooltip styling

### Interactive States
- [ ] Default state
- [ ] Hover state
- [ ] Active/Selected state
- [ ] Disabled state
- [ ] Focus state

## Success Criteria

### Per Resolution
- Visual diff < 5% pixel difference
- All critical issues resolved
- All high priority issues resolved
- 90%+ of medium priority issues resolved

### Cross-Resolution
- No layout breaks at any target resolution
- Responsive behavior matches design intent
- Component scaling appropriate
- No horizontal scroll on mobile

### Final Validation
- [ ] All resolutions pass visual regression
- [ ] DESIGN_CHECKLIST.md shows 100% completion
- [ ] No critical or high priority issues remaining
- [ ] CHANGELOG.md updated with validation results
- [ ] Final screenshots committed to repository

## Measurement Tools

### Browser DevTools
- Use rulers and measurement tools
- Inspect computed styles
- Verify color values
- Check spacing with box model

### Figma Inspection
- Use Figma inspect mode for exact measurements
- Export CSS snippets for comparison
- Verify spacing tokens
- Check responsive breakpoints

### Visual Diff Tools
- Overlay Figma export on production screenshot
- Use opacity slider to identify misalignments
- Screenshot annotation tools for markup

## Iteration Documentation

After each iteration:

1. **Update DESIGN_CHECKLIST.md**
   - Mark fixed items as ✅ FIXED
   - Add new issues discovered
   - Update progress percentage

2. **Update CHANGELOG.md**
   - Document fixes applied
   - Note any design decisions
   - Record iteration number and date

3. **Git Commit**
   - Commit code changes
   - Commit updated checklists
   - Push to repository

4. **Screenshot Archive**
   - Save iteration screenshots
   - Name with iteration number and timestamp
   - Keep for comparison history

## Resolution-Specific Notes

### Desktop (1920x1080)
- Primary development target
- All components should be perfect at this resolution
- Use as baseline for responsive adjustments

### Tablet (1024x768)
- May require component stacking
- Chart heights may adjust
- Table may become horizontally scrollable

### Mobile (375x667)
- Vertical stacking required
- Charts scale to full width
- Table transforms to mobile view or horizontal scroll
- Font sizes may reduce slightly

## Common Issues & Solutions

### Chart Misalignment
- Check Recharts margin props
- Verify responsive container settings
- Adjust tick label rotation

### Spacing Inconsistencies
- Use CSS variables for consistent spacing
- Check for missing/extra padding
- Verify box-sizing: border-box

### Color Mismatches
- Extract exact hex values from Figma
- Check for opacity/transparency issues
- Verify theme color definitions

### Typography Differences
- Ensure correct font weights are loaded
- Check line-height calculations
- Verify rem to px conversions

## Next Steps

1. Run initial screenshot capture
2. Create first iteration of DESIGN_CHECKLIST.md
3. Begin fix implementation
4. Follow iterative validation loop
5. Achieve 95%+ design alignment
