import { test, expect } from '@playwright/test'

/**
 * Proposal Management E2E Tests
 */

test.describe('Proposal Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Enter your email').fill('supervisor@pitchflow.app')
    await page.getByPlaceholder('Enter your password').fill('pitchflow123')
    await page.getByRole('button', { name: /Sign In/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 15000 })
  })

  test('should access proposal builder page', async ({ page }) => {
    await page.goto('/proposal-builder')
    await expect(page).toHaveURL(/\/proposal-builder/)
  })

  test('should access proposal library page', async ({ page }) => {
    await page.goto('/proposal-library')
    await expect(page).toHaveURL(/\/proposal-library/)
  })
})

test.describe('Proposal API', () => {
  test('should reject unauthenticated requests', async ({ request }) => {
    const response = await request.get('/api/proposals')
    expect(response.status()).toBe(401)
  })

  test('should validate proposal creation payload', async ({ request }) => {
    const response = await request.post('/api/proposals', {
      headers: { 'Content-Type': 'application/json' },
      data: { title: '' }, // Missing required fields
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })
})
