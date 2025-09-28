"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = "Pick a date",
  disabled = false,
  className
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date)
    setOpen(false) // Close the popover when a date is selected
    onBlur?.() // Trigger onBlur when date is selected
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start font-normal border-gray-300 hover:bg-transparent hover:text-current focus:ring-1 focus:ring-[#C2B89C]/30 focus:border-[#C2B89C] focus:shadow-sm focus:shadow-[#C2B89C]/20",
            isRTL ? "text-right" : "text-left",
            !value && "text-gray-400",
            className
          )}
          disabled={disabled}
          onBlur={onBlur}
        >
          <CalendarIcon className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={isRTL ? "end" : "start"}>
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
