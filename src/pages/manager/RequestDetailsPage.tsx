import { useParams } from 'react-router-dom'
import { MANAGER_ROUTE_PATHS } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { REQUEST_STATUS_LABELS, employeeOptions, requestsMock, sessionsMock, trainingsMock } from './manager.mock'
import styles from './ManagerPages.module.scss'

export const RequestDetailsPage = () => {
    const { id } = useParams<{ id: string }>()

    const request = requestsMock.find((item) => item.id === id)

    if (!request) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={MANAGER_ROUTE_PATHS.requests} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>Request not found</h1>
                        <p className={styles.managerPage__subtitle}>The requested item could not be found.</p>
                    </div>
                </header>
            </section>
        )
    }

    const session = sessionsMock.find((item) => item.id === request.sessionId)
    const training = trainingsMock.find((item) => item.id === session?.trainingId)
    const selectedEmployees = employeeOptions.filter((employee) => request.employees.includes(employee.id))

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={MANAGER_ROUTE_PATHS.requests} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Request {request.id}</h1>
                    <p className={styles.managerPage__subtitle}>Request details and selected participants.</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>Request Info</h2>
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Training</p>
                        <p className={styles.managerPage__infoValue}>{training?.title ?? 'N/A'}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Session</p>
                        <p className={styles.managerPage__infoValue}>
                            {session
                                ? `${session.city} | ${session.startDate} - ${session.endDate}`
                                : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Status</p>
                        <p className={styles.managerPage__infoValue}>{REQUEST_STATUS_LABELS[request.status]}</p>
                    </div>
                </div>
            </article>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__sectionTitle}>Employees</h2>
                <ul className={styles.managerPage__list}>
                    {selectedEmployees.map((employee) => (
                        <li key={employee.id}>
                            {employee.fullName} ({employee.department})
                        </li>
                    ))}
                </ul>
            </article>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__sectionTitle}>Comment</h2>
                <p className={styles.managerPage__metaText}>{request.comment || 'No comment provided.'}</p>
            </article>
        </section>
    )
}
