import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  LayoutDashboard,
  Scan,
  MapPin,
  Bot,
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useApp } from '../../context/AppContext'

export const MobileNav: React.FC = () => {
  const { t } = useApp()
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-2xl lg:hidden safe-area-inset-bottom">
      <div className="grid grid-cols-5 items-center h-18 max-w-lg mx-auto px-2">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center py-1 transition-colors min-h-[52px]',
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Home
                className={cn(
                  'w-5 h-5 transition-transform',
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                )}
              />
              <span className="text-[11px] mt-1">{t('nav.home')}</span>
            </>
          )}
        </NavLink>

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center py-1 transition-colors min-h-[52px]',
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            )
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard
                className={cn(
                  'w-5 h-5 transition-transform',
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                )}
              />
              <span className="text-[11px] mt-1">{t('nav.dashboard')}</span>
            </>
          )}
        </NavLink>

        {/* Center Floating Field Scan Button */}
        <div className="flex justify-center -mt-6">
          <NavLink
            to="/analyze"
            aria-label={t('nav.analyze')}
            className={({ isActive }) =>
              cn(
                'w-14 h-14 rounded-full flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-700/30 transition-transform active:scale-95 border-4 border-white',
                isActive
                  ? 'bg-emerald-700 ring-2 ring-emerald-500 ring-offset-2'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              )
            }
          >
            <Scan className="w-6 h-6 stroke-[2.5]" />
          </NavLink>
        </div>

        {/* Fields */}
        <NavLink
          to="/fields"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center py-1 transition-colors min-h-[52px]',
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            )
          }
        >
          {({ isActive }) => (
            <>
              <MapPin
                className={cn(
                  'w-5 h-5 transition-transform',
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                )}
              />
              <span className="text-[11px] mt-1">{t('nav.fields')}</span>
            </>
          )}
        </NavLink>

        {/* AI Advisor */}
        <NavLink
          to="/assistant"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center py-1 transition-colors min-h-[52px]',
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            )
          }
        >
          {({ isActive }) => (
            <>
              <Bot
                className={cn(
                  'w-5 h-5 transition-transform',
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                )}
              />
              <span className="text-[11px] mt-1">{t('nav.assistant')}</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
