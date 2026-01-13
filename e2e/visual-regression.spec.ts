import { test, expect, Page } from '@playwright/test';

/**
 * Visual Regression Tests - Figma Design Match
 * 
 * Compares production UI against Figma-exported baseline screenshots.
 * 
 * Baselines:
 * - fullpage-1920.png (1920px width)
 * - fullpage-1366.png (1366px width)
 * 
 * Run: npx playwright test visual-regression
 * Update baselines: npx playwright test visual-regression --update-snapshots
 */

// Sidebar width in Figma design (we clip this since sidebar is not part of this component)
const SIDEBAR_WIDTH = 200;

// Wait for all charts to fully render
async function waitForChartsToRender(page: Page): Promise<void> {
  // Wait for network to be idle (data loaded)
  await page.waitForLoadState('networkidle');
  
  // Wait for Recharts SVG elements to appear
  await page.waitForSelector('.recharts-wrapper', { timeout: 10000 });
  
  // Wait for AG-Grid to render
  await page.waitForSelector('.ag-root-wrapper, .ag-root', { timeout: 10000 });
  
  // Additional wait for animations to complete
  await page.waitForTimeout(1500);
}

// Get clip region that excludes sidebar (sidebar is separate component)
function getMainContentClip(viewportWidth: number, pageHeight: number) {
  return {
    x: SIDEBAR_WIDTH,
    y: 0,
    width: viewportWidth - SIDEBAR_WIDTH,
    height: pageHeight,
  };
}

test.describe.skip('Visual Regression - Layout Protection', () => {
  
  test('fullpage layout at 1920px width', async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Navigate and wait for content
    await page.goto('/');
    await waitForChartsToRender(page);
    
    // Visual regression test - catches unintended layout changes
    await expect(page).toHaveScreenshot('layout-1920.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02, // 2% tolerance for minor rendering differences
      threshold: 0.2,
    });
  });

  test('fullpage layout at 1366px width', async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1366, height: 768 });
    
    // Navigate and wait for content
    await page.goto('/');
    await waitForChartsToRender(page);
    
    // Visual regression test - catches unintended layout changes
    await expect(page).toHaveScreenshot('layout-1366.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      threshold: 0.2,
    });
  });

});

test.describe.skip('Component-Level Visual Regression', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await waitForChartsToRender(page);
  });

  test('charts section matches design', async ({ page }) => {
    const chartsGrid = page.locator('.charts-grid');
    
    await expect(chartsGrid).toHaveScreenshot('charts-section.png', {
      maxDiffPixelRatio: 0.03,
      threshold: 0.3,
    });
  });

  test('occupancy trend chart matches design', async ({ page }) => {
    const trendChart = page.locator('.trend-chart');
    
    await expect(trendChart).toHaveScreenshot('trend-chart.png', {
      maxDiffPixelRatio: 0.03,
      threshold: 0.3,
    });
  });

  test('data table matches design', async ({ page }) => {
    const tableSection = page.locator('.occupancy-table, .ag-root-wrapper').first();
    
    await expect(tableSection).toHaveScreenshot('data-table.png', {
      maxDiffPixelRatio: 0.03,
      threshold: 0.3,
    });
  });

});
