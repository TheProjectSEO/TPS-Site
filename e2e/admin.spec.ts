import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/admin')
    
    // Should redirect to auth or show login
    await page.waitForURL(/auth|login/, { timeout: 10000 })
    expect(page.url()).toMatch(/auth|login/)
  })

  test('admin pages should be protected', async ({ page }) => {
    const adminRoutes = [
      '/admin/experiences',
      '/admin/blog',
      '/admin/faqs',
      '/admin/testimonials',
      '/admin/redirects'
    ]

    for (const route of adminRoutes) {
      await page.goto(route)
      // Should redirect away from admin route when not authenticated
      await page.waitForTimeout(1000)
      expect(page.url()).not.toContain(route)
    }
  })
})

test.describe('FAQ Management', () => {
  test.skip('should load FAQ management page when authenticated', async ({ page }) => {
    // TODO: Add authentication setup
    // This test is skipped until auth is properly configured
    await page.goto('/admin/faqs')
    await expect(page.locator('text="FAQs Management"')).toBeVisible()
  })
})