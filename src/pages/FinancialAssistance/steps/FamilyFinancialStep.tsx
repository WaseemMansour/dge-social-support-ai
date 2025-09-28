import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'
import { cn } from '../../../lib/utils'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { updateFamilyFinancial, type FinancialAssistanceFormData } from '../../../store/slices/formSlice'

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

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting, touchedFields, isSubmitted }
  } = useForm<FinancialAssistanceFormData['familyFinancial']>({
    defaultValues: formData.familyFinancial || {
      monthlyIncome: '',
      monthlyExpenses: '',
      dependents: '',
      employmentStatus: '',
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
      monthlyIncome: '',
      monthlyExpenses: '',
      dependents: '',
      employmentStatus: '',
      employerName: '',
      jobTitle: '',
      workExperience: '',
      additionalIncome: '',
      additionalIncomeSource: ''
    }
    reset(newValues)
  }, [formData.familyFinancial, reset])

  const onSubmit = (data: FinancialAssistanceFormData['familyFinancial']) => {
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
          Please provide information about your financial situation and family circumstances.
        </p>
        <div className={cn("w-24 h-1 bg-[#C2B89C] rounded-full mb-6", isRTL && "ml-auto")}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Income */}
        <FormField 
          label="Monthly Income (AED)" 
          required 
          error={errors.monthlyIncome?.message}
          touched={!!touchedFields.monthlyIncome}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('monthlyIncome', { required: 'Monthly income is required' })}
            type="number"
            placeholder="Enter your monthly income"
            className="w-full"
          />
        </FormField>

        {/* Monthly Expenses */}
        <FormField 
          label="Monthly Expenses (AED)" 
          required 
          error={errors.monthlyExpenses?.message}
          touched={!!touchedFields.monthlyExpenses}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('monthlyExpenses', { required: 'Monthly expenses is required' })}
            type="number"
            placeholder="Enter your monthly expenses"
            className="w-full"
          />
        </FormField>

        {/* Number of Dependents */}
        <FormField 
          label="Number of Dependents" 
          required 
          error={errors.dependents?.message}
          touched={!!touchedFields.dependents}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Input 
            {...register('dependents', { required: 'Number of dependents is required' })}
            type="number"
            placeholder="Enter number of dependents"
            className="w-full"
          />
        </FormField>

        {/* Employment Status */}
        <FormField 
          label="Employment Status" 
          required 
          error={errors.employmentStatus?.message}
          touched={!!touchedFields.employmentStatus}
          isSubmitted={isSubmitted}
          className="w-full"
        >
          <Controller
            name="employmentStatus"
            control={control}
            rules={{ required: 'Employment status is required' }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" onBlur={field.onBlur}>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Employer Name */}
        <FormField 
          label="Employer Name" 
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
          label="Job Title" 
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
          label="Work Experience (Years)" 
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
          label="Additional Income (AED)" 
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
          label="Additional Income Source" 
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
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
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
