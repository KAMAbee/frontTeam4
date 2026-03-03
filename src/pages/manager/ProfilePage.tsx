import { useAuth } from '../../hooks/useAuth'
import styles from './ManagerPages.module.scss'

export const ProfilePage = () => {
    const { user } = useAuth()

    if (!user) {
        return (
            <section className={styles.managerPage}>
                <header className={styles.managerPage__header}>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>Profile unavailable</h1>
                        <p className={styles.managerPage__subtitle}>User data is missing in current session.</p>
                    </div>
                </header>
            </section>
        )
    }

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Profile</h1>
                    <p className={styles.managerPage__subtitle}>Read-only manager profile information.</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>First Name</p>
                        <p className={styles.managerPage__infoValue}>{user.firstName}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Last Name</p>
                        <p className={styles.managerPage__infoValue}>{user.lastName}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Role</p>
                        <p className={styles.managerPage__infoValue}>{user.role}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Department</p>
                        <p className={styles.managerPage__infoValue}>{user.department}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>User ID</p>
                        <p className={styles.managerPage__infoValue}>{user.id}</p>
                    </div>
                </div>
            </article>
        </section>
    )
}
