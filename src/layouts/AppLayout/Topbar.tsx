import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PUBLIC_ROUTE_PATHS } from '../../app/routePaths'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../types'
import styles from './Topbar.module.scss'

const roleBadgeStyles: Record<UserRole, string> = {
    [UserRole.MANAGER]: styles.roleBadgeManager,
    [UserRole.EMPLOYEE]: styles.roleBadgeEmployee,
    [UserRole.ADMIN]: styles.roleBadgeAdmin,
}

export const Topbar = () => {
    const { t } = useTranslation()
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    if (!user) {
        return null
    }

    const fullName = `${user.firstName} ${user.lastName}`
    const roleLabel = t(`topbar.roles.${user.role}`)
    const roleBadgeClass = `${styles.roleBadge} ${roleBadgeStyles[user.role]}`

    const handleLogout = () => {
        logout()
        navigate(PUBLIC_ROUTE_PATHS.login, { replace: true })
    }

    return (
        <header className={styles.wrapper}>
            <div>
                <p className={styles.userName}>{fullName}</p>
                <p className={styles.department}>{user.department}</p>
            </div>

            <div className={styles.actions}>
                <span className={roleBadgeClass}>{roleLabel}</span>
                <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                    {t('topbar.logout')}
                </button>
            </div>
        </header>
    )
}
