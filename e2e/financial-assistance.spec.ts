import { expect, test } from '@playwright/test';

test('complete financial assistance application flow', async ({ page }) => {
  // Navigate to homepage and start application
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveURL('http://localhost:3000/');
  
  // Verify landing page is loaded
  await expect(page.getByText('Apply for Financial Assistance')).toBeVisible();
  await page.getByRole('button', { name: 'Start Application' }).click();

  // Fill personal information
  const personalInfoForm = {
    firstName: 'Ahmed',
    lastName: 'Yassin',
    nationalId: '9299292',
    phoneNumber: '12292928383',
    email: 'diduheuhf@u.com',
    address: 'Some street address.',
    city: 'Dubai',
    emirate: 'Dubai'
  };

  await page.getByRole('textbox', { name: 'Enter your first name' }).fill(personalInfoForm.firstName);
  await page.getByRole('textbox', { name: 'Enter your last name' }).fill(personalInfoForm.lastName);
  await page.getByRole('textbox', { name: 'Enter your National ID' }).fill(personalInfoForm.nationalId);
  
  // Select date of birth
  await page.getByRole('button', { name: 'Select your date of birth' }).click();
  await page.getByRole('button', { name: 'Thursday, September 25th,' }).click();
  
  // Select gender
  await page.getByTestId('gender-select-trigger').click();
  await page.getByTestId('gender-option-male').click();

  // Fill contact information
  await page.getByRole('textbox', { name: 'Enter your phone number' }).fill(personalInfoForm.phoneNumber);
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill(personalInfoForm.email);
  await page.getByRole('textbox', { name: 'Enter your full address' }).fill(personalInfoForm.address);
  await page.getByRole('textbox', { name: 'Enter your city' }).fill(personalInfoForm.city);
  await page.getByRole('textbox', { name: 'Enter your state or emirate' }).fill(personalInfoForm.emirate);

  // Select country
  await page.getByTestId('country-select-trigger').click();
  await page.getByTestId('country-option-ae').click();

  // Verify personal info form and continue
  await expect(page.getByRole('textbox', { name: 'Enter your first name' })).toHaveValue(personalInfoForm.firstName);
  await page.getByRole('button', { name: 'Continue' }).click();

  // Fill family and financial information
  await page.getByTestId('marital-status-select-trigger').click();
  await page.getByTestId('marital-status-option-married').click();
  
  await page.getByTestId('housing-status-select-trigger').click();
  await page.getByTestId('housing-status-option-rented').click();

  // Fill financial details
  await page.getByPlaceholder('Enter your monthly income').fill('22000');
  await page.getByPlaceholder('Enter your monthly expenses').fill('3999');
  await page.getByPlaceholder('Enter number of dependents').fill('3');

  // Fill employment information
  await page.getByTestId('employment-status-select-trigger').click();
  await page.getByTestId('employment-status-option-employed').click();

  const employmentInfo = {
    employer: 'Xische',
    jobTitle: 'Lead Frontend Engineer',
    experience: '12',
    additionalIncome: '1996',
    additionalIncomeSource: 'Bla bla'
  };

  await page.getByRole('textbox', { name: 'Enter employer name' }).fill(employmentInfo.employer);
  await page.getByRole('textbox', { name: 'Enter your job title' }).fill(employmentInfo.jobTitle);
  await page.getByPlaceholder('Enter years of experience').fill(employmentInfo.experience);
  await page.getByPlaceholder('Enter additional income if any').fill(employmentInfo.additionalIncome);
  await page.getByRole('textbox', { name: 'Describe the source of' }).fill(employmentInfo.additionalIncomeSource);

  // Verify employment info and continue
  await expect(page.getByRole('textbox', { name: 'Enter employer name' })).toHaveValue(employmentInfo.employer);
  await page.getByRole('button', { name: 'Continue' }).click();

  // Generate and accept AI content for financial situation
  await page.getByLabel('Generate content with AI').first().click();
  await page.getByRole('button', { name: 'Accept generated content' }).click();

  // Generate and accept AI content for employment circumstances
  await page.getByLabel('Generate content with AI').nth(1).click();
  await page.getByRole('button', { name: 'Accept generated content' }).click();


  // Generate and accept AI content for employment circumstances
  await page.getByLabel('Generate content with AI').nth(2).click();
  await page.getByRole('button', { name: 'Accept generated content' }).click();

  // Submit application
  await page.getByRole('button', { name: 'Submit Application' }).click();

  // Verify successful submission
  await expect(page.getByText('Application Submitted Successfully!')).toBeVisible();
  
  // Return to home
  await page.getByRole('button', { name: 'Return to Home' }).click();
  await expect(page.getByText('Apply for Financial Assistance')).toBeVisible();
});