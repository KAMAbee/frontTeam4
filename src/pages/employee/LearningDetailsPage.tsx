import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchMyEnrollments } from '../../api'
import { API_BASE_URL } from '../../api/config'
import { DateTimeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import styles from '../manager/ManagerPages.module.scss'

export const LearningDetailsPage = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const { data: enrollments, isLoading, error } = useAsyncData(fetchMyEnrollments, [], [])

    const enrollment = enrollments.find((item) => item.id === id)

    const resolveCertificateUrl = (rawUrl: string): string => {
        if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
            return rawUrl
        }

        const normalizedPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`
        return `${API_BASE_URL}${normalizedPath}`
    }

    if (isLoading) {
        return <p className={styles.managerPage__metaText}>{t('employee.learningDetails.loading')}</p>
    }

    if (!enrollment) {
        return (
            <section className={styles.managerPage}>
                <header className={styles.managerPage__header}>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('employee.learningDetails.notFoundTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('employee.learningDetails.notFoundSubtitle')}</p>
                    </div>
                </header>
            </section>
        )
    }

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{enrollment.trainingTitle}</h1>
                </div>
            </header>

            {error && (
                <p className={styles.managerPage__metaText}>
                    {t('ui.error.withMessage', { error })}
                </p>
            )}

            <div className={styles.managerPage__infoBlock}>
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('employee.learningDetails.fields.startDate')}</p>
                        <p className={styles.managerPage__infoValue}>
                            <DateTimeBadge value={enrollment.startDate} />
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('employee.learningDetails.fields.endDate')}</p>
                        <p className={styles.managerPage__infoValue}>
                            <DateTimeBadge value={enrollment.endDate} tone="end" />
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('employee.learningDetails.fields.city')}</p>
                        <p className={styles.managerPage__infoValue}>{enrollment.city || t('ui.na')}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('employee.learningDetails.fields.location')}</p>
                        <p className={styles.managerPage__infoValue}>{enrollment.location || t('ui.na')}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('employee.learningDetails.fields.attendance')}</p>
                        <p className={styles.managerPage__infoValue}>
                            {enrollment.isAttended
                                ? t('employee.learningDetails.attendance.attended')
                                : t('employee.learningDetails.attendance.planned')}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            {t('employee.learningDetails.fields.certificateNumber')}
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {enrollment.certificateNumber || t('ui.na')}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            {t('employee.learningDetails.fields.certificateFile')}
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {enrollment.certificateFile ? (
                                <a
                                    className={styles.managerPage__inlineLink}
                                    href={resolveCertificateUrl(enrollment.certificateFile)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t('employee.learningDetails.openCertificate')}
                                </a>
                            ) : (
                                t('ui.na')
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
