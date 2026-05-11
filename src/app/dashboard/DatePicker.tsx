"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function DatePicker({ value }: { value: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const selected = parseISO(value)

  function handleSelect(day: Date | undefined) {
    if (!day) return
    const params = new URLSearchParams()
    params.set("date", format(day, "yyyy-MM-dd"))
    router.push(`${pathname}?${params.toString()}`)
    router.refresh()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="size-4" />
          {format(selected, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selected} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
}
