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

## Precision Escalation Strategy

### Overview
After every **3 iterations**, apply increasingly aggressive precision techniques to accelerate convergence toward pixel-perfect alignment. This phased approach ensures rapid progress in early iterations while achieving microscopic accuracy in later phases.

### Phase 1: Broad Strokes (Iterations 1-3)

**Focus:** Fix obvious and major discrepancies quickly

**Techniques:**
- Visual comparison by eye
- Fix Critical and High priority issues
- Use approximate measurements (rounded to 5px)
- Apply standard CSS properties
- Focus on layout structure and component positioning
- Use browser DevTools for quick inspection

**Acceptance Criteria:**
- All Critical issues resolved
- 70%+ of High priority issues resolved
- Major layout alignment achieved
- Visual diff reduced to ~20-30%

**Typical Fixes:**
- Component dimensions and positioning
- Color palette corrections
- Font family and major size differences
- Missing elements or features
- Layout flow and structure

---

### Phase 2: Precision Refinement (Iterations 4-6)

**Focus:** Exact measurements and detailed alignment

**MANDATORY Techniques (apply ALL of these):**

1. **Exact Pixel Measurement**
   - Use Figma Inspect mode for precise values
   - Measure to 1px accuracy (not 5px approximations)
   - Document exact dimensions in DESIGN_CHECKLIST.md
   - Use browser rulers for production measurements

2. **CSS Extraction**
   - Copy CSS snippets directly from Figma Inspect
   - Export Figma design tokens
   - Compare computed styles in DevTools
   - Match exact values: `margin: 16px` not `margin: ~15px`

3. **Color Precision**
   - Extract exact hex codes from Figma (e.g., `#3B82F6`)
   - Use eyedropper tool for production verification
   - Check alpha channel/opacity values (e.g., `rgba(59, 130, 246, 0.8)`)
   - Verify color values in all states (hover, active, disabled)

4. **Typography Exactness**
   - Match exact font weights (400 vs 500 makes a difference)
   - Verify line-height to 0.1 precision (e.g., `1.5` vs `1.6`)
   - Check letter-spacing in px or em
   - Ensure text-rendering properties match

5. **Spacing System**
   - Create CSS variables for spacing scale
   - Audit all padding/margin values
   - Ensure consistent spacing tokens (8px grid system)
   - Remove arbitrary spacing values

6. **Overlay Comparison**
   - Export Figma frame as PNG at exact production resolution
   - Overlay Figma PNG on production screenshot in image editor
   - Use 50% opacity to identify pixel-level misalignments
   - Mark discrepancies with annotations

**Acceptance Criteria:**
- All High priority issues resolved
- 80%+ of Medium priority issues resolved
- Visual diff reduced to ~10-15%
- Exact measurements documented in checklist

**Expected Output:**
- CSS variables file with design tokens
- Detailed measurement documentation
- Annotated overlay comparison images

---

### Phase 3: Microscopic Alignment (Iterations 7-9)

**Focus:** Sub-pixel perfection and final polish

**MANDATORY Techniques (apply ALL of these):**

1. **Pixel-Perfect Grid Overlay**
   - Use browser extensions (PerfectPixel, PixelParallel)
   - Load Figma export as overlay
   - Toggle overlay at 100% opacity to spot differences
   - Adjust production CSS until overlay aligns perfectly

2. **Computed Style Comparison**
   - Document every computed style property
   - Compare production vs Figma CSS line-by-line
   - Check inherited values and defaults
   - Verify cascade and specificity matches intent

3. **Sub-Pixel Adjustments**
   - Use decimal values for precision (`padding: 16.5px`)
   - Apply transforms for sub-pixel positioning
   - Use flexbox/grid gaps for exact spacing
   - Consider browser rendering differences

4. **Chart Fine-Tuning**
   - Match exact chart margins (all 4 sides)
   - Align axis labels to pixel grid
   - Adjust tick spacing and rotation angles
   - Verify stroke widths (e.g., `2px` vs `1.5px`)
   - Match corner radius on bars/dots

5. **State Validation**
   - Verify all interactive states (hover, focus, active, disabled)
   - Check transition timing and easing functions
   - Validate focus outlines and accessibility indicators
   - Test print styles if applicable

6. **Cross-Browser Verification**
   - Test in Chrome, Firefox, Safari
   - Check for font rendering differences
   - Verify sub-pixel rendering behavior
   - Document browser-specific adjustments

**Acceptance Criteria:**
- All Medium priority issues resolved
- 90%+ of Low priority issues resolved
- Visual diff reduced to ~5% or less
- Pixel-perfect alignment on primary resolution (1920x1080)

**Expected Output:**
- Overlay screenshots showing perfect alignment
- Browser-specific CSS adjustments documented
- Final design token system implemented

---

### Phase 4: Final Validation (Iterations 10+)

**Focus:** Polish, edge cases, and cross-resolution consistency

**MANDATORY Techniques:**

1. **Multi-Resolution Verification**
   - Test all 7 target resolutions systematically
   - Ensure responsive breakpoints match Figma
   - Verify scaling behavior is consistent
   - Check for layout breaks at in-between sizes

2. **Edge Case Testing**
   - Very long site names (text overflow)
   - Empty states (no data)
   - Loading states
   - Error states
   - Maximum data scenarios (100+ rows)

3. **Accessibility Audit**
   - Color contrast ratios match WCAG standards
   - Focus indicators visible and styled correctly
   - Keyboard navigation works as designed
   - Screen reader landmarks match structure

4. **Performance Optimization**
   - Remove unused CSS
   - Optimize chart re-rendering
   - Minimize layout shifts
   - Verify smooth animations

5. **Final Screenshot Comparison**
   - Capture final screenshots at all resolutions
   - Create side-by-side comparison document
   - Calculate final visual diff percentage
   - Document remaining known differences (if any)

**Acceptance Criteria:**
- 95%+ overall alignment achieved
- All resolutions validated
- No Critical, High, or Medium priority issues
- Visual diff < 5% at all resolutions
- DESIGN_CHECKLIST.md shows 100% completion

---

### Escalation Triggers

**IMPORTANT:** If progress stalls at any phase:

**After 3 iterations with <10% improvement:**
1. **Re-baseline:** Capture new Figma exports at production resolutions
2. **Audit Approach:** Review current technique effectiveness
3. **Seek Clarification:** Confirm Figma design is latest version
4. **Tool Upgrade:** Consider additional measurement tools
5. **Component Rebuild:** May need to rebuild component from scratch

**After 6 iterations without reaching 80% alignment:**
1. **Design Review:** Schedule review with designer
2. **Feasibility Check:** Confirm all Figma elements are technically achievable
3. **Scope Adjustment:** Identify acceptable trade-offs
4. **Alternative Approaches:** Consider different CSS techniques or libraries

**After 9 iterations without reaching 95% alignment:**
1. **Acceptance Criteria Review:** Revisit whether 95% is achievable/necessary
2. **Document Blockers:** List technical limitations preventing perfect alignment
3. **Stakeholder Decision:** Get approval on acceptable variance

---

### Phase Checklist

Use this checklist to track which phase techniques have been applied:

**Phase 2 (Iterations 4-6):**
- [ ] Exact pixel measurements documented
- [ ] CSS extracted from Figma Inspect
- [ ] Exact hex colors verified
- [ ] Typography precision checked
- [ ] Spacing system implemented
- [ ] Overlay comparison completed

**Phase 3 (Iterations 7-9):**
- [ ] Grid overlay tool used
- [ ] Computed styles compared
- [ ] Sub-pixel adjustments applied
- [ ] Chart fine-tuning completed
- [ ] All interactive states validated
- [ ] Cross-browser testing done

**Phase 4 (Iterations 10+):**
- [ ] All resolutions verified
- [ ] Edge cases tested
- [ ] Accessibility audit completed
- [ ] Performance optimization done
- [ ] Final screenshots captured

---

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
