import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AIAssistance } from '../../../components/AIAssistance'
import { Button } from '../../../components/ui/button'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { normalizeApiError } from '../../../lib/api-error'
import { cn } from '../../../lib/utils'
import { createSituationDescriptionSchema, type SituationDescriptionFormData } from '../../../schemas/financial-assistance'
import { useSubmitApplicationMutation } from '../../../store/api/financialAssistanceApi'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { markSubmissionSuccess, updateSituationDescription, type FinancialAssistanceFormData } from '../../../store/slices/formSlice'

interface SituationDescriptionStepProps {
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  onSubmissionSuccess: () => void
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

export function SituationDescriptionStep({ onPrevious, onSubmissionSuccess }: SituationDescriptionStepProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const dispatch = useAppDispatch()
  const { formData } = useAppSelector((state) => state.form)
  const [submitApplication, { isLoading: isSubmitting, error: submitError }] = useSubmitApplicationMutation()

  // Create schema with current language
  const schema = useMemo(() => createSituationDescriptionSchema(t), [t])

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting, touchedFields, isSubmitted }
  } = useForm<SituationDescriptionFormData>({
    resolver: zodResolver(schema),
    defaultValues: formData.situationDescription || {
      currentFinancialSituation: '',
      employmentCircumstances: '',
      reasonForApplying: '',      
    },
    mode: 'onChange'
  })

  // Helper function to get current situation description data with defaults
  const getCurrentSituationData = (): SituationDescriptionFormData => {
    const currentData = formData.situationDescription
    return {
      currentFinancialSituation: currentData?.currentFinancialSituation || '',
      employmentCircumstances: currentData?.employmentCircumstances || '',
      reasonForApplying: currentData?.reasonForApplying || '',
      previousAssistance: currentData?.previousAssistance || '',
      documents: currentData?.documents || [],
      additionalInfo: currentData?.additionalInfo || ''
    }
  }

  // Reset form when Redux state changes (e.g., after clearing form)
  useEffect(() => {
    const newValues = getCurrentSituationData()
    reset(newValues)
  }, [formData.situationDescription, reset])

  const onSubmit = async (data: FinancialAssistanceFormData['situationDescription']) => {
    dispatch(updateSituationDescription(data))
    
    // Prepare complete form data for submission
    const completeFormData: FinancialAssistanceFormData = {
      personalInfo: formData.personalInfo!,
      familyFinancial: formData.familyFinancial!,
      situationDescription: data,
      aiGeneratedContent: formData.aiGeneratedContent || {
        currentFinancialSituation: '',
        employmentCircumstances: '',
        reasonForApplying: ''
      }
    }

    try {
      const result = await submitApplication(completeFormData).unwrap()
      console.log('Application submitted successfully:', result)
      // Mark submission as successful
      dispatch(markSubmissionSuccess())
      // Navigate to success screen
      onSubmissionSuccess()
    } catch (error) {
      console.error('Failed to submit application:', error)
      // Error is already handled by RTK Query
    }
  }

  const isSubmittingForm = isSubmitting || isFormSubmitting

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h1 className={cn("text-3xl font-bold text-gray-900 mb-2", isRTL && "text-right")}>
          {t('financial-assistance.steps.situationDescription')}
        </h1>
        <p className={cn("text-gray-600 mb-6", isRTL && "text-right")}>
          {t('financial-assistance.descriptions.situationDescription')}
        </p>
        <div className={cn("w-24 h-1 bg-[#C2B89C] rounded-full mb-6", isRTL && "ml-auto")}></div>
      </div>

      <div className="space-y-6">
        {/* Current Financial Situation */}
        <div className="space-y-3">
          <FormField 
            label={t('financial-assistance.situationFields.currentFinancialSituation')} 
            required 
            error={errors.currentFinancialSituation?.message}
            touched={!!touchedFields.currentFinancialSituation}
            isSubmitted={isSubmitted}
            className="w-full"
          >
            <Textarea 
              {...register('currentFinancialSituation')}
              placeholder={t('financial-assistance.situationFields.placeholders.currentFinancialSituation')}
              rows={4}
              className="w-full"
            />
          </FormField>
          <div className="flex justify-end">
            <AIAssistance
              fieldName="currentFinancialSituation"
              onAccept={(content) => {
                setValue('currentFinancialSituation', content)
                // Also update the Redux store to keep form data in sync
                const currentData = getCurrentSituationData()
                dispatch(updateSituationDescription({
                  ...currentData,
                  currentFinancialSituation: content
                }))
              }}
              onEdit={(content) => {
                setValue('currentFinancialSituation', content)
                // Also update the Redux store to keep form data in sync
                const currentData = getCurrentSituationData()
                dispatch(updateSituationDescription({
                  ...currentData,
                  currentFinancialSituation: content
                }))
              }}
              onDisregard={() => {}}
              formData={formData}
            />
          </div>
        </div>

        {/* Employment Circumstances */}
        <div className="space-y-3">
          <FormField 
            label={t('financial-assistance.situationFields.employmentCircumstances')} 
            required 
            error={errors.employmentCircumstances?.message}
            touched={!!touchedFields.employmentCircumstances}
            isSubmitted={isSubmitted}
            className="w-full"
          >
            <Textarea 
              {...register('employmentCircumstances')}
              placeholder={t('financial-assistance.situationFields.placeholders.employmentCircumstances')}
              rows={4}
              className="w-full"
            />
          </FormField>
          <div className="flex justify-end">
            <AIAssistance
              fieldName="employmentCircumstances"
              onAccept={(content) => {
                setValue('employmentCircumstances', content)
                // Also update the Redux store to keep form data in sync
                const currentData = getCurrentSituationData()
                dispatch(updateSituationDescription({
                  ...currentData,
                  employmentCircumstances: content
                }))
              }}
              onEdit={(content) => {
                setValue('employmentCircumstances', content)
                // Also update the Redux store to keep form data in sync
                const currentData = getCurrentSituationData()
                dispatch(updateSituationDescription({
                  ...currentData,
                  employmentCircumstances: content
                }))
              }}
              onDisregard={() => {}}
              formData={formData}
            />
          </div>
        </div>

        {/* Reason for Applying */}
        <div className="space-y-3">
          <FormField 
            label={t('financial-assistance.situationFields.reasonForApplying')} 
            required 
            error={errors.reasonForApplying?.message}
            touched={!!touchedFields.reasonForApplying}
            isSubmitted={isSubmitted}
            className="w-full"
          >
            <Textarea 
              {...register('reasonForApplying')}
              placeholder={t('financial-assistance.situationFields.placeholders.reasonForApplying')}
              rows={4}
              className="w-full"
            />
          </FormField>
          <div className="flex justify-end">
            <AIAssistance
              fieldName="reasonForApplying"
              onAccept={(content) => {
                setValue('reasonForApplying', content)
                // Also update the Redux store to keep form data in sync
                const currentData = getCurrentSituationData()
                dispatch(updateSituationDescription({
                  ...currentData,
                  reasonForApplying: content
                }))
              }}
              onEdit={(content) => {
                setValue('reasonForApplying', content)
                // Also update the Redux store to keep form data in sync
                const currentData = getCurrentSituationData()
                dispatch(updateSituationDescription({
                  ...currentData,
                  reasonForApplying: content
                }))
              }}
              onDisregard={() => {}}
              formData={formData}
            />
          </div>
        </div>
        
      </div>

      {/* Error Display */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">
            {(() => {
              const normalized = normalizeApiError(submitError as unknown)
              return normalized.message
            })()}
          </p>
        </div>
      )}

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
          disabled={isSubmittingForm}
          className="bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white px-8"
        >
          {isSubmittingForm ? t('financial-assistance.buttons.submittingApplication') : t('financial-assistance.buttons.submitApplication')}
        </Button>
      </div>
    </form>
  )
}
