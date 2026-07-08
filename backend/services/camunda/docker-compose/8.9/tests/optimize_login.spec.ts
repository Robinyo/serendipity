import { test, expect } from '@playwright/test';

test('Optimize login and dashboard access', async ({ page }) => {
  test.setTimeout(120000);
  
  // Navigate to Optimize
  await page.goto('http://localhost:8083/');
  
  // Verify login page loads correctly
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
  await expect(page.getByLabel('Username or email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  
  // Perform login
  await page.getByLabel('Username or email').fill('demo');
  await page.getByLabel('Password').fill('demo');
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // Wait for login to complete
  await page.waitForLoadState('networkidle');
  
  // Verify successful login by checking URL change and absence of login form
  await expect(page).toHaveURL(/.*(?<!\/login)$/); // Should not be on login page
  await expect(page.locator('input[type="password"]')).not.toBeVisible();
  
  // Verify no authentication errors are displayed
  await expect(page.locator('text=/invalid.*credential|login.*failed|authentication.*error|unauthorized/i')).not.toBeVisible();
  
  // Additional verification: check page title
  const title = await page.title();
  expect(title).not.toBe('');
  expect(title.toLowerCase()).not.toContain('error');
  expect(title.toLowerCase()).not.toContain('login');
});
