import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'

import { suppliersMock } from '../manager/manager.mock'
import styles from '../manager/ManagerPages.module.scss'

export const SuppliersPage = () => {
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')

    const filteredSuppliers = useMemo(() => {
        const query = searchValue.trim().toLowerCase()
        if (!query) return suppliersMock

        return suppliersMock.filter((sup) => {
            const combined = [
                sup.name,
                sup.bin,
                sup.contactPerson,
                sup.phone,
                sup.email,
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
                    <h1 className={styles.managerPage__title}>Suppliers</h1>
                    <p className={styles.managerPage__subtitle}>
                        All registered training suppliers
                    </p>
                </div>
            </header>

            <input
                className={styles.managerPage__searchInput}
                placeholder="Search suppliers..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />

            <div className={styles.managerPage__tableWrap}>
                <table className={styles.managerPage__table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>BIN</th>
                            <th>Contact Person</th>
                            <th>Phone</th>
                            <th>Email</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredSuppliers.map((sup) => (
                            <tr
                                key={sup.id}
                                className={styles.managerPage__tableRow}
                                onClick={() =>
                                    navigate(`/admin/suppliers/${sup.id}`)
                                }
                            >
                                <td>{sup.name}</td>
                                <td>{sup.bin}</td>
                                <td>{sup.contactPerson}</td>
                                <td>{sup.phone}</td>
                                <td>{sup.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
