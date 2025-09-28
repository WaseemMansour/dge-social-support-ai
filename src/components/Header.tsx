import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from "./LanguageSwitcher"

interface HeaderProps {
  currentPage?: "landing" | "wizard"
}

export function Header({ currentPage = "landing" }: HeaderProps) {
  const { t } = useTranslation()
  return (
    <header className="w-full border-b border-gray-300 bg-[#C2B89C]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/dge-abu-dhabi.svg" 
              alt="Department of Government Enablement" 
              className="h-20 w-auto"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            {currentPage === "landing" ? (
              <Button className="bg-gray-800 hover:bg-gray-900 text-white">
                {t('header.actions.startApplication')}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}