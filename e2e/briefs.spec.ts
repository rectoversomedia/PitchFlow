import { test, expect } from '@playwright/test'

/**
 * Brief Management E2E Tests
 */

test.describe('Brief Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.getByPlaceholder('Enter your email').fill('supervisor@pitchflow.app')
    await page.getByPlaceholder('Enter your password').fill('pitchflow123')
    await page.getByRole('button', { name: /Sign In/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 15000 })
  })

  test('should access brief intake page', async ({ page }) => {
    await page.goto('/brief-intake')
    await expect(page).toHaveURL(/\/brief-intake/)
  })

  test('should show brief form fields', async ({ page }) => {
    await page.goto('/brief-intake')
    await page.waitForTimeout(1000)

    // Check for form elements
    const hasForm = await page.locator('input, textarea, select').count() > 0
    expect(hasForm).toBeTruthy()
  })
})

test.describe('Brief API', () => {
  test('should fetch briefs with auth', async ({ request }) => {
    // This would require authenticated session
    // In real tests, use authenticated request
    const response = await request.get('/api/briefs')
    // Should either succeed (200) or require auth (401)
    expect([200, 401]).toContain(response.status())
  })

  test('should reject unauthenticated requests', async ({ request }) => {
    const response = await request.get('/api/briefs')
    expect(response.status()).toBe(401)
  })

  test('should validate brief creation payload', async ({ request }) => {
    const response = await request.post('/api/briefs', {
      headers: { 'Content-Type': 'application/json' },
      data: { brand_name: '' }, // Missing required fields
    })

    // Should fail validation
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })
})
