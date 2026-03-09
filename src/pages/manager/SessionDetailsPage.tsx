import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchSessions, fetchTrainings } from '../../api'
import { MANAGER_ROUTE_PATHS, managerRouteLinks } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import styles from './ManagerPages.module.scss'

export const SessionDetailsPage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const { data: sessions, isLoading: isSessionsLoading, error: sessionsError } = useAsyncData(
        fetchSessions,
        [],
        [],
    )
    const { data: trainings, isLoading: isTrainingsLoading, error: trainingsError } = useAsyncData(
        fetchTrainings,
        [],
        [],
    )

    const session = sessions.find((item) => item.id === id)
    const training = trainings.find((item) => item.id === session?.trainingId)

    if ((isSessionsLoading || isTrainingsLoading) && (!session || !training)) {
        return <p className={styles.managerPage__metaText}>{t('manager.sessionDetails.loading')}</p>
    }

    if (!session || !training) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={MANAGER_ROUTE_PATHS.trainings} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('manager.sessionDetails.notFoundTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('manager.sessionDetails.notFoundSubtitle')}</p>
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
                    <h1 className={styles.managerPage__title}>{t('manager.sessionDetails.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('manager.sessionDetails.subtitle')}</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{training.title}</h2>
                {(isSessionsLoading || isTrainingsLoading) && (
                    <p className={styles.managerPage__metaText}>{t('manager.sessionDetails.loading')}</p>
                )}
                {(sessionsError || trainingsError) && (
                    <p className={styles.managerPage__metaText}>
                        {t('ui.error.withMessage', { error: sessionsError || trainingsError })}
                    </p>
                )}
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('manager.sessionDetails.fields.date')}</p>
                        <p className={styles.managerPage__infoValue}>
                            <DateTimeRangeBadge startValue={session.startDate} endValue={session.endDate} />
                        </p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('manager.sessionDetails.fields.city')}</p>
                        <p className={styles.managerPage__infoValue}>{session.city}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            {t('manager.sessionDetails.fields.capacity')}
                        </p>
                        <p className={styles.managerPage__infoValue}>{session.capacity}</p>
                    </div>
                </div>
            </article>

            <Link className={styles.managerPage__primaryButton} to={managerRouteLinks.createRequest(session.id)}>
                {t('manager.sessionDetails.createRequest')}
            </Link>
        </section>
    )
}
