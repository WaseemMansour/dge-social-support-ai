import * as React from "react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  return (
    <input
      type={type}
      data-slot="input"
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-gray-300 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#C2B89C] focus-visible:ring-[#C2B89C]/30 focus-visible:ring-1 focus-visible:shadow-sm focus-visible:shadow-[#C2B89C]/20",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        isRTL && "text-right",
        className
      )}
      {...props}
    />
  )
}

export { Input }
