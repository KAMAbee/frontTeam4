import type { UserRole } from '../../types'
import styles from './SharedPages.module.scss'

interface RolePlaceholderPageProps {
    role: UserRole
}

export const RolePlaceholderPage = ({ role }: RolePlaceholderPageProps) => {
    return (
        <section className={styles.sharedPage}>
            <h1 className={styles.sharedPage__title}>{role} area is not implemented yet</h1>
            <p className={styles.sharedPage__description}>
                This route is reserved for future role-specific dashboard expansion.
            </p>
        </section>
    )
}
