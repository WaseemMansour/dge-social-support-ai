import { type ReactNode } from "react"
import { Stepper } from "./Stepper"
import { SupportResources } from "./SupportResources"

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
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-[#C2B89C]/20 p-4 md:p-8">
                  {children}
                </div>
              </div>
              
              {/* Support Resources Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <SupportResources />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
