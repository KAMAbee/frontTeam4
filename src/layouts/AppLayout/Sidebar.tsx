import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'
import { ROLE_NAVIGATION } from './navigation'
import styles from './Sidebar.module.scss'

export const Sidebar = () => {
    const { user } = useAuth()
    const { t } = useTranslation()

    if (!user) {
        return null
    }

    const navItems = ROLE_NAVIGATION[user.role]

    return (
        <div className={styles.wrapper}>
            <div className={styles.topRow}>
                <div>
                    <div className={styles.brand}>{t('sidebar.brand')}</div>
                    <p className={styles.roleLabel}>
                        {t('sidebar.workspace')}: {t(`sidebar.roles.${user.role}`)}
                    </p>
                </div>
                <LanguageSwitcher />
            </div>

            <nav className={styles.nav} aria-label={t('sidebar.navAria')}>
                {navItems.length > 0 ? (
                    navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                            }
                        >
                            {t(`sidebar.navLabels.${item.labelKey}`)}
                        </NavLink>
                    ))
                ) : (
                    <span className={styles.emptyMessage}>{t('sidebar.emptyMessage')}</span>
                )}
            </nav>
        </div>
    )
}
