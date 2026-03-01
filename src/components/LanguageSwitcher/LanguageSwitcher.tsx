import { FiChevronDown } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'
import type { AppLanguage } from '../../i18n'
import styles from './LanguageSwitcher.module.scss'

const languages: { value: AppLanguage; label: string }[] = [
    { value: 'ru', label: 'RU' },
    { value: 'en', label: 'EN' },
    { value: 'kk', label: 'KZ' },
]

export const LanguageSwitcher = () => {
    const { t } = useTranslation()
    const { language, setLanguage } = useLanguage()

    return (
        <div className={styles.wrapper}>
            <select
                className={styles.select}
                value={language}
                onChange={(e) => {
                    setLanguage(e.target.value as AppLanguage)
                }}

                aria-label={t('ui.languageSwitcher.aria')}
            >
                {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                        {lang.label}
                    </option>
                ))}
            </select>
            <FiChevronDown
                className={styles.arrow}
                aria-hidden
            />
        </div>
    )
}
