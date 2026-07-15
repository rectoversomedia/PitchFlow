import { test, expect } from '@playwright/test'

/**
 * Authentication E2E Tests
 * Tests login flow with Supabase credentials
 */

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
  })

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should show login page with PitchFlow branding', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('PitchFlow')).toBeVisible()
    await expect(page.getByText('AI-Powered Sponsorship Workspace')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible()
  })

  test('should show email and password fields', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByPlaceholder('Enter your email')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible()
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible()
  })

  test('should protect all protected routes', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/brief-intake',
      '/proposal-builder',
      '/client-crm',
      '/calendar',
      '/analytics',
    ]

    for (const route of protectedRoutes) {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    }
  })

  test('should show signup link', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText(/Sign up/i)).toBeVisible()
  })

  test('should show forgot password link', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText(/Forgot password/i)).toBeVisible()
  })
})

test.describe('Login Flow', () => {
  test('should show error for empty credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /Sign In/i }).click()

    // Should show validation error
    await expect(page.getByPlaceholder('Enter your email')).toBeInvalid()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder('Enter your email').fill('invalid@pitchflow.app')
    await page.getByPlaceholder('Enter your password').fill('wrongpassword')
    await page.getByRole('button', { name: /Sign In/i }).click()

    // Should show error message
    await expect(page.getByText(/Email atau password salah|something went wrong/i)).toBeVisible({ timeout: 10000 })
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    // Use demo credentials
    await page.getByPlaceholder('Enter your email').fill('supervisor@pitchflow.app')
    await page.getByPlaceholder('Enter your password').fill('pitchflow123')
    await page.getByRole('button', { name: /Sign In/i }).click()

    // Should redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 })
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
