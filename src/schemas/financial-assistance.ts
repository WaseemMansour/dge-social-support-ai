import { z } from 'zod'

// Create a function that returns the schema with i18n messages
export const createPersonalInfoSchema = (t: (key: string) => string) => z.object({
  firstName: z.string().min(1, t('financial-assistance.form.validation.firstName')),
  lastName: z.string().min(1, t('financial-assistance.form.validation.lastName')),
  nationalId: z.string().min(1, t('financial-assistance.form.validation.nationalId')).regex(/^\d+$/, t('financial-assistance.form.validation.nationalIdNumbersOnly')),
  dateOfBirth: z.date({
    message: t('financial-assistance.form.validation.dateOfBirth'),
  }),
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
  dateOfBirth: Date
  gender: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  country: string
}
