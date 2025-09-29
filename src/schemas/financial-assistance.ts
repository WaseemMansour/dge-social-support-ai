import { z } from 'zod'

// Create a function that returns the schema with i18n messages
export const createPersonalInfoSchema = (t: (key: string) => string) => z.object({
  firstName: z.string().min(1, t('financial-assistance.form.validation.firstName')),
  lastName: z.string().min(1, t('financial-assistance.form.validation.lastName')),
  nationalId: z.string().min(1, t('financial-assistance.form.validation.nationalId')).regex(/^\d+$/, t('financial-assistance.form.validation.nationalIdNumbersOnly')),
  dateOfBirth: z.string().min(1, t('financial-assistance.form.validation.dateOfBirth')),
  gender: z.string().min(1, t('financial-assistance.form.validation.gender')),
  phone: z.string().min(1, t('financial-assistance.form.validation.phone')).regex(/^\d+$/, t('financial-assistance.form.validation.phoneNumbersOnly')),
  email: z.string().min(1, t('financial-assistance.form.validation.emailRequired')).email(t('financial-assistance.form.validation.email')),
  address: z.string().min(1, t('financial-assistance.form.validation.address')),
  city: z.string().min(1, t('financial-assistance.form.validation.city')),
  state: z.string().min(1, t('financial-assistance.form.validation.state')),
  country: z.string().min(1, t('financial-assistance.form.validation.country')),
})

// Type for the form data
export type PersonalInfoFormData = {
  firstName: string
  lastName: string
  nationalId: string
  dateOfBirth: string
  gender: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  country: string
}

// Create a function that returns the family financial schema with i18n messages
export const createFamilyFinancialSchema = (t: (key: string) => string) => z.object({
  maritalStatus: z.string().min(1, t('financial-assistance.form.validation.maritalStatus')),
  dependents: z.string().min(1, t('financial-assistance.form.validation.dependents')),
  employmentStatus: z.string().min(1, t('financial-assistance.form.validation.employmentStatus')),
  monthlyIncome: z.string().min(1, t('financial-assistance.form.validation.monthlyIncome')),
  housingStatus: z.string().min(1, t('financial-assistance.form.validation.housingStatus')),
  monthlyExpenses: z.string().min(1, t('financial-assistance.form.validation.monthlyExpenses')),
  employerName: z.string().min(1, t('financial-assistance.form.validation.employerName')),
  jobTitle: z.string().min(1, t('financial-assistance.form.validation.jobTitle')),
  workExperience: z.string().min(1, t('financial-assistance.form.validation.workExperience')),
  additionalIncome: z.string().optional(),
  additionalIncomeSource: z.string().optional(),
})

// Type for the family financial form data
export type FamilyFinancialFormData = {
  maritalStatus: string
  dependents: string
  employmentStatus: string
  monthlyIncome: string
  housingStatus: string
  monthlyExpenses: string
  employerName: string
  jobTitle: string
  workExperience: string
  additionalIncome?: string
  additionalIncomeSource?: string
}
