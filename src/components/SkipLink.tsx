import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'

interface SkipLinkProps {
  href: string
  className?: string
}

export function SkipLink({ href, className }: SkipLinkProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
        "bg-[#C2B89C] text-white px-4 py-2 rounded-md font-medium",
        "focus:outline-none focus:ring-2 focus:ring-[#C2B89C] focus:ring-offset-2",
        "transition-all duration-200",
        isRTL && "focus:left-auto focus:right-4",
        className
      )}
    >
      {t('accessibility.skipToContent')}
    </a>
  )
}
