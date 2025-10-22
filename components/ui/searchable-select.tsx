"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SearchableSelectProps {
  options: Array<{ id: number | string; name?: string; title?: string; first_name?: string; last_name?: string }>
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  maxVisibleItems?: number
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
  maxVisibleItems = 3,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const getDisplayName = (option: any) => {
    if (option.first_name && option.last_name) {
      return `${option.first_name} ${option.last_name}`
    }
    return option.name || option.title || String(option.id)
  }

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options.slice(0, maxVisibleItems)
    
    return options.filter((option) => {
      const displayName = getDisplayName(option).toLowerCase()
      return displayName.includes(searchQuery.toLowerCase())
    })
  }, [options, searchQuery, maxVisibleItems])

  const selectedOption = options.find((option) => String(option.id) === value)
  const displayValue = selectedOption ? getDisplayName(selectedOption) : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          
          
          aria-expanded={open}
          className={cn("w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}
        >
          <span className="truncate">{displayValue}</span>
          
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={String(option.id)}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === String(option.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {getDisplayName(option)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
