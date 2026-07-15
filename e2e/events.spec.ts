import { test, expect } from '@playwright/test'

/**
 * Calendar & Events E2E Tests
 */

test.describe('Calendar & Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Enter your email').fill('supervisor@pitchflow.app')
    await page.getByPlaceholder('Enter your password').fill('pitchflow123')
    await page.getByRole('button', { name: /Sign In/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 15000 })
  })

  test('should access calendar page', async ({ page }) => {
    await page.goto('/calendar')
    await expect(page).toHaveURL(/\/calendar/)
  })
})

test.describe('Events API', () => {
  test('should reject unauthenticated event requests', async ({ request }) => {
    const response = await request.get('/api/events')
    expect(response.status()).toBe(401)
  })

  test('should validate event creation payload', async ({ request }) => {
    const response = await request.post('/api/events', {
      headers: { 'Content-Type': 'application/json' },
      data: { title: '' }, // Missing required fields
    })
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })
})
