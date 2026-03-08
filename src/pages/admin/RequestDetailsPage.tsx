import { useParams, useNavigate } from 'react-router-dom'
import { ADMIN_ROUTE_PATHS } from '../../app/routePaths'
import { BackButton } from '../../components/BackButton'
import { RequestStatus } from '../../types'
import {
    REQUEST_STATUS_LABELS,
    requestsMock,
    sessionsMock,
    trainingsMock,
    employeeOptions,
    suppliersMock,
    contractsMock,
    contractAllocationsMock,
    trainingRequestEmployeesMock,
} from '../manager/manager.mock'

import styles from '../manager/ManagerPages.module.scss'
import { useState } from 'react'

const statusClassByValue: Record<RequestStatus, string> = {
    [RequestStatus.DRAFT]: styles.managerPage__badgeDraft,
    [RequestStatus.PENDING]: styles.managerPage__badgePending,
    [RequestStatus.APPROVED]: styles.managerPage__badgeApproved,
    [RequestStatus.REJECTED]: styles.managerPage__badgeRejected,
}

export const RequestDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const request = requestsMock.find((r) => r.id === id)

    if (!request) {
        return (
            <section className={styles.managerPage}>
                <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                    <div className={styles.managerPage__headerActions}>
                        <BackButton fallbackTo={ADMIN_ROUTE_PATHS.requests} />
                    </div>
                    <div className={styles.managerPage__headerContent}>
                        <h1 className={styles.managerPage__title}>Request not found</h1>
                        <p className={styles.managerPage__subtitle}>The requested item is unavailable.</p>
                    </div>
                </header>
            </section>
        )
    }

    // session + training
    const session = sessionsMock.find((s) => s.id === request.sessionId)
    const training = trainingsMock.find((t) => t.id === session?.trainingId)

    // manager
    const manager = employeeOptions.find((e) => e.id === request.managerId)

    // employees assigned to this request
    const assignedEmployees = trainingRequestEmployeesMock.filter(
        (tre) => tre.requestId === request.id
    )

    // find contract used by this training (mock assumption)
    const contract = contractsMock.find((c) => c.supplierId === 'sup-001')
    const supplier = suppliersMock.find((s) => s.id === contract?.supplierId)

    // allocations for this contract
    const allocations = contractAllocationsMock.filter(
        (ca) => ca.contractId === contract?.id
    )

    const totalAllocated = allocations.reduce((sum, a) => sum + a.amount, 0)
    const remaining = (contract?.limit ?? 0) - totalAllocated

    const [actionComment, setActionComment] = useState('')

    const approve = () => {
        alert(`Approved request ${request.id}. (Mock only)`)
        navigate(ADMIN_ROUTE_PATHS.requests)
    }

    const reject = () => {
        alert(`Rejected request ${request.id} with comment: ${actionComment}`)
        navigate(ADMIN_ROUTE_PATHS.requests)
    }

    return (
        <section className={styles.managerPage}>
            <header className={`${styles.managerPage__header} ${styles.managerPage__headerWithBack}`}>
                <div className={styles.managerPage__headerActions}>
                    <BackButton fallbackTo={ADMIN_ROUTE_PATHS.requests} />
                </div>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        Request {request.id}
                    </h1>
                    <p className={styles.managerPage__subtitle}>
                        Review training request and allocation details
                    </p>
                </div>
            </header>

            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>
                    Training Information
                </h2>

                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Training</p>
                        <p className={styles.managerPage__infoValue}>
                            {training?.title}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>City</p>
                        <p className={styles.managerPage__infoValue}>
                            {session?.city}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Dates</p>
                        <p className={styles.managerPage__infoValue}>
                            {session?.startDate} – {session?.endDate}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Manager</p>
                        <p className={styles.managerPage__infoValue}>
                            {manager?.fullName ?? `Manager ${request.managerId}`}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            Department
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {manager?.department ?? 'N/A'}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Status</p>
                        <p className={styles.managerPage__infoValue}>
                            <span
                                className={`${styles.managerPage__badge} ${statusClassByValue[request.status]}`}
                            >
                                {REQUEST_STATUS_LABELS[request.status]}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Employees */}
            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>Employees</h2>

                {assignedEmployees.length > 0 ? (
                    <details className={styles.managerPage__details}>
                        <summary className={styles.managerPage__detailsSummary}>
                            <span className={styles.managerPage__detailsLabel}>
                                Team members
                            </span>

                            <span className={styles.managerPage__detailsMeta}>
                                <span className={styles.managerPage__detailsCount}>
                                    {assignedEmployees.length}
                                </span>
                                <span
                                    className={styles.managerPage__detailsChevron}
                                    aria-hidden
                                >
                                    ▾
                                </span>
                            </span>
                        </summary>

                        <ul className={styles.managerPage__employeeList}>
                            {assignedEmployees.map((employee) => (
                                <li
                                    key={employee.id}
                                    className={styles.managerPage__employeeChip}
                                >
                                    {employee.name}
                                </li>
                            ))}
                        </ul>
                    </details>
                ) : (
                    <p className={styles.managerPage__metaText}>No employees attached to this request.</p>
                )}
            </div>

            {/* Contract Info */}
            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>Contract</h2>

                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            Supplier
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier?.name}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            Contract #
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {contract?.contractNumber}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Limit</p>
                        <p className={styles.managerPage__infoValue}>
                            {contract?.limit} ₸
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            Allocated
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {totalAllocated} ₸
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            Remaining
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {remaining} ₸
                        </p>
                    </div>
                </div>
            </div>

            {/* Approve / Reject */}
            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>Actions</h2>

                <textarea
                    className={styles.managerPage__textarea}
                    placeholder="Comment (required for rejection)"
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                />

                <div className={styles.managerPage__actionsRow}>
                    <button
                        type="button"
                        className={styles.managerPage__buttonPrimary}
                        onClick={approve}
                    >
                        Approve
                    </button>

                    <button
                        type="button"
                        className={styles.managerPage__buttonDanger}
                        onClick={reject}
                    >
                        Reject
                    </button>
                </div>
            </div>
        </section>
    )
}
