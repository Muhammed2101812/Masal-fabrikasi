// e2e/story-generation.spec.ts

import { test, expect } from '@playwright/test';

test('should generate a story with valid inputs', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Select age group
  await page.selectOption('select#age-group', '3-5');
  
  // Select category
  await page.selectOption('select#category', 'adventure');
  
  // Select length
  await page.selectOption('select#length', 'short');
  
  // Click generate button
  await page.click('button#generate-story');
  
  // Wait for the story to be generated
  await page.waitForSelector('#story-content');
  
  // Check if story content is displayed
  const storyContent = await page.textContent('#story-content');
  expect(storyContent).not.toBeNull();
  expect(storyContent!.length).toBeGreaterThan(0);
});

test('should display error for missing inputs', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Click generate button without selecting any options
  await page.click('button#generate-story');
  
  // Wait for the error message
  await page.waitForSelector('#error-message');
  
  // Check if error message is displayed
  const errorMessage = await page.textContent('#error-message');
  expect(errorMessage).not.toBeNull();
  expect(errorMessage).toContain('gerekli');
});