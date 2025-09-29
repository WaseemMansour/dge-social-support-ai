import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/button'
import { DatePicker } from '../../../components/ui/date-picker'
import { Input } from '../../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'
import { cn } from '../../../lib/utils'
import { createPersonalInfoFormSchema, type PersonalInfoFormData, type PersonalInfoFormDataWithDate } from '../../../schemas/financial-assistance'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { updatePersonalInfo } from '../../../store/slices/formSlice'

interface PersonalInfoStepProps {
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
}

// Form Field Component for consistent styling and error handling
interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  touched?: boolean
  isSubmitted?: boolean
  children: React.ReactNode
  className?: string
}

function FormField({ label, required = false, error, touched = false, isSubmitted = false, children, className }: FormFieldProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  // Show error if field is touched OR form has been submitted
  const shouldShowError = error && (touched || isSubmitted)
  
  return (
    <div className={cn("space-y-1", className)}>
      <Label className={cn("text-sm font-medium text-gray-700", isRTL && "text-right")}>
        {label}
        {required && (
          <span 
            className={cn("text-red-500", isRTL ? "mr-1" : "ml-1")}
            aria-label={t('accessibility.required')}
          >
            *
          </span>
        )}
        {!required && (
          <span 
            className={cn("text-gray-400 text-xs", isRTL ? "mr-1" : "ml-1")}
            aria-label={t('accessibility.optional')}
          >
            ({t('accessibility.optional')})
          </span>
        )}
      </Label>
      {children}
      {shouldShowError && (
        <p 
          className={cn("text-sm text-red-600 mt-0.5", isRTL && "text-right")}
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const dispatch = useAppDispatch()
  const { formData } = useAppSelector((state) => state.form)

  // Create schema with current language
  const schema = useMemo(() => createPersonalInfoFormSchema(t), [t])

  // React Hook Form setup
  const {
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { errors, isSubmitting, touchedFields, isSubmitted }
  } = useForm<PersonalInfoFormDataWithDate>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: formData.personalInfo?.firstName || '',
      lastName: formData.personalInfo?.lastName || '',
      nationalId: formData.personalInfo?.nationalId || '',
      dateOfBirth: formData.personalInfo?.dateOfBirth 
        ? new Date(formData.personalInfo.dateOfBirth)
        : undefined,
      gender: formData.personalInfo?.gender || '',
      phone: formData.personalInfo?.phone || '',
      email: formData.personalInfo?.email || '',
      address: formData.personalInfo?.address || '',
      city: formData.personalInfo?.city || '',
      state: formData.personalInfo?.state || '',
      country: formData.personalInfo?.country || ''
    },
    mode: 'onChange' // Validate on change and submit
  })

  // Update resolver when language changes
  useEffect(() => {
    // Re-validate all fields with new schema
    trigger()
  }, [i18n.language, trigger])

  // Reset form when Redux state changes (e.g., after clearing form)
  useEffect(() => {
    const newValues = {
      firstName: formData.personalInfo?.firstName || '',
      lastName: formData.personalInfo?.lastName || '',
      nationalId: formData.personalInfo?.nationalId || '',
      dateOfBirth: formData.personalInfo?.dateOfBirth 
        ? new Date(formData.personalInfo.dateOfBirth)
        : undefined,
      gender: formData.personalInfo?.gender || '',
      phone: formData.personalInfo?.phone || '',
      email: formData.personalInfo?.email || '',
      address: formData.personalInfo?.address || '',
      city: formData.personalInfo?.city || '',
      state: formData.personalInfo?.state || '',
      country: formData.personalInfo?.country || ''
    }
    reset(newValues)
  }, [formData.personalInfo, reset])

  const onSubmit = (data: PersonalInfoFormDataWithDate) => {
    // Convert Date object to ISO string for Redux storage
    const dataForRedux: PersonalInfoFormData = {
      ...data,
      dateOfBirth: data.dateOfBirth.toISOString()
    }
    
    dispatch(updatePersonalInfo(dataForRedux))
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h1 className={cn("text-3xl font-bold text-gray-900 mb-2", isRTL && "text-right")}>
          {t('financial-assistance.steps.personalInfo')}
        </h1>
        <p className={cn("text-gray-600 mb-6", isRTL && "text-right")}>
          {t('financial-assistance.form.subtitle')}
        </p>
        <div className={cn("w-24 h-1 bg-[#C2B89C] rounded-full mb-6", isRTL && "ml-auto")}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <FormField 
          label={t('financial-assistance.form.firstName')} 
          required 
          error={errors.firstName?.message}
          touched={!!touchedFields.firstName}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                placeholder={t('financial-assistance.form.placeholders.firstName')}
                className="w-full"
              />
            )}
          />
        </FormField>
        
        <FormField 
          label={t('financial-assistance.form.lastName')} 
          required 
          error={errors.lastName?.message}
          touched={!!touchedFields.lastName}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                placeholder={t('financial-assistance.form.placeholders.lastName')}
                className="w-full"
              />
            )}
          />
        </FormField>

        {/* National ID */}
        <FormField 
          label={t('financial-assistance.form.nationalId')} 
          required 
          error={errors.nationalId?.message}
          touched={!!touchedFields.nationalId}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="nationalId"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                placeholder={t('financial-assistance.form.placeholders.nationalId')}
                className="w-full"
              />
            )}
          />
        </FormField>

        {/* Date of Birth */}
        <FormField 
          label={t('financial-assistance.form.dateOfBirth')} 
          required 
          error={errors.dateOfBirth?.message}
          touched={!!touchedFields.dateOfBirth}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker 
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={t('financial-assistance.form.placeholders.dateOfBirth')}
                className="w-full"
              />
            )}
          />
        </FormField>

        {/* Gender */}
        <FormField 
          label={t('financial-assistance.form.gender')} 
          required 
          error={errors.gender?.message}
          touched={!!touchedFields.gender}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                data-testid="gender-select"
              >
                <SelectTrigger className="w-full" onBlur={field.onBlur} data-testid="gender-select-trigger">
                  <SelectValue placeholder={t('financial-assistance.form.select.gender')} />
                </SelectTrigger>
                <SelectContent data-testid="gender-select-content">
                  <SelectItem value="male" data-testid="gender-option-male">{t('financial-assistance.form.genders.male')}</SelectItem>
                  <SelectItem value="female" data-testid="gender-option-female">{t('financial-assistance.form.genders.female')}</SelectItem>
                  <SelectItem value="other" data-testid="gender-option-other">{t('financial-assistance.form.genders.other')}</SelectItem>
                  <SelectItem value="prefer-not-to-say" data-testid="gender-option-prefer-not-to-say">{t('financial-assistance.form.genders.preferNotToSay')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Phone */}
        <FormField 
          label={t('financial-assistance.form.phone')} 
          required 
          error={errors.phone?.message}
          touched={!!touchedFields.phone}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                type="tel" 
                placeholder={t('financial-assistance.form.placeholders.phone')}
                className="w-full"
              />
            )}
          />
        </FormField>

        {/* Email */}
        <FormField 
          label={t('financial-assistance.form.email')} 
          required 
          error={errors.email?.message}
          touched={!!touchedFields.email}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                type="email" 
                placeholder={t('financial-assistance.form.placeholders.email')}
                className="w-full"
              />
            )}
          />
        </FormField>

        {/* Address */}
        <FormField 
          label={t('financial-assistance.form.address')} 
          required 
          error={errors.address?.message}
          touched={!!touchedFields.address}
          isSubmitted={isSubmitted}
          className="w-full md:col-span-2"
        >
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Textarea 
                {...field}
                placeholder={t('financial-assistance.form.placeholders.address')} 
                rows={3}
                className="w-full"
              />
            )}
          />
        </FormField>

        {/* City */}
        <FormField 
          label={t('financial-assistance.form.city')} 
          required 
          error={errors.city?.message}
          touched={!!touchedFields.city}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                placeholder={t('financial-assistance.form.placeholders.city')}
                className="w-full"
              />
            )}
          />
        </FormField>

        {/* State */}
        <FormField 
          label={t('financial-assistance.form.state')} 
          required 
          error={errors.state?.message}
          touched={!!touchedFields.state}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                placeholder={t('financial-assistance.form.placeholders.state')}
                className="w-full"
              />
            )}
          />
        </FormField>

        {/* Country */}
        <FormField 
          label={t('financial-assistance.form.country')} 
          required 
          error={errors.country?.message}
          touched={!!touchedFields.country}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                data-testid="country-select"
              >
                <SelectTrigger className="w-full" onBlur={field.onBlur} data-testid="country-select-trigger">
                  <SelectValue placeholder={t('financial-assistance.form.select.country')} />
                </SelectTrigger>
                <SelectContent data-testid="country-select-content">
                  <SelectItem value="AE" data-testid="country-option-ae">{t('financial-assistance.form.countries.AE')}</SelectItem>
                  <SelectItem value="SA" data-testid="country-option-sa">{t('financial-assistance.form.countries.SA')}</SelectItem>
                  <SelectItem value="KW" data-testid="country-option-kw">{t('financial-assistance.form.countries.KW')}</SelectItem>
                  <SelectItem value="QA" data-testid="country-option-qa">{t('financial-assistance.form.countries.QA')}</SelectItem>
                  <SelectItem value="BH" data-testid="country-option-bh">{t('financial-assistance.form.countries.BH')}</SelectItem>
                  <SelectItem value="OM" data-testid="country-option-om">{t('financial-assistance.form.countries.OM')}</SelectItem>
                  <SelectItem value="other" data-testid="country-option-other">{t('financial-assistance.form.countries.other')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white px-8 flex items-center space-x-2"
        >
          <span>{isSubmitting ? t('common.loading') : t('financial-assistance.navigation.continue')}</span>
          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </form>
  )
}
