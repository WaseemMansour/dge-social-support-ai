import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"

interface StepperProps {
  currentStep: number
  steps: string[]
  className?: string
}

export function Stepper({ currentStep, steps, className }: StepperProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  // Convert numbers to Arabic numerals for RTL
  const getStepNumber = (num: number) => {
    if (isRTL) {
      const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
      return num.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('')
    }
    return num.toString()
  }
  return (
    <div 
      className={cn("w-full py-4 md:py-6", className)} 
      dir={isRTL ? 'rtl' : 'ltr'}
      role="navigation"
      aria-label={t('accessibility.formProgress')}
    >
      <div className="container mx-auto px-4">
        {/* Desktop Stepper */}
        <div className="hidden md:flex items-center justify-center">
          <ol className={cn("flex items-center", isRTL ? "space-x-reverse space-x-4" : "space-x-4")} role="list">
            {steps.map((step, index) => {
              const stepNumber = index + 1
              const isCompleted = stepNumber < currentStep
              const isCurrent = stepNumber === currentStep
              const isUpcoming = stepNumber > currentStep

              return (
                <li key={step} className="flex items-center" role="listitem">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm",
                        {
                          "bg-gradient-to-br from-[#C2B89C] to-gray-700 text-white shadow-lg": isCompleted || isCurrent,
                          "bg-white text-gray-600 border border-gray-200": isUpcoming,
                        }
                      )}
                      aria-label={`${t('accessibility.step')} ${stepNumber}: ${step}`}
                      role="img"
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <span className="text-sm font-medium" aria-hidden="true">{getStepNumber(stepNumber)}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "mt-2 text-sm font-medium transition-colors duration-200",
                        {
                          "text-[#C2B89C]": isCompleted || isCurrent,
                          "text-gray-400": isUpcoming,
                        }
                      )}
                      aria-label={`${step} - ${isCompleted ? t('accessibility.completed') : isCurrent ? t('accessibility.current') : t('accessibility.upcoming')}`}
                    >
                      {step}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-16 h-0.5 mx-4 transition-colors duration-200",
                        {
                          "bg-[#C2B89C]": stepNumber < currentStep,
                          "bg-gray-300": stepNumber >= currentStep,
                        }
                      )}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        {/* Mobile Stepper */}
        <div className="md:hidden">
          <ol className="space-y-4" role="list">
            {steps.map((step, index) => {
              const stepNumber = index + 1
              const isCompleted = stepNumber < currentStep
              const isCurrent = stepNumber === currentStep
              const isUpcoming = stepNumber > currentStep

              return (
                <li key={step} className="relative" role="listitem">
                  <div className={cn("flex items-center", isRTL ? "space-x-reverse space-x-4" : "space-x-4")}>
                    {/* Step Circle */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0",
                        {
                          "bg-gradient-to-br from-[#C2B89C] to-gray-700 text-white shadow-lg": isCompleted || isCurrent,
                          "bg-white text-gray-600 border border-gray-200": isUpcoming,
                        }
                      )}
                      aria-label={`${t('accessibility.step')} ${stepNumber}: ${step}`}
                      role="img"
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <span className="text-sm font-medium" aria-hidden="true">{getStepNumber(stepNumber)}</span>
                      )}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1">
                      <div
                        className={cn(
                          "text-sm font-medium transition-colors duration-200",
                          isRTL && "text-right",
                          {
                            "text-[#C2B89C]": isCompleted || isCurrent,
                            "text-gray-400": isUpcoming,
                          }
                        )}
                        aria-label={`${step} - ${isCompleted ? t('accessibility.completed') : isCurrent ? t('accessibility.current') : t('accessibility.upcoming')}`}
                      >
                        {step}
                      </div>
                      {isCurrent && (
                        <div className={cn("text-xs text-gray-500 mt-1", isRTL && "text-right")}>
                          {t('common.currentStep')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Line */}
                  {index < steps.length - 1 && (
                    <div 
                      className={cn(
                        "absolute w-0.5 h-8 bg-gray-200",
                        isRTL ? "right-5 top-10" : "left-5 top-10"
                      )}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
