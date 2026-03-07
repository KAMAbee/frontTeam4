import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    requestsMock,
    sessionsMock,
    trainingsMock,
    employeeOptions,
} from '../manager/manager.mock'

import styles from '../manager/ManagerPages.module.scss'

export const RequestsPage = () => {
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    const filteredRequests = useMemo(() => {
        const text = searchValue.trim().toLowerCase()

        return requestsMock.filter((req) => {
            if (filterStatus !== 'all' && req.status !== filterStatus) return false

            const session = sessionsMock.find((s) => s.id === req.sessionId)
            const training = trainingsMock.find((t) => t.id === session?.trainingId)
            const manager = employeeOptions.find((e) => e.id === req.managerId)

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
    }, [searchValue, filterStatus])

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
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <select
                    className={styles.managerPage__select}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            <div className={styles.managerPage__tableWrap}>
                <table className={styles.managerPage__table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Manager</th>
                            <th>Department</th>
                            <th>Training</th>
                            <th>Dates</th>
                            <th>City</th>
                            <th>Employees</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRequests.map((req) => {
                            const session = sessionsMock.find((s) => s.id === req.sessionId)
                            const training = trainingsMock.find((t) => t.id === session?.trainingId)
                            const manager = employeeOptions.find((m) => m.id === req.managerId)

                            return (
                                <tr
                                    key={req.id}
                                    className={styles.managerPage__tableRow}
                                    onClick={() => navigate(`/admin/requests/${req.id}`)}
                                >
                                    <td>{req.id}</td>
                                    <td>{req.status}</td>
                                    <td>{manager?.fullName}</td>
                                    <td>{manager?.department}</td>
                                    <td>{training?.title}</td>
                                    <td>
                                        {session?.startDate} – {session?.endDate}
                                    </td>
                                    <td>{session?.city}</td>
                                    <td>{req.employees.length}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
