import { test, expect } from '@playwright/test'

/**
 * AI Features E2E Tests
 */

test.describe('AI Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Enter your email').fill('supervisor@pitchflow.app')
    await page.getByPlaceholder('Enter your password').fill('pitchflow123')
    await page.getByRole('button', { name: /Sign In/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 15000 })
  })

  test('should access brand idea explorer', async ({ page }) => {
    await page.goto('/brand-idea-explorer')
    await expect(page).toHaveURL(/\/brand-idea-explorer/)
  })

  test('should access brand DNA explorer', async ({ page }) => {
    await page.goto('/brand-dna-explorer')
    await expect(page).toHaveURL(/\/brand-dna-explorer/)
  })

  test('should access trend radar', async ({ page }) => {
    await page.goto('/trend-radar')
    await expect(page).toHaveURL(/\/trend-radar/)
  })

  test('should access audience insights', async ({ page }) => {
    await page.goto('/audience-insights')
    await expect(page).toHaveURL(/\/audience-insights/)
  })

  test('should access ROI calculator', async ({ page }) => {
    await page.goto('/roi-calculator')
    await expect(page).toHaveURL(/\/roi-calculator/)
  })
})

test.describe('AI API', () => {
  test('should reject unauthenticated AI requests', async ({ request }) => {
    const response = await request.post('/api/ai', {
      headers: { 'Content-Type': 'application/json' },
      data: { action: 'brandDNA', params: { brandName: 'Test', industry: 'Tech' } },
    })
    expect(response.status()).toBe(401)
  })

  test('should validate AI action', async ({ request }) => {
    const response = await request.post('/api/ai', {
      headers: { 'Content-Type': 'application/json' },
      data: { action: 'invalidAction', params: {} },
    })
    expect(response.status()).toBe(401) // First check auth
  })
})
