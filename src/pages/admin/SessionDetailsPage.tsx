import { ADMIN_ROUTE_PATHS } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { useParams } from 'react-router-dom'
import { sessionsMock, trainingsMock } from '../manager/manager.mock'
import styles from '../manager/ManagerPages.module.scss'

export const SessionDetailsPage = () => {
    const { id } = useParams<{ id: string }>()

    const session = sessionsMock.find((s) => s.id === id)
    const training = trainingsMock.find((t) => t.id === session?.trainingId)

    if (!session) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={ADMIN_ROUTE_PATHS.sessions} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>Session not found</h1>
                        <p className={styles.managerPage__subtitle}>The requested session is unavailable.</p>
                    </div>
                </header>
            </section>
        )
    }

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={ADMIN_ROUTE_PATHS.sessions} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Session Details</h1>
                    <p className={styles.managerPage__subtitle}>
                        {training?.title ?? 'Training'} in {session.city}
                    </p>
                </div>
            </header>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{training?.title}</h2>

                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>City</p>
                        <p className={styles.managerPage__infoValue}>{session.city}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Start Date</p>
                        <p className={styles.managerPage__infoValue}>{session.startDate}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>End Date</p>
                        <p className={styles.managerPage__infoValue}>{session.endDate}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Capacity</p>
                        <p className={styles.managerPage__infoValue}>{session.capacity}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
