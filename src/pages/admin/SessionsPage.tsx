import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminRouteLinks } from '../../app/routePaths'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { Pagination } from '../../components/Pagination'
import type { Session } from '../../types'
import { sessionsMock, trainingsMock } from '../manager/manager.mock'
import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

export const SessionsPage = () => {
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const trainingsById = useMemo(
        () => new Map(trainingsMock.map((training) => [training.id, training])),
        [],
    )

    const filteredSessions = useMemo(() => {
        const query = searchValue.trim().toLowerCase()

        if (!query) return sessionsMock

        return sessionsMock.filter((session) => {
            const training = trainingsById.get(session.trainingId)

            const text = [
                training?.title ?? '',
                session.city,
                session.startDate,
            ]
                .join(' ')
                .toLowerCase()

            return text.includes(query)
        })
    }, [searchValue, trainingsById])

    const totalPages = Math.max(1, Math.ceil(filteredSessions.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)

    const paginatedSessions = useMemo(() => {
        const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
        return filteredSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredSessions, normalizedCurrentPage])

    const columns = useMemo<DataTableColumn<Session>[]>(
        () => [
            {
                key: 'training',
                header: 'Training',
                renderCell: (session) => trainingsById.get(session.trainingId)?.title ?? 'N/A',
            },
            {
                key: 'city',
                header: 'City',
                renderCell: (session) => session.city,
            },
            {
                key: 'dates',
                header: 'Dates',
                renderCell: (session) => `${session.startDate} – ${session.endDate}`,
            },
            {
                key: 'capacity',
                header: 'Capacity',
                renderCell: (session) => session.capacity,
            },
        ],
        [trainingsById],
    )

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Sessions</h1>
                    <p className={styles.managerPage__subtitle}>
                        Manage all training sessions.
                    </p>
                </div>
            </header>

            <input
                className={styles.managerPage__searchInput}
                type="search"
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value)
                    setCurrentPage(1)
                }}
                placeholder="Search sessions"
            />

            <DataTable
                columns={columns}
                rows={paginatedSessions}
                getRowKey={(session) => session.id}
                emptyState="No sessions found"
                onRowClick={(session) => {
                    navigate(adminRouteLinks.sessionDetails(session.id))
                }}
                minWidth={700}
            />

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                ariaLabel="sessions pagination"
            />
        </section>
    )
}
