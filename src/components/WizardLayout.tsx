import { type ReactNode } from "react"
import { SkipLink } from "./SkipLink"
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
      {/* Skip Link */}
      <SkipLink href="#main-content" />
      
      {/* Stepper */}
      <Stepper currentStep={currentStep} steps={steps} />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 gap-6">
              {/* Form Content */}
              <main 
                id="main-content"
                className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-[#C2B89C]/20 p-4 md:p-8"
                role="main"
                aria-label="Application form"
              >
                {children}
              </main>

              {/* Support Resources Under Form */}
              <div>
                <SupportResources />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
