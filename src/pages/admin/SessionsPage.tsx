import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination } from '../../components/Pagination'
import { sessionsMock, trainingsMock } from '../manager/manager.mock'
import styles from '../manager/ManagerPages.module.scss'

const ITEMS_PER_PAGE = 7

export const SessionsPage = () => {
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const filteredSessions = useMemo(() => {
        const query = searchValue.trim().toLowerCase()

        if (!query) return sessionsMock

        return sessionsMock.filter((session) => {
            const training = trainingsMock.find((t) => t.id === session.trainingId)

            const text = [
                training?.title ?? '',
                session.city,
                session.startDate,
            ]
                .join(' ')
                .toLowerCase()

            return text.includes(query)
        })
    }, [searchValue])

    const totalPages = Math.max(1, Math.ceil(filteredSessions.length / ITEMS_PER_PAGE))
    const normalizedCurrentPage = Math.min(currentPage, totalPages)

    const paginatedSessions = useMemo(() => {
        const startIndex = (normalizedCurrentPage - 1) * ITEMS_PER_PAGE
        return filteredSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    }, [filteredSessions, normalizedCurrentPage])

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

            <div className={styles.managerPage__tableWrap}>
                <table className={styles.managerPage__table}>
                    <thead>
                        <tr>
                            <th>Training</th>
                            <th>City</th>
                            <th>Dates</th>
                            <th>Capacity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSessions.map((session) => {
                            const training = trainingsMock.find(
                                (t) => t.id === session.trainingId,
                            )

                            return (
                                <tr
                                    key={session.id}
                                    className={styles.managerPage__tableRow}
                                    onClick={() => navigate(`/admin/sessions/${session.id}`)}
                                >
                                    <td>{training?.title ?? 'N/A'}</td>
                                    <td>{session.city}</td>
                                    <td>
                                        {session.startDate} – {session.endDate}
                                    </td>
                                    <td>{session.capacity}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={normalizedCurrentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                ariaLabel="sessions pagination"
            />
        </section>
    )
}