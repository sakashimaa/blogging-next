'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const style = {
    ['--sidebar-width' as any]: '15rem',
    ['--sidebar-width-mobile' as any]: '15rem',
  } as React.CSSProperties
  return (
    <SidebarProvider style={style}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="pt-14 mb-3">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
