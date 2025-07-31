"use client"

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import * as  Collapsible  from '@radix-ui/react-collapsible';
import { Apple, Boxes, ChevronDown, ChevronLeft, Menu, Ruler, Utensils } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useState } from 'react';
import { motion } from "motion/react";
import Link from 'next/link';

type RouteGroupType = {
  group: string;
  items: {
    href: string;
    label: string;
    icon: ReactNode;
  }[];
};

const ROUTE_GROUPS: RouteGroupType[] = [
  {
    group: "Foods Management",
    items: [
      {
        href: "/admin/foods-management/foods",
        label: "Foods",
        icon: <Apple className="mr-2 size-3" />,
      },
      {
        href: "/admin/foods-management/categories",
        label: "Categories",
        icon: <Boxes className="mr-2 size-3" />,
      },
      {
        href: "/admin/foods-management/serving-units",
        label: "Serving Units",
        icon: <Ruler className="mr-2 size-3" />,
      },
    ],
  },
  {
    group: "Meals Management",
    items: [
      {
        href: "/client",
        label: "Meals",
        icon: <Utensils className="mr-2 size-3" />,
      },
    ],
  },
];

type RouteGroupProps = RouteGroupType

const RouteGroup = ({ group, items }: RouteGroupProps) => {
  
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Button 
          className='text-foreground/80 flex justify-between w-full font-normal'
          variant="ghost"  
        >
          {group}
          <div className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
            <ChevronDown className='ml-2 text-foreground/80 w-4 h-4' />
          </div>
        </Button>
      </Collapsible.Trigger>

      <Collapsible.Content forceMount>
        <motion.div
          className={`flex flex-col gap-2 ${!open ? "pointer-events-none" : ""}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {items.map((item) => (
            <Button
              className='w-full justify-start font-normal'
              variant="link"
              asChild
              key={item.href}
            >
              <Link 
                href={item.href} 
                className={`flex items-center rounded-md px-5 py-1 transition-all
                  ${pathname === item.href
                    ? "bg-background/10 hover:bg-foreground/5"
                    : "hover:bg-foreground/10"  
                  }  
                `}
                >
                  {item.icon}
                  <span className='text-sm'>{item.label}</span>
              </Link>
            </Button>
          ))}
        </motion.div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}


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
        <Collapsible.Content forceMount>
          <div className={
            `bg-background fixed top-0 left-0 h-screen w-64 border p-4 transition-transform duration-300
            ${open ? 'translate-x-0' : '-translate-x-full'}
            `
          }>
            <div className='flex items-center justify-between'>
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

            <Separator className='my-2' />
            
            <div className='mt-4'>
              {ROUTE_GROUPS.map((routeGroup) => (
                <RouteGroup 
                  {...routeGroup}
                  key={routeGroup.group}
                />
              ))}
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      <main className={`transition-margin mt-13 flex-1 p-4 duration-300 ${open ? 'ml-64' : 'ml-0'}`}>
        {children}
      </main>
    </div>
  )
}

export default Dashboardlayout