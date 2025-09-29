import { expect, test } from '@playwright/test'

test.describe('Financial Assistance Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/financial-assistance')
  })

  test('completes full application journey', async ({ page }) => {
    // Step 1: Personal Information
    await page.fill('input[placeholder="Enter your first name"]', 'John')
    await page.fill('input[placeholder="Enter your last name"]', 'Doe')
    await page.fill('input[placeholder="Enter your National ID"]', '123456789')
    await page.fill('input[placeholder="Enter your phone number"]', '0501234567')
    await page.fill('input[placeholder="Enter your email address"]', 'john@example.com')
    await page.selectOption('select[name="gender"]', 'male')
    await page.fill('textarea[name="address"]', 'Test Address')
    await page.fill('input[name="city"]', 'Abu Dhabi')
    await page.fill('input[name="state"]', 'Abu Dhabi')
    await page.selectOption('select[name="country"]', 'AE')
    
    await page.click('button:has-text("Continue")')
    
    // Step 2: Family & Financial Info
    await page.selectOption('select[name="maritalStatus"]', 'single')
    await page.fill('input[name="dependents"]', '2')
    await page.selectOption('select[name="employmentStatus"]', 'employed')
    await page.fill('input[name="monthlyIncome"]', '15000')
    await page.selectOption('select[name="housingStatus"]', 'owned')
    await page.fill('input[name="monthlyExpenses"]', '10000')
    await page.fill('input[name="employerName"]', 'Test Company')
    await page.fill('input[name="jobTitle"]', 'Engineer')
    await page.fill('input[name="workExperience"]', '5')
    
    await page.click('button:has-text("Continue")')
    
    // Step 3: Situation Description
    await page.fill('textarea[name="currentFinancialSituation"]', 'Detailed test situation description that meets minimum length requirements.')
    await page.fill('textarea[name="employmentCircumstances"]', 'Detailed test employment circumstances that meets minimum length requirements.')
    await page.fill('textarea[name="reasonForApplying"]', 'Detailed test reason for applying that meets minimum length requirements.')
    
    await page.click('button:has-text("Submit Application")')
    
    // Verify success screen
    await expect(page.locator('text=Application Submitted Successfully')).toBeVisible()
    await expect(page.locator('text=/APP-\\d{6}-[A-Z0-9]+/')).toBeVisible()
    
    // Verify success actions
    await expect(page.locator('button:has-text("Start New Application")')).toBeVisible()
    await expect(page.locator('button:has-text("Return to Home")')).toBeVisible()
  })

  test('validates required fields and shows errors', async ({ page }) => {
    // Try to continue without filling required fields
    await page.click('button:has-text("Continue")')
    
    // Verify validation errors in English
    await expect(page.locator('text=First name is required')).toBeVisible()
    await expect(page.locator('text=Last name is required')).toBeVisible()
    
    // Switch language and verify Arabic validation
    await page.click('button:has-text("العربية")')
    await expect(page.locator('text=الاسم الأول مطلوب')).toBeVisible()
  })

  test('uses AI assistance for all description fields', async ({ page }) => {
    await page.goto('/financial-assistance?step=situation-description')
    
    // Test AI assist for each field
    for (const field of ['currentFinancialSituation', 'employmentCircumstances', 'reasonForApplying']) {
      // Find the AI assist button near the field
      const fieldContainer = page.locator(`textarea[name="${field}"]`).locator('..')
      const aiButton = fieldContainer.locator('button:has-text("Help me write")')
      await aiButton.click()
      
      // Wait for and verify generation process
      await expect(page.locator('text=Generated Content')).toBeVisible()
      
      // Edit generated content
      await page.click('button:has-text("Edit")')
      const editArea = page.locator('textarea.w-full')
      await editArea.fill('Modified ' + field + ' content')
      
      // Save edits
      await page.click('button:has-text("Save Changes")')
      
      // Verify content is applied
      await expect(page.locator(`textarea[name="${field}"]`)).toHaveValue(/Modified.*content/)
    }
  })

  test('handles offline state gracefully', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true)
    
    // Try to use AI assistance
    await page.goto('/financial-assistance?step=situation-description')
    await page.click('button:has-text("Help me write")')
    
    // Verify error message
    await expect(page.locator('text=Network error')).toBeVisible()
    
    // Go back online and verify recovery
    await context.setOffline(false)
    await page.click('button:has-text("Help me write")')
    await expect(page.locator('text=Generated Content')).toBeVisible()
  })

  test('persists form data across navigation and browser sessions', async ({ page, context }) => {
    // Fill first step
    await page.fill('input[placeholder="Enter your first name"]', 'John')
    await page.fill('input[placeholder="Enter your last name"]', 'Doe')
    await page.click('button:has-text("Continue")')
    
    // Fill second step
    await page.selectOption('select[name="maritalStatus"]', 'single')
    await page.fill('input[name="dependents"]', '2')
    
    // Create new context (simulates new browser session)
    const browser = await context.browser()
    if (!browser) throw new Error('Browser instance not available')
    const newContext = await browser.newContext()
    const newPage = await newContext.newPage()
    await newPage.goto('/financial-assistance')
    
    // Verify data persists
    await expect(newPage.locator('input[placeholder="Enter your first name"]')).toHaveValue('John')
    await expect(newPage.locator('input[placeholder="Enter your last name"]')).toHaveValue('Doe')
    
    // Navigate to step 2 and verify that data too
    await newPage.click('button:has-text("Continue")')
    await expect(newPage.locator('select[name="maritalStatus"]')).toHaveValue('single')
    await expect(newPage.locator('input[name="dependents"]')).toHaveValue('2')
  })

  test('support resources are accessible throughout the form', async ({ page }) => {
    // Check initial visibility
    await expect(page.locator('text=Need Help?')).toBeVisible()
    await expect(page.locator('text=24/7 Support Helpline')).toBeVisible()
    
    // Navigate through steps and verify support remains visible
    await page.fill('input[placeholder="Enter your first name"]', 'John')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('text=Need Help?')).toBeVisible()
    
    await page.selectOption('select[name="maritalStatus"]', 'single')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('text=Need Help?')).toBeVisible()
    
    // Verify support links are clickable
    await expect(page.locator('text=support@dge.gov.ae')).toBeVisible()
  })
})