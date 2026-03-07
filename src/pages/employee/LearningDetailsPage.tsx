import { useParams } from 'react-router-dom'
import { sessionsMock, trainingsMock } from '../manager/manager.mock'
import styles from '../manager/ManagerPages.module.scss'

export const LearningDetailsPage = () => {
    const { id } = useParams()

    const session = sessionsMock.find((s) => s.id === id)
    const training = trainingsMock.find((t) => t.id === session?.trainingId)

    if (!session) {
        return <p>Learning session not found</p>
    }

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{training?.title}</h1>
                </div>
            </header>

            <div className={styles.managerPage__infoBlock}>
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>City</p>
                        <p className={styles.managerPage__infoValue}>{session.city}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Dates</p>
                        <p className={styles.managerPage__infoValue}>
                            {session.startDate} – {session.endDate}
                        </p>
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