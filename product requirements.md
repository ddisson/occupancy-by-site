# PRD — Occupancy by Site (CampSol Manager Portal)

**Doc status:** Draft for build (V1)
**Owners:** PM (you), Design, FE, BE, Data
**Related:** “Occupancy by *Site Type*” report ⇒ same UX/logic, different grouping
**Breadcrumb:** Reports / Occupancy
**Date format:** `mm/dd/yyyy`

---

## 1) Problem & Opportunity

Operators can see aggregate occupancy by **type**, but not by **individual site**. This hides under-/over-used sites, complicates maintenance planning, and weakens pricing decisions. Legacy/competitors surface this view; we must match and exceed it.

**Outcome:** A per-site occupancy report that is fast, accurate, and exportable, with graphs + table (and optional heatmap later). It reuses the same model for a Site Type report.

---

## 2) Goals / Non-Goals

### Goals

* Show **site-level** occupancy for any date range (past/future).
* Provide **3 visualizations**: Total occupancy, Average nightly occupancy, Occupancy trend (Monthly / Weekly / Daily).
* Provide a **detailed table** with key KPIs per site (incl. ADR, RevPAR).
* One set of **filters & settings** that affect all charts + table.
* **CSV export** of the table (and graph data via CSV toggle).
* **Performance:** p95 server response < 2.0s for a 12-month range on 500 sites.

### Non-Goals (V1)

* Editing data here (use Calendar/Manager screens).
* Cross-property rollups (future).
* Heatmap for **site** level (MVP skip; keep for Site Type view first).

---

## 3) JTBD / Personas

**JTBD:**
*As a campground operator, I want to see occupancy per **site** so that I can identify over/under-utilized sites, plan maintenance with minimal impact, and adjust pricing and marketing confidently.*

**Personas:**

* Owner/GM (monthly/seasonal view; YoY)
* Front desk manager (short windows; Daily/Weekly)
* Revenue manager (ADR/RevPAR; weekday patterns)

---

## 4) Scope (Functional Requirements)

### 4.1 Filters (top bar, apply to all parts)

* **Date picker:** single date or range (past & future).
* **Unit selector:** (if multi-unit property; else hidden).
* **Site filter:** All (default) or multi-select specific sites.
* **Site type filter:** All (default) or multi-select types.
* **Settings (gear):**

  * Include **Blocked** days in Capacity (off by default).
  * Toggle **Show previous year** (YoY).
  * Toggle **Normalize February** (off; see Leap rules).
  * Trend **granularity auto** (on): auto-pick Monthly/Weekly/Daily based on range; user can override.
  * Trend **tails** (context bars outside selection): range 0–6 buckets (default 2).
  * **Export options**: Table only (default) / Include chart series.

> **All filters/settings sync the three graphs and the table.**

### 4.2 Business Rules (data)

* **Ignore draft reservations** entirely (removed from UI; not counted in any metric).
* **Blocks (OOO/holds):** match dashboard semantics retroactively & forward:

  * If **excluded** (default): blocked nights **reduce capacity** (AN) → not counted in denominator.
  * If **included**: blocked nights **increase capacity** (AN) → counted in denominator; also show “Blocked nights” KPI.
* **Cancellations/no-shows:** site becomes free; final ON excludes them for the affected nights.
* **Time zone:** property’s local TZ (from property settings).
* **Date format:** `mm/dd/yyyy`.
* **Week definition (US):** Sunday → Saturday; **W1** is the first **full** Sun–Sat week of the year.

  * **YoY weekly** alignment uses `-364 days` so weekdays match (Sun↔Sun) even in leap years.
* **Leap day (Feb 29):**

  * Bucket rates always use the **full bucket** definition (month/week context).
  * YoY overlays for **selection slices** use **equal-length** windows; see §4.4.
* **Status mapping:** booked/checked-in/checked-out/paid/confirmed ⇒ occupied; canceled/no-show/void ⇒ not occupied; **draft** ⇒ ignored.

### 4.3 Metrics & Definitions

* **ON (Occupied Nights):** count of site-nights occupied in the window.
* **AN (Available Nights / Capacity):** sum of nights a site is **bookable** in the window (blocks excluded by default; toggle can include).
* **Occupancy %:** `ON / AN`.
* **L (Lodging Revenue):** sum of **pre-tax** lodging line items in the window, net of discounts/appeasements; exclude taxes, reservation fees, upsells, penalties by default. Allocate discounts pro-rata over nights.
* **ADR:** `L / ON`.
* **RevPAR:** `L / AN = ADR × (ON/AN)`.
* **Weekend %:** occupancy over **Fri→Sun** night pairs (Fri–Sat & Sat–Sun) within the window.
* **Avg Length of Stay (ALOS) per site:** average nights of reservations **that touch** the window.

> Examples for ADR/RevPAR (allocation and cross-boundary) are in the spec text you provided; implement exactly.

### 4.4 Graphs (3)

#### A) Total Occupancy (donut)

* **Slices:**

  * Nights **Occupied** (ON)
  * Nights **Available** (AN − ON)
  * **Blocked** (optional slice if “Include Blocked” setting enabled)
* **Caption:** `% occupancy` and counts.
* **Tooltip:** show numbers; state if blocked are included/excluded in capacity.

#### B) Average Nightly Occupancy (line)

* X axis: Sun … Sat (always 7 points).
* **Current period** = average occupancy for each weekday across the selected range.
* **If range < 7 days:** we still render 7 weekday points; days not in range show as 0 or are dotted; tooltip clarifies.
* **Optional comparators (settings):**

  * **Same dates last year** (calendar aligned to the range).
  * **YTD** (Jan 1 → latest within same year).
  * **“High season” bookmarks** (preset ranges; optional later).
* **Tooltip:** `% + ON/AN per weekday; comparators if enabled`.

#### C) Occupancy Trend (bars)

* **Modes:** **Monthly / Weekly / Daily**

  * **Auto** chooses:

    * `> 90 days` ⇒ Monthly,
    * `32–90 days` ⇒ Weekly,
    * `≤ 31 days` ⇒ Daily.
* **Always show year (Monthly):**

  * 12 months of **year of selection start**.
  * Highlight months that intersect the selection (full saturation); non-selected months at 40% opacity.
  * **Bar value** = **full-month** occupancy (context).
  * Tooltip also shows **Selection Occupancy** for partial months (exact overlap), and YoY if enabled.
  * **Show previous year** overlay (lighter tint/outline).
  * Optional **Normalize February** toggle (rarely needed).
* **Weekly:**

  * Show **W1–W52** for the year; **W53** hidden (or merged to W52 with note).
  * Bar = **full ISO week** occupancy; highlight weeks in selection; tooltip shows **Selection Occupancy** for edge partial weeks + YoY window (`-364 days`) in tooltip.
* **Daily (only when window ≤ 31 nights):**

  * **1 bar = 1 day** in selection.
  * Optional **stack** OTB vs expected pickup (if forecast is turned on; else single value).
  * Weekend shading; target line (e.g., 85%).
  * Optional YoY: equal-length, weekday-aligned (`-364 days`).
* **User affordances:** zoom to selection, tails (±N buckets), hover sync with table.

> **Design intent:** Trend shows “big picture” context while clearly marking the selected window.

### 4.5 Table (per site rows)

Columns (sortable, all affected by filters/settings):

* **Site name**
* **Site type**
* **% Occupied**
* **# Occupied nights (ON)**
* **# Available nights (AN)**
* **Avg Length of Stay** (for stays touching window)
* **% Occupied weekend nights** (Fri→Sun logic)
* **# Blocked nights**
* **ADR**
* **RevPAR**
* (Option later) **Revenue total (L)**, **N of reservations**

Table UX:

* Sticky headers, infinite pagination (10/25/50).
* Column show/hide.
* CSV export (current filters applied).
* Clicking a site opens **Site details** drawer (mini time grid + reservation list touching window).

### 4.6 Exports

* **CSV** from table (mandatory).
* Optional: **Download chart data** (each series as columns; dates as rows; honors filters).

---

## 5) Data & Calculation Model

### 5.1 Fact table: **site_night**

Create/ensure a denormalized nightly table (or on-the-fly expansion with cache):

| Column              | Type     | Notes                                                                                                    |
| ------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| date                | date     | local property date                                                                                      |
| site_id             | uuid/int |                                                                                                          |
| site_type_id        | id       |                                                                                                          |
| is_blocked          | bool     | matches dashboard, retroactive                                                                           |
| is_occupied         | bool     | excludes drafts/canceled/no-show                                                                         |
| on                  | int      | 1/0 derived from is_occupied                                                                             |
| an                  | int      | 1 if bookable (blocked excluded by default); if “Include Blocked” setting ON, an = 1 regardless of block |
| weekday             | 0–6      | Sun=0 for US charts; or compute both                                                                     |
| week_iso            | int      | for ISO alignment; also compute US week index (Sun–Sat full-week model)                                  |
| month               | 1–12     |                                                                                                          |
| year                | int      |                                                                                                          |
| revenue_lodging_net | numeric  | pre-tax, nights in window, discounts pro-rated                                                           |
| weekend_flag        | bool     | Fri–Sun night pairs                                                                                      |

**Rules:**

* Draft reservations never set `is_occupied`.
* Cancellation/no-show clears `is_occupied`.
* Block re-writes must reflect edits historically (same as dashboard).

### 5.2 Aggregations

* **Occupancy** bucketed by month/week/day: `sum(on) / NULLIF(sum(an),0)`.
* **ADR:** `sum(revenue_lodging_net) / NULLIF(sum(on),0)`.
* **RevPAR:** `sum(revenue_lodging_net) / NULLIF(sum(an),0)`.

### 5.3 Week model (US Sun–Sat, full week “W1”)

* Derive yearly US weeks as contiguous Sun–Sat blocks.
* **YoY weekly comparison:** bucket window shifted by **−364 days** for equal weekday composition.
* Year edges: days before the first full week belong to the last week of the prior year in weekly charts.

### 5.4 Leap year handling

* Monthly/Weekly bars use **full** bucket spans.
* For overlays tied to **selection windows** (partial months/weeks or Daily), compare **equal-length** previous-year windows (use `-364 days` for weekday alignment).

---

## 6) API (suggested)

```
GET /api/reports/occupancy/by-site
  ?start=YYYY-MM-DD
  &end=YYYY-MM-DD
  &site_ids=... (optional CSV)
  &site_type_ids=... (optional CSV)
  &include_blocked=false|true
  &yoy=true|false
  &granularity=auto|month|week|day
  &tails=2
```

**Response**

```json
{
  "meta": { "as_of": "2026-01-11T02:33:12Z", "tz": "America/Vancouver" },
  "donut": { "on": 2202, "an": 3646, "blocked": 256, "occ_pct": 0.6026 },
  "avg_weekday": {
    "current": [{"dow":0,"occ":0.31}, ...],
    "yoy": [{"dow":0,"occ":0.29}, ...],          // optional
    "ytd": [{"dow":0,"occ":0.35}, ...]           // optional
  },
  "trend": {
    "mode": "month|week|day",
    "buckets": [
      {
        "label": "Jun 2025",
        "date_span": ["06/01/2025","06/30/2025"],
        "selected_span": ["06/10/2025","06/30/2025"],   // if overlapping
        "occ_context": 0.57,
        "occ_selected": 0.62,                           // if overlapping
        "yoy": { "occ_context": 0.53, "occ_selected": 0.56 }
      }
    ]
  },
  "table": [
    {
      "site_id": 123, "site_name":"Site A", "site_type":"RV - 30A",
      "occ_pct":0.70, "on":21, "an":30, "alos":2.8,
      "weekend_occ_pct":0.64, "blocked_nights":3,
      "adr":81.0, "revpar":54.0
    }
  ]
}
```

---

## 7) UX Details (from design + updates)

* **Header:** “Occupancy: {start} – {end} ({N} nights)”
* **Controls:** date picker; unit; Site/Type filter pills; **Site | Type** toggle; Settings gear; Refresh.
* **Cards:** Total Occupancy (donut), Average Nightly Occupancy (line), Occupancy Trend (bars + toggles).
* **Trend monthly “always show year”:** highlight selection months; YoY overlay optional; partial badge in tooltip.
* **Daily mode** appears only if window ≤ 31 nights; weekends shaded; optional stacked OTB + pickup later.
* **Table** under graphs, columns per §4.5; CSV export button (top-right of table).
* **Empty states:** “No data for selected filters”; suggest removing filters or expanding dates.
* **Loading states:** skeleton bars/rows.

Accessibility:

* Color with sufficient contrast; tooltips keyboard-reachable; aria labels on charts; tab order logical.

---

## 8) Acceptance Criteria (V1)

1. **Draft reservations are excluded** from all calculations and visuals.
2. **Blocked nights** default to **excluded from capacity**; turning **Include Blocked** on updates all KPIs/graphs to include them in AN and shows “Blocked” in donut.
3. **Donut** shows ON, Available (AN−ON), and optionally Blocked. Percentage equals `ON/AN`.
4. **Average Nightly Occupancy** renders seven weekdays; if range < 7 days, out-of-range weekdays are visually muted; YoY/YTD lines appear if toggled.
5. **Trend: Monthly** always shows 12 months for year of selection start; selected months are visibly highlighted; YoY overlay optional; tooltips show full-month (context) and selection-overlap metrics.
6. **Trend: Weekly** uses US Sun–Sat with W1 = first full week; YoY uses `-364 days`; partial weeks at edges are labeled in tooltip as partial.
7. **Trend: Daily** appears when window ≤ 31 nights; 1 bar/day; weekend shading; correct numbers.
8. **Table** columns match spec; numbers match donut/graphs with same filters; sorting works; CSV export mirrors table content.
9. **Performance:** p95 < 2s for 12 months, 500 sites; p95 < 1s for ≤ 31 days.
10. **Date format** mm/dd/yyyy throughout.
11. **Leap year** handling: bars are full buckets; overlays for selection are equal-length; no misalignment or off-by-one.
12. **Cancellations/no-shows** remove nights from ON.
13. **Blocks** reflect dashboard edits retroactively and forward.
14. **YoY toggles** affect all three graphs consistently.

---

## 9) Data QA & Testing

* Unit tests for:

  * Discount pro-rata allocation to nights.
  * Cross-boundary reservation slicing (only nights inside window).
  * Blocked capacity toggle effect on AN and RevPAR.
  * Weekly indexer (Sun–Sat; W1 full week; edges).
  * YoY weekly alignment (−364 days).
  * Leap day scenarios (Feb 2024 vs 2025).
* Golden datasets with known outputs (3 small fixtures):

  1. Simple: 2 sites, 10 nights, no blocks.
  2. With blocks & cancellations.
  3. Leap day and partial months/weeks.

---

## 10) Analytics & Success Metrics

* Report loads per account / weekly active report users.
* Time-to-first-byte (API) & render time.
* Export usage.
* % of sessions using **Weekly/Daily**.
* # of properties enabling **Include Blocked**.
* (Downstream) Increase in **pricing actions** or **maintenance scheduling** correlated to under-utilized sites surfaced.

Target adoption: ≥70% of migrated campgrounds use the report monthly.

---

## 11) Risks & Mitigations

* **Data drift (blocks retro changes):** write-through to site-night facts nightly; show “as of” time.
* **Latency with on-the-fly expansion:** cache site_night; pre-aggregate month/week partitions.
* **Confusion about filter vs context:** keep legend + highlight the selection months/weeks; “Bar = full bucket (context); highlight = your selection.”
* **Revenue line allocation** corner cases: unit tests + reconciliation export (optional debug CSV).

---

## 12) Future (post-V1)

* Heatmap for **site** level.
* Forecasts & **price hints** overlay (stacked OTB + expected pickup).
* Drill-through to **reservation list** per bar/day.
* Compare **multiple custom periods** (e.g., “This summer vs 2023 summer”).
* Saved report presets and scheduled email exports.

---

## 13) Implementation Notes (dev quick start)

* Build/refresh a **`site_night`** materialized view (or parquet) from reservations + blocks nightly; store `on`, `an`, `revenue_lodging_net`.
* Ensure timezone normalization to property TZ; store **naive local dates** for joins.
* FE pulls a single JSON (`/api/reports/occupancy/by-site`) and renders:

  * Donut (ON/AN[/Blocked])
  * Avg weekday (7 points + optional comparators)
  * Trend bars (mode per auto/override; highlight selection)
  * Table with server-side pagination/sorting.
* Export reuses the same aggregation as the table.

---

## 14) Open Questions

1. Do we need a per-reservation **appeasements** mapping rule for revenue (allocate to nights or to stay, equally)?
2. Should “Include Blocked” be **sticky** per user/account?
3. Do we expose **week numbering** or **date labels** only (spec leans to date labels like “Mon–Sun, Jan 6–Jan 12”)?
4. For **Daily** mode, do we show **stacked OTB + pickup** in V1 or defer to V1.1?

---

### Appendix — ADR/RevPAR Example (from spec)

Window: **07/01–07/04** (3 nights), Site A AN=3
Res #101: nights 07/01, 07/02 (ON=2)
Rates 80, 100; 10% coupon (−18 total) pro-rata → 72 + 90 = **L=162**
**ADR = 162 / 2 = 81.00**
**RevPAR = 162 / 3 = 54.00**

---

**Ready for design handoff & API contract.**
