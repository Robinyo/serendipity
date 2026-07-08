import { test, expect } from '@playwright/test';

test('Web Modeler login and projects access', async ({ page }) => {
  test.setTimeout(120000);
  
  // Navigate to Web Modeler
  await page.goto('http://localhost:8070/');
  
  // Verify login page loads
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
  await expect(page.getByLabel('Username or email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  
  // Perform login
  await page.getByLabel('Username or email').fill('demo');
  await page.getByLabel('Password').fill('demo');
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // Wait for login to complete
  await page.waitForLoadState('networkidle');
  
  // Verify successful login by checking URL and Projects page
  await expect(page).toHaveURL(/.*(?<!\/login)$/);
  await expect(page.locator('input[type="password"]')).not.toBeVisible();
  
  // Verify we can see the projects page
  await expect(page.getByText('Projects')).toBeVisible({ timeout: 30000 });
  
  // Verify no authentication errors
  await expect(page.locator('text=/invalid.*credential|login.*failed|authentication.*error|unauthorized/i')).not.toBeVisible();
  
  // Additional validation: ensure we're not on an error page
  const title = await page.title();
  expect(title).not.toBe('');
  expect(title.toLowerCase()).not.toContain('error');
  expect(title.toLowerCase()).not.toContain('not found');
});
