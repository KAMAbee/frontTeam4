import { useParams } from 'react-router-dom'
import { sessionsMock, trainingsMock } from '../manager/manager.mock'
import styles from '../manager/ManagerPages.module.scss'

export const SessionDetailsPage = () => {
    const { id } = useParams()

    const session = sessionsMock.find((s) => s.id === id)
    const training = trainingsMock.find((t) => t.id === session?.trainingId)

    if (!session) {
        return <p>Session not found</p>
    }

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Session Details</h1>
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