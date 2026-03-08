import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminRouteLinks } from '../../app/routePaths'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { Pagination } from '../../components/Pagination'
import { RequestStatus, type Request } from '../../types'

import {
    REQUEST_STATUS_LABELS,
    requestsMock,
    sessionsMock,
    trainingsMock,
    employeeOptions,
} from '../manager/manager.mock'

import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

const statusClassByValue: Record<RequestStatus, string> = {
    [RequestStatus.DRAFT]: styles.managerPage__badgeDraft,
    [RequestStatus.PENDING]: styles.managerPage__badgePending,
    [RequestStatus.APPROVED]: styles.managerPage__badgeApproved,
    [RequestStatus.REJECTED]: styles.managerPage__badgeRejected,
}

export const RequestsPage = () => {
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | RequestStatus>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const sessionsById = useMemo(
        () => new Map(sessionsMock.map((session) => [session.id, session])),
        [],
    )
    const trainingsById = useMemo(
        () => new Map(trainingsMock.map((training) => [training.id, training])),
        [],
    )
    const managersById = useMemo(
        () => new Map(employeeOptions.map((employee) => [employee.id, employee])),
        [],
    )

    const filteredRequests = useMemo(() => {
        const text = searchValue.trim().toLowerCase()

        return requestsMock.filter((req) => {
            if (filterStatus !== 'all' && req.status !== filterStatus) return false

            const session = sessionsById.get(req.sessionId)
            const training = session ? trainingsById.get(session.trainingId) : undefined
            const manager = managersById.get(req.managerId)

            const combined = [
                req.id,
                req.status,
                manager?.fullName,
                manager?.department,
                training?.title,
                session?.city,
            ]
                .join(' ')
                .toLowerCase()

            return combined.includes(text)
        })
    }, [filterStatus, managersById, searchValue, sessionsById, trainingsById])

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
                key: 'manager',
                header: 'Manager',
                renderCell: (request) => managersById.get(request.managerId)?.fullName ?? 'N/A',
            },
            {
                key: 'department',
                header: 'Department',
                renderCell: (request) => managersById.get(request.managerId)?.department ?? 'N/A',
            },
            {
                key: 'training',
                header: 'Training',
                renderCell: (request) => {
                    const session = sessionsById.get(request.sessionId)
                    return session ? trainingsById.get(session.trainingId)?.title ?? 'N/A' : 'N/A'
                },
            },
            {
                key: 'dates',
                header: 'Dates',
                renderCell: (request) => {
                    const session = sessionsById.get(request.sessionId)
                    return session ? `${session.startDate} – ${session.endDate}` : 'N/A'
                },
            },
            {
                key: 'city',
                header: 'City',
                renderCell: (request) => sessionsById.get(request.sessionId)?.city ?? 'N/A',
            },
            {
                key: 'employees',
                header: 'Employees',
                renderCell: (request) => request.employees.length,
            },
        ],
        [managersById, sessionsById, trainingsById],
    )

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Requests</h1>
                    <p className={styles.managerPage__subtitle}>
                        View and filter all training requests
                    </p>
                </div>
            </header>

            <div className={styles.managerPage__filters}>
                <input
                    className={styles.managerPage__searchInput}
                    type="search"
                    placeholder="Search requests..."
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value)
                        setCurrentPage(1)
                    }}
                />

                <select
                    className={styles.managerPage__select}
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value as 'all' | RequestStatus)
                        setCurrentPage(1)
                    }}
                >
                    <option value="all">All statuses</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                rows={paginatedRequests}
                getRowKey={(request) => request.id}
                emptyState="No requests found"
                onRowClick={(request) => {
                    navigate(adminRouteLinks.requestDetails(request.id))
                }}
                minWidth={980}
            />

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(nextPage) => {
                    setCurrentPage(Math.max(1, Math.min(nextPage, totalPages)))
                }}
                ariaLabel="requests pagination"
            />
        </section>
    )
}
