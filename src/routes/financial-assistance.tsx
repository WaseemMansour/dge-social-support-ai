import { Helmet } from '@dr.pogodin/react-helmet'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { FinancialAssistanceWizard } from '@/pages/FinancialAssistance'
import type { StepName } from '../store/slices/formSlice'

export const Route = createFileRoute('/financial-assistance')({
  component: FinancialAssistancePage,
  validateSearch: (search: Record<string, unknown>) => {
    const step = search.step as string
    const validSteps: StepName[] = ['personal-info', 'family-financial', 'situation-description', 'success']
    
    if (step && !validSteps.includes(step as StepName)) {
      throw redirect({
        to: '/financial-assistance',
        search: { step: 'personal-info' }
      })
    }
    
    return {
      step: (step as StepName) || 'personal-info'
    }
  },
})

function FinancialAssistancePage() {
  const { t } = useTranslation()
  const { step } = Route.useSearch()

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
      <FinancialAssistanceWizard currentStep={step} />
    </>
  )
}
