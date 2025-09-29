import { Link } from '@tanstack/react-router'
import { FileText, Home, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageIdentifier, ROUTES } from '../types/navigation'
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Button } from './ui/button'

interface HeaderProps {
  currentPage?: typeof PageIdentifier[keyof typeof PageIdentifier]
}

export function Header({ currentPage = PageIdentifier.HOME }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-cream bg-[#C2B89C] backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 py-4">
        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'justify-between'}`}>
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} onClick={closeMobileMenu}>
              <img 
                src="/dge-abu-dhabi.svg" 
                alt="Department of Government Enablement" 
                className="h-20 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation Menu */}
            <nav className="flex items-center space-x-8" dir={isRTL ? 'rtl' : 'ltr'}>
              <Link 
                to={ROUTES.HOME}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-md ${
                  currentPage === PageIdentifier.HOME
                    ? 'bg-gradient-to-br from-[#C2B89C] to-gray-700 text-white shadow-lg'
                    : 'text-gray-800 hover:bg-gradient-to-br hover:from-[#C2B89C] hover:to-gray-700 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{t('header.navigation.home')}</span>
              </Link>
              <Link 
                to={ROUTES.FINANCIAL_ASSISTANCE}
                search={{ step: 'personal-info' }}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-md ${
                  currentPage === PageIdentifier.FINANCIAL_ASSISTANCE
                    ? 'bg-gradient-to-br from-[#C2B89C] to-gray-700 text-white shadow-lg'
                    : 'text-gray-800 hover:bg-gradient-to-br hover:from-[#C2B89C] hover:to-gray-700 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t('header.navigation.financialAssistance')}</span>
              </Link>
            </nav>
          </div>

          {/* Desktop Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-gray-800 hover:bg-[#C2B89C]/20"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#C2B89C]/30">
            <nav className="flex flex-col space-y-2 pt-4" dir={isRTL ? 'rtl' : 'ltr'}>
              <Link 
                to={ROUTES.HOME}
                onClick={closeMobileMenu}
                className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-md ${
                  currentPage === PageIdentifier.HOME
                    ? 'bg-gradient-to-br from-[#C2B89C] to-gray-700 text-white shadow-lg'
                    : 'text-gray-800 hover:bg-gradient-to-br hover:from-[#C2B89C] hover:to-gray-700 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{t('header.navigation.home')}</span>
              </Link>
              <Link 
                to={ROUTES.FINANCIAL_ASSISTANCE}
                search={{ step: 'personal-info' }}
                onClick={closeMobileMenu}
                className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center space-x-2 rounded-md ${
                  currentPage === PageIdentifier.FINANCIAL_ASSISTANCE
                    ? 'bg-gradient-to-br from-[#C2B89C] to-gray-700 text-white shadow-lg'
                    : 'text-gray-800 hover:bg-gradient-to-br hover:from-[#C2B89C] hover:to-gray-700 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t('header.navigation.financialAssistance')}</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}