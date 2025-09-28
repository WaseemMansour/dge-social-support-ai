import { Link } from '@tanstack/react-router'
import { FileText, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageIdentifier, ROUTES } from '../types/navigation'
import { LanguageSwitcher } from "./LanguageSwitcher"

interface HeaderProps {
  currentPage?: typeof PageIdentifier[keyof typeof PageIdentifier]
}

export function Header({ currentPage = PageIdentifier.HOME }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-cream bg-[#C2B89C] backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 py-4">
        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'justify-between'}`}>
          {/* Logo */}
          <div className="flex items-center">
          <Link to={ROUTES.HOME}>
            <img 
              src="/dge-abu-dhabi.svg" 
              alt="Department of Government Enablement" 
              className="h-20 w-auto"
            />
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Navigation Menu */}
            <nav className="flex items-center space-x-8" dir={isRTL ? 'rtl' : 'ltr'}>
              <Link 
                to={ROUTES.HOME}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-md ${
                  currentPage === PageIdentifier.HOME
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{t('header.navigation.home')}</span>
              </Link>
              <Link 
                to={ROUTES.FINANCIAL_ASSISTANCE}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-md ${
                  currentPage === PageIdentifier.FINANCIAL_ASSISTANCE
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-800 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t('header.navigation.financialAssistance')}</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}