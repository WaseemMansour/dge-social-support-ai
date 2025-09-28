import { type ReactNode } from "react"
import { Stepper } from "./Stepper"

interface WizardLayoutProps {
  currentStep: number
  steps: string[]
  children: ReactNode
  illustration?: ReactNode
}

export function WizardLayout({ 
  currentStep, 
  steps, 
  children
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#C2B89C]/10">
      {/* Stepper */}
      <Stepper currentStep={currentStep} steps={steps} />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          {/* Centered Form Content */}
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-[#C2B89C]/20 p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
