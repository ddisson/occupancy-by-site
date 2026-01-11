# Figma Design Measurements (Extracted from Screenshot)

## Total Occupancy Chart (Donut)

### Visual Analysis from Figma Screenshot:

**Container:**
- Background: White card
- Border radius: ~8px
- Box shadow: Subtle, lighter than current
- Padding: Appears ~24px

**Title:**
- Text: "Total occupancy" (lowercase 'o')
- Font size: ~16-18px (smaller than current 18px)
- Font weight: 600 (semibold)
- Color: Dark gray/black

**Donut Chart:**
- Colors visible:
  - Dark green: Occupied
  - Gray: Available
  - Tan/orange: Blocked
- Center percentage: Large, bold
- Legend format: "Nights occupied 2202" (number after label)

**Center Label:**
- Percentage: "60.26%" (large)
- Sub-label: Not clearly visible

**Legend Items:**
- Format: "Nights occupied 2202"
- Format: "Blocked 256"
- Format: "Available 720"
- Square color indicators
- Font size: ~14px

**Summary Section:**
- Three rows showing detail
- Simpler than current implementation

### Key Differences from Production:

1. ❌ Title casing: "Total occupancy" vs "Total occupancy" ✅ (already correct)
2. ❌ Legend format: "Nights occupied 2202" vs "Nights occupied 393"
   - Production shows count AFTER label ✅
   - But format is "Label count" not "Label: count"
3. ✅ Chart colors match approximately
4. ❌ Summary section may have different styling

---

## Average Nightly Occupancy Chart

### Visual Analysis:

**Title:** "Average Nightly Occupancy"

**Right side control:**
- Dropdown: "Current, High season 1"
- This is DIFFERENT from production
- Location: Top right of chart area

**Chart:**
- Line chart with two lines
- Current period: One color
- High season 2: Second line (YoY equivalent)
- Grid lines: Visible
- Y-axis: 0% to 100% in 25% increments

### Key Differences:

1. ❌ **MAJOR:** Missing dropdown selector "Current, High season 1"
2. ✅ YoY comparison showing
3. ❌ Legend labels may differ

---

## Occupancy Trend Chart

### Visual Analysis:

**Title:** "Occupancy trend"

**Controls (top right):**
- Checkbox: "Previous period" ✅ (we have this)
- Dropdown: "Weeks" (granularity selector) ✅ (we have this)

**Chart:**
- Grouped bars (tan + green) ✅ (we have this)
- Week labels: "29-5 Oct", "6-12", etc.
- Two colors showing ✅

### Key Differences:

1. ✅ Controls visible and functional
2. ✅ Grouped bars showing
3. ❌ Week label format may differ

---

## Filter Bar

### Visual Analysis:

**CRITICAL DIFFERENCE:**
- **Figma:** Single date range field "02/27/25 - 03/26/25" with calendar icon
- **Production:** Two separate date inputs

**Buttons:**
- "Site" button (gray/neutral) ✅
- "Type" button (gray/neutral) ✅

**Dropdown:**
- "Select unit: All" ✅

**Icons:**
- Settings gear ✅
- Refresh icon ✅

### Key Difference:

1. ❌ **MAJOR:** Date picker is single field vs two fields
   - This is a UX change, not just styling
   - Would require component refactor

---

## Estimated Changes Needed for 95%+ Alignment

### High Priority (Do Now):
1. Fix legend format if needed
2. Verify chart title sizes match
3. Add dropdown to Average Nightly chart if missing

### Medium Priority:
1. Adjust padding/margins to exact Figma values
2. Match box shadow intensity
3. Week label format in trend chart

### Low Priority (Design Decision):
1. Date picker UX change (single vs dual)
   - This is structural, may be intentional difference
   - Defer to user/stakeholder decision

---

## Next Steps

Focus on **one component at a time** to 100%:
1. Total Occupancy - verify all measurements
2. Average Nightly - add missing dropdown
3. Occupancy Trend - verify label formats
4. Table - verify structure
5. Filter bar - document as "intentional difference" if dual datepicker is desired
