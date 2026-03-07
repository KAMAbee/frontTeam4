import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import {
    contractsMock,
    suppliersMock,
    contractAllocationsMock,
} from '../manager/manager.mock'

import styles from '../manager/ManagerPages.module.scss'

export const ContractsPage = () => {
    const navigate = useNavigate()

    const [searchValue, setSearchValue] = useState('')

    const filteredContracts = useMemo(() => {
        const query = searchValue.trim().toLowerCase()
        if (!query) return contractsMock

        return contractsMock.filter((ctr) => {
            const supplier = suppliersMock.find(
                (s) => s.id === ctr.supplierId
            )

            const combined = [
                supplier?.name,
                ctr.contractNumber,
                ctr.startDate,
                ctr.endDate,
                String(ctr.limit),
            ]
                .join(' ')
                .toLowerCase()

            return combined.includes(query)
        })
    }, [searchValue])

    return (
        <section className={styles.managerPage}>
            <header className={styles.managerPage__header}>
                <div className={styles.managerPage__headerContent}>
                    <h1 className={styles.managerPage__title}>Contracts</h1>
                    <p className={styles.managerPage__subtitle}>
                        Supplier contracts and budget usage
                    </p>
                </div>
            </header>

            <input
                className={styles.managerPage__searchInput}
                placeholder="Search contracts..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />

            <div className={styles.managerPage__tableWrap}>
                <table className={styles.managerPage__table}>
                    <thead>
                        <tr>
                            <th>Supplier</th>
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
                        {filteredContracts.map((ctr) => {
                            const supplier = suppliersMock.find(
                                (s) => s.id === ctr.supplierId
                            )

                            const allocations = contractAllocationsMock.filter(
                                (a) => a.contractId === ctr.id
                            )

                            const used = allocations.reduce(
                                (sum, a) => sum + a.amount,
                                0
                            )

                            const remaining = ctr.limit - used
                            const progress = (used / ctr.limit) * 100

                            return (
                                <tr
                                    key={ctr.id}
                                    className={styles.managerPage__tableRow}
                                    onClick={() =>
                                        navigate(`/admin/contracts/${ctr.id}`)
                                    }
                                >
                                    <td>{supplier?.name}</td>
                                    <td>{ctr.contractNumber}</td>
                                    <td>{ctr.startDate}</td>
                                    <td>{ctr.endDate}</td>
                                    <td>{ctr.limit} ₸</td>
                                    <td>{used} ₸</td>
                                    <td>{remaining} ₸</td>
                                    <td>{progress.toFixed(1)}%</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
