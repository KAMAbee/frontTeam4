import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { managerRouteLinks } from '../../app/routePaths'
import { Pagination } from '../../components/Pagination'
import { RequestStatus } from '../../types'
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

    const filteredRequests = useMemo(() => {
        const normalizedQuery = searchValue.trim().toLowerCase()

        if (!normalizedQuery) {
            return requestsMock
        }

        return requestsMock.filter((request) => {
            const session = sessionsMock.find((item) => item.id === request.sessionId)
            const training = trainingsMock.find((item) => item.id === session?.trainingId)

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
    }, [searchValue])

    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)

    const paginatedRequests = useMemo(() => {
        const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
        return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredRequests, normalizedCurrentPage])

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

            <div className={styles.managerPage__tableWrap}>
                <table className={styles.managerPage__table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Training</th>
                            <th>Session</th>
                            <th>Status</th>
                            <th>Employees</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRequests.length === 0 ? (
                            <tr>
                                <td colSpan={5}>No requests found</td>
                            </tr>
                        ) : (
                            paginatedRequests.map((request) => {
                                const session = sessionsMock.find((item) => item.id === request.sessionId)
                                const training = trainingsMock.find(
                                    (item) => item.id === session?.trainingId,
                                )

                                return (
                                    <tr
                                        key={request.id}
                                        className={styles.managerPage__tableRow}
                                        onClick={() => {
                                            navigate(managerRouteLinks.requestDetails(request.id))
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                navigate(managerRouteLinks.requestDetails(request.id))
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <td>{request.id}</td>
                                        <td>{training?.title ?? 'N/A'}</td>
                                        <td>
                                            {session ? `${session.city} (${session.startDate})` : 'N/A'}
                                        </td>
                                        <td>
                                            <span
                                                className={`${styles.managerPage__badge} ${statusClassByValue[request.status]}`}
                                            >
                                                {REQUEST_STATUS_LABELS[request.status]}
                                            </span>
                                        </td>
                                        <td>{request.employees.length}</td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

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
