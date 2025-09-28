import { Button } from "@/components/ui/button"
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageIdentifier, ROUTES } from '../types/navigation'
import { LanguageSwitcher } from "./LanguageSwitcher"

interface HeaderProps {
  currentPage?: typeof PageIdentifier[keyof typeof PageIdentifier]
}

export function Header({ currentPage = PageIdentifier.HOME }: HeaderProps) {
  const { t } = useTranslation()
  return (
    <header className="w-full border-b border-gray-300 bg-[#C2B89C]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            {currentPage === "home" ? (
              <Link to={ROUTES.FINANCIAL_ASSISTANCE}>
                <Button className="bg-gray-800 hover:bg-gray-900 text-white">
                  {t('header.actions.startApplication')}
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}