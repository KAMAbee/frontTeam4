import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react'
import i18n, { languageStorageKey, type AppLanguage } from '../i18n'
import { LanguageContext, languageOrder, normalizeLanguage } from './language-context'

export function LanguageProvider({ children }: PropsWithChildren) {
    const [language, setLanguageState] = useState<AppLanguage>(() =>
        normalizeLanguage(i18n.resolvedLanguage),
    )

    useEffect(() => {
        const handleLanguageChange = (nextLanguage: string) => {
            setLanguageState(normalizeLanguage(nextLanguage))
        }

        i18n.on('languageChanged', handleLanguageChange)
        return () => {
            i18n.off('languageChanged', handleLanguageChange)
        }
    }, [])

    const setLanguage = useCallback(async (nextLanguage: AppLanguage) => {
        await i18n.changeLanguage(nextLanguage)

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(languageStorageKey, nextLanguage)
        }
    }, [])

    const toggleLanguage = useCallback(async () => {
        const currentIndex = languageOrder.indexOf(language)
        const nextLanguage = languageOrder[(currentIndex + 1) % languageOrder.length]
        await setLanguage(nextLanguage)
    }, [language, setLanguage])

    const value = useMemo(
        () => ({ language, setLanguage, toggleLanguage }),
        [language, setLanguage, toggleLanguage],
    )

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
