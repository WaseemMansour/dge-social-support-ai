import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { WizardLayout } from '../../components/WizardLayout'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { StepName } from '../../store/slices/formSlice'
import { saveToLocalStorage, setCurrentStep } from '../../store/slices/formSlice'
import { FamilyFinancialStep } from './steps/FamilyFinancialStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { SituationDescriptionStep } from './steps/SituationDescriptionStep'
import { SuccessScreen } from './steps/SuccessScreen'

interface FinancialAssistanceWizardProps {
  currentStep: StepName
}

export function FinancialAssistanceWizard({ currentStep }: FinancialAssistanceWizardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { formData, isDirty, hasSubmittedSuccessfully } = useAppSelector((state) => state.form)

  const steps = [
    t('financial-assistance.steps.personalInfo'),
    t('financial-assistance.steps.familyFinancial'),
    t('financial-assistance.steps.situationDescription')
  ]

  // Get current step number (1-based)
  const getCurrentStepNumber = (step: StepName): number => {
    const stepMap: Record<StepName, number> = {
      'personal-info': 1,
      'family-financial': 2,
      'situation-description': 3,
      'success': 4,
    }
    return stepMap[step]
  }

  // Update Redux state when URL step changes
  useEffect(() => {
    dispatch(setCurrentStep(currentStep))
  }, [currentStep, dispatch])

  // Auto-save to localStorage when form data changes
  useEffect(() => {
    if (isDirty) {
      dispatch(saveToLocalStorage())
    }
  }, [formData, isDirty, dispatch])

  // Navigation helpers
  const goToStep = (step: StepName) => {
    navigate({
      to: '/financial-assistance',
      search: { step }
    })
  }

  const goToNextStep = () => {
    const stepOrder: StepName[] = ['personal-info', 'family-financial', 'situation-description']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      goToStep(stepOrder[currentIndex + 1])
    }
  }

  const goToPreviousStep = () => {
    const stepOrder: StepName[] = ['personal-info', 'family-financial', 'situation-description']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      goToStep(stepOrder[currentIndex - 1])
    }
  }

  const handleSubmissionSuccess = () => {
    goToStep('success')
  }

  const handleStartNewApplication = () => {
    goToStep('personal-info')
  }

  // Render current step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal-info':
        return (
          <PersonalInfoStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            canGoNext={!!formData.personalInfo}
          />
        )
      case 'family-financial':
        return (
          <FamilyFinancialStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            canGoNext={!!formData.familyFinancial}
          />
        )
      case 'situation-description':
        return (
          <SituationDescriptionStep
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            canGoNext={!!formData.situationDescription}
            onSubmissionSuccess={handleSubmissionSuccess}
          />
        )
      case 'success':
        return (
          <SuccessScreen
            onStartNew={handleStartNewApplication}
          />
        )
      default:
        return null
    }
  }

  // Access control: Success page should only be accessible after successful submission
  if (currentStep === 'success' && !hasSubmittedSuccessfully) {
    // Redirect to first step if trying to access success page without successful submission
    goToStep('personal-info')
    return null
  }

  // Don't show stepper for success screen
  if (currentStep === 'success') {
    return renderCurrentStep()
  }

  return (
    <WizardLayout 
      currentStep={getCurrentStepNumber(currentStep)} 
      steps={steps}
    >
      {renderCurrentStep()}
    </WizardLayout>
  )
}