import React from 'react'
import Dashboardlayout from './_components/dashboard-layout'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

type LayoutProps ={
  children: React.ReactNode
}

const Layout = async ({children}: LayoutProps) => {

  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <Dashboardlayout session={session}>
      {children}
    </Dashboardlayout>
  )
}

export default Layout