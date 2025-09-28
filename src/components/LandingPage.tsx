import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from '@tanstack/react-router'
import { CheckCircle, Clock, Shield, Users } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../types/navigation'

export function LandingPage() {
  const { t } = useTranslation()

  return (
      <div className="min-h-screen bg-[#C2B89C]/20">
      {/* Hero Section */}
      <section className="relative py-20 min-h-[80vh] flex items-center">
        {/* Background Image - Grayscale */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale"
          style={{
            backgroundImage: `url('/abu-dhabi-cornishe.webp')`,
            backgroundAttachment: 'fixed',
            minHeight: '100%'
          }}
        />
        
        {/* Dominant Colored Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/85 via-gray-900/80 to-gray-900/95"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
              {t('landing.hero.title')}
              <span className="block text-[#C2B89C]">{t('landing.hero.subtitle')}</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto drop-shadow-md">
              {t('landing.hero.description')}
            </p>
            <div className="flex justify-center">
              <Link to={ROUTES.FINANCIAL_ASSISTANCE}>
                <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100 hover:shadow-2xl hover:scale-105 active:scale-95 focus:ring-4 focus:ring-white/30 transition-all duration-200 px-8 py-3 shadow-xl">
                  {t('landing.hero.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-warm-beige-light"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('landing.howItWorks.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-warm-beige-medium">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C2B89C] to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('landing.howItWorks.steps.step1.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('landing.howItWorks.steps.step1.description')}
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-warm-beige-medium">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C2B89C] to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('landing.howItWorks.steps.step2.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('landing.howItWorks.steps.step2.description')}
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-warm-beige-medium">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C2B89C] to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('landing.howItWorks.steps.step3.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('landing.howItWorks.steps.step3.description')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C2B89C]/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('landing.trust.title')}</h2>
              <p className="text-xl text-gray-600">
                {t('landing.trust.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#C2B89C]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.trust.features.security.title')}</h3>
                    <p className="text-gray-600">
                      {t('landing.trust.features.security.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#C2B89C]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.trust.features.support.title')}</h3>
                    <p className="text-gray-600">
                      {t('landing.trust.features.support.description')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#C2B89C]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.trust.features.processing.title')}</h3>
                    <p className="text-gray-600">
                      {t('landing.trust.features.processing.description')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#C2B89C]/20 to-gray-100 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CheckCircle className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('landing.trust.features.confidential.title')}</h3>
                <p className="text-gray-600 text-lg">
                  {t('landing.trust.features.confidential.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {t('landing.cta.description')}
          </p>
          <Link to={ROUTES.FINANCIAL_ASSISTANCE}>
            <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100 hover:shadow-2xl hover:scale-105 active:scale-95 focus:ring-4 focus:ring-white/30 transition-all duration-200 px-8 py-3 shadow-xl">
              {t('landing.cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
