import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
    ApiError,
    cancelTrainingRequest,
    fetchSessions,
    fetchTrainingRequestById,
    fetchTrainings,
} from '../../api'
import { MANAGER_ROUTE_PATHS } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import { RequestStatus, type Request } from '../../types'
import styles from './ManagerPages.module.scss'

export const RequestDetailsPage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const {
        data: request,
        isLoading: isRequestLoading,
        error: requestError,
        setData: setRequest,
    } = useAsyncData<Request | null>(
        async () => {
            if (!id) {
                return null
            }

            return fetchTrainingRequestById(id)
        },
        null,
        [id],
    )
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
    const [isCancelling, setIsCancelling] = useState(false)
    const [cancelError, setCancelError] = useState<string | null>(null)

    if (isRequestLoading && !request) {
        return <p className={styles.managerPage__metaText}>{t('manager.requestDetails.loading')}</p>
    }

    if (!request || !id) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={MANAGER_ROUTE_PATHS.requests} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('manager.requestDetails.notFoundTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('manager.requestDetails.notFoundSubtitle')}</p>
                    </div>
                </header>
            </section>
        )
    }

    const session = sessions.find((item) => item.id === request.sessionId)
    const training = trainings.find((item) => item.id === session?.trainingId)
    const selectedEmployees = request.employeeDetails?.length
        ? request.employeeDetails.map((employee) => ({
              id: employee.employeeId,
              label: employee.name,
          }))
        : request.employees.map((employeeId) => ({
              id: employeeId,
              label: employeeId,
          }))

    const handleCancelRequest = async () => {
        try {
            setCancelError(null)
            setIsCancelling(true)
            const updatedRequest = await cancelTrainingRequest(request.id)
            setRequest(updatedRequest)
        } catch (cancelErrorValue) {
            if (cancelErrorValue instanceof ApiError) {
                setCancelError(cancelErrorValue.message)
            } else {
                setCancelError(t('manager.requestDetails.cancelError'))
            }
        } finally {
            setIsCancelling(false)
        }
    }

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={MANAGER_ROUTE_PATHS.requests} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        {t('manager.requestDetails.title', { id: request.id })}
                    </h1>
                    <p className={styles.managerPage__subtitle}>{t('manager.requestDetails.subtitle')}</p>
                </div>
            </header>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('manager.requestDetails.infoTitle')}</h2>
                {(isRequestLoading || isSessionsLoading || isTrainingsLoading) && (
                    <p className={styles.managerPage__metaText}>{t('manager.requestDetails.loading')}</p>
                )}
                {(requestError || sessionsError || trainingsError) && (
                    <p className={styles.managerPage__metaText}>
                        {t('ui.error.withMessage', { error: requestError || sessionsError || trainingsError })}
                    </p>
                )}
                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('manager.requestDetails.fields.training')}</p>
                        <p className={styles.managerPage__infoValue}>{training?.title ?? t('ui.na')}</p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('manager.requestDetails.fields.session')}</p>
                        <p className={styles.managerPage__infoValue}>
                            {session
                                ? (
                                    <span>
                                        {session.city} |{' '}
                                        <DateTimeRangeBadge
                                            startValue={session.startDate}
                                            endValue={session.endDate}
                                        />
                                    </span>
                                )
                                : t('ui.na')}
                        </p>
                    </div>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('manager.requestDetails.fields.status')}</p>
                        <p className={styles.managerPage__infoValue}>{t(`labels.requestStatus.${request.status}`)}</p>
                    </div>
                </div>
            </article>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__sectionTitle}>{t('manager.requestDetails.employeesTitle')}</h2>
                {selectedEmployees.length === 0 ? (
                    <p className={styles.managerPage__metaText}>{t('manager.requestDetails.noEmployees')}</p>
                ) : (
                    <ul className={styles.managerPage__list}>
                        {selectedEmployees.map((employee) => (
                            <li key={employee.id} className={styles.managerPage__listItem}>
                                {employee.label}
                            </li>
                        ))}
                    </ul>
                )}
            </article>

            <article className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__sectionTitle}>{t('manager.requestDetails.commentTitle')}</h2>
                <p className={styles.managerPage__metaText}>
                    {request.comment || t('manager.requestDetails.noComment')}
                </p>
            </article>

            {request.status === RequestStatus.PENDING && (
                <article className={styles.managerPage__infoBlock}>
                    <h2 className={styles.managerPage__sectionTitle}>{t('manager.requestDetails.actionsTitle')}</h2>
                    <div className={styles.managerPage__formActions}>
                        <button
                            type="button"
                            className={styles.managerPage__buttonDanger}
                            onClick={handleCancelRequest}
                            disabled={isCancelling}
                        >
                            {isCancelling
                                ? t('manager.requestDetails.cancelling')
                                : t('manager.requestDetails.cancel')}
                        </button>
                    </div>
                    {cancelError && <p className={styles.managerPage__metaText}>{cancelError}</p>}
                </article>
            )}
        </section>
    )
}
