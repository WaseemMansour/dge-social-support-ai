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
  children, 
  illustration 
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#C2B89C]/10">
      {/* Stepper */}
      <Stepper currentStep={currentStep} steps={steps} />
      
      
    </div>
  )
}
