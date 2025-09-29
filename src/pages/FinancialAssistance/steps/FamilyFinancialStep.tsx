import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'
import { cn } from '../../../lib/utils'
import { createFamilyFinancialSchema, type FamilyFinancialFormData } from '../../../schemas/financial-assistance'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { updateFamilyFinancial } from '../../../store/slices/formSlice'

interface FamilyFinancialStepProps {
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

export function FamilyFinancialStep({ onNext, onPrevious }: FamilyFinancialStepProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const dispatch = useAppDispatch()
  const { formData } = useAppSelector((state) => state.form)

  // Create schema with current language
  const schema = useMemo(() => createFamilyFinancialSchema(t), [t])

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting, touchedFields, isSubmitted }
  } = useForm<FamilyFinancialFormData>({
    resolver: zodResolver(schema),
    defaultValues: formData.familyFinancial || {
      maritalStatus: '',
      dependents: '',
      employmentStatus: '',
      monthlyIncome: '',
      housingStatus: '',
      monthlyExpenses: '',
      employerName: '',
      jobTitle: '',
      workExperience: '',
      additionalIncome: '',
      additionalIncomeSource: ''
    },
    mode: 'onChange'
  })

  // Reset form when Redux state changes (e.g., after clearing form)
  useEffect(() => {
    const newValues = formData.familyFinancial || {
      maritalStatus: '',
      dependents: '',
      employmentStatus: '',
      monthlyIncome: '',
      housingStatus: '',
      monthlyExpenses: '',
      employerName: '',
      jobTitle: '',
      workExperience: '',
      additionalIncome: '',
      additionalIncomeSource: ''
    }
    reset(newValues)
  }, [formData.familyFinancial, reset])

  const onSubmit = (data: FamilyFinancialFormData) => {
    dispatch(updateFamilyFinancial(data))
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h1 className={cn("text-3xl font-bold text-gray-900 mb-2", isRTL && "text-right")}>
          {t('financial-assistance.steps.familyFinancial')}
        </h1>
        <p className={cn("text-gray-600 mb-6", isRTL && "text-right")}>
          {t('financial-assistance.descriptions.familyFinancial')}
        </p>
        <div className={cn("w-24 h-1 bg-[#C2B89C] rounded-full mb-6", isRTL && "ml-auto")}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marital Status */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.maritalStatus')} 
          required 
          error={errors.maritalStatus?.message}
          touched={!!touchedFields.maritalStatus}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">{t('financial-assistance.options.maritalStatus.single')}</SelectItem>
                  <SelectItem value="married">{t('financial-assistance.options.maritalStatus.married')}</SelectItem>
                  <SelectItem value="divorced">{t('financial-assistance.options.maritalStatus.divorced')}</SelectItem>
                  <SelectItem value="widowed">{t('financial-assistance.options.maritalStatus.widowed')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Housing Status */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.housingStatus')} 
          required 
          error={errors.housingStatus?.message}
          touched={!!touchedFields.housingStatus}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="housingStatus"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select housing status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owned">{t('financial-assistance.options.housingStatus.owned')}</SelectItem>
                  <SelectItem value="rented">{t('financial-assistance.options.housingStatus.rented')}</SelectItem>
                  <SelectItem value="family">{t('financial-assistance.options.housingStatus.family')}</SelectItem>
                  <SelectItem value="other">{t('financial-assistance.options.housingStatus.other')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Monthly Income */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.monthlyIncome')} 
          required 
          error={errors.monthlyIncome?.message}
          touched={!!touchedFields.monthlyIncome}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('monthlyIncome')}
            type="number"
            placeholder="Enter your monthly income"
            className="w-full"
          />
        </FormField>

        {/* Monthly Expenses */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.monthlyExpenses')} 
          required 
          error={errors.monthlyExpenses?.message}
          touched={!!touchedFields.monthlyExpenses}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('monthlyExpenses')}
            type="number"
            placeholder="Enter your monthly expenses"
            className="w-full"
          />
        </FormField>

        {/* Number of Dependents */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.dependents')} 
          required 
          error={errors.dependents?.message}
          touched={!!touchedFields.dependents}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('dependents')}
            type="number"
            placeholder="Enter number of dependents"
            className="w-full"
          />
        </FormField>

        {/* Employment Status */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.employmentStatus')} 
          required 
          error={errors.employmentStatus?.message}
          touched={!!touchedFields.employmentStatus}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="employmentStatus"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" onBlur={field.onBlur}>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">{t('financial-assistance.options.employmentStatus.employed')}</SelectItem>
                  <SelectItem value="unemployed">{t('financial-assistance.options.employmentStatus.unemployed')}</SelectItem>
                  <SelectItem value="self-employed">{t('financial-assistance.options.employmentStatus.self-employed')}</SelectItem>
                  <SelectItem value="student">{t('financial-assistance.options.employmentStatus.student')}</SelectItem>
                  <SelectItem value="retired">{t('financial-assistance.options.employmentStatus.retired')}</SelectItem>
                  <SelectItem value="other">{t('financial-assistance.options.employmentStatus.other')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Employer Name */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.employerName')} 
          required
          error={errors.employerName?.message}
          touched={!!touchedFields.employerName}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('employerName')}
            placeholder="Enter employer name"
            className="w-full"
          />
        </FormField>

        {/* Job Title */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.jobTitle')} 
          required
          error={errors.jobTitle?.message}
          touched={!!touchedFields.jobTitle}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('jobTitle')}
            placeholder="Enter your job title"
            className="w-full"
          />
        </FormField>

        {/* Work Experience */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.workExperience')} 
          required
          error={errors.workExperience?.message}
          touched={!!touchedFields.workExperience}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('workExperience')}
            type="number"
            placeholder="Enter years of experience"
            className="w-full"
          />
        </FormField>

        {/* Additional Income */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.additionalIncome')} 
          error={errors.additionalIncome?.message}
          touched={!!touchedFields.additionalIncome}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('additionalIncome')}
            type="number"
            placeholder="Enter additional income if any"
            className="w-full"
          />
        </FormField>

        {/* Additional Income Source */}
        <FormField 
          label={t('financial-assistance.familyFinancialFields.additionalIncomeSource')} 
          error={errors.additionalIncomeSource?.message}
          touched={!!touchedFields.additionalIncomeSource}
          isSubmitted={isSubmitted}
          className="w-full md:col-span-2"
        >
          <Textarea 
            {...register('additionalIncomeSource')}
            placeholder="Describe the source of additional income"
            rows={3}
            className="w-full"
          />
        </FormField>
      </div>

      <div className="flex justify-between pt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="px-8 flex items-center space-x-2 hover:bg-gray-50 hover:border-gray-400"
        >
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{t('financial-assistance.navigation.previous')}</span>
        </Button>
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
