import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/common.json'
import kk from './locales/kk/common.json'
import ru from './locales/ru/common.json'

export const supportedLanguages = ['ru', 'en', 'kk'] as const
export type AppLanguage = (typeof supportedLanguages)[number]
export const languageStorageKey = 'app-language'

function normalizeLanguage(language: string | undefined): AppLanguage {
    if (language === 'en') return 'en'
    if (language === 'kk') return 'kk'
    return 'ru'
}

function getInitialLanguage(): AppLanguage {
    if (typeof window === 'undefined') {
        return 'ru'
    }

    const storedLanguage = window.localStorage.getItem(languageStorageKey)
    return normalizeLanguage(storedLanguage ?? undefined)
}

void i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        ru: { translation: ru },
        kk: { translation: kk },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'ru',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
})

document.documentElement.lang = normalizeLanguage(i18n.resolvedLanguage)
i18n.on('languageChanged', (language) => {
    document.documentElement.lang = normalizeLanguage(language)
})

export default i18n
