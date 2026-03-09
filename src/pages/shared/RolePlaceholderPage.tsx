import { useTranslation } from 'react-i18next'
import type { UserRole } from '../../types'
import styles from './SharedPages.module.scss'

interface RolePlaceholderPageProps {
    role: UserRole
}

export const RolePlaceholderPage = ({ role }: RolePlaceholderPageProps) => {
    const { t } = useTranslation()

    return (
        <section className={styles.sharedPage}>
            <h1 className={styles.sharedPage__title}>
                {t('shared.rolePlaceholder.title', { role: t(`topbar.roles.${role}`) })}
            </h1>
            <p className={styles.sharedPage__description}>
                {t('shared.rolePlaceholder.description')}
            </p>
        </section>
    )
}
