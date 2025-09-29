import { Clock, HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface SupportResourcesProps {
  className?: string
}

export function SupportResources({ className }: SupportResourcesProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <Card className={cn("w-full bg-gradient-to-br from-[#C2B89C]/5 to-[#C2B89C]/10 border-[#C2B89C]/20", className)}>
      <CardHeader className="text-center">
        <CardTitle className={cn("text-xl font-semibold text-gray-800", isRTL && "text-right")}>
          {t('financial-assistance.support.title')}
        </CardTitle>
        <CardDescription className={cn("text-gray-600", isRTL && "text-right")}>
          {t('financial-assistance.support.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cn("flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm", isRTL && "space-x-reverse")}>
            <Phone className="w-5 h-5 text-[#C2B89C] flex-shrink-0" />
            <div className={cn("flex-1", isRTL && "text-right")}>
              <p className="text-sm font-medium text-gray-800">
                {t('financial-assistance.support.resources.helpline')}
              </p>
              <p className="text-xs text-gray-600">
                {t('financial-assistance.support.contact.phone')}
              </p>
            </div>
          </div>

          <div className={cn("flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm", isRTL && "space-x-reverse")}>
            <Mail className="w-5 h-5 text-[#C2B89C] flex-shrink-0" />
            <div className={cn("flex-1", isRTL && "text-right")}>
              <p className="text-sm font-medium text-gray-800">
                {t('financial-assistance.support.resources.chat')}
              </p>
              <p className="text-xs text-gray-600">
                {t('financial-assistance.support.contact.email')}
              </p>
            </div>
          </div>
        </div>

        {/* Support Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full justify-start border-[#C2B89C]/30 hover:bg-[#C2B89C]/10"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {t('financial-assistance.support.resources.faq')}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-[#C2B89C]/30 hover:bg-[#C2B89C]/10"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t('financial-assistance.support.resources.guidance')}
          </Button>
        </div>

        {/* Availability */}
        <div className={cn("flex items-center justify-center space-x-2 text-sm text-gray-600", isRTL && "space-x-reverse")}>
          <Clock className="w-4 h-4" />
          <span>{t('financial-assistance.support.contact.hours')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
