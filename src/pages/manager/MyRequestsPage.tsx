import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { managerRouteLinks } from '../../app/routePaths'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { Pagination } from '../../components/Pagination'
import { RequestStatus, type Request } from '../../types'
import {
    REQUEST_STATUS_LABELS,
    requestsMock,
    sessionsMock,
    trainingsMock,
} from './manager.mock'
import styles from './ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

const statusClassByValue: Record<RequestStatus, string> = {
    [RequestStatus.DRAFT]: styles.managerPage__badgeDraft,
    [RequestStatus.PENDING]: styles.managerPage__badgePending,
    [RequestStatus.APPROVED]: styles.managerPage__badgeApproved,
    [RequestStatus.REJECTED]: styles.managerPage__badgeRejected,
}

export const MyRequestsPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const sessionsById = useMemo(
        () => new Map(sessionsMock.map((session) => [session.id, session])),
        [],
    )
    const trainingsById = useMemo(
        () => new Map(trainingsMock.map((training) => [training.id, training])),
        [],
    )

    const filteredRequests = useMemo(() => {
        const normalizedQuery = searchValue.trim().toLowerCase()

        if (!normalizedQuery) {
            return requestsMock
        }

        return requestsMock.filter((request) => {
            const session = sessionsById.get(request.sessionId)
            const training = session ? trainingsById.get(session.trainingId) : undefined

            const searchText = [
                request.id,
                training?.title ?? '',
                session?.city ?? '',
                REQUEST_STATUS_LABELS[request.status],
            ]
                .join(' ')
                .toLowerCase()

            return searchText.includes(normalizedQuery)
        })
    }, [searchValue, sessionsById, trainingsById])

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
                renderCell: (request) => request.id,
            },
            {
                key: 'training',
                header: 'Training',
                renderCell: (request) => {
                    const session = sessionsById.get(request.sessionId)
                    const training = session ? trainingsById.get(session.trainingId) : undefined

                    return training?.title ?? 'N/A'
                },
            },
            {
                key: 'session',
                header: 'Session',
                renderCell: (request) => {
                    const session = sessionsById.get(request.sessionId)
                    return session ? `${session.city} (${session.startDate})` : 'N/A'
                },
            },
            {
                key: 'status',
                header: 'Status',
                renderCell: (request) => (
                    <span
                        className={`${styles.managerPage__badge} ${statusClassByValue[request.status]}`}
                    >
                        {REQUEST_STATUS_LABELS[request.status]}
                    </span>
                ),
            },
            {
                key: 'employees',
                header: 'Employees',
                renderCell: (request) => request.employees.length,
            },
        ],
        [sessionsById, trainingsById],
    )

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>My Requests</h1>
                    <p className={styles.managerPage__subtitle}>
                        Track submitted requests and approval statuses.
                    </p>
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
                placeholder="Search by request ID, training, city or status"
                aria-label="Search requests"
            />

            <DataTable
                columns={columns}
                rows={paginatedRequests}
                getRowKey={(request) => request.id}
                emptyState="No requests found"
                onRowClick={(request) => {
                    navigate(managerRouteLinks.requestDetails(request.id))
                }}
                minWidth={680}
            />

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
