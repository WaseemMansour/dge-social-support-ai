import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', name: 'English', initial: 'E' },
  { code: 'ar', name: 'العربية', initial: 'ع' }
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleLanguageChange = () => {
    const currentIndex = languages.findIndex(lang => lang.code === i18n.language)
    const nextIndex = (currentIndex + 1) % languages.length
    i18n.changeLanguage(languages[nextIndex].code)
  }

  const nextLanguage = languages.find(lang => lang.code !== i18n.language) || languages[1]

  return (
    <button 
      onClick={handleLanguageChange}
      className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-200 cursor-pointer"
      title={`Switch to ${nextLanguage.name}`}
    >
      <Globe className="w-4 h-4" />
      <span>{nextLanguage.name}</span>
    </button>
  )
}
