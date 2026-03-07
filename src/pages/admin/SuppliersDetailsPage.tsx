import { useParams } from 'react-router-dom'
import {
    suppliersMock,
    contractsMock,
    contractAllocationsMock,
} from '../manager/manager.mock'

import styles from '../manager/ManagerPages.module.scss'

export const SupplierDetailsPage = () => {
    const { id } = useParams()

    const supplier = suppliersMock.find((s) => s.id === id)

    if (!supplier) {
        return <p>Supplier not found</p>
    }

    // contracts belonging to this supplier
    const supplierContracts = contractsMock.filter(
        (c) => c.supplierId === supplier.id
    )

    return (
        <section className={styles.managerPage}>
            {/* HEADER */}
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        Supplier: {supplier.name}
                    </h1>
                    <p className={styles.managerPage__subtitle}>
                        Training supplier details & contract budgets
                    </p>
                </div>
            </header>

            {/* SUPPLIER INFO */}
            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>Supplier Info</h2>

                <div className={styles.managerPage__infoGrid}>
                    <div>
                        <p className={styles.managerPage__infoLabel}>Name</p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.name}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>BIN</p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.bin}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>
                            Contact Person
                        </p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.contactPerson}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Phone</p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.phone}
                        </p>
                    </div>

                    <div>
                        <p className={styles.managerPage__infoLabel}>Email</p>
                        <p className={styles.managerPage__infoValue}>
                            {supplier.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTRACT LIST */}
            <div className={styles.managerPage__infoBlock}>
                <h2 className={styles.managerPage__infoTitle}>
                    Contracts & Budget Usage
                </h2>

                <div className={styles.managerPage__tableWrap}>
                    <table className={styles.managerPage__table}>
                        <thead>
                            <tr>
                                <th>Contract #</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Limit</th>
                                <th>Used</th>
                                <th>Remaining</th>
                                <th>Progress</th>
                            </tr>
                        </thead>

                        <tbody>
                            {supplierContracts.map((contract) => {
                                const allocations = contractAllocationsMock.filter(
                                    (a) => a.contractId === contract.id
                                )

                                const allocated = allocations.reduce(
                                    (sum, a) => sum + a.amount,
                                    0
                                )

                                const remaining = contract.limit - allocated
                                const progress =
                                    (allocated / contract.limit) * 100

                                return (
                                    <tr key={contract.id}>
                                        <td>{contract.contractNumber}</td>
                                        <td>{contract.startDate}</td>
                                        <td>{contract.endDate}</td>
                                        <td>{contract.limit} ₸</td>
                                        <td>{allocated} ₸</td>
                                        <td>{remaining} ₸</td>
                                        <td>{progress.toFixed(1)}%</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
