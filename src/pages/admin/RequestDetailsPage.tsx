import { useParams, useNavigate } from 'react-router-dom'
import {
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

export const RequestDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const request = requestsMock.find((r) => r.id === id)

    if (!request) {
        return <p>Request not found</p>
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
        navigate('/admin/requests')
    }

    const reject = () => {
        alert(`Rejected request ${request.id} with comment: ${actionComment}`)
        navigate('/admin/requests')
    }

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        Request {request.id}
                    </h1>
                    <p className={styles.managerPage__subtitle}>
                        Review training request
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
                            {manager?.fullName}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            Department
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {manager?.department}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Status</p>
                        <p className={styles.managerPage__infoValue}>
                            {request.status}
                        </p>
                    </div>
                </div>
            </div>

            {/* Employees */}
            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>Employees</h2>

                <div className={styles.managerPage__list}>
                    {assignedEmployees.map((e) => (
                        <div key={e.id} className={styles.managerPage__listItem}>
                            {e.name}
                        </div>
                    ))}
                </div>
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
                        className={styles.managerPage__buttonPrimary}
                        onClick={approve}
                    >
                        Approve
                    </button>

                    <button
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
