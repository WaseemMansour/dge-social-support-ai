import { Button } from '@/components/ui/button'
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
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLanguageChange}
      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 h-9 font-sans"
      title={`Switch to ${nextLanguage.name}`}
    >
      <Globe className="w-4 h-4 mr-2" />
      <span className="text-sm font-medium">{nextLanguage.name}</span>
    </Button>
  )
}
