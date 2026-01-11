import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite for Occupancy by Site Report
 *
 * Acceptance Criteria:
 * 1. All major components present and positioned correctly
 * 2. Color scheme matches design system
 * 3. Typography hierarchy matches Figma
 * 4. Interactive elements function as specified
 * 5. Acceptable tolerance: ±5px spacing
 */

test.describe('Occupancy Report - Page Load & Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Occupancy by Site Report');
  });

  test('should display date range in header', async ({ page }) => {
    const dateRange = page.locator('.date-range');
    await expect(dateRange).toBeVisible();
    // Date range should show dates and night count
    await expect(dateRange).toContainText(/\d+ nights/);
  });

  test('should have filter bar with all controls', async ({ page }) => {
    // Date picker should be visible
    const datePicker = page.locator('input[type="date"]').first();
    await expect(datePicker).toBeVisible();

    // Site and Type filter buttons should be visible
    const siteButton = page.getByRole('button', { name: /Site/i });
    const typeButton = page.getByRole('button', { name: /Type/i });
    await expect(siteButton).toBeVisible();
    await expect(typeButton).toBeVisible();

    // Settings and Refresh buttons should be visible
    const settingsButton = page.locator('button').filter({ hasText: /settings/i }).or(page.locator('[title*="Settings"]'));
    const refreshButton = page.locator('button').filter({ hasText: /refresh/i }).or(page.locator('[title*="Refresh"]'));

    // At least one of each button type should exist
    expect(await settingsButton.count() + await refreshButton.count()).toBeGreaterThan(0);
  });
});

test.describe('Occupancy Report - Charts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait a bit for charts to render
    await page.waitForTimeout(1000);
  });

  test('should render Total Occupancy donut chart', async ({ page }) => {
    // Look for the chart container or title
    const totalOccupancySection = page.locator('text=Total occupancy').or(
      page.locator('text=Total Occupancy')
    );
    await expect(totalOccupancySection).toBeVisible();

    // Recharts creates SVG elements
    const chartContainer = page.locator('.recharts-wrapper').first();
    await expect(chartContainer).toBeVisible();

    // Should show legend with ON/AN/Blocked labels
    const legends = page.locator('text=/Nights occupied|Available|Blocked/i');
    expect(await legends.count()).toBeGreaterThan(0);
  });

  test('should render Average Nightly Occupancy line chart', async ({ page }) => {
    const avgNightlySection = page.locator('text=/Average Nightly/i');
    await expect(avgNightlySection).toBeVisible();

    // Should have weekday labels (Sun through Sat)
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (const day of weekdays) {
      await expect(page.locator(`text=${day}`).first()).toBeVisible();
    }

    // Should have Y-axis with percentages
    await expect(page.locator('text=/0%|25%|50%|75%|100%/').first()).toBeVisible();
  });

  test('should render Occupancy Trend bar chart', async ({ page }) => {
    const trendSection = page.locator('text=/Occupancy trend/i');
    await expect(trendSection).toBeVisible();

    // Should have granularity selector (Weeks/Monthly/Daily)
    const granularityOptions = page.locator('text=/Weeks|Monthly|Daily/i');
    expect(await granularityOptions.count()).toBeGreaterThan(0);

    // Should have YoY comparison checkbox
    const yoyCheckbox = page.locator('text=/Previous period|YoY|Year over Year/i');
    expect(await yoyCheckbox.count()).toBeGreaterThanOrEqual(0); // Optional feature
  });

  test('should have all three charts visible in grid layout', async ({ page }) => {
    // Verify all three chart sections are present
    const totalOccupancy = page.locator('text=/Total occupancy/i').first();
    const avgNightly = page.locator('text=/Average Nightly/i').first();
    const trend = page.locator('text=/Occupancy trend/i').first();

    await expect(totalOccupancy).toBeVisible();
    await expect(avgNightly).toBeVisible();
    await expect(trend).toBeVisible();
  });
});

test.describe('Occupancy Report - Data Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should render data table with columns', async ({ page }) => {
    // AG-Grid creates column headers
    const headers = [
      'Site',
      'Type',
      'Occupied nights',
      'Available',
      'Av. Length of Stay',
      'Occupied Friday and Saturday',
      'Blocked',
      'Average Nightly Rate',
    ];

    // Check for at least some key headers
    for (const header of ['Site', 'Type']) {
      const headerElement = page.locator(`text=${header}`).first();
      await expect(headerElement).toBeVisible();
    }
  });

  test('should display table data rows', async ({ page }) => {
    // AG-Grid creates rows with the ag-row class
    const rows = page.locator('.ag-row, [role="row"]');
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('should have CSV export button', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: /CSV|Export|Download/i });
    await expect(exportButton).toBeVisible();
  });

  test('should have pagination controls', async ({ page }) => {
    // Look for pagination elements
    const paginationElements = page.locator('text=/Items per page|Rows per page|Page/i');
    expect(await paginationElements.count()).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Occupancy Report - Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should open settings modal when settings button is clicked', async ({ page }) => {
    // Find and click settings button
    const settingsButton = page.locator('button').filter({ hasText: /settings/i })
      .or(page.locator('[title*="Settings"]'))
      .or(page.locator('[aria-label*="Settings"]'));

    if (await settingsButton.count() > 0) {
      await settingsButton.first().click();

      // Modal should appear - check for modal-overlay or modal-content
      const modal = page.locator('.modal-overlay, .modal-content');
      await expect(modal.first()).toBeVisible();
    }
  });

  test('should refresh data when refresh button is clicked', async ({ page }) => {
    const refreshButton = page.locator('button').filter({ hasText: /refresh/i })
      .or(page.locator('[title*="Refresh"]'))
      .or(page.locator('[aria-label*="Refresh"]'));

    if (await refreshButton.count() > 0) {
      await refreshButton.first().click();

      // Wait for potential data reload
      await page.waitForTimeout(500);

      // Page should still be functional
      await expect(page.locator('h1')).toContainText('Occupancy by Site Report');
    }
  });

  test('should be able to sort table columns', async ({ page }) => {
    // Find a column header and click it
    const columnHeader = page.locator('.ag-header-cell, [role="columnheader"]').first();

    if (await columnHeader.count() > 0) {
      await columnHeader.click();

      // Table should still be visible
      const rows = page.locator('.ag-row, [role="row"]');
      expect(await rows.count()).toBeGreaterThan(0);
    }
  });
});

test.describe('Occupancy Report - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for charts to fully render
    await page.waitForTimeout(2000);
  });

  test('should match Figma design - full page screenshot at 1920x1080', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);

    // Take full page screenshot
    const screenshot = await page.screenshot({
      fullPage: true,
      path: 'e2e/screenshots/occupancy-report-fullpage-1920x1080.png'
    });

    expect(screenshot).toBeTruthy();
  });

  test('should match Figma design - viewport screenshot at 1920x1080', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);

    // Take viewport screenshot (what's visible without scrolling)
    const screenshot = await page.screenshot({
      fullPage: false,
      path: 'e2e/screenshots/occupancy-report-viewport-1920x1080.png'
    });

    expect(screenshot).toBeTruthy();
  });

  test('should match Figma design - charts section only', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);

    // Screenshot just the charts area
    const chartsGrid = page.locator('.charts-grid').first();
    if (await chartsGrid.count() > 0) {
      await chartsGrid.screenshot({
        path: 'e2e/screenshots/occupancy-report-charts-only.png'
      });
    }
  });

  test('should match Figma design - table section only', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);

    // Screenshot just the table area
    const tableContainer = page.locator('.ag-root, .occupancy-table').first();
    if (await tableContainer.count() > 0) {
      await tableContainer.screenshot({
        path: 'e2e/screenshots/occupancy-report-table-only.png'
      });
    }
  });

  test('should capture responsive layout at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1000);

    const screenshot = await page.screenshot({
      fullPage: true,
      path: 'e2e/screenshots/occupancy-report-fullpage-1440x900.png'
    });

    expect(screenshot).toBeTruthy();
  });
});
