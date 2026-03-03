import { Link, useParams } from 'react-router-dom'
import { MANAGER_ROUTE_PATHS, managerRouteLinks } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { sessionsMock, trainingsMock } from './manager.mock'
import styles from './ManagerPages.module.scss'

export const SessionDetailsPage = () => {
    const { id } = useParams<{ id: string }>()

    const session = sessionsMock.find((item) => item.id === id)
    const training = trainingsMock.find((item) => item.id === session?.trainingId)

    if (!session || !training) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={MANAGER_ROUTE_PATHS.trainings} />
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
                    <BackButton fallbackTo={MANAGER_ROUTE_PATHS.trainings} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Session Details</h1>
                    <p className={styles.managerPage__subtitle}>Session context and quick request action.</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{training.title}</h2>
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Date</p>
                        <p className={styles.managerPage__infoValue}>
                            {session.startDate} - {session.endDate}
                        </p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>City</p>
                        <p className={styles.managerPage__infoValue}>{session.city}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Capacity</p>
                        <p className={styles.managerPage__infoValue}>{session.capacity}</p>
                    </div>
                </div>
            </article>

            <Link className={styles.managerPage__primaryButton} to={managerRouteLinks.createRequest(session.id)}>
                Create Request
            </Link>
        </section>
    )
}
