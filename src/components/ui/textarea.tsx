import * as React from "react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  
  return (
    <textarea
      data-slot="textarea"
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        "border-gray-300 placeholder:text-gray-400 focus-visible:border-[#C2B89C] focus-visible:ring-[#C2B89C]/30 focus-visible:ring-1 focus-visible:shadow-sm focus-visible:shadow-[#C2B89C]/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        isRTL && "text-right",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
