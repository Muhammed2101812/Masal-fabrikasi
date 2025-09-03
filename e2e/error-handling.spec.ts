// e2e/error-handling.spec.ts

import { test, expect } from '@playwright/test';

test('should display error when API returns an error', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Intercept the API call and mock an error response
  await page.route('**/api/generate', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Sunucu hatası oluştu.' })
    });
  });
  
  // Select age group
  await page.selectOption('select#age-group', '3-5');
  
  // Select category
  await page.selectOption('select#category', 'adventure');
  
  // Select length
  await page.selectOption('select#length', 'short');
  
  // Click generate button
  await page.click('button#generate-story');
  
  // Wait for the error message
  await page.waitForSelector('#error-message');
  
  // Check if error message is displayed
  const errorMessage = await page.textContent('#error-message');
  expect(errorMessage).not.toBeNull();
  expect(errorMessage).toContain('Sunucu hatası oluştu.');
});

test('should display error for rate limiting', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Intercept the API call and mock a rate limit error response
  await page.route('**/api/generate', route => {
    route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.' })
    });
  });
  
  // Select age group
  await page.selectOption('select#age-group', '3-5');
  
  // Select category
  await page.selectOption('select#category', 'adventure');
  
  // Select length
  await page.selectOption('select#length', 'short');
  
  // Click generate button
  await page.click('button#generate-story');
  
  // Wait for the error message
  await page.waitForSelector('#error-message');
  
  // Check if error message is displayed
  const errorMessage = await page.textContent('#error-message');
  expect(errorMessage).not.toBeNull();
  expect(errorMessage).toContain('Çok fazla istek gönderdiniz');
});