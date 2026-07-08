import { test, expect } from '@playwright/test';

test('Operate login and dashboard access', async ({ page }) => {
  test.setTimeout(120000);

  // Navigate to Operate (OIDC flow will redirect through Keycloak)
  await page.goto('http://localhost:8080/operate');

  // Identity login page shows either "Username" or "Username or email"
  const usernameField = page.locator('input[name="username"], input[name="email"], input[id="username"], input[label="Username or email"]');
  await usernameField.first().waitFor({ state: 'visible' });
  const passwordField = page.locator('input[type="password"]');
  await passwordField.first().waitFor({ state: 'visible' });

  await usernameField.first().fill('demo');
  await passwordField.first().fill('demo');
  await page.getByRole('button', { name: /sign in|log in/i }).click();

  // Wait for navigation after successful login back to Operate
  await page.waitForLoadState('load');
  await page.waitForURL(/http:\/\/localhost:8080\/operate(?!.*login).*$/);

  // Verify successful login by checking URL change and absence of login form
  await expect(page).toHaveURL(/.*operate(?!.*login).*$/);
  await expect(page.locator('input[type="password"]')).not.toBeVisible();

  // Verify no authentication errors
  await expect(page.locator('text=/invalid.*credential|login.*failed|authentication.*error|unauthorized/i')).not.toBeVisible();

  // Verify page title is reasonable
  const title = await page.title();
  expect(title).not.toBe('');
  expect(title.toLowerCase()).not.toContain('error');
  expect(title.toLowerCase()).not.toContain('not found');
});
