import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/button'
import { DatePicker } from '../../../components/ui/date-picker'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'
import { cn } from '../../../lib/utils'
import { createPersonalInfoSchema, type PersonalInfoFormData } from '../../../schemas/financial-assistance'
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
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  // Show error if field is touched OR form has been submitted
  const shouldShowError = error && (touched || isSubmitted)
  
  return (
    <div className={cn("space-y-1", className)}>
      <Label className={cn("text-sm font-medium text-gray-700", isRTL && "text-right")}>
        {label}
        {required && <span className={cn("text-red-500", isRTL ? "mr-1" : "ml-1")}>*</span>}
      </Label>
      {children}
      {shouldShowError && (
        <p className={cn("text-sm text-red-600 mt-0.5", isRTL && "text-right")}>{error}</p>
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
  const schema = useMemo(() => createPersonalInfoSchema(t), [t])

  // React Hook Form setup
  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting, touchedFields, isSubmitted }
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: formData.personalInfo?.firstName || '',
      lastName: formData.personalInfo?.lastName || '',
      nationalId: formData.personalInfo?.nationalId || '',
      dateOfBirth: formData.personalInfo?.dateOfBirth 
        ? (formData.personalInfo.dateOfBirth instanceof Date 
            ? formData.personalInfo.dateOfBirth 
            : new Date(formData.personalInfo.dateOfBirth))
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

  const onSubmit = (data: PersonalInfoFormData) => {
    dispatch(updatePersonalInfo(data))
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
              >
                <SelectTrigger className="w-full" onBlur={field.onBlur}>
                  <SelectValue placeholder={t('financial-assistance.form.select.gender')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('financial-assistance.form.genders.male')}</SelectItem>
                  <SelectItem value="female">{t('financial-assistance.form.genders.female')}</SelectItem>
                  <SelectItem value="other">{t('financial-assistance.form.genders.other')}</SelectItem>
                  <SelectItem value="prefer-not-to-say">{t('financial-assistance.form.genders.preferNotToSay')}</SelectItem>
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
              >
                <SelectTrigger className="w-full" onBlur={field.onBlur}>
                  <SelectValue placeholder={t('financial-assistance.form.select.country')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AE">{t('financial-assistance.form.countries.AE')}</SelectItem>
                  <SelectItem value="SA">{t('financial-assistance.form.countries.SA')}</SelectItem>
                  <SelectItem value="KW">{t('financial-assistance.form.countries.KW')}</SelectItem>
                  <SelectItem value="QA">{t('financial-assistance.form.countries.QA')}</SelectItem>
                  <SelectItem value="BH">{t('financial-assistance.form.countries.BH')}</SelectItem>
                  <SelectItem value="OM">{t('financial-assistance.form.countries.OM')}</SelectItem>
                  <SelectItem value="other">{t('financial-assistance.form.countries.other')}</SelectItem>
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
          <span>{isSubmitting ? 'Processing...' : 'Continue to Next Step'}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
