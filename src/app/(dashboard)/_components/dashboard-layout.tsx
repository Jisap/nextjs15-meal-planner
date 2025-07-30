"use client"

import { Button } from '@/components/ui/button'
import * as  Collapsible  from '@radix-ui/react-collapsible'
import { ChevronLeft, Menu } from 'lucide-react'
import React, { useState } from 'react'

type DashboardlayoutProps ={
  children: React.ReactNode
}

const Dashboardlayout = ({children}: DashboardlayoutProps) => {

  const[open, setOpen] = useState(false)

  return (
    <div className='flex'>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <Button
            size="icon"
            variant="outline"
          >
            <Menu />
          </Button>
        </Collapsible.Trigger>
      </Collapsible.Root>

      <Collapsible.Root 
        open={open} 
        onOpenChange={setOpen}
        className='fixed top-0 left-0 z-20 h-dvh'  
      >
        <Collapsible.Content>
          <div className='bg-background fixed top-0 left-0 h-screen w-64 border p-4 transition-transform duration-300 '>
            <div className='flex items-center justify-center'>
              <h1 className='font-semibold'>
                Admin Dashboard
              </h1>
              <Collapsible.Trigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                >
                  <ChevronLeft />
                </Button>
              </Collapsible.Trigger>
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      {children}
    </div>
  )
}

export default Dashboardlayout