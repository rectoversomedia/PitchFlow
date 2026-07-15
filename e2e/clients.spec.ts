import { test, expect } from '@playwright/test'

/**
 * Client CRM E2E Tests
 */

test.describe('Client CRM', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Enter your email').fill('supervisor@pitchflow.app')
    await page.getByPlaceholder('Enter your password').fill('pitchflow123')
    await page.getByRole('button', { name: /Sign In/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 15000 })
  })

  test('should access client CRM page', async ({ page }) => {
    await page.goto('/client-crm')
    await expect(page).toHaveURL(/\/client-crm/)
  })
})

test.describe('Client API', () => {
  test('should reject unauthenticated requests', async ({ request }) => {
    const response = await request.get('/api/clients')
    expect(response.status()).toBe(401)
  })

  test('should validate client creation payload', async ({ request }) => {
    const response = await request.post('/api/clients', {
      headers: { 'Content-Type': 'application/json' },
      data: { name: '' },
    })
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })
})
