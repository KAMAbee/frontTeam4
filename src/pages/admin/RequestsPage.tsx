import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { fetchSessions, fetchTrainingRequests, fetchTrainings, fetchUserById, type DirectoryUser } from '../../api'
import { adminRouteLinks } from '../../app/routePaths'
import { CopyableId } from '../../components/CopyableId'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { Pagination } from '../../components/Pagination'
import { useAsyncData } from '../../hooks'
import { RequestStatus, type Request } from '../../types'
import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

const statusClassByValue: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: styles.managerPage__badgePending,
    [RequestStatus.APPROVED]: styles.managerPage__badgeApproved,
    [RequestStatus.REJECTED]: styles.managerPage__badgeRejected,
    [RequestStatus.CANCELLED]: styles.managerPage__badgeCancelled,
}

export const RequestsPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | RequestStatus>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const { data: requests, isLoading: isRequestsLoading, error: requestsError } = useAsyncData(
        fetchTrainingRequests,
        [],
        [],
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
    const [managersById, setManagersById] = useState<Map<string, DirectoryUser>>(new Map())

    const sessionsById = useMemo(
        () => new Map(sessions.map((session) => [session.id, session])),
        [sessions],
    )
    const trainingsById = useMemo(
        () => new Map(trainings.map((training) => [training.id, training])),
        [trainings],
    )

    useEffect(() => {
        const managerIds = Array.from(new Set(requests.map((request) => request.managerId)))
        const missingManagerIds = managerIds.filter((managerId) => !managersById.has(managerId))

        if (missingManagerIds.length === 0) {
            return
        }

        let isMounted = true

        const loadManagers = async () => {
            const loadedManagers = await Promise.allSettled(
                missingManagerIds.map(async (managerId) => fetchUserById(managerId)),
            )

            if (!isMounted) {
                return
            }

            setManagersById((prev) => {
                const next = new Map(prev)

                loadedManagers.forEach((result) => {
                    if (result.status === 'fulfilled') {
                        next.set(result.value.id, result.value)
                    }
                })

                return next
            })
        }

        void loadManagers()

        return () => {
            isMounted = false
        }
    }, [managersById, requests])

    const filteredRequests = useMemo(() => {
        const text = searchValue.trim().toLowerCase()

        return requests.filter((request) => {
            if (filterStatus !== 'all' && request.status !== filterStatus) return false

            const session = sessionsById.get(request.sessionId)
            const training = session ? trainingsById.get(session.trainingId) : undefined
            const manager = managersById.get(request.managerId)

            const combined = [
                request.id,
                request.status,
                manager?.fullName ?? request.managerId,
                manager?.department ?? '',
                training?.title ?? '',
                session?.city ?? '',
            ]
                .join(' ')
                .toLowerCase()

            return combined.includes(text)
        })
    }, [filterStatus, managersById, requests, searchValue, sessionsById, trainingsById])

    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)

    const paginatedRequests = useMemo(() => {
        const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
        return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredRequests, normalizedCurrentPage])

    const columns = useMemo<DataTableColumn<Request>[]>(
        () => [
            {
                key: 'id',
                header: 'ID',
                renderCell: (request) => <CopyableId value={request.id} />,
            },
            {
                key: 'status',
                header: t('admin.requests.columns.status'),
                renderCell: (request) => (
                    <span className={`${styles.managerPage__badge} ${statusClassByValue[request.status]}`}>
                        {t(`labels.requestStatus.${request.status}`)}
                    </span>
                ),
            },
            {
                key: 'manager',
                header: t('admin.requests.columns.manager'),
                renderCell: (request) =>
                    managersById.get(request.managerId)?.fullName
                    ?? t('admin.requests.managerFallback', { id: request.managerId }),
            },
            {
                key: 'department',
                header: t('admin.requests.columns.department'),
                renderCell: (request) => managersById.get(request.managerId)?.department || t('ui.na'),
            },
            {
                key: 'training',
                header: t('admin.requests.columns.training'),
                renderCell: (request) => {
                    const session = sessionsById.get(request.sessionId)
                    return session ? trainingsById.get(session.trainingId)?.title ?? t('ui.na') : t('ui.na')
                },
            },
            {
                key: 'dates',
                header: t('admin.requests.columns.dates'),
                renderCell: (request) => {
                    const session = sessionsById.get(request.sessionId)
                    return session
                        ? <DateTimeRangeBadge startValue={session.startDate} endValue={session.endDate} />
                        : t('ui.na')
                },
            },
            {
                key: 'city',
                header: t('admin.requests.columns.city'),
                renderCell: (request) => sessionsById.get(request.sessionId)?.city ?? t('ui.na'),
            },
            {
                key: 'employees',
                header: t('admin.requests.columns.employees'),
                renderCell: (request) => request.employees.length,
            },
        ],
        [managersById, sessionsById, t, trainingsById],
    )

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{t('admin.requests.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('admin.requests.subtitle')}</p>
                </div>
            </header>

            <div className={styles.managerPage__filters}>
                <input
                    className={styles.managerPage__searchInput}
                    type="search"
                    placeholder={t('admin.requests.searchPlaceholder')}
                    aria-label={t('admin.requests.searchAria')}
                    value={searchValue}
                    onChange={(event) => {
                        setSearchValue(event.target.value)
                        setCurrentPage(1)
                    }}
                />

                <select
                    className={styles.managerPage__select}
                    value={filterStatus}
                    onChange={(event) => {
                        setFilterStatus(event.target.value as 'all' | RequestStatus)
                        setCurrentPage(1)
                    }}
                    aria-label={t('admin.requests.statusFilterAria')}
                >
                    <option value="all">{t('admin.requests.filters.allStatuses')}</option>
                    <option value={RequestStatus.PENDING}>{t(`labels.requestStatus.${RequestStatus.PENDING}`)}</option>
                    <option value={RequestStatus.APPROVED}>{t(`labels.requestStatus.${RequestStatus.APPROVED}`)}</option>
                    <option value={RequestStatus.REJECTED}>{t(`labels.requestStatus.${RequestStatus.REJECTED}`)}</option>
                    <option value={RequestStatus.CANCELLED}>{t(`labels.requestStatus.${RequestStatus.CANCELLED}`)}</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                rows={paginatedRequests}
                getRowKey={(request) => request.id}
                emptyState={t('admin.requests.empty')}
                onRowClick={(request) => {
                    navigate(adminRouteLinks.requestDetails(request.id))
                }}
                minWidth={980}
            />

            {(isRequestsLoading || isSessionsLoading || isTrainingsLoading) && (
                <p className={styles.managerPage__metaText}>{t('admin.requests.loading')}</p>
            )}
            {(requestsError || sessionsError || trainingsError) && (
                <p className={styles.managerPage__metaText}>
                    {t('ui.error.withMessage', { error: requestsError || sessionsError || trainingsError })}
                </p>
            )}

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                    setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                }}
                ariaLabel={t('ui.pagination.requestsAria')}
            />
        </section>
    )
}
