/**
 * Krishi Saathi AI - Lightweight Translation Utility
 *
 * Provides type-safe i18n lookup with nested key support (e.g. 'dashboard.greeting'),
 * template variable interpolation (e.g. {crop}), fallback to English,
 * and zero external translation dependencies.
 */
import { en, type TranslationSchema } from './en'
import { hi } from './hi'
import { mr } from './mr'

export type AppLanguage = 'en' | 'hi' | 'mr'

export const translations: Record<AppLanguage, TranslationSchema> = {
  en,
  hi,
  mr,
}

export const LANGUAGE_OPTIONS: { code: AppLanguage; label: string; nativeName: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
]

/**
 * Resolves a nested key string (e.g. 'dashboard.greeting') for a given language.
 * Falls back to English if the key is missing in the target language.
 */
export function translate(
  lang: AppLanguage,
  keyPath: string,
  params?: Record<string, string | number>
): string {
  const keys = keyPath.split('.')
  
  // Try current language
  let current: any = translations[lang] || translations.en
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k]
    } else {
      current = undefined
      break
    }
  }

  // Fallback to English if not found
  if (current === undefined || typeof current !== 'string') {
    let fallback: any = translations.en
    for (const k of keys) {
      if (fallback && typeof fallback === 'object' && k in fallback) {
        fallback = fallback[k]
      } else {
        fallback = undefined
        break
      }
    }
    current = typeof fallback === 'string' ? fallback : keyPath
  }

  // Interpolate variables e.g. {crop}
  if (params && typeof current === 'string') {
    let result = current
    for (const [paramKey, paramVal] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal))
    }
    return result
  }

  return current
}

export { en, hi, mr }
export type { TranslationSchema }
