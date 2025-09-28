import { Helmet } from '@dr.pogodin/react-helmet'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { LandingPage } from '../pages/LandingPage'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { t } = useTranslation()
  
  return (
    <>
      <Helmet>
        <title>{t('meta.landing.title')}</title>
        <meta name="description" content={t('meta.landing.description')} />
        <meta name="keywords" content={t('meta.landing.keywords')} />
        <meta property="og:title" content={t('meta.landing.title')} />
        <meta property="og:description" content={t('meta.landing.description')} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta.landing.title')} />
        <meta name="twitter:description" content={t('meta.landing.description')} />
      </Helmet>
      <LandingPage />
    </>
  )
}
