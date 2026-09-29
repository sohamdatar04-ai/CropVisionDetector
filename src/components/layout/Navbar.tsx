import React, { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  Sprout,
  Scan,
  LayoutDashboard,
  MapPin,
  History,
  Bot,
  CloudSun,
  HardDriveDownload,
  Settings,
  Wifi,
  WifiOff,
  Menu,
  X,
  Languages,
} from 'lucide-react'
import { useApp, type AppLanguage } from '../../context/AppContext'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'

export const Navbar: React.FC = () => {
  const { isOffline, toggleOfflineMode, language, setLanguage, t } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Sprout },
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/analyze', label: t('nav.analyze'), icon: Scan, isSpecial: true },
    { to: '/fields', label: t('nav.fields'), icon: MapPin },
    { to: '/history', label: t('nav.history'), icon: History },
    { to: '/assistant', label: t('nav.assistant'), icon: Bot },
    { to: '/weather', label: t('nav.weather'), icon: CloudSun },
    { to: '/offline', label: t('nav.offline'), icon: HardDriveDownload },
  ]

  const languages: { code: AppLanguage; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900">
                  Krishi Saathi
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 tracking-wider">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium tracking-tight -mt-0.5 hidden xs:inline">
                {t('common.appTagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70',
                    item.isSpecial &&
                      'bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white font-semibold shadow-xs'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      isActive && !item.isSpecial
                        ? 'text-emerald-600'
                        : item.isSpecial
                        ? 'text-white'
                        : 'text-slate-400'
                    )}
                  />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online / Offline Simulator Toggle */}
            <button
              onClick={toggleOfflineMode}
              title={isOffline ? 'Switch to Online Mode' : 'Switch to Offline Edge Mode'}
              className="focus:outline-hidden"
            >
              <Badge
                variant={isOffline ? 'offline' : 'success'}
                size="sm"
                withDot
                className="cursor-pointer hover:opacity-90 transition-opacity py-1 px-2.5 rounded-lg border font-medium"
              >
                {isOffline ? (
                  <span className="flex items-center gap-1">
                    <WifiOff className="w-3 h-3 text-stone-600" />
                    <span>{t('common.offline')}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-emerald-600" />
                    <span>{t('common.online')}</span>
                  </span>
                )}
              </Badge>
            </button>

            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <span className="pl-1.5 pr-1 text-slate-400">
                <Languages className="w-3.5 h-3.5" />
              </span>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    'px-1.5 py-0.5 rounded-md transition-all text-[11px]',
                    language === lang.code
                      ? 'bg-white text-emerald-800 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Settings Link */}
            <Link
              to="/settings"
              className={cn(
                'p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors',
                location.pathname === '/settings' && 'text-emerald-700 bg-emerald-50'
              )}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/98 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50',
                    item.isSpecial &&
                      'col-span-2 bg-emerald-600 text-white font-semibold justify-center hover:bg-emerald-700'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      item.isSpecial
                        ? 'text-white'
                        : isActive
                        ? 'text-emerald-600'
                        : 'text-slate-400'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Edge AI Engine: Ready (On-device)</span>
            <span className="text-emerald-700 font-semibold">v0.1.0-alpha</span>
          </div>
        </div>
      )}
    </header>
  )
}
