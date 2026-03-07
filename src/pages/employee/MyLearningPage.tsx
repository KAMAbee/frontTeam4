import { sessionsMock, trainingsMock } from '../manager/manager.mock'
import styles from '../manager/ManagerPages.module.scss'

export const MyLearningPage = () => {
    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>My Learning</h1>
                    <p className={styles.managerPage__subtitle}>
                        Your assigned training sessions
                    </p>
                </div>
            </header>

            <div className={styles.managerPage__cardGrid}>
                {sessionsMock.map((session) => {
                    const training = trainingsMock.find(
                        (t) => t.id === session.trainingId,
                    )

                    return (
                        <div key={session.id} className={styles.managerPage__card}>
                            <h2 className={styles.managerPage__cardTitle}>
                                {training?.title}
                            </h2>
                            <p className={styles.managerPage__cardMeta}>
                                City: {session.city}
                            </p>
                            <p className={styles.managerPage__cardMeta}>
                                Dates: {session.startDate} – {session.endDate}
                            </p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}