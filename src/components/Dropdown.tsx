'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import React from 'react'

type DropdownItem = {
  label: string
  icon?: React.ReactNode
  classNames?: string
  variant?: 'default' | 'destructive'
  onSelect?: () => void
  separator?: boolean
}

const Dropdown = ({
  triggerContent,
  triggerClassName,
  items,
}: {
  triggerContent: React.ReactNode
  triggerClassName?: string
  items: DropdownItem[]
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(triggerClassName)} aria-label="Actions">
          {triggerContent}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 mt-5 ml-8"
        side="bottom"
        align="end"
        alignOffset={-16}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <DropdownMenuItem
              onSelect={item.onSelect}
              data-variant={item.variant}
              className={item.classNames}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
            {item.separator && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Dropdown
