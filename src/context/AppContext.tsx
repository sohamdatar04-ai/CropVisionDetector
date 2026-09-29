import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translate, type AppLanguage, LANGUAGE_OPTIONS } from '../i18n'

export type { AppLanguage }

interface AppContextValue {
  isOffline: boolean
  setIsOffline: (value: boolean) => void
  toggleOfflineMode: () => void
  language: AppLanguage
  setLanguage: (lang: AppLanguage) => void
  t: (keyPath: string, params?: Record<string, string | number>) => string
  languages: typeof LANGUAGE_OPTIONS
  offlineQueueCount: number
  cachedModelsCount: number
}

const STORAGE_LANG_KEY = 'krishi_saathi_language'

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine)
  
  // Initialize language from localStorage with fallback to English
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as AppLanguage
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
        return saved
      }
    } catch {
      // localStorage may fail in restricted sandbox
    }
    return 'en'
  })

  const [offlineQueueCount] = useState<number>(3)
  const [cachedModelsCount] = useState<number>(4)

  // Persist language on change
  const setLanguage = useCallback((newLang: AppLanguage) => {
    setLanguageState(newLang)
    try {
      localStorage.setItem(STORAGE_LANG_KEY, newLang)
    } catch {
      // storage fallback
    }
  }, [])

  // Translation helper bound to current language
  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>) => {
      return translate(language, keyPath, params)
    },
    [language]
  )

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const toggleOfflineMode = () => {
    setIsOffline((prev) => !prev)
  }

  return (
    <AppContext.Provider
      value={{
        isOffline,
        setIsOffline,
        toggleOfflineMode,
        language,
        setLanguage,
        t,
        languages: LANGUAGE_OPTIONS,
        offlineQueueCount,
        cachedModelsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

/**
 * Convenient standalone hook for translations
 */
export const useTranslation = () => {
  const { t, language, setLanguage, languages } = useApp()
  return { t, language, setLanguage, languages }
}
