import { test, expect } from '@playwright/test'

/**
 * Authentication E2E Tests
 * Tests the complete login/logout flow
 */

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and localStorage before each test
    await page.context().clearCookies()
  })

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should show login page with Google button', async ({ page }) => {
    await page.goto('/login')

    // Check for Google sign in button
    const googleButton = page.getByRole('button', { name: /google|sign in with/i })
    await expect(googleButton.first()).toBeVisible()
  })

  test('should protect all dashboard routes', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/brief-intake',
      '/proposal-builder',
      '/analytics',
      '/calendar',
      '/client-crm',
    ]

    for (const route of protectedRoutes) {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    }
  })

  test('should not show demo mode option', async ({ page }) => {
    await page.goto('/login')

    // Verify demo mode button is NOT present (demo mode was removed)
    const demoButton = page.getByRole('button', { name: /demo/i })
    await expect(demoButton).not.toBeVisible()
  })
})

test.describe('Login Flow', () => {
  test('should navigate to Google OAuth on button click', async ({ page }) => {
    await page.goto('/login')

    // Click Google sign in button
    const googleButton = page.getByRole('button', { name: /google|sign in/i }).first()
    await googleButton.click()

    // Should redirect to Google OAuth
    await expect(page).toHaveURL(/accounts\.google\.com/, { timeout: 10000 })
  })
})
