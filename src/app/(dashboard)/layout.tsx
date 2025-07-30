import React from 'react'
import Dashboardlayout from './_components/dashboard-layout'

type LayoutProps ={
  children: React.ReactNode
}

const Layout = ({children}: LayoutProps) => {
  return (
    <Dashboardlayout>
      {children}
    </Dashboardlayout>
  )
}

export default Layout