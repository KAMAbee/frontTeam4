import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
    ApiError,
    approveTrainingRequest,
    fetchContracts,
    fetchSessions,
    fetchSuppliers,
    fetchTrainingRequestById,
    fetchTrainings,
    fetchUserById,
    rejectTrainingRequest,
} from '../../api'
import { ADMIN_ROUTE_PATHS } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { useAsyncData } from '../../hooks'
import { RequestStatus, type Request } from '../../types'
import { formatDateTime, formatMoneyKzt } from '../../utils/formatters'
import styles from '../manager/ManagerPages.module.scss'

const statusClassByValue: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: styles.managerPage__badgePending,
    [RequestStatus.APPROVED]: styles.managerPage__badgeApproved,
    [RequestStatus.REJECTED]: styles.managerPage__badgeRejected,
    [RequestStatus.CANCELLED]: styles.managerPage__badgeCancelled,
}

export const RequestDetailsPage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { data: request, isLoading: isRequestLoading, error: requestError } = useAsyncData<Request | null>(
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
    const {
        data: manager,
        isLoading: isManagerLoading,
        error: managerError,
    } = useAsyncData(
        async () => {
            if (!request?.managerId) {
                return null
            }

            try {
                return await fetchUserById(request.managerId)
            } catch {
                return null
            }
        },
        null as Awaited<ReturnType<typeof fetchUserById>> | null,
        [request?.managerId],
    )
    const { data: contracts, isLoading: isContractsLoading, error: contractsError } = useAsyncData(
        fetchContracts,
        [],
        [],
    )
    const { data: suppliers, isLoading: isSuppliersLoading, error: suppliersError } = useAsyncData(
        fetchSuppliers,
        [],
        [],
    )

    const [selectedContractId, setSelectedContractId] = useState('')
    const [actionComment, setActionComment] = useState('')
    const [actionError, setActionError] = useState<string | null>(null)
    const [isActionLoading, setIsActionLoading] = useState(false)

    const session = sessions.find((item) => item.id === request?.sessionId)
    const training = trainings.find((item) => item.id === session?.trainingId)
    const availableContracts = useMemo(
        () =>
            contracts.filter((contract) => {
                if (!training?.supplierId) {
                    return true
                }

                return contract.supplierId === training.supplierId
            }),
        [contracts, training?.supplierId],
    )

    const selectedContract = availableContracts.find((contract) => contract.id === selectedContractId)
    const selectedSupplier = suppliers.find((supplier) => supplier.id === selectedContract?.supplierId)

    useEffect(() => {
        if (!selectedContractId && availableContracts.length > 0) {
            setSelectedContractId(availableContracts[0].id)
        }
    }, [availableContracts, selectedContractId])

    if (isRequestLoading && !request) {
        return <p className={styles.managerPage__metaText}>{t('admin.requestDetails.loading')}</p>
    }

    if (!request || !id) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={ADMIN_ROUTE_PATHS.requests} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>{t('admin.requestDetails.notFoundTitle')}</h1>
                        <p className={styles.managerPage__subtitle}>{t('admin.requestDetails.notFoundSubtitle')}</p>
                    </div>
                </header>
            </section>
        )
    }

    const handleApprove = async () => {
        if (!selectedContractId) {
            setActionError(t('admin.requestDetails.errors.chooseContract'))
            return
        }

        try {
            setActionError(null)
            setIsActionLoading(true)
            await approveTrainingRequest(request.id, selectedContractId)
            navigate(ADMIN_ROUTE_PATHS.requests)
        } catch (actionHandlingError) {
            if (actionHandlingError instanceof ApiError) {
                setActionError(actionHandlingError.message)
            } else {
                setActionError(t('admin.requestDetails.errors.approveFailed'))
            }
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleReject = async () => {
        try {
            setActionError(null)
            setIsActionLoading(true)
            await rejectTrainingRequest(request.id)
            navigate(ADMIN_ROUTE_PATHS.requests)
        } catch (actionHandlingError) {
            if (actionHandlingError instanceof ApiError) {
                setActionError(actionHandlingError.message)
            } else {
                setActionError(t('admin.requestDetails.errors.rejectFailed'))
            }
        } finally {
            setIsActionLoading(false)
        }
    }

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={ADMIN_ROUTE_PATHS.requests} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        {t('admin.requestDetails.title', { id: request.id })}
                    </h1>
                    <p className={styles.managerPage__subtitle}>{t('admin.requestDetails.subtitle')}</p>
                </div>
            </header>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.requestDetails.trainingInfoTitle')}</h2>

                {(isRequestLoading
                    || isSessionsLoading
                    || isTrainingsLoading
                    || isManagerLoading
                    || isContractsLoading
                    || isSuppliersLoading) && (
                    <p className={styles.managerPage__metaText}>{t('admin.requestDetails.loading')}</p>
                )}

                {(requestError
                    || sessionsError
                    || trainingsError
                    || managerError
                    || contractsError
                    || suppliersError) && (
                    <p className={styles.managerPage__metaText}>
                        {t('ui.error.withMessage', {
                            error:
                                requestError
                                || sessionsError
                                || trainingsError
                                || managerError
                                || contractsError
                                || suppliersError,
                        })}
                    </p>
                )}

                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.requestDetails.fields.training')}</p>
                        <p className={styles.managerPage__infoValue}>
                            {training?.title || request.trainingTitle || t('ui.na')}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.requestDetails.fields.city')}</p>
                        <p className={styles.managerPage__infoValue}>{session?.city || t('ui.na')}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.requestDetails.fields.dates')}</p>
                        <p className={styles.managerPage__infoValue}>
                            {session
                                ? (
                                    <DateTimeRangeBadge
                                        startValue={session.startDate}
                                        endValue={session.endDate}
                                    />
                                )
                                : t('ui.na')}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.requestDetails.fields.manager')}</p>
                        <p className={styles.managerPage__infoValue}>
                            {manager?.fullName || t('admin.requests.managerFallback', { id: request.managerId })}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.requestDetails.fields.department')}</p>
                        <p className={styles.managerPage__infoValue}>{manager?.department || t('ui.na')}</p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>{t('admin.requestDetails.fields.status')}</p>
                        <p className={styles.managerPage__infoValue}>
                            <span className={`${styles.managerPage__badge} ${statusClassByValue[request.status]}`}>
                                {t(`labels.requestStatus.${request.status}`)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.requestDetails.employeesTitle')}</h2>

                {request.employeeDetails?.length ? (
                    <ul className={styles.managerPage__employeeList}>
                        {request.employeeDetails.map((employee) => (
                            <li key={employee.id} className={styles.managerPage__employeeChip}>
                                {employee.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.managerPage__metaText}>{t('admin.requestDetails.noEmployees')}</p>
                )}
            </div>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.requestDetails.contractTitle')}</h2>

                {availableContracts.length === 0 ? (
                    <p className={styles.managerPage__metaText}>{t('admin.requestDetails.noContracts')}</p>
                ) : (
                    <>
                        <select
                            className={styles.managerPage__select}
                            value={selectedContractId}
                            onChange={(event) => {
                                setSelectedContractId(event.target.value)
                                setActionError(null)
                            }}
                            aria-label={t('admin.requestDetails.contractSelectAria')}
                        >
                            {availableContracts.map((contract) => (
                                <option key={contract.id} value={contract.id}>
                                    {t('admin.requestDetails.contractOption', {
                                        number: contract.contractNumber,
                                        startDate: formatDateTime(contract.startDate),
                                        endDate: formatDateTime(contract.endDate),
                                    })}
                                </option>
                            ))}
                        </select>

                        {selectedContract && (
                            <div className={styles.managerPage__infoGrid}>
                                <div>
                                    <p className={styles.managerPage__infoLabel}>
                                        {t('admin.requestDetails.fields.supplier')}
                                    </p>
                                    <p className={styles.managerPage__infoValue}>
                                        {selectedSupplier?.name || selectedContract.supplierName || t('ui.na')}
                                    </p>
                                </div>
                                <div>
                                    <p className={styles.managerPage__infoLabel}>
                                        {t('admin.requestDetails.fields.totalLimit')}
                                    </p>
                                    <p className={styles.managerPage__infoValue}>
                                        {formatMoneyKzt(selectedContract.limit)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>{t('admin.requestDetails.actionsTitle')}</h2>

                <textarea
                    className={styles.managerPage__textarea}
                    placeholder={t('admin.requestDetails.commentPlaceholder')}
                    value={actionComment}
                    onChange={(event) => {
                        setActionComment(event.target.value)
                        setActionError(null)
                    }}
                />

                {actionError && <p className={styles.managerPage__metaText}>{actionError}</p>}

                <div className={styles.managerPage__actionsRow}>
                    <button
                        type="button"
                        className={styles.managerPage__buttonPrimary}
                        onClick={handleApprove}
                        disabled={isActionLoading}
                    >
                        {isActionLoading
                            ? t('admin.requestDetails.processing')
                            : t('admin.requestDetails.approve')}
                    </button>

                    <button
                        type="button"
                        className={styles.managerPage__buttonDanger}
                        onClick={handleReject}
                        disabled={isActionLoading}
                    >
                        {t('admin.requestDetails.reject')}
                    </button>
                </div>
            </div>
        </section>
    )
}
