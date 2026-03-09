import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchMyEnrollments } from '../../api'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import styles from '../manager/ManagerPages.module.scss'

export const MyLearningPage = () => {
    const { t } = useTranslation()
    const { data: enrollments, isLoading, error } = useAsyncData(fetchMyEnrollments, [], [])

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{t('employee.myLearning.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('employee.myLearning.subtitle')}</p>
                </div>
            </header>

            {isLoading && <p className={styles.managerPage__metaText}>{t('employee.myLearning.loading')}</p>}
            {error && (
                <p className={styles.managerPage__metaText}>
                    {t('ui.error.withMessage', { error })}
                </p>
            )}

            {enrollments.length === 0 && !isLoading ? (
                <p className={styles.managerPage__emptyState}>{t('employee.myLearning.empty')}</p>
            ) : null}

            <div className={styles.managerPage__cardGrid}>
                {enrollments.map((enrollment) => (
                    <Link
                        key={enrollment.id}
                        to={`/employee/learning/${enrollment.id}`}
                        className={styles.managerPage__card}
                    >
                        <h2 className={styles.managerPage__cardTitle}>{enrollment.trainingTitle}</h2>
                        <p className={styles.managerPage__cardMeta}>
                            {t('employee.myLearning.card.dates')}:{' '}
                            <DateTimeRangeBadge
                                startValue={enrollment.startDate}
                                endValue={enrollment.endDate}
                            />
                        </p>
                        <p className={styles.managerPage__cardMeta}>
                            {t('employee.myLearning.card.place')}:{' '}
                            {enrollment.city || enrollment.location
                                ? [enrollment.city, enrollment.location].filter(Boolean).join(' | ')
                                : t('ui.na')}
                        </p>
                        <p className={styles.managerPage__cardMeta}>
                            {t('employee.myLearning.card.status')}:{' '}
                            {enrollment.isAttended
                                ? t('employee.learningDetails.attendance.attended')
                                : t('employee.learningDetails.attendance.planned')}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    )
}
