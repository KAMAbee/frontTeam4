import { createContext } from 'react'
import type { AppLanguage } from '../i18n'

export type LanguageContextValue = {
    language: AppLanguage
    setLanguage: (language: AppLanguage) => Promise<void>
    toggleLanguage: () => Promise<void>
}

export const languageOrder: AppLanguage[] = ['ru', 'en', 'kk']

export function normalizeLanguage(language: string | undefined): AppLanguage {
    if (language === 'en') return 'en'
    if (language === 'kk') return 'kk'
    return 'ru'
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)
