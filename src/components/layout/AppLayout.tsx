import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { MobileNav } from './MobileNav'
import { OfflineBanner } from './OfflineBanner'

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Offline Alert Strip */}
      <OfflineBanner />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
