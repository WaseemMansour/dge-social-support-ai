import { Helmet } from '@dr.pogodin/react-helmet'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { WizardLayout } from '../components/WizardLayout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export const Route = createFileRoute('/financial-assistance')({
  component: FinancialAssistancePage,
})

function FinancialAssistancePage() {
  const { t } = useTranslation()
  const steps = [
    t('financial-assistance.steps.personalInfo'),
    t('financial-assistance.steps.familyFinancial'),
    t('financial-assistance.steps.situationDescription')
  ]
  const currentStep = 1
  

  return (
    <>
      <Helmet>
        <title>{t('meta.financialAssistance.title')}</title>
        <meta name="description" content={t('meta.financialAssistance.description')} />
        <meta name="keywords" content={t('meta.financialAssistance.keywords')} />
        <meta property="og:title" content={t('meta.financialAssistance.title')} />
        <meta property="og:description" content={t('meta.financialAssistance.description')} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta.financialAssistance.title')} />
        <meta name="twitter:description" content={t('meta.financialAssistance.description')} />
      </Helmet>
      <WizardLayout currentStep={currentStep} steps={steps}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('financial-assistance.title')}
          </h1>
          <div className="w-24 h-1 bg-[#C2B89C] rounded-full mb-6"></div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#C2B89C] rounded-full"></div>
            <span className="text-gray-700">{t('financial-assistance.benefits.exclusive')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#C2B89C] rounded-full"></div>
            <span className="text-gray-700">{t('financial-assistance.benefits.experts')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#C2B89C] rounded-full"></div>
            <span className="text-gray-700">{t('financial-assistance.benefits.service')}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" placeholder="Enter your first name" />
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" placeholder="Enter your last name" />
          </div>
          
          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Retype password *</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-6">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-gray-800 hover:underline">Privacy Policy</a>{" "}
          and{" "}
          <a href="#" className="text-gray-800 hover:underline">Terms of Use</a>.
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-[#C2B89C] hover:bg-[#C2B89C]/90 text-white flex-1">
            SIGN UP
          </Button>
          <Button variant="outline" className="border-[#C2B89C] text-[#C2B89C] hover:bg-[#C2B89C]/10 flex-1">
            ADD DETAILS
          </Button>
        </div>

        <div className="text-sm text-gray-500 text-center">
          * You can skip next steps and add personal data later
        </div>

        <div className="text-center text-sm text-gray-600">
          Already a member?{" "}
          <a href="#" className="text-gray-800 hover:underline">Log in</a>.
        </div>
      </div>
      </WizardLayout>
    </>
  )
}
