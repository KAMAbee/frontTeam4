import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchSessions, fetchTrainings } from '../../api'
import { MANAGER_ROUTE_PATHS, managerRouteLinks } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import { PricingType } from '../../types'
import { formatMoneyKzt } from '../../utils/formatters'
import styles from './ManagerPages.module.scss'

export const TrainingDetailsPage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const { data: trainings, isLoading: isTrainingsLoading, error: trainingsError } = useAsyncData(
        fetchTrainings,
        [],
        [],
    )
    const { data: sessions, isLoading: isSessionsLoading, error: sessionsError } = useAsyncData(
        fetchSessions,
        [],
        [],
    )

    const training = trainings.find((item) => item.id === id)
    const trainingSessions = sessions.filter((session) => session.trainingId === id)

    if ((isTrainingsLoading || isSessionsLoading) && !training) {
        return <p className={styles.managerPage__metaText}>{t('manager.trainingDetails.loading')}</p>
    }

    if (!training) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={MANAGER_ROUTE_PATHS.trainings} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('manager.trainingDetails.notFoundTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('manager.trainingDetails.notFoundSubtitle')}</p>
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
                    <p className={styles.managerPage__subtitle}>{t('manager.trainingDetails.subtitle')}</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('manager.trainingDetails.infoTitle')}</h2>
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('manager.trainingDetails.fields.type')}</p>
                        <p className={styles.managerPage__infoValue}>{training.type}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('manager.trainingDetails.fields.pricing')}</p>
                        <p className={styles.managerPage__infoValue}>
                            {t(`labels.pricingType.${training.pricingType as PricingType}`)}
                        </p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('manager.trainingDetails.fields.basePrice')}</p>
                        <p className={styles.managerPage__infoValue}>
                            {formatMoneyKzt(training.price)}
                        </p>
                    </div>
                </div>
            </article>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__sectionTitle}>{t('manager.trainingDetails.sessionsTitle')}</h2>
                {(isTrainingsLoading || isSessionsLoading) && (
                    <p className={styles.managerPage__metaText}>{t('manager.trainingDetails.loadingSessions')}</p>
                )}
                {(trainingsError || sessionsError) && (
                    <p className={styles.managerPage__metaText}>
                        {t('ui.error.withMessage', { error: trainingsError || sessionsError })}
                    </p>
                )}
                {trainingSessions.length === 0 ? (
                    <p className={styles.managerPage__emptyState}>{t('manager.trainingDetails.sessionsEmpty')}</p>
                ) : (
                    <ul className={styles.managerPage__list}>
                        {trainingSessions.map((session) => (
                            <li key={session.id} className={styles.managerPage__listItem}>
                                <span>
                                    {session.city} |{' '}
                                    <DateTimeRangeBadge startValue={session.startDate} endValue={session.endDate} /> |{' '}
                                    {t('manager.trainingDetails.fields.capacity')}: {session.capacity}
                                </span>{' '}
                                <Link
                                    className={styles.managerPage__inlineLink}
                                    to={managerRouteLinks.sessionDetails(session.id)}
                                >
                                    {t('manager.trainingDetails.openSession')}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </article>
        </section>
    )
}
