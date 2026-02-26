'use client'

import { Sidebar } from '@/components/soc/sidebar'
import { TopBar } from '@/components/soc/topbar'
import { Toaster } from '@/components/ui/toaster'

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <TopBar />
          <main className="px-6 py-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
