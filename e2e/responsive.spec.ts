// e2e/responsive.spec.ts

import { test, expect } from '@playwright/test';

test('should display correctly on mobile viewport', async ({ page }) => {
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });
  
  // Navigate to the home page
  await page.goto('/');
  
  // Check if main elements are visible
  await expect(page.locator('#age-group')).toBeVisible();
  await expect(page.locator('#category')).toBeVisible();
  await expect(page.locator('#length')).toBeVisible();
  await expect(page.locator('#generate-story')).toBeVisible();
  
  // Check if layout is appropriate for mobile
  // This would depend on the actual CSS and layout implementation
  // For example, check if certain elements are stacked vertically
  // or if navigation is in a hamburger menu
  // const layoutClass = await page.getAttribute('body', 'class');
  // expect(layoutClass).toContain('mobile');
});

test('should display correctly on desktop viewport', async ({ page }) => {
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Navigate to the home page
  await page.goto('/');
  
  // Check if main elements are visible
  await expect(page.locator('#age-group')).toBeVisible();
  await expect(page.locator('#category')).toBeVisible();
  await expect(page.locator('#length')).toBeVisible();
  await expect(page.locator('#generate-story')).toBeVisible();
  
  // Check if layout is appropriate for desktop
  // This would depend on the actual CSS and layout implementation
  // For example, check if certain elements are arranged horizontally
  // or if navigation is in a sidebar
  // const layoutClass = await page.getAttribute('body', 'class');
  // expect(layoutClass).toContain('desktop');
});