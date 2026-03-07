import { useParams } from 'react-router-dom'

import {
    contractsMock,
    suppliersMock,
    contractAllocationsMock,
    requestsMock,
} from '../manager/manager.mock'

import styles from '../manager/ManagerPages.module.scss'

export const ContractDetailsPage = () => {
    const { id } = useParams()

    const contract = contractsMock.find((c) => c.id === id)

    if (!contract) {
        return <p>Contract not found</p>
    }

    const supplier = suppliersMock.find(
        (s) => s.id === contract.supplierId
    )

    const allocations = contractAllocationsMock.filter(
        (a) => a.contractId === contract.id
    )

    const used = allocations.reduce((sum, a) => sum + a.amount, 0)

    const remaining = contract.limit - used

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>
                        Contract {contract.contractNumber}
                    </h1>

                    <p className={styles.managerPage__subtitle}>
                        Supplier: {supplier?.name}
                    </p>
                </div>
            </header>

            <div className={styles.managerPage__content}>
                <div>
                    <p>
                        <strong>Start date:</strong> {contract.startDate}
                    </p>

                    <p>
                        <strong>End date:</strong> {contract.endDate}
                    </p>

                    <p>
                        <strong>Limit:</strong> {contract.limit} ₸
                    </p>

                    <p>
                        <strong>Used:</strong> {used} ₸
                    </p>

                    <p>
                        <strong>Remaining:</strong> {remaining} ₸
                    </p>
                </div>

                <h2 style={{ marginTop: 30 }}>Allocations</h2>

                <table className={styles.managerPage__table}>
                    <thead>
                        <tr>
                            <th>Request</th>
                            <th>Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {allocations.map((a) => {
                            const request = requestsMock.find(
                                (r) => r.id === a.requestId
                            )

                            return (
                                <tr key={a.id}>
                                    <td>{request?.id}</td>
                                    <td>{a.amount} ₸</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
