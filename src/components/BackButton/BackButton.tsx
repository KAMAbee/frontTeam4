import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from './BackButton.module.scss'

interface BackButtonProps {
    fallbackTo: string
    label?: string
    className?: string
}

export const BackButton = ({
    fallbackTo,
    label,
    className,
}: BackButtonProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const displayLabel = label ?? t('ui.back')

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1)
            return
        }

        navigate(fallbackTo, { replace: true })
    }

    return (
        <button
            type="button"
            onClick={handleBack}
            className={className ? `${styles.button} ${className}` : styles.button}
            aria-label={displayLabel}
        >
            <span className={styles.arrow} aria-hidden>
                ←
            </span>
            {displayLabel}
        </button>
    )
}
