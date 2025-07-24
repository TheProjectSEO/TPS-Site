import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/TPS Site/)
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')
    
    // Check for hero elements
    const heroSection = page.locator('[data-testid="hero-section"], .hero, h1').first()
    await expect(heroSection).toBeVisible()
  })

  test('should display featured experiences', async ({ page }) => {
    await page.goto('/')
    
    // Wait for content to load
    await page.waitForLoadState('networkidle')
    
    // Check for tours/experiences section
    const toursSection = page.locator('text="Top Experiences", text="Featured", text="Tours"').first()
    await expect(toursSection).toBeVisible({ timeout: 10000 })
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check mobile navigation
    const nav = page.locator('nav, header').first()
    await expect(nav).toBeVisible()
  })
})

test.describe('Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    // Expect page to load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })
})