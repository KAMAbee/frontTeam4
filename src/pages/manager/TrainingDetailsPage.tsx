import { Link, useParams } from 'react-router-dom'
import { MANAGER_ROUTE_PATHS, managerRouteLinks } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { PRICING_TYPE_LABELS, sessionsMock, trainingsMock } from './manager.mock'
import styles from './ManagerPages.module.scss'

export const TrainingDetailsPage = () => {
    const { id } = useParams<{ id: string }>()

    const training = trainingsMock.find((item) => item.id === id)
    const trainingSessions = sessionsMock.filter((session) => session.trainingId === id)

    if (!training) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={MANAGER_ROUTE_PATHS.trainings} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>Training not found</h1>
                        <p className={styles.managerPage__subtitle}>The requested training does not exist.</p>
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
                    <h1 className={styles.managerPage__title}>{training.title}</h1>
                    <p className={styles.managerPage__subtitle}>Training details and upcoming sessions.</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>Training Info</h2>
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Type</p>
                        <p className={styles.managerPage__infoValue}>{training.type}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Pricing Model</p>
                        <p className={styles.managerPage__infoValue}>{PRICING_TYPE_LABELS[training.pricingType]}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Base Price</p>
                        <p className={styles.managerPage__infoValue}>{training.price} USD</p>
                    </div>
                </div>
            </article>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__sectionTitle}>Sessions</h2>
                <ul className={styles.managerPage__list}>
                    {trainingSessions.map((session) => (
                        <li key={session.id}>
                            <span>
                                {session.city} | {session.startDate} - {session.endDate} | Capacity:{' '}
                                {session.capacity}{' '}
                            </span>
                            <Link
                                className={styles.managerPage__inlineLink}
                                to={managerRouteLinks.sessionDetails(session.id)}
                            >
                                Open session
                            </Link>
                        </li>
                    ))}
                </ul>
            </article>
        </section>
    )
}
