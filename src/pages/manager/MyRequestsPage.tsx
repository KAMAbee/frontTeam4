import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchSessions, fetchTrainingRequests, fetchTrainings } from '../../api'
import { managerRouteLinks } from '../../app/routePaths'
import { CopyableId } from '../../components/CopyableId'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { DateTimeRangeBadge } from '../../components/DateTimeBadge'
import { Pagination } from '../../components/Pagination'
import { useAsyncData } from '../../hooks'
import { RequestStatus, type Request } from '../../types'
import styles from './ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

const statusClassByValue: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: styles.managerPage__badgePending,
    [RequestStatus.APPROVED]: styles.managerPage__badgeApproved,
    [RequestStatus.REJECTED]: styles.managerPage__badgeRejected,
    [RequestStatus.CANCELLED]: styles.managerPage__badgeCancelled,
}

export const MyRequestsPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
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

    const sessionsById = useMemo(
        () => new Map(sessions.map((session) => [session.id, session])),
        [sessions],
    )
    const trainingsById = useMemo(
        () => new Map(trainings.map((training) => [training.id, training])),
        [trainings],
    )

    const filteredRequests = useMemo(() => {
        const normalizedQuery = searchValue.trim().toLowerCase()

        if (!normalizedQuery) {
            return requests
        }

        return requests.filter((request) => {
            const session = sessionsById.get(request.sessionId)
            const training = session ? trainingsById.get(session.trainingId) : undefined

            const searchText = [
                request.id,
                training?.title ?? '',
                session?.city ?? '',
                t(`labels.requestStatus.${request.status}`),
            ]
                .join(' ')
                .toLowerCase()

            return searchText.includes(normalizedQuery)
        })
    }, [requests, searchValue, sessionsById, t, trainingsById])

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
                key: 'training',
                header: t('manager.myRequests.columns.training'),
                renderCell: (request) => {
                    const session = sessionsById.get(request.sessionId)
                    const training = session ? trainingsById.get(session.trainingId) : undefined

                    return training?.title ?? t('ui.na')
                },
            },
            {
                key: 'session',
                header: t('manager.myRequests.columns.session'),
                renderCell: (request) => {
                    const session = sessionsById.get(request.sessionId)
                    if (!session) {
                        return t('ui.na')
                    }

                    return (
                        <div className={styles.managerPage__dateCell}>
                            <span>{session.city}</span>
                            <DateTimeRangeBadge startValue={session.startDate} endValue={session.endDate} />
                        </div>
                    )
                },
            },
            {
                key: 'status',
                header: t('manager.myRequests.columns.status'),
                renderCell: (request) => (
                    <span className={`${styles.managerPage__badge} ${statusClassByValue[request.status]}`}>
                        {t(`labels.requestStatus.${request.status}`)}
                    </span>
                ),
            },
            {
                key: 'employees',
                header: t('manager.myRequests.columns.employees'),
                renderCell: (request) => request.employees.length,
            },
        ],
        [sessionsById, t, trainingsById],
    )

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>{t('manager.myRequests.title')}</h1>
                    <p className={styles.managerPage__subtitle}>{t('manager.myRequests.subtitle')}</p>
                </div>
            </header>

            <input
                className={styles.managerPage__searchInput}
                type="search"
                value={searchValue}
                onChange={(event) => {
                    setSearchValue(event.target.value)
                    setCurrentPage(1)
                }}
                placeholder={t('manager.myRequests.searchPlaceholder')}
                aria-label={t('manager.myRequests.searchAria')}
            />

            <DataTable
                columns={columns}
                rows={paginatedRequests}
                getRowKey={(request) => request.id}
                emptyState={t('manager.myRequests.empty')}
                onRowClick={(request) => {
                    navigate(managerRouteLinks.requestDetails(request.id))
                }}
                minWidth={680}
            />

            {(isRequestsLoading || isSessionsLoading || isTrainingsLoading) && (
                <p className={styles.managerPage__metaText}>{t('manager.myRequests.loading')}</p>
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
